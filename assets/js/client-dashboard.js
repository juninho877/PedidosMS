class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.client = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        console.log('ClientDashboardApp: Inicializando...', this.client);
        this.setupEventListeners();
        this.loadTabContent('overview');
    }

    setupEventListeners() {
        // Tab buttons
        const tabButtons = ['overviewTab', 'requestsTab', 'settingsTab', 'analyticsTab'];
        tabButtons.forEach(tabId => {
            const button = document.getElementById(tabId);
            if (button) {
                button.addEventListener('click', () => {
                    const tab = tabId.replace('Tab', '');
                    this.switchTab(tab);
                });
            }
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.id === 'requestModal' || e.target.closest('#closeRequestModal')) {
                this.closeModal();
            }
        });
    }

    switchTab(tab) {
        console.log('Switching to tab:', tab);
        
        // Update tab buttons
        const tabs = ['overview', 'requests', 'settings', 'analytics'];
        tabs.forEach(t => {
            const button = document.getElementById(t + 'Tab');
            if (button) {
                if (t === tab) {
                    button.className = 'tab-button flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors active';
                } else {
                    button.className = 'tab-button flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors';
                }
            }
        });

        this.currentTab = tab;
        this.loadTabContent(tab);
    }

    async loadTabContent(tab) {
        const content = document.getElementById('tabContent');
        
        // Show loading
        content.innerHTML = `
            <div class="flex items-center justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        `;

        try {
            switch (tab) {
                case 'overview':
                    await this.loadOverviewTab();
                    break;
                case 'requests':
                    await this.loadRequestsTab();
                    break;
                case 'settings':
                    await this.loadSettingsTab();
                    break;
                case 'analytics':
                    await this.loadAnalyticsTab();
                    break;
                default:
                    content.innerHTML = '<div class="text-center py-20 text-slate-400">Aba não encontrada</div>';
            }
        } catch (error) {
            console.error('Error loading tab content:', error);
            content.innerHTML = `
                <div class="text-center py-20">
                    <div class="text-red-400 mb-4">Erro ao carregar conteúdo</div>
                    <button onclick="clientDashboard.loadTabContent('${tab}')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Tentar Novamente
                    </button>
                </div>
            `;
        }
    }

    async loadOverviewTab() {
        try {
            // Load stats
            const statsResponse = await fetch('/api/client-requests.php/stats');
            const stats = await statsResponse.json();

            // Load recent requests
            const requestsResponse = await fetch('/api/client-requests.php?limit=5');
            const recentRequests = await requestsResponse.json();

            const content = document.getElementById('tabContent');
            content.innerHTML = `
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
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all group cursor-pointer" onclick="window.open('/${this.client.slug}/search', '_blank')">
                        <div class="flex items-center space-x-4">
                            <div class="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i data-lucide="search" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">Ver Site Público</h3>
                                <p class="text-sm text-slate-400">Visualizar como os usuários veem</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all group cursor-pointer" onclick="clientDashboard.switchTab('requests')">
                        <div class="flex items-center space-x-4">
                            <div class="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i data-lucide="file-text" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">Gerenciar Solicitações</h3>
                                <p class="text-sm text-slate-400">Aprovar ou negar pedidos</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition-all group cursor-pointer" onclick="clientDashboard.switchTab('settings')">
                        <div class="flex items-center space-x-4">
                            <div class="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i data-lucide="settings" class="h-6 w-6 text-white"></i>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">Configurações</h3>
                                <p class="text-sm text-slate-400">Personalizar seu site</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-white mb-6">Atividade Recente</h3>
                    ${recentRequests.length > 0 ? `
                        <div class="space-y-4">
                            ${recentRequests.slice(0, 5).map(request => `
                                <div class="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer" onclick="clientDashboard.showRequestDetails(${request.id})">
                                    <img
                                        src="${request.poster_path ? `https://image.tmdb.org/t/p/w92${request.poster_path}` : '/assets/images/placeholder-poster.jpg'}"
                                        alt="${request.content_title}"
                                        class="w-12 h-18 object-cover rounded"
                                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                    />
                                    <div class="flex-1">
                                        <h4 class="font-semibold text-white">${request.content_title}</h4>
                                        <p class="text-sm text-slate-400">${request.requester_name} • ${this.formatDate(request.created_at)}</p>
                                    </div>
                                    <span class="status-${request.status} px-3 py-1 rounded-full text-xs font-medium">
                                        ${this.getStatusText(request.status)}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-8 text-slate-400">
                            <i data-lucide="inbox" class="h-12 w-12 mx-auto mb-4 text-slate-600"></i>
                            <p>Nenhuma solicitação ainda</p>
                        </div>
                    `}
                </div>
            `;

            lucide.createIcons();
        } catch (error) {
            console.error('Error loading overview:', error);
            throw error;
        }
    }

    async loadRequestsTab() {
        try {
            const response = await fetch('/api/client-requests.php');
            const requests = await response.json();

            const content = document.getElementById('tabContent');
            content.innerHTML = `
                <!-- Filters -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 mb-6">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <select id="statusFilter" class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            <option value="">Todos os Status</option>
                            <option value="pending">Pendentes</option>
                            <option value="approved">Aprovadas</option>
                            <option value="denied">Negadas</option>
                        </select>
                        
                        <select id="typeFilter" class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                            <option value="">Todos os Tipos</option>
                            <option value="movie">Filmes</option>
                            <option value="tv">Séries</option>
                        </select>
                        
                        <input
                            type="text"
                            id="searchFilter"
                            placeholder="Buscar por título..."
                            class="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                        />
                    </div>
                </div>

                <!-- Requests Table -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                    ${requests.length > 0 ? `
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-700/50">
                                    <tr>
                                        <th class="px-4 py-3 text-left text-sm font-medium text-slate-300">Conteúdo</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium text-slate-300">Solicitante</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium text-slate-300">Tipo</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium text-slate-300">Data</th>
                                        <th class="px-4 py-3 text-left text-sm font-medium text-slate-300">Ações</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-700">
                                    ${requests.map(request => `
                                        <tr class="hover:bg-slate-700/30 transition-colors">
                                            <td class="px-4 py-4">
                                                <div class="flex items-center space-x-3">
                                                    <img
                                                        src="${request.poster_path ? `https://image.tmdb.org/t/p/w92${request.poster_path}` : '/assets/images/placeholder-poster.jpg'}"
                                                        alt="${request.content_title}"
                                                        class="w-10 h-15 object-cover rounded"
                                                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                                    />
                                                    <div>
                                                        <p class="font-medium text-white">${request.content_title}</p>
                                                        ${request.season ? `<p class="text-xs text-slate-400">T${request.season}${request.episode ? ` E${request.episode}` : ''}</p>` : ''}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-4">
                                                <div>
                                                    <p class="text-white">${request.requester_name}</p>
                                                    <p class="text-xs text-slate-400">${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                                </div>
                                            </td>
                                            <td class="px-4 py-4">
                                                <span class="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                    request.content_type === 'movie' ? 'bg-blue-600/20 text-blue-300' : 'bg-purple-600/20 text-purple-300'
                                                }">
                                                    <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-3 w-3"></i>
                                                    <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                                </span>
                                            </td>
                                            <td class="px-4 py-4">
                                                <span class="status-${request.status} px-3 py-1 rounded-full text-xs font-medium">
                                                    ${this.getStatusText(request.status)}
                                                </span>
                                            </td>
                                            <td class="px-4 py-4 text-sm text-slate-400">
                                                ${this.formatDate(request.created_at)}
                                            </td>
                                            <td class="px-4 py-4">
                                                <button
                                                    onclick="clientDashboard.showRequestDetails(${request.id})"
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
                    ` : `
                        <div class="text-center py-12">
                            <i data-lucide="inbox" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                            <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação ainda</h3>
                            <p class="text-slate-500 mb-6">Quando os usuários fizerem solicitações, elas aparecerão aqui.</p>
                            <a href="/${this.client.slug}/search" target="_blank" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                <i data-lucide="external-link" class="h-4 w-4"></i>
                                <span>Ver Site Público</span>
                            </a>
                        </div>
                    `}
                </div>
            `;

            lucide.createIcons();
        } catch (error) {
            console.error('Error loading overview:', error);
            throw error;
        }
    }

    async loadSettingsTab() {
        const content = document.getElementById('tabContent');
        content.innerHTML = `
            <div class="max-w-4xl">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-white mb-6">Configurações do Site</h3>
                    
                    <form id="settingsForm" class="space-y-6">
                        <!-- Basic Info -->
                        <div class="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input
                                    type="text"
                                    id="name"
                                    value="${this.client.name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input
                                    type="text"
                                    id="site_name"
                                    value="${this.client.site_name || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                        </div>

                        <!-- Hero Section -->
                        <div class="space-y-4">
                            <h4 class="text-lg font-medium text-white">Seção Principal</h4>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                                <input
                                    type="text"
                                    id="hero_title"
                                    value="${this.client.hero_title || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                <input
                                    type="text"
                                    id="hero_subtitle"
                                    value="${this.client.hero_subtitle || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                                <textarea
                                    id="hero_description"
                                    rows="3"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                >${this.client.hero_description || ''}</textarea>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                <input
                                    type="email"
                                    id="contact_email"
                                    value="${this.client.contact_email || ''}"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                                <input
                                    type="text"
                                    id="contact_whatsapp"
                                    value="${this.client.contact_whatsapp || ''}"
                                    placeholder="5511999999999"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <!-- Colors -->
                        <div class="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                <div class="flex space-x-3">
                                    <input
                                        type="color"
                                        id="primary_color"
                                        value="${this.client.primary_color || '#3b82f6'}"
                                        class="w-12 h-12 rounded-lg border border-slate-600"
                                    />
                                    <input
                                        type="text"
                                        id="primary_color_text"
                                        value="${this.client.primary_color || '#3b82f6'}"
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
                                        value="${this.client.secondary_color || '#ef4444'}"
                                        class="w-12 h-12 rounded-lg border border-slate-600"
                                    />
                                    <input
                                        type="text"
                                        id="secondary_color_text"
                                        value="${this.client.secondary_color || '#ef4444'}"
                                        class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                            <button
                                type="submit"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Salvar Alterações
                            </button>
                            <a
                                href="/${this.client.slug}"
                                target="_blank"
                                class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors text-center"
                            >
                                Visualizar Site
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Setup color sync
        this.setupColorSync();
        
        // Setup form submission
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    async loadAnalyticsTab() {
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            const content = document.getElementById('tabContent');
            content.innerHTML = `
                <!-- Analytics Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                            <i data-lucide="star" class="h-8 w-8 text-yellow-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white">${analytics.most_requested_type || 'N/A'}</p>
                                <p class="text-sm text-slate-400">Mais Solicitado</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="activity" class="h-8 w-8 text-purple-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-white">${analytics.daily_requests?.length || 0}</p>
                                <p class="text-sm text-slate-400">Dias com Atividade</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chart -->
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-white mb-6">Solicitações dos Últimos 30 Dias</h3>
                    <div class="h-64 flex items-end space-x-2">
                        ${analytics.daily_requests?.length > 0 ? 
                            analytics.daily_requests.map(day => `
                                <div class="flex-1 flex flex-col items-center">
                                    <div 
                                        class="w-full bg-blue-600 rounded-t"
                                        style="height: ${Math.max(8, (day.count / Math.max(...analytics.daily_requests.map(d => d.count))) * 200)}px"
                                        title="${day.date}: ${day.count} solicitações"
                                    ></div>
                                    <span class="text-xs text-slate-400 mt-2 transform -rotate-45 origin-left">
                                        ${new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                </div>
                            `).join('') :
                            '<div class="text-center text-slate-400 w-full">Nenhum dado disponível</div>'
                        }
                    </div>
                </div>
            `;

            lucide.createIcons();
        } catch (error) {
            console.error('Error loading analytics:', error);
            throw error;
        }
    }

    async showRequestDetails(requestId) {
        try {
            // Get request details
            const requestResponse = await fetch(`/api/client-requests.php/${requestId}`);
            const request = await requestResponse.json();

            if (!requestResponse.ok) {
                throw new Error(request.error || 'Erro ao carregar solicitação');
            }

            // Get TMDB details
            let tmdbData = null;
            try {
                const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
                if (tmdbResponse.ok) {
                    tmdbData = await tmdbResponse.json();
                }
            } catch (error) {
                console.warn('Erro ao buscar dados do TMDB:', error);
            }

            this.renderRequestModal(request, tmdbData);
        } catch (error) {
            console.error('Error loading request details:', error);
            this.showToast('Erro ao carregar detalhes da solicitação', 'error');
        }
    }

    renderRequestModal(request, tmdbData = null) {
        // Informações básicas
        const posterUrl = tmdbData?.poster_path ? 
            `https://image.tmdb.org/t/p/w400${tmdbData.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';
        
        const releaseYear = tmdbData ? 
            (tmdbData.release_date || tmdbData.first_air_date ? 
                new Date(tmdbData.release_date || tmdbData.first_air_date).getFullYear() : 'N/A') : 'N/A';
        
        const rating = tmdbData?.vote_average?.toFixed(1) || 'N/A';
        const overview = tmdbData?.overview || 'Sinopse não disponível.';
        
        // Gêneros
        const genres = tmdbData?.genres ? 
            tmdbData.genres.map(genre => `<span class="inline-block bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm mr-2 mb-2">${genre.name}</span>`).join('') : 
            '<span class="text-slate-400">Não disponível</span>';
        
        // Informações específicas por tipo
        let specificInfo = '';
        if (tmdbData) {
            if (request.content_type === 'movie') {
                const runtime = tmdbData.runtime ? `${tmdbData.runtime} min` : 'N/A';
                const budget = tmdbData.budget && tmdbData.budget > 0 ? 
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(tmdbData.budget) : 'N/A';
                const revenue = tmdbData.revenue && tmdbData.revenue > 0 ? 
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(tmdbData.revenue) : 'N/A';
                
                specificInfo = `
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span class="text-slate-400">Duração:</span>
                            <span class="text-white ml-2">${runtime}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Orçamento:</span>
                            <span class="text-white ml-2">${budget}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Bilheteria:</span>
                            <span class="text-white ml-2">${revenue}</span>
                        </div>
                    </div>
                `;
            } else {
                const seasons = tmdbData.number_of_seasons || 'N/A';
                const episodes = tmdbData.number_of_episodes || 'N/A';
                const status = this.translateStatus(tmdbData.status) || 'N/A';
                const networks = tmdbData.networks?.map(n => n.name).join(', ') || 'N/A';
                
                specificInfo = `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-slate-400">Temporadas:</span>
                            <span class="text-white ml-2">${seasons}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Episódios:</span>
                            <span class="text-white ml-2">${episodes}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Status:</span>
                            <span class="text-white ml-2">${status}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Rede:</span>
                            <span class="text-white ml-2">${networks}</span>
                        </div>
                    </div>
                `;
            }
        }
        
        // Informações de produção
        const productionCompanies = tmdbData?.production_companies ? 
            tmdbData.production_companies.slice(0, 3).map(company => company.name).join(', ') : 'N/A';
        
        const countries = tmdbData?.production_countries ? 
            tmdbData.production_countries.map(country => country.name).join(', ') : 'N/A';
            
        const originalLanguage = tmdbData?.original_language ? 
            this.translateLanguage(tmdbData.original_language) : 'N/A';
        
        // Elenco
        let castSection = '';
        if (tmdbData?.credits?.cast) {
            const cast = tmdbData.credits.cast.slice(0, 8);
            castSection = `
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-white mb-4">Elenco Principal</h4>
                    <div class="grid grid-cols-4 gap-4">
                        ${cast.map(actor => `
                            <div class="text-center">
                                <img
                                    src="${actor.profile_path ? 
                                        `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 
                                        '/assets/images/placeholder-person.jpg'
                                    }"
                                    alt="${actor.name}"
                                    class="w-full h-20 object-cover rounded-lg mb-2"
                                    onerror="this.src='/assets/images/placeholder-person.jpg'"
                                />
                                <p class="text-white font-medium text-xs">${actor.name}</p>
                                <p class="text-slate-400 text-xs">${actor.character}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        // Trailer
        let trailerSection = '';
        const trailer = tmdbData?.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
            trailerSection = `
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-white mb-4">Trailer</h4>
                    <div class="aspect-video">
                        <iframe
                            src="https://www.youtube.com/embed/${trailer.key}"
                            title="${request.content_title} Trailer"
                            class="w-full h-full rounded-lg"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            `;
        }
        
        const contentType = request.content_type === 'movie' ? 'Filme' : 'Série';
        
        // Render modal
        const modal = document.getElementById('requestModal');
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="file-text" class="h-6 w-6 text-blue-400"></i>
                        <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação #${request.id}</h2>
                    </div>
                    <button
                        id="closeRequestModal"
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
                            <!-- Content Info -->
                            <div class="flex gap-6">
                                <div class="flex-shrink-0">
                                    <img
                                        src="${posterUrl}"
                                        alt="${request.content_title}"
                                        class="w-32 h-48 object-cover rounded-lg border border-slate-600"
                                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                    />
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-2xl font-bold text-white mb-2">${request.content_title}</h3>
                                    <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-300">
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="calendar" class="h-4 w-4"></i>
                                            <span>${releaseYear}</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                            <span>${rating}/10</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                            <span>${contentType}</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="globe" class="h-4 w-4"></i>
                                            <span>${originalLanguage}</span>
                                        </div>
                                    </div>
                                    <p class="text-slate-300 text-sm leading-relaxed mb-4">${overview}</p>
                                    
                                    <!-- Informações Específicas -->
                                    ${specificInfo}
                                </div>
                            </div>
                            
                            <!-- Gêneros -->
                            <div>
                                <h4 class="text-lg font-semibold text-white mb-3">Gêneros</h4>
                                <div class="flex flex-wrap">
                                    ${genres}
                                </div>
                            </div>
                            
                            <!-- Informações de Produção -->
                            <div>
                                <h4 class="text-lg font-semibold text-white mb-3">Produção</h4>
                                <div class="grid grid-cols-1 gap-3 text-sm">
                                    <div>
                                        <span class="text-slate-400">Produtoras:</span>
                                        <span class="text-white ml-2">${productionCompanies}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Países:</span>
                                        <span class="text-white ml-2">${countries}</span>
                                    </div>
                                </div>
                            </div>
                            
                            ${castSection}
                            ${trailerSection}
                        </div>

                        <!-- Sidebar -->
                        <div class="space-y-6">
                            <!-- Request Info -->
                            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-4">Informações da Solicitação</h4>
                                <div class="space-y-3 text-sm">
                                    <div>
                                        <span class="text-slate-400">ID:</span>
                                        <span class="text-white ml-2">#${request.id}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Tipo:</span>
                                        <span class="text-white ml-2">${contentType}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Status:</span>
                                        <span class="status-${request.status} px-2 py-1 rounded text-xs font-medium ml-2">
                                            ${this.getStatusText(request.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Solicitado em:</span>
                                        <span class="text-white ml-2">${this.formatDate(request.created_at)}</span>
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
                                </div>
                            </div>

                            <!-- Requester Info -->
                            <div class="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
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
                                        class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <i data-lucide="check" class="h-5 w-5"></i>
                                        <span>Aprovar Solicitação</span>
                                    </button>
                                    <button
                                        onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')"
                                        class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <i data-lucide="x" class="h-5 w-5"></i>
                                        <span>Negar Solicitação</span>
                                    </button>
                                ` : ''}
                                
                                <a
                                    href="https://wa.me/${request.requester_whatsapp}?text=${encodeURIComponent(`Olá ${request.requester_name}! Sobre sua solicitação de "${request.content_title}"...`)}"
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

        modal.classList.remove('hidden');
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
            this.closeModal();
            
            // Reload current tab
            this.loadTabContent(this.currentTab);

        } catch (error) {
            console.error('Error updating status:', error);
            this.showToast(error.message, 'error');
        }
    }

    async saveSettings() {
        try {
            const formData = {
                name: document.getElementById('name').value,
                site_name: document.getElementById('site_name').value,
                hero_title: document.getElementById('hero_title').value,
                hero_subtitle: document.getElementById('hero_subtitle').value,
                hero_description: document.getElementById('hero_description').value,
                contact_email: document.getElementById('contact_email').value,
                contact_whatsapp: document.getElementById('contact_whatsapp').value,
                primary_color: document.getElementById('primary_color').value,
                secondary_color: document.getElementById('secondary_color').value
            };

            const response = await fetch(`/api/client-tenants.php/${this.client.id}`, {
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

            // Update client data
            Object.assign(this.client, formData);
            window.CLIENT_DATA = this.client;

            this.showToast('Configurações salvas com sucesso!', 'success');

        } catch (error) {
            console.error('Error saving settings:', error);
            this.showToast(error.message, 'error');
        }
    }

    setupColorSync() {
        // Primary color sync
        const primaryColor = document.getElementById('primary_color');
        const primaryColorText = document.getElementById('primary_color_text');
        
        if (primaryColor && primaryColorText) {
            primaryColor.addEventListener('input', (e) => {
                primaryColorText.value = e.target.value;
            });
            
            primaryColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    primaryColor.value = e.target.value;
                }
            });
        }

        // Secondary color sync
        const secondaryColor = document.getElementById('secondary_color');
        const secondaryColorText = document.getElementById('secondary_color_text');
        
        if (secondaryColor && secondaryColorText) {
            secondaryColor.addEventListener('input', (e) => {
                secondaryColorText.value = e.target.value;
            });
            
            secondaryColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    secondaryColor.value = e.target.value;
                }
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('requestModal');
        modal.classList.add('hidden');
    }

    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatWhatsApp(whatsapp) {
        if (!whatsapp) return 'N/A';
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length >= 13) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
        }
        return `+${cleaned}`;
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
            'Canceled': 'Cancelada',
            'Planned': 'Planejada'
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

// Initialize the app globally
let clientDashboard;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ClientDashboardApp...');
    try {
        clientDashboard = new ClientDashboardApp();
        console.log('ClientDashboardApp initialized successfully');
    } catch (error) {
        console.error('Error initializing ClientDashboardApp:', error);
    }
});