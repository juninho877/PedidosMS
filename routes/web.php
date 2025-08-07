<?php

use App\Controllers\Web\HomeController;
use App\Controllers\Web\TenantController;

// Home route
$router->get('/', 'App\Controllers\Web\HomeController@index');

// Tenant routes - these handle the dynamic tenant sites
$router->get('/{slug}', 'App\Controllers\Web\TenantController@home');
$router->get('/{slug}/search', 'App\Controllers\Web\TenantController@search');
$router->get('/{slug}/details', 'App\Controllers\Web\TenantController@details');