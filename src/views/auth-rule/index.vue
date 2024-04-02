<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('auth_rule.search_title') }}</span>
      </div>

      <div class="filter-container">
        <el-button
          v-if="showDeletebtn"
          class="filter-item"
          type="danger"
          style="margin-right: 10px;"
          :disabled="!checkPermission(['larke-admin.auth-rule.clear'])"
          @click="handleDeleteList"
        >
          {{ $t('auth_rule.search_delete_selected') }}
        </el-button>

        <el-input v-model="listQuery.searchword" :placeholder="$t('auth_rule.search_searchword')" clearable style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-select v-model="listQuery.method" :placeholder="$t('auth_rule.search_method')" clearable style="width: 120px;margin-right: 10px;" class="filter-item">
          <el-option v-for="item in methodOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>

        <el-select v-model="listQuery.status" :placeholder="$t('auth_rule.search_status')" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>

        <el-select v-model="listQuery.order" style="width: 80px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('auth_rule.search_btn') }}
        </el-button>

        <el-button :disabled="!checkPermission(['larke-admin.auth-rule.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('auth_rule.search_create_rule') }}
        </el-button>

        <el-button v-permission="['larke-admin.auth-rule.index-tree']" class="filter-item" icon="el-icon-menu" @click="handleTree">
          {{ $t('auth_rule.search_rule_tree') }}
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />

        <el-table-column width="150px" :label="$t('auth_rule.table_title')">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

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

        <el-table-column width="75px" align="center" :label="$t('auth_rule.table_listorder')">
          <template slot-scope="{row, $index}">
            <div @click.stop="{{editableChangeBtn($index, 'editListorderInput')}}">
              <el-input
                v-if="editable[$index]"
                v-model="row.listorder"
                size="mini"
                class="editListorderInput"
                :disabled="!checkPermission(['larke-admin.auth-rule.listorder'])"
                @blur="editableChange($event, row, $index)"
              />
              <span v-else class="text-muted">{{ row.listorder }}</span>
            </div>
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
              :loading="scope.row.id == loading.update"
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

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="$t('auth_rule.dialog_create')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('auth_rule.dialog_update')" :visible.sync="edit.dialogVisible" @close="closeEdit">
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'

import Detail from '@/components/Larke/Detail'
import Edit from './components/Edit'
import Create from './components/Create'
import {
  getRuleList,
  getRuleTreeList,
  getRuleChildrenList,
  getRuleDetail,
  createRule,
  updateRule,
  deleteRule,
  clearRule,
  updateRuleSort,
  enableRule,
  disableRule
} from '@/api/authRule'

export default {
  name: 'AuthRuleIndex',
  components: { BackToTop, Pagination, Detail, Edit, Create },
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
      total: 0,
      listLoading: true,
      listQuery: {
        searchword: '',
        order: 'create_time__ASC',
        method: '',
        status: '',
        page: 1,
        limit: 10
      },
      methodOptions: [
        { label: this.$t('auth_rule.search_method_get'), key: 'GET' },
        { label: this.$t('auth_rule.search_method_head'), key: 'HEAD' },
        { label: this.$t('auth_rule.search_method_post'), key: 'POST' },
        { label: this.$t('auth_rule.search_method_put'), key: 'PUT' },
        { label: this.$t('auth_rule.search_method_delete'), key: 'DELETE' },
        { label: this.$t('auth_rule.search_method_patch'), key: 'PATCH' },
        { label: this.$t('auth_rule.search_method_options'), key: 'OPTIONS' }
      ],
      statusOptions: [
        { key: 'open', display_name: this.$t('auth_rule.search_status_enable') },
        { key: 'close', display_name: this.$t('auth_rule.search_status_disable') }
      ],
      sortOptions: [
        { key: 'create_time__ASC', label: this.$t('auth_rule.search_sort_asc') },
        { key: 'create_time__DESC', label: this.$t('auth_rule.search_sort_desc') }
      ],
      detail: {
        dialogVisible: false,
        data: []
      },
      create: {
        dialogVisible: false
      },
      edit: {
        dialogVisible: false,
        id: ''
      },
      editable: [],
      editableItem: {},
      editableOldSort: 0,
      selectedData: [],
      showDeletebtn: false,
      loading: {
        update: '',
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
      getRuleList({
        searchword: this.listQuery.searchword,
        order: this.listQuery.order,
        method: this.listQuery.method,
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
    handleCreate() {
      this.create.dialogVisible = true
    },
    handleEdit(index, row) {
      this.loading.update = row.id

      this.edit.dialogVisible = true
      this.edit.id = row.id

      this.loading.update = ''
    },
    closeEdit() {
      this.edit.id = ''
    },
    editableChangeBtn(index, className) {
      this.editable = new Array(this.list.length)

      this.editable[index] = true

      this.editableItem = this.list[index]

      this.$set(this.editable, index, true)

      // 让input自动获取焦点
      this.$nextTick(function() {
        var editInputList = document.getElementsByClassName(className)
        editInputList[0].children[0].focus()
      })
    },
    editableChange(e, data, index) {
      this.editable[index] = false

      if (this.editableOldSort == data.listorder) {
        return
      }

      this.editableOldSort = data.listorder

      updateRuleSort(data.id, data.listorder).then(() => {
        this.$message({
          message: this.$t('auth_rule.table_listorder_success'),
          type: 'success',
          duration: 2 * 1000
        })
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
            content: data.is_need_auth + "",
            type: 'status'
          },
          {
            name: this.$t('auth_rule.detail_status'),
            content: data.status + "",
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
      }).catch(() => {
        this.loading.detail = ''
      })
    },
    handleTree() {
      this.$router.replace('/auth/rule/tree')
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
        this.loading.delete = row.id

        deleteRule(row.id).then(() => {
          thiz.loading.delete = ''
          thiz.list.splice(index, 1)

          this.$message({
            message: this.$t('auth_rule.confirm_delete_success'),
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(() => {
          thiz.loading.delete = ''
        })
      })
    },
    handleDeleteList() {
      this.$confirm(this.$t('auth_rule.confirm_delete_selected'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        if (this.selectedData.length < 1) {
          this.$message({
            message: this.$t('auth_rule.select_delete_rules'),
            type: 'error',
            duration: 3 * 1000
          })
          return
        }

        const thiz = this
        clearRule({
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
