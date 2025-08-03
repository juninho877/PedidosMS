<?php
require_once 'config/config.php';

$type = $_GET['type'] ?? '';
$id = $_GET['id'] ?? '';

if (empty($type) || empty($id) || !in_array($type, ['movie', 'tv'])) {
    header('Location: search.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalhes - <?php echo SITE_NAME; ?></title>
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
                    <a href="/" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="home" class="h-4 w-4"></i>
                        <span>Início</span>
                    </a>

                    <a href="search.php" class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-slate-700">
                        <i data-lucide="search" class="h-4 w-4"></i>
                        <span>Pesquisar</span>
                    </a>

                    <a href="admin/login.php" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <i data-lucide="users" class="h-4 w-4"></i>
                        <span>Admin</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div id="contentDetails" class="min-h-screen bg-slate-900">
        <!-- Loading state -->
        <div id="loadingDetails" class="min-h-screen bg-slate-900 flex items-center justify-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
    </div>

    <!-- Request Modal -->
    <div id="requestModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 hidden">
        <div class="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal content will be populated by JavaScript -->
        </div>
    </div>

    <script>
        const contentType = '<?php echo $type; ?>';
        const contentId = '<?php echo $id; ?>';
    </script>
    <script src="assets/js/details.js"></script>
    <script>
        lucide.createIcons();
    </script>
</body>
</html>