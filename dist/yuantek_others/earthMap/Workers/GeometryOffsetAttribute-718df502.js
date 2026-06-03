define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './freezeObject-4d675126',
  './defaultValue-5903a66b',
], function(e, t, a, f, d) {
  'use strict';
  var r = f.freezeObject({ NONE: 0, TOP: 1, ALL: 2 });
  (e.GeometryOffsetAttribute = r),
    (e.arrayFill = function(e, t, a, f) {
      if ('function' == typeof e.fill) return e.fill(t, a, f);
      for (
        var r = e.length >>> 0,
          i = d.defaultValue(a, 0),
          l = i < 0 ? Math.max(r + i, 0) : Math.min(i, r),
          n = d.defaultValue(f, r),
          u = n < 0 ? Math.max(r + n, 0) : Math.min(n, r);
        l < u;

      )
        (e[l] = t), l++;
      return e;
    });
});
