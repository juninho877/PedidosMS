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
            this.openTenantModal();
        });
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
                <div class="text-center py-8 sm:py-12">
                    <div class="bg-slate-800/50 rounded-lg p-8 max-w-md mx-auto">
                        <i data-lucide="users" class="h-10 w-10 sm:h-12 sm:w-12 text-slate-500 mx-auto mb-4"></i>
                        <h3 class="text-base sm:text-lg font-medium text-slate-300 mb-2">
                            Nenhum cliente encontrado
                        </h3>
                        <p class="text-sm sm:text-base text-slate-500 px-4">
                            Adicione seu primeiro cliente para começar
                        </p>
                    </div>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = `
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                ${tenants.map(tenant => this.getTenantCardHTML(tenant)).join('')}
            </div>
        `;

        // Setup event listeners for tenant cards
        this.setupTenantEventListeners();
        lucide.createIcons();
    }

    getTenantCardHTML(tenant) {
        const logoUrl = tenant.logo_url || '/assets/images/default-logo.png';
        const faviconUrl = tenant.favicon_url || '/assets/images/default-favicon.ico';
        
        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <img
                            src="${logoUrl}"
                            alt="${tenant.name} Logo"
                            class="w-10 h-10 object-contain rounded-lg bg-slate-700 p-1"
                            onerror="this.src='/assets/images/default-logo.png'"
                        />
                        <div>
                            <h3 class="text-lg font-semibold text-white">${tenant.site_name || tenant.name}</h3>
                            <p class="text-sm text-slate-500">${tenant.name}</p>
                            <p class="text-sm text-slate-400">/${tenant.slug}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${
                            tenant.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                        }">
                            ${tenant.active ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>

                <div class="space-y-2 mb-4">
                    ${tenant.site_tagline ? `
                        <div class="flex items-center space-x-2 text-sm text-slate-400">
                            <i data-lucide="tag" class="h-4 w-4"></i>
                            <span>${tenant.site_tagline}</span>
                        </div>
                    ` : ''}
                    ${tenant.contact_email ? `
                        <div class="flex items-center space-x-2 text-sm text-slate-400">
                            <i data-lucide="mail" class="h-4 w-4"></i>
                            <span>${tenant.contact_email}</span>
                        </div>
                    ` : ''}
                    <div class="flex items-center space-x-2 text-sm text-slate-400">
                        <i data-lucide="calendar" class="h-4 w-4"></i>
                        <span>Criado: ${this.formatDate(tenant.created_at)}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <a
                        href="/${tenant.slug}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span>Visualizar Site</span>
                    </a>
                    
                    <div class="flex items-center space-x-2">
                        <button
                            onclick="tenantsApp.editTenant(${tenant.id})"
                            class="flex items-center space-x-1 px-3 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm"
                        >
                            <i data-lucide="edit" class="h-4 w-4"></i>
                            <span>Editar</span>
                        </button>
                        <button
                            onclick="tenantsApp.deleteTenant(${tenant.id}, '${tenant.name}')"
                            class="flex items-center space-x-1 px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                        >
                            <i data-lucide="trash-2" class="h-4 w-4"></i>
                            <span>Excluir</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupTenantEventListeners() {
        // Make tenantsApp instance globally available for onclick handlers
        window.tenantsApp = this;
    }

    openTenantModal(tenant = null) {
        const isEdit = tenant !== null;
        const modal = document.getElementById('tenantModal');
        
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">
                        ${isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                    </h2>
                    <button
                        onclick="document.getElementById('tenantModal').classList.add('hidden')"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Form -->
                <form id="tenantForm" class="p-6 space-y-6">
                    <!-- Company Information -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <i data-lucide="building" class="h-5 w-5 text-blue-400"></i>
                                <span>Informações da Empresa</span>
                            </h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Nome da Empresa *
                                        <span class="text-xs text-slate-500 block">Nome interno para identificação</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="tenantName"
                                        value="${tenant?.name || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Minha Empresa Ltda"
                                        required
                                    />
                                    <div id="nameError" class="text-red-400 text-sm mt-1 hidden"></div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Slug da URL * (apenas letras, números e hífen)
                                        <span class="text-xs text-slate-500 block">Endereço único do site</span>
                                    </label>
                                    <div class="flex items-center">
                                        <span class="text-slate-400 text-sm mr-2">site.com/</span>
                                        <input
                                            type="text"
                                            id="tenantSlug"
                                            value="${tenant?.slug || ''}"
                                            class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="minha-empresa"
                                            pattern="[a-zA-Z0-9\\-]+"
                                            required
                                            ${isEdit ? 'readonly' : ''}
                                        />
                                    </div>
                                    <div id="slugError" class="text-red-400 text-sm mt-1 hidden"></div>
                                    <p class="text-xs text-slate-500 mt-1">
                                        ${isEdit ? 'O slug não pode ser alterado após a criação' : 'Este será o endereço do site do cliente'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Site Branding -->
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <i data-lucide="globe" class="h-5 w-5 text-green-400"></i>
                                <span>Identidade Visual do Site</span>
                            </h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Nome do Site *
                                        <span class="text-xs text-slate-500 block">Nome que aparece no site público</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="siteName"
                                        value="${tenant?.site_name || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: CineMania"
                                        required
                                    />
                                    <div id="siteNameError" class="text-red-400 text-sm mt-1 hidden"></div>
                                </div>
                            
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Slogan/Tagline
                                        <span class="text-xs text-slate-500 block">Frase de efeito do site</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="siteTagline"
                                        value="${tenant?.site_tagline || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Seu entretenimento, nossa paixão"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Descrição do Site
                                    <span class="text-xs text-slate-500 block">Descrição principal que aparece na página inicial</span>
                                </label>
                                <textarea
                                    id="siteDescription"
                                    rows="3"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Encontre e solicite seus filmes e séries favoritos de forma rápida e fácil"
                                >${tenant?.site_description || ''}</textarea>
                            </div>
                        </div>

                        <!-- Visual Assets -->
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <i data-lucide="image" class="h-5 w-5 text-purple-400"></i>
                                <span>Recursos Visuais</span>
                            </h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        URL do Logo
                                        <span class="text-xs text-slate-500 block">Logo principal do site (PNG/JPG recomendado)</span>
                                    </label>
                                    <input
                                        type="url"
                                        id="logoUrl"
                                        value="${tenant?.logo_url || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://exemplo.com/logo.png"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        URL do Favicon
                                        <span class="text-xs text-slate-500 block">Ícone da aba do navegador (ICO/PNG)</span>
                                    </label>
                                    <input
                                        type="url"
                                        id="faviconUrl"
                                        value="${tenant?.favicon_url || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://exemplo.com/favicon.ico"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Color Scheme -->
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <i data-lucide="palette" class="h-5 w-5 text-pink-400"></i>
                                <span>Esquema de Cores</span>
                            </h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Cor Primária
                                        <span class="text-xs text-slate-500 block">Botões principais, links, destaques</span>
                                    </label>
                                    <div class="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            id="primaryColor"
                                            value="${tenant?.primary_color || '#1E40AF'}"
                                            class="w-16 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            id="primaryColorText"
                                            value="${tenant?.primary_color || '#1E40AF'}"
                                            class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                            pattern="^#[0-9A-Fa-f]{6}$"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Cor Secundária
                                        <span class="text-xs text-slate-500 block">Botões de ação, CTAs, elementos de destaque</span>
                                    </label>
                                    <div class="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            id="secondaryColor"
                                            value="${tenant?.secondary_color || '#DC2626'}"
                                            class="w-16 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            id="secondaryColorText"
                                            value="${tenant?.secondary_color || '#DC2626'}"
                                            class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                            pattern="^#[0-9A-Fa-f]{6}$"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Information -->
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <i data-lucide="phone" class="h-5 w-5 text-green-400"></i>
                                <span>Informações de Contato</span>
                            </h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">
                                        Email de Contato
                                        <span class="text-xs text-slate-500 block">Email para suporte e comunicação</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        value="${tenant?.contact_email || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="contato@minhaempresa.com"
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
                                        value="${tenant?.contact_whatsapp || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="5511999999999"
                                    />
                                    <div id="contactWhatsappError" class="text-red-400 text-sm mt-1 hidden"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Content Customization -->
                    <div class="border-t border-slate-700 pt-6">
                        <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                            <i data-lucide="type" class="h-5 w-5 text-yellow-400"></i>
                            <span>Conteúdo da Página Inicial</span>
                        </h3>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Título Principal (Hero)
                                    <span class="text-xs text-slate-500 block">Título grande que aparece no topo da página</span>
                                </label>
                                <input
                                    type="text"
                                    id="heroTitle"
                                    value="${tenant?.hero_title || 'Solicite seus Filmes e Séries favoritos'}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Encontre seus filmes favoritos aqui"
                                />
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Subtítulo (Hero)
                                    <span class="text-xs text-slate-500 block">Texto secundário abaixo do título principal</span>
                                </label>
                                <input
                                    type="text"
                                    id="heroSubtitle"
                                    value="${tenant?.hero_subtitle || 'Sistema profissional de gerenciamento de solicitações'}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Sistema profissional de entretenimento"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Descrição Detalhada (Hero)
                                    <span class="text-xs text-slate-500 block">Texto explicativo na seção principal</span>
                                </label>
                                <textarea
                                    id="heroDescription"
                                    rows="3"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Pesquise, solicite e acompanhe suas preferências de entretenimento de forma simples e eficiente"
                                >${tenant?.hero_description || 'Pesquise, solicite e acompanhe suas preferências de entretenimento.'}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-700">
                        <button
                            type="button"
                            onclick="document.getElementById('tenantModal').classList.add('hidden')"
                            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            id="submitBtn"
                            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            ${isEdit ? 'Atualizar Cliente' : 'Criar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.remove('hidden');
        
        // Setup form event listeners
        this.setupFormEventListeners(tenant);
        
        // Re-initialize Lucide icons
        lucide.createIcons();
    }

    setupFormEventListeners(tenant = null) {
        const form = document.getElementById('tenantForm');
        const slugInput = document.getElementById('tenantSlug');
        const nameInput = document.getElementById('tenantName');
        const primaryColorInput = document.getElementById('primaryColor');
        const primaryColorText = document.getElementById('primaryColorText');
        const secondaryColorInput = document.getElementById('secondaryColor');
        const secondaryColorText = document.getElementById('secondaryColorText');

        // Auto-generate slug from name (only for new tenants)
        if (!tenant) {
            nameInput.addEventListener('input', (e) => {
                const slug = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();
                slugInput.value = slug;
            });
        }

        // Sync color picker with text input
        primaryColorInput.addEventListener('input', (e) => {
            primaryColorText.value = e.target.value;
        });
        
        primaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                primaryColorInput.value = e.target.value;
            }
        });
        
        secondaryColorInput.addEventListener('input', (e) => {
            secondaryColorText.value = e.target.value;
        });
        
        secondaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                secondaryColorInput.value = e.target.value;
            }
        });
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitTenant(tenant);
        });
    }

    async submitTenant(existingTenant = null) {
        const isEdit = existingTenant !== null;
        const submitBtn = document.getElementById('submitBtn');
        
        // Get form data
        const formData = {
            name: document.getElementById('tenantName').value.trim(),
            slug: document.getElementById('tenantSlug').value.trim(),
            site_name: document.getElementById('siteName').value.trim(),
            site_tagline: document.getElementById('siteTagline').value.trim(),
            site_description: document.getElementById('siteDescription').value.trim(),
            logo_url: document.getElementById('logoUrl').value.trim(),
            favicon_url: document.getElementById('faviconUrl').value.trim(),
            contact_email: document.getElementById('contactEmail').value.trim(),
            contact_whatsapp: document.getElementById('contactWhatsapp').value.replace(/\D/g, ''),
            primary_color: document.getElementById('primaryColor').value,
            secondary_color: document.getElementById('secondaryColor').value,
            hero_title: document.getElementById('heroTitle').value.trim(),
            hero_subtitle: document.getElementById('heroSubtitle').value.trim(),
            hero_description: document.getElementById('heroDescription').value.trim()
        };

        // Clear previous errors
        this.clearFormErrors();

        // Validate
        const errors = this.validateTenantForm(formData, isEdit);
        if (Object.keys(errors).length > 0) {
            this.showFormErrors(errors);
            return;
        }

        // Submit
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

            // Success
            this.showToast(isEdit ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!', 'success');
            document.getElementById('tenantModal').classList.add('hidden');
            this.loadTenants();

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isEdit ? 'Atualizar Cliente' : 'Criar Cliente';
        }
    }

    async editTenant(id) {
        try {
            const response = await fetch(`/api/tenants.php/${id}`);
            const tenant = await response.json();

            if (!response.ok) {
                throw new Error(tenant.error || 'Erro ao carregar cliente');
            }

            this.openTenantModal(tenant);
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async deleteTenant(id, name) {
        if (!confirm(`Tem certeza que deseja excluir o cliente "${name}"?\n\nEsta ação não pode ser desfeita e todos os dados do cliente serão perdidos.`)) {
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

            this.showToast('Cliente excluído com sucesso!', 'success');
            this.loadTenants();

        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    validateTenantForm(data, isEdit) {
        const errors = {};

        if (!data.name || data.name.length < 2) {
            errors.name = 'Nome da empresa deve ter pelo menos 2 caracteres';
        }
        
        if (!data.site_name || data.site_name.length < 2) {
            errors.site_name = 'Nome do site deve ter pelo menos 2 caracteres';
        }

        if (!isEdit) {
            if (!data.slug || !/^[a-zA-Z0-9\-]+$/.test(data.slug)) {
                errors.slug = 'Slug deve conter apenas letras, números e hífen';
            }
            if (data.slug && data.slug.length < 2) {
                errors.slug = 'Slug deve ter pelo menos 2 caracteres';
            }
        }

        if (data.logo_url && !this.isValidUrl(data.logo_url)) {
            errors.logo_url = 'URL do logo inválida';
        }

        if (data.favicon_url && !this.isValidUrl(data.favicon_url)) {
            errors.favicon_url = 'URL do favicon inválida';
        }
        
        if (data.contact_email && !this.isValidEmail(data.contact_email)) {
            errors.contact_email = 'Email de contato inválido';
        }
        
        if (data.contact_whatsapp && !/^55\d{10,11}$/.test(data.contact_whatsapp)) {
            errors.contact_whatsapp = 'WhatsApp deve estar no formato: 5511999999999';
        }

        return errors;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
        const errorElements = ['nameError', 'slugError', 'siteNameError', 'contactEmailError', 'contactWhatsappError'];
        errorElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    showError(message) {
        document.getElementById('tenantsList').innerHTML = `
            <div class="text-center py-8 sm:py-12">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-sm sm:text-base text-red-400 font-medium px-4">${message}</p>
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