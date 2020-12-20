<template>
  <div class="dashboard-editor-container">

    <el-card class="admin-tip">
      {{ nickname }} {{ nowTimeCall }}好，当前的时间为：{{ nowTime }}
    </el-card>

    <panel-group />

    <el-row :gutter="12">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" style="padding-right:8px;margin-bottom:30px;">
        <system-table />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import SystemTable from './components/SystemTable'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    SystemTable
  },
  data() {
    return {
      nickname: '',

      nowTime: '',
      nowTimeCall: '晚上',

      timer: ''
    }
  },
  created() {
    this.nickname = this.$store.getters.nickname
    if (!this.nickname) {
      setTimeout(this.getNickname, 3000)
    }

    this.timer = setInterval(this.setNowTime, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    dateFilter(date) {
      if (date < 10) {
        return '0' + date
      }
      return date
    },
    getNowTime() {
      var dateObj = new Date()
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var day = dateObj.getDay()
      var weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      var week = weeks[day]
      var hour = dateObj.getHours()
      var minute = dateObj.getMinutes()
      var second = dateObj.getSeconds()
      var timeValue = '' + ((hour >= 12) ? (hour >= 18) ? '晚上' : '下午' : '上午')
      var newDate = this.dateFilter(year) + '年' + this.dateFilter(month) + '月' + this.dateFilter(date) + '日 ' + ' ' + this.dateFilter(hour) + ':' + this.dateFilter(minute) + ':' + this.dateFilter(second)
      var nowTime = newDate + ' ' + week
      return [nowTime, timeValue]
    },
    setNowTime() {
      const nowTime = this.getNowTime()
      this.nowTime = nowTime[0]
      this.nowTimeCall = nowTime[1]
    },
    getNickname() {
      this.nickname = this.$store.getters.nickname
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
}
</style>
