<?php

return [
    'debug' => true,
    'timezone' => 'America/Sao_Paulo',
    'jwt_secret' => 'your_jwt_secret_key_change_in_production_' . md5(__DIR__),
    
    'database' => [
        'host' => 'localhost',
        'database' => 'pedidos',
        'username' => 'pedidos',
        'password' => '$n9v2uO18',
        'charset' => 'utf8mb4'
    ],
    
    'tmdb' => [
        'api_key' => 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWEyNDRlNTA2YzI4YjcxNDQwMTVjY2I3ZWZjMGE3NiIsInN1YiI6IjY3MmE4YzI4NzUwNGE5NzE5YzE4ZjY5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Hs_bVOBBUaKJWJhJJJJJJJJJJJJJJJJJJJJJJJJJJJJ',
        'base_url' => 'https://api.themoviedb.org/3',
        'image_base_url' => 'https://image.tmdb.org/t/p'
    ]
];