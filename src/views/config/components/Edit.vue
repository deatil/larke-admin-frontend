<template>
  <el-form v-loading="detailLoading" ref="form" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('config.form_group')" prop="group">
      <el-select v-model="data.group" :placeholder="$t('config.form_select_group')" clearable>
        <el-option v-for="item in groupOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('config.form_type')" prop="type">
      <el-select v-model="data.type" :placeholder="$t('config.form_select_type')" clearable>
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('config.form_title')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('config.form_enter_title')" />
    </el-form-item>
    <el-form-item :label="$t('config.form_name')" prop="name">
      <el-input v-model.trim="data.name" :placeholder="$t('config.form_enter_name')" />
    </el-form-item>

    <el-form-item :label="$t('config.form_options')" prop="options">
      <el-input v-model="data.options" type="textarea" rows="6" :placeholder="$t('config.form_enter_options')" />
    </el-form-item>
    <el-form-item :label="$t('config.form_options_value')" prop="value">
      <el-input v-model="data.value" type="textarea" rows="6" :placeholder="$t('config.form_enter_options_value')" />
    </el-form-item>
    <el-form-item :label="$t('config.form_description')" prop="description">
      <el-input v-model.trim="data.description" type="textarea" rows="6" :placeholder="$t('config.form_enter_description')" />
    </el-form-item>

    <el-form-item :label="$t('config.form_listorder')" prop="listorder">
      <el-input v-model.trim="data.listorder" :placeholder="$t('config.form_enter_listorder')" />
    </el-form-item>

    <el-form-item :label="$t('config.form_status')" prop="is_show">
      <el-radio-group v-model="data.is_show">
        <el-radio :label="1">{{ $t('config.form_show') }}</el-radio>
        <el-radio :label="0">{{ $t('config.form_show_disable') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('config.form_status')" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">{{ $t('config.form_status_enable') }}</el-radio>
        <el-radio :label="0">{{ $t('config.form_status_disable') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('config.form_save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { formatOpions } from '@/utils'
import { getDetail, update } from '@/api/config'

export default {
  name: 'ConfigEdit',
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
      rules: {
        type: [
          { required: true, message: this.$t('config.rules_type_required'), trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('config.rules_title_required'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('config.rules_name_required'), trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: this.$t('config.rules_listorder_required'), trigger: 'blur' }
        ]
      },
      data: {
        group: '',
        type: '',
        title: '',
        name: '',
        options: '',
        value: '',
        description: '',
        listorder: '100',
        is_show: 1,
        status: 1
      },
      groupOptions: [
        { key: 'other', display_name: this.$t('config.form_group_none') }
      ],
      typeOptions: [
        { key: 'text', display_name: this.$t('config.form_type_text') },
        { key: 'textarea', display_name: this.$t('config.form_type_textarea') },
        { key: 'array', display_name: this.$t('config.form_type_array') },
        { key: 'number', display_name: this.$t('config.form_type_number') },
        { key: 'radio', display_name: this.$t('config.form_type_radio') },
        { key: 'checkbox', display_name: this.$t('config.form_type_checkbox') },
        { key: 'select', display_name: this.$t('config.form_type_select') },
        { key: 'switch', display_name: this.$t('config.form_type_switch') },
        { key: 'image', display_name: this.$t('config.form_type_image') },
        { key: 'rate', display_name: this.$t('config.form_type_rate') },
        { key: 'color', display_name: this.$t('config.form_type_color') },
        { key: 'slider', display_name: this.$t('config.form_type_slider') },
        { key: 'time', display_name: this.$t('config.form_type_time') },
        { key: 'date', display_name: this.$t('config.form_type_date') },
        { key: 'range-time', display_name: this.$t('config.form_type_range_time') },
        { key: 'range-date', display_name: this.$t('config.form_type_range_date') }
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
          this.fetchData(val.id)
        }
      },
      deep: true
    }
  },
  created() {
    this.id = this.item.id

    this.fetchGroup()
    this.fetchData(this.id)
  },
  methods: {
    fetchData(id) {
      this.detailLoading = true

      getDetail(id).then(response => {
        this.data = {
          group: response.data.group,
          type: response.data.type,
          title: response.data.title,
          name: response.data.name,
          options: response.data.options,
          value: response.data.value,
          description: response.data.description,
          listorder: response.data.listorder,
          is_show: response.data.is_show,
          status: response.data.status
        }

        this.detailLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    fetchGroup() {
      getDetail('group').then(response => {
        const data = formatOpions(response.data.value)

        this.groupOptions = []
        data.forEach((item, key) => {
          this.groupOptions.push({
            key: item.key,
            display_name: item.label
          })
        })
        this.groupOptions.push({
          key: 'other',
          display_name: this.$t('config.form_group_none')
        })
      })
    },
    submit() {
      const thiz = this

      this.loading = true

      this.$refs.form.validate(valid => {
        if (!valid) {
          this.loading = false

          return false
        }

        update(this.id, this.data).then(response => {
          thiz.loading = false

          this.$message({
            message: this.$t('config.form_update_success'),
            type: 'success',
            duration: 3 * 1000,
            onClose() {
              if (thiz.$refs.form !== undefined) {
                thiz.id = ''
                thiz.$refs.form.resetFields()
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
