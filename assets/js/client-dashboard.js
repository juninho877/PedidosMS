class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        console.log('ClientDashboardApp: Inicializando...', this.clientData);
        this.setupEventListeners();
        this.loadTab('overview');
    }

    setupEventListeners() {
        // Tab buttons
        document.getElementById('overviewTab').addEventListener('click', () => {
            this.loadTab('overview');
        });

        document.getElementById('requestsTab').addEventListener('click', () => {
            this.loadTab('requests');
        });

        document.getElementById('settingsTab').addEventListener('click', () => {
            this.loadTab('settings');
        });

        document.getElementById('analyticsTab').addEventListener('click', () => {
            this.loadTab('analytics');
        });
    }

    loadTab(tabName) {
        console.log('ClientDashboardApp: Carregando aba:', tabName);
        
        // Update active tab
        this.setActiveTab(tabName);
        this.currentTab = tabName;

        // Show loading
        this.showLoading();

        // Load tab content
        switch (tabName) {
            case 'overview':
                this.loadOverviewTab();
                break;
            case 'requests':
                this.loadRequestsTab();
                break;
            case 'settings':
                this.loadSettingsTab();
                break;
            case 'analytics':
                this.loadAnalyticsTab();
                break;
        }
    }

    setActiveTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
        });

        // Add active class to current tab
        const activeTab = document.getElementById(tabName + 'Tab');
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    showLoading() {
        document.getElementById('tabContent').innerHTML = `
            <div class="flex items-center justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        `;
    }

    async loadOverviewTab() {
        try {
            // Load stats
            const statsResponse = await fetch('/api/client-requests.php/stats');
            const stats = await statsResponse.json();

            // Load recent requests
            const requestsResponse = await fetch('/api/client-requests.php?limit=5');
            const recentRequests = await requestsResponse.json();

            this.renderOverviewTab(stats, recentRequests);
        } catch (error) {
            console.error('Erro ao carregar visão geral:', error);
            this.showError('Erro ao carregar dados da visão geral');
        }
    }

    renderOverviewTab(stats, recentRequests) {
        document.getElementById('tabContent').innerHTML = `
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="file-text" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${stats.total || 0}</p>
                            <p class="text-sm text-slate-400">Total</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="clock" class="h-8 w-8 text-yellow-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${stats.pending || 0}</p>
                            <p class="text-sm text-slate-400">Pendentes</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${stats.approved || 0}</p>
                            <p class="text-sm text-slate-400">Aprovadas</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
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
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <a href="/${this.clientData.slug}/search" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-primary/50 transition-all group">
                    <i data-lucide="search" class="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform"></i>
                    <h3 class="text-lg font-semibold text-white mb-2">Pesquisar Conteúdo</h3>
                    <p class="text-slate-400 text-sm">Encontre novos filmes e séries para solicitar</p>
                </a>
                
                <button onclick="clientDashboard.loadTab('requests')" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all group text-left">
                    <i data-lucide="file-text" class="h-8 w-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform"></i>
                    <h3 class="text-lg font-semibold text-white mb-2">Ver Solicitações</h3>
                    <p class="text-slate-400 text-sm">Gerencie todas as suas solicitações</p>
                </button>
                
                <button onclick="clientDashboard.loadTab('settings')" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all group text-left">
                    <i data-lucide="settings" class="h-8 w-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform"></i>
                    <h3 class="text-lg font-semibold text-white mb-2">Configurações</h3>
                    <p class="text-slate-400 text-sm">Personalize seu site e dados</p>
                </button>
            </div>

            <!-- Recent Activity -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-white mb-4">Atividade Recente</h3>
                ${recentRequests.length > 0 ? `
                    <div class="space-y-4">
                        ${recentRequests.slice(0, 5).map(request => `
                            <div class="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                                <img
                                    src="${request.poster_path ? 
                                        `https://image.tmdb.org/t/p/w92${request.poster_path}` : 
                                        '/assets/images/placeholder-poster.jpg'
                                    }"
                                    alt="${request.content_title}"
                                    class="w-12 h-18 object-cover rounded"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                                <div class="flex-1">
                                    <h4 class="font-medium text-white">${request.content_title}</h4>
                                    <p class="text-sm text-slate-400">
                                        ${request.content_type === 'movie' ? 'Filme' : 'Série'} • 
                                        ${new Date(request.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <span class="status-${request.status} px-3 py-1 rounded-full text-xs font-medium">
                                    ${this.getStatusText(request.status)}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="text-center py-8">
                        <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                        <p class="text-slate-400">Nenhuma solicitação ainda</p>
                    </div>
                `}
            </div>
        `;

        lucide.createIcons();
    }

    async loadRequestsTab() {
        try {
            const response = await fetch('/api/client-requests.php');
            const requests = await response.json();

            this.renderRequestsTab(requests);
        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            this.showError('Erro ao carregar solicitações');
        }
    }

    renderRequestsTab(requests) {
        document.getElementById('tabContent').innerHTML = `
            <!-- Filters -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 mb-6">
                <div class="grid sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Status</label>
                        <select id="statusFilter" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                            <option value="">Todos</option>
                            <option value="pending">Pendentes</option>
                            <option value="approved">Aprovadas</option>
                            <option value="denied">Negadas</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                        <select id="typeFilter" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                            <option value="">Todos</option>
                            <option value="movie">Filmes</option>
                            <option value="tv">Séries</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Buscar</label>
                        <input
                            type="text"
                            id="searchFilter"
                            placeholder="Título ou solicitante..."
                            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                        />
                    </div>
                </div>
            </div>

            <!-- Requests Table -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-700/50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Conteúdo</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Solicitante</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="requestsTableBody" class="divide-y divide-slate-700">
                            ${requests.length > 0 ? requests.map(request => `
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
                                                <p class="text-sm text-slate-400">
                                                    ${request.content_type === 'movie' ? 'Filme' : 'Série'}
                                                    ${request.season ? ` • T${request.season}` : ''}
                                                    ${request.episode ? `E${request.episode}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-4 py-4">
                                        <p class="text-white">${request.requester_name}</p>
                                        <p class="text-sm text-slate-400">${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                    </td>
                                    <td class="px-4 py-4">
                                        <p class="text-white">${new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                                        <p class="text-sm text-slate-400">${new Date(request.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td class="px-4 py-4">
                                        <span class="status-${request.status} px-3 py-1 rounded-full text-xs font-medium">
                                            ${this.getStatusText(request.status)}
                                        </span>
                                    </td>
                                    <td class="px-4 py-4">
                                        <button
                                            onclick="clientDashboard.openRequestModal(${request.id})"
                                            class="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="5" class="px-4 py-8 text-center">
                                        <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                                        <p class="text-slate-400">Nenhuma solicitação encontrada</p>
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    async loadRequestsTab() {
        try {
            const response = await fetch('/api/client-requests.php');
            const requests = await response.json();

            this.renderRequestsTab(requests);
            this.setupRequestsFilters(requests);
        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            this.showError('Erro ao carregar solicitações');
        }
    }

    renderRequestsTab(requests) {
        document.getElementById('tabContent').innerHTML = `
            <!-- Filters -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 mb-6">
                <div class="grid sm:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Status</label>
                        <select id="statusFilter" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                            <option value="">Todos</option>
                            <option value="pending">Pendentes</option>
                            <option value="approved">Aprovadas</option>
                            <option value="denied">Negadas</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                        <select id="typeFilter" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm">
                            <option value="">Todos</option>
                            <option value="movie">Filmes</option>
                            <option value="tv">Séries</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Buscar</label>
                        <input
                            type="text"
                            id="searchFilter"
                            placeholder="Título ou solicitante..."
                            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                        />
                    </div>
                </div>
            </div>

            <!-- Requests Table -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-700/50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Conteúdo</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Solicitante</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Data</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="requestsTableBody" class="divide-y divide-slate-700">
                            ${this.renderRequestsRows(requests)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    renderRequestsRows(requests) {
        if (requests.length === 0) {
            return `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center">
                        <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                        <p class="text-slate-400">Nenhuma solicitação encontrada</p>
                    </td>
                </tr>
            `;
        }

        return requests.map(request => `
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
                            <p class="text-sm text-slate-400">
                                ${request.content_type === 'movie' ? 'Filme' : 'Série'}
                                ${request.season ? ` • T${request.season}` : ''}
                                ${request.episode ? `E${request.episode}` : ''}
                            </p>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4">
                    <p class="text-white">${request.requester_name}</p>
                    <p class="text-sm text-slate-400">${this.formatWhatsApp(request.requester_whatsapp)}</p>
                </td>
                <td class="px-4 py-4">
                    <p class="text-white">${new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
                    <p class="text-sm text-slate-400">${new Date(request.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </td>
                <td class="px-4 py-4">
                    <span class="status-${request.status} px-3 py-1 rounded-full text-xs font-medium">
                        ${this.getStatusText(request.status)}
                    </span>
                </td>
                <td class="px-4 py-4">
                    <button
                        onclick="clientDashboard.openRequestModal(${request.id})"
                        class="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                        Ver Detalhes
                    </button>
                </td>
            </tr>
        `).join('');
    }

    setupRequestsFilters(allRequests) {
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        const searchFilter = document.getElementById('searchFilter');

        const applyFilters = () => {
            const status = statusFilter.value;
            const type = typeFilter.value;
            const search = searchFilter.value.toLowerCase();

            const filtered = allRequests.filter(request => {
                const matchesStatus = !status || request.status === status;
                const matchesType = !type || request.content_type === type;
                const matchesSearch = !search || 
                    request.content_title.toLowerCase().includes(search) ||
                    request.requester_name.toLowerCase().includes(search);

                return matchesStatus && matchesType && matchesSearch;
            });

            document.getElementById('requestsTableBody').innerHTML = this.renderRequestsRows(filtered);
            lucide.createIcons();
        };

        statusFilter.addEventListener('change', applyFilters);
        typeFilter.addEventListener('change', applyFilters);
        searchFilter.addEventListener('input', applyFilters);
    }

    async loadSettingsTab() {
        this.renderSettingsTab();
    }

    renderSettingsTab() {
        document.getElementById('tabContent').innerHTML = `
            <div class="max-w-4xl">
                <form id="settingsForm" class="space-y-8">
                    <!-- Informações Básicas -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-xl font-semibold text-white mb-6">Informações Básicas</h3>
                        <div class="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input
                                    type="text"
                                    id="name"
                                    value="${this.clientData.name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input
                                    type="text"
                                    id="site_name"
                                    value="${this.clientData.site_name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                                <input
                                    type="text"
                                    id="site_tagline"
                                    value="${this.clientData.site_tagline || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                <input
                                    type="email"
                                    id="contact_email"
                                    value="${this.clientData.contact_email || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                        </div>
                        <div class="mt-6">
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                            <textarea
                                id="site_description"
                                rows="3"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                            >${this.clientData.site_description || ''}</textarea>
                        </div>
                    </div>

                    <!-- Personalização Visual -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-xl font-semibold text-white mb-6">Personalização Visual</h3>
                        <div class="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                <div class="flex space-x-3">
                                    <input
                                        type="color"
                                        id="primary_color"
                                        value="${this.clientData.primary_color || '#3b82f6'}"
                                        class="w-12 h-12 rounded-lg border border-slate-600 bg-slate-700"
                                    />
                                    <input
                                        type="text"
                                        id="primary_color_text"
                                        value="${this.clientData.primary_color || '#3b82f6'}"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                <div class="flex space-x-3">
                                    <input
                                        type="color"
                                        id="secondary_color"
                                        value="${this.clientData.secondary_color || '#ef4444'}"
                                        class="w-12 h-12 rounded-lg border border-slate-600 bg-slate-700"
                                    />
                                    <input
                                        type="text"
                                        id="secondary_color_text"
                                        value="${this.clientData.secondary_color || '#ef4444'}"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Conteúdo da Página -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-xl font-semibold text-white mb-6">Conteúdo da Página</h3>
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                <input
                                    type="text"
                                    id="hero_title"
                                    value="${this.clientData.hero_title || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                <input
                                    type="text"
                                    id="hero_subtitle"
                                    value="${this.clientData.hero_subtitle || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Descrição Principal</label>
                                <textarea
                                    id="hero_description"
                                    rows="3"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                >${this.clientData.hero_description || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            type="submit"
                            class="flex-1 bg-primary hover:opacity-90 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Salvar Alterações
                        </button>
                        <a
                            href="/${this.clientData.slug}"
                            target="_blank"
                            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors text-center"
                        >
                            Visualizar Site
                        </a>
                    </div>
                </form>
            </div>
        `;

        this.setupSettingsForm();
        lucide.createIcons();
    }

    setupSettingsForm() {
        const form = document.getElementById('settingsForm');
        const primaryColorPicker = document.getElementById('primary_color');
        const primaryColorText = document.getElementById('primary_color_text');
        const secondaryColorPicker = document.getElementById('secondary_color');
        const secondaryColorText = document.getElementById('secondary_color_text');

        // Sync color inputs
        primaryColorPicker.addEventListener('input', (e) => {
            primaryColorText.value = e.target.value;
        });

        primaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                primaryColorPicker.value = e.target.value;
            }
        });

        secondaryColorPicker.addEventListener('input', (e) => {
            secondaryColorText.value = e.target.value;
        });

        secondaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                secondaryColorPicker.value = e.target.value;
            }
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    async saveSettings() {
        const formData = {
            name: document.getElementById('name').value,
            site_name: document.getElementById('site_name').value,
            site_tagline: document.getElementById('site_tagline').value,
            site_description: document.getElementById('site_description').value,
            contact_email: document.getElementById('contact_email').value,
            hero_title: document.getElementById('hero_title').value,
            hero_subtitle: document.getElementById('hero_subtitle').value,
            hero_description: document.getElementById('hero_description').value,
            primary_color: document.getElementById('primary_color').value,
            secondary_color: document.getElementById('secondary_color').value
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

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao salvar configurações');
            }

            this.showToast('Configurações salvas com sucesso!', 'success');
            
            // Update client data
            this.clientData = { ...this.clientData, ...formData };
            window.CLIENT_DATA = this.clientData;

        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async loadAnalyticsTab() {
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            this.renderAnalyticsTab(analytics);
        } catch (error) {
            console.error('Erro ao carregar analytics:', error);
            this.showError('Erro ao carregar analytics');
        }
    }

    renderAnalyticsTab(analytics) {
        document.getElementById('tabContent').innerHTML = `
            <!-- Metrics Cards -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.approval_rate || 0}%</p>
                            <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="calendar" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.daily_average || 0}</p>
                            <p class="text-sm text-slate-400">Média Diária</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="heart" class="h-8 w-8 text-purple-400"></i>
                        <div>
                            <p class="text-lg font-bold text-white">${analytics.most_requested_type || 'N/A'}</p>
                            <p class="text-sm text-slate-400">Mais Solicitado</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-white mb-6">Solicitações dos Últimos 30 Dias</h3>
                <div class="h-64 flex items-end space-x-2">
                    ${analytics.daily_requests ? analytics.daily_requests.map(day => {
                        const maxCount = Math.max(...analytics.daily_requests.map(d => d.count));
                        const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                        return `
                            <div class="flex-1 flex flex-col items-center">
                                <div 
                                    class="w-full bg-primary rounded-t min-h-[4px] transition-all hover:opacity-80"
                                    style="height: ${height}%"
                                    title="${day.count} solicitações em ${new Date(day.date).toLocaleDateString('pt-BR')}"
                                ></div>
                                <span class="text-xs text-slate-400 mt-2 transform -rotate-45 origin-left">
                                    ${new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                </span>
                            </div>
                        `;
                    }).join('') : '<p class="text-slate-400 text-center">Dados não disponíveis</p>'}
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    async openRequestModal(requestId) {
        try {
            // Show loading modal
            const modal = document.getElementById('requestModal');
            modal.innerHTML = `
                <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
                    <div class="flex items-center justify-center py-20">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');

            // Fetch request details and TMDB data in parallel
            const [requestResponse, tmdbResponse] = await Promise.all([
                fetch(`/api/client-requests.php/${requestId}`),
                fetch(`/api/client-requests.php/${requestId}`).then(async (res) => {
                    const request = await res.json();
                    if (request.content_id && request.content_type) {
                        return fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
                    }
                    return null;
                })
            ]);

            const request = await requestResponse.json();
            let tmdbData = null;

            if (tmdbResponse) {
                tmdbData = await tmdbResponse.json();
            }

            this.renderRequestModal(request, tmdbData);

        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            this.showToast('Erro ao carregar detalhes da solicitação', 'error');
        }
    }

    renderRequestModal(request, tmdbData) {
        const modal = document.getElementById('requestModal');
        const title = tmdbData?.title || tmdbData?.name || request.content_title;
        const posterUrl = tmdbData?.poster_path ? 
            `https://image.tmdb.org/t/p/w400${tmdbData.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        // Get additional info from TMDB
        const releaseDate = tmdbData?.release_date || tmdbData?.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
        const runtime = tmdbData?.runtime;
        const seasons = tmdbData?.number_of_seasons;
        const episodes = tmdbData?.number_of_episodes;
        const genres = tmdbData?.genres || [];
        const productionCompanies = tmdbData?.production_companies || [];
        const productionCountries = tmdbData?.production_countries || [];
        const originalLanguage = tmdbData?.original_language;
        const status = tmdbData?.status;
        const rating = tmdbData?.vote_average;
        const overview = tmdbData?.overview;
        const cast = tmdbData?.credits?.cast || [];
        const trailer = tmdbData?.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="file-text" class="h-6 w-6 text-primary"></i>
                        <h2 class="text-lg sm:text-xl font-semibold text-white">Detalhes da Solicitação #${request.id}</h2>
                    </div>
                    <button
                        onclick="document.getElementById('requestModal').classList.add('hidden')"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <div class="p-4 sm:p-6">
                    <div class="grid lg:grid-cols-3 gap-6 sm:gap-8">
                        <!-- Content Info -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Main Content Info -->
                            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <div class="flex-shrink-0">
                                    <img
                                        src="${posterUrl}"
                                        alt="${title}"
                                        class="w-32 h-48 sm:w-40 sm:h-60 object-cover rounded-lg border border-slate-700 mx-auto sm:mx-0"
                                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                    />
                                </div>
                                <div class="flex-1 space-y-4">
                                    <div>
                                        <h3 class="text-xl sm:text-2xl font-bold text-white mb-2">${title}</h3>
                                        <div class="flex flex-wrap gap-4 text-sm text-slate-400">
                                            <div class="flex items-center space-x-1">
                                                <i data-lucide="calendar" class="h-4 w-4"></i>
                                                <span>${year}</span>
                                            </div>
                                            ${rating ? `
                                                <div class="flex items-center space-x-1">
                                                    <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                                    <span>${rating.toFixed(1)}/10</span>
                                                </div>
                                            ` : ''}
                                            ${runtime ? `
                                                <div class="flex items-center space-x-1">
                                                    <i data-lucide="clock" class="h-4 w-4"></i>
                                                    <span>${runtime} min</span>
                                                </div>
                                            ` : ''}
                                            ${seasons ? `
                                                <div class="flex items-center space-x-1">
                                                    <i data-lucide="tv" class="h-4 w-4"></i>
                                                    <span>${seasons} temporada(s)</span>
                                                </div>
                                            ` : ''}
                                            ${episodes ? `
                                                <div class="flex items-center space-x-1">
                                                    <i data-lucide="list" class="h-4 w-4"></i>
                                                    <span>${episodes} episódios</span>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>

                                    <!-- Genres -->
                                    ${genres.length > 0 ? `
                                        <div>
                                            <h4 class="text-sm font-medium text-slate-300 mb-2">Gêneros</h4>
                                            <div class="flex flex-wrap gap-2">
                                                ${genres.map(genre => `
                                                    <span class="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs">
                                                        ${genre.name}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}

                                    <!-- Additional Info -->
                                    <div class="grid sm:grid-cols-2 gap-4 text-sm">
                                        ${status ? `
                                            <div>
                                                <span class="text-slate-400">Status:</span>
                                                <span class="text-white ml-2">${this.translateStatus(status)}</span>
                                            </div>
                                        ` : ''}
                                        ${originalLanguage ? `
                                            <div>
                                                <span class="text-slate-400">Idioma:</span>
                                                <span class="text-white ml-2">${this.translateLanguage(originalLanguage)}</span>
                                            </div>
                                        ` : ''}
                                        ${productionCountries.length > 0 ? `
                                            <div>
                                                <span class="text-slate-400">País:</span>
                                                <span class="text-white ml-2">${productionCountries.map(c => c.name).join(', ')}</span>
                                            </div>
                                        ` : ''}
                                        ${productionCompanies.length > 0 ? `
                                            <div>
                                                <span class="text-slate-400">Produtora:</span>
                                                <span class="text-white ml-2">${productionCompanies.slice(0, 2).map(c => c.name).join(', ')}</span>
                                            </div>
                                        ` : ''}
                                    </div>

                                    <!-- Overview -->
                                    ${overview ? `
                                        <div>
                                            <h4 class="text-sm font-medium text-slate-300 mb-2">Sinopse</h4>
                                            <p class="text-slate-400 text-sm leading-relaxed">${overview}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Cast -->
                            ${cast.length > 0 ? `
                                <div>
                                    <h4 class="text-lg font-semibold text-white mb-4">Elenco Principal</h4>
                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        ${cast.slice(0, 8).map(actor => `
                                            <div class="text-center">
                                                <img
                                                    src="${actor.profile_path ? 
                                                        `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 
                                                        '/assets/images/placeholder-person.jpg'
                                                    }"
                                                    alt="${actor.name}"
                                                    class="w-full h-24 object-cover rounded-lg mb-2"
                                                    onerror="this.src='/assets/images/placeholder-person.jpg'"
                                                />
                                                <p class="text-white font-medium text-sm">${actor.name}</p>
                                                <p class="text-slate-400 text-xs">${actor.character}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Trailer -->
                            ${trailer ? `
                                <div>
                                    <h4 class="text-lg font-semibold text-white mb-4">Trailer</h4>
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
                        </div>

                        <!-- Request Details Sidebar -->
                        <div class="space-y-6">
                            <!-- Request Info -->
                            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-4 sm:p-6">
                                <h4 class="text-lg font-semibold text-white mb-4">Informações da Solicitação</h4>
                                <div class="space-y-3 text-sm">
                                    <div>
                                        <span class="text-slate-400">ID:</span>
                                        <span class="text-white ml-2">#${request.id}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Tipo:</span>
                                        <span class="text-white ml-2">${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                    </div>
                                    ${request.season ? `
                                        <div>
                                            <span class="text-slate-400">Temporada:</span>
                                            <span class="text-white ml-2">${request.season}</span>
                                        </div>
                                    ` : ''}
                                    ${request.episode ? `
                                        <div>
                                            <span class="text-slate-400">Episódio:</span>
                                            <span class="text-white ml-2">${request.episode}</span>
                                        </div>
                                    ` : ''}
                                    <div>
                                        <span class="text-slate-400">Status:</span>
                                        <span class="status-${request.status} px-2 py-1 rounded text-xs font-medium ml-2">
                                            ${this.getStatusText(request.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Solicitado em:</span>
                                        <span class="text-white ml-2">${new Date(request.created_at).toLocaleString('pt-BR')}</span>
                                    </div>
                                    ${request.updated_at !== request.created_at ? `
                                        <div>
                                            <span class="text-slate-400">Atualizado em:</span>
                                            <span class="text-white ml-2">${new Date(request.updated_at).toLocaleString('pt-BR')}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Requester Info -->
                            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-4 sm:p-6">
                                <h4 class="text-lg font-semibold text-white mb-4">Dados do Solicitante</h4>
                                <div class="space-y-3 text-sm">
                                    <div>
                                        <span class="text-slate-400">Nome:</span>
                                        <span class="text-white ml-2">${request.requester_name}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">WhatsApp:</span>
                                        <span class="text-white ml-2">${this.formatWhatsApp(request.requester_whatsapp)}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="space-y-3">
                                ${request.status === 'pending' ? `
                                    <button
                                        onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')"
                                        class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        <i data-lucide="check" class="h-5 w-5 inline mr-2"></i>
                                        Aprovar Solicitação
                                    </button>
                                    <button
                                        onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')"
                                        class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        <i data-lucide="x" class="h-5 w-5 inline mr-2"></i>
                                        Negar Solicitação
                                    </button>
                                ` : ''}
                                
                                <a
                                    href="https://wa.me/${request.requester_whatsapp}?text=Olá ${encodeURIComponent(request.requester_name)}, sobre sua solicitação de '${encodeURIComponent(request.content_title)}'..."
                                    target="_blank"
                                    class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                >
                                    <i data-lucide="message-circle" class="h-5 w-5"></i>
                                    <span>Contatar via WhatsApp</span>
                                </a>
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
                body: JSON.stringify({ id: requestId, status })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao atualizar status');
            }

            this.showToast('Status atualizado com sucesso!', 'success');
            
            // Close modal and reload current tab
            document.getElementById('requestModal').classList.add('hidden');
            this.loadTab(this.currentTab);

        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    formatWhatsApp(whatsapp) {
        if (!whatsapp) return '';
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length === 13) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
        }
        return whatsapp;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pendente',
            'approved': 'Aprovada',
            'denied': 'Negada'
        };
        return statusMap[status] || status;
    }

    translateStatus(status) {
        const statusMap = {
            'Released': 'Lançado',
            'Ended': 'Finalizada',
            'Returning Series': 'Em Exibição',
            'In Production': 'Em Produção',
            'Post Production': 'Pós-Produção',
            'Planned': 'Planejado',
            'Canceled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    translateLanguage(lang) {
        const langMap = {
            'en': 'Inglês',
            'pt': 'Português',
            'es': 'Espanhol',
            'fr': 'Francês',
            'de': 'Alemão',
            'it': 'Italiano',
            'ja': 'Japonês',
            'ko': 'Coreano',
            'zh': 'Chinês'
        };
        return langMap[lang] || lang.toUpperCase();
    }

    showError(message) {
        document.getElementById('tabContent').innerHTML = `
            <div class="text-center py-20">
                <i data-lucide="alert-circle" class="h-12 w-12 text-red-400 mx-auto mb-4"></i>
                <p class="text-red-400 font-medium">${message}</p>
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

// Initialize the app and make it globally available
let clientDashboard;
document.addEventListener('DOMContentLoaded', () => {
    clientDashboard = new ClientDashboardApp();
});