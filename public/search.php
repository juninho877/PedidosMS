<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesquisar - <?php echo htmlspecialchars($tenantConfig['site_name']); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo htmlspecialchars($tenantConfig['favicon_url'] ?? ''); ?>">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($tenantConfig['primary_color'] ?? '#3b82f6'); ?>;
            --secondary-color: <?php echo htmlspecialchars($tenantConfig['secondary_color'] ?? '#8b5cf6'); ?>;
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
            <div class="flex justify-between items-center h-16">
                <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>" class="flex items-center space-x-3 group">
                    <?php if (!empty($tenantConfig['logo_url'])): ?>
                        <img src="<?php echo htmlspecialchars($tenantConfig['logo_url']); ?>" alt="Logo" class="h-10 w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="film" class="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <?php endif; ?>
                    <span class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo htmlspecialchars($tenantConfig['site_name']); ?>
                    </span>
                </a>

                <div class="flex items-center space-x-6">
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
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-white mb-4">
                    Pesquisar Filmes e Séries
                </h1>
                <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                    Encontre seus conteúdos favoritos e solicite para nossa biblioteca
                </p>
            </div>

            <!-- Search Form -->
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-8">
                <form id="searchForm" class="space-y-6">
                    <div class="flex gap-4">
                        <div class="flex-1">
                            <input
                                type="text"
                                id="searchQuery"
                                placeholder="Digite o nome do filme ou série..."
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            id="searchBtn"
                            class="flex items-center space-x-2 bg-primary hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            <i data-lucide="search" class="h-5 w-5"></i>
                            <span>Buscar</span>
                        </button>
                    </div>

                    <!-- Filters -->
                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de Conteúdo</label>
                            <select
                                id="contentType"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="all">Todos</option>
                                <option value="movie">Filmes</option>
                                <option value="tv">Séries</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Ano de Lançamento</label>
                            <select
                                id="releaseYear"
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">Qualquer ano</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Results -->
            <div id="searchResults"></div>

            <!-- Loading -->
            <div id="loadingState" class="hidden text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p class="text-slate-400">Buscando conteúdo...</p>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="text-center py-20">
                <i data-lucide="search" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                <h3 class="text-xl font-semibold text-slate-400 mb-2">Comece sua pesquisa</h3>
                <p class="text-slate-500">Digite o nome de um filme ou série para começar</p>
            </div>
        </div>
    </div>

    <!-- Request Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <!-- Modal content will be populated by JavaScript -->
    </div>

    <script>
        window.TENANT_SLUG = '<?php echo htmlspecialchars($tenantConfig['slug']); ?>';
        window.TMDB_IMAGE_BASE_URL = '<?php echo TMDB_IMAGE_BASE_URL; ?>';
    </script>
    <script src="/assets/js/tenant-search.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>