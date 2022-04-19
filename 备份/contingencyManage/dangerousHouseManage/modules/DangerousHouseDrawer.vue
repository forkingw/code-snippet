<template>
  <a-drawer :title="title" :visible="visible" @close="onClose" :width="drawerConfig.drawerWidth">
    <div class="drawer-content">
      <a-form :form="form" :labelCol="drawerConfig.labelCol" :wrapperCol="drawerConfig.wrapperCol">
        <a-form-item label="小区">
          <a-select
            v-decorator="['floorId', { rules: [{ required: true, message: '请选择小区!' }] }]"
            allowClear
            placeholder="请选择小区，支持输入搜索!"
            show-search
            :filter-option="false"
            @search="getFloorList"
            @change="onFloorChange"
          >
            <a-select-option
              v-for="item in floorList"
              :value="item.floorId"
              :key="item.floorId"
            >
              {{ item.floor }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="楼栋">
          <a-select
            v-decorator="['buildingId']"
            allowClear
            placeholder="请选择楼栋"
            @change="onBuildingChange"
          >
            <a-select-option
              v-for="item in buildingList"
              :value="item.buildingId"
              :key="item.buildingId"
            >
              {{ item.buildingByname }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="位置标注">
          <FormMap
            v-decorator="[
              'coordinate',
              {
                initialValue: {},
                rules: [{ required: true, type: 'object', message: '请选择位置标注！'}]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="坐落地址">
          <a-input
            v-decorator="['buildingAddress', { rules: [{ required: true, message: '请输入坐落地址' }] }]"
            allowClear
            :maxLength="30"
            placeholder="不超过30个字"
          />
        </a-form-item>
        <a-form-item label="竣工日期">
          <a-date-picker
            v-decorator="['completionDate']"
            allowClear
            :format="dateFormat"
            :value-format="dateFormat"
            placeholder="请选择日期"
          ></a-date-picker>
        </a-form-item>
        <a-form-item label="结构类型">
          <a-select
            v-decorator="['buildingStructureId']"
            allowClear
            placeholder="请选择结构类型"
          >
            <a-select-option
              v-for="item in buildingStructureList"
              :value="item.optionValueId"
              :key="item.optionValueId"
            >
              {{ item.optionName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="建筑层数">
          <a-input type="number" v-decorator="['sumLayer', { rules: [ numberRule ] }]" allowClear addon-after="层" />
        </a-form-item>
        <a-form-item label="总建筑面积">
          <a-input type="number" v-decorator="['buildingArea', { rules: [ numberRule ] }]" allowClear addon-after="m²" />
        </a-form-item>
        <a-form-item label="住宅总套数">
          <a-input type="number" v-decorator="['buildingHouseCount', { rules: [ numberRule ] }]" allowClear addon-after="间" />
        </a-form-item>
        <a-form-item label="上传危房图片" extra="仅支持.jpg、png格式。">
          <HouseUpload
            v-decorator="['dilapidatedImage', { initialValue: [], rules: [{ required: true, type: 'array', message: '请上传危房图片!' }] }]"
            :limitPhtotTotal="Infinity"
            multiple
            :fileTypes="['png', 'jpg']"
          />
        </a-form-item>
        <a-form-item label="危险点描述">
          <a-textarea
            v-decorator="['dilapidatedExplain']"
            :maxLength="300"
            placeholder="不超过300个字"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="drawer-bottom-button">
      <a-button :style="{ marginRight: '8px' }" @click="onClose">取消</a-button>
      <a-button type="primary" :loading="iconLoading" @click="handleSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { saveDilapidated, getFloorInfo, getBuildingInfo, getEditHouseInfo } from '@/api/contingencyManage/dangerousHouseManage.js'
import { dropdownList } from '@/api/common'
import { debounce } from '@/utils/util.js'
import FormMap from '@/components/FormMap/index.vue'
import HouseUpload from '../components/HouseUpload/index.vue'
import { pick } from 'lodash'
const fields = ['floorId', 'buildingId', 'coordinate', 'buildingAddress', 'completionDate', 'buildingStructureId', 'sumLayer', 'buildingArea', 'buildingHouseCount', 'dilapidatedImage', 'dilapidatedExplain']

export default {
  name: 'DangerousHouseDrawer',
  components: {
    FormMap,
    HouseUpload
  },
  data () {
    this.getFloorList = debounce(this.getFloorList, 200)
    return {
      visible: false,
      form: this.$form.createForm(this, { name: 'dangerousHouse' }),
      iconLoading: false,
      isEdit: false,
      buildingStructureList: [],
      floorList: [],
      buildingList: [],
      dateFormat: 'YYYY-MM-DD',
      dilapidatedId: undefined,
      info: {},
      numberRule: { validator (rule, value, callback) {
          if (value < 0) {
            callback(new Error('该数字不能小于0'))
          }
          callback()
        }
      }
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑城镇危房' : '新添城镇危房'
    }
  },
  created () {
    this.getInitData()
  },
  methods: {
    getFloorList (value = '') {
      getFloorInfo({
        floor: value
      }).then(res => {
        if (res.code === 0) {
          this.floorList = res.dataBody
        }
      })
    },
    getInitData () {
      dropdownList({
        dictionaryCode: 'buildingStructure'
      }).then(res => {
        if (res.code === 0) {
          this.buildingStructureList = res.dataBody
        }
      })
    },
    onFloorChange (floorId) {
      if (floorId) {
        const floorInfo = this.floorList.find(f => f.floorId === floorId)
        const { bmapx, bmapy } = floorInfo || {}
        if (bmapx && bmapy) {
          this.form.setFieldsValue({ coordinate: { lng: bmapx, lat: bmapy } })
        }
        getBuildingInfo({ floorId }).then(res => {
          if (res.code === 0) {
            this.buildingList = res.dataBody
          }
        })
      } else {
        this.getFloorList()
        this.buildingList = []
        this.form.resetFields(['buildingId', 'coordinate'])
      }
    },
    onBuildingChange (value) {
      const build = this.buildingList.find(b => b.buildingId === value)
      const { bmapx, bmapy } = build || {}
      if (bmapx && bmapy) {
        this.form.setFieldsValue({ coordinate: { lng: bmapx, lat: bmapy } })
      }
    },
    showDrawer (dilapidatedId) {
      this.visible = true
      if (dilapidatedId) {
        this.isEdit = true
        this.dilapidatedId = dilapidatedId
        this.getInfo(dilapidatedId)
      } else {
        this.isEdit = false
        this.getFloorList()
      }
    },
    onClose () {
      this.visible = false
      this.iconLoading = false
      this.isEdit = false
      this.dilapidatedId = undefined
      this.form.resetFields()
    },
    handleSubmit () {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          // floor
          const { floorId, buildingId, coordinate = {}, buildingStructureId } = values
          if (this.isEdit) {
            values.dilapidatedId = this.dilapidatedId
          }
          const floorObj = this.floorList.find(f => f.floorId === floorId)
          values.floor = floorObj?.floor
          values.floorNumber = floorObj?.floorNumber

          // Object.assign(values, build)
          const build = this.buildingList.find(b => b.buildingId === buildingId)
          values.building = build?.building
          values.buildingByname = build?.buildingByname

          values.mapy = coordinate.lat
          values.mapx = coordinate.lng
          delete values.coordinate

          values.buildingStructure = this.buildingStructureList.find(b => b.optionValueId === buildingStructureId)?.optionName

          this.iconLoading = true
          saveDilapidated(values).then(res => {
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
    getInfo (dilapidatedId) {
      getEditHouseInfo(dilapidatedId).then(res => {
        if (res.code === 0) {
          this.info = res.dataBody
          const { building, buildingByname, buildingId, mapx, mapy, floor, floorId, floorNumber, buildingList } = this.info
          this.info.build = { building, buildingByname, buildingId }
          this.info.coordinate = {
            lat: mapy,
            lng: mapx
          }
          this.floorList = [{
            floorId,
            floor,
            floorNumber
          }]
          this.buildingList = buildingList
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.info, fields))
          })
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
  padding-right: 24px;
  overflow: auto;
}
</style>
