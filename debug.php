<?php
// Arquivo de debug para testar se o PHP está funcionando
echo "<h1>Debug PHP - Funcionando!</h1>";
echo "<p>Data/Hora: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>Versão PHP: " . phpversion() . "</p>";
echo "<p>Servidor: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'N/A') . "</p>";
echo "<p>Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "</p>";
echo "<p>Script Name: " . ($_SERVER['SCRIPT_NAME'] ?? 'N/A') . "</p>";
echo "<p>Request URI: " . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "</p>";

echo "<h2>Arquivos no diretório atual:</h2>";
$files = scandir(__DIR__);
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        echo "<p>- $file</p>";
    }
}

echo "<h2>Teste de .htaccess</h2>";
if (file_exists('.htaccess')) {
    echo "<p>✅ Arquivo .htaccess existe</p>";
    echo "<pre>" . htmlspecialchars(file_get_contents('.htaccess')) . "</pre>";
} else {
    echo "<p>❌ Arquivo .htaccess NÃO existe</p>";
}
?>