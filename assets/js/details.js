class DetailsApp {
    constructor(contentType, contentId) {
        this.contentType = contentType;
        this.contentId = contentId;
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
            `https://image.tmdb.org/t/p/original${content.backdrop_path}` : '';
        const posterUrl = content.poster_path ? 
            `https://image.tmdb.org/t/p/w400${content.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

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
                
                <div class="absolute bottom-0 left-0 right-0 p-8">
                    <div class="max-w-7xl mx-auto">
                        <div class="flex flex-col md:flex-row gap-8">
                            <div class="flex-shrink-0">
                                <img
                                    src="${posterUrl}"
                                    alt="${title}"
                                    class="w-64 h-96 object-cover rounded-lg shadow-xl border border-slate-700"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                            </div>
                            <div class="flex-1 space-y-4">
                                <h1 class="text-4xl md:text-5xl font-bold text-white">${title}</h1>
                                <div class="flex items-center space-x-6 text-slate-300">
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
                                    ${content.number_of_seasons ? `
                                        <div class="flex items-center space-x-2">
                                            <i data-lucide="users" class="h-5 w-5"></i>
                                            <span>${content.number_of_seasons} temporada(s)</span>
                                        </div>
                                    ` : ''}
                                </div>
                                <p class="text-lg text-slate-300 leading-relaxed max-w-3xl">
                                    ${content.overview || 'Sinopse não disponível.'}
                                </p>
                                <div class="flex items-center space-x-4 pt-4">
                                    <button
                                        id="requestBtn"
                                        class="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        <i data-lucide="message-square" class="h-5 w-5"></i>
                                        <span>Solicitar Conteúdo</span>
                                    </button>
                                    ${trailer ? `
                                        <a
                                            href="https://www.youtube.com/embed/${trailer.key}"
                                            target="_blank"
                                            rel="noopener noreferrer"
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
                        ${this.getTrailerHTML(trailer, title)}
                    </div>

                    <!-- Sidebar -->
                    <div class="space-y-6">
                        ${this.getSidebarHTML(content)}
                        <button
                            id="requestBtnSidebar"
                            class="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                            Solicitar este Conteúdo
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Setup event listeners
        this.setupRequestButtons(content);
        
        // Re-initialize Lucide icons
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
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    ${cast.slice(0, 6).map(actor => `
                        <div class="text-center">
                            <img
                                src="${actor.profile_path ? 
                                    `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 
                                    '/assets/images/placeholder-person.jpg'
                                }"
                                alt="${actor.name}"
                                class="w-full h-32 object-cover rounded-lg mb-2"
                                onerror="this.src='/assets/images/placeholder-person.jpg'"
                            />
                            <p class="text-white font-medium">${actor.name}</p>
                            <p class="text-slate-400 text-sm">${actor.character}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getTrailerHTML(trailer, title) {
        if (!trailer) return '';

        return `
            <div>
                <h2 class="text-2xl font-bold text-white mb-4">Trailer</h2>
                <div class="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/${trailer.key}"
                        title="${title} Trailer"
                        class="w-full h-full rounded-lg"
                        allowfullscreen
                    ></iframe>
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
                        <div>
                            <span class="text-slate-400">Episódios:</span>
                            <span class="text-white ml-2">${content.number_of_episodes}</span>
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
            `https://image.tmdb.org/t/p/w200${content.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        const modal = document.getElementById('requestModal');
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="message-square" class="h-6 w-6 text-blue-400"></i>
                        <h2 class="text-xl font-semibold text-white">Solicitar Conteúdo</h2>
                    </div>
                    <button
                        id="closeModal"
                        class="text-slate-400 hover:text-white transition-colors"
                    >
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Content Info -->
                <div class="p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-4">
                        <img
                            src="${posterUrl}"
                            alt="${title}"
                            class="w-16 h-24 object-cover rounded-lg"
                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                        />
                        <div>
                            <h3 class="text-lg font-semibold text-white">${title}</h3>
                            <p class="text-slate-400 capitalize">${this.contentType === 'movie' ? 'Filme' : 'Série'}</p>
                        </div>
                    </div>
                </div>

                <!-- Form -->
                <form id="requestForm" class="p-6 space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Seu Nome *
                        </label>
                        <input
                            type="text"
                            id="requesterName"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Digite seu nome completo"
                            required
                        />
                        <div id="nameError" class="text-red-400 text-sm mt-1 hidden"></div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            WhatsApp * (formato: 5511999999999)
                        </label>
                        <input
                            type="text"
                            id="requesterWhatsapp"
                            value="55"
                            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="11999999999"
                            required
                        />
                        <div id="whatsappPreview" class="text-slate-400 text-sm mt-1 hidden"></div>
                        <div id="whatsappError" class="text-red-400 text-sm mt-1 hidden"></div>
                    </div>

                    ${this.contentType === 'tv' ? `
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Temporada (opcional)
                                </label>
                                <input
                                    type="number"
                                    id="season"
                                    min="1"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: 1"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Episódio (opcional)
                                </label>
                                <input
                                    type="number"
                                    id="episode"
                                    min="1"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: 5"
                                />
                            </div>
                        </div>
                    ` : ''}

                    <div class="bg-slate-700/50 rounded-lg p-4">
                        <p class="text-sm text-slate-400">
                            <strong>Importante:</strong> Ao solicitar este conteúdo, você receberá atualizações sobre o status 
                            da sua solicitação através do WhatsApp fornecido. Nossa equipe analisará a disponibilidade.
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
                            class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Enviar Solicitação
                        </button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.remove('hidden');
        
        // Setup modal event listeners
        this.setupModalEventListeners(content);
        
        // Re-initialize Lucide icons
        lucide.createIcons();
    }

    setupModalEventListeners(content) {
        const modal = document.getElementById('requestModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('requestForm');
        const whatsappInput = document.getElementById('requesterWhatsapp');

        // Close modal
        const closeModal = () => {
            modal.classList.add('hidden');
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // WhatsApp formatting
        whatsappInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Garantir que sempre comece com 55
            if (!value.startsWith('55')) {
                if (value.length === 0) {
                    value = '55';
                } else if (value.startsWith('5') && value.length === 1) {
                    value = '55';
                } else if (!value.startsWith('55')) {
                    value = '55' + value;
                }
                e.target.value = value;
            }
            
            const preview = document.getElementById('whatsappPreview');
            
            if (value.length > 2) {
                const formatted = this.formatWhatsApp(value);
                preview.textContent = `Visualização: +${formatted}`;
                preview.classList.remove('hidden');
            } else {
                preview.classList.add('hidden');
            }
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRequest(content);
        });
    }

    formatWhatsApp(value) {
        if (value.length <= 2) return value;
        if (value.length <= 4) return `${value.slice(0, 2)} ${value.slice(2)}`;
        if (value.length <= 9) return `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4)}`;
        return `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4, 9)}-${value.slice(9, 13)}`;
    }

    async submitRequest(content) {
        const form = document.getElementById('requestForm');
        const submitBtn = document.getElementById('submitBtn');
        const title = content.title || content.name;

        // Get form data
        const formData = {
            content_id: content.id,
            content_type: this.contentType,
            content_title: title,
            requester_name: document.getElementById('requesterName').value.trim(),
            requester_whatsapp: document.getElementById('requesterWhatsapp').value.replace(/\D/g, ''),
            poster_path: content.poster_path
        };

        if (this.contentType === 'tv') {
            const season = document.getElementById('season').value;
            const episode = document.getElementById('episode').value;
            if (season) formData.season = parseInt(season);
            if (episode) formData.episode = parseInt(episode);
        }

        // Clear previous errors
        this.clearFormErrors();

        // Validate
        const errors = this.validateRequestForm(formData);
        if (Object.keys(errors).length > 0) {
            this.showFormErrors(errors);
            return;
        }

        // Submit
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/requests.php', {
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

            // Success
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
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-8 text-center">
                <i data-lucide="check-circle" class="h-16 w-16 text-green-400 mx-auto mb-4"></i>
                <h3 class="text-2xl font-bold text-white mb-2">
                    Solicitação Enviada!
                </h3>
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
            <div class="min-h-screen bg-slate-900 flex items-center justify-center">
                <div class="text-center">
                    <p class="text-red-400 mb-4">${message}</p>
                    <a href="search.php" class="text-blue-400 hover:text-blue-300">
                        Voltar à pesquisa
                    </a>
                </div>
            </div>
        `;
    }
}
