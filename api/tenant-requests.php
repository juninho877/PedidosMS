<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validar tenant
    $tenantMiddleware = new TenantMiddleware();
    if (!$tenantMiddleware->identifyTenant($input['tenant_slug'] ?? '')) {
        http_response_code(404);
        echo json_encode(['error' => 'Cliente não encontrado']);
        exit;
    }
    
    $tenant = $tenantMiddleware->getCurrentTenant();
    
    // Criar solicitação
    $database = new Database();
    $db = $database->getConnection();
    $request = new Request($db);
    
    // Validação dos dados
    $errors = validateTenantRequestData($input);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        exit;
    }

    $request->tenant_id = $tenant->id;
    $request->content_id = $input['content_id'];
    $request->content_type = $input['content_type'];
    $request->content_title = $input['content_title'];
    $request->requester_name = $input['requester_name'];
    $request->requester_whatsapp = $input['requester_whatsapp'];
    $request->season = $input['season'] ?? null;
    $request->episode = $input['episode'] ?? null;
    $request->poster_path = $input['poster_path'] ?? null;

    if ($request->create()) {
        echo json_encode(['success' => true, 'message' => 'Solicitação criada com sucesso']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao criar solicitação']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}

function validateTenantRequestData($data) {
    $errors = [];

    if (empty($data['tenant_slug'])) {
        $errors['tenant_slug'] = 'Cliente é obrigatório';
    }

    if (empty($data['content_id'])) {
        $errors['content_id'] = 'ID do conteúdo é obrigatório';
    }

    if (empty($data['content_type']) || !in_array($data['content_type'], ['movie', 'tv'])) {
        $errors['content_type'] = 'Tipo de conteúdo inválido';
    }

    if (empty($data['content_title'])) {
        $errors['content_title'] = 'Título do conteúdo é obrigatório';
    }

    if (empty($data['requester_name']) || strlen($data['requester_name']) < 2) {
        $errors['requester_name'] = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (empty($data['requester_whatsapp']) || !preg_match('/^55\d{10,11}$/', $data['requester_whatsapp'])) {
        $errors['requester_whatsapp'] = 'WhatsApp deve estar no formato: 5511999999999';
    }

    return $errors;
}
?>