<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('config.search_title') }}</span>
      </div>

      <div class="filter-container">
        <el-input v-model="listQuery.searchword" :placeholder="$t('config.search_searchword')" clearable style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-select v-model="listQuery.group" :placeholder="$t('config.search_group')" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="group in groupOptions" :key="group.key" :label="group.display_name" :value="group.key" />
        </el-select>

        <el-select v-model="listQuery.status" :placeholder="$t('config.search_status')" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>

        <el-select v-model="listQuery.order" style="width: 140px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('config.search_btn') }}
        </el-button>

        <el-button :disabled="!checkPermission(['larke-admin.config.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('config.search_create_config') }}
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

        <el-table-column width="130px" :label="$t('config.table_name')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="120px" :label="$t('config.table_title')">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100px" :label="$t('config.table_type')">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="80px" :label="$t('config.table_group')">
          <template slot-scope="scope">
            <span>{{ scope.row.group }}</span>
          </template>
        </el-table-column>

        <el-table-column width="75px" align="center" :label="$t('config.table_listorder')">
          <template slot-scope="{row, $index}">
            <div @click.stop="{{editableChangeBtn($index, 'editListorderInput')}}">
              <el-input
                v-if="editable[$index]"
                v-model="row.listorder"
                size="mini"
                class="editListorderInput"
                :disabled="!checkPermission(['larke-admin.config.listorder'])"
                @blur="editableChange($event, row, $index)"
              />
              <span v-else>{{ row.listorder }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="170px" align="center" :label="$t('config.table_create_time')">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-time" />&nbsp;
              {{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('config.table_status')" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="!checkPermission(['larke-admin.config.enable']) || !checkPermission(['larke-admin.config.disable'])"
              @change="changeStatus($event, scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('config.table_actions')" width="280">
          <template slot-scope="scope">
            <el-button 
              v-waves
              :loading="scope.row.id == loading.detail"
              :disabled="!checkPermission(['larke-admin.config.detail'])" 
              type="info" 
              size="mini" 
              icon="el-icon-info" 
              @click="handleDetail(scope.$index, scope.row)"
            >
              {{ $t('config.table_detail') }}
            </el-button>

            <el-button 
              v-waves
              :disabled="!checkPermission(['larke-admin.config.update'])" 
              type="primary" 
              size="mini" 
              icon="el-icon-edit" 
              @click="handleEdit(scope.$index, scope.row)"
            >
              {{ $t('config.table_update') }}
            </el-button>

            <el-button 
              v-waves
              :loading="scope.row.id == loading.delete"
              v-permission="['larke-admin.config.delete']" 
              type="danger" 
              size="mini" 
              icon="el-icon-delete" 
              @click="handleDelete(scope.$index, scope.row)"
            >
              {{ $t('config.table_delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="$t('config.dialog_detail')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>

    <el-dialog :title="$t('config.dialog_create')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('config.dialog_update')" :visible.sync="edit.dialogVisible">
      <edit :item="edit" />
    </el-dialog>

    <el-tooltip placement="top" :content="$t('common.goto_top')">
      <back-to-top :custom-style="backToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import md5 from 'js-md5'
import waves from '@/directive/waves'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { parseTime, formatOpions } from '@/utils'
import Pagination from '@/components/Pagination'
import BackToTop from '@/components/BackToTop'

import Detail from '@/components/Larke/Detail'
import Edit from './components/Edit'
import Create from './components/Create'
import {
  getList,
  getDetail,
  deleteConfig,
  enable,
  disable,
  updateSort,
  setting
} from '@/api/config'

export default {
  name: 'ConfigIndex',
  components: { BackToTop, Pagination, Detail, Edit, Create },
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
      total: 0,
      listLoading: true,
      listQuery: {
        searchword: '',
        group: '',
        status: '',
        order: 'create_time__ASC',
        page: 1,
        limit: 10
      },
      groupOptions: [
        { key: 'other', display_name: this.$t('config.search_group_none') }
      ],
      statusOptions: [
        { key: 'open', display_name: this.$t('config.search_status_enable') },
        { key: 'close', display_name: this.$t('config.search_status_disable') }
      ],
      sortOptions: [
        { key: 'create_time__ASC', label: this.$t('config.search_sort_asc') },
        { key: 'create_time__DESC', label: this.$t('config.search_sort_desc') }
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
      editable: [],
      editableItem: {},
      editableOldSort: 0,
      loading: {
        detail: '',
        delete: '',
      },
    }
  },
  created() {
    this.fetchGroup()
    this.getList()
  },
  methods: {
    checkPermission,
    fetchGroup() {
      return new Promise((resolve, reject) => {
        getDetail('group').then(response => {
          const data = formatOpions(response.data.value)

          this.groupOptions = []
          data.forEach((item, key) => {
            this.groupOptions.push({
              key: item.key,
              display_name: item.label
            })
          })
          this.groupOptions.push({
            key: 'other',
            display_name: this.$t('config.search_group_none')
          })

          resolve(this.groupOptions)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getList() {
      this.listLoading = true
      getList({
        searchword: this.listQuery.searchword,
        group: this.listQuery.group,
        status: this.listQuery.status,
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
    handleCreate() {
      this.create.dialogVisible = true
    },
    handleEdit(index, row) {
      this.edit.dialogVisible = true
      this.edit.id = row.id
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

      updateSort(data.id, data.listorder).then(() => {
        this.$message({
          message: this.$t('config.table_listorder_success'),
          type: 'success',
          duration: 2 * 1000
        })
      })
    },
    handleDetail(index, row) {
      this.loading.detail = row.id

      getDetail(row.id).then((res) => {
        this.detail.dialogVisible = true
        const data = res.data

        this.loading.detail = ''

        this.detail.data = [
          {
            name: this.$t('config.detail_id'),
            content: data.id,
            type: 'text'
          },
          {
            name: this.$t('config.detail_group'),
            content: data.group,
            type: 'text'
          },
          {
            name: this.$t('config.detail_type'),
            content: data.type,
            type: 'text'
          },
          {
            name: this.$t('config.detail_title'),
            content: data.title,
            type: 'text'
          },
          {
            name: this.$t('config.detail_name'),
            content: data.name,
            type: 'text'
          },

          {
            name: this.$t('config.detail_options'),
            content: data.options,
            type: 'text'
          },
          {
            name: this.$t('config.detail_options_value'),
            content: data.value,
            type: 'text'
          },
          {
            name: this.$t('config.detail_description'),
            content: data.description,
            type: 'text'
          },

          {
            name: this.$t('config.detail_listorder'),
            content: data.listorder,
            type: 'text'
          },
          {
            name: this.$t('config.detail_show'),
            content: data.is_show + "",
            type: 'status'
          },
          {
            name: this.$t('config.detail_status'),
            content: data.status + "",
            type: 'boolen'
          },

          {
            name: this.$t('config.detail_update_time'),
            content: data.update_time,
            type: 'time'
          },
          {
            name: this.$t('config.detail_create_time'),
            content: data.create_time,
            type: 'time'
          }

        ]
      }).catch((err) => {
        this.loading.detail = ''
      })
    },
    changeStatus(e, data, index) {
      if (data.status == 1) {
        enable(data.id).then(() => {
          this.$message({
            message: this.$t('config.enable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disable(data.id).then(() => {
          this.$message({
            message: this.$t('config.disable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('config.confirm_delete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteConfig(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('config.confirm_delete_success'),
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
