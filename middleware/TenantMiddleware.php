<?php
class TenantMiddleware {
    private $tenantService;

    public function __construct() {
        $this->tenantService = new TenantService();
    }

    public function requireTenantAuth() {
        $tenant = $this->tenantService->getCurrentTenant();
        
        if (!$tenant) {
            if ($this->isAjaxRequest()) {
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                exit;
            } else {
                // Redirecionar para login do tenant baseado no slug da URL
                $slug = $this->extractSlugFromUrl();
                header('Location: /' . $slug . '/login');
                exit;
            }
        }

        return $tenant;
    }

    public function redirectIfTenantAuthenticated() {
        $tenant = $this->tenantService->getCurrentTenant();
        
        if ($tenant) {
            header('Location: /' . $tenant['slug'] . '/dashboard');
            exit;
        }
    }

    public function extractSlugFromUrl() {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $segments = explode('/', trim($path, '/'));
        return $segments[0] ?? '';
    }

    public function validateTenantSlug($slug) {
        $database = new Database();
        $db = $database->getConnection();
        $tenant = new Tenant($db);
        
        return $tenant->findBySlug($slug);
    }

    private function isAjaxRequest() {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
               strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    }
}
?>