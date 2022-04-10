<template>
  <a-drawer :title="title" :visible="visible" @close="onClose" :width="drawerConfig.drawerWidth">
    <div class="drawer-content">
      <a-form :form="form" :labelCol="drawerConfig.labelCol" :wrapperCol="drawerConfig.wrapperCol">
        <a-form-item label="项目名称">
          <a-input
            v-decorator="['floor', { rules: [{ required: true, message: '请输入项目名称' }] }]"
            allowClear
            placeholder="请输入项目名称"
            :disabled="isEdit"
            :maxLength="30"
          />
        </a-form-item>
        <a-form-item label="项目类型">
          <a-select
            v-decorator="['floorTypeId', { rules: [{ required: true, message: '请选择项目类型!' }] }]"
            allowClear
            placeholder="请选择项目类型"
          >
            <a-select-option v-for="d in projectTypes" :key="d.optionValueId" :value="d.optionValueId">
              {{ d.optionName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="区域">
          <a-cascader
            placeholder="请选择"
            allowClear
            change-on-select
            :options="areaList"
            :fieldNames="{ label: 'areaName', value: 'areaId', children: 'children' }"
            :load-data="loadGlbArea"
            v-decorator="['area', { rules: [{ required: true, message: '请选择区域!' }] }]"
            @change="areaChange"
          />
        </a-form-item>
        <a-form-item label="开发商">
          <a-select
            v-decorator="['developCompanyId']"
            allowClear
            show-search
            :filter-option="false"
            placeholder="请选择开发商，支持搜索"
            @search="getDevelopList"
          >
            <a-select-option v-for="d in developList" :value="d.developCompanyId" :key="d.developCompanyId">
              {{ d.developCompanyName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="物业服务企业">
          <a-select
            v-decorator="['propertyId']"
            allowClear
            show-search
            :filter-option="false"
            placeholder="请选择物业服务企业，支持搜索"
            @search="getCompanyList">
            <a-select-option v-for="d in companyList" :value="d.proCompanyId" :key="d.proCompanyId">
              {{ d.proCompanyName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目详细地址">
          <a-textarea :maxLength="100" v-decorator="['address', { rules: [ { required: true, message: '请输入项目详细地址' } ] }]" placeholder="请输入项目详细地址" :rows="4" />
        </a-form-item>
        <a-form-item label="地图坐标">
          <FormMap
            v-decorator="[
              'coordinate',
              {
                initialValue: { lng: 120.763549, lat: 30.750974 }
              }
            ]"
          />
          <!-- bmapScope	区域坐标(四至范围）	string
          bmapx	百度地图经度	number(double)
          bmapy	百度地图纬度  number(double) -->
        </a-form-item>
        <a-form-item label="四至范围">
          <a-textarea :maxLength="500" v-decorator="['boundary']" placeholder="请输入四至范围" :rows="4" />
        </a-form-item>
        <a-form-item label="东至">
          <a-input :maxLength="50" v-decorator="['toEast']" allowClear />
        </a-form-item>
        <a-form-item label="南至">
          <a-input :maxLength="50" v-decorator="['toSouth']" allowClear />
        </a-form-item>
        <a-form-item label="西至">
          <a-input :maxLength="50" v-decorator="['toWest']" allowClear />
        </a-form-item>
        <a-form-item label="北至">
          <a-input :maxLength="50" v-decorator="['toNorth']" allowClear />
        </a-form-item>
        <a-form-item label="交付日期">
          <!-- <a-input
            v-decorator="['deliveryDate']"
            allowClear
            placeholder="请输入交付日期"
          /> -->
          <MultipleDate v-decorator="['deliveryDate', { initialValue: [] }]" />
        </a-form-item>
        <a-form-item label="项目期数">
          <div class="form-item-row">
            <a-input-number class="number-input" v-decorator="['totalIssue']" allowClear placeholder="请输入项目期数" />
            <span class="suffix-text">例：2期、3期</span>
          </div>
        </a-form-item>
        <a-form-item label="建筑用地面积：">
          <div class="form-item-row">
            <a-input-number
              :min="0"
              :max="9999999.99"
              :precision="2"
              class="number-input"
              v-decorator="['buildingArea']"
              allowClear
              placeholder="请输入建筑用地面积" />
            <span class="suffix-text">㎡</span>
          </div>
        </a-form-item>
        <a-form-item label="绿化用地面积">
          <div class="form-item-row">
            <a-input-number
              :min="0"
              :max="9999999.99"
              :precision="2"
              class="number-input"
              v-decorator="['greeningArea']"
              allowClear
              placeholder="请输入绿化用地面积" />
            <span class="suffix-text">㎡</span>
          </div>
        </a-form-item>
        <a-form-item label="容积率">
          <div class="form-item-row">
            <a-input :maxLength="40" v-decorator="['cubageRate']" allowClear placeholder="请输入容积率" />
            <span class="suffix-text">例：1.5,2.0；1.7-2.3</span>
          </div>
        </a-form-item>
        <a-form-item label="车位个数">
          <a-input-number
            :min="0"
            :max="99999999999"
            class="number-input"
            v-decorator="['parkingSpaceQuantity']"
            allowClear
            placeholder="请输入车位个数" />
        </a-form-item>
        <a-form-item label="新能源汽车位个数">
          <a-input-number
            :min="0"
            :max="99999999999"
            class="number-input"
            v-decorator="['eparkingSpaceQuantity']"
            allowClear
            placeholder="请输入新能源车位个数" />
        </a-form-item>
        <a-form-item label="人防车位个数">
          <a-input-number
            :min="0"
            :max="99999999999"
            class="number-input"
            v-decorator="['dparkingSpaceQuantity']"
            allowClear
            placeholder="请输入人防车位个数" />
        </a-form-item>
        <a-form-item label="地上车位个数">
          <a-input-number
            :min="0"
            :max="99999999999"
            class="number-input"
            v-decorator="['parkingGround']"
            allowClear
            placeholder="请输入地上车位个数" />
        </a-form-item>
        <a-form-item label="地上车位面积">
          <div class="form-item-row">
            <a-input-number
              :min="0"
              :max="9999999.99"
              :precision="2"
              class="number-input"
              v-decorator="['garageGroundArea']"
              allowClear
              placeholder="请输入地上车位面积" />
            <span class="suffix-text">㎡</span>
          </div>
        </a-form-item>
        <a-form-item label="是否有地下车库">
          <a-radio-group v-decorator="['uparkingSpace', { initialValue: 1 }]" @change="uparkingSpaceChange">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="haveUparkingSpace">
          <a-form-item label="地下车位个数">
            <a-input-number
              :min="0"
              :max="99999999999"
              class="number-input"
              v-decorator="['parkingUnderground']"
              allowClear
              placeholder="请输入地下车位个数" />
          </a-form-item>
          <a-form-item label="地下车位面积">
            <div class="form-item-row">
              <a-input-number
                :min="0"
                :max="9999999.99"
                :precision="2"
                class="number-input"
                v-decorator="['garageUndergroundArea']"
                allowClear
                placeholder="请输入地下车位面积" />
              <span class="suffix-text">㎡</span>
            </div>
          </a-form-item>
        </template>
      </a-form>
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
// ! 交付时间 日期选择 改为 文本框
import { getBaseInfoForEdit, getDevelopList, getCompanyList, saveMaintainProject, addProject } from '@/api/projectManage'
import { dict } from '@/api/system'
import { glbArea } from '@/api/common'
import pick from 'lodash.pick'
import FormMap from '../components/FormMap.vue'
import MultipleDate from '../components/MultipleDate.vue'
import { DeliveryDate } from '../components/utils'
import { cloneDeep } from 'lodash'

const fields = [
  'floor',
  'floorTypeId',
  'developCompanyId',
  'propertyId',
  'address',
  'coordinate',
  'boundary',
  'toEast',
  'toSouth',
  'toWest',
  'toNorth',
  'totalIssue',
  'deliveryDate',
  'buildingArea',
  'greeningArea',
  'cubageRate',
  'uparkingSpace',
  'parkingSpaceQuantity',
  'eparkingSpaceQuantity',
  'dparkingSpaceQuantity',
  'parkingGround',
  'garageGroundArea',
  'parkingUnderground',
  'garageUndergroundArea'
]
export default {
  name: 'MaintainProjectDrawer',
  components: {
    FormMap,
    MultipleDate
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this, { name: 'miantainProject' }),
      iconLoading: false,
      floorId: undefined,
      // 项目类型下拉数据
      projectTypes: [],
      areaList: [],
      // 开发商下拉数据
      developList: [],
      companyList: [],
      areaName: '',
      streetName: '',
      communityName: '',
      area: [],
      /**
       * 是否有 地下车库
       */
      haveUparkingSpace: true,
      isEdit: false
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑项目' : '新增项目'
    },
    /**
     * 当前用户的所属级别的 区域名称
     */
    currentArea () {
      return this.$store.getters?.userInfo?.currentArea
    },
    /**
     * 当前用户的所属级别的 区域Id
     */
    currentAreaId () {
      return this.$store.getters?.userInfo?.currentAreaId
    },
    /**
     * 当前用户所属级别
     * 市 县区 街道 社区
     */
    currentAreaLevel () {
      return this.$store.getters?.userInfo?.currentAreaLevel
    },
    currentAreaInfo () {
      const areaInfo = {
        areaId: this.currentAreaId,
        areaName: this.currentArea
      }
      areaInfo.isLeaf = this.currentAreaLevel === 4
      return areaInfo
    }
  },
  methods: {
    showDrawer (floorId) {
      this.isEdit = Boolean(floorId !== 0 && floorId)
      this.visible = true
      if (this.isEdit) {
        this.floorId = floorId
        // this.getAllNeedAreaList(floorId)
        this.getBaseInfoForEdit(floorId)
      } else {
        this.initAreaList()
      }
      this.initRequestData()
    },
    initAreaList () {
      if (this.currentAreaLevel === 1) {
        this.loadGlbArea()
        return
      }
      this.areaList = [cloneDeep(this.currentAreaInfo)]
    },
    /**
     * 打开抽屉需要进行的一些获取数据的初始化操作
     */
    initRequestData () {
      this.getProjectTypeList()
      this.getDevelopList()
      this.getCompanyList()
    },
    /**
     * 获取 基本详情（需要填入到 表单中的数据）
     */
    getBaseInfoForEdit (floorId) {
      getBaseInfoForEdit(floorId)
        .then(res => {
          const { code, dataBody } = res
          if (code === 0) {
            const { areaId, streetId, communityId } = dataBody
            this.handleBackfillData(dataBody)
            this.getAllNeedAreaList(areaId, streetId, communityId)
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    /**
     * 处理回填到表单的数据
     */
    handleBackfillData (backfillData) {
      // 处理 区域数据
      // const { areaId, areaName, communityId, communityName, streetId, streetName, uparkingSpace } = backfillData
      const { areaName, communityName, streetName, uparkingSpace } = backfillData
      // this.area = backfillData.area = [areaId, streetId, communityId]
      this.areaName = areaName
      this.streetName = streetName
      this.communityName = communityName

      // 处理 交付时间
      const { deliveryDate } = backfillData
      backfillData.deliveryDate = deliveryDate?.split(',').map(d => (new DeliveryDate(d)))

      // 地图坐标处理
      const { bmapx, bmapy } = backfillData
      backfillData.coordinate = {
        lat: bmapx,
        lng: bmapy
      }

      // 处理是否有 地下车库
      this.haveUparkingSpace = uparkingSpace === 1
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(backfillData, fields))
      })
    },
    /**
     * 获取项目类型下拉列表
     */
    getProjectTypeList () {
      dict({ dictionaryCode: 'projectType', optionValueIds: [] }).then(res => {
        if (res.code === 0) {
          this.projectTypes = res.dataBody
        }
      })
    },
    /**
     * 获取区域地址 级联数据
     */
    loadGlbArea (selectedOptions = []) {
      const params = {}
      const level = selectedOptions.length
      const targetOption = selectedOptions[level - 1]
      const haveValue = level !== 0
      if (haveValue) {
        params.areaId = targetOption.areaId
        targetOption.loading = true
      }
      glbArea(params).then(res => {
        const { dataBody } = res
        if (haveValue) {
          targetOption.loading = false
          targetOption.children = !dataBody ? dataBody : dataBody.map(d => {
            d.isLeaf = !d.number
            return d
          })
          this.areaList = [...this.areaList]
        } else {
          this.areaList = dataBody.map(d => {
            d.isLeaf = !d.number
            return d
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    /**
     * 删除 区域下拉列表中， children 为 null 的字段
     */
    deleteChildrenIsNull (list) {
      list.forEach(d => {
        if (d.children && d.children.length) {
          d.children = this.deleteChildrenIsNull(d.children)
        } else {
          delete d.children
        }
      })
      return list
    },
    getAllNeedAreaList (areaId, streetId, communityId) {
      const areaArgs = Array.from(arguments)
      let areaParams = []
      const promiseArr = []
      if (this.currentAreaLevel === 4) {
        // 社区
        this.areaList = [cloneDeep(this.currentAreaInfo)]
        this.$nextTick(() => {
          this.setFormArea(...areaArgs)
        })
        return
      } else if (this.currentAreaLevel === 1) {
        // 市级
        promiseArr.push(glbArea())
        areaParams = [areaId, streetId]
      } else {
        // 区级、街道
        areaParams = [areaId, streetId].filter(item => item)
      }
      areaParams.forEach(l => {
        if (l) {
          promiseArr.push(glbArea({ areaId: l }))
        }
      })
      Promise.all(promiseArr).then(values => {
        const areaArr = values.map(v => v.dataBody)
        if (this.currentAreaLevel > 1 && this.currentAreaLevel < 4) {
          areaArr.unshift([cloneDeep(this.currentAreaInfo)])
        }
        this.areaList = areaArr.reduceRight((accumulator, currentValue, index) => {
          const list = currentValue
          if (index === 2) {
            return list
          } else {
            const id = areaParams[index]
            list.forEach(l => (l.isLeaf = !l.number))
            const areaObj = this.getObjFromList(id, list, 'areaId')
            if (areaObj) {
              areaObj.children = accumulator
            }
            return list
          }
        }, {})
      })
      this.$nextTick(() => {
        this.setFormArea(...areaArgs)
      })
    },
    setFormArea (areaId, streetId, communityId) {
      const areaArgs = Array.from(arguments)
      let area = []
          switch (this.currentAreaLevel) {
            case 1:
              // 市
              area = areaArgs
              break
            case 2:
              // 县区
              area = areaArgs
              break
            case 3:
              // 街道
              area = areaArgs.slice(1)
              break
            case 4:
              area = areaArgs.slice(2)
              break
          }
          this.form.setFieldsValue({ area })
    },
    /**
     * 获取开发商下拉列表
     */
    getDevelopList (name = '') {
      const params = {
        floorId: this.floorId,
        name
      }
      getDevelopList(params).then(res => {
        const { dataBody } = res
        this.developList = dataBody
      })
    },
    /**
     * 获取物业服务企业下拉列表
     */
    getCompanyList (name = '') {
      const params = {
        name,
        floorId: this.floorId
      }
      getCompanyList(params).then(res => {
        const { dataBody } = res
        this.companyList = dataBody
      })
    },
    areaChange (value, selectedOptions) {
      if (selectedOptions) {
        this.areaName = selectedOptions[0]?.areaName
        this.streetName = selectedOptions[1]?.areaName
        this.communityName = selectedOptions[2]?.areaName
      }
    },
    onClose () {
      this.floorId = ''
      this.form.resetFields()
      this.areaName = ''
      this.streetName = ''
      this.communityName = ''
      this.visible = false
      this.isEdit = false
      this.haveUparkingSpace = true
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // 社区 Id
          values.floorId = this.floorId
          // 项目类型名称
          values.floorType = this.getObjFromList(values.floorTypeId, this.projectTypes, 'optionValueId')?.optionName
          // 开发商名称
          values.developCompany = this.getObjFromList(values.developCompanyId, this.developList, 'developCompanyId')?.developCompanyName
          // 物业公司名称
          values.propertyCompany = this.getObjFromList(values.propertyId, this.companyList, 'proCompanyId')?.proCompanyName
          // 区域位置处理
          const [areaId, streetId, communityId] = values.area
          values.areaId = areaId
          values.areaName = this.areaName
          values.streetId = streetId
          values.streetName = this.streetName
          values.communityId = communityId
          values.communityName = this.communityName
          delete values.area

          // 交付时间
          if (values.deliveryDate && values.deliveryDate.length) {
            values.deliveryDate = values.deliveryDate.map(d => d.value).toString()
          } else {
            values.deliveryDate = undefined
          }

          // 地图坐标处理
          const { lat, lng } = values.coordinate || {}
          values.bmapx = lat
          values.bmapy = lng
          delete values.coordinate

          this.iconLoading = true
          if (this.isEdit) {
            saveMaintainProject(values).then(res => {
              const { message } = res
              this.$message.success(message)
              this.onClose()
              this.$emit('ok')
            }).catch(err => {
              this.$message.error(err.message)
            }).finally(() => {
              this.iconLoading = false
            })
          } else {
            addProject(values).then(res => {
              const { message } = res
              this.$message.success(message)
              this.onClose()
              this.$emit('ok')
            }).catch(err => {
              this.$message.error(err.message)
            }).finally(() => {
              this.iconLoading = false
            })
          }
        }
      })
    },
    /**
     * 根据 value 从 对象数组中 查找 对应的对象
     * @param {Number | String} value
     * @param {Array} list 下拉列表
     * @param {String} idFieldName id的属性名城
     * @returns {Object | undefined}
     */
    getObjFromList (value, list, idFieldName) {
      return list.find(l => l[idFieldName] === value)
    },
    /**
     * 是否有地下车库 radio change
     */
    uparkingSpaceChange (e) {
      this.haveUparkingSpace = e.target.value === 1
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
.form-item-row {
  display: flex;
  align-items: center;
  .suffix-text {
    margin-left: 8px;
    white-space: nowrap;
  }
}
.number-input {
  width: 100%;
  ::v-deep .ant-input-number-handler-wrap {
    display: none;
  }
}

</style>
