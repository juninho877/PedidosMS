<?php
error_log("TenantMiddleware.php: Arquivo sendo carregado");

class TenantMiddleware {
    private $db;
    private $tenant;
    private $currentTenant = null;

    public function __construct() {
        if (!class_exists('Database')) {
            error_log("TenantMiddleware: ERRO - Classe Database não encontrada");
            throw new Exception("Database class not available");
        }
        
        if (!class_exists('Tenant')) {
            error_log("TenantMiddleware: ERRO - Classe Tenant não encontrada");
            throw new Exception("Tenant class not available");
        }
        
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tenant = new Tenant($this->db);
        
        error_log("TenantMiddleware: Inicializado com sucesso");
    }

    public function identifyTenant($slug = null) {
        error_log("TenantMiddleware: identifyTenant() chamado com slug: " . ($slug ?? 'null'));
        
        if ($slug === null) {
            // Extrair slug da URL atual
            $requestUri = $_SERVER['REQUEST_URI'] ?? '';
            $segments = array_filter(explode('/', trim($requestUri, '/')));
            $slug = reset($segments);
        }

        if (empty($slug)) {
            error_log("TenantMiddleware: Slug vazio");
            return false;
        }

        if ($this->tenant->findBySlug($slug)) {
            $this->currentTenant = $this->tenant;
            error_log("TenantMiddleware: Tenant encontrado: " . $this->tenant->name);
            return true;
        }

        error_log("TenantMiddleware: Tenant não encontrado para slug: $slug");
        return false;
    }

    public function getCurrentTenant() {
        return $this->currentTenant;
    }

    public function getTenantConfig() {
        if (!$this->currentTenant) {
            // Tentar identificar automaticamente
            if (!$this->identifyTenant()) {
                return null;
            }
        }

        return [
            'id' => $this->currentTenant->id,
            'slug' => $this->currentTenant->slug,
            'name' => $this->currentTenant->name,
            'site_name' => $this->currentTenant->site_name,
            'site_tagline' => $this->currentTenant->site_tagline,
            'site_description' => $this->currentTenant->site_description,
            'hero_title' => $this->currentTenant->hero_title,
            'hero_subtitle' => $this->currentTenant->hero_subtitle,
            'hero_description' => $this->currentTenant->hero_description,
            'contact_email' => $this->currentTenant->contact_email,
            'contact_whatsapp' => $this->currentTenant->contact_whatsapp,
            'logo_url' => $this->currentTenant->logo_url,
            'favicon_url' => $this->currentTenant->favicon_url,
            'primary_color' => $this->currentTenant->primary_color,
            'secondary_color' => $this->currentTenant->secondary_color
        ];
    }

    public function requireTenant() {
        if (!$this->identifyTenant()) {
            http_response_code(404);
            include '../public/404.php';
            exit;
        }
        return $this->currentTenant;
    }
}

error_log("TenantMiddleware.php: Classe TenantMiddleware definida com sucesso");
?>