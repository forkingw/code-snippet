<template>
  <div class="pdf-wrapper">
    <div class="pdf-content">
      <a-spin :spinning="spinning" :tip="tip" wrapperClassName="pdf-container">
        <pdf
          style="margin: 15px 0;"
          v-for="i in numPages"
          :key="i"
          :src="url"
          :page="i"
          @page-loaded="pdfPageLoad"
          @error="pdfError" />
      <!-- <a-space class="btn-con">
        <a-button type="dashed" @click="prePage">上一页</a-button>
        <span>
          <a-input-number v-model="pageNum" size="small" :min="1" :max="100000" @change="onChange" />
          / {{ numPages }}
        </span>
        <a-button type="dashed" @click="nextPage">下一页</a-button>
      </a-space> -->
      </a-spin>
    </div>
  </div>
</template>

<script>
import { excelToPdf } from '@/api/projectManage.js'
import pdf from 'vue-pdf'
export default {
  name: 'PdfPreview',
  components: {
    pdf
  },
  props: {
    appendix: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      spinning: true,
      url: '',
      // pageNum: 1,
      /**
       * pdf 总页数
       */
      numPages: 1,
      /**
       * 加载提示
       */
      tip: '加载中...'
    }
  },
  watch: {
    appendix (val) {
      if (val) {
        this.handleAppendix(val)
      }
    },
    url (val) {
      // 如果 url 存在，则可以去获取 pdf 总页数
      if (val) {
        this.url.promise.then(pdf => {
          console.log('pdf 加载成功', pdf)
          this.numPages = pdf.numPages
        })
      }
    }
  },
  destroyed () {
    URL.revokeObjectURL(this.url)
  },
  methods: {
    /**
     * 根据附件地址，处理为 pdf组件可用的 数据格式
     * 1. 判断有无 附件
     * 2. 判断附件类型
     *   2.1 如果是 pdf 格式，直接 url 赋值
     *   2.2 如果是 xls、xlsx 格式，使用 接口，转换为 pdf 格式的文件流
     *     2.2.1 将文件流下载到本地，转换成 blob ，使用  URL 转换成可用的 url， 赋值给 url
     */
    handleAppendix (appendix) {
      if (!appendix) {
        return
      }
      const suffixIndex = appendix.lastIndexOf('.')
      const suffix = appendix.substr(suffixIndex + 1)
      if (suffix === 'pdf') {
        this.url = pdf.createLoadingTask(appendix)
      } else if (['xls', 'xlsx'].includes(suffix)) {
        this.handleExcelUrlToPdf(appendix).then(res => {
          this.url = pdf.createLoadingTask(res)
        })
      }
    },
    /**
     * 将 excel 转成 pdf 流
     */
    handleExcelUrlToPdf (url) {
      return excelToPdf(url).then(res => {
        const blob = new Blob([res]) // 构造一个blob对象来处理数据
        const url = URL.createObjectURL(blob)
        return url
      })
    },
    // onChange (num) {
    //   var p = num
    //   p = p < this.numPages ? p + 1 : 1
    //   this.pageNum = p
    // },
    // prePage () {
    //   var p = this.pageNum
    //   p = p > 1 ? p - 1 : this.numPages
    //   this.pageNum = p
    // },
    // nextPage () {
    //   var p = this.pageNum
    //   p = p < this.numPages ? p + 1 : 1
    //   this.pageNum = p
    // },
    pdfPageLoad () {
      this.spinning = false
      // this.currentPage = e
    },
    pdfError (error) {
      console.error(error)
      this.spinning = false
    }
  }
}
</script>

<style lang="less" scoped>
// .btn-con {
//   padding-top: 20px;
//   text-align: center;
//   margin-left: 50%;
//   transform: translateX(-50%);
// }
.pdf-wrapper {
  text-align: center;
  background-color: silver;
  height: 95vh;
  overflow-y: auto;
}
.pdf-content {
  width: 65%;
  max-width: 960px;
  min-width: 550px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 15px;
  padding-bottom: 15px;
}
.pdf-container /deep/ .ant-spin-container::after {
  background-color: transparent;
}
</style>
