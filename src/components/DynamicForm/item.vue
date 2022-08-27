<template>
  <el-form-item
    :rules="Rules"
    :label="item.label"
    :prop="item.key"
    :class="{'block':item.block}"
  >

    <el-input
      v-if="item.type==='text'"
      v-model="item.value"
      type="text"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-input
      v-if="item.type==='textarea'"
      v-model="item.value"
      type="textarea"
      rows="6"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      :autosize="item.autosize||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-input
      v-if="item.type==='array'"
      v-model="item.value"
      type="textarea"
      rows="6"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      :autosize="item.autosize||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <input-number
      v-else-if="item.type==='number'"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-checkbox
      v-else-if="item.type==='switch' && item.appearance==='checkbox'"
      v-model="item.value"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-switch
      v-else-if="item.type==='switch'"
      v-model="item.value"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      :active-value="1"
      :inactive-value="0"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-rate
      v-else-if="item.type==='rate'"
      v-model="item.value"
      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
      text-color="#ff9900"
      :disabled="item.disable||false"
      :placeholder="item.placeholder"
      :texts="item.options"
      style="position: absolute;top: 10px;"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-color-picker
      v-else-if="item.type==='color'"
      v-model="item.value"
      :color-format="item.format"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-slider
      v-else-if="item.type==='slider'"
      v-model="item.value"
      :range="item.isRange"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-radio-group
      v-else-if="item.type==='radio'"
      v-model="item.value"
      :placeholder="item.placeholder"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-radio
        v-for="(item) in item.options"
        :key="item.key"
        :label="item.key"
        :disabled="item.disable||false"
        :readonly="item.readonly||false"
      >{{ item.label }}</el-radio>
    </el-radio-group>

    <el-radio-group
      v-else-if="item.type==='radio-button'"
      v-model="item.value"
      :placeholder="item.placeholder"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-radio-button
        v-for="(item) in item.options"
        :key="item.key"
        :label="item.key"
        :border="1"
        :disabled="item.disable||false"
        :readonly="item.readonly||false"
      >{{ item.label }}</el-radio-button>
    </el-radio-group>

    <el-checkbox-group
      v-else-if="item.type==='checkbox'"
      v-model="item.value"
      :placeholder="item.placeholder"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-checkbox
        v-for="(item) in item.options"
        :key="item.key"
        :label="item.key"
        :disabled="item.disable||false"
        :readonly="item.readonly||false"
      >{{ item.label }}</el-checkbox>
    </el-checkbox-group>

    <el-checkbox-group
      v-else-if="item.type==='checkbox-button'"
      v-model="item.value"
      :placeholder="item.placeholder"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-checkbox-button
        v-for="(item) in item.options"
        :key="item.key"
        :label="item.key"
        :border="1"
        :disabled="item.disable||false"
        :readonly="item.readonly||false"
      >{{ item.label }}</el-checkbox-button>
    </el-checkbox-group>

    <el-select
      v-else-if="item.type==='select'"
      v-model="item.value"
      :placeholder="item.placeholder"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-option
        v-for="(item) in item.options"
        :key="item.key"
        :label="item.label"
        :value="item.key"
        :disabled="item.disable||false"
        :readonly="item.readonly||false"
      />
    </el-select>

    <el-cascader
      v-else-if="item.type==='cascader'"
      v-model="item.value"
      :options="item.options"
      :clearable="true"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-date-picker
      v-else-if="item.type==='date'"
      v-model="item.value"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      :clearable="true"
      :placeholder="item.placeholder"
      :options="item.options"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-time-picker
      v-else-if="item.type==='time'"
      v-model="item.value"
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      :clearable="true"
      :placeholder="item.placeholder"
      :options="item.options"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-date-picker
      v-else-if="item.type==='range-date'"
      v-model="item.value"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      :range-separator="$t('至')"
      :start-placeholder="$t('开始时间')"
      :end-placeholder="$t('结束时间')"
      :options="item.options"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <el-time-picker
      v-else-if="item.type==='range-time'"
      v-model="item.value"
      is-range
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      :range-separator="$t('至')"
      :start-placeholder="$t('开始时间')"
      :end-placeholder="$t('结束时间')"
      :placeholder="item.placeholder"
      :options="item.options"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <single-image
      v-else-if="item.type==='image'"
      v-model="item.value"
      :placeholder="item.placeholder"
      v-bind="$attrs"
      v-on="$listeners"
    />

  </el-form-item>
</template>

<script>
import SingleImage from '@/components/Larke/SingleImage'
import InputNumber from './input-number'

export default {
  components: {
    SingleImage,
    InputNumber
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },
  computed: {
    Rules() {
      const { rules } = this.item
      if (rules === undefined) return undefined

      const R = []

      const newRules = Object.assign({}, rules)

      if (newRules.length > 0) {
        rules.forEach(rule => {
          R.push(rule)
        })
      }

      return R
    }
  },
  created() {
  }
}
</script>

<style>
.block {
  display: block !important;
  display: flex !important;
}
</style>
