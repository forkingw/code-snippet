<template>
  <div>
    <a-modal
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <a-icon type="question-circle" theme="filled" style="color: #F8C956;margin-right: 8px; font-size: 18px;" />
        <span>请选择审核结果</span>
      </div>
      <a-form-model ref="reasonForm" :model="form" :rules="rules">
        <a-form-model-item label="审核结果" prop="verifyStatusId">
          <a-radio-group v-model="form.verifyStatusId">
            <a-radio :value="1">
              通过
            </a-radio>
            <a-radio :value="-1">
              驳回
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="form.verifyStatusId === -1" label="其它驳回理由或修改意见" prop="verifyReason">
          <a-textarea
            v-model="form.verifyReason"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :maxLength="200"
          />
        </a-form-model-item>
      </a-form-model>

    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'ExamineDisasterModal',
  props: {
    verifyMethod: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: {
        verifyStatusId: 1,
        verifyReason: ''
      },
      peportId: [],
      rules: {
        verifyStatusId: [
          { required: true, message: '请选择审核结果', trigger: 'change' }
        ],
        verifyReason: [
          { required: true, message: '请输入驳回理由或修改意见', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showModal (peportId) {
      this.peportId = peportId
      this.visible = true
    },
    handleOk (e) {
      this.$refs.reasonForm.validate(valid => {
        if (valid) {
          console.log()
          this.confirmLoading = true
          const data = Object.assign({}, this.form, { peportId: this.peportId })
          this.verifyMethod(data).then(res => {
            if (res.code === 0) {
              this.$message.success(res.message)
              this.handleCancel()
              this.$emit('handleQuery')
            }
          })
        } else {
          return false
        }
      })
    },
    handleCancel (e) {
      this.visible = false
      this.confirmLoading = false
      this.$refs.reasonForm.resetFields()
      this.peportId = []
    }
  }
}
</script>
