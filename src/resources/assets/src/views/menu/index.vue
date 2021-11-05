<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('菜单管理') }}</span>
      </div>

      <el-alert
        type="warning"
        :title="$t('菜单设置及新增需注意')"
        :description="$t('菜单权限对当前的前端模版只有标识和层级有使用')"
        class="menu-tip"
        show-icon
        :closable="false"
      />

      <div class="filter-container">
        <el-button 
          v-waves 
          :disabled="!checkPermission(['larke-admin-frontend.menu.create'])" 
          class="filter-item" 
          type="primary" 
          icon="el-icon-edit" 
          @click="handleCreate">
          {{ $t('添加菜单') }}
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
          :label="$t('菜单')"
          min-width="150"
          class-name="larke-admin-menu-tree"
          header-align="left"
        />

        <el-table-column :label="$t('链接')">
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

        <el-table-column width="80px" align="center" :label="$t('排序')">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('操作')" width="280">
          <template slot-scope="scope">
            <el-button 
              v-waves
              :loading="scope.row.id == loading.detail"
              type="info" 
              size="mini" 
              icon="el-icon-info" 
              @click="handleDetail(scope.$index, scope.row)"
            >
              {{ $t('详情') }}
            </el-button>

            <el-button 
              v-waves
              :disabled="!checkPermission(['larke-admin-frontend.menu.update'])" 
              type="primary" 
              size="mini" 
              icon="el-icon-edit" 
              @click="handleEdit(scope.$index, scope.row)"
            >
              {{ $t('编辑') }}
            </el-button>

            <el-button 
              v-waves
              v-permission="['larke-admin-frontend.menu.delete']" 
              :loading="scope.row.id == loading.delete"
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
    </el-card>

    <el-dialog :title="$t('添加菜单')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('编辑菜单')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('菜单详情')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
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
  components: { Detail, Edit, Create },
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
          name: this.$t('ID'),
          content: data.id,
          type: 'text'
        },
        {
          name: this.$t('父级ID'),
          content: data.pid,
          type: 'text'
        },
        {
          name: this.$t('名称'),
          content: data.title,
          type: 'text'
        },
        {
          name: this.$t('权限标识'),
          content: data.slug,
          type: 'text'
        },
        {
          name: this.$t('权限链接'),
          content: data.url,
          type: 'text'
        },
        {
          name: this.$t('链接请求类型'),
          content: data.method,
          type: 'text'
        },
        {
          name: this.$t('排序'),
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
      this.$confirm(this.$t('确认要删除该菜单吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteMenu(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('删除菜单成功'),
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
