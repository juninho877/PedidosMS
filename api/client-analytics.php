<?php
require_once '../config/config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

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

try {
    $database = new Database();
    $db = $database->getConnection();
    $tenantId = $clientData['tenant_id'];
    
    // Get analytics data
    $analytics = [
        'today' => getTodayRequests($db, $tenantId),
        'week' => getWeekRequests($db, $tenantId),
        'month' => getMonthRequests($db, $tenantId),
        'approval_rate' => getApprovalRate($db, $tenantId),
        'daily_requests' => getDailyRequests($db, $tenantId),
        'content_types' => getContentTypes($db, $tenantId)
    ];
    
    echo json_encode($analytics);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar analytics']);
}

function getTodayRequests($db, $tenantId) {
    $query = "SELECT COUNT(*) as count FROM requests 
              WHERE tenant_id = :tenant_id 
              AND DATE(created_at) = CURDATE()";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':tenant_id', $tenantId);
    $stmt->execute();
    
    $result = $stmt->fetch();
    return $result['count'] ?? 0;
}

function getWeekRequests($db, $tenantId) {
    $query = "SELECT COUNT(*) as count FROM requests 
              WHERE tenant_id = :tenant_id 
              AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':tenant_id', $tenantId);
    $stmt->execute();
    
    $result = $stmt->fetch();
    return $result['count'] ?? 0;
}

function getMonthRequests($db, $tenantId) {
    $query = "SELECT COUNT(*) as count FROM requests 
              WHERE tenant_id = :tenant_id 
              AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':tenant_id', $tenantId);
    $stmt->execute();
    
    $result = $stmt->fetch();
    return $result['count'] ?? 0;
}

function getApprovalRate($db, $tenantId) {
    $query = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
              FROM requests 
              WHERE tenant_id = :tenant_id 
              AND status IN ('approved', 'denied')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':tenant_id', $tenantId);
    $stmt->execute();
    
    $result = $stmt->fetch();
    $total = $result['total'] ?? 0;
    $approved = $result['approved'] ?? 0;
    
    return $total > 0 ? round(($approved / $total) * 100, 1) : 0;
}

function getDailyRequests($db, $tenantId) {
    $query = "SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
              FROM requests 
              WHERE tenant_id = :tenant_id 
              AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
              GROUP BY DATE(created_at)
              ORDER BY date ASC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':tenant_id', $tenantId);
    $stmt->execute();
    
    $results = $stmt->fetchAll();
    
    // Format dates for display
    return array_map(function($row) {
        return [
            'date' => date('d/m', strtotime($row['date'])),
            'count' => (int)$row['count']
        ];
    }, $results);
}

function getContentTypes($db, $tenantId) {
    $query = "SELECT 
                content_type,
                COUNT(*) as count
              FROM requests 
              WHERE tenant_id = :tenant_id
              GROUP BY content_type";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':tenant_id', $tenantId);
    $stmt->execute();
    
    $results = $stmt->fetchAll();
    
    $contentTypes = ['movies' => 0, 'tv' => 0];
    
    foreach ($results as $row) {
        if ($row['content_type'] === 'movie') {
            $contentTypes['movies'] = (int)$row['count'];
        } elseif ($row['content_type'] === 'tv') {
            $contentTypes['tv'] = (int)$row['count'];
        }
    }
    
    return $contentTypes;
}
?>