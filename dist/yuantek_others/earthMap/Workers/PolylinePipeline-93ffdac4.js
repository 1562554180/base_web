define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './Transforms-62d2509c',
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './EllipsoidRhumbLine-62acd3ce',
  './EllipsoidGeodesic-edb379ae',
], function(a, T, w, P, y, b, v, m, A, e) {
  'use strict';
  var E = {
      numberOfPoints: function(a, e, r) {
        var t = y.Cartesian3.distance(a, e);
        return Math.ceil(t / r);
      },
      numberOfPointsRhumbLine: function(a, e, r) {
        var t = Math.pow(a.longitude - e.longitude, 2) + Math.pow(a.latitude - e.latitude, 2);
        return Math.ceil(Math.sqrt(t / (r * r)));
      },
    },
    o = new y.Cartographic();
  E.extractHeights = function(a, e) {
    for (var r = a.length, t = new Array(r), n = 0; n < r; n++) {
      var i = a[n];
      t[n] = e.cartesianToCartographic(i, o).height;
    }
    return t;
  };
  var M = new b.Matrix4(),
    S = new y.Cartesian3(),
    R = new y.Cartesian3(),
    D = new m.Plane(y.Cartesian3.UNIT_X, 0),
    G = new y.Cartesian3(),
    x = new m.Plane(y.Cartesian3.UNIT_X, 0),
    N = new y.Cartesian3(),
    I = new y.Cartesian3(),
    V = [];
  function B(a, e, r) {
    var t,
      n = V;
    if (((n.length = a), e === r)) {
      for (t = 0; t < a; t++) n[t] = e;
      return n;
    }
    var i = (r - e) / a;
    for (t = 0; t < a; t++) {
      var o = e + t * i;
      n[t] = o;
    }
    return n;
  }
  var k = new y.Cartographic(),
    L = new y.Cartographic(),
    _ = new y.Cartesian3(),
    O = new y.Cartesian3(),
    U = new y.Cartesian3(),
    z = new e.EllipsoidGeodesic(),
    X = new A.EllipsoidRhumbLine();
  function q(a, e, r, t, n, i, o, s) {
    var c = t.scaleToGeodeticSurface(a, O),
      l = t.scaleToGeodeticSurface(e, U),
      u = E.numberOfPoints(a, e, r),
      h = t.cartesianToCartographic(c, k),
      f = t.cartesianToCartographic(l, L),
      d = B(u, n, i);
    z.setEndPoints(h, f);
    var g = z.surfaceDistance / u,
      p = s;
    h.height = n;
    var C = t.cartographicToCartesian(h, _);
    y.Cartesian3.pack(C, o, p), (p += 3);
    for (var v = 1; v < u; v++) {
      var m = z.interpolateUsingSurfaceDistance(v * g, L);
      (m.height = d[v]),
        (C = t.cartographicToCartesian(m, _)),
        y.Cartesian3.pack(C, o, p),
        (p += 3);
    }
    return p;
  }
  function W(a, e, r, t, n, i, o, s) {
    var c = t.scaleToGeodeticSurface(a, O),
      l = t.scaleToGeodeticSurface(e, U),
      u = t.cartesianToCartographic(c, k),
      h = t.cartesianToCartographic(l, L),
      f = E.numberOfPointsRhumbLine(u, h, r),
      d = B(f, n, i);
    X.ellipsoid.equals(t) || (X = new A.EllipsoidRhumbLine(void 0, void 0, t)),
      X.setEndPoints(u, h);
    var g = X.surfaceDistance / f,
      p = s;
    u.height = n;
    var C = t.cartographicToCartesian(u, _);
    y.Cartesian3.pack(C, o, p), (p += 3);
    for (var v = 1; v < f; v++) {
      var m = X.interpolateUsingSurfaceDistance(v * g, L);
      (m.height = d[v]),
        (C = t.cartographicToCartesian(m, _)),
        y.Cartesian3.pack(C, o, p),
        (p += 3);
    }
    return p;
  }
  (E.wrapLongitude = function(a, e) {
    var r = [],
      t = [];
    if (T.defined(a) && 0 < a.length) {
      e = P.defaultValue(e, b.Matrix4.IDENTITY);
      var n = b.Matrix4.inverseTransformation(e, M),
        i = b.Matrix4.multiplyByPoint(n, y.Cartesian3.ZERO, S),
        o = y.Cartesian3.normalize(b.Matrix4.multiplyByPointAsVector(n, y.Cartesian3.UNIT_Y, R), R),
        s = m.Plane.fromPointNormal(i, o, D),
        c = y.Cartesian3.normalize(b.Matrix4.multiplyByPointAsVector(n, y.Cartesian3.UNIT_X, G), G),
        l = m.Plane.fromPointNormal(i, c, x),
        u = 1;
      r.push(y.Cartesian3.clone(a[0]));
      for (var h = r[0], f = a.length, d = 1; d < f; ++d) {
        var g = a[d];
        if (m.Plane.getPointDistance(l, h) < 0 || m.Plane.getPointDistance(l, g) < 0) {
          var p = v.IntersectionTests.lineSegmentPlane(h, g, s, N);
          if (T.defined(p)) {
            var C = y.Cartesian3.multiplyByScalar(o, 5e-9, I);
            m.Plane.getPointDistance(s, h) < 0 && y.Cartesian3.negate(C, C),
              r.push(y.Cartesian3.add(p, C, new y.Cartesian3())),
              t.push(u + 1),
              y.Cartesian3.negate(C, C),
              r.push(y.Cartesian3.add(p, C, new y.Cartesian3())),
              (u = 1);
          }
        }
        r.push(y.Cartesian3.clone(a[d])), u++, (h = g);
      }
      t.push(u);
    }
    return { positions: r, lengths: t };
  }),
    (E.generateArc = function(a) {
      T.defined(a) || (a = {});
      var e = a.positions,
        r = e.length,
        t = P.defaultValue(a.ellipsoid, y.Ellipsoid.WGS84),
        n = P.defaultValue(a.height, 0),
        i = b.isArray(n);
      if (r < 1) return [];
      if (1 === r) {
        var o = t.scaleToGeodeticSurface(e[0], O);
        if (0 !== (n = i ? n[0] : n)) {
          var s = t.geodeticSurfaceNormal(o, _);
          y.Cartesian3.multiplyByScalar(s, n, s), y.Cartesian3.add(o, s, o);
        }
        return [o.x, o.y, o.z];
      }
      var c = a.minDistance;
      if (!T.defined(c)) {
        var l = P.defaultValue(a.granularity, w.BMMath.RADIANS_PER_DEGREE);
        c = w.BMMath.chordLength(l, t.maximumRadius);
      }
      var u,
        h = 0;
      for (u = 0; u < r - 1; u++) h += E.numberOfPoints(e[u], e[u + 1], c);
      var f = 3 * (h + 1),
        d = new Array(f),
        g = 0;
      for (u = 0; u < r - 1; u++) {
        g = q(e[u], e[u + 1], c, t, i ? n[u] : n, i ? n[u + 1] : n, d, g);
      }
      V.length = 0;
      var p = e[r - 1],
        C = t.cartesianToCartographic(p, k);
      C.height = i ? n[r - 1] : n;
      var v = t.cartographicToCartesian(C, _);
      return y.Cartesian3.pack(v, d, f - 3), d;
    });
  var Y = new y.Cartographic(),
    H = new y.Cartographic();
  (E.generateRhumbArc = function(a) {
    T.defined(a) || (a = {});
    var e = a.positions,
      r = e.length,
      t = P.defaultValue(a.ellipsoid, y.Ellipsoid.WGS84),
      n = P.defaultValue(a.height, 0),
      i = b.isArray(n);
    if (r < 1) return [];
    if (1 === r) {
      var o = t.scaleToGeodeticSurface(e[0], O);
      if (0 !== (n = i ? n[0] : n)) {
        var s = t.geodeticSurfaceNormal(o, _);
        y.Cartesian3.multiplyByScalar(s, n, s), y.Cartesian3.add(o, s, o);
      }
      return [o.x, o.y, o.z];
    }
    var c,
      l,
      u = P.defaultValue(a.granularity, w.BMMath.RADIANS_PER_DEGREE),
      h = 0,
      f = t.cartesianToCartographic(e[0], Y);
    for (c = 0; c < r - 1; c++)
      (l = t.cartesianToCartographic(e[c + 1], H)),
        (h += E.numberOfPointsRhumbLine(f, l, u)),
        (f = y.Cartographic.clone(l, Y));
    var d = 3 * (h + 1),
      g = new Array(d),
      p = 0;
    for (c = 0; c < r - 1; c++) {
      p = W(e[c], e[c + 1], u, t, i ? n[c] : n, i ? n[c + 1] : n, g, p);
    }
    V.length = 0;
    var C = e[r - 1],
      v = t.cartesianToCartographic(C, k);
    v.height = i ? n[r - 1] : n;
    var m = t.cartographicToCartesian(v, _);
    return y.Cartesian3.pack(m, g, d - 3), g;
  }),
    (E.generateCartesianArc = function(a) {
      for (var e = E.generateArc(a), r = e.length / 3, t = new Array(r), n = 0; n < r; n++)
        t[n] = y.Cartesian3.unpack(e, 3 * n);
      return t;
    }),
    (E.generateCartesianRhumbArc = function(a) {
      for (var e = E.generateRhumbArc(a), r = e.length / 3, t = new Array(r), n = 0; n < r; n++)
        t[n] = y.Cartesian3.unpack(e, 3 * n);
      return t;
    }),
    (a.PolylinePipeline = E);
});
