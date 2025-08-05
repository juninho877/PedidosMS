<?php
class Request {
    private $conn;
    private $table = 'requests';

    public $id;
    public $content_id;
    public $content_type;
    public $content_title;
    public $requester_name;
    public $requester_whatsapp;
    public $season;
    public $episode;
    public $status;
    public $poster_path;
    public $tenant_id;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
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
        $query = "SELECT * FROM " . $this->table . " WHERE 1=1";
        $params = [];

        // Filtrar por tenant se especificado
        if (!empty($filters['tenant_id'])) {
            $query .= " AND tenant_id = :tenant_id";
            $params[':tenant_id'] = $filters['tenant_id'];
        }

        if (!empty($filters['status'])) {
            $query .= " AND status = :status";
            $params[':status'] = $filters['status'];
        }

        if (!empty($filters['content_type'])) {
            $query .= " AND content_type = :content_type";
            $params[':content_type'] = $filters['content_type'];
        }

        if (!empty($filters['search'])) {
            $query .= " AND (content_title LIKE :search OR requester_name LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        $query .= " ORDER BY created_at DESC";

        if (!empty($filters['limit'])) {
            $query .= " LIMIT :limit";
            if (!empty($filters['offset'])) {
                $query .= " OFFSET :offset";
            }
        }

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        if (!empty($filters['limit'])) {
            $stmt->bindValue(':limit', (int)$filters['limit'], PDO::PARAM_INT);
            if (!empty($filters['offset'])) {
                $stmt->bindValue(':offset', (int)$filters['offset'], PDO::PARAM_INT);
            }
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getStats() {
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) as denied,
                    SUM(CASE WHEN content_type = 'movie' THEN 1 ELSE 0 END) as movies,
                    SUM(CASE WHEN content_type = 'tv' THEN 1 ELSE 0 END) as tv
                  FROM " . $this->table;
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE " . $this->table . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        
        return $stmt->execute();
    }

    public function findById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            $this->id = $row['id'];
            $this->tenant_id = $row['tenant_id'];
            $this->content_id = $row['content_id'];
            $this->content_type = $row['content_type'];
            $this->content_title = $row['content_title'];
            $this->requester_name = $row['requester_name'];
            $this->requester_whatsapp = $row['requester_whatsapp'];
            $this->season = $row['season'];
            $this->episode = $row['episode'];
            $this->status = $row['status'];
            $this->poster_path = $row['poster_path'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }
}
?>