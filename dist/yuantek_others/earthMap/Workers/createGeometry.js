define([
  './defined-30a32f90',
  './Math-fbd31710',
  './freezeObject-4d675126',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './defineProperties-deb3db60',
  './Transforms-62d2509c',
  './RuntimeError-98ac9e82',
  './WebGLConstants-deedc028',
  './ComponentDatatype-30a05127',
  './GeometryAttribute-b6f01f29',
  './when-1faa3867',
  './GeometryAttributes-38e93c79',
  './AttributeCompression-4610093c',
  './GeometryPipeline-b073abaf',
  './EncodedCartesian3-b7dd761a',
  './IndexDatatype-a3dd2038',
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './PrimitivePipeline-0749d147',
  './WebMercatorProjection-07b55356',
  './createTaskProcessorWorker',
], function(c, e, r, t, n, a, i, o, d, s, f, u, b, m, l, p, y, P, v, k, C, G) {
  'use strict';
  var W = {};
  function h(e) {
    var r = W[e];
    return (
      c.defined(r) ||
        ('object' == typeof exports
          ? (W[r] = r = require('Workers/' + e))
          : require(['Workers/' + e], function(e) {
              W[(r = e)] = e;
            })),
      r
    );
  }
  return G(function(e, r) {
    for (var t = e.subTasks, n = t.length, a = new Array(n), i = 0; i < n; i++) {
      var o = t[i],
        d = o.geometry,
        s = o.moduleName;
      if (c.defined(s)) {
        var f = h(s);
        a[i] = f(d, o.offset);
      } else a[i] = d;
    }
    return u.when.all(a, function(e) {
      return k.PrimitivePipeline.packCreateGeometryResults(e, r);
    });
  });
});
