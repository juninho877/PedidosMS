<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($tenantConfig['site_name']); ?> - Sistema de Solicitação de Filmes e Séries</title>
    <title>Dashboard Admin - CineRequest SaaS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="bg-slate-900 text-white">
    <!-- Admin Navbar -->
    <nav class="bg-slate-800 border-b border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="/admin/dashboard" class="flex items-center space-x-3">
                    <i data-lucide="shield" class="h-8 w-8 text-blue-400"></i>
                    <span class="text-xl font-bold text-white">Admin Dashboard</span>
                </a>

                <div class="flex items-center space-x-6">
                    <a href="/admin/dashboard" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-600 text-white">
                        <i data-lucide="bar-chart" class="h-4 w-4"></i>
                        <span>Dashboard</span>
                    </a>

                    <a href="/admin/tenants" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span>Clientes</span>
                    </a>

                    <button onclick="logout()" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span>Sair</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">Dashboard Administrativo</h1>
            <p class="text-slate-400">Bem-vindo, <?php echo htmlspecialchars($user['name']); ?>!</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-500/10 mr-4">
                        <i data-lucide="users" class="h-8 w-8 text-blue-400"></i>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Total de Clientes</p>
                        <p class="text-2xl font-bold text-white" id="totalClients">-</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-500/10 mr-4">
                        <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Clientes Ativos</p>
                        <p class="text-2xl font-bold text-white" id="activeClients">-</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-purple-500/10 mr-4">
                        <i data-lucide="plus-circle" class="h-8 w-8 text-purple-400"></i>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Novos Este Mês</p>
                        <p class="text-2xl font-bold text-white" id="newClientsThisMonth">-</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a href="/admin/tenants" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <i data-lucide="users" class="h-6 w-6 text-blue-400"></i>
                    <div>
                        <p class="font-medium text-white">Gerenciar Clientes</p>
                        <p class="text-sm text-slate-400">Adicionar, editar ou remover clientes</p>
                    </div>
                </a>

                <a href="/" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <i data-lucide="home" class="h-6 w-6 text-green-400"></i>
                    <div>
                        <p class="font-medium text-white">Ver Site Principal</p>
                        <p class="text-sm text-slate-400">Página inicial do SaaS</p>
                    </div>
                </a>

                <a href="/exemplo-cliente" target="_blank" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <i data-lucide="external-link" class="h-6 w-6 text-purple-400"></i>
                    <div>
                        <p class="font-medium text-white">Ver Site Demo</p>
                        <p class="text-sm text-slate-400">Exemplo de site de cliente</p>
                    </div>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <script>
        async function logout() {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/admin/login';
            } catch (error) {
                console.error('Erro no logout:', error);
                window.location.href = '/admin/login';
            }
        }
    </script>

    <script>
        lucide.createIcons();
    </script>
    <script src="../assets/js/dashboard.js"></script>
</body>
</html>