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
  './GeometryInstance-23fe87b0',
  './arrayRemoveDuplicates-7ced389a',
  './BoundingRectangle-15b8287e',
  './EllipsoidTangentPlane-3eacb5a3',
  './ArcType-e3f6a1cc',
  './EllipsoidRhumbLine-62acd3ce',
  './PolygonPipeline-3dd0399b',
  './PolygonGeometryLibrary-dae77554',
  './EllipsoidGeodesic-edb379ae',
], function(
  Y,
  U,
  e,
  v,
  j,
  t,
  Q,
  r,
  a,
  q,
  K,
  o,
  i,
  n,
  M,
  s,
  D,
  l,
  u,
  Z,
  b,
  L,
  p,
  c,
  N,
  y,
  d,
  H,
  R,
  g
) {
  'use strict';
  var m = new j.Cartographic(),
    h = new j.Cartographic();
  function J(e, t, r, a) {
    var o = a.cartesianToCartographic(e, m).height,
      i = a.cartesianToCartographic(t, h);
    (i.height = o), a.cartographicToCartesian(i, t);
    var n = a.cartesianToCartographic(r, h);
    (n.height = o - 100), a.cartographicToCartesian(n, r);
  }
  var B = new c.BoundingRectangle(),
    X = new j.Cartesian3(),
    $ = new j.Cartesian3(),
    ee = new j.Cartesian3(),
    te = new j.Cartesian3(),
    re = new j.Cartesian3(),
    ae = new j.Cartesian3(),
    oe = new j.Cartesian3(),
    ie = new j.Cartesian3(),
    ne = new j.Cartesian3(),
    se = new j.Cartesian2(),
    le = new j.Cartesian2(),
    ue = new j.Cartesian3(),
    pe = new Q.Quaternion(),
    ce = new Q.Matrix3(),
    ye = new Q.Matrix3();
  function S(e) {
    var t = e.vertexFormat,
      r = e.geometry,
      a = e.shadowVolume,
      o = r.attributes.position.values,
      i = o.length,
      n = e.wall,
      s = e.top || n,
      l = e.bottom || n;
    if (t.st || t.normal || t.tangent || t.bitangent || a) {
      var u = e.boundingRectangle,
        p = e.tangentPlane,
        c = e.ellipsoid,
        y = e.stRotation,
        d = e.perPositionHeight,
        g = se;
      (g.x = u.x), (g.y = u.y);
      var m,
        h = t.st ? new Float32Array((i / 3) * 2) : void 0;
      t.normal && (m = d && s && !n ? r.attributes.normal.values : new Float32Array(i));
      var f = t.tangent ? new Float32Array(i) : void 0,
        v = t.bitangent ? new Float32Array(i) : void 0,
        b = a ? new Float32Array(i) : void 0,
        _ = 0,
        P = 0,
        w = $,
        x = ee,
        T = te,
        I = !0,
        A = ce,
        C = ye;
      if (0 !== y) {
        var E = Q.Quaternion.fromAxisAngle(p._plane.normal, y, pe);
        (A = Q.Matrix3.fromQuaternion(E, A)),
          (E = Q.Quaternion.fromAxisAngle(p._plane.normal, -y, pe)),
          (C = Q.Matrix3.fromQuaternion(E, C));
      } else
        (A = Q.Matrix3.clone(Q.Matrix3.IDENTITY, A)), (C = Q.Matrix3.clone(Q.Matrix3.IDENTITY, C));
      var G = 0,
        O = 0;
      s && l && ((G = i / 2), (O = i / 3), (i /= 2));
      for (var V = 0; V < i; V += 3) {
        var F = j.Cartesian3.fromArray(o, V, ue);
        if (t.st) {
          var M = Q.Matrix3.multiplyByVector(A, F, X);
          M = c.scaleToGeodeticSurface(M, M);
          var D = p.projectPointOntoPlane(M, le);
          j.Cartesian2.subtract(D, g, D);
          var L = U.BMMath.clamp(D.x / u.width, 0, 1),
            N = U.BMMath.clamp(D.y / u.height, 0, 1);
          l && ((h[_ + O] = L), (h[_ + 1 + O] = N)), s && ((h[_] = L), (h[_ + 1] = N)), (_ += 2);
        }
        if (t.normal || t.tangent || t.bitangent || a) {
          var H = P + 1,
            R = P + 2;
          if (n) {
            if (V + 3 < i) {
              var B = j.Cartesian3.fromArray(o, V + 3, re);
              if (I) {
                var S = j.Cartesian3.fromArray(o, V + i, ae);
                d && J(F, B, S, c),
                  j.Cartesian3.subtract(B, F, B),
                  j.Cartesian3.subtract(S, F, S),
                  (w = j.Cartesian3.normalize(j.Cartesian3.cross(S, B, w), w)),
                  (I = !1);
              }
              j.Cartesian3.equalsEpsilon(B, F, U.BMMath.EPSILON10) && (I = !0);
            }
            (t.tangent || t.bitangent) &&
              ((T = c.geodeticSurfaceNormal(F, T)),
              t.tangent && (x = j.Cartesian3.normalize(j.Cartesian3.cross(T, w, x), x)));
          } else
            (w = c.geodeticSurfaceNormal(F, w)),
              (t.tangent || t.bitangent) &&
                (d &&
                  ((oe = j.Cartesian3.fromArray(m, P, oe)),
                  (ie = j.Cartesian3.cross(j.Cartesian3.UNIT_Z, oe, ie)),
                  (ie = j.Cartesian3.normalize(Q.Matrix3.multiplyByVector(C, ie, ie), ie)),
                  t.bitangent && (ne = j.Cartesian3.normalize(j.Cartesian3.cross(oe, ie, ne), ne))),
                (x = j.Cartesian3.cross(j.Cartesian3.UNIT_Z, w, x)),
                (x = j.Cartesian3.normalize(Q.Matrix3.multiplyByVector(C, x, x), x)),
                t.bitangent && (T = j.Cartesian3.normalize(j.Cartesian3.cross(w, x, T), T)));
          t.normal &&
            (e.wall
              ? ((m[P + G] = w.x), (m[H + G] = w.y), (m[R + G] = w.z))
              : l && ((m[P + G] = -w.x), (m[H + G] = -w.y), (m[R + G] = -w.z)),
            ((s && !d) || n) && ((m[P] = w.x), (m[H] = w.y), (m[R] = w.z))),
            a &&
              (n && (w = c.geodeticSurfaceNormal(F, w)),
              (b[P + G] = -w.x),
              (b[H + G] = -w.y),
              (b[R + G] = -w.z)),
            t.tangent &&
              (e.wall
                ? ((f[P + G] = x.x), (f[H + G] = x.y), (f[R + G] = x.z))
                : l && ((f[P + G] = -x.x), (f[H + G] = -x.y), (f[R + G] = -x.z)),
              s &&
                (d
                  ? ((f[P] = ie.x), (f[H] = ie.y), (f[R] = ie.z))
                  : ((f[P] = x.x), (f[H] = x.y), (f[R] = x.z)))),
            t.bitangent &&
              (l && ((v[P + G] = T.x), (v[H + G] = T.y), (v[R + G] = T.z)),
              s &&
                (d
                  ? ((v[P] = ne.x), (v[H] = ne.y), (v[R] = ne.z))
                  : ((v[P] = T.x), (v[H] = T.y), (v[R] = T.z)))),
            (P += 3);
        }
      }
      t.st &&
        (r.attributes.st = new K.GeometryAttribute({
          componentDatatype: q.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: h,
        })),
        t.normal &&
          (r.attributes.normal = new K.GeometryAttribute({
            componentDatatype: q.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: m,
          })),
        t.tangent &&
          (r.attributes.tangent = new K.GeometryAttribute({
            componentDatatype: q.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: f,
          })),
        t.bitangent &&
          (r.attributes.bitangent = new K.GeometryAttribute({
            componentDatatype: q.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: v,
          })),
        a &&
          (r.attributes.extrudeDirection = new K.GeometryAttribute({
            componentDatatype: q.ComponentDatatype.FLOAT,
            componentsPerAttribute: 3,
            values: b,
          }));
    }
    if (e.extrude && Y.defined(e.offsetAttribute)) {
      var k = o.length / 3,
        z = new Uint8Array(k);
      if (e.offsetAttribute === Z.GeometryOffsetAttribute.TOP)
        (s && l) || n ? (z = Z.arrayFill(z, 1, 0, k / 2)) : s && (z = Z.arrayFill(z, 1));
      else {
        var W = e.offsetAttribute === Z.GeometryOffsetAttribute.NONE ? 0 : 1;
        z = Z.arrayFill(z, W);
      }
      r.attributes.applyOffset = new K.GeometryAttribute({
        componentDatatype: q.ComponentDatatype.UNSIGNED_BYTE,
        componentsPerAttribute: 1,
        values: z,
      });
    }
    return r;
  }
  var f = new j.Cartographic(),
    _ = new j.Cartographic(),
    P = { westOverIDL: 0, eastOverIDL: 0 },
    w = new g.EllipsoidGeodesic();
  function x(e, t, r, a, o) {
    if (((o = v.defaultValue(o, new j.Rectangle())), !Y.defined(e) || e.length < 3))
      return (o.west = 0), (o.north = 0), (o.south = 0), (o.east = 0), o;
    if (r === y.ArcType.RHUMB) return j.Rectangle.fromCartesianArray(e, t, o);
    w.ellipsoid.equals(t) || (w = new g.EllipsoidGeodesic(void 0, void 0, t)),
      (o.west = Number.POSITIVE_INFINITY),
      (o.east = Number.NEGATIVE_INFINITY),
      (o.south = Number.POSITIVE_INFINITY),
      (o.north = Number.NEGATIVE_INFINITY),
      (P.westOverIDL = Number.POSITIVE_INFINITY),
      (P.eastOverIDL = Number.NEGATIVE_INFINITY);
    for (
      var i,
        n = 1 / U.BMMath.chordLength(a, t.maximumRadius),
        s = e.length,
        l = t.cartesianToCartographic(e[0], _),
        u = f,
        p = 1;
      p < s;
      p++
    )
      (i = u),
        (u = l),
        (l = t.cartesianToCartographic(e[p], i)),
        w.setEndPoints(u, l),
        I(w, n, o, P);
    return (
      (i = u),
      (u = l),
      (l = t.cartesianToCartographic(e[0], i)),
      w.setEndPoints(u, l),
      I(w, n, o, P),
      o.east - o.west > P.eastOverIDL - P.westOverIDL &&
        ((o.west = P.westOverIDL),
        (o.east = P.eastOverIDL),
        o.east > U.BMMath.PI && (o.east = o.east - U.BMMath.TWO_PI),
        o.west > U.BMMath.PI && (o.west = o.west - U.BMMath.TWO_PI)),
      o
    );
  }
  var T = new j.Cartographic();
  function I(e, t, r, a) {
    for (
      var o = e.surfaceDistance,
        i = Math.ceil(o * t),
        n = 0 < i ? o / (i - 1) : Number.POSITIVE_INFINITY,
        s = 0,
        l = 0;
      l < i;
      l++
    ) {
      var u = e.interpolateUsingSurfaceDistance(s, T);
      s += n;
      var p = u.longitude,
        c = u.latitude;
      (r.west = Math.min(r.west, p)),
        (r.east = Math.max(r.east, p)),
        (r.south = Math.min(r.south, c)),
        (r.north = Math.max(r.north, c));
      var y = 0 <= p ? p : p + U.BMMath.TWO_PI;
      (a.westOverIDL = Math.min(a.westOverIDL, y)), (a.eastOverIDL = Math.max(a.eastOverIDL, y));
    }
  }
  var O = [];
  function k(e, t, r, a, o, i, n, s, l) {
    var u,
      p = { walls: [] };
    if (i || n) {
      var c,
        y,
        d = R.PolygonGeometryLibrary.createGeometryFromPositions(e, t, r, o, s, l),
        g = d.attributes.position.values,
        m = d.indices;
      if (i && n) {
        var h = g.concat(g);
        (c = h.length / 3), (y = D.IndexDatatype.createTypedArray(c, 2 * m.length)).set(m);
        var f = m.length,
          v = c / 2;
        for (u = 0; u < f; u += 3) {
          var b = y[u] + v,
            _ = y[u + 1] + v,
            P = y[u + 2] + v;
          (y[u + f] = P), (y[u + 1 + f] = _), (y[u + 2 + f] = b);
        }
        if (((d.attributes.position.values = h), o && s.normal)) {
          var w = d.attributes.normal.values;
          (d.attributes.normal.values = new Float32Array(h.length)),
            d.attributes.normal.values.set(w);
        }
        d.indices = y;
      } else if (n) {
        for (
          c = g.length / 3, y = D.IndexDatatype.createTypedArray(c, m.length), u = 0;
          u < m.length;
          u += 3
        )
          (y[u] = m[u + 2]), (y[u + 1] = m[u + 1]), (y[u + 2] = m[u]);
        d.indices = y;
      }
      p.topAndBottom = new L.GeometryInstance({ geometry: d });
    }
    var x = a.outerRing,
      T = N.EllipsoidTangentPlane.fromPoints(x, e),
      I = T.projectPointsOntoPlane(x, O),
      A = H.PolygonPipeline.computeWindingOrder2D(I);
    A === H.WindingOrder.CLOCKWISE && (x = x.slice().reverse());
    var C = R.PolygonGeometryLibrary.computeWallGeometry(x, e, r, o, l);
    p.walls.push(new L.GeometryInstance({ geometry: C }));
    var E = a.holes;
    for (u = 0; u < E.length; u++) {
      var G = E[u];
      (I = (T = N.EllipsoidTangentPlane.fromPoints(G, e)).projectPointsOntoPlane(G, O)),
        (A = H.PolygonPipeline.computeWindingOrder2D(I)) === H.WindingOrder.COUNTER_CLOCKWISE &&
          (G = G.slice().reverse()),
        (C = R.PolygonGeometryLibrary.computeWallGeometry(G, e, r, o, l)),
        p.walls.push(new L.GeometryInstance({ geometry: C }));
    }
    return p;
  }
  function A(e) {
    var t = e.polygonHierarchy,
      r = v.defaultValue(e.vertexFormat, b.VertexFormat.DEFAULT),
      a = v.defaultValue(e.ellipsoid, j.Ellipsoid.WGS84),
      o = v.defaultValue(e.granularity, U.BMMath.RADIANS_PER_DEGREE),
      i = v.defaultValue(e.stRotation, 0),
      n = v.defaultValue(e.perPositionHeight, !1),
      s = n && Y.defined(e.extrudedHeight),
      l = v.defaultValue(e.height, 0),
      u = v.defaultValue(e.extrudedHeight, l);
    if (!s) {
      var p = Math.max(l, u);
      (u = Math.min(l, u)), (l = p);
    }
    (this._vertexFormat = b.VertexFormat.clone(r)),
      (this._ellipsoid = j.Ellipsoid.clone(a)),
      (this._granularity = o),
      (this._stRotation = i),
      (this._height = l),
      (this._extrudedHeight = u),
      (this._closeTop = v.defaultValue(e.closeTop, !0)),
      (this._closeBottom = v.defaultValue(e.closeBottom, !0)),
      (this._polygonHierarchy = t),
      (this._perPositionHeight = n),
      (this._perPositionHeightExtrude = s),
      (this._shadowVolume = v.defaultValue(e.shadowVolume, !1)),
      (this._workerName = 'createPolygonGeometry'),
      (this._offsetAttribute = e.offsetAttribute),
      (this._arcType = v.defaultValue(e.arcType, y.ArcType.GEODESIC)),
      (this._rectangle = void 0),
      (this._textureCoordinateRotationPoints = void 0),
      (this.packedLength =
        R.PolygonGeometryLibrary.computeHierarchyPackedLength(t) +
        j.Ellipsoid.packedLength +
        b.VertexFormat.packedLength +
        12);
  }
  (A.fromPositions = function(e) {
    return new A({
      polygonHierarchy: {
        positions: (e = v.defaultValue(e, v.defaultValue.EMPTY_OBJECT)).positions,
      },
      height: e.height,
      extrudedHeight: e.extrudedHeight,
      vertexFormat: e.vertexFormat,
      stRotation: e.stRotation,
      ellipsoid: e.ellipsoid,
      granularity: e.granularity,
      perPositionHeight: e.perPositionHeight,
      closeTop: e.closeTop,
      closeBottom: e.closeBottom,
      offsetAttribute: e.offsetAttribute,
      arcType: e.arcType,
    });
  }),
    (A.pack = function(e, t, r) {
      return (
        (r = v.defaultValue(r, 0)),
        (r = R.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy, t, r)),
        j.Ellipsoid.pack(e._ellipsoid, t, r),
        (r += j.Ellipsoid.packedLength),
        b.VertexFormat.pack(e._vertexFormat, t, r),
        (r += b.VertexFormat.packedLength),
        (t[r++] = e._height),
        (t[r++] = e._extrudedHeight),
        (t[r++] = e._granularity),
        (t[r++] = e._stRotation),
        (t[r++] = e._perPositionHeightExtrude ? 1 : 0),
        (t[r++] = e._perPositionHeight ? 1 : 0),
        (t[r++] = e._closeTop ? 1 : 0),
        (t[r++] = e._closeBottom ? 1 : 0),
        (t[r++] = e._shadowVolume ? 1 : 0),
        (t[r++] = v.defaultValue(e._offsetAttribute, -1)),
        (t[r++] = e._arcType),
        (t[r] = e.packedLength),
        t
      );
    });
  var C = j.Ellipsoid.clone(j.Ellipsoid.UNIT_SPHERE),
    E = new b.VertexFormat(),
    G = { polygonHierarchy: {} };
  return (
    (A.unpack = function(e, t, r) {
      t = v.defaultValue(t, 0);
      var a = R.PolygonGeometryLibrary.unpackPolygonHierarchy(e, t);
      (t = a.startingIndex), delete a.startingIndex;
      var o = j.Ellipsoid.unpack(e, t, C);
      t += j.Ellipsoid.packedLength;
      var i = b.VertexFormat.unpack(e, t, E);
      t += b.VertexFormat.packedLength;
      var n = e[t++],
        s = e[t++],
        l = e[t++],
        u = e[t++],
        p = 1 === e[t++],
        c = 1 === e[t++],
        y = 1 === e[t++],
        d = 1 === e[t++],
        g = 1 === e[t++],
        m = e[t++],
        h = e[t++],
        f = e[t];
      return (
        Y.defined(r) || (r = new A(G)),
        (r._polygonHierarchy = a),
        (r._ellipsoid = j.Ellipsoid.clone(o, r._ellipsoid)),
        (r._vertexFormat = b.VertexFormat.clone(i, r._vertexFormat)),
        (r._height = n),
        (r._extrudedHeight = s),
        (r._granularity = l),
        (r._stRotation = u),
        (r._perPositionHeightExtrude = p),
        (r._perPositionHeight = c),
        (r._closeTop = y),
        (r._closeBottom = d),
        (r._shadowVolume = g),
        (r._offsetAttribute = -1 === m ? void 0 : m),
        (r._arcType = h),
        (r.packedLength = f),
        r
      );
    }),
    (A.computeRectangle = function(e, t) {
      var r = v.defaultValue(e.granularity, U.BMMath.RADIANS_PER_DEGREE),
        a = v.defaultValue(e.arcType, y.ArcType.GEODESIC),
        o = e.polygonHierarchy,
        i = v.defaultValue(e.ellipsoid, j.Ellipsoid.WGS84);
      return x(o.positions, i, a, r, t);
    }),
    (A.createGeometry = function(e) {
      var t = e._vertexFormat,
        r = e._ellipsoid,
        a = e._granularity,
        o = e._stRotation,
        i = e._polygonHierarchy,
        n = e._perPositionHeight,
        s = e._closeTop,
        l = e._closeBottom,
        u = e._arcType,
        p = i.positions;
      if (!(p.length < 3)) {
        var c = N.EllipsoidTangentPlane.fromPoints(p, r),
          y = R.PolygonGeometryLibrary.polygonsFromHierarchy(
            i,
            c.projectPointsOntoPlane.bind(c),
            !n,
            r
          ),
          d = y.hierarchy,
          g = y.polygons;
        if (0 !== d.length) {
          p = d[0].outerRing;
          var m,
            h = R.PolygonGeometryLibrary.computeBoundingRectangle(
              c.plane.normal,
              c.projectPointOntoPlane.bind(c),
              p,
              o,
              B
            ),
            f = [],
            v = e._height,
            b = e._extrudedHeight,
            _ = {
              perPositionHeight: n,
              vertexFormat: t,
              geometry: void 0,
              tangentPlane: c,
              boundingRectangle: h,
              ellipsoid: r,
              stRotation: o,
              bottom: !1,
              top: !0,
              wall: !1,
              extrude: !1,
              arcType: u,
            };
          if (e._perPositionHeightExtrude || !U.BMMath.equalsEpsilon(v, b, 0, U.BMMath.EPSILON2))
            for (
              _.extrude = !0,
                _.top = s,
                _.bottom = l,
                _.shadowVolume = e._shadowVolume,
                _.offsetAttribute = e._offsetAttribute,
                m = 0;
              m < g.length;
              m++
            ) {
              var P,
                w = k(r, g[m], a, d[m], n, s, l, t, u);
              s && l
                ? ((P = w.topAndBottom),
                  (_.geometry = R.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(
                    P.geometry,
                    v,
                    b,
                    r,
                    n
                  )))
                : s
                  ? (((P =
                      w.topAndBottom).geometry.attributes.position.values = H.PolygonPipeline.scaleToGeodeticHeight(
                      P.geometry.attributes.position.values,
                      v,
                      r,
                      !n
                    )),
                    (_.geometry = P.geometry))
                  : l &&
                    (((P =
                      w.topAndBottom).geometry.attributes.position.values = H.PolygonPipeline.scaleToGeodeticHeight(
                      P.geometry.attributes.position.values,
                      b,
                      r,
                      !0
                    )),
                    (_.geometry = P.geometry)),
                (s || l) && ((_.wall = !1), (P.geometry = S(_)), f.push(P));
              var x = w.walls;
              _.wall = !0;
              for (var T = 0; T < x.length; T++) {
                var I = x[T];
                (_.geometry = R.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(
                  I.geometry,
                  v,
                  b,
                  r,
                  n
                )),
                  (I.geometry = S(_)),
                  f.push(I);
              }
            }
          else
            for (m = 0; m < g.length; m++) {
              var A = new L.GeometryInstance({
                geometry: R.PolygonGeometryLibrary.createGeometryFromPositions(r, g[m], a, n, t, u),
              });
              if (
                ((A.geometry.attributes.position.values = H.PolygonPipeline.scaleToGeodeticHeight(
                  A.geometry.attributes.position.values,
                  v,
                  r,
                  !n
                )),
                (_.geometry = A.geometry),
                (A.geometry = S(_)),
                Y.defined(e._offsetAttribute))
              ) {
                var C = A.geometry.attributes.position.values.length,
                  E = new Uint8Array(C / 3),
                  G = e._offsetAttribute === Z.GeometryOffsetAttribute.NONE ? 0 : 1;
                Z.arrayFill(E, G),
                  (A.geometry.attributes.applyOffset = new K.GeometryAttribute({
                    componentDatatype: q.ComponentDatatype.UNSIGNED_BYTE,
                    componentsPerAttribute: 1,
                    values: E,
                  }));
              }
              f.push(A);
            }
          var O = M.GeometryPipeline.combineInstances(f)[0];
          (O.attributes.position.values = new Float64Array(O.attributes.position.values)),
            (O.indices = D.IndexDatatype.createTypedArray(
              O.attributes.position.values.length / 3,
              O.indices
            ));
          var V = O.attributes,
            F = Q.BoundingSphere.fromVertices(V.position.values);
          return (
            t.position || delete V.position,
            new K.Geometry({
              attributes: V,
              indices: O.indices,
              primitiveType: O.primitiveType,
              boundingSphere: F,
              offsetAttribute: e._offsetAttribute,
            })
          );
        }
      }
    }),
    (A.createShadowVolume = function(e, t, r) {
      var a = e._granularity,
        o = e._ellipsoid,
        i = t(a, o),
        n = r(a, o);
      return new A({
        polygonHierarchy: e._polygonHierarchy,
        ellipsoid: o,
        stRotation: e._stRotation,
        granularity: a,
        perPositionHeight: !1,
        extrudedHeight: i,
        height: n,
        vertexFormat: b.VertexFormat.POSITION_ONLY,
        shadowVolume: !0,
        arcType: e._arcType,
      });
    }),
    t.defineProperties(A.prototype, {
      rectangle: {
        get: function() {
          if (!Y.defined(this._rectangle)) {
            var e = this._polygonHierarchy.positions;
            this._rectangle = x(e, this._ellipsoid, this._arcType, this._granularity);
          }
          return this._rectangle;
        },
      },
      textureCoordinateRotationPoints: {
        get: function() {
          return (
            Y.defined(this._textureCoordinateRotationPoints) ||
              (this._textureCoordinateRotationPoints = (function(e) {
                var t = -e._stRotation;
                if (0 == t) return [0, 0, 0, 1, 1, 0];
                var r = e._ellipsoid,
                  a = e._polygonHierarchy.positions,
                  o = e.rectangle;
                return K.Geometry._textureCoordinateRotationPoints(a, t, r, o);
              })(this)),
            this._textureCoordinateRotationPoints
          );
        },
      },
    }),
    function(e, t) {
      return (
        Y.defined(t) && (e = A.unpack(e, t)),
        (e._ellipsoid = j.Ellipsoid.clone(e._ellipsoid)),
        A.createGeometry(e)
      );
    }
  );
});
