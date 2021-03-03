<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('网站设置') }}</span>
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
                <el-button type="primary" @click="submit">
                  {{ $t('提交') }}
                </el-button>
              </el-form-item>
            </template>
          </dynamic-form>
        </el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/form'
import { formatOpions, formatFormItem } from '@/utils'

import {
  getSettings,
  setting,
  getDetail
} from '@/api/config'

export default {
  name: 'ConfigSetting',
  components: { DynamicForm },
  directives: { },
  filters: {

  },
  data() {
    return {
      activeName: '',
      list: null,
      groups: [
        { key: 'loading..', label: this.$t('加载中..'), items: [] }
      ],
      form: {
        items: [],
        value: {},
        columnMinWidth: '100px'
      },
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
      setting({
        fields: this.inputs
      }).then(() => {
        this.$message({
          message: this.$t('提交更新成功'),
          type: 'success',
          duration: 3 * 1000
        })
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
