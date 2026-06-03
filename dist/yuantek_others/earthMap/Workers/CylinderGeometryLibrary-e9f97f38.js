define(['exports', './Math-fbd31710'], function(r, w) {
  'use strict';
  var t = {
    computePositions: function(r, t, a, e, n) {
      var o,
        i = 0.5 * r,
        s = -i,
        c = e + e,
        f = new Float64Array(3 * (n ? 2 * c : c)),
        u = 0,
        M = 0,
        h = n ? 3 * c : 0,
        y = n ? 3 * (c + e) : 3 * e;
      for (o = 0; o < e; o++) {
        var d = (o / e) * w.BMMath.TWO_PI,
          v = Math.cos(d),
          b = Math.sin(d),
          l = v * a,
          m = b * a,
          p = v * t,
          P = b * t;
        (f[M + h] = l),
          (f[M + h + 1] = m),
          (f[M + h + 2] = s),
          (f[M + y] = p),
          (f[M + y + 1] = P),
          (f[M + y + 2] = i),
          (M += 3),
          n && ((f[u++] = l), (f[u++] = m), (f[u++] = s), (f[u++] = p), (f[u++] = P), (f[u++] = i));
      }
      return f;
    },
  };
  r.CylinderGeometryLibrary = t;
});
