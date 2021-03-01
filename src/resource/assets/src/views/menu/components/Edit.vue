<template>
  <el-form ref="menuEditForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('父级权限')" prop="pid">
      <el-select
        v-model="data.pid"
        placeholder="请选择"
        clearable
        filterable
        :filter-method="parentFilter"
        @change="pidChange"
      >
        <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>

      <el-button :type="rule.visible ? 'primary' : ''" class="fast-select" @click="ruleFastSelect">{{ rule.visible ? $t('取消选择') : $t('快速选择') }}</el-button>
    </el-form-item>

    <el-form-item :label="$t('快速选择')" v-if="rule.visible">
      <el-select
        :placeholder="$t('请选择权限信息')"
        clearable
        filterable
        :filter-method="ruleFilter"
        v-model="rule.id"
        @change="ruleChange"
      >
        <el-option v-for="item in rule.ruleOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>      
    </el-form-item>

    <el-form-item :label="$t('名称')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('请填写菜单名称')" />   
    </el-form-item>

    <el-form-item :label="$t('标识')" prop="slug">
      <el-input v-model.trim="data.slug" :placeholder="$t('请填写菜单标识')" />
    </el-form-item>

    <el-form-item :label="$t('链接')" prop="url">
      <el-tooltip effect="dark" :content="$t('链接默认不用加前缀')" placement="top">
        <el-input v-model.trim="data.url" :placeholder="$t('请填写菜单链接')">
          <template slot="prepend">
            <i class="el-icon-link" />
          </template>
        </el-input>
      </el-tooltip>
    </el-form-item>

    <el-form-item :label="$t('请求方式')" prop="method">
      <el-select v-model="data.method">
        <el-option v-for="item in methodOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('排序')" prop="sort">
      <el-input v-model.trim="data.sort" :placeholder="$t('请填写排序')" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  getMenuChildren,
  updateMenu
} from '@/api/menu'
import { getRuleChildrenList } from '@/api/authRule'

export default {
  name: 'MenuEdit',
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
      pid: '',
      data: {
        pid: '',
        title: '',
        slug: '',
        url: '',
        method: 'GET',
        sort: 100
      },
      rules: {
        pid: [
          { required: true, message: this.$t('父级菜单不能为空'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('名称不能为空'), trigger: 'blur' }
        ],
        slug: [
          { required: true, message: this.$t('标识不能为空'), trigger: 'blur' }
        ],
        url: [
          { required: true, message: this.$t('链接不能为空'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('排序不能为空'), trigger: 'blur' }
        ]
      },
      methodOptions: [
        { key: 'GET', display_name: 'GET' },
        { key: 'HEAD', display_name: 'HEAD' },
        { key: 'POST', display_name: 'POST' },
        { key: 'PUT', display_name: 'PUT' },
        { key: 'DELETE', display_name: 'DELETE' },
        { key: 'PATCH', display_name: 'PATCH' },
        { key: 'OPTIONS', display_name: 'OPTIONS' }
      ],
      parentOptions: [
        { key: '0', display_name: this.$t('顶级菜单') }
      ],
      parentFilterOptions: [],
      rule: {
        visible: false,
        id: '',
        ruleList: [], 
        ruleOptions: [],
        ruleFilterOptions: [],  
      }
    }
  },
  watch: {
    item: {
      handler(val, oldVal) {
        if (this.item.dialogVisible == true &&
          this.id != val.id
        ) {
          this.id = val.id
          this.rule.id = ''
          this.fetchParents().then(() => {
            this.fetchData()
            this.getRules()
          })
        }
      },
      deep: true
    }
  },
  created() {
    const id = String(this.item.id)
    this.id = id
    this.initData().then(() => {
      this.fetchData()
      this.getRules()
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
        getMenuChildren({
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
        getMenuChildren({
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
            { key: '0', display_name: this.$t('顶级菜单') }
          ]
          this.parentFilterOptions = []

          children.push(this.id)
          all.forEach(item => {
            if (!children.includes(item.id)) {
              this.parentOptions.push({
                key: item.id,
                display_name: item.spacer + ' ' + item.title + '【' + item.method + '】'
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
      this.pid = this.item.pid
      this.data = this.item.data
      this.data.pid = String(this.data.pid)
    },
    parentFilter(val) {
      this.data.pid = val
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
    pidChange(val) {
      if (val) {
        this.parentOptions = this.parentFilterOptions
        this.data.pid = val
      }
    },

    ruleFastSelect() {
      this.rule.visible = !this.rule.visible
    },
    getRules() {
      return new Promise((resolve, reject) => {
        getRuleChildrenList({
          id: 0,
          type: 'list'
        }).then(res => {
          this.rule.ruleList = []
          this.rule.ruleOptions = []
          this.rule.ruleFilterOptions = []

          res.data.list.forEach(item => {
            this.rule.ruleList.push(item)
            this.rule.ruleOptions.push({
              key: item.id,
              display_name: item.spacer + ' ' + item.title + '【' + item.method + '】'
            })
          })

          this.rule.ruleFilterOptions = this.rule.ruleOptions

          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },    
    ruleFilter(val) {
      if (val) {
        this.rule.ruleOptions = this.rule.ruleFilterOptions.filter(item => {
          if (!!~item.display_name.indexOf(val) ||
            !!~item.display_name.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true
          }
        })
      } else {
        this.rule.ruleOptions = this.rule.ruleFilterOptions
      }
    },
    ruleChange(val) {
      if (val) {
        this.rule.ruleOptions = this.rule.ruleFilterOptions
        this.rules

        const clickItem = this.rule.ruleList.filter(item => {
          if (val == item.id) {
            return true
          }
        })
        const item = clickItem[0]
        
        this.data.title = item.title
        this.data.slug = item.slug
        this.data.url = item.url
        this.data.method = item.method
      }
    },

    submit() {
      const thiz = this

      this.$refs.menuEditForm.validate(valid => {
        if (!valid) {
          return false
        }

        updateMenu(this.id, {
          pid: this.data.pid,
          title: this.data.title,
          slug: this.data.slug,
          url: this.data.url,
          method: this.data.method,
          sort: this.data.sort
        }).then(response => {
          this.$message({
            message: this.$t('更新菜单信息成功'),
            type: 'success',
            duration: 5 * 1000,
            onClose() {
              if (thiz.$refs.menuEditForm !== undefined) {
                thiz.id = ''
                thiz.$refs.menuEditForm.resetFields()
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

<style scoped>
.fast-select {
  margin-left: 15px;
}
</style>
