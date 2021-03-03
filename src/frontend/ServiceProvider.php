<?php

namespace Larke\Admin\Frontend;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function register()
    {
        $this->mergeConfigFrom(__DIR__ . '/../resources/config/frontend.php', 'frontend');
        
        $this->loadJsonTranslationsFrom(__DIR__ . '/../resources/lang');
        
        $this->loadRoutesFrom(__DIR__ . '/../resources/routes/admin.php');
        
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../resources/config' => config_path(),
            ], 'larke-admin-frontend-config');
            
            $this->publishes([
                __DIR__.'/../resources/assets' => public_path('admin'),
            ], 'larke-admin-frontend-assets');
            
            $this->commands([
                Command\ImportMenus::class,
            ]);
        }
    }
    
    /**
     * {@inheritdoc}
     */
    public function boot()
    {
    }
    
}
