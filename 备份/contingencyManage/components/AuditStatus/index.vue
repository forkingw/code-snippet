<template>
  <div>
    <a-badge :status="status" :text="statusText" />
  </div>
</template>

<script>
  export default {
    name: 'AuditStatus',
    props: {
      statusId: {
        type: Number,
        default: 0
      },
      statusText: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        // colorList: ['processing', 'warning', 'success', 'error'],
        /**
         * 0.录入中，1.提交审核中，2.审核通过，-1.审核不通过
         */
        colorList: {
          0: 'processing',
          1: 'warning',
          2: 'success',
          '-1': 'error'
        }
      }
    },
    computed: {
      status () {
        return this.colorList[this.statusId]
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
