<template>
  <el-table
    :data="list"
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    class="system-table"
  >
    <el-table-column :label="$t('dashboard.system_info')" width="200">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column label="" min-width="100" align="left">
      <template slot-scope="scope">
        {{ scope.row.content }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getInfo } from '@/api/system'

export default {
  filters: {
    contentFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getInfo().then(response => {
        const data = response.data

        this.list = [
          {
            name: this.$t('dashboard.version'),
            content: data.admin.name + ' v' + data.admin.version
          },
          {
            name: this.$t('dashboard.domain_ip'),
            content: data.system.domain + ' / ' + data.system.ip
          },
          {
            name: this.$t('dashboard.server_info'),
            content: data.system.php_uname
          },
          {
            name: this.$t('dashboard.server_env'),
            content: data.system.web_server
          },
          {
            name: this.$t('dashboard.php_version'),
            content: data.system.php_version
          },
          {
            name: this.$t('dashboard.mysql_version'),
            content: data.system.mysql_version
          },
          {
            name: this.$t('dashboard.max_upload'),
            content: data.system.file_upload
          },
          {
            name: this.$t('dashboard.server_time'),
            content: data.system.time
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.system-table {
  width: 100%;
  -webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
}
</style>
