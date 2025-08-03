<?php
class TMDBController {
    private $tmdbService;

    public function __construct() {
        $this->tmdbService = new TMDBService();
    }

    public function search() {
        $query = $_GET['query'] ?? '';
        $type = $_GET['type'] ?? 'all';
        $year = $_GET['year'] ?? null;
        $page = $_GET['page'] ?? 1;

        if (empty($query)) {
            http_response_code(400);
            echo json_encode(['error' => 'Query é obrigatória']);
            return;
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

            echo json_encode($results);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar conteúdo: ' . $e->getMessage()]);
        }
    }

    public function getMovieDetails($id) {
        try {
            $details = $this->tmdbService->getMovieDetails($id);
            echo json_encode($details);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar detalhes do filme: ' . $e->getMessage()]);
        }
    }

    public function getTVDetails($id) {
        try {
            $details = $this->tmdbService->getTVDetails($id);
            echo json_encode($details);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar detalhes da série: ' . $e->getMessage()]);
        }
    }
}
?>