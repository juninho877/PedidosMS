<?php
// Teste específico para verificar se o mod_rewrite está funcionando
echo "<h1>Teste de Rewrite - Este arquivo NÃO deveria ser acessado diretamente!</h1>";
echo "<p>Se você está vendo esta mensagem acessando uma URL como /admin/login,</p>";
echo "<p>significa que o .htaccess NÃO está funcionando corretamente.</p>";
echo "<p>Data/Hora: " . date('Y-m-d H:i:s') . "</p>";
?>