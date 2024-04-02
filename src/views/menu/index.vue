<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('menu.search_title') }}</span>
      </div>

      <el-alert
        type="warning"
        :title="$t('menu.search_alert_title')"
        :description="$t('menu.search_alert_description')"
        class="menu-tip"
        show-icon
        :closable="false"
      />

      <div class="filter-container">
        <el-button 
          v-waves 
          :disabled="!checkPermission(['larke-admin.menu.create'])" 
          class="filter-item" 
          type="primary" 
          icon="el-icon-edit" 
          @click="handleCreate">
          {{ $t('menu.search_create') }}
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
          parent-key="pid"
          tree-key="id"
          :show-overflow-tooltip="true"
          :indent-size="25"
          :label="$t('menu.table_title')"
          min-width="150"
          class-name="larke-admin-menu-tree"
          header-align="left"
        />

        <el-table-column :label="$t('menu.table_url')">
          <template slot-scope="{row}">
            <div>
              <el-tag type="info" size="mini" style="margin-bottom:3px;">
                {{ row.slug }}
              </el-tag>
            </div>

            <div>
              <el-tag :type="row.method | methodFilter" size="mini">
                {{ row.method }}
              </el-tag>

              <span style="margin-left: 5px;">{{ row.url }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="80px" align="center" :label="$t('menu.table_sort')">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('menu.table_actions')" width="280">
          <template slot-scope="scope">
            <el-button 
              v-waves
              :loading="scope.row.id == loading.detail"
              type="info" 
              size="mini" 
              icon="el-icon-info" 
              @click="handleDetail(scope.$index, scope.row)"
            >
              {{ $t('menu.table_detail') }}
            </el-button>

            <el-button 
              v-waves
              :disabled="!checkPermission(['larke-admin.menu.update'])" 
              type="primary" 
              size="mini" 
              icon="el-icon-edit" 
              @click="handleEdit(scope.$index, scope.row)"
            >
              {{ $t('menu.table_update') }}
            </el-button>

            <el-button 
              v-waves
              v-permission="['larke-admin.menu.delete']" 
              :loading="scope.row.id == loading.delete"
              type="danger" 
              size="mini" 
              icon="el-icon-delete" 
              @click="handleDelete(scope.$index, scope.row)"
            >
              {{ $t('menu.table_delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="$t('menu.dialog_create')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('menu.dialog_update')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('menu.dialog_detail')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
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
import BackToTop from '@/components/BackToTop'
import { parseTime } from '@/utils'

import Detail from '@/components/Larke/Detail'
import Create from './components/Create'
import Edit from './components/Edit'
import {
  getMenuTree,
  deleteMenu
} from '@/api/menu'

export default {
  name: 'MenuIndex',
  components: { BackToTop, Detail, Edit, Create },
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
    }
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
        id: '',
        data: []
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

      getMenuTree().then(res => {
        this.listLoading = false
        this.list = res.data.list
      })
    },
    handleDetail(index, row) {
      this.loading.detail = row.id

      this.detail.dialogVisible = true
      const data = row

      this.loading.detail = ''

      this.detail.data = [
        {
          name: this.$t('menu.detail_id'),
          content: data.id,
          type: 'text'
        },
        {
          name: this.$t('menu.detail_parentid'),
          content: data.pid,
          type: 'text'
        },
        {
          name: this.$t('menu.detail_title'),
          content: data.title,
          type: 'text'
        },
        {
          name: this.$t('menu.detail_slug'),
          content: data.slug,
          type: 'text'
        },
        {
          name: this.$t('menu.detail_url'),
          content: data.url,
          type: 'text'
        },
        {
          name: this.$t('menu.detail_method'),
          content: data.method,
          type: 'text'
        },
        {
          name: this.$t('menu.detail_sort'),
          content: data.sort,
          type: 'text'
        }
      ]
    },
    handleCreate() {
      this.create.dialogVisible = true
    },
    handleEdit(index, row) {
      this.edit.dialogVisible = true

      const data = Object.assign({}, row)
      this.edit.id = data.id
      this.edit.data = data
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('menu.confirm_delete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteMenu(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('menu.confirm_delete_success'),
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
.menu-tip {
  margin-bottom: 20px;
}
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
