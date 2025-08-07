<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    private $userModel;
    private $tenantModel;
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->userModel = new User($this->db);
        $this->tenantModel = new Tenant($this->db);
    }

    // Admin Authentication
    public function generateToken($data) {
        $issuedAt = time();
        $expirationTime = $issuedAt + (3600 * 24);
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $data
        ];
        return JWT::encode($payload, JWT_SECRET, 'HS256');
    }

    public function setAuthCookie($token) {
        setcookie('jwt_token', $token, [
            'expires' => time() + (3600 * 24),
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax'
        ]);
    }

    public function clearAuthCookie() {
        setcookie('jwt_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax'
        ]);
    }

    public function getCurrentUser() {
        if (!isset($_COOKIE['jwt_token'])) {
            return null;
        }

        try {
            $token = $_COOKIE['jwt_token'];
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            return (array) $decoded->data;
        } catch (Exception $e) {
            $this->clearAuthCookie();
            return null;
        }
    }

    // Client Authentication
    public function generateClientToken($data) {
        $issuedAt = time();
        $expirationTime = $issuedAt + (3600 * 24 * 7);
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $data
        ];
        return JWT::encode($payload, JWT_SECRET, 'HS256');
    }

    public function setClientAuthCookie($token) {
        setcookie('client_jwt_token', $token, [
            'expires' => time() + (3600 * 24 * 7),
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax'
        ]);
    }

    public function clearClientAuthCookie() {
        setcookie('client_jwt_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax'
        ]);
    }

    public function getCurrentClient() {
        if (!isset($_COOKIE['client_jwt_token'])) {
            return null;
        }

        try {
            $token = $_COOKIE['client_jwt_token'];
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            return (array) $decoded->data;
        } catch (Exception $e) {
            $this->clearClientAuthCookie();
            return null;
        }
    }
}
?>