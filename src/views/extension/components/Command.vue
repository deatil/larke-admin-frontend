<template>
  <el-form v-loading="detailLoading" ref="form" label-width="100px">
    <el-alert
        type="warning"
        :title="$t('extension.command_alert_title')"
        :description="$t('extension.command_alert_content')"
        style="margin-bottom:15px;"
        show-icon
        :closable="false"
    />  

    <el-form-item :label="$t('extension.command_title')">
      <el-input v-model.trim="data.title" readonly />
    </el-form-item>

    <el-form-item :label="$t('extension.command_name')">
      <el-input v-model.trim="data.name" readonly />
    </el-form-item>

    <el-form-item :label="$t('extension.command_repository_register')">
        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.repository-register']) || data.has_repository" class="filter-item" size="mini" type="primary" @click="handleRepository('register')">
          {{ $t('extension.command_repository_register_btn') }}
        </el-button> 
        <div class="text-grey">
          {{ $t('extension.command_repository_register_tip') }}
        </div>
    </el-form-item>

    <el-form-item :label="$t('extension.command_require_title')" prop="description">
      <el-input v-model="data.require" type="textarea" rows="3" :placeholder="$t('extension.command_require_tip')" />
    </el-form-item>

    <el-form-item :label="$t('extension.command_repository_remove')">
        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.repository-remove']) || !data.has_repository" class="filter-item" size="mini" type="danger" @click="handleRepository('remove')">
          {{ $t('extension.command_repository_remove_btn') }}
        </el-button> 
        <div class="text-grey">         
          {{ $t('extension.command_repository_remove_tip') }}
        </div>
    </el-form-item>

    <el-form-item :label="$t('extension.command_unstall_title')" prop="description">
      <el-input v-model="data.remove" type="textarea" rows="3" :placeholder="$t('extension.command_unstall_tip')" />
    </el-form-item>

    <el-form-item>
      <el-button type="warning" @click="close">{{ $t('common.close_page') }}</el-button>
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
      detailLoading: false,
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
      this.detailLoading = true

      getCommand(this.data.name).then(response => {
        this.data.require = response.data.command.require
        this.data.remove = response.data.command.remove
        this.data.has_repository = response.data.command.has_repository

        this.detailLoading = false
      }).catch(err => {
        this.detailLoading = false
      })
    },
    handleRepository(type) {
      const thiz = this
      this.confirmTip(this.$t('extension.command_confirm_tip'), function() {
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
