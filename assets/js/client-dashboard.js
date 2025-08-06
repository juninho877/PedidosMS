class ClientDashboardApp {
    constructor() {
        this.clientData = window.CLIENT_DATA || {};
        this.currentTab = 'overview';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadOverviewData();
        this.setupColorPickers();
        this.setupImageUploads();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Save customization
        const saveBtn = document.getElementById('saveCustomization');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCustomization();
            });
        }

        // Filter changes for requests
        const statusFilter = document.getElementById('requestStatusFilter');
        const typeFilter = document.getElementById('requestTypeFilter');
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.loadClientRequests();
            });
        }
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.loadClientRequests();
            });
        }
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update current tab
        this.currentTab = tabName;

        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Show selected tab content
        const selectedTab = document.getElementById(tabName + 'Tab');
        if (selectedTab) {
            selectedTab.classList.remove('hidden');
        }

        // Update tab button states
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const btnTab = btn.getAttribute('data-tab');
            if (btnTab === tabName) {
                btn.className = 'tab-btn py-4 px-2 border-b-2 font-medium text-sm transition-colors bg-primary text-white border-primary';
            } else {
                btn.className = 'tab-btn py-4 px-2 border-b-2 border-transparent font-medium text-sm transition-colors text-slate-400 hover:text-white hover:border-slate-400';
            }
        });

        // Load tab-specific data
        switch (tabName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'requests':
                this.loadClientRequests();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'customization':
                this.updatePreview();
                break;
        }

        // Re-initialize Lucide icons
        lucide.createIcons();
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

    async loadClientRequests() {
        try {
            const statusFilter = document.getElementById('requestStatusFilter');
            const typeFilter = document.getElementById('requestTypeFilter');
            
            const params = new URLSearchParams();
            if (statusFilter && statusFilter.value) params.append('status', statusFilter.value);
            if (typeFilter && typeFilter.value) params.append('content_type', typeFilter.value);

            const response = await fetch(`/api/client-requests.php?${params}`);
            const requests = await response.json();

            if (response.ok) {
                this.renderClientRequests(requests);
            } else {
                throw new Error(requests.error || 'Erro ao carregar solicitações');
            }
        } catch (error) {
            console.error('Error loading requests:', error);
            this.showError('Erro ao carregar solicitações: ' + error.message);
        }
    }

    renderClientRequests(requests) {
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
                    <img
                        src="${posterUrl}"
                        alt="${request.content_title}"
                        class="w-16 h-24 object-cover rounded-lg border border-slate-700"
                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                    />
                    
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="text-lg font-semibold text-white mb-1">
                                    ${request.content_title}
                                </h3>
                                <div class="flex items-center gap-4 text-sm text-slate-400">
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
                                <span class="truncate">${this.formatWhatsApp(request.requester_whatsapp)}</span>
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

    async loadAnalytics() {
        try {
            const response = await fetch('/api/client-analytics.php');
            const analytics = await response.json();

            if (response.ok) {
                this.renderAnalytics(analytics);
            } else {
                throw new Error(analytics.error || 'Erro ao carregar analytics');
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            document.getElementById('analyticsContent').innerHTML = `
                <div class="text-center py-8">
                    <p class="text-red-400">Erro ao carregar analytics: ${error.message}</p>
                </div>
            `;
        }
    }

    renderAnalytics(analytics) {
        document.getElementById('analyticsContent').innerHTML = `
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="trending-up" class="h-8 w-8 text-blue-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.approval_rate}%</p>
                            <p class="text-sm text-slate-400">Taxa de Aprovação</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="calendar" class="h-8 w-8 text-green-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.daily_average}</p>
                            <p class="text-sm text-slate-400">Média Diária</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="star" class="h-8 w-8 text-purple-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.most_requested_type}</p>
                            <p class="text-sm text-slate-400">Mais Solicitado</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="activity" class="h-8 w-8 text-yellow-400"></i>
                        <div>
                            <p class="text-2xl font-bold text-white">${analytics.daily_requests.length}</p>
                            <p class="text-sm text-slate-400">Dias com Atividade</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Solicitações dos Últimos 30 Dias</h3>
                <div class="space-y-2">
                    ${analytics.daily_requests.length > 0 ? 
                        analytics.daily_requests.map(day => `
                            <div class="flex items-center justify-between py-2 px-3 bg-slate-700/30 rounded">
                                <span class="text-slate-300">${this.formatDate(day.date)}</span>
                                <span class="text-white font-medium">${day.count} solicitação(ões)</span>
                            </div>
                        `).join('') :
                        '<p class="text-slate-400 text-center py-4">Nenhuma atividade nos últimos 30 dias</p>'
                    }
                </div>
            </div>
        `;

        lucide.createIcons();
    }

    setupColorPickers() {
        const primaryColor = document.getElementById('primaryColor');
        const primaryColorText = document.getElementById('primaryColorText');
        const secondaryColor = document.getElementById('secondaryColor');
        const secondaryColorText = document.getElementById('secondaryColorText');

        if (primaryColor && primaryColorText) {
            primaryColor.addEventListener('change', (e) => {
                primaryColorText.value = e.target.value;
                this.updatePreview();
            });

            primaryColorText.addEventListener('input', (e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    primaryColor.value = value;
                    this.updatePreview();
                }
            });
        }

        if (secondaryColor && secondaryColorText) {
            secondaryColor.addEventListener('change', (e) => {
                secondaryColorText.value = e.target.value;
                this.updatePreview();
            });

            secondaryColorText.addEventListener('input', (e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    secondaryColor.value = value;
                    this.updatePreview();
                }
            });
        }

        // Setup other form field listeners for preview
        const previewFields = ['companyName', 'siteName', 'siteTagline', 'heroTitle', 'heroSubtitle', 'heroDescription'];
        previewFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.updatePreview();
                });
            }
        });
    }

    setupImageUploads() {
        // Logo upload
        const logoInput = document.getElementById('logoInput');
        const removeLogo = document.getElementById('removeLogo');

        if (logoInput) {
            logoInput.addEventListener('change', (e) => {
                this.handleImageUpload(e, 'logo');
            });
        }

        if (removeLogo) {
            removeLogo.addEventListener('click', () => {
                this.removeImage('logo');
            });
        }

        // Favicon upload
        const faviconInput = document.getElementById('faviconInput');
        const removeFavicon = document.getElementById('removeFavicon');

        if (faviconInput) {
            faviconInput.addEventListener('change', (e) => {
                this.handleImageUpload(e, 'favicon');
            });
        }

        if (removeFavicon) {
            removeFavicon.addEventListener('click', () => {
                this.removeImage('favicon');
            });
        }
    }

    async handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 1 * 1024 * 1024; // 2MB for logo, 1MB for favicon
        if (file.size > maxSize) {
            this.showToast(`Arquivo muito grande. Máximo ${type === 'logo' ? '2MB' : '1MB'}.`, 'error');
            return;
        }

        const allowedTypes = type === 'logo' ? 
            ['image/jpeg', 'image/png', 'image/gif'] : 
            ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png'];

        if (!allowedTypes.includes(file.type)) {
            this.showToast('Tipo de arquivo não permitido.', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('tenant_id', this.clientData.id);

            console.log('Uploading file:', file.name, 'Type:', type, 'Tenant ID:', this.clientData.id);

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
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                throw new Error('Resposta inválida do servidor');
            }

            if (!response.ok) {
                throw new Error(result.error || 'Erro no upload');
            }

            // Update preview and hidden field
            const previewImg = document.getElementById(type + 'Preview');
            const hiddenField = document.getElementById('current' + type.charAt(0).toUpperCase() + type.slice(1) + 'Url');

            if (previewImg) {
                previewImg.src = result.url;
            }

            if (hiddenField) {
                hiddenField.value = result.url;
            }

            this.updatePreview();
            this.showToast('Upload realizado com sucesso!', 'success');

        } catch (error) {
            console.error('Upload error:', error);
            this.showToast('Erro no upload: ' + error.message, 'error');
        }
    }

    removeImage(type) {
        const previewImg = document.getElementById(type + 'Preview');
        const hiddenField = document.getElementById('current' + type.charAt(0).toUpperCase() + type.slice(1) + 'Url');
        const fileInput = document.getElementById(type + 'Input');

        const defaultUrl = `/assets/images/placeholder-${type}.png`;

        if (previewImg) {
            previewImg.src = defaultUrl;
        }

        if (hiddenField) {
            hiddenField.value = '';
        }

        if (fileInput) {
            fileInput.value = '';
        }

        this.updatePreview();
        this.showToast('Imagem removida', 'info');
    }

    updatePreview() {
        // Update preview elements
        const previewLogo = document.getElementById('previewLogo');
        const previewSiteName = document.getElementById('previewSiteName');
        const previewHeroTitle = document.getElementById('previewHeroTitle');
        const previewHeroSubtitle = document.getElementById('previewHeroSubtitle');
        const previewHeroDescription = document.getElementById('previewHeroDescription');

        if (previewLogo) {
            const logoUrl = document.getElementById('currentLogoUrl')?.value || '/assets/images/placeholder-logo.png';
            previewLogo.src = logoUrl;
        }

        if (previewSiteName) {
            previewSiteName.textContent = document.getElementById('siteName')?.value || 'Nome do Site';
        }

        if (previewHeroTitle) {
            previewHeroTitle.textContent = document.getElementById('heroTitle')?.value || 'Título Principal';
        }

        if (previewHeroSubtitle) {
            previewHeroSubtitle.textContent = document.getElementById('heroSubtitle')?.value || 'Subtítulo';
        }

        if (previewHeroDescription) {
            previewHeroDescription.textContent = document.getElementById('heroDescription')?.value || 'Descrição do hero';
        }
    }

    async saveCustomization() {
        const saveBtn = document.getElementById('saveCustomization');
        
        // Collect form data
        const formData = {
            name: document.getElementById('companyName')?.value?.trim() || '',
            site_name: document.getElementById('siteName')?.value?.trim() || '',
            site_tagline: document.getElementById('siteTagline')?.value?.trim() || '',
            site_description: document.getElementById('siteDescription')?.value?.trim() || '',
            hero_title: document.getElementById('heroTitle')?.value?.trim() || '',
            hero_subtitle: document.getElementById('heroSubtitle')?.value?.trim() || '',
            hero_description: document.getElementById('heroDescription')?.value?.trim() || '',
            contact_email: document.getElementById('contactEmail')?.value?.trim() || '',
            contact_whatsapp: document.getElementById('contactWhatsapp')?.value?.replace(/\D/g, '') || '',
            primary_color: document.getElementById('primaryColorText')?.value || '',
            secondary_color: document.getElementById('secondaryColorText')?.value || '',
            logo_url: document.getElementById('currentLogoUrl')?.value || '',
            favicon_url: document.getElementById('currentFaviconUrl')?.value || ''
        };

        console.log('Saving customization data:', formData);

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

            console.log('Save response status:', response.status);
            
            const responseText = await response.text();
            console.log('Save response text:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                console.error('Response was:', responseText);
                throw new Error('Resposta inválida do servidor. Verifique os logs.');
            }

            if (!response.ok) {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).join(', ');
                    throw new Error(errorMessages);
                } else {
                    throw new Error(result.error || 'Erro ao salvar configurações');
                }
            }

            // Update client data
            if (result.data) {
                this.clientData = { ...this.clientData, ...result.data };
                window.CLIENT_DATA = this.clientData;
            }

            this.showToast('Configurações salvas com sucesso!', 'success');

        } catch (error) {
            console.error('Save error:', error);
            this.showToast('Erro ao salvar: ' + error.message, 'error');
        } finally {
            // Reset button
            saveBtn.disabled = false;
            saveBtn.textContent = 'Salvar Configurações';
        }
    }

    showError(message) {
        const container = document.getElementById('clientRequestsList') || document.getElementById('analyticsContent');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8">
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