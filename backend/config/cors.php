<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'https://donasiku-webpro-production.up.railway.app',
        'https://donasiku.com',
    ],
    'allowed_origins_patterns' => [
        '#^https://.*\.up\.railway\.app$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];