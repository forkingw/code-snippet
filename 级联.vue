<template>
  <a-cascader
    placeholder="请选择"
    allowClear
    :options="areaList"
    :fieldNames="{ label: 'areaName', value: 'areaId', children: 'children' }"
    :load-data="getGlbArea"
    v-model="queryParam.areaId"
  />
</template>

<script>
export default {
  data() {
    return {
      areaList: [],
      queryparam: {}
    }
  },
  created () {
    this.getGlbArea()
  },
  methods: {
    getGlbArea (selectedOptions = []) {
      const params = {}
      const targetOption = selectedOptions[selectedOptions.length - 1]
      const haveValue = selectedOptions.length > 0
      if (haveValue) {
        params.areaId = targetOption.areaId
        targetOption.loading = true
      }
      glbArea(params).then(res => {
        const { dataBody } = res
        if (haveValue) {
          targetOption.loading = false
          targetOption.children = dataBody
          this.areaList = [...this.areaList]
        } else {
          this.areaList = dataBody.map(d => {
            d.isLeaf = false
            return d
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  },
}
</script>

<style lang="less" scoped></style>
