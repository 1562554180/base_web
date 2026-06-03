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
], function(r, e, t, n, a, i, o, u, c, d, s, f, y) {
  'use strict';
  function p() {
    this._workerName = 'createPlaneOutlineGeometry';
  }
  (p.packedLength = 0),
    (p.pack = function(e, t) {
      return t;
    }),
    (p.unpack = function(e, t, n) {
      return r.defined(n) ? n : new p();
    });
  var m = new a.Cartesian3(-0.5, -0.5, 0),
    b = new a.Cartesian3(0.5, 0.5, 0);
  return (
    (p.createGeometry = function() {
      var e = new y.GeometryAttributes(),
        t = new Uint16Array(8),
        n = new Float64Array(12);
      return (
        (n[0] = m.x),
        (n[1] = m.y),
        (n[2] = m.z),
        (n[3] = b.x),
        (n[4] = m.y),
        (n[5] = m.z),
        (n[6] = b.x),
        (n[7] = b.y),
        (n[8] = m.z),
        (n[9] = m.x),
        (n[10] = b.y),
        (n[11] = m.z),
        (e.position = new s.GeometryAttribute({
          componentDatatype: d.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: n,
        })),
        (t[0] = 0),
        (t[1] = 1),
        (t[2] = 1),
        (t[3] = 2),
        (t[4] = 2),
        (t[5] = 3),
        (t[6] = 3),
        (t[7] = 0),
        new s.Geometry({
          attributes: e,
          indices: t,
          primitiveType: s.PrimitiveType.LINES,
          boundingSphere: new o.BoundingSphere(a.Cartesian3.ZERO, Math.sqrt(2)),
        })
      );
    }),
    function(e, t) {
      return r.defined(t) && (e = p.unpack(e, t)), p.createGeometry(e);
    }
  );
});
