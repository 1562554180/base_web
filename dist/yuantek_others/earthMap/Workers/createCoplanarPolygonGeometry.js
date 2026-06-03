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
  './VertexFormat-f7b9c25e',
  './GeometryInstance-23fe87b0',
  './arrayRemoveDuplicates-7ced389a',
  './BoundingRectangle-15b8287e',
  './EllipsoidTangentPlane-3eacb5a3',
  './OrientedBoundingBox-e0f45029',
  './CoplanarPolygonGeometryLibrary-b8d59c1a',
  './ArcType-e3f6a1cc',
  './EllipsoidRhumbLine-62acd3ce',
  './PolygonPipeline-3dd0399b',
  './PolygonGeometryLibrary-dae77554',
], function(
  s,
  k,
  e,
  p,
  R,
  t,
  M,
  a,
  n,
  B,
  I,
  r,
  H,
  o,
  w,
  i,
  O,
  l,
  y,
  c,
  A,
  F,
  d,
  u,
  m,
  G,
  g,
  b,
  z,
  L
) {
  'use strict';
  var S = new R.Cartesian3(),
    E = new d.BoundingRectangle(),
    N = new R.Cartesian2(),
    Q = new R.Cartesian2(),
    T = new R.Cartesian3(),
    D = new R.Cartesian3(),
    V = new R.Cartesian3(),
    _ = new R.Cartesian3(),
    j = new R.Cartesian3(),
    U = new R.Cartesian3(),
    Y = new M.Quaternion(),
    q = new M.Matrix3(),
    J = new M.Matrix3(),
    W = new R.Cartesian3();
  function Z(e, t, a, n, r, o, i, l) {
    var s = e.positions,
      p = z.PolygonPipeline.triangulate(e.positions2D, e.holes);
    p.length < 3 && (p = [0, 1, 2]);
    var y = O.IndexDatatype.createTypedArray(s.length, p.length);
    y.set(p);
    var c = q;
    if (0 !== n) {
      var d = M.Quaternion.fromAxisAngle(o, n, Y);
      if (((c = M.Matrix3.fromQuaternion(d, c)), t.tangent || t.bitangent)) {
        d = M.Quaternion.fromAxisAngle(o, -n, Y);
        var u = M.Matrix3.fromQuaternion(d, J);
        (i = R.Cartesian3.normalize(M.Matrix3.multiplyByVector(u, i, i), i)),
          t.bitangent && (l = R.Cartesian3.normalize(R.Cartesian3.cross(o, i, l), l));
      }
    } else c = M.Matrix3.clone(M.Matrix3.IDENTITY, c);
    var m = Q;
    t.st && ((m.x = a.x), (m.y = a.y));
    for (
      var g = s.length,
        b = 3 * g,
        v = new Float64Array(b),
        f = t.normal ? new Float32Array(b) : void 0,
        h = t.tangent ? new Float32Array(b) : void 0,
        x = t.bitangent ? new Float32Array(b) : void 0,
        C = t.st ? new Float32Array(2 * g) : void 0,
        P = 0,
        w = 0,
        A = 0,
        F = 0,
        G = 0,
        L = 0;
      L < g;
      L++
    ) {
      var E = s[L];
      if (((v[P++] = E.x), (v[P++] = E.y), (v[P++] = E.z), t.st)) {
        var T = r(M.Matrix3.multiplyByVector(c, E, S), N);
        R.Cartesian2.subtract(T, m, T);
        var D = k.BMMath.clamp(T.x / a.width, 0, 1),
          V = k.BMMath.clamp(T.y / a.height, 0, 1);
        (C[G++] = D), (C[G++] = V);
      }
      t.normal && ((f[w++] = o.x), (f[w++] = o.y), (f[w++] = o.z)),
        t.tangent && ((h[F++] = i.x), (h[F++] = i.y), (h[F++] = i.z)),
        t.bitangent && ((x[A++] = l.x), (x[A++] = l.y), (x[A++] = l.z));
    }
    var _ = new H.GeometryAttributes();
    return (
      t.position &&
        (_.position = new I.GeometryAttribute({
          componentDatatype: B.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: v,
        })),
      t.normal &&
        (_.normal = new I.GeometryAttribute({
          componentDatatype: B.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: f,
        })),
      t.tangent &&
        (_.tangent = new I.GeometryAttribute({
          componentDatatype: B.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: h,
        })),
      t.bitangent &&
        (_.bitangent = new I.GeometryAttribute({
          componentDatatype: B.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: x,
        })),
      t.st &&
        (_.st = new I.GeometryAttribute({
          componentDatatype: B.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: C,
        })),
      new I.Geometry({ attributes: _, indices: y, primitiveType: I.PrimitiveType.TRIANGLES })
    );
  }
  function v(e) {
    var t = (e = p.defaultValue(e, p.defaultValue.EMPTY_OBJECT)).polygonHierarchy,
      a = p.defaultValue(e.vertexFormat, c.VertexFormat.DEFAULT);
    (this._vertexFormat = c.VertexFormat.clone(a)),
      (this._polygonHierarchy = t),
      (this._stRotation = p.defaultValue(e.stRotation, 0)),
      (this._ellipsoid = R.Ellipsoid.clone(p.defaultValue(e.ellipsoid, R.Ellipsoid.WGS84))),
      (this._workerName = 'createCoplanarPolygonGeometry'),
      (this.packedLength =
        L.PolygonGeometryLibrary.computeHierarchyPackedLength(t) +
        c.VertexFormat.packedLength +
        R.Ellipsoid.packedLength +
        2);
  }
  (v.fromPositions = function(e) {
    return new v({
      polygonHierarchy: {
        positions: (e = p.defaultValue(e, p.defaultValue.EMPTY_OBJECT)).positions,
      },
      vertexFormat: e.vertexFormat,
      stRotation: e.stRotation,
      ellipsoid: e.ellipsoid,
    });
  }),
    (v.pack = function(e, t, a) {
      return (
        (a = p.defaultValue(a, 0)),
        (a = L.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy, t, a)),
        R.Ellipsoid.pack(e._ellipsoid, t, a),
        (a += R.Ellipsoid.packedLength),
        c.VertexFormat.pack(e._vertexFormat, t, a),
        (a += c.VertexFormat.packedLength),
        (t[a++] = e._stRotation),
        (t[a] = e.packedLength),
        t
      );
    });
  var f = R.Ellipsoid.clone(R.Ellipsoid.UNIT_SPHERE),
    h = new c.VertexFormat(),
    x = { polygonHierarchy: {} };
  return (
    (v.unpack = function(e, t, a) {
      t = p.defaultValue(t, 0);
      var n = L.PolygonGeometryLibrary.unpackPolygonHierarchy(e, t);
      (t = n.startingIndex), delete n.startingIndex;
      var r = R.Ellipsoid.unpack(e, t, f);
      t += R.Ellipsoid.packedLength;
      var o = c.VertexFormat.unpack(e, t, h);
      t += c.VertexFormat.packedLength;
      var i = e[t++],
        l = e[t];
      return (
        s.defined(a) || (a = new v(x)),
        (a._polygonHierarchy = n),
        (a._ellipsoid = R.Ellipsoid.clone(r, a._ellipsoid)),
        (a._vertexFormat = c.VertexFormat.clone(o, a._vertexFormat)),
        (a._stRotation = i),
        (a.packedLength = l),
        a
      );
    }),
    (v.createGeometry = function(e) {
      var t = e._vertexFormat,
        a = e._polygonHierarchy,
        n = e._stRotation,
        r = a.positions;
      if (!((r = F.arrayRemoveDuplicates(r, R.Cartesian3.equalsEpsilon, !0)).length < 3)) {
        var o = T,
          i = D,
          l = V,
          s = j,
          p = U;
        if (G.CoplanarPolygonGeometryLibrary.computeProjectTo2DArguments(r, _, s, p)) {
          if (
            ((o = R.Cartesian3.cross(s, p, o)),
            (o = R.Cartesian3.normalize(o, o)),
            !R.Cartesian3.equalsEpsilon(_, R.Cartesian3.ZERO, k.BMMath.EPSILON6))
          ) {
            var y = e._ellipsoid.geodeticSurfaceNormal(_, W);
            R.Cartesian3.dot(o, y) < 0 &&
              ((o = R.Cartesian3.negate(o, o)), (s = R.Cartesian3.negate(s, s)));
          }
          var c = G.CoplanarPolygonGeometryLibrary.createProjectPointsTo2DFunction(_, s, p),
            d = G.CoplanarPolygonGeometryLibrary.createProjectPointTo2DFunction(_, s, p);
          t.tangent && (i = R.Cartesian3.clone(s, i)),
            t.bitangent && (l = R.Cartesian3.clone(p, l));
          var u = L.PolygonGeometryLibrary.polygonsFromHierarchy(a, c, !1),
            m = u.hierarchy,
            g = u.polygons;
          if (0 !== m.length) {
            r = m[0].outerRing;
            for (
              var b = M.BoundingSphere.fromPoints(r),
                v = L.PolygonGeometryLibrary.computeBoundingRectangle(o, d, r, n, E),
                f = [],
                h = 0;
              h < g.length;
              h++
            ) {
              var x = new A.GeometryInstance({ geometry: Z(g[h], t, v, n, d, o, i, l) });
              f.push(x);
            }
            var C = w.GeometryPipeline.combineInstances(f)[0];
            (C.attributes.position.values = new Float64Array(C.attributes.position.values)),
              (C.indices = O.IndexDatatype.createTypedArray(
                C.attributes.position.values.length / 3,
                C.indices
              ));
            var P = C.attributes;
            return (
              t.position || delete P.position,
              new I.Geometry({
                attributes: P,
                indices: C.indices,
                primitiveType: C.primitiveType,
                boundingSphere: b,
              })
            );
          }
        }
      }
    }),
    function(e, t) {
      return s.defined(t) && (e = v.unpack(e, t)), v.createGeometry(e);
    }
  );
});
