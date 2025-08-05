<?php
class TenantMiddleware {
    private $db;
    private $tenant;
    private static $currentTenant = null;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tenant = new Tenant($this->db);
    }

    public function identifyTenant($slug) {
        if (empty($slug)) {
            return false;
        }

        if ($this->tenant->findBySlug($slug)) {
            self::$currentTenant = $this->tenant;
            
            // Define constantes globais para o tenant atual
            define('CURRENT_TENANT_ID', $this->tenant->id);
            define('CURRENT_TENANT_SLUG', $this->tenant->slug);
            define('CURRENT_TENANT_NAME', $this->tenant->name);
            
            return true;
        }

        return false;
    }

    public static function getCurrentTenant() {
        return self::$currentTenant;
    }

    public function requireTenant($slug) {
        if (!$this->identifyTenant($slug)) {
            // Tenant não encontrado - redirecionar para 404 ou página de erro
            http_response_code(404);
            include 'public/404.php';
            exit;
        }
        
        return self::$currentTenant;
    }

    public function getTenantConfig() {
        if (!self::$currentTenant) {
            return null;
        }

        return [
            'id' => self::$currentTenant->id,
            'slug' => self::$currentTenant->slug,
            'name' => self::$currentTenant->name,
            'logo_url' => self::$currentTenant->logo_url ?: '/assets/images/default-logo.png',
            'favicon_url' => self::$currentTenant->favicon_url ?: '/assets/images/default-favicon.ico',
            'hero_title' => self::$currentTenant->hero_title ?: 'Solicite seus Filmes e Séries favoritos',
            'hero_subtitle' => self::$currentTenant->hero_subtitle ?: 'Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual',
            'hero_description' => self::$currentTenant->hero_description ?: 'Pesquise, solicite e acompanhe suas preferências de entretenimento.',
            'primary_color' => self::$currentTenant->primary_color ?: '#1E40AF',
            'secondary_color' => self::$currentTenant->secondary_color ?: '#DC2626'
        ];
    }
}
?>