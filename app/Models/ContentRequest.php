<?php

namespace App\Models;

class ContentRequest extends BaseModel
{
    protected string $table = 'requests';
    
    protected array $fillable = [
        'tenant_id',
        'content_id',
        'content_type',
        'content_title',
        'requester_name',
        'requester_whatsapp',
        'season',
        'episode',
        'status',
        'poster_path'
    ];
    
    protected array $casts = [
        'content_id' => 'integer',
        'season' => 'integer',
        'episode' => 'integer'
    ];

    public function getByTenant(?int $tenantId, array $filters = []): array
    {
        $conditions = [];
        $params = [];
        
        if ($tenantId === null) {
            $conditions[] = "tenant_id IS NULL";
        } else {
            $conditions[] = "tenant_id = ?";
            $params[] = $tenantId;
        }
        
        if (!empty($filters['status'])) {
            $conditions[] = "status = ?";
            $params[] = $filters['status'];
        }
        
        if (!empty($filters['content_type'])) {
            $conditions[] = "content_type = ?";
            $params[] = $filters['content_type'];
        }
        
        if (!empty($filters['search'])) {
            $conditions[] = "(content_title LIKE ? OR requester_name LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $whereClause = implode(' AND ', $conditions);
        $sql = "SELECT * FROM {$this->table} WHERE {$whereClause} ORDER BY created_at DESC";
        
        if (isset($filters['limit'])) {
            $sql .= " LIMIT " . (int) $filters['limit'];
            if (isset($filters['offset'])) {
                $sql .= " OFFSET " . (int) $filters['offset'];
            }
        }
        
        $results = $this->db->query($sql, $params);
        return array_map([$this, 'castAttributes'], $results);
    }

    public function getStats(?int $tenantId): array
    {
        $condition = $tenantId === null ? "tenant_id IS NULL" : "tenant_id = ?";
        $params = $tenantId === null ? [] : [$tenantId];
        
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                    SUM(CASE WHEN status = 'denied' THEN 1 ELSE 0 END) as denied,
                    SUM(CASE WHEN content_type = 'movie' THEN 1 ELSE 0 END) as movies,
                    SUM(CASE WHEN content_type = 'tv' THEN 1 ELSE 0 END) as tv
                FROM {$this->table} WHERE {$condition}";
        
        return $this->db->queryOne($sql, $params);
    }

    public function updateStatus(int $id, string $status, ?int $tenantId = null): bool
    {
        $condition = $tenantId === null ? "id = ? AND tenant_id IS NULL" : "id = ? AND tenant_id = ?";
        $params = $tenantId === null ? [$id, $status] : [$id, $tenantId, $status];
        
        $sql = "UPDATE {$this->table} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE {$condition}";
        
        if ($tenantId !== null) {
            // Reorder parameters for the query
            $sql = "UPDATE {$this->table} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?";
            $params = [$status, $id, $tenantId];
        } else {
            $sql = "UPDATE {$this->table} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id IS NULL";
            $params = [$status, $id];
        }
        
        return $this->db->execute($sql, $params);
    }

    public function deleteByTenant(int $id, ?int $tenantId = null): bool
    {
        if ($tenantId === null) {
            $sql = "DELETE FROM {$this->table} WHERE id = ? AND tenant_id IS NULL";
            $params = [$id];
        } else {
            $sql = "DELETE FROM {$this->table} WHERE id = ? AND tenant_id = ?";
            $params = [$id, $tenantId];
        }
        
        return $this->db->execute($sql, $params);
    }
}