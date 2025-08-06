<?php
error_log("Request.php: Arquivo sendo carregado");

class Request {
    private $conn;
    private $table = 'requests';

    public $id;
    public $tenant_id;
    public $content_id;
    public $content_type;
    public $content_title;
    public $requester_name;
    public $requester_whatsapp;
    public $season;
    public $episode;
    public $status;
    public $poster_path;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
        error_log("Request: Inicializado com sucesso");
    }

    public function create() {
        error_log("Request: create() chamado");
        
        $query = "INSERT INTO " . $this->table . " 
                  (tenant_id, content_id, content_type, content_title, requester_name, requester_whatsapp, season, episode, poster_path) 
                  VALUES (:tenant_id, :content_id, :content_type, :content_title, :requester_name, :requester_whatsapp, :season, :episode, :poster_path)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':tenant_id', $this->tenant_id);
        $stmt->bindParam(':content_id', $this->content_id);
        $stmt->bindParam(':content_type', $this->content_type);
        $stmt->bindParam(':content_title', $this->content_title);
        $stmt->bindParam(':requester_name', $this->requester_name);
        $stmt->bindParam(':requester_whatsapp', $this->requester_whatsapp);
        $stmt->bindParam(':season', $this->season);
        $stmt->bindParam(':episode', $this->episode);
        $stmt->bindParam(':poster_path', $this->poster_path);

        return $stmt->execute();
    }

    public function getAll($filters = []) {
        error_log("Request: getAll() chamado com filtros: " . json_encode($filters));
        
        $where_conditions = [];
        $params = [];

        // Filter by tenant_id (including NULL for admin)
        if (isset($filters['tenant_id'])) {
            if ($filters['tenant_id'] === null) {
                $where_conditions[] = "tenant_id IS NULL";
            } else {
                $where_conditions[] = "tenant_id = :tenant_id";
                $params[':tenant_id'] = $filters['tenant_id'];
            }
        }

        // Filter by status
        if (!empty($filters['status'])) {
            $where_conditions[] = "status = :status";
            $params[':status'] = $filters['status'];
        }

        // Filter by content type
        if (!empty($filters['content_type'])) {
            $where_conditions[] = "content_type = :content_type";
            $params[':content_type'] = $filters['content_type'];
        }

        // Search filter
        if (!empty($filters['search'])) {
            $where_conditions[] = "(content_title LIKE :search OR requester_name LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';
        
        $query = "SELECT * FROM " . $this->table . " " . $where_clause . " ORDER BY created_at DESC";
        
        // Add limit and offset if specified
        if (isset($filters['limit']) && is_numeric($filters['limit'])) {
            $query .= " LIMIT " . intval($filters['limit']);
            
            if (isset($filters['offset']) && is_numeric($filters['offset'])) {
                $query .= " OFFSET " . intval($filters['offset']);
            }
        }

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById($id) {
        error_log("Request: findById() chamado para ID: $id");
        
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch();
        }
        return false;
    }

    public function updateStatus($id, $status, $tenant_id = null) {
        error_log("Request: updateStatus() chamado - ID: $id, Status: $status, Tenant: $tenant_id");
        
        // Build WHERE clause based on tenant_id
        if ($tenant_id === null) {
            $where_clause = "id = :id AND tenant_id IS NULL";
        } else {
            $where_clause = "id = :id AND tenant_id = :tenant_id";
        }
        
        $query = "UPDATE " . $this->table . " SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE " . $where_clause;
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':status', $status);
        
        if ($tenant_id !== null) {
            $stmt->bindParam(':tenant_id', $tenant_id);
        }

        return $stmt->execute();
    }

    public function getStats($tenant_id = null) {
        error_log("Request: getStats() chamado para tenant: $tenant_id");
        
        // Build WHERE clause based on tenant_id
        if ($tenant_id === null) {
            $where_clause = "WHERE tenant_id IS NULL";
        } else {
            $where_clause = "WHERE tenant_id = :tenant_id";
        }
        
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) as denied,
                    SUM(CASE WHEN content_type = 'movie' THEN 1 ELSE 0 END) as movies,
                    SUM(CASE WHEN content_type = 'tv' THEN 1 ELSE 0 END) as tv
                  FROM " . $this->table . " " . $where_clause;
        
        $stmt = $this->conn->prepare($query);
        
        if ($tenant_id !== null) {
            $stmt->bindParam(':tenant_id', $tenant_id);
        }
        
        $stmt->execute();
        return $stmt->fetch();
    }

    public function delete($id, $tenant_id = null) {
        error_log("Request: delete() chamado para ID: $id, Tenant: $tenant_id");
        
        // Build WHERE clause based on tenant_id
        if ($tenant_id === null) {
            $where_clause = "id = :id AND tenant_id IS NULL";
        } else {
            $where_clause = "id = :id AND tenant_id = :tenant_id";
        }
        
        $query = "DELETE FROM " . $this->table . " WHERE " . $where_clause;
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $id);
        
        if ($tenant_id !== null) {
            $stmt->bindParam(':tenant_id', $tenant_id);
        }

        return $stmt->execute();
    }
}

error_log("Request.php: Classe Request definida com sucesso");
?>