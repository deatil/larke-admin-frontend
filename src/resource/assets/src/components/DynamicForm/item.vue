<template>
  <el-form-item
    :rules="Rules"
    :label="item.label"
    :prop="item.key"
    :class="{'block':item.block}"
  >

    <el-input
      v-if="item.type==='text'"
      type="text"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-input>

    <el-input
      v-if="item.type==='textarea'"
      type="textarea"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"      
      v-model="item.value"
      v-bind="$attrs"   
      v-on="$listeners"
    ></el-input>      

    <input-number
      v-else-if="item.type==='number'"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></input-number>

    <el-checkbox
      v-else-if="item.type==='switch' && item.appearance==='checkbox'"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"      
      v-bind="$attrs"
      v-on="$listeners"
    ></el-checkbox>
    
    <el-switch
      v-else-if="item.type==='switch'"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-switch>

    <el-rate
      v-else-if="item.type==='rate'"
      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
      text-color="#ff9900"
      :placeholder="item.placeholder"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-rate>

    <el-color-picker
      v-else-if="item.type==='color'"
      :color-format="item.format"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"      
      v-bind="$attrs"
      v-on="$listeners"
    ></el-color-picker>

    <el-slider
      v-else-if="item.type==='slider'"
      :range="item.isRange"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"         
      v-bind="$attrs"    
      v-on="$listeners"
    ></el-slider>

    <el-radio-group
      v-else-if="item.type==='radio'"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"        
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-radio
        v-for="(val, key) in item.options"
        :key="key"
        :label="val"
        :disabled="o.disabled"
        :border="0"
      >{{ o.label }}</el-radio>
    </el-radio-group>

    <el-radio-group
      v-else-if="item.type==='radio-button'"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"        
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-radio-button
        v-for="(val, key) in item.options"
        :key="key"
        :label="val"
        :disabled="o.disabled"
        :border="1"
      >{{ o.label }}</el-radio-button>
    </el-radio-group>    

    <el-checkbox-group
      v-else-if="item.type==='checkbox'"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"        
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-checkbox
        v-for="(val, key) in item.options"
        :key="key"     
        :label="val"
        :disabled="o.disabled"
        :border="0"
      >{{ o.label }}</el-checkbox>
    </el-checkbox-group>

    <el-checkbox-group
      v-else-if="item.type==='checkbox-button'"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"        
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-checkbox-button
        v-for="(val, key) in item.options"
        :key="key"     
        :label="val"
        :disabled="o.disabled"
        :border="1"
      >{{ o.label }}</el-checkbox-button>
    </el-checkbox-group>

    <el-select
      v-else-if="item.type==='select'"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"        
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-option
        v-for="(val, key) in item.options"
        :key="key"
        :label="val"
        :value="key"
        :disabled="o.disabled"
      >
      </el-option>
    </el-select>

    <el-cascader
      v-else-if="item.type==='cascader'"
      :options="item.options"
      :clearable="true"      
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"        
      v-bind="$attrs"
      v-on="$listeners"
    ></el-cascader>

    <el-time-picker
      v-else-if="item.type==='time'"
      :format="item.valueFormat"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"   
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"             
      v-bind="$attrs"
      v-on="$listeners"
    ></el-time-picker>

    <el-date-picker
      v-else-if="item.type==='date'"
      :type="item.subtype"
      :format="item.viewFormat||item.valueFormat"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"  
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      :autosize="item.autosize"  
      v-model="item.value"            
      v-bind="$attrs"
      v-on="$listeners"
    ></el-date-picker>

  </el-form-item>
</template>

<script>
import InputNumber from './input-number'

export default {
  components: {
    InputNumber
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    
    };
  },
  computed: {
    Rules() {
      const { rules } = this.item;
      if (rules === undefined) return undefined;

      let R = [];

      /*
      rules.forEach(rule => {
          R.push(rule);
      });
      */

      return R;
    },
  },
  created() {
  },
};
</script>

<style>
.block {
  display: block !important;
  display: flex !important;
}
</style>
