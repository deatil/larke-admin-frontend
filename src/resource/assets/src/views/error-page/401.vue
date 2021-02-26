<template>
  <div class="errPage-container">
    <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          Oops!
        </h1>
        <h2>你没有权限去该页面</h2>
        <h6>你可以进行以下操作解决你的问题</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/dashboard">
              回首页
            </router-link>
          </li>
          <li class="link-type">
            <a href="javascript:;" @click.prevent="logout">退出重新登录</a>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="logo" width="350" height="350" alt="larke-admin.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import logo from '@/assets/larke/larke.png'

export default {
  name: 'Page401',
  data() {
    return {
      logo: logo + '?' + new Date(),
      ewizardClap: logo,
      dialogVisible: false
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }    
  }
}
</script>

<style lang="scss" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none!important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
