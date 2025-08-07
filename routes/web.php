<?php

use App\Core\Application;
use App\Controllers\Web\HomeController;

$app = new Application();
$router = $app->getRouter();

// Home route
$router->get('/', HomeController::class . '@index');