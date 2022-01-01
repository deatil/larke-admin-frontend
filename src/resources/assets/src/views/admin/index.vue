<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('管理员') }}</span>
      </div>

      <div class="filter-container">
        <el-input v-model="listQuery.searchword" :placeholder="$t('请输入关键字')" clearable style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-select v-model="listQuery.status" :placeholder="$t('状态')" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>

        <el-select v-model="listQuery.order" style="width: 140px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('搜索') }}
        </el-button>

        <el-button v-waves :disabled="!checkPermission(['larke-admin.admin.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('添加账号') }}
        </el-button>

        <el-button v-waves v-permission="['larke-admin.admin.delete']" class="filter-item" type="danger" icon="el-icon-switch-button" @click="handleLogout">
          {{ $t('账号退出') }}
        </el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="list"
        class="border-gray"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="150px" :label="$t('账号')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" :label="$t('昵称')">
          <template slot-scope="{row}">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="left" :label="$t('添加时间')">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-time" />&nbsp;
              {{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('状态')" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="!checkPermission(['larke-admin.admin.enable']) || !checkPermission(['larke-admin.admin.disable'])"
              @change="changeStatus($event, scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column align="left" :label="$t('操作')" width="320">
          <template slot-scope="scope">
            <div>
              <el-button 
                v-waves
                type="primary" 
                :disabled="!checkPermission(['larke-admin.admin.access'])" 
                size="mini" 
                icon="el-icon-setting" 
                @click="handleAccess(scope.$index, scope.row)"
              >
                {{ $t('设置分组') }}
              </el-button>

              <el-button 
                v-waves
                :disabled="!checkPermission(['larke-admin.admin.password'])" 
                type="warning" 
                size="mini" 
                icon="el-icon-key" 
                @click="handlePassword(scope.$index, scope.row)"
              >
                {{ $t('改密') }}
              </el-button>

              <el-button 
                v-waves
                :loading="scope.row.id == loading.detail"
                :disabled="!checkPermission(['larke-admin.admin.detail'])" 
                type="info" 
                size="mini" 
                icon="el-icon-info" 
                @click="handleDetail(scope.$index, scope.row)"
              >
                {{ $t('详情') }}
              </el-button>
            </div>

            <div style="margin-top:5px;">
              <el-button 
                v-waves
                :disabled="!checkPermission(['larke-admin.admin.update'])" 
                type="primary" 
                size="mini" 
                icon="el-icon-edit" 
                @click="handleEdit(scope.$index, scope.row)"
              >
                {{ $t('编辑') }}
              </el-button>

              <el-button 
                v-waves
                :loading="scope.row.id == loading.delete"
                v-permission="['larke-admin.admin.delete']" 
                type="danger" 
                size="mini" 
                icon="el-icon-delete" 
                @click="handleDelete(scope.$index, scope.row)"
              >
                {{ $t('删除') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="$t('账号详情')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>

    <el-dialog :title="$t('添加账号')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('编辑账号')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('更改密码')" :visible.sync="password.dialogVisible">
      <el-form>
        <el-form-item :label="$t('新密码')">
          <el-input v-model="password.newpassword" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="changePassword">
            {{ $t('确认') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('退出账号')" :visible.sync="logout.dialogVisible">
      <el-form>
        <el-form-item :label="$t('账号的RefreshToken')">
          <el-input v-model="logout.refreshToken" type="textarea" rows="6" placeholder="请输入账号的RefreshToken" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogout">{{ $t('确认退出') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('设置分组')" :visible.sync="access.dialogVisible">
      <access :item="access" />
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import Detail from '@/components/Larke/Detail'
import Edit from './components/Edit'
import Create from './components/Create'
import Access from './components/Access'
import {
  getList,
  getDetail,
  deleteAdmin,
  enableAdmin,
  disableAdmin,
  updatePassword,
  logoutAdmin
} from '@/api/admin'

export default {
  name: 'AdminIndex',
  components: { Pagination, Detail, Edit, Create, Access },
  directives: { waves, permission },
  filters: {

  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        searchword: '',
        order: 'ASC',
        status: '',
        page: 1,
        limit: 10
      },
      statusOptions: [
        { key: 'open', display_name: this.$t('启用') },
        { key: 'close', display_name: this.$t('禁用') }
      ],
      sortOptions: [
        { key: 'ASC', label: this.$t('正序'),  },
        { key: 'DESC', label: this.$t('倒叙'),  }
      ],
      create: {
        dialogVisible: false
      },
      edit: {
        dialogVisible: false,
        id: ''
      },
      detail: {
        dialogVisible: false,
        data: []
      },
      access: {
        id: '',
        name: '',
        dialogVisible: false
      },
      password: {
        dialogVisible: false,
        id: '',
        newpassword: ''
      },
      logout: {
        dialogVisible: false,
        refreshToken: ''
      },
      loading: {
        detail: '',
        delete: '',
      }
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
        order: this.listQuery.order,
        status: this.listQuery.status,
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
    handleCreate() {
      this.create.dialogVisible = true
    },
    handleEdit(index, row) {
      this.edit.dialogVisible = true
      this.edit.id = row.id
    },
    handleAccess(index, row) {
      this.access.id = row.id
      this.access.name = row.name
      this.access.dialogVisible = true
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
            name: this.$t('账号'),
            content: data.name,
            type: 'text'
          },
          {
            name: this.$t('昵称'),
            content: data.nickname,
            type: 'text'
          },
          {
            name: this.$t('邮箱'),
            content: data.email,
            type: 'text'
          },
          {
            name: this.$t('简介'),
            content: data.introduce,
            type: 'text'
          },
          {
            name: this.$t('分组'),
            content: data.groups,
            type: 'arr2str',
            arrkey: 'title'
          },
          {
            name: this.$t('头像'),
            content: data.avatar,
            type: 'image'
          },
          {
            name: this.$t('加入时间'),
            content: data.create_time,
            type: 'time'
          },
          {
            name: this.$t('最近活动'),
            content: data.last_active,
            type: 'time'
          },
          {
            name: this.$t('最近活动IP'),
            content: data.last_ip,
            type: 'text'
          },
          {
            name: this.$t('激活状态'),
            content: data.status + "",
            type: 'boolen'
          }
        ]
      }).catch((err) => {
        this.loading.detail = ''
      })
    },
    changeStatus(e, data, index) {
      if (data.status == 1) {
        enableAdmin(data.id).then(() => {
          this.$message({
            message: this.$t('管理员启用成功'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disableAdmin(data.id).then(() => {
          this.$message({
            message: this.$t('管理员禁用成功'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('确认要删除该管理员吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteAdmin(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('删除管理员成功'),
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              thiz.list.splice(index, 1)
            }
          })
        }).catch(() => {
          thiz.loading.delete = ''
        })
      }).catch(() => {

      })
    },
    handlePassword(index, row) {
      this.password.dialogVisible = true
      this.password.id = row.id
    },
    changePassword() {
      if (this.password.newpassword == '') {
        this.$message({
          message: this.$t('密码不能为空'),
          type: 'error',
          duration: 5 * 1000
        })

        return false
      }

      updatePassword(this.password.id, {
        password: md5(this.password.newpassword)
      }).then(() => {
        const thiz = this
        this.$message({
          message: this.$t('管理员密码修改成功'),
          type: 'success',
          duration: 5 * 1000,
          onClose() {
            thiz.password.newpassword = ''
            thiz.password.dialogVisible = false
          }
        })
      })
    },
    handleLogout() {
      this.logout.dialogVisible = true
    },
    onLogout() {
      if (this.logout.refreshToken == '') {
        this.$message({
          message: this.$t('refreshToken 不能为空'),
          type: 'error',
          duration: 5 * 1000
        })

        return false
      }

      logoutAdmin(this.logout.refreshToken).then(() => {
        const thiz = this
        this.$message({
          message: this.$t('管理员退出成功'),
          type: 'success',
          duration: 5 * 1000,
          onClose() {
            thiz.logout.refreshToken = ''
            thiz.logout.dialogVisible = false
          }
        })
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
