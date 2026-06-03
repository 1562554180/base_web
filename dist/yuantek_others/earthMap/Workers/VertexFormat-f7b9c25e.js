define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './freezeObject-4d675126',
  './defaultValue-5903a66b',
], function(e, o, t, n, a) {
  'use strict';
  function i(e) {
    (e = a.defaultValue(e, a.defaultValue.EMPTY_OBJECT)),
      (this.position = a.defaultValue(e.position, !1)),
      (this.normal = a.defaultValue(e.normal, !1)),
      (this.st = a.defaultValue(e.st, !1)),
      (this.bitangent = a.defaultValue(e.bitangent, !1)),
      (this.tangent = a.defaultValue(e.tangent, !1)),
      (this.color = a.defaultValue(e.color, !1));
  }
  (i.POSITION_ONLY = n.freezeObject(new i({ position: !0 }))),
    (i.POSITION_AND_NORMAL = n.freezeObject(new i({ position: !0, normal: !0 }))),
    (i.POSITION_NORMAL_AND_ST = n.freezeObject(new i({ position: !0, normal: !0, st: !0 }))),
    (i.POSITION_AND_ST = n.freezeObject(new i({ position: !0, st: !0 }))),
    (i.POSITION_AND_COLOR = n.freezeObject(new i({ position: !0, color: !0 }))),
    (i.ALL = n.freezeObject(
      new i({ position: !0, normal: !0, st: !0, tangent: !0, bitangent: !0 })
    )),
    (i.DEFAULT = i.POSITION_NORMAL_AND_ST),
    (i.packedLength = 6),
    (i.pack = function(e, t, n) {
      return (
        (n = a.defaultValue(n, 0)),
        (t[n++] = e.position ? 1 : 0),
        (t[n++] = e.normal ? 1 : 0),
        (t[n++] = e.st ? 1 : 0),
        (t[n++] = e.tangent ? 1 : 0),
        (t[n++] = e.bitangent ? 1 : 0),
        (t[n] = e.color ? 1 : 0),
        t
      );
    }),
    (i.unpack = function(e, t, n) {
      return (
        (t = a.defaultValue(t, 0)),
        o.defined(n) || (n = new i()),
        (n.position = 1 === e[t++]),
        (n.normal = 1 === e[t++]),
        (n.st = 1 === e[t++]),
        (n.tangent = 1 === e[t++]),
        (n.bitangent = 1 === e[t++]),
        (n.color = 1 === e[t]),
        n
      );
    }),
    (i.clone = function(e, t) {
      if (o.defined(e))
        return (
          o.defined(t) || (t = new i()),
          (t.position = e.position),
          (t.normal = e.normal),
          (t.st = e.st),
          (t.tangent = e.tangent),
          (t.bitangent = e.bitangent),
          (t.color = e.color),
          t
        );
    }),
    (e.VertexFormat = i);
});
