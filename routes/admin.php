<?php

use App\Core\Application;
use App\Controllers\Web\AdminController;
use App\Middleware\AuthMiddleware;

$app = new Application();
$router = $app->getRouter();

// Admin routes
$router->group(['prefix' => 'admin'], function($router) {
    
    // Login page (no auth required)
    $router->get('/login', function() {
        require_once __DIR__ . '/../resources/views/admin/login.php';
    });
    
    // Protected admin routes
    $router->group(['middleware' => [AuthMiddleware::class]], function($router) {
        
        $router->get('/', function() {
            header('Location: /admin/dashboard');
            exit;
        });
        
        $router->get('/dashboard', function() {
            require_once __DIR__ . '/../resources/views/admin/dashboard.php';
        });
        
        $router->get('/tenants', function() {
            require_once __DIR__ . '/../resources/views/admin/tenants.php';
        });
    });
});