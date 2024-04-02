<template>
  <div class="components-container" style="margin: 0;">

    <el-alert
      type="info"
      :title="$t('profile.updata_avatar_tip')"
      :description="$t('profile.auto_update_avatar')"
      class="profile-avatar-tip"
      show-icon
      :closable="false"
    />

    <pan-thumb :image="user.avatar" />

    <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
      {{ $t('profile.select_avatar') }}
    </el-button>

    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      field="file"
      url="upload/file"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { updateAvatar } from '@/api/user'

export default {
  name: 'ProfileAvatar',
  components: {
    ImageCropper,
    PanThumb
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          avatar: ''
        }
      }
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.user.avatar = resData.url

      updateAvatar({
        avatar: resData.id
      }).then(response => {
        this.$message({
          message: this.$t('profile.update_avatar_success'),
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
.profile-avatar-tip {
  margin-bottom: 20px;
}
.avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>

