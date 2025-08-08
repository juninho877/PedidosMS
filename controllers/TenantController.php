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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            error_log("TenantController::update() called");
            
            $tenant = $this->tenantService->getCurrentTenant();
            if (!$tenant) {
                error_log("No authenticated tenant found");
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                return;
            }

            error_log("Authenticated tenant: " . print_r($tenant, true));

            // Carregar dados atuais do tenant
            if (!$this->tenant->findBySlug($tenant->slug)) {
                error_log("Tenant not found by slug: " . $tenant->slug);
                http_response_code(404);
                echo json_encode(['error' => 'Cliente não encontrado']);
                return;
            }

            error_log("Current tenant data loaded successfully");
            error_log("POST data: " . print_r($_POST, true));
            error_log("FILES data: " . print_r($_FILES, true));

            // Create uploads directory if it doesn't exist
            $uploadDir = APP_ROOT . '/assets/uploads/tenants/';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0755, true)) {
                    error_log("Failed to create upload directory: " . $uploadDir);
                    http_response_code(500);
                    echo json_encode(['error' => 'Erro ao criar diretório de upload']);
                    return;
                }
            }

            // Handle file uploads
            $logoUrl = $this->tenant->logo_url;
            $faviconUrl = $this->tenant->favicon_url;

            if (isset($_FILES['logo_file']) && $_FILES['logo_file']['error'] === UPLOAD_ERR_OK) {
                $logoUrl = $this->handleFileUpload($_FILES['logo_file'], 'logo', $tenant->slug);
                if (!$logoUrl) {
                    error_log("Logo upload failed");
                    http_response_code(400);
                    echo json_encode(['error' => 'Erro no upload do logo']);
                    return;
                }
            }

            if (isset($_FILES['favicon_file']) && $_FILES['favicon_file']['error'] === UPLOAD_ERR_OK) {
                $faviconUrl = $this->handleFileUpload($_FILES['favicon_file'], 'favicon', $tenant->slug);
                if (!$faviconUrl) {
                    error_log("Favicon upload failed");
                    http_response_code(400);
                    echo json_encode(['error' => 'Erro no upload do favicon']);
                    return;
                }
            }

            error_log("File uploads completed. Logo: " . $logoUrl . ", Favicon: " . $faviconUrl);

            // Atualizar apenas os campos permitidos
            $this->tenant->hero_title = $_POST['hero_title'] ?? $this->tenant->hero_title;
            $this->tenant->hero_subtitle = $_POST['hero_subtitle'] ?? $this->tenant->hero_subtitle;
            $this->tenant->hero_description = $_POST['hero_description'] ?? $this->tenant->hero_description;
            $this->tenant->primary_color = $_POST['primary_color'] ?? $this->tenant->primary_color;
            $this->tenant->secondary_color = $_POST['secondary_color'] ?? $this->tenant->secondary_color;
            $this->tenant->logo_url = $logoUrl;
            $this->tenant->favicon_url = $faviconUrl;

            error_log("Tenant data prepared for update");

            if ($this->tenant->update()) {
                error_log("Tenant updated successfully");
                echo json_encode([
                    'success' => true, 
                    'message' => 'Configurações atualizadas com sucesso',
                    'tenant' => [
                        'hero_title' => $this->tenant->hero_title,
                        'hero_subtitle' => $this->tenant->hero_subtitle,
                        'hero_description' => $this->tenant->hero_description,
                        'primary_color' => $this->tenant->primary_color,
                        'secondary_color' => $this->tenant->secondary_color,
                        'logo_url' => $this->tenant->logo_url,
                        'favicon_url' => $this->tenant->favicon_url
                    ]
                ]);
            } else {
                error_log("Failed to update tenant in database");
                http_response_code(500);
                echo json_encode(['error' => 'Erro ao atualizar configurações']);
            }
        }
    }

    private function handleFileUpload($file, $type, $tenantSlug) {
        error_log("handleFileUpload called for type: $type, tenant: $tenantSlug");
        
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if ($type === 'favicon') {
            $allowedTypes[] = 'image/x-icon';
            $allowedTypes[] = 'image/vnd.microsoft.icon';
        }

        // Validate file type
        if (!in_array($file['type'], $allowedTypes)) {
            error_log("Invalid file type: " . $file['type']);
            return false;
        }

        // Validate file size (2MB max)
        if ($file['size'] > 2 * 1024 * 1024) {
            error_log("File too large: " . $file['size']);
            return false;
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $tenantSlug . '_' . $type . '_' . time() . '.' . $extension;
        $uploadPath = APP_ROOT . '/assets/uploads/tenants/' . $filename;
        $publicPath = '/assets/uploads/tenants/' . $filename;

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            error_log("File uploaded successfully: " . $publicPath);
            return $publicPath;
        }

        error_log("Failed to move uploaded file from " . $file['tmp_name'] . " to " . $uploadPath);
        return false;
    }
}
?>