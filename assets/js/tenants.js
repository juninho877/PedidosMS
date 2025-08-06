class TenantsApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTenants();
    }

    setupEventListeners() {
        // Add tenant button
        document.getElementById('addTenantBtn').addEventListener('click', () => {
            this.showTenantModal();
        });

        // Make tenants instance globally available for onclick handlers
        window.tenants = this;
    }

    async loadTenants() {
        try {
            const response = await fetch('/api/tenants.php');
            const tenants = await response.json();

            if (!response.ok) {
                throw new Error(tenants.error || 'Erro ao carregar clientes');
            }

            this.renderTenants(tenants);
        } catch (error) {
            console.error('Error loading tenants:', error);
            this.showError('Erro ao carregar clientes');
        }
    }

    renderTenants(tenants) {
        const container = document.getElementById('tenantsList');

        if (tenants.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="bg-slate-800/50 rounded-lg p-8 max-w-md mx-auto">
                        <i data-lucide="building" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                        <h3 class="text-lg font-medium text-slate-300 mb-2">
                            Nenhum cliente cadastrado
                        </h3>
                        <p class="text-slate-500 mb-4">
                            Comece criando seu primeiro cliente
                        </p>
                        <button
                            onclick="tenants.showTenantModal()"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Criar Primeiro Cliente
                        </button>
                    </div>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = `
            <div class="grid gap-6">
                ${tenants.map(tenant => this.getTenantHTML(tenant)).join('')}
            </div>
        `;

        lucide.createIcons();
    }

    getTenantHTML(tenant) {
        const statusClass = tenant.active ? 
            'bg-green-500/10 text-green-400 border-green-500/20' : 
            'bg-red-500/10 text-red-400 border-red-500/20';
        const statusText = tenant.active ? 'Ativo' : 'Inativo';
        const statusIcon = tenant.active ? 'check-circle' : 'x-circle';

        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4 flex-1">
                        <!-- Logo -->
                        <div class="flex-shrink-0">
                            ${tenant.logo_url ? `
                                <img
                                    src="${tenant.logo_url}"
                                    alt="${tenant.site_name || tenant.name}"
                                    class="w-12 h-12 object-contain rounded-lg border border-slate-700"
                                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                                />
                                <div class="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center" style="display: none;">
                                    <i data-lucide="building" class="h-6 w-6 text-slate-400"></i>
                                </div>
                            ` : `
                                <div class="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                                    <i data-lucide="building" class="h-6 w-6 text-slate-400"></i>
                                </div>
                            `}
                        </div>

                        <!-- Tenant Info -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <h3 class="text-lg font-semibold text-white mb-1">
                                        ${tenant.site_name || tenant.name}
                                    </h3>
                                    <p class="text-slate-400 text-sm mb-2">${tenant.name}</p>
                                    <div class="flex items-center space-x-4 text-sm text-slate-400">
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="link" class="h-4 w-4"></i>
                                            <a 
                                                href="/${tenant.slug}" 
                                                target="_blank"
                                                class="hover:text-blue-400 transition-colors"
                                            >
                                                /${tenant.slug}
                                            </a>
                                        </div>
                                        ${tenant.contact_email ? `
                                            <div class="flex items-center space-x-1">
                                                <i data-lucide="mail" class="h-4 w-4"></i>
                                                <span class="truncate">${tenant.contact_email}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                
                                <div class="flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${statusClass}">
                                    <i data-lucide="${statusIcon}" class="h-4 w-4"></i>
                                    <span>${statusText}</span>
                                </div>
                            </div>

                            <!-- Additional Info -->
                            <div class="grid sm:grid-cols-2 gap-4 mb-4">
                                ${tenant.site_tagline ? `
                                    <div>
                                        <span class="text-slate-400 text-sm">Slogan:</span>
                                        <span class="text-white ml-2 text-sm">${tenant.site_tagline}</span>
                                    </div>
                                ` : ''}
                                ${tenant.contact_whatsapp ? `
                                    <div>
                                        <span class="text-slate-400 text-sm">WhatsApp:</span>
                                        <a 
                                            href="https://wa.me/${tenant.contact_whatsapp}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-green-400 hover:text-green-300 transition-colors ml-2 text-sm"
                                        >
                                            ${this.formatWhatsApp(tenant.contact_whatsapp)}
                                        </a>
                                    </div>
                                ` : ''}
                            </div>

                            <!-- Colors Preview -->
                            ${tenant.primary_color || tenant.secondary_color ? `
                                <div class="flex items-center space-x-4 mb-4">
                                    <span class="text-slate-400 text-sm">Cores:</span>
                                    <div class="flex space-x-2">
                                        ${tenant.primary_color ? `
                                            <div class="flex items-center space-x-1">
                                                <div 
                                                    class="w-4 h-4 rounded border border-slate-600" 
                                                    style="background-color: ${tenant.primary_color}"
                                                ></div>
                                                <span class="text-xs text-slate-400">Primária</span>
                                            </div>
                                        ` : ''}
                                        ${tenant.secondary_color ? `
                                            <div class="flex items-center space-x-1">
                                                <div 
                                                    class="w-4 h-4 rounded border border-slate-600" 
                                                    style="background-color: ${tenant.secondary_color}"
                                                ></div>
                                                <span class="text-xs text-slate-400">Secundária</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Actions -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2 text-sm text-slate-400">
                                    <i data-lucide="calendar" class="h-4 w-4"></i>
                                    <span>${this.formatDate(tenant.created_at)}</span>
                                </div>

                                <div class="flex items-center space-x-2">
                                    <button
                                        onclick="tenants.viewTenant(${tenant.id})"
                                        class="flex items-center space-x-1 px-3 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors text-sm"
                                    >
                                        <i data-lucide="eye" class="h-4 w-4"></i>
                                        <span>Ver</span>
                                    </button>
                                    <button
                                        onclick="tenants.editTenant(${tenant.id})"
                                        class="flex items-center space-x-1 px-3 py-1 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors text-sm"
                                    >
                                        <i data-lucide="edit" class="h-4 w-4"></i>
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onclick="tenants.deleteTenant(${tenant.id})"
                                        class="flex items-center space-x-1 px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                                    >
                                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showTenantModal(tenant = null) {
        const isEdit = tenant !== null;
        const modal = document.getElementById('tenantModal');

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="building" class="h-6 w-6 text-blue-400"></i>
                        <h2 class="text-xl font-semibold text-white">
                            ${isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                        </h2>
                    </div>
                    <button
                        onclick="document.getElementById('tenantModal').classList.add('hidden')"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Form -->
                <form id="tenantForm" class="p-6 space-y-8">
                    <!-- Informações da Empresa -->
                    <div class="bg-slate-700/30 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="building" class="h-6 w-6 text-blue-400"></i>
                            <h3 class="text-lg font-semibold text-white">Informações da Empresa</h3>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Nome da Empresa *
                                    <span class="text-xs text-slate-500 block">Para identificação administrativa</span>
                                </label>
                                <input
                                    type="text"
                                    id="tenantName"
                                    value="${tenant ? tenant.name : ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Minha Empresa Ltda"
                                    required
                                />
                                <div id="nameError" class="text-red-400 text-sm mt-1 hidden"></div>
                            </div>
                            ${!isEdit ? `
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Slug da URL *
                                        <span class="text-xs text-slate-500 block">Apenas letras, números e hífen</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="tenantSlug"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="minha-empresa"
                                        pattern="[a-zA-Z0-9\\-]+"
                                        required
                                    />
                                    <div id="slugError" class="text-red-400 text-sm mt-1 hidden"></div>
                                    <p class="text-xs text-slate-500 mt-1">
                                        URL do site: <span class="text-blue-400">yourdomain.com/<span id="slugPreview">minha-empresa</span></span>
                                    </p>
                                </div>
                            ` : `
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Slug da URL
                                        <span class="text-xs text-slate-500 block">Não pode ser alterado</span>
                                    </label>
                                    <input
                                        type="text"
                                        value="${tenant.slug}"
                                        class="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-slate-300 cursor-not-allowed"
                                        disabled
                                    />
                                    <p class="text-xs text-slate-500 mt-1">
                                        URL do site: <span class="text-blue-400">yourdomain.com/${tenant.slug}</span>
                                    </p>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Identidade Visual do Site -->
                    <div class="bg-slate-700/30 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="eye" class="h-6 w-6 text-purple-400"></i>
                            <h3 class="text-lg font-semibold text-white">Identidade Visual do Site</h3>
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
                                    value="${tenant ? (tenant.site_name || '') : ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="CineMania"
                                    required
                                />
                                <div id="siteNameError" class="text-red-400 text-sm mt-1 hidden"></div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Slogan/Tagline
                                    <span class="text-xs text-slate-500 block">Frase de efeito do seu site</span>
                                </label>
                                <input
                                    type="text"
                                    id="siteTagline"
                                    value="${tenant ? (tenant.site_tagline || '') : ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    value="${tenant ? (tenant.logo_url || '') : ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://exemplo.com/logo.png"
                                />
                                <div id="logoUrlError" class="text-red-400 text-sm mt-1 hidden"></div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    URL do Favicon
                                    <span class="text-xs text-slate-500 block">Ícone da aba do navegador</span>
                                </label>
                                <input
                                    type="url"
                                    id="faviconUrl"
                                    value="${tenant ? (tenant.favicon_url || '') : ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://exemplo.com/favicon.ico"
                                />
                                <div id="faviconUrlError" class="text-red-400 text-sm mt-1 hidden"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Esquema de Cores -->
                    <div class="bg-slate-700/30 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="palette" class="h-6 w-6 text-green-400"></i>
                            <h3 class="text-lg font-semibold text-white">Esquema de Cores</h3>
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
                                        value="${tenant ? (tenant.primary_color || '#1E40AF') : '#1E40AF'}"
                                        class="w-16 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        id="primaryColorText"
                                        value="${tenant ? (tenant.primary_color || '#1E40AF') : '#1E40AF'}"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="#1E40AF"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                    />
                                </div>
                                <div id="primaryColorError" class="text-red-400 text-sm mt-1 hidden"></div>
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
                                        value="${tenant ? (tenant.secondary_color || '#DC2626') : '#DC2626'}"
                                        class="w-16 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        id="secondaryColorText"
                                        value="${tenant ? (tenant.secondary_color || '#DC2626') : '#DC2626'}"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="#DC2626"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                    />
                                </div>
                                <div id="secondaryColorError" class="text-red-400 text-sm mt-1 hidden"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Informações de Contato -->
                    <div class="bg-slate-700/30 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="phone" class="h-6 w-6 text-yellow-400"></i>
                            <h3 class="text-lg font-semibold text-white">Informações de Contato</h3>
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
                                    value="${tenant ? (tenant.contact_email || '') : ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="contato@meusite.com"
                                />
                                <div id="contactEmailError" class="text-red-400 text-sm mt-1 hidden"></div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    WhatsApp de Contato
                                    <span class="text-xs text-slate-500 block">Formato: 5511999999999</span>
                                </label>
                                <input
                                    type="text"
                                    id="contactWhatsapp"
                                    value="${tenant ? (tenant.contact_whatsapp || '') : ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="5511999999999"
                                />
                                <div id="contactWhatsappError" class="text-red-400 text-sm mt-1 hidden"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Textos da Página Inicial -->
                    <div class="bg-slate-700/30 rounded-lg p-6">
                        <div class="flex items-center space-x-3 mb-6">
                            <i data-lucide="type" class="h-6 w-6 text-red-400"></i>
                            <h3 class="text-lg font-semibold text-white">Textos da Página Inicial</h3>
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
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual..."
                                >${tenant ? (tenant.site_description || '') : ''}</textarea>
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
                                        value="${tenant ? (tenant.hero_title || '') : ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        value="${tenant ? (tenant.hero_subtitle || '') : ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Pesquise, solicite e acompanhe suas preferências de entretenimento..."
                                >${tenant ? (tenant.hero_description || '') : ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button
                            type="button"
                            onclick="document.getElementById('tenantModal').classList.add('hidden')"
                            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            id="saveTenantBtn"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            ${isEdit ? 'Atualizar Cliente' : 'Criar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.remove('hidden');
        
        // Setup modal event listeners
        this.setupModalEventListeners(tenant);
        
        // Re-initialize Lucide icons
        lucide.createIcons();
    }

    setupModalEventListeners(tenant) {
        const form = document.getElementById('tenantForm');
        
        // Auto-generate slug from site name (only for new tenants)
        if (!tenant) {
            const siteNameInput = document.getElementById('siteName');
            const slugInput = document.getElementById('tenantSlug');
            const slugPreview = document.getElementById('slugPreview');
            
            siteNameInput.addEventListener('input', (e) => {
                const slug = this.generateSlug(e.target.value);
                slugInput.value = slug;
                slugPreview.textContent = slug || 'minha-empresa';
            });
            
            slugInput.addEventListener('input', (e) => {
                const slug = this.generateSlug(e.target.value);
                e.target.value = slug;
                slugPreview.textContent = slug || 'minha-empresa';
            });
        }

        // Color picker sync
        this.setupModalColorPickers();

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTenant(tenant);
        });
    }

    setupModalColorPickers() {
        const primaryColorPicker = document.getElementById('primaryColor');
        const primaryColorText = document.getElementById('primaryColorText');
        const secondaryColorPicker = document.getElementById('secondaryColor');
        const secondaryColorText = document.getElementById('secondaryColorText');

        primaryColorPicker.addEventListener('change', (e) => {
            primaryColorText.value = e.target.value;
        });

        primaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                primaryColorPicker.value = e.target.value;
            }
        });

        secondaryColorPicker.addEventListener('change', (e) => {
            secondaryColorText.value = e.target.value;
        });

        secondaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                secondaryColorPicker.value = e.target.value;
            }
        });
    }

    generateSlug(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    async saveTenant(existingTenant) {
        const submitBtn = document.getElementById('saveTenantBtn');
        const isEdit = existingTenant !== null;

        const formData = {
            name: document.getElementById('tenantName').value.trim(),
            site_name: document.getElementById('siteName').value.trim(),
            site_tagline: document.getElementById('siteTagline').value.trim(),
            site_description: document.getElementById('siteDescription').value.trim(),
            logo_url: document.getElementById('logoUrl').value.trim(),
            favicon_url: document.getElementById('faviconUrl').value.trim(),
            hero_title: document.getElementById('heroTitle').value.trim(),
            hero_subtitle: document.getElementById('heroSubtitle').value.trim(),
            hero_description: document.getElementById('heroDescription').value.trim(),
            contact_email: document.getElementById('contactEmail').value.trim(),
            contact_whatsapp: document.getElementById('contactWhatsapp').value.replace(/\D/g, ''),
            primary_color: document.getElementById('primaryColorText').value,
            secondary_color: document.getElementById('secondaryColorText').value
        };

        if (!isEdit) {
            formData.slug = document.getElementById('tenantSlug').value.trim();
        }

        // Clear previous errors
        this.clearFormErrors();

        submitBtn.disabled = true;
        submitBtn.textContent = isEdit ? 'Atualizando...' : 'Criando...';

        try {
            const url = isEdit ? `/api/tenants.php/${existingTenant.id}` : '/api/tenants.php';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    this.showFormErrors(result.errors);
                } else {
                    throw new Error(result.error || 'Erro ao salvar cliente');
                }
                return;
            }

            this.showToast(result.message, 'success');
            document.getElementById('tenantModal').classList.add('hidden');
            this.loadTenants();

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? 'Atualizar Cliente' : 'Criar Cliente';
        }
    }

    async viewTenant(id) {
        try {
            const response = await fetch(`/api/tenants.php/${id}`);
            const tenant = await response.json();

            if (!response.ok) {
                throw new Error(tenant.error || 'Erro ao carregar detalhes');
            }

            this.showTenantDetailsModal(tenant);
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    showTenantDetailsModal(tenant) {
        const modal = document.getElementById('tenantModal');

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">Detalhes do Cliente</h2>
                    <button
                        onclick="document.getElementById('tenantModal').classList.add('hidden')"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <div class="p-6">
                    <div class="grid lg:grid-cols-2 gap-8">
                        <!-- Basic Info -->
                        <div class="space-y-6">
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                                <div class="space-y-3">
                                    <div>
                                        <span class="text-slate-400">Nome da Empresa:</span>
                                        <span class="text-white ml-2">${tenant.name}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Nome do Site:</span>
                                        <span class="text-white ml-2">${tenant.site_name || tenant.name}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Slug:</span>
                                        <span class="text-blue-400 ml-2">/${tenant.slug}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Status:</span>
                                        <span class="text-${tenant.active ? 'green' : 'red'}-400 ml-2">
                                            ${tenant.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-white mb-4">Contato</h3>
                                <div class="space-y-3">
                                    ${tenant.contact_email ? `
                                        <div class="flex items-center space-x-3">
                                            <i data-lucide="mail" class="h-5 w-5 text-slate-400"></i>
                                            <span class="text-white">${tenant.contact_email}</span>
                                        </div>
                                    ` : ''}
                                    ${tenant.contact_whatsapp ? `
                                        <div class="flex items-center space-x-3">
                                            <i data-lucide="phone" class="h-5 w-5 text-slate-400"></i>
                                            <a 
                                                href="https://wa.me/${tenant.contact_whatsapp}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-green-400 hover:text-green-300 transition-colors"
                                            >
                                                ${this.formatWhatsApp(tenant.contact_whatsapp)}
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Visual Identity -->
                        <div class="space-y-6">
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-white mb-4">Identidade Visual</h3>
                                <div class="space-y-4">
                                    ${tenant.logo_url ? `
                                        <div>
                                            <span class="text-slate-400 block mb-2">Logo:</span>
                                            <img src="${tenant.logo_url}" alt="Logo" class="h-12 w-auto object-contain bg-white rounded p-2">
                                        </div>
                                    ` : ''}
                                    
                                    <div class="flex space-x-4">
                                        ${tenant.primary_color ? `
                                            <div>
                                                <span class="text-slate-400 block mb-2">Cor Primária:</span>
                                                <div class="flex items-center space-x-2">
                                                    <div 
                                                        class="w-8 h-8 rounded border border-slate-600" 
                                                        style="background-color: ${tenant.primary_color}"
                                                    ></div>
                                                    <span class="text-white text-sm">${tenant.primary_color}</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                        
                                        ${tenant.secondary_color ? `
                                            <div>
                                                <span class="text-slate-400 block mb-2">Cor Secundária:</span>
                                                <div class="flex items-center space-x-2">
                                                    <div 
                                                        class="w-8 h-8 rounded border border-slate-600" 
                                                        style="background-color: ${tenant.secondary_color}"
                                                    ></div>
                                                    <span class="text-white text-sm">${tenant.secondary_color}</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>

                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-white mb-4">Textos</h3>
                                <div class="space-y-3 text-sm">
                                    ${tenant.site_tagline ? `
                                        <div>
                                            <span class="text-slate-400">Slogan:</span>
                                            <span class="text-white ml-2">${tenant.site_tagline}</span>
                                        </div>
                                    ` : ''}
                                    ${tenant.hero_title ? `
                                        <div>
                                            <span class="text-slate-400">Título Hero:</span>
                                            <span class="text-white ml-2">${tenant.hero_title}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="flex space-x-4">
                                <a
                                    href="/${tenant.slug}"
                                    target="_blank"
                                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors text-center"
                                >
                                    Ver Site
                                </a>
                                <button
                                    onclick="tenants.editTenant(${tenant.id})"
                                    class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        lucide.createIcons();
    }

    async editTenant(id) {
        try {
            const response = await fetch(`/api/tenants.php/${id}`);
            const tenant = await response.json();

            if (!response.ok) {
                throw new Error(tenant.error || 'Erro ao carregar dados do cliente');
            }

            this.showTenantModal(tenant);
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async deleteTenant(id) {
        if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            const response = await fetch(`/api/tenants.php/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao excluir cliente');
            }

            this.showToast(result.message, 'success');
            this.loadTenants();

        } catch (error) {
            this.showToast(error.message, 'error');
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
            document.getElementById('monthlyStats').innerHTML = `
                <div class="text-center py-4">
                    <p class="text-red-400 text-sm">Erro ao carregar analytics</p>
                </div>
            `;
        }
    }

    renderAnalytics(analytics) {
        // Render monthly stats
        document.getElementById('monthlyStats').innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Taxa de Aprovação:</span>
                    <span class="text-white font-medium">${analytics.approval_rate}%</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Média Diária:</span>
                    <span class="text-white font-medium">${analytics.daily_average}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Mais Solicitado:</span>
                    <span class="text-white font-medium">${analytics.most_requested_type}</span>
                </div>
            </div>
        `;

        // Render chart if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.renderChart(analytics.daily_requests);
        }
    }

    renderChart(dailyData) {
        const ctx = document.getElementById('requestsChart').getContext('2d');
        
        // Prepare data for last 30 days
        const last30Days = [];
        const counts = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            last30Days.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
            
            const dayData = dailyData.find(d => d.date === dateStr);
            counts.push(dayData ? parseInt(dayData.count) : 0);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days,
                datasets: [{
                    label: 'Solicitações',
                    data: counts,
                    borderColor: this.clientData.primary_color || '#3b82f6',
                    backgroundColor: (this.clientData.primary_color || '#3b82f6') + '20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e2e8f0'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#374151'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#374151'
                        }
                    }
                }
            }
        });
    }

    showFormErrors(errors) {
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(field + 'Error');
            if (errorElement) {
                errorElement.textContent = errors[field];
                errorElement.classList.remove('hidden');
            }
        });
    }

    clearFormErrors() {
        const errorElements = document.querySelectorAll('[id$="Error"]');
        errorElements.forEach(element => {
            element.classList.add('hidden');
        });
    }

    formatWhatsApp(whatsapp) {
        const numbers = whatsapp.replace(/\D/g, '');
        if (numbers.length === 13) {
            return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 9)}-${numbers.slice(9)}`;
        }
        return whatsapp;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('pt-BR');
    }

    showError(message) {
        document.getElementById('tenantsList').innerHTML = `
            <div class="text-center py-12">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-red-400 font-medium">${message}</p>
                </div>
            </div>
        `;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TenantsApp();
});