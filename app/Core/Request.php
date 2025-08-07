<?php

namespace App\Core;

class Request
{
    private array $data;
    private array $files;
    private array $headers;

    public function __construct()
    {
        $this->data = $this->parseInput();
        $this->files = $_FILES;
        $this->headers = $this->parseHeaders();
    }

    private function parseInput(): array
    {
        $input = [];
        
        // GET parameters
        $input = array_merge($input, $_GET);
        
        // POST parameters
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = array_merge($input, $_POST);
        }
        
        // JSON input
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'application/json') !== false) {
            $json = json_decode(file_get_contents('php://input'), true);
            if ($json) {
                $input = array_merge($input, $json);
            }
        }
        
        return $input;
    }

    private function parseHeaders(): array
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $header = str_replace('HTTP_', '', $key);
                $header = str_replace('_', '-', $header);
                $header = strtolower($header);
                $headers[$header] = $value;
            }
        }
        return $headers;
    }

    public function get(string $key, $default = null)
    {
        return $this->data[$key] ?? $default;
    }

    public function all(): array
    {
        return $this->data;
    }

    public function has(string $key): bool
    {
        return isset($this->data[$key]);
    }

    public function getMethod(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public function getPath(): string
    {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        return $path ?: '/';
    }

    public function getHeader(string $name): ?string
    {
        return $this->headers[strtolower($name)] ?? null;
    }

    public function getFile(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    public function isJson(): bool
    {
        return strpos($this->getHeader('content-type') ?? '', 'application/json') !== false;
    }

    public function isAjax(): bool
    {
        return strtolower($this->getHeader('x-requested-with') ?? '') === 'xmlhttprequest';
    }

    public function validate(array $rules): array
    {
        $errors = [];
        
        foreach ($rules as $field => $rule) {
            $value = $this->get($field);
            
            if (strpos($rule, 'required') !== false && empty($value)) {
                $errors[$field] = "The {$field} field is required.";
                continue;
            }
            
            if (strpos($rule, 'email') !== false && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $errors[$field] = "The {$field} must be a valid email address.";
            }
            
            if (preg_match('/min:(\d+)/', $rule, $matches)) {
                $min = (int) $matches[1];
                if (strlen($value) < $min) {
                    $errors[$field] = "The {$field} must be at least {$min} characters.";
                }
            }
            
            if (preg_match('/max:(\d+)/', $rule, $matches)) {
                $max = (int) $matches[1];
                if (strlen($value) > $max) {
                    $errors[$field] = "The {$field} may not be greater than {$max} characters.";
                }
            }
        }
        
        return $errors;
    }
}