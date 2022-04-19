<template>
  <page-header-wrapper>
    <template v-slot:extra>
      <a-button style="float: right" @click="goBack">返回</a-button>
    </template>
    <a-card :bordered="false">
      <a-descriptions class="show-position">
        <a-descriptions-item label="小区">
          {{ info.address }}
        </a-descriptions-item>
        <a-descriptions-item label="风险等级">
          {{ info.riskLevel }}
        </a-descriptions-item>
        <a-descriptions-item label="易涝点地址">
          {{ info.waterlogging }}
        </a-descriptions-item>
        <a-descriptions-item label="积水位置">
          {{ info.pondingLocation }}
        </a-descriptions-item>
        <a-descriptions-item label="影响的住宅人口数">
          {{ info.peopleCount || '-' }}人
        </a-descriptions-item>
        <a-descriptions-item label="影响的住宅楼幢数">
          {{ info.buildingCount || '-' }}幢
        </a-descriptions-item>
        <a-descriptions-item label="积水深度">
          {{ info.pondingDepth || '-' }}cm²
        </a-descriptions-item>
        <a-descriptions-item label="积水面积" :span="2">
          {{ info.pondingDepth || '-' }}m²
        </a-descriptions-item>
        <a-descriptions-item label="位置标注" :span="3">
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
              <bm-view class="map" style="width: 500px; height: 230px"></bm-view>
              <bm-marker :position="{ lng: center.lng, lat: center.lat }" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
              </bm-marker>
            </BaiduMap>
            <div class="contral-wrap">
              <a-space>
                <span>经度：{{ info.mapx }}</span>
                <span>纬度：{{ info.mapy }}</span>
              </a-space>
            </div>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="易涝点图片" :span="3">
          <img
            class="pic-display"
            v-for="(s, idx) in info.fileList"
            :src="s.fileUrl"
            :alt="s.fileName"
            :key="s.fileId"
            @click="previewImg({ images: info.fileList, idx })">
        </a-descriptions-item>
        <a-descriptions-item label="易涝点描述" :span="3">
          <div class="textarea-content">{{ info.waterloggingExplain }}</div>
        </a-descriptions-item>
        <a-descriptions-item label="积水原因" :span="3">
          <div class="textarea-content">{{ info.waterloggingReason }}</div>
        </a-descriptions-item>
      </a-descriptions>
      <a-space style="margin-top: 60px;">
        <a-button @click="goBack">返回</a-button>
      </a-space>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getWaterloggingDetail } from '@/api/contingencyManage/waterlogging.js'
import { BaiduMap, BmControl, BmView, BmMarker } from 'vue-baidu-map'

export default {
  name: 'WaterloggingInfoDrawer',
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmMarker
  },
  data () {
    return {
      // title: '易涝点详情',
      // visible: false,
      zoom: 13,
      info: {},
      isMapReady: false
    }
  },
  computed: {
    center () {
      if (this.isMapReady) {
        return {
          lng: this.info.mapx || 120.750865,
          lat: this.info.mapy || 30.762653
        }
      } else {
        return {
          lng: 120.750865,
          lat: 30.762653
        }
      }
    }
  },
  created () {
    const { waterloggingId } = this.$route.query
    this.getWaterloggingInfo(waterloggingId)
  },
  methods: {
    /**
     * 获取易涝点详情
     */
    getWaterloggingInfo (waterloggingId) {
      getWaterloggingDetail(waterloggingId).then(res => {
        if (res.code === 0) {
          this.info = res.dataBody
        }
      })
    },
    /**
     * 浏览图片
     */
    previewImg ({ images, idx }) {
      this.$viewerApi({
        options: {
          toolbar: true,
          url: 'fileUrl',
          initialViewIndex: idx
        },
        images
      })
    },
    onClose () {
      this.visible = false
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
    goBack () {
      this.$router.back()
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
.pic-display {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 5px;
}
.show-position {
  margin-top: 20px;
}
.contral-wrap {
  line-height: 60px;
}
.textarea-content {
  word-break: break-all;
  margin-right: 30px;
}
</style>
