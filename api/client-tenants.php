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

switch ($path) {
    case '':
    case '/':
        if ($method === 'GET') {
            getAllTenants($tenant, $client);
        } elseif ($method === 'POST') {
            createTenant($tenant, $client);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        // Handle /api/client-tenants/{id}
        if (preg_match('/^\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                getTenantById($tenant, $client, $id);
            } elseif ($method === 'PUT') {
                updateTenant($tenant, $client, $id);
            } elseif ($method === 'DELETE') {
                deleteTenant($tenant, $client, $id);
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

function getAllTenants($tenant, $client) {
    try {
        // Only return the current client's data
        if ($tenant->findById($client['id'])) {
            echo json_encode([$tenant->toArray()]);
        } else {
            echo json_encode([]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar dados: ' . $e->getMessage()]);
    }
}

function getTenantById($tenant, $client, $id) {
    try {
        // Verify that the client can only access their own data
        if ($id != $client['id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso negado']);
            return;
        }
        
        if ($tenant->findById($id)) {
            echo json_encode($tenant->toArray());
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente não encontrado']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar cliente: ' . $e->getMessage()]);
    }
}

function updateTenant($tenant, $client, $id) {
    try {
        // Verify that the client can only update their own data
        if ($id != $client['id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso negado']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido: ' . json_last_error_msg()]);
            return;
        }

        // Validate input data
        $errors = validateTenantData($input, $id);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            return;
        }

        // Load current tenant data
        if (!$tenant->findById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente não encontrado']);
            return;
        }

        // Update tenant
        if ($tenant->update($input)) {
            // Return updated data
            $tenant->findById($id);
            echo json_encode([
                'success' => true, 
                'message' => 'Cliente atualizado com sucesso',
                'data' => $tenant->toArray()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar cliente']);
        }

    } catch (Exception $e) {
        error_log("Error updating tenant: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro interno do servidor: ' . $e->getMessage()]);
    }
}

function createTenant($tenant, $client) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido: ' . json_last_error_msg()]);
            return;
        }

        // Validate input data
        $errors = validateTenantData($input);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            return;
        }

        if ($tenant->create($input)) {
            echo json_encode(['success' => true, 'message' => 'Cliente criado com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar cliente']);
        }

    } catch (Exception $e) {
        error_log("Error creating tenant: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro interno do servidor: ' . $e->getMessage()]);
    }
}

function deleteTenant($tenant, $client, $id) {
    try {
        // Verify that the client can only delete their own data (though this might not be allowed)
        if ($id != $client['id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso negado']);
            return;
        }

        if ($tenant->delete($id)) {
            echo json_encode(['success' => true, 'message' => 'Cliente removido com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao remover cliente']);
        }

    } catch (Exception $e) {
        error_log("Error deleting tenant: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Erro interno do servidor: ' . $e->getMessage()]);
    }
}

function validateTenantData($data, $excludeId = null) {
    $errors = [];

    // Required fields
    if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
        $errors['name'] = 'Nome da empresa deve ter pelo menos 2 caracteres';
    }

    if (empty($data['site_name']) || strlen(trim($data['site_name'])) < 2) {
        $errors['site_name'] = 'Nome do site deve ter pelo menos 2 caracteres';
    }

    // Optional fields validation
    if (!empty($data['contact_email']) && !filter_var($data['contact_email'], FILTER_VALIDATE_EMAIL)) {
        $errors['contact_email'] = 'Email de contato inválido';
    }

    if (!empty($data['contact_whatsapp']) && !preg_match('/^55\d{10,11}$/', $data['contact_whatsapp'])) {
        $errors['contact_whatsapp'] = 'WhatsApp deve estar no formato: 5511999999999';
    }

    // Color validation
    if (!empty($data['primary_color']) && !preg_match('/^#[0-9A-Fa-f]{6}$/', $data['primary_color'])) {
        $errors['primary_color'] = 'Cor primária deve estar no formato hexadecimal (#000000)';
    }

    if (!empty($data['secondary_color']) && !preg_match('/^#[0-9A-Fa-f]{6}$/', $data['secondary_color'])) {
        $errors['secondary_color'] = 'Cor secundária deve estar no formato hexadecimal (#000000)';
    }

    // Image URL validation
    if (!empty($data['logo_url']) && !isValidImagePath($data['logo_url'])) {
        $errors['logo_url'] = 'URL do logo inválida';
    }

    if (!empty($data['favicon_url']) && !isValidImagePath($data['favicon_url'])) {
        $errors['favicon_url'] = 'URL do favicon inválida';
    }

    return $errors;
}

function isValidImagePath($path) {
    // Empty path is valid (will use default)
    if (empty($path)) {
        return true;
    }
    
    // Accept full URLs (http/https)
    if (filter_var($path, FILTER_VALIDATE_URL)) {
        return true;
    }
    
    // Accept local paths starting with /assets/uploads/
    if (strpos($path, '/assets/uploads/') === 0) {
        return true;
    }
    
    // Accept local paths starting with /assets/images/
    if (strpos($path, '/assets/images/') === 0) {
        return true;
    }
    
    return false;
}
?>