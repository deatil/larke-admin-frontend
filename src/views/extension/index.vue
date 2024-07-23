<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('extension.search_title') }}</span>
      </div>

      <div class="filter-container">
        <el-input 
          v-model="listQuery.searchword" 
          :placeholder="$t('extension.search_searchword')" 
          clearable 
          style="width: 200px;margin-right: 10px;" 
          class="filter-item" 
          @keyup.enter.native="handleFilter" />

        <el-select 
          v-model="listQuery.status" 
          :placeholder="$t('extension.search_status')" 
          clearable 
          class="filter-item" 
          style="width: 130px;margin-right: 10px;">
          <el-option 
            v-for="item in statusOptions" 
            :key="item.key" 
            :label="item.display_name" 
            :value="item.key" />
        </el-select>

        <el-select 
          v-model="listQuery.order" 
          style="width: 140px;margin-right: 10px;" 
          class="filter-item" 
          @change="handleFilter">
          <el-option 
            v-for="item in sortOptions" 
            :key="item.key" 
            :label="item.label" 
            :value="item.key" />
        </el-select>

        <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('extension.search_btn') }}
        </el-button>

        <el-upload
          class="filter-item" 
          style="margin-right: 10px;"
          action=""
          :on-change="onUploadChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button v-waves 
            :disabled="!checkPermission(['larke-admin.extension.upload'])" 
            slot="trigger" 
            :loading="uploadLoading" 
            type="primary" 
            icon="el-icon-upload">{{ $t('extension.search_upload') }}</el-button>
        </el-upload>        

        <el-button v-waves 
          :disabled="!checkPermission(['larke-admin.extension.local'])" 
          class="filter-item" 
          type="warning" 
          icon="el-icon-folder" 
          @click="handleLocalExtension">
          {{ $t('extension.search_install') }}
        </el-button>

        <el-button v-waves 
          :disabled="!checkPermission(['larke-admin.extension.refresh'])" 
          :loading="loading.refresh"
          class="filter-item" 
          type="danger" 
          icon="el-icon-refresh" 
          @click="handleRefresh">
          {{ $t('extension.search_refresh') }}
        </el-button> 
      </div>

      <el-table
        class="border-gray"
        v-loading="listLoading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column width="200px" :label="$t('extension.table_title')">
          <template slot-scope="scope">
            <div class="extension-box">
              <div class="extension-icon" @click="handleShowIcon(scope.$index, scope.row)">
                <img :src="scope.row.icon" style="width:90%;" />
              </div>
              
              <div class="extension-data">
                <div class="extension-title">
                  <span class="extension-title-icon" v-if="scope.row.homepage && scope.row.homepage != ''">
                    <a :href="scope.row.homepage" target="_blank" :title="scope.row.title">
                      <i class="el-icon-paperclip" />
                    </a>
                  </span>

                  <span>
                    {{ scope.row.title }}
                  </span>
                </div>

                <div class="extension-name">
                  <span>{{ scope.row.name }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" :label="$t('extension.table_description')">
          <template slot-scope="scope">
            <div class="extension-introduce">
              <span>{{ scope.row.description }}</span>
            </div>

            <div style="margin-top:3px;">
              <el-tooltip effect="dark" :content="$t('extension.table_adaptation')" placement="top">
                <el-tag type="info" size="mini" style="margin-right:10px;">
                  <i class="el-icon-goblet-square-full" />&nbsp;
                  <span>{{ scope.row.adaptation }}</span>
                </el-tag>
              </el-tooltip>

              <el-tooltip effect="dark" :content="$t('extension.table_version')" placement="top">
                <el-tag type="primary" size="mini" style="margin-right:10px;">
                  v{{ scope.row.version }}
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" :label="$t('extension.table_authors')">
          <template slot-scope="scope">
            <div v-for="item in scope.row.authorlist.slice(0, 1)" :key="item.name" class="extension-author">
              <div>
                <span style="margin-right:10px;">
                  <span v-if="item.homepage && item.homepage != ''">
                    <a :href="item.homepage" target="_blank" :title="item.name">
                      {{ item.name }}
                    </a>
                  </span>

                  <span v-else>
                    {{ item.name }}
                  </span>
                </span>
              </div>

              <div>
                <el-tag v-if="item.email" type="info" size="mini" style="margin-right:10px;">
                  <i class="el-icon-message" />
                  &nbsp;
                  <span>{{ item.email }}</span>
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column width="75px" align="center" :label="$t('extension.table_listorder')">
          <template slot-scope="{row, $index}">
            <div @click.stop="{{ editableChangeBtn($index, 'editListorderInput') }}">
              <el-input
                v-if="sort.editable[$index]"
                v-model="row.listorder"
                size="mini"
                class="editListorderInput"
                :disabled="!checkPermission(['larke-admin.extension.listorder'])"
                @blur="editableChange($event, row, $index)"
              />
              <span v-else>{{ row.listorder }}</span>
            </div>
          </template>
        </el-table-column>        

        <el-table-column width="160px" align="left" :label="$t('extension.table_installtime')">
          <template slot-scope="scope">
            <div class="extension-installtime">
              <el-tooltip effect="dark" :content="$t('extension.table_installtime_tips')" placement="top">
                <span>
                  <i class="el-icon-time" />&nbsp;
                  {{ scope.row.installtime | parseTime('{y}-{m}-{d} {h}:{i}') }}
                </span>
              </el-tooltip>
            </div>

            <div
              v-if="scope.row.installtime < scope.row.upgradetime"
              class="extension-upgradetime"
              style="margin-top:3px;"
            >
              <el-tooltip effect="dark" :content="$t('extension.table_upgradetime')" placement="top">
                <span>
                  <i class="el-icon-refresh" />&nbsp;
                  {{ scope.row.upgradetime | parseTime('{y}-{m}-{d} {h}:{i}') }}
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('extension.table_status')" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="!checkPermission(['larke-admin.extension.enable']) || !checkPermission(['larke-admin.extension.disable'])"
              @change="changeStatus($event, scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column align="left" :label="$t('extension.table_actions')" width="200">
          <template slot-scope="scope">
            <div>
              <el-button 
                v-waves 
                :loading="scope.row.id == loading.detail"
                type="info" 
                size="mini" 
                icon="el-icon-info" 
                @click="handleDetail(scope.$index, scope.row)"
              >  
                {{ $t('extension.table_detail') }}
              </el-button>

              <el-button 
                v-waves 
                v-permission="['larke-admin.extension.uninstall']" 
                type="danger" 
                size="mini" 
                icon="el-icon-delete" 
                @click="handleUninstall(scope.$index, scope.row)"
              >                
                {{ $t('extension.table_uninstall') }}
              </el-button>
            </div>

            <div style="margin-top:5px;">
              <el-button 
                v-waves 
                :disabled="!checkPermission(['larke-admin.extension.config'])" 
                v-if="scope.row.config != '[]'" 
                type="primary" 
                size="mini" 
                icon="el-icon-edit" 
                @click="handleConfig(scope.$index, scope.row)"
              >
                {{ $t('extension.table_config') }}
              </el-button>

              <el-button 
                v-waves 
                v-permission="['larke-admin.extension.command']" 
                type="warning" 
                size="mini" 
                icon="el-icon-cpu" 
                @click="handleCommand(scope.$index, scope.row)"
              >
                {{ $t('extension.table_command') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog 
      :visible.sync="icon.dialogVisible" 
      :title="icon.title">
      <img :src="icon.img" class="extension-icon-img">
    </el-dialog>

    <el-dialog
      :title="$t('extension.dialog_detail')"
      append-to-body
      :visible.sync="detail.dialogVisible"
    >
      <detail :data="detail.data" />
    </el-dialog>

    <el-dialog
      v-if="setting.dialogVisible"
      :title="$t('extension.dialog_setting')"
      append-to-body
      :visible.sync="setting.dialogVisible"
    >
      <setting :item="setting" @pushConfig="pushConfig" />
    </el-dialog>

    <el-dialog
      v-if="command.dialogVisible"
      :title="$t('extension.dialog_command')"
      append-to-body
      :visible.sync="command.dialogVisible"
    >
      <command :item="command" />
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
import LangSelect from '@/components/LangSelect'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BackToTop from '@/components/BackToTop'

import Detail from '@/components/Larke/Detail'
import Setting from './components/Setting'
import Command from './components/Command'
import {
  getList,
  refreshLocal,
  upload,
  uninstall,
  updateConfig,
  updateSort,
  enable,
  disable
} from '@/api/extension'

export default {
  name: 'ExtensionIndex',
  components: { 
    BackToTop, 
    LangSelect, 
    Pagination, 
    Detail, 
    Setting, 
    Command 
  },
  directives: { 
    waves, 
    permission 
  },
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
        order: 'listorder__DESC',
        status: '',
        page: 1,
        limit: 10
      },
      statusOptions: [
        { key: 'open', display_name: this.$t('extension.search_status_enable') },
        { key: 'close', display_name: this.$t('extension.search_status_disable') }
      ],
      sortOptions: [
        { key: 'create_time__ASC', label: this.$t('extension.search_sort_asc') },
        { key: 'create_time__DESC', label: this.$t('extension.search_sort_desc') },
        { key: 'listorder__ASC', label: this.$t('extension.search_order_asc') },
        { key: 'listorder__DESC', label: this.$t('extension.search_order_desc') },
      ],
      uploadLoading: false,
      uploadFile: null,
      icon: {
        title: '',
        img: '',
        dialogVisible: false
      },
      detail: {
        dialogVisible: false,
        data: []
      },
      sort: {
        editable: [],
        editableItem: {},
        editableOldSort: 0,    
      },
      setting: {
        dialogVisible: false,
        index: null,
        name: '',
        data: [],
        config: {}
      },
      command: {
        dialogVisible: false,
        name: '',
        title: ''
      },
      loading: {
        detail: '',
        refresh: false,
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
    pushConfig(conf) {
      const data = JSON.parse(conf)
      const index = this.setting.index

      if (index) {
        this.list[index].config_datas = data
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleRefresh() {
      const thiz = this
      this.confirmTip(thiz.$t('extension.confirm_refresh'), function() {
        thiz.loading.refresh = true

        refreshLocal().then(response => {
          thiz.successTip(thiz.$t('extension.confirm_refresh_success'), function() {
            thiz.listQuery.page = 1
            thiz.getList()

            thiz.loading.refresh = false
          });
        })
      })
    },
    onUploadChange(file) {
      this.uploadLoading = true

      const isZip = (file.raw.type === 'application/x-zip-compressed');

      if (!isZip) {
        this.uploadLoading = false
        this.$message.error(this.$t('extension.confirm_upload_error'));
        return false;
      }

      const formData = new FormData()
      formData.append('file', file.raw) 

      this.uploadFile = file.raw
      
      const thiz = this
      upload(formData).then(response => {
        thiz.successTip(thiz.$t('extension.confirm_upload_success'))

        thiz.uploadLoading = false
        thiz.uploadFile = null
      }).catch(err => {
        thiz.uploadLoading = false

        if (err.code == 411) {
          thiz.confirmTip(thiz.$t('extension.confirm_upload_force', {
            "message": err.message,
          }), function() {
            thiz.reUpload()
          })
        }
      })
    }, 
    reUpload() {
      const formData = new FormData()
      formData.append('file', this.uploadFile) 
      formData.append('force', 1) 

      upload(formData).then(response => {
        this.successTip(this.$t('extension.confirm_upload_success'))

        this.uploadFile = null
      })
    },
    handleShowIcon(index, row) {
      this.icon.title = row.title
      this.icon.img = row.icon
      this.icon.dialogVisible = true
    },
    editableChangeBtn(index, className) {
      this.sort.editable = new Array(this.list.length)

      this.sort.editable[index] = true

      this.sort.editableItem = this.list[index]

      this.$set(this.sort.editable, index, true)

      this.$nextTick(function() {
        var editInputList = document.getElementsByClassName(className)
        editInputList[0].children[0].focus()
      })
    },
    editableChange(e, data, index) {
      this.sort.editable[index] = false

      if (this.sort.editableOldSort == data.listorder) {
        return
      }

      this.sort.editableOldSort = data.listorder

      updateSort(data.name, data.listorder).then(() => {
        this.$message({
          message: this.$t('extension.confirm_sort_success'),
          type: 'success',
          duration: 2 * 1000
        })
      })
    },    
    handleDetail(index, row) {
      this.loading.detail = row.id

      this.detail.dialogVisible = true
      const data = row

      this.detail.data = [
        {
          name: this.$t('extension.detail_name'),
          content: data.name,
          type: 'text'
        },
        {
          name: this.$t('extension.detail_title'),
          content: data.title,
          type: 'text'
        },
        {
          name: this.$t('extension.detail_version'),
          content: data.version,
          type: 'text'
        },
        {
          name: this.$t('extension.detail_adaptation'),
          content: data.adaptation,
          type: 'text'
        },
        {
          name: this.$t('extension.detail_description'),
          content: data.description,
          type: 'text'
        },
        {
          name: this.$t('extension.detail_keywordlist'),
          content: data.keywordlist,
          type: 'json',
          depth: 2
        },    
        {
          name: this.$t('extension.detail_homepage'),
          content: data.homepage,
          type: 'text'
        },              
        {
          name: this.$t('extension.detail_authorlist'),
          content: data.authorlist,
          type: 'json',
          depth: 3
        },      
        {
          name: this.$t('extension.detail_requires'),
          content: data.requires,
          type: 'json',
          depth: 3
        },
        {
          name: this.$t('extension.detail_class_name'),
          content: data.class_name,
          type: 'text'
        },

        {
          name: this.$t('extension.detail_installtime'),
          content: data.installtime,
          type: 'time'
        },
        {
          name: this.$t('extension.detail_upgradetime'),
          content: data.upgradetime,
          type: 'time'
        },

        {
          name: this.$t('extension.detail_listorder'),
          content: data.listorder,
          type: 'text'
        },
        {
          name: this.$t('extension.detail_status'),
          content: data.status + "",
          type: 'boolen'
        }
      ]

      this.loading.detail = ''
    },
    changeStatus(e, data, index) {
      if (data.status == 1) {
        enable(data.name).then(() => {
          this.$message({
            message: this.$t('extension.enable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disable(data.name).then(() => {
          this.$message({
            message: this.$t('extension.disable_success'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleUninstall(index, row) {
      const thiz = this
      this.$confirm(this.$t('extension.confirm_uninstall'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: this.$t('extension.confirm_uninstalling'),
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        uninstall(row.name).then(() => {
          thiz.list.splice(index, 1)

          loading.close()

          this.$message({
            message: this.$t('extension.confirm_uninstall_success'),
            type: 'success',
            duration: 2 * 1000
          })
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {

      })
    },
    handleLocalExtension() {
      this.$router.replace('/extension/local')
    },
    handleConfig(index, row) {
      this.setting.dialogVisible = true
      this.setting.index = index
      this.setting.name = row.name
      this.setting.data = row.configs
      this.setting.config = row.config_datas
    },
    handleCommand(index, row) {
      this.command.dialogVisible = true
      this.command.name = row.name
      this.command.title = row.title
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
.extension-title a:hover {
  color: #1b4fb7;
}
.extension-name {
  color: #909399;
  font-size: 13px;
}
.extension-upgradetime {
  color: #909399;
}
.extension-box {
  position: relative;
  min-height: 55px;
}
.extension-icon {
  display: block;
  width: 51px;  
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
}
.extension-icon-img {
  display: block;
  margin: 0 auto;
  width: 65%;
}
.extension-data {
  padding-left: 60px;
}
</style>
