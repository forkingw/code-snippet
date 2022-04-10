<template>
  <div></div>
</template>

<script>
// TODO 引入 导出接口 和 辅助的工具函数
import { exportDemandList } from "@/api/coordination/demandManage.js";
import { downloadTool } from "@/utils/util";
export default {
  methods: {
    /**
     * 导出需求列表
     */
    exportDemandList() {
      exportDemandList(this.queryParam)
        .then((res) => {
          downloadTool(res);
        })
        .catch((err) => {
          console.log("导出", err);
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
