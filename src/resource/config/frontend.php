<?php

return [
    'route' => [
        'namespace' => env('LARKE_ADMIN_FRONTEND_ROUTE_NAMESPACE', 'Larke\\Admin\\Frontend\\Controller'),
    ],
    
    'menu' => [
        'file' => env('LARKE_ADMIN_FRONTEND_MENU_FILE', database_path('data/menus.json')),
    ],
];
