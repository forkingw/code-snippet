- 使用 axios
```javascript
// 注意 headers
export function importEmployeeByExcel (data) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/manage/biz/floorEmployee/importExcel',
    method: 'post',
    data
  })
}

// 注意 new FormData() 
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
```
