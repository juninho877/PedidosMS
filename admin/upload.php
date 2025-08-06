<?php
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

// Verificar se arquivo foi enviado
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $uploadError = $_FILES['file']['error'] ?? 'unknown';
    error_log("Upload error - No file or upload error. Code: $uploadError");
    echo json_encode(['error' => 'Nenhum arquivo foi enviado ou erro no upload. Código: ' . $uploadError]);
    exit;
}

$file = $_FILES['file'];
$type = $_POST['type'] ?? '';
$tenant_id = $_POST['tenant_id'] ?? '';

error_log("Upload attempt - Type: $type, Tenant ID: $tenant_id, File: " . $file['name']);

// Validar parâmetros
if (empty($type) || !in_array($type, ['logo', 'favicon'])) {
    error_log("Upload error - Invalid type: $type");
    echo json_encode(['error' => 'Tipo de arquivo inválido']);
    exit;
}

if (empty($tenant_id) || !is_numeric($tenant_id)) {
    error_log("Upload error - Invalid tenant_id: $tenant_id");
    echo json_encode(['error' => 'ID do tenant inválido']);
    exit;
}

// Validar arquivo
$maxSize = $type === 'logo' ? 2 * 1024 * 1024 : 1 * 1024 * 1024; // 2MB para logo, 1MB para favicon
if ($file['size'] > $maxSize) {
    $maxSizeMB = $type === 'logo' ? '2MB' : '1MB';
    error_log("Upload error - File too large: " . $file['size'] . " bytes (max: $maxSize)");
    echo json_encode(['error' => "Arquivo muito grande. Máximo $maxSizeMB."]);
    exit;
}

$allowedTypes = $type === 'logo' ? 
    ['image/jpeg', 'image/png', 'image/gif'] : 
    ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png'];

if (!in_array($file['type'], $allowedTypes)) {
    error_log("Upload error - Invalid file type: " . $file['type']);
    echo json_encode(['error' => 'Tipo de arquivo não permitido']);
    exit;
}

try {
    // Criar diretório se não existir
    $uploadDir = '../assets/uploads/tenants/' . $tenant_id;
    error_log("Creating upload directory: $uploadDir");
    
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Erro ao criar diretório de upload');
        }
    }

    // Gerar nome único para o arquivo
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = $type . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . '/' . $filename;
    
    error_log("Attempting to move file to: $filepath");

    // Mover arquivo
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // URL pública do arquivo
        $publicUrl = '/assets/uploads/tenants/' . $tenant_id . '/' . $filename;
        
        error_log("Upload successful: $publicUrl");
        
        echo json_encode([
            'success' => true,
            'url' => $publicUrl,
            'filename' => $filename
        ]);
    } else {
        throw new Exception('Erro ao mover arquivo para destino');
    }

} catch (Exception $e) {
    error_log("Upload error: " . $e->getMessage());
    echo json_encode(['error' => 'Erro no upload: ' . $e->getMessage()]);
}
?>