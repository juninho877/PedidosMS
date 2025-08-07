<?php
use App\Services\AuthService;

$authService = new AuthService();
$tenant = $authService->getCurrentUser('client_token');

if (!$tenant) {
    header('Location: /client/login');
    exit;
}

ob_start();
?>

<!-- Client Navbar -->
<nav class="bg-slate-800 border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <a href="/client/dashboard" class="flex items-center space-x-3">
                <i data-lucide="user" class="h-8 w-8 text-purple-400"></i>
                <span class="text-xl font-bold text-white">Dashboard - <?= htmlspecialchars($tenant['site_name']) ?></span>
            </a>

            <div class="flex items-center space-x-6">
                <a href="/<?= htmlspecialchars($tenant['slug']) ?>" target="_blank" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                    <i data-lucide="external-link" class="h-4 w-4"></i>
                    <span>Ver Site</span>
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
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Dashboard - <?= htmlspecialchars($tenant['site_name']) ?></h1>
        <p class="text-slate-400">Bem-vindo ao painel de gerenciamento do seu site</p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-slate-700 mb-8">
        <nav class="-mb-px flex space-x-8">
            <button class="tab-btn active" data-tab="overview">
                <i data-lucide="bar-chart" class="h-5 w-5 mr-2"></i>
                Visão Geral
            </button>
            <button class="tab-btn" data-tab="requests">
                <i data-lucide="inbox" class="h-5 w-5 mr-2"></i>
                Solicitações
            </button>
            <button class="tab-btn" data-tab="settings">
                <i data-lucide="settings" class="h-5 w-5 mr-2"></i>
                Configurações
            </button>
            <button class="tab-btn" data-tab="analytics">
                <i data-lucide="trending-up" class="h-5 w-5 mr-2"></i>
                Analytics
            </button>
        </nav>
    </div>

    <!-- Tab Contents -->
    <div id="overview-tab" class="tab-content">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-500/10 mr-4">
                        <i data-lucide="inbox" class="h-8 w-8 text-blue-400"></i>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Total de Solicitações</p>
                        <p class="text-2xl font-bold text-white" id="totalRequests">-</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-yellow-500/10 mr-4">
                        <i data-lucide="clock" class="h-8 w-8 text-yellow-400"></i>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Pendentes</p>
                        <p class="text-2xl font-bold text-white" id="pendingRequests">-</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-500/10 mr-4">
                        <i data-lucide="check-circle" class="h-8 w-8 text-green-400"></i>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Aprovadas</p>
                        <p class="text-2xl font-bold text-white" id="approvedRequests">-</p>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-red-500/10 mr-4">
                        <i data-lucide="x-circle" class="h-8 w-8 text-red-400"></i>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Negadas</p>
                        <p class="text-2xl font-bold text-white" id="deniedRequests">-</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="requests-tab" class="tab-content hidden">
        <!-- Filters -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select id="statusFilter" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option value="">Todos</option>
                        <option value="pending">Pendente</option>
                        <option value="approved">Aprovada</option>
                        <option value="denied">Negada</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                    <select id="typeFilter" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option value="">Todos</option>
                        <option value="movie">Filmes</option>
                        <option value="tv">Séries</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Buscar</label>
                    <input type="text" id="searchFilter" placeholder="Nome do conteúdo ou solicitante..." class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                </div>
            </div>
        </div>

        <!-- Requests List -->
        <div id="requestsList">
            <!-- Content will be loaded by JavaScript -->
        </div>
    </div>

    <div id="settings-tab" class="tab-content hidden">
        <form id="settingsForm" class="space-y-6">
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Informações Básicas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Nome da Empresa</label>
                        <input type="text" id="companyName" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Nome do Site</label>
                        <input type="text" id="siteName" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Email de Contato</label>
                        <input type="email" id="contactEmail" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">WhatsApp</label>
                        <input type="text" id="contactWhatsapp" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Conteúdo do Site</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Slogan do Site</label>
                        <input type="text" id="siteTagline" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Descrição do Site</label>
                        <textarea id="siteDescription" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Título Principal</label>
                            <input type="text" id="heroTitle" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Subtítulo</label>
                            <input type="text" id="heroSubtitle" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Descrição da Seção Principal</label>
                        <textarea id="heroDescription" rows="3" class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"></textarea>
                    </div>
                </div>
            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-4">Cores do Site</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Cor Primária</label>
                        <input type="color" id="primaryColor" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Cor Secundária</label>
                        <input type="color" id="secondaryColor" class="w-full h-10 bg-slate-700 border border-slate-600 rounded-lg">
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Salvar Configurações
                </button>
            </div>
        </form>
    </div>

    <div id="analytics-tab" class="tab-content hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-2">Taxa de Aprovação</h3>
                <p class="text-3xl font-bold text-green-400" id="approvalRate">-</p>
            </div>
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-2">Média Diária</h3>
                <p class="text-3xl font-bold text-blue-400" id="dailyAverage">-</p>
            </div>
            <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-white mb-2">Tipo Mais Solicitado</h3>
                <p class="text-3xl font-bold text-purple-400" id="mostRequestedType">-</p>
            </div>
        </div>

        <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Solicitações por Dia (Últimos 7 dias)</h3>
            <div id="dailyChart">
                <!-- Chart will be rendered here -->
            </div>
        </div>
    </div>
</div>

<!-- Request Details Modal -->
<div id="requestDetailsModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
    <!-- Modal content will be populated by JavaScript -->
</div>

<script>
    window.CLIENT_DATA = <?= json_encode($tenant) ?>;
    window.TMDB_IMAGE_BASE_URL = '<?= htmlspecialchars('https://image.tmdb.org/t/p') ?>';
    window.TMDB_API_KEY = '<?= htmlspecialchars('eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWEyNDRlNTA2YzI4YjcxNDQwMTVjY2I3ZWZjMGE3NiIsInN1YiI6IjY3MmE4YzI4NzUwNGE5NzE5YzE4ZjY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Hs_bVOBBUaKJWJhJJJJJJJJJJJJJJJJJJJJJJJJJJJJ') ?>';

    async function logout() {
        try {
            await fetch('/api/client-auth/logout', { method: 'POST' });
            window.location.href = '/client/login';
        } catch (error) {
            console.error('Erro no logout:', error);
            window.location.href = '/client/login';
        }
    }
</script>

<script src="/assets/js/client-dashboard.js"></script>

<?php $content = ob_get_clean(); ?>
<?php require_once __DIR__ . '/../layouts/app.php'; ?>