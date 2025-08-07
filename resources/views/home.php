<?php ob_start(); ?>

<!-- Navbar -->
<nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <a href="/" class="flex items-center space-x-3 group">
                <i data-lucide="film" class="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors"></i>
                <span class="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    CineRequest SaaS
                </span>
            </a>

            <div class="flex items-center space-x-6">
                <a href="/admin/login" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                    <i data-lucide="shield" class="h-4 w-4"></i>
                    <span>Admin</span>
                </a>

                <a href="/client/login" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                    <i data-lucide="user" class="h-4 w-4"></i>
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
                CineRequest SaaS
            </h1>
            <p class="text-2xl text-blue-300 mb-4 font-medium">
                Sistema Multi-Tenant de Solicitação de Filmes e Séries
            </p>
            <p class="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Plataforma completa para gerenciar solicitações de conteúdo audiovisual com integração TMDB, 
                dashboards personalizados e sites únicos para cada cliente.
            </p>
            <div class="flex justify-center space-x-4">
                <a href="/admin/login" class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <i data-lucide="shield" class="h-6 w-6"></i>
                    <span>Painel Admin</span>
                </a>
                <a href="/client/login" class="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <i data-lucide="user" class="h-6 w-6"></i>
                    <span>Painel Cliente</span>
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Features Section -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-white mb-4">Funcionalidades</h2>
        <p class="text-xl text-slate-400 max-w-2xl mx-auto">
            Sistema completo para gerenciar múltiplos clientes com sites personalizados
        </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
        <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group">
            <div class="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i data-lucide="users" class="h-8 w-8 text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Multi-Tenant</h3>
            <p class="text-slate-400">
                Cada cliente tem seu próprio site personalizado com URL única, cores, logo e conteúdo exclusivo.
            </p>
        </div>

        <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all group">
            <div class="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i data-lucide="film" class="h-8 w-8 text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Integração TMDB</h3>
            <p class="text-slate-400">
                Base de dados completa de filmes e séries com informações detalhadas, pôsteres e trailers.
            </p>
        </div>

        <div class="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all group">
            <div class="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i data-lucide="bar-chart" class="h-8 w-8 text-white"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Dashboard Completo</h3>
            <p class="text-slate-400">
                Painéis administrativos com estatísticas, gerenciamento de solicitações e analytics em tempo real.
            </p>
        </div>
    </div>
</div>

<!-- Demo Section -->
<div class="bg-slate-800/30 border-y border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">Sites de Demonstração</h2>
            <p class="text-slate-400">Veja exemplos de sites personalizados para diferentes clientes</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6">
            <a href="/exemplo-cliente" target="_blank" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all group">
                <div class="flex items-center space-x-3 mb-3">
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 class="text-white font-semibold">CineExemplo</h3>
                </div>
                <p class="text-slate-400 text-sm">Tema azul e vermelho</p>
                <p class="text-xs text-slate-500 mt-2">/exemplo-cliente</p>
            </a>
            
            <a href="/cine-premium" target="_blank" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all group">
                <div class="flex items-center space-x-3 mb-3">
                    <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h3 class="text-white font-semibold">Cine Premium</h3>
                </div>
                <p class="text-slate-400 text-sm">Tema roxo e laranja</p>
                <p class="text-xs text-slate-500 mt-2">/cine-premium</p>
            </a>
            
            <a href="/cine-familia" target="_blank" class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition-all group">
                <div class="flex items-center space-x-3 mb-3">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 class="text-white font-semibold">Cine Família</h3>
                </div>
                <p class="text-slate-400 text-sm">Tema verde e laranja</p>
                <p class="text-xs text-slate-500 mt-2">/cine-familia</p>
            </a>
        </div>
    </div>
</div>

<!-- Credentials Section -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
        <h2 class="text-2xl font-bold text-white mb-6 text-center">Credenciais de Demonstração</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
            <div class="text-center">
                <div class="bg-blue-600/10 border border-blue-600/20 rounded-lg p-6">
                    <i data-lucide="shield" class="h-12 w-12 text-blue-400 mx-auto mb-4"></i>
                    <h3 class="text-lg font-semibold text-white mb-4">Administrador</h3>
                    <div class="space-y-2 text-sm">
                        <p class="text-slate-300"><strong>Email:</strong> admin@cine.com</p>
                        <p class="text-slate-300"><strong>Senha:</strong> admin123</p>
                        <p class="text-slate-400">Gerencia todos os clientes do SaaS</p>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <div class="bg-purple-600/10 border border-purple-600/20 rounded-lg p-6">
                    <i data-lucide="user" class="h-12 w-12 text-purple-400 mx-auto mb-4"></i>
                    <h3 class="text-lg font-semibold text-white mb-4">Cliente</h3>
                    <div class="space-y-2 text-sm">
                        <p class="text-slate-300"><strong>Slug:</strong> exemplo-cliente</p>
                        <p class="text-slate-300"><strong>Senha:</strong> cliente123</p>
                        <p class="text-slate-400">Gerencia suas próprias solicitações</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $content = ob_get_clean(); ?>
<?php require_once __DIR__ . '/layouts/app.php'; ?>