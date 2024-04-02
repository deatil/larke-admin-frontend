<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('attachment.title') }}</span>
      </div>

      <div class="filter-container">
        <el-input v-model="listQuery.searchword" :placeholder="$t('attachment.search_keywords')" clearable style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.status" :placeholder="$t('attachment.search_status')" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.order" style="width: 140px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('attachment.search_btn') }}
        </el-button>
      </div>

      <el-table
        ref="logTable"
        v-loading="listLoading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="list"
        class="border-gray"
        fit
        highlight-current-row
        style="width: 100%"
      >

        <el-table-column min-width="150px" :label="$t('attachment.name')">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column width="110px" :label="$t('attachment.size')">
          <template slot-scope="{row}">
            <span>{{ row.size | renderSize }}</span>
          </template>
        </el-table-column>

        <el-table-column width="90px" :label="$t('attachment.type')">
          <template slot-scope="{row}">
            <span>{{ row.extension }}</span>
          </template>
        </el-table-column>

        <el-table-column width="170px" align="left" :label="$t('attachment.create_time')">
          <template slot-scope="scope">
            <span>
              <i class="el-icon-time" />&nbsp;
              {{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('attachment.status')" width="80">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter" size="mini">
              {{ (row.status == 1) ? $t('attachment.open') : $t('attachment.close') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('attachment.action')" width="280">
          <template slot-scope="scope">
            <el-button 
              v-waves
              :loading="scope.row.id == loading.detail"
              :disabled="!checkPermission(['larke-admin.attachment.detail'])" 
              type="info" 
              size="mini" 
              icon="el-icon-info" 
              @click="handleDetail(scope.$index, scope.row)"
            >
              {{ $t('attachment.detail') }}
            </el-button>

            <el-button 
              v-waves
              :disabled="!checkPermission(['larke-admin.attachment.download-code', 'larke-admin.attachment.download'])" 
              type="warning" 
              size="mini" 
              icon="el-icon-download" 
              @click="handleDownload(scope.row.id)"
            >
              {{ $t('attachment.download') }}
            </el-button>

            <el-button 
              v-waves
              :loading="scope.row.id == loading.delete"
              v-permission="['larke-admin.attachment.delete']" 
              type="danger" 
              size="mini" 
              icon="el-icon-delete" 
              @click="handleDelete(scope.$index, scope.row)"
            >
              {{ $t('attachment.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog :title="$t('attachment.attachment_detail')" :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>

    <el-tooltip placement="top" :content="$t('common.goto_top')">
      <back-to-top :custom-style="backToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime, renderSize } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import BackToTop from '@/components/BackToTop'

import Detail from '@/components/Larke/Detail'
import {
  getAttachmentList,
  getAttachmentDetail,
  deleteAttachment,
  enableAttachment,
  disableAttachment,
  getAttachmentDowncode,
  getAttachmentDownloadUrl
} from '@/api/attachment'

export default {
  name: 'AttachmentIndex',
  components: { BackToTop, Pagination, Detail },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
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
        status: '',
        page: 1,
        limit: 10
      },
      statusOptions: [
        { key: 'open', display_name: this.$t('attachment.search_open') },
        { key: 'close', display_name: this.$t('attachment.search_close') }
      ],
      sortOptions: [
        { key: 'create_time__ASC', label: this.$t('attachment.search_asc') },
        { key: 'create_time__DESC', label: this.$t('attachment.search_desc') }
      ],
      detail: {
        dialogVisible: false,
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
      getAttachmentList({
        searchword: this.listQuery.searchword,
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
    handleDetail(index, row) {
      this.loading.detail = row.id

      getAttachmentDetail(row.id).then((res) => {
        this.detail.dialogVisible = true
        const data = res.data

        this.loading.detail = ''

        this.detail.data = [
          {
            name: this.$t('attachment.detail_id'),
            content: data.id,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_belong'),
            content: data.belong_type + ' [ ' + data.belong_id + ' ]',
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_name'),
            content: data.name,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_path'),
            content: data.path,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_mime'),
            content: data.mime,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_type'),
            content: data.extension,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_size'),
            content: data.size,
            type: 'size'
          },
          {
            name: this.$t('attachment.detail_md5'),
            content: data.md5,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_sha1'),
            content: data.sha1,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_driver'),
            content: data.driver,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_url'),
            content: data.url,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_status'),
            content: data.status + "",
            type: 'boolen'
          },
          {
            name: this.$t('attachment.detail_update_time'),
            content: data.update_time,
            type: 'time'
          },
          {
            name: this.$t('attachment.detail_update_ip'),
            content: data.update_ip,
            type: 'text'
          },
          {
            name: this.$t('attachment.detail_create_time'),
            content: data.create_time,
            type: 'time'
          },
          {
            name: this.$t('attachment.detail_create_ip'),
            content: data.create_ip,
            type: 'text'
          }
        ]
      }).catch((err) => {
        this.loading.detail = ''
      })
    },
    handleDownload(id) {
      if (id == '') {
        this.$message({
          message: this.$t('attachment.download_tip'),
          type: 'error',
          duration: 3 * 1000
        })
        return
      }

      getAttachmentDowncode(id).then((res) => {
        const code = res.data.code
        const url = getAttachmentDownloadUrl(code)

        window.open(url, '_blank')
      })
    },
    handleDelete(index, row) {
      const thiz = this
      this.$confirm(this.$t('attachment.delete_tip_content'), this.$t('attachment.delete_tip_title'), {
        confirmButtonText: this.$t('attachment.delete_tip_ok'),
        cancelButtonText: this.$t('attachment.delete_tip_cancel'),
        type: 'warning'
      }).then(() => {
        thiz.loading.delete = row.id

        deleteAttachment(row.id).then(res => {
          thiz.loading.delete = ''

          this.$message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000,
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
