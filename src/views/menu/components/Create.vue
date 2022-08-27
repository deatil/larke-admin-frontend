<template>
  <el-form ref="menuCreateform" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('父级权限')" prop="pid">
      <el-select
        v-model="data.pid"
        :placeholder="$t('请选择')"
        clearable
        filterable
        :filter-method="parentFilter"
        @change="pidChange"
      >
        <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>

      <el-button :type="!rule.visible ? 'primary' : 'danger'" class="fast-select" @click="ruleFastSelect">{{ !rule.visible ? $t('快速选择') : $t('关闭选择') }}</el-button>
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

      <el-button type="warning" @click="reset">{{ $t('清空') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  getMenuChildren,
  createMenu
} from '@/api/menu'
import { getRuleChildrenList } from '@/api/authRule'

export default {
  name: 'MenuCreate',
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
  created() {
    this.initData()
    this.getRules()
  },
  methods: {
    initData() {
      const all = new Promise((resolve, reject) => {
        getMenuChildren({
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
              display_name: item.spacer + ' ' + item.title + '【' + item.method + '】'
            })
          })

          this.parentFilterOptions = this.parentOptions
        })
        .catch(() => {

        })
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

    reset() {
      this.rule.id = ''
      this.$refs.menuCreateform.resetFields()
    },
    submit() {
      const thiz = this

      this.$refs.menuCreateform.validate(valid => {
        if (!valid) {
          return false
        }

        createMenu(this.data).then(response => {
          this.$message({
            message: this.$t('添加菜单成功'),
            type: 'success',
            duration: 2 * 1000,
            onClose() {
              if (thiz.$refs.menuCreateform !== undefined) {
                thiz.$refs.menuCreateform.resetFields()
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
