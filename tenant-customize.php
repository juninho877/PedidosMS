<?php
require_once 'config/config.php';

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    header('Location: /');
    exit;
}

// Verificar se o tenant existe e está autenticado
$tenantMiddleware = new TenantMiddleware();
if (!$tenantMiddleware->validateTenantSlug($slug)) {
    header('Location: /');
    exit;
}

// Verificar autenticação do tenant
$tenant_data = $tenantMiddleware->requireTenantAuth();

// Carregar dados completos do tenant
$database = new Database();
$db = $database->getConnection();
$tenant = new Tenant($db);
$tenant->findBySlug($slug);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personalizar Site - <?php echo $tenant->site_name ?: $tenant->name; ?></title>
    
    <?php if ($tenant->favicon_url): ?>
    <link rel="icon" href="<?php echo $tenant->favicon_url; ?>">
    <?php endif; ?>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <style>
        :root {
            --primary-color: <?php echo $tenant->primary_color ?: '#3B82F6'; ?>;
            --secondary-color: <?php echo $tenant->secondary_color ?: '#EF4444'; ?>;
        }
        .btn-primary {
            background-color: var(--primary-color);
        }
        .btn-primary:hover {
            filter: brightness(0.9);
        }
        .text-primary {
            color: var(--primary-color);
        }
        .border-primary {
            border-color: var(--primary-color);
        }
        .focus-primary:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <a href="/<?php echo $slug; ?>" class="flex items-center space-x-3 group">
                    <?php if ($tenant->logo_url): ?>
                        <img src="<?php echo $tenant->logo_url; ?>" alt="<?php echo $tenant->site_name; ?>" class="h-8 w-8 sm:h-10 sm:w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:opacity-80 transition-opacity"></i>
                    <?php endif; ?>
                    <span class="text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors">
                        <?php echo $tenant->site_name ?: $tenant->name; ?>
                    </span>
                </a>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-slate-300 hover:text-white p-2">
                        <i data-lucide="menu" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <a href="/<?php echo $slug; ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Site</span>
                    </a>

                    <a href="/<?php echo $slug; ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Pesquisar</span>
                    </a>

                    <a href="/<?php echo $slug; ?>/dashboard" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="layout-dashboard" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Dashboard</span>
                    </a>

                    <a href="/<?php echo $slug; ?>/customize" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors btn-primary text-white text-sm lg:text-base">
                        <i data-lucide="palette" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Personalizar</span>
                    </a>

                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm lg:text-base"
                    >
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Sair</span>
                    </button>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-slate-700 py-4">
                <div class="space-y-2">
                    <a href="/<?php echo $slug; ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Site</span>
                    </a>
                    <a href="/<?php echo $slug; ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>
                    <a href="/<?php echo $slug; ?>/dashboard" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="layout-dashboard" class="h-4 w-4"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="/<?php echo $slug; ?>/customize" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors btn-primary text-white">
                        <i data-lucide="palette" class="h-4 w-4"></i>
                        <span>Personalizar</span>
                    </a>
                    <button
                        id="logoutBtnMobile"
                        class="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-left"
                    >
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <div class="min-h-screen bg-slate-900">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Personalizar Site</h1>
                <p class="text-sm sm:text-base text-slate-400">Configure a aparência e conteúdo do seu site de solicitações</p>
            </div>

            <!-- Form -->
            <form id="customizeForm" class="space-y-8">
                <!-- Hero Section -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                        <i data-lucide="type" class="h-5 w-5 text-primary"></i>
                        <span>Seção Principal (Hero)</span>
                    </h2>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                id="hero_title"
                                name="hero_title"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus-primary focus:border-transparent"
                                placeholder="Ex: Solicite seus Filmes e Séries favoritos"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                id="hero_subtitle"
                                name="hero_subtitle"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus-primary focus:border-transparent"
                                placeholder="Ex: Sistema profissional de gerenciamento"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Descrição
                            </label>
                            <textarea
                                id="hero_description"
                                name="hero_description"
                                rows="3"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus-primary focus:border-transparent"
                                placeholder="Ex: Pesquise, solicite e acompanhe suas preferências de entretenimento."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- Colors Section -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                        <i data-lucide="palette" class="h-5 w-5 text-primary"></i>
                        <span>Cores do Site</span>
                    </h2>
                    
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Cor Primária
                            </label>
                            <div class="flex items-center space-x-3">
                                <input
                                    type="color"
                                    id="primary_color"
                                    name="primary_color"
                                    class="w-12 h-12 rounded-lg border border-slate-600 bg-slate-700 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    id="primary_color_text"
                                    class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus-primary focus:border-transparent"
                                    placeholder="#3B82F6"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Cor Secundária
                            </label>
                            <div class="flex items-center space-x-3">
                                <input
                                    type="color"
                                    id="secondary_color"
                                    name="secondary_color"
                                    class="w-12 h-12 rounded-lg border border-slate-600 bg-slate-700 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    id="secondary_color_text"
                                    class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus-primary focus:border-transparent"
                                    placeholder="#EF4444"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Images Section -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                        <i data-lucide="image" class="h-5 w-5 text-primary"></i>
                        <span>Imagens do Site</span>
                    </h2>
                    
                    <div class="grid sm:grid-cols-2 gap-6">
                        <!-- Logo -->
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Logo do Site
                            </label>
                            <div class="space-y-4">
                                <div class="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors cursor-pointer" id="logo-drop-zone">
                                    <div class="text-center" id="logo-placeholder">
                                        <i data-lucide="upload" class="h-8 w-8 text-slate-400 mx-auto mb-2"></i>
                                        <p class="text-sm text-slate-400">Clique ou arraste uma imagem</p>
                                        <p class="text-xs text-slate-500">PNG, JPG até 2MB</p>
                                    </div>
                                    <img id="logo-preview" class="hidden w-full h-full object-contain rounded-lg" />
                                </div>
                                <input
                                    type="file"
                                    id="logo_file"
                                    name="logo_file"
                                    accept="image/*"
                                    class="hidden"
                                />
                                <button
                                    type="button"
                                    id="remove-logo"
                                    class="hidden w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                                >
                                    Remover Logo
                                </button>
                            </div>
                        </div>

                        <!-- Favicon -->
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">
                                Favicon (Ícone do Site)
                            </label>
                            <div class="space-y-4">
                                <div class="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 transition-colors cursor-pointer" id="favicon-drop-zone">
                                    <div class="text-center" id="favicon-placeholder">
                                        <i data-lucide="upload" class="h-8 w-8 text-slate-400 mx-auto mb-2"></i>
                                        <p class="text-sm text-slate-400">Clique ou arraste uma imagem</p>
                                        <p class="text-xs text-slate-500">ICO, PNG 32x32px</p>
                                    </div>
                                    <img id="favicon-preview" class="hidden w-16 h-16 object-contain rounded" />
                                </div>
                                <input
                                    type="file"
                                    id="favicon_file"
                                    name="favicon_file"
                                    accept="image/*,.ico"
                                    class="hidden"
                                />
                                <button
                                    type="button"
                                    id="remove-favicon"
                                    class="hidden w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                                >
                                    Remover Favicon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preview Section -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                        <i data-lucide="eye" class="h-5 w-5 text-primary"></i>
                        <span>Pré-visualização</span>
                    </h2>
                    
                    <div class="bg-slate-900 rounded-lg p-6 border border-slate-600">
                        <div class="text-center">
                            <h1 id="preview-title" class="text-2xl sm:text-3xl font-bold text-white mb-4">
                                Solicite seus Filmes e Séries favoritos
                            </h1>
                            <p id="preview-description" class="text-slate-300 mb-6">
                                Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual.
                            </p>
                            <button id="preview-button" class="btn-primary text-white px-6 py-3 rounded-lg font-semibold">
                                Começar Pesquisa
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        id="previewBtn"
                        class="flex-1 flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        <i data-lucide="eye" class="h-5 w-5"></i>
                        <span>Visualizar Site</span>
                    </button>
                    <button
                        type="submit"
                        id="saveBtn"
                        class="flex-1 flex items-center justify-center space-x-2 btn-primary hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        <i data-lucide="save" class="h-5 w-5"></i>
                        <span>Salvar Alterações</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Success Modal -->
    <div id="successModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 text-center">
            <i data-lucide="check-circle" class="h-16 w-16 text-green-400 mx-auto mb-4"></i>
            <h3 class="text-xl font-bold text-white mb-2">Alterações Salvas!</h3>
            <p class="text-slate-400 mb-6">Suas personalizações foram aplicadas com sucesso.</p>
            <button
                id="closeSuccessModal"
                class="w-full btn-primary hover:opacity-90 text-white py-3 rounded-lg font-medium transition-colors"
            >
                Continuar
            </button>
        </div>
    </div>

    <script>
        // Pass tenant data to JavaScript
        window.TENANT_SLUG = '<?php echo $slug; ?>';
        window.TENANT_DATA = <?php echo json_encode([
            'id' => $tenant->id,
            'slug' => $tenant->slug,
            'name' => $tenant->name,
            'site_name' => $tenant->site_name,
            'hero_title' => $tenant->hero_title,
            'hero_subtitle' => $tenant->hero_subtitle,
            'hero_description' => $tenant->hero_description,
            'primary_color' => $tenant->primary_color,
            'secondary_color' => $tenant->secondary_color,
            'logo_url' => $tenant->logo_url,
            'favicon_url' => $tenant->favicon_url
        ]); ?>;
    </script>
    <script src="/assets/js/tenant-customize.js"></script>
    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            const icon = this.querySelector('i');
            
            menu.classList.toggle('hidden');
            
            if (menu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            
            lucide.createIcons();
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/tenant.php/logout', { method: 'POST' });
                window.location.href = `/${window.TENANT_SLUG}/login`;
            } catch (error) {
                window.location.href = `/${window.TENANT_SLUG}/login`;
            }
        });

        document.getElementById('logoutBtnMobile').addEventListener('click', async () => {
            try {
                await fetch('/api/tenant.php/logout', { method: 'POST' });
                window.location.href = `/${window.TENANT_SLUG}/login`;
            } catch (error) {
                window.location.href = `/${window.TENANT_SLUG}/login`;
            }
        });

        lucide.createIcons();
    </script>
</body>
</html>