<?php

return [
    'route' => [
        'namespace' => env('LARKE_ADMIN_FRONTEND_ROUTE_NAMESPACE', 'Larke\\Admin\\Frontend\\Controller'),
    ],
    
    'menu' => [
        'file' => env('LARKE_ADMIN_FRONTEND_MENU_FILE', storage_path('data/menus.json')),
    ],
    
    'role' => [
        'id' => env('LARKE_ADMIN_FRONTEND_ROLE_ID', 'slug'),
        'filter' => env('LARKE_ADMIN_FRONTEND_ROLE_FILTER', '/-/'), // 为空不匹配
    ],
];
