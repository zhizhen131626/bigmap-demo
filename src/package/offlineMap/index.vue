<template>
  <div class="offline-map-container">
    <div class="offline-map" :id="vid"></div>
  </div>
</template>

<script>
import onloadFile from './commom/load'
import './commom/index'

export default {
  name: 'offlineMap',
  props: ['url', 'vid', 'borderId', 'center', 'zoom', 'zoomControl', 'fitBounds'],
  data() {
    return {
      offlineBM: null,
      offlineMap: null,
      draw: null,
      temp: null,
    }
  },
  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    if (this.offlineMap) {
      this.offlineMap = null
      this.offlineBM = null
    }
  },
  methods: {
    initMap() {
      const { url, vid, borderId, center, zoomControl, zoom, fitBounds } = this
      const maxBounds = fitBounds
      onloadFile(url).then(() => {
        this.offlineBM = window.BM || null
        this.offlineBM.Config.HTTP_URL = url
        this.offlineBM.Config.HTTPS_URL = url

        const httpRegex = /^http:\/\//
        const { protocol } = window.location
        if (httpRegex.test(protocol)) this.offlineBM.Config.FORCE_HTTPS = true

        this.offlineMap = this.offlineBM.map(`${vid}`, borderId, {
          center,
          zoomControl,
          maxBounds
        })
        if (fitBounds) {
          this.offlineMap.fitBounds(fitBounds)
        }
        this.offlineMap.setZoom(zoom)
        // 创建一个图形覆盖物的集合来保存点线面
        const drawnItems = new this.offlineBM.FeatureGroup()
        // 添加在地图上
        this.offlineMap.addLayer(drawnItems)
        // 监听绘画完成事件
        // this.offlineMap.on(this.offlineBM.Draw.Event.CREATED, (e) => {
        //   const { layerType, layer } = e
        //   this.temp = {
        //     layer,
        //     type: layerType
        //   }
        //   drawnItems.addLayer(layer)
        //   layer.editing.enable()
        //   // drawnItems.addLayer(layer).bindTooltip(`半径：${layer._radius}`).openTooltip()
        // })

        // 触发父组件渲染事件
        this.$emit('mapReady', 'ready')
      })
    },
  }
}
</script>

<style lang="less">
.offline-map-container {
  width: 100%;
  height: 100%;
  .offline-map {
    width: 100%;
    height: 100%;
  }
}
</style>
