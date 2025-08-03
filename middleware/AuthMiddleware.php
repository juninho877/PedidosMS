<?php
class AuthMiddleware {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function requireAuth() {
        $user = $this->authService->getCurrentUser();
        
        if (!$user) {
            if ($this->isAjaxRequest()) {
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                exit;
            } else {
                header('Location: /admin/login.php');
                exit;
            }
        }

        return $user;
    }

    public function redirectIfAuthenticated() {
        $user = $this->authService->getCurrentUser();
        
        if ($user) {
            header('Location: /admin/dashboard.php');
            exit;
        }
    }

    private function isAjaxRequest() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
}
?>