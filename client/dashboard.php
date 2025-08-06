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
    <title>Painel do Cliente - <?php echo htmlspecialchars($client['site_name'] ?? $client['name']); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo htmlspecialchars($client['favicon_url'] ?? '/assets/images/default-favicon.ico'); ?>">
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
                    <?php if (!empty($client['logo_url'])): ?>
                        <img src="<?php echo htmlspecialchars($client['logo_url']); ?>" alt="Logo" class="h-8 w-8 object-contain">
                    <?php else: ?>
                        <i data-lucide="building" class="h-8 w-8 text-blue-400"></i>
                    <?php endif; ?>
                    <span class="text-xl font-bold text-white">
                        Painel - <?php echo htmlspecialchars($client['site_name'] ?? $client['name']); ?>
                    </span>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" target="_blank" class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span>Ver Site</span>
                    </a>
                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
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
                    <a href="/<?php echo htmlspecialchars($client['slug']); ?>" target="_blank" class="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
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
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-white mb-2">Painel do Cliente</h1>
                <p class="text-slate-400">Gerencie seu site e solicitações</p>
            </div>

            <!-- Tabs -->
            <div class="border-b border-slate-700 mb-8">
                <nav class="-mb-px flex space-x-8 overflow-x-auto">
                    <button
                        class="tab-btn active whitespace-nowrap py-2 px-1 border-b-2 border-primary text-primary font-medium text-sm"
                        data-tab="overview"
                    >
                        <i data-lucide="bar-chart-3" class="h-4 w-4 inline mr-2"></i>
                        Visão Geral
                    </button>
                    <button
                        class="tab-btn whitespace-nowrap py-2 px-1 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium text-sm"
                        data-tab="requests"
                    >
                        <i data-lucide="inbox" class="h-4 w-4 inline mr-2"></i>
                        Solicitações
                    </button>
                    <button
                        class="tab-btn whitespace-nowrap py-2 px-1 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium text-sm"
                        data-tab="customization"
                    >
                        <i data-lucide="palette" class="h-4 w-4 inline mr-2"></i>
                        Personalização
                    </button>
                    <button
                        class="tab-btn whitespace-nowrap py-2 px-1 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium text-sm"
                        data-tab="analytics"
                    >
                        <i data-lucide="trending-up" class="h-4 w-4 inline mr-2"></i>
                        Analytics
                    </button>
                </nav>
            </div>

            <!-- Tab Contents -->
            
            <!-- Overview Tab -->
            <div id="overview-tab" class="tab-content">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div id="statsCards">
                        <!-- Stats will be loaded by JavaScript -->
                    </div>
                </div>

                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Acesso Rápido</h3>
                    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <a href="/<?php echo htmlspecialchars($client['slug']); ?>" target="_blank" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                            <i data-lucide="external-link" class="h-6 w-6 text-blue-400"></i>
                            <div>
                                <p class="text-white font-medium">Ver Site Público</p>
                                <p class="text-slate-400 text-sm">Visualizar como os usuários veem</p>
                            </div>
                        </a>
                        <button onclick="switchTab('customization')" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left">
                            <i data-lucide="palette" class="h-6 w-6 text-purple-400"></i>
                            <div>
                                <p class="text-white font-medium">Personalizar</p>
                                <p class="text-slate-400 text-sm">Editar cores, textos e logo</p>
                            </div>
                        </button>
                        <button onclick="switchTab('analytics')" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left">
                            <i data-lucide="trending-up" class="h-6 w-6 text-green-400"></i>
                            <div>
                                <p class="text-white font-medium">Ver Analytics</p>
                                <p class="text-slate-400 text-sm">Estatísticas detalhadas</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Requests Tab -->
            <div id="requests-tab" class="tab-content hidden">
                <!-- Filters -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                <select
                                    id="statusFilter"
                                    class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
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
                                    id="typeFilter"
                                    class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="movie">Filmes</option>
                                    <option value="tv">Séries</option>
                                </select>
                            </div>
                        </div>

                        <button
                            id="refreshRequests"
                            class="flex items-center justify-center space-x-2 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition-colors text-sm"
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
            <div id="customization-tab" class="tab-content hidden">
                <form id="customizationForm" class="space-y-8">
                    <!-- Informações da Empresa -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="building" class="h-6 w-6 text-blue-400"></i>
                            <h3 class="text-xl font-semibold text-white">Informações da Empresa</h3>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Nome da Empresa *
                                    <span class="text-xs text-slate-500 block">Para identificação administrativa</span>
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    value="<?php echo htmlspecialchars($client['name'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Minha Empresa Ltda"
                                    required
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Slug da URL
                                    <span class="text-xs text-slate-500 block">Não pode ser alterado</span>
                                </label>
                                <input
                                    type="text"
                                    value="<?php echo htmlspecialchars($client['slug'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-slate-300 cursor-not-allowed"
                                    disabled
                                />
                                <p class="text-xs text-slate-500 mt-1">
                                    Seu site: <span class="text-blue-400"><?php echo BASE_URL; ?>/<?php echo htmlspecialchars($client['slug'] ?? ''); ?></span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Identidade Visual do Site -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="eye" class="h-6 w-6 text-purple-400"></i>
                            <h3 class="text-xl font-semibold text-white">Identidade Visual do Site</h3>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Nome do Site *
                                    <span class="text-xs text-slate-500 block">Nome que aparece no navbar e títulos</span>
                                </label>
                                <input
                                    type="text"
                                    id="siteName"
                                    value="<?php echo htmlspecialchars($client['site_name'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="CineMania"
                                    required
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Slogan/Tagline
                                    <span class="text-xs text-slate-500 block">Frase de efeito do seu site</span>
                                </label>
                                <input
                                    type="text"
                                    id="siteTagline"
                                    value="<?php echo htmlspecialchars($client['site_tagline'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Seu entretenimento, nossa paixão"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    URL do Logo
                                    <span class="text-xs text-slate-500 block">Logo que aparece no navbar</span>
                                </label>
                                <input
                                    type="url"
                                    id="logoUrl"
                                    value="<?php echo htmlspecialchars($client['logo_url'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="https://exemplo.com/logo.png"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    URL do Favicon
                                    <span class="text-xs text-slate-500 block">Ícone da aba do navegador</span>
                                </label>
                                <input
                                    type="url"
                                    id="faviconUrl"
                                    value="<?php echo htmlspecialchars($client['favicon_url'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="https://exemplo.com/favicon.ico"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Esquema de Cores -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="palette" class="h-6 w-6 text-green-400"></i>
                            <h3 class="text-xl font-semibold text-white">Esquema de Cores</h3>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Cor Primária
                                    <span class="text-xs text-slate-500 block">Botões principais, navegação ativa, links</span>
                                </label>
                                <div class="flex space-x-3">
                                    <input
                                        type="color"
                                        id="primaryColor"
                                        value="<?php echo htmlspecialchars($client['primary_color'] ?? '#1E40AF'); ?>"
                                        class="w-16 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        id="primaryColorText"
                                        value="<?php echo htmlspecialchars($client['primary_color'] ?? '#1E40AF'); ?>"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="#1E40AF"
                                    />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Cor Secundária
                                    <span class="text-xs text-slate-500 block">CTAs, botões de ação, destaques</span>
                                </label>
                                <div class="flex space-x-3">
                                    <input
                                        type="color"
                                        id="secondaryColor"
                                        value="<?php echo htmlspecialchars($client['secondary_color'] ?? '#DC2626'); ?>"
                                        class="w-16 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        id="secondaryColorText"
                                        value="<?php echo htmlspecialchars($client['secondary_color'] ?? '#DC2626'); ?>"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="#DC2626"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informações de Contato -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="phone" class="h-6 w-6 text-yellow-400"></i>
                            <h3 class="text-xl font-semibold text-white">Informações de Contato</h3>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Email de Contato
                                    <span class="text-xs text-slate-500 block">Para suporte e comunicação</span>
                                </label>
                                <input
                                    type="email"
                                    id="contactEmail"
                                    value="<?php echo htmlspecialchars($client['contact_email'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="contato@meusite.com"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    WhatsApp de Contato
                                    <span class="text-xs text-slate-500 block">Formato: 5511999999999</span>
                                </label>
                                <input
                                    type="text"
                                    id="contactWhatsapp"
                                    value="<?php echo htmlspecialchars($client['contact_whatsapp'] ?? ''); ?>"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="5511999999999"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Textos da Página Inicial -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="type" class="h-6 w-6 text-red-400"></i>
                            <h3 class="text-xl font-semibold text-white">Textos da Página Inicial</h3>
                        </div>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Descrição Geral do Site
                                    <span class="text-xs text-slate-500 block">Texto principal que descreve seu site</span>
                                </label>
                                <textarea
                                    id="siteDescription"
                                    rows="3"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual..."
                                ><?php echo htmlspecialchars($client['site_description'] ?? ''); ?></textarea>
                            </div>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Título Hero
                                        <span class="text-xs text-slate-500 block">Título principal da seção destaque</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="heroTitle"
                                        value="<?php echo htmlspecialchars($client['hero_title'] ?? ''); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Solicite seus Filmes e Séries favoritos"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Subtítulo Hero
                                        <span class="text-xs text-slate-500 block">Complemento do título principal</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="heroSubtitle"
                                        value="<?php echo htmlspecialchars($client['hero_subtitle'] ?? ''); ?>"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Sistema profissional de gerenciamento"
                                    />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Descrição Hero
                                    <span class="text-xs text-slate-500 block">Texto específico da seção destaque</span>
                                </label>
                                <textarea
                                    id="heroDescription"
                                    rows="3"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Pesquise, solicite e acompanhe suas preferências de entretenimento..."
                                ><?php echo htmlspecialchars($client['hero_description'] ?? ''); ?></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-end">
                        <button
                            type="submit"
                            id="saveCustomization"
                            class="flex items-center space-x-2 bg-primary hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            <i data-lucide="save" class="h-5 w-5"></i>
                            <span>Salvar Alterações</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Analytics Tab -->
            <div id="analytics-tab" class="tab-content hidden">
                <div class="grid lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Solicitações nos Últimos 30 Dias</h3>
                            <canvas id="requestsChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                    <div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-white mb-4">Estatísticas do Mês</h3>
                            <div id="monthlyStats" class="space-y-3">
                                <!-- Monthly stats will be loaded by JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Request Details Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
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