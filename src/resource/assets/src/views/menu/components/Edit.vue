<template>
  <el-form :model="data" :rules="rules" label-width="100px" ref="menuEditForm">
    <el-form-item label="父级权限" prop="pid">
      <el-select 
        v-model="data.pid" 
        placeholder="请选择" 
        clearable            
        filterable 
        :filter-method="parentFilter"
        @change="pidChange">
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
      <el-tooltip effect="dark" content="链接默认不用加前缀" placement="top">
        <el-input v-model.trim="data.url" placeholder="请填写菜单链接" >
          <template slot="prepend">
            <i class="el-icon-link" />
          </template>
        </el-input>
      </el-tooltip>      
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
  updateMenu 
} from '@/api/menu'

export default {
  name: 'MenuEdit',
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
      all: [],
      chilren: [],
      id: '',
      pid: '',
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
        { key: '0', display_name: '顶级用户组' },
      ],
      parentFilterOptions: [],    
    }
  },
  watch: {
    item: {
      handler(val, oldVal) {
        if (this.item.dialogVisible == true 
          && this.id != val.id
        ) {
          this.id = val.id
          this.fetchParents().then(() => {
            this.fetchData()
          })
        }
      },
      deep: true
    }
  },
  created() {
    const id = this.item.id
    this.id = id
    this.initData().then(() => {
      this.fetchData()
    })  
  },
  methods: {  
    initData() {
      return new Promise((resolve, reject) => {
        const all = this.getAll()
        const children = this.getChildren()   
        
        Promise.all([all, children])
          .then(([all, children]) => {
            this.all = all.list
            this.children = children.list

            this.fetchParents().then(() => {})

            resolve()
          })
          .catch(() => {

          })
      })
    },
    getAll() {
      return new Promise((resolve, reject) => {
        getMenuChildren({
          id: 0,
          type: 'list',
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })  
    },
    getChildren() {
      return new Promise((resolve, reject) => {
        getMenuChildren({
          id: this.id,
          type: 'ids'
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })  
    },
    fetchParents() {
      return new Promise((resolve, reject) => {
        this.getChildren().then((res) => {
          this.children = res.list
  
          const all = this.all
          const children = this.children

          this.parentOptions = [
            { key: '0', display_name: '顶级菜单' },
          ]
          this.parentFilterOptions = []

          children.push(this.id)    
          all.forEach(item => {
            if (! children.includes(item.id)) {
              this.parentOptions.push({
                key: item.id, 
                display_name: item.spacer + ' ' + item.title + '【' + item.method + '】'
              })     
            }      
          }); 

          this.parentFilterOptions = this.parentOptions 

          resolve()
        }).catch(err => {
          reject(err)
        })   
      })  
    },
    fetchData(id) {
      this.pid = this.item.pid
      this.data = this.item.data
    },
    parentFilter(val) {
      this.data.pid = val
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
    pidChange(val) {
      if (val) {
        this.parentOptions = this.parentFilterOptions
        this.data.pid = val
      }
    },    
    submit() {
      const thiz = this
  
      this.$refs.menuEditForm.validate(valid => {
        if (! valid) {
          return false
        }

        updateMenu(this.id, {  
          pid: this.data.pid,
          title: this.data.title,
          slug: this.data.slug,
          url: this.data.url,
          method: this.data.method,
          sort: this.data.sort,
        }).then(response => {
          this.$message({
            message: '更新菜单信息成功',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              if (thiz.$refs.menuEditForm !== undefined) {
                thiz.$refs.menuEditForm.resetFields()
              }            
              thiz.item.dialogVisible = false
            }
          })
        })

      })

    }
  }
}
</script>
