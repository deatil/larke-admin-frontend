<template>
  <el-table v-loading="listLoading" 
    :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    :data="list" border fit highlight-current-row 
    style="width: 100%">
    <el-table-column width="220px" label="扩展">
      <template slot-scope="scope">

        <div style="margin-bottom:3px;">
            <span>{{ scope.row.name }}</span>            
        </div> 
                    
        <div>
          <template v-if="scope.row.upgrade == 1">
            <el-tooltip effect="dark" content="当前扩展版本" placement="top">
              <el-tag type="primary" size="mini" style="margin-right:10px;">
                v{{ scope.row.install.version }}
              </el-tag>
            </el-tooltip>

            <el-tooltip effect="dark" content="当前扩展更新版本" placement="top">
              <el-tag type="danger" size="mini" style="margin-right:10px;"> 
                up{{ scope.row.version }}
              </el-tag>
            </el-tooltip>
          </template>

          <template v-else>
            <el-tooltip effect="dark" content="当前扩展版本" placement="top">
              <el-tag type="primary" size="mini" style="margin-right:10px;">
                v{{ scope.row.version }}
              </el-tag>
            </el-tooltip>
          </template>  

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

    <el-table-column align="left" label="操作" width="150">
      <template slot-scope="scope">
        <el-button v-if="scope.row.install.length == 0" type="primary" size="mini" @click="handleInstall(scope.$index, scope.row)">
          安装
        </el-button>

        <el-button v-if="scope.row.upgrade == 1" type="warning" size="mini" @click="handleUpgrade(scope.$index, scope.row)">
          更新
        </el-button>                  
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { 
  getLocalList, 
  install,
  upgrade
} from '@/api/extension'

export default {
  name: 'ExtensionLocal',
  components: {  }, 
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },   
  data() {   
    return {
      list: null,
      total: 0,
      listLoading: true,
    }
  },  
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLocalList().then(response => {
        this.list = Object.values(response.data.list)
        this.listLoading = false
      })
    }, 
    handleInstall(index, row) {
      const thiz = this
      this.$confirm('确认要安装该扩展(' + row.name + ')吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: '扩展安装中...',
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        install(row.name).then(() => {
          loading.close()

          this.$message({
            message: '安装扩展成功',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              thiz.item.dialogVisible = false
            }
          })
        })
      }).catch(() => {

      })
    },  
    handleUpgrade(index, row) {
      const thiz = this
      this.$confirm('确认要更新该扩展(' + row.name + ')吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: '扩展更新中...',
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        upgrade(row.name).then(() => {
          loading.close()
          
          this.$message({
            message: '更新扩展成功',
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              thiz.item.dialogVisible = false
            }
          })
        })
      }).catch(() => {

      })
    }  
  }
}
</script>
