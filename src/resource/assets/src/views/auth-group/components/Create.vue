<template>
  <el-form ref="authGroupForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item label="父级权限" prop="parentid">
      <el-select
        v-model="data.parentid"
        placeholder="请选择"
        clearable
        filterable
        :filter-method="parentFilter"
        @change="parentidChange"
      >
        <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item label="名称" prop="title">
      <el-input v-model.trim="data.title" placeholder="请填写权限名称" />
    </el-form-item>

    <el-form-item label="权限描述" prop="description">
      <el-input v-model.trim="data.description" type="textarea" rows="6" placeholder="请填写权限描述" />
    </el-form-item>

    <el-form-item label="排序" prop="listorder">
      <el-input v-model.trim="data.listorder" placeholder="请填写排序" />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  getGroupChildrenList,
  createGroup
} from '@/api/authGroup'

export default {
  name: 'AuthGroupCreate',
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
      rules: {
        parentid: [
          { required: true, message: '父级权限不能为空', trigger: 'change' }
        ],
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      },
      data: {
        parentid: '',
        title: '',
        description: '',
        listorder: 100,
        status: 1
      },
      parentOptions: [
        { key: '0', display_name: '顶级权限' }
      ],
      parentFilterOptions: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const all = new Promise((resolve, reject) => {
        getGroupChildrenList({
          id: 0,
          type: 'list'
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })

      Promise.all([all])
        .then(([all]) => {
          all.list.forEach(item => {
            this.parentOptions.push({
              key: item.id,
              display_name: item.spacer + ' ' + item.title
            })
          })

          this.parentFilterOptions = this.parentOptions
        })
        .catch(() => {

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
      }
    },
    submit() {
      const thiz = this

      this.$refs.authGroupForm.validate(valid => {
        if (!valid) {
          return false
        }

        createGroup(this.data).then(response => {
          this.$message({
            message: '添加权限成功',
            type: 'success',
            duration: 2 * 1000,
            onClose() {
              if (thiz.$refs.authGroupForm !== undefined) {
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
