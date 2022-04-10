# 文件导入上传

使用到了： ant-design-vue UI 框架的  `<a-upload> 组件`

使用场景：在列表页，需要导入模板文件进行上传数据

组件里使用自定义上传，去掉了 已上传文件列表显示

上传的数为 FormData 格式的数据

其中将上传的 file 格式的文件通过 Blob 转化 成了 二进制的数据流

上传接口例子如下：

```javascript
export function importEmployeeByExcel (data) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: '/manage/biz/floorEmployee/importExcel',
    method: 'post',
    data
  })
}
```

> Blob IE10 可用，部分方法不支持 **(arrayBuffer())、stream()、text()))\)**

- axios 如何上传 FormData 格式的数据？
- 如何将 File 文件的格式，转化为 二进制 格式？
- ant-desigin-vue 如何使用自定义上传？
