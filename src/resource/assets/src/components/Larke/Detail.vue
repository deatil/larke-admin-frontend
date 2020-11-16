<template>
  <el-table :data="data" :header-cell-style="{background:'#eef1f6',coolor:'#606266'}">
    <el-table-column align="left" label="名称" width="120">
      <template slot-scope="{row}">
        <span>{{ row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column align="left" label="内容" min-width="270">
      <template slot-scope="{row}">
        <span v-if="row.type == 'text'">
          {{ row.content }}
        </span>

        <span v-else-if="row.type == 'image'">
          <template v-if="row.content != ''">
            <img :src="row.content" style="width:100px;" />
          </template>
        </span>

        <span v-else-if="row.type == 'time'">
          {{ row.content | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </span>

        <span v-else-if="row.type == 'boolen'">
          {{ row.content == '1' ? '是' : '否' }}
        </span>

        <span v-else-if="row.type == 'arr2str'">
          {{ row | parseArr2str }}
        </span>        

        <span v-else>
          {{ row.content }}
        </span>        
      </template>      
    </el-table-column>        
  </el-table>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  name: 'DetailComponent',
  components: { 
  },
  filters: {
    parseArr2str(arr) {
      const data = []

      if (arr['content'] instanceof Array) {
        for (let content of arr['content']) {
          if (content[arr['arrkey']]) {
            data.push(content[arr['arrkey']])
          }
        }
      }
      
      return data.join(',')
    }
  },  
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },  
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

