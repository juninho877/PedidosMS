<?php
require_once '../config/config.php';

// Check client authentication
$authService = new AuthService();
$clientData = null;

if (isset($_COOKIE['client_auth_token'])) {
    $clientData = $authService->validateClientToken($_COOKIE['client_auth_token']);
}

if (!$clientData) {
    header('Location: /client/login.php');
    exit;
}

// Load tenant data
$database = new Database();
$db = $database->getConnection();
$tenant = new Tenant($db);
$tenant->findById($clientData['tenant_id']);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo htmlspecialchars($tenant->name); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($tenant->primary_color ?: '#1E40AF'); ?>;
            --secondary-color: <?php echo htmlspecialchars($tenant->secondary_color ?: '#DC2626'); ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <div class="flex items-center space-x-3">
                    <?php if ($tenant->logo_url): ?>
                        <img src="<?php echo htmlspecialchars($tenant->logo_url); ?>" alt="Logo" class="h-8 w-8 sm:h-10 sm:w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="building" class="h-6 w-6 sm:h-8 sm:w-8 text-blue-400"></i>
                    <?php endif; ?>
                    <span class="text-lg sm:text-xl font-bold text-white">
                        <?php echo htmlspecialchars($tenant->name); ?>
                    </span>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <a href="/<?php echo htmlspecialchars($tenant->slug); ?>" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Ver Site</span>
                    </a>

                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm lg:text-base"
                    >
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Sair</span>
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
                    <a href="/<?php echo htmlspecialchars($tenant->slug); ?>" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span>Ver Site</span>
                    </a>
                    <button
                        id="logoutBtnMobile"
                        class="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-left"
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
            <div class="mb-6 sm:mb-8">
                <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard do Cliente</h1>
                <p class="text-sm sm:text-base text-slate-400">Gerencie seu site e visualize suas métricas</p>
            </div>

            <!-- Tabs Navigation -->
            <div class="mb-6 sm:mb-8">
                <div class="border-b border-slate-700">
                    <nav class="-mb-px flex space-x-8">
                        <button
                            id="tab-overview"
                            class="tab-button active py-2 px-1 border-b-2 font-medium text-sm border-primary text-primary"
                        >
                            Visão Geral
                        </button>
                        <button
                            id="tab-requests"
                            class="tab-button py-2 px-1 border-b-2 border-transparent font-medium text-sm text-slate-400 hover:text-slate-300 hover:border-slate-300"
                        >
                            Solicitações
                        </button>
                        <button
                            id="tab-customization"
                            class="tab-button py-2 px-1 border-b-2 border-transparent font-medium text-sm text-slate-400 hover:text-slate-300 hover:border-slate-300"
                        >
                            Personalização
                        </button>
                        <button
                            id="tab-analytics"
                            class="tab-button py-2 px-1 border-b-2 border-transparent font-medium text-sm text-slate-400 hover:text-slate-300 hover:border-slate-300"
                        >
                            Analytics
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Tab Content -->
            <div id="tab-content">
                <!-- Overview Tab -->
                <div id="content-overview" class="tab-content">
                    <!-- Stats Cards -->
                    <div id="statsCards" class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <!-- Stats will be loaded by JavaScript -->
                    </div>

                    <!-- Quick Actions -->
                    <div class="grid md:grid-cols-2 gap-6 mb-8">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
                            <div class="space-y-3">
                                <button
                                    onclick="switchTab('customization')"
                                    class="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
                                >
                                    <i data-lucide="palette" class="h-5 w-5 text-blue-400"></i>
                                    <span class="text-white">Personalizar Site</span>
                                </button>
                                <a
                                    href="/<?php echo htmlspecialchars($tenant->slug); ?>"
                                    target="_blank"
                                    class="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
                                >
                                    <i data-lucide="external-link" class="h-5 w-5 text-green-400"></i>
                                    <span class="text-white">Visualizar Site</span>
                                </a>
                                <button
                                    onclick="switchTab('requests')"
                                    class="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-left"
                                >
                                    <i data-lucide="inbox" class="h-5 w-5 text-purple-400"></i>
                                    <span class="text-white">Ver Solicitações</span>
                                </button>
                            </div>
                        </div>

                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Informações do Site</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">URL do Site:</span>
                                    <span class="text-white font-mono text-sm">site.com/<?php echo htmlspecialchars($tenant->slug); ?></span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Status:</span>
                                    <span class="text-green-400">Ativo</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Criado em:</span>
                                    <span class="text-white"><?php echo date('d/m/Y', strtotime($tenant->created_at)); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Requests -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-white">Solicitações Recentes</h3>
                            <button
                                onclick="switchTab('requests')"
                                class="text-primary hover:opacity-80 text-sm font-medium"
                            >
                                Ver todas
                            </button>
                        </div>
                        <div id="recentRequests">
                            <!-- Recent requests will be loaded by JavaScript -->
                        </div>
                    </div>
                </div>

                <!-- Requests Tab -->
                <div id="content-requests" class="tab-content hidden">
                    <!-- Filters -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 mb-6">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                    <select
                                        id="requestStatusFilter"
                                        class="w-full sm:w-auto px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    >
                                        <option value="">Todos</option>
                                        <option value="pending">Pendentes</option>
                                        <option value="approved">Aprovadas</option>
                                        <option value="denied">Negadas</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
                                    <select
                                        id="requestTypeFilter"
                                        class="w-full sm:w-auto px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    >
                                        <option value="">Todos</option>
                                        <option value="movie">Filmes</option>
                                        <option value="tv">Séries</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                id="refreshRequestsBtn"
                                class="flex items-center justify-center space-x-2 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
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

                <!-- Customization Tab -->
                <div id="content-customization" class="tab-content hidden">
                    <form id="customizationForm" class="space-y-8">
                        <!-- Basic Info -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-6">Informações Básicas</h3>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Nome do Site
                                    </label>
                                    <input
                                        type="text"
                                        id="siteName"
                                        value="<?php echo htmlspecialchars($tenant->name); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Nome que aparece no site"
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Slug da URL (não editável)
                                    </label>
                                    <input
                                        type="text"
                                        value="<?php echo htmlspecialchars($tenant->slug); ?>"
                                        class="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-slate-400 cursor-not-allowed"
                                        readonly
                                    />
                                    <p class="text-xs text-slate-500 mt-1">site.com/<?php echo htmlspecialchars($tenant->slug); ?></p>
                                </div>
                            </div>
                        </div>

                        <!-- Visual Identity -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-6">Identidade Visual</h3>
                            
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Logo do Site
                                    </label>
                                    <div class="space-y-3">
                                        <input
                                            type="url"
                                            id="logoUrl"
                                            value="<?php echo htmlspecialchars($tenant->logo_url ?: ''); ?>"
                                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="https://exemplo.com/logo.png"
                                        />
                                        <div class="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                id="uploadLogoBtn"
                                                class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                            >
                                                Fazer Upload
                                            </button>
                                            <?php if ($tenant->logo_url): ?>
                                                <img src="<?php echo htmlspecialchars($tenant->logo_url); ?>" alt="Logo atual" class="h-8 w-8 object-contain rounded">
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Favicon
                                    </label>
                                    <div class="space-y-3">
                                        <input
                                            type="url"
                                            id="faviconUrl"
                                            value="<?php echo htmlspecialchars($tenant->favicon_url ?: ''); ?>"
                                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="https://exemplo.com/favicon.ico"
                                        />
                                        <div class="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                id="uploadFaviconBtn"
                                                class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                            >
                                                Fazer Upload
                                            </button>
                                            <?php if ($tenant->favicon_url): ?>
                                                <img src="<?php echo htmlspecialchars($tenant->favicon_url); ?>" alt="Favicon atual" class="h-4 w-4 object-contain">
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Cor Primária
                                    </label>
                                    <input
                                        type="color"
                                        id="primaryColor"
                                        value="<?php echo htmlspecialchars($tenant->primary_color ?: '#1E40AF'); ?>"
                                        class="w-full h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Cor Secundária
                                    </label>
                                    <input
                                        type="color"
                                        id="secondaryColor"
                                        value="<?php echo htmlspecialchars($tenant->secondary_color ?: '#DC2626'); ?>"
                                        class="w-full h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Page Content -->
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-6">Conteúdo da Página Inicial</h3>
                            
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Título Principal
                                    </label>
                                    <input
                                        type="text"
                                        id="heroTitle"
                                        value="<?php echo htmlspecialchars($tenant->hero_title ?: 'Solicite seus Filmes e Séries favoritos'); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Título que aparece na página inicial"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Subtítulo
                                    </label>
                                    <input
                                        type="text"
                                        id="heroSubtitle"
                                        value="<?php echo htmlspecialchars($tenant->hero_subtitle ?: 'Sistema profissional de gerenciamento de solicitações'); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Subtítulo da página inicial"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        id="heroDescription"
                                        rows="3"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Descrição detalhada que aparece na página inicial"
                                    ><?php echo htmlspecialchars($tenant->hero_description ?: 'Pesquise, solicite e acompanhe suas preferências de entretenimento.'); ?></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Save Button -->
                        <div class="flex justify-end">
                            <button
                                type="submit"
                                id="saveCustomizationBtn"
                                class="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Analytics Tab -->
                <div id="content-analytics" class="tab-content hidden">
                    <!-- Analytics Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-slate-400 text-sm">Solicitações Hoje</p>
                                    <p id="todayRequests" class="text-2xl font-bold text-white">-</p>
                                </div>
                                <i data-lucide="calendar" class="h-8 w-8 text-blue-400"></i>
                            </div>
                        </div>

                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-slate-400 text-sm">Esta Semana</p>
                                    <p id="weekRequests" class="text-2xl font-bold text-white">-</p>
                                </div>
                                <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                            </div>
                        </div>

                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-slate-400 text-sm">Este Mês</p>
                                    <p id="monthRequests" class="text-2xl font-bold text-white">-</p>
                                </div>
                                <i data-lucide="bar-chart" class="h-8 w-8 text-purple-400"></i>
                            </div>
                        </div>

                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-slate-400 text-sm">Taxa Aprovação</p>
                                    <p id="approvalRate" class="text-2xl font-bold text-white">-</p>
                                </div>
                                <i data-lucide="check-circle" class="h-8 w-8 text-yellow-400"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Charts -->
                    <div class="grid lg:grid-cols-2 gap-8">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Solicitações por Dia (Últimos 7 dias)</h3>
                            <canvas id="requestsChart" width="400" height="200"></canvas>
                        </div>

                        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Tipos de Conteúdo</h3>
                            <canvas id="contentTypeChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Upload Modal -->
    <div id="uploadModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-white">Upload de Arquivo</h3>
                <button
                    id="closeUploadModal"
                    class="text-slate-400 hover:text-white transition-colors"
                >
                    <i data-lucide="x" class="h-6 w-6"></i>
                </button>
            </div>

            <form id="uploadForm" enctype="multipart/form-data" class="space-y-4">
                <input type="hidden" id="uploadType" name="type" value="">
                <input type="hidden" id="uploadTenantId" name="tenant_id" value="<?php echo $tenant->id; ?>">
                
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">
                        Selecionar Arquivo
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        name="file"
                        accept="image/*"
                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:opacity-90"
                        required
                    />
                    <p class="text-xs text-slate-500 mt-1">Máximo 2MB. Formatos: JPG, PNG, GIF, WebP</p>
                </div>
                
                <div class="flex space-x-4">
                    <button
                        type="button"
                        id="cancelUpload"
                        class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        id="submitUpload"
                        class="flex-1 bg-primary hover:opacity-90 text-white py-2 rounded-lg transition-colors"
                    >
                        Upload
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Pass PHP data to JavaScript
        window.CLIENT_DATA = {
            tenantId: <?php echo $tenant->id; ?>,
            tenantSlug: '<?php echo htmlspecialchars($tenant->slug); ?>'
        };
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