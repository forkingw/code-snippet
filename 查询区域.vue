<template>
  <a-cascader
    placeholder="请选择"
    allowClear
    change-on-select
    :options="areaList"
    :fieldNames="{ label: 'areaName', value: 'areaId', children: 'children' }"
    :load-data="getGlbArea"
    v-model="area"
  />
</template>

<script>
export default {
  data() {
    return {
      areaList: [],
      area: []
    };
  },
  created() {
    this.getGlbArea();
  },
  methods: {
    /**
     * 获取区域地址 级联数据
     */
    getGlbArea (selectedOptions = []) {
      const params = {}
      const level = selectedOptions.length
      const targetOption = selectedOptions[level - 1]
      const haveValue = level !== 0
      if (haveValue) {
        params.areaId = targetOption.areaId
        targetOption.loading = true
      } else if (level === 3) return
      glbArea(params).then(res => {
        const { dataBody } = res
        if (haveValue) {
          targetOption.loading = false
          targetOption.children = !dataBody ? dataBody : dataBody.map(d => {
            if (level < 2) {
              d.isLeaf = false
            }
            return d
          })
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
    },
  },
};
</script>

<style lang="less" scoped></style>
