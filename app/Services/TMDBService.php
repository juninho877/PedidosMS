<?php

namespace App\Services;

use App\Core\Config;
use Exception;

class TMDBService
{
    private string $apiKey;
    private string $baseUrl;
    private string $imageBaseUrl;

    public function __construct()
    {
        $this->apiKey = Config::get('tmdb.api_key');
        $this->baseUrl = Config::get('tmdb.base_url', 'https://api.themoviedb.org/3');
        $this->imageBaseUrl = Config::get('tmdb.image_base_url', 'https://image.tmdb.org/t/p');
    }

    public function searchMovies(string $query, ?string $year = null, int $page = 1): array
    {
        $params = [
            'query' => $query,
            'page' => $page,
            'language' => 'pt-BR'
        ];
        
        if ($year) {
            $params['year'] = $year;
        }
        
        return $this->makeRequest('/search/movie', $params);
    }

    public function searchTVShows(string $query, ?string $year = null, int $page = 1): array
    {
        $params = [
            'query' => $query,
            'page' => $page,
            'language' => 'pt-BR'
        ];
        
        if ($year) {
            $params['first_air_date_year'] = $year;
        }
        
        return $this->makeRequest('/search/tv', $params);
    }

    public function searchMulti(string $query, ?string $year = null, int $page = 1): array
    {
        $params = [
            'query' => $query,
            'page' => $page,
            'language' => 'pt-BR'
        ];
        
        $results = $this->makeRequest('/search/multi', $params);
        
        // Filter by year if provided
        if ($year && isset($results['results'])) {
            $filteredResults = [];
            foreach ($results['results'] as $item) {
                $itemYear = null;
                
                if ($item['media_type'] === 'movie' && !empty($item['release_date'])) {
                    $itemYear = date('Y', strtotime($item['release_date']));
                } elseif ($item['media_type'] === 'tv' && !empty($item['first_air_date'])) {
                    $itemYear = date('Y', strtotime($item['first_air_date']));
                }
                
                if ($itemYear && $itemYear == $year) {
                    $filteredResults[] = $item;
                }
            }
            
            $results['results'] = $filteredResults;
            $results['total_results'] = count($filteredResults);
        }
        
        return $results;
    }

    public function getMovieDetails(int $id): array
    {
        $params = [
            'language' => 'pt-BR',
            'append_to_response' => 'credits,videos'
        ];
        
        return $this->makeRequest("/movie/{$id}", $params);
    }

    public function getTVDetails(int $id): array
    {
        $params = [
            'language' => 'pt-BR',
            'append_to_response' => 'credits,videos'
        ];
        
        return $this->makeRequest("/tv/{$id}", $params);
    }

    private function makeRequest(string $endpoint, array $params = []): array
    {
        $url = $this->baseUrl . $endpoint;
        
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];
        
        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            throw new Exception("CURL Error: {$error}");
        }
        
        if ($httpCode !== 200) {
            throw new Exception("TMDB API Error: HTTP {$httpCode}");
        }
        
        $data = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON response from TMDB API");
        }
        
        return $data;
    }

    public function getImageUrl(string $path, string $size = 'w500'): string
    {
        return $this->imageBaseUrl . '/' . $size . $path;
    }
}