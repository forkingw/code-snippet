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
        <a-form-item label="防汛人员配备数" required>
          {{ info.peopleTotal || '-' }}人
        </a-form-item>
        <a-form-item label="描述">
          {{ info.peopleExplain }}
        </a-form-item>
        <a-form-item label="检查房屋数" required>
          {{ info.buildingTotal || '-' }} 幢
        </a-form-item>
        <a-form-item label="描述">
          {{ info.buildingExplain }}
        </a-form-item>
        <a-form-item label="防汛设施设备配备" required>
          {{ info.equipmentTotal || '-' }}台
        </a-form-item>
        <a-form-item label="描述">
          {{ info.equipmentExplain }}
        </a-form-item>
        <a-form-item label="抢险物资储备" required>
          {{ info.materialTotal || '-' }}包/件
        </a-form-item>
        <a-form-item label="描述">
          {{ info.materialExplain || '-' }}
        </a-form-item>
        <a-form-item label="地下空间数" required>
          {{ info.spaceTotal }}处
        </a-form-item>
        <a-form-item label="描述">
          {{ info.spaceExplain }}
        </a-form-item>
        <a-form-item label="树木加固数" required>
          {{ info.treeTotal || '-' }}棵
        </a-form-item>
        <a-form-item label="描述">
          {{ info.treeExplain }}
        </a-form-item>
        <a-form-item label="有无异常情况或隐患" required>
          {{ info.latentDangerExplain }}
        </a-form-item>
        <a-form-item label="近年来曾发生严重积水，整改情况">
          {{ info.rectifyExplain }}
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
import { getDisasterFrontDetail } from '@/api/contingencyManage/preDisasterPreparation.js'
export default {
  name: 'DisasterFrontDetail',
  data () {
    return {
      title: '灾前小区详情',
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
      getDisasterFrontDetail(params).then(res => {
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
