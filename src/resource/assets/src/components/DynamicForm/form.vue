<template>
  <el-form
    :model="value"
    v-bind="items"
    label-width="100px"
    class="dynamic-form"
  >
    <item
      v-for="item in items"
      :key="item.key"
      :item="item"
      v-bind="item"
      :value="value[item.key]"
      :style="{'min-width':columnMinWidth}"
      @input="handleInput($event, item.key)"
    ></item>

    <slot></slot>

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
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    columnMinWidth: {
      type: String,
    },
  },
  mounted() {
    this.setDefaultValue();
  },
  methods: {
    handleInput(val, key) {
      // 这里element-ui没有上报event，直接就是value了
      this.$emit('input', { ...this.value, [key]: val });
    },
    setDefaultValue() {
      const formData = { ...this.value };
      for (var i in this.items) {
        const item = this.items[i]
        const key = item.key
        const value = item.value
        if (formData[key] === undefined || formData[key] === null) {
          formData[key] = value;
        }
      }
      
      this.$emit('input', { ...formData });
    },
  },
};
</script>

<style>

</style>
