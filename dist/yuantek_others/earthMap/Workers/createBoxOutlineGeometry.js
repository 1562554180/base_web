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
  './GeometryOffsetAttribute-718df502',
], function(d, e, t, u, c, a, p, n, i, l, y, r, b, C) {
  'use strict';
  var A = new c.Cartesian3();
  function m(e) {
    var t = (e = u.defaultValue(e, u.defaultValue.EMPTY_OBJECT)).minimum,
      a = e.maximum;
    (this._min = c.Cartesian3.clone(t)),
      (this._max = c.Cartesian3.clone(a)),
      (this._offsetAttribute = e.offsetAttribute),
      (this._workerName = 'createBoxOutlineGeometry');
  }
  (m.fromDimensions = function(e) {
    var t = (e = u.defaultValue(e, u.defaultValue.EMPTY_OBJECT)).dimensions,
      a = c.Cartesian3.multiplyByScalar(t, 0.5, new c.Cartesian3());
    return new m({
      minimum: c.Cartesian3.negate(a, new c.Cartesian3()),
      maximum: a,
      offsetAttribute: e.offsetAttribute,
    });
  }),
    (m.fromAxisAlignedBoundingBox = function(e) {
      return new m({ minimum: e.minimum, maximum: e.maximum });
    }),
    (m.packedLength = 2 * c.Cartesian3.packedLength + 1),
    (m.pack = function(e, t, a) {
      return (
        (a = u.defaultValue(a, 0)),
        c.Cartesian3.pack(e._min, t, a),
        c.Cartesian3.pack(e._max, t, a + c.Cartesian3.packedLength),
        (t[a + 2 * c.Cartesian3.packedLength] = u.defaultValue(e._offsetAttribute, -1)),
        t
      );
    });
  var o = new c.Cartesian3(),
    s = new c.Cartesian3(),
    f = { minimum: o, maximum: s, offsetAttribute: void 0 };
  return (
    (m.unpack = function(e, t, a) {
      t = u.defaultValue(t, 0);
      var n = c.Cartesian3.unpack(e, t, o),
        i = c.Cartesian3.unpack(e, t + c.Cartesian3.packedLength, s),
        r = e[t + 2 * c.Cartesian3.packedLength];
      return d.defined(a)
        ? ((a._min = c.Cartesian3.clone(n, a._min)),
          (a._max = c.Cartesian3.clone(i, a._max)),
          (a._offsetAttribute = -1 === r ? void 0 : r),
          a)
        : ((f.offsetAttribute = -1 === r ? void 0 : r), new m(f));
    }),
    (m.createGeometry = function(e) {
      var t = e._min,
        a = e._max;
      if (!c.Cartesian3.equals(t, a)) {
        var n = new b.GeometryAttributes(),
          i = new Uint16Array(24),
          r = new Float64Array(24);
        (r[0] = t.x),
          (r[1] = t.y),
          (r[2] = t.z),
          (r[3] = a.x),
          (r[4] = t.y),
          (r[5] = t.z),
          (r[6] = a.x),
          (r[7] = a.y),
          (r[8] = t.z),
          (r[9] = t.x),
          (r[10] = a.y),
          (r[11] = t.z),
          (r[12] = t.x),
          (r[13] = t.y),
          (r[14] = a.z),
          (r[15] = a.x),
          (r[16] = t.y),
          (r[17] = a.z),
          (r[18] = a.x),
          (r[19] = a.y),
          (r[20] = a.z),
          (r[21] = t.x),
          (r[22] = a.y),
          (r[23] = a.z),
          (n.position = new y.GeometryAttribute({
            componentDatatype: l.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: r,
          })),
          (i[0] = 4),
          (i[1] = 5),
          (i[2] = 5),
          (i[3] = 6),
          (i[4] = 6),
          (i[5] = 7),
          (i[6] = 7),
          (i[7] = 4),
          (i[8] = 0),
          (i[9] = 1),
          (i[10] = 1),
          (i[11] = 2),
          (i[12] = 2),
          (i[13] = 3),
          (i[14] = 3),
          (i[15] = 0),
          (i[16] = 0),
          (i[17] = 4),
          (i[18] = 1),
          (i[19] = 5),
          (i[20] = 2),
          (i[21] = 6),
          (i[22] = 3),
          (i[23] = 7);
        var u = c.Cartesian3.subtract(a, t, A),
          m = 0.5 * c.Cartesian3.magnitude(u);
        if (d.defined(e._offsetAttribute)) {
          var o = r.length,
            s = new Uint8Array(o / 3),
            f = e._offsetAttribute === C.GeometryOffsetAttribute.NONE ? 0 : 1;
          C.arrayFill(s, f),
            (n.applyOffset = new y.GeometryAttribute({
              componentDatatype: l.ComponentDatatype.UNSIGNED_BYTE,
              componentsPerAttribute: 1,
              values: s,
            }));
        }
        return new y.Geometry({
          attributes: n,
          indices: i,
          primitiveType: y.PrimitiveType.LINES,
          boundingSphere: new p.BoundingSphere(c.Cartesian3.ZERO, m),
          offsetAttribute: e._offsetAttribute,
        });
      }
    }),
    function(e, t) {
      return d.defined(t) && (e = m.unpack(e, t)), m.createGeometry(e);
    }
  );
});
