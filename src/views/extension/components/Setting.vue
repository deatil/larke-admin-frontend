<template>
  <dynamic-form
    :items="form.items"
    :value="form.value"
    :column-min-width="form.columnMinWidth"
    @input="input"
  >
    <template slot>
      <el-form-item>
        <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
      </el-form-item>
    </template>
  </dynamic-form>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/form'
import { formatExtensionFormItem } from '@/utils'
import {
  updateConfig
} from '@/api/extension'

export default {
  name: 'ExtensionSetting',
  components: { DynamicForm },
  directives: { },
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
      form: {
        items: [],
        value: {},
        columnMinWidth: '100px'
      },
      inputs: {}
    }
  },
  created() {
    this.getSettings()
  },
  methods: {
    getSettings() {
      const data = JSON.parse(JSON.stringify(this.item.data))

      data.forEach(element => {
        if (element.name in this.item.config) {
          element.value = this.item.config[element.name]
        }

        element = formatExtensionFormItem(element)

        const value = element.value || ''

        this.form.items.push({
          'type': element.type,
          'label': element.title,
          'value': value,
          'placeholder': element.description || '',
          'options': element.options || [],
          'rules': {},
          'key': element.name,
          'show': 1
        })

        if (JSON.stringify(this.item.config) == '{}' ||
          JSON.stringify(this.item.config) == '[]' ||
          JSON.stringify(this.item.config) == 'null'
        ) {
          this.inputs = {}
        }
      })
    },
    input(data) {
      if (data) {
        this.inputs = Object.assign({}, this.inputs, data)
      }
    },
    submit() {
      const thiz = this
      const data = JSON.stringify(this.inputs)
      updateConfig(this.item.name, {
        config: data
      }).then(() => {
        this.$message({
          message: this.$t('扩展配置更新成功'),
          type: 'success',
          duration: 3 * 1000,
          onClose() {
            thiz.form.items = []
            thiz.item.dialogVisible = false
          }
        })
      })
    }
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
