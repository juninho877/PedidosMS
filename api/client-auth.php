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
        
    case '/me':
        if ($method === 'GET') {
            handleClientMe();
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
    
    $slug = trim($input['slug'] ?? '');
    $password = $input['password'] ?? '';

    if (empty($slug) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Slug e senha são obrigatórios']);
        return;
    }

    $database = new Database();
    $db = $database->getConnection();
    $tenant = new Tenant($db);

    if ($tenant->login($slug, $password)) {
        $authService = new AuthService();
        
        // Include all tenant data in the token
        $client_data = [
            'id' => $tenant->id,
            'slug' => $tenant->slug,
            'name' => $tenant->name,
            'site_name' => $tenant->site_name,
            'site_tagline' => $tenant->site_tagline,
            'site_description' => $tenant->site_description,
            'hero_title' => $tenant->hero_title,
            'hero_subtitle' => $tenant->hero_subtitle,
            'hero_description' => $tenant->hero_description,
            'contact_email' => $tenant->contact_email,
            'contact_whatsapp' => $tenant->contact_whatsapp,
            'logo_url' => $tenant->logo_url,
            'favicon_url' => $tenant->favicon_url,
            'primary_color' => $tenant->primary_color,
            'secondary_color' => $tenant->secondary_color
        ];

        $token = $authService->generateClientToken($client_data);
        $authService->setClientAuthCookie($token);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'client' => $client_data
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciais inválidas']);
    }
}

function handleClientLogout() {
    $authService = new AuthService();
    $authService->clearClientAuthCookie();
    echo json_encode(['success' => true]);
}

function handleClientMe() {
    $authService = new AuthService();
    $client = $authService->getCurrentClient();
    
    if ($client) {
        echo json_encode(['client' => $client]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
    }
}
?>