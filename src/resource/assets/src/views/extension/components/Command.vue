<template>
  <el-form ref="form" label-width="100px">
    <el-alert
        type="success"
        title="特别注意"
        description="扩展脚本是为了非composer扩展可以下载依赖使用的脚本，如果使用composer下载的扩展可不用使用脚本"
        style="margin-bottom:15px;"
        show-icon
        :closable="false"
    />  

    <el-form-item label="扩展">
      <el-input v-model.trim="data.title" readonly />
    </el-form-item>

    <el-form-item label="包名">
      <el-input v-model.trim="data.name" readonly />
    </el-form-item>

    <el-form-item label="安装脚本" prop="description">
      <el-input v-model="data.require" type="textarea" rows="3" placeholder="扩展的composer安装脚本" />
    </el-form-item>

    <el-form-item label="卸载脚本" prop="description">
      <el-input v-model="data.remove" type="textarea" rows="3" placeholder="扩展的composer卸载脚本" />
    </el-form-item>

    <el-form-item>
      <el-button type="warning" @click="close">关闭页面</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCommand } from '@/api/extension'

export default {
  name: 'ExtensionCommand',
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
        name: '',
        title: '',
        require: '',
        remove: '',
      },
    }
  },
  watch: {
    item: {
      handler(val, oldVal) {
        if (this.item.dialogVisible == true) {
          this.data.name = val.name
          this.data.title = val.title

          this.featchData()
        }
      },
      deep: true
    }
  },
  created() {
    this.data.name = this.item.name
    this.data.title = this.item.title

    this.featchData()
  },
  methods: {
    featchData() {
      getCommand(this.data.name).then(response => {
        this.data.require = response.data.command.require
        this.data.remove = response.data.command.remove
      })
    },
    close() {
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields()
      }
      this.item.dialogVisible = false
    }
  }
}
</script>
