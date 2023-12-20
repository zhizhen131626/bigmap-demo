<template>
  <div class="bige-map">
    <offline-map
      ref="offlineMapHome"
      :vid="'offline-map-home'"
      :url="offlineUrl"
      :borderId="offlineBorderId"
      :zoom="zoom"
      :center="center"
      :zoomControl="false"
      :fitBounds="fitBounds"
      @mapReady="triggerRender"
    >
    </offline-map>

    <section class="drawer-operation">
      <template v-if="drawer.alreadyDrawn">
        <a-switch checked-children="聚合" un-checked-children="离散" v-model="isCluster" />
        <a-button class="drawer-btn" key="circle" type="primary" @click="drawStart('circle')">
          绘制圆形
        </a-button>
        <a-button
          class="drawer-btn"
          key="rectangle"
          type="primary"
          @click="drawStart('rectangle')"
        >
          绘制方形
        </a-button>
        <a-button class="drawer-btn" key="polygon" type="primary" @click="drawStart('polygon')">
          绘制多边形
        </a-button>
        <a-button class="drawer-btn" type="primary" @click="setDraw">
          <a-icon type="setting" />
        </a-button>
      </template>
      <template v-if="!drawer.alreadyDrawn">
        <a-button key="cancelDrawn" type="danger" @click="cancelDrawn">绘制取消</a-button>
        <a-button key="showModal" @click="confirmDrawn">绘制完成</a-button>
      </template>
    </section>
  </div>
</template>

<script>
import OfflineMap from '../package/offlineMap/index.vue'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: { OfflineMap },
  data() {
    return {
      offlineBorderId: 'bigemap.42apj9jc',
      offlineUrl: 'https://113.240.243.234:17206',
      fitBounds: [
        [26.57624626159668, 111.87652587890625],
        [27.649473190307617, 114.13833618164062]
      ],
      zoom: 12,
      center: [],
      drawer: {
        type: 'none',
        mode: 'none',
        polygon: null,
        circle: null,
        rectangle: null,
        alreadyDrawn: true
      },
    }
  },
  methods: {
    triggerRender(type) {
      switch (type) {
        case 'ready':
          if (this.$refs.offlineMapHome.offlineBM) {
            // this.getResources('ready').then(() => {
            //   this.$refs.offlineMapHome.handlerStatus('cluster', [...this.equipmentData])
            // })
          }
          break
        case 'update':
          // if (!this.isCluster) {
          //   this.handlerScatterData()
          // } else {
          //   this.$refs.offlineMapHome.handlerStatus('cluster', [...this.equipmentData])
          // }
          break
        default:
          break
      }
    },
    drawStart(type) {
      this.drawer.alreadyDrawn = false
      this.$refs.offlineMapHome.drawStart(type, this.styles)
    },
    cancelDrawn() {
      this.$refs.offlineMapHome.cancelDrawn()
      this.drawer.alreadyDrawn = true
    },
    confirmDrawn() {
      this.$refs.offlineMapHome.confirmDrawn((data) => {
        this.selectAreas = data
        // 先进入到终端列表展示，确定之后再发起广播
        this.$refs.selectAreasModal.visible = true
        this.$store.state.mapRelated.showShortcuts = false
        this.cancelDrawn()
      })
      this.drawer.alreadyDrawn = true
    },
  }
}
</script>

<style lang="less" scoped>
.bige-map {
  width: 1920px;
  height: 100vh;
  .drawer-operation {

  }
}
</style>
