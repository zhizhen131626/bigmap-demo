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
        this.offlineMap.on(this.offlineBM.Draw.Event.CREATED, (e) => {
          const { layerType, layer } = e
          this.temp = {
            layer,
            type: layerType
          }
          drawnItems.addLayer(layer)
          layer.editing.enable()
          drawnItems.addLayer(layer).bindTooltip(`半径：${layer._radius}`).openTooltip()
        })

        // 触发父组件渲染事件
        this.$emit('mapReady', 'ready')
      })
    },
    handlerStatus(type, data) {
      if (type === 'scatter') {
        this.clearMarker()
        // 添加离散点
        this.addMarker(data)
      } else if (type === 'cluster') {
        this.clearMarker()
        // 添加聚合图层
        this.addCluster(data)
      }
    },
    clearMarker() {},
    addMarker() {},
    drawStart(type, options) {
      /* eslint no-underscore-dangle: 0 */
      if (this.draw && this.draw._enabled) this.draw.disable()
      switch (type) {
        case 'circle':
          if (!this.draw || this.draw.type !== 'circle') {
            this.draw = new this.offlineBM.Draw.Circle(this.offlineMap)
            this.draw.options.shapeOptions = options
          }
          break
        case 'rectangle':
          if (!this.draw || this.draw.type !== 'rectangle') {
            this.draw = new this.offlineBM.Draw.Rectangle(this.offlineMap)
            this.draw.options.shapeOptions = options
          }
          break
        case 'polygon':
          if (!this.draw || this.draw.type !== 'polygon') {
            this.draw = new this.offlineBM.Draw.Polygon(this.offlineMap)
            this.draw.options.shapeOptions = options
          }
          break

        default:
          break
      }
      this.draw.enable()
    },
    cancelDrawn() {
      if (this.draw && this.draw._enabled) {
        // 正在绘制重启绘制
        this.draw.disable()
      } else {
        // 绘制完成删除已绘制的图形
        if (this.temp) this.temp.layer.remove()
        this.draw.disable()
      }
      this.temp = null
      this.draw = null
    },
    confirmDrawn(callback) {
      const selectAreas = []
      const { type, layer } = this.temp
      layer.editing.disable()
      let radius = null
      let latlng = null
      let latlngs = null
      if (type === 'circle') {
        radius = layer._mRadius
        latlng = layer._latlng
      } else {
        latlng = layer._latlngs
        latlngs = latlng[0].map((it) => {
          return [it.lat, it.lng]
        })
      }
      console.log('radius && latlngs', radius, latlngs)
      // let distance = false
      // this.markerData.forEach((item) => {
      //   const { latitude, longitude } = item
      //   if (type === 'circle') {
      //     distance =
      //       this.offlineMap.distance(
      //         {
      //           lat: latitude,
      //           lng: longitude
      //         },
      //         latlng
      //       ) <= radius
      //   } else {
      //     const p = this.offlineMap.project([latitude, longitude])
      //     const ps = latlngs.map((v) => {
      //       return [this.offlineMap.project(v).x, this.offlineMap.project(v).y]
      //     })
      //     distance = this.isPointInPolygon([p.x, p.y], ps)
      //   }
      //   if (distance) {
      //     selectAreas.push(item)
      //   }
      // })
      if (callback) {
        callback(selectAreas)
      }
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
