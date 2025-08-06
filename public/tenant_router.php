<?php
require_once '../config/config.php';

// Log de depuração
error_log("TENANT_ROUTER: Iniciando roteamento para URI: " . $_SERVER['REQUEST_URI']);

// Extrair o slug do tenant e o caminho da URL (sem query string)
$request_uri = $_SERVER['REQUEST_URI'];

// Remover query string da URI para parsing correto
$uri_without_query = parse_url($request_uri, PHP_URL_PATH);

$path_parts = explode('/', trim($request_uri, '/'));

// Primeiro segmento é o slug do tenant
$tenant_slug = $path_parts[0] ?? '';

error_log("TENANT_ROUTER: Slug extraído: " . $tenant_slug);

// Resto do caminho (sem query string)
$route = $path_parts[1] ?? '';
$additional_params = array_slice($path_parts, 2);

error_log("TENANT_ROUTER: Rota extraída: " . $route);

// Inicializar middleware do tenant
$tenantMiddleware = new TenantMiddleware();
$tenant = $tenantMiddleware->requireTenant($tenant_slug);

error_log("TENANT_ROUTER: Tenant encontrado: " . ($tenant ? 'SIM' : 'NÃO'));

// Definir rotas disponíveis para tenants
$routes = [
    '' => 'home.php',           // Página inicial
    'home' => 'home.php',       // Página inicial alternativa
    'search' => 'search.php',   // Página de pesquisa
    'details' => 'details.php', // Página de detalhes
];

// Verificar se a rota existe
if (!array_key_exists($route, $routes)) {
    error_log("TENANT_ROUTER: Rota não encontrada: " . $route . " - Rotas disponíveis: " . implode(', ', array_keys($routes)));
    http_response_code(404);
    include '404.php';
    exit;
}

// Incluir o arquivo da rota
$file_path = $routes[$route];
if (file_exists($file_path)) {
    error_log("TENANT_ROUTER: Incluindo arquivo: " . $file_path);
    include $file_path;
} else {
    error_log("TENANT_ROUTER: Arquivo não encontrado: " . $file_path);
    http_response_code(404);
    include '404.php';
}
?>