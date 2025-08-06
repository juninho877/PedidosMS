class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOverviewData();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Customization form
        this.setupCustomizationForm();
        
        // Request filters
        this.setupRequestFilters();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === tabName;
            if (isActive) {
                btn.className = 'tab-btn py-4 px-2 border-b-2 font-medium text-sm transition-colors bg-primary text-white border-primary';
            } else {
                btn.className = 'tab-btn py-4 px-2 border-b-2 border-transparent font-medium text-sm transition-colors text-slate-400 hover:text-white hover:border-slate-400';
            }
        });

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Show selected tab content
        const selectedTab = document.getElementById(tabName + 'Tab');
        if (selectedTab) {
            selectedTab.classList.remove('hidden');
        }

        this.currentTab = tabName;

        // Load tab-specific data
        switch (tabName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'requests':
                this.loadRequestsData();
                break;
            case 'customization':
                this.setupCustomizationPreview();
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
        }
    }

    async loadOverviewData() {
        try {
            const response = await fetch('/api/client-requests.php/stats');
            const stats = await response.json();

            if (response.ok) {
                document.getElementById('totalRequests').textContent = stats.total || 0;
                document.getElementById('pendingRequests').textContent = stats.pending || 0;
                document.getElementById('approvedRequests').textContent = stats.approved || 0;
                document.getElementById('deniedRequests').textContent = stats.denied || 0;
            }
        } catch (error) {
            console.error('Error loading overview data:', error);
        }
    }

    async loadRequestsData() {
        try {
            const statusFilter = document.getElementById('requestStatusFilter')?.value || '';
            const typeFilter = document.getElementById('requestTypeFilter')?.value || '';
            
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (typeFilter) params.append('content_type', typeFilter);

            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = await response.json();

            if (response.ok) {
                this.renderRequestsList(requests);
            } else {
                this.showToast(requests.error || 'Erro ao carregar solicitações', 'error');
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            this.showToast('Erro de conexão', 'error');
        }
    }

    renderRequestsList(requests) {
        const container = document.getElementById('clientRequestsList');
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação encontrada</h3>
                    <p class="text-slate-500">Quando seus usuários fizerem solicitações, elas aparecerão aqui.</p>
                </div>
            `;
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

        container.innerHTML = `
            <div class="space-y-4">
                ${requests.map(request => `
                    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                        <div class="flex items-start gap-4">
                            <img
                                src="${request.poster_path ? `https://image.tmdb.org/t/p/w92${request.poster_path}` : '/assets/images/placeholder-poster.jpg'}"
                                alt="${request.content_title}"
                                class="w-12 h-18 object-cover rounded-lg flex-shrink-0"
                                onerror="this.src='/assets/images/placeholder-poster.jpg'"
                            />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 class="text-lg font-semibold text-white">${request.content_title}</h3>
                                        <div class="flex items-center space-x-4 text-sm text-slate-400 mt-1">
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
                                    <span class="px-3 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}">
                                        ${statusLabels[request.status]}
                                    </span>
                                </div>
                                
                                <div class="flex items-center justify-between mt-4">
                                    <div class="flex items-center space-x-2 text-sm text-slate-400">
                                        <a 
                                            href="https://wa.me/${request.requester_whatsapp}" 
                                            target="_blank"
                                            class="flex items-center space-x-1 text-green-400 hover:text-green-300 transition-colors"
                                        >
                                            <i data-lucide="message-circle" class="h-4 w-4"></i>
                                            <span>+${this.formatWhatsApp(request.requester_whatsapp)}</span>
                                        </a>
                                        ${request.season ? `
                                            <span class="flex items-center space-x-1">
                                                <i data-lucide="layers" class="h-4 w-4"></i>
                                                <span>T${request.season}${request.episode ? `E${request.episode}` : ''}</span>
                                            </span>
                                        ` : ''}
                                    </div>
                                    
                                    <div class="flex items-center space-x-2">
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
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
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
                body: JSON.stringify({ id: requestId, status: status })
            });

            const result = await response.json();

            if (response.ok) {
                this.showToast(`Solicitação ${status === 'approved' ? 'aprovada' : 'negada'} com sucesso!`, 'success');
                this.loadRequestsData(); // Reload the list
                this.loadOverviewData(); // Update stats
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

    setupRequestFilters() {
        const statusFilter = document.getElementById('requestStatusFilter');
        const typeFilter = document.getElementById('requestTypeFilter');

        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                if (this.currentTab === 'requests') {
                    this.loadRequestsData();
                }
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                if (this.currentTab === 'requests') {
                    this.loadRequestsData();
                }
            });
        }
    }

    setupCustomizationForm() {
        // Color pickers sync
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

        // Text inputs for preview
        const textInputs = ['companyName', 'siteName', 'siteTagline', 'heroTitle', 'heroSubtitle', 'heroDescription'];
        textInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.updatePreview());
            }
        });

        // File uploads
        this.setupFileUploads();

        // Save button
        const saveBtn = document.getElementById('saveCustomization');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCustomization());
        }
    }

    setupFileUploads() {
        // Logo upload
        const logoInput = document.getElementById('logoInput');
        const removeLogo = document.getElementById('removeLogo');

        if (logoInput) {
            logoInput.addEventListener('change', (e) => this.handleFileUpload(e, 'logo'));
        }

        if (removeLogo) {
            removeLogo.addEventListener('click', () => this.removeImage('logo'));
        }

        // Favicon upload
        const faviconInput = document.getElementById('faviconInput');
        const removeFavicon = document.getElementById('removeFavicon');

        if (faviconInput) {
            faviconInput.addEventListener('change', (e) => this.handleFileUpload(e, 'favicon'));
        }

        if (removeFavicon) {
            removeFavicon.addEventListener('click', () => this.removeImage('favicon'));
        }
    }

    async handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('tenant_id', this.clientData.id);

        try {
            const response = await fetch('/admin/upload.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                // Update preview
                const previewImg = document.getElementById(type + 'Preview');
                const currentUrlInput = document.getElementById('current' + type.charAt(0).toUpperCase() + type.slice(1) + 'Url');
                
                if (previewImg) previewImg.src = result.url;
                if (currentUrlInput) currentUrlInput.value = result.url;
                
                this.updatePreview();
                this.showToast('Imagem enviada com sucesso!', 'success');
            } else {
                this.showToast(result.error || 'Erro no upload', 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showToast('Erro no upload', 'error');
        }
    }

    removeImage(type) {
        const previewImg = document.getElementById(type + 'Preview');
        const currentUrlInput = document.getElementById('current' + type.charAt(0).toUpperCase() + type.slice(1) + 'Url');
        const defaultUrl = `/assets/images/placeholder-${type}.png`;
        
        if (previewImg) previewImg.src = defaultUrl;
        if (currentUrlInput) currentUrlInput.value = '';
        
        this.updatePreview();
    }

    updatePreview() {
        const siteName = document.getElementById('siteName')?.value || 'Nome do Site';
        const heroTitle = document.getElementById('heroTitle')?.value || 'Título Principal';
        const heroSubtitle = document.getElementById('heroSubtitle')?.value || 'Subtítulo';
        const heroDescription = document.getElementById('heroDescription')?.value || 'Descrição do hero';
        const logoUrl = document.getElementById('currentLogoUrl')?.value || '/assets/images/placeholder-logo.png';

        // Update preview elements
        const previewSiteName = document.getElementById('previewSiteName');
        const previewHeroTitle = document.getElementById('previewHeroTitle');
        const previewHeroSubtitle = document.getElementById('previewHeroSubtitle');
        const previewHeroDescription = document.getElementById('previewHeroDescription');
        const previewLogo = document.getElementById('previewLogo');

        if (previewSiteName) previewSiteName.textContent = siteName;
        if (previewHeroTitle) previewHeroTitle.textContent = heroTitle;
        if (previewHeroSubtitle) previewHeroSubtitle.textContent = heroSubtitle;
        if (previewHeroDescription) previewHeroDescription.textContent = heroDescription;
        if (previewLogo) previewLogo.src = logoUrl;
    }

    setupCustomizationPreview() {
        this.updatePreview();
    }

    async saveCustomization() {
        const saveBtn = document.getElementById('saveCustomization');
        const originalText = saveBtn.textContent;
        
        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';

        try {
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
                logo_url: document.getElementById('currentLogoUrl').value,
                favicon_url: document.getElementById('currentFaviconUrl').value
            };

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
                this.clientData = { ...this.clientData, ...result.data };
                window.CLIENT_DATA = this.clientData;
            } else {
                this.showToast(result.error || 'Erro ao salvar', 'error');
            }
        } catch (error) {
            console.error('Error saving customization:', error);
            this.showToast('Erro de conexão', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    }

    async loadAnalyticsData() {
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            if (response.ok) {
                this.renderAnalytics(analytics);
            } else {
                this.showToast(analytics.error || 'Erro ao carregar analytics', 'error');
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            this.showToast('Erro de conexão', 'error');
        }
    }

    renderAnalytics(analytics) {
        const container = document.getElementById('analyticsContent');
        
        container.innerHTML = `
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="percent" class="h-8 w-8 text-green-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.approval_rate}%</p>
                            <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="trending-up" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.daily_average}</p>
                            <p class="text-sm text-slate-400">Média Diária</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="heart" class="h-8 w-8 text-purple-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.most_requested_type}</p>
                            <p class="text-sm text-slate-400">Mais Solicitado</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="calendar" class="h-8 w-8 text-yellow-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.daily_requests?.length || 0}</p>
                            <p class="text-sm text-slate-400">Dias com Atividade</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Atividade dos Últimos 30 Dias</h3>
                <div class="space-y-2">
                    ${analytics.daily_requests && analytics.daily_requests.length > 0 ? 
                        analytics.daily_requests.map(day => `
                            <div class="flex items-center justify-between py-2 px-3 bg-slate-700/50 rounded">
                                <span class="text-slate-300">${new Date(day.date).toLocaleDateString('pt-BR')}</span>
                                <span class="text-white font-medium">${day.count} solicitação(ões)</span>
                            </div>
                        `).join('') : 
                        '<p class="text-slate-400 text-center py-8">Nenhuma atividade nos últimos 30 dias</p>'
                    }
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    formatWhatsApp(whatsapp) {
        if (!whatsapp) return '';
        const cleaned = whatsapp.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 4) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
        if (cleaned.length <= 9) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9, 13)}`;
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