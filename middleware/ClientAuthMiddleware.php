<?php
error_log("ClientAuthMiddleware.php: Arquivo sendo carregado");

class ClientAuthMiddleware {
    private $authService;

    public function __construct() {
        if (!class_exists('AuthService')) {
            error_log("ClientAuthMiddleware: ERRO - Classe AuthService não encontrada");
            throw new Exception("AuthService class not available");
        }
        
        $this->authService = new AuthService();
        error_log("ClientAuthMiddleware: Inicializado com sucesso");
    }

    public function requireClientAuth() {
        error_log("ClientAuthMiddleware: requireClientAuth() chamado");
        
        $client = $this->authService->getCurrentClient();
        
        if (!$client) {
            error_log("ClientAuthMiddleware: Cliente não autenticado");
            if ($this->isAjaxRequest()) {
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                exit;
            } else {
                header('Location: /client/login.php');
                exit;
            }
        }

        error_log("ClientAuthMiddleware: Cliente autenticado: " . $client['name']);
        return $client;
    }

    public function redirectIfClientAuthenticated() {
        error_log("ClientAuthMiddleware: redirectIfClientAuthenticated() chamado");
        
        $client = $this->authService->getCurrentClient();
        
        if ($client) {
            error_log("ClientAuthMiddleware: Cliente já autenticado, redirecionando");
            header('Location: /client/dashboard.php');
            exit;
        }
    }

    private function isAjaxRequest() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
}

error_log("ClientAuthMiddleware.php: Classe ClientAuthMiddleware definida com sucesso");
?>