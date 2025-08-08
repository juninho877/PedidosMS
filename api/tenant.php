<?php
require_once '../config/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

try {
    $tenantController = new TenantController();
} catch (Exception $e) {
    error_log("TenantController initialization error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erro de inicialização do servidor']);
    exit;
}

try {
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
        if ($method === 'POST') {
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