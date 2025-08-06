<?php
error_log("TenantMiddleware.php: Arquivo sendo carregado");

class TenantMiddleware {
    private $db;
    private $tenant;
    private $currentTenant = null;

    public function __construct() {
        error_log("TenantMiddleware: Constructor chamado");
        
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

    public function identifyTenant($slug) {
        error_log("TenantMiddleware: Identificando tenant com slug: $slug");
        
        if (empty($slug)) {
            error_log("TenantMiddleware: Slug vazio fornecido");
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
        // Extrair slug do tenant da URL
        $requestUri = $_SERVER['REQUEST_URI'] ?? '';
        $path = parse_url($requestUri, PHP_URL_PATH);
        $segments = array_filter(explode('/', $path));
        
        if (empty($segments)) {
            error_log("TenantMiddleware: Nenhum segmento na URL");
            return null;
        }

        $slug = $segments[0];
        error_log("TenantMiddleware: Slug extraído da URL: $slug");

        if ($this->identifyTenant($slug)) {
            $config = $this->currentTenant->toArray();
            
            // Definir valores padrão para campos faltantes
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

            error_log("TenantMiddleware: Retornando config para tenant: " . $config['name']);
            return $config;
        }

        error_log("TenantMiddleware: Nenhum tenant encontrado para slug: $slug");
        return null;
    }
}

error_log("TenantMiddleware.php: Classe TenantMiddleware definida com sucesso");
?>