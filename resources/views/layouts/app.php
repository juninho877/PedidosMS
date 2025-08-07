<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'CineRequest SaaS' ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
    <?php if (isset($tenant)): ?>
    <style>
        :root {
            --primary-color: <?= htmlspecialchars($tenant['primary_color'] ?? '#3b82f6') ?>;
            --secondary-color: <?= htmlspecialchars($tenant['secondary_color'] ?? '#8b5cf6') ?>;
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        .bg-secondary { background-color: var(--secondary-color); }
        .text-secondary { color: var(--secondary-color); }
    </style>
    <?php endif; ?>
</head>
<body class="bg-slate-900 text-white">
    <?php echo $content ?? '' ?>
    
    <script>
        lucide.createIcons();
    </script>
</body>
</html>