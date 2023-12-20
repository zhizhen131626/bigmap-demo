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
    >
    </offline-map>
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
      center: []
    }
  }
}
</script>

<style lang="less" scoped>
.bige-map {
  width: 1920px;
  height: 100vh;
}
</style>
