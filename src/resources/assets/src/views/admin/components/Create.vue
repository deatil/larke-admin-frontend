<template>
  <el-form ref="form" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('账号')" prop="name">
      <el-input v-model.trim="data.name" :placeholder="$t('请填写账号')" />
    </el-form-item>
    <el-form-item :label="$t('昵称')" prop="nickname">
      <el-input v-model.trim="data.nickname" :placeholder="$t('请填写昵称')" />
    </el-form-item>
    <el-form-item :label="$t('邮箱')" prop="email">
      <el-input v-model.trim="data.email" :placeholder="$t('请填写邮箱')" />
    </el-form-item>
    <el-form-item :label="$t('简介')" prop="introduce">
      <el-input v-model.trim="data.introduce" type="textarea" rows="6" :placeholder="$t('请填写简介')" />
    </el-form-item>
    <el-form-item :label="$t('头像')">
      <div style="width: 100%;">
        <avatar :data="data" />
      </div>
    </el-form-item>
    <el-form-item :label="$t('状态')" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">{{ $t('启用') }}</el-radio>
        <el-radio :label="0">{{ $t('禁用') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Avatar from './Avatar'
import { createAdmin } from '@/api/admin'

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
      rules: {
        name: [
          { required: true, message: this.$t('账号不能为空'), trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: this.$t('昵称不能为空'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('邮箱不能为空'), trigger: 'blur' }
        ]
      },
      data: {
        name: '',
        nickname: '',
        email: '',
        avatar: '',
        avatarKey: '',
        introduce: '',
        status: 1
      }
    }
  },
  created() {
  },
  methods: {
    submit() {
      const thiz = this

      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }

        createAdmin({
          name: this.data.name,
          nickname: this.data.nickname,
          email: this.data.email,
          avatar: this.data.avatarKey,
          introduce: this.data.introduce,
          status: this.data.status
        }).then(response => {
          this.$message({
            message: this.$t('添加管理员成功'),
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              if (thiz.$refs.form !== undefined) {
                thiz.$refs.form.resetFields()
              }
              thiz.item.dialogVisible = false
            }
          })
        })
      })
    }
  }
}
</script>
