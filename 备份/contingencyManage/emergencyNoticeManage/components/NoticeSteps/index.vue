<template>
  <div>
    <a-alert
      class="top-error"
      v-if="isReject"
      message="应急通知已驳回"
      :description="verifyReason"
      type="error"
      show-icon
    />
    <!-- 查看应急通知不是创建者时，不展示 前两个步骤  -->
    <a-steps :current="current">
      <template v-for="(s, i) in steps">
        <a-step
          class="custom-step"
          :title="s.title"
          :description="s.description"
          :status="s.status"
          :key="i" />
      </template>
    </a-steps>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'NoticeSteps',
  props: {
    /**
     * 是否是创建者
     */
    isCreator: {
      type: Boolean,
      default: true
    },
    /**
     * 审核状态id
     */
    cmNoticeStatusId: {
      type: Number,
      default: 0
    },
    /**
     * 灾前上报开始时间
     */
    disasterFrontStartTime: {
      type: String,
      default: ''
    },
    /**
     * 灾前上报结束时间
     */
    disasterFrontEndTime: {
      type: String,
      default: ''
    },
    /**
     * 灾后上报开始时间
     */
    disasterAfterStartTime: {
      type: String,
      default: ''
    },
    /**
     * 灾后上报结束时间
     */
    disasterAfterEndTime: {
      type: String,
      default: ''
    },
    /**
     * 灾前距离开始时间
     */
    frontDistanceStartTime: {
      type: String,
      default: ''
    },
    /**
     * 灾前距离结束时间
     */
     frontDistanceEndTime: {
      type: String,
      default: ''
    },
    /**
     * 灾后距离开始时间
     */
     afterDistanceStartTime: {
      type: String,
      default: ''
    },
    /**
     * 灾后距离结束时间
     */
     afterDistanceEndTime: {
      type: String,
      default: ''
    },
    /**
     * 驳回理由
     */
    verifyReason: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      creatorSteps: [
        {
          title: '创建通知',
          description: '创建成功暂未发布'
        },
        {
          title: '审核通知',
          description: '应急通知需要提交审核'
        },
        {
          title: '灾前准备上报',
          description: '在设置时间内上报灾前情况'
        },
        {
          title: '灾后恢复上报',
          description: '在设置时间内上报灾后情况'
        }
      ],
      current: 0,
      /**
       * 第四步 灾后上报 的状态
       */
      disasterAfterStatus: 'wait'
    }
  },
  computed: {
    steps () {
      return this.isCreator ? this.creatorSteps : this.creatorSteps.slice(-2)
      // return this.creatorSteps
    },
    /**
     * 灾前上报时间是否开始
     * true： 未开始
     */
    isStartDisasterFrontTime () {
      return moment(this.disasterFrontStartTime).isAfter(moment())
    },
    /**
     * 灾前上报时间是否结束
     * true: 已结束
     */
    isEndDisasterFrontTime () {
      return moment().isAfter(moment(this.disasterFrontEndTime))
    },
    /**
     * 灾后恢复时间是否开始
     * true: 未开始
     */
    isStartDisasterAfterTime () {
      return moment(this.disasterAfterStartTime).isAfter(moment())
    },
    /**
     * 灾后恢复时间是否结束
     * true： 已结束
     */
    isEndDisasterAfterTime () {
      return moment().isAfter(moment(this.disasterAfterEndTime))
    },
    isReject () {
      return this.creatorSteps[1].status === 'error'
    }
  },
  watch: {
    cmNoticeStatusId: {
      handler () {
        this.initStepsStatus()
      },
      immediate: true
    }
  },
  methods: {
    initStepsStatus () {
      let currentStep = 0
      switch (this.cmNoticeStatusId) {
        case 0:
          currentStep = 0
          break
        case 1:
          currentStep = 1
          this.creatorSteps[0].description = '应急通知提交发布'
          this.creatorSteps[1].description = '应急通知审核中'
          break
        case -1:
          currentStep = 1
          this.creatorSteps[1].status = 'error'
          this.creatorSteps[1].description = '应急通知审核已驳回'
          break
        case 2:
          currentStep = 2
          this.creatorSteps[3].status = 'process'
          this.creatorSteps[1].description = '审核通过，应急通知发送成功'
          this.creatorSteps[2].description = `距离开始时间：${this.frontDistanceStartTime}\n距离结束时间：${this.frontDistanceEndTime}`
          this.creatorSteps[3].description = `距离开始时间：${this.afterDistanceStartTime}\n距离结束时间：${this.afterDistanceEndTime}`
          // 如果 灾后时间已开始，则 灾后状态未 process
          // 如果灾前上报时间结束
          if (this.isEndDisasterFrontTime) {
            currentStep = 4
            this.creatorSteps[2].description = '灾前上报已结束'
          }
          // 如果灾后上报开始
          if (!this.isStartDisasterAfterTime && !this.isEndDisasterAfterTime) {
            this.creatorSteps[3].status = 'process'
            // this.creatorSteps[3].description = `距离开始时间：${this.afterDistanceStartTime}\n距离结束时间：${this.afterDistanceEndTime}`
          }
          // 如果 灾后时间结束， 则 step 为 4， 第四步的状态为 finish
          if (this.isEndDisasterAfterTime) {
            this.creatorSteps[3].status = 'finish'
            this.creatorSteps[3].description = '灾后上报已结束'
          }
          break
        default:
          break
      }
      // this.current = currentStep
      this.current = this.isCreator ? currentStep : currentStep - 2
    }
  }
}
</script>

<style lang="less" scoped>
.top-error {
  margin-bottom: 10px;
}
.custom-step /deep/ .ant-steps-item-description {
  white-space: break-spaces;
}
</style>
