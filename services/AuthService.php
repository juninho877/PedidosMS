<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    private $secret_key;
    private $algorithm;

    public function __construct() {
        $this->secret_key = JWT_SECRET;
        $this->algorithm = JWT_ALGORITHM;
    }

    public function generateToken($user_data) {
        $issued_at = time();
        $expiration_time = $issued_at + (24 * 60 * 60); // 24 horas
        
        $payload = [
            'iat' => $issued_at,
            'exp' => $expiration_time,
            'data' => [
                'id' => $user_data['id'],
                'email' => $user_data['email'],
                'name' => $user_data['name'],
                'role' => $user_data['role']
            ]
        ];

        return JWT::encode($payload, $this->secret_key, $this->algorithm);
    }

    public function validateToken($token) {
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, $this->algorithm));
            return (array) $decoded->data;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getCurrentUser() {
        $headers = getallheaders();
        $token = null;

        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                $token = $matches[1];
            }
        }

        if (!$token && isset($_COOKIE['auth_token'])) {
            $token = $_COOKIE['auth_token'];
        }

        if ($token) {
            return $this->validateToken($token);
        }

        return false;
    }

    public function setAuthCookie($token) {
        setcookie('auth_token', $token, time() + (24 * 60 * 60), '/', '', false, true);
    }

    public function clearAuthCookie() {
        setcookie('auth_token', '', time() - 3600, '/', '', false, true);
    }

    public function generateClientToken($client_data) {
        $issued_at = time();
        $expiration_time = $issued_at + (24 * 60 * 60); // 24 horas
        
        $payload = [
            'iat' => $issued_at,
            'exp' => $expiration_time,
            'type' => 'client',
            'data' => $client_data
        ];

        return JWT::encode($payload, $this->secret_key, $this->algorithm);
    }

    public function validateClientToken($token) {
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, $this->algorithm));
            if (isset($decoded->type) && $decoded->type === 'client') {
                return (array) $decoded->data;
            }
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getCurrentClient() {
        $token = null;

        if (isset($_COOKIE['client_auth_token'])) {
            $token = $_COOKIE['client_auth_token'];
        }

        if ($token) {
            return $this->validateClientToken($token);
        }

        return false;
    }
    public function setClientAuthCookie($token) {
        setcookie('client_auth_token', $token, time() + (24 * 60 * 60), '/', '', false, true);
    }

    public function clearClientAuthCookie() {
        setcookie('client_auth_token', '', time() - 3600, '/', '', false, true);
    }

}
?>