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
    <title>Painel do Cliente - CineRequest SaaS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <div class="flex items-center space-x-3">
                    <i data-lucide="building" class="h-6 w-6 sm:h-8 sm:w-8 text-blue-400"></i>
                    <span class="text-lg sm:text-xl font-bold text-white">
                        Painel do Cliente
                    </span>
                </div>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-slate-300 hover:text-white p-2">
                        <i data-lucide="menu" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <span class="text-slate-300 text-sm">
                        Bem-vindo, <span class="text-white font-medium"><?php echo htmlspecialchars($client['name'] ?? 'Cliente'); ?></span>
                    </span>
                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm lg:text-base"
                    >
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Sair</span>
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
                    Painel do Cliente
                </h1>
                <p class="text-slate-400">
                    Gerencie suas solicitações e personalize seu site
                </p>
            </div>

            <!-- Tabs -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg mb-8">
                <div class="border-b border-slate-700">
                    <nav class="flex space-x-8 px-6" aria-label="Tabs">
                        <button
                            id="tab-overview"
                            class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-400"
                            onclick="clientDashboard.switchTab('overview')"
                        >
                            <i data-lucide="bar-chart-3" class="h-4 w-4 inline mr-2"></i>
                            Visão Geral
                        </button>
                        <button
                            id="tab-requests"
                            class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
                            onclick="clientDashboard.switchTab('requests')"
                        >
                            <i data-lucide="list" class="h-4 w-4 inline mr-2"></i>
                            Solicitações
                        </button>
                        <button
                            id="tab-customization"
                            class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
                            onclick="clientDashboard.switchTab('customization')"
                        >
                            <i data-lucide="palette" class="h-4 w-4 inline mr-2"></i>
                            Personalização
                        </button>
                        <button
                            id="tab-analytics"
                            class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
                            onclick="clientDashboard.switchTab('analytics')"
                        >
                            <i data-lucide="trending-up" class="h-4 w-4 inline mr-2"></i>
                            Analytics
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div id="tabContent" class="p-6">
                    <!-- Content will be loaded by JavaScript -->
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <p class="text-slate-400">Carregando...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Pass client data to JavaScript
        window.CLIENT_DATA = <?php echo json_encode($client); ?>;
        console.log('Client data loaded:', window.CLIENT_DATA);
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