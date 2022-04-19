<template>
  <a-drawer
    :title="title"
    :visible="visible"
    @close="onClose"
    :width="drawerConfig.drawerWidth"
    :maskClosable="false"
  >
    <div class="drawer-content">
      <a-form
        :form="form"
        :labelCol="drawerConfig.labelCol"
        :wrapperCol="drawerConfig.wrapperCol"
      >
        <a-form-item label="发起者">
          <span>{{ currentArea }}</span>
        </a-form-item>
        <a-form-item label="通知标题">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '请输入通知标题' }] }]"
            allowClear
            :max-length="40"
            placeholder="不超过40个字"
          />
        </a-form-item>
        <a-form-item label="通知类型">
          <span>防台防汛通知</span>
        </a-form-item>
        <a-form-item label="灾前上报时间">
          <a-range-picker
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: defaultBuildTimeValue
            }"
            v-decorator="['disasterFrontTime', { rules: [ { required: true, message: '请选择灾前上报时间！' }, { validator: judgeFrontEndTime } ] }]"
            allowClear
            :disabledDate="disasterDisabledDate"
            :disabledTime="disasterDisabledDateTime"
            :valueFormat="dateFormat" />
        </a-form-item>
        <a-form-item label="灾后上报时间">
          <a-range-picker
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: defaultBuildTimeValue
            }"
            v-decorator="['disasterAfterTime', { rules: [ { required: true, message: '请选择灾后上报时间！' }, { validator: judgeAfterEndTime } ] }]"
            allowClear
            :disabledDate="disasterDisabledDate"
            :disabledTime="disasterDisabledDateTime"
            :valueFormat="dateFormat" />
        </a-form-item>
        <a-form-item label="风险提示等级">
          <a-select v-decorator="['riskWarningLevelId']" placeholder="请选择风险提示等级">
            <a-select-option v-for="(item) in riskLevelList" :value="item.optionValueId" :key="item.optionValueId">{{ item.optionName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="应急文件" extra="支持扩展名：.doc .docx .pdf .jpg">
          <upload-multiple
            v-decorator="['fileList', { initialValue: [] }]"
            folder="infomationpublish"
            :fileTypes="['docx', 'doc', 'pdf','jpg']"
          />
        </a-form-item>
        <a-form-item label="通知对象" extra="选中区域范围内的项目经理和选中区域范围内的部门工作人员将收到短信">
          <a-checkbox-group v-decorator="['noticeReceiverList', { rules: [{ required: true, message: '请选择通知对象！' }], normalize: this.selectNoticeReceiver }]">
            <a-checkbox v-for="o in notificationObject" :key="o.areaId" :value="o.areaId">
              {{ o.areaName }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="工作内容">
          <div slot="extra">
            1.短信内容：[智慧社区]{发起者}于｛发布时间｝发布{通知类型}，启动{事件等级}应急响应。{工作内容}。及时做好灾前准备工作和灾后恢复工作。；（如：【智慧社区】嘉兴市于4月18日发布防洪防汛通知，启动I级应急响应。各单位确保人身安全，坚守岗位，应急分队成员保持通讯畅通。及时做好灾前准备工作和灾后恢复工作。）
            <br />
            2.短信70个字数含以内，按1条短信计费；超出70个字为长短信，将分多条短信发送。
          </div>
          <a-textarea
            v-decorator="['content', { rules: [{ required: true, message: '请输入工作内容！' }] }]"
            placeholder="【智慧社区】｛发起者｝发布｛事件等级｝｛通知类型｝通知：工作内容文字"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="drawer-bottom-button">
      <a-space>
        <a-button v-if="isPublished" type="primary" :loading="publishLoading" @click="releaseEmergencyNotice">
          发布
        </a-button>
        <a-button type="primary" :loading="iconLoading" @click="saveEmergencyNotice">
          保存
        </a-button>
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script>
import { dropdownList, glbArea } from '@/api/common.js'
import { saveNoticeList, getNoticeDetail, publishNotice } from '@/api/contingencyManage/emergencyNoticeManage.js'

import UploadMultiple from '../../components/UploadMultiple/index.vue'
import cloneDeep from 'lodash.clonedeep'
import moment from 'moment'
import pick from 'lodash.pick'

const fields = ['title', 'disasterFrontTime', 'disasterAfterTime', 'riskWarningLevelId', 'fileList', 'noticeReceiverList', 'content']

const range = (start, end) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
export default {
  name: 'EmergencyNoticeDrawer',
  components: {
    UploadMultiple
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: 'emergencyNoticeForm' }),
      iconLoading: false,
      publishLoading: false,
      riskLevelList: [],
      subordinateArea: [],
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      noticeId: null,
      isEdit: false,
      info: {}
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑应急通知' : '新增应急通知'
    },
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
     * 通知对象
     */
    notificationObject () {
      return [
        {
          areaId: this.currentAreaId,
          areaName: this.currentArea || '全市'
        },
        ...this.subordinateArea
      ]
    },
    defaultBuildTimeValue () {
      // 开始时间 为当前时间， 结束时间为 23:59:00
      const startTime = moment().seconds(0)
      const endTime = moment('23:59:00', 'HH:mm:ss')
      return [startTime, endTime]
    },
    /**
     * 是否需要发布
     * 新增时 || 录入中 || 审核不通过
     */
    isPublished () {
      return !this.isEdit || [-1, 0].includes(this.info.cmNoticeStatusId)
    }
  },
  created () {
    this.getRiskLevelList()
    this.getSubordinateArea()
  },
  methods: {
    showDrawer (noticeId) {
      this.visible = true
      if (noticeId) {
        this.noticeId = noticeId
        this.isEdit = true
        this.getNoticeDetail()
      }
    },
    onClose () {
      this.visible = false
      this.form.resetFields()
      this.noticeId = null
      this.isEdit = false
    },
    getRiskLevelList () {
      dropdownList({ dictionaryCode: 'riskWarningLevel' }).then(res => {
        if (res.code === 0) {
          this.riskLevelList = res.dataBody
        }
      })
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
    },
    getNoticeDetail () {
      getNoticeDetail(this.noticeId).then(res => {
        if (res.code === 0) {
          const { receiverList, disasterFrontStartTime, disasterFrontEndTime, disasterAfterStartTime, disasterAfterEndTime } = res.dataBody
          this.info = res.dataBody
          this.info.noticeReceiverList = receiverList.map(r => r.areaId)
          this.info.disasterFrontTime = [disasterFrontStartTime, disasterFrontEndTime]
          this.info.disasterAfterTime = [disasterAfterStartTime, disasterAfterEndTime]

          this.form.setFieldsValue(pick(this.info, fields))
        }
      })
    },
    /**
     * 处理提交的表单数据
     */
    handleSubmitInfo (values) {
      const { disasterFrontTime, disasterAfterTime } = values
        const [disasterFrontStartTime, disasterFrontEndTime] = disasterFrontTime
        const [disasterAfterStartTime, disasterAfterEndTime] = disasterAfterTime
        values.noticeReceiverList = values.noticeReceiverList.map(n => {
          const receiver = this.notificationObject.find(o => o.areaId === n)
          const cloneReceiver = cloneDeep(receiver)
          cloneReceiver.receiverId = 0
          if (this.isEdit) {
            // 编辑的话，未改变的 通知对象，需要添加上原本的 receiverId
            const oldReceiver = this.info.receiverList.find(r => r.areaId === cloneReceiver.areaId)
            cloneReceiver.receiverId = oldReceiver?.receiverId || 0
          }
          return cloneReceiver
        })
        if (this.isEdit) {
          values.noticeId = this.noticeId
        }
        const params = Object.assign({}, values, {
          disasterFrontStartTime,
          disasterFrontEndTime,
          disasterAfterStartTime,
          disasterAfterEndTime,
          cmNoticeSortId: 1
        })
        return params
    },
    /**
     * 保存应急通知管理
     */
    saveEmergencyNotice (e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const params = this.handleSubmitInfo(values)
          this.iconLoading = true
          saveNoticeList(params).then(res => {
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
     * 发布 应急通知
     */
    releaseEmergencyNotice () {
      // if (this.noticeId) {
      //   this.publishLoading = true
      //   this.releaseNotice(this.noticeId).finally(() => {
      //     this.publishLoading = false
      //   })
      // } else {
      // 先保存 应急通知，保存成功以后，在进行发布！
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const params = this.handleSubmitInfo(values)
          this.publishLoading = true
          saveNoticeList(params).then(res => {
            const { code, dataBody } = res
            if (code === 0) {
              this.releaseNotice(dataBody).finally(() => {
                this.publishLoading = false
              })
            }
          }).finally(() => {
            this.publishLoading = false
          })
        }
      })
      // }
    },
    /**
     * 发布通知
     */
    releaseNotice (noticeId) {
      return publishNotice(noticeId).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.onClose()
          this.$emit('handleQuery')
        }
      })
    },
    selectNoticeReceiver (value, prevValue = [], allValues) {
      if (!value) {
        return
      }
      if (value.length > prevValue.length) {
        const selectedReceiver = value.filter(v => !prevValue.includes(v))[0]
        if (selectedReceiver === this.currentAreaId || value.length === this.notificationObject.length - 1) {
          return this.notificationObject.map(n => n.areaId)
        } else {
          return value
        }
      } else if ((value.length < prevValue.length)) {
        // 取消
        const deselectReceiver = prevValue.filter(v => !value.includes(v))[0]
        if (deselectReceiver === this.currentAreaId) {
          return []
        } else {
          return value.filter(v => v !== this.currentAreaId)
        }
      }
      return value
    },
    disasterDisabledDate (currentDate) {
      return currentDate && currentDate.isBefore(moment(), 'd')
    },
    disasterDisabledDateTime (_, type) {
      const disableSeconddRange = range(1, 59)
      const currentHour = moment().hour()
      const disableHourRange = currentHour > 0 ? range(0, currentHour - 1) : []
      if (type === 'start') {
        return {
          disabledHours: () => disableHourRange,
          disabledSeconds: () => disableSeconddRange
        }
      } else {
        return {
          disabledSeconds: () => disableSeconddRange
        }
      }
    },
    judgeFrontEndTime (rule, value, callback) {
      const disasterAfterTime = this.form.getFieldValue('disasterAfterTime')
      if (disasterAfterTime && disasterAfterTime.length !== 0) {
        this.form.validateFields(['disasterAfterTime'])
      }
      callback()
    },
    /**
     * 判断灾后上报截止时间 是否在 灾前上报截止时间后面
     */
    judgeAfterEndTime (rule, value, callback) {
      const disasterFrontTime = this.form.getFieldValue('disasterFrontTime')
      if (!disasterFrontTime || disasterFrontTime.length === 0) {
        callback(new Error('请先选择灾前上报时间'))
      } else {
        const [, disasterFrontEndTime] = disasterFrontTime
        const [, disasterAfterEndTime] = value
        if (moment(disasterFrontEndTime).isSameOrAfter(moment(disasterAfterEndTime), 'm')) {
          callback(new Error('灾后上报截止时间不能小于灾前上报截止时间！'))
        }
        callback()
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
  overflow: auto;
}
.drawer-bottom-button {
  display: flex;
  justify-content: right;
}
</style>
