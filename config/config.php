<?php
// Configurações gerais do sistema
define('APP_ROOT', dirname(__DIR__));
define('BASE_URL', 'http://localhost');
define('SITE_NAME', 'CineRequest SaaS');

// Configurações da API TMDB
define('TMDB_API_KEY', 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWEyNDRlNTA2YzI4YjcxNDQwMTVjY2I3ZWZjMGE3NiIsInN1YiI6IjY3MmE4YzI4NzUwNGE5NzE5YzE4ZjY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Hs_bVOBBUaKJWJhJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
define('TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p');

// Configurações JWT
define('JWT_SECRET', 'sua_chave_secreta_jwt_aqui_mude_em_producao_' . md5(__DIR__));
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

// Incluir autoloader do Composer se existir
if (file_exists(APP_ROOT . '/vendor/autoload.php')) {
    require_once APP_ROOT . '/vendor/autoload.php';
}

// Autoload das classes do sistema
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
            return;
        }
    }
});

// Função para debug (apenas em desenvolvimento)
function debug($data, $die = false) {
    if (defined('DEBUG') && DEBUG) {
        echo '<pre>';
        print_r($data);
        echo '</pre>';
        if ($die) die();
    }
}

// Definir se está em modo debug
define('DEBUG', false);
?>