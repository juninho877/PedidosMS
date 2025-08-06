<?php
// Este arquivo agora é a página inicial para tenants
$tenantMiddleware = new TenantMiddleware();
$tenantConfig = $tenantMiddleware->getTenantConfig();

if (!$tenantConfig) {
    http_response_code(404);
    include '404.php';
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($tenantConfig['site_name']); ?> - Sistema de Solicitação de Filmes e Séries</title>
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    <button id="closeDetailsModal" class="text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>
                <div class="p-6 text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p class="text-slate-400">Carregando detalhes...</p>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        lucide.createIcons();
        
        // Setup close button
        document.getElementById('closeDetailsModal').addEventListener('click', () => {
            this.closeRequestDetailsModal();
        });
        
        try {
            // Fetch request details
            const requestResponse = await fetch(`/api/client-requests.php/${requestId}`);
            if (!requestResponse.ok) {
                throw new Error('Erro ao carregar detalhes da solicitação');
            }
            const requestData = await requestResponse.json();
            
            // Fetch content details from TMDB
            const contentResponse = await fetch(`/api/tmdb.php/${requestData.content_type}/${requestData.content_id}`);
            if (!contentResponse.ok) {
                throw new Error('Erro ao carregar detalhes do conteúdo');
            }
            const contentData = await contentResponse.json();
            
            // Render complete modal
            this.renderRequestDetailsModal(requestData, contentData);
            
        } catch (error) {
            console.error('Error loading request details:', error);
            this.showRequestDetailsError(error.message);
        }
    }

    renderRequestDetailsModal(request, content) {
        const modal = document.getElementById('requestDetailsModal');
        const title = content.title || content.name;
        const date = content.release_date || content.first_air_date;
        const year = date ? new Date(date).getFullYear() : 'N/A';
        const trailer = content.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        const backdropUrl = content.backdrop_path ? 
            `https://image.tmdb.org/t/p/w1280${content.backdrop_path}` : '';
        const posterUrl = content.poster_path ? 
            `https://image.tmdb.org/t/p/w400${content.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';
        
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center space-x-3">
                        <i data-lucide="eye" class="h-6 w-6 text-blue-400"></i>
                        <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                    </div>
                    <button id="closeDetailsModal" class="text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <!-- Request Info -->
                    <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                        <h3 class="text-lg font-semibold text-white mb-3">Informações da Solicitação</h3>
                        <div class="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-slate-400">Solicitante:</span>
                                <span class="text-white ml-2 font-medium">${request.requester_name}</span>
                            </div>
                            <div>
                                <span class="text-slate-400">WhatsApp:</span>
                                <a href="https://wa.me/${request.requester_whatsapp}" target="_blank" class="text-green-400 hover:text-green-300 ml-2 font-medium">
                                    +${this.formatWhatsApp(request.requester_whatsapp)}
                                </a>
                            </div>
                            <div>
                                <span class="text-slate-400">Data da Solicitação:</span>
                                <span class="text-white ml-2">${new Date(request.created_at).toLocaleString('pt-BR')}</span>
                            </div>
                            <div>
                                <span class="text-slate-400">Status:</span>
                                <span class="ml-2 px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(request.status)}">
                                    ${this.getStatusLabel(request.status)}
                                </span>
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

                    <!-- Content Details -->
                    <div class="grid lg:grid-cols-3 gap-6">
                        <!-- Main Content Info -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Hero Section -->
                            <div class="relative">
                                ${backdropUrl ? `
                                    <div 
                                        class="h-64 bg-cover bg-center bg-no-repeat rounded-lg"
                                        style="background-image: url(${backdropUrl})"
                                    >
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent rounded-lg"></div>
                                    </div>
                                ` : `
                                    <div class="h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg">
                                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent rounded-lg"></div>
                                    </div>
                                `}
                                
                                <div class="absolute bottom-4 left-4 right-4">
                                    <div class="flex items-end space-x-4">
                                        <img
                                            src="${posterUrl}"
                                            alt="${title}"
                                            class="w-20 h-30 object-cover rounded-lg shadow-xl border border-slate-600"
                                            onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                        />
                                        <div class="flex-1">
                                            <h3 class="text-xl font-bold text-white mb-2">${title}</h3>
                                            <div class="flex items-center space-x-4 text-slate-300 text-sm">
                                                <span><i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4 inline mr-1"></i>${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                                <span><i data-lucide="calendar" class="h-4 w-4 inline mr-1"></i>${year}</span>
                                                <span><i data-lucide="star" class="h-4 w-4 inline mr-1 text-yellow-400"></i>${content.vote_average.toFixed(1)}/10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Synopsis -->
                            ${content.overview ? `
                                <div>
                                    <h4 class="text-lg font-semibold text-white mb-3">Sinopse</h4>
                                    <p class="text-slate-300 leading-relaxed">${content.overview}</p>
                                </div>
                            ` : ''}

                            <!-- Genres -->
                            ${content.genres && content.genres.length > 0 ? `
                                <div>
                                    <h4 class="text-lg font-semibold text-white mb-3">Gêneros</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${content.genres.map(genre => `
                                            <span class="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                                                ${genre.name}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Cast -->
                            ${content.credits?.cast && content.credits.cast.length > 0 ? `
                                <div>
                                    <h4 class="text-lg font-semibold text-white mb-3">Elenco Principal</h4>
                                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        ${content.credits.cast.slice(0, 6).map(actor => `
                                            <div class="text-center">
                                                <img
                                                    src="${actor.profile_path ? 
                                                        `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 
                                                        '/assets/images/placeholder-person.jpg'
                                                    }"
                                                    alt="${actor.name}"
                                                    class="w-full h-24 object-cover rounded-lg mb-2"
                                                    onerror="this.src='/assets/images/placeholder-person.jpg'"
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
                                    <h4 class="text-lg font-semibold text-white mb-3">Trailer</h4>
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
                        </div>

                        <!-- Sidebar -->
                        <div class="space-y-6">
                            <!-- Content Info -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-3">Informações do Conteúdo</h4>
                                <div class="space-y-3 text-sm">
                                    <div>
                                        <span class="text-slate-400">Tipo:</span>
                                        <span class="text-white ml-2">${request.content_type === 'movie' ? 'Filme' : 'Série'}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Avaliação TMDB:</span>
                                        <span class="text-white ml-2">${content.vote_average.toFixed(1)}/10</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Votos:</span>
                                        <span class="text-white ml-2">${content.vote_count.toLocaleString('pt-BR')}</span>
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
                                    ${content.status ? `
                                        <div>
                                            <span class="text-slate-400">Status:</span>
                                            <span class="text-white ml-2">${content.status}</span>
                                        </div>
                                    ` : ''}
                                    ${content.original_language ? `
                                        <div>
                                            <span class="text-slate-400">Idioma Original:</span>
                                            <span class="text-white ml-2">${content.original_language.toUpperCase()}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Production Info -->
                            ${content.production_companies && content.production_companies.length > 0 ? `
                                <div class="bg-slate-700/50 rounded-lg p-4">
                                    <h4 class="text-lg font-semibold text-white mb-3">Produção</h4>
                                    <div class="space-y-2">
                                        ${content.production_companies.slice(0, 3).map(company => `
                                            <div class="text-sm">
                                                <span class="text-white">${company.name}</span>
                                                ${company.origin_country ? `
                                                    <span class="text-slate-400 ml-2">(${company.origin_country})</span>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Action Buttons -->
                            <div class="space-y-3">
                                ${request.status === 'pending' ? `
                                    <button onclick="window.clientDashboard.updateRequestStatusFromModal(${request.id}, 'approved')" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors">
                                        <i data-lucide="check-circle" class="h-5 w-5 inline mr-2"></i>
                                        Aprovar Solicitação
                                    </button>
                                    <button onclick="window.clientDashboard.updateRequestStatusFromModal(${request.id}, 'denied')" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors">
                                        <i data-lucide="x-circle" class="h-5 w-5 inline mr-2"></i>
                                        Negar Solicitação
                                    </button>
                                ` : `
                                    <div class="text-center py-4">
                                        <span class="px-4 py-2 rounded-full text-sm font-medium ${this.getStatusClass(request.status)}">
                                            ${this.getStatusLabel(request.status)}
                                        </span>
                                    </div>
                                `}
                                
                                <a href="https://wa.me/${request.requester_whatsapp}" target="_blank" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                                    <i data-lucide="message-circle" class="h-5 w-5 inline mr-2"></i>
                                    Contatar via WhatsApp
                                </a>
                                
                                ${trailer ? `
                                    <a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                                        <i data-lucide="play" class="h-5 w-5 inline mr-2"></i>
                                        Assistir Trailer
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Setup event listeners
        document.getElementById('closeDetailsModal').addEventListener('click', () => {
            this.closeRequestDetailsModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeRequestDetailsModal();
            }
        });
        
        lucide.createIcons();
    }

    showRequestDetailsError(message) {
        const modal = document.getElementById('requestDetailsModal');
        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full mx-4">
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 class="text-xl font-semibold text-white">Erro</h2>
                    <button id="closeDetailsModal" class="text-slate-400 hover:text-white transition-colors">
                        <i data-lucide="x" class="h-6 w-6"></i>
                    </button>
                </div>
                <div class="p-6 text-center">
                    <i data-lucide="alert-circle" class="h-12 w-12 text-red-400 mx-auto mb-4"></i>
                    <p class="text-red-400 font-medium mb-4">${message}</p>
                    <button onclick="window.clientDashboard.closeRequestDetailsModal()" class="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('closeDetailsModal').addEventListener('click', () => {
            this.closeRequestDetailsModal();
        });
        
        lucide.createIcons();
    }

    closeRequestDetailsModal() {
        const modal = document.getElementById('requestDetailsModal');
        modal.classList.add('hidden');
    }

    async updateRequestStatusFromModal(id, status) {
        try {
            const response = await fetch('/api/client-requests.php/update-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });

            if (response.ok) {
                this.showToast('Status atualizado com sucesso', 'success');
                this.closeRequestDetailsModal();
                
                // Refresh the requests list if we're on the requests tab
                if (this.currentTab === 'requests') {
                    this.applyRequestFilters();
                }
            } else {
                throw new Error('Erro ao atualizar status');
            }
        } catch (error) {
            console.error('Error updating request status:', error);
            this.showToast('Erro ao atualizar status', 'error');
        }
    }

    formatWhatsApp(value) {
        if (!value || value.length <= 2) return value;
        if (value.length <= 4) return `${value.slice(0, 2)} ${value.slice(2)}`;
        if (value.length <= 9) return `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4)}`;
        return `${value.slice(0, 2)} ${value.slice(2, 4)} ${value.slice(4, 9)}-${value.slice(9, 13)}`;
    }
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo htmlspecialchars($tenantConfig['favicon_url']); ?>">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($tenantConfig['primary_color']); ?>;
            --secondary-color: <?php echo htmlspecialchars($tenantConfig['secondary_color']); ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .text-secondary { color: var(--secondary-color); }
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-14 sm:h-16">
                <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-3 group">
                    <?php if ($tenantConfig['logo_url']): ?>
                        <img src="<?php echo htmlspecialchars($tenantConfig['logo_url']); ?>" alt="Logo" class="h-8 w-8 sm:h-10 sm:w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <?php endif; ?>
                    <span class="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo htmlspecialchars($tenantConfig['site_name']); ?>
                    </span>
                </a>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-slate-300 hover:text-white p-2">
                        <i data-lucide="menu" class="h-6 w-6"></i>
                    </button>
                </div>

                <!-- Desktop menu -->
                <div class="hidden md:flex items-center space-x-4 lg:space-x-6">
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-primary text-white text-sm lg:text-base">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Início</span>
                    </a>

                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Pesquisar</span>
                    </a>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-slate-700 py-4">
                <div class="space-y-2">
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-primary text-white">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
            <div class="text-center">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    <?php echo htmlspecialchars($tenantConfig['hero_title']); ?>
                </h1>
                <?php if ($tenantConfig['site_tagline']): ?>
                <p class="text-xl sm:text-2xl text-blue-300 mb-4 font-medium">
                    <?php echo htmlspecialchars($tenantConfig['hero_subtitle']); ?>
                </p>
                <?php endif; ?>
                <p class="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                    <?php echo htmlspecialchars($tenantConfig['hero_description'] ?: $tenantConfig['site_description']); ?>
                </p>
                <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="inline-flex items-center space-x-2 bg-primary hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <i data-lucide="search" class="h-5 w-5 sm:h-6 sm:w-6"></i>
                    <span>Começar Pesquisa</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div class="text-center mb-12 sm:mb-16">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Como Funciona</h2>
            <p class="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto px-4">
                Um processo simples e eficiente para solicitar seus conteúdos favoritos
            </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-primary/50 transition-all group">
                <div class="bg-primary w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="search" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                </div>
                <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">1. Pesquise</h3>
                <p class="text-sm sm:text-base text-slate-400">
                    Use nossa interface integrada com TMDB para encontrar filmes e séries com informações detalhadas e precisas.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all group">
                <div class="bg-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                </div>
                <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">2. Solicite</h3>
                <p class="text-sm sm:text-base text-slate-400">
                    Preencha um formulário simples com seus dados de contato e especificações do conteúdo desejado.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all group sm:col-span-2 lg:col-span-1">
                <div class="bg-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="users" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                </div>
                <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">3. Acompanhe</h3>
                <p class="text-sm sm:text-base text-slate-400">
                    Nossa equipe analisa sua solicitação e você recebe atualizações sobre o status através do WhatsApp.
                </p>
            </div>
        </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-slate-800/30 border-y border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="film" class="h-6 w-6 sm:h-8 sm:w-8 text-primary"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">10K+</div>
                    <div class="text-sm sm:text-base text-slate-400">Filmes no Catálogo</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="tv" class="h-6 w-6 sm:h-8 sm:w-8 text-purple-400"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">5K+</div>
                    <div class="text-sm sm:text-base text-slate-400">Séries Disponíveis</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="trending-up" class="h-6 w-6 sm:h-8 sm:w-8 text-green-400"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">98%</div>
                    <div class="text-sm sm:text-base text-slate-400">Taxa de Satisfação</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="star" class="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400"></i>
                    </div>
                    <div class="text-2xl sm:text-3xl font-bold text-white mb-2">24h</div>
                    <div class="text-sm sm:text-base text-slate-400">Tempo Médio de Resposta</div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Pronto para solicitar seu conteúdo?
        </h2>
        <p class="text-base sm:text-lg lg:text-xl text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Junte-se a milhares de usuários que já encontraram seus filmes e séries favoritos através do nosso sistema.
        </p>
        <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            <i data-lucide="search" class="h-5 w-5 sm:h-6 sm:w-6"></i>
            <span>Iniciar Pesquisa</span>
        </a>
    </div>

    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-btn').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            const icon = this.querySelector('i');
            
            menu.classList.toggle('hidden');
            
            if (menu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            
            lucide.createIcons();
        });

        lucide.createIcons();
    </script>
</body>
</html>