<?php

namespace Larke\Admin\Frontend\Command;

use Illuminate\Console\Command;

use Larke\Admin\Model\AuthRule as AuthRuleModel;
use Larke\Admin\Frontend\Model\Menu as MenuModel;

/**
 * 导入菜单数据
 *
 * php artisan larke-admin-frontend:import-menus
 */
class ImportMenus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'larke-admin-frontend:import-menus';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'larke admin frontend import menus.';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $rules = AuthRuleModel::where('status', 1)
            ->select([
                'id', 
                'parentid as pid', 
                'title', 
                'url', 
                'method', 
                'slug', 
                'listorder as sort',
            ])
            ->get()
            ->toArray();
        
        $menuModel = new MenuModel();
        $menus = $menuModel->read();
        
        $menusByKey = collect($menus)->keyBy('id');
        $rulesByKey = collect($rules)->keyBy('id');
        $newMenus = collect($menusByKey)
            ->merge($rulesByKey)
            ->sortBy('slug')
            ->values()
            ->all();
        
        $status = $menuModel->save($newMenus);
        if ($status === false) {
            $this->line('<error>Import menus error.</error>');
            return;
        }
        
        $this->info('Import menus successfully.');
    }
}
