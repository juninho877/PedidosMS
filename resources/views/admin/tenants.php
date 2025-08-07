<?php
use App\Services\AuthService;

$authService = new AuthService();
$user = $authService->getCurrentUser('admin_token');

if (!$user) {
    header('Location: /admin/login');
    exit;
}

ob_start();
?>

<!-- Admin Navbar -->
<nav class="bg-slate-800 border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <a href="/admin/dashboard" class="flex items-center space-x-3">
                <i data-lucide="shield" class="h-8 w-8 text-blue-400"></i>
                <span class="text-xl font-bold text-white">Admin Dashboard</span>
            </a>

            <div class="flex items-center space-x-6">
                <a href="/admin/dashboard" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                    <i data-lucide="bar-chart" class="h-4 w-4"></i>
                    <span>Dashboard</span>
                </a>

                <a href="/admin/tenants" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors bg-blue-600 text-white">
                    <i data-lucide="users" class="h-4 w-4"></i>
                    <span>Clientes</span>
                </a>

                <button onclick="logout()" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                    <i data-lucide="log-out" class="h-4 w-4"></i>
                    <span>Sair</span>
                </button>
            </div>
        </div>
    </div>
</nav>

<!-- Main Content -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">Gerenciar Clientes</h1>
            <p class="text-slate-400">Administre todos os clientes do sistema SaaS</p>
        </div>
        <button
            id="addTenantBtn"
            class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
            <i data-lucide="plus" class="h-5 w-5"></i>
            <span>Novo Cliente</span>
        </button>
    </div>

    <!-- Tenants List -->
    <div id="tenantsList">
        <!-- Content will be loaded by JavaScript -->
    </div>
</div>

<!-- Modal -->
<div id="tenantModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
    <!-- Modal content will be populated by JavaScript -->
</div>

<script>
    async function logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Erro no logout:', error);
            window.location.href = '/admin/login';
        }
    }
</script>

<script src="/assets/js/tenants.js"></script>

<?php $content = ob_get_clean(); ?>
<?php require_once __DIR__ . '/../layouts/app.php'; ?>