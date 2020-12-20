<template>
  <el-form
    :model="value"
    v-bind="items"
    label-width="100px"
    class="dynamic-form"
  >
    <template v-for="item in items">
      <item
        v-if="item.show"
        :key="item.key"
        :item="item"
        v-bind="item"
        :value="value[item.key]"
        :style="{'min-width':columnMinWidth}"
        @input="handleInput($event, item.key)"
      />
    </template>
    <slot />

  </el-form>
</template>

<script>
import Item from './item'

export default {
  components: {
    Item
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    columnMinWidth: {
      type: String
    }
  },
  mounted() {
    this.setDefaultValue()
  },
  methods: {
    handleInput(val, key) {
      if (val instanceof Array) {
        const newVal = []

        val.forEach((item, index) => {
          if (item) {
            newVal.push(item)
          }
        })

        val = newVal.join(',')
      }

      this.$emit('input', { ...this.value, [key]: val })
    },
    setDefaultValue() {
      for (var i in this.items) {
        const item = this.items[i]
        const key = item.key
        const value = item.value
        this.handleInput(value, key)
      }
    }
  }
}
</script>

<style>

</style>
