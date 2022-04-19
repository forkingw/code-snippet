<template>
  <a-cascader
    :placeholder="placeholder"
    :allowClear="allowClear"
    change-on-select
    :options="areaList"
    :fieldNames="{ label: 'areaName', value: 'areaId', children: 'children' }"
    :load-data="getGlbArea"
    :value="area"
    @change="onChange"
  />
</template>
<script>
import { glbArea } from '@/api/common'
export default {
  name: 'AreaCascader',
  model: {
    prop: 'area',
    event: 'change'
  },
  props: {
    allowClear: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    /**
     * v-model 默认参入的值
     */
    area: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      areaList: []
    }
  },
  computed: {
    /**
     * 当前用户的所属级别的 区域名称
     */
    currentArea () {
      return this.$store.getters?.userInfo?.currentArea
    },
    /**
     * 当前用户的所属级别的 区域Id
     */
    currentAreaId () {
      return this.$store.getters?.userInfo?.currentAreaId
    },
    /**
     * 当前用户所属级别
     * 市 县区 街道 社区
     */
    currentAreaLevel () {
      return this.$store.getters?.userInfo?.currentAreaLevel
    }
  },
  created () {
    this.initAreaList()
  },
  methods: {
    initAreaList () {
      if (this.currentAreaLevel === 1) {
        this.getGlbArea()
        return
      }
      const tempCity = {
        areaId: this.currentAreaId,
        areaName: this.currentArea
      }
      if (this.currentAreaLevel && this.currentAreaLevel < 4) {
        tempCity.isLeaf = false
      }
      this.areaList = [tempCity]
    },
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
      }
      glbArea(params).then(res => {
        const { dataBody } = res
        if (haveValue) {
          targetOption.loading = false
          targetOption.children = !dataBody ? dataBody : dataBody.map(d => {
            d.isLeaf = !d.number
            return d
          })
          this.areaList = [...this.areaList]
        } else {
          this.areaList = dataBody.map(d => {
            d.isLeaf = !d.number
            return d
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    onChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
