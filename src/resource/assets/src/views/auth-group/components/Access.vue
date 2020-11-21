<template>
  <el-form :model="data" label-width="100px" ref="form">
    <el-form-item label="权限路由" prop="access">
      <el-tree 
        ref="tree"
        :props="props"
        :data="list"
        show-checkbox
        node-key="id"
        @check-change="treeCheck"
        :default-expand-all="false"
        :expand-on-click-node="false">
      </el-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getGroupDetail, updateGroupAccess } from '@/api/authGroup'
import { getRuleTreeList } from '@/api/authRule'

export default {
  name: 'AuthGroupAccess',
  components: { },
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
      id: '',      
      data: {
        access: '',
      },
      props: {
        label: 'title'
      },
      list: [], 
      checkedids: '', 
    }
  },
  created() {
    const id = this.item.id
    this.id = id

    this.fetchRules().then(() => {
      getGroupDetail(this.id).then(response => {
        this.data.access = response.data.rule_accesses.join(',')
        this.$refs.tree.setCheckedKeys(response.data.rule_accesses) 
      }).catch(err => {
        console.log(err)
      })      
    })
  },
  methods: {  
    fetchRules() {
      return new Promise((resolve, reject) => {
        getRuleTreeList().then((res) => {
          this.list = res.data.list
        })

        resolve()
      })
    },
    treeCheck() {
      this.checkedids = this.$refs.tree.getCheckedKeys(true).toString()
    },
    submit() {
      const thiz = this
      updateGroupAccess(this.id, {
        access: this.checkedids
      }).then(response => {
        this.$message({
          message: '用户组授权成功',
          type: 'success',
          duration: 2 * 1000,
          onClose() {
            if (thiz.$refs.form !== undefined) {
              thiz.$refs.form.resetFields()
            }
            thiz.item.dialogVisible = false
          }
        })
      })
    }
  }
}
</script>
