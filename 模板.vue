<template>
  <page-header-wrapper :breadcrumb="{ props: { routes: $store.getters.customRoutes, itemRender: defaultItemRender } }">
    <!-- <template v-slot:extra>
      <a-button style="float: right" @click="goBack">返回</a-button>
    </template> -->
    <a-card :bordered="false">
     
    </a-card>
  </page-header-wrapper>
</template>

<script>

export default {
  name: '',
  // methods: {
  // goBack () {
  //   this.$router.back()
  // }
}
</script>

<style lang="less" scoped>

</style>
