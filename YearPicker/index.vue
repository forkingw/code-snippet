<template>
  <a-date-picker
    ref="yeanPicker"
    v-model="year"
    mode="year"
    placeholder="请选择年份"
    :format="yearFormat"
    :valueFormat="yearFormat"
    :open="isOpen"
    :allowClear="allowClear"
    @openChange="onOpenChange"
    @panelChange="yearPanelChange"
    @change="yeanChange" />
</template>

<script>
export default {
  name: 'YeanPicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    allowClear: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      yearFormat: 'YYYY',
      isOpen: false,
      year: this.value
    }
  },
  watch: {
    value (val) {
      this.year = val
    }
  },
  methods: {
    onOpenChange (status) {
      this.isOpen = status
    },
    /**
     * 日期面板变化时的回调
     */
    yearPanelChange (value) {
      const year = value.format(this.yearFormat)
      this.year = year
      this.$emit('change', year)
      this.isOpen = false
    },
    yeanChange (date) {
      if (!date) {
         this.$emit('change', null)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
