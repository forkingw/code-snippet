<template>
  <a-form-item
    label="合同上传"
    :labelCol="drawerConfig.labelCol"
    :wrapperCol="drawerConfig.wrapperCol"
    extra="支持扩展名：*.pdf、*.doc、*.docx、*.jpg、*.jpeg、*.png、*.gif 、*.bmp"
  >
    <a-upload
      :action="action"
      :headers="headers"
      :file-list="fileList"
      :data="{ folder: 'files' }"
      :before-upload="beforeUpload"
      @change="handleChange"
      @preview="handleDownload"
    >
      <a-button>
        <a-icon type="upload" />
        Upload
      </a-button>
    </a-upload>
  </a-form-item>
</template>

<script>
import { handleDownload } from '@/utils/util'
export default {
  data() {
    return {
      action: "",
      headers: {},
      fileList: []
    };
  },
  created() {
    this.headers = { Authorization: this.$store.getters.token };
  },
  methods: {
    beforeUpload(file) {
      const that = this;
      const { size } = file;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // that.uploadType = type.indexOf('image') > -1 ? 'image' : 'application'
        that.action = `${process.env.VUE_APP_API_UPLOAD_URL}/upload/fileUp`;
        if (size > 20 * 1024 * 1024) {
          this.$message.warning("文件过大，请小于20MB。");
          return reject(new Error(false));
        }
        return resolve(true);
      });
    },
    handleChange (info) {
      let fileList = [...info.fileList]
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1)

      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = `${file.response.dataBody.objectName}`
        }
        return file
      })

      this.fileList = fileList
    },
    handleDownload (record) {
      const { url: contractFile } = record
      handleDownload({
        objectName: contractFile
      })
    },
  },
};
</script>

<style lang="less" scoped></style>
