<?php

namespace App\Core;

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
        // Apply CORS middleware globally
        $corsMiddleware = new CorsMiddleware();
        $corsMiddleware->handle();
        
        // Dispatch the request
        $this->router->dispatch();
    }

    protected function loadRoutes(): void
    {
        $router = $this->router; // Make $this->router available as $router in the included files
        
        require_once __DIR__ . '/../../routes/web.php';
        require_once __DIR__ . '/../../routes/api.php';
        require_once __DIR__ . '/../../routes/admin.php';
        require_once __DIR__ . '/../../routes/client.php';
    }
}