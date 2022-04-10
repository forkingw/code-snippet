<template>
  <a-input-number
    v-model="queryParam.userId"
    placeholder="请输入"
    allowClear
    style="width: 100%"
  />
</template>

<style lang="less" scoped>
::v-deep .ant-input-number-handler-wrap {
  display: none;
}
</style>
