<?php
// Start output buffering to prevent premature output
ob_start();

// Configurações gerais do sistema
define('APP_ROOT', dirname(__DIR__));
define('BASE_URL', 'http://localhost');
define('SITE_NAME', 'CineRequest');

// Incluir autoloader do Composer
if (file_exists(APP_ROOT . '/vendor/autoload.php')) {
    require_once APP_ROOT . '/vendor/autoload.php';
}

// Incluir classe Database
require_once __DIR__ . '/database.php';

// Configurações da API TMDB
define('TMDB_API_KEY', 'e9a244e506c28b7144015ccb7efc0a76');
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
define('TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p');

// Configurações JWT
define('JWT_SECRET', 'sua_chave_secreta_jwt_aqui_mude_em_producao');
define('JWT_ALGORITHM', 'HS256');

// Configurações de sessão
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 0); // Mude para 1 em HTTPS

// Configurações de erro para desenvolvimento
ini_set('display_errors', 0); // Não mostrar erros na tela (quebra JSON)
ini_set('log_errors', 1); // Log errors to file

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Headers de segurança
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Autoload das classes
spl_autoload_register(function ($class) {
    $paths = [
        APP_ROOT . '/models/',
        APP_ROOT . '/controllers/',
        APP_ROOT . '/services/',
        APP_ROOT . '/middleware/'
    ];
    
    foreach ($paths as $path) {
        $file = $path . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            break;
        }
    }
});
?>