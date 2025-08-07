<?php
require_once 'config/config.php';

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    header('Location: /');
    exit;
}

// Verificar se o tenant existe
$tenantMiddleware = new TenantMiddleware();
if (!$tenantMiddleware->validateTenantSlug($slug)) {
    header('Location: /');
    exit;
}

// Redirecionar se já estiver logado
$tenantMiddleware->redirectIfTenantAuthenticated();

// Carregar dados do tenant
$database = new Database();
$db = $database->getConnection();
$tenant = new Tenant($db);
$tenant->findBySlug($slug);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo $tenant->site_name ?: $tenant->name; ?></title>
    
    <?php if ($tenant->favicon_url): ?>
    <link rel="icon" href="<?php echo $tenant->favicon_url; ?>">
    <?php endif; ?>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
    
    <style>
        :root {
            --primary-color: <?php echo $tenant->primary_color ?: '#3B82F6'; ?>;
            --secondary-color: <?php echo $tenant->secondary_color ?: '#EF4444'; ?>;
        }
        .btn-primary {
            background-color: var(--primary-color);
        }
        .btn-primary:hover {
            filter: brightness(0.9);
        }
        .text-primary {
            color: var(--primary-color);
        }
        .border-primary {
            border-color: var(--primary-color);
        }
        .focus-primary:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div class="max-w-md w-full">
            <div class="text-center mb-6 sm:mb-8">
                <div class="btn-primary w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <?php if ($tenant->logo_url): ?>
                        <img src="<?php echo $tenant->logo_url; ?>" alt="<?php echo $tenant->site_name; ?>" class="h-8 w-8 sm:h-10 sm:w-10 object-contain">
                    <?php else: ?>
                        <i data-lucide="lock" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                    <?php endif; ?>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Acesso ao Painel</h1>
                <p class="text-sm sm:text-base text-slate-400 px-4"><?php echo $tenant->site_name ?: $tenant->name; ?></p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                <form id="loginForm" class="space-y-4 sm:space-y-6">
                    <input type="hidden" id="tenantSlug" value="<?php echo $slug; ?>">
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Senha de Acesso
                        </label>
                        <div class="relative">
                            <i data-lucide="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"></i>
                            <input
                                type="password"
                                id="password"
                                class="w-full pl-10 pr-12 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus-primary focus:border-transparent text-sm sm:text-base"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                id="togglePassword"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                <i data-lucide="eye" class="h-5 w-5"></i>
                            </button>
                        </div>
                        <div id="passwordError" class="text-red-400 text-sm mt-1 hidden"></div>
                    </div>

                    <div id="generalError" class="text-red-400 text-sm hidden"></div>

                    <button
                        type="submit"
                        id="loginBtn"
                        class="w-full flex items-center justify-center space-x-2 btn-primary hover:opacity-90 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                    >
                        <i data-lucide="log-in" class="h-5 w-5"></i>
                        <span>Entrar no Painel</span>
                    </button>
                </form>

                <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
                    <p class="text-xs sm:text-sm text-slate-400 text-center px-2">
                        Acesso restrito para gerenciamento de solicitações
                    </p>
                    <div class="text-center mt-4">
                        <a href="/<?php echo $slug; ?>" class="text-primary hover:opacity-80 text-sm">
                            ← Voltar ao site
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/assets/js/tenant-login.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>