<?php
class TenantService {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function generateTenantToken($tenant_data) {
        $issued_at = time();
        $expiration_time = $issued_at + (24 * 60 * 60); // 24 horas
        
        $payload = [
            'iat' => $issued_at,
            'exp' => $expiration_time,
            'type' => 'tenant',
            'data' => [
                'id' => $tenant_data['id'],
                'slug' => $tenant_data['slug'],
                'name' => $tenant_data['name'],
                'site_name' => $tenant_data['site_name']
            ]
        ];

        return $this->authService->generateTokenWithPayload($payload);
    }

    public function validateTenantToken($token) {
        $decoded = $this->authService->validateToken($token);
        if ($decoded && isset($decoded['type']) && $decoded['type'] === 'tenant') {
            return $decoded['data'];
        }
        return false;
    }

    public function getCurrentTenant() {
        $headers = getallheaders();
        $token = null;

        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                $token = $matches[1];
            }
        }

        if (!$token && isset($_COOKIE['tenant_token'])) {
            $token = $_COOKIE['tenant_token'];
        }

        if ($token) {
            return $this->validateTenantToken($token);
        }

        return false;
    }

    public function setTenantCookie($token) {
        setcookie('tenant_token', $token, time() + (24 * 60 * 60), '/', '', false, true);
    }

    public function clearTenantCookie() {
        setcookie('tenant_token', '', time() - 3600, '/', '', false, true);
    }
}
?>