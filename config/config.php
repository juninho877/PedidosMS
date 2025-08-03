<?php
// Configurações gerais do sistema
define('APP_ROOT', dirname(__DIR__));
define('BASE_URL', 'http://localhost');
define('SITE_NAME', 'CineRequest');

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