<?php

namespace App\Services;

use App\Core\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthService
{
    private string $jwtSecret;
    private string $algorithm = 'HS256';

    public function __construct()
    {
        $this->jwtSecret = Config::get('app.jwt_secret');
    }

    public function generateToken(array $data, int $expirationHours = 24): string
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + ($expirationHours * 3600);
        
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $data
        ];
        
        return JWT::encode($payload, $this->jwtSecret, $this->algorithm);
    }

    public function verifyToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, $this->algorithm));
            return (array) $decoded->data;
        } catch (Exception $e) {
            return null;
        }
    }

    public function setAuthCookie(string $token, string $name = 'auth_token'): void
    {
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
        
        setcookie($name, $token, [
            'expires' => time() + (24 * 3600),
            'path' => '/',
            'httponly' => true,
            'secure' => $secure,
            'samesite' => 'Lax'
        ]);
    }

    public function clearAuthCookie(string $name = 'auth_token'): void
    {
        $secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
        
        setcookie($name, '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'secure' => $secure,
            'samesite' => 'Lax'
        ]);
    }

    public function getCurrentUser(string $cookieName = 'auth_token'): ?array
    {
        $token = $_COOKIE[$cookieName] ?? null;
        
        if (!$token) {
            return null;
        }
        
        return $this->verifyToken($token);
    }
}