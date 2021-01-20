<?php

use Larke\Admin\Facade\Extension;

Extension::routes(function ($router) {
    $router->namespace(config('frontend.route.namespace'))->group(function ($router) {
        $router->get('/menu', 'Menu@index')->name('larke-admin-frontend.menu.index');
        $router->get('/menu/tree', 'Menu@indexTree')->name('larke-admin-frontend.menu.index-tree');
        $router->get('/menu/children', 'Menu@indexChildren')->name('larke-admin-frontend.menu.index-children');
        $router->post('/menu', 'Menu@create')->name('larke-admin-frontend.menu.create');
        $router->put('/menu/{id}', 'Menu@update')->name('larke-admin-frontend.menu.update');
        $router->delete('/menu/{id}', 'Menu@delete')->name('larke-admin-frontend.menu.delete');
        
        $router->get('/menu/json', 'Menu@getJson')->name('larke-admin-frontend.menu.json');
        $router->put('/menu/save-json', 'Menu@saveJson')->name('larke-admin-frontend.menu.save-json');
        
        $router->get('/frontend/menus', 'Frontend@menus')->name('larke-admin-frontend.frontend.menus');
        $router->get('/frontend/menus-tree', 'Frontend@menusTree')->name('larke-admin-frontend.frontend.menus-tree');
        $router->get('/frontend/roles', 'Frontend@roles')->name('larke-admin-frontend.frontend.roles');
    });
});