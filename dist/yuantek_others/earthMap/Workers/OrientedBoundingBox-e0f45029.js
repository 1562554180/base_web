define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './Transforms-62d2509c',
  './Plane-19a62994',
  './EllipsoidTangentPlane-3eacb5a3',
], function(a, A, q, X, j, T, Z, G) {
  'use strict';
  function R(a, t) {
    (this.center = j.Cartesian3.clone(X.defaultValue(a, j.Cartesian3.ZERO))),
      (this.halfAxes = T.Matrix3.clone(X.defaultValue(t, T.Matrix3.ZERO)));
  }
  (R.packedLength = j.Cartesian3.packedLength + T.Matrix3.packedLength),
    (R.pack = function(a, t, e) {
      return (
        (e = X.defaultValue(e, 0)),
        j.Cartesian3.pack(a.center, t, e),
        T.Matrix3.pack(a.halfAxes, t, e + j.Cartesian3.packedLength),
        t
      );
    }),
    (R.unpack = function(a, t, e) {
      return (
        (t = X.defaultValue(t, 0)),
        A.defined(e) || (e = new R()),
        j.Cartesian3.unpack(a, t, e.center),
        T.Matrix3.unpack(a, t + j.Cartesian3.packedLength, e.halfAxes),
        e
      );
    });
  var I = new j.Cartesian3(),
    E = new j.Cartesian3(),
    L = new j.Cartesian3(),
    z = new j.Cartesian3(),
    S = new j.Cartesian3(),
    B = new j.Cartesian3(),
    U = new T.Matrix3(),
    V = { unitary: new T.Matrix3(), diagonal: new T.Matrix3() };
  R.fromPoints = function(a, t) {
    if ((A.defined(t) || (t = new R()), !A.defined(a) || 0 === a.length))
      return (t.halfAxes = T.Matrix3.ZERO), (t.center = j.Cartesian3.ZERO), t;
    var e,
      n = a.length,
      r = j.Cartesian3.clone(a[0], I);
    for (e = 1; e < n; e++) j.Cartesian3.add(r, a[e], r);
    var i = 1 / n;
    j.Cartesian3.multiplyByScalar(r, i, r);
    var s,
      o = 0,
      C = 0,
      c = 0,
      u = 0,
      d = 0,
      l = 0;
    for (e = 0; e < n; e++)
      (o += (s = j.Cartesian3.subtract(a[e], r, E)).x * s.x),
        (C += s.x * s.y),
        (c += s.x * s.z),
        (u += s.y * s.y),
        (d += s.y * s.z),
        (l += s.z * s.z);
    (o *= i), (C *= i), (c *= i), (u *= i), (d *= i), (l *= i);
    var h = U;
    (h[0] = o),
      (h[1] = C),
      (h[2] = c),
      (h[3] = C),
      (h[4] = u),
      (h[5] = d),
      (h[6] = c),
      (h[7] = d),
      (h[8] = l);
    var M = T.Matrix3.computeEigenDecomposition(h, V),
      x = T.Matrix3.clone(M.unitary, t.halfAxes),
      m = T.Matrix3.getColumn(x, 0, z),
      f = T.Matrix3.getColumn(x, 1, S),
      p = T.Matrix3.getColumn(x, 2, B),
      g = -Number.MAX_VALUE,
      w = -Number.MAX_VALUE,
      y = -Number.MAX_VALUE,
      b = Number.MAX_VALUE,
      O = Number.MAX_VALUE,
      P = Number.MAX_VALUE;
    for (e = 0; e < n; e++)
      (s = a[e]),
        (g = Math.max(j.Cartesian3.dot(m, s), g)),
        (w = Math.max(j.Cartesian3.dot(f, s), w)),
        (y = Math.max(j.Cartesian3.dot(p, s), y)),
        (b = Math.min(j.Cartesian3.dot(m, s), b)),
        (O = Math.min(j.Cartesian3.dot(f, s), O)),
        (P = Math.min(j.Cartesian3.dot(p, s), P));
    (m = j.Cartesian3.multiplyByScalar(m, 0.5 * (b + g), m)),
      (f = j.Cartesian3.multiplyByScalar(f, 0.5 * (O + w), f)),
      (p = j.Cartesian3.multiplyByScalar(p, 0.5 * (P + y), p));
    var N = j.Cartesian3.add(m, f, t.center);
    j.Cartesian3.add(N, p, N);
    var v = L;
    return (
      (v.x = g - b),
      (v.y = w - O),
      (v.z = y - P),
      j.Cartesian3.multiplyByScalar(v, 0.5, v),
      T.Matrix3.multiplyByScale(t.halfAxes, v, t.halfAxes),
      t
    );
  };
  var x = new j.Cartesian3(),
    m = new j.Cartesian3();
  function F(a, t, e, n, r, i, s, o, C, c, u) {
    A.defined(u) || (u = new R());
    var d = u.halfAxes;
    T.Matrix3.setColumn(d, 0, t, d),
      T.Matrix3.setColumn(d, 1, e, d),
      T.Matrix3.setColumn(d, 2, n, d);
    var l = x;
    (l.x = (r + i) / 2), (l.y = (s + o) / 2), (l.z = (C + c) / 2);
    var h = m;
    (h.x = (i - r) / 2), (h.y = (o - s) / 2), (h.z = (c - C) / 2);
    var M = u.center;
    return (
      (l = T.Matrix3.multiplyByVector(d, l, l)),
      j.Cartesian3.add(a, l, M),
      T.Matrix3.multiplyByScale(d, h, d),
      u
    );
  }
  var Y = new j.Cartographic(),
    H = new j.Cartesian3(),
    J = new j.Cartographic(),
    K = new j.Cartographic(),
    Q = new j.Cartographic(),
    $ = new j.Cartographic(),
    aa = new j.Cartographic(),
    ta = new j.Cartesian3(),
    ea = new j.Cartesian3(),
    na = new j.Cartesian3(),
    ra = new j.Cartesian3(),
    ia = new j.Cartesian3(),
    sa = new j.Cartesian2(),
    oa = new j.Cartesian2(),
    Ca = new j.Cartesian2(),
    ca = new j.Cartesian2(),
    ua = new j.Cartesian2(),
    da = new j.Cartesian3(),
    la = new j.Cartesian3(),
    ha = new j.Cartesian3(),
    Ma = new j.Cartesian3(),
    xa = new j.Cartesian2(),
    ma = new j.Cartesian3(),
    fa = new j.Cartesian3(),
    pa = new j.Cartesian3(),
    ga = new Z.Plane(j.Cartesian3.UNIT_X, 0);
  (R.fromRectangle = function(a, t, e, n, r) {
    var i, s, o, C, c, u, d;
    if (
      ((t = X.defaultValue(t, 0)),
      (e = X.defaultValue(e, 0)),
      (n = X.defaultValue(n, j.Ellipsoid.WGS84)),
      a.width <= q.BMMath.PI)
    ) {
      var l = j.Rectangle.center(a, Y),
        h = n.cartographicToCartesian(l, H),
        M = new G.EllipsoidTangentPlane(h, n);
      d = M.plane;
      var x = l.longitude,
        m = a.south < 0 && 0 < a.north ? 0 : l.latitude,
        f = j.Cartographic.fromRadians(x, a.north, e, J),
        p = j.Cartographic.fromRadians(a.west, a.north, e, K),
        g = j.Cartographic.fromRadians(a.west, m, e, Q),
        w = j.Cartographic.fromRadians(a.west, a.south, e, $),
        y = j.Cartographic.fromRadians(x, a.south, e, aa),
        b = n.cartographicToCartesian(f, ta),
        O = n.cartographicToCartesian(p, ea),
        P = n.cartographicToCartesian(g, na),
        N = n.cartographicToCartesian(w, ra),
        v = n.cartographicToCartesian(y, ia),
        A = M.projectPointToNearestOnPlane(b, sa),
        T = M.projectPointToNearestOnPlane(O, oa),
        R = M.projectPointToNearestOnPlane(P, Ca),
        I = M.projectPointToNearestOnPlane(N, ca),
        E = M.projectPointToNearestOnPlane(v, ua);
      return (
        (s = -(i = Math.min(T.x, R.x, I.x))),
        (C = Math.max(T.y, A.y)),
        (o = Math.min(I.y, E.y)),
        (p.height = w.height = t),
        (O = n.cartographicToCartesian(p, ea)),
        (N = n.cartographicToCartesian(w, ra)),
        (c = Math.min(Z.Plane.getPointDistance(d, O), Z.Plane.getPointDistance(d, N))),
        (u = e),
        F(M.origin, M.xAxis, M.yAxis, M.zAxis, i, s, o, C, c, u, r)
      );
    }
    var L = 0 < a.south,
      z = a.north < 0,
      S = L ? a.south : z ? a.north : 0,
      B = j.Rectangle.center(a, Y).longitude,
      U = j.Cartesian3.fromRadians(B, S, e, n, da);
    U.z = 0;
    var V =
        Math.abs(U.x) < q.BMMath.EPSILON10 && Math.abs(U.y) < q.BMMath.EPSILON10
          ? j.Cartesian3.UNIT_X
          : j.Cartesian3.normalize(U, la),
      _ = j.Cartesian3.UNIT_Z,
      k = j.Cartesian3.cross(V, _, ha);
    d = Z.Plane.fromPointNormal(U, V, ga);
    var W = j.Cartesian3.fromRadians(B + q.BMMath.PI_OVER_TWO, S, e, n, Ma);
    (i = -(s = j.Cartesian3.dot(Z.Plane.projectPointOntoPlane(d, W, xa), k))),
      (C = j.Cartesian3.fromRadians(0, a.north, z ? t : e, n, ma).z),
      (o = j.Cartesian3.fromRadians(0, a.south, L ? t : e, n, fa).z);
    var D = j.Cartesian3.fromRadians(a.east, S, e, n, pa);
    return F(U, k, _, V, i, s, o, C, (c = Z.Plane.getPointDistance(d, D)), (u = 0), r);
  }),
    (R.clone = function(a, t) {
      if (A.defined(a))
        return A.defined(t)
          ? (j.Cartesian3.clone(a.center, t.center), T.Matrix3.clone(a.halfAxes, t.halfAxes), t)
          : new R(a.center, a.halfAxes);
    }),
    (R.intersectPlane = function(a, t) {
      var e = a.center,
        n = t.normal,
        r = a.halfAxes,
        i = n.x,
        s = n.y,
        o = n.z,
        C =
          Math.abs(
            i * r[T.Matrix3.COLUMN0ROW0] +
              s * r[T.Matrix3.COLUMN0ROW1] +
              o * r[T.Matrix3.COLUMN0ROW2]
          ) +
          Math.abs(
            i * r[T.Matrix3.COLUMN1ROW0] +
              s * r[T.Matrix3.COLUMN1ROW1] +
              o * r[T.Matrix3.COLUMN1ROW2]
          ) +
          Math.abs(
            i * r[T.Matrix3.COLUMN2ROW0] +
              s * r[T.Matrix3.COLUMN2ROW1] +
              o * r[T.Matrix3.COLUMN2ROW2]
          ),
        c = j.Cartesian3.dot(n, e) + t.distance;
      return c <= -C ? T.Intersect.OUTSIDE : C <= c ? T.Intersect.INSIDE : T.Intersect.INTERSECTING;
    });
  var M = new j.Cartesian3(),
    f = new j.Cartesian3(),
    p = new j.Cartesian3(),
    h = new j.Cartesian3();
  R.distanceSquaredTo = function(a, t) {
    var e = j.Cartesian3.subtract(t, a.center, x),
      n = a.halfAxes,
      r = T.Matrix3.getColumn(n, 0, M),
      i = T.Matrix3.getColumn(n, 1, f),
      s = T.Matrix3.getColumn(n, 2, p),
      o = j.Cartesian3.magnitude(r),
      C = j.Cartesian3.magnitude(i),
      c = j.Cartesian3.magnitude(s);
    j.Cartesian3.normalize(r, r), j.Cartesian3.normalize(i, i), j.Cartesian3.normalize(s, s);
    var u = h;
    (u.x = j.Cartesian3.dot(e, r)), (u.y = j.Cartesian3.dot(e, i)), (u.z = j.Cartesian3.dot(e, s));
    var d,
      l = 0;
    return (
      u.x < -o ? (l += (d = u.x + o) * d) : u.x > o && (l += (d = u.x - o) * d),
      u.y < -C ? (l += (d = u.y + C) * d) : u.y > C && (l += (d = u.y - C) * d),
      u.z < -c ? (l += (d = u.z + c) * d) : u.z > c && (l += (d = u.z - c) * d),
      l
    );
  };
  var g = new j.Cartesian3(),
    w = new j.Cartesian3();
  R.computePlaneDistances = function(a, t, e, n) {
    A.defined(n) || (n = new T.Interval());
    var r = Number.POSITIVE_INFINITY,
      i = Number.NEGATIVE_INFINITY,
      s = a.center,
      o = a.halfAxes,
      C = T.Matrix3.getColumn(o, 0, M),
      c = T.Matrix3.getColumn(o, 1, f),
      u = T.Matrix3.getColumn(o, 2, p),
      d = j.Cartesian3.add(C, c, g);
    j.Cartesian3.add(d, u, d), j.Cartesian3.add(d, s, d);
    var l = j.Cartesian3.subtract(d, t, w),
      h = j.Cartesian3.dot(e, l);
    return (
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      j.Cartesian3.add(s, C, d),
      j.Cartesian3.add(d, c, d),
      j.Cartesian3.subtract(d, u, d),
      j.Cartesian3.subtract(d, t, l),
      (h = j.Cartesian3.dot(e, l)),
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      j.Cartesian3.add(s, C, d),
      j.Cartesian3.subtract(d, c, d),
      j.Cartesian3.add(d, u, d),
      j.Cartesian3.subtract(d, t, l),
      (h = j.Cartesian3.dot(e, l)),
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      j.Cartesian3.add(s, C, d),
      j.Cartesian3.subtract(d, c, d),
      j.Cartesian3.subtract(d, u, d),
      j.Cartesian3.subtract(d, t, l),
      (h = j.Cartesian3.dot(e, l)),
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      j.Cartesian3.subtract(s, C, d),
      j.Cartesian3.add(d, c, d),
      j.Cartesian3.add(d, u, d),
      j.Cartesian3.subtract(d, t, l),
      (h = j.Cartesian3.dot(e, l)),
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      j.Cartesian3.subtract(s, C, d),
      j.Cartesian3.add(d, c, d),
      j.Cartesian3.subtract(d, u, d),
      j.Cartesian3.subtract(d, t, l),
      (h = j.Cartesian3.dot(e, l)),
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      j.Cartesian3.subtract(s, C, d),
      j.Cartesian3.subtract(d, c, d),
      j.Cartesian3.add(d, u, d),
      j.Cartesian3.subtract(d, t, l),
      (h = j.Cartesian3.dot(e, l)),
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      j.Cartesian3.subtract(s, C, d),
      j.Cartesian3.subtract(d, c, d),
      j.Cartesian3.subtract(d, u, d),
      j.Cartesian3.subtract(d, t, l),
      (h = j.Cartesian3.dot(e, l)),
      (r = Math.min(h, r)),
      (i = Math.max(h, i)),
      (n.start = r),
      (n.stop = i),
      n
    );
  };
  var n = new T.BoundingSphere();
  (R.isOccluded = function(a, t) {
    var e = T.BoundingSphere.fromOrientedBoundingBox(a, n);
    return !t.isBoundingSphereVisible(e);
  }),
    (R.prototype.intersectPlane = function(a) {
      return R.intersectPlane(this, a);
    }),
    (R.prototype.distanceSquaredTo = function(a) {
      return R.distanceSquaredTo(this, a);
    }),
    (R.prototype.computePlaneDistances = function(a, t, e) {
      return R.computePlaneDistances(this, a, t, e);
    }),
    (R.prototype.isOccluded = function(a) {
      return R.isOccluded(this, a);
    }),
    (R.equals = function(a, t) {
      return (
        a === t ||
        (A.defined(a) &&
          A.defined(t) &&
          j.Cartesian3.equals(a.center, t.center) &&
          T.Matrix3.equals(a.halfAxes, t.halfAxes))
      );
    }),
    (R.prototype.clone = function(a) {
      return R.clone(this, a);
    }),
    (R.prototype.equals = function(a) {
      return R.equals(this, a);
    }),
    (a.OrientedBoundingBox = R);
});
