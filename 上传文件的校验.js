/**
 * 这里的 格式 和 大小校验
 * @param {File} file
 * @returns
 */

function beforeUpload (file) {
  this.showModal()
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

/**
 * 上传前校验格式
 * 多张图片时，应该使用 Promise
 * @param {File} file 
 * @returns {Promise}
 */
function beforeUpload (file) {
  return new Promise((resolve, reject) => {
    const type = file.name.split('.').slice(-1)[0]
    console.log('file', type)
    const isGood = this.fileTypes.includes(type)
    if (!isGood) {
      this.$message.error('请上传格式为.doc .docx .pdf .jpg的文件')
      return reject(new Error(false))
    }

    return resolve(true)
  })
}