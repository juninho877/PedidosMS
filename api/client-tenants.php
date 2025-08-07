<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

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
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        if (preg_match('/^\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                getTenantById($tenant, $client, $id);
            } elseif ($method === 'PUT') {
                updateTenant($tenant, $client, $id);
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

        if (!$tenant->findById($id)) {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente não encontrado']);
            return;
        }

        if ($tenant->update($input)) {
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
        http_response_code(500);
        echo json_encode(['error' => 'Erro interno do servidor: ' . $e->getMessage()]);
    }
}
?>