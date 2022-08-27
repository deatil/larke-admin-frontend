<template>
  <div class="components-container">
    <pan-thumb :image="data.avatar" />

    <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
      {{ $t('选择头像') }}
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
  name: 'AdminAvatar',
  components: {
    ImageCropper,
    PanThumb
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          avatar: '',
          avatarKey: ''
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
      this.data.avatar = resData.url
      this.data.avatarKey = resData.id
    },
    close() {
      this.imagecropperShow = false
    }
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

