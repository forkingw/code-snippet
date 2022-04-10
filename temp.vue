<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" @keyup.enter="handleQuery()">
        <a-form layout="inline">
          <a-row type="flex" :gutter="48">
            <a-col v-bind="formColSpan">
              <a-form-item label="通知标题">
                <a-input
                  v-model.trim="queryParam.title"
                  placeholder="请输入通知标题："
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
              <a-form-item label="创建时间">
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
      <div>
        <a-button type="primary" icon="plus" @click="addEmergencyNotice" v-action:add>新建</a-button>
      </div>
      <a-radio-group style="margin-top: 15px;margin-bottom: 15px;" button-style="solid" v-model="tabStatus" @change="handleQuery">
        <a-radio-button v-for="t in tabCountList" :key="t.tab" :value="t.tab">
          {{ t.tableName }}
          <span v-if="t.count">({{ t.count }})</span>
        </a-radio-button>
        <!-- <a-radio-button :value="1">
          历史记录
        </a-radio-button> -->
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
          <!-- 审核状态ID（0.录入中，1.提交审核中，2.审核通过，-1.审核不通过） -->
          <a-space>
            <a v-if="isShowPublishButton(record)" @click="releaseNotice(record)" v-action:pass>发布</a>
            <a v-if="isShowDetailButton(record)" @click="lookupNotice(record)" v-action:get>查看</a>
            <a v-if="isShowOperationButton(record)" @click="editNotice(record)" v-action:edit>编辑</a>
            <a v-if="isShowOperationButton(record)" @click="deleteNotice(record)" v-action:delete>删除</a>
            <a v-if="moment().isAfter(record.disasterFrontStartTime) && record.cmNoticeStatusId === 2" @click="lookupDisasterBefore(record)">查看灾前准备</a>
            <a v-if="moment().isAfter(record.disasterAfterStartTime) && record.cmNoticeStatusId === 2" @click="lookupDisasterAfter(record)">查看灾后恢复</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
    <EmergencyNoticeDrawer ref="emergencyNoticeDrawerRef" @handleQuery="handleQuery" />
  </page-header-wrapper>
</template>

<script>
import { getNoticeList, deleteNoticeList, publishNotice } from '@/api/contingencyManage/emergencyNoticeManage.js'
import { glbArea, dropdownList } from '@/api/common.js'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import RiskLevelTag from '../components/RiskLevelTag/index.vue'
import EmergencyNoticeDrawer from './modules/EmergencyNoticeDrawer.vue'
import AuditStatus from '../components/AuditStatus/index.vue'
export default {
  name: 'EmergencyNoticeManage',
  components: {
    STable,
    Ellipsis,
    RiskLevelTag,
    EmergencyNoticeDrawer,
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
          title: '应急通知ID',
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
          title: '通知标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'des' }
        },
        {
          title: '审核状态',
          dataIndex: 'cmNoticeStatus',
          scopedSlots: { customRender: 'cmNoticeStatus' }
        },
        {
          title: '通知时间',
          dataIndex: 'publishTime'
        },
        {
          title: '创建时间',
          dataIndex: 'addTime'
        },
        {
          title: '操作人',
          dataIndex: 'upManageName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '255px',
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
    },
    /**
     * 当前账户 id
     */
    currentUserId () {
      return this.$store.state?.user?.info?.userId
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
      return getNoticeList(Object.assign({}, parameter, this.queryParam, {
        areaId: this.area.slice(-1)[0],
        tabStatus: this.tabStatus
      })).then(res => {
        this.tabCountList = res.tabCountList
        return res
      })
    },
    /**
     * 发布通知
     */
    releaseNotice ({ noticeId }) {
      publishNotice(noticeId).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.$refs.table.refresh()
        }
      })
    },
    /**
     * 查看
     */
    lookupNotice ({ noticeId }) {
      this.$router.push({
        name: 'noticeDetail',
        query: {
          noticeId
        }
      })
    },
    /**
     * 编辑
     */
    editNotice ({ noticeId }) {
      this.$refs.emergencyNoticeDrawerRef.showDrawer(noticeId)
    },
    /**
     * 删除
     */
    deleteNotice ({ noticeId }) {
      const that = this
      this.$confirm({
        title: '确定要删除这条应急通知信息吗？',
        okText: '确认',
        cancelText: '取消',
        async onOk () {
          const { code, message } = await deleteNoticeList(noticeId) || {}
          if (code === 0) {
            that.$message.success(message)
            that.$refs.table.refresh()
          }
        }
      })
    },
    /**
     * 查看灾前准备
     */
    lookupDisasterBefore () {
      this.$router.push({
        name: 'preDisasterPreparation'
      })
    },
    /**
     * 查看灾后恢复
     */
    lookupDisasterAfter () {
      this.$router.push({
        name: 'afterDisasterRecovery'
      })
    },
    /**
     * 新建紧急通知
     */
    addEmergencyNotice () {
      this.$refs.emergencyNoticeDrawerRef.showDrawer()
    },
    /**
     * 发布按钮是否显示
     * 创建者本人 && 审核状态未发布
     *
     * 审核状态ID  cmNoticeStatusId（0.录入中，1.提交审核中，2.审核通过，-1.审核不通过）
     */
    isShowPublishButton ({ upManageUserId, cmNoticeStatusId }) {
      return upManageUserId === this.currentUserId && cmNoticeStatusId === 0
    },
    /**
     * 查看按钮是否显示
     * 创建者本人 || (非创建者 && 审核通过)
     *
     * 审核状态ID  cmNoticeStatusId（0.录入中，1.提交审核中，2.审核通过，-1.审核不通过）
     */
    isShowDetailButton ({ upManageUserId, cmNoticeStatusId }) {
      return upManageUserId === this.currentUserId || cmNoticeStatusId === 2
    },
    /**
     * 编辑、删除按钮是否显示
     * 创建者本人 && (审核状态未发布 || 审核状态不通过)
     *
     * 审核状态ID  cmNoticeStatusId（0.录入中，1.提交审核中，2.审核通过，-1.审核不通过）
     */
    isShowOperationButton ({ upManageUserId, cmNoticeStatusId }) {
      return upManageUserId === this.currentUserId && [-1, 0].includes(cmNoticeStatusId)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
