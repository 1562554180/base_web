define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './defineProperties-deb3db60',
], function(t, U, T, e, A, a) {
  'use strict';
  function z(t, a, i, n, e, s, r) {
    var h = (function(t, a) {
      return (t * a * (4 + t * (4 - 3 * a))) / 16;
    })(t, i);
    return (1 - h) * t * a * (n + h * e * (r + h * s * (2 * r * r - 1)));
  }
  var s = new A.Cartesian3(),
    r = new A.Cartesian3();
  function h(t, a, i, n) {
    A.Cartesian3.normalize(n.cartographicToCartesian(a, r), s),
      A.Cartesian3.normalize(n.cartographicToCartesian(i, r), r);
    !(function(t, a, i, n, e, s, r) {
      var h,
        o,
        d,
        u,
        c,
        M = (a - i) / a,
        l = s - n,
        g = Math.atan((1 - M) * Math.tan(e)),
        _ = Math.atan((1 - M) * Math.tan(r)),
        p = Math.cos(g),
        f = Math.sin(g),
        v = Math.cos(_),
        m = Math.sin(_),
        H = p * v,
        C = p * m,
        O = f * m,
        S = f * v,
        b = l,
        q = T.BMMath.TWO_PI,
        U = Math.cos(b),
        A = Math.sin(b);
      do {
        (U = Math.cos(b)), (A = Math.sin(b));
        var w,
          R = C - S * U;
        (d = Math.sqrt(v * v * A * A + R * R)),
          (o = O + H * U),
          (h = Math.atan2(d, o)),
          (q = b),
          (c = o - (2 * O) / (u = 0 === d ? ((w = 0), 1) : 1 - (w = (H * A) / d) * w)),
          isNaN(c) && (c = 0),
          (b = l + z(M, w, u, h, d, o, c));
      } while (Math.abs(b - q) > T.BMMath.EPSILON12);
      var P = (u * (a * a - i * i)) / (i * i),
        y = (P * (256 + P * (P * (74 - 47 * P) - 128))) / 1024,
        E = c * c,
        x =
          i *
          (1 + (P * (4096 + P * (P * (320 - 175 * P) - 768))) / 16384) *
          (h -
            y *
              d *
              (c + (y * (o * (2 * E - 1) - (y * c * (4 * d * d - 3) * (4 * E - 3)) / 6)) / 4)),
        D = Math.atan2(v * A, C - S * U),
        N = Math.atan2(p * A, C * U - S);
      (t._distance = x), (t._startHeading = D), (t._endHeading = N), (t._uSquared = P);
    })(t, n.maximumRadius, n.minimumRadius, a.longitude, a.latitude, i.longitude, i.latitude),
      (t._start = A.Cartographic.clone(a, t._start)),
      (t._end = A.Cartographic.clone(i, t._end)),
      (t._start.height = 0),
      (t._end.height = 0),
      (function(t) {
        var a = t._uSquared,
          i = t._ellipsoid.maximumRadius,
          n = t._ellipsoid.minimumRadius,
          e = (i - n) / i,
          s = Math.cos(t._startHeading),
          r = Math.sin(t._startHeading),
          h = (1 - e) * Math.tan(t._start.latitude),
          o = 1 / Math.sqrt(1 + h * h),
          d = o * h,
          u = Math.atan2(h, s),
          c = o * r,
          M = c * c,
          l = 1 - M,
          g = Math.sqrt(l),
          _ = a / 4,
          p = _ * _,
          f = p * _,
          v = p * p,
          m = 1 + _ - (3 * p) / 4 + (5 * f) / 4 - (175 * v) / 64,
          H = 1 - _ + (15 * p) / 8 - (35 * f) / 8,
          C = 1 - 3 * _ + (35 * p) / 4,
          O = 1 - 5 * _,
          S =
            m * u -
            (H * Math.sin(2 * u) * _) / 2 -
            (C * Math.sin(4 * u) * p) / 16 -
            (O * Math.sin(6 * u) * f) / 48 -
            (5 * Math.sin(8 * u) * v) / 512,
          b = t._constants;
        (b.a = i),
          (b.b = n),
          (b.f = e),
          (b.cosineHeading = s),
          (b.sineHeading = r),
          (b.tanU = h),
          (b.cosineU = o),
          (b.sineU = d),
          (b.sigma = u),
          (b.sineAlpha = c),
          (b.sineSquaredAlpha = M),
          (b.cosineSquaredAlpha = l),
          (b.cosineAlpha = g),
          (b.u2Over4 = _),
          (b.u4Over16 = p),
          (b.u6Over64 = f),
          (b.u8Over256 = v),
          (b.a0 = m),
          (b.a1 = H),
          (b.a2 = C),
          (b.a3 = O),
          (b.distanceRatio = S);
      })(t);
  }
  function i(t, a, i) {
    var n = e.defaultValue(i, A.Ellipsoid.WGS84);
    (this._ellipsoid = n),
      (this._start = new A.Cartographic()),
      (this._end = new A.Cartographic()),
      (this._constants = {}),
      (this._startHeading = void 0),
      (this._endHeading = void 0),
      (this._distance = void 0),
      (this._uSquared = void 0),
      U.defined(t) && U.defined(a) && h(this, t, a, n);
  }
  a.defineProperties(i.prototype, {
    ellipsoid: {
      get: function() {
        return this._ellipsoid;
      },
    },
    surfaceDistance: {
      get: function() {
        return this._distance;
      },
    },
    start: {
      get: function() {
        return this._start;
      },
    },
    end: {
      get: function() {
        return this._end;
      },
    },
    startHeading: {
      get: function() {
        return this._startHeading;
      },
    },
    endHeading: {
      get: function() {
        return this._endHeading;
      },
    },
  }),
    (i.prototype.setEndPoints = function(t, a) {
      h(this, t, a, this._ellipsoid);
    }),
    (i.prototype.interpolateUsingFraction = function(t, a) {
      return this.interpolateUsingSurfaceDistance(this._distance * t, a);
    }),
    (i.prototype.interpolateUsingSurfaceDistance = function(t, a) {
      var i = this._constants,
        n = i.distanceRatio + t / i.b,
        e = Math.cos(2 * n),
        s = Math.cos(4 * n),
        r = Math.cos(6 * n),
        h = Math.sin(2 * n),
        o = Math.sin(4 * n),
        d = Math.sin(6 * n),
        u = Math.sin(8 * n),
        c = n * n,
        M = n * c,
        l = i.u8Over256,
        g = i.u2Over4,
        _ = i.u6Over64,
        p = i.u4Over16,
        f =
          (2 * M * l * e) / 3 +
          n *
            (1 -
              g +
              (7 * p) / 4 -
              (15 * _) / 4 +
              (579 * l) / 64 -
              (p - (15 * _) / 4 + (187 * l) / 16) * e -
              ((5 * _) / 4 - (115 * l) / 16) * s -
              (29 * l * r) / 16) +
          (g / 2 - p + (71 * _) / 32 - (85 * l) / 16) * h +
          ((5 * p) / 16 - (5 * _) / 4 + (383 * l) / 96) * o -
          c * ((_ - (11 * l) / 2) * h + (5 * l * o) / 2) +
          ((29 * _) / 96 - (29 * l) / 16) * d +
          (539 * l * u) / 1536,
        v = Math.asin(Math.sin(f) * i.cosineAlpha),
        m = Math.atan((i.a / i.b) * Math.tan(v));
      f -= i.sigma;
      var H = Math.cos(2 * i.sigma + f),
        C = Math.sin(f),
        O = Math.cos(f),
        S = i.cosineU * O,
        b = i.sineU * C,
        q =
          Math.atan2(C * i.sineHeading, S - b * i.cosineHeading) -
          z(i.f, i.sineAlpha, i.cosineSquaredAlpha, f, C, O, H);
      return U.defined(a)
        ? ((a.longitude = this._start.longitude + q), (a.latitude = m), (a.height = 0), a)
        : new A.Cartographic(this._start.longitude + q, m, 0);
    }),
    (t.EllipsoidGeodesic = i);
});
