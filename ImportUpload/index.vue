<template>
  <div class="filingDocuments">
    <a-upload
      name="file"
      :showUploadList="false"
      :customRequest="customRequest"
    >
      <a-button type="primary">导入</a-button>
    </a-upload>
  </div>
</template>

<script>
import { importEmployeeByExcel } from '@/api/projectManage.js'
export default {
  name: 'ImportUpload',
  methods: {
    customRequest ({ file }) {
      const data = new FormData()
      data.append('multipartFile', new Blob([file]))
      importEmployeeByExcel(data).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.$emit('handleQuery')
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filingDocuments {
  display: flex;
  a {
    margin-left: 10px;
  }
}
</style>
