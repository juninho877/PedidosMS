<?php
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Nenhum arquivo foi enviado ou erro no upload']);
    exit;
}

$file = $_FILES['file'];
$type = $_POST['type'] ?? '';
$tenant_id = $_POST['tenant_id'] ?? '';

// Validate inputs
if (empty($type) || !in_array($type, ['logo', 'favicon'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de arquivo inválido']);
    exit;
}

if (empty($tenant_id) || !is_numeric($tenant_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'ID do tenant inválido']);
    exit;
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if ($type === 'favicon') {
    $allowedTypes[] = 'image/x-icon';
    $allowedTypes[] = 'image/vnd.microsoft.icon';
}

if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de arquivo não suportado']);
    exit;
}

// Validate file size
$maxSize = $type === 'favicon' ? 1024 * 1024 : 2 * 1024 * 1024; // 1MB for favicon, 2MB for logo
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Arquivo muito grande. Máximo: ' . ($type === 'favicon' ? '1MB' : '2MB')]);
    exit;
}

try {
    // Create upload directory if it doesn't exist
    $uploadDir = '../assets/uploads/tenants/' . $tenant_id . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $type . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Generate public URL
        $publicUrl = '/assets/uploads/tenants/' . $tenant_id . '/' . $filename;
        
        echo json_encode([
            'success' => true,
            'url' => $publicUrl,
            'filename' => $filename
        ]);
    } else {
        throw new Exception('Erro ao mover arquivo para diretório de upload');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro no upload: ' . $e->getMessage()]);
}
?>