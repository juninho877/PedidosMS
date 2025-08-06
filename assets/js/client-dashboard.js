class ClientDashboardApp {
    constructor() {
        this.clientData = window.CLIENT_DATA || {};
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOverviewData();
    }

    setupEventListeners() {
        // Tab buttons
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
        this.currentTab = tabName;

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
            } else {
                console.error('Error loading stats:', stats.error);
            }
        } catch (error) {
            console.error('Error loading overview data:', error);
        }
    }

    async loadRequestsData() {
        const statusFilter = document.getElementById('requestStatusFilter').value;
        const typeFilter = document.getElementById('requestTypeFilter').value;

        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('content_type', typeFilter);

        try {
            const response = await fetch(`/api/client-requests.php${params.toString() ? '?' + params.toString() : ''}`);
            const requests = await response.json();

            if (response.ok) {
                this.renderRequestsList(requests);
            } else {
                console.error('Error loading requests:', requests.error);
                this.showRequestsError(requests.error || 'Erro ao carregar solicitações');
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            this.showRequestsError('Erro de conexão');
        }
    }

    renderRequestsList(requests) {
        const container = document.getElementById('clientRequestsList');
        
        if (requests.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i data-lucide="inbox" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-300 mb-2">Nenhuma solicitação encontrada</h3>
                    <p class="text-slate-500">Não há solicitações com os filtros selecionados.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = `
            <div class="space-y-4">
                ${requests.map(request => this.getRequestItemHTML(request)).join('')}
            </div>
        `;

        lucide.createIcons();
    }

    getRequestItemHTML(request) {
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
            `https://image.tmdb.org/t/p/w200${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                <div class="flex gap-4">
                    <div class="flex-shrink-0">
                        <img
                            src="${posterUrl}"
                            alt="${request.content_title}"
                            class="w-12 h-18 object-cover rounded-lg"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-1">
                                    ${request.content_title}
                                </h3>
                                <div class="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-2">
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
                                <div class="flex items-center space-x-1 text-sm text-slate-400">
                                    <i data-lucide="phone" class="h-4 w-4"></i>
                                    <span>+${this.formatWhatsApp(request.requester_whatsapp)}</span>
                                    <a 
                                        href="https://wa.me/${request.requester_whatsapp}" 
                                        target="_blank"
                                        class="ml-2 text-green-400 hover:text-green-300 transition-colors"
                                    >
                                        <i data-lucide="message-circle" class="h-4 w-4"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="flex flex-col items-end space-y-2">
                                <span class="px-3 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}">
                                    ${statusLabels[request.status]}
                                </span>
                                <div class="flex space-x-2">
                                    ${request.status === 'pending' ? `
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved')"
                                            class="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                            title="Aprovar"
                                        >
                                            <i data-lucide="check" class="h-4 w-4"></i>
                                        </button>
                                        <button
                                            onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied')"
                                            class="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                            title="Negar"
                                        >
                                            <i data-lucide="x" class="h-4 w-4"></i>
                                        </button>
                                    ` : ''}
                                    <button
                                        onclick="clientDashboard.viewRequestDetails(${request.id})"
                                        class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        title="Ver Detalhes"
                                    >
                                        <i data-lucide="eye" class="h-4 w-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
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

            if (response.ok) {
                this.showToast(`Solicitação ${status === 'approved' ? 'aprovada' : 'negada'} com sucesso!`, 'success');
                this.loadRequestsData(); // Reload the list
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
                this.showRequestDetailsModal(request);
            } else {
                this.showToast(request.error || 'Erro ao carregar detalhes', 'error');
            }
        } catch (error) {
            console.error('Error loading request details:', error);
            this.showToast('Erro de conexão', 'error');
        }
    }

    showRequestDetailsModal(request) {
        const modal = document.createElement('div');
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
                            src="${request.poster_path ? `https://image.tmdb.org/t/p/w200${request.poster_path}` : '/assets/images/placeholder-poster.jpg'}"
                            alt="${request.content_title}"
                            class="w-20 h-30 object-cover rounded-lg"
                        />
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-2">${request.content_title}</h3>
                            <div class="space-y-1 text-sm text-slate-400">
                                <p><strong>Tipo:</strong> ${request.content_type === 'movie' ? 'Filme' : 'Série'}</p>
                                <p><strong>Solicitante:</strong> ${request.requester_name}</p>
                                <p><strong>WhatsApp:</strong> +${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                <p><strong>Data:</strong> ${new Date(request.created_at).toLocaleString('pt-BR')}</p>
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
                document.body.removeChild(modal);
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

    showRequestsError(message) {
        const container = document.getElementById('clientRequestsList');
        container.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="alert-circle" class="h-16 w-16 text-red-500 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-slate-300 mb-2">Erro ao carregar solicitações</h3>
                <p class="text-slate-500">${message}</p>
            </div>
        `;
        lucide.createIcons();
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

        // Text fields sync with preview
        const textFields = ['companyName', 'siteName', 'siteTagline', 'heroTitle', 'heroSubtitle', 'heroDescription'];
        textFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.updatePreview());
            }
        });

        // Image uploads
        this.setupImageUploads();

        // Save button
        const saveBtn = document.getElementById('saveCustomization');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCustomization());
        }
    }

    setupImageUploads() {
        // Logo upload
        const logoInput = document.getElementById('logoInput');
        const removeLogo = document.getElementById('removeLogo');

        if (logoInput) {
            logoInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.uploadImage(e.target.files[0], 'logo');
                }
            });
        }

        if (removeLogo) {
            removeLogo.addEventListener('click', () => {
                document.getElementById('currentLogoUrl').value = '';
                document.getElementById('logoPreview').src = '/assets/images/placeholder-logo.png';
                this.updatePreview();
            });
        }

        // Favicon upload
        const faviconInput = document.getElementById('faviconInput');
        const removeFavicon = document.getElementById('removeFavicon');

        if (faviconInput) {
            faviconInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.uploadImage(e.target.files[0], 'favicon');
                }
            });
        }

        if (removeFavicon) {
            removeFavicon.addEventListener('click', () => {
                document.getElementById('currentFaviconUrl').value = '';
                document.getElementById('faviconPreview').src = '/assets/images/placeholder-favicon.png';
                this.updatePreview();
            });
        }
    }

    async uploadImage(file, type) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('tenant_id', this.clientData.id);

        try {
            console.log('Uploading image:', { type, fileName: file.name, size: file.size });
            
            const response = await fetch('/admin/upload.php', {
                method: 'POST',
                body: formData
            });

            console.log('Upload response status:', response.status);
            const responseText = await response.text();
            console.log('Upload response text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.error('JSON parse error:', e);
                throw new Error('Resposta inválida do servidor: ' + responseText);
            }

            if (response.ok && result.success) {
                // Update preview and hidden field
                if (type === 'logo') {
                    document.getElementById('logoPreview').src = result.url;
                    document.getElementById('currentLogoUrl').value = result.url;
                } else {
                    document.getElementById('faviconPreview').src = result.url;
                    document.getElementById('currentFaviconUrl').value = result.url;
                }
                
                this.updatePreview();
                this.showToast(`${type === 'logo' ? 'Logo' : 'Favicon'} enviado com sucesso!`, 'success');
            } else {
                throw new Error(result.error || 'Erro no upload');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showToast('Erro no upload: ' + error.message, 'error');
        }
    }

    updatePreview() {
        // Update preview elements
        const previewLogo = document.getElementById('previewLogo');
        const previewSiteName = document.getElementById('previewSiteName');
        const previewHeroTitle = document.getElementById('previewHeroTitle');
        const previewHeroSubtitle = document.getElementById('previewHeroSubtitle');
        const previewHeroDescription = document.getElementById('previewHeroDescription');

        if (previewLogo) {
            const logoUrl = document.getElementById('currentLogoUrl').value || '/assets/images/placeholder-logo.png';
            previewLogo.src = logoUrl;
        }

        if (previewSiteName) {
            previewSiteName.textContent = document.getElementById('siteName').value || 'Nome do Site';
        }

        if (previewHeroTitle) {
            previewHeroTitle.textContent = document.getElementById('heroTitle').value || 'Título Principal';
        }

        if (previewHeroSubtitle) {
            previewHeroSubtitle.textContent = document.getElementById('heroSubtitle').value || 'Subtítulo';
        }

        if (previewHeroDescription) {
            previewHeroDescription.textContent = document.getElementById('heroDescription').value || 'Descrição do hero';
        }
    }

    setupCustomizationPreview() {
        this.updatePreview();
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
            contact_whatsapp: document.getElementById('contactWhatsapp').value.replace(/\D/g, ''),
            primary_color: document.getElementById('primaryColor').value,
            secondary_color: document.getElementById('secondaryColor').value,
            logo_url: document.getElementById('currentLogoUrl').value,
            favicon_url: document.getElementById('currentFaviconUrl').value
        };

        // Basic validation
        if (!formData.name || !formData.site_name) {
            this.showToast('Nome da empresa e nome do site são obrigatórios', 'error');
            return;
        }

        // Disable button and show loading
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

            if (response.ok) {
                this.showToast('Configurações salvas com sucesso!', 'success');
                // Update client data
                this.clientData = { ...this.clientData, ...formData };
                window.CLIENT_DATA = this.clientData;
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).join(', ');
                    this.showToast(errorMessages, 'error');
                } else {
                    this.showToast(result.error || 'Erro ao salvar configurações', 'error');
                }
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
                console.error('Error loading analytics:', analytics.error);
                this.showAnalyticsError(analytics.error || 'Erro ao carregar analytics');
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            this.showAnalyticsError('Erro de conexão');
        }
    }

    renderAnalytics(analytics) {
        const container = document.getElementById('analyticsContent');
        
        container.innerHTML = `
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.approval_rate}%</p>
                            <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="calendar" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.daily_average}</p>
                            <p class="text-sm text-slate-400">Média Diária</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3 mb-4">
                        <i data-lucide="star" class="h-8 w-8 text-purple-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.most_requested_type}</p>
                            <p class="text-sm text-slate-400">Mais Solicitado</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Atividade dos Últimos 30 Dias</h3>
                <div class="space-y-2">
                    ${analytics.daily_requests.length > 0 ? 
                        analytics.daily_requests.map(day => `
                            <div class="flex justify-between items-center py-2 px-3 bg-slate-700/50 rounded-lg">
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

    showAnalyticsError(message) {
        const container = document.getElementById('analyticsContent');
        container.innerHTML = `
            <div class="text-center py-12">
                <i data-lucide="alert-circle" class="h-16 w-16 text-red-500 mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-slate-300 mb-2">Erro ao carregar analytics</h3>
                <p class="text-slate-500">${message}</p>
            </div>
        `;
        lucide.createIcons();
    }

    formatWhatsApp(value) {
        if (!value) return '';
        const str = value.toString();
        if (str.length <= 2) return str;
        if (str.length <= 4) return `${str.slice(0, 2)} ${str.slice(2)}`;
        if (str.length <= 9) return `${str.slice(0, 2)} ${str.slice(2, 4)} ${str.slice(4)}`;
        return `${str.slice(0, 2)} ${str.slice(2, 4)} ${str.slice(4, 9)}-${str.slice(9, 13)}`;
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