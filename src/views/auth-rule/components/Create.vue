<template>
  <el-form ref="authRuleForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('auth_rule.form_parentid')" prop="parentid">
      <el-select
        v-model="data.parentid"
        :placeholder="$t('auth_rule.form_select')"
        clearable
        filterable
        :filter-method="parentFilter"
        @change="parentidChange"
      >
        <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_title')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('auth_rule.form_enter_title')" />
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_url')" prop="url">
      <el-tooltip effect="dark" :content="$t('auth_rule.form_url_tooltip')" placement="top">
        <el-input v-model.trim="data.url" :placeholder="$t('auth_rule.form_enter_url')">
          <template slot="prepend">
            <i class="el-icon-link" />
          </template>
        </el-input>
      </el-tooltip>
      <div class="text-grey">         
        {{ $t('auth_rule.form_url_tip') }}
      </div>
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_method')" prop="method">
      <el-select v-model="data.method">
        <el-option v-for="item in methodOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_slug')" prop="slug">
      <el-input v-model.trim="data.slug" :placeholder="$t('auth_rule.form_enter_slug')" />
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_description')" prop="description">
      <el-input v-model.trim="data.description" type="textarea" rows="6" :placeholder="$t('auth_rule.form_enter_description')" />
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_listorder')" prop="listorder">
      <el-input v-model.trim="data.listorder" :placeholder="$t('auth_rule.form_enter_listorder')" />
      <div class="text-grey">         
        {{ $t('auth_rule.form_listorder_tip') }}
      </div>
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_need_auth')" prop="is_need_auth">
      <el-radio-group v-model="data.is_need_auth">
        <el-radio :label="1">{{ $t('auth_rule.form_need_auth_enable') }}</el-radio>
        <el-radio :label="0">{{ $t('auth_rule.form_need_auth_disable') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('auth_rule.form_status')" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">{{ $t('auth_rule.form_status_enable') }}</el-radio>
        <el-radio :label="0">{{ $t('auth_rule.form_status_disable') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('auth_rule.form_save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  getRuleChildrenList,
  createRule
} from '@/api/authRule'

export default {
  name: 'AuthRuleCreate',
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
      loading: false,
      rules: {
        parentid: [
          { required: true, message: this.$t('auth_rule.rules_parentid_required'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('auth_rule.rules_title_required'), trigger: 'blur' }
        ],
        url: [
          { required: true, message: this.$t('auth_rule.rules_url_required'), trigger: 'blur' }
        ],
        slug: [
          { required: true, message: this.$t('auth_rule.rules_slug_required'), trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: this.$t('auth_rule.rules_listorder_required'), trigger: 'blur' }
        ]
      },
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
      parentOptions: [
        { key: '0', display_name: this.$t('auth_rule.form_top_rule') }
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
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      const all = await getRuleChildrenList({
        id: 0,
        type: 'list'
      })
      
      const list = all.data.list

      if (list.length > 0) {
        list.forEach(item => {
          this.parentOptions.push({
            key: item.id,
            display_name: item.spacer + ' ' + item.title + '【' + item.method + '】'
          })
        })

        this.parentFilterOptions = this.parentOptions
      }
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

      this.loading = true

      this.$refs.authRuleForm.validate(valid => {
        if (!valid) {
          this.loading = false

          return false
        }

        createRule(this.data).then(response => {
          thiz.loading = false

          this.successTip(this.$t('auth_rule.form_create_success'), function() {
              if (thiz.$refs.authRuleForm !== undefined) {
                thiz.$refs.authRuleForm.resetFields()
              }
              thiz.item.dialogVisible = false
            })
        }).catch(err => {
          thiz.loading = false
        })
      })
    }
  }
}
</script>
