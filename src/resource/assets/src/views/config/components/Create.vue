<template>
  <el-form :model="data" :rules="rules" ref="form" label-width="100px">
    <el-form-item label="分组" prop="group">
      <el-select v-model="data.group" placeholder="选择分组" clearable>
        <el-option v-for="item in groupOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>      
    </el-form-item>  
        
    <el-form-item label="类型" prop="type">
      <el-select v-model="data.type" placeholder="选择类型" clearable>
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item label="标题" prop="title">
      <el-input v-model.trim="data.title" placeholder="请填写标题" />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model.trim="data.name" placeholder="请填写名称，填写大小写字母、数字、下划线及其组合" />
    </el-form-item>    

    <el-form-item label="配置项" prop="options">
      <el-input type="textarea" v-model.trim="data.options" rows="6" placeholder="请填写配置项"></el-input>
    </el-form-item>   
    <el-form-item label="配置值" prop="value">
      <el-input type="textarea" v-model.trim="data.value" rows="6" placeholder="请填写配置值"></el-input>
    </el-form-item>  
    <el-form-item label="描述" prop="description">
      <el-input type="textarea" v-model.trim="data.description" rows="6" placeholder="请填写描述"></el-input>
    </el-form-item> 

    <el-form-item label="排序" prop="listorder">
      <el-input v-model.trim="data.listorder" placeholder="请填写排序" />
    </el-form-item>  

    <el-form-item label="显示" prop="is_show"> 
      <el-radio-group v-model="data.is_show">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>     

    <el-form-item label="状态" prop="status"> 
      <el-radio-group v-model="data.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item> 

    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { create } from '@/api/config'

export default {
  name: 'AdminCreate',
  components: {  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },   
  data() {   
    return {
      rules:{
          type:[
            {required:true, message:'类型不能为空', trigger:'blur'}
          ],
          title:[
            {required:true, message:'标题不能为空', trigger:'blur'}
          ],          
          name:[
            {required:true, message:'名称不能为空', trigger:'blur'}
          ],
          listorder:[
            {required:true, message:'排序不能为空', trigger:'blur'}
          ],                                        
      },      
      data: {
        group: '',
        type: '',
        title: '',
        name: '',
        options: '',
        value: '',
        description: '',
        listorder: '100',
        is_show: 1,
        status: 1,
      },
      groupOptions: [
        { key: 'other', display_name: '其他' },        
      ],
      typeOptions: [
        { key: 'text', display_name: '文本' },
        { key: 'textarea', display_name: '文本框' },
        { key: 'number', display_name: '数字' },
        { key: 'radio', display_name: '单选' },
        { key: 'checkbox', display_name: '复选' },
        { key: 'select', display_name: '下拉' }, 
        { key: 'switch', display_name: '滑块' },               
        { key: 'array', display_name: '数组' },
        { key: 'image', display_name: '图片' },
        { key: 'images', display_name: '多图' },
      ],      
    }
  },
  created() {
  },
  methods: {  
    submit() {
      const thiz = this
      create(this.data).then(response => {
        this.$message({
          message: '添加配置成功',
          type: 'success',
          duration: 5 * 1000,
          onClose() {
            if (thiz.$refs.form !== undefined) {
              thiz.$refs.form.resetFields()
            }            
            thiz.item.dialogVisible = false
          }
        })
      })
    }
  }
}
</script>
