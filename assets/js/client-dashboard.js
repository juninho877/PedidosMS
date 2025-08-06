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
    renderRequestModal(request, tmdbData = null) {
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
        // Informações do TMDB
        const posterUrl = tmdbData && tmdbData.poster_path ? 
            `https://image.tmdb.org/t/p/w400${tmdbData.poster_path}` : 
            '/assets/images/placeholder-poster.jpg';
        
        const releaseYear = tmdbData ? 
            (tmdbData.release_date || tmdbData.first_air_date ? 
                new Date(tmdbData.release_date || tmdbData.first_air_date).getFullYear() : 'N/A') : 'N/A';
        
        const rating = tmdbData ? tmdbData.vote_average?.toFixed(1) || 'N/A' : 'N/A';
        const overview = tmdbData ? tmdbData.overview || 'Sinopse não disponível.' : 'Carregando informações...';
        
        // Gêneros
        const genres = tmdbData && tmdbData.genres ? 
            tmdbData.genres.map(genre => `<span class="inline-block bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs mr-2 mb-2">${genre.name}</span>`).join('') : 
            '<span class="text-slate-400 text-sm">Não disponível</span>';
        
        // Informações específicas por tipo
        let specificInfo = '';
        if (tmdbData) {
            if (request.content_type === 'movie') {
                const runtime = tmdbData.runtime ? `${tmdbData.runtime} min` : 'N/A';
                const budget = tmdbData.budget && tmdbData.budget > 0 ? 
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(tmdbData.budget) : 'N/A';
                
                specificInfo = `
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-slate-400">Duração:</span>
                            <span class="text-white ml-2">${runtime}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Orçamento:</span>
                            <span class="text-white ml-2">${budget}</span>
                        </div>
                    </div>
                `;
            } else {
                const seasons = tmdbData.number_of_seasons || 'N/A';
                const episodes = tmdbData.number_of_episodes || 'N/A';
                const status = tmdbData.status || 'N/A';
                
                specificInfo = `
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-slate-400">Temporadas:</span>
                            <span class="text-white ml-2">${seasons}</span>
                        </div>
                        <div>
                            <span class="text-slate-400">Episódios:</span>
                            <span class="text-white ml-2">${episodes}</span>
                        </div>
                        <div class="col-span-2">
                            <span class="text-slate-400">Status:</span>
                            <span class="text-white ml-2">${status}</span>
                        </div>
                    </div>
                `;
            }
        }
        
        // Produtoras
        const productionCompanies = tmdbData && tmdbData.production_companies ? 
            tmdbData.production_companies.slice(0, 3).map(company => company.name).join(', ') : 'N/A';
        
        // Países
        const countries = tmdbData && tmdbData.production_countries ? 
            tmdbData.production_countries.map(country => country.name).join(', ') : 'N/A';
        
        // Elenco
        let castSection = '';
        if (tmdbData && tmdbData.credits && tmdbData.credits.cast) {
            const cast = tmdbData.credits.cast.slice(0, 8);
            castSection = `
                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-white mb-4">Elenco Principal</h4>
                    <div class="grid grid-cols-4 gap-4">
                        ${cast.map(actor => `
                            <div class="text-center">
                                <img
                                    src="${actor.profile_path ? 
                                        `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 
                                        '/assets/images/placeholder-person.jpg'
                                    }"
                                    alt="${actor.name}"
                                    class="w-full h-20 object-cover rounded-lg mb-2"
                                    onerror="this.src='/assets/images/placeholder-person.jpg'"
                                />
                                <p class="text-white font-medium text-xs">${actor.name}</p>
                                <p class="text-slate-400 text-xs">${actor.character}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
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
                            <!-- Informações do Conteúdo -->
                            <div class="flex gap-6 mb-8">
                                <div class="flex-shrink-0">
                                    <img
                                        src="${posterUrl}"
                                        alt="${request.content_title}"
                                        class="w-32 h-48 object-cover rounded-lg border border-slate-600"
                                        onerror="this.src='/assets/images/placeholder-poster.jpg'"
                                    />
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-2xl font-bold text-white mb-2">${request.content_title}</h3>
                                    <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-300">
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="calendar" class="h-4 w-4"></i>
                                            <span>${releaseYear}</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="star" class="h-4 w-4 text-yellow-400"></i>
                                            <span>${rating}/10</span>
                                        </div>
                                        <div class="flex items-center space-x-1">
                                            <i data-lucide="${request.content_type === 'movie' ? 'film' : 'tv'}" class="h-4 w-4"></i>
                                            <span>${contentType}</span>
                                        </div>
                                    </div>
                                    <p class="text-slate-300 text-sm leading-relaxed mb-4">${overview}</p>
                                    
                                    <!-- Informações Específicas -->
                                    ${specificInfo}
                                </div>
                            </div>
                            
                            <!-- Gêneros -->
                            <div class="mb-6">
                                <h4 class="text-lg font-semibold text-white mb-3">Gêneros</h4>
                                <div class="flex flex-wrap">
                                    ${genres}
                                </div>
                            </div>
                            
                            <!-- Informações de Produção -->
                            <div class="mb-6">
                                <h4 class="text-lg font-semibold text-white mb-3">Produção</h4>
                                <div class="grid grid-cols-1 gap-3 text-sm">
                                    <div>
                                        <span class="text-slate-400">Produtoras:</span>
                                        <span class="text-white ml-2">${productionCompanies}</span>
                                    </div>
                                    <div>
                                        <span class="text-slate-400">Países:</span>
                                        <span class="text-white ml-2">${countries}</span>
                                    </div>
                                </div>
                            </div>
                            
                            ${castSection}
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
            
            // Buscar informações do TMDB
            let tmdbData = null;
            try {
                const tmdbResponse = await fetch(`/api/tmdb.php/${request.content_type}/${request.content_id}`);
                if (tmdbResponse.ok) {
                    tmdbData = await tmdbResponse.json();
                }
            } catch (error) {
                console.warn('Erro ao buscar dados do TMDB:', error);
            }

            lucide.createIcons();
            this.renderRequestModal(request, tmdbData);

        lucide.createIcons();
    </script>
</body>
</html>