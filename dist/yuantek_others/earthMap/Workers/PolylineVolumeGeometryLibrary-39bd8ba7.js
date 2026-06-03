define([
  'exports',
  './Math-fbd31710',
  './freezeObject-4d675126',
  './Cartesian2-06dac25b',
  './Transforms-62d2509c',
  './EllipsoidTangentPlane-3eacb5a3',
  './PolylinePipeline-93ffdac4',
], function(a, I, e, L, p, f, Q) {
  'use strict';
  var F = e.freezeObject({ ROUNDED: 0, MITERED: 1, BEVELED: 2 }),
    U = [new L.Cartesian3(), new L.Cartesian3()],
    _ = new L.Cartesian3(),
    q = new L.Cartesian3(),
    Y = new L.Cartesian3(),
    Z = new L.Cartesian3(),
    k = new L.Cartesian3(),
    H = new L.Cartesian3(),
    J = new L.Cartesian3(),
    K = new L.Cartesian3(),
    W = new L.Cartesian3(),
    X = new L.Cartesian3(),
    g = new L.Cartesian3(),
    $ = {},
    aa = new L.Cartographic();
  function ea(a, e, r, n) {
    var t,
      i = a[0],
      s = a[1],
      o = L.Cartesian3.angleBetween(i, s),
      l = Math.ceil(o / n),
      C = new Array(l);
    if (e === r) {
      for (t = 0; t < l; t++) C[t] = e;
      return C.push(r), C;
    }
    var c = (r - e) / l;
    for (t = 1; t < l; t++) {
      var u = e + t * c;
      C[t] = u;
    }
    return (C[0] = e), C.push(r), C;
  }
  var m = new L.Cartesian3(),
    w = new L.Cartesian3();
  var h = new L.Cartesian3(-1, 0, 0),
    v = new p.Matrix4(),
    x = new p.Matrix4(),
    M = new p.Matrix3(),
    P = p.Matrix3.IDENTITY.clone(),
    E = new L.Cartesian3(),
    B = new p.Cartesian4(),
    T = new L.Cartesian3();
  function ra(a, e, r, n, t, i, s, o) {
    var l = E,
      C = B;
    (v = p.Transforms.eastNorthUpToFixedFrame(a, t, v)),
      (l = p.Matrix4.multiplyByPointAsVector(v, h, l));
    var c = (function(a, e, r, n) {
      var t = new f.EllipsoidTangentPlane(r, n),
        i = t.projectPointOntoPlane(L.Cartesian3.add(r, a, m), m),
        s = t.projectPointOntoPlane(L.Cartesian3.add(r, e, w), w),
        o = L.Cartesian2.angleBetween(i, s);
      return 0 <= s.x * i.y - s.y * i.x ? -o : o;
    })((l = L.Cartesian3.normalize(l, l)), e, a, t);
    (M = p.Matrix3.fromRotationZ(c, M)),
      (T.z = i),
      (v = p.Matrix4.multiplyTransformation(v, p.Matrix4.fromRotationTranslation(M, T, x), v));
    var u = P;
    u[0] = s;
    for (var y = 0; y < o; y++)
      for (var d = 0; d < r.length; d += 3)
        (C = L.Cartesian3.fromArray(r, d, C)),
          (C = p.Matrix3.multiplyByVector(u, C, C)),
          (C = p.Matrix4.multiplyByPoint(v, C, C)),
          n.push(C.x, C.y, C.z);
    return n;
  }
  var l = new L.Cartesian3();
  function na(a, e, r, n, t, i, s) {
    for (var o = 0; o < a.length; o += 3) {
      n = ra(L.Cartesian3.fromArray(a, o, l), e, r, n, t, i[o / 3], s, 1);
    }
    return n;
  }
  function ta(a, e) {
    for (
      var r = a.length,
        n = new Array(3 * r),
        t = 0,
        i = e.x + e.width / 2,
        s = e.y + e.height / 2,
        o = 0;
      o < r;
      o++
    )
      (n[t++] = a[o].x - i), (n[t++] = 0), (n[t++] = a[o].y - s);
    return n;
  }
  var z = new p.Quaternion(),
    b = new L.Cartesian3(),
    S = new p.Matrix3();
  function ia(a, e, r, n, t, i, s, o, l, C) {
    var c,
      u,
      y = L.Cartesian3.angleBetween(L.Cartesian3.subtract(e, a, X), L.Cartesian3.subtract(r, a, g)),
      d = n === F.BEVELED ? 0 : Math.ceil(y / I.BMMath.toRadians(5));
    if (
      ((c = t
        ? p.Matrix3.fromQuaternion(
            p.Quaternion.fromAxisAngle(L.Cartesian3.negate(a, X), y / (d + 1), z),
            S
          )
        : p.Matrix3.fromQuaternion(p.Quaternion.fromAxisAngle(a, y / (d + 1), z), S)),
      (e = L.Cartesian3.clone(e, b)),
      0 < d)
    )
      for (var f = C ? 2 : 1, m = 0; m < d; m++)
        (e = p.Matrix3.multiplyByVector(c, e, e)),
          (u = L.Cartesian3.subtract(e, a, X)),
          (u = L.Cartesian3.normalize(u, u)),
          t || (u = L.Cartesian3.negate(u, u)),
          (s = ra(i.scaleToGeodeticSurface(e, g), u, o, s, i, l, 1, f));
    else
      (u = L.Cartesian3.subtract(e, a, X)),
        (u = L.Cartesian3.normalize(u, u)),
        t || (u = L.Cartesian3.negate(u, u)),
        (s = ra(i.scaleToGeodeticSurface(e, g), u, o, s, i, l, 1, 1)),
        (r = L.Cartesian3.clone(r, b)),
        (u = L.Cartesian3.subtract(r, a, X)),
        (u = L.Cartesian3.normalize(u, u)),
        t || (u = L.Cartesian3.negate(u, u)),
        (s = ra(i.scaleToGeodeticSurface(r, g), u, o, s, i, l, 1, 1));
    return s;
  }
  ($.removeDuplicatesFromShape = function(a) {
    for (var e = a.length, r = [], n = e - 1, t = 0; t < e; n = t++) {
      var i = a[n],
        s = a[t];
      L.Cartesian2.equals(i, s) || r.push(s);
    }
    return r;
  }),
    ($.angleIsGreaterThanPi = function(a, e, r, n) {
      var t = new f.EllipsoidTangentPlane(r, n),
        i = t.projectPointOntoPlane(L.Cartesian3.add(r, a, m), m),
        s = t.projectPointOntoPlane(L.Cartesian3.add(r, e, w), w);
      return 0 <= s.x * i.y - s.y * i.x;
    });
  var sa = new L.Cartesian3(),
    oa = new L.Cartesian3();
  ($.computePositions = function(a, e, r, n, t) {
    var i = n._ellipsoid,
      s = (function(a, e) {
        for (var r = new Array(a.length), n = 0; n < a.length; n++) {
          var t = a[n];
          (aa = e.cartesianToCartographic(t, aa)),
            (r[n] = aa.height),
            (a[n] = e.scaleToGeodeticSurface(t, t));
        }
        return r;
      })(a, i),
      o = n._granularity,
      l = n._cornerType,
      C = t
        ? (function(a, e) {
            var r = a.length,
              n = new Array(6 * r),
              t = 0,
              i = e.x + e.width / 2,
              s = e.y + e.height / 2,
              o = a[0];
            (n[t++] = o.x - i), (n[t++] = 0), (n[t++] = o.y - s);
            for (var l = 1; l < r; l++) {
              var C = (o = a[l]).x - i,
                c = o.y - s;
              (n[t++] = C), (n[t++] = 0), (n[t++] = c), (n[t++] = C), (n[t++] = 0), (n[t++] = c);
            }
            return (o = a[0]), (n[t++] = o.x - i), (n[t++] = 0), (n[t++] = o.y - s), n;
          })(e, r)
        : ta(e, r),
      c = t ? ta(e, r) : void 0,
      u = r.height / 2,
      y = r.width / 2,
      d = a.length,
      f = [],
      m = t ? [] : void 0,
      p = _,
      g = q,
      w = Y,
      h = Z,
      v = k,
      x = H,
      M = J,
      P = K,
      E = W,
      B = a[0],
      T = a[1];
    (h = i.geodeticSurfaceNormal(B, h)),
      (p = L.Cartesian3.subtract(T, B, p)),
      (p = L.Cartesian3.normalize(p, p)),
      (P = L.Cartesian3.cross(h, p, P)),
      (P = L.Cartesian3.normalize(P, P));
    var z,
      b = s[0],
      S = s[1];
    t && (m = ra(B, P, c, m, i, b + u, 1, 1)),
      (E = L.Cartesian3.clone(B, E)),
      (B = T),
      (g = L.Cartesian3.negate(p, g));
    for (var A = 1; A < d - 1; A++) {
      var D = t ? 2 : 1;
      (T = a[A + 1]),
        (p = L.Cartesian3.subtract(T, B, p)),
        (p = L.Cartesian3.normalize(p, p)),
        (w = L.Cartesian3.add(p, g, w)),
        (w = L.Cartesian3.normalize(w, w)),
        (h = i.geodeticSurfaceNormal(B, h));
      var O = L.Cartesian3.multiplyByScalar(h, L.Cartesian3.dot(p, h), sa);
      L.Cartesian3.subtract(p, O, O), L.Cartesian3.normalize(O, O);
      var N = L.Cartesian3.multiplyByScalar(h, L.Cartesian3.dot(g, h), oa);
      if (
        (L.Cartesian3.subtract(g, N, N),
        L.Cartesian3.normalize(N, N),
        !I.BMMath.equalsEpsilon(Math.abs(L.Cartesian3.dot(O, N)), 1, I.BMMath.EPSILON7))
      ) {
        (w = L.Cartesian3.cross(w, h, w)),
          (w = L.Cartesian3.cross(h, w, w)),
          (w = L.Cartesian3.normalize(w, w));
        var V = 1 / Math.max(0.25, L.Cartesian3.magnitude(L.Cartesian3.cross(w, g, X))),
          G = $.angleIsGreaterThanPi(p, g, B, i);
        (E = (G
          ? ((v = L.Cartesian3.add(B, L.Cartesian3.multiplyByScalar(w, V * y, w), v)),
            (x = L.Cartesian3.add(v, L.Cartesian3.multiplyByScalar(P, y, x), x)),
            (U[0] = L.Cartesian3.clone(E, U[0])),
            (U[1] = L.Cartesian3.clone(x, U[1])),
            (z = ea(U, b + u, S + u, o)),
            (f = na(
              Q.PolylinePipeline.generateArc({ positions: U, granularity: o, ellipsoid: i }),
              P,
              C,
              f,
              i,
              z,
              1
            )),
            (P = L.Cartesian3.cross(h, p, P)),
            (P = L.Cartesian3.normalize(P, P)),
            (M = L.Cartesian3.add(v, L.Cartesian3.multiplyByScalar(P, y, M), M)),
            l === F.ROUNDED || l === F.BEVELED
              ? ia(v, x, M, l, G, i, f, C, S + u, t)
              : (f = ra(B, (w = L.Cartesian3.negate(w, w)), C, f, i, S + u, V, D)))
          : ((v = L.Cartesian3.add(B, L.Cartesian3.multiplyByScalar(w, V * y, w), v)),
            (x = L.Cartesian3.add(v, L.Cartesian3.multiplyByScalar(P, -y, x), x)),
            (U[0] = L.Cartesian3.clone(E, U[0])),
            (U[1] = L.Cartesian3.clone(x, U[1])),
            (z = ea(U, b + u, S + u, o)),
            (f = na(
              Q.PolylinePipeline.generateArc({ positions: U, granularity: o, ellipsoid: i }),
              P,
              C,
              f,
              i,
              z,
              1
            )),
            (P = L.Cartesian3.cross(h, p, P)),
            (P = L.Cartesian3.normalize(P, P)),
            (M = L.Cartesian3.add(v, L.Cartesian3.multiplyByScalar(P, -y, M), M)),
            l === F.ROUNDED || l === F.BEVELED
              ? ia(v, x, M, l, G, i, f, C, S + u, t)
              : (f = ra(B, w, C, f, i, S + u, V, D))),
        L.Cartesian3.clone(M, E))),
          (g = L.Cartesian3.negate(p, g));
      } else (f = ra(E, P, C, f, i, b + u, 1, 1)), (E = B);
      (b = S), (S = s[A + 1]), (B = T);
    }
    (U[0] = L.Cartesian3.clone(E, U[0])),
      (U[1] = L.Cartesian3.clone(B, U[1])),
      (z = ea(U, b + u, S + u, o)),
      (f = na(
        Q.PolylinePipeline.generateArc({ positions: U, granularity: o, ellipsoid: i }),
        P,
        C,
        f,
        i,
        z,
        1
      )),
      t && (m = ra(B, P, c, m, i, S + u, 1, 1)),
      (d = f.length);
    var R = t ? d + m.length : d,
      j = new Float64Array(R);
    return j.set(f), t && j.set(m, d), j;
  }),
    (a.CornerType = F),
    (a.PolylineVolumeGeometryLibrary = $);
});
