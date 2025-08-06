<?php
error_log("TMDBController.php: Arquivo sendo carregado");

class TMDBController {
    private $tmdbService;

    public function __construct() {
        if (!class_exists('TMDBService')) {
            throw new Exception("TMDBService class not available");
        }
        
        $this->tmdbService = new TMDBService();
        error_log("TMDBController: Inicializado com sucesso");
    }

    public function search() {
        error_log("TMDBController: search() chamado");
        
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
                    $results = $this->tmdbService->searchMulti($query, null, $page);
                    
                    // Filtrar por ano no lado do servidor se especificado
                    if ($year && isset($results['results'])) {
                        $filteredResults = [];
                        foreach ($results['results'] as $item) {
                            $itemYear = null;
                            
                            // Obter o ano baseado no tipo de mídia
                            if ($item['media_type'] === 'movie' && !empty($item['release_date'])) {
                                $itemYear = date('Y', strtotime($item['release_date']));
                            } elseif ($item['media_type'] === 'tv' && !empty($item['first_air_date'])) {
                                $itemYear = date('Y', strtotime($item['first_air_date']));
                            }
                            
                            // Incluir apenas se o ano corresponder
                            if ($itemYear && $itemYear == $year) {
                                $filteredResults[] = $item;
                            }
                        }
                        
                        // Substituir os resultados pelos filtrados
                        $results['results'] = $filteredResults;
                        $results['total_results'] = count($filteredResults);
                    }
                    break;
            }

            echo json_encode($results);
        } catch (Exception $e) {
            error_log("TMDBController: Erro na busca - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar conteúdo: ' . $e->getMessage()]);
        }
    }

    public function getMovieDetails($id) {
        error_log("TMDBController: getMovieDetails() chamado para ID: $id");
        
        try {
            $details = $this->tmdbService->getMovieDetails($id);
            echo json_encode($details);
        } catch (Exception $e) {
            error_log("TMDBController: Erro ao buscar filme - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar detalhes do filme: ' . $e->getMessage()]);
        }
    }

    public function getTVDetails($id) {
        error_log("TMDBController: getTVDetails() chamado para ID: $id");
        
        try {
            $details = $this->tmdbService->getTVDetails($id);
            echo json_encode($details);
        } catch (Exception $e) {
            error_log("TMDBController: Erro ao buscar série - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar detalhes da série: ' . $e->getMessage()]);
        }
    }
}

error_log("TMDBController.php: Classe TMDBController definida com sucesso");
?>