<?php

namespace Larke\Admin\Frontend\Controller;

use Illuminate\Http\Request;

use Larke\Admin\Http\Controller as BaseController;
use Larke\Admin\Frontend\Model\Menu as MenuModel;

/**
 * 前端菜单
 *
 * @title 前端菜单
 * @desc 前端菜单配置
 * @order 600
 * @auth true
 * @slug larke-admin-frontend.frontend
 *
 * @create 2020-11-5
 * @author deatil
 */
class Frontend extends BaseController
{
    /**
     * 菜单列表
     *
     * @title 菜单列表
     * @desc 菜单列表配置
     * @order 601
     * @auth true
     *
     * @param  Request  $request
     * @param  MenuModel  $model
     * @return Response
     */
    public function menus(Request $request, MenuModel $model)
    {
        $list = $model->getAuthList();
        
        return $this->success(__('获取成功'), [
            'list' => $list,
        ]);
    }
    
    /**
     * 菜单树
     *
     * @title 菜单树
     * @desc 菜单树配置
     * @order 602
     * @auth true
     *
     * @param  Request  $request
     * @param  MenuModel  $model
     * @return Response
     */
    public function menusTree(Request $request, MenuModel $model)
    {
        $tree = $model->getAuthTree();
        
        return $this->success(__('获取成功'), [
            'list' => $tree,
        ]);
    }
    
    /**
     * 权限列表
     *
     * @title 权限列表
     * @desc 权限列表配置
     * @order 603
     * @auth true
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
        
        return $this->success(__('获取成功'), [
            'list' => $list,
        ]);
    }
}
