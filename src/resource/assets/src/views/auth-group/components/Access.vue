<template>
  <el-form :model="data" label-width="100px" ref="form">
    <el-form-item label="用户组名称" prop="title">
      <el-input v-model.trim="title" readonly />
    </el-form-item>   

    <el-form-item label="权限路由" prop="access">
      <el-tree 
        ref="tree"
        :props="props"
        :data="list"
        show-checkbox
        node-key="id"
        @check-change="treeCheck"
        style="padding-top: 5px;"
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
      title: '',     
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
  watch: {
    item: {
      handler(val, oldVal) {
        if (this.item.dialogVisible == true) {
          this.id = val.id
          this.featchData()
        }
      },
      deep: true
    }
  },  
  created() {
    const id = this.item.id
    this.id = id
    this.title = this.item.title

    this.featchData()
  },
  methods: { 
    featchData() {
      this.fetchRules().then(() => {
        getGroupDetail(this.id).then(response => {
          const rule_accesses = response.data.rule_accesses
          this.data.access = rule_accesses.join(',')

          const thiz = this
          if (rule_accesses.length > 0) {
            rule_accesses.forEach((i, n) => {        
              const node = thiz.$refs.tree.getNode(i)
              if (node['isLeaf']) {
                thiz.$refs.tree.setChecked(node, true)
              }
            });
          }

        }).catch(err => {
          console.log(err)
        })      
      })
    },
    fetchRules() {
      return new Promise((resolve, reject) => {
        getRuleTreeList().then((res) => {
          this.list = res.data.list
        })

        resolve()
      })
    },
    treeCheck() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const HalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()

      this.checkedids = checkedKeys.concat(HalfCheckedKeys).join(',')
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
