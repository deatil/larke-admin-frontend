<template>
  <el-form v-loading="detailLoading" ref="form" :model="data" :rules="rules" label-width="100px">
    <el-form-item :label="$t('分组')" prop="group">
      <el-select v-model="data.group" :placeholder="$t('选择分组')" clearable>
        <el-option v-for="item in groupOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('类型')" prop="type">
      <el-select v-model="data.type" :placeholder="$t('选择类型')" clearable>
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('标题')" prop="title">
      <el-input v-model.trim="data.title" :placeholder="$t('请填写标题')" />
    </el-form-item>
    <el-form-item :label="$t('名称')" prop="name">
      <el-input v-model.trim="data.name" :placeholder="$t('请填写名称，填写大小写字母、数字、下划线及其组合')" />
    </el-form-item>

    <el-form-item :label="$t('配置项')" prop="options">
      <el-input v-model="data.options" type="textarea" rows="6" :placeholder="$t('请填写配置项')" />
    </el-form-item>
    <el-form-item :label="$t('配置值')" prop="value">
      <el-input v-model="data.value" type="textarea" rows="6" :placeholder="$t('请填写配置值')" />
    </el-form-item>
    <el-form-item :label="$t('描述')" prop="description">
      <el-input v-model.trim="data.description" type="textarea" rows="6" :placeholder="$t('请填写描述')" />
    </el-form-item>

    <el-form-item :label="$t('排序')" prop="listorder">
      <el-input v-model.trim="data.listorder" :placeholder="$t('请填写排序')" />
    </el-form-item>

    <el-form-item :label="$t('显示')" prop="is_show">
      <el-radio-group v-model="data.is_show">
        <el-radio :label="1">{{ $t('启用') }}</el-radio>
        <el-radio :label="0">{{ $t('禁用') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="data.status">
        <el-radio :label="1">{{ $t('启用') }}</el-radio>
        <el-radio :label="0">{{ $t('禁用') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loading" @click="submit">{{ $t('提交') }}</el-button>
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
          { required: true, message: this.$t('类型不能为空'), trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('标题不能为空'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('名称不能为空'), trigger: 'blur' }
        ],
        listorder: [
          { required: true, message: this.$t('排序不能为空'), trigger: 'blur' }
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
        { key: 'other', display_name: this.$t('未分组') }
      ],
      typeOptions: [
        { key: 'text', display_name: this.$t('文本') },
        { key: 'textarea', display_name: this.$t('文本框') },
        { key: 'array', display_name: this.$t('数组') },
        { key: 'number', display_name: this.$t('数字') },
        { key: 'radio', display_name: this.$t('单选') },
        { key: 'checkbox', display_name: this.$t('复选') },
        { key: 'select', display_name: this.$t('下拉') },
        { key: 'switch', display_name: this.$t('开关') },
        { key: 'image', display_name: this.$t('单图') },
        { key: 'rate', display_name: this.$t('评分') },
        { key: 'color', display_name: this.$t('颜色') },
        { key: 'slider', display_name: this.$t('滑块') },
        { key: 'time', display_name: this.$t('时间') },
        { key: 'date', display_name: this.$t('日期') },
        { key: 'range-time', display_name: this.$t('时间范围') },
        { key: 'range-date', display_name: this.$t('日期范围') }
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
          display_name: this.$t('未分组')
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
            message: this.$t('编辑配置成功'),
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
