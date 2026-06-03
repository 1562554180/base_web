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
  './IndexDatatype-a3dd2038',
  './GeometryOffsetAttribute-718df502',
  './EllipsoidOutlineGeometry-fa42b0a1',
], function(r, e, t, a, n, d, i, f, o, u, b, s, c, l, m, y) {
  'use strict';
  return function(e, t) {
    return (
      r.defined(e.buffer) && (e = y.EllipsoidOutlineGeometry.unpack(e, t)),
      y.EllipsoidOutlineGeometry.createGeometry(e)
    );
  };
});
