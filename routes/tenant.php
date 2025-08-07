<?php

use App\Core\Application;
use App\Controllers\Web\TenantController;

$app = new Application();
$router = $app->getRouter();

// Tenant routes (must be last - catch all)
$router->get('/{slug}', TenantController::class . '@home');
$router->get('/{slug}/search', TenantController::class . '@search');
$router->get('/{slug}/details', TenantController::class . '@details');