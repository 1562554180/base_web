define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './defineProperties-deb3db60',
], function(t, _, g, d, p, i) {
  'use strict';
  function f(t, i, a) {
    if (0 === t) return i * a;
    var e = t * t,
      n = e * e,
      h = n * e,
      s = h * e,
      r = s * e,
      M = r * e,
      o = a;
    return (
      i *
      ((1 -
        e / 4 -
        (3 * n) / 64 -
        (5 * h) / 256 -
        (175 * s) / 16384 -
        (441 * r) / 65536 -
        (4851 * M) / 1048576) *
        o -
        ((3 * e) / 8 +
          (3 * n) / 32 +
          (45 * h) / 1024 +
          (105 * s) / 4096 +
          (2205 * r) / 131072 +
          (6237 * M) / 524288) *
          Math.sin(2 * o) +
        ((15 * n) / 256 +
          (45 * h) / 1024 +
          (525 * s) / 16384 +
          (1575 * r) / 65536 +
          (155925 * M) / 8388608) *
          Math.sin(4 * o) -
        ((35 * h) / 3072 + (175 * s) / 12288 + (3675 * r) / 262144 + (13475 * M) / 1048576) *
          Math.sin(6 * o) +
        ((315 * s) / 131072 + (2205 * r) / 524288 + (43659 * M) / 8388608) * Math.sin(8 * o) -
        ((693 * r) / 1310720 + (6237 * M) / 5242880) * Math.sin(10 * o) +
        ((1001 * M) / 8388608) * Math.sin(12 * o))
    );
  }
  function P(t, i) {
    if (0 === t) return Math.log(Math.tan(0.5 * (g.BMMath.PI_OVER_TWO + i)));
    var a = t * Math.sin(i);
    return (
      Math.log(Math.tan(0.5 * (g.BMMath.PI_OVER_TWO + i))) - (t / 2) * Math.log((1 + a) / (1 - a))
    );
  }
  var M = new p.Cartesian3(),
    o = new p.Cartesian3();
  function n(t, i, a, e) {
    p.Cartesian3.normalize(e.cartographicToCartesian(i, o), M),
      p.Cartesian3.normalize(e.cartographicToCartesian(a, o), o);
    var n = e.maximumRadius,
      h = e.minimumRadius,
      s = n * n,
      r = h * h;
    (t._ellipticitySquared = (s - r) / s),
      (t._ellipticity = Math.sqrt(t._ellipticitySquared)),
      (t._start = p.Cartographic.clone(i, t._start)),
      (t._start.height = 0),
      (t._end = p.Cartographic.clone(a, t._end)),
      (t._end.height = 0),
      (t._heading = (function(t, i, a, e, n) {
        var h = P(t._ellipticity, a),
          s = P(t._ellipticity, n);
        return Math.atan2(g.BMMath.negativePiToPi(e - i), s - h);
      })(t, i.longitude, i.latitude, a.longitude, a.latitude)),
      (t._distance = (function(t, i, a, e, n, h, s) {
        var r = t._heading,
          M = h - e,
          o = 0;
        if (g.BMMath.equalsEpsilon(Math.abs(r), g.BMMath.PI_OVER_TWO, g.BMMath.EPSILON8))
          if (i === a) o = i * Math.cos(n) * g.BMMath.negativePiToPi(M);
          else {
            var u = Math.sin(n);
            o =
              (i * Math.cos(n) * g.BMMath.negativePiToPi(M)) /
              Math.sqrt(1 - t._ellipticitySquared * u * u);
          }
        else {
          var l = f(t._ellipticity, i, n);
          o = (f(t._ellipticity, i, s) - l) / Math.cos(r);
        }
        return Math.abs(o);
      })(t, e.maximumRadius, e.minimumRadius, i.longitude, i.latitude, a.longitude, a.latitude));
  }
  function c(t, i, a, e, n, h) {
    var s,
      r,
      M,
      o = n * n;
    if (Math.abs(g.BMMath.PI_OVER_TWO - Math.abs(i)) > g.BMMath.EPSILON8) {
      r = (function(t, i, a) {
        var e = t / a;
        if (0 === i) return e;
        var n = e * e,
          h = n * e,
          s = h * e,
          r = i * i,
          M = r * r,
          o = M * r,
          u = o * r,
          l = u * r,
          d = l * r,
          c = Math.sin(2 * e),
          _ = Math.cos(2 * e),
          g = Math.sin(4 * e),
          p = Math.cos(4 * e),
          f = Math.sin(6 * e),
          P = Math.cos(6 * e),
          B = Math.sin(8 * e),
          v = Math.cos(8 * e),
          O = Math.sin(10 * e);
        return (
          e +
          (e * r) / 4 +
          (7 * e * M) / 64 +
          (15 * e * o) / 256 +
          (579 * e * u) / 16384 +
          (1515 * e * l) / 65536 +
          (16837 * e * d) / 1048576 +
          ((3 * e * M) / 16 +
            (45 * e * o) / 256 -
            (e * (32 * n - 561) * u) / 4096 -
            (e * (232 * n - 1677) * l) / 16384 +
            (e * (399985 - 90560 * n + 512 * s) * d) / 5242880) *
            _ +
          ((21 * e * o) / 256 +
            (483 * e * u) / 4096 -
            (e * (224 * n - 1969) * l) / 16384 -
            (e * (33152 * n - 112599) * d) / 1048576) *
            p +
          ((151 * e * u) / 4096 +
            (4681 * e * l) / 65536 +
            (1479 * e * d) / 16384 -
            (453 * h * d) / 32768) *
            P +
          ((1097 * e * l) / 65536 + (42783 * e * d) / 1048576) * v +
          ((8011 * e * d) / 1048576) * Math.cos(10 * e) +
          ((3 * r) / 8 +
            (3 * M) / 16 +
            (213 * o) / 2048 -
            (3 * n * o) / 64 +
            (255 * u) / 4096 -
            (33 * n * u) / 512 +
            (20861 * l) / 524288 -
            (33 * n * l) / 512 +
            (s * l) / 1024 +
            (28273 * d) / 1048576 -
            (471 * n * d) / 8192 +
            (9 * s * d) / 4096) *
            c +
          ((21 * M) / 256 +
            (21 * o) / 256 +
            (533 * u) / 8192 -
            (21 * n * u) / 512 +
            (197 * l) / 4096 -
            (315 * n * l) / 4096 +
            (584039 * d) / 16777216 -
            (12517 * n * d) / 131072 +
            (7 * s * d) / 2048) *
            g +
          ((151 * o) / 6144 +
            (151 * u) / 4096 +
            (5019 * l) / 131072 -
            (453 * n * l) / 16384 +
            (26965 * d) / 786432 -
            (8607 * n * d) / 131072) *
            f +
          ((1097 * u) / 131072 +
            (1097 * l) / 65536 +
            (225797 * d) / 10485760 -
            (1097 * n * d) / 65536) *
            B +
          ((8011 * l) / 2621440 + (8011 * d) / 1048576) * O +
          ((293393 * d) / 251658240) * Math.sin(12 * e)
        );
      })(f(n, e, t.latitude) + a * Math.cos(i), n, e);
      var u = P(n, t.latitude),
        l = P(n, r);
      (M = Math.tan(i) * (l - u)), (s = g.BMMath.negativePiToPi(t.longitude + M));
    } else {
      var d;
      if (((r = t.latitude), 0 === n)) d = e * Math.cos(t.latitude);
      else {
        var c = Math.sin(t.latitude);
        d = (e * Math.cos(t.latitude)) / Math.sqrt(1 - o * c * c);
      }
      (M = a / d),
        (s =
          0 < i
            ? g.BMMath.negativePiToPi(t.longitude + M)
            : g.BMMath.negativePiToPi(t.longitude - M));
    }
    return _.defined(h)
      ? ((h.longitude = s), (h.latitude = r), (h.height = 0), h)
      : new p.Cartographic(s, r, 0);
  }
  function B(t, i, a) {
    var e = d.defaultValue(a, p.Ellipsoid.WGS84);
    (this._ellipsoid = e),
      (this._start = new p.Cartographic()),
      (this._end = new p.Cartographic()),
      (this._heading = void 0),
      (this._distance = void 0),
      (this._ellipticity = void 0),
      (this._ellipticitySquared = void 0),
      _.defined(t) && _.defined(i) && n(this, t, i, e);
  }
  i.defineProperties(B.prototype, {
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
    heading: {
      get: function() {
        return this._heading;
      },
    },
  }),
    (B.fromStartHeadingDistance = function(t, i, a, e, n) {
      var h = d.defaultValue(e, p.Ellipsoid.WGS84),
        s = h.maximumRadius,
        r = h.minimumRadius,
        M = s * s,
        o = r * r,
        u = Math.sqrt((M - o) / M),
        l = c(t, (i = g.BMMath.negativePiToPi(i)), a, h.maximumRadius, u);
      return !_.defined(n) || (_.defined(e) && !e.equals(n.ellipsoid))
        ? new B(t, l, h)
        : (n.setEndPoints(t, l), n);
    }),
    (B.prototype.setEndPoints = function(t, i) {
      n(this, t, i, this._ellipsoid);
    }),
    (B.prototype.interpolateUsingFraction = function(t, i) {
      return this.interpolateUsingSurfaceDistance(t * this._distance, i);
    }),
    (B.prototype.interpolateUsingSurfaceDistance = function(t, i) {
      return c(this._start, this._heading, t, this._ellipsoid.maximumRadius, this._ellipticity, i);
    }),
    (B.prototype.findIntersectionWithLongitude = function(t, i) {
      var a = this._ellipticity,
        e = this._heading,
        n = Math.abs(e),
        h = this._start;
      if (
        ((t = g.BMMath.negativePiToPi(t)),
        g.BMMath.equalsEpsilon(Math.abs(t), Math.PI, g.BMMath.EPSILON14) &&
          (t = g.BMMath.sign(h.longitude) * Math.PI),
        _.defined(i) || (i = new p.Cartographic()),
        Math.abs(g.BMMath.PI_OVER_TWO - n) <= g.BMMath.EPSILON8)
      )
        return (i.longitude = t), (i.latitude = h.latitude), (i.height = 0), i;
      if (
        g.BMMath.equalsEpsilon(
          Math.abs(g.BMMath.PI_OVER_TWO - n),
          g.BMMath.PI_OVER_TWO,
          g.BMMath.EPSILON8
        )
      ) {
        if (g.BMMath.equalsEpsilon(t, h.longitude, g.BMMath.EPSILON12)) return;
        return (
          (i.longitude = t),
          (i.latitude = g.BMMath.PI_OVER_TWO * g.BMMath.sign(g.BMMath.PI_OVER_TWO - e)),
          (i.height = 0),
          i
        );
      }
      var s,
        r = h.latitude,
        M = a * Math.sin(r),
        o = Math.tan(0.5 * (g.BMMath.PI_OVER_TWO + r)) * Math.exp((t - h.longitude) / Math.tan(e)),
        u = (1 + M) / (1 - M),
        l = h.latitude;
      do {
        s = l;
        var d = a * Math.sin(s),
          c = (1 + d) / (1 - d);
        l = 2 * Math.atan(o * Math.pow(c / u, a / 2)) - g.BMMath.PI_OVER_TWO;
      } while (!g.BMMath.equalsEpsilon(l, s, g.BMMath.EPSILON12));
      return (i.longitude = t), (i.latitude = l), (i.height = 0), i;
    }),
    (B.prototype.findIntersectionWithLatitude = function(t, i) {
      var a = this._ellipticity,
        e = this._heading,
        n = this._start;
      if (!g.BMMath.equalsEpsilon(Math.abs(e), g.BMMath.PI_OVER_TWO, g.BMMath.EPSILON8)) {
        var h = P(a, n.latitude),
          s = P(a, t),
          r = Math.tan(e) * (s - h),
          M = g.BMMath.negativePiToPi(n.longitude + r);
        return _.defined(i)
          ? ((i.longitude = M), (i.latitude = t), (i.height = 0), i)
          : new p.Cartographic(M, t, 0);
      }
    }),
    (t.EllipsoidRhumbLine = B);
});
