/**
 * 这里的 格式 和 大小校验
 * @param {File} file
 * @returns
 */

function beforeUpload (file) {
  console.log('beforeUpload')
  this.showModal()
  console.log('file', file)
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    this.$message.error('You can only upload JPG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    this.$message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}