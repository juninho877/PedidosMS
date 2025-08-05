class ClientDashboardApp {
    constructor() {
        this.currentTab = 'overview';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOverviewData();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.id.replace('tab-', '');
                this.switchTab(tabId);
            });
        });

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

        // Customization form
        document.getElementById('customizationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomization();
        });

        // Upload buttons
        document.getElementById('uploadLogoBtn').addEventListener('click', () => {
            this.openUploadModal('logo');
        });

        document.getElementById('uploadFaviconBtn').addEventListener('click', () => {
            this.openUploadModal('favicon');
        });

        // Upload modal
        document.getElementById('closeUploadModal').addEventListener('click', () => {
            this.closeUploadModal();
        });

        document.getElementById('cancelUpload').addEventListener('click', () => {
            this.closeUploadModal();
        });

        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFileUpload();
        });

        // Request filters
        document.getElementById('requestStatusFilter').addEventListener('change', () => {
            this.loadRequests();
        });

        document.getElementById('requestTypeFilter').addEventListener('change', () => {
            this.loadRequests();
        });

        document.getElementById('refreshRequestsBtn').addEventListener('click', () => {
            this.loadRequests();
        });

        // Make switchTab globally available
        window.switchTab = (tabId) => this.switchTab(tabId);
    }

    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active', 'border-primary', 'text-primary');
            button.classList.add('border-transparent', 'text-slate-400');
        });

        document.getElementById(`tab-${tabId}`).classList.remove('border-transparent', 'text-slate-400');
        document.getElementById(`tab-${tabId}`).classList.add('active', 'border-primary', 'text-primary');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        document.getElementById(`content-${tabId}`).classList.remove('hidden');

        this.currentTab = tabId;

        // Load tab-specific data
        switch (tabId) {
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
            // Load stats
            const statsResponse = await fetch(`/api/client-requests.php/stats?tenant_id=${window.CLIENT_DATA.tenantId}`);
            const stats = await statsResponse.json();

            if (statsResponse.ok) {
                this.renderStats(stats);
            }

            // Load recent requests
            const recentResponse = await fetch(`/api/client-requests.php?tenant_id=${window.CLIENT_DATA.tenantId}&limit=5`);
            const recentRequests = await recentResponse.json();

            if (recentResponse.ok) {
                this.renderRecentRequests(recentRequests);
            }

        } catch (error) {
            console.error('Error loading overview data:', error);
        }
    }

    renderStats(stats) {
        document.getElementById('statsCards').innerHTML = `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="inbox" class="h-5 w-5 text-blue-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Total</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.total || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="clock" class="h-5 w-5 text-yellow-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Pendentes</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.pending || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="check-circle" class="h-5 w-5 text-green-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Aprovadas</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.approved || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="x-circle" class="h-5 w-5 text-red-400"></i>
                    <span class="text-xs sm:text-sm text-slate-400">Negadas</span>
                </div>
                <p class="text-xl sm:text-2xl font-bold text-white">${stats.denied || 0}</p>
            </div>
        `;

        lucide.createIcons();
    }

    renderRecentRequests(requests) {
        const container = document.getElementById('recentRequests');

        if (requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="inbox" class="h-12 w-12 text-slate-600 mx-auto mb-4"></i>
                    <p class="text-slate-400">Nenhuma solicitação ainda</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = `
            <div class="space-y-3">
                ${requests.slice(0, 5).map(request => `
                    <div class="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-5 w-5 text-slate-400"></i>
                            <div>
                                <p class="text-white font-medium text-sm">${request.content_title}</p>
                                <p class="text-slate-400 text-xs">${request.requester_name}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${this.getStatusClass(request.status)}">
                                ${this.getStatusText(request.status)}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        lucide.createIcons();
    }

    async loadRequests() {
        try {
            const status = document.getElementById('requestStatusFilter').value;
            const type = document.getElementById('requestTypeFilter').value;
            
            const params = new URLSearchParams({
                tenant_id: window.CLIENT_DATA.tenantId
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

        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
                <div class="flex items-start space-x-4">
                    <!-- Poster -->
                    <div class="flex-shrink-0">
                        <img
                            src="${posterUrl}"
                            alt="${request.content_title}"
                            class="w-16 h-24 object-cover rounded-lg border border-slate-700"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                    </div>

                    <!-- Content Info -->
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
                            
                            <div class="flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${this.getStatusClass(request.status)}">
                                <i data-lucide="${this.getStatusIcon(request.status)}" class="h-4 w-4"></i>
                                <span>${this.getStatusText(request.status)}</span>
                            </div>
                        </div>

                        <!-- Requester Info -->
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

                            <a
                                href="https://wa.me/${request.requester_whatsapp}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                            >
                                <i data-lucide="message-circle" class="h-4 w-4"></i>
                                <span>Contatar</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async saveCustomization() {
        const saveBtn = document.getElementById('saveCustomizationBtn');
        
        const formData = {
            name: document.getElementById('siteName').value.trim(),
            logo_url: document.getElementById('logoUrl').value.trim(),
            favicon_url: document.getElementById('faviconUrl').value.trim(),
            primary_color: document.getElementById('primaryColor').value,
            secondary_color: document.getElementById('secondaryColor').value,
            hero_title: document.getElementById('heroTitle').value.trim(),
            hero_subtitle: document.getElementById('heroSubtitle').value.trim(),
            hero_description: document.getElementById('heroDescription').value.trim()
        };

        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';

        try {
            const response = await fetch(`/api/client-tenants.php/${window.CLIENT_DATA.tenantId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro ao salvar personalização');
            }

            this.showToast('Personalização salva com sucesso!', 'success');
            
            // Reload page to apply changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Salvar Alterações';
        }
    }

    openUploadModal(type) {
        document.getElementById('uploadType').value = type;
        document.getElementById('uploadModal').classList.remove('hidden');
        lucide.createIcons();
    }

    closeUploadModal() {
        document.getElementById('uploadModal').classList.add('hidden');
        document.getElementById('uploadForm').reset();
    }

    async handleFileUpload() {
        const form = document.getElementById('uploadForm');
        const submitBtn = document.getElementById('submitUpload');
        const formData = new FormData(form);

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const response = await fetch('/admin/upload.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro no upload');
            }

            // Update the corresponding URL field
            const type = document.getElementById('uploadType').value;
            const urlField = type === 'logo' ? 'logoUrl' : 'faviconUrl';
            document.getElementById(urlField).value = window.location.origin + result.url;

            this.showToast('Upload realizado com sucesso!', 'success');
            this.closeUploadModal();

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Upload';
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch(`/api/client-analytics.php?tenant_id=${window.CLIENT_DATA.tenantId}`);
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
        // Update analytics cards
        document.getElementById('todayRequests').textContent = analytics.today || 0;
        document.getElementById('weekRequests').textContent = analytics.week || 0;
        document.getElementById('monthRequests').textContent = analytics.month || 0;
        document.getElementById('approvalRate').textContent = (analytics.approval_rate || 0) + '%';

        // Render charts
        this.renderRequestsChart(analytics.daily_requests || []);
        this.renderContentTypeChart(analytics.content_types || {});
    }

    renderRequestsChart(dailyData) {
        const ctx = document.getElementById('requestsChart').getContext('2d');
        
        if (this.charts.requests) {
            this.charts.requests.destroy();
        }

        this.charts.requests = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dailyData.map(item => item.date),
                datasets: [{
                    label: 'Solicitações',
                    data: dailyData.map(item => item.count),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgb(148, 163, 184)'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'rgb(148, 163, 184)'
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgb(148, 163, 184)'
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    }
                }
            }
        });
    }

    renderContentTypeChart(contentTypes) {
        const ctx = document.getElementById('contentTypeChart').getContext('2d');
        
        if (this.charts.contentType) {
            this.charts.contentType.destroy();
        }

        this.charts.contentType = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Filmes', 'Séries'],
                datasets: [{
                    data: [contentTypes.movies || 0, contentTypes.tv || 0],
                    backgroundColor: [
                        'rgb(59, 130, 246)',
                        'rgb(147, 51, 234)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgb(148, 163, 184)'
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