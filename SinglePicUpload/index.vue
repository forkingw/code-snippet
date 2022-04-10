<template>
  <div>
    <div>
      <a-upload
        :action="action"
        list-type="picture-card"
        :file-list="fileList"
        :data="uploadParams"
        :before-upload="beforeUpload"
        @change="handleChange"
        @preview="handlePreview"
        :disabled="disabled"
      >
        <div v-if="fileList.length < limitPhtotTotal">
          <a-icon type="plus" />
        </div>
      </a-upload>
    </div>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { getBase64 } from '@/utils/util'
export default {
  name: 'SinglePicUpload',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 上传照片能够上传的照片数量
     */
    limitPhtotTotal: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      if (typeof val === 'string' && val) {
        this.fileList = [
          {
            uid: '1',
            name: val,
            status: 'done',
            url: val
          }
        ]
      } else {
        this.fileList = []
      }
    }
  },
  data () {
    return {
      action:
        process.env.VUE_APP_API_UPLOADIMAGE_URL + 'third/upload/upload-pic',
      // 上传照片列表
      fileList: [],
      previewVisible: false,
      previewImage: '',
      fileTypes: ['bmp', 'png', 'jpeg', 'jpg', 'gif'],
      uploadParams: {}
    }
  },
  methods: {
    /**
     * 照片上传， upload 组件触发 change 事件
     */
    handleChange (info) {
      const { fileList, file } = info
      this.fileList = fileList
      if (['done', 'removed'].includes(file.status)) {
        const urlArr = this.fileList.map(f => f.url || f.response.dataBody.url)
        if (urlArr?.length) {
          this.$emit('change', urlArr[0])
        } else {
          this.$emit('change', '')
        }
      }
    },
    /**
     * ant-design-vue upload 组件的 预览方法回调
     */
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    /**
     * 图片上传前，校验图片大小
     * 小于 2M
     */
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        const type = file.type.split('/')[1]
        const isImg = this.fileTypes.includes(type)
        if (!isImg) {
          this.$message.error('请上传格式为bmp、png、jpeg、jpg或gif的图片')
          return reject(new Error(false))
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传图片大小必须小于2MB')
          return reject(new Error(false))
        }
        this.uploadParams.size = file.size
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const image = new Image()
          image.src = reader.result
          image.onload = () => {
            const width = image.width
            const height = image.height
            this.uploadParams = {
              width,
              height
            }
            return resolve(true)
          }
        }
      })
    }
  }
}
</script>
