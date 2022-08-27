<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $t('管理员') }}
          </div>
          <count-to
            :start-val="0"
            :end-val="admins"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
        
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-paperclip">
          <i class="el-icon-paperclip card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $t('附件') }}
          </div>
          <count-to
            :start-val="0"
            :end-val="attachments"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-component">
          <svg-icon icon-class="component" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $t('启用扩展') }}
          </div>
          <count-to 
            :start-val="0" 
            :end-val="extensions" 
            :duration="3200" 
            class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-operation">
          <i class="el-icon-s-operation card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ $t('管理分组') }}
          </div>
          <count-to 
            :start-val="0" 
            :end-val="groups" 
            :duration="3600" 
            class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import permission from '@/directive/permission/index.js'
import checkPermission from '@/utils/permission'
import { getList as getAdminList } from '@/api/admin'
import { getAttachmentList } from '@/api/attachment'
import { getList as getExtensionList } from '@/api/extension'
import { getGroupList } from '@/api/authGroup'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      admins: 0,
      attachments: 0,
      extensions: 0,
      groups: 0,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      const thiz = this

      if (checkPermission(['larke-admin.admin.index'])) {
        // 管理员
        await getAdminList({
          start: 1,
          limit: 0
        }).then(response => {
          thiz.admins = response.data.total
        })
      }

      if (checkPermission(['larke-admin.attachment.index'])) {
        // 附件
        await getAttachmentList({
          start: 1,
          limit: 0
        }).then(response => {
          thiz.attachments = response.data.total
        })
      }

      if (checkPermission(['larke-admin.extension.index'])) {
        // 启用扩展
        await getExtensionList({
          status: 'open',
          start: 1,
          limit: 0
        }).then(response => {
          thiz.extensions = response.data.total
        })
      }

      if (checkPermission(['larke-admin.auth-group.index'])) {
        // 管理分组
        await getGroupList({
          start: 1,
          limit: 0
        }).then(response => {
          thiz.groups = response.data.total
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-paperclip {
        background: #36a3f7;
      }

      .icon-component {
        background: #34bfa3;
      }

      .icon-operation {
        background: #f4516c;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-paperclip {
      color: #36a3f7;
    }

    .icon-component {
      color: #34bfa3;
    }

    .icon-operation {
      color: #f4516c;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
