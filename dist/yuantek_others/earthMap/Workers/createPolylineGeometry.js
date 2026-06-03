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
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './VertexFormat-f7b9c25e',
  './arrayRemoveDuplicates-7ced389a',
  './ArcType-e3f6a1cc',
  './EllipsoidRhumbLine-62acd3ce',
  './EllipsoidGeodesic-edb379ae',
  './PolylinePipeline-93ffdac4',
  './Color-15acb289',
], function(j, J, e, y, K, t, Q, r, a, X, Z, o, $, ee, n, i, m, te, re, l, s, ae, oe) {
  'use strict';
  var ne = [];
  function ie(e, t, r, a, o) {
    var n,
      i = ne;
    i.length = o;
    var l = r.red,
      s = r.green,
      p = r.blue,
      d = r.alpha,
      c = a.red,
      u = a.green,
      y = a.blue,
      m = a.alpha;
    if (oe.Color.equals(r, a)) {
      for (n = 0; n < o; n++) i[n] = oe.Color.clone(r);
      return i;
    }
    var f = (c - l) / o,
      h = (u - s) / o,
      v = (y - p) / o,
      C = (m - d) / o;
    for (n = 0; n < o; n++) i[n] = new oe.Color(l + n * f, s + n * h, p + n * v, d + n * C);
    return i;
  }
  function f(e) {
    var t = (e = y.defaultValue(e, y.defaultValue.EMPTY_OBJECT)).positions,
      r = e.colors,
      a = y.defaultValue(e.width, 1),
      o = y.defaultValue(e.colorsPerVertex, !1);
    (this._positions = t),
      (this._colors = r),
      (this._width = a),
      (this._colorsPerVertex = o),
      (this._vertexFormat = m.VertexFormat.clone(
        y.defaultValue(e.vertexFormat, m.VertexFormat.DEFAULT)
      )),
      (this._arcType = y.defaultValue(e.arcType, re.ArcType.GEODESIC)),
      (this._granularity = y.defaultValue(e.granularity, J.BMMath.RADIANS_PER_DEGREE)),
      (this._ellipsoid = K.Ellipsoid.clone(y.defaultValue(e.ellipsoid, K.Ellipsoid.WGS84))),
      (this._workerName = 'createPolylineGeometry');
    var n = 1 + t.length * K.Cartesian3.packedLength;
    (n += j.defined(r) ? 1 + r.length * oe.Color.packedLength : 1),
      (this.packedLength = n + K.Ellipsoid.packedLength + m.VertexFormat.packedLength + 4);
  }
  f.pack = function(e, t, r) {
    var a;
    r = y.defaultValue(r, 0);
    var o = e._positions,
      n = o.length;
    for (t[r++] = n, a = 0; a < n; ++a, r += K.Cartesian3.packedLength)
      K.Cartesian3.pack(o[a], t, r);
    var i = e._colors;
    for (n = j.defined(i) ? i.length : 0, t[r++] = n, a = 0; a < n; ++a, r += oe.Color.packedLength)
      oe.Color.pack(i[a], t, r);
    return (
      K.Ellipsoid.pack(e._ellipsoid, t, r),
      (r += K.Ellipsoid.packedLength),
      m.VertexFormat.pack(e._vertexFormat, t, r),
      (r += m.VertexFormat.packedLength),
      (t[r++] = e._width),
      (t[r++] = e._colorsPerVertex ? 1 : 0),
      (t[r++] = e._arcType),
      (t[r] = e._granularity),
      t
    );
  };
  var h = K.Ellipsoid.clone(K.Ellipsoid.UNIT_SPHERE),
    v = new m.VertexFormat(),
    C = {
      positions: void 0,
      colors: void 0,
      ellipsoid: h,
      vertexFormat: v,
      width: void 0,
      colorsPerVertex: void 0,
      arcType: void 0,
      granularity: void 0,
    };
  f.unpack = function(e, t, r) {
    var a;
    t = y.defaultValue(t, 0);
    var o = e[t++],
      n = new Array(o);
    for (a = 0; a < o; ++a, t += K.Cartesian3.packedLength) n[a] = K.Cartesian3.unpack(e, t);
    var i = 0 < (o = e[t++]) ? new Array(o) : void 0;
    for (a = 0; a < o; ++a, t += oe.Color.packedLength) i[a] = oe.Color.unpack(e, t);
    var l = K.Ellipsoid.unpack(e, t, h);
    t += K.Ellipsoid.packedLength;
    var s = m.VertexFormat.unpack(e, t, v);
    t += m.VertexFormat.packedLength;
    var p = e[t++],
      d = 1 === e[t++],
      c = e[t++],
      u = e[t];
    return j.defined(r)
      ? ((r._positions = n),
        (r._colors = i),
        (r._ellipsoid = K.Ellipsoid.clone(l, r._ellipsoid)),
        (r._vertexFormat = m.VertexFormat.clone(s, r._vertexFormat)),
        (r._width = p),
        (r._colorsPerVertex = d),
        (r._arcType = c),
        (r._granularity = u),
        r)
      : ((C.positions = n),
        (C.colors = i),
        (C.width = p),
        (C.colorsPerVertex = d),
        (C.arcType = c),
        (C.granularity = u),
        new f(C));
  };
  var le = new K.Cartesian3(),
    se = new K.Cartesian3(),
    pe = new K.Cartesian3(),
    de = new K.Cartesian3();
  return (
    (f.createGeometry = function(e) {
      var t,
        r,
        a,
        o = e._width,
        n = e._vertexFormat,
        i = e._colors,
        l = e._colorsPerVertex,
        s = e._arcType,
        p = e._granularity,
        d = e._ellipsoid,
        c = te.arrayRemoveDuplicates(e._positions, K.Cartesian3.equalsEpsilon),
        u = c.length;
      if (!(u < 2 || o <= 0)) {
        if (s === re.ArcType.GEODESIC || s === re.ArcType.RHUMB) {
          var y, m;
          m =
            s === re.ArcType.GEODESIC
              ? ((y = J.BMMath.chordLength(p, d.maximumRadius)), ae.PolylinePipeline.numberOfPoints)
              : ((y = p), ae.PolylinePipeline.numberOfPointsRhumbLine);
          var f = ae.PolylinePipeline.extractHeights(c, d);
          if (j.defined(i)) {
            var h = 1;
            for (t = 0; t < u - 1; ++t) h += m(c[t], c[t + 1], y);
            var v = new Array(h),
              C = 0;
            for (t = 0; t < u - 1; ++t) {
              var g = c[t],
                _ = c[t + 1],
                A = i[t],
                E = m(g, _, y);
              if (l && t < h) {
                var b = ie(0, 0, A, i[t + 1], E),
                  P = b.length;
                for (r = 0; r < P; ++r) v[C++] = b[r];
              } else for (r = 0; r < E; ++r) v[C++] = oe.Color.clone(A);
            }
            (v[C] = oe.Color.clone(i[i.length - 1])), (i = v), (ne.length = 0);
          }
          c =
            s === re.ArcType.GEODESIC
              ? ae.PolylinePipeline.generateCartesianArc({
                  positions: c,
                  minDistance: y,
                  ellipsoid: d,
                  height: f,
                })
              : ae.PolylinePipeline.generateCartesianRhumbArc({
                  positions: c,
                  granularity: y,
                  ellipsoid: d,
                  height: f,
                });
        }
        var w,
          T = 4 * (u = c.length) - 4,
          x = new Float64Array(3 * T),
          D = new Float64Array(3 * T),
          k = new Float64Array(3 * T),
          V = new Float32Array(2 * T),
          L = n.st ? new Float32Array(2 * T) : void 0,
          F = j.defined(i) ? new Uint8Array(4 * T) : void 0,
          G = 0,
          O = 0,
          B = 0,
          R = 0;
        for (r = 0; r < u; ++r) {
          var I, S;
          0 === r
            ? ((w = le), K.Cartesian3.subtract(c[0], c[1], w), K.Cartesian3.add(c[0], w, w))
            : (w = c[r - 1]),
            K.Cartesian3.clone(w, pe),
            K.Cartesian3.clone(c[r], se),
            r === u - 1
              ? ((w = le),
                K.Cartesian3.subtract(c[u - 1], c[u - 2], w),
                K.Cartesian3.add(c[u - 1], w, w))
              : (w = c[r + 1]),
            K.Cartesian3.clone(w, de),
            j.defined(F) && ((I = 0 === r || l ? i[r] : i[r - 1]), r !== u - 1 && (S = i[r]));
          var M = r === u - 1 ? 2 : 4;
          for (a = 0 === r ? 2 : 0; a < M; ++a) {
            K.Cartesian3.pack(se, x, G),
              K.Cartesian3.pack(pe, D, G),
              K.Cartesian3.pack(de, k, G),
              (G += 3);
            var U = a - 2 < 0 ? -1 : 1;
            if (
              ((V[O++] = (a % 2) * 2 - 1),
              (V[O++] = U * o),
              n.st && ((L[B++] = r / (u - 1)), (L[B++] = Math.max(V[O - 2], 0))),
              j.defined(F))
            ) {
              var N = a < 2 ? I : S;
              (F[R++] = oe.Color.floatToByte(N.red)),
                (F[R++] = oe.Color.floatToByte(N.green)),
                (F[R++] = oe.Color.floatToByte(N.blue)),
                (F[R++] = oe.Color.floatToByte(N.alpha));
            }
          }
        }
        var H = new $.GeometryAttributes();
        (H.position = new Z.GeometryAttribute({
          componentDatatype: X.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: x,
        })),
          (H.prevPosition = new Z.GeometryAttribute({
            componentDatatype: X.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: D,
          })),
          (H.nextPosition = new Z.GeometryAttribute({
            componentDatatype: X.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: k,
          })),
          (H.expandAndWidth = new Z.GeometryAttribute({
            componentDatatype: X.ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            values: V,
          })),
          n.st &&
            (H.st = new Z.GeometryAttribute({
              componentDatatype: X.ComponentDatatype.FLOAT,
              componentsPerAttribute: 2,
              values: L,
            })),
          j.defined(F) &&
            (H.color = new Z.GeometryAttribute({
              componentDatatype: X.ComponentDatatype.UNSIGNED_BYTE,
              componentsPerAttribute: 4,
              values: F,
              normalize: !0,
            }));
        var W = ee.IndexDatatype.createTypedArray(T, 6 * u - 6),
          Y = 0,
          q = 0,
          z = u - 1;
        for (r = 0; r < z; ++r)
          (W[q++] = Y),
            (W[q++] = Y + 2),
            (W[q++] = Y + 1),
            (W[q++] = Y + 1),
            (W[q++] = Y + 2),
            (W[q++] = Y + 3),
            (Y += 4);
        return new Z.Geometry({
          attributes: H,
          indices: W,
          primitiveType: Z.PrimitiveType.TRIANGLES,
          boundingSphere: Q.BoundingSphere.fromPoints(c),
          geometryType: Z.GeometryType.POLYLINES,
        });
      }
    }),
    function(e, t) {
      return (
        j.defined(t) && (e = f.unpack(e, t)),
        (e._ellipsoid = K.Ellipsoid.clone(e._ellipsoid)),
        f.createGeometry(e)
      );
    }
  );
});
