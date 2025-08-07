<?php
class TenantMiddleware {
    private $db;
    private $tenant;
    private $currentTenant = null;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->tenant = new Tenant($this->db);
    }

    public function identifyTenant($slug = null) {
        if ($slug === null) {
            $requestUri = $_SERVER['REQUEST_URI'] ?? '';
            $segments = array_filter(explode('/', trim($requestUri, '/')));
            $slug = reset($segments);
        }

        if (empty($slug)) {
            return false;
        }

        if ($this->tenant->findBySlug($slug)) {
            $this->currentTenant = $this->tenant;
            return true;
        }

        return false;
    }

    public function getCurrentTenant() {
        return $this->currentTenant;
    }

    public function getTenantConfig() {
        if (!$this->currentTenant) {
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
?>