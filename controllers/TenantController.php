<?php
class TenantController {
    private $db;
    private $tenant;
    private $tenantService;

    public function __construct() {
        try {
            $database = new Database();
            $this->db = $database->getConnection();
            $this->tenant = new Tenant($this->db);
            $this->tenantService = new TenantService();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro interno do servidor']);
            exit;
        }
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    http_response_code(400);
                    echo json_encode(['error' => 'JSON inválido']);
                    return;
                }
            
                $slug = filter_var($input['slug'] ?? '', FILTER_SANITIZE_STRING);
                $password = $input['password'] ?? '';

                if (empty($slug) || empty($password)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Slug e senha são obrigatórios']);
                    return;
                }

                if ($this->tenant->login($slug, $password)) {
                    $tenant_data = [
                        'id' => $this->tenant->id,
                        'slug' => $this->tenant->slug,
                        'name' => $this->tenant->name,
                        'site_name' => $this->tenant->site_name
                    ];

                    $token = $this->tenantService->generateTenantToken($tenant_data);
                    $this->tenantService->setTenantCookie($token);

                    echo json_encode([
                        'success' => true,
                        'token' => $token,
                        'tenant' => $tenant_data
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'Credenciais inválidas']);
                }
            } catch (Exception $e) {
                error_log("Tenant login error: " . $e->getMessage());
                http_response_code(401);
                echo json_encode(['error' => 'Erro interno do servidor']);
            }
        }
    }

    public function logout() {
        $this->tenantService->clearTenantCookie();
        echo json_encode(['success' => true]);
    }

    public function me() {
        $tenant = $this->tenantService->getCurrentTenant();
        if ($tenant) {
            echo json_encode(['tenant' => $tenant]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Não autorizado']);
        }
    }

    public function getBySlug($slug) {
        if ($this->tenant->findBySlug($slug)) {
            echo json_encode([
                'id' => $this->tenant->id,
                'slug' => $this->tenant->slug,
                'name' => $this->tenant->name,
                'logo_url' => $this->tenant->logo_url,
                'favicon_url' => $this->tenant->favicon_url,
                'hero_title' => $this->tenant->hero_title,
                'hero_subtitle' => $this->tenant->hero_subtitle,
                'hero_description' => $this->tenant->hero_description,
                'site_name' => $this->tenant->site_name,
                'site_tagline' => $this->tenant->site_tagline,
                'site_description' => $this->tenant->site_description,
                'contact_email' => $this->tenant->contact_email,
                'contact_whatsapp' => $this->tenant->contact_whatsapp,
                'primary_color' => $this->tenant->primary_color,
                'secondary_color' => $this->tenant->secondary_color
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Cliente não encontrado']);
        }
    }

    public function update() {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $tenant = $this->tenantService->getCurrentTenant();
            if (!$tenant) {
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            // Carregar dados atuais do tenant
            if (!$this->tenant->findBySlug($tenant['slug'])) {
                http_response_code(404);
                echo json_encode(['error' => 'Cliente não encontrado']);
                return;
            }

            // Atualizar apenas os campos permitidos
            $this->tenant->name = $input['name'] ?? $this->tenant->name;
            $this->tenant->site_name = $input['site_name'] ?? $this->tenant->site_name;
            $this->tenant->site_tagline = $input['site_tagline'] ?? $this->tenant->site_tagline;
            $this->tenant->site_description = $input['site_description'] ?? $this->tenant->site_description;
            $this->tenant->hero_title = $input['hero_title'] ?? $this->tenant->hero_title;
            $this->tenant->hero_subtitle = $input['hero_subtitle'] ?? $this->tenant->hero_subtitle;
            $this->tenant->hero_description = $input['hero_description'] ?? $this->tenant->hero_description;
            $this->tenant->contact_email = $input['contact_email'] ?? $this->tenant->contact_email;
            $this->tenant->contact_whatsapp = $input['contact_whatsapp'] ?? $this->tenant->contact_whatsapp;
            $this->tenant->primary_color = $input['primary_color'] ?? $this->tenant->primary_color;
            $this->tenant->secondary_color = $input['secondary_color'] ?? $this->tenant->secondary_color;
            $this->tenant->logo_url = $input['logo_url'] ?? $this->tenant->logo_url;
            $this->tenant->favicon_url = $input['favicon_url'] ?? $this->tenant->favicon_url;

            if ($this->tenant->update()) {
                echo json_encode(['success' => true, 'message' => 'Configurações atualizadas com sucesso']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erro ao atualizar configurações']);
            }
        }
    }
}
?>