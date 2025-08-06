class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        console.log('ClientDashboardApp: Inicializando...', this.clientData);
        this.setupTabNavigation();
        this.loadTabContent('overview');
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        console.log('ClientDashboardApp: Mudando para aba:', tabName);
        
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Load tab content
        this.currentTab = tabName;
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        const contentDiv = document.getElementById('tabContent');
        
        // Show loading
        contentDiv.innerHTML = `
            <div class="flex items-center justify-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
        `;

        // Load content based on tab
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

    async loadOverviewTab() {
        try {
            // Load stats
            const statsResponse = await fetch('/api/client-requests.php/stats');
            const stats = await statsResponse.json();

            // Load recent requests
            const requestsResponse = await fetch('/api/client-requests.php?limit=5');
            const recentRequests = await requestsResponse.json();

            const content = `
                <div class="space-y-8">
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <a href="/${this.clientData.slug}" target="_blank" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                                <i data-lucide="external-link" class="h-6 w-6 text-blue-400"></i>
                                <div>
                                    <p class="font-medium text-white">Ver Meu Site</p>
                                    <p class="text-sm text-slate-400">Visualizar site público</p>
                                </div>
                            </a>
                            <button onclick="clientDashboard.switchTab('requests')" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left">
                                <i data-lucide="list" class="h-6 w-6 text-purple-400"></i>
                                <div>
                                    <p class="font-medium text-white">Ver Solicitações</p>
                                    <p class="text-sm text-slate-400">Gerenciar pedidos</p>
                                </div>
                            </button>
                            <button onclick="clientDashboard.switchTab('settings')" class="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left">
                                <i data-lucide="settings" class="h-6 w-6 text-green-400"></i>
                                <div>
                                    <p class="font-medium text-white">Configurações</p>
                                    <p class="text-sm text-slate-400">Personalizar site</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Recent Requests -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-white">Atividade Recente</h3>
                            <button onclick="clientDashboard.switchTab('requests')" class="text-blue-400 hover:text-blue-300 text-sm">
                                Ver todas
                            </button>
                        </div>
                        <div class="space-y-3">
                            ${recentRequests.length > 0 ? recentRequests.map(request => `
                                <div class="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
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
                                        <p class="font-medium text-white">${request.content_title}</p>
                                        <p class="text-sm text-slate-400">${request.requester_name}</p>
                                    </div>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                        ${this.getStatusText(request.status)}
                                    </span>
                                </div>
                            `).join('') : `
                                <div class="text-center py-8">
                                    <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                                    <p class="text-slate-400">Nenhuma solicitação ainda</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('tabContent').innerHTML = content;
            lucide.createIcons();

        } catch (error) {
            console.error('Erro ao carregar overview:', error);
            this.showError('Erro ao carregar dados da visão geral');
        }
    }

    async loadRequestsTab() {
        try {
            const response = await fetch('/api/client-requests.php');
            const requests = await response.json();

            const content = `
                <div class="space-y-6">
                    <!-- Filters -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div class="flex flex-col sm:flex-row gap-4">
                            <select id="statusFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                <option value="">Todos os status</option>
                                <option value="pending">Pendentes</option>
                                <option value="approved">Aprovadas</option>
                                <option value="denied">Negadas</option>
                            </select>
                            <select id="typeFilter" class="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                                <option value="">Todos os tipos</option>
                                <option value="movie">Filmes</option>
                                <option value="tv">Séries</option>
                            </select>
                            <input
                                type="text"
                                id="searchFilter"
                                placeholder="Buscar por título ou solicitante..."
                                class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                            />
                        </div>
                    </div>

                    <!-- Requests Table -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
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
                                <tbody id="requestsTableBody" class="divide-y divide-slate-700">
                                    ${requests.length > 0 ? requests.map(request => `
                                        <tr class="hover:bg-slate-700/30 transition-colors">
                                            <td class="px-4 py-3">
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
                                            <td class="px-4 py-3">
                                                <p class="text-white">${request.requester_name}</p>
                                                <p class="text-sm text-slate-400">${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                            </td>
                                            <td class="px-4 py-3">
                                                <span class="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                    request.content_type === 'movie' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'
                                                }">
                                                    <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-3 w-3"></i>
                                                    <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                                </span>
                                            </td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                                    ${this.getStatusText(request.status)}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3 text-sm text-slate-400">
                                                ${new Date(request.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td class="px-4 py-3">
                                                <button
                                                    onclick="clientDashboard.openRequestModal(${request.id})"
                                                    class="text-blue-400 hover:text-blue-300 text-sm"
                                                >
                                                    Ver Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('') : `
                                        <tr>
                                            <td colspan="6" class="px-4 py-8 text-center">
                                                <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                                                <p class="text-slate-400">Nenhuma solicitação encontrada</p>
                                            </td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('tabContent').innerHTML = content;
            this.setupRequestFilters();
            lucide.createIcons();

        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            this.showError('Erro ao carregar solicitações');
        }
    }

    async loadSettingsTab() {
        const content = `
            <div class="max-w-4xl">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <h3 class="text-xl font-semibold text-white mb-6">Configurações do Site</h3>
                    
                    <form id="settingsForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Basic Info -->
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                                <input
                                    type="text"
                                    id="name"
                                    value="${this.clientData.name || ''}"
                                    class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                                <input
                                    type="text"
                                    id="site_name"
                                    value="${this.clientData.site_name || ''}"
                                    class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                            <input
                                type="text"
                                id="site_tagline"
                                value="${this.clientData.site_tagline || ''}"
                                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                            <textarea
                                id="site_description"
                                rows="3"
                                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
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
                                        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                                    <input
                                        type="text"
                                        id="hero_subtitle"
                                        value="${this.clientData.hero_subtitle || ''}"
                                        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
                                    <textarea
                                        id="hero_description"
                                        rows="3"
                                        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    >${this.clientData.hero_description || ''}</textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="border-t border-slate-700 pt-6">
                            <h4 class="text-lg font-medium text-white mb-4">Informações de Contato</h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                                    <input
                                        type="email"
                                        id="contact_email"
                                        value="${this.clientData.contact_email || ''}"
                                        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                                    <input
                                        type="text"
                                        id="contact_whatsapp"
                                        value="${this.clientData.contact_whatsapp || ''}"
                                        placeholder="5511999999999"
                                        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Colors -->
                        <div class="border-t border-slate-700 pt-6">
                            <h4 class="text-lg font-medium text-white mb-4">Cores do Site</h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                                    <div class="flex space-x-2">
                                        <input
                                            type="color"
                                            id="primary_color_picker"
                                            value="${this.clientData.primary_color || '#3b82f6'}"
                                            class="w-12 h-10 rounded border border-slate-600"
                                        />
                                        <input
                                            type="text"
                                            id="primary_color"
                                            value="${this.clientData.primary_color || '#3b82f6'}"
                                            class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                                    <div class="flex space-x-2">
                                        <input
                                            type="color"
                                            id="secondary_color_picker"
                                            value="${this.clientData.secondary_color || '#8b5cf6'}"
                                            class="w-12 h-10 rounded border border-slate-600"
                                        />
                                        <input
                                            type="text"
                                            id="secondary_color"
                                            value="${this.clientData.secondary_color || '#8b5cf6'}"
                                            class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Images -->
                        <div class="border-t border-slate-700 pt-6">
                            <h4 class="text-lg font-medium text-white mb-4">Imagens</h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">URL do Logo</label>
                                    <input
                                        type="url"
                                        id="logo_url"
                                        value="${this.clientData.logo_url || ''}"
                                        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                        placeholder="https://exemplo.com/logo.png"
                                    />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">URL do Favicon</label>
                                    <input
                                        type="url"
                                        id="favicon_url"
                                        value="${this.clientData.favicon_url || ''}"
                                        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                        placeholder="https://exemplo.com/favicon.ico"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <button
                                type="submit"
                                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Salvar Configurações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('tabContent').innerHTML = content;
        this.setupSettingsForm();
        lucide.createIcons();
    }

    async loadAnalyticsTab() {
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            const content = `
                <div class="space-y-6">
                    <!-- Analytics Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                    <p class="text-2xl font-bold text-white">${(analytics.daily_requests || []).length}</p>
                                    <p class="text-sm text-slate-400">Dias Ativos</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Chart -->
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 class="text-lg font-semibold text-white mb-4">Solicitações dos Últimos 30 Dias</h3>
                        <div class="h-64 flex items-end space-x-2">
                            ${this.renderChart(analytics.daily_requests || [])}
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('tabContent').innerHTML = content;
            lucide.createIcons();

        } catch (error) {
            console.error('Erro ao carregar analytics:', error);
            this.showError('Erro ao carregar analytics');
        }
    }

    renderChart(dailyData) {
        if (!dailyData || dailyData.length === 0) {
            return '<div class="flex items-center justify-center w-full h-full text-slate-400">Sem dados para exibir</div>';
        }

        const maxCount = Math.max(...dailyData.map(d => d.count));
        
        return dailyData.map(day => {
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            return `
                <div class="flex-1 flex flex-col items-center">
                    <div 
                        class="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-500"
                        style="height: ${height}%"
                        title="${day.date}: ${day.count} solicitações"
                    ></div>
                    <span class="text-xs text-slate-400 mt-2 transform rotate-45 origin-left">
                        ${new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                </div>
            `;
        }).join('');
    }

    setupRequestFilters() {
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        const searchFilter = document.getElementById('searchFilter');

        [statusFilter, typeFilter, searchFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.filterRequests());
                filter.addEventListener('input', () => this.filterRequests());
            }
        });
    }

    async filterRequests() {
        const status = document.getElementById('statusFilter')?.value || '';
        const type = document.getElementById('typeFilter')?.value || '';
        const search = document.getElementById('searchFilter')?.value || '';

        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (type) params.append('content_type', type);
        if (search) params.append('search', search);

        try {
            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = await response.json();
            
            // Update table body
            const tbody = document.getElementById('requestsTableBody');
            if (tbody) {
                tbody.innerHTML = requests.length > 0 ? requests.map(request => `
                    <tr class="hover:bg-slate-700/30 transition-colors">
                        <td class="px-4 py-3">
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
                        <td class="px-4 py-3">
                            <p class="text-white">${request.requester_name}</p>
                            <p class="text-sm text-slate-400">${this.formatWhatsApp(request.requester_whatsapp)}</p>
                        </td>
                        <td class="px-4 py-3">
                            <span class="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                request.content_type === 'movie' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'
                            }">
                                <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-3 w-3"></i>
                                <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                ${this.getStatusText(request.status)}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-slate-400">
                            ${new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td class="px-4 py-3">
                            <button
                                onclick="clientDashboard.openRequestModal(${request.id})"
                                class="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                Ver Detalhes
                            </button>
                        </td>
                    </tr>
                `).join('') : `
                    <tr>
                        <td colspan="6" class="px-4 py-8 text-center">
                            <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                            <p class="text-slate-400">Nenhuma solicitação encontrada</p>
                        </td>
                    </tr>
                `;
                
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Erro ao filtrar solicitações:', error);
        }
    }

    setupSettingsForm() {
        const form = document.getElementById('settingsForm');
        if (!form) return;

        // Sync color pickers
        const primaryPicker = document.getElementById('primary_color_picker');
        const primaryInput = document.getElementById('primary_color');
        const secondaryPicker = document.getElementById('secondary_color_picker');
        const secondaryInput = document.getElementById('secondary_color');

        if (primaryPicker && primaryInput) {
            primaryPicker.addEventListener('change', (e) => {
                primaryInput.value = e.target.value;
            });
            primaryInput.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    primaryPicker.value = e.target.value;
                }
            });
        }

        if (secondaryPicker && secondaryInput) {
            secondaryPicker.addEventListener('change', (e) => {
                secondaryInput.value = e.target.value;
            });
            secondaryInput.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    secondaryPicker.value = e.target.value;
                }
            });
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveSettings();
        });
    }

    async saveSettings() {
        const formData = {
            name: document.getElementById('name')?.value || '',
            site_name: document.getElementById('site_name')?.value || '',
            site_tagline: document.getElementById('site_tagline')?.value || '',
            site_description: document.getElementById('site_description')?.value || '',
            hero_title: document.getElementById('hero_title')?.value || '',
            hero_subtitle: document.getElementById('hero_subtitle')?.value || '',
            hero_description: document.getElementById('hero_description')?.value || '',
            contact_email: document.getElementById('contact_email')?.value || '',
            contact_whatsapp: document.getElementById('contact_whatsapp')?.value || '',
            primary_color: document.getElementById('primary_color')?.value || '',
            secondary_color: document.getElementById('secondary_color')?.value || '',
            logo_url: document.getElementById('logo_url')?.value || '',
            favicon_url: document.getElementById('favicon_url')?.value || ''
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
                window.CLIENT_DATA = this.clientData;
            } else {
                throw new Error(result.error || 'Erro ao salvar configurações');
            }
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            this.showToast(error.message, 'error');
        }
    }

    async openRequestModal(requestId) {
        try {
            // Get request details
            const response = await fetch(`/api/client-requests.php/${requestId}`);
            const request = await response.json();

            if (!response.ok) {
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
                console.warn('Erro ao carregar dados do TMDB:', error);
            }

            this.renderRequestModal(request, tmdbData);

        } catch (error) {
            console.error('Erro ao abrir modal:', error);
            this.showToast(error.message, 'error');
        }
    }

    renderRequestModal(request, tmdbData) {
        const modal = document.getElementById('requestModal');
        const title = request.content_title;
        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w400${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        // Extract additional info from TMDB data
        const releaseDate = tmdbData?.release_date || tmdbData?.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
        const rating = tmdbData?.vote_average ? tmdbData.vote_average.toFixed(1) : 'N/A';
        const genres = tmdbData?.genres || [];
        const overview = tmdbData?.overview || 'Sinopse não disponível.';
        const runtime = tmdbData?.runtime;
        const seasons = tmdbData?.number_of_seasons;
        const episodes = tmdbData?.number_of_episodes;
        const status = tmdbData?.status;
        const originalLanguage = tmdbData?.original_language;
        const productionCountries = tmdbData?.production_countries || [];
        const productionCompanies = tmdbData?.production_companies || [];
        const cast = tmdbData?.credits?.cast || [];
        const trailer = tmdbData?.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="file-text" class="h-6 w-6 text-blue-400"></i>
                        <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação #${request.id}</h2>
                    </div>
                    <button
                        onclick="document.getElementById('requestModal').classList.add('hidden')"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <div class="p-6">
                    <div class="grid lg:grid-cols-3 gap-8">
                        <!-- Main Content -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Content Info -->
                            <div class="flex gap-6">
                                <div class="flex-shrink-0">
                                    <img
                                        src="${posterUrl}"
                                        alt="${title}"
                                        class="w-32 h-48 object-cover rounded-lg border border-slate-700"
                                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                    />
                                </div>
                                <div class="flex-1 space-y-4">
                                    <div>
                                        <h3 class="text-2xl font-bold text-white mb-2">${title}</h3>
                                        <div class="flex flex-wrap gap-4 text-sm text-slate-400">
                                            <div class="flex items-center space-x-1">
                                                <i data-lucide="calendar" class="h-4 w-4"></i>
                                                <span>${year}</span>
                                            </div>
                                            <div class="flex items-center space-x-1">
                                                <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                                <span>${rating}/10</span>
                                            </div>
                                            ${runtime ? `
                                                <div class="flex items-center space-x-1">
                                                    <i data-lucide="clock" class="h-4 w-4"></i>
                                                    <span>${runtime}min</span>
                                                </div>
                                            ` : ''}
                                            ${seasons ? `
                                                <div class="flex items-center space-x-1">
                                                    <i data-lucide="tv" class="h-4 w-4"></i>
                                                    <span>${seasons} temporada(s)</span>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>

                                    ${overview !== 'Sinopse não disponível.' ? `
                                        <div>
                                            <h4 class="font-semibold text-white mb-2">Sinopse</h4>
                                            <p class="text-slate-300 text-sm leading-relaxed">${overview}</p>
                                        </div>
                                    ` : ''}

                                    ${genres.length > 0 ? `
                                        <div>
                                            <h4 class="font-semibold text-white mb-2">Gêneros</h4>
                                            <div class="flex flex-wrap gap-2">
                                                ${genres.map(genre => `
                                                    <span class="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                                                        ${genre.name}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Additional Info -->
                            <div class="grid md:grid-cols-2 gap-6">
                                ${productionCompanies.length > 0 ? `
                                    <div>
                                        <h4 class="font-semibold text-white mb-3">Produtoras</h4>
                                        <div class="space-y-2">
                                            ${productionCompanies.slice(0, 3).map(company => `
                                                <p class="text-sm text-slate-300">${company.name}</p>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}

                                ${productionCountries.length > 0 ? `
                                    <div>
                                        <h4 class="font-semibold text-white mb-3">Países</h4>
                                        <div class="space-y-2">
                                            ${productionCountries.map(country => `
                                                <p class="text-sm text-slate-300">${country.name}</p>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>

                            <!-- Cast -->
                            ${cast.length > 0 ? `
                                <div>
                                    <h4 class="font-semibold text-white mb-4">Elenco Principal</h4>
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
                                                <p class="text-xs font-medium text-white">${actor.name}</p>
                                                <p class="text-xs text-slate-400">${actor.character}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Trailer -->
                            ${trailer ? `
                                <div>
                                    <h4 class="font-semibold text-white mb-4">Trailer</h4>
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

                        <!-- Sidebar -->
                        <div class="space-y-6">
                            <!-- Request Info -->
                            <div class="bg-slate-700/30 rounded-lg p-4">
                                <h4 class="font-semibold text-white mb-4">Informações da Solicitação</h4>
                                <div class="space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">ID:</span>
                                        <span class="text-white">#${request.id}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Tipo:</span>
                                        <span class="text-white">${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Status:</span>
                                        <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                            ${this.getStatusText(request.status)}
                                        </span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Solicitado em:</span>
                                        <span class="text-white">${new Date(request.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
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
                                </div>
                            </div>

                            <!-- Requester Info -->
                            <div class="bg-slate-700/30 rounded-lg p-4">
                                <h4 class="font-semibold text-white mb-4">Dados do Solicitante</h4>
                                <div class="space-y-3 text-sm">
                                    <div>
                                        <span class="text-slate-400">Nome:</span>
                                        <p class="text-white font-medium">${request.requester_name}</p>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">WhatsApp:</span>
                                        <p class="text-white font-medium">${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="space-y-3">
                                ${request.status === 'pending' ? `
                                    <button
                                        onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')"
                                        class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        <i data-lucide="check" class="h-5 w-5"></i>
                                        <span>Aprovar Solicitação</span>
                                    </button>
                                    
                                    <button
                                        onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')"
                                        class="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        <i data-lucide="x" class="h-5 w-5"></i>
                                        <span>Negar Solicitação</span>
                                    </button>
                                ` : ''}
                                
                                <a
                                    href="https://wa.me/${request.requester_whatsapp}?text=${encodeURIComponent(`Olá ${request.requester_name}! Sobre sua solicitação de "${title}": `)}"
                                    target="_blank"
                                    class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
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
                body: JSON.stringify({ id: requestId, status: status })
            });

            const result = await response.json();

            if (response.ok) {
                this.showToast(`Solicitação ${status === 'approved' ? 'aprovada' : 'negada'} com sucesso!`, 'success');
                document.getElementById('requestModal').classList.add('hidden');
                
                // Reload current tab if it's requests
                if (this.currentTab === 'requests') {
                    this.loadRequestsTab();
                }
            } else {
                throw new Error(result.error || 'Erro ao atualizar status');
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            this.showToast(error.message, 'error');
        }
    }

    formatWhatsApp(whatsapp) {
        if (!whatsapp) return '';
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length === 13) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
        }
        return `+${cleaned}`;
    }

    getStatusClass(status) {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'approved': return 'status-approved';
            case 'denied': return 'status-denied';
            default: return 'bg-slate-600/20 text-slate-400';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'approved': return 'Aprovada';
            case 'denied': return 'Negada';
            default: return status;
        }
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

// Initialize the app
let clientDashboard;
document.addEventListener('DOMContentLoaded', () => {
    try {
        clientDashboard = new ClientDashboardApp();
        console.log('ClientDashboardApp inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar ClientDashboardApp:', error);
    }
});