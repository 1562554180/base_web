define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './freezeObject-4d675126',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './defineProperties-deb3db60',
  './Transforms-62d2509c',
  './WebGLConstants-deedc028',
], function(e, a, t, n, i, M, r, O, u) {
  'use strict';
  var o = n.freezeObject({ NONE: 0, TRIANGLES: 1, LINES: 2, POLYLINES: 3 });
  function v(e, t, n, r) {
    (this[0] = i.defaultValue(e, 0)),
      (this[1] = i.defaultValue(n, 0)),
      (this[2] = i.defaultValue(t, 0)),
      (this[3] = i.defaultValue(r, 0));
  }
  (v.packedLength = 4),
    (v.pack = function(e, t, n) {
      return (
        (n = i.defaultValue(n, 0)),
        (t[n++] = e[0]),
        (t[n++] = e[1]),
        (t[n++] = e[2]),
        (t[n++] = e[3]),
        t
      );
    }),
    (v.unpack = function(e, t, n) {
      return (
        (t = i.defaultValue(t, 0)),
        a.defined(n) || (n = new v()),
        (n[0] = e[t++]),
        (n[1] = e[t++]),
        (n[2] = e[t++]),
        (n[3] = e[t++]),
        n
      );
    }),
    (v.clone = function(e, t) {
      if (a.defined(e))
        return a.defined(t)
          ? ((t[0] = e[0]), (t[1] = e[1]), (t[2] = e[2]), (t[3] = e[3]), t)
          : new v(e[0], e[2], e[1], e[3]);
    }),
    (v.fromArray = function(e, t, n) {
      return (
        (t = i.defaultValue(t, 0)),
        a.defined(n) || (n = new v()),
        (n[0] = e[t]),
        (n[1] = e[t + 1]),
        (n[2] = e[t + 2]),
        (n[3] = e[t + 3]),
        n
      );
    }),
    (v.fromColumnMajorArray = function(e, t) {
      return v.clone(e, t);
    }),
    (v.fromRowMajorArray = function(e, t) {
      return a.defined(t)
        ? ((t[0] = e[0]), (t[1] = e[2]), (t[2] = e[1]), (t[3] = e[3]), t)
        : new v(e[0], e[1], e[2], e[3]);
    }),
    (v.fromScale = function(e, t) {
      return a.defined(t)
        ? ((t[0] = e.x), (t[1] = 0), (t[2] = 0), (t[3] = e.y), t)
        : new v(e.x, 0, 0, e.y);
    }),
    (v.fromUniformScale = function(e, t) {
      return a.defined(t) ? ((t[0] = e), (t[1] = 0), (t[2] = 0), (t[3] = e), t) : new v(e, 0, 0, e);
    }),
    (v.fromRotation = function(e, t) {
      var n = Math.cos(e),
        r = Math.sin(e);
      return a.defined(t)
        ? ((t[0] = n), (t[1] = r), (t[2] = -r), (t[3] = n), t)
        : new v(n, -r, r, n);
    }),
    (v.toArray = function(e, t) {
      return a.defined(t)
        ? ((t[0] = e[0]), (t[1] = e[1]), (t[2] = e[2]), (t[3] = e[3]), t)
        : [e[0], e[1], e[2], e[3]];
    }),
    (v.getElementIndex = function(e, t) {
      return 2 * e + t;
    }),
    (v.getColumn = function(e, t, n) {
      var r = 2 * t,
        a = e[r],
        i = e[1 + r];
      return (n.x = a), (n.y = i), n;
    }),
    (v.setColumn = function(e, t, n, r) {
      var a = 2 * t;
      return ((r = v.clone(e, r))[a] = n.x), (r[1 + a] = n.y), r;
    }),
    (v.getRow = function(e, t, n) {
      var r = e[t],
        a = e[t + 2];
      return (n.x = r), (n.y = a), n;
    }),
    (v.setRow = function(e, t, n, r) {
      return ((r = v.clone(e, r))[t] = n.x), (r[t + 2] = n.y), r;
    });
  var s = new M.Cartesian2();
  v.getScale = function(e, t) {
    return (
      (t.x = M.Cartesian2.magnitude(M.Cartesian2.fromElements(e[0], e[1], s))),
      (t.y = M.Cartesian2.magnitude(M.Cartesian2.fromElements(e[2], e[3], s))),
      t
    );
  };
  var f = new M.Cartesian2();
  (v.getMaximumScale = function(e) {
    return v.getScale(e, f), M.Cartesian2.maximumComponent(f);
  }),
    (v.multiply = function(e, t, n) {
      var r = e[0] * t[0] + e[2] * t[1],
        a = e[0] * t[2] + e[2] * t[3],
        i = e[1] * t[0] + e[3] * t[1],
        u = e[1] * t[2] + e[3] * t[3];
      return (n[0] = r), (n[1] = i), (n[2] = a), (n[3] = u), n;
    }),
    (v.add = function(e, t, n) {
      return (
        (n[0] = e[0] + t[0]), (n[1] = e[1] + t[1]), (n[2] = e[2] + t[2]), (n[3] = e[3] + t[3]), n
      );
    }),
    (v.subtract = function(e, t, n) {
      return (
        (n[0] = e[0] - t[0]), (n[1] = e[1] - t[1]), (n[2] = e[2] - t[2]), (n[3] = e[3] - t[3]), n
      );
    }),
    (v.multiplyByVector = function(e, t, n) {
      var r = e[0] * t.x + e[2] * t.y,
        a = e[1] * t.x + e[3] * t.y;
      return (n.x = r), (n.y = a), n;
    }),
    (v.multiplyByScalar = function(e, t, n) {
      return (n[0] = e[0] * t), (n[1] = e[1] * t), (n[2] = e[2] * t), (n[3] = e[3] * t), n;
    }),
    (v.multiplyByScale = function(e, t, n) {
      return (n[0] = e[0] * t.x), (n[1] = e[1] * t.x), (n[2] = e[2] * t.y), (n[3] = e[3] * t.y), n;
    }),
    (v.negate = function(e, t) {
      return (t[0] = -e[0]), (t[1] = -e[1]), (t[2] = -e[2]), (t[3] = -e[3]), t;
    }),
    (v.transpose = function(e, t) {
      var n = e[0],
        r = e[2],
        a = e[1],
        i = e[3];
      return (t[0] = n), (t[1] = r), (t[2] = a), (t[3] = i), t;
    }),
    (v.abs = function(e, t) {
      return (
        (t[0] = Math.abs(e[0])),
        (t[1] = Math.abs(e[1])),
        (t[2] = Math.abs(e[2])),
        (t[3] = Math.abs(e[3])),
        t
      );
    }),
    (v.equals = function(e, t) {
      return (
        e === t ||
        (a.defined(e) &&
          a.defined(t) &&
          e[0] === t[0] &&
          e[1] === t[1] &&
          e[2] === t[2] &&
          e[3] === t[3])
      );
    }),
    (v.equalsArray = function(e, t, n) {
      return e[0] === t[n] && e[1] === t[n + 1] && e[2] === t[n + 2] && e[3] === t[n + 3];
    }),
    (v.equalsEpsilon = function(e, t, n) {
      return (
        e === t ||
        (a.defined(e) &&
          a.defined(t) &&
          Math.abs(e[0] - t[0]) <= n &&
          Math.abs(e[1] - t[1]) <= n &&
          Math.abs(e[2] - t[2]) <= n &&
          Math.abs(e[3] - t[3]) <= n)
      );
    }),
    (v.IDENTITY = n.freezeObject(new v(1, 0, 0, 1))),
    (v.ZERO = n.freezeObject(new v(0, 0, 0, 0))),
    (v.COLUMN0ROW0 = 0),
    (v.COLUMN0ROW1 = 1),
    (v.COLUMN1ROW0 = 2),
    (v.COLUMN1ROW1 = 3),
    r.defineProperties(v.prototype, {
      length: {
        get: function() {
          return v.packedLength;
        },
      },
    }),
    (v.prototype.clone = function(e) {
      return v.clone(this, e);
    }),
    (v.prototype.equals = function(e) {
      return v.equals(this, e);
    }),
    (v.prototype.equalsEpsilon = function(e, t) {
      return v.equalsEpsilon(this, e, t);
    }),
    (v.prototype.toString = function() {
      return '(' + this[0] + ', ' + this[2] + ')\n(' + this[1] + ', ' + this[3] + ')';
    });
  var c = {
      POINTS: u.WebGLConstants.POINTS,
      LINES: u.WebGLConstants.LINES,
      LINE_LOOP: u.WebGLConstants.LINE_LOOP,
      LINE_STRIP: u.WebGLConstants.LINE_STRIP,
      TRIANGLES: u.WebGLConstants.TRIANGLES,
      TRIANGLE_STRIP: u.WebGLConstants.TRIANGLE_STRIP,
      TRIANGLE_FAN: u.WebGLConstants.TRIANGLE_FAN,
      validate: function(e) {
        return (
          e === c.POINTS ||
          e === c.LINES ||
          e === c.LINE_LOOP ||
          e === c.LINE_STRIP ||
          e === c.TRIANGLES ||
          e === c.TRIANGLE_STRIP ||
          e === c.TRIANGLE_FAN
        );
      },
    },
    l = n.freezeObject(c);
  function d(e) {
    (e = i.defaultValue(e, i.defaultValue.EMPTY_OBJECT)),
      (this.attributes = e.attributes),
      (this.indices = e.indices),
      (this.primitiveType = i.defaultValue(e.primitiveType, l.TRIANGLES)),
      (this.boundingSphere = e.boundingSphere),
      (this.geometryType = i.defaultValue(e.geometryType, o.NONE)),
      (this.boundingSphereCV = e.boundingSphereCV),
      (this.offsetAttribute = e.offsetAttribute);
  }
  d.computeNumberOfVertices = function(e) {
    var t = -1;
    for (var n in e.attributes)
      if (
        e.attributes.hasOwnProperty(n) &&
        a.defined(e.attributes[n]) &&
        a.defined(e.attributes[n].values)
      ) {
        var r = e.attributes[n];
        t = r.values.length / r.componentsPerAttribute;
      }
    return t;
  };
  var R = new M.Cartographic(),
    P = new M.Cartesian3(),
    V = new O.Matrix4(),
    G = [new M.Cartographic(), new M.Cartographic(), new M.Cartographic()],
    _ = [new M.Cartesian2(), new M.Cartesian2(), new M.Cartesian2()],
    W = [new M.Cartesian2(), new M.Cartesian2(), new M.Cartesian2()],
    B = new M.Cartesian3(),
    F = new O.Quaternion(),
    Y = new O.Matrix4(),
    j = new v();
  (d._textureCoordinateRotationPoints = function(e, t, n, r) {
    var a,
      i = M.Rectangle.center(r, R),
      u = M.Cartographic.toCartesian(i, n, P),
      o = O.Transforms.eastNorthUpToFixedFrame(u, n, V),
      s = O.Matrix4.inverse(o, V),
      f = _,
      c = G;
    (c[0].longitude = r.west),
      (c[0].latitude = r.south),
      (c[1].longitude = r.west),
      (c[1].latitude = r.north),
      (c[2].longitude = r.east),
      (c[2].latitude = r.south);
    var l = B;
    for (a = 0; a < 3; a++)
      M.Cartographic.toCartesian(c[a], n, l),
        (l = O.Matrix4.multiplyByPointAsVector(s, l, l)),
        (f[a].x = l.x),
        (f[a].y = l.y);
    var d = O.Quaternion.fromAxisAngle(M.Cartesian3.UNIT_Z, -t, F),
      y = O.Matrix3.fromQuaternion(d, Y),
      m = e.length,
      p = Number.POSITIVE_INFINITY,
      h = Number.POSITIVE_INFINITY,
      N = Number.NEGATIVE_INFINITY,
      I = Number.NEGATIVE_INFINITY;
    for (a = 0; a < m; a++)
      (l = O.Matrix4.multiplyByPointAsVector(s, e[a], l)),
        (l = O.Matrix3.multiplyByVector(y, l, l)),
        (p = Math.min(p, l.x)),
        (h = Math.min(h, l.y)),
        (N = Math.max(N, l.x)),
        (I = Math.max(I, l.y));
    var b = v.fromRotation(t, j),
      C = W;
    (C[0].x = p), (C[0].y = h), (C[1].x = p), (C[1].y = I), (C[2].x = N), (C[2].y = h);
    var T = f[0],
      E = f[2].x - T.x,
      x = f[1].y - T.y;
    for (a = 0; a < 3; a++) {
      var L = C[a];
      v.multiplyByVector(b, L, L), (L.x = (L.x - T.x) / E), (L.y = (L.y - T.y) / x);
    }
    var w = C[0],
      g = C[1],
      S = C[2],
      A = new Array(6);
    return M.Cartesian2.pack(w, A), M.Cartesian2.pack(g, A, 2), M.Cartesian2.pack(S, A, 4), A;
  }),
    (e.Geometry = d),
    (e.GeometryAttribute = function(e) {
      (e = i.defaultValue(e, i.defaultValue.EMPTY_OBJECT)),
        (this.componentDatatype = e.componentDatatype),
        (this.componentsPerAttribute = e.componentsPerAttribute),
        (this.normalize = i.defaultValue(e.normalize, !1)),
        (this.values = e.values);
    }),
    (e.GeometryType = o),
    (e.Matrix2 = v),
    (e.PrimitiveType = l);
});
