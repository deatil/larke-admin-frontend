<?php

namespace Larke\Admin\Frontend\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Larke\Admin\Http\Controller as BaseController;

use Larke\Admin\Frontend\Model\Menu as MenuModel;

/**
 * 菜单管理
 *
 * @create 2020-11-3
 * @author deatil
 */
class Menu extends BaseController
{
    /**
     * 列表
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request, MenuModel $model)
    {
        $list = $model->getTree();
        
        return $this->successJson(__('获取成功'), [
            'list' => $list,
        ]);
    }
    
    /**
     * 创建
     *
     * @param  Request  $request
     * @return Response
     */
    public function create(Request $request, MenuModel $model)
    {
        $data = $request->all();
        if (empty($data)) {
            return $this->errorJson(__('创建的菜单数据不能为空'));
        }
        
        $insertStatus = $model->insert($data);
        if ($insertStatus === false) {
            return $this->errorJson(__('添加菜单失败'));
        }
        
        return $this->successJson(__('添加菜单成功'));
    }
    
    /**
     * 更新
     *
     * @param  Request  $request
     * @return Response
     */
    public function update(Request $request, MenuModel $model)
    {
        $id = $request->get('id');
        if (empty($id)) {
            return $this->errorJson(__('菜单ID不能为空'));
        }
        
        $info = $model->find($id);
        if (empty($info)) {
            return $this->errorJson(__('菜单不存在'));
        }
        
        $data = $request->all();
        
        $validator = Validator::make($data, [
            'pid' => 'required',
            'sort' => 'required',
        ], [
            'pid.required' => __('父级菜单不能为空'),
            'sort.required' => __('排序不能为空'),
        ]);

        if ($validator->fails()) {
            return $this->errorJson($validator->errors()->first());
        }
        
        // 更新信息
        $status = $model->update($id, $data);
        if ($status === false) {
            return $this->errorJson(__('菜单修改失败'));
        }
        
        return $this->successJson(__('菜单修改成功'));
    }
    
    /**
     * 删除
     *
     * @param  Request  $request
     * @return Response
     */
    public function delete(Request $request, MenuModel $model)
    {
        $id = $request->get('id');
        if (empty($id)) {
            return $this->errorJson(__('菜单ID不能为空'));
        }
        
        $info = $model->find($id);
        if (empty($info)) {
            return $this->errorJson(__('菜单不存在'));
        }
        
        $status = $model->delete($id);
        if ($status === false) {
            return $this->errorJson(__('菜单删除失败'));
        }
        
        return $this->successJson(__('菜单删除成功'));
    }
    
    /**
     * 获取全部
     *
     * @param  Request  $request
     * @return Response
     */
    public function getJson(Request $request, MenuModel $model)
    {
        $json = $model->getFileData();
        
        return $this->successJson(__('获取成功'), [
            'json' => $json,
        ]);
    }
    
    /**
     * 保存全部
     *
     * @param  Request  $request
     * @return Response
     */
    public function saveJson(Request $request, MenuModel $model)
    {
        $json = $request->get('json');
        if (empty($json)) {
            return $this->errorJson(__('json不能为空'));
        }
        
        if (empty(json_decode($json, true))) {
            return $this->errorJson(__('json格式错误'));
        }
        
        $status = $model->saveFileData($json);
        if ($status === false) {
            return $this->errorJson(__('保存数据失败'));
        }
        
        return $this->successJson(__('保存数据成功'));
    }
}
