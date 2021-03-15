<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('操作日志') }}</span>
      </div>

      <div class="filter-container">
        <el-row :gutter="10">
          <el-col :md="6" :sm="8">
            <div>
              <el-input v-model="listQuery.searchword" :placeholder="$t('请输入关键字')" clearable class="filter-item" @keyup.enter.native="handleFilter" />
            </div>
          </el-col>
          <el-col :md="5" :sm="7">
            <div>
              <el-date-picker v-model="listQuery.start_time" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间" clearable style="width: 100%;" class="filter-item" />
           </div>            
          </el-col> 
          <el-col :md="5" :sm="7">
            <div>
              <el-date-picker v-model="listQuery.end_time" format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间" clearable style="width: 100%;" class="filter-item" />       
            </div>            
          </el-col>                            
        </el-row>

        <el-row :gutter="10">
          <el-col v-if="showDeletebtn" :md="3" :sm="3">
            <div>
              <el-button
                v-waves 
                class="filter-item"
                type="danger"
                style="width:100%;"
                :disabled="!checkPermission(['larke-admin.log.clear'])"
                @click="handleDeleteList"
              >
                {{ $t('删除选中') }}
              </el-button>       
            </div>
          </el-col>
          <el-col :md="4" :sm="5">
            <div>
              <el-select v-model="listQuery.method" :placeholder="$t('请求方式')" clearable class="filter-item" style="width: 100%;">
                <el-option v-for="item in methodOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </div>            
          </el-col> 
          <el-col :md="3" :sm="3">
            <div>
              <el-select v-model="listQuery.status" :placeholder="$t('状态')" clearable class="filter-item" style="width: 100%;">
                <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </div>            
          </el-col>   
          <el-col :md="3" :sm="3">
            <div>
              <el-select v-model="listQuery.order" class="filter-item" @change="handleFilter" style="width: 100%;">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>   
            </div>            
          </el-col> 
          <el-col :md="3" :sm="3">
            <div>
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="width: 100%;">
                {{ $t('搜索') }}
              </el-button>
            </div>            
          </el-col>            
          <el-col :md="3" :sm="3">
            <div>
              <el-button v-waves class="filter-item" type="danger" :disabled="!checkPermission(['larke-admin.log.clear'])" icon="el-icon-delete" @click="handleClear" style="width: 100%;">
                {{ $t('清空') }}
              </el-button>
            </div>            
          </el-col>  
        </el-row>
      </div>

      <el-table
        ref="logTable"
        v-loading="listLoading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />

        <el-table-column width="100px" align="center" :label="$t('请求方式')">
          <template slot-scope="{row}">
            <el-tag :type="row.method | methodFilter">
              {{ row.method }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column min-width="150px" :label="$t('请求URL')">
          <template slot-scope="{row}">
            <span>{{ row.url }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" :label="$t('请求IP')">
          <template slot-scope="{row}">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>

        <el-table-column width="160px" align="center" :label="$t('请求时间')">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('状态')" width="70">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter" size="mini">
              {{ (row.status == 1) ? $t('启用') : $t('禁用') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('操作')" width="200">
          <template slot-scope="scope">
            <el-button 
              :loading="scope.row.id == loading.detail"
              :disabled="!checkPermission(['larke-admin.log.detail'])" 
              type="info" 
              size="mini" 
              icon="el-icon-info" 
              @click="handleDetail(scope.$index, scope.row)"
            >
              {{ $t('详情') }}
            </el-button>

            <el-button 
              :loading="scope.row.id == loading.delete"
              v-permission="['larke-admin.log.delete']" 
              type="danger" 
              size="mini" 
              icon="el-icon-delete" 
              @click="handleDelete(scope.$index, scope.row)"
            >
              {{ $t('删除') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="$t('日志详情')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Detail from '@/components/Larke/Detail'
import { getList, getDetail, deleteLog, clearLog } from '@/api/adminlog'

export default {
  name: 'AdminLogIndex',
  components: { Pagination, Detail },
  directives: { waves, permission },
  filters: {
    methodFilter(method) {
      const methodMap = {
        'GET': 'success',
        'HEAD': 'info',
        'POST': 'warning',
        'PUT': 'warning',
        'DELETE': 'danger',
        'PATCH': 'warning',
        'OPTIONS': 'info'
      }
      return methodMap[method]
    },
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        searchword: '',
        start_time: '',
        end_time: '',
        order: 'ASC',
        status: '',
        method: '',
        page: 1,
        limit: 20
      },
      statusOptions: [
        { key: 'open', display_name: this.$t('启用') },
        { key: 'close', display_name: this.$t('禁用') }
      ],
      methodOptions: [
        { label: 'GET', key: 'GET' },
        { label: 'HEAD', key: 'HEAD' },
        { label: 'POST', key: 'POST' },
        { label: 'PUT', key: 'PUT' },
        { label: 'DELETE', key: 'DELETE' },
        { label: 'PATCH', key: 'PATCH' },
        { label: 'OPTIONS', key: 'OPTIONS' }
      ],
      sortOptions: [
        { label: '正序', key: 'ASC' },
        { label: '倒叙', key: 'DESC' }
      ],
      detail: {
        dialogVisible: false,
        data: []
      },
      selectedData: [],
      showDeletebtn: false,
      loading: {
        detail: '',
        delete: '',
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      getList({
        searchword: this.listQuery.searchword,
        start_time: this.listQuery.start_time,
        end_time: this.listQuery.end_time,
        status: this.listQuery.status,
        method: this.listQuery.method,
        order: this.listQuery.order,
        start: (this.listQuery.page - 1) * this.listQuery.limit,
        limit: this.listQuery.limit
      }).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSelectionChange(data, key) {
      this.selectedData = []
      data.forEach(element => {
        this.selectedData.push(element.id)
      })

      if (this.selectedData.length > 0) {
        this.showDeletebtn = true
      } else {
        this.showDeletebtn = false
      }
    },
    handleDetail(index, row) {
      this.loading.detail = row.id

      getDetail(row.id).then((res) => {
        this.detail.dialogVisible = true
        const data = res.data

        this.loading.detail = ''

        this.detail.data = [
          {
            name: this.$t('ID'),
            content: data.id,
            type: 'text'
          },
          {
            name: this.$t('账号ID'),
            content: data.admin_id,
            type: 'text'
          },
          {
            name: this.$t('账号昵称'),
            content: data.admin_name,
            type: 'text'
          },
          {
            name: this.$t('请求URL'),
            content: data.url,
            type: 'text'
          },
          {
            name: this.$t('请求方式'),
            content: data.method,
            type: 'text'
          },
          {
            name: this.$t('请求内容'),
            content: JSON.parse(data.info),
            type: 'json',
            depth: 10
          },
          {
            name: this.$t('UA信息'),
            content: data.useragent,
            type: 'text'
          },
          {
            name: this.$t('请求IP'),
            content: data.ip,
            type: 'text'
          },
          {
            name: this.$t('请求时间'),
            content: data.create_time,
            type: 'time'
          },
          {
            name: this.$t('激活状态'),
            content: data.status,
            type: 'boolen'
          }
        ]
      }).catch((err) => {
        this.loading.detail = ''
      })
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('确认要删除该日志吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteLog(row.id).then(res => {
          thiz.loading.delete = ''
          thiz.list.splice(index, 1)

          this.$message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(() => {
          thiz.loading.delete = ''
        })
      }).catch(() => {})
    },
    handleDeleteList() {
      this.$confirm(this.$t('确认要删除选中的日志吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        if (this.selectedData.length < 1) {
          this.$message({
            message: this.$t('请选择要删除的日志'),
            type: 'error',
            duration: 3 * 1000
          })
          return
        }

        const thiz = this
        clearLog({
          ids: this.selectedData.join(',')
        }).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000,
            onClose() {
              for (let i = thiz.list.length - 1; i >= 0; i--) {
                if (thiz.selectedData.includes(thiz.list[i].id)) {
                  thiz.list.splice(i, 1)
                }
              }
            }
          })
        })
      }).catch(() => {

      })
    },
    handleClear() {
      const thiz = this
      this.$confirm(this.$t('确认要清空一个月之前的日志吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        clearLog().then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 5 * 1000
          })
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  padding: 5px 2px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
