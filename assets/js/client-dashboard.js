class ClientDashboardApp {
    constructor() {
        this.clientData = window.CLIENT_DATA;
        this.currentTab = 'overview';
        this.chart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOverviewData();
        this.setupTabs();
    }

    setupEventListeners() {
        // Logout buttons
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
        
        const logoutBtnMobile = document.getElementById('logoutBtnMobile');
        if (logoutBtnMobile) {
            logoutBtnMobile.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Customization form
        document.getElementById('customizationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomization();
        });

        // Filters
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.loadRequests();
        });

        document.getElementById('typeFilter').addEventListener('change', () => {
            this.loadRequests();
        });

        document.getElementById('refreshRequests').addEventListener('click', () => {
            this.loadRequests();
        });

        // Make switchTab globally available
        window.switchTab = (tab) => this.switchTab(tab);
    }

    setupTabs() {
        // Set initial tab styles
        this.updateTabStyles();
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        
        // Show selected tab
        document.getElementById(`${tab}-tab`).classList.remove('hidden');
        
        // Update tab button styles
        this.updateTabStyles();
        
        // Load tab-specific data
        switch (tab) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'requests':
                this.loadRequests();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    updateTabStyles() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const isActive = btn.dataset.tab === this.currentTab;
            
            if (isActive) {
                btn.className = 'tab-btn active whitespace-nowrap py-2 px-1 border-b-2 border-primary text-primary font-medium text-sm';
            } else {
                btn.className = 'tab-btn whitespace-nowrap py-2 px-1 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium text-sm';
            }
        });
    }

    async handleLogout() {
        try {
            await fetch('/api/client-auth.php/logout', { method: 'POST' });
            window.location.href = '/client/login.php';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/client/login.php';
        }
    }

    async loadOverviewData() {
        try {
            const response = await fetch(`/api/client-requests.php/stats?tenant_id=${this.clientData.id}`);
            const stats = await response.json();

            if (!response.ok) {
                throw new Error(stats.error || 'Erro ao carregar estatísticas');
            }

            this.renderStats(stats);
        } catch (error) {
            console.error('Error loading overview data:', error);
        }
    }

    renderStats(stats) {
        document.getElementById('statsCards').innerHTML = `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center space-x-3 mb-2">
                    <i data-lucide="inbox" class="h-6 w-6 text-blue-400"></i>
                    <span class="text-sm text-slate-400">Total</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.total || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center space-x-3 mb-2">
                    <i data-lucide="clock" class="h-6 w-6 text-yellow-400"></i>
                    <span class="text-sm text-slate-400">Pendentes</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.pending || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center space-x-3 mb-2">
                    <i data-lucide="check-circle" class="h-6 w-6 text-green-400"></i>
                    <span class="text-sm text-slate-400">Aprovadas</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.approved || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center space-x-3 mb-2">
                    <i data-lucide="x-circle" class="h-6 w-6 text-red-400"></i>
                    <span class="text-sm text-slate-400">Negadas</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.denied || 0}</p>
            </div>
        `;

        lucide.createIcons();
    }

    async loadRequests() {
        try {
            const status = document.getElementById('statusFilter').value;
            const type = document.getElementById('typeFilter').value;
            
            const params = new URLSearchParams({
                tenant_id: this.clientData.id
            });
            
            if (status) params.append('status', status);
            if (type) params.append('content_type', type);

            const response = await fetch(`/api/client-requests.php?${params}`);
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
                <div class="text-center py-12">
                    <div class="bg-slate-800/50 rounded-lg p-8 max-w-md mx-auto">
                        <i data-lucide="inbox" class="h-12 w-12 text-slate-500 mx-auto mb-4"></i>
                        <h3 class="text-lg font-medium text-slate-300 mb-2">
                            Nenhuma solicitação encontrada
                        </h3>
                        <p class="text-slate-500">
                            Não há solicitações que correspondam aos filtros selecionados
                        </p>
                    </div>
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
        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w200${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        const statusClass = this.getStatusClass(request.status);
        const statusIcon = this.getStatusIcon(request.status);
        const statusText = this.getStatusText(request.status);

        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                        <img
                            src="${posterUrl}"
                            alt="${request.content_title}"
                            class="w-16 h-24 object-cover rounded-lg border border-slate-700"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-1">
                                    ${request.content_title}
                                </h3>
                                <div class="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                    <div class="flex items-center space-x-1">
                                        <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                        <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                    </div>
                                    ${request.season ? `<span>Temporada ${request.season}</span>` : ''}
                                    ${request.episode ? `<span>Episódio ${request.episode}</span>` : ''}
                                </div>
                            </div>
                            
                            <div class="flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${statusClass}">
                                <i data-lucide="${statusIcon}" class="h-4 w-4"></i>
                                <span>${statusText}</span>
                            </div>
                        </div>

                        <div class="grid sm:grid-cols-2 gap-4 mb-4">
                            <div class="flex items-center space-x-2 text-slate-300">
                                <i data-lucide="user" class="h-4 w-4 text-slate-400"></i>
                                <span class="truncate">${request.requester_name}</span>
                            </div>
                            <div class="flex items-center space-x-2 text-slate-300">
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
                            <div class="flex items-center space-x-2 text-sm text-slate-400">
                                <i data-lucide="calendar" class="h-4 w-4"></i>
                                <span>${this.formatDate(request.created_at)}</span>
                            </div>

                            <button
                                onclick="clientDashboard.viewRequest(${request.id})"
                                class="flex items-center space-x-1 px-3 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors text-sm"
                            >
                                <i data-lucide="eye" class="h-4 w-4"></i>
                                <span>Ver Detalhes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async viewRequest(id) {
        try {
            const response = await fetch(`/api/client-requests.php/${id}?tenant_id=${this.clientData.id}`);
            const request = await response.json();

            if (!response.ok) {
                throw new Error(request.error || 'Erro ao carregar detalhes');
            }

            this.showRequestModal(request);
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    showRequestModal(request) {
        const modal = document.getElementById('requestModal');
        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w200${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                    <div class="flex items-start space-x-6 mb-6">
                        <img
                            src="${posterUrl}"
                            alt="${request.content_title}"
                            class="w-24 h-36 object-cover rounded-lg"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold text-white mb-2">${request.content_title}</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex items-center space-x-2">
                                    <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4 text-slate-400"></i>
                                    <span class="text-slate-300">${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                </div>
                                ${request.season ? `
                                    <div class="flex items-center space-x-2">
                                        <i data-lucide="layers" class="h-4 w-4 text-slate-400"></i>
                                        <span class="text-slate-300">Temporada ${request.season}</span>
                                    </div>
                                ` : ''}
                                ${request.episode ? `
                                    <div class="flex items-center space-x-2">
                                        <i data-lucide="play" class="h-4 w-4 text-slate-400"></i>
                                        <span class="text-slate-300">Episódio ${request.episode}</span>
                                    </div>
                                ` : ''}
                                <div class="flex items-center space-x-2">
                                    <i data-lucide="calendar" class="h-4 w-4 text-slate-400"></i>
                                    <span class="text-slate-300">${this.formatDate(request.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                        <h4 class="text-lg font-semibold text-white mb-4">Dados do Solicitante</h4>
                        <div class="grid sm:grid-cols-2 gap-4">
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

                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2 px-3 py-2 rounded-full border ${this.getStatusClass(request.status)}">
                            <i data-lucide="${this.getStatusIcon(request.status)}" class="h-4 w-4"></i>
                            <span class="font-medium">${this.getStatusText(request.status)}</span>
                        </div>
                        
                        <a 
                            href="https://wa.me/${request.requester_whatsapp}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <i data-lucide="message-circle" class="h-4 w-4 inline mr-2"></i>
                            Contatar
                        </a>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        lucide.createIcons();
        
        // Make clientDashboard globally available
        window.clientDashboard = this;
    }

    async saveCustomization() {
        const saveBtn = document.getElementById('saveCustomization');
        
        const formData = {
            name: document.getElementById('companyName').value.trim(),
            site_name: document.getElementById('siteName').value.trim(),
            site_tagline: document.getElementById('siteTagline').value.trim(),
            site_description: document.getElementById('siteDescription').value.trim(),
            logo_url: document.getElementById('logoUrl').value.trim(),
            favicon_url: document.getElementById('faviconUrl').value.trim(),
            contact_email: document.getElementById('contactEmail').value.trim(),
            contact_whatsapp: document.getElementById('contactWhatsapp').value.replace(/\D/g, ''),
            primary_color: document.getElementById('primaryColor').value,
            secondary_color: document.getElementById('secondaryColor').value,
            hero_title: document.getElementById('heroTitle').value.trim(),
            hero_subtitle: document.getElementById('heroSubtitle').value.trim(),
            hero_description: document.getElementById('heroDescription').value.trim()
        };

        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-2"></div>
            Salvando...
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
                throw new Error(result.error || 'Erro ao salvar alterações');
            }

            // Update client data
            Object.assign(this.clientData, formData);
            
            // Update CSS variables
            document.documentElement.style.setProperty('--primary-color', formData.primary_color);
            document.documentElement.style.setProperty('--secondary-color', formData.secondary_color);

            this.showToast('Alterações salvas com sucesso!', 'success');

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `
                <i data-lucide="save" class="h-4 w-4 inline mr-2"></i>
                Salvar Alterações
            `;
            lucide.createIcons();
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch(`/api/client-analytics.php?tenant_id=${this.clientData.id}`);
            const analytics = await response.json();

            if (!response.ok) {
                throw new Error(analytics.error || 'Erro ao carregar analytics');
            }

            this.renderAnalytics(analytics);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    renderAnalytics(analytics) {
        // Render chart
        this.renderChart(analytics.daily_requests || []);
        
        // Render monthly stats
        document.getElementById('monthlyStats').innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-slate-400">Taxa de Aprovação:</span>
                <span class="text-white font-semibold">${analytics.approval_rate || 0}%</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-slate-400">Média por Dia:</span>
                <span class="text-white font-semibold">${analytics.daily_average || 0}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-slate-400">Tipo Mais Solicitado:</span>
                <span class="text-white font-semibold">${analytics.most_requested_type || 'N/A'}</span>
            </div>
        `;
    }

    renderChart(data) {
        const ctx = document.getElementById('requestsChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.date),
                datasets: [{
                    label: 'Solicitações',
                    data: data.map(item => item.count),
                    borderColor: this.clientData.primary_color || '#1E40AF',
                    backgroundColor: (this.clientData.primary_color || '#1E40AF') + '20',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e2e8f0'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#374151'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#374151'
                        }
                    }
                }
            }
        });
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
            <div class="text-center py-12">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                    <p class="text-red-400 font-medium">${message}</p>
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
    new ClientDashboardApp();
});