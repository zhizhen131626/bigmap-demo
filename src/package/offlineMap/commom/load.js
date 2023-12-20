// const HTTP_URL = 'http://113.240.243.234:17206' // 离线地图服务器地址

const onloadFile = function (HTTP_URL) {
  console.log('HTTP_URL', HTTP_URL)
  return new Promise((resolve) => {
    if (window.BM) {
      resolve(window.BM)
    } else {
      const script = [
        `${HTTP_URL}/bigemap.js/v2.1.0/bigemap.js`,
        // '/static/mouse_draw/bm.draw.min.js',
        // '/static/cluster/bm.markercluster-src.js'
        // 如果有更多的JS要引用 ，也一起放到这个数组中
      ]
      // 换成本地的服务器css文件即可
      // link.href = "http://www.bigemap.com:9000/bigemap.js/v2.1.0/bigemap.css";
      const cssFile = [
        `${HTTP_URL}/bigemap.js/v2.1.0/bigemap.css`,
        // '/static/mouse_draw/Bigemap.draw.css',
        // '/static/cluster/MarkerCluster.Default.css'
      ]
      cssFile.forEach((item) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.async = false
        link.href = item
        document.head.appendChild(link)
      })
      const loads = script.map((v) => {
        const scri = document.createElement('script')
        scri.type = 'text/javascript'
        scri.async = false
        scri.src = v
        document.head.appendChild(scri)
        return scri
      })
      const end = loads.pop()
      end.onload = resolve
    }
  })
}
export default onloadFile
