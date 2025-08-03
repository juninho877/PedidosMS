<?php
require_once 'config/config.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - Sistema de Solicitação de Filmes e Séries</title>
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
                    <a href="/" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-600 text-white">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>

                    <a href="search.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
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

    <!-- Hero Section -->
    <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div class="text-center">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    Solicite seus <span class="text-blue-400">Filmes</span> e
                    <span class="text-purple-400">Séries</span> favoritos
                </h1>
                <p class="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                    Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual.
                    Pesquise, solicite e acompanhe suas preferências de entretenimento.
                </p>
                <a href="search.php" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <i data-lucide="search" class="h-6 w-6"></i>
                    <span>Começar Pesquisa</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Como Funciona</h2>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                Um processo simples e eficiente para solicitar seus conteúdos favoritos
            </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group">
                <div class="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="search" class="h-8 w-8 text-white"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-4">1. Pesquise</h3>
                <p class="text-slate-400">
                    Use nossa interface integrada com TMDB para encontrar filmes e séries com informações detalhadas e precisas.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all group">
                <div class="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="film" class="h-8 w-8 text-white"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-4">2. Solicite</h3>
                <p class="text-slate-400">
                    Preencha um formulário simples com seus dados de contato e especificações do conteúdo desejado.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all group">
                <div class="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="users" class="h-8 w-8 text-white"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-4">3. Acompanhe</h3>
                <p class="text-slate-400">
                    Nossa equipe analisa sua solicitação e você recebe atualizações sobre o status através do WhatsApp.
                </p>
            </div>
        </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-slate-800/30 border-y border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid md:grid-cols-4 gap-8 text-center">
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="film" class="h-8 w-8 text-blue-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-white mb-2">10K+</div>
                    <div class="text-slate-400">Filmes no Catálogo</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="tv" class="h-8 w-8 text-purple-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-white mb-2">5K+</div>
                    <div class="text-slate-400">Séries Disponíveis</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="trending-up" class="h-8 w-8 text-green-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-white mb-2">98%</div>
                    <div class="text-slate-400">Taxa de Satisfação</div>
                </div>
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="star" class="h-8 w-8 text-yellow-400"></i>
                    </div>
                    <div class="text-3xl font-bold text-white mb-2">24h</div>
                    <div class="text-slate-400">Tempo Médio de Resposta</div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para solicitar seu conteúdo?
        </h2>
        <p class="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já encontraram seus filmes e séries favoritos através do nosso sistema.
        </p>
        <a href="search.php" class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            <i data-lucide="search" class="h-6 w-6"></i>
            <span>Iniciar Pesquisa</span>
        </a>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>