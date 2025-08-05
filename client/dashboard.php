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
    <title>Dashboard - <?php echo htmlspecialchars($client['name']); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($client['primary_color'] ?? '#1E40AF'); ?>;
            --secondary-color: <?php echo htmlspecialchars($client['secondary_color'] ?? '#DC2626'); ?>;
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
                <div class="flex items-center space-x-3">
                    <?php if ($client['logo_url']): ?>
                        <img src="<?php echo htmlspecialchars($client['logo_url']); ?>" alt="Logo" class="h-8 w-8 object-contain">
                    <?php else: ?>
                        <i data-lucide="building" class="h-8 w-8 text-primary"></i>
                    <?php endif; ?>
                    <span class="text-xl font-bold text-white"><?php echo htmlspecialchars($client['name']); ?></span>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" target="_blank" class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span>Ver Site</span>
                    </a>
                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span>Sair</span>
                    </button>
                </div>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-slate-300 hover:text-white p-2">
                        <i data-lucide="menu" class="h-6 w-6"></i>
                    </button>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-slate-700 py-4">
                <div class="space-y-2">
                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" target="_blank" class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span>Ver Site</span>
                    </a>
                    <button
                        id="logoutBtnMobile"
                        class="w-full flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-left"
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
                <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p class="text-slate-400">Gerencie seu site de solicitações de filmes e séries</p>
            </div>

            <!-- Tabs -->
            <div class="mb-8">
                <div class="border-b border-slate-700">
                    <nav class="-mb-px flex space-x-8 overflow-x-auto">
                        <button
                            class="tab-btn active whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                            data-tab="overview"
                        >
                            <i data-lucide="bar-chart-3" class="h-4 w-4 inline mr-2"></i>
                            Visão Geral
                        </button>
                        <button
                            class="tab-btn whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                            data-tab="requests"
                        >
                            <i data-lucide="inbox" class="h-4 w-4 inline mr-2"></i>
                            Solicitações
                        </button>
                        <button
                            class="tab-btn whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                            data-tab="customization"
                        >
                            <i data-lucide="palette" class="h-4 w-4 inline mr-2"></i>
                            Personalização
                        </button>
                        <button
                            class="tab-btn whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                            data-tab="analytics"
                        >
                            <i data-lucide="trending-up" class="h-4 w-4 inline mr-2"></i>
                            Analytics
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Tab Content -->
            <div id="tab-content">
                <!-- Overview Tab -->
                <div id="overview-tab" class="tab-content">
                    <!-- Stats Cards -->
                    <div id="statsCards" class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <!-- Stats will be loaded by JavaScript -->
                    </div>

                    <!-- Quick Actions -->
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
                            <div class="space-y-3">
                                <a href="/<?php echo htmlspecialchars($client['slug']); ?>" target="_blank" class="flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                                    <i data-lucide="external-link" class="h-5 w-5 text-primary"></i>
                                    <span class="text-white">Visualizar Site</span>
                                </a>
                                <button onclick="switchTab('customization')" class="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                                    <i data-lucide="palette" class="h-5 w-5 text-purple-400"></i>
                                    <span class="text-white">Personalizar Site</span>
                                </button>
                                <button onclick="switchTab('requests')" class="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                                    <i data-lucide="inbox" class="h-5 w-5 text-green-400"></i>
                                    <span class="text-white">Ver Solicitações</span>
                                </button>
                            </div>
                        </div>

                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Informações do Site</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">URL:</span>
                                    <span class="text-white font-mono text-sm">site.com/<?php echo htmlspecialchars($client['slug']); ?></span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Nome:</span>
                                    <span class="text-white"><?php echo htmlspecialchars($client['name']); ?></span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Status:</span>
                                    <span class="text-green-400">Ativo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Requests Tab -->
                <div id="requests-tab" class="tab-content hidden">
                    <!-- Filters -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div class="flex flex-col sm:flex-row gap-4">
                                <select id="statusFilter" class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    <option value="">Todos os Status</option>
                                    <option value="pending">Pendentes</option>
                                    <option value="approved">Aprovadas</option>
                                    <option value="denied">Negadas</option>
                                </select>
                                <select id="typeFilter" class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                    <option value="">Todos os Tipos</option>
                                    <option value="movie">Filmes</option>
                                    <option value="tv">Séries</option>
                                </select>
                            </div>
                            <button id="refreshRequests" class="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-colors">
                                <i data-lucide="refresh-cw" class="h-4 w-4 inline mr-2"></i>
                                Atualizar
                            </button>
                        </div>
                    </div>

                    <!-- Requests List -->
                    <div id="requestsList">
                        <!-- Requests will be loaded by JavaScript -->
                    </div>
                </div>

                <!-- Customization Tab -->
                <div id="customization-tab" class="tab-content hidden">
                    <form id="customizationForm" class="space-y-8">
                        <!-- Basic Info -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-6">Informações Básicas</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                    <input
                                        type="text"
                                        id="siteName"
                                        value="<?php echo htmlspecialchars($client['name']); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">URL do Logo</label>
                                    <input
                                        type="url"
                                        id="logoUrl"
                                        value="<?php echo htmlspecialchars($client['logo_url'] ?? ''); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="https://exemplo.com/logo.png"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Colors -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-6">Cores do Site</h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                    <input
                                        type="color"
                                        id="primaryColor"
                                        value="<?php echo htmlspecialchars($client['primary_color'] ?? '#1E40AF'); ?>"
                                        class="w-full h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                    <input
                                        type="color"
                                        id="secondaryColor"
                                        value="<?php echo htmlspecialchars($client['secondary_color'] ?? '#DC2626'); ?>"
                                        class="w-full h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Hero Section -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-6">Textos da Página Inicial</h3>
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                    <input
                                        type="text"
                                        id="heroTitle"
                                        value="<?php echo htmlspecialchars($client['hero_title'] ?? ''); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Solicite seus Filmes e Séries favoritos"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                    <input
                                        type="text"
                                        id="heroSubtitle"
                                        value="<?php echo htmlspecialchars($client['hero_subtitle'] ?? ''); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Sistema profissional de gerenciamento"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                                    <textarea
                                        id="heroDescription"
                                        rows="3"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Pesquise, solicite e acompanhe suas preferências de entretenimento."
                                    ><?php echo htmlspecialchars($client['hero_description'] ?? ''); ?></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Save Button -->
                        <div class="flex justify-end">
                            <button
                                type="submit"
                                id="saveCustomization"
                                class="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                <i data-lucide="save" class="h-4 w-4 inline mr-2"></i>
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Analytics Tab -->
                <div id="analytics-tab" class="tab-content hidden">
                    <div class="grid lg:grid-cols-2 gap-8">
                        <!-- Chart -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-6">Solicitações por Dia</h3>
                            <canvas id="requestsChart" width="400" height="200"></canvas>
                        </div>

                        <!-- Stats -->
                        <div class="space-y-6">
                            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                <h3 class="text-lg font-semibold text-white mb-4">Métricas do Mês</h3>
                                <div id="monthlyStats" class="space-y-4">
                                    <!-- Monthly stats will be loaded by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Request Details Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script>
        // Pass client data to JavaScript
        window.CLIENT_DATA = <?php echo json_encode($client); ?>;
    </script>
    <script src="../assets/js/client-dashboard.js"></script>
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

        lucide.createIcons();
    </script>
</body>
</html>