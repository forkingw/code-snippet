<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" @keyup.enter="handleQuery()">
        <a-form layout="inline">
          <a-row type="flex" :gutter="48">
            <a-col v-bind="formColSpan">
              <a-form-item label="关联通知标题">
                <a-input
                  v-model.trim="queryParam.title"
                  placeholder="请输入关联通知标题"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="发起者">
                <a-cascader
                  placeholder="请选择"
                  allowClear
                  change-on-select
                  :options="sponsorList"
                  :fieldNames="{ label: 'areaName', value: 'areaId', children: 'children' }"
                  :load-data="getGlbArea"
                  v-model="area"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="事件等级">
                <a-select
                  placeholder="请选择"
                  allowClear
                  v-model="queryParam.riskWarningLevelId"
                >
                  <a-select-option v-for="(item) in eventLevelList" :value="item.optionValueId" :key="item.optionValueId">{{ item.optionName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="上报时间">
                <div style="width: 428px;">
                  <a-date-picker show-time allowClear v-model="queryParam.startTime" :format="dateFormat" :valueFormat="dateFormat" />
                  <span style="margin-left: 5px;margin-right: 5px;">——</span>
                  <a-date-picker show-time allowClear v-model="queryParam.endTime" :format="dateFormat" :valueFormat="dateFormat" />
                </div>
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
      <a-radio-group style="margin-top: 15px;margin-bottom: 15px;" button-style="solid" v-model="tabStatus" @change="handleQuery">
        <a-radio-button v-for="t in tabCountList" :key="t.tab" :value="t.tab">
          {{ t.tableName }}
          <span v-if="t.count">({{ t.count }})</span>
        </a-radio-button>
      </a-radio-group>
      <s-table
        ref="table"
        size="default"
        rowKey="noticeId"
        :columns="columns"
        :data="loadData"
        :scroll="scroll"
      >
        <template slot="des" slot-scope="text">
          <ellipsis :length="20" tooltip>
            {{ text }}
          </ellipsis>
        </template>
        <template slot="cmNoticeStatus" slot-scope="text, record">
          <AuditStatus :statusId="record.cmNoticeStatusId" :statusText="text" />
        </template>
        <template slot="riskLevel" slot-scope="text">
          <RiskLevelTag :riskLevelList="eventLevelList" :risk="text" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a @click="lookupNotice(record)">查看</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getNoticeFrontList } from '@/api/contingencyManage/preDisasterPreparation.js'
import { glbArea, dropdownList } from '@/api/common.js'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import RiskLevelTag from '../components/RiskLevelTag/index.vue'
import AuditStatus from '../components/AuditStatus/index.vue'
export default {
  name: 'EmergencyNoticeManage',
  components: {
    STable,
    Ellipsis,
    RiskLevelTag,
    AuditStatus
  },
  data () {
    return {
      formColSpan: { md: 8, sm: 24 },
      queryParam: {},
      tabStatus: 0,
      projectmanagerList: [],
      dateFormat: 'YYYY-MM-DD HH:mm',
      sponsorList: [],
      eventLevelList: [],
      area: [],
      scroll: {
        x: true
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'noticeId'
        },
        {
          title: '发起者',
          dataIndex: 'areaName'
        },
        {
          title: '事件等级',
          dataIndex: 'riskWarningLevel',
          scopedSlots: { customRender: 'riskLevel' }
        },
        {
          title: '关联应急通知',
          dataIndex: 'title',
          scopedSlots: { customRender: 'des' }
        },
        {
          title: '状态',
          dataIndex: 'disasterFrontStatus',
          scopedSlots: { customRender: 'cmNoticeStatus' }
        },
        {
          title: '上报时间',
          dataIndex: 'disasterFrontStartTime',
          customRender (text, record) {
            return text + ' 至 ' + record.disasterFrontEndTime
          }
        },
        {
          title: '操作人',
          dataIndex: 'upManageName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ],
      tabCountList: []
    }
  },
  computed: {
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
    this.getSponsorList()
    this.getEventLevel()
  },
  methods: {
    moment,
    /**
     * 获取发起者下拉列表（只有 市、县 有发起者下拉列表）
     * currentAreaLevel: 1 是 市级， 2： 区县
     */
    getSponsorList () {
      if (this.currentAreaLevel > 2) {
        return
      }
      const currentUserArea = {
        areaId: this.currentAreaId,
        areaName: this.currentArea
      }
      switch (this.currentAreaLevel) {
        case 1:
          currentUserArea.isLeaf = false
          this.sponsorList = [currentUserArea]
          break
        case 2:
          this.sponsorList = [currentUserArea]
          break
        default:
          this.sponsorList = []
          break
      }
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
      } else {
        params.areaId = this.currentAreaId
      }
      glbArea(params)
        .then(res => {
          const { code, dataBody } = res
          if (code === 0 && haveValue) {
            targetOption.loading = false
            targetOption.children = dataBody
            this.sponsorList = [targetOption]
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    /**
     * 获取事件等级列表
     */
    getEventLevel () {
      dropdownList({ dictionaryCode: 'riskWarningLevel' }).then(res => {
        if (res.code === 0) {
          this.eventLevelList = res.dataBody
        }
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
      this.area = []
      this.handleQuery()
    },
    loadData (parameter) {
      return getNoticeFrontList(Object.assign({}, parameter, this.queryParam, {
        areaId: this.area.slice(-1)[0],
        tabStatus: this.tabStatus
      })).then(res => {
        this.tabCountList = res.tabCountList
        return res
      })
    },
    /**
     * 查看
     */
    lookupNotice ({ noticeId }) {
      this.$router.push({
        name: 'disasterPreparationDetail',
        query: {
          noticeId
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
