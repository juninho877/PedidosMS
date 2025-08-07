<?php

use App\Middleware\ClientAuthMiddleware;

// Client routes
$router->group(['prefix' => 'client'], function($router) {
    
    // Public client routes (login page)
    $router->get('/login', function($request) {
        return new App\Core\Response(
            file_get_contents(__DIR__ . '/../resources/views/client/login.php'),
            200,
            ['Content-Type' => 'text/html']
        );
    });
    
    // Protected client routes
    $router->group(['middleware' => ['App\Middleware\ClientAuthMiddleware']], function($router) {
        
        $router->get('/dashboard', function($request) {
            return new App\Core\Response(
                file_get_contents(__DIR__ . '/../resources/views/client/dashboard.php'),
                200,
                ['Content-Type' => 'text/html']
            );
        });
    });
});