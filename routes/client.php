<?php

use App\Core\Application;
use App\Middleware\ClientAuthMiddleware;

$app = new Application();
$router = $app->getRouter();

// Client routes
$router->group(['prefix' => 'client'], function($router) {
    
    // Login page (no auth required)
    $router->get('/login', function() {
        require_once __DIR__ . '/../resources/views/client/login.php';
    });
    
    // Protected client routes
    $router->group(['middleware' => [ClientAuthMiddleware::class]], function($router) {
        
        $router->get('/', function() {
            header('Location: /client/dashboard');
            exit;
        });
        
        $router->get('/dashboard', function() {
            require_once __DIR__ . '/../resources/views/client/dashboard.php';
        });
    });
});