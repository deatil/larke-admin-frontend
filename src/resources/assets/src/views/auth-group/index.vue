<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('管理分组') }}</span>
      </div>

      <div class="filter-container">
        <el-input v-model="listQuery.searchword" :placeholder="$t('请输入关键字')" clearable style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-select v-model="listQuery.status" :placeholder="$t('状态')" clearable class="filter-item" style="width: 80px;margin-right: 10px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>

        <el-select v-model="listQuery.order" style="width: 80px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('搜索') }}
        </el-button>

        <el-button :disabled="!checkPermission(['larke-admin.auth-group.create'])" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('添加分组') }}
        </el-button>

        <el-button v-permission="['larke-admin.auth-group.index-tree']" class="filter-item" icon="el-icon-menu" @click="handleTree">
          {{ $t('分组结构') }}
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

        <el-table-column min-width="150px" :label="$t('名称')">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column width="75px" align="center" :label="$t('排序')">
          <template slot-scope="{row, $index}">
            <div @click.stop="{{editableChangeBtn($index, 'editListorderInput')}}">
              <el-input
                v-if="editable[$index]"
                v-model="row.listorder"
                size="mini"
                class="editListorderInput"
                :disabled="!checkPermission(['larke-admin.auth-group.listorder'])"
                @blur="editableChange($event, row, $index)"
              />
              <span v-else>{{ row.listorder }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="170px" align="left" :label="$t('添加时间')">
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
              :disabled="!checkPermission(['larke-admin.auth-group.enable']) || !checkPermission(['larke-admin.auth-group.disable'])"
              @change="changeStatus($event, scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column align="left" :label="$t('操作')" width="220">
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
                {{ $t('授权') }}
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
                {{ $t('详情') }}
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
                {{ $t('编辑') }}
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
                {{ $t('删除') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="$t('添加分组')" :visible.sync="create.dialogVisible">
      <create :item="create" />
    </el-dialog>

    <el-dialog :title="$t('编辑分组')" :visible.sync="edit.dialogVisible" @close="closeEdit">
      <edit :item="edit" />
    </el-dialog>

    <el-dialog :title="$t('分组详情')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>

    <el-dialog :title="$t('分组授权')" :visible.sync="access.dialogVisible">
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
  getGroupList,
  getGroupTreeList,
  getGroupChildrenList,
  getGroupDetail,
  deleteGroup,
  updateGroupSort,
  enableGroup,
  disableGroup
} from '@/api/authGroup'

export default {
  name: 'AuthGroupIndex',
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
        { key: 'ASC', label: this.$t('正序') },
        { key: 'DESC', label: this.$t('倒叙') }
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
      access: {
        id: '',
        title: '',
        dialogVisible: false
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
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      getGroupList({
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

      updateGroupSort(data.id, data.listorder).then(() => {
        this.$message({
          message: this.$t('权限排序成功'),
          type: 'success',
          duration: 2 * 1000
        })
      })
    },
    handleAccess(index, row) {
      this.access.id = row.id
      this.access.title = row.title
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
            name: this.$t('状态'),
            content: data.status + "",
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
    handleTree() {
      this.$router.replace('/auth/group/tree')
    },
    changeStatus(e, data, index) {
      if (data.status == 1) {
        enableGroup(data.id).then(() => {
          this.$message({
            message: this.$t('权限启用成功'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disableGroup(data.id).then(() => {
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

        deleteGroup(row.id).then(() => {
          thiz.loading.delete = ''

          this.$message({
            message: this.$t('删除权限成功'),
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
