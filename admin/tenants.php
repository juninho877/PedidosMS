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
    <title>Gerenciar Clientes - <?php echo SITE_NAME; ?></title>
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
                    <a href="dashboard.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="bar-chart-3" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Dashboard</span>
                    </a>

                    <a href="tenants.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-600 text-white text-sm lg:text-base">
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
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Gerenciar Clientes</h1>
                    <p class="text-sm sm:text-base text-slate-400">Gerencie todos os clientes do seu SaaS</p>
                </div>
                <button
                    id="addTenantBtn"
                    class="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                    <i data-lucide="plus" class="h-5 w-5"></i>
                    <span>Novo Cliente</span>
                </button>
            </div>

            <!-- Tenants List -->
            <div id="tenantsList">
                <!-- Tenants will be loaded by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Tenant Modal -->
    <div id="tenantModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script src="../assets/js/tenants.js"></script>
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