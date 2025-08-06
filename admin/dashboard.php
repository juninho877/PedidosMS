<?php
require_once '../config/config.php';

$middleware = new AuthMiddleware();
$user = $middleware->requireAuth();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - <?php echo SITE_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <a href="/" class="flex items-center space-x-3 group">
                    <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <span class="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo SITE_NAME; ?> Admin
                    </span>
                </a>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <a href="dashboard.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-600 text-white text-sm lg:text-base">
                        <i data-lucide="bar-chart-3" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Dashboard</span>
                    </a>

                    <a href="tenants.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Clientes</span>
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
        </div>
    </nav>

    <div class="min-h-screen bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">
                    Dashboard Administrativo
                </h1>
                <p class="text-slate-400">
                    Bem-vindo ao painel de administração do CineRequest SaaS
                </p>
            </div>

            <!-- Admin Focus Card -->
            <div class="max-w-2xl mx-auto">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                    <i data-lucide="building" class="h-16 w-16 text-blue-400 mx-auto mb-4"></i>
                    <h2 class="text-xl font-bold text-white mb-2">Gerenciamento de Clientes SaaS</h2>
                    <p class="text-slate-400 mb-6">
                        Como administrador, seu foco é gerenciar os clientes e as configurações do sistema. 
                        Cada cliente gerencia suas próprias solicitações através de seu painel individual.
                    </p>
                    <a href="tenants.php" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                        <i data-lucide="users" class="h-5 w-5"></i>
                        <span>Gerenciar Clientes</span>
                    </a>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="mt-12 grid md:grid-cols-3 gap-6">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="users" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white" id="totalClients">-</p>
                            <p class="text-sm text-slate-400">Total de Clientes</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white" id="activeClients">-</p>
                            <p class="text-sm text-slate-400">Clientes Ativos</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="calendar" class="h-8 w-8 text-purple-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white" id="newClientsThisMonth">-</p>
                            <p class="text-sm text-slate-400">Novos este Mês</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/js/dashboard.js"></script>
    <script>
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/auth.php/logout', { method: 'POST' });
                window.location.href = '/admin/login.php';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/admin/login.php';
            }
        });

        lucide.createIcons();
    </script>
</body>
</html>