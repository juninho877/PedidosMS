class ClientDashboardApp {
    constructor() {
        this.clientData = window.CLIENT_DATA || {};
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        console.log('Initializing ClientDashboardApp with data:', this.clientData);
        this.setupTabListeners();
        this.switchTab('overview');
        
        // Make instance globally available
        window.clientDashboard = this;
    }

    setupTabListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        this.currentTab = tabName;
        
        // Update tab buttons
        this.updateTabButtons(tabName);
        
        // Show loading state
        this.showLoading();
        
        // Render tab content
        switch (tabName) {
            case 'overview':
                this.renderOverviewTab();
                break;
            case 'requests':
                this.renderRequestsTab();
                break;
            case 'customization':
                this.renderCustomizationTab();
                break;
            case 'analytics':
                this.renderAnalyticsTab();
                break;
            default:
                this.showError('Aba não encontrada');
        }
    }

    updateTabButtons(activeTab) {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            const tabName = button.getAttribute('data-tab');
            if (tabName === activeTab) {
                button.className = 'tab-button py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-400';
            } else {
                button.className = 'tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300';
            }
        });
    }

    showLoading() {
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <div class="text-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p class="text-slate-400">Carregando...</p>
            </div>
        `;
    }

    showError(message) {
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <div class="text-center py-12">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                    <i data-lucide="alert-circle" class="h-8 w-8 text-red-400 mx-auto mb-4"></i>
                    <p class="text-red-400 font-medium">${message}</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    async renderOverviewTab() {
        try {
            console.log('Rendering overview tab');
            
            // Fetch stats
            const statsResponse = await fetch('/api/client-requests.php/stats');
            const stats = statsResponse.ok ? await statsResponse.json() : {
                total: 0, pending: 0, approved: 0, denied: 0
            };

            const tabContent = document.getElementById('tabContent');
            tabContent.innerHTML = `
                <div class="space-y-8">
                    <!-- Client Info -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-white mb-4">Informações do Cliente</h2>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <p class="text-slate-400 text-sm">Nome da Empresa</p>
                                <p class="text-white font-medium">${this.clientData.name || 'Não informado'}</p>
                            </div>
                            <div>
                                <p class="text-slate-400 text-sm">Slug do Site</p>
                                <p class="text-white font-medium">${this.clientData.slug || 'Não informado'}</p>
                            </div>
                            <div>
                                <p class="text-slate-400 text-sm">Nome do Site</p>
                                <p class="text-white font-medium">${this.clientData.site_name || 'Não informado'}</p>
                            </div>
                            <div>
                                <p class="text-slate-400 text-sm">Email de Contato</p>
                                <p class="text-white font-medium">${this.clientData.contact_email || 'Não informado'}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Cards -->
                    <div class="grid md:grid-cols-4 gap-6">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="list" class="h-8 w-8 text-blue-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${stats.total || 0}</p>
                                    <p class="text-sm text-slate-400">Total</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="clock" class="h-8 w-8 text-yellow-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${stats.pending || 0}</p>
                                    <p class="text-sm text-slate-400">Pendentes</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${stats.approved || 0}</p>
                                    <p class="text-sm text-slate-400">Aprovadas</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
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
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-white mb-4">Ações Rápidas</h2>
                        <div class="flex flex-wrap gap-4">
                            <button onclick="window.clientDashboard.switchTab('requests')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                <i data-lucide="list" class="h-4 w-4 inline mr-2"></i>
                                Ver Solicitações
                            </button>
                            <button onclick="window.clientDashboard.switchTab('customization')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                                <i data-lucide="palette" class="h-4 w-4 inline mr-2"></i>
                                Personalizar Site
                            </button>
                            <a href="/${this.clientData.slug}" target="_blank" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center">
                                <i data-lucide="external-link" class="h-4 w-4 inline mr-2"></i>
                                Ver Site Público
                            </a>
                        </div>
                    </div>
                </div>
            `;

            lucide.createIcons();
        } catch (error) {
            console.error('Error rendering overview tab:', error);
            this.showError('Erro ao carregar visão geral');
        }
    }

    async renderRequestsTab() {
        try {
            console.log('Rendering requests tab');
            
            const response = await fetch('/api/client-requests.php');
            const requests = response.ok ? await response.json() : [];

            const tabContent = document.getElementById('tabContent');
            tabContent.innerHTML = `
                <div class="space-y-6">
                    <!-- Filters -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div class="flex flex-wrap gap-4">
                            <select id="statusFilter" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                                <option value="">Todos os Status</option>
                                <option value="pending">Pendentes</option>
                                <option value="approved">Aprovadas</option>
                                <option value="denied">Negadas</option>
                            </select>
                            <select id="typeFilter" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white">
                                <option value="">Todos os Tipos</option>
                                <option value="movie">Filmes</option>
                                <option value="tv">Séries</option>
                            </select>
                            <button id="applyFilters" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    <!-- Requests List -->
                    <div id="requestsList">
                        ${this.renderRequestsList(requests)}
                    </div>
                </div>
            `;

            // Setup filter listeners
            document.getElementById('applyFilters').addEventListener('click', () => {
                this.applyRequestFilters();
            });

            lucide.createIcons();
        } catch (error) {
            console.error('Error rendering requests tab:', error);
            this.showError('Erro ao carregar solicitações');
        }
    }

    renderRequestsList(requests) {
        if (!requests || requests.length === 0) {
            return `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                    <p class="text-slate-400">Nenhuma solicitação encontrada</p>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                ${requests.map(request => `
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-white mb-2">${request.content_title}</h3>
                                <div class="flex flex-wrap gap-4 text-sm text-slate-400 mb-3">
                                    <span><i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4 inline mr-1"></i>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                    <span><i data-lucide="user" class="h-4 w-4 inline mr-1"></i>${request.requester_name}</span>
                                    <span><i data-lucide="calendar" class="h-4 w-4 inline mr-1"></i>${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                        ${this.getStatusLabel(request.status)}
                                    </span>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                ${request.status === 'pending' ? `
                                    <button onclick="window.clientDashboard.updateRequestStatus(${request.id}, 'approved')" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                                        <i data-lucide="check" class="h-4 w-4 inline mr-1"></i>Aprovar
                                    </button>
                                    <button onclick="window.clientDashboard.updateRequestStatus(${request.id}, 'denied')" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                                        <i data-lucide="x" class="h-4 w-4 inline mr-1"></i>Negar
                                    </button>
                                ` : ''}
                                <a href="https://wa.me/${request.requester_whatsapp}" target="_blank" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                                    <i data-lucide="message-circle" class="h-4 w-4 inline mr-1"></i>WhatsApp
                                </a>
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
            case 'approved': return 'Aprovada';
            case 'denied': return 'Negada';
            default: return 'Desconhecido';
        }
    }

    async applyRequestFilters() {
        const statusFilter = document.getElementById('statusFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('content_type', typeFilter);
        
        try {
            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = response.ok ? await response.json() : [];
            
            document.getElementById('requestsList').innerHTML = this.renderRequestsList(requests);
            lucide.createIcons();
        } catch (error) {
            console.error('Error applying filters:', error);
            this.showToast('Erro ao aplicar filtros', 'error');
        }
    }

    async updateRequestStatus(id, status) {
        try {
            const response = await fetch('/api/client-requests.php/update-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });

            if (response.ok) {
                this.showToast('Status atualizado com sucesso', 'success');
                this.applyRequestFilters(); // Refresh the list
            } else {
                throw new Error('Erro ao atualizar status');
            }
        } catch (error) {
            console.error('Error updating request status:', error);
            this.showToast('Erro ao atualizar status', 'error');
        }
    }

    async renderCustomizationTab() {
        try {
            console.log('Rendering customization tab');
            
            const tabContent = document.getElementById('tabContent');
            tabContent.innerHTML = `
                <div class="max-w-4xl mx-auto">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h2 class="text-xl font-semibold text-white mb-6">Personalização do Site</h2>
                        
                        <form id="customizationForm" class="space-y-6">
                            <!-- Basic Info -->
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                    <input type="text" id="name" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" value="${this.clientData.name || ''}" required>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                    <input type="text" id="site_name" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" value="${this.clientData.site_name || ''}" required>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                                <input type="text" id="site_tagline" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" value="${this.clientData.site_tagline || ''}">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                                <textarea id="site_description" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">${this.clientData.site_description || ''}</textarea>
                            </div>

                            <!-- Contact Info -->
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                    <input type="email" id="contact_email" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" value="${this.clientData.contact_email || ''}">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                                    <input type="text" id="contact_whatsapp" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" value="${this.clientData.contact_whatsapp || ''}" placeholder="5511999999999">
                                </div>
                            </div>

                            <!-- Hero Section -->
                            <div class="space-y-4">
                                <h3 class="text-lg font-semibold text-white">Seção Principal (Hero)</h3>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                    <input type="text" id="hero_title" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" value="${this.clientData.hero_title || ''}">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                    <input type="text" id="hero_subtitle" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" value="${this.clientData.hero_subtitle || ''}">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                                    <textarea id="hero_description" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">${this.clientData.hero_description || ''}</textarea>
                                </div>
                            </div>

                            <!-- Colors -->
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                    <input type="color" id="primary_color" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg" value="${this.clientData.primary_color || '#1E40AF'}">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                    <input type="color" id="secondary_color" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg" value="${this.clientData.secondary_color || '#DC2626'}">
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex justify-end">
                                <button type="submit" id="saveBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                                    <i data-lucide="save" class="h-4 w-4 inline mr-2"></i>
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            // Setup form listener
            document.getElementById('customizationForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCustomization();
            });

            lucide.createIcons();
        } catch (error) {
            console.error('Error rendering customization tab:', error);
            this.showError('Erro ao carregar personalização');
        }
    }

    async saveCustomization() {
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;
        
        try {
            // Show loading state
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>Salvando...';

            // Collect form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                site_name: document.getElementById('site_name').value.trim(),
                site_tagline: document.getElementById('site_tagline').value.trim(),
                site_description: document.getElementById('site_description').value.trim(),
                contact_email: document.getElementById('contact_email').value.trim(),
                contact_whatsapp: document.getElementById('contact_whatsapp').value.replace(/\D/g, ''),
                hero_title: document.getElementById('hero_title').value.trim(),
                hero_subtitle: document.getElementById('hero_subtitle').value.trim(),
                hero_description: document.getElementById('hero_description').value.trim(),
                primary_color: document.getElementById('primary_color').value,
                secondary_color: document.getElementById('secondary_color').value
            };

            console.log('Saving customization data:', formData);

            // Send to API
            const response = await fetch(`/api/client-tenants.php/${this.clientData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Save result:', result);
                
                // Reload client data
                await this.reloadClientData();
                
                // Update navbar
                this.updateNavbar();
                
                this.showToast('Alterações salvas com sucesso!', 'success');
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao salvar alterações');
            }
        } catch (error) {
            console.error('Error saving customization:', error);
            this.showToast('Erro ao salvar alterações: ' + error.message, 'error');
        } finally {
            // Reset button
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }

    async reloadClientData() {
        try {
            console.log('Reloading client data...');
            const response = await fetch('/api/client-auth.php/me');
            if (response.ok) {
                const result = await response.json();
                this.clientData = result.client;
                window.CLIENT_DATA = this.clientData;
                console.log('Client data reloaded:', this.clientData);
            }
        } catch (error) {
            console.error('Error reloading client data:', error);
        }
    }

    updateNavbar() {
        const clientNameDisplay = document.getElementById('clientNameDisplay');
        if (clientNameDisplay) {
            clientNameDisplay.textContent = `Olá, ${this.clientData.name}`;
        }
    }

    async renderAnalyticsTab() {
        try {
            console.log('Rendering analytics tab');
            
            const response = await fetch('/api/client-analytics.php');
            const analytics = response.ok ? await response.json() : {
                daily_requests: [],
                approval_rate: 0,
                daily_average: 0,
                most_requested_type: 'N/A'
            };

            const tabContent = document.getElementById('tabContent');
            tabContent.innerHTML = `
                <div class="space-y-8">
                    <!-- Metrics Cards -->
                    <div class="grid md:grid-cols-3 gap-6">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${analytics.approval_rate}%</p>
                                    <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="calendar" class="h-8 w-8 text-blue-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${analytics.daily_average}</p>
                                    <p class="text-sm text-slate-400">Média Diária</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="star" class="h-8 w-8 text-purple-400"></i>
                                <div>
                                    <p class="text-2xl font-bold text-white">${analytics.most_requested_type}</p>
                                    <p class="text-sm text-slate-400">Mais Solicitado</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Activity Chart -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Atividade dos Últimos 30 Dias</h3>
                        <div class="space-y-2">
                            ${analytics.daily_requests.length > 0 ? 
                                analytics.daily_requests.map(day => `
                                    <div class="flex items-center space-x-3">
                                        <span class="text-sm text-slate-400 w-20">${new Date(day.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</span>
                                        <div class="flex-1 bg-slate-700 rounded-full h-2">
                                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.max(5, (day.count / Math.max(...analytics.daily_requests.map(d => d.count))) * 100)}%"></div>
                                        </div>
                                        <span class="text-sm text-white w-8">${day.count}</span>
                                    </div>
                                `).join('') :
                                '<p class="text-slate-400 text-center py-8">Nenhum dado disponível</p>'
                            }
                        </div>
                    </div>
                </div>
            `;

            lucide.createIcons();
        } catch (error) {
            console.error('Error rendering analytics tab:', error);
            this.showError('Erro ao carregar analytics');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
        
        toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" class="h-4 w-4"></i>
                <span>${message}</span>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        lucide.createIcons();
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ClientDashboardApp');
    new ClientDashboardApp();
});