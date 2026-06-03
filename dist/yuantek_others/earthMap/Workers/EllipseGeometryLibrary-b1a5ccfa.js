define(['exports', './Math-fbd31710', './Cartesian2-06dac25b', './Transforms-62d2509c'], function(
  a,
  A,
  R,
  u
) {
  'use strict';
  var r = {},
    x = new R.Cartesian3(),
    m = new R.Cartesian3(),
    f = new u.Quaternion(),
    z = new u.Matrix3();
  function W(a, r, t, e, i, n, s, o, l, y) {
    var M = a + r;
    R.Cartesian3.multiplyByScalar(e, Math.cos(M), x),
      R.Cartesian3.multiplyByScalar(t, Math.sin(M), m),
      R.Cartesian3.add(x, m, x);
    var C = Math.cos(a);
    C *= C;
    var c = Math.sin(a);
    c *= c;
    var h = n / Math.sqrt(s * C + i * c) / o;
    return (
      u.Quaternion.fromAxisAngle(x, h, f),
      u.Matrix3.fromQuaternion(f, z),
      u.Matrix3.multiplyByVector(z, l, y),
      R.Cartesian3.normalize(y, y),
      R.Cartesian3.multiplyByScalar(y, o, y),
      y
    );
  }
  var S = new R.Cartesian3(),
    b = new R.Cartesian3(),
    Q = new R.Cartesian3(),
    d = new R.Cartesian3();
  r.raisePositionsToHeight = function(a, r, t) {
    for (
      var e = r.ellipsoid,
        i = r.height,
        n = r.extrudedHeight,
        s = t ? (a.length / 3) * 2 : a.length / 3,
        o = new Float64Array(3 * s),
        l = a.length,
        y = t ? l : 0,
        M = 0;
      M < l;
      M += 3
    ) {
      var C = M + 1,
        c = M + 2,
        h = R.Cartesian3.fromArray(a, M, S);
      e.scaleToGeodeticSurface(h, h);
      var u = R.Cartesian3.clone(h, b),
        x = e.geodeticSurfaceNormal(h, d),
        m = R.Cartesian3.multiplyByScalar(x, i, Q);
      R.Cartesian3.add(h, m, h),
        t &&
          (R.Cartesian3.multiplyByScalar(x, n, m),
          R.Cartesian3.add(u, m, u),
          (o[M + y] = u.x),
          (o[C + y] = u.y),
          (o[c + y] = u.z)),
        (o[M] = h.x),
        (o[C] = h.y),
        (o[c] = h.z);
    }
    return o;
  };
  var G = new R.Cartesian3(),
    H = new R.Cartesian3(),
    N = new R.Cartesian3();
  (r.computeEllipsePositions = function(a, r, t) {
    var e = a.semiMinorAxis,
      i = a.semiMajorAxis,
      n = a.rotation,
      s = a.center,
      o = 8 * a.granularity,
      l = e * e,
      y = i * i,
      M = i * e,
      C = R.Cartesian3.magnitude(s),
      c = R.Cartesian3.normalize(s, G),
      h = R.Cartesian3.cross(R.Cartesian3.UNIT_Z, s, H);
    h = R.Cartesian3.normalize(h, h);
    var u = R.Cartesian3.cross(c, h, N),
      x = 1 + Math.ceil(A.BMMath.PI_OVER_TWO / o),
      m = A.BMMath.PI_OVER_TWO / (x - 1),
      f = A.BMMath.PI_OVER_TWO - x * m;
    f < 0 && (x -= Math.ceil(Math.abs(f) / m));
    var z,
      d,
      _,
      v,
      O,
      p = r ? new Array(3 * (x * (x + 2) * 2)) : void 0,
      w = 0,
      B = S,
      P = b,
      T = 4 * x * 3,
      I = T - 1,
      g = 0,
      E = t ? new Array(T) : void 0;
    for (
      B = W((f = A.BMMath.PI_OVER_TWO), n, u, h, l, M, y, C, c, B),
        r && ((p[w++] = B.x), (p[w++] = B.y), (p[w++] = B.z)),
        t && ((E[I--] = B.z), (E[I--] = B.y), (E[I--] = B.x)),
        f = A.BMMath.PI_OVER_TWO - m,
        z = 1;
      z < x + 1;
      ++z
    ) {
      if (
        ((B = W(f, n, u, h, l, M, y, C, c, B)), (P = W(Math.PI - f, n, u, h, l, M, y, C, c, P)), r)
      ) {
        for (p[w++] = B.x, p[w++] = B.y, p[w++] = B.z, _ = 2 * z + 2, d = 1; d < _ - 1; ++d)
          (v = d / (_ - 1)),
            (O = R.Cartesian3.lerp(B, P, v, Q)),
            (p[w++] = O.x),
            (p[w++] = O.y),
            (p[w++] = O.z);
        (p[w++] = P.x), (p[w++] = P.y), (p[w++] = P.z);
      }
      t &&
        ((E[I--] = B.z),
        (E[I--] = B.y),
        (E[I--] = B.x),
        (E[g++] = P.x),
        (E[g++] = P.y),
        (E[g++] = P.z)),
        (f = A.BMMath.PI_OVER_TWO - (z + 1) * m);
    }
    for (z = x; 1 < z; --z) {
      if (
        ((B = W(-(f = A.BMMath.PI_OVER_TWO - (z - 1) * m), n, u, h, l, M, y, C, c, B)),
        (P = W(f + Math.PI, n, u, h, l, M, y, C, c, P)),
        r)
      ) {
        for (p[w++] = B.x, p[w++] = B.y, p[w++] = B.z, _ = 2 * (z - 1) + 2, d = 1; d < _ - 1; ++d)
          (v = d / (_ - 1)),
            (O = R.Cartesian3.lerp(B, P, v, Q)),
            (p[w++] = O.x),
            (p[w++] = O.y),
            (p[w++] = O.z);
        (p[w++] = P.x), (p[w++] = P.y), (p[w++] = P.z);
      }
      t &&
        ((E[I--] = B.z),
        (E[I--] = B.y),
        (E[I--] = B.x),
        (E[g++] = P.x),
        (E[g++] = P.y),
        (E[g++] = P.z));
    }
    B = W(-(f = A.BMMath.PI_OVER_TWO), n, u, h, l, M, y, C, c, B);
    var V = {};
    return (
      r && ((p[w++] = B.x), (p[w++] = B.y), (p[w++] = B.z), (V.positions = p), (V.numPts = x)),
      t && ((E[I--] = B.z), (E[I--] = B.y), (E[I--] = B.x), (V.outerPositions = E)),
      V
    );
  }),
    (a.EllipseGeometryLibrary = r);
});
