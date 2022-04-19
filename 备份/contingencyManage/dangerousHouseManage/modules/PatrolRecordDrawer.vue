<template>
  <a-drawer
    :title="title"
    :visible="visible"
    @close="onClose"
    :width="drawerConfig.drawerWidth"
  >
    <div class="drawer-content">
      <a-form
        :form="form"
        :labelCol="drawerConfig.labelCol"
        :wrapperCol="drawerConfig.wrapperCol"
      >
        <a-form-item label="上传巡查危房图片" extra="仅支持.jpg、png格式。">
          <HouseUpload
            v-decorator="['patrolImage', { initialValue: [], rules: [ { required: true, type: 'array', message: '请上传巡查危房图片!' } ] }]"
            folder="check-result"
            :disabled="disabled"
            :fileTypes="['jpg', 'png']"
          />
        </a-form-item>
        <a-form-item label="房屋状况及措施">
          <a-textarea
            v-decorator="['patrolExplain']"
            placeholder="选填，描述治理改造的情况，不超过300个字"
            :rows="4"
            :disabled="disabled"
            :maxLength="300"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="drawer-bottom-button">
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
      <a-button v-if="!disabled" type="primary" :loading="iconLoading" @click="handleSubmit">
        提交
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import { savePatrol, getPatrolDetail } from '@/api/contingencyManage/dangerousHouseManage.js'
import HouseUpload from '../components/HouseUpload/index.vue'
const fields = ['patrolImage', 'patrolExplain']

export default {
  name: 'PatrolRecordDrawer',
  components: {
    HouseUpload
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: 'checkResult' }),
      iconLoading: false,
      dangerousGradeList: [],
      dilapidatedId: 0,
      patrolId: undefined,
      isEdit: false,
      disabled: false,
      info: {}
    }
  },
  computed: {
    title () {
      if (this.disabled) {
        return '查看巡查记录'
      }
      return this.isEdit ? '编辑巡查记录' : '添加巡查记录'
    }
  },
  methods: {
    showDrawer (dilapidatedId, patrolId, disabled) {
      this.visible = true
      this.dilapidatedId = dilapidatedId
      this.disabled = Boolean(disabled)
      if (patrolId) {
        this.isEdit = true
        this.patrolId = patrolId
        this.getPatrolDetail(patrolId)
      } else {
        this.isEdit = false
      }
    },
    onClose () {
      this.visible = false
      this.dilapidatedId = 0
      this.patrolId = undefined
      this.form.resetFields()
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.patrolId = this.patrolId
          values.dilapidatedId = this.dilapidatedId
          this.iconLoading = true
          savePatrol(values).then(res => {
            const { code, message } = res
              if (code === 0) {
                this.$message.success(message)
                this.onClose()
                this.$emit('handleQuery')
              }
          }).finally(() => {
            this.iconLoading = false
          })
        }
      })
    },
    getPatrolDetail (patrolId) {
      getPatrolDetail(patrolId).then(res => {
        if (res.code === 0) {
          this.info = res.dataBody
          this.form.setFieldsValue(pick(this.info, fields))
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
  padding-top: 25px;
  padding-right: 24px;
  overflow: auto;
}
</style>
