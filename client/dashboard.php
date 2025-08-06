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

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <span class="text-slate-300 text-sm">
                        Olá, <?php echo htmlspecialchars($client['name']); ?>
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
                    Dashboard do Cliente
                </h1>
                <p class="text-slate-400">
                    Gerencie suas solicitações e personalize seu site
                </p>
            </div>

            <!-- Tabs -->
            <div class="mb-8">
                <div class="border-b border-slate-700">
                    <nav class="-mb-px flex space-x-8">
                        <button
                            id="tab-overview"
                            class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-400"
                        >
                            Visão Geral
                        </button>
                        <button
                            id="tab-requests"
                            class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
                        >
                            Solicitações
                        </button>
                        <button
                            id="tab-customization"
                            class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
                        >
                            Personalização
                        </button>
                        <button
                            id="tab-analytics"
                            class="tab-button py-2 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300"
                        >
                            Analytics
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Tab Content -->
            <div id="tab-content">
                <!-- Content will be loaded by JavaScript -->
            </div>
        </div>
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