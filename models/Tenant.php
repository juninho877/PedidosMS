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

    public function login($slug, $password) {
        $query = "SELECT id, slug, name, password, logo_url, favicon_url, hero_title, hero_subtitle, hero_description, site_name, site_tagline, site_description, contact_email, contact_whatsapp, primary_color, secondary_color FROM " . $this->table . " WHERE slug = :slug AND active = 1 LIMIT 1";
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
                return true;
            }
        }
        return false;
    }
    public function findById($id) {
        $query = "SELECT id, slug, name, logo_url, favicon_url, hero_title, hero_subtitle, hero_description, site_name, site_tagline, site_description, contact_email, contact_whatsapp, primary_color, secondary_color, active, created_at, updated_at FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
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
            return $row;
        }
        return false;
    }

    public function findBySlug($slug) {
        error_log("TENANT_MODEL: === FINDBYSLUG START ===");
        error_log("TENANT_MODEL: Slug recebido: '" . $slug . "'");
        error_log("TENANT_MODEL: Tabela: " . $this->table);
        
        $query = "SELECT id, slug, name, logo_url, favicon_url, hero_title, hero_subtitle, hero_description, site_name, site_tagline, site_description, contact_email, contact_whatsapp, primary_color, secondary_color, active, created_at, updated_at FROM " . $this->table . " WHERE slug = :slug AND active = 1 LIMIT 1";
        error_log("TENANT_MODEL: Query: " . $query);
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();

        $rowCount = $stmt->rowCount();
        error_log("TENANT_MODEL: Query executada com sucesso");
        error_log("TENANT_MODEL: Número de linhas encontradas: " . $rowCount);

        if ($rowCount > 0) {
            $row = $stmt->fetch();
            error_log("TENANT_MODEL: SUCCESS - Tenant encontrado!");
            error_log("TENANT_MODEL: - ID: " . $row['id']);
            error_log("TENANT_MODEL: - Nome: " . $row['name']);
            error_log("TENANT_MODEL: - Slug: " . $row['slug']);
            error_log("TENANT_MODEL: - Ativo: " . ($row['active'] ? 'SIM' : 'NÃO'));
            
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
            $this->updated_at = $row['updated_at'];
            
            error_log("TENANT_MODEL: Propriedades do objeto definidas com sucesso");
            error_log("TENANT_MODEL: === FINDBYSLUG END - SUCCESS ===");
            return true;
        }
        
        error_log("TENANT_MODEL: ERROR - Nenhum tenant encontrado para slug: '" . $slug . "'");
        
        // Debug adicional - listar todos os tenants
        try {
            $debugQuery = "SELECT slug, name, active FROM " . $this->table;
            $debugStmt = $this->conn->prepare($debugQuery);
            $debugStmt->execute();
            $allTenants = $debugStmt->fetchAll();
            
            error_log("TENANT_MODEL: Tenants disponíveis no banco:");
            foreach ($allTenants as $tenant) {
                error_log("TENANT_MODEL: - Slug: '" . $tenant['slug'] . "', Nome: '" . $tenant['name'] . "', Ativo: " . ($tenant['active'] ? 'SIM' : 'NÃO'));
            }
        } catch (Exception $e) {
            error_log("TENANT_MODEL: Erro ao buscar tenants para debug: " . $e->getMessage());
        }
        
        error_log("TENANT_MODEL: === FINDBYSLUG END - FAILED ===");
        return false;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (slug, name, password, logo_url, favicon_url, hero_title, hero_subtitle, hero_description, site_name, site_tagline, site_description, contact_email, contact_whatsapp, primary_color, secondary_color) 
                  VALUES (:slug, :name, :password, :logo_url, :favicon_url, :hero_title, :hero_subtitle, :hero_description, :site_name, :site_tagline, :site_description, :contact_email, :contact_whatsapp, :primary_color, :secondary_color)";
        
        $stmt = $this->conn->prepare($query);
        
        // Hash the password
        $hashed_password = password_hash($data['password'] ?? 'cliente123', PASSWORD_DEFAULT);
        
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':logo_url', $data['logo_url']);
        $stmt->bindParam(':favicon_url', $data['favicon_url']);
        $stmt->bindParam(':hero_title', $data['hero_title']);
        $stmt->bindParam(':hero_subtitle', $data['hero_subtitle']);
        $stmt->bindParam(':hero_description', $data['hero_description']);
        $stmt->bindParam(':site_name', $data['site_name']);
        $stmt->bindParam(':site_tagline', $data['site_tagline']);
        $stmt->bindParam(':site_description', $data['site_description']);
        $stmt->bindParam(':contact_email', $data['contact_email']);
        $stmt->bindParam(':contact_whatsapp', $data['contact_whatsapp']);
        $stmt->bindParam(':primary_color', $data['primary_color']);
        $stmt->bindParam(':secondary_color', $data['secondary_color']);

        return $stmt->execute();
    }

    public function update($data) {
        $passwordUpdate = '';
        if (!empty($data['password'])) {
            $passwordUpdate = ', password = :password';
        }
        
        $query = "UPDATE " . $this->table . " 
                  SET name = :name, logo_url = :logo_url, favicon_url = :favicon_url, 
                      hero_title = :hero_title, hero_subtitle = :hero_subtitle, 
                      hero_description = :hero_description, site_name = :site_name, 
                      site_tagline = :site_tagline, site_description = :site_description,
                      contact_email = :contact_email, contact_whatsapp = :contact_whatsapp,
                      primary_color = :primary_color, secondary_color = :secondary_color, 
                      updated_at = CURRENT_TIMESTAMP" . $passwordUpdate . "
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':logo_url', $data['logo_url']);
        $stmt->bindParam(':favicon_url', $data['favicon_url']);
        $stmt->bindParam(':hero_title', $data['hero_title']);
        $stmt->bindParam(':hero_subtitle', $data['hero_subtitle']);
        $stmt->bindParam(':hero_description', $data['hero_description']);
        $stmt->bindParam(':site_name', $data['site_name']);
        $stmt->bindParam(':site_tagline', $data['site_tagline']);
        $stmt->bindParam(':site_description', $data['site_description']);
        $stmt->bindParam(':contact_email', $data['contact_email']);
        $stmt->bindParam(':contact_whatsapp', $data['contact_whatsapp']);
        $stmt->bindParam(':primary_color', $data['primary_color']);
        $stmt->bindParam(':secondary_color', $data['secondary_color']);
        
        if (!empty($data['password'])) {
            $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
            $stmt->bindParam(':password', $hashed_password);
        }

        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT id, slug, name, logo_url, favicon_url, hero_title, hero_subtitle, hero_description, site_name, site_tagline, site_description, contact_email, contact_whatsapp, primary_color, secondary_color, active, created_at, updated_at FROM " . $this->table . " ORDER BY created_at DESC";
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
}
?>