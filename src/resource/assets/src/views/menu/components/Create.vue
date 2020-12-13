<template>
  <el-form :model="data" :rules="rules" label-width="100px" ref="menuCreateform">
    <el-form-item label="父级权限" prop="pid">
      <el-select 
        v-model="data.pid" 
        placeholder="请选择" 
        clearable            
        filterable 
        :filter-method="parentFilter"
        @change="parentidChange">
        <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>            
    </el-form-item>

    <el-form-item label="名称" prop="title">
      <el-input v-model.trim="data.title" placeholder="请填写菜单名称" />
    </el-form-item>   

    <el-form-item label="标识" prop="slug">
      <el-input v-model.trim="data.slug" placeholder="请填写菜单标识" />
    </el-form-item>  

    <el-form-item label="链接" prop="url">
      <el-input v-model.trim="data.url" placeholder="请填写菜单链接" />
    </el-form-item>   

    <el-form-item label="请求方式" prop="method">
      <el-select v-model="data.method">
        <el-option v-for="item in methodOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>          
    </el-form-item>

    <el-form-item label="排序" prop="sort">
      <el-input v-model.trim="data.sort" placeholder="请填写排序" />
    </el-form-item>      
                    
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { 
  getMenuChildren,
  createMenu 
} from '@/api/menu'

export default {
  name: 'MenuCreate',
  components: { },
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
      data: {
        pid: '',
        title: '',
        slug: '',
        url: '',
        method: 'GET',
        sort: 100,
      },    
      rules:{
          pid:[
            {required:true, message:'父级菜单不能为空', trigger:'change'}
          ],
          title:[
            {required:true, message:'名称不能为空', trigger:'blur'}
          ], 
          slug:[
            {required:true, message:'标识不能为空', trigger:'blur'}
          ],   
          url:[
            {required:true, message:'链接不能为空', trigger:'blur'}
          ],                                       
          sort:[
            {required:true, message:'排序不能为空', trigger:'blur'}
          ],                           
      },        
      methodOptions: [
        { key: 'GET', display_name: 'GET' },
        { key: 'HEAD', display_name: 'HEAD' },
        { key: 'POST', display_name: 'POST' },
        { key: 'PUT', display_name: 'PUT' },
        { key: 'DELETE', display_name: 'DELETE' },
        { key: 'PATCH', display_name: 'PATCH' },
        { key: 'OPTIONS', display_name: 'OPTIONS' },
      ],        
      parentOptions: [
        { key: '0', display_name: '顶级菜单' },
      ],
      parentFilterOptions: [],    
    }
  },
  created() {
    this.initData()
  },
  methods: {  
    initData() {
      const all = new Promise((resolve, reject) => {
        getMenuChildren({
          id: 0,
          type: 'list',
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })   
      
      Promise.all([all])
        .then(([all]) => {
          all.list.forEach(item => {
            this.parentOptions.push({
              key: item.id, 
              display_name: item.spacer + ' ' + item.title + '【' + item.method + '】'
            })           
          }); 

          this.parentFilterOptions = this.parentOptions           
        })
        .catch(() => {

        })
    },
    parentFilter(val) {
      this.data.parentid = val
      if (val) {
        this.parentOptions = this.parentFilterOptions.filter(item => {
          if (!!~item.display_name.indexOf(val)
            || !!~item.display_name.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true
          }
        })
      } else {
        this.parentOptions = this.parentFilterOptions
      }
    },
    parentidChange(val) {
      if (! val) {
        this.parentOptions = this.parentFilterOptions
      }
    },
    submit() {
      const thiz = this

      if (this.data.pid.length < 1) {
        this.$message({
          message: 'pid不能为空',
          type: 'error',
          duration: 2 * 1000,
        })
        return ;
      }
      if (this.data.title.length < 1) {
        this.$message({
          message: '名称不能为空',
          type: 'error',
          duration: 2 * 1000,
        })
        return ;
      }      
      if (this.data.slug.length < 1) {
        this.$message({
          message: '标识不能为空',
          type: 'error',
          duration: 2 * 1000,
        })
        return ;
      }  
      if (this.data.url.length < 1) {
        this.$message({
          message: '链接不能为空',
          type: 'error',
          duration: 2 * 1000,
        })
        return ;
      }  
      if (this.data.method.length < 1) {
        this.$message({
          message: '请求方式不能为空',
          type: 'error',
          duration: 2 * 1000,
        })
        return ;
      }  

      createMenu(this.data).then(response => {
        this.$message({
          message: '添加菜单成功',
          type: 'success',
          duration: 2 * 1000,
          onClose() {
            if (thiz.$refs.menuCreateform !== undefined) {
              thiz.$refs.menuCreateform.resetFields()
            }
            thiz.item.dialogVisible = false
          }
        })
      })
    }
  }
}
</script>
