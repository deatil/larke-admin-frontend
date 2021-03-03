<template>
  <el-form ref="form" label-width="100px">
    <el-alert
        type="warning"
        :title="$t('特别注意')"
        :description="$t('扩展脚本是为了非composer扩展可以下载依赖使用的脚本，如果使用composer下载的扩展可不用使用该脚本。使用 \'注册仓库\' 后只需要执行命令 \'composer require vendor/package\' 即可')"
        style="margin-bottom:15px;"
        show-icon
        :closable="false"
    />  

    <el-form-item :label="$t('扩展')">
      <el-input v-model.trim="data.title" readonly />
    </el-form-item>

    <el-form-item :label="$t('包名')">
      <el-input v-model.trim="data.name" readonly />
    </el-form-item>

    <el-form-item :label="$t('注册仓库')">
        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.repository-register']) || data.has_repository" class="filter-item" size="mini" type="primary" @click="handleRepository('register')">
          {{ $t('仓库注册扩展') }}
        </el-button> 
        <div class="text-grey">
          {{ $t('本地扩展注册到composer.json仓库，在安装脚本不成功时使用') }}
        </div>
    </el-form-item>

    <el-form-item :label="$t('安装脚本')" prop="description">
      <el-input v-model="data.require" type="textarea" rows="3" :placeholder="$t('扩展的composer安装脚本')" />
    </el-form-item>

    <el-form-item label="移除仓库">
        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.repository-remove']) || !data.has_repository" class="filter-item" size="mini" type="danger" @click="handleRepository('remove')">
          {{ $t('仓库移除扩展') }}
        </el-button> 
        <div class="text-grey">         
          {{ $t('本地扩展从composer.json仓库移除，在卸载脚本不成功时使用') }}
        </div>
    </el-form-item>

    <el-form-item :label="$t('卸载脚本')" prop="description">
      <el-input v-model="data.remove" type="textarea" rows="3" :placeholder="$t('扩展的composer卸载脚本')" />
    </el-form-item>

    <el-form-item>
      <el-button type="warning" @click="close">{{ $t('关闭页面') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import LangSelect from '@/components/LangSelect'
import { 
  getCommand, 
  repositoryRegister, 
  repositoryRemove 
} from '@/api/extension'

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
        has_repository: false,
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
        this.data.has_repository = response.data.command.has_repository
      })
    },
    handleRepository(type) {
      const thiz = this
      this.confirmTip(this.$t('该项操作会修改composer.josn文件，确认要进行操作吗？'), function() {
        if (type == 'register') {
          repositoryRegister(thiz.data.name).then(response => {
            thiz.successTip(response.message)
            thiz.data.has_repository = true
          })
        } else {
          repositoryRemove(thiz.data.name).then(response => {
            thiz.successTip(response.message)
            thiz.data.has_repository = false
          })
        }
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
