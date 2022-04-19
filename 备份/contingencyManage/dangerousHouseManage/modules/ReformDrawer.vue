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
        <a-form-item label="是否治理改造完成" required>
          是
        </a-form-item>
        <a-form-item label="治理改造方式">
          <a-select
            v-decorator="['remouldModeId', {rules: [ { required: true, message: '请选择治理改造方式!'} ]}]"
            allowClear
            placeholder="请选择治理改造方式"
            :disabled="disabled"
          >
            <a-select-option
              v-for="item in remouldList"
              :value="item.optionValueId"
              :key="item.optionValueId"
            >{{ item.optionName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="治理改造完成时间">
          <a-date-picker
            v-decorator="['remouldTime', {rules: [ { required: true, message: '请选择治理改造完成时间!'} ]}]"
            allowClear
            :format="dateFormat"
            :value-format="dateFormat"
            :disabled="disabled"
            placeholder="完成时间"
          ></a-date-picker>
        </a-form-item>
        <a-form-item label="治理改造描述">
          <a-textarea
            v-decorator="['remouldExplain']"
            placeholder="选填，描述治理改造的情况，不超过300个字"
            :rows="4"
            :maxLength="300"
            :disabled="disabled"
          />
        </a-form-item>
        <a-form-item label="上传治理改造图片" extra="仅支持.jpg、png格式。">
          <HouseUpload
            v-decorator="['remouldImage', { initialValue: [], rules: [ { required: true, type: 'array', message: '请上传治理改造图片!' } ] }]"
            :limitPhtotTotal="Infinity"
            multiple
            :fileTypes="['png', 'jpg']"
            :disabled="disabled"
          />
        </a-form-item>
        <a-form-item label="治理改造文件" extra="支持扩展名： .doc .docx .pdf .jpg">
          <UploadMultiple
            v-decorator="['remouldFile', { initialValue: [] }]"
            folder="check-result"
            :fileTypes="['doc', 'docx', 'pdf', 'jpg']"
            :disabled="disabled"
          />
        </a-form-item>
        <a-form-item label="是否实质性解危">
          <!-- 是否实质性解危（0：未解危， 1：解危） -->
          <a-radio-group
            v-decorator="['offDanger', { initialValue: 1, rules: [ { required: true, message: '请选择是否实质性解危!'} ]}]"
            :disabled="disabled"
            @change="onOffDangerChange"
          >
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="解危描述">
          <a-textarea
            v-decorator="['offDangerExplain']"
            placeholder="不超过300个字"
            :rows="4"
            :maxLength="300"
            :disabled="disabled"
          />
        </a-form-item>
        <a-form-item label="治理改造文件" extra="支持扩展名： .doc .docx .pdf .jpg">
          <UploadMultiple
            v-decorator="['offDangerFile', { initialValue: [], rules: offDangerRule }]"
            folder="check-result"
            :fileTypes="['doc', 'docx', 'pdf', 'jpg']"
            :disabled="disabled"
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
import { saveRemould, getRemouldDetail } from '@/api/contingencyManage/dangerousHouseManage.js'
import { dropdownList } from '@/api/common'
import HouseUpload from '../components/HouseUpload/index.vue'
import UploadMultiple from '../../components/UploadMultiple/index.vue'
const fields = ['remouldModeId', 'remouldTime', 'remouldExplain', 'remouldImage', 'remouldFile', 'offDanger', 'offDangerExplain', 'offDangerFile']
export default {
  name: 'ReformDrawer',
  components: {
    UploadMultiple,
    HouseUpload
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: 'checkResult' }),
      iconLoading: false,
      dateFormat: 'YYYY-MM-DD',
      remouldList: [],
      dilapidatedId: 0,
      disabled: false,
      remouldId: undefined,
      isEdit: false,
      info: {},
      offDanger: 1
    }
  },
  computed: {
    title () {
      if (this.disabled) {
        return '查看治理改造'
      }
      return this.isEdit ? '编辑治理改造' : '添加治理改造'
    },
    offDangerRule () {
      if (this.offDanger) {
        return [{ required: true, type: 'array', message: '请上传治理改造文件!' }]
      } else {
        return []
      }
    }
  },
  created () {
    this.getCheckSortList()
  },
  methods: {
    showDrawer (dilapidatedId, remouldId, disabled) {
      this.visible = true
      this.dilapidatedId = dilapidatedId
      this.disabled = Boolean(disabled)
      if (remouldId) {
        this.remouldId = remouldId
        this.isEdit = true
        this.getRemouldDetail(remouldId)
      } else {
        this.isEdit = false
      }
    },
    onClose () {
      this.visible = false
      this.dilapidatedId = 0
      this.remouldId = undefined
      this.disabled = false
      this.form.resetFields()
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const { remouldModeId } = values
          if (this.isEdit) {
            values.remouldId = this.remouldId
          }
          values.dilapidatedId = this.dilapidatedId
          values.remouldMode = this.remouldList.find(c => c.optionValueId === remouldModeId)?.optionName
          this.iconLoading = true
          saveRemould(values).then(res => {
            const { code, message } = res
              if (code === 0) {
                this.$message.success(message)
                this.onClose()
                this.$emit('handleQuery')
              }
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.iconLoading = false
          })
        }
      })
    },
    /**
     * 获取 危房治理改造方式
     */
    getCheckSortList () {
      dropdownList({ dictionaryCode: 'dilapidatedRemouldModeI' }).then(res => {
        if (res.code === 0) {
          this.remouldList = res.dataBody
        }
      })
    },
    getRemouldDetail (remouldId) {
      getRemouldDetail(remouldId).then(res => {
        if (res.code === 0) {
          this.info = res.dataBody
          this.offDanger = this.info.offDanger
          this.form.setFieldsValue(pick(this.info, fields))
        }
      })
    },
    onOffDangerChange (e) {
      this.offDanger = e.target.value
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
