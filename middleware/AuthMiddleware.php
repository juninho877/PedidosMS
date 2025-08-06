<?php
error_log("AuthMiddleware.php: Arquivo sendo carregado");

class AuthMiddleware {
    private $authService;

    public function __construct() {
        if (!class_exists('AuthService')) {
            error_log("AuthMiddleware: ERRO - Classe AuthService não encontrada");
            throw new Exception("AuthService class not available");
        }
        
        $this->authService = new AuthService();
        error_log("AuthMiddleware: Inicializado com sucesso");
    }

    public function requireAuth() {
        error_log("AuthMiddleware: requireAuth() chamado");
        
        $user = $this->authService->getCurrentUser();
        
        if (!$user) {
            error_log("AuthMiddleware: Usuário não autenticado");
            if ($this->isAjaxRequest()) {
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                exit;
            } else {
                header('Location: /admin/login.php');
                exit;
            }
        }

        error_log("AuthMiddleware: Usuário autenticado: " . ($user['email'] ?? 'unknown'));
        return $user;
    }

    public function redirectIfAuthenticated() {
        error_log("AuthMiddleware: redirectIfAuthenticated() chamado");
        
        $user = $this->authService->getCurrentUser();
        
        if ($user) {
            error_log("AuthMiddleware: Usuário já autenticado, redirecionando");
            header('Location: /admin/dashboard.php');
            exit;
        }
    }

    private function isAjaxRequest() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
}

error_log("AuthMiddleware.php: Classe AuthMiddleware definida com sucesso");
?>