<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button style="float: right" @click="goBack">返回</a-button>
    </template>
    <a-card title="基本信息" class="info-card">
      <a-button v-if="!isStreetAccount || isSysAccount" slot="extra" @click="onModifyInfo">修改信息</a-button>
      <a-form :labelCol="drawerConfig.labelCol" :wrapperCol="drawerConfig.wrapperCol">
        <a-form-item label="小区">
          {{ info.floor }}
        </a-form-item>
        <a-form-item label="楼栋">
          {{ info.building || '-' }}栋
        </a-form-item>
        <a-form-item label="位置标注">
          <FormMap v-if="isHaveValue" :value="{lng: info.mapx, lat: info.mapy}" />
        </a-form-item>
        <a-form-item label="坐落地址">
          {{ info.buildingAddress }}
        </a-form-item>
        <a-form-item label="竣工日期">
          {{ info.completionDate ? moment(info.completionDate).format('YYYY-MM-DD') : '-' }}
        </a-form-item>
        <a-form-item label="结构类型">
          {{ info.buildingStructure || '-' }}
        </a-form-item>
        <a-form-item label="建筑层数">
          {{ info.sumLayer || '-' }} 层
        </a-form-item>
        <a-form-item label="总建筑面积">
          {{ info.buildingArea || '-' }} m²
        </a-form-item>
        <a-form-item label="住宅总套数">
          {{ info.buildingHouseCount || '-' }}间
        </a-form-item>
        <a-form-item label="上传危房图片">
          <HouseUpload
            v-model="info.dilapidatedImage"
            :limitPhtotTotal="Infinity"
            multiple
            disabled
            :fileTypes="['png', 'jpg']"
          />
        </a-form-item>
        <a-form-item label="危险点描述">
          <div class="textarea-content">{{ info.dilapidatedExplain || '-' }}</div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="排查结果" class="info-card" v-if="showCheckResult && info.checkSortId">
      <a-button slot="extra" v-if="isPropertySectionAcc || isSysAccount" @click="onModifyCheckInfo">修改结果</a-button>
      <a-row>
        <a-col :offset="3">
          <p class="tip">判定为丙类房屋需要向相关部门申请鉴定危房房</p>
        </a-col>
      </a-row>
      <a-form
        :labelCol="drawerConfig.labelCol"
        :wrapperCol="drawerConfig.wrapperCol"
      >
        <a-form-item label="类别判定">
          {{ info.checkSort }}
        </a-form-item>
        <a-form-item label="现场调查文件">
          <a-space v-if="info.checkFile.length">
            <a v-for="item in info.checkFile" :key="item.fileId" @click="handleDown(item)">
              {{ item.fileName }}
            </a>
          </a-space>
          <span v-else>
            -
          </span>
        </a-form-item>
        <a-form-item label="描述">
          <div class="textarea-content">{{ info.checkExplain || '-' }}</div>
        </a-form-item>
        <a-form-item label="操作人">
          {{ info.upCheckName }}
        </a-form-item>
        <a-form-item label="提交时间">
          {{ info.checkTime }}
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="鉴定结果" class="info-card" v-if="showIdentifyResult && info.dangerousGradeId">
      <a-button slot="extra" v-if="isPropertySectionAcc || isSysAccount" @click="onModifyIdentifyResult">修改结果</a-button>
      <a-form
        :labelCol="drawerConfig.labelCol"
        :wrapperCol="drawerConfig.wrapperCol"
      >
        <a-form-item label="鉴定结果">
          {{ info.dangerousGrade }}
        </a-form-item>
        <a-form-item label="鉴定文件">
          <a-space v-if="info.identifyFile.length">
            <a v-for="item in info.identifyFile" :key="item.fileId" @click="handleDown(item)">
              {{ item.fileName }}
            </a>
          </a-space>
          <span v-else>
            -
          </span>
        </a-form-item>
        <a-form-item label="描述">
          <div class="textarea-content">{{ info.dangerousIdentifyExplain || '-' }}</div>
        </a-form-item>
        <a-form-item label="操作人">
          {{ info.upIdentifyName }}
        </a-form-item>
        <a-form-item label="提交时间">
          {{ info.identifyTime }}
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="巡查记录" class="info-card">
      <a-button slot="extra" v-if="isCommunityAccount || isSysAccount" @click="addPatrolDetail">添加记录</a-button>
      <s-table
        ref="patrolTable"
        size="default"
        rowKey="patrolId"
        :columns="patrolColumns"
        :data="loadPatrolData"
        :scroll="scroll"
      >
        <span slot="des" slot-scope="text">
          <ellipsis :length="40" tooltip>
            {{ text }}
          </ellipsis>
        </span>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a @click="lookupPatrolDetail(record)">查看</a>
            <a v-if="isCommunityAccount || isSysAccount" @click="editPatrolDetail(record)">编辑</a>
            <a v-if="isCommunityAccount || isSysAccount" @click="deletePatrolDetail(record)">删除</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
    <a-card title="处理改造记录" class="info-card" v-if="info.dangerousGradeId">
      <a-button slot="extra" v-if="(isPropertySectionAcc || isSysAccount) && info.offDanger === 0" @click="addRemouldDetail">添加记录</a-button>
      <s-table
        ref="reformTable"
        size="default"
        rowKey="remouldId"
        :columns="modificationColumns"
        :data="loadRecordData"
        :scroll="scroll"
      >
        <span slot="des" slot-scope="text">
          <ellipsis :length="40" tooltip>
            {{ text }}
          </ellipsis>
        </span>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a @click="lookupRemouldDetail(record)">查看</a>
            <a v-if="isPropertySectionAcc || isSysAccount" @click="editRemouldDetail(record)">编辑</a>
            <a v-if="isPropertySectionAcc || isSysAccount" @click="deleteRemouldDetail(record)">删除</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
    <DangerousHouseDrawer ref="dangerousHouseRef" @handleQuery="getInfo" />
    <PatrolRecordDrawer ref="patrolRecordDrawerRef" @handleQuery="handleQueryPatro" />
    <CheckResultDrawer ref="checkResultRef" @handleQuery="getInfo" />
    <IdentificationResult ref="identificationResultRef" @handleQuery="getInfo" />
    <ReformDrawer ref="reformDrawerRef" @handleQuery="refreshReform" />
  </page-header-wrapper>
