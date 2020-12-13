<template>
  <el-form>
    <el-form-item label="旧密码">
      <el-input type="password" v-model="oldpassword" placeholder="请填写旧密码" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input type="password" v-model="newpassword" placeholder="请填写新密码" />
    </el-form-item>   
    <el-form-item label="确认新密码">
      <el-input type="password" v-model="newpassword_confirm" placeholder="请再次填写新密码" />
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
      oldpassword: '',
      newpassword: '',
      newpassword_confirm: '',
    }
  },
  methods: {
    submit() {
      changePassword({
          oldpassword: md5(this.oldpassword),
          newpassword: md5(this.newpassword),
          newpassword_confirm: md5(this.newpassword_confirm),   
      }).then(response => {
        this.$message({
          message: '密码更新成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
