define(['exports', './defined-30a32f90', './Math-fbd31710', './Cartesian2-06dac25b'], function(
  e,
  a,
  n,
  i
) {
  'use strict';
  function h() {
    (this.high = i.Cartesian3.clone(i.Cartesian3.ZERO)),
      (this.low = i.Cartesian3.clone(i.Cartesian3.ZERO));
  }
  h.encode = function(e, n) {
    var i;
    return (
      a.defined(n) || (n = { high: 0, low: 0 }),
      0 <= e
        ? ((i = 65536 * Math.floor(e / 65536)), (n.high = i), (n.low = e - i))
        : ((i = 65536 * Math.floor(-e / 65536)), (n.high = -i), (n.low = e + i)),
      n
    );
  };
  var t = { high: 0, low: 0 };
  h.fromCartesian = function(e, n) {
    a.defined(n) || (n = new h());
    var i = n.high,
      o = n.low;
    return (
      h.encode(e.x, t),
      (i.x = t.high),
      (o.x = t.low),
      h.encode(e.y, t),
      (i.y = t.high),
      (o.y = t.low),
      h.encode(e.z, t),
      (i.z = t.high),
      (o.z = t.low),
      n
    );
  };
  var r = new h();
  (h.writeElements = function(e, n, i) {
    h.fromCartesian(e, r);
    var o = r.high,
      a = r.low;
    (n[i] = o.x),
      (n[i + 1] = o.y),
      (n[i + 2] = o.z),
      (n[i + 3] = a.x),
      (n[i + 4] = a.y),
      (n[i + 5] = a.z);
  }),
    (e.EncodedCartesian3 = h);
});
