<?php
require_once '../config/config.php';

$middleware = new ClientAuthMiddleware();
$middleware->redirectIfClientAuthenticated();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Cliente - CineRequest SaaS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div class="max-w-md w-full">
            <div class="text-center mb-6 sm:mb-8">
                <div class="bg-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="building" class="h-6 w-6 sm:h-8 sm:w-8 text-white"></i>
                </div>
                <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Painel do Cliente</h1>
                <p class="text-sm sm:text-base text-slate-400 px-4">Entre com suas credenciais para gerenciar seu site</p>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8">
                <form id="clientLoginForm" class="space-y-4 sm:space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Slug do Cliente
                        </label>
                        <div class="relative">
                            <i data-lucide="at-sign" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"></i>
                            <input
                                type="text"
                                id="clientSlug"
                                class="w-full pl-10 pr-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                placeholder="meu-cliente"
                                required
                            />
                        </div>
                        <p class="text-xs text-slate-500 mt-1">O nome que aparece na URL do seu site</p>
                        <div id="slugError" class="text-red-400 text-sm mt-1 hidden"></div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">
                            Senha de Acesso
                        </label>
                        <div class="relative">
                            <i data-lucide="lock" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"></i>
                            <input
                                type="password"
                                id="clientPassword"
                                class="w-full pl-10 pr-12 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                        class="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                    >
                        <i data-lucide="log-in" class="h-5 w-5"></i>
                        <span>Entrar no Painel</span>
                    </button>
                </form>

                <div class="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700">
                    <p class="text-xs sm:text-sm text-slate-400 text-center px-2">
                        Não tem acesso? Entre em contato com o administrador do sistema.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <script src="../assets/js/client-login.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>