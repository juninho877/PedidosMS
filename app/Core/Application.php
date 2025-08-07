<?php

namespace App\Core;

use App\Core\Router;
use App\Core\Database;
use App\Core\Config;
use App\Middleware\CorsMiddleware;
use Exception;

class Application
{
    private Router $router;
    private Database $database;
    private array $middleware = [];

    public function __construct()
    {
        $this->initializeErrorHandling();
        $this->initializeDatabase();
        $this->initializeRouter();
        $this->registerGlobalMiddleware();
    }

    private function initializeErrorHandling(): void
    {
        error_reporting(E_ALL);
        ini_set('display_errors', Config::get('app.debug', false) ? '1' : '0');
        
        set_exception_handler([$this, 'handleException']);
        set_error_handler([$this, 'handleError']);
    }

    private function initializeDatabase(): void
    {
        $this->database = Database::getInstance();
    }

    private function initializeRouter(): void
    {
        $this->router = new Router();
        $this->loadRoutes();
    }

    private function registerGlobalMiddleware(): void
    {
        $this->middleware[] = new CorsMiddleware();
    }

    private function loadRoutes(): void
    {
        // API Routes
        require_once __DIR__ . '/../../routes/api.php';
        
        // Web Routes
        require_once __DIR__ . '/../../routes/web.php';
        
        // Admin Routes
        require_once __DIR__ . '/../../routes/admin.php';
        
        // Client Routes
        require_once __DIR__ . '/../../routes/client.php';
        
        // Tenant Routes (must be last)
        require_once __DIR__ . '/../../routes/tenant.php';
    }

    public function run(): void
    {
        try {
            $this->executeMiddleware();
            $this->router->dispatch();
        } catch (Exception $e) {
            $this->handleException($e);
        }
    }

    private function executeMiddleware(): void
    {
        foreach ($this->middleware as $middleware) {
            $middleware->handle();
        }
    }

    public function handleException(Exception $e): void
    {
        http_response_code(500);
        
        if (Config::get('app.debug', false)) {
            echo json_encode([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
        } else {
            echo json_encode(['error' => 'Internal Server Error']);
        }
    }

    public function handleError($severity, $message, $file, $line): void
    {
        throw new Exception("Error: $message in $file on line $line");
    }

    public function getRouter(): Router
    {
        return $this->router;
    }

    public function getDatabase(): Database
    {
        return $this->database;
    }
}