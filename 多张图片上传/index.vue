<template>
  <div class="enterprises-photo">
    <div class="enterprises-photo-title">
      <span>图片上传</span>
      <span
        class="up-number"
      >{{ fileList.length }}/{{ limitPhtotTotal }}</span
      >
    </div>
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
        :multiple="multiple"
      >
        <div v-if="fileList.length < limitPhtotTotal">
          <a-icon type="plus" />
        </div>
      </a-upload>
    </div>
    <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { getBase64 } from '@/utils/util'
export default {
  name: 'EnterprisesUpload',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [Array, String],
      default: () => []
    },
    /**
     * 物业企业上传照片能够上传的照片数量
     */
    limitPhtotTotal: {
      type: Number,
      default: 4
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fileTypes: {
      type: Array,
      default: () => ['bmp', 'png', 'jpeg', 'jpg', 'gif']
    },
    /**
     * 是否指出多选
     */
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
     if (Array.isArray(val)) {
        this.fileList = val.map((v, i) => ({
          uid: i,
          name: 'name' + i,
          status: 'done',
          url: v
        }))
      } else {
        this.fileList = []
      }
    }
  },
  data () {
    return {
      action:
        process.env.VUE_APP_API_UPLOADIMAGE_URL + '/third/upload/upload-pic',
      // 物业企业上传照片
      fileList: [],
      previewVisible: false,
      previewImage: '',
      uploadParams: {}
    }
  },
  methods: {
    /**
     * 物业照片上传， upload 组件触发 change 事件
     */
    handleChange (info) {
      const { fileList } = info
      this.fileList = fileList.slice(0, this.limitPhtotTotal)
      const isAllDone = this.fileList.every(file => file.status === 'done')
      if (isAllDone) {
        const urlArr = fileList.map(f => f.url || f?.response?.dataBody?.url)
        this.$emit('change', urlArr)
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
          const errMessage = `请上传格式为${this.fileTypes.toString()}的图片`
          this.$message.error(errMessage)
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

<style lang="less" scoped>
.enterprises-photo {
  border: 1px solid #dbdbdb;
  padding: 5px 15px;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
