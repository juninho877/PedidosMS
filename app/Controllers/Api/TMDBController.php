<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Core\Request;
use App\Core\Response;
use App\Services\TMDBService;
use Exception;

class TMDBController extends BaseController
{
    private TMDBService $tmdbService;

    public function __construct()
    {
        $this->tmdbService = new TMDBService();
    }

    public function search(Request $request): Response
    {
        $query = $request->get('query');
        $type = $request->get('type', 'all');
        $year = $request->get('year');
        $page = (int) $request->get('page', 1);

        if (empty($query)) {
            return $this->error('Query parameter is required', 400);
        }

        try {
            switch ($type) {
                case 'movie':
                    $results = $this->tmdbService->searchMovies($query, $year, $page);
                    break;
                case 'tv':
                    $results = $this->tmdbService->searchTVShows($query, $year, $page);
                    break;
                default:
                    $results = $this->tmdbService->searchMulti($query, $year, $page);
                    break;
            }

            return $this->json($results);
        } catch (Exception $e) {
            return $this->error('Error searching content: ' . $e->getMessage(), 500);
        }
    }

    public function movieDetails(Request $request, string $id): Response
    {
        try {
            $details = $this->tmdbService->getMovieDetails((int) $id);
            return $this->json($details);
        } catch (Exception $e) {
            return $this->error('Error fetching movie details: ' . $e->getMessage(), 500);
        }
    }

    public function tvDetails(Request $request, string $id): Response
    {
        try {
            $details = $this->tmdbService->getTVDetails((int) $id);
            return $this->json($details);
        } catch (Exception $e) {
            return $this->error('Error fetching TV details: ' . $e->getMessage(), 500);
        }
    }
}