<template>
  <a-drawer
    :title="title"
    :visible="visible"
    @close="onClose"
    :width="drawerConfig.drawerWidth"
  >
    <div class="drawer-content">
      <div class="table-page-search-wrapper" @keyup.enter="handleQuery()">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col v-bind="formColSpan">
              <a-form-item label="区域">
                <a-select
                  placeholder="请选择"
                  allowClear
                  v-model="queryParam.areaId"
                >
                  <a-select-option v-for="d in notificationList" :value="d.areaId" :key="d.areaId">
                    {{ d.areaName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-bind="formColSpan">
              <a-form-item label="姓名">
                <a-input
                  v-model.trim="queryParam.name"
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
      <a-radio-group style="margin-top: 15px;margin-bottom: 15px;" button-style="solid" v-model="tabStatus" @change="handleQuery">
        <a-radio-button v-for="t in tabCountList" :key="t.tab" :value="t.tab">
          {{ t.tableName }}
          <span v-if="t.count">({{ t.count }})</span>
        </a-radio-button>
      </a-radio-group>
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
      </s-table>
    </div>
    <div class="drawer-bottom-button">
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        返回
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { glbArea } from '@/api/common.js'
import { getReceiverInfo } from '@/api/contingencyManage/emergencyNoticeManage.js'
import { STable, Ellipsis } from '@/components'

/**
 * 物业部门人员
 */
const personnelColumns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '账号',
    dataIndex: 'userName'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '手机号码',
    dataIndex: 'mobile'
  },
  {
    title: '所属区域',
    dataIndex: 'currentAreaName',
    scopedSlots: { customRender: 'des' }
  }
]

/**
 * 物业部门经理
 */
const managerColumns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '手机号码',
    dataIndex: 'mobile'
  },
  {
    title: '物业服务企业名称',
    dataIndex: 'companyName'
  },
  {
    title: '服务项目',
    dataIndex: 'floor'
  }
]

export default {
  name: 'ReceiverInfoDrawer',
  components: {
    STable,
    Ellipsis
  },
  props: {
    noticeId: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      title: '查看通知对象',
      visible: false,
      formColSpan: { md: 8, sm: 24 },
      tabStatus: 0,
      queryParam: {},
      scroll: {
        x: true
      },
      tabCountList: [],
      subordinateArea: []
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
     * 通知对象列表
     */
    notificationList () {
      if (this.currentAreaLevel === 1) {
        return this.subordinateArea
      } else {
        return [
          {
            areaId: this.currentAreaId,
            areaName: this.currentArea
          }
        ]
      }
    },
    columns () {
      if (this.tabStatus === 0) {
        return personnelColumns
      } else {
        return managerColumns
      }
    }
  },
  created () {
    this.getSubordinateArea()
  },
  methods: {
    showDrawer () {
      this.visible = true
      // this.getReceiverInfo()
    },
    loadData (parameter) {
      return getReceiverInfo(Object.assign({}, parameter, this.queryParam, {
        noticeId: this.noticeId,
        tabType: this.tabStatus
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
    onClose () {
      this.visible = false
    },
    /**
     * 根据当前用户获取可选的下级对象范围
     * 只有市级允许获取
     */
    getSubordinateArea () {
      if (this.currentAreaLevel === 1) {
        const params = {
          areaId: this.currentAreaId
        }
        glbArea(params).then(res => {
          const { code, dataBody } = res
          if (code === 0) {
            this.subordinateArea = dataBody || []
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-content {
  position: absolute;
  top: 55px;
  left: 24px;
  right: 0px;
  bottom: 65px;
  padding-right: 24px;
  padding-top: 20px;
  overflow: auto;
}
</style>
