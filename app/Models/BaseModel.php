<?php

namespace App\Models;

use App\Core\Database;
use PDO;

abstract class BaseModel
{
    protected Database $db;
    protected string $table;
    protected string $primaryKey = 'id';
    protected array $fillable = [];
    protected array $hidden = [];
    protected array $casts = [];

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function find(int $id): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?";
        $result = $this->db->queryOne($sql, [$id]);
        
        return $result ? $this->castAttributes($result) : null;
    }

    public function findBy(string $column, $value): ?array
    {
        $sql = "SELECT * FROM {$this->table} WHERE {$column} = ?";
        $result = $this->db->queryOne($sql, [$value]);
        
        return $result ? $this->castAttributes($result) : null;
    }

    public function all(): array
    {
        $sql = "SELECT * FROM {$this->table}";
        $results = $this->db->query($sql);
        
        return array_map([$this, 'castAttributes'], $results);
    }

    public function where(string $column, $operator, $value = null): array
    {
        if ($value === null) {
            $value = $operator;
            $operator = '=';
        }
        
        $sql = "SELECT * FROM {$this->table} WHERE {$column} {$operator} ?";
        $results = $this->db->query($sql, [$value]);
        
        return array_map([$this, 'castAttributes'], $results);
    }

    public function create(array $data): ?array
    {
        $data = $this->filterFillable($data);
        
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $sql = "INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})";
        
        if ($this->db->execute($sql, $data)) {
            $id = $this->db->lastInsertId();
            return $this->find((int) $id);
        }
        
        return null;
    }

    public function update(int $id, array $data): bool
    {
        $data = $this->filterFillable($data);
        
        $setParts = [];
        foreach (array_keys($data) as $column) {
            $setParts[] = "{$column} = :{$column}";
        }
        
        $sql = "UPDATE {$this->table} SET " . implode(', ', $setParts) . " WHERE {$this->primaryKey} = :id";
        $data['id'] = $id;
        
        return $this->db->execute($sql, $data);
    }

    public function delete(int $id): bool
    {
        $sql = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?";
        return $this->db->execute($sql, [$id]);
    }

    public function paginate(int $page = 1, int $perPage = 15): array
    {
        $offset = ($page - 1) * $perPage;
        
        $countSql = "SELECT COUNT(*) as total FROM {$this->table}";
        $total = $this->db->queryOne($countSql)['total'];
        
        $sql = "SELECT * FROM {$this->table} LIMIT {$perPage} OFFSET {$offset}";
        $results = $this->db->query($sql);
        
        return [
            'data' => array_map([$this, 'castAttributes'], $results),
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage)
        ];
    }

    protected function filterFillable(array $data): array
    {
        if (empty($this->fillable)) {
            return $data;
        }
        
        return array_intersect_key($data, array_flip($this->fillable));
    }

    protected function castAttributes(array $attributes): array
    {
        foreach ($this->casts as $key => $type) {
            if (isset($attributes[$key])) {
                $attributes[$key] = $this->castAttribute($attributes[$key], $type);
            }
        }
        
        // Remove hidden attributes
        foreach ($this->hidden as $key) {
            unset($attributes[$key]);
        }
        
        return $attributes;
    }

    protected function castAttribute($value, string $type)
    {
        switch ($type) {
            case 'int':
            case 'integer':
                return (int) $value;
            case 'float':
            case 'double':
                return (float) $value;
            case 'bool':
            case 'boolean':
                return (bool) $value;
            case 'array':
            case 'json':
                return json_decode($value, true);
            case 'datetime':
                return new \DateTime($value);
            default:
                return $value;
        }
    }
}