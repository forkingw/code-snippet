<template>
  <div>
    <a-tag v-if="riskId !== 0" :color="color">
      {{ risk }}
    </a-tag>
    <span v-else>-</span>
  </div>

</template>

<script>
  export default {
    name: 'RiskLevelTag',
    props: {
      riskLevelList: {
        type: Array,
        default: () => []
      },
      risk: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        colorList: {
          1: 'red',
          2: 'orange',
          3: 'yellow',
          4: 'blue'
        }
      }
    },
    computed: {
      riskId () {
        return this.riskLevelList.find(r => r.optionName === this.risk)?.optionValueId
      },
      color () {
        return this.colorList[this.riskId]
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
