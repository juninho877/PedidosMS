<?php
// Script de debug para verificar carregamento de classes
echo "=== DEBUG DE CLASSES ===\n";

// Incluir configuração
echo "1. Carregando config...\n";
require_once 'config/config.php';
echo "   ✅ Config carregado\n";

// Verificar classes essenciais
$essential_classes = [
    'Database' => 'config/Database.php',
    'AuthService' => 'services/AuthService.php', 
    'ClientAuthMiddleware' => 'middleware/ClientAuthMiddleware.php',
    'Tenant' => 'models/Tenant.php',
    'TenantMiddleware' => 'middleware/TenantMiddleware.php'
];

echo "\n2. Verificando classes essenciais...\n";
foreach ($essential_classes as $class => $expected_file) {
    echo "   Testando: $class\n";
    
    // Verificar se arquivo existe
    if (file_exists($expected_file)) {
        echo "     ✅ Arquivo existe: $expected_file\n";
    } else {
        echo "     ❌ Arquivo NÃO existe: $expected_file\n";
        continue;
    }
    
    // Verificar se classe está definida
    if (class_exists($class)) {
        echo "     ✅ Classe carregada: $class\n";
        
        // Tentar instanciar
        try {
            if ($class === 'Database') {
                $instance = new Database();
                echo "     ✅ Instanciação bem-sucedida\n";
            } elseif ($class === 'AuthService') {
                $instance = new AuthService();
                echo "     ✅ Instanciação bem-sucedida\n";
            } elseif ($class === 'ClientAuthMiddleware') {
                $instance = new ClientAuthMiddleware();
                echo "     ✅ Instanciação bem-sucedida\n";
            } elseif (in_array($class, ['Tenant', 'TenantMiddleware'])) {
                $db = new Database();
                $conn = $db->getConnection();
                if ($class === 'Tenant') {
                    $instance = new Tenant($conn);
                } else {
                    $instance = new TenantMiddleware();
                }
                echo "     ✅ Instanciação bem-sucedida\n";
            }
        } catch (Exception $e) {
            echo "     ❌ Erro na instanciação: " . $e->getMessage() . "\n";
        }
    } else {
        echo "     ❌ Classe NÃO carregada: $class\n";
    }
    echo "\n";
}

echo "3. Testando fluxo completo...\n";
try {
    echo "   Criando Database...\n";
    $database = new Database();
    echo "   ✅ Database criada\n";
    
    echo "   Obtendo conexão...\n";
    $conn = $database->getConnection();
    echo "   ✅ Conexão obtida\n";
    
    echo "   Criando Tenant...\n";
    $tenant = new Tenant($conn);
    echo "   ✅ Tenant criado\n";
    
    echo "   Criando TenantMiddleware...\n";
    $tenantMiddleware = new TenantMiddleware();
    echo "   ✅ TenantMiddleware criado\n";
    
    echo "   Criando AuthService...\n";
    $authService = new AuthService();
    echo "   ✅ AuthService criado\n";
    
    echo "   Criando ClientAuthMiddleware...\n";
    $clientAuth = new ClientAuthMiddleware();
    echo "   ✅ ClientAuthMiddleware criado\n";
    
} catch (Exception $e) {
    echo "   ❌ ERRO no fluxo: " . $e->getMessage() . "\n";
    echo "   Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== DEBUG CONCLUÍDO ===\n";
?>