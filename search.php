<?php
require_once 'config/config.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesquisar - <?php echo SITE_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="/" class="flex items-center space-x-3 group">
                    <i data-lucide="film" class="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                    <span class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        <?php echo SITE_NAME; ?>
                    </span>
                </a>

                <div class="flex items-center space-x-6">
                    <a href="/" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>

                    <a href="search.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-600 text-white">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>

                    <a href="admin/login.php" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span>Admin</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="min-h-screen bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
                    Pesquisar Filmes e Séries
                </h1>
                <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                    Encontre seus conteúdos favoritos e solicite para nossa biblioteca
                </p>
            </div>

            <!-- Search Form -->
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 mb-8">
                <form id="searchForm" class="space-y-6">
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex-1">
                            <input
                                type="text"
                                id="searchQuery"
                                placeholder="Digite o nome do filme ou série..."
                                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div class="flex gap-2">
                            <button
                                type="button"
                                id="toggleFilters"
                                class="flex items-center space-x-2 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                            >
                                <i data-lucide="filter" class="h-5 w-5"></i>
                                <span>Filtros</span>
                            </button>
                            <button
                                type="submit"
                                id="searchBtn"
                                class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                <i data-lucide="search" class="h-5 w-5"></i>
                                <span>Buscar</span>
                            </button>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div id="filtersSection" class="border-t border-slate-700 pt-6 space-y-4 hidden">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">
                                    Tipo de Conteúdo
                                </label>
                                <select
                                    id="contentType"
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Qualquer ano</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- View Controls -->
            <div id="viewControls" class="flex items-center justify-between mb-6 hidden">
                <p id="resultsCount" class="text-slate-400"></p>
                <div class="flex items-center space-x-2">
                    <button
                        id="gridView"
                        class="p-2 rounded-lg transition-colors bg-blue-600 text-white"
                    >
                        <i data-lucide="grid-3x3" class="h-5 w-5"></i>
                    </button>
                    <button
                        id="listView"
                        class="p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                        <i data-lucide="list" class="h-5 w-5"></i>
                    </button>
                </div>
            </div>

            <!-- Results -->
            <div id="searchResults"></div>

            <!-- Loading -->
            <div id="loadingState" class="hidden">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <!-- Loading skeletons -->
                    <div class="animate-pulse" style="animation-delay: 0ms;">
                        <div class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                            <div class="aspect-[2/3] bg-slate-700"></div>
                            <div class="p-4">
                                <div class="h-4 bg-slate-700 rounded mb-2"></div>
                                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                    <!-- Repeat for more skeletons -->
                </div>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="text-center py-20">
                <i data-lucide="search" class="h-16 w-16 text-slate-600 mx-auto mb-4"></i>
                <h3 class="text-xl font-semibold text-slate-400 mb-2">
                    Comece sua pesquisa
                </h3>
                <p class="text-slate-500">
                    Digite o nome de um filme ou série para começar
                </p>
            </div>
        </div>
    </div>

    <!-- Request Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script src="assets/js/search.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>