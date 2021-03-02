<template>
  <el-form ref="authRuleForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('父级权限')" prop="parentid">
      <el-select
        v-model="data.parentid"
        :placeholder="$t('请选择')"
        clearable
        filterable
        :filter-method="parentFilter"
        @change="parentidChange"
      >
        <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('名称')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('请填写权限名称')" />
    </el-form-item>
    <el-form-item :label="$t('请求链接')" prop="url">
      <el-tooltip effect="dark" :content="$t('请求链接默认不用加前缀')" placement="top">
        <el-input v-model.trim="data.url" :placeholder="$t('请填写请求链接')">
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
    <el-form-item :label="$t('标识')" prop="slug">
      <el-input v-model.trim="data.slug" :placeholder="$t('请填写标识')" />
    </el-form-item>
    <el-form-item :label="$t('权限描述')" prop="description">
      <el-input v-model.trim="data.description" type="textarea" rows="6" :placeholder="$t('请填写权限描述')" />
    </el-form-item>
    <el-form-item :label="$t('排序')" prop="listorder">
      <el-input v-model.trim="data.listorder" :placeholder="$t('请填写排序')" />
    </el-form-item>
    <el-form-item :label="$t('鉴定权限')" prop="is_need_auth">
      <el-radio-group v-model="data.is_need_auth">
        <el-radio :label="1">{{ $t('启用') }}</el-radio>
        <el-radio :label="0">{{ $t('禁用') }}</el-radio>
      </el-radio-group>
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
  getRuleDetail,
  getRuleChildrenList,
  updateRule
} from '@/api/authRule'

export default {
  name: 'AuthRuleEdit',
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
        url: '',
        method: 'GET',
        slug: '',
        description: '',
        listorder: 100,
        is_need_auth: 1,
        status: 1
      },
      rules: {
        parentid: [
          { required: true, message: this.$t('父级不能为空'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('名称不能为空'), trigger: 'blur' }
        ],
        url: [
          { required: true, message: this.$t('请求链接不能为空'), trigger: 'blur' }
        ],
        slug: [
          { required: true, message: this.$t('标识不能为空'), trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: this.$t('排序不能为空'), trigger: 'blur' }
        ]
      },
      parentOptions: [
        { key: '0', display_name: this.$t('顶级权限') }
      ],
      parentFilterOptions: [],
      methodOptions: [
        { key: 'GET', display_name: 'GET' },
        { key: 'HEAD', display_name: 'HEAD' },
        { key: 'POST', display_name: 'POST' },
        { key: 'PUT', display_name: 'PUT' },
        { key: 'DELETE', display_name: 'DELETE' },
        { key: 'PATCH', display_name: 'PATCH' },
        { key: 'OPTIONS', display_name: 'OPTIONS' }
      ]
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
      return getRuleChildrenList({
        id: 0,
        type: 'list'
      })
    },
    getChildren() {
      return getRuleChildrenList({
        id: this.id,
        type: 'ids'
      })
    },
    fetchParents() {
      const all = this.all
      const children = this.children

      this.parentOptions = [
        { key: '0', display_name: this.$t('顶级权限') }
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
    },
    fetchData(id) {
      getRuleDetail(id).then(response => {
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

      this.$refs.authRuleForm.validate(valid => {
        if (!valid) {
          return false
        }

        updateRule(this.id, {
          parentid: this.data.parentid,
          title: this.data.title,
          url: this.data.url,
          method: this.data.method,
          slug: this.data.slug,
          description: this.data.description,
          listorder: this.data.listorder,
          is_need_auth: this.data.is_need_auth,
          status: this.data.status
        }).then(response => {
          this.successTip(this.$t('更新权限信息成功'), function() {
              if (thiz.$refs.authRuleForm !== undefined) {
                thiz.id = ''
                thiz.$refs.authRuleForm.resetFields()
              }
              thiz.item.dialogVisible = false
            })
        })
      })
    }
  }
}
</script>
