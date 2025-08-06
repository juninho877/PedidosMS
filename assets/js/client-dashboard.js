class ClientDashboardApp {
    constructor() {
        this.clientData = window.CLIENT_DATA || {};
        this.currentFilters = {
            status: '',
            content_type: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeImagePreviews();
        this.updateColorPreview();
        this.updateLivePreview();
        this.switchTab('overview');
        this.loadStats();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Image upload handlers
        document.getElementById('logoInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handleImageUpload(e.target.files[0], 'logo');
            }
        });

        document.getElementById('faviconInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handleImageUpload(e.target.files[0], 'favicon');
            }
        });

        // Remove image handlers
        document.getElementById('removeLogo').addEventListener('click', () => {
            this.removeImage('logo');
        });

        document.getElementById('removeFavicon').addEventListener('click', () => {
            this.removeImage('favicon');
        });

        // Color picker sync
        document.getElementById('primaryColor').addEventListener('change', (e) => {
            document.getElementById('primaryColorText').value = e.target.value;
            this.updateColorPreview();
        });

        document.getElementById('primaryColorText').addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                document.getElementById('primaryColor').value = e.target.value;
                this.updateColorPreview();
            }
        });

        document.getElementById('secondaryColor').addEventListener('change', (e) => {
            document.getElementById('secondaryColorText').value = e.target.value;
            this.updateColorPreview();
        });

        document.getElementById('secondaryColorText').addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                document.getElementById('secondaryColor').value = e.target.value;
                this.updateColorPreview();
            }
        });

        // Live preview updates
        document.getElementById('siteName').addEventListener('input', () => this.updateLivePreview());
        document.getElementById('heroTitle').addEventListener('input', () => this.updateLivePreview());
        document.getElementById('heroSubtitle').addEventListener('input', () => this.updateLivePreview());
        document.getElementById('heroDescription').addEventListener('input', () => this.updateLivePreview());

        // Save customization
        document.getElementById('saveCustomization').addEventListener('click', () => {
            this.saveCustomization();
        });

        // Request filters
        document.getElementById('requestStatusFilter').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.loadRequests();
        });

        document.getElementById('requestTypeFilter').addEventListener('change', (e) => {
            this.currentFilters.content_type = e.target.value;
            this.loadRequests();
        });
    }

    initializeImagePreviews() {
        // Set initial image previews from client data
        if (this.clientData.logo_url) {
            document.getElementById('logoPreview').src = this.clientData.logo_url;
            document.getElementById('currentLogoUrl').value = this.clientData.logo_url;
            document.getElementById('previewLogo').src = this.clientData.logo_url;
        }
        
        if (this.clientData.favicon_url) {
            document.getElementById('faviconPreview').src = this.clientData.favicon_url;
            document.getElementById('currentFaviconUrl').value = this.clientData.favicon_url;
        }
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white', 'border-primary');
            btn.classList.add('text-slate-400', 'hover:text-white', 'hover:border-slate-400', 'border-transparent');
        });

        // Show selected tab content
        const selectedContent = document.getElementById(tabName + 'Tab');
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
        }

        // Add active class to selected tab button
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('bg-primary', 'text-white', 'border-primary');
            selectedBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:border-slate-400', 'border-transparent');
        }

        // Load specific tab data if needed
        if (tabName === 'analytics') {
            this.loadAnalytics();
        } else if (tabName === 'requests') {
            this.loadRequests();
        }
    }

    async handleImageUpload(file, type) {
        // Validate file
        const maxSize = type === 'favicon' ? 1024 * 1024 : 2 * 1024 * 1024; // 1MB for favicon, 2MB for logo
        if (file.size > maxSize) {
            this.showToast(`Arquivo muito grande. Máximo: ${type === 'favicon' ? '1MB' : '2MB'}`, 'error');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (type === 'favicon') {
            allowedTypes.push('image/x-icon', 'image/vnd.microsoft.icon');
        }

        if (!allowedTypes.includes(file.type)) {
            this.showToast('Formato de arquivo não suportado', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('tenant_id', this.clientData.id);

            this.showToast('Fazendo upload da imagem...', 'info');

            const response = await fetch('/admin/upload.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro no upload');
            }

            // Update preview and hidden field
            this.updateImagePreview(type, result.url);
            this.showToast('Imagem carregada com sucesso!', 'success');

        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    removeImage(type) {
        // Clear file input
        document.getElementById(type + 'Input').value = '';
        
        // Update preview and hidden field
        this.updateImagePreview(type, '');
        
        this.showToast(`${type === 'logo' ? 'Logo' : 'Favicon'} removido`, 'info');
    }

    updateImagePreview(type, url) {
        const preview = document.getElementById(type + 'Preview');
        const hiddenField = document.getElementById('current' + (type === 'logo' ? 'Logo' : 'Favicon') + 'Url');
        const defaultUrl = type === 'logo' ? '/assets/images/placeholder-logo.png' : '/assets/images/placeholder-favicon.png';
        
        preview.src = url || defaultUrl;
        hiddenField.value = url || '';

        // Update live preview for logo
        if (type === 'logo') {
            document.getElementById('previewLogo').src = url || defaultUrl;
        }
    }

    updateColorPreview() {
        const primaryColor = document.getElementById('primaryColorText').value;
        const secondaryColor = document.getElementById('secondaryColorText').value;
        
        // Update CSS variables for live preview
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    }

    updateLivePreview() {
        const siteName = document.getElementById('siteName').value || 'Nome do Site';
        const heroTitle = document.getElementById('heroTitle').value || 'Título Principal';
        const heroSubtitle = document.getElementById('heroSubtitle').value || 'Subtítulo';
        const heroDescription = document.getElementById('heroDescription').value || 'Descrição do hero';

        document.getElementById('previewSiteName').textContent = siteName;
        document.getElementById('previewHeroTitle').textContent = heroTitle;
        document.getElementById('previewHeroSubtitle').textContent = heroSubtitle;
        document.getElementById('previewHeroDescription').textContent = heroDescription;
    }

    async saveCustomization() {
        const saveBtn = document.getElementById('saveCustomization');
        const originalText = saveBtn.textContent;
        
        // Collect form data
        const formData = {
            name: document.getElementById('companyName').value.trim(),
            site_name: document.getElementById('siteName').value.trim(),
            site_tagline: document.getElementById('siteTagline').value.trim(),
            site_description: document.getElementById('siteDescription').value.trim(),
            hero_title: document.getElementById('heroTitle').value.trim(),
            hero_subtitle: document.getElementById('heroSubtitle').value.trim(),
            hero_description: document.getElementById('heroDescription').value.trim(),
            contact_email: document.getElementById('contactEmail').value.trim(),
            contact_whatsapp: document.getElementById('contactWhatsapp').value.trim(),
            primary_color: document.getElementById('primaryColorText').value,
            secondary_color: document.getElementById('secondaryColorText').value,
            logo_url: document.getElementById('currentLogoUrl').value,
            favicon_url: document.getElementById('currentFaviconUrl').value
        };

        // Validate required fields
        if (!formData.name || !formData.site_name) {
            this.showToast('Nome da empresa e nome do site são obrigatórios', 'error');
            return;
        }

        // Show loading
        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';

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
                    // Handle validation errors
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

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/client-requests.php/stats');
            const stats = await response.json();

            if (!response.ok) {
                throw new Error(stats.error || 'Erro ao carregar estatísticas');
            }

            // Update overview stats
            document.getElementById('totalRequests').textContent = stats.total || 0;
            document.getElementById('pendingRequests').textContent = stats.pending || 0;
            document.getElementById('approvedRequests').textContent = stats.approved || 0;
            document.getElementById('deniedRequests').textContent = stats.denied || 0;

        } catch (error) {
            console.error('Error loading stats:', error);
        }
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
        const container = document.getElementById('clientRequestsList');

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
                            
                            <div class="flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${statusClass}">
                                <i data-lucide="${statusIcon}" class="h-4 w-4"></i>
                                <span>${statusText}</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2 text-sm text-slate-400">
                                <i data-lucide="calendar" class="h-4 w-4"></i>
                                <span>${this.formatDate(request.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
            document.getElementById('analyticsContent').innerHTML = `
                <div class="text-center py-12">
                    <p class="text-red-400">Erro ao carregar analytics</p>
                </div>
            `;
        }
    }

    renderAnalytics(analytics) {
        document.getElementById('analyticsContent').innerHTML = `
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-white mb-2">${analytics.approval_rate}%</div>
                    <div class="text-sm text-slate-400">Taxa de Aprovação</div>
                </div>
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-white mb-2">${analytics.daily_average}</div>
                    <div class="text-sm text-slate-400">Média Diária</div>
                </div>
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-white mb-2">${analytics.most_requested_type}</div>
                    <div class="text-sm text-slate-400">Mais Solicitado</div>
                </div>
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-white mb-2">30</div>
                    <div class="text-sm text-slate-400">Dias de Dados</div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Solicitações dos Últimos 30 Dias</h3>
                <div class="h-64 flex items-center justify-center text-slate-400">
                    <p>Gráfico de solicitações diárias será implementado aqui</p>
                </div>
            </div>
        `;
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

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('pt-BR');
    }

    showError(message) {
        const container = document.getElementById('clientRequestsList');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                        <p class="text-red-400 font-medium">${message}</p>
                    </div>
                </div>
            `;
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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new ClientDashboardApp();
});