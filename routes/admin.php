<?php

use App\Middleware\AuthMiddleware;

// Admin routes
$router->group(['prefix' => 'admin'], function($router) {
    
    // Public admin routes (login page)
    $router->get('/login', function($request) {
        return new App\Core\Response(
            file_get_contents(__DIR__ . '/../resources/views/admin/login.php'),
            200,
            ['Content-Type' => 'text/html']
        );
    });
    
    // Protected admin routes
    $router->group(['middleware' => ['App\Middleware\AuthMiddleware']], function($router) {
        
        $router->get('/dashboard', function($request) {
            return new App\Core\Response(
                file_get_contents(__DIR__ . '/../resources/views/admin/dashboard.php'),
                200,
                ['Content-Type' => 'text/html']
            );
        });
        
        $router->get('/tenants', function($request) {
            return new App\Core\Response(
                file_get_contents(__DIR__ . '/../resources/views/admin/tenants.php'),
                200,
                ['Content-Type' => 'text/html']
            );
        });
    });
});