<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Application;
use App\Core\Config;

// Load configuration
Config::load(__DIR__ . '/../config/app.php');

// Set timezone
date_default_timezone_set(Config::get('timezone', 'America/Sao_Paulo'));

// Set error reporting based on debug mode
if (Config::get('debug', false)) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Create and return application instance
return new Application();