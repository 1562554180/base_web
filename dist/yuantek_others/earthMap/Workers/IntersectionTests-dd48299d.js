define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './Transforms-62d2509c',
], function(a, N, E, v, z, T) {
  'use strict';
  var U = {};
  function M(a, t, r) {
    var e = a + t;
    return E.BMMath.sign(a) !== E.BMMath.sign(t) &&
      Math.abs(e / Math.max(Math.abs(a), Math.abs(t))) < r
      ? 0
      : e;
  }
  (U.computeDiscriminant = function(a, t, r) {
    return t * t - 4 * a * r;
  }),
    (U.computeRealRoots = function(a, t, r) {
      var e;
      if (0 === a) return 0 === t ? [] : [-r / t];
      if (0 === t) {
        if (0 === r) return [0, 0];
        var n = Math.abs(r),
          i = Math.abs(a);
        if (n < i && n / i < E.BMMath.EPSILON14) return [0, 0];
        if (i < n && i / n < E.BMMath.EPSILON14) return [];
        if ((e = -r / a) < 0) return [];
        var s = Math.sqrt(e);
        return [-s, s];
      }
      if (0 === r) return (e = -t / a) < 0 ? [e, 0] : [0, e];
      var o = M(t * t, -(4 * a * r), E.BMMath.EPSILON14);
      if (o < 0) return [];
      var u = -0.5 * M(t, E.BMMath.sign(t) * Math.sqrt(o), E.BMMath.EPSILON14);
      return 0 < t ? [u / a, r / u] : [r / u, u / a];
    });
  var b = {};
  function o(a, t, r, e) {
    var n,
      i,
      s = a,
      o = t / 3,
      u = r / 3,
      M = e,
      c = s * u,
      l = o * M,
      h = o * o,
      C = u * u,
      f = s * u - h,
      d = s * M - o * u,
      m = o * M - C,
      v = 4 * f * m - d * d;
    if (v < 0) {
      var g,
        p,
        w,
        R =
          -((w = c * C <= h * l ? -2 * o * (p = f) + (g = s) * d : -(g = M) * d + 2 * u * (p = m)) <
          0
            ? -1
            : 1) *
          Math.abs(g) *
          Math.sqrt(-v),
        S = (i = R - w) / 2,
        O = S < 0 ? -Math.pow(-S, 1 / 3) : Math.pow(S, 1 / 3),
        x = i === R ? -O : -p / O;
      return (
        (n = p <= 0 ? O + x : -w / (O * O + x * x + p)),
        c * C <= h * l ? [(n - o) / s] : [-M / (n + u)]
      );
    }
    var B = f,
      y = -2 * o * f + s * d,
      P = m,
      b = -M * d + 2 * u * m,
      N = Math.sqrt(v),
      q = Math.sqrt(3) / 2,
      L = Math.abs(Math.atan2(s * N, -y) / 3);
    n = 2 * Math.sqrt(-B);
    var I = Math.cos(L);
    i = n * I;
    var E = n * (-I / 2 - q * Math.sin(L)),
      z = 2 * o < i + E ? i - o : E - o,
      T = s,
      U = z / T;
    L = Math.abs(Math.atan2(M * N, -b) / 3);
    var W = -M,
      V =
        (i = (n = 2 * Math.sqrt(-P)) * (I = Math.cos(L))) + (E = n * (-I / 2 - q * Math.sin(L))) <
        2 * u
          ? i + u
          : E + u,
      Z = W / V,
      A = -z * V - T * W,
      D = (u * A - o * (z * W)) / (-o * A + u * (T * V));
    return U <= D
      ? U <= Z
        ? D <= Z
          ? [U, D, Z]
          : [U, Z, D]
        : [Z, U, D]
      : U <= Z
        ? [D, U, Z]
        : D <= Z
          ? [D, Z, U]
          : [Z, D, U];
  }
  (b.computeDiscriminant = function(a, t, r, e) {
    var n = t * t,
      i = r * r;
    return 18 * a * t * r * e + n * i - 27 * (a * a) * (e * e) - 4 * (a * i * r + n * t * e);
  }),
    (b.computeRealRoots = function(a, t, r, e) {
      var n, i;
      if (0 === a) return U.computeRealRoots(t, r, e);
      if (0 !== t)
        return 0 === r
          ? 0 === e
            ? (i = -t / a) < 0
              ? [i, 0, 0]
              : [0, 0, i]
            : o(a, t, 0, e)
          : 0 === e
            ? 0 === (n = U.computeRealRoots(a, t, r)).length
              ? [0]
              : n[1] <= 0
                ? [n[0], n[1], 0]
                : 0 <= n[0]
                  ? [0, n[0], n[1]]
                  : [n[0], 0, n[1]]
            : o(a, t, r, e);
      if (0 !== r)
        return 0 === e
          ? 0 === (n = U.computeRealRoots(a, 0, r)).Length
            ? [0]
            : [n[0], 0, n[1]]
          : o(a, 0, r, e);
      if (0 === e) return [0, 0, 0];
      var s = (i = -e / a) < 0 ? -Math.pow(-i, 1 / 3) : Math.pow(i, 1 / 3);
      return [s, s, s];
    });
  var W = {};
  function c(a, t, r, e) {
    var n = a * a,
      i = t - (3 * n) / 8,
      s = r - (t * a) / 2 + (n * a) / 8,
      o = e - (r * a) / 4 + (t * n) / 16 - (3 * n * n) / 256,
      u = b.computeRealRoots(1, 2 * i, i * i - 4 * o, -s * s);
    if (0 < u.length) {
      var M = -a / 4,
        c = u[u.length - 1];
      if (Math.abs(c) < E.BMMath.EPSILON14) {
        var l = U.computeRealRoots(1, i, o);
        if (2 === l.length) {
          var h,
            C = l[0],
            f = l[1];
          if (0 <= C && 0 <= f) {
            var d = Math.sqrt(C),
              m = Math.sqrt(f);
            return [M - m, M - d, M + d, M + m];
          }
          if (0 <= C && f < 0) return [M - (h = Math.sqrt(C)), M + h];
          if (C < 0 && 0 <= f) return [M - (h = Math.sqrt(f)), M + h];
        }
        return [];
      }
      if (0 < c) {
        var v = Math.sqrt(c),
          g = (i + c - s / v) / 2,
          p = (i + c + s / v) / 2,
          w = U.computeRealRoots(1, v, g),
          R = U.computeRealRoots(1, -v, p);
        return 0 !== w.length
          ? ((w[0] += M),
            (w[1] += M),
            0 !== R.length
              ? ((R[0] += M),
                (R[1] += M),
                w[1] <= R[0]
                  ? [w[0], w[1], R[0], R[1]]
                  : R[1] <= w[0]
                    ? [R[0], R[1], w[0], w[1]]
                    : w[0] >= R[0] && w[1] <= R[1]
                      ? [R[0], w[0], w[1], R[1]]
                      : R[0] >= w[0] && R[1] <= w[1]
                        ? [w[0], R[0], R[1], w[1]]
                        : w[0] > R[0] && w[0] < R[1]
                          ? [R[0], w[0], R[1], w[1]]
                          : [w[0], R[0], w[1], R[1]])
              : w)
          : 0 !== R.length
            ? ((R[0] += M), (R[1] += M), R)
            : [];
      }
    }
    return [];
  }
  function l(a, t, r, e) {
    var n = a * a,
      i = -2 * t,
      s = r * a + t * t - 4 * e,
      o = n * e - r * t * a + r * r,
      u = b.computeRealRoots(1, i, s, o);
    if (0 < u.length) {
      var M,
        c,
        l,
        h,
        C,
        f,
        d = u[0],
        m = t - d,
        v = m * m,
        g = a / 2,
        p = m / 2,
        w = v - 4 * e,
        R = v + 4 * Math.abs(e),
        S = n - 4 * d,
        O = n + 4 * Math.abs(d);
      if (d < 0 || w * O < S * R) {
        var x = Math.sqrt(S);
        (M = x / 2), (c = 0 === x ? 0 : (a * p - r) / x);
      } else {
        var B = Math.sqrt(w);
        (M = 0 === B ? 0 : (a * p - r) / B), (c = B / 2);
      }
      0 == g && 0 === M
        ? (h = l = 0)
        : E.BMMath.sign(g) === E.BMMath.sign(M)
          ? (h = d / (l = g + M))
          : (l = d / (h = g - M)),
        0 == p && 0 === c
          ? (f = C = 0)
          : E.BMMath.sign(p) === E.BMMath.sign(c)
            ? (f = e / (C = p + c))
            : (C = e / (f = p - c));
      var y = U.computeRealRoots(1, l, C),
        P = U.computeRealRoots(1, h, f);
      if (0 !== y.length)
        return 0 !== P.length
          ? y[1] <= P[0]
            ? [y[0], y[1], P[0], P[1]]
            : P[1] <= y[0]
              ? [P[0], P[1], y[0], y[1]]
              : y[0] >= P[0] && y[1] <= P[1]
                ? [P[0], y[0], y[1], P[1]]
                : P[0] >= y[0] && P[1] <= y[1]
                  ? [y[0], P[0], P[1], y[1]]
                  : y[0] > P[0] && y[0] < P[1]
                    ? [P[0], y[0], P[1], y[1]]
                    : [y[0], P[0], y[1], P[1]]
          : y;
      if (0 !== P.length) return P;
    }
    return [];
  }
  function r(a, t) {
    (t = z.Cartesian3.clone(v.defaultValue(t, z.Cartesian3.ZERO))),
      z.Cartesian3.equals(t, z.Cartesian3.ZERO) || z.Cartesian3.normalize(t, t),
      (this.origin = z.Cartesian3.clone(v.defaultValue(a, z.Cartesian3.ZERO))),
      (this.direction = t);
  }
  (W.computeDiscriminant = function(a, t, r, e, n) {
    var i = a * a,
      s = t * t,
      o = s * t,
      u = r * r,
      M = u * r,
      c = e * e,
      l = c * e,
      h = n * n;
    return (
      s * u * c -
      4 * o * l -
      4 * a * M * c +
      18 * a * t * r * l -
      27 * i * c * c +
      256 * (i * a) * (h * n) +
      n *
        (18 * o * r * e -
          4 * s * M +
          16 * a * u * u -
          80 * a * t * u * e -
          6 * a * s * c +
          144 * i * r * c) +
      h * (144 * a * s * r - 27 * s * s - 128 * i * u - 192 * i * t * e)
    );
  }),
    (W.computeRealRoots = function(a, t, r, e, n) {
      if (Math.abs(a) < E.BMMath.EPSILON15) return b.computeRealRoots(t, r, e, n);
      var i = t / a,
        s = r / a,
        o = e / a,
        u = n / a,
        M = i < 0 ? 1 : 0;
      switch (((M += s < 0 ? M + 1 : M), (M += o < 0 ? M + 1 : M), (M += u < 0 ? M + 1 : M))) {
        case 0:
          return c(i, s, o, u);
        case 1:
        case 2:
          return l(i, s, o, u);
        case 3:
        case 4:
          return c(i, s, o, u);
        case 5:
          return l(i, s, o, u);
        case 6:
        case 7:
          return c(i, s, o, u);
        case 8:
          return l(i, s, o, u);
        case 9:
        case 10:
          return c(i, s, o, u);
        case 11:
          return l(i, s, o, u);
        case 12:
        case 13:
        case 14:
        case 15:
          return c(i, s, o, u);
        default:
          return;
      }
    }),
    (r.clone = function(a, t) {
      if (N.defined(a))
        return N.defined(t)
          ? ((t.origin = z.Cartesian3.clone(a.origin)),
            (t.direction = z.Cartesian3.clone(a.direction)),
            t)
          : new r(a.origin, a.direction);
    }),
    (r.getPoint = function(a, t, r) {
      return (
        N.defined(r) || (r = new z.Cartesian3()),
        (r = z.Cartesian3.multiplyByScalar(a.direction, t, r)),
        z.Cartesian3.add(a.origin, r, r)
      );
    });
  var h = {
      rayPlane: function(a, t, r) {
        N.defined(r) || (r = new z.Cartesian3());
        var e = a.origin,
          n = a.direction,
          i = t.normal,
          s = z.Cartesian3.dot(i, n);
        if (!(Math.abs(s) < E.BMMath.EPSILON15)) {
          var o = (-t.distance - z.Cartesian3.dot(i, e)) / s;
          if (!(o < 0))
            return (r = z.Cartesian3.multiplyByScalar(n, o, r)), z.Cartesian3.add(e, r, r);
        }
      },
    },
    g = new z.Cartesian3(),
    p = new z.Cartesian3(),
    w = new z.Cartesian3(),
    R = new z.Cartesian3(),
    S = new z.Cartesian3();
  (h.rayTriangleParametric = function(a, t, r, e, n) {
    n = v.defaultValue(n, !1);
    var i,
      s,
      o,
      u,
      M,
      c = a.origin,
      l = a.direction,
      h = z.Cartesian3.subtract(r, t, g),
      C = z.Cartesian3.subtract(e, t, p),
      f = z.Cartesian3.cross(l, C, w),
      d = z.Cartesian3.dot(h, f);
    if (n) {
      if (d < E.BMMath.EPSILON6) return;
      if (((i = z.Cartesian3.subtract(c, t, R)), (o = z.Cartesian3.dot(i, f)) < 0 || d < o)) return;
      if (((s = z.Cartesian3.cross(i, h, S)), (u = z.Cartesian3.dot(l, s)) < 0 || d < o + u))
        return;
      M = z.Cartesian3.dot(C, s) / d;
    } else {
      if (Math.abs(d) < E.BMMath.EPSILON6) return;
      var m = 1 / d;
      if (((i = z.Cartesian3.subtract(c, t, R)), (o = z.Cartesian3.dot(i, f) * m) < 0 || 1 < o))
        return;
      if (((s = z.Cartesian3.cross(i, h, S)), (u = z.Cartesian3.dot(l, s) * m) < 0 || 1 < o + u))
        return;
      M = z.Cartesian3.dot(C, s) * m;
    }
    return M;
  }),
    (h.rayTriangle = function(a, t, r, e, n, i) {
      var s = h.rayTriangleParametric(a, t, r, e, n);
      if (N.defined(s) && !(s < 0))
        return (
          N.defined(i) || (i = new z.Cartesian3()),
          z.Cartesian3.multiplyByScalar(a.direction, s, i),
          z.Cartesian3.add(a.origin, i, i)
        );
    });
  var C = new r();
  h.lineSegmentTriangle = function(a, t, r, e, n, i, s) {
    var o = C;
    z.Cartesian3.clone(a, o.origin),
      z.Cartesian3.subtract(t, a, o.direction),
      z.Cartesian3.normalize(o.direction, o.direction);
    var u = h.rayTriangleParametric(o, r, e, n, i);
    if (!(!N.defined(u) || u < 0 || u > z.Cartesian3.distance(a, t)))
      return (
        N.defined(s) || (s = new z.Cartesian3()),
        z.Cartesian3.multiplyByScalar(o.direction, u, s),
        z.Cartesian3.add(o.origin, s, s)
      );
  };
  var f = { root0: 0, root1: 0 };
  function u(a, t, r) {
    N.defined(r) || (r = new T.Interval());
    var e = a.origin,
      n = a.direction,
      i = t.center,
      s = t.radius * t.radius,
      o = z.Cartesian3.subtract(e, i, w),
      u = (function(a, t, r, e) {
        var n = t * t - 4 * a * r;
        if (!(n < 0)) {
          if (0 < n) {
            var i = 1 / (2 * a),
              s = Math.sqrt(n),
              o = (-t + s) * i,
              u = (-t - s) * i;
            return o < u ? ((e.root0 = o), (e.root1 = u)) : ((e.root0 = u), (e.root1 = o)), e;
          }
          var M = -t / (2 * a);
          if (0 != M) return (e.root0 = e.root1 = M), e;
        }
      })(
        z.Cartesian3.dot(n, n),
        2 * z.Cartesian3.dot(n, o),
        z.Cartesian3.magnitudeSquared(o) - s,
        f
      );
    if (N.defined(u)) return (r.start = u.root0), (r.stop = u.root1), r;
  }
  h.raySphere = function(a, t, r) {
    if (((r = u(a, t, r)), N.defined(r) && !(r.stop < 0)))
      return (r.start = Math.max(r.start, 0)), r;
  };
  var d = new r();
  h.lineSegmentSphere = function(a, t, r, e) {
    var n = d;
    z.Cartesian3.clone(a, n.origin);
    var i = z.Cartesian3.subtract(t, a, n.direction),
      s = z.Cartesian3.magnitude(i);
    if (
      (z.Cartesian3.normalize(i, i),
      (e = u(n, r, e)),
      !(!N.defined(e) || e.stop < 0 || e.start > s))
    )
      return (e.start = Math.max(e.start, 0)), (e.stop = Math.min(e.stop, s)), e;
  };
  var m = new z.Cartesian3(),
    O = new z.Cartesian3();
  function V(a, t, r) {
    var e = a + t;
    return E.BMMath.sign(a) !== E.BMMath.sign(t) &&
      Math.abs(e / Math.max(Math.abs(a), Math.abs(t))) < r
      ? 0
      : e;
  }
  h.rayEllipsoid = function(a, t) {
    var r,
      e,
      n,
      i,
      s,
      o = t.oneOverRadii,
      u = z.Cartesian3.multiplyComponents(o, a.origin, m),
      M = z.Cartesian3.multiplyComponents(o, a.direction, O),
      c = z.Cartesian3.magnitudeSquared(u),
      l = z.Cartesian3.dot(u, M);
    if (1 < c) {
      if (0 <= l) return;
      var h = l * l;
      if (((r = c - 1), h < (n = (e = z.Cartesian3.magnitudeSquared(M)) * r))) return;
      if (n < h) {
        i = l * l - n;
        var C = (s = -l + Math.sqrt(i)) / e,
          f = r / s;
        return C < f ? new T.Interval(C, f) : { start: f, stop: C };
      }
      var d = Math.sqrt(r / e);
      return new T.Interval(d, d);
    }
    return c < 1
      ? ((r = c - 1),
        (i = l * l - (n = (e = z.Cartesian3.magnitudeSquared(M)) * r)),
        (s = -l + Math.sqrt(i)),
        new T.Interval(0, s / e))
      : l < 0
        ? ((e = z.Cartesian3.magnitudeSquared(M)), new T.Interval(0, -l / e))
        : void 0;
  };
  var q = new z.Cartesian3(),
    L = new z.Cartesian3(),
    I = new z.Cartesian3(),
    Z = new z.Cartesian3(),
    A = new z.Cartesian3(),
    D = new T.Matrix3(),
    F = new T.Matrix3(),
    G = new T.Matrix3(),
    Y = new T.Matrix3(),
    _ = new T.Matrix3(),
    j = new T.Matrix3(),
    k = new T.Matrix3(),
    H = new z.Cartesian3(),
    J = new z.Cartesian3(),
    K = new z.Cartographic();
  h.grazingAltitudeLocation = function(a, t) {
    var r = a.origin,
      e = a.direction;
    if (!z.Cartesian3.equals(r, z.Cartesian3.ZERO)) {
      var n = t.geodeticSurfaceNormal(r, q);
      if (0 <= z.Cartesian3.dot(e, n)) return r;
    }
    var i = N.defined(this.rayEllipsoid(a, t)),
      s = t.transformPositionToScaledSpace(e, q),
      o = z.Cartesian3.normalize(s, s),
      u = z.Cartesian3.mostOrthogonalAxis(s, Z),
      M = z.Cartesian3.normalize(z.Cartesian3.cross(u, o, L), L),
      c = z.Cartesian3.normalize(z.Cartesian3.cross(o, M, I), I),
      l = D;
    (l[0] = o.x),
      (l[1] = o.y),
      (l[2] = o.z),
      (l[3] = M.x),
      (l[4] = M.y),
      (l[5] = M.z),
      (l[6] = c.x),
      (l[7] = c.y),
      (l[8] = c.z);
    var h = T.Matrix3.transpose(l, F),
      C = T.Matrix3.fromScale(t.radii, G),
      f = T.Matrix3.fromScale(t.oneOverRadii, Y),
      d = _;
    (d[0] = 0),
      (d[1] = -e.z),
      (d[2] = e.y),
      (d[3] = e.z),
      (d[4] = 0),
      (d[5] = -e.x),
      (d[6] = -e.y),
      (d[7] = e.x),
      (d[8] = 0);
    var m,
      v,
      g = T.Matrix3.multiply(T.Matrix3.multiply(h, f, j), d, j),
      p = T.Matrix3.multiply(T.Matrix3.multiply(g, C, k), l, k),
      w = T.Matrix3.multiplyByVector(g, r, A),
      R = (function(a, t, r, e, n) {
        var i,
          s = e * e,
          o = n * n,
          u = (a[T.Matrix3.COLUMN1ROW1] - a[T.Matrix3.COLUMN2ROW2]) * o,
          M =
            n *
            (e * V(a[T.Matrix3.COLUMN1ROW0], a[T.Matrix3.COLUMN0ROW1], E.BMMath.EPSILON15) + t.y),
          c = a[T.Matrix3.COLUMN0ROW0] * s + a[T.Matrix3.COLUMN2ROW2] * o + e * t.x + r,
          l = o * V(a[T.Matrix3.COLUMN2ROW1], a[T.Matrix3.COLUMN1ROW2], E.BMMath.EPSILON15),
          h = n * (e * V(a[T.Matrix3.COLUMN2ROW0], a[T.Matrix3.COLUMN0ROW2]) + t.z),
          C = [];
        if (0 == h && 0 == l) {
          if (0 === (i = U.computeRealRoots(u, M, c)).length) return C;
          var f = i[0],
            d = Math.sqrt(Math.max(1 - f * f, 0));
          if (
            (C.push(new z.Cartesian3(e, n * f, n * -d)),
            C.push(new z.Cartesian3(e, n * f, n * d)),
            2 === i.length)
          ) {
            var m = i[1],
              v = Math.sqrt(Math.max(1 - m * m, 0));
            C.push(new z.Cartesian3(e, n * m, n * -v)), C.push(new z.Cartesian3(e, n * m, n * v));
          }
          return C;
        }
        var g = h * h,
          p = l * l,
          w = h * l,
          R = u * u + p,
          S = 2 * (M * u + w),
          O = 2 * c * u + M * M - p + g,
          x = 2 * (c * M - w),
          B = c * c - g;
        if (0 == R && 0 == S && 0 == O && 0 == x) return C;
        var y = (i = W.computeRealRoots(R, S, O, x, B)).length;
        if (0 === y) return C;
        for (var P = 0; P < y; ++P) {
          var b = i[P],
            N = b * b,
            q = Math.max(1 - N, 0),
            L = Math.sqrt(q),
            I =
              (E.BMMath.sign(u) === E.BMMath.sign(c)
                ? V(u * N + c, M * b, E.BMMath.EPSILON12)
                : E.BMMath.sign(c) === E.BMMath.sign(M * b)
                  ? V(u * N, M * b + c, E.BMMath.EPSILON12)
                  : V(u * N + M * b, c, E.BMMath.EPSILON12)) * V(l * b, h, E.BMMath.EPSILON15);
          I < 0
            ? C.push(new z.Cartesian3(e, n * b, n * L))
            : 0 < I
              ? C.push(new z.Cartesian3(e, n * b, n * -L))
              : 0 !== L
                ? (C.push(new z.Cartesian3(e, n * b, n * -L)),
                  C.push(new z.Cartesian3(e, n * b, n * L)),
                  ++P)
                : C.push(new z.Cartesian3(e, n * b, n * L));
        }
        return C;
      })(p, z.Cartesian3.negate(w, q), 0, 0, 1),
      S = R.length;
    if (0 < S) {
      for (
        var O = z.Cartesian3.clone(z.Cartesian3.ZERO, J), x = Number.NEGATIVE_INFINITY, B = 0;
        B < S;
        ++B
      ) {
        m = T.Matrix3.multiplyByVector(C, T.Matrix3.multiplyByVector(l, R[B], H), H);
        var y = z.Cartesian3.normalize(z.Cartesian3.subtract(m, r, Z), Z),
          P = z.Cartesian3.dot(y, e);
        x < P && ((x = P), (O = z.Cartesian3.clone(m, O)));
      }
      var b = t.cartesianToCartographic(O, K);
      return (
        (x = E.BMMath.clamp(x, 0, 1)),
        (v = z.Cartesian3.magnitude(z.Cartesian3.subtract(O, r, Z)) * Math.sqrt(1 - x * x)),
        (v = i ? -v : v),
        (b.height = v),
        t.cartographicToCartesian(b, new z.Cartesian3())
      );
    }
  };
  var x = new z.Cartesian3();
  (h.lineSegmentPlane = function(a, t, r, e) {
    N.defined(e) || (e = new z.Cartesian3());
    var n = z.Cartesian3.subtract(t, a, x),
      i = r.normal,
      s = z.Cartesian3.dot(i, n);
    if (!(Math.abs(s) < E.BMMath.EPSILON6)) {
      var o = z.Cartesian3.dot(i, a),
        u = -(r.distance + o) / s;
      if (!(u < 0 || 1 < u))
        return z.Cartesian3.multiplyByScalar(n, u, e), z.Cartesian3.add(a, e, e), e;
    }
  }),
    (h.trianglePlaneIntersection = function(a, t, r, e) {
      var n,
        i,
        s = e.normal,
        o = e.distance,
        u = z.Cartesian3.dot(s, a) + o < 0,
        M = z.Cartesian3.dot(s, t) + o < 0,
        c = z.Cartesian3.dot(s, r) + o < 0,
        l = 0;
      if (
        ((l += u ? 1 : 0),
        (l += M ? 1 : 0),
        (1 != (l += c ? 1 : 0) && 2 != l) || ((n = new z.Cartesian3()), (i = new z.Cartesian3())),
        1 == l)
      ) {
        if (u)
          return (
            h.lineSegmentPlane(a, t, e, n),
            h.lineSegmentPlane(a, r, e, i),
            { positions: [a, t, r, n, i], indices: [0, 3, 4, 1, 2, 4, 1, 4, 3] }
          );
        if (M)
          return (
            h.lineSegmentPlane(t, r, e, n),
            h.lineSegmentPlane(t, a, e, i),
            { positions: [a, t, r, n, i], indices: [1, 3, 4, 2, 0, 4, 2, 4, 3] }
          );
        if (c)
          return (
            h.lineSegmentPlane(r, a, e, n),
            h.lineSegmentPlane(r, t, e, i),
            { positions: [a, t, r, n, i], indices: [2, 3, 4, 0, 1, 4, 0, 4, 3] }
          );
      } else if (2 == l) {
        if (!u)
          return (
            h.lineSegmentPlane(t, a, e, n),
            h.lineSegmentPlane(r, a, e, i),
            { positions: [a, t, r, n, i], indices: [1, 2, 4, 1, 4, 3, 0, 3, 4] }
          );
        if (!M)
          return (
            h.lineSegmentPlane(r, t, e, n),
            h.lineSegmentPlane(a, t, e, i),
            { positions: [a, t, r, n, i], indices: [2, 0, 4, 2, 4, 3, 1, 3, 4] }
          );
        if (!c)
          return (
            h.lineSegmentPlane(a, r, e, n),
            h.lineSegmentPlane(t, r, e, i),
            { positions: [a, t, r, n, i], indices: [0, 1, 4, 0, 4, 3, 2, 3, 4] }
          );
      }
    }),
    (a.IntersectionTests = h),
    (a.Ray = r);
});
