<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>网站设置</span>
      </div>
 
      <dynamic-form 
        :items="form.items" 
        :value="form.value" 
        @input="input"
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
import { formatOpions, formatFormItem } from '@/utils'

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
      inputs: {},
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
          element = formatFormItem(element)

          this.form.items.push({
            "type": element.type,
            "label": element.title,
            "value": element.value,
            "placeholder": element.description,
            "options": element.options,
            "rules": {},
            "key": element.name,
          })
        });

      })
    },
    input(data) {
      if (data) {
        this.inputs = Object.assign({}, this.inputs, data)
      }
    }, 
    submit() {
      setting({
        fields: this.inputs
      }).then(() => {
        this.$message({
          message: '提交更新成功',
          type: 'success',
          duration: 3 * 1000
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
