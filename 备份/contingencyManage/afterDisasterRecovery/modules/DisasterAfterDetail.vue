<template>
  <a-drawer
    :title="title"
    :visible="visible"
    @close="onClose"
    :width="800"
  >
    <div class="drawer-content">
      <a-form
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-item label="小区" required>
          {{ info.floor }}
        </a-form-item>
        <a-form-item label="物业公司">
          {{ info.propertyCompany }}
        </a-form-item>
        <a-form-item label="出动防汛人员数">
          {{ info.peopleTotal || '-' }}人
        </a-form-item>
        <a-form-item label="描述">
          {{ info.peopleExplain }}
        </a-form-item>
        <a-form-item label="安置人数">
          {{ info.arrangeTotal || '-' }} 人
        </a-form-item>
        <a-form-item label="描述">
          {{ info.arrangeExplain }}
        </a-form-item>
        <a-form-item label="受伤人数" required>
          {{ info.injuredTotal || '-' }}人
        </a-form-item>
        <a-form-item label="描述">
          {{ info.injuredExplain }}
        </a-form-item>
        <a-form-item label="抢险物资储备" required>
          {{ info.materialTotal || '-' }}包/件
        </a-form-item>
        <a-form-item label="描述">
          {{ info.materialExplain || '-' }}
        </a-form-item>
        <a-form-item label="清理倒伏树木" required>
          {{ info.treeTotal || '-' }}棵
        </a-form-item>
        <a-form-item label="描述">
          {{ info.treeExplain || '-' }}
        </a-form-item>
        <a-form-item label="发生严重捞点数" required>
          {{ info.waterloggingTotal }}处
        </a-form-item>
        <a-form-item label="描述">
          {{ info.waterloggingExplain }}
        </a-form-item>
        <a-form-item label="基础设施损坏">
          {{ info.infrastructureExplain }}
        </a-form-item>
        <a-form-item label="受灾点上报描述">
          {{ info.disasterExplain }}
        </a-form-item>
        <a-form-item label="负责人姓名" required>
          {{ info.linkman }}
        </a-form-item>
        <a-form-item label="手机号码" required>
          {{ info.linkmanMobile }}
        </a-form-item>
      </a-form>
    </div>
    <div class="drawer-bottom-button">
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { getDisasterAfterDetail } from '@/api/contingencyManage/afterDisasterRecovery.js'
export default {
  name: 'DisasterFrontDetail',
  data () {
    return {
      title: '灾后小区详情',
      visible: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      info: {}
    }
  },
  methods: {
    showDrawer (floorId, noticeId) {
      this.visible = true
      this.getDetail({
        floorId, noticeId
      })
    },
    onClose () {
      this.visible = false
      this.info = {}
    },
    getDetail (params) {
      getDisasterAfterDetail(params).then(res => {
        if (res.code === 0) {
          this.info = res.dataBody
        }
      })
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
  overflow: auto;
}
</style>
