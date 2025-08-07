<?php
class Tenant {
    private $conn;
    private $table = 'tenants';

    public $id;
    public $slug;
    public $name;
    public $password;
    public $logo_url;
    public $favicon_url;
    public $hero_title;
    public $hero_subtitle;
    public $hero_description;
    public $site_name;
    public $site_tagline;
    public $site_description;
    public $contact_email;
    public $contact_whatsapp;
    public $primary_color;
    public $secondary_color;
    public $active;
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
            $this->mapFromArray($row);
            return true;
        }
        return false;
    }

    public function findById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            $this->mapFromArray($row);
            return true;
        }
        return false;
    }

    public function login($slug, $password) {
        $query = "SELECT * FROM " . $this->table . " WHERE slug = :slug AND active = 1 LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            if (password_verify($password, $row['password'])) {
                $this->mapFromArray($row);
                return true;
            }
        }
        return false;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (slug, name, password, site_name, site_tagline, site_description, 
                   hero_title, hero_subtitle, hero_description, contact_email, 
                   contact_whatsapp, primary_color, secondary_color, logo_url, favicon_url) 
                  VALUES (:slug, :name, :password, :site_name, :site_tagline, :site_description,
                          :hero_title, :hero_subtitle, :hero_description, :contact_email,
                          :contact_whatsapp, :primary_color, :secondary_color, :logo_url, :favicon_url)";
        
        $stmt = $this->conn->prepare($query);
        
        $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':site_name', $data['site_name']);
        $stmt->bindParam(':site_tagline', $data['site_tagline']);
        $stmt->bindParam(':site_description', $data['site_description']);
        $stmt->bindParam(':hero_title', $data['hero_title']);
        $stmt->bindParam(':hero_subtitle', $data['hero_subtitle']);
        $stmt->bindParam(':hero_description', $data['hero_description']);
        $stmt->bindParam(':contact_email', $data['contact_email']);
        $stmt->bindParam(':contact_whatsapp', $data['contact_whatsapp']);
        $stmt->bindParam(':primary_color', $data['primary_color']);
        $stmt->bindParam(':secondary_color', $data['secondary_color']);
        $stmt->bindParam(':logo_url', $data['logo_url']);
        $stmt->bindParam(':favicon_url', $data['favicon_url']);

        return $stmt->execute();
    }

    public function update($data) {
        $query = "UPDATE " . $this->table . " SET 
                  name = :name,
                  site_name = :site_name,
                  site_tagline = :site_tagline,
                  site_description = :site_description,
                  hero_title = :hero_title,
                  hero_subtitle = :hero_subtitle,
                  hero_description = :hero_description,
                  contact_email = :contact_email,
                  contact_whatsapp = :contact_whatsapp,
                  primary_color = :primary_color,
                  secondary_color = :secondary_color,
                  logo_url = :logo_url,
                  favicon_url = :favicon_url,
                  updated_at = CURRENT_TIMESTAMP
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':site_name', $data['site_name']);
        $stmt->bindParam(':site_tagline', $data['site_tagline']);
        $stmt->bindParam(':site_description', $data['site_description']);
        $stmt->bindParam(':hero_title', $data['hero_title']);
        $stmt->bindParam(':hero_subtitle', $data['hero_subtitle']);
        $stmt->bindParam(':hero_description', $data['hero_description']);
        $stmt->bindParam(':contact_email', $data['contact_email']);
        $stmt->bindParam(':contact_whatsapp', $data['contact_whatsapp']);
        $stmt->bindParam(':primary_color', $data['primary_color']);
        $stmt->bindParam(':secondary_color', $data['secondary_color']);
        $stmt->bindParam(':logo_url', $data['logo_url']);
        $stmt->bindParam(':favicon_url', $data['favicon_url']);

        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function toArray() {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'logo_url' => $this->logo_url,
            'favicon_url' => $this->favicon_url,
            'hero_title' => $this->hero_title,
            'hero_subtitle' => $this->hero_subtitle,
            'hero_description' => $this->hero_description,
            'site_name' => $this->site_name,
            'site_tagline' => $this->site_tagline,
            'site_description' => $this->site_description,
            'contact_email' => $this->contact_email,
            'contact_whatsapp' => $this->contact_whatsapp,
            'primary_color' => $this->primary_color,
            'secondary_color' => $this->secondary_color,
            'active' => $this->active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }

    private function mapFromArray($row) {
        $this->id = $row['id'];
        $this->slug = $row['slug'];
        $this->name = $row['name'];
        $this->password = $row['password'];
        $this->logo_url = $row['logo_url'];
        $this->favicon_url = $row['favicon_url'];
        $this->hero_title = $row['hero_title'];
        $this->hero_subtitle = $row['hero_subtitle'];
        $this->hero_description = $row['hero_description'];
        $this->site_name = $row['site_name'];
        $this->site_tagline = $row['site_tagline'];
        $this->site_description = $row['site_description'];
        $this->contact_email = $row['contact_email'];
        $this->contact_whatsapp = $row['contact_whatsapp'];
        $this->primary_color = $row['primary_color'];
        $this->secondary_color = $row['secondary_color'];
        $this->active = $row['active'];
        $this->created_at = $row['created_at'];
        $this->updated_at = $row['updated_at'];
    }
}
?>