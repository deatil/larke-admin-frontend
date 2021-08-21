<template>
  <div class="extension-container">
    <el-table
      v-loading="listLoading"
      class="border-gray"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" width="70px" label="Icon">
        <template slot-scope="scope">
          <div class="extension-icon" @click="handleShowIcon(scope.$index, scope.row)">
            <img :src="scope.row.icon" style="width:90%;" />
          </div>
        </template>
      </el-table-column>

      <el-table-column width="120px" :label="$t('扩展')">
        <template slot-scope="scope">

          <div class="extension-title">
            <span v-if="scope.row.homepage && scope.row.homepage != ''">
              <a :href="scope.row.homepage" target="_blank" :title="scope.row.title">
                {{ scope.row.title }}
              </a>
            </span>

            <span v-else>
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
          <div style="margin-bottom:3px;">
            <span>{{ scope.row.description }}</span>
          </div>

          <div>
            <el-tooltip effect="dark" :content="$t('当前扩展适配系统版本')" placement="top">
              <el-tag type="info" size="mini" style="margin-right:10px;">
                <i class="el-icon-goblet-square-full" />&nbsp;
                <span>{{ scope.row.adaptation }}</span>
              </el-tag>
            </el-tooltip>

            <template v-if="scope.row.upgrade == 1">
              <el-tooltip effect="dark" :content="$t('当前扩展版本')" placement="top">
                <el-tag type="primary" size="mini" style="margin-right:10px;">
                  v{{ scope.row.install.version }}
                </el-tag>
              </el-tooltip>

              <el-tooltip effect="dark" :content="$t('扩展可更新版本')" placement="top">
                <el-tag type="danger" size="mini" style="margin-right:10px;">
                  up{{ scope.row.version }}
                </el-tag>
              </el-tooltip>
            </template>

            <template v-else>
              <el-tooltip effect="dark" :content="$t('当前扩展版本')" placement="top">
                <el-tag type="primary" size="mini" style="margin-right:10px;">
                  v{{ scope.row.version }}
                </el-tag>
              </el-tooltip>
            </template>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" :label="$t('作者')">
        <template slot-scope="scope">
          <div v-for="item in scope.row.authors.slice(0, 1)" :key="item.name" class="extension-author">
            <div class="author-name">
              <span v-if="item.homepage && item.homepage != ''">
                <a :href="item.homepage" target="_blank" :title="item.name">
                  {{ item.name }}
                </a>
              </span>

              <span v-else>
                {{ item.name }}
              </span>
            </div>          

            <div class="author-email">
              <el-tag v-if="item.email" type="info" size="mini">
                <i class="el-icon-message" />&nbsp;
                <span>{{ item.email }}</span>
              </el-tag>
            </div>  
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('操作')" width="100">
        <template slot-scope="scope">
          <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.install'])" v-if="scope.row.install.length == 0" type="primary" size="mini" @click="handleInstall(scope.$index, scope.row)">
            {{ $t('安装') }}
          </el-button>

          <el-button v-waves :disabled="!checkPermission(['larke-admin.extension.upgrade'])" v-if="scope.row.upgrade == 1" type="warning" size="mini" @click="handleUpgrade(scope.$index, scope.row)">
            {{ $t('更新') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog 
      append-to-body
      :visible.sync="icon.dialogVisible" 
      :title="icon.title">
      <img :src="icon.img" class="extension-icon-img">
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import {
  getLocalList,
  install,
  upgrade
} from '@/api/extension'

export default {
  name: 'ExtensionLocal',
  components: { },
  directives: { waves, permission },
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
      icon: {
        title: '',
        img: '',
        dialogVisible: false
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      getLocalList().then(response => {
        this.list = Object.values(response.data.list)
        this.listLoading = false
      })
    },
    handleShowIcon(index, row) {
      this.icon.title = row.title
      this.icon.img = row.icon
      this.icon.dialogVisible = true
    },
    handleInstall(index, row) {
      const thiz = this
      this.$confirm(this.$t('确认要安装该扩展({name})吗？', {
        name: row.name
      }), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: this.$t('扩展安装中...'),
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        install(row.name).then(() => {
          this.$message({
            message: this.$t('安装扩展成功'),
            type: 'success',
            duration: 3 * 1000,
            onClose() {
              thiz.item.dialogVisible = false
            }
          })
        }).catch((err) => {

        })

        setTimeout(function() {
          loading.close()
        }, 3000)
      }).catch(() => {

      })
    },
    handleUpgrade(index, row) {
      const thiz = this
      this.$confirm(this.$t('确认要更新该扩展({name})吗？', {
        name: row.name
      }), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const loading = thiz.$loading({
          lock: true,
          text: this.$t('扩展更新中...'),
          spanner: '',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        upgrade(row.name).then((res) => {
          this.$message({
            message: this.$t('更新扩展成功'),
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              thiz.item.dialogVisible = false
            }
          })
        }).catch((err) => {

        })

        setTimeout(function() {
          loading.close()
        }, 3000)
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
.extension-title a:hover {
  color: #1b4fb7;
}
.extension-name {
  color: #909399;
  font-size: 13px;
  margin-bottom: 3px;
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
