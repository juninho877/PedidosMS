class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        console.log('ClientDashboardApp initialized with data:', this.clientData);
        this.setupEventListeners();
        this.switchTab('overview'); // Start with overview tab
    }

    setupEventListeners() {
        // Tab buttons
        const tabButtons = ['overview', 'requests', 'customization', 'analytics'];
        
        tabButtons.forEach(tab => {
            const button = document.getElementById(`tab-${tab}`);
            if (button) {
                button.addEventListener('click', () => {
                    console.log(`Switching to tab: ${tab}`);
                    this.switchTab(tab);
                });
            }
        });
    }

    switchTab(tabName) {
        console.log(`switchTab called with: ${tabName}`);
        
        // Update tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.className = 'tab-button py-2 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300';
        });

        const activeButton = document.getElementById(`tab-${tabName}`);
        if (activeButton) {
            activeButton.className = 'tab-button py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-400';
        }

        // Update content
        this.currentTab = tabName;
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        const contentDiv = document.getElementById('tab-content');
        if (!contentDiv) {
            console.error('tab-content div not found');
            return;
        }

        console.log(`Loading content for tab: ${tabName}`);

        switch (tabName) {
            case 'overview':
                this.loadOverviewContent(contentDiv);
                break;
            case 'requests':
                this.loadRequestsContent(contentDiv);
                break;
            case 'customization':
                this.loadCustomizationContent(contentDiv);
                break;
            case 'analytics':
                this.loadAnalyticsContent(contentDiv);
                break;
            default:
                contentDiv.innerHTML = '<p class="text-white">Conteúdo não encontrado</p>';
        }
    }

    loadOverviewContent(contentDiv) {
        contentDiv.innerHTML = `
            <div class="space-y-6">
                <!-- Welcome Card -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                            <i data-lucide="building" class="h-6 w-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white">Bem-vindo, ${this.clientData.name || 'Cliente'}!</h3>
                            <p class="text-slate-400">Gerencie suas solicitações e personalize seu site</p>
                        </div>
                    </div>
                    
                    <div class="grid sm:grid-cols-2 gap-4">
                        <a href="/${this.clientData.slug || 'cliente'}" target="_blank" class="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-lg transition-colors group">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="external-link" class="h-5 w-5 text-blue-400 group-hover:text-blue-300"></i>
                                <div>
                                    <p class="text-white font-medium">Ver Meu Site</p>
                                    <p class="text-slate-400 text-sm">/${this.clientData.slug || 'cliente'}</p>
                                </div>
                            </div>
                        </a>
                        
                        <button onclick="clientDashboard.switchTab('customization')" class="bg-slate-700/50 hover:bg-slate-700 p-4 rounded-lg transition-colors group text-left">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="palette" class="h-5 w-5 text-purple-400 group-hover:text-purple-300"></i>
                                <div>
                                    <p class="text-white font-medium">Personalizar</p>
                                    <p class="text-slate-400 text-sm">Cores, logo, textos</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" id="statsCards">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="inbox" class="h-8 w-8 text-blue-400"></i>
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
            </div>
        `;

        // Load stats
        this.loadStats();
        lucide.createIcons();
    }

    loadRequestsContent(contentDiv) {
        contentDiv.innerHTML = `
            <div class="space-y-6">
                <!-- Filters -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <div class="flex-1">
                            <input
                                type="text"
                                id="searchRequests"
                                placeholder="Pesquisar por título ou solicitante..."
                                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div class="flex gap-2">
                            <select
                                id="statusFilter"
                                class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos os Status</option>
                                <option value="pending">Pendentes</option>
                                <option value="approved">Aprovadas</option>
                                <option value="denied">Negadas</option>
                            </select>
                            <select
                                id="typeFilter"
                                class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Todos os Tipos</option>
                                <option value="movie">Filmes</option>
                                <option value="tv">Séries</option>
                            </select>
                            <button
                                id="applyFilters"
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Requests List -->
                <div id="requestsList">
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                        <p class="text-slate-400">Carregando solicitações...</p>
                    </div>
                </div>
            </div>
        `;

        // Setup event listeners
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.loadRequests();
        });

        document.getElementById('searchRequests').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadRequests();
            }
        });

        // Load requests
        this.loadRequests();
        lucide.createIcons();
    }

    loadCustomizationContent(contentDiv) {
        contentDiv.innerHTML = `
            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Form -->
                <div class="space-y-6">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-xl font-bold text-white mb-6">Personalização do Site</h3>
                        
                        <form id="customizationForm" class="space-y-6">
                            <!-- Basic Info -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-white">Informações Básicas</h4>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        value="${this.clientData.name || ''}"
                                        class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                    <input
                                        type="text"
                                        id="siteName"
                                        value="${this.clientData.site_name || ''}"
                                        class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Slogan/Tagline</label>
                                    <input
                                        type="text"
                                        id="siteTagline"
                                        value="${this.clientData.site_tagline || ''}"
                                        class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Seu cinema na palma da mão"
                                    />
                                </div>
                            </div>

                            <!-- Hero Section -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-white">Seção Principal</h4>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                    <input
                                        type="text"
                                        id="heroTitle"
                                        value="${this.clientData.hero_title || ''}"
                                        class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Solicite seus Filmes e Séries favoritos"
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                    <input
                                        type="text"
                                        id="heroSubtitle"
                                        value="${this.clientData.hero_subtitle || ''}"
                                        class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Sistema profissional de gerenciamento"
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                                    <textarea
                                        id="heroDescription"
                                        rows="3"
                                        class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Pesquise, solicite e acompanhe suas preferências de entretenimento."
                                    >${this.clientData.hero_description || ''}</textarea>
                                </div>
                            </div>

                            <!-- Colors -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-white">Cores do Site</h4>
                                
                                <div class="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                        <div class="flex gap-2">
                                            <input
                                                type="color"
                                                id="primaryColor"
                                                value="${this.clientData.primary_color || '#1E40AF'}"
                                                class="w-12 h-10 rounded border border-slate-600"
                                            />
                                            <input
                                                type="text"
                                                id="primaryColorText"
                                                value="${this.clientData.primary_color || '#1E40AF'}"
                                                class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                        <div class="flex gap-2">
                                            <input
                                                type="color"
                                                id="secondaryColor"
                                                value="${this.clientData.secondary_color || '#DC2626'}"
                                                class="w-12 h-10 rounded border border-slate-600"
                                            />
                                            <input
                                                type="text"
                                                id="secondaryColorText"
                                                value="${this.clientData.secondary_color || '#DC2626'}"
                                                class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Contact -->
                            <div class="space-y-4">
                                <h4 class="text-lg font-semibold text-white">Informações de Contato</h4>
                                
                                <div class="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                        <input
                                            type="email"
                                            id="contactEmail"
                                            value="${this.clientData.contact_email || ''}"
                                            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="contato@exemplo.com"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                                        <input
                                            type="text"
                                            id="contactWhatsapp"
                                            value="${this.clientData.contact_whatsapp || '55'}"
                                            class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="5511999999999"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Preview -->
                <div class="space-y-6">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-xl font-bold text-white mb-6">Preview do Site</h3>
                        
                        <div id="sitePreview" class="bg-slate-900 border border-slate-600 rounded-lg overflow-hidden">
                            <!-- Preview content will be updated dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupCustomizationEventListeners();
        this.updatePreview();
        lucide.createIcons();
    }

    loadAnalyticsContent(contentDiv) {
        contentDiv.innerHTML = `
            <div class="space-y-6">
                <!-- Analytics Cards -->
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <i data-lucide="film" class="h-8 w-8 text-purple-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="mostRequestedType">-</p>
                                <p class="text-sm text-slate-400">Mais Solicitado</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="activity" class="h-8 w-8 text-yellow-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white" id="thisMonth">-</p>
                                <p class="text-sm text-slate-400">Este Mês</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity Chart -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-xl font-bold text-white mb-6">Atividade dos Últimos 30 Dias</h3>
                    <div id="activityChart" class="h-64 flex items-center justify-center">
                        <div class="text-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                            <p class="text-slate-400">Carregando dados...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.loadAnalytics();
        lucide.createIcons();
    }

    async loadStats() {
        try {
            const response = await fetch('/api/client-requests.php/stats');
            const stats = await response.json();

            if (response.ok) {
                document.getElementById('totalRequests').textContent = stats.total || 0;
                document.getElementById('pendingRequests').textContent = stats.pending || 0;
                document.getElementById('approvedRequests').textContent = stats.approved || 0;
                document.getElementById('deniedRequests').textContent = stats.denied || 0;
            } else {
                console.error('Error loading stats:', stats.error);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async loadRequests() {
        const search = document.getElementById('searchRequests')?.value || '';
        const status = document.getElementById('statusFilter')?.value || '';
        const type = document.getElementById('typeFilter')?.value || '';

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (type) params.append('content_type', type);

        try {
            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = await response.json();

            if (response.ok) {
                this.renderRequests(requests);
            } else {
                this.showError('Erro ao carregar solicitações: ' + (requests.error || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            this.showError('Erro de conexão');
        }
    }

    renderRequests(requests) {
        const container = document.getElementById('requestsList');
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação encontrada</h3>
                    <p class="text-slate-500">Não há solicitações que correspondam aos filtros aplicados.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const statusColors = {
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            approved: 'bg-green-500/10 text-green-400 border-green-500/20',
            denied: 'bg-red-500/10 text-red-400 border-red-500/20'
        };

        const statusLabels = {
            pending: 'Pendente',
            approved: 'Aprovada',
            denied: 'Negada'
        };

        const typeLabels = {
            movie: 'Filme',
            tv: 'Série'
        };

        container.innerHTML = `
            <div class="space-y-4">
                ${requests.map(request => `
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <img
                                    src="${request.poster_path ? `https://image.tmdb.org/t/p/w92${request.poster_path}` : '/assets/images/placeholder-poster.jpg'}"
                                    alt="${request.content_title}"
                                    class="w-12 h-18 object-cover rounded"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                                <div>
                                    <h4 class="text-white font-semibold">${request.content_title}</h4>
                                    <div class="flex items-center space-x-4 text-sm text-slate-400">
                                        <span>${typeLabels[request.content_type]}</span>
                                        <span>${request.requester_name}</span>
                                        <span>${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-3">
                                <span class="px-3 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}">
                                    ${statusLabels[request.status]}
                                </span>
                                
                                <div class="flex space-x-2">
                                    <button
                                        onclick="clientDashboard.viewRequestDetails(${request.id})"
                                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Ver Detalhes
                                    </button>
                                    
                                    ${request.status === 'pending' ? `
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')"
                                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                        >
                                            Aprovar
                                        </button>
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')"
                                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                        >
                                            Negar
                                        </button>
                                    ` : `
                                        <a
                                            href="https://wa.me/${request.requester_whatsapp}"
                                            target="_blank"
                                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors inline-block"
                                        >
                                            WhatsApp
                                        </a>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        lucide.createIcons();
    }

    async loadAnalytics() {
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            if (response.ok) {
                document.getElementById('approvalRate').textContent = analytics.approval_rate + '%';
                document.getElementById('dailyAverage').textContent = analytics.daily_average;
                document.getElementById('mostRequestedType').textContent = analytics.most_requested_type;
                
                // Calculate this month's requests
                const thisMonth = analytics.daily_requests
                    .filter(day => new Date(day.date).getMonth() === new Date().getMonth())
                    .reduce((sum, day) => sum + parseInt(day.count), 0);
                
                document.getElementById('thisMonth').textContent = thisMonth;

                // Simple activity chart
                this.renderActivityChart(analytics.daily_requests);
            } else {
                console.error('Error loading analytics:', analytics.error);
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    renderActivityChart(dailyData) {
        const chartContainer = document.getElementById('activityChart');
        
        if (!dailyData || dailyData.length === 0) {
            chartContainer.innerHTML = `
                <div class="text-center">
                    <i data-lucide="bar-chart" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                    <p class="text-slate-400">Nenhum dado disponível</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const maxCount = Math.max(...dailyData.map(d => parseInt(d.count)));
        
        chartContainer.innerHTML = `
            <div class="flex items-end justify-between h-48 px-4">
                ${dailyData.slice(-14).map(day => {
                    const height = maxCount > 0 ? (parseInt(day.count) / maxCount) * 100 : 0;
                    const date = new Date(day.date);
                    return `
                        <div class="flex flex-col items-center space-y-2">
                            <div 
                                class="bg-blue-500 rounded-t min-w-[20px] transition-all hover:bg-blue-400" 
                                style="height: ${Math.max(height, 2)}%"
                                title="${day.count} solicitações em ${date.toLocaleDateString('pt-BR')}"
                            ></div>
                            <span class="text-xs text-slate-400 transform -rotate-45 origin-center">
                                ${date.getDate()}/${date.getMonth() + 1}
                            </span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    setupCustomizationEventListeners() {
        // Color picker sync
        const primaryColor = document.getElementById('primaryColor');
        const primaryColorText = document.getElementById('primaryColorText');
        const secondaryColor = document.getElementById('secondaryColor');
        const secondaryColorText = document.getElementById('secondaryColorText');

        if (primaryColor && primaryColorText) {
            primaryColor.addEventListener('input', (e) => {
                primaryColorText.value = e.target.value;
                this.updatePreview();
            });

            primaryColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    primaryColor.value = e.target.value;
                    this.updatePreview();
                }
            });
        }

        if (secondaryColor && secondaryColorText) {
            secondaryColor.addEventListener('input', (e) => {
                secondaryColorText.value = e.target.value;
                this.updatePreview();
            });

            secondaryColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    secondaryColor.value = e.target.value;
                    this.updatePreview();
                }
            });
        }

        // Form submission
        const form = document.getElementById('customizationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCustomization();
            });
        }

        // Real-time preview updates
        const previewFields = ['siteName', 'siteTagline', 'heroTitle', 'heroSubtitle', 'heroDescription'];
        previewFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.updatePreview();
                });
            }
        });
    }

    updatePreview() {
        const previewContainer = document.getElementById('sitePreview');
        if (!previewContainer) return;

        const siteName = document.getElementById('siteName')?.value || this.clientData.site_name || 'Meu Site';
        const heroTitle = document.getElementById('heroTitle')?.value || this.clientData.hero_title || 'Título Principal';
        const heroSubtitle = document.getElementById('heroSubtitle')?.value || this.clientData.hero_subtitle || 'Subtítulo';
        const primaryColor = document.getElementById('primaryColorText')?.value || this.clientData.primary_color || '#1E40AF';
        const secondaryColor = document.getElementById('secondaryColorText')?.value || this.clientData.secondary_color || '#DC2626';

        previewContainer.innerHTML = `
            <div class="p-6" style="background: linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)">
                <div class="flex items-center space-x-3 mb-6">
                    <i data-lucide="film" class="h-8 w-8" style="color: ${primaryColor}"></i>
                    <span class="text-xl font-bold text-white">${siteName}</span>
                </div>
                
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-white mb-2">${heroTitle}</h1>
                    <p class="text-slate-300 mb-4">${heroSubtitle}</p>
                    <button 
                        class="px-6 py-2 rounded-lg text-white font-semibold"
                        style="background-color: ${primaryColor}"
                    >
                        Começar Pesquisa
                    </button>
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    async saveCustomization() {
        const formData = {
            name: document.getElementById('companyName').value,
            site_name: document.getElementById('siteName').value,
            site_tagline: document.getElementById('siteTagline').value,
            hero_title: document.getElementById('heroTitle').value,
            hero_subtitle: document.getElementById('heroSubtitle').value,
            hero_description: document.getElementById('heroDescription').value,
            contact_email: document.getElementById('contactEmail').value,
            contact_whatsapp: document.getElementById('contactWhatsapp').value,
            primary_color: document.getElementById('primaryColorText').value,
            secondary_color: document.getElementById('secondaryColorText').value
        };

        try {
            const response = await fetch(`/api/client-tenants.php/${this.clientData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                this.showToast('Configurações salvas com sucesso!', 'success');
                // Update client data
                Object.assign(this.clientData, formData);
            } else {
                this.showToast(result.error || 'Erro ao salvar configurações', 'error');
            }
        } catch (error) {
            console.error('Error saving customization:', error);
            this.showToast('Erro de conexão', 'error');
        }
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

            const result = await response.json();

            if (response.ok) {
                this.showToast(`Solicitação ${status === 'approved' ? 'aprovada' : 'negada'} com sucesso!`, 'success');
                if (this.currentTab === 'requests') {
                    this.loadRequests(); // Reload requests list
                }
                this.loadStats(); // Update stats
            } else {
                this.showToast(result.error || 'Erro ao atualizar status', 'error');
            }
        } catch (error) {
            console.error('Error updating request status:', error);
            this.showToast('Erro de conexão', 'error');
        }
    }

    async viewRequestDetails(requestId) {
        try {
            const response = await fetch(`/api/client-requests.php/${requestId}`);
            const request = await response.json();

            if (response.ok) {
                // Buscar detalhes completos do TMDB
                await this.showEnhancedRequestDetailsModal(request);
            } else {
                this.showToast(request.error || 'Erro ao carregar detalhes', 'error');
            }
        } catch (error) {
            console.error('Error loading request details:', error);
            this.showToast('Erro de conexão', 'error');
        }
    }

    async showEnhancedRequestDetailsModal(request) {
        // Primeiro, mostrar modal de loading
        this.showLoadingModal();
        
        try {
            // Buscar detalhes completos do TMDB
            const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
            const tmdbData = await tmdbResponse.json();
            
            if (!tmdbResponse.ok) {
                throw new Error('Erro ao carregar detalhes do TMDB');
            }
            
            this.showDetailedRequestModal(request, tmdbData);
            
        } catch (error) {
            console.error('Error loading TMDB details:', error);
            // Fallback para modal simples se TMDB falhar
            this.showSimpleRequestDetailsModal(request);
        }
    }

    showLoadingModal() {
        const modal = document.createElement('div');
        modal.id = 'requestDetailsModal';
        modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p class="text-white">Carregando detalhes...</p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showDetailedRequestModal(request, tmdbData) {
        const existingModal = document.getElementById('requestDetailsModal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        const statusColors = {
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            approved: 'bg-green-500/10 text-green-400 border-green-500/20',
            denied: 'bg-red-500/10 text-red-400 border-red-500/20'
        };

        const statusLabels = {
            pending: 'Pendente',
            approved: 'Aprovada',
            denied: 'Negada'
        };

        const typeLabels = {
            movie: 'Filme',
            tv: 'Série'
        };

        const posterUrl = tmdbData.poster_path ? 
            `https://image.tmdb.org/t/p/w400${tmdbData.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';
            
        const backdropUrl = tmdbData.backdrop_path ? 
            `https://image.tmdb.org/t/p/w780${tmdbData.backdrop_path}` : '';

        const trailer = tmdbData.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        const releaseDate = tmdbData.release_date || tmdbData.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

        const modal = document.createElement('div');
        modal.id = 'requestDetailsModal';
        modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto';
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto my-4">
                <!-- Header com backdrop -->
                <div class="relative">
                    ${backdropUrl ? `
                        <div 
                            class="h-48 bg-cover bg-center bg-no-repeat rounded-t-xl"
                            style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${backdropUrl})"
                        ></div>
                        <div class="absolute top-4 right-4">
                            <button class="close-modal bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                                <i data-lucide="x" class="h-6 w-6"></i>
                            </button>
                        </div>
                    ` : `
                        <div class="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl">
                            <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                            <button class="close-modal text-slate-400 hover:text-white transition-colors">
                                <i data-lucide="x" class="h-6 w-6"></i>
                            </button>
                        </div>
                    `}
                </div>

                <!-- Content -->
                <div class="p-6">
                    <!-- Main Info Section -->
                    <div class="grid lg:grid-cols-3 gap-6 mb-8">
                        <!-- Poster and Basic Info -->
                        <div class="lg:col-span-1">
                            <div class="bg-slate-700/50 rounded-lg p-4 mb-4">
                                <img
                                    src="${posterUrl}"
                                    alt="${request.content_title}"
                                    class="w-full max-w-64 mx-auto rounded-lg shadow-lg mb-4"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                                <div class="text-center">
                                    <h3 class="text-xl font-bold text-white mb-2">${request.content_title}</h3>
                                    <div class="flex items-center justify-center space-x-4 text-sm text-slate-400 mb-4">
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                            <span>${typeLabels[request.content_type]}</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="calendar" class="h-4 w-4"></i>
                                            <span>${year}</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                            <span>${tmdbData.vote_average?.toFixed(1) || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <span class="inline-block px-4 py-2 rounded-full text-sm font-medium border ${statusColors[request.status]}">
                                        ${statusLabels[request.status]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Detailed Content Info -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Overview -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i data-lucide="info" class="h-5 w-5 mr-2 text-blue-400"></i>
                                    Sinopse
                                </h4>
                                <p class="text-slate-300 leading-relaxed">
                                    ${tmdbData.overview || 'Sinopse não disponível.'}
                                </p>
                            </div>

                            <!-- Technical Details -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i data-lucide="settings" class="h-5 w-5 mr-2 text-purple-400"></i>
                                    Informações Técnicas
                                </h4>
                                <div class="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Tipo:</span>
                                            <span class="text-white">${typeLabels[request.content_type]}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Avaliação TMDB:</span>
                                            <span class="text-white">${tmdbData.vote_average?.toFixed(1) || 'N/A'}/10 (${tmdbData.vote_count || 0} votos)</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Popularidade:</span>
                                            <span class="text-white">${tmdbData.popularity?.toFixed(0) || 'N/A'}</span>
                                        </div>
                                        ${tmdbData.runtime ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Duração:</span>
                                                <span class="text-white">${tmdbData.runtime} minutos</span>
                                            </div>
                                        ` : ''}
                                        ${tmdbData.number_of_seasons ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Temporadas:</span>
                                                <span class="text-white">${tmdbData.number_of_seasons}</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Episódios:</span>
                                                <span class="text-white">${tmdbData.number_of_episodes || 'N/A'}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Lançamento:</span>
                                            <span class="text-white">${releaseDate ? new Date(releaseDate).toLocaleDateString('pt-BR') : 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Idioma Original:</span>
                                            <span class="text-white">${tmdbData.original_language?.toUpperCase() || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Status:</span>
                                            <span class="text-white">${tmdbData.status || 'N/A'}</span>
                                        </div>
                                        ${tmdbData.budget && tmdbData.budget > 0 ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Orçamento:</span>
                                                <span class="text-white">$${tmdbData.budget.toLocaleString()}</span>
                                            </div>
                                        ` : ''}
                                        ${tmdbData.revenue && tmdbData.revenue > 0 ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Bilheteria:</span>
                                                <span class="text-white">$${tmdbData.revenue.toLocaleString()}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>

                            <!-- Genres -->
                            ${tmdbData.genres && tmdbData.genres.length > 0 ? `
                                <div class="bg-slate-700/50 rounded-lg p-4">
                                    <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                        <i data-lucide="tag" class="h-5 w-5 mr-2 text-green-400"></i>
                                        Gêneros
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${tmdbData.genres.map(genre => `
                                            <span class="bg-slate-600 text-slate-200 px-3 py-1 rounded-full text-sm">
                                                ${genre.name}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Production Info -->
                            ${tmdbData.production_companies && tmdbData.production_companies.length > 0 ? `
                                <div class="bg-slate-700/50 rounded-lg p-4">
                                    <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                        <i data-lucide="building" class="h-5 w-5 mr-2 text-orange-400"></i>
                                        Produção
                                    </h4>
                                    <div class="grid sm:grid-cols-2 gap-2 text-sm">
                                        ${tmdbData.production_companies.slice(0, 4).map(company => `
                                            <div class="flex items-center space-x-2">
                                                ${company.logo_path ? `
                                                    <img src="https://image.tmdb.org/t/p/w92${company.logo_path}" alt="${company.name}" class="w-6 h-6 object-contain bg-white rounded">
                                                ` : `
                                                    <i data-lucide="building-2" class="h-4 w-4 text-slate-400"></i>
                                                `}
                                                <span class="text-slate-300">${company.name}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Cast Section -->
                    ${tmdbData.credits?.cast && tmdbData.credits.cast.length > 0 ? `
                        <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                            <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                                <i data-lucide="users" class="h-5 w-5 mr-2 text-red-400"></i>
                                Elenco Principal
                            </h4>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                ${tmdbData.credits.cast.slice(0, 12).map(actor => `
                                    <div class="text-center">
                                        <img
                                            src="${actor.profile_path ? 
                                                `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 
                                                '/assets/images/placeholder-person.jpg'
                                            }"
                                            alt="${actor.name}"
                                            class="w-full h-24 object-cover rounded-lg mb-2"
                                            onerror="this.src='/assets/images/placeholder-person.jpg'"
                                        />
                                        <p class="text-white font-medium text-xs">${actor.name}</p>
                                        <p class="text-slate-400 text-xs">${actor.character}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Request Details -->
                    <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                        <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                            <i data-lucide="user-check" class="h-5 w-5 mr-2 text-blue-400"></i>
                            Detalhes da Solicitação
                        </h4>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Solicitante:</span>
                                    <span class="text-white font-medium">${request.requester_name}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">WhatsApp:</span>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-white">+${this.formatWhatsApp(request.requester_whatsapp)}</span>
                                        <a 
                                            href="https://wa.me/${request.requester_whatsapp}" 
                                            target="_blank"
                                            class="text-green-400 hover:text-green-300 transition-colors"
                                            title="Abrir WhatsApp"
                                        >
                                            <i data-lucide="message-circle" class="h-4 w-4"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Data da Solicitação:</span>
                                    <span class="text-white">${new Date(request.created_at).toLocaleString('pt-BR')}</span>
                                </div>
                                ${request.updated_at !== request.created_at ? `
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Última Atualização:</span>
                                        <span class="text-white">${new Date(request.updated_at).toLocaleString('pt-BR')}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">ID da Solicitação:</span>
                                    <span class="text-white font-mono">#${request.id}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">ID TMDB:</span>
                                    <span class="text-white font-mono">${request.content_id}</span>
                                </div>
                                ${request.season ? `
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Temporada:</span>
                                        <span class="text-white">${request.season}</span>
                                    </div>
                                ` : ''}
                                ${request.episode ? `
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Episódio:</span>
                                        <span class="text-white">${request.episode}</span>
                                    </div>
                                ` : ''}
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Status Atual:</span>
                                    <span class="px-3 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}">
                                        ${statusLabels[request.status]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Trailer Section -->
                    ${trailer ? `
                        <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                            <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                                <i data-lucide="play" class="h-5 w-5 mr-2 text-red-400"></i>
                                Trailer Oficial
                            </h4>
                            <div class="aspect-video">
                                <iframe
                                    src="https://www.youtube.com/embed/${trailer.key}"
                                    title="${request.content_title} Trailer"
                                    class="w-full h-full rounded-lg"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-600">
                        <button class="close-modal flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors">
                            Fechar
                        </button>
                        <a 
                            href="https://wa.me/${request.requester_whatsapp}?text=Olá ${request.requester_name}! Sobre sua solicitação do ${typeLabels[request.content_type].toLowerCase()} "${request.content_title}"..." 
                            target="_blank"
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors text-center"
                        >
                            <i data-lucide="message-circle" class="h-4 w-4 inline mr-2"></i>
                            Contatar via WhatsApp
                        </a>
                        ${request.status === 'pending' ? `
                            <button
                                onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved'); document.body.removeChild(document.getElementById('requestDetailsModal'));"
                                class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                <i data-lucide="check" class="h-4 w-4 inline mr-2"></i>
                                Aprovar
                            </button>
                            <button
                                onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied'); document.body.removeChild(document.getElementById('requestDetailsModal'));"
                                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                <i data-lucide="x" class="h-4 w-4 inline mr-2"></i>
                                Negar
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        lucide.createIcons();

        // Close modal events
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            });
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }
        });
    }

    showSimpleRequestDetailsModal(request) {
        const existingModal = document.getElementById('requestDetailsModal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        const statusColors = {
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            approved: 'bg-green-500/10 text-green-400 border-green-500/20',
            denied: 'bg-red-500/10 text-red-400 border-red-500/20'
        };

        const statusLabels = {
            pending: 'Pendente',
            approved: 'Aprovada',
            denied: 'Negada'
        };

        const typeLabels = {
            movie: 'Filme',
            tv: 'Série'
        };

        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w300${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        const modal = document.createElement('div');
        modal.id = 'requestDetailsModal';
        modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    <button class="close-modal text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>
                <div class="p-6 space-y-6">
                    <div class="flex gap-4">
                        <img
                            src="${posterUrl}"
                            alt="${request.content_title}"
                            class="w-20 h-30 object-cover rounded-lg"
                        />
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-2">${request.content_title}</h3>
                            <div class="space-y-1 text-sm text-slate-400">
                                <p><strong>Tipo:</strong> ${typeLabels[request.content_type]}</p>
                                <p><strong>Solicitante:</strong> ${request.requester_name}</p>
                                <p><strong>WhatsApp:</strong> +${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                <p><strong>Data:</strong> ${new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                                ${request.season ? `<p><strong>Temporada:</strong> ${request.season}${request.episode ? `, Episódio: ${request.episode}` : ''}</p>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button class="close-modal bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                            Fechar
                        </button>
                        <a 
                            href="https://wa.me/${request.requester_whatsapp}" 
                            target="_blank"
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Contatar via WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        lucide.createIcons();

        // Close modal events
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            });
        });
    }

    formatWhatsApp(number) {
        if (!number) return '';
        const str = number.toString();
        if (str.length <= 2) return str;
        if (str.length <= 4) return `${str.slice(0, 2)} ${str.slice(2)}`;
        if (str.length <= 9) return `${str.slice(0, 2)} ${str.slice(2, 4)} ${str.slice(4)}`;
        return `${str.slice(0, 2)} ${str.slice(2, 4)} ${str.slice(4, 9)}-${str.slice(9, 13)}`;
    }

    showError(message) {
        const container = document.getElementById('requestsList');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="alert-circle" class="h-12 w-12 text-red-400 mx-auto mb-4"></i>
                    <p class="text-red-400">${message}</p>
                </div>
            `;
            lucide.createIcons();
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

// Global variable for access from onclick handlers
let clientDashboard;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ClientDashboardApp');
    clientDashboard = new ClientDashboardApp();
});