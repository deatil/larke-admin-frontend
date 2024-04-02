<template>
  <el-form v-loading="detailLoading" ref="form" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('admin.form_passport')" prop="name">
      <el-input v-model.trim="data.name" :placeholder="$t('admin.form_enter_passport')" />
    </el-form-item>
    <el-form-item :label="$t('admin.form_nickname')" prop="nickname">
      <el-input v-model.trim="data.nickname" :placeholder="$t('admin.form_enter_nickname')" />
    </el-form-item>
    <el-form-item :label="$t('admin.form_email')" prop="email">
      <el-input v-model.trim="data.email" :placeholder="$t('admin.form_enter_email')" />
    </el-form-item>
    <el-form-item :label="$t('admin.form_introduce')" prop="name">
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
      <el-button type="primary" :loading="submitLoading" @click="submit">{{ $t('common.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Avatar from './Avatar'
import { getDetail, updateAdmin } from '@/api/admin'

export default {
  name: 'AdminEdit',
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
      detailLoading: false,
      submitLoading: false,
      id: '',
      rules: {
        name: [
          { required: true, message: this.$t('admin.rules_name_required'), trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: this.$t('admin.rules_nickname_required'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('admin.rules_email_required'), trigger: 'blur' }
        ]
      },
      data: {
        name: '',
        nickname: '',
        email: '',
        avatar: require('@/assets/larke/avatar-default.jpg'),
        avatarKey: '',
        introduce: '',
        status: 1
      }
    }
  },
  watch: {
    item: {
      handler(val, oldVal) {
        if (this.item.dialogVisible == true &&
          this.id != val.id
        ) {
          this.id = val.id
          this.fetchData(val.id)
        }
      },
      deep: true
    }
  },
  created() {
    const id = this.item.id
    this.id = id
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      const defaultAvatar = require('@/assets/larke/avatar-default.jpg')

      this.detailLoading = true

      getDetail(id).then(response => {
        this.data = response.data
        this.data.avatar = this.data.avatar || defaultAvatar

        this.detailLoading = false
      }).catch(err => {
        this.detailLoading = false
      })
    },
    submit() {
      const thiz = this

      this.submitLoading = true

      this.$refs.form.validate(valid => {
        if (!valid) {
          this.submitLoading = false

          return false
        }

        updateAdmin(this.id, {
          name: this.data.name,
          nickname: this.data.nickname,
          email: this.data.email,
          avatar: this.data.avatarKey,
          introduce: this.data.introduce,
          status: this.data.status
        }).then(response => {
          thiz.submitLoading = false

          this.$message({
            message: this.$t('admin.update_success'),
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              if (thiz.$refs.form !== undefined) {
                thiz.id = ''
                thiz.$refs.form.resetFields()
              }
              thiz.item.dialogVisible = false
            }
          })
        }).catch(err => {
          thiz.submitLoading = false
        })
      })
    }
  }
}
</script>
