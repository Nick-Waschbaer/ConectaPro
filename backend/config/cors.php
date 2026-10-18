<?php

/*
 * CORS: qué sitios web (orígenes) pueden llamar a esta API desde el navegador.
 *
 * Los orígenes se leen de CORS_ALLOWED_ORIGINS en el .env (separados por comas).
 * Si no se define, se permite solo el servidor local de Vite.
 * Cuando se conozca el dominio real de Vercel, agrégalo en el .env, por ejemplo:
 *   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://TU-PROYECTO.vercel.app
 * (sin "/" final y sin "*").
 */
return [

    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'OPTIONS'],

    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')),
    ))),

    'allowed_origins_patterns' => [],

    // 'ngrok-skip-browser-warning' evita la página de aviso de ngrok gratis en las peticiones del frontend.
    'allowed_headers' => ['Content-Type', 'Accept', 'X-Requested-With', 'ngrok-skip-browser-warning'],

    'exposed_headers' => [],

    'max_age' => 600,

    // La API no usa cookies ni sesiones, así que no se necesitan credenciales.
    'supports_credentials' => false,

];
