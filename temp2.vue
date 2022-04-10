<template>
  <page-header-wrapper :breadcrumb="{ props: { routes: $store.getters.customRoutes, itemRender: defaultItemRender } }">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" @keyup.enter="handleQuery()" v-action:query>
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col v-bind="formColSpan">
              <a-form-item label="项目名称">
                <a-input
                  v-model.trim="queryParam.floor"
                  placeholder="请输入"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="项目类型">
                <a-select
                  placeholder="请选择"
                  allowClear
                  v-model="queryParam.floorTypeId"
                >
                  <a-select-option v-for="d in projectTypes" :key="d.optionValueId" :value="d.optionValueId">
                    {{ d.optionName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
              <a-form-item label="开发商">
                <a-input
                  v-model.trim="queryParam.developCompany"
                  placeholder="请输入"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="物业服务企业名称">
                <a-input
                  v-model.trim="queryParam.propertyCompany"
                  placeholder="请输入"
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

      <a-space class="buttons-wrap">
        <a-button v-action:add type="primary" @click="showAddDrawer">添加</a-button>
      </a-space>

      <s-table
        ref="table"
        size="default"
        rowKey="floorId"
        :columns="columns"
        :data="loadData"
        :scroll="scroll"
      >
        <span slot="floor" slot-scope="text">
          <ellipsis :length="30" tooltip>
            {{ text }}
          </ellipsis>
        </span>
        <span slot="area" slot-scope="text, {areaName, streetName, communityName}">
          <ellipsis :length="30" tooltip>
            {{ `${areaName || ''}${streetName || ''}${communityName || ''}` }}
          </ellipsis>
        </span>
        <span slot="ellipsis" slot-scope="text">
          <ellipsis :length="30" tooltip>
            {{ text }}
          </ellipsis>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="goToInfo(record.floorId)" v-action:get>详情</a>
            <a-divider type="vertical" v-action:get />
            <a @click="showMaintainDrawer(record.floorId)" v-action:maintain>维护</a>
            <a-divider type="vertical" v-action:get v-action:maintain />
          </template>
        </span>
      </s-table>
    </a-card>
    <MaintainProjectDrawer ref="maintainProjectRef" @ok="handleQuery('current')" />
  </page-header-wrapper>
</template>

<script>
import { dict } from '@/api/system'
import { glbArea } from '@/api/common'
import { getProjectList } from '@/api/projectManage'
import { STable, Ellipsis } from '@/components'
import MaintainProjectDrawer from './modules/MaintainProjectDrawer.vue'

export default {
  name: 'ProjectList',
  components: {
    STable,
    Ellipsis,
    MaintainProjectDrawer
  },
  data () {
    return {
      formColSpan: { md: 6, sm: 24 },
      queryParam: {},
      // 项目类型下拉数据
      projectTypes: [],
      areaList: [],
      area: [],
      scroll: {
        x: true
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'floorId'
        },
        {
          title: '项目名称',
          dataIndex: 'floor',
          scopedSlots: { customRender: 'floor' }
        },
        {
          title: '项目类型',
          dataIndex: 'floorType'
        },
        {
          title: '区域',
          dataIndex: 'area',
          scopedSlots: { customRender: 'area' }
        },
        {
          title: '项目详细地址',
          dataIndex: 'address',
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '房屋数',
          dataIndex: 'houseQuantity'
          // scopedSlots: { customRender: 'houseQuantity' }
        },
        {
          title: '开发商',
          dataIndex: 'developCompany',
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '物业服务企业',
          dataIndex: 'propertyCompany',
          scopedSlots: { customRender: 'ellipsis' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ]
    }
  },
  computed: {
    /**
     * 当前用户的所属级别的 区域名称
     */
    currentArea () {
      return this.$store.getters?.userInfo?.currentArea
    },
    /**
     * 当前用户的所属级别的 区域Id
     */
    currentAreaId () {
      return this.$store.getters?.userInfo?.currentAreaId
    },
    /**
     * 当前用户所属级别
     * 市 县区 街道 社区
     */
    currentAreaLevel () {
      return this.$store.getters?.userInfo?.currentAreaLevel
    }
  },
  watch: {
    area (val) {
      const [areaId, streetId, communityId] = val || []
      this.queryParam.areaId = areaId
      this.queryParam.streetId = streetId
      this.queryParam.communityId = communityId
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getProjectTypeList()
      this.initAreaList()
    },
    initAreaList () {
      const tempCity = {
        areaId: this.currentAreaId,
        areaName: this.currentArea
      }
      if (this.currentAreaLevel && this.currentAreaLevel < 4) {
        tempCity.isLeaf = false
      }
      this.areaList = [tempCity]
    },
    loadData (parameter) {
      const params = Object.assign({}, parameter, this.queryParam)
      return getProjectList(params)
    },
    /**
     * 跳转到详情页
     */
    goToInfo (floorId) {
      this.$router.push({
        name: 'projectDetail',
        query: {
          floorId
        }
      })
    },
    /**
     * 打开维护 Drawer
     */
    showMaintainDrawer (id) {
      this.$refs.maintainProjectRef.showDrawer(id)
    },
    /**
     * 获取项目类型下拉列表
     */
    getProjectTypeList () {
      dict({ dictionaryCode: 'projectType', optionValueIds: [] }).then(res => {
        if (res.code === 0) {
          this.projectTypes = res.dataBody
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
      } else if (level === 3) return
      glbArea(params).then(res => {
        const { dataBody } = res
        if (haveValue) {
          targetOption.loading = false
          targetOption.children = !dataBody ? dataBody : dataBody.map(d => {
            if (level < 2) {
              d.isLeaf = false
            }
            return d
          })
          this.areaList = [...this.areaList]
        } else {
          this.areaList = dataBody.map(d => {
            d.isLeaf = false
            return d
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
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
    showAddDrawer () {
      this.$refs.maintainProjectRef.showDrawer()
    }
  }
}
</script>

<style lang="less" scoped>
.buttons-wrap {
  margin-bottom: 15px;
}
</style>
