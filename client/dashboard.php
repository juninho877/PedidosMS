<?php
require_once '../config/config.php';

$middleware = new ClientAuthMiddleware();
$client = $middleware->requireClientAuth();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo htmlspecialchars($client['site_name']); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo htmlspecialchars($client['favicon_url'] ?? '/assets/images/placeholder-favicon.png'); ?>">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($client['primary_color'] ?? '#3b82f6'); ?>;
            --secondary-color: <?php echo htmlspecialchars($client['secondary_color'] ?? '#ef4444'); ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .text-secondary { color: var(--secondary-color); }
        
        .tab-button.active {
            background-color: var(--primary-color);
            color: white;
        }
        
        .tab-button:not(.active) {
            color: #94a3b8;
        }
        
        .tab-button:not(.active):hover {
            color: white;
            background-color: #374151;
        }
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <a href="/<?php echo htmlspecialchars($client['slug']); ?>" class="flex items-center space-x-3 group">
                    <?php if (!empty($client['logo_url'])): ?>
                        <img src="<?php echo htmlspecialchars($client['logo_url']); ?>" alt="Logo" class="h-8 w-8 sm:h-10 sm:w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <?php endif; ?>
                    <span class="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo htmlspecialchars($client['site_name'] ?? $client['name']); ?> - Dashboard
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
                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Site Público</span>
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
                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Site Público</span>
                    </a>
                    <button
                        id="logoutBtnMobile"
                        class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors w-full text-left"
                    >
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <div class="min-h-screen bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">
                    Dashboard - <?php echo htmlspecialchars($client['site_name'] ?? $client['name']); ?>
                </h1>
                <p class="text-slate-400">
                    Bem-vindo ao painel de controle do seu site
                </p>
            </div>

            <!-- Tabs -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg mb-8">
                <div class="flex flex-wrap border-b border-slate-700">
                    <button
                        id="overviewTab"
                        class="tab-button flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors active"
                    >
                        <i data-lucide="bar-chart-3" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                        <span class="hidden sm:inline">Visão Geral</span>
                        <span class="sm:hidden">Geral</span>
                    </button>
                    <button
                        id="requestsTab"
                        class="tab-button flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors"
                    >
                        <i data-lucide="file-text" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                        <span class="hidden sm:inline">Solicitações</span>
                        <span class="sm:hidden">Pedidos</span>
                    </button>
                    <button
                        id="settingsTab"
                        class="tab-button flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors"
                    >
                        <i data-lucide="settings" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                        <span class="hidden sm:inline">Configurações</span>
                        <span class="sm:hidden">Config</span>
                    </button>
                    <button
                        id="analyticsTab"
                        class="tab-button flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors"
                    >
                        <i data-lucide="trending-up" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                        <span class="hidden sm:inline">Analytics</span>
                        <span class="sm:hidden">Stats</span>
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div id="tabContent" class="min-h-[400px]">
                <!-- Content will be loaded by JavaScript -->
                <div class="flex items-center justify-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Request Details Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script>
        // Pass client data to JavaScript
        window.CLIENT_DATA = <?php echo json_encode($client); ?>;
    </script>
    <script src="../assets/js/client-dashboard.js"></script>
    <script>
        // Logout functionality
        function handleLogout() {
            fetch('/api/client-auth.php/logout', { method: 'POST' })
                .then(() => {
                    window.location.href = '/client/login.php';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    window.location.href = '/client/login.php';
                });
        }

        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        document.getElementById('logoutBtnMobile').addEventListener('click', handleLogout);

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

        lucide.createIcons();
    </script>
</body>
</html>