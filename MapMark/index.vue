<template>
  <div>
    <BaiduMap
      v-if="haveCoordinate"
      ak="F24144dfca1a28f1ab3e5e8d25770c79"
      :center="value"
      :zoom="zoom"
    >
      <bm-view class="map" style="width: 350px; height: 180px"></bm-view>
      <bm-marker :position="{ lng: value.lng, lat: value.lat }">
      </bm-marker>
    </BaiduMap>
    <a-button type="link" @click="showMap" :disabled="disabled">{{ haveCoordinate ? modifyText : addText }}</a-button>
    <a-modal
      :visible="visible"
      :width="750"
      :maskClosable="false"
      okText="保存"
      cancelText="取消"
      @ok="saveCoordinate"
      @cancel="handleCancel"
    >
      <div>
        <div class="search-input">
          <span style="width: 65px;">搜索：</span>
          <a-input placeholder="请输入需要搜索的区域" v-model="inputText" @keyup.enter="searchAddress" />
          <a-button style="margin-left: 15px" @click="searchAddress">搜索</a-button>
          <a-button style="margin-left: 15px" @click="resetKeyword">重置</a-button>
        </div>
        <BaiduMap
          ak="F24144dfca1a28f1ab3e5e8d25770c79"
          :center="center"
          :zoom="zoom"
          @zoomend="syncCenterAndZoom"
          @click="getClickInfo"
          @moving="syncCenterAndZoom"
          @moveend="syncCenterAndZoom"
        >
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
          <bm-view class="map" style="width: 100%; height: 300px"></bm-view>
          <bm-marker :position="{ lng: center.lng, lat: center.lat }" :dragging="true">
          </bm-marker>
          <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" :panel="false"></bm-local-search>
        </BaiduMap>
        <div class="coordinate">
          <span style="margin-right: 25px;">经度：{{ lng }}</span>
          <span>纬度：{{ lat }}</span>
        </div>
        <div>
          说明：请根据公司名称或具体地址搜索后，拖动地图后标注在对应坐标位置
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
// TODO 更换 地图的 ak
import { BaiduMap, BmControl, BmView, BmMarker, BMScale, BMNavigation } from 'vue-baidu-map'
export default {
  name: 'FormMap',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    addText: {
      type: String,
      default: '添加地图标注'
    },
    modifyText: {
      type: String,
      default: '修改地图标注'
    }
  },
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmMarker,
    BMScale,
    BMNavigation
    // BMGeolocation
  },
  data () {
    const { lng, lat } = this.value || {}
    const value = {
      lng: lng || 120.763549,
      lat: lat || 30.750974
    }
    return {
      zoom: 13,
      lng: value.lng,
      lat: value.lat,
      location: '',
      keyword: '',
      inputText: '',
      visible: false
    }
  },
  computed: {
    center () {
      return {
        lng: this.lng,
        lat: this.lat
      }
    },
    haveCoordinate () {
      const { lng, lat } = this.value || {}
      return lng && lat
    }
  },
  watch: {
    value (val) {
      this.lng = val?.lng || 120.763549
      this.lat = val?.lat || 30.750974
    }
  },
  methods: {
    showMap () {
      this.visible = true
    },
    searchAddress () {
      this.keyword = this.inputText
    },
    // 重置坐标
    resetKeyword () {
      this.inputText = ''
      this.keyword = ''
      this.lng = 120.78483
      this.lat = 30.74744
    },
    syncCenterAndZoom (e) {
      if (this.zoom && this.disabled === false) {
        const { lng, lat } = e.target.getCenter()
        this.lng = lng
        this.lat = lat
        this.zoom = e.target.getZoom()
      }
    },
    getClickInfo (e) {
      if (this.disabled === false) {
        this.lng = e.point.lng
        this.lat = e.point.lat
      }
    },
    handleCancel () {
      this.inputText = ''
      this.visible = false
    },
    saveCoordinate () {
      this.handleCancel()
      this.$emit('change', { lng: this.lng, lat: this.lat })
    }
  }
}
</script>

<style lang="less" scoped>
.search-input {
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  align-items: center;
}
.coordinate {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
