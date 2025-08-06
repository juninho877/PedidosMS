<?php
class RequestController {
    private $db;
    private $request;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->request = new Request($this->db);
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);

            // Validação dos dados
            $errors = $this->validateRequestData($input);
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode(['errors' => $errors]);
                return;
            }

            $this->request->content_id = $input['content_id'];
            $this->request->content_type = $input['content_type'];
            $this->request->content_title = $input['content_title'];
            $this->request->requester_name = $input['requester_name'];
            $this->request->requester_whatsapp = $input['requester_whatsapp'];
            $this->request->season = $input['season'] ?? null;
            $this->request->episode = $input['episode'] ?? null;
            $this->request->poster_path = $input['poster_path'] ?? null;

            if ($this->request->create()) {
                echo json_encode(['success' => true, 'message' => 'Solicitação criada com sucesso']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erro ao criar solicitação']);
            }
        }
    }

    public function getAll() {
        $middleware = new AuthMiddleware();
        $middleware->requireAuth();

        $filters = [
            'status' => $_GET['status'] ?? '',
            'content_type' => $_GET['content_type'] ?? '',
            'search' => $_GET['search'] ?? '',
            'limit' => $_GET['limit'] ?? null,
            'offset' => $_GET['offset'] ?? null
        ];

        $requests = $this->request->getAll($filters);
        echo json_encode($requests);
    }

    public function getStats() {
        $middleware = new AuthMiddleware();
        $middleware->requireAuth();

        $stats = $this->request->getStats();
        echo json_encode($stats);
    }

    public function updateStatus() {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $middleware = new AuthMiddleware();
            $middleware->requireAuth();

            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? '';
            $status = $input['status'] ?? '';

            if (empty($id) || empty($status)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID e status são obrigatórios']);
                return;
            }

            if (!in_array($status, ['pending', 'approved', 'denied'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Status inválido']);
                return;
            }

            if ($this->request->updateStatus($id, $status)) {
                echo json_encode(['success' => true, 'message' => 'Status atualizado com sucesso']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erro ao atualizar status']);
            }
        }
    }

    public function getById($id) {
        $middleware = new AuthMiddleware();
        $middleware->requireAuth();

        $requestData = $this->request->findById($id);
        if ($requestData) {
            echo json_encode($requestData);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Solicitação não encontrada']);
        }
    }

    private function validateRequestData($data) {
        $errors = [];

        if (empty($data['content_id'])) {
            $errors['content_id'] = 'ID do conteúdo é obrigatório';
        }

        if (empty($data['content_type']) || !in_array($data['content_type'], ['movie', 'tv'])) {
            $errors['content_type'] = 'Tipo de conteúdo inválido';
        }

        if (empty($data['content_title'])) {
            $errors['content_title'] = 'Título do conteúdo é obrigatório';
        }

        if (empty($data['requester_name']) || strlen($data['requester_name']) < 2) {
            $errors['requester_name'] = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (empty($data['requester_whatsapp']) || !preg_match('/^55\d{10,11}$/', $data['requester_whatsapp'])) {
            $errors['requester_whatsapp'] = 'WhatsApp deve estar no formato: 5511999999999';
        }

        return $errors;
    }
}
?>