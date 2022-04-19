<template>
  <div>
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
      <bm-view class="map" style="width: 100%; height: 230px"></bm-view>
      <bm-marker :position="{ lng: center.lng, lat: center.lat }" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      </bm-marker>
      <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" :panel="false"></bm-local-search>
    </BaiduMap>
    <div class="contral-wrap">
      <div class="contral-item">
        <span>经度：</span><a-input-number class="inputNumberWidth" :value="lng" @change="lngChange" />
      </div>
      <div class="contral-item">
        <span>纬度：</span><a-input-number class="inputNumberWidth" :value="lat" @change="latChange" />
      </div>
    </div>
    <div class="contral-item" style="margin-top: 10px">
      <span>搜索：</span><a-input style="width: 200px;" placeholder="请输入需要搜索的区域" v-model="keyword" />
      <a-button style="margin-left: 15px" @click="resetKeyword">重置</a-button>
    </div>
  </div>
</template>

<script>
// TODO 更换 地图的 ak
import { BaiduMap, BmControl, BmView, BmMarker, BMScale, BMNavigation } from 'vue-baidu-map'
export default {
  name: 'FormMap',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
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
    const { lng, lat } = this.value
    const value = {
      lng: lng || 120.763549,
      lat: lat || 30.750974
    }
    return {
      zoom: 13,
      lng: value.lng,
      lat: value.lat,
      location: '',
      keyword: ''
    }
  },
  computed: {
    center () {
      return {
        lng: this.lng,
        lat: this.lat
      }
    }
  },
  watch: {
    value (val) {
      this.lng = val?.lng || 120.763549
      this.lat = val?.lat || 30.750974
    }
  },
  methods: {
    // 重置坐标
    resetKeyword () {
      this.keyword = ''
      this.lng = 120.78483
      this.lat = 30.74744
    },
    lngChange (lng) {
      this.$emit('change', { lng, lat: this.lat })
    },
    latChange (lat) {
      this.$emit('change', { lng: this.lng, lat })
    },
    syncCenterAndZoom (e) {
      if (this.zoom && this.disabled === false) {
        const { lng, lat } = e.target.getCenter()
        this.lng = lng
        this.lat = lat
        this.$emit('change', { lng, lat })
        this.zoom = e.target.getZoom()
      }
    },
    getClickInfo (e) {
      if (this.disabled === false) {
        this.lng = e.point.lng
        this.lat = e.point.lat
      }
    }
  }
}
</script>

<style lang="less" scoped>
.inputNumberWidth {
  width: 141px;
}
.contral-wrap {
  margin-top: 8px;
  display: flex;
  .contral-item {
    flex: 1;
  }
}
</style>
