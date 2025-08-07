<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($tenantConfig['site_name']); ?> - Sistema de Solicitação de Filmes e Séries</title>
echo "<p><strong>PATH_INFO:</strong> " . ($_SERVER['PATH_INFO'] ?? 'N/A') . "</p>";
echo "<p><strong>QUERY_STRING:</strong> " . ($_SERVER['QUERY_STRING'] ?? 'N/A') . "</p>";
echo "<p><strong>DOCUMENT_ROOT:</strong> " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "</p>";
echo "<p><strong>Current Directory:</strong> " . __DIR__ . "</p>";
echo "<p><strong>File Path:</strong> " . __FILE__ . "</p>";
echo "<hr>";

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
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div class="text-center">
                <h1 class="text-6xl font-bold text-white mb-6 leading-tight">
                    <?php echo htmlspecialchars($tenantConfig['hero_title'] ?? 'Solicite seus Filmes e Séries favoritos'); ?>
                </h1>
                <?php if (!empty($tenantConfig['hero_subtitle'])): ?>
                <p class="text-2xl text-blue-300 mb-4 font-medium">
                    <?php echo htmlspecialchars($tenantConfig['hero_subtitle']); ?>
                </p>
                <?php endif; ?>
                <p class="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                    <?php echo htmlspecialchars($tenantConfig['hero_description'] ?? $tenantConfig['site_description'] ?? 'Sistema profissional de gerenciamento de solicitações de conteúdo audiovisual.'); ?>
                </p>
                <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="inline-flex items-center space-x-2 bg-primary hover:opacity-90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <i data-lucide="search" class="h-6 w-6"></i>
                    <span>Começar Pesquisa</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-4">Como Funciona</h2>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                Um processo simples e eficiente para solicitar seus conteúdos favoritos
            </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-primary/50 transition-all group">
                <div class="bg-primary w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
            <div class="grid grid-cols-4 gap-8 text-center">
                <div>
                    <div class="flex items-center justify-center mb-4">
                        <i data-lucide="film" class="h-8 w-8 text-primary"></i>
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
        <h2 class="text-4xl font-bold text-white mb-6">
            Pronto para solicitar seu conteúdo?
        </h2>
        <p class="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já encontraram seus filmes e séries favoritos através do nosso sistema.
        </p>
        <a href="/<?php echo htmlspecialchars($tenantConfig['slug']); ?>/search" class="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
            <i data-lucide="search" class="h-6 w-6"></i>
            <span>Iniciar Pesquisa</span>
        </a>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>