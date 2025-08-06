<?php
class TenantMiddleware {
    private $db;
    private $tenant;
    private $currentTenant = null;

    public function __construct() {
        error_log("TenantMiddleware: Constructor called");
        
        if (!class_exists('Database')) {
            error_log("TenantMiddleware: ERROR - Database class not found");
            throw new Exception("Database class not available");
        }
        
        if (!class_exists('Tenant')) {
            error_log("TenantMiddleware: ERROR - Tenant class not found");
            throw new Exception("Tenant class not available");
        }
        
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tenant = new Tenant($this->db);
        
        error_log("TenantMiddleware: Initialized successfully");
    }

    public function identifyTenant($slug) {
        error_log("TenantMiddleware: Identifying tenant with slug: $slug");
        
        if (empty($slug)) {
            error_log("TenantMiddleware: Empty slug provided");
            return false;
        }

        if ($this->tenant->findBySlug($slug)) {
            $this->currentTenant = $this->tenant;
            error_log("TenantMiddleware: Tenant found: " . $this->tenant->name);
            return true;
        }

        error_log("TenantMiddleware: Tenant not found for slug: $slug");
        return false;
    }

    public function getCurrentTenant() {
        return $this->currentTenant;
    }

    public function getTenantConfig() {
        // Extract tenant slug from URL
        $requestUri = $_SERVER['REQUEST_URI'] ?? '';
        $path = parse_url($requestUri, PHP_URL_PATH);
        $segments = array_filter(explode('/', $path));
        
        if (empty($segments)) {
            error_log("TenantMiddleware: No segments in URL path");
            return null;
        }

        $slug = $segments[0];
        error_log("TenantMiddleware: Extracted slug from URL: $slug");

        if ($this->identifyTenant($slug)) {
            $config = $this->currentTenant->toArray();
            
            // Set default values for missing fields
            $defaults = [
                'logo_url' => '/assets/images/placeholder-logo.png',
                'favicon_url' => '/assets/images/placeholder-favicon.png',
                'hero_title' => 'Solicite seus Filmes e Séries favoritos',
                'hero_subtitle' => 'Sistema profissional de gerenciamento de solicitações',
                'hero_description' => 'Pesquise, solicite e acompanhe suas preferências de entretenimento.',
                'site_tagline' => 'Seu cinema na palma da mão',
                'site_description' => 'Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual.',
                'primary_color' => '#1E40AF',
                'secondary_color' => '#DC2626'
            ];

            foreach ($defaults as $key => $value) {
                if (empty($config[$key])) {
                    $config[$key] = $value;
                }
            }

            error_log("TenantMiddleware: Returning config for tenant: " . $config['name']);
            return $config;
        }

        error_log("TenantMiddleware: No tenant found for slug: $slug");
        return null;
    }
}
?>