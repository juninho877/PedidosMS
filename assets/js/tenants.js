class TenantsApp {
    constructor() {
        this.init();
    }

    init() {
        this.loadTenants();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addTenantBtn').addEventListener('click', () => {
            this.showTenantModal();
        });
    }

    async loadTenants() {
        try {
            const response = await fetch('/api/tenants.php');
            const tenants = await response.json();

            if (response.ok) {
                this.renderTenants(tenants);
            } else {
                console.error('Error loading tenants:', tenants.error);
            }
        } catch (error) {
            console.error('Error loading tenants:', error);
        }
    }

    renderTenants(tenants) {
        const container = document.getElementById('tenantsList');
        
        if (tenants.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="users" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhum cliente cadastrado</h3>
                    <p class="text-slate-500">Clique em "Novo Cliente" para começar.</p>
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
        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        ${tenant.logo_url ? `
                            <img src="${tenant.logo_url}" alt="Logo" class="h-12 w-12 object-contain rounded-lg">
                        ` : `
                            <div class="h-12 w-12 bg-slate-700 rounded-lg flex items-center justify-center">
                                <i data-lucide="building" class="h-6 w-6 text-slate-400"></i>
                            </div>
                        `}
                        <div>
                            <h3 class="text-lg font-semibold text-white">${tenant.site_name || tenant.name}</h3>
                            <p class="text-slate-400">/${tenant.slug}</p>
                            <div class="flex items-center space-x-4 mt-1">
                                <span class="text-sm text-slate-500">
                                    Criado em ${new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                                </span>
                                <span class="px-2 py-1 rounded-full text-xs font-medium ${
                                    tenant.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                }">
                                    ${tenant.active ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <a href="/${tenant.slug}" target="_blank" class="p-2 text-slate-400 hover:text-white transition-colors">
                            <i data-lucide="external-link" class="h-5 w-5"></i>
                        </a>
                        <button onclick="editTenant(${tenant.id})" class="p-2 text-slate-400 hover:text-white transition-colors">
                            <i data-lucide="edit" class="h-5 w-5"></i>
                        </button>
                        <button onclick="deleteTenant(${tenant.id})" class="p-2 text-red-400 hover:text-red-300 transition-colors">
                            <i data-lucide="trash-2" class="h-5 w-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showTenantModal(tenant = null) {
        const modal = document.getElementById('tenantModal');
        const isEdit = tenant !== null;
        
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">
                        ${isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                    </h2>
                    <button id="closeModal" class="text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <form id="tenantForm" class="p-6 space-y-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-white">Informações Básicas</h3>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Slug (URL)</label>
                                <input type="text" id="slug" value="${tenant?.slug || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" ${isEdit ? 'readonly' : ''} required>
                                <p class="text-xs text-slate-500 mt-1">Será usado na URL: /${tenant?.slug || 'exemplo'}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input type="text" id="name" value="${tenant?.name || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" required>
                            </div>
                            
                            ${!isEdit ? `
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Senha de Acesso</label>
                                    <input type="password" id="password" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" required>
                                </div>
                            ` : ''}
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input type="text" id="siteName" value="${tenant?.site_name || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" required>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-white">Contato</h3>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                <input type="email" id="contactEmail" value="${tenant?.contact_email || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                                <input type="text" id="contactWhatsapp" value="${tenant?.contact_whatsapp || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                    <input type="color" id="primaryColor" value="${tenant?.primary_color || '#3b82f6'}" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                    <input type="color" id="secondaryColor" value="${tenant?.secondary_color || '#8b5cf6'}" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-white">Conteúdo do Site</h3>
                        
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                <input type="text" id="heroTitle" value="${tenant?.hero_title || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                <input type="text" id="heroSubtitle" value="${tenant?.hero_subtitle || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                            <input type="text" id="siteTagline" value="${tenant?.site_tagline || ''}" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                            <textarea id="siteDescription" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">${tenant?.site_description || ''}</textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição da Seção Principal</label>
                            <textarea id="heroDescription" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">${tenant?.hero_description || ''}</textarea>
                        </div>
                    </div>

                    <div class="flex space-x-4">
                        <button type="button" id="cancelBtn" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                            ${isEdit ? 'Atualizar' : 'Criar'} Cliente
                        </button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.remove('hidden');

        // Setup event listeners
        document.getElementById('closeModal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('tenantForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTenant(tenant?.id);
        });

        lucide.createIcons();
    }

    async saveTenant(id = null) {
        const formData = {
            slug: document.getElementById('slug').value,
            name: document.getElementById('name').value,
            site_name: document.getElementById('siteName').value,
            site_tagline: document.getElementById('siteTagline').value,
            site_description: document.getElementById('siteDescription').value,
            hero_title: document.getElementById('heroTitle').value,
            hero_subtitle: document.getElementById('heroSubtitle').value,
            hero_description: document.getElementById('heroDescription').value,
            contact_email: document.getElementById('contactEmail').value,
            contact_whatsapp: document.getElementById('contactWhatsapp').value,
            primary_color: document.getElementById('primaryColor').value,
            secondary_color: document.getElementById('secondaryColor').value,
            logo_url: '',
            favicon_url: ''
        };

        if (!id) {
            formData.password = document.getElementById('password').value;
        }

        try {
            const url = id ? `/api/tenants.php/${id}` : '/api/tenants.php';
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showToast(result.message, 'success');
                document.getElementById('tenantModal').classList.add('hidden');
                this.loadTenants();
            } else {
                throw new Error(result.error || 'Erro ao salvar cliente');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions
async function editTenant(id) {
    try {
        const response = await fetch(`/api/tenants.php/${id}`);
        const tenant = await response.json();

        if (response.ok) {
            window.tenantsApp.showTenantModal(tenant);
        } else {
            window.tenantsApp.showToast(tenant.error, 'error');
        }
    } catch (error) {
        window.tenantsApp.showToast('Erro ao carregar cliente', 'error');
    }
}

async function deleteTenant(id) {
    if (!confirm('Tem certeza que deseja remover este cliente?')) {
        return;
    }

    try {
        const response = await fetch(`/api/tenants.php/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            window.tenantsApp.showToast(result.message, 'success');
            window.tenantsApp.loadTenants();
        } else {
            window.tenantsApp.showToast(result.error, 'error');
        }
    } catch (error) {
        window.tenantsApp.showToast('Erro ao remover cliente', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.tenantsApp = new TenantsApp();
});