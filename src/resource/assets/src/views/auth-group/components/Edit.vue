<template>
  <el-form ref="authGroupForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item label="父级" prop="parentid">
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
      <el-input v-model.trim="data.title" placeholder="请填写分组名称" />
    </el-form-item>
    <el-form-item label="描述" prop="description">
      <el-input v-model.trim="data.description" type="textarea" rows="6" placeholder="请填写分组描述" />
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
          { required: true, message: '父级分组不能为空', trigger: 'change' }
        ],
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      },
      parentOptions: [
        { key: '0', display_name: '顶级分组' }
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
          this.fetchParents().then(() => {
            this.fetchData(val.id)
          })
        }
      },
      deep: true
    }
  },
  created() {
    const id = this.item.id
    this.id = id
    this.initData().then(() => {
      this.fetchData(id)
    })
  },
  methods: {
    initData() {
      return new Promise((resolve, reject) => {
        const all = this.getAll()
        const children = this.getChildren()

        Promise.all([all, children])
          .then(([all, children]) => {
            this.all = all.list
            this.children = children.list

            this.fetchParents().then(() => {})

            resolve()
          })
          .catch(() => {

          })
      })
    },
    getAll() {
      return new Promise((resolve, reject) => {
        getGroupChildrenList({
          id: 0,
          type: 'list'
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getChildren() {
      return new Promise((resolve, reject) => {
        getGroupChildrenList({
          id: this.id,
          type: 'ids'
        }).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    fetchParents() {
      return new Promise((resolve, reject) => {
        this.getChildren().then((res) => {
          this.children = res.list

          const all = this.all
          const children = this.children

          this.parentOptions = [
            { key: '0', display_name: '顶级分组' }
          ]
          this.parentFilterOptions = []

          children.push(this.id)
          all.forEach(item => {
            if (!children.includes(item.id)) {
              this.parentOptions.push({
                key: item.id,
                display_name: item.spacer + ' ' + item.title
              })
            }
          })

          this.parentFilterOptions = this.parentOptions

          resolve()
        }).catch(err => {
          reject(err)
        })
      })
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
            message: '更新分组信息成功',
            type: 'success',
            duration: 5 * 1000,
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
