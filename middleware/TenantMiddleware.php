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
            error_log("TENANT_MIDDLEWARE: ERROR - Slug vazio fornecido");
            return false;
        }

        error_log("TENANT_MIDDLEWARE: Iniciando identificação do tenant com slug: " . $slug);
        
        // Verificar se já temos um tenant atual
        if (self::$currentTenant && self::$currentTenant->slug === $slug) {
            error_log("TENANT_MIDDLEWARE: Tenant já identificado anteriormente: " . self::$currentTenant->name);
            return true;
        }

        if ($this->tenant->findBySlug($slug)) {
            self::$currentTenant = $this->tenant;
            
            error_log("TENANT_MIDDLEWARE: SUCCESS - Tenant encontrado e definido como atual");
            error_log("TENANT_MIDDLEWARE: - ID: " . $this->tenant->id);
            error_log("TENANT_MIDDLEWARE: - Nome: " . $this->tenant->name);
            error_log("TENANT_MIDDLEWARE: - Slug: " . $this->tenant->slug);
            error_log("TENANT_MIDDLEWARE: - Ativo: " . ($this->tenant->active ? 'SIM' : 'NÃO'));
            
            // Define constantes globais para o tenant atual
            if (!defined('CURRENT_TENANT_ID')) {
                define('CURRENT_TENANT_ID', $this->tenant->id);
                define('CURRENT_TENANT_SLUG', $this->tenant->slug);
                define('CURRENT_TENANT_NAME', $this->tenant->name);
                error_log("TENANT_MIDDLEWARE: Constantes globais definidas");
            }
            
            return true;
        }

        error_log("TENANT_MIDDLEWARE: ERROR - Tenant não encontrado para slug: " . $slug);
        return false;
    }

    public static function getCurrentTenant() {
        return self::$currentTenant;
    }

    public function requireTenant($slug) {
        if (!$this->identifyTenant($slug)) {
            error_log("TENANT_MIDDLEWARE: Falha ao identificar tenant, redirecionando para 404");
            // Tenant não encontrado - redirecionar para 404 ou página de erro
            http_response_code(404);
            include __DIR__ . '/../public/404.php';
            exit;
        }
        
        return self::$currentTenant;
    }

    public function getTenantConfig() {
        if (!self::$currentTenant) {
            error_log("TENANT_MIDDLEWARE: ERROR - getCurrentTenant é null ao tentar obter config");
            error_log("TENANT_MIDDLEWARE: Verificando se constantes estão definidas:");
            error_log("TENANT_MIDDLEWARE: - CURRENT_TENANT_ID: " . (defined('CURRENT_TENANT_ID') ? CURRENT_TENANT_ID : 'NÃO DEFINIDA'));
            error_log("TENANT_MIDDLEWARE: - CURRENT_TENANT_SLUG: " . (defined('CURRENT_TENANT_SLUG') ? CURRENT_TENANT_SLUG : 'NÃO DEFINIDA'));
            return null;
        }

        error_log("TENANT_MIDDLEWARE: SUCCESS - Retornando config para tenant: " . self::$currentTenant->name);

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
    
    public function debugCurrentState() {
        error_log("TENANT_MIDDLEWARE: === DEBUG STATE ===");
        error_log("TENANT_MIDDLEWARE: currentTenant is null: " . (self::$currentTenant === null ? 'TRUE' : 'FALSE'));
        if (self::$currentTenant) {
            error_log("TENANT_MIDDLEWARE: currentTenant->id: " . self::$currentTenant->id);
            error_log("TENANT_MIDDLEWARE: currentTenant->slug: " . self::$currentTenant->slug);
            error_log("TENANT_MIDDLEWARE: currentTenant->name: " . self::$currentTenant->name);
        }
        error_log("TENANT_MIDDLEWARE: === END DEBUG STATE ===");
    }
}
?>