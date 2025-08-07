class ClientDashboardApp {
    constructor() {
        this.clientData = window.CLIENT_DATA || {};
        this.tmdbImageBaseUrl = window.TMDB_IMAGE_BASE_URL || '';
        this.tmdbApiKey = window.TMDB_API_KEY || '';
        this.init();
    }

    init() {
        this.setupTabs();
        this.loadStats();
        this.loadRequests();
        this.setupFilters();
        this.loadSettings();
        this.loadAnalytics();
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Update button states
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update content visibility
                tabContents.forEach(content => {
                    if (content.id === `${tabId}-tab`) {
                        content.classList.remove('hidden');
                    } else {
                        content.classList.add('hidden');
                    }
                });
            });
        });
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
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async loadRequests() {
        try {
            const response = await fetch('/api/client-requests.php');
            const requests = await response.json();

            if (response.ok) {
                this.renderRequests(requests);
            }
        } catch (error) {
            console.error('Error loading requests:', error);
        }
    }

    renderRequests(requests) {
        const container = document.getElementById('requestsList');
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação encontrada</h3>
                    <p class="text-slate-500">Suas solicitações aparecerão aqui quando forem criadas.</p>
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

        // Setup click handlers for request details
        requests.forEach(request => {
            const element = document.getElementById(`request-${request.id}`);
            if (element) {
                element.addEventListener('click', () => {
                    this.showRequestDetailsModal(request);
                });
            }
        });

        lucide.createIcons();
    }

    getRequestHTML(request) {
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

        return `
            <div id="request-${request.id}" class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors cursor-pointer">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h3 class="text-lg font-semibold text-white">${request.content_title}</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}">
                                ${statusLabels[request.status]}
                            </span>
                        </div>
                        <div class="flex items-center space-x-4 text-sm text-slate-400">
                            <span class="flex items-center space-x-1">
                                <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                <span>${typeLabels[request.content_type]}</span>
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
                    <div class="flex items-center space-x-2">
                        ${request.status === 'pending' ? `
                            <button onclick="event.stopPropagation(); updateRequestStatus(${request.id}, 'approved')" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                                Aprovar
                            </button>
                            <button onclick="event.stopPropagation(); updateRequestStatus(${request.id}, 'denied')" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                                Negar
                            </button>
                        ` : ''}
                        <i data-lucide="chevron-right" class="h-5 w-5 text-slate-400"></i>
                    </div>
                </div>
            </div>
        `;
    }

    async showRequestDetailsModal(request) {
        console.log('Showing request details for:', request);
        
        const modal = document.getElementById('requestDetailsModal');
        
        // Show loading state
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full p-8 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p class="text-slate-400">Carregando detalhes...</p>
            </div>
        `;
        modal.classList.remove('hidden');

        try {
            // Fetch TMDB details
            const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
            const tmdbData = await tmdbResponse.json();
            
            console.log('TMDB Response:', tmdbResponse.status, tmdbData);

            if (tmdbResponse.ok) {
                this.renderRequestDetailsWithTMDB(request, tmdbData);
            } else {
                this.renderRequestDetailsBasic(request);
            }
        } catch (error) {
            console.error('Error fetching TMDB data:', error);
            this.renderRequestDetailsBasic(request);
        }
    }

    renderRequestDetailsWithTMDB(request, tmdbData) {
        console.log('Rendering with TMDB data:', tmdbData);
        
        const modal = document.getElementById('requestDetailsModal');
        const title = tmdbData.title || tmdbData.name || request.content_title;
        const overview = tmdbData.overview || 'Sinopse não disponível.';
        const releaseDate = tmdbData.release_date || tmdbData.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
        const rating = tmdbData.vote_average ? tmdbData.vote_average.toFixed(1) : 'N/A';
        
        // Construct poster URL
        let posterUrl = 'https://via.placeholder.com/300x450/374151/ffffff?text=Sem+Poster';
        if (tmdbData.poster_path && this.tmdbImageBaseUrl) {
            posterUrl = `${this.tmdbImageBaseUrl}/w400${tmdbData.poster_path}`;
            console.log('Constructed poster URL:', posterUrl);
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

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    <button id="closeModal" class="text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <div class="grid lg:grid-cols-3 gap-6">
                        <!-- Poster -->
                        <div class="lg:col-span-1">
                            <img
                                src="${posterUrl}"
                                alt="${title}"
                                class="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                                onerror="this.src='https://via.placeholder.com/300x450/374151/ffffff?text=Sem+Poster'"
                            />
                        </div>

                        <!-- Details -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Title and Status -->
                            <div>
                                <div class="flex items-center space-x-3 mb-2">
                                    <h3 class="text-2xl font-bold text-white">${title}</h3>
                                    <span class="px-3 py-1 rounded-full text-sm font-medium border ${statusColors[request.status]}">
                                        ${statusLabels[request.status]}
                                    </span>
                                </div>
                                <div class="flex items-center space-x-4 text-slate-400">
                                    <span class="flex items-center space-x-1">
                                        <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                        <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                    </span>
                                    <span class="flex items-center space-x-1">
                                        <i data-lucide="calendar" class="h-4 w-4"></i>
                                        <span>${year}</span>
                                    </span>
                                    <span class="flex items-center space-x-1">
                                        <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                        <span>${rating}/10</span>
                                    </span>
                                </div>
                            </div>

                            <!-- Overview -->
                            <div>
                                <h4 class="text-lg font-semibold text-white mb-2">Sinopse</h4>
                                <p class="text-slate-300 leading-relaxed">${overview}</p>
                            </div>

                            <!-- Request Info -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-3">Informações da Solicitação</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span class="text-slate-400">Solicitante:</span>
                                        <span class="text-white ml-2">${request.requester_name}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Data:</span>
                                        <span class="text-white ml-2">${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
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

                            <!-- Actions -->
                            <div class="flex flex-wrap gap-3">
                                ${request.status === 'pending' ? `
                                    <button onclick="updateRequestStatus(${request.id}, 'approved')" class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        <i data-lucide="check" class="h-4 w-4"></i>
                                        <span>Aprovar</span>
                                    </button>
                                    <button onclick="updateRequestStatus(${request.id}, 'denied')" class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        <i data-lucide="x" class="h-4 w-4"></i>
                                        <span>Negar</span>
                                    </button>
                                ` : ''}
                                <a href="https://wa.me/${request.requester_whatsapp}?text=Olá ${encodeURIComponent(request.requester_name)}, sobre sua solicitação de '${encodeURIComponent(request.content_title)}'..." target="_blank" class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    <i data-lucide="message-square" class="h-4 w-4"></i>
                                    <span>Contatar via WhatsApp</span>
                                </a>
                            </div>

                            <!-- TMDB Additional Info -->
                            ${this.getTMDBAdditionalInfo(tmdbData)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Setup close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        lucide.createIcons();
    }

    renderRequestDetailsBasic(request) {
        console.log('Rendering basic request details (no TMDB):', request);
        
        const modal = document.getElementById('requestDetailsModal');
        
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
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full p-6">
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    <button id="closeModal" class="text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <h3 class="text-lg font-semibold text-white">${request.content_title}</h3>
                        <span class="px-3 py-1 rounded-full text-sm font-medium border ${statusColors[request.status]}">
                            ${statusLabels[request.status]}
                        </span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-slate-400">Tipo:</span>
                            <span class="text-white ml-2">${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Solicitante:</span>
                            <span class="text-white ml-2">${request.requester_name}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Data:</span>
                            <span class="text-white ml-2">${new Date(request.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        ${request.season ? `
                            <div>
                                <span class="text-slate-400">Temporada:</span>
                                <span class="text-white ml-2">${request.season}</span>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-wrap gap-3 pt-4">
                        ${request.status === 'pending' ? `
                            <button onclick="updateRequestStatus(${request.id}, 'approved')" class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                <i data-lucide="check" class="h-4 w-4"></i>
                                <span>Aprovar</span>
                            </button>
                            <button onclick="updateRequestStatus(${request.id}, 'denied')" class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                                <i data-lucide="x" class="h-4 w-4"></i>
                                <span>Negar</span>
                            </button>
                        ` : ''}
                        <a href="https://wa.me/${request.requester_whatsapp}" target="_blank" class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i data-lucide="message-square" class="h-4 w-4"></i>
                            <span>Contatar via WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Setup close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        lucide.createIcons();
    }

    getTMDBAdditionalInfo(tmdbData) {
        if (!tmdbData) return '';

        const genres = tmdbData.genres || [];
        const cast = tmdbData.credits?.cast || [];
        const trailer = tmdbData.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        return `
            <!-- Genres -->
            ${genres.length > 0 ? `
                <div>
                    <h4 class="text-lg font-semibold text-white mb-2">Gêneros</h4>
                    <div class="flex flex-wrap gap-2">
                        ${genres.map(genre => `
                            <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                                ${genre.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Cast -->
            ${cast.length > 0 ? `
                <div>
                    <h4 class="text-lg font-semibold text-white mb-2">Elenco Principal</h4>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        ${cast.slice(0, 8).map(actor => `
                            <div class="text-center">
                                <img
                                    src="${actor.profile_path ? 
                                        `${this.tmdbImageBaseUrl}/w200${actor.profile_path}` : 
                                        'https://via.placeholder.com/200x300/374151/ffffff?text=Sem+Foto'
                                    }"
                                    alt="${actor.name}"
                                    class="w-full h-24 object-cover rounded-lg mb-2"
                                    onerror="this.src='https://via.placeholder.com/200x300/374151/ffffff?text=Sem+Foto'"
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
                    <h4 class="text-lg font-semibold text-white mb-2">Trailer</h4>
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
        `;
    }

    setupFilters() {
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');
        const searchFilter = document.getElementById('searchFilter');

        [statusFilter, typeFilter, searchFilter].forEach(filter => {
            filter.addEventListener('change', () => {
                this.loadRequests();
            });
        });
    }

    async loadSettings() {
        // Populate form with current client data
        document.getElementById('companyName').value = this.clientData.name || '';
        document.getElementById('siteName').value = this.clientData.site_name || '';
        document.getElementById('siteTagline').value = this.clientData.site_tagline || '';
        document.getElementById('contactEmail').value = this.clientData.contact_email || '';
        document.getElementById('contactWhatsapp').value = this.clientData.contact_whatsapp || '';
        document.getElementById('primaryColor').value = this.clientData.primary_color || '#3b82f6';
        document.getElementById('secondaryColor').value = this.clientData.secondary_color || '#8b5cf6';
        document.getElementById('heroTitle').value = this.clientData.hero_title || '';
        document.getElementById('heroSubtitle').value = this.clientData.hero_subtitle || '';
        document.getElementById('siteDescription').value = this.clientData.site_description || '';
        document.getElementById('heroDescription').value = this.clientData.hero_description || '';

        // Setup form submission
        document.getElementById('settingsForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveSettings();
        });
    }

    async saveSettings() {
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
                // Update client data
                Object.assign(this.clientData, formData);
            } else {
                throw new Error(result.error || 'Erro ao salvar configurações');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            if (response.ok) {
                document.getElementById('approvalRate').textContent = `${analytics.approval_rate}%`;
                document.getElementById('dailyAverage').textContent = analytics.daily_average;
                document.getElementById('mostRequestedType').textContent = analytics.most_requested_type;
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
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

// Global functions for inline event handlers
async function updateRequestStatus(id, status) {
    try {
        const response = await fetch('/api/client-requests.php/update-status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, status })
        });

        const result = await response.json();

        if (response.ok) {
            // Close modal and reload requests
            document.getElementById('requestDetailsModal').classList.add('hidden');
            window.dashboardApp.loadRequests();
            window.dashboardApp.loadStats();
            window.dashboardApp.showToast('Status atualizado com sucesso!', 'success');
        } else {
            throw new Error(result.error || 'Erro ao atualizar status');
        }
    } catch (error) {
        window.dashboardApp.showToast(error.message, 'error');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardApp = new ClientDashboardApp();
});