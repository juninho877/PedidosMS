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
            <div class="flex justify-between items-center h-16">
                <a href="/" class="flex items-center space-x-3 group">
                    <i data-lucide="film" class="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <span class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo SITE_NAME; ?>
                    </span>
                </a>

                <div class="flex items-center space-x-6">
                    <a href="/" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>

                    <a href="../search.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>

                    <a href="dashboard.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-600 text-white">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span>Dashboard</span>
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
                <h1 class="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
                <p class="text-slate-400">Gerencie todas as solicitações de conteúdo</p>
            </div>

            <!-- Stats Cards -->
            <div id="statsCards" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <!-- Stats will be loaded by JavaScript -->
            </div>

            <!-- Filters and Actions -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos</option>
                                <option value="pending">Pendentes</option>
                                <option value="approved">Aprovadas</option>
                                <option value="denied">Negadas</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-1">
                                Tipo
                            </label>
                            <select
                                id="typeFilter"
                                class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos</option>
                                <option value="movie">Filmes</option>
                                <option value="tv">Séries</option>
                            </select>
                        </div>
                    </div>

                    <button
                        id="refreshBtn"
                        class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <i data-lucide="refresh-cw" class="h-4 w-4"></i>
                        <span>Atualizar</span>
                    </button>
                </div>
            </div>

            <!-- Requests List -->
            <div id="requestsList">
                <!-- Requests will be loaded by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Request Details Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script src="../assets/js/dashboard.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>