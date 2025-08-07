<?php

namespace App\Core;

use App\Core\Request;
use App\Core\Response;
use Exception;

class Router
{
    private array $routes = [];
    private array $middleware = [];
    private string $currentPrefix = '';
    private array $currentMiddleware = [];

    public function get(string $path, $handler): self
    {
        return $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, $handler): self
    {
        return $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, $handler): self
    {
        return $this->addRoute('PUT', $path, $handler);
    }

    public function delete(string $path, $handler): self
    {
        return $this->addRoute('DELETE', $path, $handler);
    }

    public function patch(string $path, $handler): self
    {
        return $this->addRoute('PATCH', $path, $handler);
    }

    public function options(string $path, $handler): self
    {
        return $this->addRoute('OPTIONS', $path, $handler);
    }

    public function group(array $attributes, callable $callback): void
    {
        $previousPrefix = $this->currentPrefix;
        $previousMiddleware = $this->currentMiddleware;

        if (isset($attributes['prefix'])) {
            $this->currentPrefix .= '/' . trim($attributes['prefix'], '/');
        }

        if (isset($attributes['middleware'])) {
            $this->currentMiddleware = array_merge(
                $this->currentMiddleware,
                (array) $attributes['middleware']
            );
        }

        $callback($this);

        $this->currentPrefix = $previousPrefix;
        $this->currentMiddleware = $previousMiddleware;
    }

    private function addRoute(string $method, string $path, $handler): self
    {
        $fullPath = $this->currentPrefix . '/' . trim($path, '/');
        $fullPath = '/' . trim($fullPath, '/');
        
        if ($fullPath === '/') {
            $fullPath = '/';
        }

        $this->routes[] = [
            'method' => $method,
            'path' => $fullPath,
            'handler' => $handler,
            'middleware' => $this->currentMiddleware
        ];

        return $this;
    }

    public function dispatch(): void
    {
        $request = new Request();
        $method = $request->getMethod();
        $path = $request->getPath();

        foreach ($this->routes as $route) {
            if ($this->matchRoute($route, $method, $path)) {
                $this->executeRoute($route, $request);
                return;
            }
        }

        $this->handleNotFound();
    }

    private function matchRoute(array $route, string $method, string $path): bool
    {
        if ($route['method'] !== $method) {
            return false;
        }

        $routePath = $route['path'];
        
        // Convert route parameters to regex
        $pattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';

        return preg_match($pattern, $path);
    }

    private function executeRoute(array $route, Request $request): void
    {
        // Execute middleware
        foreach ($route['middleware'] as $middlewareClass) {
            $middleware = new $middlewareClass();
            $middleware->handle($request);
        }

        $handler = $route['handler'];

        if (is_string($handler) && strpos($handler, '@') !== false) {
            [$controllerClass, $method] = explode('@', $handler);
            $controller = new $controllerClass();
            
            // Extract parameters from URL
            $params = $this->extractParameters($route['path'], $request->getPath());
            
            $response = $controller->$method($request, ...$params);
        } elseif (is_callable($handler)) {
            $params = $this->extractParameters($route['path'], $request->getPath());
            $response = $handler($request, ...$params);
        } else {
            throw new Exception('Invalid route handler');
        }

        if ($response instanceof Response) {
            $response->send();
        }
    }

    private function extractParameters(string $routePath, string $actualPath): array
    {
        $routeParts = explode('/', trim($routePath, '/'));
        $actualParts = explode('/', trim($actualPath, '/'));
        
        $params = [];
        
        for ($i = 0; $i < count($routeParts); $i++) {
            if (preg_match('/\{([^}]+)\}/', $routeParts[$i])) {
                $params[] = $actualParts[$i] ?? null;
            }
        }
        
        return $params;
    }

    private function handleNotFound(): void
    {
        http_response_code(404);
        
        if ($this->isApiRequest()) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Route not found']);
        } else {
            require_once __DIR__ . '/../../resources/views/errors/404.php';
        }
    }

    private function isApiRequest(): bool
    {
        return strpos($_SERVER['REQUEST_URI'], '/api/') === 0;
    }
}