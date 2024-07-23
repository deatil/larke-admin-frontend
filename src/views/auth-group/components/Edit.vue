<template>
  <el-form v-loading="detailLoading" ref="authGroupForm" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('auth_group.form_parentid')" prop="parentid">
      <el-select
        v-model="data.parentid"
        :placeholder="$t('auth_group.form_select')"
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

    <el-form-item :label="$t('auth_group.form_title')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('auth_group.form_enter_title')" />
    </el-form-item>

    <el-form-item :label="$t('auth_group.form_description')" prop="description">
      <el-input 
        v-model.trim="data.description" 
        type="textarea" 
        rows="6" 
        :placeholder="$t('auth_group.form_enter_description')" />
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
      detailLoading: false,
      loading: false,
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
          { required: true, message: this.$t('auth_group.rules_parentid_required'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('auth_group.rules_title_required'), trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: this.$t('auth_group.rules_listorder_required'), trigger: 'blur' }
        ]
      },
      parentOptions: [
        { key: '0', display_name: this.$t('auth_group.form_top_group') }
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
      this.detailLoading = true
      
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
        { key: '0', display_name: this.$t('auth_group.form_top_group') }
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

        this.detailLoading = false
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

      this.loading = true

      this.$refs.authGroupForm.validate(valid => {
        if (!valid) {
          this.loading = false

          return false
        }

        updateGroup(this.id, {
          parentid: this.data.parentid,
          title: this.data.title,
          description: this.data.description,
          listorder: this.data.listorder,
          status: this.data.status
        }).then(response => {
          thiz.loading = false

          this.$message({
            message: this.$t('auth_group.form_update_success'),
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
        }).catch(err => {
          thiz.loading = false
        })
      })
    }
  }
}
</script>
