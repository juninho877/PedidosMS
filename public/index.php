<?php

// Ponto de entrada da aplicação
require_once __DIR__ . '/../bootstrap/app.php';

try {
    // Criar e executar a aplicação
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $app->run();
} catch (Exception $e) {
    // Em produção, você pode querer logar o erro e mostrar uma página de erro amigável
    if (defined('DEBUG') && DEBUG) {
        echo '<pre>Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString() . '</pre>';
    } else {
        http_response_code(500);
        echo '<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erro Interno</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white min-h-screen flex items-center justify-center">
    <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Erro Interno do Servidor</h1>
        <p class="text-slate-400">Ocorreu um erro inesperado. Tente novamente mais tarde.</p>
    </div>
</body>
</html>';
    }
}