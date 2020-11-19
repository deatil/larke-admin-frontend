<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>添加权限</span>
      </div>

      <el-form label-width="100px">
        <el-form-item label="父级权限">
          <el-select 
            v-model="data.parentid" 
            placeholder="请选择" 
            clearable            
            filterable 
            :filter-method="parentFilter"
            @change="parentidChange">
            <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
          </el-select>            
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model.trim="data.title" placeholder="请填写权限名称" />
        </el-form-item>   
        <el-form-item label="请求链接">
          <el-input v-model.trim="data.url" placeholder="请填写请求链接" />
        </el-form-item>                 
        <el-form-item label="请求方式">
          <el-select v-model="data.method">
            <el-option v-for="item in methodOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>          
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model.trim="data.slug" placeholder="请填写标识" />
        </el-form-item>        
        <el-form-item label="权限描述">
          <el-input type="textarea" v-model.trim="data.description" rows="6" placeholder="请填写权限描述"></el-input>
        </el-form-item>      
        <el-form-item label="排序">
          <el-input v-model.trim="data.listorder" placeholder="请填写排序" />
        </el-form-item>      
        <el-form-item label="鉴定权限"> 
          <el-radio-group v-model="data.is_need_auth">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group> 
        </el-form-item>                      
        <el-form-item label="状态"> 
          <el-radio-group v-model="data.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { 
  getRuleChildrenList,
  createRule 
} from '@/api/authRule'

export default {
  name: 'AuthRuleCreate',
  components: { },
  data() {   
    return {
      data: {
        parentid: '',
        title: '',
        url: '',
        method: 'GET',
        slug: '',
        description: '',
        listorder: 100,
        is_need_auth: 1,
        status: 1,
      },
      parentOptions: [
        { key: '0', display_name: '顶级权限' },
      ],
      parentFilterOptions: [],
      methodOptions: [
        { key: 'GET', display_name: 'GET' },
        { key: 'HEAD', display_name: 'HEAD' },
        { key: 'POST', display_name: 'POST' },
        { key: 'PUT', display_name: 'PUT' },
        { key: 'DELETE', display_name: 'DELETE' },
        { key: 'PATCH', display_name: 'PATCH' },
        { key: 'OPTIONS', display_name: 'OPTIONS' },
        { key: 'ERROR', display_name: 'ERROR' },
      ],      
    }
  },
  created() {
    this.initData()
  },
  methods: {  
    initData() {
      const all = new Promise((resolve, reject) => {
        getRuleChildrenList({
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
              display_name: item.spacer + ' ' + item.title
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
      createRule(this.data).then(response => {
        this.$message({
          message: '添加权限成功',
          type: 'success',
          duration: 2 * 1000,
          onClose() {
            thiz.$router.replace('/auth/rule/index')
          }
        })
      })
    }
  }
}
</script>
