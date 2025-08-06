<?php
require_once 'config/config.php';

// Script de teste específico para o tenant
echo "<h1>Teste do Tenant 'teste'</h1>";

try {
    $database = new Database();
    $db = $database->getConnection();
    $tenant = new Tenant($db);
    
    echo "<h2>1. Teste direto do Model Tenant</h2>";
    
    // Teste findBySlug
    $found = $tenant->findBySlug('teste');
    echo "<p>findBySlug('teste'): " . ($found ? 'TRUE' : 'FALSE') . "</p>";
    
    if ($found) {
        echo "<p>ID: " . $tenant->id . "</p>";
        echo "<p>Nome: " . $tenant->name . "</p>";
        echo "<p>Slug: " . $tenant->slug . "</p>";
        echo "<p>Ativo: " . ($tenant->active ? 'Sim' : 'Não') . "</p>";
    }
    
    echo "<h2>2. Teste do TenantMiddleware</h2>";
    
    $middleware = new TenantMiddleware();
    $identified = $middleware->identifyTenant('teste');
    echo "<p>identifyTenant('teste'): " . ($identified ? 'TRUE' : 'FALSE') . "</p>";
    
    $currentTenant = TenantMiddleware::getCurrentTenant();
    echo "<p>getCurrentTenant(): " . ($currentTenant ? 'OBJETO ENCONTRADO' : 'NULL') . "</p>";
    
    if ($currentTenant) {
        echo "<p>Current Tenant ID: " . $currentTenant->id . "</p>";
        echo "<p>Current Tenant Nome: " . $currentTenant->name . "</p>";
    }
    
    $config = $middleware->getTenantConfig();
    echo "<p>getTenantConfig(): " . ($config ? 'CONFIGURAÇÃO ENCONTRADA' : 'NULL') . "</p>";
    
    if ($config) {
        echo "<h3>Configuração do Tenant:</h3>";
        echo "<pre style='background: #f0f0f0; padding: 10px;'>";
        print_r($config);
        echo "</pre>";
    }
    
    echo "<h2>3. Simulação de Roteamento</h2>";
    
    // Simular o que acontece no tenant_router.php
    $test_uri = '/teste/details?type=movie&id=123';
    echo "<p>URI de teste: " . $test_uri . "</p>";
    
    $uri_without_query = parse_url($test_uri, PHP_URL_PATH);
    echo "<p>URI sem query: " . $uri_without_query . "</p>";
    
    $path_parts = explode('/', trim($uri_without_query, '/'));
    echo "<p>Path parts: " . implode(', ', $path_parts) . "</p>";
    
    $tenant_slug = $path_parts[0] ?? '';
    $route = $path_parts[1] ?? '';
    
    echo "<p>Slug extraído: " . $tenant_slug . "</p>";
    echo "<p>Rota extraída: " . $route . "</p>";
    
    $routes = [
        '' => 'home.php',
        'home' => 'home.php',
        'search' => 'search.php',
        'details' => 'details.php',
    ];
    
    echo "<p>Rota existe: " . (array_key_exists($route, $routes) ? 'SIM' : 'NÃO') . "</p>";
    echo "<p>Arquivo: " . ($routes[$route] ?? 'N/A') . "</p>";
    echo "<p>Arquivo existe: " . (file_exists('public/' . ($routes[$route] ?? '')) ? 'SIM' : 'NÃO') . "</p>";
    
} catch (Exception $e) {
    echo "<h2>❌ Erro:</h2>";
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>