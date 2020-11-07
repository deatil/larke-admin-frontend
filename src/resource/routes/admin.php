<?php

use Larke\Admin\Facade\Extension;

Extension::routes(function ($router) {
    $router->namespace(config('frontend.route.namespace'))->group(function ($router) {
        $router->get('/menu/index', 'Menu@index')->name('larke-admin-frontend-menu-index');
        $router->post('/menu/create', 'Menu@create')->name('larke-admin-frontend-menu-create');
        $router->put('/menu/update', 'Menu@update')->name('larke-admin-frontend-menu-update');
        $router->delete('/menu/delete', 'Menu@delete')->name('larke-admin-frontend-menu-delete');
        
        $router->get('/menu/json', 'Menu@getJson')->name('larke-admin-frontend-menu-json');
        $router->put('/menu/save-json', 'Menu@saveJson')->name('larke-admin-frontend-menu-save-json');
        
        $router->get('/frontend/menu', 'Frontend@menu')->name('larke-admin-frontend-menu');
        $router->get('/frontend/roles', 'Frontend@roles')->name('larke-admin-frontend-roles');
    });
});