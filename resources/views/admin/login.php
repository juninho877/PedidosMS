<?php ob_start(); ?>

<div class="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <div class="flex justify-center">
                <i data-lucide="shield" class="h-16 w-16 text-blue-400"></i>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
                Painel Administrativo
            </h2>
            <p class="mt-2 text-center text-sm text-slate-400">
                Entre com suas credenciais de administrador
            </p>
        </div>
        
        <form id="loginForm" class="mt-8 space-y-6">
            <div class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-slate-300">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        class="mt-1 appearance-none relative block w-full px-3 py-3 border border-slate-600 placeholder-slate-400 text-white bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="admin@cine.com"
                    />
                    <div id="emailError" class="text-red-400 text-sm mt-1 hidden"></div>
                </div>
                
                <div>
                    <label for="password" class="block text-sm font-medium text-slate-300">Senha</label>
                    <div class="mt-1 relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            class="appearance-none relative block w-full px-3 py-3 pr-10 border border-slate-600 placeholder-slate-400 text-white bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Sua senha"
                        />
                        <button
                            type="button"
                            id="togglePassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                        >
                            <i data-lucide="eye" class="h-5 w-5"></i>
                        </button>
                    </div>
                    <div id="passwordError" class="text-red-400 text-sm mt-1 hidden"></div>
                </div>
            </div>

            <div id="generalError" class="text-red-400 text-sm text-center hidden"></div>

            <div>
                <button
                    type="submit"
                    id="loginBtn"
                    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    <i data-lucide="log-in" class="h-5 w-5 mr-2"></i>
                    <span>Entrar</span>
                </button>
            </div>
        </form>
        
        <div class="text-center">
            <p class="text-sm text-slate-400">
                Credenciais de demonstração:<br>
                <span class="text-slate-300">admin@cine.com / admin123</span>
            </p>
        </div>
    </div>
</div>

<script src="/assets/js/login.js"></script>

<?php $content = ob_get_clean(); ?>
<?php require_once __DIR__ . '/../layouts/app.php'; ?>