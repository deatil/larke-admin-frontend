<template>
  <el-form ref="form" :model="data" label-width="100px">
    <el-form-item :label="$t('管理员账号')" prop="name">
      <el-input v-model.trim="name" readonly />
    </el-form-item>

    <el-form-item :label="$t('分组')" prop="access">
      <el-tree
        ref="tree"
        class="admin-access"
        :props="props"
        :data="list"
        show-checkbox
        node-key="id"
        :highlight-current="true"
        :default-expand-all="true"
        :expand-on-click-node="false"
        :check-strictly="true"
        @check-change="treeCheck"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
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
    async featchData() {
      await this.fetchGroups()

      await this.fetchAdminDetail()
    },
    fetchAdminDetail() {
      const thiz = this

      return getAdminDetail(this.id).then(response => {
        const groups = response.data.groups

        if (groups.length > 0) {
          groups.forEach(item => {
            const node = thiz.$refs.tree.getNode(item.id)
            thiz.$refs.tree.setChecked(node, true)
          })
        }
      })
    },
    fetchGroups() {
      return getGroupTreeList().then((res) => {
        this.list = res.data.list
      })
    },
    treeCheck() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()

      this.checkedids = checkedKeys.join(',')
    },
    submit() {
      const thiz = this
      updateAdminAccess(this.id, {
        access: this.checkedids
      }).then(response => {
        this.$message({
          message: this.$t('账号授权成功'),
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

<style scoped>
.admin-access {
  background-color: #FFFFFF;
  background-image: none;
  border-radius: 5px;
  border: 1px solid #DCDFE6;
  padding: 8px 5px;
}
</style>