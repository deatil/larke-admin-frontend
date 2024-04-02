<template>
  <el-form ref="form" :model="user" :rules="rules">
    <el-form-item :label="$t('profile.nickname')" prop="name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item :label="$t('profile.email')" prop="email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item :label="$t('profile.introduce')">
      <el-input v-model.trim="user.introduce" type="textarea" rows="6" :placeholder="$t('profile.introduce_enter')" />
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
          { required: true, message: this.$t('profile.nickname_dont_empty'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('profile.email_dont_empty'), trigger: 'blur' }
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
            message: this.$t('profile.info_update_success'),
            type: 'success',
            duration: 3 * 1000
          })
        })
      })
    }
  }
}
</script>
