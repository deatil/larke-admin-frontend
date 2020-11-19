<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>添加管理员</span>
      </div>

      <el-form label-width="100px">
        <el-form-item label="账号">
          <el-input v-model.trim="data.name" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model.trim="data.nickname" />
        </el-form-item>          
        <el-form-item label="邮箱">
          <el-input v-model.trim="data.email" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model.trim="data.introduce" rows="6" placeholder="请填写简介"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <div style="width: 100%;">
            <avatar :data="data" />
          </div>        
        </el-form-item>           
        <el-form-item label="状态">  
          <el-select v-model="data.status" placeholder="状态" style="width: 100%">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import Avatar from './components/Avatar'
import { createAdmin } from '@/api/admin'

export default {
  name: 'AdminCreate',
  components: { Avatar },
  data() {   
    return {
      id: '',
      data: {
        name: '',
        nickname: '',
        email: '',
        avatar: '',
        avatarKey: '',
        introduce: '',
        status: 1,
      },
      statusOptions: [
        { key: 1, display_name: '启用' },
        { key: 0, display_name: '禁用' },
      ],
    }
  },
  created() {
  },
  methods: {  
    submit() {
      const thiz = this
      createAdmin({
        name: this.data.name,
        nickname: this.data.nickname,
        email: this.data.email,
        avatar: this.data.avatarKey,
        introduce: this.data.introduce,
        status: this.data.status,
      }).then(response => {
        this.$message({
          message: '添加管理员成功',
          type: 'success',
          duration: 5 * 1000,
          onClose() {
            thiz.$router.replace('/admin/index')
          }
        })
      })
    }
  }
}
</script>
