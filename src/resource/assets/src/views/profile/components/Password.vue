<template>
  <el-form ref="form" :model="data" :rules="rules">
    <el-form-item label="旧密码" prop="oldpassword">
      <el-input v-model="data.oldpassword" type="password" placeholder="请填写旧密码" />
    </el-form-item>
    <el-form-item label="新密码" prop="newpassword">
      <el-input v-model="data.newpassword" type="password" placeholder="请填写新密码" />
    </el-form-item>
    <el-form-item label="确认新密码" prop="newpassword_confirm">
      <el-input v-model="data.newpassword_confirm" type="password" placeholder="请再次填写新密码" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
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
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        newpassword_confirm: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ]
      },
      data: {
        oldpassword: '',
        newpassword: '',
        newpassword_confirm: ''
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }

        changePassword({
          oldpassword: md5(this.data.oldpassword),
          newpassword: md5(this.data.newpassword),
          newpassword_confirm: md5(this.data.newpassword_confirm)
        }).then(response => {
          this.$message({
            message: '密码更新成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      })
    }
  }
}
</script>
