<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item label="昵称" prop="name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model.trim="user.introduce" type="textarea" rows="6" placeholder="请填写简介" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateInfo } from '@/api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          introduce: ''
        }
      }
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }

        updateInfo({
          nickname: this.user.name,
          email: this.user.email,
          introduce: this.user.introduce
        }).then(response => {
          this.$message({
            message: '信息更新成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      })
    }
  }
}
</script>
