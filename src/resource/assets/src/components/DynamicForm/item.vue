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
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-input>

    <el-input
      v-if="item.type==='textarea'"
      type="textarea"
      rows="6"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      :autosize="item.autosize||false"      
      v-model="item.value"
      v-bind="$attrs"   
      v-on="$listeners"
    ></el-input>  

    <el-input
      v-if="item.type==='array'"
      type="textarea"
      rows="6"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      :autosize="item.autosize||false"      
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
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"      
      v-bind="$attrs"
      v-on="$listeners"
    ></el-checkbox>
    
    <el-switch
      v-else-if="item.type==='switch'"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      :active-value="1"
      :inactive-value="0"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-switch>

    <el-rate
      v-else-if="item.type==='rate'"
      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
      text-color="#ff9900"
      :disabled="item.disable||false"
      :placeholder="item.placeholder"
      :texts="item.options"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-rate>

    <el-color-picker
      v-else-if="item.type==='color'"
      :color-format="item.format"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"      
      v-bind="$attrs"
      v-on="$listeners"
    ></el-color-picker>

    <el-slider
      v-else-if="item.type==='slider'"
      :range="item.isRange"
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"         
      v-bind="$attrs"    
      v-on="$listeners"
    ></el-slider>

    <el-radio-group
      v-else-if="item.type==='radio'"
      :placeholder="item.placeholder"
      v-model="item.value"        
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
      :placeholder="item.placeholder"
      v-model="item.value"        
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
      :placeholder="item.placeholder"
      v-model="item.value"        
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
      :placeholder="item.placeholder"
      v-model="item.value"        
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
      :placeholder="item.placeholder"
      v-model="item.value"        
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
      >
      </el-option>
    </el-select>

    <el-cascader
      v-else-if="item.type==='cascader'"
      :options="item.options"
      :clearable="true"      
      :placeholder="item.placeholder"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"        
      v-bind="$attrs"
      v-on="$listeners"
    ></el-cascader>

    <el-date-picker
      v-else-if="item.type==='date'"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss" 
      value-format="yyyy-MM-dd HH:mm:ss" 
      :clearable="true" 
      :placeholder="item.placeholder"
      :options="item.options"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"             
      v-bind="$attrs"
      v-on="$listeners"
    ></el-date-picker>

    <el-time-picker
      v-else-if="item.type==='time'"
      format="HH:mm:ss" 
      value-format="HH:mm:ss" 
      :clearable="true" 
      :placeholder="item.placeholder"
      :options="item.options"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"             
      v-bind="$attrs"
      v-on="$listeners"
    ></el-time-picker>

    <el-date-picker
      v-else-if="item.type==='range-date'"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss" 
      value-format="yyyy-MM-dd HH:mm:ss" 
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"  
      :options="item.options"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      :readonly="item.readonly"
      v-model="item.value"            
      v-bind="$attrs"
      v-on="$listeners"
    ></el-date-picker>

    <el-time-picker
      v-else-if="item.type==='range-time'"
      is-range
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"   
      :placeholder="item.placeholder"
      :options="item.options"
      :disabled="item.disable||false"
      :readonly="item.readonly||false"
      v-model="item.value"             
      v-bind="$attrs"
      v-on="$listeners"
    ></el-time-picker>

    <single-image
      v-else-if="item.type==='image'"
      :placeholder="item.placeholder"
      v-model="item.value"
      v-bind="$attrs"
      v-on="$listeners"
    ></single-image>    

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

      const newRules = Object.assign({}, rules)

      if (newRules.length > 0) {
        rules.forEach(rule => {
            R.push(rule);
        });
      }

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
