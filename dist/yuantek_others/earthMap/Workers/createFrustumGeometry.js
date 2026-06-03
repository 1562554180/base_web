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
  './Plane-19a62994',
  './VertexFormat-f7b9c25e',
  './FrustumGeometry-d056e4a1',
], function(r, e, t, a, n, u, d, f, o, m, c, i, s, b, y, G) {
  'use strict';
  return function(e, t) {
    return (
      r.defined(t) && (e = G.FrustumGeometry.unpack(e, t)), G.FrustumGeometry.createGeometry(e)
    );
  };
});