</template>

<script>
import { getDilapidatedInfo, getPatrolList, deletePatrol, getRemouldList, deleteRemould } from '@/api/contingencyManage/dangerousHouseManage.js'
import { handleDownload } from '@/utils/util'
import { patrolColumns, modificationColumns } from './utils/columns.js'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import FormMap from './components/FormMap.vue'
import HouseUpload from './components/HouseUpload/index.vue'
import PatrolRecordDrawer from './modules/PatrolRecordDrawer.vue'
import CheckResultDrawer from './modules/CheckResultDrawer.vue'
import IdentificationResult from './modules/IdentificationResult.vue'
import ReformDrawer from './modules/ReformDrawer.vue'
import DangerousHouseDrawer from './modules/DangerousHouseDrawer.vue'
import accountMixin from '../mixins/accountMixin.js'

export default {
  name: 'DangerousHouseDetail',
  mixins: [accountMixin],
  components: {
    STable,
    Ellipsis,
    FormMap,
    HouseUpload,
    PatrolRecordDrawer,
    ReformDrawer,
    DangerousHouseDrawer,
    CheckResultDrawer,
    IdentificationResult
  },
  data () {
    return {
      scroll: {
        x: true
      },
      patrolColumns,
      modificationColumns,
      tableData: [],
      dilapidatedId: null,
      info: {}
    }
  },
  computed: {
    /**
     * 是否显示 排查结果
     */
    showCheckResult () {
      return Boolean(this.info.checkSortId)
    },
    /**
     * 是否显示 鉴定结果
     */
    showIdentifyResult () {
      return Boolean(this.info.dangerousGradeId)
    },
    /**
     * 是否是物业科账号
     * 物业科一般都是区县和市级
     */
    isPropertySectionAcc () {
      const currentAreaLevel = this.$store.getters?.userInfo?.currentAreaLevel
      return currentAreaLevel > 0 && currentAreaLevel < 3
    },
    /**
     * 是否获取到数据
     */
    isHaveValue () {
      return Object.keys(this.info).length
    },
    currentAreaLevel () {
      return this.$store.getters?.userInfo?.currentAreaLevel
    },
    /**
     * 是否是街道账号
     */
    isStreetAccount () {
      return this.currentAreaLevel === 3
    },
    /**
     * 是否是社区账号
     */
    isCommunityAccount () {
      return this.currentAreaLevel === 4
    }
  },
  created () {
    this.dilapidatedId = this.$route.query.dilapidatedId
    this.getInfo()
  },
  methods: {
    moment,
    getInfo () {
      getDilapidatedInfo(this.dilapidatedId).then(res => {
        if (res.code === 0) {
          this.info = res.dataBody
        }
      })
    },
    loadPatrolData (parameter) {
      return getPatrolList(Object.assign({}, parameter, {
        dilapidatedId: this.dilapidatedId
      }))
    },
    goBack () {
      this.$router.back()
    },
    lookupPatrolDetail ({ dilapidatedId, patrolId }) {
      this.$refs.patrolRecordDrawerRef.showDrawer(dilapidatedId, patrolId, true)
    },
    editPatrolDetail ({ dilapidatedId, patrolId }) {
      this.$refs.patrolRecordDrawerRef.showDrawer(dilapidatedId, patrolId)
    },
    handleQueryPatro () {
      this.$nextTick(() => {
        this.$refs.patrolTable.refresh(true)
      })
    },
    deletePatrolDetail ({ patrolId }) {
      const that = this
      this.$confirm({
        title: '确定要删除这条巡查记录吗？',
        onOk () {
          deletePatrol(patrolId).then(res => {
            if (res.code === 0) {
              that.$message.success(res.message)
              that.handleQueryPatro()
            }
          }).catch((err) => console.log(err))
        }
      })
    },
    // 文件下载
    handleDown (obj) {
      const { fileUrl, fileName } = obj
      const name = fileName?.split('.')?.slice(0, -1)?.join('')
      handleDownload({
        objectName: fileUrl,
        fileName: name
      })
    },
    loadRecordData (parameter) {
      return getRemouldList(Object.assign({}, parameter, {
        dilapidatedId: this.dilapidatedId
      }))
    },
    lookupRemouldDetail ({ dilapidatedId, remouldId }) {
      this.$refs.reformDrawerRef.showDrawer(dilapidatedId, remouldId, true)
    },
    handleQueryReform () {
      this.$nextTick(() => {
        this.$refs.reformTable.refresh(true)
      })
    },
    refreshReform () {
      this.handleQueryReform()
      this.getInfo()
    },
    editRemouldDetail ({ dilapidatedId, remouldId }) {
      this.$refs.reformDrawerRef.showDrawer(dilapidatedId, remouldId)
    },
    deleteRemouldDetail ({ remouldId }) {
      const that = this
      this.$confirm({
        title: '确定要删除这条处理改造记录吗？',
        onOk () {
          deleteRemould(remouldId).then(res => {
            if (res.code === 0) {
              that.$message.success(res.message)
              that.refreshReform()
            }
          }).catch((err) => console.log(err))
        }
      })
    },
    onModifyInfo () {
      this.$refs.dangerousHouseRef.showDrawer(this.dilapidatedId)
    },
    onModifyCheckInfo () {
      this.$refs.checkResultRef.showDrawer(this.dilapidatedId, true)
    },
    onModifyIdentifyResult () {
      this.$refs.identificationResultRef.showDrawer(this.dilapidatedId, true)
    },
    addPatrolDetail () {
      this.$refs.patrolRecordDrawerRef.showDrawer(this.dilapidatedId)
    },
    addRemouldDetail () {
      this.$refs.reformDrawerRef.showDrawer(this.dilapidatedId)
    }
  }
}
</script>

<style lang="less" scoped>
// .info-card {
//   width: 100%;
// }
.tip {
  line-height: 20px;
  color: #b4b4b4;
}
.textarea-content {
  word-break: break-all;
  margin-right: 30px;
}
</style>
