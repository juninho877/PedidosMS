<?php
error_log("TenantMiddleware.php: Arquivo sendo carregado");

class TenantMiddleware {
    private $tenant;
    private $currentTenant;

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
        $db = $database->getConnection();
        $this->tenant = new Tenant($db);
        
        error_log("TenantMiddleware: Inicializado com sucesso");
    }

    public function identifyTenant($slug = null) {
        error_log("TenantMiddleware: identifyTenant() chamado com slug: " . ($slug ?: 'null'));
        
        if (!$slug) {
            // Extrair slug da URL atual
            $requestUri = $_SERVER['REQUEST_URI'] ?? '';
            $path = parse_url($requestUri, PHP_URL_PATH);
            $segments = array_filter(explode('/', $path));
            
            if (empty($segments)) {
                error_log("TenantMiddleware: Nenhum segmento encontrado na URL");
                return false;
            }
            
            $slug = reset($segments); // Usar reset() em vez de $segments[0]
        }
        
        error_log("TenantMiddleware: Tentando carregar tenant com slug: $slug");
        
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
            // Tentar identificar tenant automaticamente
            if (!$this->identifyTenant()) {
                return null;
            }
        }
        
        return [
            'id' => $this->currentTenant->id,
            'slug' => $this->currentTenant->slug,
            'name' => $this->currentTenant->name,
            'site_name' => $this->currentTenant->site_name ?: $this->currentTenant->name,
            'site_tagline' => $this->currentTenant->site_tagline,
            'site_description' => $this->currentTenant->site_description,
            'hero_title' => $this->currentTenant->hero_title ?: 'Solicite seus Filmes e Séries favoritos',
            'hero_subtitle' => $this->currentTenant->hero_subtitle ?: $this->currentTenant->site_tagline,
            'hero_description' => $this->currentTenant->hero_description ?: $this->currentTenant->site_description,
            'contact_email' => $this->currentTenant->contact_email,
            'contact_whatsapp' => $this->currentTenant->contact_whatsapp,
            'logo_url' => $this->currentTenant->logo_url ?: '/assets/images/placeholder-logo.png',
            'favicon_url' => $this->currentTenant->favicon_url ?: '/assets/images/placeholder-favicon.png',
            'primary_color' => $this->currentTenant->primary_color ?: '#3b82f6',
            'secondary_color' => $this->currentTenant->secondary_color ?: '#ef4444'
        ];
    }

    public function requireTenant() {
        if (!$this->identifyTenant()) {
            http_response_code(404);
            include '404.php';
            exit;
        }
        return $this->getCurrentTenant();
    }
}

error_log("TenantMiddleware.php: Classe TenantMiddleware definida com sucesso");
?>