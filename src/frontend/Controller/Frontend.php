<?php

namespace Larke\Admin\Frontend\Controller;

use Larke\Admin\Http\Controller as BaseController;

use Larke\Admin\Frontend\Model\Menu as MenuModel;

/**
 * 前端菜单
 *
 * @create 2020-11-4
 * @author deatil
 */
class Frontend extends BaseController
{
    public function menu()
    {
        $list = (new MenuModel())->getTree();
        
        return $this->successJson(__('获取成功'), [
            'list' => $list,
        ]);
    }
}
