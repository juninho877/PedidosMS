<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

// Require authentication for all tenant operations
$middleware = new AuthMiddleware();
$middleware->requireAuth();

$database = new Database();
$db = $database->getConnection();
$tenant = new Tenant($db);

switch ($path) {
    case '':
    case '/':
        if ($method === 'GET') {
            getAllTenants($tenant);
        } elseif ($method === 'POST') {
            createTenant($tenant);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        // Handle /api/tenants/{id}
        if (preg_match('/^\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                getTenantById($tenant, $id);
            } elseif ($method === 'PUT') {
                updateTenant($tenant, $id);
            } elseif ($method === 'DELETE') {
                deleteTenant($tenant, $id);
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

function getAllTenants($tenant) {
    try {
        $tenants = $tenant->getAll();
        echo json_encode($tenants);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar clientes: ' . $e->getMessage()]);
    }
}

function createTenant($tenant) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    $errors = validateTenantData($input);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        return;
    }
    
    // Check if slug already exists
    if ($tenant->slugExists($input['slug'])) {
        http_response_code(400);
        echo json_encode(['errors' => ['slug' => 'Este slug já está em uso']]);
        return;
    }
    
    try {
        if ($tenant->create($input)) {
            echo json_encode(['success' => true, 'message' => 'Cliente criado com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar cliente']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao criar cliente: ' . $e->getMessage()]);
    }
}

function getTenantById($tenant, $id) {
    try {
        $tenantData = $tenant->findById($id);
        
        if ($tenantData) {
            echo json_encode($tenantData);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente não encontrado']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar cliente: ' . $e->getMessage()]);
    }
}

function updateTenant($tenant, $id) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input (excluding slug for updates)
    $errors = validateTenantData($input, true);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        return;
    }
    
    try {
        // Set the tenant ID for update
        $tenant->id = $id;
        
        if ($tenant->update($input)) {
            echo json_encode(['success' => true, 'message' => 'Cliente atualizado com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar cliente']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar cliente: ' . $e->getMessage()]);
    }
}

function deleteTenant($tenant, $id) {
    try {
        if ($tenant->delete($id)) {
            echo json_encode(['success' => true, 'message' => 'Cliente excluído com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao excluir cliente']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao excluir cliente: ' . $e->getMessage()]);
    }
}

function validateTenantData($data, $isUpdate = false) {
    $errors = [];
    
    if (empty($data['name']) || strlen($data['name']) < 2) {
        $errors['name'] = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!$isUpdate) {
        if (empty($data['slug']) || !preg_match('/^[a-zA-Z0-9\-]+$/', $data['slug'])) {
            $errors['slug'] = 'Slug deve conter apenas letras, números e hífen';
        }
        if (!empty($data['slug']) && strlen($data['slug']) < 2) {
            $errors['slug'] = 'Slug deve ter pelo menos 2 caracteres';
        }
    }
    
    if (!empty($data['logo_url']) && !filter_var($data['logo_url'], FILTER_VALIDATE_URL)) {
        $errors['logo_url'] = 'URL do logo inválida';
    }
    
    if (!empty($data['favicon_url']) && !filter_var($data['favicon_url'], FILTER_VALIDATE_URL)) {
        $errors['favicon_url'] = 'URL do favicon inválida';
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