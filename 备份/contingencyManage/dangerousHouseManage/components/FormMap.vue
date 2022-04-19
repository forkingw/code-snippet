<template>
  <div>
    <BaiduMap
      ak="F24144dfca1a28f1ab3e5e8d25770c79"
      :center="center"
      :zoom="zoom"
      @zoomend="syncCenterAndZoom"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
    >
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <bm-view class="map" style="width: 100%; height: 230px"></bm-view>
      <bm-marker :position="{ lng: value.lng, lat: value.lat }" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      </bm-marker>
    </BaiduMap>
    <div class="contral-wrap">
      <div class="contral-item">
        <span>经度：{{ lng }}</span>
      </div>
      <div class="contral-item">
        <span>纬度：{{ lat }}</span>
      </div>
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
    const { lng, lat } = this.value || {}
    const value = {
      lng: lng || 120.763549,
      lat: lat || 30.750974
    }
    return {
      zoom: 13,
      lng: value.lng,
      lat: value.lat
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
    syncCenterAndZoom (e) {
      if (this.zoom && this.disabled === false) {
        const { lng, lat } = e.target.getCenter()
        this.lng = lng
        this.lat = lat
        this.zoom = e.target.getZoom()
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
