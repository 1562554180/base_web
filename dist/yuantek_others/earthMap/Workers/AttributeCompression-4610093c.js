define(['exports', './defined-30a32f90', './Math-fbd31710', './Cartesian2-06dac25b'], function(
  t,
  u,
  r,
  c
) {
  'use strict';
  var s = {
      octEncodeInRange: function(t, o, n) {
        if (
          ((n.x = t.x / (Math.abs(t.x) + Math.abs(t.y) + Math.abs(t.z))),
          (n.y = t.y / (Math.abs(t.x) + Math.abs(t.y) + Math.abs(t.z))),
          t.z < 0)
        ) {
          var e = n.x,
            a = n.y;
          (n.x = (1 - Math.abs(a)) * r.BMMath.signNotZero(e)),
            (n.y = (1 - Math.abs(e)) * r.BMMath.signNotZero(a));
        }
        return (n.x = r.BMMath.toSNorm(n.x, o)), (n.y = r.BMMath.toSNorm(n.y, o)), n;
      },
      octEncode: function(t, o) {
        return s.octEncodeInRange(t, 255, o);
      },
    },
    n = new c.Cartesian2(),
    o = new Uint8Array(1);
  function e(t) {
    return (o[0] = t), o[0];
  }
  (s.octEncodeToCartesian4 = function(t, o) {
    return (
      s.octEncodeInRange(t, 65535, n),
      (o.x = e(n.x * (1 / 256))),
      (o.y = e(n.x)),
      (o.z = e(n.y * (1 / 256))),
      (o.w = e(n.y)),
      o
    );
  }),
    (s.octDecodeInRange = function(t, o, n, e) {
      if (
        ((e.x = r.BMMath.fromSNorm(t, n)),
        (e.y = r.BMMath.fromSNorm(o, n)),
        (e.z = 1 - (Math.abs(e.x) + Math.abs(e.y))),
        e.z < 0)
      ) {
        var a = e.x;
        (e.x = (1 - Math.abs(e.y)) * r.BMMath.signNotZero(a)),
          (e.y = (1 - Math.abs(a)) * r.BMMath.signNotZero(e.y));
      }
      return c.Cartesian3.normalize(e, e);
    }),
    (s.octDecode = function(t, o, n) {
      return s.octDecodeInRange(t, o, 255, n);
    }),
    (s.octDecodeFromCartesian4 = function(t, o) {
      var n = 256 * t.x + t.y,
        e = 256 * t.z + t.w;
      return s.octDecodeInRange(n, e, 65535, o);
    }),
    (s.octPackFloat = function(t) {
      return 256 * t.x + t.y;
    });
  var i = new c.Cartesian2();
  function M(t) {
    return (t >> 1) ^ -(1 & t);
  }
  (s.octEncodeFloat = function(t) {
    return s.octEncode(t, i), s.octPackFloat(i);
  }),
    (s.octDecodeFloat = function(t, o) {
      var n = t / 256,
        e = Math.floor(n),
        a = 256 * (n - e);
      return s.octDecode(e, a, o);
    }),
    (s.octPack = function(t, o, n, e) {
      var a = s.octEncodeFloat(t),
        r = s.octEncodeFloat(o),
        c = s.octEncode(n, i);
      return (e.x = 65536 * c.x + a), (e.y = 65536 * c.y + r), e;
    }),
    (s.octUnpack = function(t, o, n, e) {
      var a = t.x / 65536,
        r = Math.floor(a),
        c = 65536 * (a - r);
      a = t.y / 65536;
      var i = Math.floor(a),
        u = 65536 * (a - i);
      s.octDecodeFloat(c, o), s.octDecodeFloat(u, n), s.octDecode(r, i, e);
    }),
    (s.compressTextureCoordinates = function(t) {
      return 4096 * ((4095 * t.x) | 0) + ((4095 * t.y) | 0);
    }),
    (s.decompressTextureCoordinates = function(t, o) {
      var n = t / 4096,
        e = Math.floor(n);
      return (o.x = e / 4095), (o.y = (t - 4096 * e) / 4095), o;
    }),
    (s.zigZagDeltaDecode = function(t, o, n) {
      for (var e = t.length, a = 0, r = 0, c = 0, i = 0; i < e; ++i)
        (a += M(t[i])),
          (r += M(o[i])),
          (t[i] = a),
          (o[i] = r),
          u.defined(n) && ((c += M(n[i])), (n[i] = c));
    }),
    (t.AttributeCompression = s);
});
