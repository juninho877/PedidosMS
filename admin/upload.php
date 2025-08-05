<?php
require_once '../config/config.php';

$middleware = new AuthMiddleware();
$user = $middleware->requireAuth();

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    try {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Erro no upload do arquivo');
        }
        
        $file = $_FILES['file'];
        $type = $_POST['type'] ?? 'logo'; // logo or favicon
        $tenantId = $_POST['tenant_id'] ?? null;
        
        // Validate file type
        $allowedTypes = [
            'logo' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            'favicon' => ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/gif']
        ];
        
        if (!in_array($file['type'], $allowedTypes[$type])) {
            throw new Exception('Tipo de arquivo não permitido');
        }
        
        // Validate file size (2MB max)
        if ($file['size'] > 2 * 1024 * 1024) {
            throw new Exception('Arquivo muito grande. Máximo 2MB');
        }
        
        // Create upload directory if it doesn't exist
        $uploadDir = '../assets/uploads/tenants/';
        if ($tenantId) {
            $uploadDir .= $tenantId . '/';
        }
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $type . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Erro ao salvar arquivo');
        }
        
        // Return the URL
        $url = '/assets/uploads/tenants/';
        if ($tenantId) {
            $url .= $tenantId . '/';
        }
        $url .= $filename;
        
        echo json_encode([
            'success' => true,
            'url' => $url,
            'filename' => $filename
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload de Arquivos - <?php echo SITE_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-slate-900 text-white">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full">
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h1 class="text-xl font-semibold text-white mb-6">Upload de Arquivo</h1>
                
                <form id="uploadForm" enctype="multipart/form-data" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Tipo de Arquivo
                        </label>
                        <select
                            id="fileType"
                            name="type"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="logo">Logo</option>
                            <option value="favicon">Favicon</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            ID do Cliente (opcional)
                        </label>
                        <input
                            type="number"
                            id="tenantId"
                            name="tenant_id"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Deixe vazio para upload geral"
                        />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Arquivo
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            name="file"
                            accept="image/*"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        id="uploadBtn"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        Fazer Upload
                    </button>
                </form>
                
                <div id="result" class="mt-4 hidden">
                    <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <p class="text-green-400 font-medium mb-2">Upload realizado com sucesso!</p>
                        <p class="text-sm text-slate-300">URL: <span id="fileUrl" class="text-blue-400"></span></p>
                        <button
                            onclick="copyToClipboard()"
                            class="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                        >
                            Copiar URL
                        </button>
                    </div>
                </div>
                
                <div id="error" class="mt-4 hidden">
                    <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p class="text-red-400 font-medium" id="errorMessage"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const uploadBtn = document.getElementById('uploadBtn');
            const result = document.getElementById('result');
            const error = document.getElementById('error');
            
            // Hide previous results
            result.classList.add('hidden');
            error.classList.add('hidden');
            
            // Show loading
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Enviando...';
            
            try {
                const formData = new FormData(e.target);
                
                const response = await fetch('/admin/upload.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Erro no upload');
                }
                
                // Show success
                document.getElementById('fileUrl').textContent = data.url;
                result.classList.remove('hidden');
                
                // Reset form
                e.target.reset();
                
            } catch (err) {
                // Show error
                document.getElementById('errorMessage').textContent = err.message;
                error.classList.remove('hidden');
            } finally {
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Fazer Upload';
            }
        });
        
        function copyToClipboard() {
            const url = document.getElementById('fileUrl').textContent;
            navigator.clipboard.writeText(window.location.origin + url).then(() => {
                alert('URL copiada para a área de transferência!');
            });
        }
        
        lucide.createIcons();
    </script>
</body>
</html>