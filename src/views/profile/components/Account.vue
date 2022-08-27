<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item :label="$t('昵称')" prop="name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item :label="$t('邮箱')" prop="email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item :label="$t('简介')">
      <el-input v-model.trim="user.introduce" type="textarea" rows="6" :placeholder="$t('请填写简介')" />
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
          { required: true, message: this.$t('昵称不能为空'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('邮箱不能为空'), trigger: 'blur' }
        ]
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

        updateInfo({
          nickname: this.user.name,
          email: this.user.email,
          introduce: this.user.introduce
        }).then(response => {
          this.loading = false
          
          this.$message({
            message: this.$t('信息更新成功'),
            type: 'success',
            duration: 3 * 1000
          })
        })
      })
    }
  }
}
</script>
