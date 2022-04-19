<template>
  <a-upload
    :disabled="disabled"
    :action="uploadUrl"
    :headers="headers"
    :file-list="fileList"
    @change="handleChange"
    :data="{'folder':folder}"
    :multiple="multiple"
    :before-upload="beforeUpload"
  >
    <a-button :disabled="disabled">
      上传文件
    </a-button>
  </a-upload>
</template>

<script>

export default {
  name: 'UploadMultiple',
  data () {
    return {
      headers: {},
      previewVisible: false,
      previewImage: '',
      uploadUrl: `${process.env.VUE_APP_API_UPLOAD_URL}/third/upload/upload-file`,
      file: {},
      fileList: []
    }
  },
  props: {
    /* 这个属性用于控制文件上传的业务路径 后端会以该名称建立文件夹保存文件 */
    folder: {
      type: String,
      default: 'uploadFolder'
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    fileTypes: {
      type: Array,
      default: () => ['doc', 'docx', 'pdf', 'jpg']
    }
  },
  model: { // v-model与change绑定
    prop: 'value',
    event: 'change'
  },
  watch: {
    // 监听value值变化，初始化上传组件回显
    value (val) {
      if (Array.isArray(val)) {
        this.fileList = val.map((v, i) => ({
          uid: v.fileUrl,
          fileId: v.fileId,
          name: v.fileName,
          fileName: v.fileName,
          status: 'done',
          url: v.fileUrl,
          fileUrl: v.fileUrl
        }))
      } else {
        this.fileList = []
      }
    }
  },
  created () {
    this.headers = { 'Authorization': this.$store.getters.token }
  },
  methods: {
    // 上传组件值变化
    handleChange (info) {
      const { fileList, file } = info
      if (['done', 'removed'].includes(file.status)) {
        const urlArr = fileList.map(f => ({
          fileId: f.fileId || 0,
          fileName: f.name,
          fileUrl: f.fileUrl || f.response.dataBody.url
        }))
        this.$emit('change', urlArr)
      }
      this.fileList = fileList
    },
    beforeUpload (file, fileList) {
      return new Promise((resolve, reject) => {
        const type = file.name.split('.').slice(-1)[0]
        const isGood = this.fileTypes.includes(type)
        if (!isGood) {
          this.$message.error(`请上传格式为${this.fileTypes.join(',')}的文件`)
          return reject(new Error(false))
        }

        return resolve(true)
      })
      // const type = file.name.split('.').slice(-1)[0]
      // const isGood = this.fileTypes.includes(type)
      // if (!isGood) {
      //   this.$message.error(`请上传格式为${this.fileTypes.join(',')}的文件`)
      // }
      // return isGood
    }
  }
}
</script>

<style lang="less" scoped>
.clearfix() {
  zoom: 1;
  &::before,
  &::after {
    display: table;
    content: ' ';
  }
  &::after {
    clear: both;
    height: 0;
    font-size: 0;
    visibility: hidden;
  }
}
</style>
