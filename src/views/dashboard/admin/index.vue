<template>
  <div class="dashboard-container">

    <el-card class="admin-tip">
      {{ $t('{nickname} {nowTimeCall}好，当前的时间为：{nowTime}', {
        nickname: nickname,
        nowTimeCall: nowTimeCall,
        nowTime: nowTime
      }) }}
    </el-card>

    <panel-group />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <component :is="currentSystem" />
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js'
import checkPermission from '@/utils/permission'
import PanelGroup from './components/PanelGroup'
import SystemTable from './components/SystemTable'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    SystemTable,

    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      nickname: '',

      nowTime: '',
      nowTimeCall: this.$t('晚上'),

      timer: '',

      currentSystem: 'SystemTable',
    }
  },
  created() {
    const thiz = this

    this.nickname = this.$store.getters.nickname
    if (! this.nickname) {
      setTimeout(function () {
        thiz.getNickname()
      }, 5000)
    }

    this.timer = setInterval(this.setNowTime, 1000)

    if (! checkPermission(['larke-admin.system.info'])) {
      this.currentSystem = ''
    }
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
      var weeks = [
        this.$t('星期日'), 
        this.$t('星期一'), 
        this.$t('星期二'), 
        this.$t('星期三'), 
        this.$t('星期四'), 
        this.$t('星期五'), 
        this.$t('星期六')
      ]
      var week = weeks[day]
      var hour = dateObj.getHours()
      var minute = dateObj.getMinutes()
      var second = dateObj.getSeconds()
      var timeValue = '' + (
        (hour >= 12) 
        ? ((hour >= 18) ? this.$t('晚上') : this.$t('下午')) 
        : ((hour >= 8) ? this.$t('上午') : this.$t('凌晨'))
      )
      var nowTime = this.$t('{year}年{month}月{day}日 {hour}:{minute}:{second} {week}', {
        year: this.dateFilter(year),
        month: this.dateFilter(month),
        day: this.dateFilter(date),
        hour: this.dateFilter(hour),
        minute: this.dateFilter(minute),
        second: this.dateFilter(second),
        week: week
      })
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
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
