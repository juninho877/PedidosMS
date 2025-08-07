<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Application;
use App\Core\Config;

// Load configuration
Config::load(__DIR__ . '/../config/app.php');

// Set timezone
date_default_timezone_set(Config::get('timezone', 'UTC'));

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Create and return application instance
return new Application();