<?php
class Tenant {
    private $conn;
    private $table = 'tenants';

    public $id;
    public $slug;
    public $name;
    public $logo_url;
    public $favicon_url;
    public $hero_title;
    public $hero_subtitle;
    public $hero_description;
    public $primary_color;
    public $secondary_color;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findBySlug($slug) {
        $query = "SELECT * FROM " . $this->table . " WHERE slug = :slug AND active = 1 LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            $this->id = $row['id'];
            $this->slug = $row['slug'];
            $this->name = $row['name'];
            $this->logo_url = $row['logo_url'];
            $this->favicon_url = $row['favicon_url'];
            $this->hero_title = $row['hero_title'];
            $this->hero_subtitle = $row['hero_subtitle'];
            $this->hero_description = $row['hero_description'];
            $this->primary_color = $row['primary_color'];
            $this->secondary_color = $row['secondary_color'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (slug, name, logo_url, favicon_url, hero_title, hero_subtitle, hero_description, primary_color, secondary_color) 
                  VALUES (:slug, :name, :logo_url, :favicon_url, :hero_title, :hero_subtitle, :hero_description, :primary_color, :secondary_color)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':logo_url', $data['logo_url']);
        $stmt->bindParam(':favicon_url', $data['favicon_url']);
        $stmt->bindParam(':hero_title', $data['hero_title']);
        $stmt->bindParam(':hero_subtitle', $data['hero_subtitle']);
        $stmt->bindParam(':hero_description', $data['hero_description']);
        $stmt->bindParam(':primary_color', $data['primary_color']);
        $stmt->bindParam(':secondary_color', $data['secondary_color']);

        return $stmt->execute();
    }

    public function update($data) {
        $query = "UPDATE " . $this->table . " 
                  SET name = :name, logo_url = :logo_url, favicon_url = :favicon_url, 
                      hero_title = :hero_title, hero_subtitle = :hero_subtitle, 
                      hero_description = :hero_description, primary_color = :primary_color, 
                      secondary_color = :secondary_color, updated_at = CURRENT_TIMESTAMP
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':logo_url', $data['logo_url']);
        $stmt->bindParam(':favicon_url', $data['favicon_url']);
        $stmt->bindParam(':hero_title', $data['hero_title']);
        $stmt->bindParam(':hero_subtitle', $data['hero_subtitle']);
        $stmt->bindParam(':hero_description', $data['hero_description']);
        $stmt->bindParam(':primary_color', $data['primary_color']);
        $stmt->bindParam(':secondary_color', $data['secondary_color']);

        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function delete($id) {
        $query = "UPDATE " . $this->table . " SET active = 0 WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function slugExists($slug, $excludeId = null) {
        $query = "SELECT id FROM " . $this->table . " WHERE slug = :slug";
        if ($excludeId) {
            $query .= " AND id != :exclude_id";
        }
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        if ($excludeId) {
            $stmt->bindParam(':exclude_id', $excludeId);
        }
        
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>