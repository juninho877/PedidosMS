<?php
require_once '../config/config.php';

$middleware = new ClientAuthMiddleware();
$client = $middleware->requireClientAuth();

// Buscar dados completos do tenant no banco
$database = new Database();
$db = $database->getConnection();
$tenant = new Tenant($db);

if (!$tenant->findById($client['id'])) {
    header('Location: /client/login.php');
    exit;
}

$tenantData = $tenant->toArray();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Cliente - <?php echo htmlspecialchars($tenantData['site_name'] ?: $tenantData['name']); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($tenantData['primary_color'] ?: '#1E40AF'); ?>;
            --secondary-color: <?php echo htmlspecialchars($tenantData['secondary_color'] ?: '#DC2626'); ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .text-secondary { color: var(--secondary-color); }
        .hover\:bg-primary:hover { background-color: var(--primary-color); }
        .focus\:ring-primary:focus { --tw-ring-color: var(--primary-color); }
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <i data-lucide="building" class="h-8 w-8 text-blue-400"></i>
                    <span class="text-xl font-bold text-white">Painel do Cliente</span>
                </div>

                <div class="flex items-center space-x-4">
                    <a href="/<?php echo htmlspecialchars($tenantData['slug']); ?>" target="_blank" class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                        <i data-lucide="external-link" class="h-5 w-5"></i>
                        <span>Ver Site</span>
                    </a>
                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
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
                    Bem-vindo, <?php echo htmlspecialchars($tenantData['name']); ?>
                </h1>
                <p class="text-slate-400">
                    Gerencie seu site: <?php echo htmlspecialchars($tenantData['site_name'] ?: $tenantData['name']); ?>
                </p>
            </div>

            <!-- Tabs -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg mb-8">
                <div class="border-b border-slate-700">
                    <nav class="flex space-x-8 px-6">
                        <button
                            class="tab-btn py-4 px-2 border-b-2 font-medium text-sm transition-colors bg-primary text-white border-primary"
                            data-tab="overview"
                        >
                            <div class="flex items-center space-x-2">
                                <i data-lucide="bar-chart-3" class="h-4 w-4"></i>
                                <span>Visão Geral</span>
                            </div>
                        </button>
                        <button
                            class="tab-btn py-4 px-2 border-b-2 border-transparent font-medium text-sm transition-colors text-slate-400 hover:text-white hover:border-slate-400"
                            data-tab="requests"
                        >
                            <div class="flex items-center space-x-2">
                                <i data-lucide="list" class="h-4 w-4"></i>
                                <span>Solicitações</span>
                            </div>
                        </button>
                        <button
                            class="tab-btn py-4 px-2 border-b-2 border-transparent font-medium text-sm transition-colors text-slate-400 hover:text-white hover:border-slate-400"
                            data-tab="customization"
                        >
                            <div class="flex items-center space-x-2">
                                <i data-lucide="palette" class="h-4 w-4"></i>
                                <span>Personalização</span>
                            </div>
                        </button>
                        <button
                            class="tab-btn py-4 px-2 border-b-2 border-transparent font-medium text-sm transition-colors text-slate-400 hover:text-white hover:border-slate-400"
                            data-tab="analytics"
                        >
                            <div class="flex items-center space-x-2">
                                <i data-lucide="trending-up" class="h-4 w-4"></i>
                                <span>Analytics</span>
                            </div>
                        </button>
                    </nav>
                </div>

                <!-- Tab Contents -->
                <div class="p-6">
                    <!-- Overview Tab -->
                    <div id="overviewTab" class="tab-content">
                        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <div class="flex items-center space-x-3 mb-4">
                                    <i data-lucide="users" class="h-8 w-8 text-blue-400"></i>
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

                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4">Acesso Rápido</h3>
                                <div class="space-y-3">
                                    <a href="/<?php echo htmlspecialchars($tenantData['slug']); ?>" target="_blank" class="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                                        <i data-lucide="external-link" class="h-5 w-5 text-blue-400"></i>
                                        <span class="text-white">Ver Meu Site</span>
                                    </a>
                                    <button class="tab-btn w-full flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors" data-tab="customization">
                                        <i data-lucide="palette" class="h-5 w-5 text-purple-400"></i>
                                        <span class="text-white">Personalizar Site</span>
                                    </button>
                                    <button class="tab-btn w-full flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors" data-tab="requests">
                                        <i data-lucide="list" class="h-5 w-5 text-green-400"></i>
                                        <span class="text-white">Ver Solicitações</span>
                                    </button>
                                </div>
                            </div>

                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4">Informações do Site</h3>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">URL do Site:</span>
                                        <span class="text-white">/<?php echo htmlspecialchars($tenantData['slug']); ?></span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Nome do Site:</span>
                                        <span class="text-white"><?php echo htmlspecialchars($tenantData['site_name'] ?: 'Não definido'); ?></span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Status:</span>
                                        <span class="text-green-400">Ativo</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Criado em:</span>
                                        <span class="text-white"><?php echo date('d/m/Y', strtotime($tenantData['created_at'])); ?></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Requests Tab -->
                    <div id="requestsTab" class="tab-content hidden">
                        <div class="mb-6">
                            <h2 class="text-2xl font-bold text-white mb-4">Minhas Solicitações</h2>
                            
                            <!-- Filters -->
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
                                <div class="flex flex-col sm:flex-row gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Status</label>
                                        <select id="requestStatusFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                            <option value="">Todos</option>
                                            <option value="pending">Pendentes</option>
                                            <option value="approved">Aprovadas</option>
                                            <option value="denied">Negadas</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                                        <select id="requestTypeFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
                                            <option value="">Todos</option>
                                            <option value="movie">Filmes</option>
                                            <option value="tv">Séries</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Requests List -->
                        <div id="clientRequestsList">
                            <!-- Requests will be loaded by JavaScript -->
                        </div>
                    </div>

                    <!-- Customization Tab -->
                    <div id="customizationTab" class="tab-content hidden">
                        <h2 class="text-2xl font-bold text-white mb-6">Personalização do Site</h2>
                        
                        <div class="grid lg:grid-cols-2 gap-8">
                            <!-- Form -->
                            <div class="space-y-6">
                                <!-- Basic Info -->
                                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa *</label>
                                            <input
                                                type="text"
                                                id="companyName"
                                                value="<?php echo htmlspecialchars($tenantData['name'] ?? ''); ?>"
                                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Minha Empresa Ltda"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site *</label>
                                            <input
                                                type="text"
                                                id="siteName"
                                                value="<?php echo htmlspecialchars($tenantData['site_name'] ?? ''); ?>"
                                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="MeuCinema"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Slogan/Tagline</label>
                                            <input
                                                type="text"
                                                id="siteTagline"
                                                value="<?php echo htmlspecialchars($tenantData['site_tagline'] ?? ''); ?>"
                                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Seu cinema na palma da mão"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição Geral do Site</label>
                                            <textarea
                                                id="siteDescription"
                                                rows="3"
                                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual..."
                                            ><?php echo htmlspecialchars($tenantData['site_description'] ?? ''); ?></textarea>
                                        </div>
                                    </div>
                                </div>

                                <!-- Hero Section -->
                                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4">Seção Principal (Hero)</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                            <input
                                                type="text"
                                                id="heroTitle"
                                                value="<?php echo htmlspecialchars($tenantData['hero_title'] ?? ''); ?>"
                                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Solicite seus Filmes e Séries favoritos"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                            <input
                                                type="text"
                                                id="heroSubtitle"
                                                value="<?php echo htmlspecialchars($tenantData['hero_subtitle'] ?? ''); ?>"
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
                                            ><?php echo htmlspecialchars($tenantData['hero_description'] ?? ''); ?></textarea>
                                        </div>
                                    </div>
                                </div>

                                <!-- Contact Info -->
                                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4">Informações de Contato</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                            <input
                                                type="email"
                                                id="contactEmail"
                                                value="<?php echo htmlspecialchars($tenantData['contact_email'] ?? ''); ?>"
                                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="contato@meusite.com"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp (formato: 5511999999999)</label>
                                            <input
                                                type="text"
                                                id="contactWhatsapp"
                                                value="<?php echo htmlspecialchars($tenantData['contact_whatsapp'] ?? ''); ?>"
                                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="5511999999999"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <!-- Images -->
                                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4">Logo e Favicon</h3>
                                    <div class="space-y-6">
                                        <!-- Logo -->
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Logo do Site</label>
                                            <div class="flex items-center space-x-4">
                                                <img
                                                    id="logoPreview"
                                                    src="<?php echo htmlspecialchars($tenantData['logo_url'] ?: '/assets/images/placeholder-logo.png'); ?>"
                                                    alt="Logo Preview"
                                                    class="w-16 h-16 object-contain bg-white rounded-lg border border-slate-600"
                                                />
                                                <div class="flex-1">
                                                    <input
                                                        type="file"
                                                        id="logoInput"
                                                        accept="image/jpeg,image/png,image/gif"
                                                        class="hidden"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        id="currentLogoUrl"
                                                        value="<?php echo htmlspecialchars($tenantData['logo_url'] ?? ''); ?>"
                                                    />
                                                    <div class="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onclick="document.getElementById('logoInput').click()"
                                                            class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                        >
                                                            <i data-lucide="upload" class="h-4 w-4"></i>
                                                            <span>Escolher Arquivo</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            id="removeLogo"
                                                            class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                        >
                                                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                                                            <span>Remover</span>
                                                        </button>
                                                    </div>
                                                    <p class="text-xs text-slate-500 mt-1">Máximo 2MB. Formatos: JPG, PNG, GIF</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Favicon -->
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Favicon</label>
                                            <div class="flex items-center space-x-4">
                                                <img
                                                    id="faviconPreview"
                                                    src="<?php echo htmlspecialchars($tenantData['favicon_url'] ?: '/assets/images/placeholder-favicon.png'); ?>"
                                                    alt="Favicon Preview"
                                                    class="w-8 h-8 object-contain bg-white rounded border border-slate-600"
                                                />
                                                <div class="flex-1">
                                                    <input
                                                        type="file"
                                                        id="faviconInput"
                                                        accept="image/x-icon,image/vnd.microsoft.icon,image/png"
                                                        class="hidden"
                                                    />
                                                    <input
                                                        type="hidden"
                                                        id="currentFaviconUrl"
                                                        value="<?php echo htmlspecialchars($tenantData['favicon_url'] ?? ''); ?>"
                                                    />
                                                    <div class="flex space-x-2">
                                                        <button
                                                            type="button"
                                                            onclick="document.getElementById('faviconInput').click()"
                                                            class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                        >
                                                            <i data-lucide="upload" class="h-4 w-4"></i>
                                                            <span>Escolher Arquivo</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            id="removeFavicon"
                                                            class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                        >
                                                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                                                            <span>Remover</span>
                                                        </button>
                                                    </div>
                                                    <p class="text-xs text-slate-500 mt-1">Máximo 1MB. Formatos: ICO, PNG</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Colors -->
                                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4">Cores do Site</h3>
                                    <div class="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                            <div class="flex space-x-2">
                                                <input
                                                    type="color"
                                                    id="primaryColor"
                                                    value="<?php echo htmlspecialchars($tenantData['primary_color'] ?? '#1E40AF'); ?>"
                                                    class="w-12 h-10 bg-slate-700 border border-slate-600 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    id="primaryColorText"
                                                    value="<?php echo htmlspecialchars($tenantData['primary_color'] ?? '#1E40AF'); ?>"
                                                    class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                    placeholder="#1E40AF"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                            <div class="flex space-x-2">
                                                <input
                                                    type="color"
                                                    id="secondaryColor"
                                                    value="<?php echo htmlspecialchars($tenantData['secondary_color'] ?? '#DC2626'); ?>"
                                                    class="w-12 h-10 bg-slate-700 border border-slate-600 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    id="secondaryColorText"
                                                    value="<?php echo htmlspecialchars($tenantData['secondary_color'] ?? '#DC2626'); ?>"
                                                    class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                    placeholder="#DC2626"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Save Button -->
                                <button
                                    id="saveCustomization"
                                    class="w-full bg-primary hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Salvar Configurações
                                </button>
                            </div>

                            <!-- Preview -->
                            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4">Preview do Site</h3>
                                <div class="bg-slate-900 rounded-lg p-4 border border-slate-600">
                                    <div class="flex items-center space-x-3 mb-4 p-3 bg-slate-800 rounded-lg">
                                        <img id="previewLogo" src="<?php echo htmlspecialchars($tenantData['logo_url'] ?: '/assets/images/placeholder-logo.png'); ?>" alt="Logo" class="w-8 h-8 object-contain">
                                        <span id="previewSiteName" class="text-white font-semibold"><?php echo htmlspecialchars($tenantData['site_name'] ?: 'Nome do Site'); ?></span>
                                    </div>
                                    <div class="text-center py-8">
                                        <h1 id="previewHeroTitle" class="text-2xl font-bold text-white mb-2"><?php echo htmlspecialchars($tenantData['hero_title'] ?: 'Título Principal'); ?></h1>
                                        <p id="previewHeroSubtitle" class="text-blue-300 mb-4"><?php echo htmlspecialchars($tenantData['hero_subtitle'] ?: 'Subtítulo'); ?></p>
                                        <p id="previewHeroDescription" class="text-slate-300 text-sm"><?php echo htmlspecialchars($tenantData['hero_description'] ?: 'Descrição do hero'); ?></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Analytics Tab -->
                    <div id="analyticsTab" class="tab-content hidden">
                        <h2 class="text-2xl font-bold text-white mb-6">Analytics e Relatórios</h2>
                        <div id="analyticsContent">
                            <!-- Analytics content will be loaded by JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Pass client data to JavaScript
        window.CLIENT_DATA = <?php echo json_encode($tenantData); ?>;
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