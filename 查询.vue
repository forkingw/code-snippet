<template>
  <div class="table-page-search-wrapper" @keyup.enter="handleQuery()">
    <a-form layout="inline">
      <a-row :gutter="48">
        <a-col v-bind="formColSpan">
          <a-form-item label="项目ID">
            <a-input
              v-model.trim="queryParam.roleName"
              placeholder="请输入"
              allowClear
            />
          </a-form-item>
        </a-col>
        <a-col v-bind="formColSpan">
          <a-form-item label="项目经理">
            <a-select
              placeholder="请选择"
              allowClear
              :getPopupContainer="(triggerNode) => triggerNode.parentNode"
              v-model="queryParam.projectmanager"
            >
              <a-select-option v-for="d in projectmanagerList" :key="d">
                {{ d }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col v-bind="formColSpan">
          <a-form-item>
            <a-button type="primary" @click="handleQuery()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearchForm"
              >重置</a-button
            >
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formColSpan: { md: 6, sm: 24 },
      queryParam: {},
      projectmanagerList: []
    };
  },
  methods: {
    handleQuery(bool) {
      this.$nextTick(() => {
        this.$refs.table.refresh(!bool);
      });
    },
    // 重置搜索
    resetSearchForm() {
      this.queryParam = {};
      this.handleQuery();
    },
  },
};
</script>
