<?php
require_once 'config/config.php';

$slug = $_GET['slug'] ?? '';
$type = $_GET['type'] ?? '';
$id = $_GET['id'] ?? '';

if (empty($slug) || empty($type) || empty($id) || !in_array($type, ['movie', 'tv'])) {
    header('Location: /');
    exit;
}

// Verificar se o tenant existe
$tenantMiddleware = new TenantMiddleware();
if (!$tenantMiddleware->validateTenantSlug($slug)) {
    header('Location: /');
    exit;
}

// Carregar dados do tenant
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
    <title>Detalhes - <?php echo $tenant->site_name ?: $tenant->name; ?></title>
    
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
        .btn-secondary {
            background-color: var(--secondary-color);
        }
        .btn-secondary:hover {
            filter: brightness(0.9);
        }
        .text-primary {
            color: var(--primary-color);
        }
        .text-secondary {
            color: var(--secondary-color);
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
                        <span class="hidden lg:inline">Início</span>
                    </a>

                    <a href="/<?php echo $slug; ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Pesquisar</span>
                    </a>

                    <a href="/<?php echo $slug; ?>/login" class="flex items-center space-x-2 px-3 lg:px-4 py-2 btn-primary hover:opacity-90 text-white rounded-lg transition-colors text-sm lg:text-base">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Painel</span>
                    </a>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-slate-700 py-4">
                <div class="space-y-2">
                    <a href="/<?php echo $slug; ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>
                    <a href="/<?php echo $slug; ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>
                    <a href="/<?php echo $slug; ?>/login" class="flex items-center space-x-2 px-3 py-2 btn-primary hover:opacity-90 text-white rounded-lg transition-colors">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span>Painel</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div id="contentDetails" class="min-h-screen bg-slate-900">
        <!-- Loading state -->
        <div id="loadingDetails" class="min-h-screen bg-slate-900 flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    </div>

    <!-- Request Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script>
        // Pass tenant data to JavaScript
        window.TENANT_SLUG = '<?php echo $slug; ?>';
        window.TENANT_DATA = <?php echo json_encode([
            'id' => $tenant->id,
            'slug' => $tenant->slug,
            'name' => $tenant->name,
            'site_name' => $tenant->site_name
        ]); ?>;
    </script>
    <script src="/assets/js/details.js"></script>
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

        // Initialize the app with PHP values
        new DetailsApp('<?php echo $type; ?>', '<?php echo $id; ?>');
    </script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>