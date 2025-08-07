<?php

use App\Controllers\Api\AuthController;
use App\Controllers\Api\ClientAuthController;
use App\Controllers\Api\TenantController;
use App\Controllers\Api\TMDBController;
use App\Controllers\Api\RequestController;
use App\Middleware\AuthMiddleware;
use App\Middleware\ClientAuthMiddleware;

// API routes with CORS and JSON responses
$router->group(['prefix' => 'api'], function($router) {
    
    // Admin Authentication
    $router->post('/auth/login', 'App\Controllers\Api\AuthController@login');
    $router->post('/auth/logout', 'App\Controllers\Api\AuthController@logout');
    $router->get('/auth/me', 'App\Controllers\Api\AuthController@me');
    
    // Client Authentication
    $router->post('/client-auth/login', 'App\Controllers\Api\ClientAuthController@login');
    $router->post('/client-auth/logout', 'App\Controllers\Api\ClientAuthController@logout');
    $router->get('/client-auth/me', 'App\Controllers\Api\ClientAuthController@me');
    
    // TMDB API (public)
    $router->get('/tmdb/search', 'App\Controllers\Api\TMDBController@search');
    $router->get('/tmdb/movie/{id}', 'App\Controllers\Api\TMDBController@movieDetails');
    $router->get('/tmdb/tv/{id}', 'App\Controllers\Api\TMDBController@tvDetails');
    
    // Public tenant requests
    $router->post('/tenant-requests', 'App\Controllers\Api\RequestController@store');
    
    // Protected Admin Routes
    $router->group(['middleware' => ['App\Middleware\AuthMiddleware']], function($router) {
        // Tenants management
        $router->get('/tenants', 'App\Controllers\Api\TenantController@index');
        $router->post('/tenants', 'App\Controllers\Api\TenantController@store');
        $router->get('/tenants/{id}', 'App\Controllers\Api\TenantController@show');
        $router->put('/tenants/{id}', 'App\Controllers\Api\TenantController@update');
        $router->delete('/tenants/{id}', 'App\Controllers\Api\TenantController@destroy');
    });
    
    // Protected Client Routes
    $router->group(['middleware' => ['App\Middleware\ClientAuthMiddleware']], function($router) {
        // Client requests management
        $router->get('/client-requests', 'App\Controllers\Api\RequestController@index');
        $router->get('/client-requests/{id}', 'App\Controllers\Api\RequestController@show');
        $router->get('/client-requests/stats', 'App\Controllers\Api\RequestController@stats');
        $router->put('/client-requests/update-status', 'App\Controllers\Api\RequestController@updateStatus');
        $router->delete('/client-requests/{id}', 'App\Controllers\Api\RequestController@destroy');
        
        // Client tenant management
        $router->get('/client-tenants/{id}', 'App\Controllers\Api\TenantController@show');
        $router->put('/client-tenants/{id}', 'App\Controllers\Api\TenantController@update');
        
        // Client analytics
        $router->get('/client-analytics', 'App\Controllers\Api\RequestController@analytics');
    });
});