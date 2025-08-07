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
    <title>Dashboard Cliente - <?php echo htmlspecialchars($client['site_name']); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo htmlspecialchars($client['favicon_url'] ?? ''); ?>">
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
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="/<?php echo htmlspecialchars($client['slug']); ?>" class="flex items-center space-x-3 group">
                    <?php if (!empty($client['logo_url'])): ?>
                        <img src="<?php echo htmlspecialchars($client['logo_url']); ?>" alt="Logo" class="h-10 w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="film" class="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <?php endif; ?>
                    <span class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo htmlspecialchars($client['site_name']); ?>
                    </span>
                </a>

                <div class="flex items-center space-x-6">
                    <a href="/client/dashboard.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-primary text-white">
                        <i data-lucide="layout-dashboard" class="h-5 w-5"></i>
                        <span>Dashboard</span>
                    </a>

                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="external-link" class="h-5 w-5"></i>
                        <span>Meu Site</span>
                    </a>

                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <i data-lucide="log-out" class="h-5 w-5"></i>
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
                    Dashboard - <?php echo htmlspecialchars($client['site_name']); ?>
                </h1>
                <p class="text-slate-400">
                    Bem-vindo ao painel de gerenciamento do seu site
                </p>
            </div>

            <!-- Tabs Navigation -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg mb-6">
                <div class="flex flex-wrap border-b border-slate-700">
                    <button class="tab-btn active px-6 py-4 font-medium transition-colors" data-tab="overview">
                        <i data-lucide="bar-chart-3" class="h-5 w-5 mr-2"></i>
                        Visão Geral
                    </button>
                    <button class="tab-btn px-6 py-4 font-medium transition-colors" data-tab="requests">
                        <i data-lucide="film" class="h-5 w-5 mr-2"></i>
                        Solicitações
                    </button>
                    <button class="tab-btn px-6 py-4 font-medium transition-colors" data-tab="settings">
                        <i data-lucide="settings" class="h-5 w-5 mr-2"></i>
                        Configurações
                    </button>
                    <button class="tab-btn px-6 py-4 font-medium transition-colors" data-tab="analytics">
                        <i data-lucide="trending-up" class="h-5 w-5 mr-2"></i>
                        Analytics
                    </button>
                </div>

                <!-- Tab Contents -->
                <div class="p-6">
                    <!-- Overview Tab -->
                    <div id="overview-tab" class="tab-content">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <div class="flex items-center space-x-3 mb-4">
                                    <i data-lucide="film" class="h-8 w-8 text-blue-400"></i>
                                    <div>
                                        <p class="text-2xl font-bold text-white" id="totalRequests">-</p>
                                        <p class="text-sm text-slate-400">Total de Solicitações</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <div class="flex items-center space-x-3 mb-4">
                                    <i data-lucide="clock" class="h-8 w-8 text-yellow-400"></i>
                                    <div>
                                        <p class="text-2xl font-bold text-white" id="pendingRequests">-</p>
                                        <p class="text-sm text-slate-400">Pendentes</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <div class="flex items-center space-x-3 mb-4">
                                    <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                                    <div>
                                        <p class="text-2xl font-bold text-white" id="approvedRequests">-</p>
                                        <p class="text-sm text-slate-400">Aprovadas</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <div class="flex items-center space-x-3 mb-4">
                                    <i data-lucide="x-circle" class="h-8 w-8 text-red-400"></i>
                                    <div>
                                        <p class="text-2xl font-bold text-white" id="deniedRequests">-</p>
                                        <p class="text-sm text-slate-400">Negadas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Requests Tab -->
                    <div id="requests-tab" class="tab-content hidden">
                        <!-- Filters -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <select id="statusFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    <option value="">Todos os Status</option>
                                    <option value="pending">Pendentes</option>
                                    <option value="approved">Aprovadas</option>
                                    <option value="denied">Negadas</option>
                                </select>
                                <select id="typeFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    <option value="">Todos os Tipos</option>
                                    <option value="movie">Filmes</option>
                                    <option value="tv">Séries</option>
                                </select>
                                <input type="text" id="searchFilter" placeholder="Buscar..." class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400">
                            </div>
                        </div>

                        <!-- Requests List -->
                        <div id="requestsList">
                            <!-- Requests will be loaded by JavaScript -->
                        </div>
                    </div>

                    <!-- Settings Tab -->
                    <div id="settings-tab" class="tab-content hidden">
                        <form id="settingsForm" class="space-y-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                        <input type="text" id="companyName" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                        <input type="text" id="siteName" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                                        <input type="text" id="siteTagline" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-white mb-4">Contato</h3>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                        <input type="email" id="contactEmail" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                                        <input type="text" id="contactWhatsapp" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-white mb-4">Cores</h3>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                        <input type="color" id="primaryColor" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                        <input type="color" id="secondaryColor" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                                    </div>
                                </div>

                                <div class="space-y-4">
                                    <h3 class="text-lg font-semibold text-white mb-4">Seção Principal</h3>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                        <input type="text" id="heroTitle" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                        <input type="text" id="heroSubtitle" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                                <textarea id="siteDescription" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Descrição da Seção Principal</label>
                                <textarea id="heroDescription" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"></textarea>
                            </div>

                            <button type="submit" class="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                Salvar Configurações
                            </button>
                        </form>
                    </div>

                    <!-- Analytics Tab -->
                    <div id="analytics-tab" class="tab-content hidden">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4">Métricas Gerais</h3>
                                <div class="space-y-4">
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Taxa de Aprovação:</span>
                                        <span class="text-white font-semibold" id="approvalRate">-</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Média Diária:</span>
                                        <span class="text-white font-semibold" id="dailyAverage">-</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Tipo Mais Solicitado:</span>
                                        <span class="text-white font-semibold" id="mostRequestedType">-</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4">Últimos 30 Dias</h3>
                                <div id="dailyChart" class="h-48 flex items-center justify-center text-slate-400">
                                    Carregando gráfico...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Request Details Modal -->
    <div id="requestDetailsModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script>
        // Pass client data and TMDB config to JavaScript
        window.CLIENT_DATA = <?php echo json_encode($client); ?>;
        window.TMDB_IMAGE_BASE_URL = '<?php echo TMDB_IMAGE_BASE_URL; ?>';
        window.TMDB_API_KEY = '<?php echo TMDB_API_KEY; ?>';
    </script>
    <script src="../assets/js/client-dashboard.js"></script>
    <script>
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            fetch('/api/client-auth.php/logout', { method: 'POST' })
                .then(() => {
                    window.location.href = '/client/login.php';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    window.location.href = '/client/login.php';
                });
        });

        lucide.createIcons();
    </script>
</body>
</html>