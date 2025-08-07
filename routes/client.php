<?php

use App\Middleware\ClientAuthMiddleware;
use App\Core\Response;

// Client routes
$router->group(['prefix' => 'client'], function($router) {
    
    // Public client routes (login page)
    $router->get('/login', function($request) {
        return new Response(
            file_get_contents(__DIR__ . '/../resources/views/client/login.php'),
            200,
            ['Content-Type' => 'text/html']
        );
    });
    
    // Protected client routes
    $router->group(['middleware' => [ClientAuthMiddleware::class]], function($router) {
        
        $router->get('/dashboard', function($request) {
            return new Response(
                file_get_contents(__DIR__ . '/../resources/views/client/dashboard.php'),
                200,
                ['Content-Type' => 'text/html']
            );
        });
    });
});