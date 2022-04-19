<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button style="float: right" @click="goBack">返回</a-button>
    </template>
    <a-card :bordered="false">
      <a-card title="审核记录" :bordered="false">
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :scroll="scroll"
        >
          <span slot="des" slot-scope="text">
            <ellipsis :length="20" tooltip>
              {{ text }}
            </ellipsis>
          </span>
        </s-table>
      </a-card>

      <a-card title="基本信息">
        <div class="baseinfo">
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
                  <a v-if="!isCreator" @click="lookupNoticeObject">查看通知对象</a>
                  <span class="tip-text">选中区域范围内的项目经理和选中区域范围内的部门工作人员将收到短信</span>
                </a-space>
              </td>
            </tr>
            <tr>
              <td class="left-td">应急文件</td>
              <td>
                <div v-for="file in info.fileList" :key="file.fileId">
                  <!-- @click="downFile" -->
                  <a :href="file.fileUrl">{{ file.fileName }}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td class="left-td">工作内容</td>
              <td>{{ info.content }}</td>
            </tr>
          </table>
        </div>
      </a-card>
      <a-space>
        <a-button @click="goBack">返回</a-button>
      </a-space>
    </a-card>
    <ReceiverInfoDrawer ref="receiverInfoDrawerRef" :noticeId="noticeId" :receiverList="receiverList" />
  </page-header-wrapper>
</template>

<script>
import { getNoticeDetail } from '@/api/contingencyManage/emergencyNoticeManage.js'
import { getVerifyDetail } from '@/api/contingencyManage/examineNotice.js'
import { generatorID } from '@/utils/util'

import ReceiverInfoDrawer from '../emergencyNoticeManage/modules/ReceiverInfoDrawer.vue'
import { STable, Ellipsis } from '@/components'

export default {
  name: 'NoticeDetail',
  components: {
    STable,
    Ellipsis,
    ReceiverInfoDrawer
  },
  data () {
    return {
      noticeId: null,
      info: {},
      scroll: {
        x: true
      },
      columns: [
        {
          title: '审核时间',
          dataIndex: 'verifyTime'
        },
        {
          title: '审核人',
          dataIndex: 'upVerifyName'
        },
        {
          title: '审核状态',
          dataIndex: 'cmNoticeStatus'
        },
        {
          title: '不通过理由',
          dataIndex: 'verifyReason',
          scopedSlots: { customRender: 'des' }
        }
      ]
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
    loadData (parameter) {
      return getVerifyDetail(Object.assign({}, parameter, {
        cmNoticeId: this.noticeId
      })).then(res => {
        res.list = res.list.map(l => {
          l.id = generatorID()
          return l
        })
        return res
      })
    },
    /**
     * 查看通知对象
     */
    lookupNoticeObject () {
      this.$refs.receiverInfoDrawerRef.showDrawer()
    },
    // downFile () {

    // },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.baseinfo {
  color: #2a2a2a;
  line-height: 35px;
  .left-td {
    width: 120px;
    text-align: right;
    vertical-align: top;
    &::after {
      content: '：';
      display: inline-block;
    }
  }
  // .multiline-row {
  // }
}

.tip-text {
  color: rgb(42, 42, 42);
  font-size: 14px;
}
</style>
