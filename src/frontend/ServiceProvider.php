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
        $this->mergeConfigFrom(__DIR__ . '/../resource/config/frontend.php', 'frontend');
        
        $this->loadRoutesFrom(__DIR__ . '/../resource/routes/admin.php');
        
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../resource/config' => config_path(),
            ], 'larke-admin-frontend-config');
            
            $this->publishes([
                __DIR__.'/../resource/assets' => public_path('admin'),
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
