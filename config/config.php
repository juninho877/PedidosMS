<?php
// Configurações principais do sistema
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Definir constantes principais
define('APP_ROOT', dirname(__DIR__));
define('SITE_NAME', 'CineRequest');

// Configurações da API TMDB
define('TMDB_API_KEY', 'your_tmdb_api_key_here');
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
define('TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p');

// Configurações JWT
define('JWT_SECRET', 'sua_chave_secreta_jwt_super_segura_mude_em_producao');
define('JWT_ALGORITHM', 'HS256');

// Configurações de segurança
define('SECURE_COOKIES', false); // Mude para true em produção com HTTPS

// Headers de segurança
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Autoloader customizado - DEVE vir ANTES do Composer
spl_autoload_register(function ($class) {
    $paths = [
        APP_ROOT . '/models/',
        APP_ROOT . '/controllers/',
        APP_ROOT . '/services/',
        APP_ROOT . '/middleware/',
        APP_ROOT . '/config/'
    ];
    
    foreach ($paths as $path) {
        $file = $path . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Composer autoloader (para dependências como JWT)
if (file_exists(APP_ROOT . '/vendor/autoload.php')) {
    require_once APP_ROOT . '/vendor/autoload.php';
}

// Incluir configuração do banco de dados
require_once APP_ROOT . '/config/database.php';

// Configurações de sessão
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>