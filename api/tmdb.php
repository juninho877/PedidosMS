<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

$tmdbController = new TMDBController();

switch ($path) {
    case '/search':
        if ($method === 'GET') {
            $tmdbController->search();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        if (preg_match('/^\/(movie|tv)\/(\d+)$/', $path, $matches)) {
            $type = $matches[1];
            $id = $matches[2];
            
            if ($method === 'GET') {
                if ($type === 'movie') {
                    $tmdbController->getMovieDetails($id);
                } else {
                    $tmdbController->getTVDetails($id);
                }
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Método não permitido']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint não encontrado']);
        }
        break;
}
?>