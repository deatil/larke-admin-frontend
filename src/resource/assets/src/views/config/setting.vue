<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>网站设置</span>
      </div>
 
      <dynamic-form 
        :items="form.items" 
        :value="form.value" 
        :columnMinWidth="form.columnMinWidth">
        <template slot>

          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
          </el-form-item>  
        </template>
      </dynamic-form>
        
    </el-card>
        
  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/form'

import { 
  getSettings, 
  setting,
} from '@/api/config'

export default {
  name: 'ConfigIndex',
  components: { DynamicForm },
  directives: {  },
  filters: {

  },
  data() {
    return {
      list: null,
      form: {
        items: [],
        value: {},
        columnMinWidth: '100px',
      },
      statusOptions: [
        { key: 'open', display_name: '启用' },
        { key: 'close', display_name: '禁用' },
      ],  
    }
  },
  created() {
    this.getSettings()
  },
  methods: {
    getSettings() {
      this.listLoading = true
      getSettings().then(response => {
        this.list = response.data.list

        this.list.forEach(element => {
          if (element.type == 'number') {
            element.value = parseInt(element.value)
          }

          this.form.items.push({
            "type": element.type,
            "label": element.title,
            "disable": false,
            "readonly": false,
            "value": element.value,
            "placeholder": element.description,
            "rules": {},
            "key": element.name,
          })         
        });

      })
    },
    handleInput(val, key) {
      this.$emit('input', { ...this.value, [key]: val })
    }, 
    submit() {
      setting(row.id).then(() => {
        this.$message({
          message: '删除配置成功',
          type: 'success',
          duration: 5 * 1000,
          onClose() {
            thiz.list.splice(index, 1)
          }
        })
      })
    },
  }
}
</script>

<style scoped>
.pagination-container {
  padding: 5px 2px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
