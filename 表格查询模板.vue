<template>
  <page-header-wrapper :breadcrumb="{ props: { routes: $store.getters.customRoutes, itemRender: defaultItemRender } }">
    <a-card :bordered="false">
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
                <a-button
                  style="margin-left: 8px"
                  @click="resetSearchForm"
                >重置</a-button
                >
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
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
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'

export default {
  name: 'JiaxingEvaluation',
    components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      formColSpan: { md: 6, sm: 24 },
      queryParam: {},
      projectmanagerList: [],
      scroll: {
        x: true
      },
      columns: [
        {
          title: '项目ID',
          dataIndex: 'id'
        },
        {
          title: '项目名称',
          dataIndex: 'name'
        },
        {
          title: '项目代号',
          dataIndex: 'code'
        },
        {
          title: '项目描述',
          dataIndex: 'des',
          scopedSlots: { customRender: 'des' }
        },
        {
          title: '项目经理',
          dataIndex: 'mananger'
        },
        {
          title: '项目组成员',
          dataIndex: 'member',
          scopedSlots: { customRender: 'member' }
        },
        {
          title: '需求数量',
          dataIndex: 'demandNum',
          scopedSlots: { customRender: 'demandNum' }
        },
        {
          title: '任务数',
          dataIndex: 'taskNum',
          scopedSlots: { customRender: 'taskNum' }
        },
        {
          title: '版本',
          dataIndex: 'version',
          scopedSlots: { customRender: 'version' }
        },
        {
          title: '创建日期',
          dataIndex: 'createDate'
        },
        {
          title: '创建人',
          dataIndex: 'creator'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '280px',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ]
    }
  },
  methods: {
    loadData () {
      return Promise.resolve({
        page: 1,
        totalCount: 0,
        showSizeChanger: false,
        data: [
          {
            id: 1,
            name: 'test-name',
            code: 11223,
            des: '项目描述',
            mananger: '胜楠',
            member: 12,
            demandNum: 3,
            taskNum: 2,
            version: 2,
            createDate: '2021-01-03 12:00',
            creator: '张硫'
          }
        ]
      })
    },
    handleQuery (bool) {
      this.$nextTick(() => {
        this.$refs.table.refresh(!bool)
      })
    },
    // 重置搜索
    resetSearchForm () {
      this.queryParam = {}
      this.handleQuery()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
