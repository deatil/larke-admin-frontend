<template>
  <el-form ref="form" :model="data" :rules="rules">
    <el-form-item :label="$t('profile.old_password')" prop="oldpassword">
      <el-input v-model="data.oldpassword" type="password" :placeholder="$t('profile.old_password_enter')" />
    </el-form-item>
    <el-form-item :label="$t('profile.new_password')" prop="newpassword">
      <el-input v-model="data.newpassword" type="password" :placeholder="$t('profile.new_password_enter')" />
    </el-form-item>
    <el-form-item :label="$t('profile.new_password_confirm')" prop="newpassword_confirm">
      <el-input v-model="data.newpassword_confirm" type="password" :placeholder="$t('profile.new_password_confirm_enter')" />
    </el-form-item>
    <el-form-item>
      <el-button 
        :loading="loading" 
        type="primary" 
        @click="submit">
        {{ $t('profile.save') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import md5 from 'js-md5'
import { changePassword } from '@/api/user'

export default {
  data() {
    return {
      rules: {
        oldpassword: [
          { required: true, message: this.$t('profile.oldpassword_dont_empty'), trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: this.$t('profile.newpassword_dont_empty'), trigger: 'blur' }
        ],
        newpassword_confirm: [
          { required: true, message: this.$t('profile.confirm_newpassword_dont_empty'), trigger: 'blur' }
        ]
      },
      data: {
        oldpassword: '',
        newpassword: '',
        newpassword_confirm: ''
      },
      loading: false,
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (! valid) {
          return false
        }

        this.loading = true

        changePassword({
          oldpassword: md5(this.data.oldpassword),
          newpassword: md5(this.data.newpassword),
          newpassword_confirm: md5(this.data.newpassword_confirm)
        }).then(response => {
          this.loading = false

          this.$message({
            message: this.$t('profile.updata_password_success'),
            type: 'success',
            duration: 3 * 1000
          })
        })
      })
    }
  }
}
</script>
