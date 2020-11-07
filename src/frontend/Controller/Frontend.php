<?php

namespace Larke\Admin\Frontend\Controller;

use Illuminate\Http\Request;

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
    /**
     * 菜单列表
     *
     * @param  Request  $request
     * @param  MenuModel  $model
     * @return Response
     */
    public function menus(Request $request, MenuModel $model)
    {
        $list = $model->getAuthList();
        
        return $this->successJson(__('获取成功'), [
            'list' => $list,
        ]);
    }
    
    /**
     * 菜单树
     *
     * @param  Request  $request
     * @param  MenuModel  $model
     * @return Response
     */
    public function menusTree(Request $request, MenuModel $model)
    {
        $tree = $model->getAuthTree();
        
        return $this->successJson(__('获取成功'), [
            'list' => $tree,
        ]);
    }
    
    /**
     * 权限列表
     *
     * @param  Request  $request
     * @return Response
     */
    public function roles(Request $request, MenuModel $model)
    {
        $menus = $model->getAuthList();
        $list = collect($menus)
            ->pluck(config('frontend.role.id'))
            ->filter(function($data) {
                $filter = config('frontend.role.filter');
                if (empty($filter)) {
                    return true;
                }
                
                if (preg_match($filter, $data)) {
                    return true;
                }
                
                return false;
            })
            ->unique()
            ->values();
        
        return $this->successJson(__('获取成功'), [
            'list' => $list,
        ]);
    }
}
