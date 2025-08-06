<?php
require_once 'config/config.php';

// Script de depuração para verificar o estado do banco de dados
echo "<h1>Debug do Sistema CineRequest</h1>";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "<h2>✅ Conexão com banco de dados: OK</h2>";
    
    // Verificar se a tabela tenants existe
    $query = "SHOW TABLES LIKE 'tenants'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "<h2>✅ Tabela 'tenants' existe</h2>";
        
        // Verificar estrutura da tabela
        $query = "DESCRIBE tenants";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $columns = $stmt->fetchAll();
        
        echo "<h3>Estrutura da tabela 'tenants':</h3>";
        echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
        echo "<tr><th>Campo</th><th>Tipo</th><th>Null</th><th>Key</th><th>Default</th></tr>";
        foreach ($columns as $column) {
            echo "<tr>";
            echo "<td>" . $column['Field'] . "</td>";
            echo "<td>" . $column['Type'] . "</td>";
            echo "<td>" . $column['Null'] . "</td>";
            echo "<td>" . $column['Key'] . "</td>";
            echo "<td>" . $column['Default'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
        
        // Verificar se existem tenants
        $query = "SELECT id, slug, name, active FROM tenants";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $tenants = $stmt->fetchAll();
        
        echo "<h3>Tenants cadastrados (" . count($tenants) . "):</h3>";
        if (count($tenants) > 0) {
            echo "<table border='1' style='border-collapse: collapse; margin: 10px 0;'>";
            echo "<tr><th>ID</th><th>Slug</th><th>Nome</th><th>Ativo</th></tr>";
            foreach ($tenants as $tenant) {
                echo "<tr>";
                echo "<td>" . $tenant['id'] . "</td>";
                echo "<td>" . $tenant['slug'] . "</td>";
                echo "<td>" . $tenant['name'] . "</td>";
                echo "<td>" . ($tenant['active'] ? 'Sim' : 'Não') . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p style='color: red;'>❌ Nenhum tenant encontrado!</p>";
            echo "<p>Execute o SQL para criar o tenant de teste:</p>";
            echo "<pre style='background: #f0f0f0; padding: 10px; margin: 10px 0;'>";
            echo "INSERT INTO tenants (slug, name, password, hero_title, hero_subtitle, hero_description, primary_color, secondary_color) VALUES \n";
            echo "('teste', 'CineRequest Teste', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bem-vindo ao Teste', 'Sistema de teste', 'Teste nosso sistema de solicitações', '#1E40AF', '#DC2626');";
            echo "</pre>";
        }
        
    } else {
        echo "<h2>❌ Tabela 'tenants' não existe!</h2>";
        echo "<p>Execute o SQL para criar a estrutura:</p>";
        echo "<pre style='background: #f0f0f0; padding: 10px; margin: 10px 0;'>";
        echo "CREATE TABLE tenants (\n";
        echo "    id INT AUTO_INCREMENT PRIMARY KEY,\n";
        echo "    slug VARCHAR(100) NOT NULL UNIQUE,\n";
        echo "    name VARCHAR(255) NOT NULL,\n";
        echo "    password VARCHAR(255) NOT NULL,\n";
        echo "    logo_url VARCHAR(500) NULL,\n";
        echo "    favicon_url VARCHAR(500) NULL,\n";
        echo "    hero_title VARCHAR(500) NULL,\n";
        echo "    hero_subtitle VARCHAR(500) NULL,\n";
        echo "    hero_description TEXT NULL,\n";
        echo "    primary_color VARCHAR(7) DEFAULT '#1E40AF',\n";
        echo "    secondary_color VARCHAR(7) DEFAULT '#DC2626',\n";
        echo "    active BOOLEAN DEFAULT TRUE,\n";
        echo "    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n";
        echo "    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n";
        echo ");";
        echo "</pre>";
    }
    
    // Testar o middleware diretamente
    echo "<h2>Teste do TenantMiddleware</h2>";
    $tenantMiddleware = new TenantMiddleware();
    $result = $tenantMiddleware->identifyTenant('teste');
    echo "<p>identifyTenant('teste'): " . ($result ? 'TRUE' : 'FALSE') . "</p>";
    
    $config = $tenantMiddleware->getTenantConfig();
    echo "<p>getTenantConfig(): " . ($config ? 'CONFIGURAÇÃO ENCONTRADA' : 'NULL') . "</p>";
    
    if ($config) {
        echo "<pre style='background: #f0f0f0; padding: 10px; margin: 10px 0;'>";
        print_r($config);
        echo "</pre>";
    }
    
} catch (Exception $e) {
    echo "<h2>❌ Erro de conexão com banco de dados:</h2>";
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
    echo "<p>Verifique as configurações em config/database.php</p>";
}

// Verificar se os arquivos necessários existem
echo "<h2>Verificação de Arquivos</h2>";
$files_to_check = [
    'public/home.php',
    'public/search.php', 
    'public/details.php',
    'public/404.php',
    'middleware/TenantMiddleware.php',
    'models/Tenant.php'
];

foreach ($files_to_check as $file) {
    $exists = file_exists($file);
    echo "<p>" . ($exists ? '✅' : '❌') . " " . $file . "</p>";
}

echo "<h2>Informações do Servidor</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p>Script Name: " . $_SERVER['SCRIPT_NAME'] . "</p>";
echo "<p>Request URI: " . $_SERVER['REQUEST_URI'] . "</p>";
echo "<p>Current Working Directory: " . getcwd() . "</p>";

// Verificar mod_rewrite
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    echo "<p>mod_rewrite: " . (in_array('mod_rewrite', $modules) ? '✅ Habilitado' : '❌ Desabilitado') . "</p>";
} else {
    echo "<p>mod_rewrite: ❓ Não foi possível verificar</p>";
}
?>