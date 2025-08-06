class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.switchTab('overview'); // Load overview by default
    }

    setupEventListeners() {
        // Tab buttons
        document.getElementById('overviewTab').addEventListener('click', () => {
            this.switchTab('overview');
        });

        document.getElementById('requestsTab').addEventListener('click', () => {
            this.switchTab('requests');
        });

        document.getElementById('settingsTab').addEventListener('click', () => {
            this.switchTab('settings');
        });

        document.getElementById('analyticsTab').addEventListener('click', () => {
            this.switchTab('analytics');
        });
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active', 'border-blue-500', 'text-blue-400');
            btn.classList.add('border-transparent', 'text-slate-400', 'hover:text-slate-300');
        });

        const activeTab = document.getElementById(tabId + 'Tab');
        activeTab.classList.add('active', 'border-blue-500', 'text-blue-400');
        activeTab.classList.remove('border-transparent', 'text-slate-400', 'hover:text-slate-300');

        this.currentTab = tabId;

        // Load content based on tab
        switch (tabId) {
            case 'overview':
                this.loadOverviewContent();
                break;
            case 'requests':
                this.loadRequestsContent();
                break;
            case 'settings':
                this.loadSettingsContent();
                break;
            case 'analytics':
                this.loadAnalyticsContent();
                break;
        }
    }

    async loadOverviewContent() {
        document.getElementById('tabContent').innerHTML = this.getLoadingHTML();

        try {
            const response = await fetch('/api/client-requests.php/stats');
            const stats = await response.json();

            if (!response.ok) {
                throw new Error(stats.error || 'Erro ao carregar estatísticas');
            }

            this.renderOverviewContent(stats);
        } catch (error) {
            this.showError('Erro ao carregar visão geral: ' + error.message);
        }
    }

    renderOverviewContent(stats) {
        document.getElementById('tabContent').innerHTML = `
            <div class="space-y-8">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="list" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${stats.total || 0}</p>
                                <p class="text-sm text-slate-400">Total de Solicitações</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="clock" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${stats.pending || 0}</p>
                                <p class="text-sm text-slate-400">Pendentes</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="check-circle" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${stats.approved || 0}</p>
                                <p class="text-sm text-slate-400">Aprovadas</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="x-circle" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${stats.denied || 0}</p>
                                <p class="text-sm text-slate-400">Negadas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <a href="/${this.clientData.slug}/search" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group">
                            <i data-lucide="search" class="h-8 w-8 text-blue-400 group-hover:text-blue-300"></i>
                            <div>
                                <p class="font-medium text-white">Pesquisar Conteúdo</p>
                                <p class="text-sm text-slate-400">Encontrar filmes e séries</p>
                            </div>
                        </a>

                        <button onclick="clientDashboard.switchTab('requests')" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group text-left">
                            <i data-lucide="list" class="h-8 w-8 text-purple-400 group-hover:text-purple-300"></i>
                            <div>
                                <p class="font-medium text-white">Ver Solicitações</p>
                                <p class="text-sm text-slate-400">Gerenciar pedidos</p>
                            </div>
                        </button>

                        <button onclick="clientDashboard.switchTab('settings')" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors group text-left">
                            <i data-lucide="settings" class="h-8 w-8 text-green-400 group-hover:text-green-300"></i>
                            <div>
                                <p class="font-medium text-white">Configurações</p>
                                <p class="text-sm text-slate-400">Personalizar site</p>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
                    <div id="recentActivity">
                        <div class="animate-pulse space-y-3">
                            <div class="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div class="h-4 bg-slate-700 rounded w-1/2"></div>
                            <div class="h-4 bg-slate-700 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Load recent activity
        this.loadRecentActivity();
        
        lucide.createIcons();
    }

    async loadRequestsContent() {
        document.getElementById('tabContent').innerHTML = this.getLoadingHTML();

        try {
            const response = await fetch('/api/client-requests.php');
            const requests = await response.json();

            if (!response.ok) {
                throw new Error(requests.error || 'Erro ao carregar solicitações');
            }

            this.renderRequestsContent(requests);
        } catch (error) {
            this.showError('Erro ao carregar solicitações: ' + error.message);
        }
    }

    renderRequestsContent(requests) {
        document.getElementById('tabContent').innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h2 class="text-xl font-semibold text-white mb-4 sm:mb-0">Suas Solicitações</h2>
                    <div class="flex items-center space-x-3">
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

                <!-- Requests Table -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                    ${requests.length === 0 ? this.getEmptyRequestsHTML() : this.getRequestsTableHTML(requests)}
                </div>
            </div>
        `;

        // Setup filters
        this.setupRequestFilters();
        
        lucide.createIcons();
    }

    getRequestsTableHTML(requests) {
        return `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-700/50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Conteúdo</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tipo</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-700">
                        ${requests.map(request => this.getRequestRowHTML(request)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    getRequestRowHTML(request) {
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

        const date = new Date(request.created_at).toLocaleDateString('pt-BR');

        return `
            <tr class="hover:bg-slate-700/30 transition-colors">
                <td class="px-4 py-4">
                    <div class="flex items-center space-x-3">
                        <img
                            src="${request.poster_path ? 
                                `https://image.tmdb.org/t/p/w92${request.poster_path}` : 
                                '/assets/images/placeholder-poster.jpg'
                            }"
                            alt="${request.content_title}"
                            class="w-10 h-15 object-cover rounded"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                        <div>
                            <p class="font-medium text-white">${request.content_title}</p>
                            ${request.season ? `<p class="text-sm text-slate-400">T${request.season}${request.episode ? ` E${request.episode}` : ''}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                        <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-3 w-3 mr-1"></i>
                        ${typeLabels[request.content_type]}
                    </span>
                </td>
                <td class="px-4 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[request.status]}">
                        ${statusLabels[request.status]}
                    </span>
                </td>
                <td class="px-4 py-4 text-sm text-slate-300">${date}</td>
                <td class="px-4 py-4">
                    <button
                        onclick="clientDashboard.openRequestDetails(${request.id})"
                        class="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                        Ver Detalhes
                    </button>
                </td>
            </tr>
        `;
    }

    getEmptyRequestsHTML() {
        return `
            <div class="text-center py-12">
                <i data-lucide="inbox" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação ainda</h3>
                <p class="text-slate-500 mb-6">Você ainda não fez nenhuma solicitação de conteúdo.</p>
                <a href="/${this.clientData.slug}/search" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <i data-lucide="search" class="h-4 w-4"></i>
                    <span>Fazer Primeira Solicitação</span>
                </a>
            </div>
        `;
    }

    async loadSettingsContent() {
        document.getElementById('tabContent').innerHTML = this.getLoadingHTML();

        try {
            // Use client data from JWT token
            this.renderSettingsContent(this.clientData);
        } catch (error) {
            this.showError('Erro ao carregar configurações: ' + error.message);
        }
    }

    renderSettingsContent(clientData) {
        document.getElementById('tabContent').innerHTML = `
            <div class="space-y-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h2 class="text-xl font-semibold text-white mb-6">Configurações do Site</h2>
                    
                    <form id="settingsForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input
                                    type="text"
                                    id="name"
                                    value="${clientData.name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input
                                    type="text"
                                    id="site_name"
                                    value="${clientData.site_name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                                <input
                                    type="text"
                                    id="site_tagline"
                                    value="${clientData.site_tagline || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                <input
                                    type="email"
                                    id="contact_email"
                                    value="${clientData.contact_email || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp (55XXXXXXXXXXX)</label>
                                <input
                                    type="text"
                                    id="contact_whatsapp"
                                    value="${clientData.contact_whatsapp || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="5511999999999"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                <div class="flex space-x-2">
                                    <input
                                        type="color"
                                        id="primary_color"
                                        value="${clientData.primary_color || '#1E40AF'}"
                                        class="w-12 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        id="primary_color_text"
                                        value="${clientData.primary_color || '#1E40AF'}"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="#1E40AF"
                                    />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                <div class="flex space-x-2">
                                    <input
                                        type="color"
                                        id="secondary_color"
                                        value="${clientData.secondary_color || '#DC2626'}"
                                        class="w-12 h-12 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        id="secondary_color_text"
                                        value="${clientData.secondary_color || '#DC2626'}"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="#DC2626"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                            <textarea
                                id="site_description"
                                rows="3"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Descreva seu site..."
                            >${clientData.site_description || ''}</textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal (Hero)</label>
                            <input
                                type="text"
                                id="hero_title"
                                value="${clientData.hero_title || ''}"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Título que aparece na página inicial"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo (Hero)</label>
                            <input
                                type="text"
                                id="hero_subtitle"
                                value="${clientData.hero_subtitle || ''}"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Subtítulo da página inicial"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição Principal (Hero)</label>
                            <textarea
                                id="hero_description"
                                rows="3"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Descrição que aparece na página inicial"
                            >${clientData.hero_description || ''}</textarea>
                        </div>

                        <div class="flex justify-end">
                            <button
                                type="submit"
                                id="saveSettingsBtn"
                                class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                <i data-lucide="save" class="h-5 w-5"></i>
                                <span>Salvar Configurações</span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Preview Section -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Visualização do Site</h3>
                    <div class="bg-slate-900 rounded-lg p-4 border border-slate-600">
                        <div class="flex items-center space-x-2 mb-4">
                            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div class="flex-1 bg-slate-700 rounded px-3 py-1 text-xs text-slate-400 ml-4">
                                yourdomain.com/${clientData.slug}
                            </div>
                        </div>
                        <div class="text-center py-8">
                            <h4 class="text-lg font-bold text-white mb-2" id="previewTitle">${clientData.hero_title || 'Título Principal'}</h4>
                            <p class="text-blue-300 mb-2" id="previewSubtitle">${clientData.hero_subtitle || 'Subtítulo'}</p>
                            <p class="text-slate-400 text-sm" id="previewDescription">${clientData.hero_description || 'Descrição principal'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Setup settings form
        this.setupSettingsForm();
        
        lucide.createIcons();
    }

    async loadAnalyticsContent() {
        document.getElementById('tabContent').innerHTML = this.getLoadingHTML();

        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            if (!response.ok) {
                throw new Error(analytics.error || 'Erro ao carregar analytics');
            }

            this.renderAnalyticsContent(analytics);
        } catch (error) {
            this.showError('Erro ao carregar analytics: ' + error.message);
        }
    }

    renderAnalyticsContent(analytics) {
        document.getElementById('tabContent').innerHTML = `
            <div class="space-y-8">
                <!-- Analytics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="trending-up" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${analytics.approval_rate || 0}%</p>
                                <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="calendar" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${analytics.daily_average || 0}</p>
                                <p class="text-sm text-slate-400">Média Diária</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="heart" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${analytics.most_requested_type || 'N/A'}</p>
                                <p class="text-sm text-slate-400">Mais Solicitado</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <div class="bg-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center">
                                <i data-lucide="activity" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-white">${analytics.daily_requests?.length || 0}</p>
                                <p class="text-sm text-slate-400">Dias com Atividade</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chart Section -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Solicitações dos Últimos 30 Dias</h3>
                    <div class="h-64 flex items-end justify-between space-x-1">
                        ${this.generateSimpleChart(analytics.daily_requests || [])}
                    </div>
                </div>

                <!-- Insights -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">Insights</h3>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <i data-lucide="lightbulb" class="h-5 w-5 text-yellow-400 mt-0.5"></i>
                            <div>
                                <p class="text-white font-medium">Dica de Crescimento</p>
                                <p class="text-slate-400 text-sm">
                                    ${analytics.approval_rate > 80 ? 
                                        'Excelente taxa de aprovação! Continue oferecendo conteúdo de qualidade.' :
                                        'Considere revisar os critérios de aprovação para melhorar a experiência do usuário.'
                                    }
                                </p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <i data-lucide="target" class="h-5 w-5 text-blue-400 mt-0.5"></i>
                            <div>
                                <p class="text-white font-medium">Recomendação</p>
                                <p class="text-slate-400 text-sm">
                                    ${analytics.most_requested_type === 'Filmes' ? 
                                        'Filmes são mais populares. Considere expandir o catálogo de filmes.' :
                                        'Séries são mais populares. Foque em conteúdo seriado para engajar mais usuários.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    generateSimpleChart(dailyData) {
        if (!dailyData || dailyData.length === 0) {
            return '<div class="text-center text-slate-500 w-full">Nenhum dado disponível</div>';
        }

        const maxCount = Math.max(...dailyData.map(d => d.count));
        
        return dailyData.slice(-30).map(day => {
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            return `
                <div class="flex flex-col items-center">
                    <div 
                        class="bg-blue-500 w-4 rounded-t transition-all hover:bg-blue-400" 
                        style="height: ${height}%"
                        title="${day.date}: ${day.count} solicitações"
                    ></div>
                    <span class="text-xs text-slate-500 mt-2 transform -rotate-45">${new Date(day.date).getDate()}</span>
                </div>
            `;
        }).join('');
    }

    setupRequestFilters() {
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');

        statusFilter.addEventListener('change', () => this.filterRequests());
        typeFilter.addEventListener('change', () => this.filterRequests());
    }

    async filterRequests() {
        const status = document.getElementById('statusFilter').value;
        const type = document.getElementById('typeFilter').value;

        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (type) params.append('content_type', type);

        try {
            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = await response.json();

            if (!response.ok) {
                throw new Error(requests.error || 'Erro ao filtrar solicitações');
            }

            // Update table content
            const tableContainer = document.querySelector('#tabContent .bg-slate-800\\/50');
            tableContainer.innerHTML = requests.length === 0 ? 
                this.getEmptyRequestsHTML() : 
                this.getRequestsTableHTML(requests);

            lucide.createIcons();
        } catch (error) {
            this.showToast('Erro ao filtrar: ' + error.message, 'error');
        }
    }

    setupSettingsForm() {
        const form = document.getElementById('settingsForm');
        const primaryColorInput = document.getElementById('primary_color');
        const primaryColorText = document.getElementById('primary_color_text');
        const secondaryColorInput = document.getElementById('secondary_color');
        const secondaryColorText = document.getElementById('secondary_color_text');

        // Sync color inputs
        primaryColorInput.addEventListener('input', (e) => {
            primaryColorText.value = e.target.value;
            this.updatePreview();
        });

        primaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                primaryColorInput.value = e.target.value;
                this.updatePreview();
            }
        });

        secondaryColorInput.addEventListener('input', (e) => {
            secondaryColorText.value = e.target.value;
            this.updatePreview();
        });

        secondaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                secondaryColorInput.value = e.target.value;
                this.updatePreview();
            }
        });

        // Update preview on text changes
        ['hero_title', 'hero_subtitle', 'hero_description'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => this.updatePreview());
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    updatePreview() {
        const title = document.getElementById('hero_title').value || 'Título Principal';
        const subtitle = document.getElementById('hero_subtitle').value || 'Subtítulo';
        const description = document.getElementById('hero_description').value || 'Descrição principal';

        document.getElementById('previewTitle').textContent = title;
        document.getElementById('previewSubtitle').textContent = subtitle;
        document.getElementById('previewDescription').textContent = description;
    }

    async saveSettings() {
        const form = document.getElementById('settingsForm');
        const submitBtn = document.getElementById('saveSettingsBtn');

        const formData = {
            name: document.getElementById('name').value.trim(),
            site_name: document.getElementById('site_name').value.trim(),
            site_tagline: document.getElementById('site_tagline').value.trim(),
            site_description: document.getElementById('site_description').value.trim(),
            hero_title: document.getElementById('hero_title').value.trim(),
            hero_subtitle: document.getElementById('hero_subtitle').value.trim(),
            hero_description: document.getElementById('hero_description').value.trim(),
            contact_email: document.getElementById('contact_email').value.trim(),
            contact_whatsapp: document.getElementById('contact_whatsapp').value.replace(/\D/g, ''),
            primary_color: document.getElementById('primary_color_text').value,
            secondary_color: document.getElementById('secondary_color_text').value
        };

        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Salvando...</span>
        `;

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
                    this.showFormErrors(result.errors);
                } else {
                    throw new Error(result.error || 'Erro ao salvar configurações');
                }
                return;
            }

            // Update client data
            Object.assign(this.clientData, result.data);
            window.CLIENT_DATA = this.clientData;

            this.showToast('Configurações salvas com sucesso!', 'success');

        } catch (error) {
            this.showToast('Erro ao salvar: ' + error.message, 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i data-lucide="save" class="h-5 w-5"></i>
                <span>Salvar Configurações</span>
            `;
            lucide.createIcons();
        }
    }

    async openRequestDetails(requestId) {
        try {
            const response = await fetch(`/api/client-requests.php/${requestId}`);
            const request = await response.json();

            if (!response.ok) {
                throw new Error(request.error || 'Erro ao carregar detalhes');
            }

            // Get TMDB details
            const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
            const tmdbData = await tmdbResponse.json();

            this.showRequestDetailsModal(request, tmdbData);

        } catch (error) {
            this.showToast('Erro ao carregar detalhes: ' + error.message, 'error');
        }
    }

    showRequestDetailsModal(request, tmdbData) {
        const modal = document.getElementById('requestDetailsModal');
        const title = tmdbData.title || tmdbData.name || request.content_title;
        const posterUrl = tmdbData.poster_path ? 
            `https://image.tmdb.org/t/p/w300${tmdbData.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

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

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    <button
                        onclick="clientDashboard.closeRequestDetails()"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <div class="grid lg:grid-cols-3 gap-8">
                        <!-- Main Content -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Movie/TV Info -->
                            <div class="flex space-x-4">
                                <img
                                    src="${posterUrl}"
                                    alt="${title}"
                                    class="w-24 h-36 object-cover rounded-lg"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold text-white mb-2">${title}</h3>
                                    <div class="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                                        <span class="flex items-center space-x-1">
                                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                            <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                        </span>
                                        ${tmdbData.vote_average ? `
                                            <span class="flex items-center space-x-1">
                                                <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                                <span>${tmdbData.vote_average.toFixed(1)}</span>
                                            </span>
                                        ` : ''}
                                        ${request.season ? `
                                            <span>Temporada ${request.season}${request.episode ? ` - Episódio ${request.episode}` : ''}</span>
                                        ` : ''}
                                    </div>
                                    <p class="text-slate-300 text-sm line-clamp-3">
                                        ${tmdbData.overview || 'Sinopse não disponível.'}
                                    </p>
                                </div>
                            </div>

                            <!-- Request Info -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="font-semibold text-white mb-3">Informações da Solicitação</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="text-slate-400">Solicitante:</span>
                                        <span class="text-white ml-2">${request.requester_name}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">WhatsApp:</span>
                                        <span class="text-white ml-2">${this.formatWhatsApp(request.requester_whatsapp)}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Data:</span>
                                        <span class="text-white ml-2">${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Status:</span>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ml-2 ${statusColors[request.status]}">
                                            ${statusLabels[request.status]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sidebar -->
                        <div class="space-y-6">
                            <!-- Actions -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="font-semibold text-white mb-4">Ações</h4>
                                <div class="space-y-3">
                                    ${request.status === 'pending' ? `
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')"
                                            class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <i data-lucide="check" class="h-4 w-4"></i>
                                            <span>Aprovar</span>
                                        </button>
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')"
                                            class="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <i data-lucide="x" class="h-4 w-4"></i>
                                            <span>Negar</span>
                                        </button>
                                    ` : ''}
                                    <a
                                        href="https://wa.me/${request.requester_whatsapp}?text=Olá! Sobre sua solicitação de '${encodeURIComponent(title)}'..."
                                        target="_blank"
                                        class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <i data-lucide="message-circle" class="h-4 w-4"></i>
                                        <span>Contatar via WhatsApp</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Additional Info -->
                            ${tmdbData.genres ? `
                                <div class="bg-slate-700/50 rounded-lg p-4">
                                    <h4 class="font-semibold text-white mb-3">Gêneros</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${tmdbData.genres.map(genre => `
                                            <span class="bg-slate-600 text-slate-300 px-2 py-1 rounded text-xs">
                                                ${genre.name}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        lucide.createIcons();
    }

    closeRequestDetails() {
        document.getElementById('requestDetailsModal').classList.add('hidden');
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

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao atualizar status');
            }

            this.showToast('Status atualizado com sucesso!', 'success');
            this.closeRequestDetails();
            
            // Reload requests if we're on requests tab
            if (this.currentTab === 'requests') {
                this.loadRequestsContent();
            }

        } catch (error) {
            this.showToast('Erro ao atualizar status: ' + error.message, 'error');
        }
    }

    async loadRecentActivity() {
        try {
            const response = await fetch('/api/client-requests.php?limit=5');
            const requests = await response.json();

            if (response.ok && requests.length > 0) {
                const activityHTML = requests.map(request => `
                    <div class="flex items-center space-x-3 py-2">
                        <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4 text-blue-400"></i>
                        <div class="flex-1">
                            <p class="text-sm text-white">${request.content_title}</p>
                            <p class="text-xs text-slate-400">${new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span class="text-xs px-2 py-1 rounded ${
                            request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            request.status === 'denied' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                        }">
                            ${request.status === 'approved' ? 'Aprovada' : 
                              request.status === 'denied' ? 'Negada' : 'Pendente'}
                        </span>
                    </div>
                `).join('');

                document.getElementById('recentActivity').innerHTML = activityHTML;
            } else {
                document.getElementById('recentActivity').innerHTML = `
                    <p class="text-slate-500 text-sm text-center py-4">Nenhuma atividade recente</p>
                `;
            }

            lucide.createIcons();
        } catch (error) {
            document.getElementById('recentActivity').innerHTML = `
                <p class="text-red-400 text-sm text-center py-4">Erro ao carregar atividade</p>
            `;
        }
    }

    formatWhatsApp(number) {
        if (!number) return '';
        const cleaned = number.replace(/\D/g, '');
        if (cleaned.length === 13) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
        }
        return `+${cleaned}`;
    }

    getLoadingHTML() {
        return `
            <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span class="ml-3 text-slate-400">Carregando...</span>
            </div>
        `;
    }

    showError(message) {
        document.getElementById('tabContent').innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="alert-circle" class="h-12 w-12 text-red-400 mx-auto mb-4"></i>
                <p class="text-red-400 font-medium">${message}</p>
                <button
                    onclick="clientDashboard.switchTab('${this.currentTab}')"
                    class="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                >
                    Tentar novamente
                </button>
            </div>
        `;
        lucide.createIcons();
    }

    showFormErrors(errors) {
        Object.keys(errors).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.classList.add('border-red-500');
                
                // Remove existing error message
                const existingError = input.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }

                // Add new error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message text-red-400 text-sm mt-1';
                errorDiv.textContent = errors[field];
                input.parentNode.appendChild(errorDiv);

                // Remove error styling on input
                input.addEventListener('input', () => {
                    input.classList.remove('border-red-500');
                    const errorMsg = input.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }, { once: true });
            }
        });
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
});