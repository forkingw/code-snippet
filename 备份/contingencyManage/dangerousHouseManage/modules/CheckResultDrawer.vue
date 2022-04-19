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
        <a-form-item label="类别判定">
          <a-select
            v-decorator="['checkSortId', {rules: [ { required: true, message: '请选择类别判定!'} ]}]"
            allowClear
            placeholder="请选择类别判定"
          >
            <a-select-option
              v-for="item in checkSortList"
              :value="item.optionValueId"
              :key="item.optionValueId"
            >{{ item.optionName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="现场调查文件" extra="支持扩展名： .doc .docx .pdf .jpg">
          <UploadMultiple
            v-decorator="['checkSortFile', { initialValue: [], rules: [ { required: true, type: 'array', message: '请上传现场调查文件!' }] }]"
            folder="check-result"
            :fileTypes="['docx', 'doc', 'pdf','jpg']"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea
            v-decorator="['checkExplain']"
            placeholder="不超过300个字"
            :rows="4"
            :maxLength="300"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="drawer-bottom-button">
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" :loading="iconLoading" @click="handleSubmit">
        提交
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import { checkSortSave, getCheckSortDetail } from '@/api/contingencyManage/dangerousHouseManage.js'
import { dropdownList } from '@/api/common'
import UploadMultiple from '../../components/UploadMultiple/index.vue'
const fields = ['checkSortId', 'checkSortFile', 'checkExplain']
export default {
  name: 'CheckResultDrawer',
  components: {
    UploadMultiple
  },
  data () {
    return {
      title: '添加排查结果',
      visible: false,
      form: this.$form.createForm(this, { name: 'checkResult' }),
      iconLoading: false,
      checkSortList: [],
      dilapidatedId: 0,
      isEdit: false,
      info: {}
    }
  },
  created () {
    this.getCheckSortList()
  },
  methods: {
    showDrawer (dilapidatedId, isEdit) {
      this.visible = true
      this.dilapidatedId = dilapidatedId
      this.isEdit = Boolean(isEdit)
      if (isEdit) {
        this.getCheckResultDetail(dilapidatedId)
      }
    },
    onClose () {
      this.visible = false
      this.dilapidatedId = 0
      this.isEdit = false
      this.form.resetFields()
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const { checkSortId } = values
          values.dilapidatedId = this.dilapidatedId
          values.checkSort = this.checkSortList.find(c => c.optionValueId === checkSortId)?.optionName
          this.iconLoading = true
          checkSortSave(values).then(res => {
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
    getCheckResultDetail (dilapidatedId) {
      getCheckSortDetail(dilapidatedId).then(res => {
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
