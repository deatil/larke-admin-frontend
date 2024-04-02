<template>
  <el-form ref="form" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('admin.form_passport')" prop="name">
      <el-input v-model.trim="data.name" :placeholder="$t('admin.form_enter_passport')" />
    </el-form-item>

    <el-form-item :label="$t('admin.form_nickname')" prop="nickname">
      <el-input v-model.trim="data.nickname" :placeholder="$t('admin.form_enter_nickname')" />
    </el-form-item>

    <el-form-item :label="$t('admin.form_email')" prop="email">
      <el-input v-model.trim="data.email" :placeholder="$t('admin.form_enter_email')" />
    </el-form-item>

    <el-form-item :label="$t('admin.form_group')" prop="group_id">
      <el-select v-model="data.group_id" clearable :placeholder="$t('admin.form_need_one_group')">
        <el-option v-for="item in groups" :key="item.id" :label="item.title" v-html="(item.spacer ? item.spacer : '') + item.title" :value="item.id" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('admin.form_introduce')" prop="introduce">
      <el-input v-model.trim="data.introduce" type="textarea" rows="6" :placeholder="$t('admin.form_enter_introduce')" />
    </el-form-item>

    <el-form-item :label="$t('admin.form_avatar')">
      <div style="width: 100%;">
        <avatar :data="data" />
      </div>
    </el-form-item>

    <el-form-item :label="$t('admin.form_status')" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">{{ $t('admin.form_status_enable') }}</el-radio>
        <el-radio :label="0">{{ $t('admin.form_status_disable') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('common.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Avatar from './Avatar'
import { 
  getGroups, 
  createAdmin 
} from '@/api/admin'

export default {
  name: 'AdminCreate',
  components: { Avatar },
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
      loading: false,
      rules: {
        name: [
          { required: true, message: this.$t('admin.rules_name_required'), trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: this.$t('admin.rules_nickname_required'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('admin.rules_email_required'), trigger: 'blur' }
        ],
        group_id: [
          { required: true, message: this.$t('admin.rules_group_id_required'), trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: this.$t('admin.rules_introduce_required'), trigger: 'blur' }
        ]
      },
      data: {
        name: '',
        nickname: '',
        email: '',
        group_id: '',
        avatar: '',
        avatarKey: '',
        introduce: '',
        status: 1
      },
      groups: []
    }
  },
  watch: {
    item: {
      handler(val, oldVal) {
        if (this.item.dialogVisible == true) {
          this.$refs.form.resetFields()

          this.getGroups()
        }
      },
      deep: true
    }
  },
  created() {
    this.getGroups()
  },
  methods: {
    // 管理
    async getGroups() {
        const res = await getGroups()

        this.groups = res.data.list
    },
    submit() {
      const thiz = this

      this.loading = true

      this.$refs.form.validate(valid => {
        if (!valid) {
          this.loading = false

          return false
        }

        createAdmin({
          name: this.data.name,
          nickname: this.data.nickname,
          email: this.data.email,
          group_id: this.data.group_id,
          avatar: this.data.avatarKey,
          introduce: this.data.introduce,
          status: this.data.status
        }).then(response => {
          thiz.loading = false

          this.$message({
            message: this.$t('admin.create_success'),
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              if (thiz.$refs.form !== undefined) {
                thiz.$refs.form.resetFields()
              }
              thiz.item.dialogVisible = false
            }
          })
        }).catch(err => {
          thiz.loading = false
        })
      })
    }
  }
}
</script>
