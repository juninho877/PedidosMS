<?php
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
    <title>Pesquisar - <?php echo htmlspecialchars($tenantConfig['site_name']); ?></title>
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
        .hover\:bg-primary:hover { background-color: var(--primary-color); }
        .focus\:ring-primary:focus { --tw-ring-color: var(--primary-color); }
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
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700 text-sm lg:text-base">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Início</span>
                    </a>

                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-primary text-white text-sm lg:text-base">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span class="hidden lg:inline">Pesquisar</span>
                    </a>
                </div>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-slate-700 py-4">
                <div class="space-y-2">
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>
                    <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-primary text-white">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="min-h-screen bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="text-center mb-8 sm:mb-12">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                    Pesquisar Filmes e Séries
                </h1>
                <p class="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
                    Encontre seus conteúdos favoritos e solicite para nossa biblioteca
                </p>
            </div>

            <!-- Search Form -->
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 sm:p-6 mb-6 sm:mb-8">
                <form id="searchForm" class="space-y-6">
                    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div class="flex-1">
                            <input
                                type="text"
                                id="searchQuery"
                                placeholder="Digite o nome do filme ou série..."
                                class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div class="flex gap-2 sm:gap-3">
                            <button
                                type="button"
                                id="toggleFilters"
                                class="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white hover:border-slate-500 transition-colors text-sm sm:text-base"
                            >
                                <i data-lucide="filter" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                                <span class="hidden sm:inline">Filtros</span>
                            </button>
                            <button
                                type="submit"
                                id="searchBtn"
                                class="flex items-center space-x-2 bg-primary hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                            >
                                <i data-lucide="search" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                                <span>Buscar</span>
                            </button>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div id="filtersSection" class="border-t border-slate-700 pt-4 sm:pt-6 space-y-4 hidden">
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Tipo de Conteúdo
                                </label>
                                <select
                                    id="contentType"
                                    class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                                >
                                    <option value="all">Todos</option>
                                    <option value="movie">Filmes</option>
                                    <option value="tv">Séries</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Ano de Lançamento (Opcional)
                                </label>
                                <select
                                    id="releaseYear"
                                    class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                                >
                                    <option value="">Qualquer ano</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- View Controls -->
            <div id="viewControls" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 hidden">
                <p id="resultsCount" class="text-sm sm:text-base text-slate-400"></p>
                <div class="flex items-center space-x-2">
                    <button
                        id="gridView"
                        class="p-2 sm:p-3 rounded-lg transition-colors bg-primary text-white"
                    >
                        <i data-lucide="grid-3x3" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                    </button>
                    <button
                        id="listView"
                        class="p-2 sm:p-3 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                        <i data-lucide="list" class="h-4 w-4 sm:h-5 sm:w-5"></i>
                    </button>
                </div>
            </div>

            <!-- Results -->
            <div id="searchResults"></div>

            <!-- Loading -->
            <div id="loadingState" class="hidden">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    <!-- Loading skeletons -->
                    <div class="animate-pulse">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div class="aspect-[2/3] bg-slate-700"></div>
                            <div class="p-3 sm:p-4">
                                <div class="h-4 bg-slate-700 rounded mb-2"></div>
                                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <!-- Repeat skeleton for loading effect -->
                    <div class="animate-pulse">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div class="aspect-[2/3] bg-slate-700"></div>
                            <div class="p-3 sm:p-4">
                                <div class="h-4 bg-slate-700 rounded mb-2"></div>
                                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="animate-pulse">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div class="aspect-[2/3] bg-slate-700"></div>
                            <div class="p-3 sm:p-4">
                                <div class="h-4 bg-slate-700 rounded mb-2"></div>
                                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="animate-pulse">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div class="aspect-[2/3] bg-slate-700"></div>
                            <div class="p-3 sm:p-4">
                                <div class="h-4 bg-slate-700 rounded mb-2"></div>
                                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="animate-pulse hidden sm:block">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div class="aspect-[2/3] bg-slate-700"></div>
                            <div class="p-3 sm:p-4">
                                <div class="h-4 bg-slate-700 rounded mb-2"></div>
                                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="animate-pulse hidden md:block">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div class="aspect-[2/3] bg-slate-700"></div>
                            <div class="p-3 sm:p-4">
                                <div class="h-4 bg-slate-700 rounded mb-2"></div>
                                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="text-center py-12 sm:py-20">
                <i data-lucide="search" class="h-12 w-12 sm:h-16 sm:w-16 text-slate-600 mx-auto mb-4"></i>
                <h3 class="text-lg sm:text-xl font-semibold text-slate-400 mb-2">
                    Comece sua pesquisa
                </h3>
                <p class="text-sm sm:text-base text-slate-500 px-4">
                    Digite o nome de um filme ou série para começar
                </p>
            </div>
        </div>
    </div>

    <!-- Request Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script>
        // Pass tenant slug to JavaScript
        window.TENANT_SLUG = '<?php echo htmlspecialchars($tenantConfig['slug']); ?>';
    </script>
    <script src="/assets/js/tenant-search.js"></script>
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