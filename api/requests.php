<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

$requestController = new RequestController();

switch ($path) {
    case '':
    case '/':
        if ($method === 'GET') {
            $requestController->getAll();
        } elseif ($method === 'POST') {
            $requestController->create();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/stats':
        if ($method === 'GET') {
            $requestController->getStats();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/update-status':
        if ($method === 'PUT') {
            $requestController->updateStatus();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        // Handle /api/requests/{id}
        if (preg_match('/^\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                $requestController->getById($id);
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