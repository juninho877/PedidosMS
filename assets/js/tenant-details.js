class TenantDetailsApp {
    constructor(contentType, contentId) {
        this.contentType = contentType;
        this.contentId = contentId;
        this.tenantSlug = window.TENANT_SLUG || '';
        this.tmdbImageBaseUrl = window.TMDB_IMAGE_BASE_URL || '';
        this.init();
    }

    init() {
        this.loadContentDetails();
    }

    async loadContentDetails() {
        try {
            const response = await fetch(`/api/tmdb.php/${this.contentType}/${this.contentId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao carregar detalhes');
            }

            this.renderContentDetails(data);
        } catch (error) {
            this.showError(error.message);
        }
    }

    renderContentDetails(content) {
        const title = content.title || content.name;
        const date = content.release_date || content.first_air_date;
        const year = date ? new Date(date).getFullYear() : 'N/A';
        const trailer = content.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        const backdropUrl = content.backdrop_path ? 
            `${this.tmdbImageBaseUrl}/original${content.backdrop_path}` : '';
        const posterUrl = content.poster_path ? 
            `${this.tmdbImageBaseUrl}/w400${content.poster_path}` : 
            'https://via.placeholder.com/400x600/374151/ffffff?text=Sem+Poster';

        document.getElementById('contentDetails').innerHTML = `
            <!-- Hero Section -->
            <div class="relative">
                ${backdropUrl ? `
                    <div 
                        class="h-[60vh] bg-cover bg-center bg-no-repeat"
                        style="background-image: url(${backdropUrl})"
                    >
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                    </div>
                ` : `
                    <div class="h-[60vh] bg-gradient-to-br from-slate-800 to-slate-900">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                    </div>
                `}
                
                <div class="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex gap-8">
                            <div class="flex-shrink-0">
                                <img
                                    src="${posterUrl}"
                                    alt="${title}"
                                    class="w-56 h-84 object-cover rounded-lg shadow-xl border border-slate-700"
                                    onerror="this.src='https://via.placeholder.com/400x600/374151/ffffff?text=Sem+Poster'"
                                />
                            </div>
                            <div class="flex-1 space-y-4">
                                <h1 class="text-4xl font-bold text-white leading-tight">${title}</h1>
                                <div class="flex items-center gap-6 text-slate-300">
                                    <div class="flex items-center space-x-2">
                                        <i data-lucide="calendar" class="h-5 w-5"></i>
                                        <span>${year}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <i data-lucide="star" class="h-5 w-5 text-yellow-400"></i>
                                        <span>${content.vote_average.toFixed(1)}/10</span>
                                    </div>
                                    ${content.runtime ? `
                                        <div class="flex items-center space-x-2">
                                            <i data-lucide="clock" class="h-5 w-5"></i>
                                            <span>${content.runtime}min</span>
                                        </div>
                                    ` : ''}
                                </div>
                                <p class="text-slate-300 leading-relaxed max-w-3xl">
                                    ${content.overview || 'Sinopse não disponível.'}
                                </p>
                                <div class="flex items-center space-x-4 pt-4">
                                    <button
                                        id="requestBtn"
                                        class="flex items-center space-x-2 bg-secondary hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        <i data-lucide="message-square" class="h-5 w-5"></i>
                                        <span>Solicitar Conteúdo</span>
                                    </button>
                                    ${trailer ? `
                                        <a
                                            href="https://www.youtube.com/embed/${trailer.key}"
                                            target="_blank"
                                            class="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            <i data-lucide="play" class="h-5 w-5"></i>
                                            <span>Assistir Trailer</span>
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Details -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="grid lg:grid-cols-3 gap-12">
                    <!-- Main Content -->
                    <div class="lg:col-span-2 space-y-8">
                        ${this.getGenresHTML(content.genres)}
                        ${this.getCastHTML(content.credits?.cast)}
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        ${this.getSidebarHTML(content)}
                        <button
                            id="requestBtnSidebar"
                            class="w-full bg-secondary hover:opacity-90 text-white py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                            Solicitar este Conteúdo
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupRequestButtons(content);
        lucide.createIcons();
    }

    getGenresHTML(genres) {
        if (!genres || genres.length === 0) return '';

        return `
            <div>
                <h2 class="text-2xl font-bold text-white mb-4">Gêneros</h2>
                <div class="flex flex-wrap gap-2">
                    ${genres.map(genre => `
                        <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                            ${genre.name}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getCastHTML(cast) {
        if (!cast || cast.length === 0) return '';

        return `
            <div>
                <h2 class="text-2xl font-bold text-white mb-4">Elenco Principal</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    ${cast.slice(0, 8).map(actor => `
                        <div class="text-center">
                            <img
                                src="${actor.profile_path ? 
                                    `${this.tmdbImageBaseUrl}/w200${actor.profile_path}` : 
                                    'https://via.placeholder.com/200x300/374151/ffffff?text=Sem+Foto'
                                }"
                                alt="${actor.name}"
                                class="w-full h-32 object-cover rounded-lg mb-2"
                                onerror="this.src='https://via.placeholder.com/200x300/374151/ffffff?text=Sem+Foto'"
                            />
                            <p class="text-white font-medium text-sm">${actor.name}</p>
                            <p class="text-slate-400 text-xs">${actor.character}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getSidebarHTML(content) {
        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-xl font-semibold text-white mb-4">Informações</h3>
                <div class="space-y-3">
                    <div>
                        <span class="text-slate-400">Tipo:</span>
                        <span class="text-white ml-2">${this.contentType === 'movie' ? 'Filme' : 'Série'}</span>
                    </div>
                    <div>
                        <span class="text-slate-400">Avaliação:</span>
                        <span class="text-white ml-2">${content.vote_average.toFixed(1)}/10</span>
                    </div>
                    ${content.runtime ? `
                        <div>
                            <span class="text-slate-400">Duração:</span>
                            <span class="text-white ml-2">${content.runtime} minutos</span>
                        </div>
                    ` : ''}
                    ${content.number_of_seasons ? `
                        <div>
                            <span class="text-slate-400">Temporadas:</span>
                            <span class="text-white ml-2">${content.number_of_seasons}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    setupRequestButtons(content) {
        const requestBtn = document.getElementById('requestBtn');
        const requestBtnSidebar = document.getElementById('requestBtnSidebar');

        const openModal = () => {
            this.openRequestModal(content);
        };

        if (requestBtn) requestBtn.addEventListener('click', openModal);
        if (requestBtnSidebar) requestBtnSidebar.addEventListener('click', openModal);
    }

    openRequestModal(content) {
        const title = content.title || content.name;
        const posterUrl = content.poster_path ? 
            `${this.tmdbImageBaseUrl}/w200${content.poster_path}` : 
            'https://via.placeholder.com/200x300/374151/ffffff?text=Sem+Poster';

        const modal = document.getElementById('requestModal');
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="message-square" class="h-6 w-6 text-primary"></i>
                        <h2 class="text-xl font-semibold text-white">Solicitar Conteúdo</h2>
                    </div>
                    <button
                        id="closeModal"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <div class="p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-4">
                        <img
                            src="${posterUrl}"
                            alt="${title}"
                            class="w-16 h-24 object-cover rounded-lg"
                            onerror="this.src='https://via.placeholder.com/200x300/374151/ffffff?text=Sem+Poster'"
                        />
                        <div>
                            <h3 class="text-lg font-semibold text-white">${title}</h3>
                            <p class="text-slate-400 capitalize">${this.contentType === 'movie' ? 'Filme' : 'Série'}</p>
                        </div>
                    </div>
                </div>

                <form id="requestForm" class="p-6 space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Seu Nome *</label>
                        <input
                            type="text"
                            id="requesterName"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Digite seu nome completo"
                            required
                        />
                        <div id="nameError" class="text-red-400 text-sm mt-1 hidden"></div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp * (formato: 5511999999999)</label>
                        <input
                            type="text"
                            id="requesterWhatsapp"
                            value="55"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="11999999999"
                            required
                        />
                        <div id="whatsappError" class="text-red-400 text-sm mt-1 hidden"></div>
                    </div>

                    ${this.contentType === 'tv' ? `
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Temporada (opcional)</label>
                                <input
                                    type="number"
                                    id="season"
                                    min="1"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Ex: 1"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Episódio (opcional)</label>
                                <input
                                    type="number"
                                    id="episode"
                                    min="1"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Ex: 5"
                                />
                            </div>
                        </div>
                    ` : ''}

                    <div class="bg-slate-700/50 rounded-lg p-4">
                        <p class="text-sm text-slate-400">
                            <strong>Importante:</strong> Ao solicitar este conteúdo, você receberá atualizações sobre o status 
                            da sua solicitação através do WhatsApp fornecido.
                        </p>
                    </div>

                    <div class="flex space-x-4">
                        <button
                            type="button"
                            id="cancelBtn"
                            class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            id="submitBtn"
                            class="flex-1 bg-secondary hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Enviar Solicitação
                        </button>
                    </div>
                </form>
            </div>
        `;

        this.setupModalEventListeners(content);
        lucide.createIcons();
    }

    setupModalEventListeners(content) {
        const modal = document.getElementById('requestModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('requestForm');

        const closeModal = () => {
            modal.classList.add('hidden');
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRequest(content);
        });
    }

    async submitRequest(content) {
        const submitBtn = document.getElementById('submitBtn');
        const title = content.title || content.name;

        const formData = {
            content_id: content.id,
            content_type: this.contentType,
            content_title: title,
            requester_name: document.getElementById('requesterName').value.trim(),
            requester_whatsapp: document.getElementById('requesterWhatsapp').value.replace(/\D/g, ''),
            poster_path: content.poster_path,
            tenant_slug: this.tenantSlug
        };

        if (this.contentType === 'tv') {
            const season = document.getElementById('season').value;
            const episode = document.getElementById('episode').value;
            if (season) formData.season = parseInt(season);
            if (episode) formData.episode = parseInt(episode);
        }

        this.clearFormErrors();

        const errors = this.validateRequestForm(formData);
        if (Object.keys(errors).length > 0) {
            this.showFormErrors(errors);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/tenant-requests.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    this.showFormErrors(result.errors);
                } else {
                    throw new Error(result.error || 'Erro ao enviar solicitação');
                }
                return;
            }

            this.showSuccessModal();

        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Solicitação';
        }
    }

    validateRequestForm(data) {
        const errors = {};

        if (!data.requester_name || data.requester_name.length < 2) {
            errors.requester_name = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (!data.requester_whatsapp || !/^55\d{10,11}$/.test(data.requester_whatsapp)) {
            errors.requester_whatsapp = 'WhatsApp deve estar no formato: 5511999999999';
        }

        return errors;
    }

    showFormErrors(errors) {
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(field === 'requester_name' ? 'nameError' : 'whatsappError');
            if (errorElement) {
                errorElement.textContent = errors[field];
                errorElement.classList.remove('hidden');
            }
        });
    }

    clearFormErrors() {
        const errorElements = ['nameError', 'whatsappError'];
        errorElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });
    }

    showSuccessModal() {
        const modal = document.getElementById('requestModal');
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-8 text-center mx-4">
                <i data-lucide="check-circle" class="h-16 w-16 text-green-400 mx-auto mb-4"></i>
                <h3 class="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h3>
                <p class="text-slate-400 mb-6">
                    Sua solicitação foi recebida e será analisada pela nossa equipe. 
                    Você receberá atualizações via WhatsApp.
                </p>
            </div>
        `;

        lucide.createIcons();

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 3000);
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

    showError(message) {
        document.getElementById('contentDetails').innerHTML = `
            <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div class="text-center">
                    <p class="text-red-400 mb-4">${message}</p>
                    <a href="/${encodeURIComponent(this.tenantSlug)}/search" class="text-primary hover:opacity-80">
                        Voltar à pesquisa
                    </a>
                </div>
            </div>
        `;
    }
}