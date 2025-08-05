<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

// Require client authentication
$middleware = new ClientAuthMiddleware();
$client = $middleware->requireClientAuth();

$database = new Database();
$db = $database->getConnection();
$tenant = new Tenant($db);

// Handle /api/client-tenants/{id}
if (preg_match('/^\/(\d+)$/', $path, $matches)) {
    $id = $matches[1];
    
    // Verify that the client can only update their own tenant
    if ($id != $client['id']) {
        http_response_code(403);
        echo json_encode(['error' => 'Acesso negado']);
        exit;
    }
    
    if ($method === 'PUT') {
        updateClientTenant($tenant, $id);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint não encontrado']);
}

function updateClientTenant($tenant, $id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $errors = validateClientTenantData($input);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        return;
    }
    
    try {
        // Set the tenant ID for update
        $tenant->id = $id;
        
        if ($tenant->update($input)) {
            echo json_encode(['success' => true, 'message' => 'Configurações atualizadas com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar configurações']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar configurações: ' . $e->getMessage()]);
    }
}

function validateClientTenantData($data) {
    $errors = [];
    
    if (empty($data['name']) || strlen($data['name']) < 2) {
        $errors['name'] = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!empty($data['logo_url']) && !filter_var($data['logo_url'], FILTER_VALIDATE_URL)) {
        $errors['logo_url'] = 'URL do logo inválida';
    }
    
    if (!empty($data['primary_color']) && !preg_match('/^#[0-9A-Fa-f]{6}$/', $data['primary_color'])) {
        $errors['primary_color'] = 'Cor primária deve estar no formato hexadecimal (#RRGGBB)';
    }
    
    if (!empty($data['secondary_color']) && !preg_match('/^#[0-9A-Fa-f]{6}$/', $data['secondary_color'])) {
        $errors['secondary_color'] = 'Cor secundária deve estar no formato hexadecimal (#RRGGBB)';
    }
    
    return $errors;
}
?>