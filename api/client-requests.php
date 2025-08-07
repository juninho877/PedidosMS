<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

$middleware = new ClientAuthMiddleware();
$client = $middleware->requireClientAuth();

$database = new Database();
$db = $database->getConnection();
$request = new Request($db);

switch ($path) {
    case '':
    case '/':
        if ($method === 'GET') {
            getAllClientRequests($request, $client);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/stats':
        if ($method === 'GET') {
            getClientStats($request, $client);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/update-status':
        if ($method === 'PUT') {
            updateClientRequestStatus($request, $client);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    default:
        if (preg_match('/^\/(\d+)$/', $path, $matches)) {
            $id = $matches[1];
            if ($method === 'GET') {
                getClientRequestById($request, $client, $id);
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

function getAllClientRequests($request, $client) {
    try {
        $filters = [
            'tenant_id' => $client['id'],
            'status' => $_GET['status'] ?? '',
            'content_type' => $_GET['content_type'] ?? '',
            'search' => $_GET['search'] ?? '',
            'limit' => $_GET['limit'] ?? null,
            'offset' => $_GET['offset'] ?? null
        ];

        $requests = $request->getAll($filters);
        echo json_encode($requests);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar solicitações: ' . $e->getMessage()]);
    }
}

function getClientStats($request, $client) {
    try {
        $stats = $request->getStats($client['id']);
        echo json_encode($stats);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar estatísticas: ' . $e->getMessage()]);
    }
}

function updateClientRequestStatus($request, $client) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            return;
        }

        $id = $input['id'] ?? '';
        $status = $input['status'] ?? '';

        if (empty($id) || empty($status)) {
            http_response_code(400);
            echo json_encode(['error' => 'ID e status são obrigatórios']);
            return;
        }

        if (!in_array($status, ['pending', 'approved', 'denied'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Status inválido']);
            return;
        }

        if ($request->updateStatus($id, $status, $client['id'])) {
            echo json_encode(['success' => true, 'message' => 'Status atualizado com sucesso']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Solicitação não encontrada ou não autorizada']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao atualizar status: ' . $e->getMessage()]);
    }
}

function getClientRequestById($request, $client, $id) {
    try {
        $requestData = $request->findById($id);
        if ($requestData) {
            if ($requestData['tenant_id'] != $client['id']) {
                http_response_code(403);
                echo json_encode(['error' => 'Acesso negado']);
                return;
            }
            
            echo json_encode($requestData);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Solicitação não encontrada']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar solicitação: ' . $e->getMessage()]);
    }
}
?>