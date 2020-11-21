<template>
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
          <el-tag type="primary" size="mini" style="margin-right:10px;">
            v{{ scope.row.version }}
          </el-tag>

          <el-tag type="info" size="mini" style="margin-right:10px;">
            <i class="el-icon-goblet-square-full" />&nbsp;
            <span>{{ scope.row.adaptation }}</span>  
          </el-tag>                
        </div>           
                  
      </template>
    </el-table-column>

    <el-table-column min-width="100px" label="简介">
      <template slot-scope="{row}">
        <div style="margin-bottom:3px;">
          <span>{{ row.introduce }}</span>  
        </div> 

        <div>    
          <el-tag type="primary" size="mini" style="margin-right:10px;">
            <i class="el-icon-user" />&nbsp;
            <span>{{ row.author }}</span>  
          </el-tag>    

          <el-tag v-if="row.authoremail" type="info" size="mini" style="margin-right:10px;">
            <i class="el-icon-message" />&nbsp;
            <span>{{ row.authoremail }}</span>  
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
    handleInstall() {

    },
    handleUpgrade() {

    }
  }
}
</script>
