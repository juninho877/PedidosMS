<?php
class RequestController {
    private $db;
    private $request;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->request = new Request($this->db);
    }

    public function getAll() {
        $filters = [
            'tenant_id' => null,
            'status' => $_GET['status'] ?? '',
            'content_type' => $_GET['content_type'] ?? '',
            'search' => $_GET['search'] ?? '',
            'limit' => $_GET['limit'] ?? null,
            'offset' => $_GET['offset'] ?? null
        ];

        try {
            $requests = $this->request->getAll($filters);
            echo json_encode($requests);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar solicitações: ' . $e->getMessage()]);
        }
    }

    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            return;
        }

        $errors = $this->validateRequestData($input);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            return;
        }

        $this->request->tenant_id = null;
        $this->request->content_id = $input['content_id'];
        $this->request->content_type = $input['content_type'];
        $this->request->content_title = $input['content_title'];
        $this->request->requester_name = $input['requester_name'];
        $this->request->requester_whatsapp = $input['requester_whatsapp'];
        $this->request->season = $input['season'] ?? null;
        $this->request->episode = $input['episode'] ?? null;
        $this->request->poster_path = $input['poster_path'] ?? null;

        try {
            if ($this->request->create()) {
                echo json_encode(['success' => true, 'message' => 'Solicitação criada com sucesso']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erro ao criar solicitação']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar solicitação: ' . $e->getMessage()]);
        }
    }

    public function getStats() {
        try {
            $stats = $this->request->getStats(null);
            echo json_encode($stats);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar estatísticas: ' . $e->getMessage()]);
        }
    }

    public function updateStatus() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            return;
        }

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

        try {
            if ($this->request->updateStatus($id, $status, null)) {
                echo json_encode(['success' => true, 'message' => 'Status atualizado com sucesso']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Solicitação não encontrada ou não autorizada']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar status: ' . $e->getMessage()]);
        }
    }

    public function getById($id) {
        try {
            $requestData = $this->request->findById($id);
            if ($requestData) {
                if ($requestData['tenant_id'] !== null) {
                    http_response_code(403);
                    echo json_encode(['error' => 'Acesso negado']);
                    return;
                }
                
                echo json_encode($requestData);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Solicitação não encontrada']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar solicitação: ' . $e->getMessage()]);
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