<template>
  <el-table :data="data" :header-cell-style="{background:'#eef1f6',coolor:'#606266'}">
    <el-table-column align="left" label="名称" width="120">
      <template slot-scope="{row}">
        <span>{{ row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column align="left" label="内容" min-width="270">
      <template slot-scope="{row}" v-if="row.content">
        <span v-if="row.type == 'html'" v-html="row.content">
        </span>

        <span v-else-if="row.type == 'text'">
          {{ row.content }}
        </span>

        <span v-else-if="row.type == 'image'">
          <template v-if="row.content != ''">
            <img :src="row.content" style="width:100px;">
          </template>
        </span>

        <span v-else-if="row.type == 'time'">
          {{ row.content | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </span>

        <span v-else-if="row.type == 'json'">
          <json-viewer
            :value="row.content"
            :expand-depth="row.depth||5"
            :preview-mode="row.preview||false"
            :sort="row.sort||false"
            copyable
            boxed
          />
        </span>

        <span v-else-if="row.type == 'boolen'">
          <template v-if="row.content == '1'">
            <el-tag type="success" size="mini">
              已激活
            </el-tag>
          </template>

          <template v-else>
            <el-tag type="danger" size="mini">
              已禁用
            </el-tag>
          </template>
        </span>

        <span v-else-if="row.type == 'status'">
          <template v-if="row.content == '1'">
            <el-tag type="success" size="mini">
              是
            </el-tag>
          </template>

          <template v-else>
            <el-tag type="danger" size="mini">
              否
            </el-tag>
          </template>
        </span>

        <span v-else-if="row.type == 'arr2str'">
          {{ row | parseArr2str }}
        </span>

        <span v-else-if="row.type == 'size'">
          {{ row.content | renderSize }}
        </span>

        <span v-else>
          {{ row.content }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import 'vue-json-viewer/style.css'
import { parseTime } from '@/utils'

export default {
  name: 'DetailComponent',
  components: {
  },
  filters: {
    parseArr2str(arr) {
      const data = []

      if (arr['content'] instanceof Array) {
        for (const content of arr['content']) {
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

