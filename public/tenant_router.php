<?php
require_once '../config/config.php';

// Log de depuração detalhado
error_log("=== TENANT_ROUTER DEBUG START ===");
error_log("REQUEST_URI: " . $_SERVER['REQUEST_URI']);
error_log("SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME']);
error_log("QUERY_STRING: " . ($_SERVER['QUERY_STRING'] ?? 'empty'));
error_log("Working Directory: " . getcwd());

// Extrair o slug do tenant e o caminho da URL
$request_uri = $_SERVER['REQUEST_URI'];

// Remover query string da URI para parsing correto
$uri_without_query = parse_url($request_uri, PHP_URL_PATH);
error_log("URI without query: " . $uri_without_query);

// Dividir o caminho em partes
$path_parts = explode('/', trim($uri_without_query, '/'));
error_log("Path parts: " . implode(', ', $path_parts));

// Primeiro segmento é o slug do tenant
$tenant_slug = $path_parts[0] ?? '';
error_log("Tenant slug extracted: " . $tenant_slug);

// Segundo segmento é a rota
$route = $path_parts[1] ?? '';
error_log("Route extracted: " . $route);

// Verificar se o slug não está vazio
if (empty($tenant_slug)) {
    error_log("TENANT_ROUTER: Slug vazio, redirecionando para landing");
    header('Location: /');
    exit;
}

// Inicializar middleware do tenant
error_log("TENANT_ROUTER: Inicializando TenantMiddleware");
$tenantMiddleware = new TenantMiddleware();

// Tentar identificar o tenant
error_log("TENANT_ROUTER: Tentando identificar tenant com slug: " . $tenant_slug);
$tenantFound = $tenantMiddleware->identifyTenant($tenant_slug);
error_log("TENANT_ROUTER: Tenant identificado: " . ($tenantFound ? 'SIM' : 'NÃO'));

if (!$tenantFound) {
    error_log("TENANT_ROUTER: Tenant não encontrado, mostrando 404");
    http_response_code(404);
    include __DIR__ . '/404.php';
    exit;
}

// Obter configuração do tenant
$tenantConfig = $tenantMiddleware->getTenantConfig();
error_log("TENANT_ROUTER: TenantConfig obtido: " . ($tenantConfig ? 'SIM' : 'NÃO'));

if (!$tenantConfig) {
    error_log("TENANT_ROUTER: TenantConfig é null, mostrando 404");
    http_response_code(404);
    include __DIR__ . '/404.php';
    exit;
}

// Definir rotas disponíveis para tenants
$routes = [
    '' => 'home.php',           // Página inicial
    'home' => 'home.php',       // Página inicial alternativa
    'search' => 'search.php',   // Página de pesquisa
    'details' => 'details.php', // Página de detalhes
];

error_log("TENANT_ROUTER: Verificando rota: " . $route);
error_log("TENANT_ROUTER: Rotas disponíveis: " . implode(', ', array_keys($routes)));

// Verificar se a rota existe
if (!array_key_exists($route, $routes)) {
    error_log("TENANT_ROUTER: Rota não encontrada: " . $route);
    http_response_code(404);
    include __DIR__ . '/404.php';
    exit;
}

// Incluir o arquivo da rota
$file_path = __DIR__ . '/' . $routes[$route];
error_log("TENANT_ROUTER: Tentando incluir arquivo: " . $file_path);
error_log("TENANT_ROUTER: Arquivo existe: " . (file_exists($file_path) ? 'SIM' : 'NÃO'));

if (file_exists($file_path)) {
    error_log("TENANT_ROUTER: Incluindo arquivo: " . $file_path);
    error_log("=== TENANT_ROUTER DEBUG END ===");
    include $file_path;
} else {
    error_log("TENANT_ROUTER: Arquivo não encontrado: " . $file_path);
    error_log("=== TENANT_ROUTER DEBUG END ===");
    http_response_code(404);
    include __DIR__ . '/404.php';
}
?>