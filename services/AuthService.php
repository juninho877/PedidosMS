<?php
error_log("AuthService.php: Arquivo sendo carregado");

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    private $userModel;
    private $tenantModel;
    private $db;

    public function __construct() {
        // Ensure Database class is available before trying to get connection
        if (!class_exists('Database')) {
            error_log("AuthService: ERRO - Classe Database não encontrada");
            throw new Exception("Database class not available for AuthService");
        }
        $database = new Database();
        $this->db = $database->getConnection();

        // Ensure User and Tenant models are available
        if (!class_exists('User')) {
            error_log("AuthService: ERRO - Classe User não encontrada");
            throw new Exception("User class not available for AuthService");
        }
        $this->userModel = new User($this->db);

        if (!class_exists('Tenant')) {
            error_log("AuthService: ERRO - Classe Tenant não encontrada");
            throw new Exception("Tenant class not available for AuthService");
        }
        $this->tenantModel = new Tenant($this->db);

        error_log("AuthService: Inicializado com sucesso");
    }

    // --- Admin Authentication ---

    public function generateToken($data) {
        $issuedAt = time();
        $expirationTime = $issuedAt + (3600 * 24); // JWT valid for 24 hours
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $data // User data
        ];
        return JWT::encode($payload, JWT_SECRET, 'HS256');
    }

    public function setAuthCookie($token) {
        setcookie('jwt_token', $token, [
            'expires' => time() + (3600 * 24), // 24 hours
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']), // Only send over HTTPS
            'samesite' => 'Lax'
        ]);
        error_log("AuthService: Admin JWT cookie set.");
    }

    public function clearAuthCookie() {
        setcookie('jwt_token', '', [
            'expires' => time() - 3600, // Expire in the past
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax'
        ]);
        error_log("AuthService: Admin JWT cookie cleared.");
    }

    public function getCurrentUser() {
        if (!isset($_COOKIE['jwt_token'])) {
            error_log("AuthService: Admin JWT token not found in cookie.");
            return null;
        }

        try {
            $token = $_COOKIE['jwt_token'];
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            // Access data as an object, then cast to array if needed by consumers
            $userData = (array) $decoded->data;
            error_log("AuthService: Admin user data retrieved: " . ($userData['email'] ?? 'unknown'));
            return $userData;
        } catch (Exception $e) {
            error_log("AuthService: Error decoding admin JWT: " . $e->getMessage());
            $this->clearAuthCookie(); // Clear invalid token
            return null;
        }
    }

    // --- Client Authentication ---

    public function generateClientToken($data) {
        $issuedAt = time();
        $expirationTime = $issuedAt + (3600 * 24 * 7); // JWT valid for 7 days for clients
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $data // Client data
        ];
        return JWT::encode($payload, JWT_SECRET, 'HS256');
    }

    public function setClientAuthCookie($token) {
        setcookie('client_jwt_token', $token, [
            'expires' => time() + (3600 * 24 * 7), // 7 days
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax'
        ]);
        error_log("AuthService: Client JWT cookie set.");
    }

    public function clearClientAuthCookie() {
        setcookie('client_jwt_token', '', [
            'expires' => time() - 3600, // Expire in the past
            'path' => '/',
            'httponly' => true,
            'secure' => isset($_SERVER['HTTPS']),
            'samesite' => 'Lax'
        ]);
        error_log("AuthService: Client JWT cookie cleared.");
    }

    public function getCurrentClient() {
        if (!isset($_COOKIE['client_jwt_token'])) {
            error_log("AuthService: Client JWT token not found in cookie.");
            return null;
        }

        try {
            $token = $_COOKIE['client_jwt_token'];
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            // Access data as an object, then cast to array if needed by consumers
            $clientData = (array) $decoded->data;
            error_log("AuthService: Client data retrieved: " . ($clientData['name'] ?? 'unknown'));
            return $clientData;
        } catch (Exception $e) {
            error_log("AuthService: Error decoding client JWT: " . $e->getMessage());
            $this->clearClientAuthCookie(); // Clear invalid token
            return null;
        }
    }
}

error_log("AuthService.php: Classe AuthService definida com sucesso");