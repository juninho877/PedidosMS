class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        console.log('ClientDashboardApp initialized with data:', this.clientData);
        this.setupEventListeners();
        this.loadTab('overview'); // Load default tab
    }

    setupEventListeners() {
        // Tab click handlers are already set in HTML onclick attributes
        console.log('Event listeners setup complete');
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update tab visual states
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.className = 'tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300';
        });
        
        const activeTab = document.getElementById(`tab-${tabName}`);
        if (activeTab) {
            activeTab.className = 'tab-button py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-400';
        }
        
        this.currentTab = tabName;
        this.loadTab(tabName);
    }

    loadTab(tabName) {
        const tabContent = document.getElementById('tabContent');
        
        // Show loading state
        tabContent.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p class="text-slate-400">Carregando...</p>
            </div>
        `;

        // Load content based on tab
        setTimeout(() => {
            switch (tabName) {
                case 'overview':
                    this.loadOverviewTab();
                    break;
                case 'requests':
                    this.loadRequestsTab();
                    break;
                case 'customization':
                    this.loadCustomizationTab();
                    break;
                case 'analytics':
                    this.loadAnalyticsTab();
                    break;
                default:
                    this.loadOverviewTab();
            }
        }, 500); // Small delay to show loading
    }

    loadOverviewTab() {
        console.log('Loading overview tab');
        const tabContent = document.getElementById('tabContent');
        
        tabContent.innerHTML = `
            <div class="space-y-6">
                <!-- Welcome Section -->
                <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6">
                    <h2 class="text-2xl font-bold text-white mb-2">
                        Bem-vindo, ${this.clientData.name || 'Cliente'}!
                    </h2>
                    <p class="text-slate-300">
                        Gerencie suas solicitações e personalize seu site de filmes e séries.
                    </p>
                </div>

                <!-- Stats Cards -->
                <div class="grid md:grid-cols-4 gap-6" id="statsCards">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="list" class="h-8 w-8 text-blue-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="totalRequests">-</p>
                                <p class="text-sm text-slate-400">Total de Solicitações</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="clock" class="h-8 w-8 text-yellow-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="pendingRequests">-</p>
                                <p class="text-sm text-slate-400">Pendentes</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="approvedRequests">-</p>
                                <p class="text-sm text-slate-400">Aprovadas</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="x-circle" class="h-8 w-8 text-red-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="deniedRequests">-</p>
                                <p class="text-sm text-slate-400">Negadas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Acesso Rápido</h3>
                        <div class="space-y-3">
                            <a href="/${this.clientData.slug || 'cliente'}" target="_blank" 
                               class="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors">
                                <i data-lucide="external-link" class="h-5 w-5"></i>
                                <span>Ver meu site</span>
                            </a>
                            <button onclick="clientDashboard.switchTab('customization')" 
                                    class="flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition-colors">
                                <i data-lucide="palette" class="h-5 w-5"></i>
                                <span>Personalizar site</span>
                            </button>
                            <button onclick="clientDashboard.switchTab('requests')" 
                                    class="flex items-center space-x-3 text-green-400 hover:text-green-300 transition-colors">
                                <i data-lucide="list" class="h-5 w-5"></i>
                                <span>Ver solicitações</span>
                            </button>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Informações do Cliente</h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-400">Nome:</span>
                                <span class="text-white">${this.clientData.name || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Slug:</span>
                                <span class="text-white">${this.clientData.slug || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Site:</span>
                                <span class="text-white">${this.clientData.site_name || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Email:</span>
                                <span class="text-white">${this.clientData.contact_email || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Re-initialize Lucide icons
        lucide.createIcons();
        
        // Load stats
        this.loadStats();
    }

    async loadStats() {
        try {
            const response = await fetch('/api/client-requests.php/stats');
            if (response.ok) {
                const stats = await response.json();
                document.getElementById('totalRequests').textContent = stats.total || 0;
                document.getElementById('pendingRequests').textContent = stats.pending || 0;
                document.getElementById('approvedRequests').textContent = stats.approved || 0;
                document.getElementById('deniedRequests').textContent = stats.denied || 0;
            } else {
                console.error('Error loading stats:', response.statusText);
                // Show placeholder values
                document.getElementById('totalRequests').textContent = '0';
                document.getElementById('pendingRequests').textContent = '0';
                document.getElementById('approvedRequests').textContent = '0';
                document.getElementById('deniedRequests').textContent = '0';
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            // Show placeholder values
            document.getElementById('totalRequests').textContent = '0';
            document.getElementById('pendingRequests').textContent = '0';
            document.getElementById('approvedRequests').textContent = '0';
            document.getElementById('deniedRequests').textContent = '0';
        }
    }

    loadRequestsTab() {
        console.log('Loading requests tab');
        const tabContent = document.getElementById('tabContent');
        
        tabContent.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 class="text-2xl font-bold text-white">Solicitações</h2>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <select id="statusFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                            <option value="">Todos os status</option>
                            <option value="pending">Pendentes</option>
                            <option value="approved">Aprovadas</option>
                            <option value="denied">Negadas</option>
                        </select>
                        <select id="typeFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                            <option value="">Todos os tipos</option>
                            <option value="movie">Filmes</option>
                            <option value="tv">Séries</option>
                        </select>
                    </div>
                </div>

                <!-- Requests List -->
                <div id="requestsList" class="space-y-4">
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <p class="text-slate-400">Carregando solicitações...</p>
                    </div>
                </div>
            </div>
        `;

        // Setup filters
        document.getElementById('statusFilter').addEventListener('change', () => this.loadRequests());
        document.getElementById('typeFilter').addEventListener('change', () => this.loadRequests());

        // Load requests
        this.loadRequests();
    }

    async loadRequests() {
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('content_type', typeFilter);

        try {
            const response = await fetch(`/api/client-requests.php?${params}`);
            if (response.ok) {
                const requests = await response.json();
                this.renderRequests(requests);
            } else {
                console.error('Error loading requests:', response.statusText);
                this.renderRequests([]);
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            this.renderRequests([]);
        }
    }

    renderRequests(requests) {
        const requestsList = document.getElementById('requestsList');
        
        if (requests.length === 0) {
            requestsList.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação encontrada</h3>
                    <p class="text-slate-500">Não há solicitações com os filtros selecionados.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        requestsList.innerHTML = requests.map(request => `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h3 class="text-lg font-semibold text-white">${request.content_title}</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                ${this.getStatusText(request.status)}
                            </span>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${request.content_type === 'movie' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'}">
                                ${request.content_type === 'movie' ? 'Filme' : 'Série'}
                            </span>
                        </div>
                        <div class="text-sm text-slate-400 space-y-1">
                            <p><strong>Solicitante:</strong> ${request.requester_name}</p>
                            <p><strong>WhatsApp:</strong> ${this.formatWhatsApp(request.requester_whatsapp)}</p>
                            <p><strong>Data:</strong> ${new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                            ${request.season ? `<p><strong>Temporada:</strong> ${request.season}${request.episode ? `, Episódio: ${request.episode}` : ''}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2">
                        ${request.status === 'pending' ? `
                            <button onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')" 
                                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                <i data-lucide="check" class="h-4 w-4 inline mr-1"></i>
                                Aprovar
                            </button>
                            <button onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')" 
                                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                                <i data-lucide="x" class="h-4 w-4 inline mr-1"></i>
                                Negar
                            </button>
                        ` : ''}
                        <a href="https://wa.me/${request.requester_whatsapp}" target="_blank" 
                           class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors text-center">
                            <i data-lucide="message-circle" class="h-4 w-4 inline mr-1"></i>
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    async updateRequestStatus(requestId, status) {
        try {
            const response = await fetch('/api/client-requests.php/update-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: requestId, status: status })
            });

            if (response.ok) {
                this.showToast(`Solicitação ${status === 'approved' ? 'aprovada' : 'negada'} com sucesso!`, 'success');
                this.loadRequests(); // Reload requests
            } else {
                const error = await response.json();
                this.showToast(error.error || 'Erro ao atualizar status', 'error');
            }
        } catch (error) {
            console.error('Error updating request status:', error);
            this.showToast('Erro ao atualizar status', 'error');
        }
    }

    loadCustomizationTab() {
        console.log('Loading customization tab');
        const tabContent = document.getElementById('tabContent');
        
        tabContent.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-white">Personalização do Site</h2>
                
                <form id="customizationForm" class="space-y-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- Basic Info -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-white">Informações Básicas</h3>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input type="text" id="companyName" value="${this.clientData.name || ''}" 
                                       class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input type="text" id="siteName" value="${this.clientData.site_name || ''}" 
                                       class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Slogan</label>
                                <input type="text" id="siteTagline" value="${this.clientData.site_tagline || ''}" 
                                       class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            </div>
                        </div>

                        <!-- Colors -->
                        <div class="space-y-4">
                            <h3 class="text-lg font-semibold text-white">Cores</h3>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                <input type="color" id="primaryColor" value="${this.clientData.primary_color || '#1E40AF'}" 
                                       class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                <input type="color" id="secondaryColor" value="${this.clientData.secondary_color || '#DC2626'}" 
                                       class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                            </div>
                        </div>
                    </div>

                    <!-- Contact Info -->
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                            <input type="email" id="contactEmail" value="${this.clientData.contact_email || ''}" 
                                   class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                            <input type="text" id="contactWhatsapp" value="${this.clientData.contact_whatsapp || ''}" 
                                   placeholder="5511999999999" 
                                   class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        </div>
                    </div>

                    <!-- Hero Section -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold text-white">Seção Principal</h3>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                            <input type="text" id="heroTitle" value="${this.clientData.hero_title || ''}" 
                                   class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                            <input type="text" id="heroSubtitle" value="${this.clientData.hero_subtitle || ''}" 
                                   class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                            <textarea id="heroDescription" rows="3" 
                                      class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">${this.clientData.hero_description || ''}</textarea>
                        </div>
                    </div>

                    <!-- Save Button -->
                    <div class="flex justify-end">
                        <button type="submit" 
                                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                            <i data-lucide="save" class="h-5 w-5 inline mr-2"></i>
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Setup form handler
        document.getElementById('customizationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomization();
        });

        lucide.createIcons();
    }

    async saveCustomization() {
        const formData = {
            name: document.getElementById('companyName').value,
            site_name: document.getElementById('siteName').value,
            site_tagline: document.getElementById('siteTagline').value,
            primary_color: document.getElementById('primaryColor').value,
            secondary_color: document.getElementById('secondaryColor').value,
            contact_email: document.getElementById('contactEmail').value,
            contact_whatsapp: document.getElementById('contactWhatsapp').value,
            hero_title: document.getElementById('heroTitle').value,
            hero_subtitle: document.getElementById('heroSubtitle').value,
            hero_description: document.getElementById('heroDescription').value
        };

        try {
            const response = await fetch(`/api/client-tenants.php/${this.clientData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showToast('Configurações salvas com sucesso!', 'success');
                // Update client data
                Object.assign(this.clientData, formData);
            } else {
                const error = await response.json();
                this.showToast(error.error || 'Erro ao salvar configurações', 'error');
            }
        } catch (error) {
            console.error('Error saving customization:', error);
            this.showToast('Erro ao salvar configurações', 'error');
        }
    }

    loadAnalyticsTab() {
        console.log('Loading analytics tab');
        const tabContent = document.getElementById('tabContent');
        
        tabContent.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-white">Analytics</h2>
                
                <!-- Metrics Cards -->
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="approvalRate">-</p>
                                <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="calendar" class="h-8 w-8 text-blue-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="dailyAverage">-</p>
                                <p class="text-sm text-slate-400">Média Diária</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="star" class="h-8 w-8 text-yellow-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="mostRequestedType">-</p>
                                <p class="text-sm text-slate-400">Tipo Mais Solicitado</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="activity" class="h-8 w-8 text-purple-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="thisMonth">-</p>
                                <p class="text-sm text-slate-400">Este Mês</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Simple Activity Chart -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Atividade dos Últimos 14 Dias</h3>
                    <div id="activityChart" class="h-64 flex items-end justify-between space-x-2">
                        <!-- Chart will be generated by JavaScript -->
                    </div>
                </div>
            </div>
        `;

        lucide.createIcons();
        this.loadAnalytics();
    }

    async loadAnalytics() {
        try {
            const response = await fetch('/api/client-analytics.php');
            if (response.ok) {
                const analytics = await response.json();
                
                document.getElementById('approvalRate').textContent = analytics.approval_rate + '%';
                document.getElementById('dailyAverage').textContent = analytics.daily_average;
                document.getElementById('mostRequestedType').textContent = analytics.most_requested_type;
                
                // Calculate this month requests
                const thisMonth = analytics.daily_requests?.filter(day => {
                    const date = new Date(day.date);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).reduce((sum, day) => sum + parseInt(day.count), 0) || 0;
                
                document.getElementById('thisMonth').textContent = thisMonth;
                
                // Generate simple chart
                this.generateActivityChart(analytics.daily_requests || []);
            } else {
                console.error('Error loading analytics:', response.statusText);
                // Show placeholder values
                document.getElementById('approvalRate').textContent = '0%';
                document.getElementById('dailyAverage').textContent = '0';
                document.getElementById('mostRequestedType').textContent = 'N/A';
                document.getElementById('thisMonth').textContent = '0';
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            // Show placeholder values
            document.getElementById('approvalRate').textContent = '0%';
            document.getElementById('dailyAverage').textContent = '0';
            document.getElementById('mostRequestedType').textContent = 'N/A';
            document.getElementById('thisMonth').textContent = '0';
        }
    }

    generateActivityChart(dailyRequests) {
        const chartContainer = document.getElementById('activityChart');
        const last14Days = dailyRequests.slice(-14);
        
        if (last14Days.length === 0) {
            chartContainer.innerHTML = '<p class="text-slate-400 text-center w-full">Sem dados para exibir</p>';
            return;
        }
        
        const maxCount = Math.max(...last14Days.map(day => parseInt(day.count))) || 1;
        
        chartContainer.innerHTML = last14Days.map(day => {
            const height = (parseInt(day.count) / maxCount) * 100;
            const date = new Date(day.date);
            
            return `
                <div class="flex flex-col items-center space-y-2 flex-1">
                    <div class="bg-blue-500 rounded-t" style="height: ${height}%; min-height: 4px; width: 100%; max-width: 24px;"></div>
                    <span class="text-xs text-slate-400 transform -rotate-45 origin-center">${date.getDate()}/${date.getMonth() + 1}</span>
                    <span class="text-xs text-white">${day.count}</span>
                </div>
            `;
        }).join('');
    }

    // Utility methods
    getStatusClass(status) {
        switch (status) {
            case 'pending': return 'bg-yellow-600/20 text-yellow-400';
            case 'approved': return 'bg-green-600/20 text-green-400';
            case 'denied': return 'bg-red-600/20 text-red-400';
            default: return 'bg-slate-600/20 text-slate-400';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'approved': return 'Aprovada';
            case 'denied': return 'Negada';
            default: return 'Desconhecido';
        }
    }

    formatWhatsApp(whatsapp) {
        if (!whatsapp) return 'N/A';
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length >= 13) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
        }
        return whatsapp;
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

// Initialize the app and make it globally available
let clientDashboard;
document.addEventListener('DOMContentLoaded', () => {
    clientDashboard = new ClientDashboardApp();
    window.clientDashboard = clientDashboard; // Make it globally available for onclick handlers
});