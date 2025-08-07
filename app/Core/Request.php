<?php

namespace App\Core;

class Request
{
    private array $data;
    private string $method;
    private string $path;

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->path = $this->normalizePath($_SERVER['REQUEST_URI'] ?? '/');
        $this->data = $this->parseRequestData();
    }

    private function normalizePath(string $path): string
    {
        // Remove query string
        $path = parse_url($path, PHP_URL_PATH) ?? '/';
        
        // Remove trailing slash except for root
        if ($path !== '/' && substr($path, -1) === '/') {
            $path = rtrim($path, '/');
        }
        
        return $path;
    }

    private function parseRequestData(): array
    {
        $data = [];

        // GET parameters
        $data = array_merge($data, $_GET);

        // POST data
        if ($this->method === 'POST') {
            $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
            
            if (strpos($contentType, 'application/json') !== false) {
                $json = json_decode(file_get_contents('php://input'), true);
                $data = array_merge($data, $json ?? []);
            } else {
                $data = array_merge($data, $_POST);
            }
        }

        // PUT/PATCH data
        if (in_array($this->method, ['PUT', 'PATCH', 'DELETE'])) {
            $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
            
            if (strpos($contentType, 'application/json') !== false) {
                $json = json_decode(file_get_contents('php://input'), true);
                $data = array_merge($data, $json ?? []);
            } else {
                parse_str(file_get_contents('php://input'), $putData);
                $data = array_merge($data, $putData);
            }
        }

        return $data;
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getPath(): string
    {
        return $this->path;
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

    public function isJson(): bool
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        return strpos($contentType, 'application/json') !== false;
    }

    public function isAjax(): bool
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }

    public function validate(array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $rule) {
            $value = $this->get($field);
            $ruleList = is_string($rule) ? explode('|', $rule) : $rule;

            foreach ($ruleList as $singleRule) {
                $ruleParts = explode(':', $singleRule);
                $ruleName = $ruleParts[0];
                $ruleValue = $ruleParts[1] ?? null;

                switch ($ruleName) {
                    case 'required':
                        if (empty($value)) {
                            $errors[$field] = "O campo {$field} é obrigatório";
                        }
                        break;
                    case 'email':
                        if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$field] = "O campo {$field} deve ser um email válido";
                        }
                        break;
                    case 'min':
                        if (!empty($value) && strlen($value) < (int)$ruleValue) {
                            $errors[$field] = "O campo {$field} deve ter pelo menos {$ruleValue} caracteres";
                        }
                        break;
                    case 'max':
                        if (!empty($value) && strlen($value) > (int)$ruleValue) {
                            $errors[$field] = "O campo {$field} deve ter no máximo {$ruleValue} caracteres";
                        }
                        break;
                }
            }
        }

        return $errors;
    }
}