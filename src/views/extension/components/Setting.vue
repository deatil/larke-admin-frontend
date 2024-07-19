<template>
  <dynamic-form
    :items="form.items"
    :value="form.value"
    :column-min-width="form.columnMinWidth"
    @input="input"
  >
    <template slot>
      <el-form-item>
        <el-button 
          type="primary" 
          v-waves
          :loading="loading.submit"
          @click="submit">{{ $t('extension.settings_save') }}</el-button>
      </el-form-item>
    </template>
  </dynamic-form>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import DynamicForm from '@/components/DynamicForm/form'
import { formatExtensionFormItem } from '@/utils'
import {
  updateConfig
} from '@/api/extension'

export default {
  name: 'ExtensionSetting',
  components: { DynamicForm },
  directives: { waves },
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
      inputs: {},
      loading: {
        submit: false,
      },
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

      this.loading.submit = true
      updateConfig(this.item.name, {
        config: data
      }).then(() => {
        thiz.loading.submit = false

        thiz.$emit("pushConfig", data)

        this.$message({
          message: this.$t('extension.settings_save_success'),
          type: 'success',
          duration: 3 * 1000,
          onClose() {
            thiz.form.items = []
            thiz.item.dialogVisible = false
          }
        })
      }).catch(() => {
        thiz.loading.submit = false
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
