<?php
error_log("AuthService.php: Arquivo sendo carregado");

require_once APP_ROOT . '/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    private $secret_key;
    private $algorithm = 'HS256';

    public function __construct() {
        $this->secret_key = JWT_SECRET;
        error_log("AuthService: Inicializado com sucesso");
    }

    public function generateToken($user_data) {
        error_log("AuthService: generateToken() chamado para usuário: " . ($user_data['email'] ?? 'unknown'));
        
        $payload = [
            'iss' => 'cine-request',
            'aud' => 'cine-request-users',
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60), // 24 horas
            'data' => $user_data
        ];

        return JWT::encode($payload, $this->secret_key, $this->algorithm);
    }

    public function generateClientToken($client_data) {
        error_log("AuthService: generateClientToken() chamado para cliente: " . ($client_data['name'] ?? 'unknown'));
        
        $payload = [
            'iss' => 'cine-request-client',
            'aud' => 'cine-request-clients',
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60), // 24 horas
            'data' => $client_data
        ];

        return JWT::encode($payload, $this->secret_key, $this->algorithm);
    }

    public function verifyToken($token) {
        error_log("AuthService: verifyToken() chamado");
        
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, $this->algorithm));
            return (array) $decoded;
        } catch (Exception $e) {
            error_log("AuthService: Erro ao verificar token - " . $e->getMessage());
            return false;
        }
    }

    public function getCurrentUser() {
        error_log("AuthService: getCurrentUser() chamado");
        
        $token = $_COOKIE['auth_token'] ?? null;
        
        if (!$token) {
            error_log("AuthService: Token não encontrado nos cookies");
            return null;
        }

        $decoded = $this->verifyToken($token);
        if ($decoded && isset($decoded['data'])) {
            error_log("AuthService: Usuário encontrado: " . ($decoded['data']['email'] ?? 'unknown'));
            return $decoded['data'];
        }

        error_log("AuthService: Token inválido ou expirado");
        return null;
    }

    public function getCurrentClient() {
        error_log("AuthService: getCurrentClient() chamado");
        
        $token = $_COOKIE['client_auth_token'] ?? null;
        
        if (!$token) {
            error_log("AuthService: Token de cliente não encontrado nos cookies");
            return null;
        }

        $decoded = $this->verifyToken($token);
        if ($decoded && isset($decoded['data'])) {
            error_log("AuthService: Cliente encontrado: " . ($decoded['data']['name'] ?? 'unknown'));
            return $decoded['data'];
        }

        error_log("AuthService: Token de cliente inválido ou expirado");
        return null;
    }

    public function setAuthCookie($token) {
        error_log("AuthService: setAuthCookie() chamado");
        setcookie('auth_token', $token, time() + (24 * 60 * 60), '/', '', false, true);
    }

    public function setClientAuthCookie($token) {
        error_log("AuthService: setClientAuthCookie() chamado");
        setcookie('client_auth_token', $token, time() + (24 * 60 * 60), '/', '', false, true);
    }

    public function clearAuthCookie() {
        error_log("AuthService: clearAuthCookie() chamado");
        setcookie('auth_token', '', time() - 3600, '/', '', false, true);
    }

    public function clearClientAuthCookie() {
        error_log("AuthService: clearClientAuthCookie() chamado");
        setcookie('client_auth_token', '', time() - 3600, '/', '', false, true);
    }
}

error_log("AuthService.php: Classe AuthService definida com sucesso");
?>