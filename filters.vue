<script>
export default {
  filters: {
      /**
     * 处理数据
     * 不合理数据展示为 '-’，并且去掉单位
     * 数字为 0 时，展示 0
     */
    handleSuffix (value, suffix = '') {
      return value !== 0 && value ? `${value}${suffix}` : '-'
    }
  }
}
</script>