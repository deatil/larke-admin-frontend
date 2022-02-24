<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('扩展管理') }}</span>
      </div>

      <div class="filter-container">
        <el-input 
          v-model="listQuery.searchword" 
          :placeholder="$t('请输入关键字')" 
          clearable 
          style="width: 200px;margin-right: 10px;" 
          class="filter-item" 
          @keyup.enter.native="handleFilter" />

        <el-select 
          v-model="listQuery.status" 
          :placeholder="$t('状态')" 
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
          {{ $t('搜索') }}
        </el-button>

        <el-upload
          class="filter-item" 
          style="margin-right: 10px;"
          action=""
          :on-change="onUploadChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.upload'])" slot="trigger" :loading="uploadLoading" type="primary" icon="el-icon-upload">{{ $t('上传扩展') }}</el-button>
        </el-upload>        

        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.local'])" class="filter-item" type="warning" icon="el-icon-folder" @click="handleLocalExtension">
          {{ $t('安装/更新') }}
        </el-button>

        <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.refresh'])" class="filter-item" type="danger" icon="el-icon-refresh" @click="handleRefresh">
          {{ $t('刷新') }}
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
        <el-table-column align="center" width="70px" :label="$t('Icon')">
          <template slot-scope="scope">
            <div class="extension-icon" @click="handleShowIcon(scope.$index, scope.row)">
              <img :src="scope.row.icon" style="width:90%;" />
            </div>
          </template>
        </el-table-column>

        <el-table-column width="130px" :label="$t('扩展')">
          <template slot-scope="scope">
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
          </template>
        </el-table-column>

        <el-table-column min-width="100px" :label="$t('简介')">
          <template slot-scope="scope">
            <div class="extension-introduce">
              <span>{{ scope.row.description }}</span>
            </div>

            <div style="margin-top:3px;">
              <el-tooltip effect="dark" :content="$t('当前扩展适配系统版本')" placement="top">
                <el-tag type="info" size="mini" style="margin-right:10px;">
                  <i class="el-icon-goblet-square-full" />&nbsp;
                  <span>{{ scope.row.adaptation }}</span>
                </el-tag>
              </el-tooltip>

              <el-tooltip effect="dark" :content="$t('当前扩展版本')" placement="top">
                <el-tag type="primary" size="mini" style="margin-right:10px;">
                  v{{ scope.row.version }}
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" :label="$t('作者')">
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

        <el-table-column width="75px" align="center" :label="$t('排序')">
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

        <el-table-column width="160px" align="left" :label="$t('安装时间')">
          <template slot-scope="scope">
            <div class="extension-installtime">
              <el-tooltip effect="dark" :content="$t('扩展安装时间')" placement="top">
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
              <el-tooltip effect="dark" :content="$t('扩展最后更新时间')" placement="top">
                <span>
                  <i class="el-icon-refresh" />&nbsp;
                  {{ scope.row.upgradetime | parseTime('{y}-{m}-{d} {h}:{i}') }}
                </span>
              </el-tooltip>
            </div>
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
              :disabled="!checkPermission(['larke-admin.extension.enable']) || !checkPermission(['larke-admin.extension.disable'])"
              @change="changeStatus($event, scope.row, scope.$index)"
            />
          </template>
        </el-table-column>

        <el-table-column align="left" :label="$t('操作')" width="200">
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
                {{ $t('详情') }}
              </el-button>

              <el-button 
                v-waves 
                v-permission="['larke-admin.extension.uninstall']" 
                type="danger" 
                size="mini" 
                icon="el-icon-delete" 
                @click="handleUninstall(scope.$index, scope.row)"
              >                
                {{ $t('卸载') }}
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
                {{ $t('配置') }}
              </el-button>

              <el-button 
                v-waves 
                v-permission="['larke-admin.extension.command']" 
                type="warning" 
                size="mini" 
                icon="el-icon-cpu" 
                @click="handleCommand(scope.$index, scope.row)"
              >
                {{ $t('脚本') }}
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
      :title="$t('扩展详情')"
      append-to-body
      :visible.sync="detail.dialogVisible"
    >
      <detail :data="detail.data" />
    </el-dialog>

    <el-dialog
      v-if="local.dialogVisible"
      :title="$t('本地扩展')"
      append-to-body
      :visible.sync="local.dialogVisible"
    >
      <local :item="local" />
    </el-dialog>

    <el-dialog
      v-if="setting.dialogVisible"
      :title="$t('扩展设置')"
      append-to-body
      :visible.sync="setting.dialogVisible"
    >
      <setting :item="setting" />
    </el-dialog>

    <el-dialog
      v-if="command.dialogVisible"
      :title="$t('扩展脚本')"
      append-to-body
      :visible.sync="command.dialogVisible"
    >
      <command :item="command" />
    </el-dialog>
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
import Detail from '@/components/Larke/Detail'
import Local from './components/Local'
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
    LangSelect, 
    Pagination, 
    Detail, 
    Local, 
    Setting, 
    Command 
  },
  directives: { 
    waves, 
    permission 
  },
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
        { label: this.$t('正序'), key: 'ASC' },
        { label: this.$t('倒叙'), key: 'DESC' }
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
      local: {
        dialogVisible: false
      },
      sort: {
        editable: [],
        editableItem: {},
        editableOldSort: 0,    
      },
      setting: {
        dialogVisible: false,
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleRefresh() {
      const thiz = this
      this.confirmTip(thiz.$t('确认要刷新本地扩展缓存吗？'), function() {
        refreshLocal().then(response => {
          thiz.successTip(thiz.$t('刷新本地扩展缓存成功!'), function() {
            thiz.listQuery.page = 1
            thiz.getList()
          });
        })
      })
    },
    onUploadChange(file) {
      this.uploadLoading = true

      const isZip = (file.raw.type === 'application/x-zip-compressed');

      if (!isZip) {
        this.uploadLoading = false
        this.$message.error(this.$t('上传扩展只能是zip格式!'));
        return false;
      }

      const formData = new FormData()
      formData.append('file', file.raw) 

      this.uploadFile = file.raw
      
      const thiz = this
      upload(formData).then(response => {
        thiz.successTip(thiz.$t('扩展上传成功'))

        thiz.uploadLoading = false
        thiz.uploadFile = null
      }).catch(err => {
        thiz.uploadLoading = false

        if (err.code == 411) {
          thiz.confirmTip(thiz.$t('扩展已经存在，是否上传覆盖？', {
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
        this.successTip(this.$t('扩展上传成功'))

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
          message: this.$t('扩展排序更新成功'),
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
          name: this.$t('扩展包名'),
          content: data.name,
          type: 'text'
        },
        {
          name: this.$t('扩展名称'),
          content: data.title,
          type: 'text'
        },
        {
          name: this.$t('当前版本'),
          content: data.version,
          type: 'text'
        },
        {
          name: this.$t('适配系统版本'),
          content: data.adaptation,
          type: 'text'
        },
        {
          name: this.$t('描述'),
          content: data.description,
          type: 'text'
        },
        {
          name: this.$t('关键字'),
          content: data.keywordlist,
          type: 'json',
          depth: 2
        },    
        {
          name: this.$t('项目主页'),
          content: data.homepage,
          type: 'text'
        },              
        {
          name: this.$t('作者'),
          content: data.authorlist,
          type: 'json',
          depth: 3
        },      
        {
          name: this.$t('依赖扩展'),
          content: data.requires,
          type: 'json',
          depth: 3
        },
        {
          name: this.$t('扩展绑定类'),
          content: data.class_name,
          type: 'text'
        },

        {
          name: this.$t('安装时间'),
          content: data.installtime,
          type: 'time'
        },
        {
          name: this.$t('最后更新'),
          content: data.upgradetime,
          type: 'time'
        },

        {
          name: this.$t('排序'),
          content: data.listorder,
          type: 'text'
        },
        {
          name: this.$t('激活状态'),
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
            message: this.$t('扩展启用成功'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      } else {
        disable(data.name).then(() => {
          this.$message({
            message: this.$t('扩展禁用成功'),
            type: 'success',
            duration: 2 * 1000
          })
        })
      }
    },
    handleUninstall(index, row) {
      const thiz = this
      this.$confirm(this.$t('确认要卸载该扩展吗？'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: this.$t('扩展卸载中...'),
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        uninstall(row.name).then(() => {
          thiz.list.splice(index, 1)

          this.$message({
            message: this.$t('卸载扩展成功'),
            type: 'success',
            duration: 2 * 1000
          })
        }).catch(() => {

        })

        setTimeout(function() {
          loading.close()
        }, 3000)
      }).catch(() => {

      })
    },
    handleLocalExtension() {
      this.local.dialogVisible = true
    },
    handleConfig(index, row) {
      this.setting.dialogVisible = true
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
.extension-icon {
  display: block;
  margin: 0 auto;
  width: 100%;  
  cursor: pointer;
}
.extension-icon-img {
  display: block;
  margin: 0 auto;
  width: 65%;
}
</style>
