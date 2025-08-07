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

                    <a href="admin/login.php" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span>Admin</span>
                    </a>

                    <a href="client/login.php" class="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        <i data-lucide="building" class="h-4 w-4"></i>
                        <span>Cliente</span>
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
                    Sistema <span class="text-blue-400">SaaS</span> para
                    <span class="text-purple-400">Entretenimento</span>
                </h1>
                <p class="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                    Plataforma completa para gerenciamento de solicitações de filmes e séries.
                    Multi-tenant, personalizável e pronta para produção.
                </p>
                <div class="flex items-center justify-center space-x-4">
                    <a href="admin/login.php" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <i data-lucide="users" class="h-6 w-6"></i>
                        <span>Painel Admin</span>
                    </a>
                    <a href="client/login.php" class="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <i data-lucide="building" class="h-6 w-6"></i>
                        <span>Painel Cliente</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-4">Recursos do Sistema</h2>
            <p class="text-xl text-slate-400 max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar um negócio de entretenimento
            </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group">
                <div class="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="users" class="h-8 w-8 text-white"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-4">Multi-Tenant</h3>
                <p class="text-slate-400">
                    Cada cliente tem seu próprio site personalizado com URL única, cores e conteúdo customizado.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all group">
                <div class="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="database" class="h-8 w-8 text-white"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-4">Integração TMDB</h3>
                <p class="text-slate-400">
                    Base de dados completa com milhares de filmes e séries, informações detalhadas e imagens oficiais.
                </p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all group">
                <div class="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i data-lucide="shield-check" class="h-8 w-8 text-white"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-4">Segurança Total</h3>
                <p class="text-slate-400">
                    Isolamento completo de dados entre clientes, autenticação JWT e proteção contra ataques.
                </p>
            </div>
        </div>
    </div>

    <!-- Demo Section -->
    <div class="bg-slate-800/30 border-y border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Clientes de Exemplo</h2>
                <p class="text-slate-400 mb-8">Veja como funciona na prática</p>
                
                <div class="grid md:grid-cols-3 gap-6">
                    <a href="/exemplo-cliente" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all group">
                        <i data-lucide="film" class="h-12 w-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform"></i>
                        <h3 class="text-lg font-semibold text-white mb-2">CineExemplo</h3>
                        <p class="text-slate-400 text-sm">exemplo-cliente</p>
                    </a>
                    
                    <a href="/cine-premium" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all group">
                        <i data-lucide="crown" class="h-12 w-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform"></i>
                        <h3 class="text-lg font-semibold text-white mb-2">Cine Premium</h3>
                        <p class="text-slate-400 text-sm">cine-premium</p>
                    </a>
                    
                    <a href="/cine-familia" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition-all group">
                        <i data-lucide="heart" class="h-12 w-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform"></i>
                        <h3 class="text-lg font-semibold text-white mb-2">Cine Família</h3>
                        <p class="text-slate-400 text-sm">cine-familia</p>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>