<?php
// Arquivo de teste para verificar o autoloader
echo "=== TESTE DO AUTOLOADER ===\n";

// Incluir configuração
require_once 'config/config.php';

echo "Config carregado com sucesso\n";

// Testar classes uma por uma
$classes_to_test = [
    'Database',
    'User', 
    'Tenant',
    'Request',
    'AuthService',
    'TMDBService',
    'AuthMiddleware',
    'ClientAuthMiddleware', 
    'TenantMiddleware',
    'AuthController',
    'RequestController',
    'TMDBController'
];

foreach ($classes_to_test as $class) {
    echo "Testando classe: $class... ";
    
    if (class_exists($class)) {
        echo "✅ ENCONTRADA\n";
        
        // Tentar instanciar se possível
        try {
            if ($class === 'Database') {
                $instance = new $class();
                echo "  - Instanciação: ✅ SUCESSO\n";
            } elseif (in_array($class, ['User', 'Tenant', 'Request'])) {
                $db = new Database();
                $conn = $db->getConnection();
                $instance = new $class($conn);
                echo "  - Instanciação: ✅ SUCESSO\n";
            } elseif (in_array($class, ['AuthService', 'TMDBService'])) {
                $instance = new $class();
                echo "  - Instanciação: ✅ SUCESSO\n";
            } elseif (in_array($class, ['AuthMiddleware', 'ClientAuthMiddleware', 'TenantMiddleware'])) {
                $instance = new $class();
                echo "  - Instanciação: ✅ SUCESSO\n";
            } elseif (in_array($class, ['AuthController', 'RequestController', 'TMDBController'])) {
                $instance = new $class();
                echo "  - Instanciação: ✅ SUCESSO\n";
            }
        } catch (Exception $e) {
            echo "  - Instanciação: ❌ ERRO - " . $e->getMessage() . "\n";
        }
    } else {
        echo "❌ NÃO ENCONTRADA\n";
        
        // Verificar se o arquivo existe
        $paths = [
            'models/',
            'controllers/',
            'services/',
            'middleware/',
            'config/'
        ];
        
        foreach ($paths as $path) {
            $file = $path . $class . '.php';
            if (file_exists($file)) {
                echo "  - Arquivo existe em: $file\n";
                break;
            }
        }
    }
}

echo "\n=== TESTE CONCLUÍDO ===\n";
?>