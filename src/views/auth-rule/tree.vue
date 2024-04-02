<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('auth_rule.search_title') }}</span>
      </div>

      <div class="filter-container">
        <el-button :disabled="!checkPermission(['larke-admin.auth-rule.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('auth_rule.search_create_rule') }}
        </el-button>

        <el-button class="filter-item" icon="el-icon-s-grid" @click="handleIndex">
          {{ $t('auth_rule.search_all_rule') }}
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
          :label="$t('auth_rule.table_title')"
          width="250"
          class-name="larke-admin-auth-rule-tree"
          header-align="left"
        />

        <el-table-column min-width="100px" :label="$t('auth_rule.table_url')">
          <template slot-scope="{row}">
            <div>
              <el-tag type="info" size="mini" style="margin-bottom:3px;" @click="handleClipboard(row.slug, $event)">
                <el-tooltip placement="top">
                  <div slot="content">
                    {{ $t('auth_rule.table_copy_slug', {
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

        <el-table-column width="60px" align="center" :label="$t('auth_rule.table_listorder')">
          <template slot-scope="scope">
            <span class="text-muted">{{ scope.row.listorder }}</span>
          </template>
        </el-table-column>

        <el-table-column width="170px" align="center" :label="$t('auth_rule.table_create_time')">
          <template slot-scope="scope">
            <span class="text-muted">
              <i class="el-icon-time" />&nbsp;
              {{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('auth_rule.table_status')" width="80">
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

        <el-table-column align="center" :label="$t('auth_rule.table_actions')" width="280">
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
              {{ $t('auth_rule.table_detail') }}
            </el-button>

            <el-button 
              v-waves
              :disabled="!checkPermission(['larke-admin.auth-rule.update'])" 
              type="primary" 
              size="mini" 
              icon="el-icon-edit" 
              @click="handleEdit(scope.$index, scope.row)"
            >
              {{ $t('auth_rule.table_update') }}
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
              {{ $t('auth_rule.table_delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="$t('auth_rule.dialog_create')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('auth_rule.dialog_update')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('auth_rule.dialog_detail')" :visible.sync="detail.dialogVisible">
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
import clipboard from '@/utils/clipboard'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime } from '@/utils'
import BackToTop from '@/components/BackToTop'

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
            name: this.$t('auth_rule.detail_id'),
            content: data.id,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_parentid'),
            content: data.parentid,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_title'),
            content: data.title,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_url'),
            content: data.url,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_method'),
            content: data.method,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_slug'),
            content: data.slug,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_description'),
            content: data.description,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_listorder'),
            content: data.listorder,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_need_auth'),
            content: data.is_need_auth,
            type: 'status'
          },
          {
            name: this.$t('auth_rule.detail_status'),
            content: data.status,
            type: 'boolen'
          },
          {
            name: this.$t('auth_rule.detail_update_time'),
            content: data.update_time,
            type: 'time'
          },
          {
            name: this.$t('auth_rule.detail_update_ip'),
            content: data.update_ip,
            type: 'text'
          },
          {
            name: this.$t('auth_rule.detail_create_time'),
            content: data.create_time,
            type: 'time'
          },
          {
            name: this.$t('auth_rule.detail_create_ip'),
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
            message: this.$t('auth_rule.enable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disableRule(data.id).then(() => {
          this.$message({
            message: this.$t('auth_rule.disable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('auth_rule.confirm_delete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteRule(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('auth_rule.confirm_delete_success'),
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
