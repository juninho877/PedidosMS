<?php
require_once '../config/config.php';

$middleware = new AuthMiddleware();
$middleware->redirectIfAuthenticated();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - <?php echo SITE_NAME; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full">
            <div class="text-center mb-8">
                <div class="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="lock" class="h-8 w-8 text-white"></i>
                </div>
                <h1 class="text-3xl font-bold text-white mb-2">Acesso Administrativo</h1>
                <p class="text-slate-400">Entre com suas credenciais para acessar o painel</p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <form id="loginForm" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div class="relative">
                            <i data-lucide="mail" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"></i>
                            <input
                                type="email"
                                id="email"
                                class="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                        <div id="emailError" class="text-red-400 text-sm mt-1 hidden"></div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                        <div class="relative">
                            <i data-lucide="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"></i>
                            <input
                                type="password"
                                id="password"
                                class="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        class="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        <i data-lucide="log-in" class="h-5 w-5"></i>
                        <span>Entrar</span>
                    </button>
                </form>

                <div class="mt-6 pt-6 border-t border-slate-700">
                    <p class="text-sm text-slate-400 text-center">
                        Acesso restrito apenas para administradores autorizados
                    </p>
                    <p class="text-xs text-slate-500 text-center mt-2">
                        Usuário padrão: admin@cine.com | Senha: admin123
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/js/login.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>