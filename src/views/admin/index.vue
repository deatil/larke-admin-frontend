<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('admin.search_title') }}</span>
      </div>

      <div class="filter-container">
        <el-input v-model="listQuery.searchword" :placeholder="$t('admin.search_searchword')" clearable style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-select v-model="listQuery.status" :placeholder="$t('admin.search_status')" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>

        <el-select v-model="listQuery.order" style="width: 140px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('admin.search_btn') }}
        </el-button>

        <el-button v-waves :disabled="!checkPermission(['larke-admin.admin.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('admin.search_create_passport') }}
        </el-button>

        <el-button v-waves v-permission="['larke-admin.admin.reset-permission']" class="filter-item" type="success" icon="el-icon-refresh" @click="handleResetPermission">
          {{ $t('admin.search_clear_cache') }}
        </el-button>

        <el-button v-waves v-permission="['larke-admin.admin.delete']" class="filter-item" type="danger" icon="el-icon-switch-button" @click="handleLogout">
          {{ $t('admin.search_passport_logout') }}
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
        <el-table-column width="150px" :label="$t('admin.table_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" :label="$t('admin.table_nickname')">
          <template slot-scope="{row}">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="left" :label="$t('admin.table_create_time')">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-time" />&nbsp;
              {{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('admin.table_status')" width="80">
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

        <el-table-column align="left" :label="$t('admin.table_actions')" width="320">
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
                {{ $t('admin.table_setting_group') }}
              </el-button>

              <el-button 
                v-waves
                :disabled="!checkPermission(['larke-admin.admin.password'])" 
                type="warning" 
                size="mini" 
                icon="el-icon-key" 
                @click="handlePassword(scope.$index, scope.row)"
              >
                {{ $t('admin.table_password') }}
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
                {{ $t('admin.table_detail') }}
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
                {{ $t('admin.table_update') }}
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
                {{ $t('admin.table_delete') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="$t('admin.dialog_detail')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>

    <el-dialog :title="$t('admin.dialog_create')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('admin.dialog_edit')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('admin.dialog_password')" :visible.sync="password.dialogVisible">
      <el-form>
        <el-form-item :label="$t('admin.dialog_password_newpassword')">
          <el-input v-model="password.newpassword" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading.password"
            @click="changePassword">
            {{ $t('common.ok') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('admin.dialog_logout')" :visible.sync="logout.dialogVisible">
      <el-form>
        <el-form-item :label="$t('admin.dialog_logout_refreshToken')">
          <el-input v-model="logout.refreshToken" type="textarea" rows="6" placeholder="请输入账号的RefreshToken" />
          <div class="text-grey"> 
            {{ $t('admin.dialog_logout_tips') }}
          </div>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading.logout"
            @click="onLogout">
              {{ $t('admin.dialog_logout_ok') }}
            </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('admin.dialog_access')" :visible.sync="access.dialogVisible">
      <access :item="access" />
    </el-dialog>

    <el-tooltip placement="top" :content="$t('common.goto_top')">
      <back-to-top :custom-style="backToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import md5 from 'js-md5'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import BackToTop from '@/components/BackToTop'

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
  resetPermission,
  logoutAdmin
} from '@/api/admin'

export default {
  name: 'AdminIndex',
  components: { BackToTop, Pagination, Detail, Edit, Create, Access },
  directives: { waves, permission },
  filters: {

  },
  data() {
    return {
      backToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },

      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        searchword: '',
        order: 'create_time__ASC',
        status: '',
        page: 1,
        limit: 10
      },
      statusOptions: [
        { key: 'open', display_name: this.$t('admin.table_enable') },
        { key: 'close', display_name: this.$t('admin.table_disable') }
      ],
      sortOptions: [
        { key: 'create_time__ASC', label: this.$t('admin.table_asc'),  },
        { key: 'create_time__DESC', label: this.$t('admin.table_desc'),  }
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
        password: false,
        logout: false,
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
            name: this.$t('admin.detail_id'),
            content: data.id,
            type: 'text'
          },
          {
            name: this.$t('admin.detail_name'),
            content: data.name,
            type: 'text'
          },
          {
            name: this.$t('admin.detail_nickname'),
            content: data.nickname,
            type: 'text'
          },
          {
            name: this.$t('admin.detail_email'),
            content: data.email,
            type: 'text'
          },
          {
            name: this.$t('admin.detail_introduce'),
            content: data.introduce,
            type: 'text'
          },
          {
            name: this.$t('admin.detail_groups'),
            content: data.groups,
            type: 'arr2str',
            arrkey: 'title'
          },
          {
            name: this.$t('admin.detail_avatar'),
            content: data.avatar,
            type: 'image'
          },
          {
            name: this.$t('admin.detail_create_time'),
            content: data.create_time,
            type: 'time'
          },
          {
            name: this.$t('admin.detail_last_active'),
            content: data.last_active,
            type: 'time'
          },
          {
            name: this.$t('admin.detail_last_ip'),
            content: data.last_ip,
            type: 'text'
          },
          {
            name: this.$t('admin.detail_status'),
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
            message: this.$t('admin.table_enable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disableAdmin(data.id).then(() => {
          this.$message({
            message: this.$t('admin.table_disable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('admin.confirm_delete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteAdmin(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('admin.confirm_delete_success'),
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
      this.loading.password = true

      if (this.password.newpassword == '') {
        this.$message({
          message: this.$t('admin.password_not_empty'),
          type: 'error',
          duration: 5 * 1000
        })

        this.loading.password = false

        return false
      }

      updatePassword(this.password.id, {
        password: md5(this.password.newpassword)
      }).then(() => {
        const thiz = this

        this.loading.password = false

        this.$message({
          message: this.$t('admin.password_change_success'),
          type: 'success',
          duration: 5 * 1000,
          onClose() {
            thiz.password.newpassword = ''
            thiz.password.dialogVisible = false
          }
        })
      }).catch(() => {
        this.loading.password = false
      })
    },
    handleResetPermission() {
      const thiz = this

      this.$confirm(this.$t('admin.confirm_update_chache'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: this.$t('admin.confirm_updateing_cache'),
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        resetPermission().then(() => {
          loading.close()

          this.$message({
            message: this.$t('admin.confirm_update_chache_success'),
            type: 'success',
            duration: 3 * 1000,
          })
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {})
    },
    handleLogout() {
      this.logout.dialogVisible = true
    },
    onLogout() {
      this.loading.logout = true

      if (this.logout.refreshToken == '') {
        this.$message({
          message: this.$t('admin.refreshToken_not_empty'),
          type: 'error',
          duration: 5 * 1000
        })

        this.loading.logout = false

        return false
      }

      logoutAdmin(this.logout.refreshToken).then(() => {
        const thiz = this

        this.loading.logout = false

        this.$message({
          message: this.$t('admin.logout_success'),
          type: 'success',
          duration: 5 * 1000,
          onClose() {
            thiz.logout.refreshToken = ''
            thiz.logout.dialogVisible = false
          }
        })
      }).catch(() => {
        this.loading.logout = false
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
