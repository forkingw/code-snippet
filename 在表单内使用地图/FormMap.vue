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
      @ready="mapReady"
      :scroll-wheel-zoom="true"
    >
      <!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> -->
      <!-- <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale> -->
      <bm-view class="map" style="width: 100%; height: 230px"></bm-view>
      <bm-marker :position="{ lng: center.lng, lat: center.lat }" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      </bm-marker>
    </BaiduMap>
    <div class="contral-wrap">
      <div class="contral-item">
        <span>经度：</span><a-input-number class="inputNumberWidth" :value="lng" @change="lngChange" />
      </div>
      <div class="contral-item">
        <span>纬度：</span><a-input-number class="inputNumberWidth" :value="lat" @change="latChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { BaiduMap, BmControl, BmView, BmMarker } from 'vue-baidu-map'
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
    BmMarker
    // BMScale,
    // BMNavigation,
    // BMGeolocation
  },
  data () {
    const value = Object.assign({}, {
      lng: 120.763549,
      lat: 30.750974
    }, this.value)
    return {
      zoom: 13,
      lng: value.lng,
      lat: value.lat,
      isMapReady: false
    }
  },
  computed: {
    center () {
      if (this.isMapReady) {
        return {
          lng: this.lng || 120.750865,
          lat: this.lat || 30.762653
        }
      } else {
        return {
          lng: 120.750865,
          lat: 30.762653
        }
      }
    }
  },
  watch: {
    value (val = {}) {
      this.lng = val.lng || ''
      this.lat = val.lat || ''
    }
  },
  methods: {
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
        this.zoom = e.target.getZoom()
        this.$emit('change', { lng, lat })
      }
    },
    getClickInfo (e) {
      if (this.disabled === false) {
        this.lng = e.point.lng
        this.lat = e.point.lat
      }
    },
    /**
     * 地图渲染完成
     */
    mapReady () {
      this.isMapReady = true
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
