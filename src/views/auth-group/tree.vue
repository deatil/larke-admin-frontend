<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('auth_group.search_group_tree') }}</span>
      </div>

      <div class="filter-container">
        <el-button :disabled="!checkPermission(['larke-admin.auth-group.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('auth_group.search_create_group') }}
        </el-button>

        <el-button class="filter-item" icon="el-icon-s-grid" @click="handleIndex">
          {{ $t('auth_group.search_all_group') }}
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

        <el-table-tree-column
          :expand-all="treeExpandAll"
          file-icon="el-icon-document"
          folder-icon="el-icon-folder"
          prop="title"
          level-key="depth"
          parent-key="parentid"
          tree-key="id"
          :show-overflow-tooltip="true"
          :indent-size="25"
          :label="$t('auth_group.table_title')"
          min-width="250"
          class-name="larke-admin-auth-group-tree"
          header-align="left"
        />

        <el-table-column width="60px" align="center" :label="$t('auth_group.table_listorder')">
          <template slot-scope="scope">
            <span>{{ scope.row.listorder }}</span>
          </template>
        </el-table-column>

        <el-table-column width="170px" align="left" :label="$t('auth_group.table_create_time')">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-time" />&nbsp;
              {{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('auth_group.table_status')" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="!checkPermission(['larke-admin.auth-group.enable']) || !checkPermission(['larke-admin.auth-group.disable'])"
              @change="changeStatus($event, scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column align="left" :label="$t('auth_group.table_actions')" width="220">
          <template slot-scope="scope">
            <div>
              <el-button 
                v-waves
                :disabled="!checkPermission(['larke-admin.auth-group.access'])" 
                type="primary" 
                size="mini" 
                icon="el-icon-setting" 
                @click="handleAccess(scope.$index, scope.row)"
              >
                {{ $t('auth_group.table_access') }}
              </el-button>
              
              <el-button 
                v-waves
                :loading="scope.row.id == loading.detail"
                :disabled="!checkPermission(['larke-admin.auth-group.detail'])" 
                type="info" 
                size="mini" 
                icon="el-icon-info" 
                @click="handleDetail(scope.$index, scope.row)"
              >
                {{ $t('auth_group.table_detail') }}
              </el-button>
            </div>

            <div style="margin-top:5px;">
              <el-button 
                v-waves
                :disabled="!checkPermission(['larke-admin.auth-group.update'])" 
                type="primary" 
                size="mini" 
                icon="el-icon-edit" 
                @click="handleEdit(scope.$index, scope.row)"
              >
                {{ $t('auth_group.table_update') }}
              </el-button>

              <el-button 
                v-waves
                :loading="scope.row.id == loading.delete"
                v-permission="['larke-admin.auth-group.delete']" 
                type="danger" 
                size="mini" 
                icon="el-icon-delete" 
                @click="handleDelete(scope.$index, scope.row)"
              >
                {{ $t('auth_group.table_delete') }}
              </el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="$t('auth_group.dialog_create')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('auth_group.dialog_update')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('auth_group.dialog_detail')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>

    <el-dialog :title="$t('auth_group.dialog_access')" :visible.sync="access.dialogVisible">
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
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop'

import Detail from '@/components/Larke/Detail'
import Edit from './components/Edit'
import Create from './components/Create'
import Access from './components/Access'
import {
  getGroupTreeList,
  getGroupDetail,
  deleteGroup,
  updateGroupSort,
  enableGroup,
  disableGroup
} from '@/api/authGroup'

export default {
  name: 'AuthGroupTree',
  components: { BackToTop, Detail, Edit, Create, Access },
  directives: { waves, permission },
  filters: {},
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
      listLoading: true,
      detail: {
        dialogVisible: false,
        data: []
      },
      treeExpandAll: false,
      create: {
        dialogVisible: false
      },
      edit: {
        dialogVisible: false,
        id: ''
      },
      access: {
        dialogVisible: false,
        id: ''
      },
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

      getGroupTreeList().then(res => {
        this.listLoading = false
        this.list = res.data.list
      })
    },
    handleAccess(index, row) {
      this.access.id = row.id
      this.access.dialogVisible = true
    },
    handleDetail(index, row) {
      this.loading.detail = row.id

      getGroupDetail(row.id).then((res) => {
        this.detail.dialogVisible = true
        const data = res.data

        this.loading.detail = ''

        this.detail.data = [
          {
            name: this.$t('auth_group.detail_id'),
            content: data.id,
            type: 'text'
          },
          {
            name: this.$t('auth_group.detail_parentid'),
            content: data.parentid,
            type: 'text'
          },
          {
            name: this.$t('auth_group.detail_title'),
            content: data.title,
            type: 'text'
          },
          {
            name: this.$t('auth_group.detail_description'),
            content: data.description,
            type: 'text'
          },
          {
            name: this.$t('auth_group.detail_listorder'),
            content: data.listorder,
            type: 'text'
          },
          {
            name: this.$t('auth_group.detail_status'),
            content: data.status,
            type: 'boolen'
          },
          {
            name: this.$t('auth_group.detail_update_time'),
            content: data.update_time,
            type: 'time'
          },
          {
            name: this.$t('auth_group.detail_update_ip'),
            content: data.update_ip,
            type: 'text'
          },
          {
            name: this.$t('auth_group.detail_create_time'),
            content: data.create_time,
            type: 'time'
          },
          {
            name: this.$t('auth_group.detail_create_ip'),
            content: data.create_ip,
            type: 'text'
          }
        ]
      }).catch((err) => {
        this.loading.detail = ''
      })
    },
    handleCreate() {
      this.create.dialogVisible = true
    },
    handleEdit(index, row) {
      this.edit.dialogVisible = true
      this.edit.id = row.id
    },
    handleIndex() {
      this.$router.replace('/auth/group/index')
    },
    changeStatus(e, data, index) {
      if (data.status == 1) {
        enableGroup(data.id).then(() => {
          this.$message({
            message: this.$t('auth_group.enable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disableGroup(data.id).then(() => {
          this.$message({
            message: this.$t('auth_group.disable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('auth_group.confirm_delete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteGroup(row.id).then(() => {
          thiz.loading.delete = row.id

          this.$message({
            message: this.$t('auth_group.confirm_delete_success'),
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
