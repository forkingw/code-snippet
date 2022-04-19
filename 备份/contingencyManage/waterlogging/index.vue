<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" @keyup.enter="handleQuery()">
        <a-form layout="inline">
          <a-row type="flex" :gutter="48">
            <a-col v-bind="formColSpan">
              <a-form-item label="区域">
                <a-cascader
                  placeholder="请选择"
                  allowClear
                  change-on-select
                  :options="areaList"
                  :fieldNames="{ label: 'areaName', value: 'areaId', children: 'children' }"
                  :load-data="getGlbArea"
                  v-model="area"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="小区名称">
                <a-input v-model.trim="queryParam.floor" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="易涝点地址">
                <a-input v-model.trim="queryParam.waterlogging" placeholder="请输入" allowClear />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="风险等级">
                <a-select placeholder="请选择" allowClear v-model="queryParam.riskLevelId">
                  <a-select-option
                    v-for="item in riskLevelList"
                    :value="item.optionValueId"
                    :key="item.optionValueId"
                  >{{ item.optionName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="积水位置">
                <a-select placeholder="请选择" allowClear v-model="queryParam.pondingLocationId">
                  <a-select-option
                    v-for="item in pondingLocationList"
                    :value="item.optionValueId"
                    :key="item.optionValueId"
                  >{{ item.optionName }}</a-select-option
                  >
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
                <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="btns-space" v-action:export>
        <a-button @click="exportTable">导出</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="waterloggingId"
        :columns="columns"
        :data="loadData"
        :scroll="scroll"
      >
        <span slot="des" slot-scope="text">
          <ellipsis :length="20" tooltip>
            {{ text }}
          </ellipsis>
        </span>
        <template slot="floor" slot-scope="text, record">
          <span v-if="record.areaName">({{ record.areaName }})</span>
          <div>{{ text }}</div>
        </template>
        <template slot="riskLevel" slot-scope="text">
          <RiskLevelTag :riskLevelList="riskLevelList" :risk="text" />
        </template>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="lookupDetail(record)">查看</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { glbArea, dropdownList } from '@/api/common'
import { geWaterloggingList, exportWaterlogging } from '@/api/contingencyManage/waterlogging.js'
import { fileDownClick } from '@/utils/util.js'
import { STable, Ellipsis } from '@/components'
import RiskLevelTag from '../components/RiskLevelTag/index.vue'
export default {
  name: 'Waterlogging',
  components: {
    STable,
    Ellipsis,
    RiskLevelTag
  },
  data () {
    return {
      formColSpan: { md: 6, sm: 24 },
      dateFormat: 'YYYY-MM-DD HH:mm',
      queryParam: {},
      areaList: [],
      area: [],
      riskLevelList: [],
      pondingLocationList: [],
      scroll: {
        x: true
      },
      columns: [
        {
          title: '易涝点ID',
          dataIndex: 'waterloggingId'
        },
        {
          title: '区域/小区',
          dataIndex: 'floor',
          scopedSlots: { customRender: 'floor' }
        },
        {
          title: '风险等级',
          dataIndex: 'riskLevel',
          scopedSlots: { customRender: 'riskLevel' }
        },
        {
          title: '易涝点地址',
          dataIndex: 'waterlogging',
          scopedSlots: { customRender: 'des' }
        },
        {
          title: '积水位置',
          dataIndex: 'pondingLocation'
        },
        {
          title: '创建时间',
          dataIndex: 'addTime'
        },
        {
          title: '操作人',
          dataIndex: 'svManageName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '80px',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ]
    }
  },
  computed: {
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
    this.getGlbArea()
    this.getRiskLevelList()
    this.getPondingLocationList()
  },
  methods: {
    /**
     * 获取风险等级 字典数据
     */
    getRiskLevelList () {
      dropdownList({
        dictionaryCode: 'riskLevel'
      }).then(res => {
        if (res.code === 0) {
          this.riskLevelList = res.dataBody
        }
      })
    },
    /**
     * 获取 积水位置 字典数据
     */
    getPondingLocationList () {
      dropdownList({
        dictionaryCode: 'pondingLocation'
      }).then(res => {
        if (res.code === 0) {
          this.pondingLocationList = res.dataBody
        }
      })
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
          const { dataBody } = res
          if (haveValue) {
            targetOption.loading = false
            targetOption.children = !dataBody
              ? dataBody
              : dataBody.map(d => {
                  d.isLeaf = d.number === 0
                  return d
                })
            this.areaList = [...this.areaList]
          } else {
            this.areaList = dataBody.map(d => {
              d.isLeaf = d.number === 0
              return d
            })
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    loadData (parameter) {
      const parmas = Object.assign({}, parameter, this.queryParam, {
        areaId: this.area.length ? this.area.toString() : undefined
      })
      return geWaterloggingList(Object.assign(parmas))
    },
    /**
     * 查看详情
     */
    lookupDetail ({ waterloggingId }) {
      this.$router.push({
        name: 'waterloggingDetail',
        query: {
          waterloggingId
        }
      })
    },
    /**
     * 导出表格
     */
    exportTable () {
      exportWaterlogging(this.queryParam).then(res => {
        fileDownClick({
          res,
          fileName: '易涝点.xls'
        })
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
    }
  }
}
</script>

<style lang="less" scoped>
.btns-space {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
