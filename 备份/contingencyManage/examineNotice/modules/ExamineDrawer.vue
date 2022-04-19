<template>
  <a-drawer
    :title="title"
    :visible="visible"
    @close="onClose"
    :width="drawerConfig.drawerWidth"
  >
    <div class="drawer-content">
      <a-form-model
        ref="examineForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        labelAlign="left"
      >
        <a-form-model-item label="审核结果" prop="cmNoticeStatusId">
          <a-radio-group v-model="form.cmNoticeStatusId">
            <a-radio :value="2">通过</a-radio>
            <a-radio :value="-1">驳回</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="form.cmNoticeStatusId === -1" :label-col="{ span: 18 }" label="其它驳回理由或修改意见" prop="verifyReason">
          <a-textarea placeholder="不超过200个字" :rows="4" :maxLength="200" v-model="form.verifyReason" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="drawer-bottom-button">
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" :loading="iconLoading" @click="handleSubmit">
        确定
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import { verifyNotice } from '@/api/contingencyManage/examineNotice.js'
export default {
  name: 'ExamineDrawer',
  data () {
    return {
      title: '请选择审核结果',
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        verifyReason: '',
        cmNoticeStatusId: 2
      },
      rules: {
        cmNoticeStatusId: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
        verifyReason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
      },
      iconLoading: false
    }
  },
  methods: {
    showDrawer (noticeId) {
      this.form.noticeId = noticeId
      this.visible = true
    },
    onClose () {
      this.visible = false
      this.form = {
        verifyReason: '',
        cmNoticeStatusId: 2
      }
    },
    handleSubmit () {
      this.$refs.examineForm.validate(valid => {
      if (valid) {
        this.iconLoading = true
        verifyNotice(this.form).then(res => {
          if (res.code === 0) {
            this.$message.success(res.message)
            this.onClose()
            this.$emit('handleQuery')
          }
        }).finally(() => {
          this.iconLoading = false
        })
      } else {
        return false
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
