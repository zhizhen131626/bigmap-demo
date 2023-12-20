const isPointInPolygon = (a, b, c) => {
  const d = a[0]
  const a1 = a[1]
  let e = !1
  let f = null
  let h = null
  let k = null
  let l = null
  const m = b.length
  let n = 0
  for (l = m - 1; n < m; l = n, n += 1) {
    let p = !1
    f = b[n][0]
    h = b[n][1]
    k = b[l][0]
    l = b[l][1]
    if ((f === d && h === a1) || (k === d && l === a1)) return c ? !0 : !1
    if (h < a1 === l >= a1) {
      f = ((k - f) * (a1 - h)) / (l - h) + f
      if (d === f) return c ? !0 : !1
      p = d < f
    }
    if (p) {
      e = !e
    }
  }
  return e
}
export default { isPointInPolygon }
