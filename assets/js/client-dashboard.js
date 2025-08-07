class ClientDashboardApp {
    constructor() {
        this.clientData = window.CLIENT_DATA || {};
        this.tmdbImageBaseUrl = window.TMDB_IMAGE_BASE_URL || '';
        this.tmdbApiKey = window.TMDB_API_KEY || '';
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        console.log('Inicializando ClientDashboardApp...', this.clientData);
        this.setupTabNavigation();
        this.loadOverviewData();
        this.setupEventListeners();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.add('hidden'));
                
                // Add active class to clicked button and show corresponding content
                button.classList.add('active');
                const targetContent = document.getElementById(`${tabId}-tab`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
                
                this.currentTab = tabId;
                this.handleTabChange(tabId);
            });
        });
    }

    handleTabChange(tabId) {
        console.log('Mudando para aba:', tabId);
        
        switch (tabId) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'requests':
                this.loadRequestsData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
        }
    }

    setupEventListeners() {
        // Settings form
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }

        // Request filters
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        const searchFilter = document.getElementById('searchFilter');

        if (statusFilter) statusFilter.addEventListener('change', () => this.loadRequestsData());
        if (typeFilter) typeFilter.addEventListener('change', () => this.loadRequestsData());
        if (searchFilter) {
            let timeout;
            searchFilter.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.loadRequestsData(), 500);
            });
        }
    }

    async loadOverviewData() {
        console.log('Carregando dados da visão geral...');
        
        try {
            const response = await fetch('/api/client-requests.php/stats');
            const stats = await response.json();

            console.log('Stats recebidas:', stats);

            if (response.ok) {
                document.getElementById('totalRequests').textContent = stats.total || '0';
                document.getElementById('pendingRequests').textContent = stats.pending || '0';
                document.getElementById('approvedRequests').textContent = stats.approved || '0';
                document.getElementById('deniedRequests').textContent = stats.denied || '0';
            } else {
                console.error('Erro ao carregar stats:', stats.error);
                this.showError('Erro ao carregar estatísticas');
            }
        } catch (error) {
            console.error('Erro na requisição de stats:', error);
            this.showError('Erro de conexão ao carregar estatísticas');
        }
    }

    async loadRequestsData() {
        console.log('Carregando dados das solicitações...');
        
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const searchFilter = document.getElementById('searchFilter')?.value || '';

        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('content_type', typeFilter);
        if (searchFilter) params.append('search', searchFilter);

        try {
            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = await response.json();

            console.log('Solicitações recebidas:', requests);

            if (response.ok) {
                this.renderRequests(requests);
            } else {
                console.error('Erro ao carregar solicitações:', requests.error);
                this.showError('Erro ao carregar solicitações');
            }
        } catch (error) {
            console.error('Erro na requisição de solicitações:', error);
            this.showError('Erro de conexão ao carregar solicitações');
        }
    }

    renderRequests(requests) {
        const container = document.getElementById('requestsList');
        if (!container) return;

        if (requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação encontrada</h3>
                    <p class="text-slate-500">Não há solicitações que correspondam aos filtros selecionados.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = `
            <div class="space-y-4">
                ${requests.map(request => this.getRequestHTML(request)).join('')}
            </div>
        `;

        lucide.createIcons();
    }

    getRequestHTML(request) {
        const statusColors = {
            'pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            'approved': 'bg-green-500/10 text-green-400 border-green-500/20',
            'denied': 'bg-red-500/10 text-red-400 border-red-500/20'
        };

        const statusLabels = {
            'pending': 'Pendente',
            'approved': 'Aprovada',
            'denied': 'Negada'
        };

        const typeLabels = {
            'movie': 'Filme',
            'tv': 'Série'
        };

        const posterUrl = request.poster_path ? 
            `${this.tmdbImageBaseUrl}/w200${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                <div class="flex items-start space-x-4">
                    <img
                        src="${posterUrl}"
                        alt="${request.content_title}"
                        class="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                    />
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-2">
                            <h3 class="text-lg font-semibold text-white truncate">${request.content_title}</h3>
                            <span class="px-3 py-1 rounded-full text-sm font-medium border ${statusColors[request.status]}">
                                ${statusLabels[request.status]}
                            </span>
                        </div>
                        
                        <div class="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                            <div class="flex items-center space-x-1">
                                <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                <span>${typeLabels[request.content_type]}</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <i data-lucide="user" class="h-4 w-4"></i>
                                <span>${request.requester_name}</span>
                            </div>
                            <div class="flex items-center space-x-1">
                                <i data-lucide="calendar" class="h-4 w-4"></i>
                                <span>${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            ${request.season ? `
                                <div class="flex items-center space-x-1">
                                    <i data-lucide="layers" class="h-4 w-4"></i>
                                    <span>T${request.season}${request.episode ? `E${request.episode}` : ''}</span>
                                </div>
                            ` : ''}
                        </div>

                        <div class="flex items-center space-x-2">
                            <button
                                onclick="viewRequestDetails(${request.id})"
                                class="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                                <i data-lucide="eye" class="h-4 w-4"></i>
                                <span>Ver Detalhes</span>
                            </button>
                            
                            ${request.status === 'pending' ? `
                                <button
                                    onclick="updateRequestStatus(${request.id}, 'approved')"
                                    class="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    <i data-lucide="check" class="h-4 w-4"></i>
                                    <span>Aprovar</span>
                                </button>
                                <button
                                    onclick="updateRequestStatus(${request.id}, 'denied')"
                                    class="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    <i data-lucide="x" class="h-4 w-4"></i>
                                    <span>Negar</span>
                                </button>
                            ` : ''}
                            
                            <a
                                href="https://wa.me/${request.requester_whatsapp}?text=${encodeURIComponent(`Olá ${request.requester_name}, sobre sua solicitação de '${request.content_title}'...`)}"
                                target="_blank"
                                class="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                                <i data-lucide="message-square" class="h-4 w-4"></i>
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadSettingsData() {
        console.log('Carregando configurações...');
        
        // Preencher formulário com dados atuais do cliente
        if (this.clientData) {
            document.getElementById('companyName').value = this.clientData.name || '';
            document.getElementById('siteName').value = this.clientData.site_name || '';
            document.getElementById('siteTagline').value = this.clientData.site_tagline || '';
            document.getElementById('siteDescription').value = this.clientData.site_description || '';
            document.getElementById('heroTitle').value = this.clientData.hero_title || '';
            document.getElementById('heroSubtitle').value = this.clientData.hero_subtitle || '';
            document.getElementById('heroDescription').value = this.clientData.hero_description || '';
            document.getElementById('contactEmail').value = this.clientData.contact_email || '';
            document.getElementById('contactWhatsapp').value = this.clientData.contact_whatsapp || '';
            document.getElementById('primaryColor').value = this.clientData.primary_color || '#3b82f6';
            document.getElementById('secondaryColor').value = this.clientData.secondary_color || '#8b5cf6';
        }
    }

    async saveSettings() {
        console.log('Salvando configurações...');
        
        const formData = {
            name: document.getElementById('companyName').value,
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
            logo_url: this.clientData.logo_url || '',
            favicon_url: this.clientData.favicon_url || ''
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
                // Atualizar dados locais
                Object.assign(this.clientData, formData);
                // Atualizar cores CSS
                this.updateCSSColors();
            } else {
                throw new Error(result.error || 'Erro ao salvar configurações');
            }
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            this.showToast(error.message, 'error');
        }
    }

    updateCSSColors() {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', this.clientData.primary_color);
        root.style.setProperty('--secondary-color', this.clientData.secondary_color);
    }

    async loadAnalyticsData() {
        console.log('Carregando analytics...');
        
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            console.log('Analytics recebidas:', analytics);

            if (response.ok) {
                document.getElementById('approvalRate').textContent = `${analytics.approval_rate}%`;
                document.getElementById('dailyAverage').textContent = `${analytics.daily_average} por dia`;
                document.getElementById('mostRequestedType').textContent = analytics.most_requested_type;
                
                // Renderizar gráfico simples (placeholder)
                this.renderSimpleChart(analytics.daily_requests);
            } else {
                console.error('Erro ao carregar analytics:', analytics.error);
                this.showError('Erro ao carregar analytics');
            }
        } catch (error) {
            console.error('Erro na requisição de analytics:', error);
            this.showError('Erro de conexão ao carregar analytics');
        }
    }

    renderSimpleChart(dailyData) {
        const chartContainer = document.getElementById('dailyChart');
        if (!chartContainer || !dailyData || dailyData.length === 0) {
            chartContainer.innerHTML = '<p class="text-slate-400">Dados insuficientes para gráfico</p>';
            return;
        }

        // Gráfico simples com barras CSS
        const maxValue = Math.max(...dailyData.map(d => d.count));
        
        chartContainer.innerHTML = `
            <div class="space-y-2">
                ${dailyData.slice(-7).map(day => `
                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-slate-400 w-16">${new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                        <div class="flex-1 bg-slate-700 rounded-full h-4 relative">
                            <div 
                                class="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                                style="width: ${maxValue > 0 ? (day.count / maxValue) * 100 : 0}%"
                            ></div>
                        </div>
                        <span class="text-xs text-white w-8">${day.count}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async showRequestDetailsModal(requestId) {
        console.log('Carregando detalhes da solicitação:', requestId);
        
        try {
            const response = await fetch(`/api/client-requests.php/${requestId}`);
            const request = await response.json();

            if (!response.ok) {
                throw new Error(request.error || 'Erro ao carregar solicitação');
            }

            console.log('Dados da solicitação:', request);

            // Buscar dados do TMDB
            let tmdbData = null;
            try {
                const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
                if (tmdbResponse.ok) {
                    tmdbData = await tmdbResponse.json();
                    console.log('Dados do TMDB:', tmdbData);
                }
            } catch (error) {
                console.warn('Erro ao buscar dados do TMDB:', error);
            }

            this.renderRequestDetailsModal(request, tmdbData);

        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            this.showToast(error.message, 'error');
        }
    }

    renderRequestDetailsModal(request, tmdbData) {
        const modal = document.getElementById('requestDetailsModal');
        const title = request.content_title;
        const typeLabel = request.content_type === 'movie' ? 'Filme' : 'Série';
        
        // URLs de imagem
        const posterUrl = request.poster_path ? 
            `${this.tmdbImageBaseUrl}/w400${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';
            
        const backdropUrl = tmdbData?.backdrop_path ? 
            `${this.tmdbImageBaseUrl}/original${tmdbData.backdrop_path}` : '';

        // Status
        const statusColors = {
            'pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            'approved': 'bg-green-500/10 text-green-400 border-green-500/20',
            'denied': 'bg-red-500/10 text-red-400 border-red-500/20'
        };

        const statusLabels = {
            'pending': 'Pendente',
            'approved': 'Aprovada',
            'denied': 'Negada'
        };

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header com backdrop -->
                <div class="relative">
                    ${backdropUrl ? `
                        <div 
                            class="h-48 bg-cover bg-center bg-no-repeat rounded-t-xl"
                            style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backdropUrl})"
                        ></div>
                    ` : `
                        <div class="h-48 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-t-xl"></div>
                    `}
                    
                    <button
                        id="closeModal"
                        class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                    
                    <div class="absolute bottom-4 left-6 right-6">
                        <div class="flex items-end space-x-6">
                            <img
                                src="${posterUrl}"
                                alt="${title}"
                                class="w-32 h-48 object-cover rounded-lg shadow-xl border-2 border-slate-600"
                                onerror="this.src='/assets/images/placeholder-poster.jpg'"
                            />
                            <div class="flex-1 pb-2">
                                <h2 class="text-3xl font-bold text-white mb-2">${title}</h2>
                                <div class="flex items-center space-x-4 text-slate-300">
                                    <span class="px-3 py-1 rounded-full text-sm font-medium border ${statusColors[request.status]}">
                                        ${statusLabels[request.status]}
                                    </span>
                                    <span class="flex items-center space-x-1">
                                        <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                        <span>${typeLabel}</span>
                                    </span>
                                    ${tmdbData?.vote_average ? `
                                        <span class="flex items-center space-x-1">
                                            <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                            <span>${tmdbData.vote_average.toFixed(1)}/10</span>
                                        </span>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6">
                    <div class="grid lg:grid-cols-3 gap-8">
                        <!-- Coluna principal -->
                        <div class="lg:col-span-2 space-y-6">
                            ${tmdbData ? this.getTmdbInfoSection(tmdbData, request) : this.getBasicInfoSection(request)}
                            ${tmdbData?.overview ? `
                                <div>
                                    <h3 class="text-xl font-semibold text-white mb-3">Sinopse</h3>
                                    <p class="text-slate-300 leading-relaxed">${tmdbData.overview}</p>
                                </div>
                            ` : ''}
                            ${tmdbData?.genres ? this.getGenresSection(tmdbData.genres) : ''}
                            ${tmdbData?.credits?.cast ? this.getCastSection(tmdbData.credits.cast) : ''}
                        </div>

                        <!-- Sidebar -->
                        <div class="space-y-6">
                            ${this.getRequestInfoSection(request)}
                            ${this.getActionsSection(request, tmdbData)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        this.setupModalEventListeners(request);
        lucide.createIcons();
    }

    getTmdbInfoSection(tmdbData, request) {
        const releaseDate = tmdbData.release_date || tmdbData.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
        
        return `
            <div>
                <h3 class="text-xl font-semibold text-white mb-4">Informações do TMDB</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                        <i data-lucide="star" class="h-8 w-8 text-yellow-400 mx-auto mb-2"></i>
                        <div class="text-2xl font-bold text-white">${tmdbData.vote_average?.toFixed(1) || 'N/A'}</div>
                        <div class="text-sm text-slate-400">Avaliação</div>
                        ${tmdbData.vote_count ? `<div class="text-xs text-slate-500">${tmdbData.vote_count.toLocaleString()} votos</div>` : ''}
                    </div>
                    
                    <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                        <i data-lucide="calendar" class="h-8 w-8 text-blue-400 mx-auto mb-2"></i>
                        <div class="text-2xl font-bold text-white">${year}</div>
                        <div class="text-sm text-slate-400">Ano</div>
                    </div>
                    
                    ${request.content_type === 'movie' && tmdbData.runtime ? `
                        <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                            <i data-lucide="clock" class="h-8 w-8 text-green-400 mx-auto mb-2"></i>
                            <div class="text-2xl font-bold text-white">${Math.floor(tmdbData.runtime / 60)}h ${tmdbData.runtime % 60}min</div>
                            <div class="text-sm text-slate-400">Duração</div>
                        </div>
                    ` : ''}
                    
                    ${request.content_type === 'tv' && tmdbData.number_of_seasons ? `
                        <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                            <i data-lucide="tv" class="h-8 w-8 text-purple-400 mx-auto mb-2"></i>
                            <div class="text-2xl font-bold text-white">${tmdbData.number_of_seasons}</div>
                            <div class="text-sm text-slate-400">Temporadas</div>
                        </div>
                        
                        <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                            <i data-lucide="play-circle" class="h-8 w-8 text-orange-400 mx-auto mb-2"></i>
                            <div class="text-2xl font-bold text-white">${tmdbData.number_of_episodes || 'N/A'}</div>
                            <div class="text-sm text-slate-400">Episódios</div>
                        </div>
                    ` : ''}
                    
                    <div class="bg-slate-700/30 rounded-lg p-4 text-center">
                        <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-8 w-8 text-indigo-400 mx-auto mb-2"></i>
                        <div class="text-lg font-bold text-white">${request.content_type === 'movie' ? 'Filme' : 'Série'}</div>
                        <div class="text-sm text-slate-400">Tipo</div>
                    </div>
                </div>
            </div>
        `;
    }

    getBasicInfoSection(request) {
        return `
            <div class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="alert-triangle" class="h-5 w-5 text-amber-400"></i>
                    <p class="text-amber-300 font-medium">Informações limitadas</p>
                </div>
                <p class="text-amber-200/80 text-sm">
                    Não foi possível carregar informações detalhadas do TMDB para este conteúdo.
                </p>
            </div>
        `;
    }

    getGenresSection(genres) {
        if (!genres || genres.length === 0) return '';
        
        return `
            <div>
                <h3 class="text-xl font-semibold text-white mb-3">Gêneros</h3>
                <div class="flex flex-wrap gap-2">
                    ${genres.map(genre => `
                        <span class="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm">
                            ${genre.name}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getCastSection(cast) {
        if (!cast || cast.length === 0) return '';
        
        return `
            <div>
                <h3 class="text-xl font-semibold text-white mb-4">Elenco Principal</h3>
                <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    ${cast.slice(0, 12).map(actor => `
                        <div class="text-center">
                            <img
                                src="${actor.profile_path ? `${this.tmdbImageBaseUrl}/w200${actor.profile_path}` : '/assets/images/placeholder-person.jpg'}"
                                alt="${actor.name}"
                                class="w-full h-20 object-cover rounded-lg mb-2"
                                onerror="this.src='/assets/images/placeholder-person.jpg'"
                            />
                            <p class="text-white font-medium text-xs truncate">${actor.name}</p>
                            <p class="text-slate-400 text-xs truncate">${actor.character}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getRequestInfoSection(request) {
        return `
            <div class="bg-slate-700/20 rounded-lg p-4">
                <h4 class="text-lg font-semibold text-white mb-3">Informações da Solicitação</h4>
                <div class="space-y-2 text-sm">
                    <div>
                        <span class="text-slate-400">Solicitante:</span>
                        <span class="text-white ml-2">${request.requester_name}</span>
                    </div>
                    <div>
                        <span class="text-slate-400">Data:</span>
                        <span class="text-white ml-2">${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                        <span class="text-slate-400">WhatsApp:</span>
                        <span class="text-white ml-2">+${request.requester_whatsapp}</span>
                    </div>
                    <div>
                        <span class="text-slate-400">Tipo:</span>
                        <span class="text-white ml-2">${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                    </div>
                    <div>
                        <span class="text-slate-400">ID TMDB:</span>
                        <span class="text-white ml-2">${request.content_id}</span>
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
        `;
    }

    getActionsSection(request, tmdbData) {
        const trailer = tmdbData?.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        return `
            <div class="space-y-3">
                ${request.status === 'pending' ? `
                    <button
                        onclick="updateRequestStatus(${request.id}, 'approved')"
                        class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                        <i data-lucide="check" class="h-5 w-5"></i>
                        <span>Aprovar Solicitação</span>
                    </button>
                    
                    <button
                        onclick="updateRequestStatus(${request.id}, 'denied')"
                        class="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                        <i data-lucide="x" class="h-5 w-5"></i>
                        <span>Negar Solicitação</span>
                    </button>
                ` : ''}
                
                <a
                    href="https://wa.me/${request.requester_whatsapp}?text=${encodeURIComponent(`Olá ${request.requester_name}, sobre sua solicitação de '${request.content_title}'...`)}"
                    target="_blank"
                    class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                    <i data-lucide="message-square" class="h-5 w-5"></i>
                    <span>Contatar via WhatsApp</span>
                </a>
                
                ${trailer ? `
                    <a
                        href="https://www.youtube.com/watch?v=${trailer.key}"
                        target="_blank"
                        class="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                        <i data-lucide="play" class="h-5 w-5"></i>
                        <span>Assistir Trailer</span>
                    </a>
                ` : ''}
                
                <a
                    href="https://www.themoviedb.org/${request.content_type}/${request.content_id}"
                    target="_blank"
                    class="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                    <i data-lucide="external-link" class="h-5 w-5"></i>
                    <span>Ver no TMDB</span>
                </a>
            </div>
        `;
    }

    setupModalEventListeners(request) {
        const modal = document.getElementById('requestDetailsModal');
        const closeBtn = document.getElementById('closeModal');

        const closeModal = () => {
            modal.classList.add('hidden');
        };

        closeBtn.addEventListener('click', closeModal);
        
        // Fechar ao clicar fora do modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    async updateRequestStatus(requestId, status) {
        console.log(`Atualizando status da solicitação ${requestId} para ${status}`);
        
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
                this.showToast(result.message, 'success');
                // Recarregar dados
                if (this.currentTab === 'requests') {
                    this.loadRequestsData();
                }
                if (this.currentTab === 'overview') {
                    this.loadOverviewData();
                }
                // Fechar modal
                document.getElementById('requestDetailsModal').classList.add('hidden');
            } else {
                throw new Error(result.error || 'Erro ao atualizar status');
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
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

    showError(message) {
        console.error('Erro:', message);
        this.showToast(message, 'error');
    }
}

// Funções globais para os botões
window.viewRequestDetails = function(requestId) {
    window.clientDashboardApp.showRequestDetailsModal(requestId);
};

window.updateRequestStatus = function(requestId, status) {
    window.clientDashboardApp.updateRequestStatus(requestId, status);
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando ClientDashboardApp...');
    window.clientDashboardApp = new ClientDashboardApp();
});