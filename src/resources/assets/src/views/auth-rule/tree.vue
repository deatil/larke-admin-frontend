<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('权限结构') }}</span>
      </div>

      <div class="filter-container">
        <el-button :disabled="!checkPermission(['larke-admin.auth-rule.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('添加权限') }}
        </el-button>

        <el-button class="filter-item" icon="el-icon-s-grid" @click="handleIndex">
          {{ $t('全部权限') }}
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
          :label="$t('名称')"
          width="250"
          class-name="larke-admin-auth-rule-tree"
          header-align="left"
        />

        <el-table-column min-width="100px" :label="$t('链接')">
          <template slot-scope="{row}">
            <div>
              <el-tag type="info" size="mini" style="margin-bottom:3px;" @click="handleClipboard(row.slug, $event)">
                <el-tooltip placement="top">
                  <div slot="content">
                    {{ $t('点击复制 {slug}', {
                      slug: row.slug
                    }) }}
                  </div>
                  <div class="slug-item">
                    {{ row.slug }}
                  </div>
                </el-tooltip> 
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

        <el-table-column width="60px" align="center" :label="$t('排序')">
          <template slot-scope="scope">
            <span class="text-muted">{{ scope.row.listorder }}</span>
          </template>
        </el-table-column>

        <el-table-column width="170px" align="center" :label="$t('添加时间')">
          <template slot-scope="scope">
            <span class="text-muted">
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
              :disabled="!checkPermission(['larke-admin.auth-rule.enable']) || !checkPermission(['larke-admin.auth-rule.disable'])"
              @change="changeStatus($event, scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('操作')" width="280">
          <template slot-scope="scope">
            <el-button 
              v-waves
              :loading="scope.row.id == loading.detail"
              :disabled="!checkPermission(['larke-admin.auth-rule.detail'])" 
              type="info" 
              size="mini" 
              icon="el-icon-info" 
              @click="handleDetail(scope.$index, scope.row)"
            >
              {{ $t('详情') }}
            </el-button>

            <el-button 
              v-waves
              :disabled="!checkPermission(['larke-admin.auth-rule.update'])" 
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
              v-permission="['larke-admin.auth-rule.delete']" 
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

    <el-dialog :title="$t('添加权限')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('编辑权限')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('权限详情')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
import waves from '@/directive/waves' // waves directive
import clipboard from '@/utils/clipboard'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils'
import Detail from '@/components/Larke/Detail'
import Edit from './components/Edit'
import Create from './components/Create'
import {
  getRuleTreeList,
  getRuleDetail,
  deleteRule,
  updateRuleSort,
  enableRule,
  disableRule
} from '@/api/authRule'

export default {
  name: 'AuthRuleTree',
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
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    getList() {
      this.listLoading = true

      getRuleTreeList().then(res => {
        this.listLoading = false
        this.list = res.data.list
      })
    },
    handleDetail(index, row) {
      this.loading.detail = row.id

      getRuleDetail(row.id).then((res) => {
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
            name: this.$t('父级ID'),
            content: data.parentid,
            type: 'text'
          },
          {
            name: this.$t('名称'),
            content: data.title,
            type: 'text'
          },
          {
            name: this.$t('权限链接'),
            content: data.url,
            type: 'text'
          },
          {
            name: this.$t('请求类型'),
            content: data.method,
            type: 'text'
          },
          {
            name: this.$t('地址标识'),
            content: data.slug,
            type: 'text'
          },
          {
            name: this.$t('描述'),
            content: data.description,
            type: 'text'
          },
          {
            name: this.$t('排序'),
            content: data.listorder,
            type: 'text'
          },
          {
            name: this.$t('验证权限'),
            content: data.is_need_auth,
            type: 'status'
          },
          {
            name: this.$t('状态'),
            content: data.status,
            type: 'boolen'
          },
          {
            name: this.$t('更新时间'),
            content: data.update_time,
            type: 'time'
          },
          {
            name: this.$t('更新IP'),
            content: data.update_ip,
            type: 'text'
          },
          {
            name: this.$t('添加时间'),
            content: data.create_time,
            type: 'time'
          },
          {
            name: this.$t('添加IP'),
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
      this.$router.replace('/auth/rule/index')
    },
    changeStatus(e, data, index) {
      if (data.status == 1) {
        enableRule(data.id).then(() => {
          this.$message({
            message: this.$t('权限启用成功'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disableRule(data.id).then(() => {
          this.$message({
            message: this.$t('权限禁用成功'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('确认要删除该权限吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteRule(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('删除权限成功'),
            type: 'success',
            duration: 2 * 1000,
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
.slug-item {
  cursor: pointer;
}
</style>
