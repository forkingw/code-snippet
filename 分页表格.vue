<template>
  <div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :scroll="scroll"
    >
      <span slot="des" slot-scope="text">
        <ellipsis :length="20" tooltip>
          {{ text }}
        </ellipsis>
      </span>
      <template slot="member" slot-scope="text">
        <a-button type="link">
          {{ text }}
        </a-button>
      </template>
      <template slot="demandNum" slot-scope="text">
        <a-button type="link">
          {{ text }}
        </a-button>
      </template>
      <template slot="taskNum" slot-scope="text">
        <a-button type="link">
          {{ text }}
        </a-button>
      </template>
      <template slot="version" slot-scope="text">
        <a-button type="link">
          {{ text }}
        </a-button>
      </template>
      <template slot="createDate" slot-scope="text">
        {{ text | dayjs }}
      </template>
      <template slot="action" slot-scope="text, record">
        <a-space>
          <a @click="changManager(record)">变更项目经理</a>
          <a @click="mamageMember(record)">管理项目成员</a>
          <a @click="confimDeleteProject">删除</a>
        </a-space>
      </template>
    </s-table>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
export default {
  name: "Table",
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      scroll: {
        x: true,
      },
      columns: [
        {
          title: "项目ID",
          dataIndex: "id",
        },
        {
          title: "项目名称",
          dataIndex: "name",
        },
        {
          title: "项目代号",
          dataIndex: "code",
        },
        {
          title: "项目描述",
          dataIndex: "des",
          scopedSlots: { customRender: "des" },
        },
        {
          title: "项目经理",
          dataIndex: "mananger",
        },
        {
          title: "项目组成员",
          dataIndex: "member",
          scopedSlots: { customRender: "member" },
        },
        {
          title: "需求数量",
          dataIndex: "demandNum",
          scopedSlots: { customRender: "demandNum" },
        },
        {
          title: "任务数",
          dataIndex: "taskNum",
          scopedSlots: { customRender: "taskNum" },
        },
        {
          title: "版本",
          dataIndex: "version",
          scopedSlots: { customRender: "version" },
        },
        {
          title: "创建日期",
          dataIndex: "createDate",
        },
        {
          title: "创建人",
          dataIndex: "creator",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "280px",
          scopedSlots: { customRender: "action" },
          fixed: "right",
        },
      ],
    };
  },
  methods: {
    // testLoadData() {
    //   return Promise.resolve({
    //     page: 1,
    //     totalCount: 0,
    //     showSizeChanger: false,
    //     data: [
    //       {
    //         id: 1,
    //         name: "test-name",
    //         code: 11223,
    //         des: "项目描述",
    //         mananger: "胜楠",
    //         member: 12,
    //         demandNum: 3,
    //         taskNum: 2,
    //         version: 2,
    //         createDate: "2021-01-03 12:00",
    //         creator: "张硫",
    //       },
    //     ],
    //   });
    // },
    loadData (parameter) {
      return manageAuthRoleList(Object.assign({}, parameter, this.queryParam))
    },
  },
};
</script>

<style lang="less" scoped>
</style>