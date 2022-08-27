<template>
  <div class="upload-container">
    <el-upload
      v-show="imgUrl.length<=1"
      ref="upload"
      drag
      action="string"
      accept="image/jpeg,image/png,image/jpg"
      class="image-uploader"
      :multiple="false"
      :show-file-list="false"
      :before-upload="onBeforeUploadImage"
      :http-request="UploadImage"
      :on-change="fileChange"
      :on-success="handleImageSuccess"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
    <div v-show="imgUrl.length>1" class="image-preview">
      <div class="image-preview-wrapper">
        <img :src="imgUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAttachmentDetail,
  uploadAttachment
} from '@/api/attachment'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imgId: '',
      imgUrl: '',

      tempRaw: '',
      tempName: '',
      tempUrl: ''
    }
  },
  computed: {
    imageId() {
      return this.value
    }
  },
  created() {
    this.getAttachment()
  },
  methods: {
    rmImage() {
      this.imgId = ''
      this.imgUrl = ''

      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess() {

    },

    getAttachment() {
      if (this.imageId && this.imageId.length > 0) {
        getAttachmentDetail(this.imageId).then(response => {
          const data = response.data
          this.imgId = data.id
          this.imgUrl = data.url
        })
      }
    },

	  onBeforeUploadImage(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isIMAGE && isLt1M
    },
    UploadImage(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      uploadAttachment(formData).then(response => {
        const data = response.data
        this.imgId = data.id
        this.imgUrl = data.url

        this.emitInput(this.imgId)

        param.onSuccess()
      }).catch(response => {
        param.onError()
      })
    },
    fileChange(file) {
      this.$refs.upload.clearFiles() // 清除文件对象
      this.tempRaw = file.raw
      this.tempName = file.name
      this.tempUrl = file.url
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/mixin.scss";
    .upload-container {
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 60%;
            float: left;
            margin-right: 50px;
        }
        .image-preview {
            width: 200px;
            height: 200px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            .image-preview-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .image-preview-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
                transition: opacity .3s;
                cursor: pointer;
                text-align: center;
                line-height: 200px;
                .el-icon-delete {
                    font-size: 36px;
                }
            }
            &:hover {
                .image-preview-action {
                    opacity: 1;
                }
            }
        }
    }

</style>
