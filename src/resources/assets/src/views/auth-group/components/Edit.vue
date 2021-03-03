<template>
  <el-form ref="authGroupForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('父级')" prop="parentid">
      <el-select
        v-model="data.parentid"
        :placeholder="$t('请选择')"
        clearable
        filterable
        :filter-method="parentFilter"
        @change="parentidChange"
      >
        <el-option 
          v-for="item in parentOptions" 
          :key="item.key" 
          :label="item.display_name | entityToString" 
          :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('名称')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('请填写分组名称')" />
    </el-form-item>
    <el-form-item :label="$t('描述')" prop="description">
      <el-input 
        v-model.trim="data.description" 
        type="textarea" 
        rows="6" 
        :placeholder="$t('请填写分组描述')" />
    </el-form-item>
    <el-form-item :label="$t('排序')" prop="listorder">
      <el-input v-model.trim="data.listorder" :placeholder="$t('请填写排序')" />
    </el-form-item>
    <el-form-item :label="$t('状态')" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">{{ $t('启用') }}</el-radio>
        <el-radio :label="0">{{ $t('禁用') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  getGroupDetail,
  getGroupChildrenList,
  updateGroup
} from '@/api/authGroup'

export default {
  name: 'AuthGroupEdit',
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
      all: [],
      chilren: [],
      id: '',
      parentid: '',
      data: {
        parentid: '',
        title: '',
        description: '',
        listorder: 100,
        status: 1
      },
      rules: {
        parentid: [
          { required: true, message: this.$t('父级分组不能为空'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('名称不能为空'), trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: this.$t('排序不能为空'), trigger: 'blur' }
        ]
      },
      parentOptions: [
        { key: '0', display_name: this.$t('顶级分组') }
      ],
      parentFilterOptions: []
    }
  },
  watch: {
    item: {
      handler(val, oldVal) {
        if (this.item.dialogVisible == true &&
          this.id != val.id
        ) {
          this.id = val.id
          this.initData()
        }
      },
      deep: true
    }
  },
  created() {
    this.id = this.item.id
    this.initData()
  },
  methods: {
    async initData() {
      const all = await this.getAll()
      const children = await this.getChildren()

      this.all = all.data.list
      this.children = children.data.list

      this.fetchParents()
      this.fetchData(this.id)
    },
    getAll() {
      return getGroupChildrenList({
        id: 0,
        type: 'list'
      })
    },
    getChildren() {
      return getGroupChildrenList({
        id: this.id,
        type: 'ids'
      })
    },
    fetchParents() {
      this.parentOptions = [
        { key: '0', display_name: this.$t('顶级分组') }
      ]
      this.parentFilterOptions = []

      this.children.push(this.id)
      this.all.forEach(item => {
        if (! this.children.includes(item.id)) {
          this.parentOptions.push({
            key: item.id,
            display_name: item.spacer + ' ' + item.title
          })
        }
      })

      this.parentFilterOptions = this.parentOptions
    },
    fetchData(id) {
      getGroupDetail(id).then(response => {
        this.parentid = response.data.parentid
        this.data = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    parentFilter(val) {
      this.data.parentid = val
      if (val) {
        this.parentOptions = this.parentFilterOptions.filter(item => {
          if (!!~item.display_name.indexOf(val) ||
            !!~item.display_name.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true
          }
        })
      } else {
        this.parentOptions = this.parentFilterOptions
      }
    },
    parentidChange(val) {
      if (val) {
        this.parentOptions = this.parentFilterOptions
        this.data.parentid = val
      }
    },
    submit() {
      const thiz = this

      this.$refs.authGroupForm.validate(valid => {
        if (!valid) {
          return false
        }

        updateGroup(this.id, {
          parentid: this.data.parentid,
          title: this.data.title,
          description: this.data.description,
          listorder: this.data.listorder,
          status: this.data.status
        }).then(response => {
          this.$message({
            message: this.$t('更新分组信息成功'),
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              if (thiz.$refs.authGroupForm !== undefined) {
                thiz.id = ''
                thiz.$refs.authGroupForm.resetFields()
              }
              thiz.item.dialogVisible = false
            }
          })
        })
      })
    }
  }
}
</script>
