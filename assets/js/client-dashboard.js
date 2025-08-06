class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        console.log('ClientDashboardApp: Inicializando...', this.clientData);
        this.setupEventListeners();
        this.loadOverviewContent(); // Carregar aba inicial
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
        console.log('ClientDashboardApp: Mudando para aba:', tabId);
        
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
        console.log('ClientDashboardApp: Carregando visão geral...');
        
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <div class="animate-pulse">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-slate-800 h-24 rounded-lg"></div>
                    <div class="bg-slate-800 h-24 rounded-lg"></div>
                    <div class="bg-slate-800 h-24 rounded-lg"></div>
                    <div class="bg-slate-800 h-24 rounded-lg"></div>
                </div>
            </div>
        `;

        try {
            const response = await fetch('/api/client-requests.php/stats');
            const stats = await response.json();

            if (!response.ok) {
                throw new Error(stats.error || 'Erro ao carregar estatísticas');
            }

            this.renderOverviewContent(stats);
        } catch (error) {
            console.error('Erro ao carregar visão geral:', error);
            this.showError('Erro ao carregar estatísticas: ' + error.message);
        }
    }

    renderOverviewContent(stats) {
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="list" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${stats.total || 0}</p>
                            <p class="text-sm text-slate-400">Total de Solicitações</p>
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
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <a href="/${this.clientData.slug}/search" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all group">
                    <div class="flex items-center space-x-4">
                        <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i data-lucide="search" class="h-6 w-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Nova Pesquisa</h3>
                            <p class="text-sm text-slate-400">Buscar filmes e séries</p>
                        </div>
                    </div>
                </a>

                <button onclick="clientDashboard.switchTab('requests')" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all group text-left">
                    <div class="flex items-center space-x-4">
                        <div class="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i data-lucide="list" class="h-6 w-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">Ver Solicitações</h3>
                            <p class="text-sm text-slate-400">Gerenciar pedidos</p>
                        </div>
                    </div>
                </button>

                <button onclick="clientDashboard.switchTab('settings')" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition-all group text-left">
                    <div class="flex items-center space-x-4">
                        <div class="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <i data-lucide="settings" class="h-6 w-6 text-white"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">Configurações</h3>
                            <p class="text-sm text-slate-400">Personalizar site</p>
                        </div>
                    </div>
                </button>
            </div>

            <!-- Recent Activity -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <i data-lucide="activity" class="h-5 w-5"></i>
                    <span>Atividade Recente</span>
                </h3>
                <div id="recentActivity">
                    <div class="animate-pulse space-y-3">
                        <div class="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div class="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div class="h-4 bg-slate-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        `;

        // Load recent activity
        this.loadRecentActivity();
        
        lucide.createIcons();
    }

    async loadRecentActivity() {
        try {
            const response = await fetch('/api/client-requests.php?limit=5');
            const requests = await response.json();

            if (!response.ok) {
                throw new Error(requests.error || 'Erro ao carregar atividade');
            }

            const recentActivity = document.getElementById('recentActivity');
            
            if (requests.length === 0) {
                recentActivity.innerHTML = `
                    <div class="text-center py-8">
                        <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                        <p class="text-slate-400">Nenhuma solicitação ainda</p>
                        <a href="/${this.clientData.slug}/search" class="text-blue-400 hover:text-blue-300 text-sm">
                            Fazer primeira solicitação
                        </a>
                    </div>
                `;
            } else {
                recentActivity.innerHTML = `
                    <div class="space-y-3">
                        ${requests.map(request => `
                            <div class="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-5 w-5 text-slate-400"></i>
                                    <div>
                                        <p class="text-white font-medium">${request.content_title}</p>
                                        <p class="text-xs text-slate-400">${this.formatDate(request.created_at)}</p>
                                    </div>
                                </div>
                                <span class="status-${request.status} px-2 py-1 rounded-full text-xs font-medium">
                                    ${this.getStatusLabel(request.status)}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            lucide.createIcons();
        } catch (error) {
            console.error('Erro ao carregar atividade recente:', error);
        }
    }

    async loadRequestsContent() {
        console.log('ClientDashboardApp: Carregando solicitações...');
        
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <!-- Filters -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
                <div class="flex flex-col sm:flex-row gap-4">
                    <select id="statusFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                        <option value="">Todos os Status</option>
                        <option value="pending">Pendentes</option>
                        <option value="approved">Aprovadas</option>
                        <option value="denied">Negadas</option>
                    </select>
                    <select id="typeFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                        <option value="">Todos os Tipos</option>
                        <option value="movie">Filmes</option>
                        <option value="tv">Séries</option>
                    </select>
                    <input 
                        type="text" 
                        id="searchFilter" 
                        placeholder="Buscar por título..." 
                        class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                    />
                </div>
            </div>

            <!-- Loading -->
            <div id="requestsLoading" class="animate-pulse">
                <div class="space-y-4">
                    <div class="bg-slate-800 h-16 rounded-lg"></div>
                    <div class="bg-slate-800 h-16 rounded-lg"></div>
                    <div class="bg-slate-800 h-16 rounded-lg"></div>
                </div>
            </div>

            <!-- Requests Table -->
            <div id="requestsTable" class="hidden">
                <!-- Content will be loaded -->
            </div>
        `;

        // Setup filter listeners
        document.getElementById('statusFilter').addEventListener('change', () => this.filterRequests());
        document.getElementById('typeFilter').addEventListener('change', () => this.filterRequests());
        document.getElementById('searchFilter').addEventListener('input', () => this.filterRequests());

        // Load requests
        this.loadRequests();
    }

    async loadRequests(filters = {}) {
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = await response.json();

            if (!response.ok) {
                throw new Error(requests.error || 'Erro ao carregar solicitações');
            }

            this.renderRequestsTable(requests);
        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            this.showError('Erro ao carregar solicitações: ' + error.message);
        }
    }

    renderRequestsTable(requests) {
        const loading = document.getElementById('requestsLoading');
        const table = document.getElementById('requestsTable');
        
        loading.classList.add('hidden');
        table.classList.remove('hidden');

        if (requests.length === 0) {
            table.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação encontrada</h3>
                    <p class="text-slate-500 mb-4">Comece fazendo sua primeira solicitação</p>
                    <a href="/${this.clientData.slug}/search" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar Conteúdo</span>
                    </a>
                </div>
            `;
        } else {
            table.innerHTML = `
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
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
                                ${requests.map(request => `
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
                                                    <p class="text-white font-medium">${request.content_title}</p>
                                                    ${request.season ? `<p class="text-xs text-slate-400">T${request.season}${request.episode ? ` E${request.episode}` : ''}</p>` : ''}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-4 py-4">
                                            <span class="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                request.content_type === 'movie' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                            }">
                                                <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-3 w-3"></i>
                                                <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                            </span>
                                        </td>
                                        <td class="px-4 py-4">
                                            <span class="status-${request.status} px-2 py-1 rounded-full text-xs font-medium">
                                                ${this.getStatusLabel(request.status)}
                                            </span>
                                        </td>
                                        <td class="px-4 py-4 text-sm text-slate-400">
                                            ${this.formatDate(request.created_at)}
                                        </td>
                                        <td class="px-4 py-4">
                                            <button
                                                onclick="clientDashboard.openRequestDetails(${request.id})"
                                                class="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                            >
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        lucide.createIcons();
    }

    filterRequests() {
        const status = document.getElementById('statusFilter').value;
        const type = document.getElementById('typeFilter').value;
        const search = document.getElementById('searchFilter').value;

        const filters = {};
        if (status) filters.status = status;
        if (type) filters.content_type = type;
        if (search) filters.search = search;

        this.loadRequests(filters);
    }

    async openRequestDetails(requestId) {
        console.log('ClientDashboardApp: Abrindo detalhes da solicitação:', requestId);
        
        const modal = document.getElementById('requestDetailsModal');
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <div class="p-6">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                    <p class="text-center text-slate-400 mt-4">Carregando detalhes...</p>
                </div>
            </div>
        `;
        modal.classList.remove('hidden');

        try {
            // Buscar dados da solicitação
            const requestResponse = await fetch(`/api/client-requests.php/${requestId}`);
            const request = await requestResponse.json();

            if (!requestResponse.ok) {
                throw new Error(request.error || 'Erro ao carregar solicitação');
            }

            // Buscar detalhes do TMDB
            const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
            const tmdbData = await tmdbResponse.json();

            if (!tmdbResponse.ok) {
                console.warn('Erro ao carregar dados do TMDB:', tmdbData.error);
            }

            this.renderRequestDetailsModal(request, tmdbData);
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            modal.innerHTML = `
                <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 text-center mx-4">
                    <i data-lucide="alert-circle" class="h-12 w-12 text-red-400 mx-auto mb-4"></i>
                    <h3 class="text-lg font-semibold text-white mb-2">Erro ao Carregar</h3>
                    <p class="text-slate-400 mb-4">${error.message}</p>
                    <button onclick="document.getElementById('requestDetailsModal').classList.add('hidden')" class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">
                        Fechar
                    </button>
                </div>
            `;
            lucide.createIcons();
        }
    }

    renderRequestDetailsModal(request, tmdbData = null) {
        const modal = document.getElementById('requestDetailsModal');
        const title = request.content_title;
        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w400${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        // Dados do TMDB se disponíveis
        const overview = tmdbData?.overview || 'Sinopse não disponível.';
        const genres = tmdbData?.genres || [];
        const cast = tmdbData?.credits?.cast || [];
        const trailer = tmdbData?.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        const rating = tmdbData?.vote_average || 0;
        const runtime = tmdbData?.runtime;
        const seasons = tmdbData?.number_of_seasons;

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="info" class="h-6 w-6 text-blue-400"></i>
                        <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    </div>
                    <button
                        onclick="document.getElementById('requestDetailsModal').classList.add('hidden')"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <div class="p-6">
                    <div class="grid lg:grid-cols-3 gap-8">
                        <!-- Poster e Informações Básicas -->
                        <div class="lg:col-span-1">
                            <div class="bg-slate-700/30 rounded-lg p-6">
                                <img
                                    src="${posterUrl}"
                                    alt="${title}"
                                    class="w-full max-w-sm mx-auto rounded-lg shadow-lg mb-6"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                                
                                <div class="space-y-4">
                                    <div>
                                        <h3 class="text-lg font-semibold text-white mb-2">${title}</h3>
                                        <div class="flex items-center space-x-4 text-sm text-slate-400">
                                            <span class="inline-flex items-center space-x-1">
                                                <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                                <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                            </span>
                                            ${rating > 0 ? `
                                                <span class="inline-flex items-center space-x-1">
                                                    <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                                    <span>${rating.toFixed(1)}/10</span>
                                                </span>
                                            ` : ''}
                                        </div>
                                    </div>

                                    ${request.season ? `
                                        <div class="bg-slate-800/50 rounded-lg p-4">
                                            <h4 class="text-sm font-medium text-slate-300 mb-2">Especificações da Série</h4>
                                            <div class="space-y-2 text-sm">
                                                <div class="flex justify-between">
                                                    <span class="text-slate-400">Temporada:</span>
                                                    <span class="text-white">${request.season}</span>
                                                </div>
                                                ${request.episode ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-slate-400">Episódio:</span>
                                                        <span class="text-white">${request.episode}</span>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    ` : ''}

                                    <div class="bg-slate-800/50 rounded-lg p-4">
                                        <h4 class="text-sm font-medium text-slate-300 mb-2">Status da Solicitação</h4>
                                        <span class="status-${request.status} px-3 py-1 rounded-full text-sm font-medium">
                                            ${this.getStatusLabel(request.status)}
                                        </span>
                                    </div>

                                    ${runtime || seasons ? `
                                        <div class="bg-slate-800/50 rounded-lg p-4">
                                            <h4 class="text-sm font-medium text-slate-300 mb-2">Informações Técnicas</h4>
                                            <div class="space-y-2 text-sm">
                                                ${runtime ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-slate-400">Duração:</span>
                                                        <span class="text-white">${runtime} min</span>
                                                    </div>
                                                ` : ''}
                                                ${seasons ? `
                                                    <div class="flex justify-between">
                                                        <span class="text-slate-400">Temporadas:</span>
                                                        <span class="text-white">${seasons}</span>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Conteúdo Principal -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Dados do Solicitante -->
                            <div class="bg-slate-700/30 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <i data-lucide="user" class="h-5 w-5"></i>
                                    <span>Dados do Solicitante</span>
                                </h3>
                                <div class="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-400 mb-1">Nome</label>
                                        <p class="text-white">${request.requester_name}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-400 mb-1">WhatsApp</label>
                                        <div class="flex items-center space-x-2">
                                            <p class="text-white">${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                            <a
                                                href="https://wa.me/${request.requester_whatsapp}?text=Olá! Sobre sua solicitação de '${encodeURIComponent(title)}'"
                                                target="_blank"
                                                class="text-green-400 hover:text-green-300 transition-colors"
                                                title="Contatar via WhatsApp"
                                            >
                                                <i data-lucide="message-circle" class="h-4 w-4"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Informações da Solicitação -->
                            <div class="bg-slate-700/30 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <i data-lucide="calendar" class="h-5 w-5"></i>
                                    <span>Informações da Solicitação</span>
                                </h3>
                                <div class="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-400 mb-1">ID da Solicitação</label>
                                        <p class="text-white font-mono">#${request.id}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-400 mb-1">Data de Criação</label>
                                        <p class="text-white">${this.formatDate(request.created_at)}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-400 mb-1">Última Atualização</label>
                                        <p class="text-white">${this.formatDate(request.updated_at)}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Sinopse -->
                            ${overview && overview !== 'Sinopse não disponível.' ? `
                                <div class="bg-slate-700/30 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                        <i data-lucide="file-text" class="h-5 w-5"></i>
                                        <span>Sinopse</span>
                                    </h3>
                                    <p class="text-slate-300 leading-relaxed">${overview}</p>
                                </div>
                            ` : ''}

                            <!-- Gêneros -->
                            ${genres.length > 0 ? `
                                <div class="bg-slate-700/30 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                        <i data-lucide="tag" class="h-5 w-5"></i>
                                        <span>Gêneros</span>
                                    </h3>
                                    <div class="flex flex-wrap gap-2">
                                        ${genres.map(genre => `
                                            <span class="bg-slate-600 text-slate-200 px-3 py-1 rounded-full text-sm">
                                                ${genre.name}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Elenco -->
                            ${cast.length > 0 ? `
                                <div class="bg-slate-700/30 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                        <i data-lucide="users" class="h-5 w-5"></i>
                                        <span>Elenco Principal</span>
                                    </h3>
                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        ${cast.slice(0, 8).map(actor => `
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
                                                <p class="text-white text-sm font-medium">${actor.name}</p>
                                                <p class="text-slate-400 text-xs">${actor.character}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Trailer -->
                            ${trailer ? `
                                <div class="bg-slate-700/30 rounded-lg p-6">
                                    <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                        <i data-lucide="play" class="h-5 w-5"></i>
                                        <span>Trailer</span>
                                    </h3>
                                    <div class="aspect-video">
                                        <iframe
                                            src="https://www.youtube.com/embed/${trailer.key}"
                                            title="${title} Trailer"
                                            class="w-full h-full rounded-lg"
                                            allowfullscreen
                                        ></iframe>
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Ações -->
                            <div class="bg-slate-700/30 rounded-lg p-6">
                                <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <i data-lucide="zap" class="h-5 w-5"></i>
                                    <span>Ações</span>
                                </h3>
                                <div class="flex flex-col sm:flex-row gap-3">
                                    ${request.status === 'pending' ? `
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')"
                                            class="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <i data-lucide="check" class="h-4 w-4"></i>
                                            <span>Aprovar</span>
                                        </button>
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')"
                                            class="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            <i data-lucide="x" class="h-4 w-4"></i>
                                            <span>Negar</span>
                                        </button>
                                    ` : `
                                        <div class="text-center py-4">
                                            <p class="text-slate-400">Esta solicitação já foi processada.</p>
                                        </div>
                                    `}
                                    <a
                                        href="https://wa.me/${request.requester_whatsapp}?text=Olá! Sobre sua solicitação de '${encodeURIComponent(title)}'"
                                        target="_blank"
                                        class="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <i data-lucide="message-circle" class="h-4 w-4"></i>
                                        <span>Contatar via WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        lucide.createIcons();
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

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao atualizar status');
            }

            this.showToast('Status atualizado com sucesso!', 'success');
            
            // Fechar modal e recarregar dados
            document.getElementById('requestDetailsModal').classList.add('hidden');
            
            if (this.currentTab === 'requests') {
                this.filterRequests(); // Recarregar lista
            } else if (this.currentTab === 'overview') {
                this.loadOverviewContent(); // Recarregar estatísticas
            }

        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            this.showToast('Erro ao atualizar status: ' + error.message, 'error');
        }
    }

    loadSettingsContent() {
        console.log('ClientDashboardApp: Carregando configurações...');
        
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                        <i data-lucide="settings" class="h-5 w-5"></i>
                        <span>Configurações do Site</span>
                    </h3>

                    <form id="settingsForm" class="space-y-6">
                        <!-- Informações Básicas -->
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input
                                    type="text"
                                    id="name"
                                    value="${this.clientData.name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input
                                    type="text"
                                    id="site_name"
                                    value="${this.clientData.site_name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Tagline do Site</label>
                            <input
                                type="text"
                                id="site_tagline"
                                value="${this.clientData.site_tagline || ''}"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: Seu cinema na palma da mão"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                            <textarea
                                id="site_description"
                                rows="3"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Descrição geral do seu site..."
                            >${this.clientData.site_description || ''}</textarea>
                        </div>

                        <!-- Hero Section -->
                        <div class="border-t border-slate-700 pt-6">
                            <h4 class="text-lg font-medium text-white mb-4">Seção Principal (Hero)</h4>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                    <input
                                        type="text"
                                        id="hero_title"
                                        value="${this.clientData.hero_title || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Solicite seus Filmes e Séries favoritos"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                    <input
                                        type="text"
                                        id="hero_subtitle"
                                        value="${this.clientData.hero_subtitle || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: Sistema profissional de gerenciamento"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Hero</label>
                                    <textarea
                                        id="hero_description"
                                        rows="3"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Descrição que aparece na seção principal..."
                                    >${this.clientData.hero_description || ''}</textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Contato -->
                        <div class="border-t border-slate-700 pt-6">
                            <h4 class="text-lg font-medium text-white mb-4">Informações de Contato</h4>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                    <input
                                        type="email"
                                        id="contact_email"
                                        value="${this.clientData.contact_email || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="contato@exemplo.com"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp (5511999999999)</label>
                                    <input
                                        type="text"
                                        id="contact_whatsapp"
                                        value="${this.clientData.contact_whatsapp || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="5511999999999"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Cores -->
                        <div class="border-t border-slate-700 pt-6">
                            <h4 class="text-lg font-medium text-white mb-4">Personalização Visual</h4>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                    <div class="flex space-x-3">
                                        <input
                                            type="color"
                                            id="primary_color"
                                            value="${this.clientData.primary_color || '#1E40AF'}"
                                            class="w-12 h-12 rounded-lg border border-slate-600 bg-slate-700"
                                        />
                                        <input
                                            type="text"
                                            id="primary_color_text"
                                            value="${this.clientData.primary_color || '#1E40AF'}"
                                            class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                            pattern="^#[0-9A-Fa-f]{6}$"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                    <div class="flex space-x-3">
                                        <input
                                            type="color"
                                            id="secondary_color"
                                            value="${this.clientData.secondary_color || '#DC2626'}"
                                            class="w-12 h-12 rounded-lg border border-slate-600 bg-slate-700"
                                        />
                                        <input
                                            type="text"
                                            id="secondary_color_text"
                                            value="${this.clientData.secondary_color || '#DC2626'}"
                                            class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                            pattern="^#[0-9A-Fa-f]{6}$"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- URLs de Imagens -->
                        <div class="border-t border-slate-700 pt-6">
                            <h4 class="text-lg font-medium text-white mb-4">Imagens</h4>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">URL do Logo</label>
                                    <input
                                        type="url"
                                        id="logo_url"
                                        value="${this.clientData.logo_url || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://exemplo.com/logo.png"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">URL do Favicon</label>
                                    <input
                                        type="url"
                                        id="favicon_url"
                                        value="${this.clientData.favicon_url || ''}"
                                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://exemplo.com/favicon.ico"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Botões -->
                        <div class="border-t border-slate-700 pt-6">
                            <div class="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Salvar Configurações
                                </button>
                                <a
                                    href="/${this.clientData.slug}"
                                    target="_blank"
                                    class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors text-center"
                                >
                                    Visualizar Site
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Setup color picker sync
        this.setupColorPickers();
        
        // Setup form submission
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        lucide.createIcons();
    }

    setupColorPickers() {
        // Primary color sync
        const primaryColor = document.getElementById('primary_color');
        const primaryColorText = document.getElementById('primary_color_text');

        primaryColor.addEventListener('input', (e) => {
            primaryColorText.value = e.target.value;
        });

        primaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                primaryColor.value = e.target.value;
            }
        });

        // Secondary color sync
        const secondaryColor = document.getElementById('secondary_color');
        const secondaryColorText = document.getElementById('secondary_color_text');

        secondaryColor.addEventListener('input', (e) => {
            secondaryColorText.value = e.target.value;
        });

        secondaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                secondaryColor.value = e.target.value;
            }
        });
    }

    async saveSettings() {
        const form = document.getElementById('settingsForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            site_name: document.getElementById('site_name').value.trim(),
            site_tagline: document.getElementById('site_tagline').value.trim(),
            site_description: document.getElementById('site_description').value.trim(),
            hero_title: document.getElementById('hero_title').value.trim(),
            hero_subtitle: document.getElementById('hero_subtitle').value.trim(),
            hero_description: document.getElementById('hero_description').value.trim(),
            contact_email: document.getElementById('contact_email').value.trim(),
            contact_whatsapp: document.getElementById('contact_whatsapp').value.trim(),
            primary_color: document.getElementById('primary_color').value,
            secondary_color: document.getElementById('secondary_color').value,
            logo_url: document.getElementById('logo_url').value.trim(),
            favicon_url: document.getElementById('favicon_url').value.trim()
        };

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';

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
            this.clientData = { ...this.clientData, ...formData };
            window.CLIENT_DATA = this.clientData;

            this.showToast('Configurações salvas com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            this.showToast('Erro ao salvar: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Salvar Configurações';
        }
    }

    async loadAnalyticsContent() {
        console.log('ClientDashboardApp: Carregando analytics...');
        
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <div class="animate-pulse">
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-slate-800 h-24 rounded-lg"></div>
                    <div class="bg-slate-800 h-24 rounded-lg"></div>
                    <div class="bg-slate-800 h-24 rounded-lg"></div>
                </div>
                <div class="bg-slate-800 h-64 rounded-lg"></div>
            </div>
        `;

        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            if (!response.ok) {
                throw new Error(analytics.error || 'Erro ao carregar analytics');
            }

            this.renderAnalyticsContent(analytics);
        } catch (error) {
            console.error('Erro ao carregar analytics:', error);
            this.showError('Erro ao carregar analytics: ' + error.message);
        }
    }

    renderAnalyticsContent(analytics) {
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <!-- Métricas Principais -->
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.approval_rate || 0}%</p>
                            <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="calendar" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.daily_average || 0}</p>
                            <p class="text-sm text-slate-400">Média Diária</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="heart" class="h-8 w-8 text-purple-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.most_requested_type || 'N/A'}</p>
                            <p class="text-sm text-slate-400">Mais Solicitado</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráfico Simples -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                    <i data-lucide="bar-chart-3" class="h-5 w-5"></i>
                    <span>Solicitações dos Últimos 30 Dias</span>
                </h3>
                <div class="space-y-4">
                    ${analytics.daily_requests && analytics.daily_requests.length > 0 ? 
                        analytics.daily_requests.slice(-7).map(day => `
                            <div class="flex items-center space-x-4">
                                <div class="w-20 text-sm text-slate-400">${this.formatDate(day.date)}</div>
                                <div class="flex-1 bg-slate-700 rounded-full h-6 relative">
                                    <div 
                                        class="bg-blue-600 h-6 rounded-full transition-all duration-500"
                                        style="width: ${Math.max(5, (day.count / Math.max(...analytics.daily_requests.map(d => d.count))) * 100)}%"
                                    ></div>
                                    <span class="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                                        ${day.count}
                                    </span>
                                </div>
                            </div>
                        `).join('') : 
                        '<p class="text-slate-400 text-center py-8">Dados insuficientes para gráfico</p>'
                    }
                </div>
            </div>

            <!-- Insights -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mt-6">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <i data-lucide="lightbulb" class="h-5 w-5"></i>
                    <span>Insights</span>
                </h3>
                <div class="space-y-3">
                    ${this.generateInsights(analytics)}
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    generateInsights(analytics) {
        const insights = [];
        
        if (analytics.approval_rate > 80) {
            insights.push(`
                <div class="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <i data-lucide="thumbs-up" class="h-5 w-5 text-green-400 mt-0.5"></i>
                    <div>
                        <p class="text-green-300 font-medium">Excelente taxa de aprovação!</p>
                        <p class="text-green-400/80 text-sm">Suas solicitações estão sendo bem aceitas.</p>
                    </div>
                </div>
            `);
        }

        if (analytics.daily_average > 5) {
            insights.push(`
                <div class="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <i data-lucide="trending-up" class="h-5 w-5 text-blue-400 mt-0.5"></i>
                    <div>
                        <p class="text-blue-300 font-medium">Alto volume de solicitações</p>
                        <p class="text-blue-400/80 text-sm">Considere otimizar seu processo de aprovação.</p>
                    </div>
                </div>
            `);
        }

        if (analytics.most_requested_type) {
            insights.push(`
                <div class="flex items-start space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <i data-lucide="target" class="h-5 w-5 text-purple-400 mt-0.5"></i>
                    <div>
                        <p class="text-purple-300 font-medium">Preferência por ${analytics.most_requested_type}</p>
                        <p class="text-purple-400/80 text-sm">Seus usuários preferem este tipo de conteúdo.</p>
                    </div>
                </div>
            `);
        }

        if (insights.length === 0) {
            insights.push(`
                <div class="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <i data-lucide="info" class="h-5 w-5 text-slate-400 mt-0.5"></i>
                    <div>
                        <p class="text-slate-300 font-medium">Dados insuficientes</p>
                        <p class="text-slate-400 text-sm">Mais insights aparecerão conforme você receber mais solicitações.</p>
                    </div>
                </div>
            `);
        }

        return insights.join('');
    }

    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatWhatsApp(number) {
        if (!number) return '';
        const cleaned = number.replace(/\D/g, '');
        if (cleaned.length === 13) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
        }
        return `+${cleaned}`;
    }

    getStatusLabel(status) {
        const labels = {
            'pending': 'Pendente',
            'approved': 'Aprovada',
            'denied': 'Negada'
        };
        return labels[status] || status;
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
            }
        });
    }

    showError(message) {
        const tabContent = document.getElementById('tabContent');
        tabContent.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="alert-circle" class="h-16 w-16 text-red-400 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-white mb-2">Erro</h3>
                <p class="text-red-400">${message}</p>
            </div>
        `;
        lucide.createIcons();
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

// Initialize the app and make it globally accessible
let clientDashboard;
document.addEventListener('DOMContentLoaded', () => {
    clientDashboard = new ClientDashboardApp();
});