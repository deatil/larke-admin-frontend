<template>
  <el-form>
    <el-form-item label="昵称">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="简介">
      <el-input type="textarea" v-model.trim="user.introduce" rows="6" placeholder="请填写简介"></el-input>
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
          introduce: '',
        }
      }
    }
  },
  methods: {
    submit() {
      updateInfo({
          nickname: this.user.name,
          email: this.user.email,
          introduce: this.user.introduce,   
      }).then(response => {
        this.$message({
          message: '信息更新成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
