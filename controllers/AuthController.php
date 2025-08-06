<?php
error_log("AuthController.php: Arquivo sendo carregado");

class AuthController {
    private $db;
    private $user;
    private $authService;

    public function __construct() {
        if (!class_exists('Database')) {
            throw new Exception("Database class not available");
        }
        
        if (!class_exists('User')) {
            throw new Exception("User class not available");
        }
        
        if (!class_exists('AuthService')) {
            throw new Exception("AuthService class not available");
        }
        
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        $this->authService = new AuthService();
        
        error_log("AuthController: Inicializado com sucesso");
    }

    public function login() {
        error_log("AuthController: login() chamado");
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            
            $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
            $password = $input['password'] ?? '';

            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Email e senha são obrigatórios']);
                return;
            }

            if ($this->user->login($email, $password)) {
                $user_data = [
                    'id' => $this->user->id,
                    'email' => $this->user->email,
                    'name' => $this->user->name,
                    'role' => $this->user->role
                ];

                $token = $this->authService->generateToken($user_data);
                $this->authService->setAuthCookie($token);

                echo json_encode([
                    'success' => true,
                    'token' => $token,
                    'user' => $user_data
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciais inválidas']);
            }
        }
    }

    public function logout() {
        error_log("AuthController: logout() chamado");
        $this->authService->clearAuthCookie();
        echo json_encode(['success' => true]);
    }

    public function me() {
        error_log("AuthController: me() chamado");
        $user = $this->authService->getCurrentUser();
        if ($user) {
            echo json_encode(['user' => $user]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Não autorizado']);
        }
    }
}

error_log("AuthController.php: Classe AuthController definida com sucesso");
?>