<template>
  <el-form v-loading="detailLoading" ref="form" :model="data" label-width="100px">
    <el-form-item :label="$t('auth_group.access_title')" prop="title">
      <el-input v-model.trim="title" readonly />
    </el-form-item>

    <el-form-item :label="$t('auth_group.access_rules')" prop="access">
      <el-checkbox
        v-model="checked"
        @change="checkedAll"
      >{{ $t('auth_group.access_select_all') }}</el-checkbox>

      <el-tree
        ref="tree"
        class="admin-access"
        :props="props"
        :data="list"
        show-checkbox
        node-key="id"
        :highlight-current="true"
        :default-expand-all="false"
        :expand-on-click-node="false"
        @check-change="treeCheck"
      >
        <template slot-scope="scope">
          <span class="rule-title" :title="scope.data.title">
            {{ scope.data.title }}【{{ scope.data.method }}】
          </span>
        </template>
      </el-tree>

      <div class="text-grey">         
        {{ $t('auth_group.access_tips') }}
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('auth_group.access_save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getPropertyCount } from '@/utils/index'
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
      detailLoading: false,
      loading: false,
      id: '',
      title: '',
      checked: false,
      data: {
        access: ''
      },
      props: {
        label: 'title'
      },
      list: [],
      listIds: [],
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

    this.featchData()
  },
  methods: {
    async featchData() {
      this.detailLoading = true

      await this.fetchRules()
      await this.fetchGroupDetail()
    },
    fetchGroupDetail() {
      const thiz = this

      return getGroupDetail(this.id).then(response => {
        const rule_accesses = response.data.rule_accesses
        this.data.access = rule_accesses.join(',')
        this.title = response.data.title

        this.detailLoading = false

        if (rule_accesses.length > 0) {
          rule_accesses.forEach((i, n) => {
            const node = thiz.$refs.tree.getNode(i)
            if (node['isLeaf']) {
              thiz.$refs.tree.setChecked(node, true)
            }
          })
        }
      })
    },
    fetchRules() {
      return getRuleTreeList().then((res) => {
        this.list = res.data.list
      })
    },
    treeCheck() {
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const HalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()

      this.checkedids = checkedKeys.concat(HalfCheckedKeys).join(',')

      // 获取列表全部id
      this.listIds = []
      this.getListIds(this.list)

      if (this.listIds.sort().toString() != this.checkedids.split(',').sort().toString()) {
        this.checked = false
      } else {
        this.checked = true
      }
    },
    checkedAll() {
      if (this.checked) {
        this.$refs.tree.setCheckedNodes(this.list)
      } else {
        this.$refs.tree.setCheckedNodes([])
      }
    },
    getListIds(list) {
      const thiz = this
      if (getPropertyCount(list) > 0) {
        list.forEach(function(item) {
          thiz.listIds.push(item.id)

          if (getPropertyCount(item.children) > 0) {
            thiz.getListIds(item.children)
          }
        })
      }
    },
    submit() {
      const thiz = this

      this.loading = true

      updateGroupAccess(this.id, {
        access: this.checkedids
      }).then(response => {
        thiz.loading = false

        this.$message({
          message: this.$t('auth_group.access_save_success'),
          type: 'success',
          duration: 2 * 1000,
          onClose() {
            if (thiz.$refs.form !== undefined) {
              thiz.$refs.form.resetFields()
            }
            thiz.item.dialogVisible = false
          }
        })
      }).catch(err => {
        thiz.loading = false
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