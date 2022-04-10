<template>
  <div>
    <a-upload
      :disabled="disabled"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :remove="removePicture"
      @preview="handlePreview"
    >
      <div v-if="fileList.length === 0">
        <a-icon type="plus" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal
      :title="title"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      :width="boardWidth"
      :footer="null"
      @cancel="cancelHandel"
    >
      <div :style="{ height: boardHeight + 'px' }">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="cutWidth"
          :autoCropHeight="cutHeight"
          :fixedBox="options.fixedBox"
          :high="false"
        >
        </vue-cropper>
      </div>
      <br />
      <a-space>
        <a-button icon="plus" @click="changeScale(1)" />
        <a-button icon="minus" @click="changeScale(-1)" />
        <a-button icon="undo" @click="rotateLeft" />
        <a-button icon="redo" @click="rotateRight" />
        <a-button type="primary" @click="finish">保存</a-button>
        <a-button @click="cancelHandel">取消</a-button>
      </a-space>
    </a-modal>
    <a-modal
      title="查看图片"
      :width="cutWidth"
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import { imgUpload } from '@/api/common.js'
class UpLoadFile {
  static generatorID () {
    let idStr = Date.now().toString(36)
    idStr += Math.random()
      .toString(36)
      .substr(3)
    return idStr
  }
  constructor ({ uid, name, status, url }) {
    this.uid = uid || UpLoadFile.generatorID()
    this.name = name
    this.status = status || 'done'
    this.url = url
  }
}
export default {
  model: {
    // v-model与change绑定
    prop: 'value',
    event: 'change'
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 剪裁宽度
     */
    cutWidth: {
      type: Number,
      default: 200
    },
    /**
     * 剪裁高度
     */
    cutHeight: {
      type: Number,
      default: 200
    },
    /**
     * 剪裁板宽度
     */
    boardWidth: {
      type: Number,
      default: 800
    },
    /**
     * 剪裁板高度
     */
    boardHeight: {
      type: Number,
      default: 350
    },
    /**
     * 上传到到服务器文件夹的名字
     */
    folder: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    fileTypes: {
      type: Array,
      default: () => ['image/jpeg', 'image/png']
    }
  },
  data () {
    return {
      fileList: [],
      visible: false,
      confirmLoading: false,
      options: {
        img: '',
        autoCrop: true,
        fixedBox: true
      },
      uploadPicName: '',
      uploadPicType: '',
      previewVisible: false,
      previewImage: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (val) {
          this.fileList = [new UpLoadFile({ name: '投票主图', url: val })]
        }
      }
    }
  },
  methods: {
    /**
     * 校验 图片格式
     */
    checkPicType (file) {
      // console.log('校验 图片格式', file)
      // return file.type === 'image/jpeg' || file.type === 'image/png'
      return this.fileTypes.includes(file.type)
    },
    beforeUpload (file) {
      if (!this.checkPicType(file)) {
        this.$message.warning('上传图片格式错误！')
        return
      }
      this.uploadPicName = file.name
      this.uploadPicType = file.type
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
        this.visible = true
      }
      return false
    },
    /**
     * 删除图片
     */
    removePicture (file) {
      const fileIndex = this.fileList.findIndex(f => f.uid === file.uid)
      if (fileIndex > -1) {
        this.fileList.splice(fileIndex, 1)
      }
    },
    close () {
      this.uploadPicName = ''
      this.uploadPicType = ''
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    /**
     * 上传图片
     */
    finish () {
      const formData = new FormData()
      this.$refs.cropper.getCropBlob(data => {
        const file = new File([data], this.uploadPicName, {
          type: this.uploadPicType
        })
        formData.append('file', file)
        formData.append('folder', this.folder)
        formData.append('height', this.cutHeight)
        formData.append('width', this.cutWidth)
        this.confirmLoading = true
        imgUpload(formData)
          .then(res => {
            if (res.code === 0) {
              console.log('this.fileList', this.fileList, res)

              this.$message.success(res.message)
              this.fileList = [
                new UpLoadFile({
                  name: res.dataBody.filename,
                  url: res.dataBody.url
                })
              ]
              this.$emit('change', res.dataBody.url)
              this.cancelHandel()
            }
          })
          .finally(() => {
            this.confirmLoading = true
          })
      })
    },
    async handlePreview (file) {
      this.previewImage = file.url
      this.previewVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
