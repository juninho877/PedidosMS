<?php
class TMDBService {
    private $api_key;
    private $base_url;
    private $image_base_url;

    public function __construct() {
        $this->api_key = TMDB_API_KEY;
        $this->base_url = TMDB_BASE_URL;
        $this->image_base_url = TMDB_IMAGE_BASE_URL;
    }

    private function makeRequest($endpoint) {
        $url = $this->base_url . $endpoint . (strpos($endpoint, '?') ? '&' : '?') . 'api_key=' . $this->api_key;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code !== 200) {
            throw new Exception('Erro na API do TMDB: ' . $http_code);
        }

        return json_decode($response, true);
    }

    public function searchMulti($query, $year = null, $page = 1) {
        $endpoint = '/search/multi?query=' . urlencode($query) . '&page=' . $page . '&language=pt-BR';
        return $this->makeRequest($endpoint);
    }

    public function searchMovies($query, $year = null, $page = 1) {
        $endpoint = '/search/movie?query=' . urlencode($query) . '&page=' . $page . '&language=pt-BR';
        if ($year) {
            $endpoint .= '&primary_release_year=' . $year;
        }
        return $this->makeRequest($endpoint);
    }

    public function searchTVShows($query, $year = null, $page = 1) {
        $endpoint = '/search/tv?query=' . urlencode($query) . '&page=' . $page . '&language=pt-BR';
        if ($year) {
            $endpoint .= '&first_air_date_year=' . $year;
        }
        return $this->makeRequest($endpoint);
    }

    public function getMovieDetails($id) {
        $endpoint = '/movie/' . $id . '?append_to_response=credits,videos&language=pt-BR';
        return $this->makeRequest($endpoint);
    }

    public function getTVDetails($id) {
        $endpoint = '/tv/' . $id . '?append_to_response=credits,videos&language=pt-BR';
        return $this->makeRequest($endpoint);
    }

    public function getImageUrl($path, $size = 'w300') {
        return $this->image_base_url . '/' . $size . $path;
    }

    public function getYouTubeEmbedUrl($key) {
        return 'https://www.youtube.com/embed/' . $key;
    }
}
?>