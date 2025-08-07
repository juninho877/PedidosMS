<?php

use App\Core\Application;
use App\Controllers\Api\AuthController;
use App\Controllers\Api\ClientAuthController;
use App\Controllers\Api\TenantController;
use App\Controllers\Api\TMDBController;
use App\Controllers\Api\RequestController;
use App\Middleware\AuthMiddleware;
use App\Middleware\ClientAuthMiddleware;

$app = new Application();
$router = $app->getRouter();

// API Routes
$router->group(['prefix' => 'api'], function($router) {
    
    // Authentication routes
    $router->post('/auth/login', AuthController::class . '@login');
    $router->post('/auth/logout', AuthController::class . '@logout');
    $router->get('/auth/me', AuthController::class . '@me');
    
    // Client authentication routes
    $router->post('/client-auth/login', ClientAuthController::class . '@login');
    $router->post('/client-auth/logout', ClientAuthController::class . '@logout');
    $router->get('/client-auth/me', ClientAuthController::class . '@me');
    
    // TMDB routes
    $router->get('/tmdb/search', TMDBController::class . '@search');
    $router->get('/tmdb/movie/{id}', TMDBController::class . '@movieDetails');
    $router->get('/tmdb/tv/{id}', TMDBController::class . '@tvDetails');
    
    // Admin protected routes
    $router->group(['middleware' => [AuthMiddleware::class]], function($router) {
        $router->get('/tenants', TenantController::class . '@index');
        $router->get('/tenants/{id}', TenantController::class . '@show');
        $router->post('/tenants', TenantController::class . '@store');
        $router->put('/tenants/{id}', TenantController::class . '@update');
        $router->delete('/tenants/{id}', TenantController::class . '@destroy');
        
        // Admin requests (global)
        $router->get('/requests', RequestController::class . '@index');
        $router->get('/requests/{id}', RequestController::class . '@show');
        $router->put('/requests/status', RequestController::class . '@updateStatus');
        $router->get('/requests/stats', RequestController::class . '@stats');
        $router->delete('/requests/{id}', RequestController::class . '@destroy');
    });
    
    // Client protected routes
    $router->group(['middleware' => [ClientAuthMiddleware::class]], function($router) {
        $router->get('/client-requests', RequestController::class . '@index');
        $router->get('/client-requests/{id}', RequestController::class . '@show');
        $router->put('/client-requests/status', RequestController::class . '@updateStatus');
        $router->get('/client-requests/stats', RequestController::class . '@stats');
        $router->delete('/client-requests/{id}', RequestController::class . '@destroy');
        
        $router->get('/client-tenants/{id}', TenantController::class . '@show');
        $router->put('/client-tenants/{id}', TenantController::class . '@update');
    });
    
    // Public request creation (for tenant sites)
    $router->post('/tenant-requests', RequestController::class . '@store');
});