<?php
error_log("RequestController.php: Arquivo sendo carregado");

class RequestController {
    private $db;
    private $request;

    public function __construct() {
        if (!class_exists('Database')) {
            throw new Exception("Database class not available");
        }
        
        if (!class_exists('Request')) {
            throw new Exception("Request class not available");
        }
        
        $database = new Database();
        $this->db = $database->getConnection();
        $this->request = new Request($this->db);
        
        error_log("RequestController: Inicializado com sucesso");
    }

    public function getAll() {
        error_log("RequestController: getAll() chamado");
        
        // Admin only sees requests with tenant_id = NULL (main site requests)
        $filters = [
            'tenant_id' => null, // Only main site requests
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
            error_log("RequestController: Erro ao buscar solicitações - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar solicitações: ' . $e->getMessage()]);
        }
    }

    public function create() {
        error_log("RequestController: create() chamado");
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            return;
        }

        // Validate input data
        $errors = $this->validateRequestData($input);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            return;
        }

        // Set request properties (tenant_id will be NULL for main site)
        $this->request->tenant_id = null; // Main site requests
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
            error_log("RequestController: Erro ao criar solicitação - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar solicitação: ' . $e->getMessage()]);
        }
    }

    public function getStats() {
        error_log("RequestController: getStats() chamado");
        
        try {
            // Admin only sees stats for requests with tenant_id = NULL
            $stats = $this->request->getStats(null);
            echo json_encode($stats);
        } catch (Exception $e) {
            error_log("RequestController: Erro ao buscar estatísticas - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao buscar estatísticas: ' . $e->getMessage()]);
        }
    }

    public function updateStatus() {
        error_log("RequestController: updateStatus() chamado");
        
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
            // Admin can only update requests with tenant_id = NULL
            if ($this->request->updateStatus($id, $status, null)) {
                echo json_encode(['success' => true, 'message' => 'Status atualizado com sucesso']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Solicitação não encontrada ou não autorizada']);
            }
        } catch (Exception $e) {
            error_log("RequestController: Erro ao atualizar status - " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar status: ' . $e->getMessage()]);
        }
    }

    public function getById($id) {
        error_log("RequestController: getById() chamado para ID: $id");
        
        try {
            $requestData = $this->request->findById($id);
            if ($requestData) {
                // Verify that this request belongs to main site (tenant_id = NULL)
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
            error_log("RequestController: Erro ao buscar solicitação - " . $e->getMessage());
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

error_log("RequestController.php: Classe RequestController definida com sucesso");
?>