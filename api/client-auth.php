<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

switch ($path) {
    case '/login':
        if ($method === 'POST') {
            handleClientLogin();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/logout':
        if ($method === 'POST') {
            handleClientLogout();
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint não encontrado']);
        break;
}

function handleClientLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $slug = $input['slug'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($slug) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Slug e senha são obrigatórios']);
        return;
    }

    try {
        $database = new Database();
        $db = $database->getConnection();
        $tenant = new Tenant($db);

        // Find tenant by slug
        if (!$tenant->findBySlug($slug)) {
            http_response_code(401);
            echo json_encode(['error' => 'Cliente não encontrado']);
            return;
        }

        // For now, we'll use a simple password check
        // In production, you should store hashed passwords for each tenant
        $defaultPassword = 'cliente123'; // You can make this configurable per tenant
        
        if ($password !== $defaultPassword) {
            http_response_code(401);
            echo json_encode(['error' => 'Senha incorreta']);
            return;
        }

        // Generate client token
        $authService = new AuthService();
        $clientData = [
            'tenant_id' => $tenant->id,
            'tenant_slug' => $tenant->slug,
            'tenant_name' => $tenant->name,
            'type' => 'client'
        ];

        $token = $authService->generateClientToken($clientData);
        $authService->setClientAuthCookie($token);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'tenant' => $clientData
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro interno do servidor']);
    }
}

function handleClientLogout() {
    $authService = new AuthService();
    $authService->clearClientAuthCookie();
    echo json_encode(['success' => true]);
}
?>