<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" @keyup.enter="handleQuery()">
        <a-form layout="inline">
          <a-row type="flex" :gutter="48">
            <a-col v-bind="formColSpan">
              <a-form-item label="区域">
                <AreaCascader v-model="area" allowClear />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="小区名称">
                <a-input v-model.trim="queryParam.floor" placeholder="请输入小区名称" allowClear />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="排查结果">
                <a-select placeholder="请选择" allowClear v-model="queryParam.checkSort">
                  <a-select-option
                    v-for="item in checkSortList"
                    :value="item.optionValueId"
                    :key="item.optionValueId"
                  >{{ item.optionName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="鉴定结论">
                <a-select placeholder="请选择鉴定结论" allowClear v-model="queryParam.dangerousGradeId">
                  <a-select-option
                    v-for="item in dangerousGradeList"
                    :value="item.optionValueId"
                    :key="item.optionValueId"
                  >{{ item.optionName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="{ md: 8, sm: 24 }">
              <a-form-item label="是否记录改造完成">
                <a-select placeholder="请选择" allowClear v-model="queryParam.remouldCompleted">
                  <a-select-option :value="0">未改造完成</a-select-option>
                  <a-select-option :value="1">改造完成</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="创建时间">
                <div style="width: 428px;">
                  <a-date-picker
                    allowClear
                    v-model="queryParam.addTimeStart"
                    :format="dateFormat"
                    :valueFormat="dateFormat"
                  />
                  <span style="margin-left: 5px;margin-right: 5px;">——</span>
                  <a-date-picker
                    allowClear
                    v-model="queryParam.addTimeEnd"
                    :format="dateFormat"
                    :valueFormat="dateFormat"
                  />
                </div>
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item>
                <a-button type="primary" @click="handleQuery()">查询</a-button>
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-space :size="15">
        <!-- 只有社区账号可以新建危房 -->
        <a-button v-if="isCommunityAccount || isSysAccount" v-action:add type="primary" icon="plus" @click="showDangerousHouseDrawer">新建</a-button>
        <a-button v-action:export @click="handleExport">导出</a-button>
        <a-button v-action:dangerousHouseStatistics @click="goDangerousHouseStatics">危房统计</a-button>
      </a-space>

      <div class="radio-group">
        <a-radio-group
          style="margin-top: 15px;margin-bottom: 15px;"
          button-style="solid"
          v-model="tabStatus"
          @change="handleQuery"
        >
          <a-radio-button v-for="t in tableList" :key="t.tab" :value="t.tab">
            {{ t.tableName }}
            <span v-if="t.count">({{ t.count }})</span>
          </a-radio-button>
        </a-radio-group>
      </div>

      <div>
        <s-table
          ref="table"
          size="default"
          rowKey="dilapidatedId"
          :columns="columns"
          :data="loadData"
          :scroll="scroll"
        >
          <div slot="areaName" slot-scope="text, record">
            <div v-if="text">({{ text }})</div>
            <div v-if="record.floor">{{ record.floor }}</div>
          </div>
          <span slot="des" slot-scope="text">
            <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
          </span>
          <template slot="checkSort" slot-scope="text, record">
            <span v-if="record.checkSortId === 1" style="color: #12C34C;">{{ text }}</span>
            <span v-else-if="record.checkSortId === 2" style="color: #6BA6FF;">{{ text }}</span>
            <span v-else-if="record.checkSortId === 3" style="color: #FF7D37;">{{ text }}</span>
          </template>
          <template slot="dangerousGrade" slot-scope="text, record">
            <span v-if="record.dangerousGradeId === 1" style="color: #12C34C;">{{ text }}</span>
            <span v-else-if="record.dangerousGradeId === 2" style="color: #6BA6FF;">{{ text }}</span>
            <span v-else-if="record.dangerousGradeId === 3" style="color: #FF7D37;">{{ text }}</span>
            <span v-else-if="record.dangerousGradeId === 4" style="color: #C63740;">{{ text }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <a-space>
              <a v-action:get @click="lookupDetail(record)">查看</a>
              <a v-if="!isStreetAccount || isSysAccount" v-action:edit @click="editDangerousHouse(record)">编辑</a>
              <a v-if="isCommunityAccount || isSysAccount" v-action:addPatrol @click="showPatrolRecord(record)">添加巡检</a>
              <a v-if="(isPropertySectionAcc || isSysAccount) && tabStatus === 0" v-action:addTroubleshootingResults @click="showCheckResult(record)">添加排查结果</a>
              <a v-if="(isPropertySectionAcc || isSysAccount) && [0, 1].includes(tabStatus)" v-action:addIdentificationResults @click="showIdentificationResult(record)">添加鉴定结果</a>
              <a v-if="(isPropertySectionAcc || isSysAccount) && [2, 3].includes(tabStatus) && record.offDanger !== 1" v-action:addIdentificationResults @click="showReform(record)">添加治理记录</a>
              <!-- <a v-if="isPropertySectionAcc && [3].includes(tabStatus)" v-action:addIdentificationResults @click="showReform(record)">添加改造记录</a> -->
              <a v-if="!isStreetAccount || isSysAccount" v-action:delete @click="confirmDelete(record)">删除</a>
            </a-space>
          </template>
        </s-table>
      </div>
    </a-card>
    <DangerousHouseDrawer ref="dangerousHouseRef" @handleQuery="handleQuery" />
    <PatrolRecordDrawer ref="patrolRecordDrawerRef" @handleQuery="handleQuery" />
    <CheckResultDrawer ref="checkResultRef" @handleQuery="handleQuery" />
    <IdentificationResult ref="identificationResultRef" @handleQuery="handleQuery" />
    <ReformDrawer ref="reformDrawerRef" @handleQuery="handleQuery" />

  </page-header-wrapper>
</template>

<script>
import { getDangerousHouseList, exportDilapidated, deleteDangerousHouse } from '@/api/contingencyManage/dangerousHouseManage.js'
import { dropdownList } from '@/api/common'
import { fileDownClick } from '@/utils/util'
import { reportHousesColumns, checkedColums, identifiedColumns } from './utils/columns.js'
import { STable, Ellipsis } from '@/components'
import AreaCascader from '../components/AreaCascader/index.vue'
import DangerousHouseDrawer from './modules/DangerousHouseDrawer.vue'
import PatrolRecordDrawer from './modules/PatrolRecordDrawer.vue'
import CheckResultDrawer from './modules/CheckResultDrawer.vue'
import IdentificationResult from './modules/IdentificationResult.vue'
import ReformDrawer from './modules/ReformDrawer.vue'
import accountMixin from '../mixins/accountMixin.js'

export default {
  name: 'DangerousHouseManage',
  mixins: [accountMixin],
  components: {
    STable,
    Ellipsis,
    AreaCascader,
    DangerousHouseDrawer,
    CheckResultDrawer,
    IdentificationResult,
    PatrolRecordDrawer,
    ReformDrawer
  },
  data () {
    return {
      formColSpan: { md: 6, sm: 24 },
      queryParam: {},
      area: [],
      checkSortList: [],
      dangerousGradeList: [],
      dateFormat: 'YYYY-MM-DD',
      tableList: [],
      tabStatus: 0,
      scroll: {
        x: true
      }
    }
  },
  computed: {
    columns () {
      if (this.tabStatus === 0) {
        return reportHousesColumns
      } else if (this.tabStatus === 1) {
        return checkedColums
      } else {
        return identifiedColumns
      }
    }
  },
  created () {
    this.getCheckSortList()
    this.getDangerousGradeList()
  },
  methods: {
    /**
     * 获取 排查结果列表
     */
    getCheckSortList () {
      dropdownList({ dictionaryCode: 'dilapidatedCheckSort' }).then(res => {
        if (res.code === 0) {
          this.checkSortList = res.dataBody
        }
      })
    },
    /**
     * 获取 鉴定结论列表
     */
    getDangerousGradeList () {
      dropdownList({ dictionaryCode: 'dangerousGrade' }).then(res => {
        if (res.code === 0) {
          this.dangerousGradeList = res.dataBody
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
      return getDangerousHouseList(Object.assign({}, parameter, this.queryParam, {
        areaId: this.area.slice(-1)[0],
        tabStatus: this.tabStatus
      })).then(res => {
        this.tableList = res.tableList
        return res
      })
    },
    goDangerousHouseStatics () {
      this.$router.push({
        name: 'dangerousHouseStatistics'
      })
    },
    /**
     * 新建危房
     */
    showDangerousHouseDrawer () {
      this.$refs.dangerousHouseRef.showDrawer()
    },
    // 导出数据
    async handleExport () {
      try {
        const res = await exportDilapidated(Object.assign({}, this.queryParam, {
          areaId: this.area.slice(-1)[0],
          tabStatus: this.tabStatus,
          page: this.$refs.table.pageNum,
          pageSize: this.$refs.table.pageSize
        }))
        fileDownClick({
          res,
          fileName: '城镇危房管理.xls'
        })
      } catch (e) {
        console.log(e)
      }
    },
    lookupDetail ({ dilapidatedId }) {
      this.$router.push({
        name: 'dangerousHouseDetail',
        query: {
          dilapidatedId
        }
      })
    },
    editDangerousHouse ({ dilapidatedId }) {
      this.$refs.dangerousHouseRef.showDrawer(dilapidatedId)
    },
    showCheckResult ({ dilapidatedId }) {
      this.$refs.checkResultRef.showDrawer(dilapidatedId)
    },
    showIdentificationResult ({ dilapidatedId }) {
      this.$refs.identificationResultRef.showDrawer(dilapidatedId)
    },
    showPatrolRecord ({ dilapidatedId }) {
      this.$refs.patrolRecordDrawerRef.showDrawer(dilapidatedId)
    },
    showReform ({ dilapidatedId }) {
      this.$refs.reformDrawerRef.showDrawer(dilapidatedId)
    },
    confirmDelete ({ dilapidatedId }) {
      const that = this
      this.$confirm({
        title: '确定要删除这条危房信息吗？',
        onOk () {
          deleteDangerousHouse(dilapidatedId).then(res => {
            if (res.code === 0) {
              that.$message.success(res.message)
              that.handleQuery()
            }
          }).catch((err) => console.log(err))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .radio-group {
//   margin-bottom: 20px;
// }
</style>
