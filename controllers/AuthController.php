<?php
class AuthController {
    private $db;
    private $user;
    private $authService;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        $this->authService = new AuthService();
    }

    public function login() {
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
        $this->authService->clearAuthCookie();
        echo json_encode(['success' => true]);
    }

    public function me() {
        $user = $this->authService->getCurrentUser();
        if ($user) {
            echo json_encode(['user' => $user]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Não autorizado']);
        }
    }
}
?>