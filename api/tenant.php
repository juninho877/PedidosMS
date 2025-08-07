<?php
// Prevent any output before JSON
ob_start();

require_once '../config/config.php';

// Clean any previous output
ob_clean();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

try {
    $tenantController = new TenantController();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro de inicialização do servidor']);
    exit;
}

switch ($path) {
    case '/login':
        if ($method === 'POST') {
            $tenantController->login();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/logout':
        if ($method === 'POST') {
            $tenantController->logout();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/me':
        if ($method === 'GET') {
            $tenantController->me();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;

    case '/update':
        if ($method === 'PUT') {
            $tenantController->update();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        // Handle /api/tenant/{slug}
        if (preg_match('/^\/(.+)$/', $path, $matches)) {
            $slug = $matches[1];
            if ($method === 'GET') {
                $tenantController->getBySlug($slug);
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