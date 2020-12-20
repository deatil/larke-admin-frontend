<template>
  <el-form ref="form" :model="data" label-width="100px">
    <el-form-item label="管理员账号" prop="name">
      <el-input v-model.trim="name" readonly />
    </el-form-item>

    <el-form-item label="用户组" prop="access">
      <el-tree
        ref="tree"
        :props="props"
        :data="list"
        show-checkbox
        node-key="id"
        style="padding-top: 5px;"
        :highlight-current="true"
        :default-expand-all="false"
        :expand-on-click-node="false"
        @check-change="treeCheck"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  getDetail as getAdminDetail,
  updateAccess as updateAdminAccess
} from '@/api/admin'
import { getGroupTreeList } from '@/api/authGroup'

export default {
  name: 'AdminAccess',
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
      name: '',
      data: {
        access: ''
      },
      props: {
        label: 'title'
      },
      list: [],
      checkedids: ''
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

    this.name = this.item.name

    this.featchData()
  },
  methods: {
    featchData() {
      Promise.resolve().then(() => {
        return this.fetchGroups()
      }).then(() => {
        return this.fetchAdminDetail()
      })
    },
    fetchAdminDetail() {
      const thiz = this

      return new Promise((resolve, reject) => {
        getAdminDetail(this.id).then(response => {
          const groups = response.data.groups

          if (groups.length > 0) {
            groups.forEach(item => {
              const node = thiz.$refs.tree.getNode(item.id)
              if (node['isLeaf']) {
                thiz.$refs.tree.setChecked(node, true)
              }
            })
          }

          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    fetchGroups() {
      return new Promise((resolve, reject) => {
        getGroupTreeList().then((res) => {
          this.list = res.data.list

          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    treeCheck() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const HalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()

      this.checkedids = checkedKeys.concat(HalfCheckedKeys).join(',')
    },
    submit() {
      const thiz = this
      updateAdminAccess(this.id, {
        access: this.checkedids
      }).then(response => {
        this.$message({
          message: '账号授权成功',
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
