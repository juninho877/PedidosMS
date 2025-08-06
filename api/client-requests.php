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
        
    default:
        // Handle /api/client-requests/{id}
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
    $filters = [
        'tenant_id' => $client['id'],
        'status' => $_GET['status'] ?? '',
        'content_type' => $_GET['content_type'] ?? '',
        'search' => $_GET['search'] ?? '',
        'limit' => $_GET['limit'] ?? null,
        'offset' => $_GET['offset'] ?? null
    ];

    try {
        $requests = $request->getAll($filters);
        echo json_encode($requests);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar solicitações: ' . $e->getMessage()]);
    }
}

function getClientStats($request, $client) {
    try {
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) as denied,
                    SUM(CASE WHEN content_type = 'movie' THEN 1 ELSE 0 END) as movies,
                    SUM(CASE WHEN content_type = 'tv' THEN 1 ELSE 0 END) as tv
                  FROM requests 
                  WHERE tenant_id = :tenant_id";
        
        $stmt = $request->conn->prepare($query);
        $stmt->bindParam(':tenant_id', $client['id']);
        $stmt->execute();
        
        $stats = $stmt->fetch();
        echo json_encode($stats);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar estatísticas: ' . $e->getMessage()]);
    }
}

function getClientRequestById($request, $client, $id) {
    try {
        $requestData = $request->findById($id);
        if ($requestData) {
            // Verify that the request belongs to this client
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