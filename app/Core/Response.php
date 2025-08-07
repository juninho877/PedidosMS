<?php

namespace App\Core;

class Response
{
    private int $statusCode = 200;
    private array $headers = [];
    private string $content = '';

    public function __construct(string $content = '', int $statusCode = 200, array $headers = [])
    {
        $this->content = $content;
        $this->statusCode = $statusCode;
        $this->headers = $headers;
    }

    public static function json(array $data, int $statusCode = 200): self
    {
        return new self(
            json_encode($data),
            $statusCode,
            ['Content-Type' => 'application/json']
        );
    }

    public static function view(string $view, array $data = [], int $statusCode = 200): self
    {
        $content = self::renderView($view, $data);
        return new self($content, $statusCode, ['Content-Type' => 'text/html']);
    }

    public static function redirect(string $url, int $statusCode = 302): self
    {
        return new self('', $statusCode, ['Location' => $url]);
    }

    private static function renderView(string $view, array $data = []): string
    {
        $viewPath = __DIR__ . '/../../resources/views/' . str_replace('.', '/', $view) . '.php';
        
        if (!file_exists($viewPath)) {
            throw new \Exception("View not found: {$view}");
        }
        
        extract($data);
        
        ob_start();
        require $viewPath;
        return ob_get_clean();
    }

    public function setStatusCode(int $statusCode): self
    {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function setHeader(string $name, string $value): self
    {
        $this->headers[$name] = $value;
        return $this;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function send(): void
    {
        http_response_code($this->statusCode);
        
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        
        echo $this->content;
    }
}