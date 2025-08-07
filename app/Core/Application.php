<?php

namespace App\Core;

use App\Middleware\CorsMiddleware;

class Application
{
    protected Router $router;

    public function __construct()
    {
        $this->router = new Router();
        $this->loadRoutes();
        
        // Apply global middleware
        $this->router->group(['middleware' => [CorsMiddleware::class]], function($router) {
            // No routes here, just applying middleware globally
        });
    }

    protected function loadRoutes(): void
    {
        require_once __DIR__ . '/../../routes/web.php';
        require_once __DIR__ . '/../../routes/api.php';
        require_once __DIR__ . '/../../routes/admin.php';
        require_once __DIR__ . '/../../routes/client.php';
    }

    public function run(): void
    {
        $this->router->dispatch();
    }
}