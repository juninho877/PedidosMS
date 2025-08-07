<?php ob_start(); ?>

<div class="min-h-screen flex items-center justify-center p-4">
    <div class="text-center">
        <div class="mb-8">
            <i data-lucide="search-x" class="h-24 w-24 text-slate-600 mx-auto mb-4"></i>
            <h1 class="text-6xl font-bold text-white mb-4">404</h1>
            <h2 class="text-2xl font-semibold text-slate-300 mb-4">Página não encontrada</h2>
            <p class="text-slate-400 mb-8 max-w-md mx-auto">
                A página que você está procurando não existe ou foi movida.
            </p>
        </div>
        
        <a 
            href="/" 
            class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
            <i data-lucide="home" class="h-5 w-5"></i>
            <span>Voltar ao Início</span>
        </a>
    </div>
</div>

<?php $content = ob_get_clean(); ?>
<?php require_once __DIR__ . '/../layouts/app.php'; ?>