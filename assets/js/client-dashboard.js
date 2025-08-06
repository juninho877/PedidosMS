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
    async showEnhancedRequestDetailsModal(request) {
        // Primeiro, mostrar modal de loading
        this.showLoadingModal();
        
        try {
            // Buscar detalhes completos do TMDB
            const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
            const tmdbData = await tmdbResponse.json();
            
            if (!tmdbResponse.ok) {
                throw new Error('Erro ao carregar detalhes do TMDB');
            }
            
            this.showDetailedRequestModal(request, tmdbData);
            
        } catch (error) {
            console.error('Error loading TMDB details:', error);
            // Fallback para modal simples se TMDB falhar
            this.showSimpleRequestDetailsModal(request);
        }
    }

    showLoadingModal() {
        const modal = document.createElement('div');
        modal.id = 'requestDetailsModal';
        modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto';
        modal.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4';
            <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto my-4">
                <!-- Header com backdrop -->
                <div class="relative">
                    ${backdropUrl ? `
                        <div 
                            class="h-48 bg-cover bg-center bg-no-repeat rounded-t-xl"
                            style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${backdropUrl})"
                        ></div>
                        <div class="absolute top-4 right-4">
                            <button class="close-modal bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                                <i data-lucide="x" class="h-6 w-6"></i>
                            </button>
                        </div>
                    ` : `
                        <div class="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl">
                            <h2 class="text-xl font-semibold text-white">Detalhes da Solicitação</h2>
                            <button class="close-modal text-slate-400 hover:text-white transition-colors">
                                <i data-lucide="x" class="h-6 w-6"></i>
                            </button>
                        </div>
                    `}
                </div>

                <!-- Content -->
                <div class="p-6">
                    <!-- Main Info Section -->
                    <div class="grid lg:grid-cols-3 gap-6 mb-8">
                        <!-- Poster and Basic Info -->
                        <div class="lg:col-span-1">
                            <div class="bg-slate-700/50 rounded-lg p-4 mb-4">
                                <img
                                    src="${posterUrl}"
                                    alt="${request.content_title}"
                                    class="w-full max-w-64 mx-auto rounded-lg shadow-lg mb-4"
                                    onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                />
                                <div class="text-center">
                                    <h3 class="text-xl font-bold text-white mb-2">${request.content_title}</h3>
                                    <div class="flex items-center justify-center space-x-4 text-sm text-slate-400 mb-4">
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                            <span>${typeLabels[request.content_type]}</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="calendar" class="h-4 w-4"></i>
                                            <span>${year}</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                            <span>${tmdbData.vote_average?.toFixed(1) || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <span class="inline-block px-4 py-2 rounded-full text-sm font-medium border ${statusColors[request.status]}">
                                        ${statusLabels[request.status]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Detailed Content Info -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Overview -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i data-lucide="info" class="h-5 w-5 mr-2 text-blue-400"></i>
                                    Sinopse
                                </h4>
                                <p class="text-slate-300 leading-relaxed">
                                    ${tmdbData.overview || 'Sinopse não disponível.'}
                                </p>
                            </div>

                            <!-- Technical Details -->
                            <div class="bg-slate-700/50 rounded-lg p-4">
                                <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                    <i data-lucide="settings" class="h-5 w-5 mr-2 text-purple-400"></i>
                                    Informações Técnicas
                                </h4>
                                <div class="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Tipo:</span>
                                            <span class="text-white">${typeLabels[request.content_type]}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Avaliação TMDB:</span>
                                            <span class="text-white">${tmdbData.vote_average?.toFixed(1) || 'N/A'}/10 (${tmdbData.vote_count || 0} votos)</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Popularidade:</span>
                                            <span class="text-white">${tmdbData.popularity?.toFixed(0) || 'N/A'}</span>
                                        </div>
                                        ${tmdbData.runtime ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Duração:</span>
                                                <span class="text-white">${tmdbData.runtime} minutos</span>
                                            </div>
                                        ` : ''}
                                        ${tmdbData.number_of_seasons ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Temporadas:</span>
                                                <span class="text-white">${tmdbData.number_of_seasons}</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Episódios:</span>
                                                <span class="text-white">${tmdbData.number_of_episodes || 'N/A'}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Lançamento:</span>
                                            <span class="text-white">${releaseDate ? new Date(releaseDate).toLocaleDateString('pt-BR') : 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Idioma Original:</span>
                                            <span class="text-white">${tmdbData.original_language?.toUpperCase() || 'N/A'}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Status:</span>
                                            <span class="text-white">${tmdbData.status || 'N/A'}</span>
                                        </div>
                                        ${tmdbData.budget && tmdbData.budget > 0 ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Orçamento:</span>
                                                <span class="text-white">$${tmdbData.budget.toLocaleString()}</span>
                                            </div>
                                        ` : ''}
                                        ${tmdbData.revenue && tmdbData.revenue > 0 ? `
                                            <div class="flex justify-between">
                                                <span class="text-slate-400">Bilheteria:</span>
                                                <span class="text-white">$${tmdbData.revenue.toLocaleString()}</span>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>

                            <!-- Genres -->
                            ${tmdbData.genres && tmdbData.genres.length > 0 ? `
                                <div class="bg-slate-700/50 rounded-lg p-4">
                                    <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                        <i data-lucide="tag" class="h-5 w-5 mr-2 text-green-400"></i>
                                        Gêneros
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${tmdbData.genres.map(genre => `
                                            <span class="bg-slate-600 text-slate-200 px-3 py-1 rounded-full text-sm">
                                                ${genre.name}
                                            </span>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Production Info -->
                            ${tmdbData.production_companies && tmdbData.production_companies.length > 0 ? `
                                <div class="bg-slate-700/50 rounded-lg p-4">
                                    <h4 class="text-lg font-semibold text-white mb-3 flex items-center">
                                        <i data-lucide="building" class="h-5 w-5 mr-2 text-orange-400"></i>
                                        Produção
                                    </h4>
                                    <div class="grid sm:grid-cols-2 gap-2 text-sm">
                                        ${tmdbData.production_companies.slice(0, 4).map(company => `
                                            <div class="flex items-center space-x-2">
                                                ${company.logo_path ? `
                                                    <img src="https://image.tmdb.org/t/p/w92${company.logo_path}" alt="${company.name}" class="w-6 h-6 object-contain bg-white rounded">
                                                ` : `
                                                    <i data-lucide="building-2" class="h-4 w-4 text-slate-400"></i>
                                                `}
                                                <span class="text-slate-300">${company.name}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Cast Section -->
                    ${tmdbData.credits?.cast && tmdbData.credits.cast.length > 0 ? `
                        <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                            <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                                <i data-lucide="users" class="h-5 w-5 mr-2 text-red-400"></i>
                                Elenco Principal
                            </h4>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                ${tmdbData.credits.cast.slice(0, 12).map(actor => `
                                    <div class="text-center">
                                        <img
                                            src="${actor.profile_path ? 
                                                `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 
                                                '/assets/images/placeholder-person.jpg'
                                            }"
                                            alt="${actor.name}"
                                            class="w-full h-24 object-cover rounded-lg mb-2"
                                            onerror="this.src='/assets/images/placeholder-person.jpg'"
                                        />
                                        <p class="text-white font-medium text-xs">${actor.name}</p>
                                        <p class="text-slate-400 text-xs">${actor.character}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Request Details -->
                    <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                        <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                            <i data-lucide="user-check" class="h-5 w-5 mr-2 text-blue-400"></i>
                            Detalhes da Solicitação
                        </h4>
                        <div class="grid md:grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Solicitante:</span>
                                    <span class="text-white font-medium">${request.requester_name}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">WhatsApp:</span>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-white">+${this.formatWhatsApp(request.requester_whatsapp)}</span>
                                        <a 
                                            href="https://wa.me/${request.requester_whatsapp}" 
                                            target="_blank"
                                            class="text-green-400 hover:text-green-300 transition-colors"
                                            title="Abrir WhatsApp"
                                        >
                                            <i data-lucide="message-circle" class="h-4 w-4"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Data da Solicitação:</span>
                                    <span class="text-white">${new Date(request.created_at).toLocaleString('pt-BR')}</span>
                                </div>
                                ${request.updated_at !== request.created_at ? `
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Última Atualização:</span>
                                        <span class="text-white">${new Date(request.updated_at).toLocaleString('pt-BR')}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">ID da Solicitação:</span>
                                    <span class="text-white font-mono">#${request.id}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-400">ID TMDB:</span>
                                    <span class="text-white font-mono">${request.content_id}</span>
                                </div>
                                ${request.season ? `
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Temporada:</span>
                                        <span class="text-white">${request.season}</span>
                                    </div>
                                ` : ''}
                                ${request.episode ? `
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Episódio:</span>
                                        <span class="text-white">${request.episode}</span>
                                    </div>
                                ` : ''}
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Status Atual:</span>
                                    <span class="px-3 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}">
                                        ${statusLabels[request.status]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Trailer Section -->
                    ${trailer ? `
                        <div class="bg-slate-700/50 rounded-lg p-4 mb-6">
                            <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                                <i data-lucide="play" class="h-5 w-5 mr-2 text-red-400"></i>
                                Trailer Oficial
                            </h4>
                            <div class="aspect-video">
                                <iframe
                                    src="https://www.youtube.com/embed/${trailer.key}"
                                    title="${request.content_title} Trailer"
                                    class="w-full h-full rounded-lg"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-600">
                        <button class="close-modal flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors">
                            Fechar
                        </button>
                        <a 
                            href="https://wa.me/${request.requester_whatsapp}?text=Olá ${request.requester_name}! Sobre sua solicitação do ${typeLabels[request.content_type].toLowerCase()} "${request.content_title}"..." 
                            target="_blank"
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors text-center"
                        >
                            <i data-lucide="message-circle" class="h-4 w-4 inline mr-2"></i>
                            Contatar via WhatsApp
                        </a>
                        ${request.status === 'pending' ? `
                            <button
                                onclick="clientDashboard.updateRequestStatus(${request.id}, 'approved'); document.body.removeChild(document.getElementById('requestDetailsModal'));"
                                class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                <i data-lucide="check" class="h-4 w-4 inline mr-2"></i>
                                Aprovar
                            </button>
                            <button
                                onclick="clientDashboard.updateRequestStatus(${request.id}, 'denied'); document.body.removeChild(document.getElementById('requestDetailsModal'));"
                                class="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                <i data-lucide="x" class="h-4 w-4 inline mr-2"></i>
                                Negar
                            </button>
                        ` : ''}
                    </div>
            <div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
        const trailer = tmdbData.videos?.results?.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );

        const releaseDate = tmdbData.release_date || tmdbData.first_air_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

</html>
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }
        });
    }

    showSimpleRequestDetailsModal(request) {
        const existingModal = document.getElementById('requestDetailsModal');
        if (existingModal) {
            document.body.removeChild(existingModal);
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

        const typeLabels = {
            movie: 'Filme',
            tv: 'Série'
        };

        const posterUrl = request.poster_path ? 
            `https://image.tmdb.org/t/p/w300${request.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';

        const modal = document.createElement('div');
        modal.id = 'requestDetailsModal';
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
                            src="${posterUrl}"
                            alt="${request.content_title}"
                            class="w-20 h-30 object-cover rounded-lg"
                        />
                        <div>
                            <h3 class="text-lg font-semibold text-white mb-2">${request.content_title}</h3>
                            <div class="space-y-1 text-sm text-slate-400">
                                <p><strong>Tipo:</strong> ${typeLabels[request.content_type]}</p>
                                <p><strong>Solicitante:</strong> ${request.requester_name}</p>
                                <p><strong>WhatsApp:</strong> +${this.formatWhatsApp(request.requester_whatsapp)}</p>
                                <p><strong>Data:</strong> ${new Date(request.created_at).toLocaleDateString('pt-BR')}</p>
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
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            });
        });