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
  './GeometryOffsetAttribute-718df502',
  './VertexFormat-f7b9c25e',
  './EllipseGeometryLibrary-b1a5ccfa',
  './GeometryInstance-23fe87b0',
  './EllipseGeometry-be88de37',
], function(o, e, t, r, a, i, n, l, s, d, m, u, c, p, y, _, G, h, f, x, g, b, v, E) {
  'use strict';
  function w(e) {
    var t = (e = r.defaultValue(e, r.defaultValue.EMPTY_OBJECT)).radius,
      i = {
        center: e.center,
        semiMajorAxis: t,
        semiMinorAxis: t,
        ellipsoid: e.ellipsoid,
        height: e.height,
        extrudedHeight: e.extrudedHeight,
        granularity: e.granularity,
        vertexFormat: e.vertexFormat,
        stRotation: e.stRotation,
        shadowVolume: e.shadowVolume,
      };
    (this._ellipseGeometry = new E.EllipseGeometry(i)), (this._workerName = 'createCircleGeometry');
  }
  (w.packedLength = E.EllipseGeometry.packedLength),
    (w.pack = function(e, t, i) {
      return E.EllipseGeometry.pack(e._ellipseGeometry, t, i);
    });
  var A = new E.EllipseGeometry({ center: new a.Cartesian3(), semiMajorAxis: 1, semiMinorAxis: 1 }),
    M = {
      center: new a.Cartesian3(),
      radius: void 0,
      ellipsoid: a.Ellipsoid.clone(a.Ellipsoid.UNIT_SPHERE),
      height: void 0,
      extrudedHeight: void 0,
      granularity: void 0,
      vertexFormat: new g.VertexFormat(),
      stRotation: void 0,
      semiMajorAxis: void 0,
      semiMinorAxis: void 0,
      shadowVolume: void 0,
    };
  return (
    (w.unpack = function(e, t, i) {
      var r = E.EllipseGeometry.unpack(e, t, A);
      return (
        (M.center = a.Cartesian3.clone(r._center, M.center)),
        (M.ellipsoid = a.Ellipsoid.clone(r._ellipsoid, M.ellipsoid)),
        (M.height = r._height),
        (M.extrudedHeight = r._extrudedHeight),
        (M.granularity = r._granularity),
        (M.vertexFormat = g.VertexFormat.clone(r._vertexFormat, M.vertexFormat)),
        (M.stRotation = r._stRotation),
        (M.shadowVolume = r._shadowVolume),
        o.defined(i)
          ? ((M.semiMajorAxis = r._semiMajorAxis),
            (M.semiMinorAxis = r._semiMinorAxis),
            (i._ellipseGeometry = new E.EllipseGeometry(M)),
            i)
          : ((M.radius = r._semiMajorAxis), new w(M))
      );
    }),
    (w.createGeometry = function(e) {
      return E.EllipseGeometry.createGeometry(e._ellipseGeometry);
    }),
    (w.createShadowVolume = function(e, t, i) {
      var r = e._ellipseGeometry._granularity,
        o = e._ellipseGeometry._ellipsoid,
        a = t(r, o),
        n = i(r, o);
      return new w({
        center: e._ellipseGeometry._center,
        radius: e._ellipseGeometry._semiMajorAxis,
        ellipsoid: o,
        stRotation: e._ellipseGeometry._stRotation,
        granularity: r,
        extrudedHeight: a,
        height: n,
        vertexFormat: g.VertexFormat.POSITION_ONLY,
        shadowVolume: !0,
      });
    }),
    i.defineProperties(w.prototype, {
      rectangle: {
        get: function() {
          return this._ellipseGeometry.rectangle;
        },
      },
      textureCoordinateRotationPoints: {
        get: function() {
          return this._ellipseGeometry.textureCoordinateRotationPoints;
        },
      },
    }),
    function(e, t) {
      return (
        o.defined(t) && (e = w.unpack(e, t)),
        (e._ellipseGeometry._center = a.Cartesian3.clone(e._ellipseGeometry._center)),
        (e._ellipseGeometry._ellipsoid = a.Ellipsoid.clone(e._ellipseGeometry._ellipsoid)),
        w.createGeometry(e)
      );
    }
  );
});
