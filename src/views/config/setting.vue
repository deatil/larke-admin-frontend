<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('config.setting_title') }}</span>
      </div>

      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-for="group in groups"
          :key="group.key"
          :name="group.key"
          :label="group.label"
        >
          <dynamic-form
            v-if="group.key === activeName"
            :items="group.items"
            :value="form.value"
            :column-min-width="form.columnMinWidth"
            @input="input"
          >
            <template slot>
              <el-form-item>
                <el-button type="primary" :loading="loading" @click="submit">
                  {{ $t('config.setting_save') }}
                </el-button>
              </el-form-item>
            </template>
          </dynamic-form>
        </el-tab-pane>
      </el-tabs>

    </el-card>

    <el-tooltip placement="top" :content="$t('common.goto_top')">
      <back-to-top :custom-style="backToTopStyle" :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>

  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/form'
import BackToTop from '@/components/BackToTop'
import { formatOpions, formatFormItem } from '@/utils'

import {
  getSettings,
  setting,
  getDetail
} from '@/api/config'

export default {
  name: 'ConfigSetting',
  components: { BackToTop, DynamicForm },
  directives: {},
  filters: {},
  data() {
    return {
      backToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      },
      
      activeName: '',
      list: null,
      groups: [
        { key: 'loading..', label: this.$t('config.setting_loading'), items: [] }
      ],
      form: {
        items: [],
        value: {},
        columnMinWidth: '100px'
      },
      loading: false,
      inputs: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    handleClick(tab) {
      const tabName = tab.name
    },
    initData() {
      return new Promise((resolve, reject) => {
        const group = this.fetchGroup()
        const settings = this.getSettings()

        Promise.all([group, settings])
          .then(([group, settings]) => {
            this.groups.forEach((groupItem, key) => {
              settings.items.forEach(settingItem => {
                if (groupItem.key == settingItem.group) {
                  this.groups[key].items.push(settingItem)
                }
              })
            })

            this.activeName = this.groups[0].key
            resolve(this.groups)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchGroup() {
      return new Promise((resolve, reject) => {
        getDetail('group').then(response => {
          const data = formatOpions(response.data.value)

          this.groups = []
          data.forEach((item, key) => {
            this.groups.push({
              key: item.key,
              label: item.label,
              items: []
            })
          })

          resolve(this.groups)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getSettings() {
      return new Promise((resolve, reject) => {
        getSettings().then(response => {
          this.list = response.data.list

          this.list.forEach(element => {
            element = formatFormItem(element)

            this.form.items.push({
              'group': element.group,
              'type': element.type,
              'label': element.title,
              'value': element.value,
              'placeholder': element.description,
              'options': element.options,
              'rules': {},
              'key': element.name,
              'show': element.is_show
            })
          })

          resolve(this.form)
        }).catch(error => {
          reject(error)
        })
      })
    },
    input(data) {
      if (data) {
        this.inputs = Object.assign({}, this.inputs, data)
      }
    },
    submit() {
      const thiz = this
      
      this.loading = true

      setting({
        fields: this.inputs
      }).then(() => {
        thiz.loading = false

        this.$message({
          message: this.$t('config.setting_save_success'),
          type: 'success',
          duration: 3 * 1000
        })
      }).catch(err => {
        thiz.loading = false
      })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  padding: 5px 2px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
