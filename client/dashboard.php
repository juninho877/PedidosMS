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
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($client['primary_color'] ?? '#3b82f6'); ?>;
            --secondary-color: <?php echo htmlspecialchars($client['secondary_color'] ?? '#8b5cf6'); ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .text-secondary { color: var(--secondary-color); }
        
        .tab-button {
            @apply px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium;
        }
        .tab-button.active {
            background-color: var(--primary-color);
            @apply text-white;
        }
        .tab-button:not(.active) {
            @apply text-slate-400 hover:text-white hover:bg-slate-700;
        }
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <?php if (!empty($client['logo_url'])): ?>
                        <img src="<?php echo htmlspecialchars($client['logo_url']); ?>" alt="Logo" class="h-8 w-8 object-contain">
                    <?php else: ?>
                        <i data-lucide="building" class="h-8 w-8 text-blue-400"></i>
                    <?php endif; ?>
                    <span class="text-xl font-bold text-white">
                        <?php echo htmlspecialchars($client['site_name'] ?? $client['name']); ?>
                    </span>
                </div>

                <div class="flex items-center space-x-4">
                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" target="_blank" class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span>Ver Site</span>
                    </a>
                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
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
                    Dashboard do Cliente
                </h1>
                <p class="text-slate-400">
                    Bem-vindo ao painel de controle do <?php echo htmlspecialchars($client['site_name'] ?? $client['name']); ?>
                </p>
            </div>

            <!-- Tabs -->
            <div class="mb-8">
                <div class="flex flex-wrap gap-2 border-b border-slate-700">
                    <button class="tab-button active" data-tab="overview">
                        <i data-lucide="bar-chart-3" class="h-4 w-4 inline mr-2"></i>
                        Visão Geral
                    </button>
                    <button class="tab-button" data-tab="requests">
                        <i data-lucide="list" class="h-4 w-4 inline mr-2"></i>
                        Solicitações
                    </button>
                    <button class="tab-button" data-tab="settings">
                        <i data-lucide="settings" class="h-4 w-4 inline mr-2"></i>
                        Configurações
                    </button>
                    <button class="tab-button" data-tab="analytics">
                        <i data-lucide="trending-up" class="h-4 w-4 inline mr-2"></i>
                        Analytics
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div id="tabContent">
                <!-- Content will be loaded by JavaScript -->
                <div class="flex items-center justify-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Request Details -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <!-- Modal content will be populated by JavaScript -->
    </div>

    <script>
        // Pass client data to JavaScript
        window.CLIENT_DATA = <?php echo json_encode($client); ?>;
    </script>
    <script src="../assets/js/client-dashboard.js"></script>
    <script>
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/client-auth.php/logout', { method: 'POST' });
                window.location.href = '/client/login.php';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/client/login.php';
            }
        });

        lucide.createIcons();
    </script>
</body>
</html>