<?php

namespace App\Core;

use App\Core\Router;
use App\Core\Config;
use App\Middleware\CorsMiddleware;

class Application
{
    private Router $router;

    public function __construct()
    {
        $this->router = new Router();
        $this->loadRoutes();
    }

    public function run(): void
    {
        // Apply CORS middleware for all requests
        $corsMiddleware = new CorsMiddleware();
        $corsMiddleware->handle();

        // Dispatch the request
        $this->router->dispatch();
    }

    private function loadRoutes(): void
    {
        $router = $this->router;

        // Load all route files
        require_once __DIR__ . '/../../routes/web.php';
        require_once __DIR__ . '/../../routes/api.php';
        require_once __DIR__ . '/../../routes/admin.php';
        require_once __DIR__ . '/../../routes/client.php';
        require_once __DIR__ . '/../../routes/tenant.php';
    }
}