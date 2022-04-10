# 图片上传时裁剪
用的组件
- a-modal
- a-upload
- vue-cropper
- a-button

包含了 上传、裁剪、预览 功能

组件的使用
```html
<!-- vue -->
<PictureCropper
  v-model="form.subjectPhoto"
  :fileTypes="['image/jpeg', 'image/png']"
  :cutWidth="750"
  :cutHeight="300"
  :boardHeight="350"
  :boardWidth="1000"
  :high="false" />
```

> 注意， 在 mac 笔记本上，截图的真实大小可能根据 dpr 来决定，最高关闭 high
