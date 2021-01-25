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

    <el-form-item label="安装仓库">
        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.repository'])" class="filter-item" size="mini" type="primary" @click="handleRepository('register')">
          安装
        </el-button> 
    </el-form-item>

    <el-form-item label="安装脚本" prop="description">
      <el-input v-model="data.require" type="textarea" rows="3" placeholder="扩展的composer安装脚本" />
    </el-form-item>

    <el-form-item label="卸载仓库">
        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.repository'])" class="filter-item" size="mini" type="danger" @click="handleRepository('remove')">
          卸载
        </el-button> 
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
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { getCommand, repository } from '@/api/extension'

export default {
  name: 'ExtensionCommand',
  components: { },
  directives: { waves, permission },
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
    checkPermission,
    featchData() {
      getCommand(this.data.name).then(response => {
        this.data.require = response.data.command.require
        this.data.remove = response.data.command.remove
      })
    },
    handleRepository(type) {
      const thiz = this
      this.confirmTip('该项操作会修改composer.josn文件，确认要进行操作吗？', function() {
        repository(thiz.data.name, type).then(response => {
          thiz.successTip('操作成功')
        })
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
