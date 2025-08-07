class TenantDashboardApp {
    constructor() {
        this.currentFilters = {
            status: '',
            content_type: ''
        };
        this.tenantSlug = window.TENANT_SLUG;
        this.tenantData = window.TENANT_DATA;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStats();
        this.loadRequests();
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
        
        // Mobile logout button
        const logoutBtnMobile = document.getElementById('logoutBtnMobile');
        if (logoutBtnMobile) {
            logoutBtnMobile.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Filter changes
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.loadRequests();
        });

        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.currentFilters.content_type = e.target.value;
            this.loadRequests();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadStats();
            this.loadRequests();
        });
    }

    async handleLogout() {
        try {
            await fetch('/api/tenant/logout', { method: 'POST' });
            window.location.href = `/${this.tenantSlug}/login`;
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = `/${this.tenantSlug}/login`;
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/requests/stats');
            const stats = await response.json();

            if (!response.ok) {
                throw new Error(stats.error || 'Erro ao carregar estatísticas');
            }

            this.renderStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    renderStats(stats) {
        document.getElementById('statsCards').innerHTML = `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="users" class="h-5 w-5 text-blue-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Total</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.total || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="clock" class="h-5 w-5 text-yellow-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Pendentes</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.pending || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="check-circle" class="h-5 w-5 text-green-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Aprovadas</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.approved || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="x-circle" class="h-5 w-5 text-red-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Negadas</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.denied || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="film" class="h-5 w-5 text-purple-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Filmes</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.movies || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="tv" class="h-5 w-5 text-indigo-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Séries</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.tv || 0}</p>
            </div>
        `;

        lucide.createIcons();
    }

    async loadRequests() {
        try {
            const params = new URLSearchParams();
            if (this.currentFilters.status) params.append('status', this.currentFilters.status);
            if (this.currentFilters.content_type) params.append('content_type', this.currentFilters.content_type);

            const response = await fetch(`/api/requests?${params}`);
            const requests = await response.json();

            if (!response.ok) {
                throw new Error(requests.error || 'Erro ao carregar solicitações');
            }

            this.renderRequests(requests);
        } catch (error) {
            console.error('Error loading requests:', error);
            this.showError('Erro ao carregar solicitações');
        }
    }

    renderRequests(requests) {
        const container = document.getElementById('requestsList');

        if (requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 sm:py-12">
                    <div class="bg-slate-800/50 rounded-lg p-8 max-w-md mx-auto">
                        <i data-lucide="clock" class="h-10 w-10 sm:h-12 sm:w-12 text-slate-500 mx-auto mb-4"></i>
                        <h3 class="text-base sm:text-lg font-medium text-slate-300 mb-2">
                            Nenhuma solicitação encontrada
                        </h3>
                        <p class="text-sm sm:text-base text-slate-500 px-4">
                            Não há solicitações que correspondam aos filtros selecionados
                        </p>
                    </div>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = `
            <div class="space-y-3 sm:space-y-4">
                ${requests.map(request => this.getRequestHTML(request)).join('')}
            </div>
        `;

        // Setup event listeners for action buttons
        this.setupRequestEventListeners();
        lucide.createIcons();
    }

    getRequestHTML(request) {
        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w200${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        const statusClass = this.getStatusClass(request.status);
        const statusIcon = this.getStatusIcon(request.status);
        const statusText = this.getStatusText(request.status);

        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-slate-600 transition-colors">
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3 sm:space-x-4 flex-1">
                        <!-- Poster -->
                        <div class="flex-shrink-0">
                            <img
                                src="${posterUrl}"
                                alt="${request.content_title}"
                                class="w-12 h-18 sm:w-16 sm:h-24 object-cover rounded-lg border border-slate-700"
                                onerror="this.src='/assets/images/placeholder-poster.jpg'"
                            />
                        </div>

                        <!-- Content Info -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <h3 class="text-base sm:text-lg font-semibold text-white mb-1">
                                        ${request.content_title}
                                    </h3>
                                    <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                            <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                        </div>
                                        ${request.season ? `<span>Temporada ${request.season}</span>` : ''}
                                        ${request.episode ? `<span>Episódio ${request.episode}</span>` : ''}
                                    </div>
                                </div>
                                
                                <div class="flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium ${statusClass}">
                                    <i data-lucide="${statusIcon}" class="h-4 w-4"></i>
                                    <span class="hidden sm:inline">${statusText}</span>
                                </div>
                            </div>

                            <!-- Requester Info -->
                            <div class="grid sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <div class="flex items-center space-x-2 text-slate-300 text-sm sm:text-base">
                                    <i data-lucide="user" class="h-4 w-4 text-slate-400"></i>
                                    <span class="truncate">${request.requester_name}</span>
                                </div>
                                <div class="flex items-center space-x-2 text-slate-300 text-sm sm:text-base">
                                    <i data-lucide="phone" class="h-4 w-4 text-slate-400"></i>
                                    <a 
                                        href="https://wa.me/${request.requester_whatsapp}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="hover:text-green-400 transition-colors truncate"
                                    >
                                        ${this.formatWhatsApp(request.requester_whatsapp)}
                                    </a>
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2 text-xs sm:text-sm text-slate-400">
                                    <i data-lucide="calendar" class="h-4 w-4"></i>
                                    <span>${this.formatDate(request.created_at)}</span>
                                </div>

                                <!-- Actions -->
                                <div class="flex items-center space-x-1 sm:space-x-2">
                                    <button
                                        onclick="tenantDashboard.viewRequest(${request.id})"
                                        class="flex items-center space-x-1 px-2 sm:px-3 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors text-xs sm:text-sm"
                                    >
                                        <i data-lucide="eye" class="h-4 w-4"></i>
                                        <span class="hidden sm:inline">Ver</span>
                                    </button>
                                    ${request.status === 'pending' ? `
                                        <button
                                            onclick="tenantDashboard.updateStatus(${request.id}, 'approved')"
                                            class="flex items-center space-x-1 px-2 sm:px-3 py-1 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors text-xs sm:text-sm"
                                        >
                                            <i data-lucide="check-circle" class="h-4 w-4"></i>
                                            <span class="hidden sm:inline">Aprovar</span>
                                        </button>
                                        <button
                                            onclick="tenantDashboard.updateStatus(${request.id}, 'denied')"
                                            class="flex items-center space-x-1 px-2 sm:px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-xs sm:text-sm"
                                        >
                                            <i data-lucide="x-circle" class="h-4 w-4"></i>
                                            <span class="hidden sm:inline">Negar</span>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupRequestEventListeners() {
        // Make dashboard instance globally available for onclick handlers
        window.tenantDashboard = this;
    }

    async viewRequest(id) {
        try {
            const response = await fetch(`/api/requests/${id}`);
            const request = await response.json();

            if (!response.ok) {
                throw new Error(request.error || 'Erro ao carregar detalhes');
            }

            // Buscar informações adicionais do TMDB
            try {
                const tmdbResponse = await fetch(`/api/tmdb/${request.content_type}/${request.content_id}`);
                const tmdbData = await tmdbResponse.json();
                
                if (tmdbResponse.ok) {
                    request.tmdb_data = tmdbData;
                }
            } catch (tmdbError) {
                console.warn('Erro ao buscar dados do TMDB:', tmdbError);
            }
            
            this.showRequestModal(request);
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async updateStatus(id, status) {
        if (!confirm(`Tem certeza que deseja ${status === 'approved' ? 'aprovar' : 'negar'} esta solicitação?`)) {
            return;
        }

        try {
            const response = await fetch('/api/requests/update-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao atualizar status');
            }

            this.showToast(`Solicitação ${status === 'approved' ? 'aprovada' : 'negada'} com sucesso!`, 'success');
            this.loadStats();
            this.loadRequests();

        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    showRequestModal(request) {
        // Similar ao dashboard admin, mas adaptado para tenant
        const modal = document.getElementById('requestModal');
        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w200${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        const tmdbData = request.tmdb_data;
        const releaseDate = tmdbData ? (tmdbData.release_date || tmdbData.first_air_date) : null;
        const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
        const rating = tmdbData ? tmdbData.vote_average : null;
        const overview = tmdbData ? tmdbData.overview : null;
        const genres = tmdbData ? tmdbData.genres : null;

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    <button
                        onclick="document.getElementById('requestModal').classList.add('hidden')"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <div class="p-6">
                    <div class="grid lg:grid-cols-2 gap-8">
                        <!-- Request Information -->
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-4">Informações da Solicitação</h3>
                                <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-slate-400">Status:</span>
                                        <div class="flex items-center space-x-2 ${this.getStatusClass(request.status)}">
                                            <i data-lucide="${this.getStatusIcon(request.status)}" class="h-4 w-4"></i>
                                            <span class="capitalize">${this.getStatusText(request.status)}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-slate-400">Data:</span>
                                        <span class="text-white">${this.formatDate(request.created_at)}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-slate-400">Tipo:</span>
                                        <div class="flex items-center space-x-2 text-white">
                                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                            <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                        </div>
                                    </div>
                                    ${request.season ? `
                                        <div class="flex items-center justify-between">
                                            <span class="text-slate-400">Temporada:</span>
                                            <span class="text-white">${request.season}</span>
                                        </div>
                                    ` : ''}
                                    ${request.episode ? `
                                        <div class="flex items-center justify-between">
                                            <span class="text-slate-400">Episódio:</span>
                                            <span class="text-white">${request.episode}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold text-white mb-4">Dados do Solicitante</h3>
                                <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
                                    <div class="flex items-center space-x-3">
                                        <i data-lucide="user" class="h-5 w-5 text-slate-400"></i>
                                        <span class="text-white">${request.requester_name}</span>
                                    </div>
                                    <div class="flex items-center space-x-3">
                                        <i data-lucide="phone" class="h-5 w-5 text-slate-400"></i>
                                        <a 
                                            href="https://wa.me/${request.requester_whatsapp}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-green-400 hover:text-green-300 transition-colors"
                                        >
                                            ${this.formatWhatsApp(request.requester_whatsapp)}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            ${request.status === 'pending' ? `
                                <div class="flex space-x-4">
                                    <button
                                        onclick="tenantDashboard.updateStatus(${request.id}, 'approved'); document.getElementById('requestModal').classList.add('hidden')"
                                        class="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        <i data-lucide="check-circle" class="h-5 w-5"></i>
                                        <span>Aprovar</span>
                                    </button>
                                    <button
                                        onclick="tenantDashboard.updateStatus(${request.id}, 'denied'); document.getElementById('requestModal').classList.add('hidden')"
                                        class="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        <i data-lucide="x-circle" class="h-5 w-5"></i>
                                        <span>Negar</span>
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Content Preview -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold text-white">Informações do Conteúdo</h3>
                            
                            <div class="space-y-4">
                                <img
                                    src="${posterUrl}"
                                    alt="${request.content_title}"
                                    class="w-full max-w-sm mx-auto object-cover rounded-lg"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                                
                                <div class="text-center">
                                    <h4 class="text-xl font-semibold text-white mb-2">${request.content_title}</h4>
                                    <p class="text-slate-400">${request.content_type === 'movie' ? 'Filme' : 'Série'}</p>
                                </div>

                                ${tmdbData ? `
                                    <div class="bg-slate-700/50 rounded-lg p-4 space-y-3 text-left">
                                        ${releaseYear ? `
                                            <div class="flex items-center justify-between">
                                                <span class="text-slate-400">Ano:</span>
                                                <span class="text-white font-medium">${releaseYear}</span>
                                            </div>
                                        ` : ''}
                                        ${rating ? `
                                            <div class="flex items-center justify-between">
                                                <span class="text-slate-400">Avaliação:</span>
                                                <div class="flex items-center space-x-1">
                                                    <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                                    <span class="text-white font-medium">${rating.toFixed(1)}/10</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${genres && genres.length > 0 ? `
                                            <div>
                                                <span class="text-slate-400 block mb-2">Gêneros:</span>
                                                <div class="flex flex-wrap gap-1">
                                                    ${genres.slice(0, 3).map(genre => `
                                                        <span class="bg-slate-600 text-slate-200 px-2 py-1 rounded text-xs">
                                                            ${genre.name}
                                                        </span>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                    
                                    ${overview ? `
                                        <div class="bg-slate-700/50 rounded-lg p-4 mt-4">
                                            <h5 class="text-sm font-medium text-slate-300 mb-2">Sinopse:</h5>
                                            <p class="text-slate-400 text-sm leading-relaxed line-clamp-4">
                                                ${overview}
                                            </p>
                                        </div>
                                    ` : ''}
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        lucide.createIcons();
    }

    getStatusClass(status) {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'denied': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    }

    getStatusIcon(status) {
        switch (status) {
            case 'pending': return 'clock';
            case 'approved': return 'check-circle';
            case 'denied': return 'x-circle';
            default: return 'clock';
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

    formatWhatsApp(whatsapp) {
        const numbers = whatsapp.replace(/\D/g, '');
        if (numbers.length === 13) {
            return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 9)}-${numbers.slice(9)}`;
        }
        return whatsapp;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('pt-BR');
    }

    showError(message) {
        document.getElementById('requestsList').innerHTML = `
            <div class="text-center py-8 sm:py-12">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-sm sm:text-base text-red-400 font-medium px-4">${message}</p>
                </div>
            </div>
        `;
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TenantDashboardApp();
});