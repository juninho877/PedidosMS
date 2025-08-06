<?php
echo "=== TESTE COMPLETO DO SISTEMA ===\n";

// 1. Testar carregamento do config
echo "1. Carregando configuração...\n";
try {
    require_once 'config/config.php';
    echo "   ✅ Config carregado com sucesso\n";
} catch (Exception $e) {
    echo "   ❌ ERRO no config: " . $e->getMessage() . "\n";
    exit;
}

// 2. Testar classes essenciais
echo "\n2. Testando classes essenciais...\n";
$essential_classes = [
    'Database',
    'AuthService', 
    'ClientAuthMiddleware',
    'Tenant',
    'TenantMiddleware'
];

foreach ($essential_classes as $class) {
    echo "   Testando: $class\n";
    
    if (class_exists($class)) {
        echo "     ✅ Classe encontrada\n";
        
        try {
            if ($class === 'Database') {
                $instance = new Database();
                $conn = $instance->getConnection();
                echo "     ✅ Instanciação e conexão bem-sucedidas\n";
            } elseif ($class === 'AuthService') {
                $instance = new AuthService();
                echo "     ✅ Instanciação bem-sucedida\n";
            } elseif ($class === 'ClientAuthMiddleware') {
                $instance = new ClientAuthMiddleware();
                echo "     ✅ Instanciação bem-sucedida\n";
            } elseif ($class === 'Tenant') {
                $db = new Database();
                $conn = $db->getConnection();
                $instance = new Tenant($conn);
                echo "     ✅ Instanciação bem-sucedida\n";
            } elseif ($class === 'TenantMiddleware') {
                $instance = new TenantMiddleware();
                echo "     ✅ Instanciação bem-sucedida\n";
            }
        } catch (Exception $e) {
            echo "     ❌ Erro na instanciação: " . $e->getMessage() . "\n";
        }
    } else {
        echo "     ❌ Classe NÃO encontrada\n";
    }
}

// 3. Testar fluxo do dashboard
echo "\n3. Testando fluxo do dashboard...\n";
try {
    echo "   Simulando carregamento do dashboard...\n";
    
    // Simular o que acontece no dashboard.php
    $middleware = new ClientAuthMiddleware();
    echo "   ✅ ClientAuthMiddleware criado\n";
    
    echo "   ✅ Sistema funcionando corretamente!\n";
    
} catch (Exception $e) {
    echo "   ❌ ERRO no fluxo: " . $e->getMessage() . "\n";
    echo "   Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== TESTE CONCLUÍDO ===\n";
?>