<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button style="float: right" @click="goBack">返回</a-button>
    </template>
    <a-card :bordered="false">
      <NoticeSteps :isCreator="isCreator" v-bind="info" />
      <div class="baseinfo">
        <h1>基本信息</h1>
        <table>
          <tr>
            <td class="left-td">发起者</td>
            <td>{{ info.areaName }}</td>
          </tr>
          <tr>
            <td class="left-td">通知标题</td>
            <td>{{ info.title }}</td>
          </tr>
          <tr>
            <td class="left-td">通知类型</td>
            <td>{{ info.cmNoticeSort }}</td>
          </tr>
          <tr>
            <td class="left-td">灾前上报时间</td>
            <td>{{ info.disasterFrontStartTime }} 至 {{ info.disasterFrontEndTime }}</td>
          </tr>
          <tr>
            <td class="left-td">灾后上报时间</td>
            <td>{{ info.disasterAfterStartTime }} 至 {{ info.disasterAfterEndTime }}</td>
          </tr>
          <tr>
            <td class="left-td">风险提示等级</td>
            <td>{{ info.riskWarningLevel }}</td>
          </tr>
          <tr>
            <td class="left-td">通知对象</td>
            <td class="multiline-row">
              <div>{{ receiverList.map(r => r.areaName).join('、') }}</div>
              <a-space>
                <a v-if="isCreator" @click="lookupNoticeObject">查看通知对象</a>
                <span class="tip-text">选中区域范围内的项目经理和选中区域范围内的部门工作人员将收到短信</span>
              </a-space>
            </td>
          </tr>
          <tr>
            <td class="left-td">应急文件</td>
            <td>
              <template v-if="info.fileList && info.fileList.length">
                <div v-for="file in info.fileList" :key="file.fileId">
                  <a :href="file.fileUrl">{{ file.fileName }}</a>
                </div>
              </template>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td class="left-td">工作内容</td>
            <td>{{ info.content }}</td>
          </tr>
        </table>
      </div>
      <a-space>
        <a-button v-if="isShowOperationButton" type="primary" @click="editNotice" v-action:edit>编辑</a-button>
        <a-button v-if="isShowPublishButton" type="primary" @click="releaseNotice" v-action:pass :loading="publishLoading">发布</a-button>
        <a-button @click="goBack">返回</a-button>
      </a-space>
    </a-card>
    <EmergencyNoticeDrawer ref="emergencyNoticeDrawerRef" @handleQuery="getNoticeDetail" />
    <ReceiverInfoDrawer ref="receiverInfoDrawerRef" :noticeId="noticeId" :receiverList="receiverList" />
  </page-header-wrapper>
</template>

<script>
import { getNoticeDetail, publishNotice } from '@/api/contingencyManage/emergencyNoticeManage.js'
import NoticeSteps from './components/NoticeSteps/index.vue'
import EmergencyNoticeDrawer from './modules/EmergencyNoticeDrawer.vue'
import ReceiverInfoDrawer from './modules/ReceiverInfoDrawer.vue'

export default {
  name: 'NoticeDetail',
  components: {
    NoticeSteps,
    EmergencyNoticeDrawer,
    ReceiverInfoDrawer
  },
  data () {
    return {
      noticeId: null,
      publishLoading: false,
      info: {}
    }
  },
  computed: {
    /**
     * 当前账户 id
     */
    currentUserId () {
      return this.$store.state?.user?.info?.userId
    },
    /**
     * 是否是创建者
     */
    isCreator () {
      return this.currentUserId === this.info.upManageUserId
    },
    isShowPublishButton () {
      return this.isCreator && this.info.cmNoticeStatusId === 0
    },
    isShowOperationButton () {
      return this.isCreator && [-1, 0].includes(this.info.cmNoticeStatusId)
    },
    receiverList () {
      return this.info.receiverList || []
    }
  },
  created () {
    this.noticeId = this.$route.query.noticeId
    this.getNoticeDetail()
  },
  methods: {
    getNoticeDetail () {
      getNoticeDetail(this.noticeId).then(res => {
        if (res.code === 0) {
          this.info = res.dataBody
        }
      })
    },
    /**
     * 编辑
     */
    editNotice () {
      this.$refs.emergencyNoticeDrawerRef.showDrawer(this.info.noticeId)
    },
    /**
     * 发布通知
     */
    releaseNotice () {
      this.publishLoading = true
      publishNotice(this.info.noticeId).then(res => {
        if (res.code === 0) {
          this.$message.success(res.message)
          this.getNoticeDetail()
        }
      }).finally(() => {
        this.publishLoading = false
      })
    },
    /**
     * 查看通知对象
     */
    lookupNoticeObject () {
      this.$refs.receiverInfoDrawerRef.showDrawer()
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.baseinfo {
  margin-top: 15px;
  margin-bottom: 35px;
  color: #2a2a2a;
  line-height: 35px;

  h1 {
    color: #101010;
    font-weight: bold;
    font-size: 18px;
  }
  .left-td {
    width: 120px;
    text-align: right;
    vertical-align: top;
    &::after {
      content: '：';
      display: inline-block;
    }
  }
}

.tip-text {
  color: #b4b4b4;
  font-size: 14px;
}
</style>
