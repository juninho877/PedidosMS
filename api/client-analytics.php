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
$middleware = new ClientAuthMiddleware();
$client = $middleware->requireClientAuth();

$database = new Database();
$db = $database->getConnection();

try {
    // Get daily requests for the last 30 days
    $dailyQuery = "SELECT 
                     DATE(created_at) as date,
                     COUNT(*) as count
                   FROM requests 
                   WHERE tenant_id = :tenant_id 
                     AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                   GROUP BY DATE(created_at)
                   ORDER BY date ASC";
    
    $stmt = $db->prepare($dailyQuery);
    $stmt->bindParam(':tenant_id', $client['id']);
    $stmt->execute();
    $dailyRequests = $stmt->fetchAll();

    // Get approval rate
    $approvalQuery = "SELECT 
                        COUNT(*) as total,
                        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
                      FROM requests 
                      WHERE tenant_id = :tenant_id";
    
    $stmt = $db->prepare($approvalQuery);
    $stmt->bindParam(':tenant_id', $client['id']);
    $stmt->execute();
    $approvalData = $stmt->fetch();
    
    $approvalRate = $approvalData['total'] > 0 ? 
        round(($approvalData['approved'] / $approvalData['total']) * 100, 1) : 0;

    // Get daily average
    $dailyAverage = $approvalData['total'] > 0 ? 
        round($approvalData['total'] / 30, 1) : 0;

    // Get most requested type
    $typeQuery = "SELECT 
                    content_type,
                    COUNT(*) as count
                  FROM requests 
                  WHERE tenant_id = :tenant_id
                  GROUP BY content_type
                  ORDER BY count DESC
                  LIMIT 1";
    
    $stmt = $db->prepare($typeQuery);
    $stmt->bindParam(':tenant_id', $client['id']);
    $stmt->execute();
    $typeData = $stmt->fetch();
    
    $mostRequestedType = $typeData ? 
        ($typeData['content_type'] === 'movie' ? 'Filmes' : 'Séries') : 'N/A';

    echo json_encode([
        'daily_requests' => $dailyRequests,
        'approval_rate' => $approvalRate,
        'daily_average' => $dailyAverage,
        'most_requested_type' => $mostRequestedType
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao buscar analytics: ' . $e->getMessage()]);
}
?>