<?php
require_once '../config/config.php';

// Extract tenant slug from URL
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$segments = array_filter(explode('/', trim($requestUri, '/')));
$tenantSlug = reset($segments);
$path = implode('/', array_slice($segments, 1));

if (empty($tenantSlug)) {
    http_response_code(404);
    include '404.php';
    exit;
}

// Initialize tenant middleware
$tenantMiddleware = new TenantMiddleware();
if (!$tenantMiddleware->identifyTenant($tenantSlug)) {
    http_response_code(404);
    include '404.php';
    exit;
}

$tenantConfig = $tenantMiddleware->getTenantConfig();

// Route to appropriate page
switch ($path) {
    case '':
    case 'home':
        include 'home.php';
        break;
    case 'search':
        include 'search.php';
        break;
    case 'details':
        include 'details.php';
        break;
    default:
        http_response_code(404);
        include '404.php';
        break;
}
?>