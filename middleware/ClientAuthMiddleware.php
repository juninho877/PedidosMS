<?php
class ClientAuthMiddleware {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function requireClientAuth() {
        $client = $this->authService->getCurrentClient();
        
        if (!$client) {
            if ($this->isAjaxRequest()) {
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                exit;
            } else {
                header('Location: /client/login.php');
                exit;
            }
        }

        return $client;
    }

    public function redirectIfClientAuthenticated() {
        $client = $this->authService->getCurrentClient();
        
        if ($client) {
            header('Location: /client/dashboard.php');
            exit;
        }
    }

    private function isAjaxRequest() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
}
?>