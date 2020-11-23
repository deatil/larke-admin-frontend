<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>扩展管理</span>
      </div>

      <div class="filter-container">
        <el-input v-model="listQuery.searchword" placeholder="请输入关键字" clearable style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
        
        <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px;margin-right: 10px;">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        
        <el-select v-model="listQuery.order" style="width: 140px;margin-right: 10px;" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        
        <el-button v-waves class="filter-item" style="margin-right: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
        
        <el-button class="filter-item" style="margin-right: 10px;" type="warning" icon="el-icon-folder" @click="handleLocalExtension">
          安装/更新
        </el-button>        
      </div>
 
      <el-table v-loading="listLoading" 
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :data="list" border fit highlight-current-row 
        style="width: 100%">
        <el-table-column width="150px" label="扩展">
          <template slot-scope="scope">

            <div style="margin-bottom:3px;">
                <span>{{ scope.row.name }}</span>            
            </div> 
                        
            <div>
              <el-tooltip effect="dark" content="当前扩展版本" placement="top">
                <el-tag type="primary" size="mini" style="margin-right:10px;">
                  v{{ scope.row.version }}
                </el-tag>
              </el-tooltip>

              <el-tooltip effect="dark" content="当前扩展适配系统版本" placement="top">
                <el-tag type="info" size="mini" style="margin-right:10px;">
                  <i class="el-icon-goblet-square-full" />&nbsp;
                  <span>{{ scope.row.adaptation }}</span>  
                </el-tag>  
              </el-tooltip>           
            </div>           
                     
          </template>
        </el-table-column>

        <el-table-column min-width="100px" label="简介">
          <template slot-scope="scope">
            <div style="margin-bottom:3px;">
              <span>{{ scope.row.introduce }}</span>  
            </div> 

            <div>    
              <el-tag type="primary" size="mini" style="margin-right:10px;">
                <i class="el-icon-user" />&nbsp;
                <span>{{ scope.row.author }}</span>  
              </el-tag>    

              <el-tag v-if="scope.row.authoremail" type="info" size="mini" style="margin-right:10px;">
                <i class="el-icon-message" />&nbsp;
                <span>{{ scope.row.authoremail }}</span>  
              </el-tag>                     
            </div>              
          </template>
        </el-table-column>       

        <el-table-column width="160px" align="center" label="安装时间">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status" 
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1" 
              :inactive-value="0"
              @change="changeStatus($event, scope.row, scope.$index)"
              ></el-switch>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="320">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-info" @click="handleDetail(scope.$index, scope.row)">
              详情
            </el-button>

            <el-button v-if="JSON.parse(scope.row.config)" type="info" size="mini" icon="el-icon-edit" @click="handleConfig(scope.$index, scope.row)">
              配置
            </el-button>

            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleUninstall(scope.$index, scope.row)">
              卸载
            </el-button>         
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>

    <el-dialog title="扩展详情" 
      append-to-body
      :visible.sync="detail.dialogVisible">
      <detail :data="detail.data" />
    </el-dialog>  

    <el-dialog title="本地扩展" 
      append-to-body
      v-if="local.dialogVisible"
      :visible.sync="local.dialogVisible">
      <local :item="local" />
    </el-dialog>          
  </div>
</template>

<script>
import md5 from 'js-md5'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Detail from '@/components/Larke/Detail'
import Local from './components/Local'
import { 
  getList, 
  uninstall, 
  updateConfig, 
  enable, 
  disable
} from '@/api/extension'

export default {
  name: 'ExtensionIndex',
  components: { Pagination, Detail, Local },
  directives: { waves },
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
        { key: 'open', display_name: '启用' },
        { key: 'close', display_name: '禁用' },
      ],
      sortOptions: [
        { label: '正序', key: 'ASC' }, 
        { label: '倒叙', key: 'DESC' }
      ],        
      detail: {
        dialogVisible: false,
        data: [],
      },  
      local: {
        dialogVisible: false,
      },         
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    handleDetail(index, row) {    
      this.detail.dialogVisible = true
      const data = row

      this.detail.data = [
        {
          name: '扩展',
          content: data.name,
          type: 'text',
        },          
        {
          name: '扩展名称',
          content: data.title,
          type: 'text',
        },
        {
          name: '当前版本',
          content: data.version,
          type: 'text',
        }, 
        {
          name: '适配系统版本',
          content: data.adaptation,
          type: 'text',
        },                  
        {
          name: '描述',
          content: data.introduce,
          type: 'text',
        },  
        {
          name: '作者',
          content: data.author,
          type: 'text',
        },           
        {
          name: '作者邮箱',
          content: data.authoremail,
          type: 'text',
        },  
        {
          name: '作者网站',
          content: data.authorsite,
          type: 'text',
        },                              
        {
          name: '依赖扩展',
          content: data.require_extension,
          type: 'text',
        },
        {
          name: '扩展绑定类',
          content: data.class_name,
          type: 'text',
        },

        {
          name: '安装时间',
          content: data.installtime,
          type: 'time',
        },   
        {
          name: '最后更新',
          content: data.upgradetime,
          type: 'time',
        },   

        {
          name: '排序',
          content: data.listorder,
          type: 'text',
        },  
        {
          name: '激活状态',
          content: data.status,
          type: 'boolen',
        },                  
      ]
      
    },
    changeStatus(e, data, index) {
      if (data.status == 1) {
        enable(data.name).then(() => {
          this.$message({
            message: '扩展启用成功',
            type: 'success',
            duration: 2 * 1000,
          })
        })    
      } else {
        disable(data.name).then(() => {
          this.$message({
            message: '扩展禁用成功',
            type: 'success',
            duration: 2 * 1000,
          })
        })   
      }
    },
    handleUninstall(index, row) {
      const thiz = this
      this.$confirm('确认要卸载该扩展吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: '扩展卸载中...',
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        uninstall(row.name).then(() => {
          loading.close()

          this.$message({
            message: '卸载扩展成功',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              thiz.list.splice(index, 1)
            }
          })
        })
      }).catch(() => {

      })
    },
    handleConfig() {

    },
    handleLocalExtension() {
      this.local.dialogVisible = true
    },

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
