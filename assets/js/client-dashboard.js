<?php
// Este arquivo agora é a página inicial para tenants
$tenantMiddleware = new TenantMiddleware();
$tenantConfig = $tenantMiddleware->getTenantConfig();

if (!$tenantConfig) {
    http_response_code(404);
    include '404.php';
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($tenantConfig['site_name']); ?> - Sistema de Solicitação de Filmes e Séries</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo htmlspecialchars($tenantConfig['favicon_url']); ?>">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($tenantConfig['primary_color']); ?>;
            --secondary-color: <?php echo htmlspecialchars($tenantConfig['secondary_color']); ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .text-secondary { color: var(--secondary-color); }
    </style>
    <script>
        class ClientDashboard {
            constructor(clientData) {
                this.clientData = clientData;
                this.init();
            }

            init() {
                this.initializeEventListeners();
                this.initializeImagePreviews();
                this.updateColorPreview();
                this.switchTab('general');
            }

            initializeEventListeners() {
                // Tab switching
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const tab = btn.getAttribute('data-tab');
                        this.switchTab(tab);
                    });
                });

                // Image upload handlers
                document.getElementById('logoInput').addEventListener('change', (e) => {
                    if (e.target.files[0]) {
                        this.handleImageUpload(e.target.files[0], 'logo');
                    }
                });

                document.getElementById('faviconInput').addEventListener('change', (e) => {
                    if (e.target.files[0]) {
                        this.handleImageUpload(e.target.files[0], 'favicon');
                    }
                });

                // Remove image handlers
                document.getElementById('removeLogo').addEventListener('click', () => {
                    this.removeImage('logo');
                });

                document.getElementById('removeFavicon').addEventListener('click', () => {
                    this.removeImage('favicon');
                });

                // Color picker sync
                document.getElementById('primaryColor').addEventListener('change', (e) => {
                    document.getElementById('primaryColorText').value = e.target.value;
                    this.updateColorPreview();
                });

                document.getElementById('primaryColorText').addEventListener('input', (e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        document.getElementById('primaryColor').value = e.target.value;
                        this.updateColorPreview();
                    }
                });

                document.getElementById('secondaryColor').addEventListener('change', (e) => {
                    document.getElementById('secondaryColorText').value = e.target.value;
                    this.updateColorPreview();
                });

                document.getElementById('secondaryColorText').addEventListener('input', (e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        document.getElementById('secondaryColor').value = e.target.value;
                        this.updateColorPreview();
                    }
                });

                // Save customization
                document.getElementById('saveCustomization').addEventListener('click', () => {
                    this.saveCustomization();
                });
            }

            initializeImagePreviews() {
                // Set initial image previews from client data
                if (this.clientData.logo_url) {
                    document.getElementById('logoPreview').src = this.clientData.logo_url;
                    document.getElementById('currentLogoUrl').value = this.clientData.logo_url;
                }
                
                if (this.clientData.favicon_url) {
                    document.getElementById('faviconPreview').src = this.clientData.favicon_url;
                    document.getElementById('currentFaviconUrl').value = this.clientData.favicon_url;
                }
            }

            switchTab(tabName) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.add('hidden');
                });

                // Remove active class from all tab buttons
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('bg-primary', 'text-white');
                    btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-700');
                });

                // Show selected tab content
                const selectedContent = document.getElementById(tabName + 'Tab');
                if (selectedContent) {
                    selectedContent.classList.remove('hidden');
                }

                // Add active class to selected tab button
                const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
                if (selectedBtn) {
                    selectedBtn.classList.add('bg-primary', 'text-white');
                    selectedBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-700');
                }

                // Load specific tab data if needed
                if (tabName === 'analytics') {
                    this.loadAnalytics();
                }
            }

            async handleImageUpload(file, type) {
                // Validate file
                const maxSize = type === 'favicon' ? 1024 * 1024 : 2 * 1024 * 1024; // 1MB for favicon, 2MB for logo
                if (file.size > maxSize) {
                    this.showToast(`Arquivo muito grande. Máximo: ${type === 'favicon' ? '1MB' : '2MB'}`, 'error');
                    return;
                }

                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (type === 'favicon') {
                    allowedTypes.push('image/x-icon', 'image/vnd.microsoft.icon');
                }

                if (!allowedTypes.includes(file.type)) {
                    this.showToast('Formato de arquivo não suportado', 'error');
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('type', type);
                    formData.append('tenant_id', this.clientData.id);

                    const response = await fetch('/admin/upload.php', {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || 'Erro no upload');
                    }

                    // Update preview and hidden field
                    this.updateImagePreview(type, result.url);
                    this.showToast('Imagem carregada com sucesso!', 'success');

                } catch (error) {
                    this.showToast(error.message, 'error');
                }
            }

            removeImage(type) {
                const defaultUrl = type === 'logo' ? '/assets/images/placeholder-logo.png' : '/assets/images/placeholder-favicon.png';
                
                // Clear file input
                document.getElementById(type + 'Input').value = '';
                
                // Update preview and hidden field
                this.updateImagePreview(type, '');
                
                this.showToast(`${type === 'logo' ? 'Logo' : 'Favicon'} removido`, 'info');
            }

            updateImagePreview(type, url) {
                const preview = document.getElementById(type + 'Preview');
                const hiddenField = document.getElementById('current' + (type === 'logo' ? 'Logo' : 'Favicon') + 'Url');
                const defaultUrl = type === 'logo' ? '/assets/images/placeholder-logo.png' : '/assets/images/placeholder-favicon.png';
                
                preview.src = url || defaultUrl;
                hiddenField.value = url || '';
            }

            updateColorPreview() {
                const primaryColor = document.getElementById('primaryColorText').value;
                const secondaryColor = document.getElementById('secondaryColorText').value;
                
                // Update CSS variables for live preview
                document.documentElement.style.setProperty('--primary-color', primaryColor);
                document.documentElement.style.setProperty('--secondary-color', secondaryColor);
            }

            async saveCustomization() {
                const saveBtn = document.getElementById('saveCustomization');
                const originalText = saveBtn.textContent;
                
                // Collect form data
                const formData = {
                    name: document.getElementById('companyName').value.trim(),
                    site_name: document.getElementById('siteName').value.trim(),
                    site_tagline: document.getElementById('siteTagline').value.trim(),
                    site_description: document.getElementById('siteDescription').value.trim(),
                    hero_title: document.getElementById('heroTitle').value.trim(),
                    hero_subtitle: document.getElementById('heroSubtitle').value.trim(),
                    hero_description: document.getElementById('heroDescription').value.trim(),
                    contact_email: document.getElementById('contactEmail').value.trim(),
                    contact_whatsapp: document.getElementById('contactWhatsapp').value.trim(),
                    primary_color: document.getElementById('primaryColorText').value,
                    secondary_color: document.getElementById('secondaryColorText').value,
                    logo_url: document.getElementById('currentLogoUrl').value,
                    favicon_url: document.getElementById('currentFaviconUrl').value
                };

                // Validate required fields
                if (!formData.name || !formData.site_name) {
                    this.showToast('Nome da empresa e nome do site são obrigatórios', 'error');
                    return;
                }

                // Show loading
                saveBtn.disabled = true;
                saveBtn.textContent = 'Salvando...';

                try {
                    const response = await fetch(`/api/client-tenants.php/${this.clientData.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        if (result.errors) {
                            // Handle validation errors
                            Object.keys(result.errors).forEach(field => {
                                this.showToast(result.errors[field], 'error');
                            });
                        } else {
                            throw new Error(result.error || 'Erro ao salvar configurações');
                        }
                        return;
                    }

                    this.showToast('Configurações salvas com sucesso!', 'success');
                    
                    // Update client data
                    Object.assign(this.clientData, formData);

                } catch (error) {
                    this.showToast(error.message, 'error');
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.textContent = originalText;
                }
            }

            async loadAnalytics() {
                try {
                    const response = await fetch('/api/client-analytics.php');
                    const analytics = await response.json();

                    if (!response.ok) {
                        throw new Error(analytics.error || 'Erro ao carregar analytics');
                    }

                    this.renderAnalytics(analytics);
                } catch (error) {
                    console.error('Error loading analytics:', error);
                }
            }

            renderAnalytics(analytics) {
                // This would render charts and analytics data
                // For now, just show basic stats
                document.getElementById('analyticsContent').innerHTML = `
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                            <div class="text-2xl font-bold text-white mb-2">${analytics.approval_rate}%</div>
                            <div class="text-sm text-slate-400">Taxa de Aprovação</div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                            <div class="text-2xl font-bold text-white mb-2">${analytics.daily_average}</div>
                            <div class="text-sm text-slate-400">Média Diária</div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                            <div class="text-2xl font-bold text-white mb-2">${analytics.most_requested_type}</div>
                            <div class="text-sm text-slate-400">Mais Solicitado</div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                            <div class="text-2xl font-bold text-white mb-2">30</div>
                            <div class="text-sm text-slate-400">Dias de Dados</div>
                        </div>
                    </div>
                `;
            }
        }
    </script>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-3 group">
                    <?php if ($tenantConfig['logo_url']): ?>
                        <img src="<?php echo htmlspecialchars($tenantConfig['logo_url']); ?>" alt="Logo" class="h-8 w-8 sm:h-10 sm:w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <?php endif; ?>
                    <span class="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo htmlspecialchars($tenantConfig['site_name']); ?>
                    </span>
                </a>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-slate-300 hover:text-white p-2">
                        <i data-lucide="menu" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-primary text-white text-sm lg:text-base">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Início</span>
                    </a>

                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Pesquisar</span>
                    </a>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-slate-700 py-4">
                <div class="space-y-2">
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-primary text-white">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
            <div class="text-center">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    <?php echo htmlspecialchars($tenantConfig['hero_title']); ?>
                </h1>
                <?php if ($tenantConfig['site_tagline']): ?>
                <p class="text-xl sm:text-2xl text-blue-300 mb-4 font-medium">
                    <?php echo htmlspecialchars($tenantConfig['site_tagline']); ?>
                </p>
                <?php endif; ?>
                <p class="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                    <?php echo htmlspecialchars($tenantConfig['site_description'] ?: $tenantConfig['hero_description']); ?>
                </p>
                <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="inline-flex items-center space-x-2 bg-primary hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <i data-lucide="search" class="h-5 w-5 sm:h-6 sm:w-6"></i>
                    <span>Começar Pesquisa</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div class="text-center mb-12 sm:mb-16">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Como Funciona</h2>
            <p class="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto px-4">
                Um processo simples e eficiente para solicitar seus conteúdos favoritos
            </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-primary/50 transition-all group">
                <div class="bg-primary w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="search" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                </div>
                <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">1. Pesquise</h3>
                <p class="text-sm sm:text-base text-slate-400">
                    Use nossa interface integrada com TMDB para encontrar filmes e séries com informações detalhadas e precisas.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all group">
                <div class="bg-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                </div>
                <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">2. Solicite</h3>
                <p class="text-sm sm:text-base text-slate-400">
                    Preencha um formulário simples com seus dados de contato e especificações do conteúdo desejado.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all group sm:col-span-2 lg:col-span-1">
                <div class="bg-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="users" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                </div>
                <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">3. Acompanhe</h3>
                <p class="text-sm sm:text-base text-slate-400">
                    Nossa equipe analisa sua solicitação e você recebe atualizações sobre o status através do WhatsApp.
                </p>
            </div>
        </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-slate-800/30 border-y border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-primary"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">10K+</div>
                    <div class="text-sm sm:text-base text-slate-400">Filmes no Catálogo</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="tv" class="h-6 w-6 sm:h-8 sm:w-8 text-purple-400"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">5K+</div>
                    <div class="text-sm sm:text-base text-slate-400">Séries Disponíveis</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="trending-up" class="h-6 w-6 sm:h-8 sm:w-8 text-green-400"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">98%</div>
                    <div class="text-sm sm:text-base text-slate-400">Taxa de Satisfação</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="star" class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">24h</div>
                    <div class="text-sm sm:text-base text-slate-400">Tempo Médio de Resposta</div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Pronto para solicitar seu conteúdo?
        </h2>
        <p class="text-base sm:text-lg lg:text-xl text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Junte-se a milhares de usuários que já encontraram seus filmes e séries favoritos através do nosso sistema.
        </p>
        <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            <i data-lucide="search" class="h-5 w-5 sm:h-6 sm:w-6"></i>
            <span>Iniciar Pesquisa</span>
        </a>
    </div>

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