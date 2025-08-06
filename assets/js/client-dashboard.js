class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        console.log('ClientDashboardApp: Inicializando...');
        console.log('ClientDashboardApp: Dados do cliente:', this.clientData);
        
        // Load initial tab
        this.switchTab('overview');
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tab click handlers are already set in HTML onclick attributes
        console.log('ClientDashboardApp: Event listeners configurados');
    }

    switchTab(tabName) {
        console.log(`ClientDashboardApp: Mudando para aba: ${tabName}`);
        
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.className = 'tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300';
        });
        
        const activeTab = document.getElementById(`tab-${tabName}`);
        if (activeTab) {
            activeTab.className = 'tab-button py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-400';
        }
        
        // Load tab content
        this.loadTabContent(tabName);
    }

    async loadTabContent(tabName) {
        const tabContent = document.getElementById('tabContent');
        
        // Show loading
        tabContent.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p class="text-slate-400">Carregando...</p>
            </div>
        `;

        try {
            switch (tabName) {
                case 'overview':
                    await this.loadOverview();
                    break;
                case 'requests':
                    await this.loadRequests();
                    break;
                case 'customization':
                    await this.loadCustomization();
                    break;
                case 'analytics':
                    await this.loadAnalytics();
                    break;
                default:
                    tabContent.innerHTML = '<p class="text-slate-400">Aba não encontrada</p>';
            }
        } catch (error) {
            console.error(`Erro ao carregar aba ${tabName}:`, error);
            tabContent.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-red-400">Erro ao carregar conteúdo: ${error.message}</p>
                    <button onclick="clientDashboard.loadTabContent('${tabName}')" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }

    async loadOverview() {
        console.log('ClientDashboardApp: Carregando visão geral...');
        
        try {
            // Load stats
            const statsResponse = await fetch('/api/client-requests.php/stats');
            let stats = { total: 0, pending: 0, approved: 0, denied: 0, movies: 0, tv: 0 };
            
            if (statsResponse.ok) {
                stats = await statsResponse.json();
                console.log('Stats carregadas:', stats);
            } else {
                console.warn('Erro ao carregar stats, usando valores padrão');
            }

            const tabContent = document.getElementById('tabContent');
            tabContent.innerHTML = `
                <div class="space-y-6">
                    <!-- Client Info -->
                    <div class="bg-slate-700/50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Informações do Cliente</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-sm text-slate-400">Nome da Empresa</p>
                                <p class="text-white font-medium">${this.clientData.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-slate-400">Slug do Site</p>
                                <p class="text-white font-medium">${this.clientData.slug || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-slate-400">Nome do Site</p>
                                <p class="text-white font-medium">${this.clientData.site_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p class="text-sm text-slate-400">Email de Contato</p>
                                <p class="text-white font-medium">${this.clientData.contact_email || 'N/A'}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-2">
                            <a href="/${this.clientData.slug || ''}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                                <i data-lucide="external-link" class="h-4 w-4 inline mr-2"></i>
                                Ver Site
                            </a>
                            <button onclick="clientDashboard.switchTab('customization')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                                <i data-lucide="palette" class="h-4 w-4 inline mr-2"></i>
                                Personalizar
                            </button>
                        </div>
                    </div>

                    <!-- Stats Cards -->
                    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="bg-slate-700/50 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="list" class="h-8 w-8 text-blue-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${stats.total || 0}</p>
                                    <p class="text-sm text-slate-400">Total de Solicitações</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-700/50 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="clock" class="h-8 w-8 text-yellow-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${stats.pending || 0}</p>
                                    <p class="text-sm text-slate-400">Pendentes</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-700/50 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${stats.approved || 0}</p>
                                    <p class="text-sm text-slate-400">Aprovadas</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-700/50 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="x-circle" class="h-8 w-8 text-red-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${stats.denied || 0}</p>
                                    <p class="text-sm text-slate-400">Negadas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-slate-700/50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
                        <div class="flex flex-wrap gap-3">
                            <button onclick="clientDashboard.switchTab('requests')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                                <i data-lucide="list" class="h-4 w-4 inline mr-2"></i>
                                Ver Solicitações
                            </button>
                            <button onclick="clientDashboard.switchTab('analytics')" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                                <i data-lucide="trending-up" class="h-4 w-4 inline mr-2"></i>
                                Ver Analytics
                            </button>
                            <button onclick="clientDashboard.switchTab('customization')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
                                <i data-lucide="palette" class="h-4 w-4 inline mr-2"></i>
                                Personalizar Site
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Re-initialize Lucide icons
            lucide.createIcons();
            
        } catch (error) {
            console.error('Erro ao carregar visão geral:', error);
            throw error;
        }
    }

    async loadRequests() {
        console.log('ClientDashboardApp: Carregando solicitações...');
        
        try {
            const response = await fetch('/api/client-requests.php');
            let requests = [];
            
            if (response.ok) {
                requests = await response.json();
                console.log('Solicitações carregadas:', requests);
            } else {
                console.warn('Erro ao carregar solicitações, usando lista vazia');
            }

            const tabContent = document.getElementById('tabContent');
            tabContent.innerHTML = `
                <div class="space-y-6">
                    <!-- Filters -->
                    <div class="bg-slate-700/50 rounded-lg p-4">
                        <div class="flex flex-wrap gap-4">
                            <select id="statusFilter" class="bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm">
                                <option value="">Todos os Status</option>
                                <option value="pending">Pendente</option>
                                <option value="approved">Aprovado</option>
                                <option value="denied">Negado</option>
                            </select>
                            <select id="typeFilter" class="bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white text-sm">
                                <option value="">Todos os Tipos</option>
                                <option value="movie">Filmes</option>
                                <option value="tv">Séries</option>
                            </select>
                            <button onclick="clientDashboard.filterRequests()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                                Filtrar
                            </button>
                        </div>
                    </div>

                    <!-- Requests List -->
                    <div id="requestsList">
                        ${this.renderRequestsList(requests)}
                    </div>
                </div>
            `;

            // Re-initialize Lucide icons
            lucide.createIcons();
            
        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            throw error;
        }
    }

    renderRequestsList(requests) {
        if (!requests || requests.length === 0) {
            return `
                <div class="text-center py-8">
                    <i data-lucide="inbox" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                    <p class="text-slate-400">Nenhuma solicitação encontrada</p>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${requests.map(request => `
                    <div class="bg-slate-700/50 rounded-lg p-4">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h4 class="text-lg font-semibold text-white">${request.content_title}</h4>
                                <div class="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                                    <span class="flex items-center space-x-1">
                                        <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                        <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                    </span>
                                    <span class="flex items-center space-x-1">
                                        <i data-lucide="user" class="h-4 w-4"></i>
                                        <span>${request.requester_name}</span>
                                    </span>
                                    <span class="flex items-center space-x-1">
                                        <i data-lucide="calendar" class="h-4 w-4"></i>
                                        <span>${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                                    </span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                    ${this.getStatusLabel(request.status)}
                                </span>
                                <div class="flex space-x-1">
                                    ${request.status === 'pending' ? `
                                        <button onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-xs">
                                            <i data-lucide="check" class="h-4 w-4"></i>
                                        </button>
                                        <button onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')" class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-xs">
                                            <i data-lucide="x" class="h-4 w-4"></i>
                                        </button>
                                    ` : ''}
                                    <a href="https://wa.me/${request.requester_whatsapp}" target="_blank" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-xs">
                                        <i data-lucide="message-circle" class="h-4 w-4"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getStatusClass(status) {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'approved': return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'denied': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
        }
    }

    getStatusLabel(status) {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'approved': return 'Aprovado';
            case 'denied': return 'Negado';
            default: return 'Desconhecido';
        }
    }

    async updateRequestStatus(requestId, status) {
        try {
            const response = await fetch('/api/client-requests.php/update-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: requestId,
                    status: status
                })
            });

            if (response.ok) {
                this.showToast(`Solicitação ${status === 'approved' ? 'aprovada' : 'negada'} com sucesso!`, 'success');
                this.loadRequests(); // Reload the requests list
            } else {
                throw new Error('Erro ao atualizar status');
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            this.showToast('Erro ao atualizar status da solicitação', 'error');
        }
    }

    async loadCustomization() {
        console.log('ClientDashboardApp: Carregando personalização...');
        
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <div class="space-y-6">
                <form id="customizationForm" class="space-y-6">
                    <!-- Basic Info -->
                    <div class="bg-slate-700/50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input type="text" id="name" value="${this.clientData.name || ''}" class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input type="text" id="site_name" value="${this.clientData.site_name || ''}" class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                                <input type="text" id="site_tagline" value="${this.clientData.site_tagline || ''}" class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                <input type="email" id="contact_email" value="${this.clientData.contact_email || ''}" class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                            </div>
                        </div>
                    </div>

                    <!-- Hero Section -->
                    <div class="bg-slate-700/50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Seção Principal</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                <input type="text" id="hero_title" value="${this.clientData.hero_title || ''}" class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                <input type="text" id="hero_subtitle" value="${this.clientData.hero_subtitle || ''}" class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                                <textarea id="hero_description" rows="3" class="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">${this.clientData.hero_description || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Colors -->
                    <div class="bg-slate-700/50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Cores do Site</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                <input type="color" id="primary_color" value="${this.clientData.primary_color || '#1E40AF'}" class="w-full h-10 bg-slate-600 border border-slate-500 rounded-lg">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                <input type="color" id="secondary_color" value="${this.clientData.secondary_color || '#DC2626'}" class="w-full h-10 bg-slate-600 border border-slate-500 rounded-lg">
                            </div>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-end">
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                            <i data-lucide="save" class="h-4 w-4 inline mr-2"></i>
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Setup form submission
        document.getElementById('customizationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomization();
        });

        // Re-initialize Lucide icons
        lucide.createIcons();
    }

    async saveCustomization() {
        try {
            const formData = {
                name: document.getElementById('name').value,
                site_name: document.getElementById('site_name').value,
                site_tagline: document.getElementById('site_tagline').value,
                contact_email: document.getElementById('contact_email').value,
                hero_title: document.getElementById('hero_title').value,
                hero_subtitle: document.getElementById('hero_subtitle').value,
                hero_description: document.getElementById('hero_description').value,
                primary_color: document.getElementById('primary_color').value,
                secondary_color: document.getElementById('secondary_color').value
            };

            const response = await fetch(`/api/client-tenants.php/${this.clientData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                
                // Update client data with new values
                Object.assign(this.clientData, formData);
                window.CLIENT_DATA = this.clientData;
                
                this.showToast('Configurações salvas com sucesso!', 'success');
                
                // Reload overview if it's visible
                if (this.currentTab === 'overview') {
                    this.loadOverview();
                }
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao salvar configurações');
            }
        } catch (error) {
            console.error('Erro ao salvar personalização:', error);
            this.showToast('Erro ao salvar configurações: ' + error.message, 'error');
        }
    }

    async loadAnalytics() {
        console.log('ClientDashboardApp: Carregando analytics...');
        
        try {
            // Load analytics data
            const response = await fetch('/api/client-analytics.php');
            let analytics = {
                daily_requests: [],
                approval_rate: 0,
                daily_average: 0,
                most_requested_type: 'N/A'
            };
            
            if (response.ok) {
                analytics = await response.json();
                console.log('Analytics carregadas:', analytics);
            } else {
                console.warn('Erro ao carregar analytics, usando valores padrão');
            }

            const tabContent = document.getElementById('tabContent');
            tabContent.innerHTML = `
                <div class="space-y-6">
                    <!-- Metrics Cards -->
                    <div class="grid md:grid-cols-3 gap-4">
                        <div class="bg-slate-700/50 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${analytics.approval_rate}%</p>
                                    <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-700/50 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="calendar" class="h-8 w-8 text-blue-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${analytics.daily_average}</p>
                                    <p class="text-sm text-slate-400">Média Diária</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-700/50 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="star" class="h-8 w-8 text-purple-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${analytics.most_requested_type}</p>
                                    <p class="text-sm text-slate-400">Mais Solicitado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Chart -->
                    <div class="bg-slate-700/50 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Atividade dos Últimos 30 Dias</h3>
                        <div class="space-y-2">
                            ${analytics.daily_requests.map(day => `
                                <div class="flex items-center space-x-3">
                                    <span class="text-sm text-slate-400 w-20">${new Date(day.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</span>
                                    <div class="flex-1 bg-slate-600 rounded-full h-4 relative">
                                        <div class="bg-blue-500 h-4 rounded-full" style="width: ${Math.min(100, (day.count / Math.max(...analytics.daily_requests.map(d => d.count), 1)) * 100)}%"></div>
                                    </div>
                                    <span class="text-sm text-white w-8">${day.count}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            // Re-initialize Lucide icons
            lucide.createIcons();
            
        } catch (error) {
            console.error('Erro ao carregar analytics:', error);
            throw error;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize the app and make it globally available
let clientDashboard;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando ClientDashboardApp...');
    clientDashboard = new ClientDashboardApp();
    window.clientDashboard = clientDashboard; // Make it globally available
});