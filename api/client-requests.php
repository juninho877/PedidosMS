<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '';

// Require client authentication
$authService = new AuthService();
$clientData = null;

if (isset($_COOKIE['client_auth_token'])) {
    $clientData = $authService->validateClientToken($_COOKIE['client_auth_token']);
}

if (!$clientData) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

$database = new Database();
$db = $database->getConnection();
$request = new Request($db);

switch ($path) {
    case '':
    case '/':
        if ($method === 'GET') {
            getClientRequests($request, $clientData);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
        break;
        
    case '/stats':
        if ($method === 'GET') {
            getClientStats($request, $clientData);
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

function getClientRequests($request, $clientData) {
    $filters = [
        'tenant_id' => $clientData['tenant_id'],
        'status' => $_GET['status'] ?? '',
        'content_type' => $_GET['content_type'] ?? '',
        'limit' => $_GET['limit'] ?? null,
        'offset' => $_GET['offset'] ?? null
    ];

    try {
        $requests = $request->getAll($filters);
        echo json_encode($requests);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar solicitações']);
    }
}

function getClientStats($request, $clientData) {
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
        $stmt->bindParam(':tenant_id', $clientData['tenant_id']);
        $stmt->execute();
        
        $stats = $stmt->fetch();
        echo json_encode($stats);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao buscar estatísticas']);
    }
}
?>