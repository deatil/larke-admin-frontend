<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane :label="$t('信息')" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane :label="$t('密码')" name="password">
                <password />
              </el-tab-pane>
              <el-tab-pane :label="$t('头像')" name="avatar">
                <avatar :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Account from './components/Account'
import Password from './components/Password'
import Avatar from './components/Avatar'
import { getInfo } from '@/api/user'

export default {
  name: 'Profile',
  components: { 
    UserCard, 
    Account, 
    Password, 
    Avatar 
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        avatar: require('@/assets/larke/avatar-default.jpg'),
        introduce: ''
      },
      activeTab: 'account'
    }
  },
  computed: {

  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getInfo().then(response => {
        const { nickname, email, avatar, introduce, groups } = response.data

        this.user = {
          name: nickname,
          email: email,
          avatar: avatar,
          introduce: introduce,
          groups: groups,
        }
      })
    }
  }
}
</script>
