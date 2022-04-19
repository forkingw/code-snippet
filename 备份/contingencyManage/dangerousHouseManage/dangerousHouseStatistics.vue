<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button style="float: right" @click="goBack">返回</a-button>
    </template>
    <a-card :bordered="false">
      <div>
        <a-table
          :data-source="tableData"
          size="default"
          rowKey="areaName"
          :columns="columns"
          :scroll="scroll"
          :pagination="false"
        >
        </a-table>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getDilapidatedStatistics } from '@/api/contingencyManage/dangerousHouseManage.js'
import { STable, Ellipsis } from '@/components'

export default {
  name: 'DangerousHouseStatistics',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      scroll: {
        x: true
      },
      columns: [
        {
          title: '区域',
          dataIndex: 'areaName',
          width: 100
        },
        {
          title: '社区上报危房（栋）',
          dataIndex: 'totalNum'
        },
        {
          title: '面积（万平方米）',
          dataIndex: 'totalArea'
        },
        {
          title: '已排查危房（栋）',
          dataIndex: 'checkNum'
        },
        {
          title: '面积（万平方米）',
          dataIndex: 'checkArea'
        },
        {
          title: '已鉴定危房（栋）',
          dataIndex: 'identifyNum'
        },
        {
          title: '面积（万平方米）',
          dataIndex: 'identifyArea'
        },
        {
          title: '未解危房屋（栋）',
          dataIndex: 'onDangerNum'
        },
        {
          title: '面积（万平方米）',
          dataIndex: 'onDangerArea',
          scopedSlots: { customRender: 'version' }
        },
        {
          title: '已解危房屋（栋）',
          dataIndex: 'offDangerNum'
        },
        {
          title: '面积（万平方米）',
          dataIndex: 'offDangerArea'
        }
      ],
      tableData: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData (parameter) {
      return getDilapidatedStatistics().then(res => {
        if (res.code === 0) {
          this.tableData = res.dataBody
        }
      })
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
