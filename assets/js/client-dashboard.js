class ClientDashboardApp {
    constructor() {
        this.currentFilters = {
            status: '',
            content_type: ''
        };
        this.clientData = window.CLIENT_DATA || {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        this.loadStats();
        this.loadRequests();
        this.setupColorPickers();
        this.loadAnalytics();
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
        document.getElementById('refreshRequests').addEventListener('click', () => {
            this.loadRequests();
        });

        // Customization form
        document.getElementById('customizationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomization();
        });
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Set initial active tab
        this.switchTab('overview');
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'border-primary', 'text-primary');
            btn.classList.add('border-transparent', 'text-slate-400');
        });

        // Show selected tab content
        const selectedContent = document.getElementById(`${tabName}-tab`);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }

        // Add active class to selected tab button
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active', 'border-primary', 'text-primary');
            selectedButton.classList.remove('border-transparent', 'text-slate-400');
        }

        // Load specific tab data
        if (tabName === 'requests') {
            this.loadRequests();
        } else if (tabName === 'analytics') {
            this.loadAnalytics();
        }
    }

    setupColorPickers() {
        const primaryColorPicker = document.getElementById('primaryColor');
        const primaryColorText = document.getElementById('primaryColorText');
        const secondaryColorPicker = document.getElementById('secondaryColor');
        const secondaryColorText = document.getElementById('secondaryColorText');

        // Sync color picker with text input
        primaryColorPicker.addEventListener('change', (e) => {
            primaryColorText.value = e.target.value;
            this.updateColorPreview();
        });

        primaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                primaryColorPicker.value = e.target.value;
                this.updateColorPreview();
            }
        });

        secondaryColorPicker.addEventListener('change', (e) => {
            secondaryColorText.value = e.target.value;
            this.updateColorPreview();
        });

        secondaryColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                secondaryColorPicker.value = e.target.value;
                this.updateColorPreview();
            }
        });
    }

    updateColorPreview() {
        const primaryColor = document.getElementById('primaryColorText').value;
        const secondaryColor = document.getElementById('secondaryColorText').value;

        if (/^#[0-9A-Fa-f]{6}$/.test(primaryColor)) {
            document.documentElement.style.setProperty('--primary-color', primaryColor);
        }

        if (/^#[0-9A-Fa-f]{6}$/.test(secondaryColor)) {
            document.documentElement.style.setProperty('--secondary-color', secondaryColor);
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

    async loadStats() {
        try {
            const response = await fetch('/api/client-requests.php/stats');
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
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="users" class="h-5 w-5 text-blue-400"></i>
                    <span class="text-sm text-slate-400">Total</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.total || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="clock" class="h-5 w-5 text-yellow-400"></i>
                    <span class="text-sm text-slate-400">Pendentes</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.pending || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="check-circle" class="h-5 w-5 text-green-400"></i>
                    <span class="text-sm text-slate-400">Aprovadas</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.approved || 0}</p>
            </div>
            
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div class="flex items-center space-x-2 mb-2">
                    <i data-lucide="x-circle" class="h-5 w-5 text-red-400"></i>
                    <span class="text-sm text-slate-400">Negadas</span>
                </div>
                <p class="text-2xl font-bold text-white">${stats.denied || 0}</p>
            </div>
        `;

        lucide.createIcons();
    }

    async loadRequests() {
        try {
            const params = new URLSearchParams();
            if (this.currentFilters.status) params.append('status', this.currentFilters.status);
            if (this.currentFilters.content_type) params.append('content_type', this.currentFilters.content_type);

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
            const response = await fetch(`/api/client-requests.php/${id}`);
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
                    <div class="flex items-start space-x-4 mb-6">
                        <img
                            src="${posterUrl}"
                            alt="${request.content_title}"
                            class="w-16 h-24 object-cover rounded-lg border border-slate-700"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-white mb-2">${request.content_title}</h3>
                            <div class="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                                <div class="flex items-center space-x-1">
                                    <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                    <span>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                </div>
                                ${request.season ? `<span>Temporada ${request.season}</span>` : ''}
                                ${request.episode ? `<span>Episódio ${request.episode}</span>` : ''}
                            </div>
                            <div class="flex items-center space-x-2 ${this.getStatusClass(request.status)}">
                                <i data-lucide="${this.getStatusIcon(request.status)}" class="h-4 w-4"></i>
                                <span class="capitalize">${this.getStatusText(request.status)}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
                        <h4 class="text-white font-medium">Dados do Solicitante</h4>
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
                        <div class="flex items-center space-x-3">
                            <i data-lucide="calendar" class="h-5 w-5 text-slate-400"></i>
                            <span class="text-white">${this.formatDate(request.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        lucide.createIcons();
    }

    async saveCustomization() {
        const submitBtn = document.getElementById('saveCustomization');
        
        const formData = {
            name: document.getElementById('companyName').value.trim(),
            site_name: document.getElementById('siteName').value.trim(),
            site_tagline: document.getElementById('siteTagline').value.trim(),
            site_description: document.getElementById('siteDescription').value.trim(),
            logo_url: document.getElementById('logoUrl').value.trim(),
            favicon_url: document.getElementById('faviconUrl').value.trim(),
            hero_title: document.getElementById('heroTitle').value.trim(),
            hero_subtitle: document.getElementById('heroSubtitle').value.trim(),
            hero_description: document.getElementById('heroDescription').value.trim(),
            contact_email: document.getElementById('contactEmail').value.trim(),
            contact_whatsapp: document.getElementById('contactWhatsapp').value.replace(/\D/g, ''),
            primary_color: document.getElementById('primaryColorText').value,
            secondary_color: document.getElementById('secondaryColorText').value
        };

        // Validate required fields
        if (!formData.name || !formData.site_name) {
            this.showToast('Nome da empresa e nome do site são obrigatórios', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Salvando...</span>
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
                if (result.errors) {
                    Object.keys(result.errors).forEach(field => {
                        this.showToast(result.errors[field], 'error');
                    });
                } else {
                    throw new Error(result.error || 'Erro ao salvar configurações');
                }
                return;
            }

            this.showToast('Configurações salvas com sucesso!', 'success');
            
            // Update client data
            Object.assign(this.clientData, formData);
            
            // Update page title and navbar
            document.title = `Painel do Cliente - ${formData.site_name}`;
            
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i data-lucide="save" class="h-5 w-5"></i>
                <span>Salvar Alterações</span>
            `;
            lucide.createIcons();
        }
    }

    async loadAnalytics() {
        try {
            const response = await fetch('/api/client-analytics.php');
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
        // Render monthly stats
        document.getElementById('monthlyStats').innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Taxa de Aprovação:</span>
                    <span class="text-white font-medium">${analytics.approval_rate}%</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Média Diária:</span>
                    <span class="text-white font-medium">${analytics.daily_average}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Mais Solicitado:</span>
                    <span class="text-white font-medium">${analytics.most_requested_type}</span>
                </div>
            </div>
        `;

        // Render chart
        this.renderChart(analytics.daily_requests);
    }

    renderChart(dailyData) {
        const ctx = document.getElementById('requestsChart').getContext('2d');
        
        // Prepare data for last 30 days
        const last30Days = [];
        const counts = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            last30Days.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
            
            const dayData = dailyData.find(d => d.date === dateStr);
            counts.push(dayData ? parseInt(dayData.count) : 0);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last30Days,
                datasets: [{
                    label: 'Solicitações',
                    data: counts,
                    borderColor: this.clientData.primary_color || '#3b82f6',
                    backgroundColor: (this.clientData.primary_color || '#3b82f6') + '20',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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

// Initialize the app and make it globally available
document.addEventListener('DOMContentLoaded', () => {
    window.clientDashboard = new ClientDashboardApp();
});