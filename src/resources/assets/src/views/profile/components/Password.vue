<template>
  <el-form ref="form" :model="data" :rules="rules">
    <el-form-item :label="$t('旧密码')" prop="oldpassword">
      <el-input v-model="data.oldpassword" type="password" :placeholder="$t('请填写旧密码')" />
    </el-form-item>
    <el-form-item :label="$t('新密码')" prop="newpassword">
      <el-input v-model="data.newpassword" type="password" :placeholder="$t('请填写新密码')" />
    </el-form-item>
    <el-form-item :label="$t('确认新密码')" prop="newpassword_confirm">
      <el-input v-model="data.newpassword_confirm" type="password" :placeholder="$t('请再次填写新密码')" />
    </el-form-item>
    <el-form-item>
      <el-button 
        :loading="loading" 
        type="primary" 
        @click="submit">
        {{ $t('提交') }}
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
          { required: true, message: this.$t('旧密码不能为空'), trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: this.$t('新密码不能为空'), trigger: 'blur' }
        ],
        newpassword_confirm: [
          { required: true, message: this.$t('确认密码不能为空'), trigger: 'blur' }
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
            message: this.$t('密码更新成功'),
            type: 'success',
            duration: 3 * 1000
          })
        })
      })
    }
  }
}
</script>
