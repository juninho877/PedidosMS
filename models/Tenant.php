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
                $this->id = $row['id'];
                $this->slug = $row['slug'];
                $this->name = $row['name'];
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
                return true;
            }
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (slug, name, password, site_name, site_tagline, site_description, hero_title, hero_subtitle, hero_description, contact_email, contact_whatsapp, primary_color, secondary_color) 
                  VALUES (:slug, :name, :password, :site_name, :site_tagline, :site_description, :hero_title, :hero_subtitle, :hero_description, :contact_email, :contact_whatsapp, :primary_color, :secondary_color)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':slug', $this->slug);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':site_name', $this->site_name);
        $stmt->bindParam(':site_tagline', $this->site_tagline);
        $stmt->bindParam(':site_description', $this->site_description);
        $stmt->bindParam(':hero_title', $this->hero_title);
        $stmt->bindParam(':hero_subtitle', $this->hero_subtitle);
        $stmt->bindParam(':hero_description', $this->hero_description);
        $stmt->bindParam(':contact_email', $this->contact_email);
        $stmt->bindParam(':contact_whatsapp', $this->contact_whatsapp);
        $stmt->bindParam(':primary_color', $this->primary_color);
        $stmt->bindParam(':secondary_color', $this->secondary_color);

        return $stmt->execute();
    }

    public function update() {
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
                  favicon_url = :favicon_url
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':site_name', $this->site_name);
        $stmt->bindParam(':site_tagline', $this->site_tagline);
        $stmt->bindParam(':site_description', $this->site_description);
        $stmt->bindParam(':hero_title', $this->hero_title);
        $stmt->bindParam(':hero_subtitle', $this->hero_subtitle);
        $stmt->bindParam(':hero_description', $this->hero_description);
        $stmt->bindParam(':contact_email', $this->contact_email);
        $stmt->bindParam(':contact_whatsapp', $this->contact_whatsapp);
        $stmt->bindParam(':primary_color', $this->primary_color);
        $stmt->bindParam(':secondary_color', $this->secondary_color);
        $stmt->bindParam(':logo_url', $this->logo_url);
        $stmt->bindParam(':favicon_url', $this->favicon_url);
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute();
    }
}
?>