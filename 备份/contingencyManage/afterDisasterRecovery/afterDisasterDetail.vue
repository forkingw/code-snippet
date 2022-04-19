<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="alert-message">
        <a-alert
          v-bind="{...alertStatus}"
          show-icon
        >
          <a-icon v-if="alertStatus.status === 0" slot="icon" type="clock-circle" theme="filled" style="color: #1990FF;font-size: 20px;" />
          <a-icon v-if="alertStatus.status === 1" slot="icon" type="info-circle" style="color: #20bf5f;font-size: 18px;" />
          <a-icon v-if="alertStatus.status === -1" slot="icon" type="info-circle" style="color: #ff0909;font-size: 18px;" />
        </a-alert>
      </div>

      <a-card title="区县统计">
        <a-table rowKey="noticeId" :columns="statisticsColumns" :data-source="tableData" :pagination="false"> </a-table>
      </a-card>
      <a-card title="物业公司">
        <div class="table-page-search-wrapper" @keyup.enter="handleQuery()">
          <a-form layout="inline">
            <a-row type="flex" :gutter="48">
              <a-col v-bind="formColSpan" v-if="currentAreaLevel === 1">
                <a-form-item label="区域">
                  <a-select v-model="queryParam.areaId">
                    <a-select-option v-for="s in sponsorList" :value="s.areaId" :key="s.areaId">
                      {{ s.areaName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col v-bind="formColSpan">
                <a-form-item label="小区名称">
                  <a-input
                    v-model.trim="queryParam.floor"
                    placeholder="请输入小区名称"
                    allowClear
                  />
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
        <div style="margin-top: 10px;margin-bottom: 15px;">
          <a-button v-action:export type="primary" @click="exportDisasterList">导出</a-button>
        </div>
        <a-radio-group style="margin-top: 15px;margin-bottom: 15px;" button-style="solid" v-model="isReport" @change="handleQuery">
          <a-radio-button v-for="t in tabCountList" :key="t.tab" :value="t.tab">
            {{ t.tableName }}
            <span v-if="t.count">({{ t.count }})</span>
          </a-radio-button>
        </a-radio-group>
        <s-table
          ref="table"
          size="default"
          rowKey="floorId"
          :columns="columns"
          :data="loadData"
          :scroll="scroll"
        >
          <template slot="action" slot-scope="text, record">
            <a-space>
              <a v-if="isReport === 1" @click="lookupNotice(record)">查看信息</a>
            </a-space>
          </template>
        </s-table>
      </a-card>
    </a-card>
    <DisasterAfterDetail ref="disasterAfterDetailRef" />
  </page-header-wrapper>
</template>

<script>
import { getDisasterAfterReport, getAfterPropertyList, exportDisasterAfterList } from '@/api/contingencyManage/afterDisasterRecovery.js'
import { glbArea } from '@/api/common.js'
import { STable, Ellipsis } from '@/components'
import { fileDownClick } from '@/utils/util.js'
import DisasterAfterDetail from './modules/DisasterAfterDetail.vue'
export default {
  name: 'DisasterPreparationDetail',
  components: {
    STable,
    Ellipsis,
    DisasterAfterDetail
  },
  data () {
    return {
      noticeId: null,
      statisticsColumns: [
        {
          title: 'ID',
          dataIndex: 'noticeId'
        },
        {
          title: '区域',
          dataIndex: 'areaName'
        },
        {
          title: '出动防汛人员数（人）	',
          dataIndex: 'peopleTotal'
        },
        {
          title: '安置人数（人）',
          dataIndex: 'arrangeTotal'
        },
        {
          title: '受伤人数（人）',
          dataIndex: 'injuredTotal'
        },
        {
          title: '出动防汛设施设备（台）',
          dataIndex: 'equipmentTotal'
        },
        {
          title: '投入抢险物资（包/件）',
          dataIndex: 'materialTotal'
        },
        {
          title: '发生严重捞点数（处）',
          dataIndex: 'waterloggingTotal'
        },
        {
          title: '清理倒伏树木（棵）',
          dataIndex: 'treeTotal'
        }
      ],
      tableData: [],
      formColSpan: { md: 8, sm: 24 },
      scroll: {
        x: true
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'floorId'
        },
        {
          title: '区域',
          dataIndex: 'areaName',
          customRender (text, record) {
            return `${text}/${record.floor}`
          }
        },
        {
          title: '物业公司',
          dataIndex: 'propertyCompany'
        },
        {
          title: '出动防汛人员配备数（人）	',
          dataIndex: 'peopleTotal'
        },
        {
          title: '安置人数（人）',
          dataIndex: 'arrangeTotal'
        },
        {
          title: '受伤人数（人）',
          dataIndex: 'injuredTotal'
        },
        {
          title: '跟进状态',
          dataIndex: 'status'
        },
        {
          title: '跟进时间',
          dataIndex: 'addTime'
        },
        {
          title: '提报人',
          dataIndex: 'svManageName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '100px',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ],
      tabCountList: [],
      sponsorList: [],
      queryParam: {},
      isReport: 1,
      reportStatus: {}
    }
  },
  computed: {
    alertStatus () {
      // status: 间隔时间（未开始.0，已开始.1，已结束.-1）
      const { intervalStr, status } = this.reportStatus
      let type = ''
      let message = ''
      switch (status) {
        case 0:
          type = 'info'
          message = '灾后上报未开始'
          break
        case 1:
          type = 'success'
          message = `灾后上报进行中，距离上报结束还有${intervalStr}`
          break
        case -1:
          type = 'warning'
          message = '灾后上报已结束'
          break
        default:
          type = 'info'
          break
      }
      return {
        type,
        message,
        status
      }
    },
    /**
     * 当前用户的所属级别的 区域名称
     */
    currentArea () {
      return this.$store.state?.user?.info?.currentArea
    },
    /**
     * 当前用户的所属级别的 区域Id
     */
    currentAreaId () {
      return this.$store.state?.user?.info?.currentAreaId
    },
    /**
     * 当前用户所属级别
     */
    currentAreaLevel () {
      return this.$store.state?.user?.info?.currentAreaLevel
    }
  },
  created () {
    this.noticeId = this.$route.query.noticeId
    this.getSponsorList()
    this.getDisasterFrontInfo()
  },
  methods: {
    /**
     * 获取区域地址数据
     */
    getSponsorList () {
      glbArea().then(res => {
        if (res.code === 0) {
          this.sponsorList = res.dataBody
        }
      })
    },
    getDisasterFrontInfo () {
      getDisasterAfterReport(this.noticeId).then(res => {
        if (res.code === 0) {
          this.reportStatus = res.dataBody
          this.tableData = res.dataBody.reportBOList
        }
      })
    },
    loadData (parameter) {
      return getAfterPropertyList(Object.assign({}, parameter, this.queryParam, {
        noticeId: this.noticeId,
        isReport: this.isReport
      })).then(res => {
        this.tabCountList = res.tabCountList
        return res
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
    },
    lookupNotice ({ floorId }) {
      this.$refs.disasterAfterDetailRef.showDrawer(floorId, this.noticeId)
    },
    exportDisasterList () {
      const params = Object.assign({}, this.queryParam, {
        noticeId: this.noticeId,
        isReport: this.isReport,
        page: this.$refs.table.pageNum,
        pageSize: this.$refs.table.pageSize
      })
      exportDisasterAfterList(params).then(res => {
        fileDownClick({
          res,
          fileName: '灾后恢复.xls'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.alert-message {
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>
