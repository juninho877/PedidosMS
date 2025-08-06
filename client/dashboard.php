<?php
require_once '../config/config.php';

// Require client authentication
$middleware = new ClientAuthMiddleware();
$client = $middleware->requireClientAuth();

// Buscar dados atualizados do cliente no banco de dados
$database = new Database();
$db = $database->getConnection();
$tenant = new Tenant($db);

// Buscar dados completos e atualizados do tenant
$clientData = null;
if ($tenant->findById($client['id'])) {
    $clientData = $tenant->toArray();
} else {
    // Fallback para dados do middleware se não encontrar no banco
    $clientData = $client;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Cliente - <?php echo htmlspecialchars($clientData['site_name'] ?? $clientData['name'] ?? 'CineRequest'); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" type="image/x-icon" href="<?php echo htmlspecialchars($clientData['favicon_url'] ?? '/assets/images/default-favicon.ico'); ?>">
    <style>
        :root {
            --primary-color: <?php echo htmlspecialchars($clientData['primary_color'] ?? '#1E40AF'); ?>;
            --secondary-color: <?php echo htmlspecialchars($clientData['secondary_color'] ?? '#DC2626'); ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .text-secondary { color: var(--secondary-color); }
        .hover\:bg-primary:hover { background-color: var(--primary-color); }
        .focus\:ring-primary:focus { --tw-ring-color: var(--primary-color); }
    </style>
</head>
<body class="bg-slate-900 text-white">
    <!-- Navbar -->
    <nav class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <?php if (!empty($clientData['logo_url'])): ?>
                        <img src="<?php echo htmlspecialchars($clientData['logo_url']); ?>" alt="Logo" class="h-8 w-8 object-contain">
                    <?php else: ?>
                        <i data-lucide="building" class="h-8 w-8 text-blue-400"></i>
                    <?php endif; ?>
                    <div>
                        <h1 class="text-lg font-bold text-white" id="clientNameDisplay">
                            <?php echo htmlspecialchars($clientData['site_name'] ?? $clientData['name'] ?? 'Cliente'); ?>
                        </h1>
                        <p class="text-xs text-slate-400">Painel do Cliente</p>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <a 
                        href="/<?php echo htmlspecialchars($clientData['slug'] ?? ''); ?>" 
                        target="_blank"
                        class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                    >
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        <span class="hidden sm:inline">Ver Site</span>
                    </a>
                    <button
                        id="logoutBtn"
                        class="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
                    >
                        <i data-lucide="log-out" class="h-4 w-4"></i>
                        <span class="hidden sm:inline">Sair</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="min-h-screen bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Tabs Navigation -->
            <div class="border-b border-slate-700 mb-8">
                <nav class="-mb-px flex space-x-8 overflow-x-auto">
                    <button 
                        class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-400 whitespace-nowrap"
                        data-tab="overview"
                    >
                        <i data-lucide="home" class="h-4 w-4 inline mr-2"></i>
                        Visão Geral
                    </button>
                    <button 
                        class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300 whitespace-nowrap"
                        data-tab="requests"
                    >
                        <i data-lucide="list" class="h-4 w-4 inline mr-2"></i>
                        Solicitações
                    </button>
                    <button 
                        class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300 whitespace-nowrap"
                        data-tab="customization"
                    >
                        <i data-lucide="palette" class="h-4 w-4 inline mr-2"></i>
                        Personalização
                    </button>
                    <button 
                        class="tab-button py-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300 whitespace-nowrap"
                        data-tab="analytics"
                    >
                        <i data-lucide="bar-chart-3" class="h-4 w-4 inline mr-2"></i>
                        Analytics
                    </button>
                </nav>
            </div>

            <!-- Tab Content -->
            <div id="tabContent">
                <!-- Content will be populated by JavaScript -->
                <div class="text-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p class="text-slate-400">Carregando painel...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div id="toastContainer" class="fixed top-4 right-4 z-50 space-y-2"></div>

    <!-- Request Details Modal -->
    <div id="requestDetailsModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <!-- Pass client data to JavaScript -->
    <script>
        window.CLIENT_DATA = <?php echo json_encode($clientData, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP); ?>;
        console.log('CLIENT_DATA loaded:', window.CLIENT_DATA);
    </script>
    
    <script src="../assets/js/client-dashboard.js?v=<?php echo time(); ?>"></script>
    
    <script>
        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await fetch('/api/client-auth.php/logout', { method: 'POST' });
                window.location.href = '/client/login.php';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/client/login.php';
            }
        });

        lucide.createIcons();
    </script>
</body>
</html>