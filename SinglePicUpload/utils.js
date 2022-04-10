export function handleDownload (obj) {
  const { fileName = 'donwload', fileUrl } = obj
  const data = {
    fileName,
    fileUrl
  }
  fileDown(data).then(res => {
    const blob = new Blob([res.data]) // 构造一个blob对象来处理数据
    const originName = fileUrl.split('/').slice(-1)[0]
    // 下载的文件类型 (.docx)
    let fileType = ''
    if (originName) {
      const index = originName.lastIndexOf('.')
      fileType = originName.substring(index)
    }

    const downName = fileName + fileType
    // 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
    // IE10以上支持blob但是依然不支持download
    if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
      const link = document.createElement('a') // 创建a标签
      link.download = downName// a标签添加属性
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click() // 执行下载
      URL.revokeObjectURL(link.href) // 释放url
      document.body.removeChild(link) // 释放标签
    } else {
      navigator.msSaveBlob(blob, downName)
    }
  })
}