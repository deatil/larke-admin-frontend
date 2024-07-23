<template>
  <el-form ref="authGroupForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('auth_group.form_parentid')" prop="parentid">
      <el-select
        v-model="data.parentid"
        :placeholder="$t('auth_group.form_select')"
        clearable
        filterable
        :filter-method="parentFilter"
        @change="parentidChange"
      >
        <el-option v-for="item in parentOptions" :key="item.key" :label="item.display_name | entityToString" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('auth_group.form_title')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('auth_group.form_enter_title')" />
    </el-form-item>

    <el-form-item :label="$t('auth_group.form_description')" prop="description">
      <el-input v-model.trim="data.description" type="textarea" rows="6" :placeholder="$t('auth_group.form_enter_description')" />
    </el-form-item>

    <el-form-item :label="$t('auth_group.form_listorder')" prop="listorder">
      <el-input v-model.trim="data.listorder" :placeholder="$t('auth_group.form_enter_listorder')" />
      <div class="text-grey">         
        {{ $t('auth_group.form_listorder_tip') }}
      </div>
    </el-form-item>

    <el-form-item :label="$t('auth_group.form_status')" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">{{ $t('auth_group.form_status_enable') }}</el-radio>
        <el-radio :label="0">{{ $t('auth_group.form_status_disable') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('auth_group.form_save') }}</el-button>
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
      loading: false,
      rules: {
        parentid: [
          { required: true, message: this.$t('auth_group.rules_parentid_required'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('auth_group.rules_title_required'), trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: this.$t('auth_group.rules_listorder_required'), trigger: 'blur' }
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
        { key: '0', display_name: this.$t('auth_group.form_top_group') }
      ],
      parentFilterOptions: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {

      try {
        const groupChildren = await getGroupChildrenList({
          id: 0,
          type: 'list'
        })

        const list = groupChildren.data.list

        if (list.length > 0) {
          list.forEach(item => {
            this.parentOptions.push({
              key: item.id,
              display_name: item.spacer + ' ' + item.title
            })
          })

          this.parentFilterOptions = this.parentOptions
        }

      } catch (error) {
        console.log('err' + error)
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

      this.$refs.authGroupForm.validate(valid => {
        if (!valid) {
          this.loading = false

          return false
        }

        createGroup(this.data).then(response => {
          thiz.loading = false

          this.$message({
            message: this.$t('auth_group.form_create_success'),
            type: 'success',
            duration: 2 * 1000,
            onClose() {
              if (thiz.$refs.authGroupForm !== undefined) {
                thiz.$refs.authGroupForm.resetFields()
              }
              thiz.item.dialogVisible = false
            }
          })
        }).catch(err => {
          thiz.loading = false
        })
      })
    }
  }
}
</script>
