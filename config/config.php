<?php
// Configuração principal do sistema
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Definir constantes do sistema
define('APP_ROOT', dirname(__DIR__));
define('SITE_NAME', 'CineRequest');
define('TMDB_API_KEY', 'your_tmdb_api_key_here');
define('TMDB_BASE_URL', 'https://api.themoviedb.org/3');
define('TMDB_IMAGE_BASE_URL', 'https://image.tmdb.org/t/p');
define('JWT_SECRET', 'your_jwt_secret_key_change_in_production');

// Função de autoloader personalizada
function customAutoloader($className) {
    $directories = [
        APP_ROOT . '/config/',
        APP_ROOT . '/models/',
        APP_ROOT . '/services/',
        APP_ROOT . '/middleware/',
        APP_ROOT . '/controllers/'
    ];
    
    foreach ($directories as $directory) {
        $file = $directory . $className . '.php';
        if (file_exists($file)) {
            require_once $file;
            error_log("Autoloader: Loaded class $className from $file");
            return true;
        }
    }
    
    error_log("Autoloader: Could not find class $className");
    return false;
}

// Registrar autoloader
spl_autoload_register('customAutoloader');

// Carregar Composer se existir
if (file_exists(APP_ROOT . '/vendor/autoload.php')) {
    require_once APP_ROOT . '/vendor/autoload.php';
}

error_log("Config: Sistema inicializado com sucesso");
?>