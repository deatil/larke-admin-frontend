<?php

namespace Larke\Admin\Frontend;

use Illuminate\Support\Arr;

use Larke\Admin\Frontend\Model\Menu as MenuModel;

class Frontend
{
    /**
     * Create menu.
     *
     * @return $data array
     * @return $parentId int|string
     * @return $children array
     *
     * @return array
     */
    public function createMenu(
        $data = [], 
        $parentId = 0, 
        array $children = []
    ) {
        if (empty($data)) {
            return false;
        }
        
        $menuModel = new MenuModel();
        $list = $menuModel->read();
        
        $lastOrder = collect($list)->max('sort');
        
        $menu = $menuModel->insert([
            'pid' => $parentId,
            'sort' => $lastOrder + 1,
            'title' => Arr::get($data, 'title'),
            'url' => Arr::get($data, 'url'),
            'method' => Arr::get($data, 'method'),
            'slug' => Arr::get($data, 'slug'),
        ]);
        if (!empty($children)) {
            foreach ($children as $child) {
                $subChildren = Arr::get($child, 'children', []);
                $this->createMenu($child, $menu->id, $subChildren);
            }
        }

        return $menu;
    }
    
}
