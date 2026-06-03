define([
  './defined-30a32f90',
  './Math-fbd31710',
  './freezeObject-4d675126',
  './defaultValue-5903a66b',
  './Cartesian2-06dac25b',
  './defineProperties-deb3db60',
  './Transforms-62d2509c',
  './RuntimeError-98ac9e82',
  './WebGLConstants-deedc028',
  './ComponentDatatype-30a05127',
  './GeometryAttribute-b6f01f29',
  './when-1faa3867',
  './EncodedCartesian3-b7dd761a',
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './WebMercatorProjection-07b55356',
  './arrayRemoveDuplicates-7ced389a',
  './ArcType-e3f6a1cc',
  './EllipsoidRhumbLine-62acd3ce',
  './EllipsoidGeodesic-edb379ae',
], function(V, ze, e, h, He, a, Ve, t, n, Ge, je, r, Ye, G, i, s, j, Y, F, E) {
  'use strict';
  function o(e) {
    (e = h.defaultValue(e, h.defaultValue.EMPTY_OBJECT)),
      (this._ellipsoid = h.defaultValue(e.ellipsoid, He.Ellipsoid.WGS84)),
      (this._rectangle = h.defaultValue(e.rectangle, He.Rectangle.MAX_VALUE)),
      (this._projection = new Ve.GeographicProjection(this._ellipsoid)),
      (this._numberOfLevelZeroTilesX = h.defaultValue(e.numberOfLevelZeroTilesX, 2)),
      (this._numberOfLevelZeroTilesY = h.defaultValue(e.numberOfLevelZeroTilesY, 1)),
      (this._numberOfLevelZeroTiles =
        this._numberOfLevelZeroTilesX * this._numberOfLevelZeroTilesY);
  }
  a.defineProperties(o.prototype, {
    ellipsoid: {
      get: function() {
        return this._ellipsoid;
      },
    },
    rectangle: {
      get: function() {
        return this._rectangle;
      },
    },
    projection: {
      get: function() {
        return this._projection;
      },
    },
  }),
    (o.prototype.getNumberOfXTilesAtLevel = function(e) {
      return this._numberOfLevelZeroTilesX << e;
    }),
    (o.prototype.getNumberOfYTilesAtLevel = function(e) {
      return 1 === this._numberOfLevelZeroTiles
        ? this._numberOfLevelZeroTilesY << (0 < e ? e - 1 : 0)
        : this._numberOfLevelZeroTilesY << e;
    }),
    (o.prototype.rectangleToNativeRectangle = function(e, a) {
      var t = ze.BMMath.toDegrees(e.west),
        n = ze.BMMath.toDegrees(e.south),
        r = ze.BMMath.toDegrees(e.east),
        i = ze.BMMath.toDegrees(e.north);
      return V.defined(a)
        ? ((a.west = t), (a.south = n), (a.east = r), (a.north = i), a)
        : new He.Rectangle(t, n, r, i);
    }),
    (o.prototype.tileXYToNativeRectangle = function(e, a, t, n) {
      var r = this.tileXYToRectangle(e, a, t, n);
      return (
        (r.west = ze.BMMath.toDegrees(r.west)),
        (r.south = ze.BMMath.toDegrees(r.south)),
        (r.east = ze.BMMath.toDegrees(r.east)),
        (r.north = ze.BMMath.toDegrees(r.north)),
        r
      );
    }),
    (o.prototype.tileXYToRectangle = function(e, a, t, n) {
      var r = this._rectangle,
        i = this.getNumberOfXTilesAtLevel(t),
        s = this.getNumberOfYTilesAtLevel(t),
        o = r.width / i,
        l = e * o + r.west,
        u = (e + 1) * o + r.west,
        c = r.height / s,
        d = r.north - a * c,
        p = r.north - (a + 1) * c;
      return (
        V.defined(n) || (n = new He.Rectangle(l, p, u, d)),
        (n.west = l),
        (n.south = p),
        (n.east = u),
        (n.north = d),
        n
      );
    }),
    (o.prototype.positionToTileXY = function(e, a, t) {
      var n = this._rectangle;
      if (He.Rectangle.contains(n, e)) {
        var r = this.getNumberOfXTilesAtLevel(a),
          i = this.getNumberOfYTilesAtLevel(a),
          s = n.width / r,
          o = n.height / i,
          l = e.longitude;
        n.east < n.west && (l += ze.BMMath.TWO_PI);
        var u = ((l - n.west) / s) | 0;
        r <= u && (u = r - 1);
        var c = ((n.north - e.latitude) / o) | 0;
        return (
          i <= c && (c = i - 1), V.defined(t) ? ((t.x = u), (t.y = c), t) : new He.Cartesian2(u, c)
        );
      }
    });
  var u = new He.Cartesian3(),
    c = new He.Cartesian3(),
    d = new He.Cartographic(),
    p = new He.Cartesian3(),
    C = new He.Cartesian3(),
    l = new Ve.BoundingSphere(),
    g = new o(),
    f = [
      new He.Cartographic(),
      new He.Cartographic(),
      new He.Cartographic(),
      new He.Cartographic(),
    ],
    v = new He.Cartesian2(),
    Fe = {};
  function M(e) {
    He.Cartographic.fromRadians(e.east, e.north, 0, f[0]),
      He.Cartographic.fromRadians(e.west, e.north, 0, f[1]),
      He.Cartographic.fromRadians(e.east, e.south, 0, f[2]),
      He.Cartographic.fromRadians(e.west, e.south, 0, f[3]);
    var a,
      t = 0,
      n = 0,
      r = 0,
      i = 0,
      s = Fe._terrainHeightsMaxLevel;
    for (a = 0; a <= s; ++a) {
      for (var o = !1, l = 0; l < 4; ++l) {
        var u = f[l];
        if ((g.positionToTileXY(u, a, v), 0 === l)) (r = v.x), (i = v.y);
        else if (r !== v.x || i !== v.y) {
          o = !0;
          break;
        }
      }
      if (o) break;
      (t = r), (n = i);
    }
    if (0 !== a) return { x: t, y: n, level: s < a ? s : a - 1 };
  }
  (Fe.initialize = function() {
    var e = Fe._initPromise;
    return V.defined(e)
      ? e
      : ((e = Ve.Resource.fetchJson(
          Ve.buildModuleUrl('Assets/approximateTerrainHeights.json')
        ).then(function(e) {
          Fe._terrainHeights = e;
        })),
        (Fe._initPromise = e));
  }),
    (Fe.getMinimumMaximumHeights = function(e, a) {
      a = h.defaultValue(a, He.Ellipsoid.WGS84);
      var t = M(e),
        n = Fe._defaultMinTerrainHeight,
        r = Fe._defaultMaxTerrainHeight;
      if (V.defined(t)) {
        var i = t.level + '-' + t.x + '-' + t.y,
          s = Fe._terrainHeights[i];
        V.defined(s) && ((n = s[0]), (r = s[1])),
          a.cartographicToCartesian(He.Rectangle.northeast(e, d), u),
          a.cartographicToCartesian(He.Rectangle.southwest(e, d), c),
          He.Cartesian3.midpoint(c, u, p);
        var o = a.scaleToGeodeticSurface(p, C);
        if (V.defined(o)) {
          var l = He.Cartesian3.distance(p, o);
          n = Math.min(n, -l);
        } else n = Fe._defaultMinTerrainHeight;
      }
      return {
        minimumTerrainHeight: (n = Math.max(Fe._defaultMinTerrainHeight, n)),
        maximumTerrainHeight: r,
      };
    }),
    (Fe.getBoundingSphere = function(e, a) {
      a = h.defaultValue(a, He.Ellipsoid.WGS84);
      var t = M(e),
        n = Fe._defaultMaxTerrainHeight;
      if (V.defined(t)) {
        var r = t.level + '-' + t.x + '-' + t.y,
          i = Fe._terrainHeights[r];
        V.defined(i) && (n = i[1]);
      }
      var s = Ve.BoundingSphere.fromRectangle3D(e, a, 0);
      return Ve.BoundingSphere.fromRectangle3D(e, a, n, l), Ve.BoundingSphere.union(s, l, s);
    }),
    (Fe._terrainHeightsMaxLevel = 6),
    (Fe._defaultMaxTerrainHeight = 9e3),
    (Fe._defaultMinTerrainHeight = -1e5),
    (Fe._terrainHeights = void 0),
    (Fe._initPromise = void 0),
    a.defineProperties(Fe, {
      initialized: {
        get: function() {
          return V.defined(Fe._terrainHeights);
        },
      },
    });
  var X = [Ve.GeographicProjection, s.WebMercatorProjection],
    w = X.length,
    Xe = Math.cos(ze.BMMath.toRadians(30)),
    m = Math.cos(ze.BMMath.toRadians(150)),
    Z = 0,
    q = 1e3;
  function y(e) {
    var a = (e = h.defaultValue(e, h.defaultValue.EMPTY_OBJECT)).positions;
    (this.width = h.defaultValue(e.width, 1)),
      (this._positions = a),
      (this.granularity = h.defaultValue(e.granularity, 9999)),
      (this.loop = h.defaultValue(e.loop, !1)),
      (this.arcType = h.defaultValue(e.arcType, Y.ArcType.GEODESIC)),
      (this._ellipsoid = He.Ellipsoid.WGS84),
      (this._projectionIndex = 0),
      (this._workerName = 'createGroundPolylineGeometry'),
      (this._scene3DOnly = !1);
  }
  a.defineProperties(y.prototype, {
    packedLength: {
      get: function() {
        return 1 + 3 * this._positions.length + 1 + 1 + 1 + He.Ellipsoid.packedLength + 1 + 1;
      },
    },
  }),
    (y.setProjectionAndEllipsoid = function(e, a) {
      for (var t = 0, n = 0; n < w; n++)
        if (a instanceof X[n]) {
          t = n;
          break;
        }
      (e._projectionIndex = t), (e._ellipsoid = a.ellipsoid);
    });
  var T = new He.Cartesian3(),
    _ = new He.Cartesian3(),
    B = new He.Cartesian3();
  function W(e, a, t, n, r) {
    var i = J(n, e, 0, T),
      s = J(n, e, t, _),
      o = J(n, a, 0, B),
      l = Ze(s, i, _),
      u = Ze(o, i, B);
    return He.Cartesian3.cross(u, l, r), He.Cartesian3.normalize(r, r);
  }
  var O = new He.Cartographic(),
    b = new He.Cartesian3(),
    L = new He.Cartesian3(),
    P = new He.Cartesian3();
  function U(e, a, t, n, r, i, s, o, l, u, c) {
    if (0 !== r) {
      var d;
      i === Y.ArcType.GEODESIC
        ? (d = new E.EllipsoidGeodesic(e, a, s))
        : i === Y.ArcType.RHUMB && (d = new F.EllipsoidRhumbLine(e, a, s));
      var p = d.surfaceDistance;
      if (!(p < r))
        for (
          var h = W(e, a, n, s, P),
            C = Math.ceil(p / r),
            g = p / C,
            f = g,
            v = C - 1,
            M = o.length,
            w = 0;
          w < v;
          w++
        ) {
          var m = d.interpolateUsingSurfaceDistance(f, O),
            y = J(s, m, t, b),
            T = J(s, m, n, L);
          He.Cartesian3.pack(h, o, M),
            He.Cartesian3.pack(y, l, M),
            He.Cartesian3.pack(T, u, M),
            c.push(m.latitude),
            c.push(m.longitude),
            (M += 3),
            (f += g);
        }
    }
  }
  var A = new He.Cartographic();
  function J(e, a, t, n) {
    return He.Cartographic.clone(a, A), (A.height = t), He.Cartographic.toCartesian(A, e, n);
  }
  function Ze(e, a, t) {
    return He.Cartesian3.subtract(e, a, t), He.Cartesian3.normalize(t, t), t;
  }
  function k(e, a, t, n) {
    return (
      (n = Ze(e, a, n)),
      (n = He.Cartesian3.cross(n, t, n)),
      (n = He.Cartesian3.normalize(n, n)),
      (n = He.Cartesian3.cross(t, n, n))
    );
  }
  (y.pack = function(e, a, t) {
    var n = h.defaultValue(t, 0),
      r = e._positions,
      i = r.length;
    a[n++] = i;
    for (var s = 0; s < i; ++s) {
      var o = r[s];
      He.Cartesian3.pack(o, a, n), (n += 3);
    }
    return (
      (a[n++] = e.granularity),
      (a[n++] = e.loop ? 1 : 0),
      (a[n++] = e.arcType),
      He.Ellipsoid.pack(e._ellipsoid, a, n),
      (n += He.Ellipsoid.packedLength),
      (a[n++] = e._projectionIndex),
      (a[n++] = e._scene3DOnly ? 1 : 0),
      a
    );
  }),
    (y.unpack = function(e, a, t) {
      for (var n = h.defaultValue(a, 0), r = e[n++], i = new Array(r), s = 0; s < r; s++)
        (i[s] = He.Cartesian3.unpack(e, n)), (n += 3);
      var o = e[n++],
        l = 1 === e[n++],
        u = e[n++],
        c = He.Ellipsoid.unpack(e, n);
      n += He.Ellipsoid.packedLength;
      var d = e[n++],
        p = 1 === e[n++];
      return (
        V.defined(t) || (t = new y({ positions: i })),
        (t._positions = i),
        (t.granularity = o),
        (t.loop = l),
        (t.arcType = u),
        (t._ellipsoid = c),
        (t._projectionIndex = d),
        (t._scene3DOnly = p),
        t
      );
    });
  var S = new He.Cartesian3(),
    I = new He.Cartesian3(),
    x = new He.Cartesian3(),
    N = new He.Cartesian3();
  function Q(e, a, t, n, r) {
    var i = Ze(t, a, N),
      s = k(e, a, i, S),
      o = k(n, a, i, I);
    if (ze.BMMath.equalsEpsilon(He.Cartesian3.dot(s, o), -1, ze.BMMath.EPSILON5))
      return (r = He.Cartesian3.cross(i, s, r)), (r = He.Cartesian3.normalize(r, r));
    (r = He.Cartesian3.add(o, s, r)), (r = He.Cartesian3.normalize(r, r));
    var l = He.Cartesian3.cross(i, r, x);
    return He.Cartesian3.dot(o, l) < 0 && (r = He.Cartesian3.negate(r, r)), r;
  }
  var K = i.Plane.fromPointNormal(He.Cartesian3.ZERO, He.Cartesian3.UNIT_Y),
    $ = new He.Cartesian3(),
    ee = new He.Cartesian3(),
    ae = new He.Cartesian3(),
    te = new He.Cartesian3(),
    ne = new He.Cartesian3(),
    re = new He.Cartesian3(),
    ie = new He.Cartographic(),
    se = new He.Cartographic(),
    oe = new He.Cartographic();
  y.createGeometry = function(e) {
    var a,
      t,
      n,
      r,
      i,
      s,
      o = !e._scene3DOnly,
      l = e.loop,
      u = e._ellipsoid,
      c = e.granularity,
      d = e.arcType,
      p = new X[e._projectionIndex](u),
      h = Z,
      C = q,
      g = e._positions,
      f = g.length;
    2 === f && (l = !1);
    var v,
      M,
      w,
      m = new F.EllipsoidRhumbLine(void 0, void 0, u),
      y = [g[0]];
    for (t = 0; t < f - 1; t++)
      (n = g[t]),
        (r = g[t + 1]),
        (v = G.IntersectionTests.lineSegmentPlane(n, r, K, re)),
        !V.defined(v) ||
          He.Cartesian3.equalsEpsilon(v, n, ze.BMMath.EPSILON7) ||
          He.Cartesian3.equalsEpsilon(v, r, ze.BMMath.EPSILON7) ||
          (e.arcType === Y.ArcType.GEODESIC
            ? y.push(He.Cartesian3.clone(v))
            : e.arcType === Y.ArcType.RHUMB &&
              ((w = u.cartesianToCartographic(v, ie).longitude),
              (i = u.cartesianToCartographic(n, ie)),
              (s = u.cartesianToCartographic(r, se)),
              m.setEndPoints(i, s),
              (M = m.findIntersectionWithLongitude(w, oe)),
              (v = u.cartographicToCartesian(M, re)),
              !V.defined(v) ||
                He.Cartesian3.equalsEpsilon(v, n, ze.BMMath.EPSILON7) ||
                He.Cartesian3.equalsEpsilon(v, r, ze.BMMath.EPSILON7) ||
                y.push(He.Cartesian3.clone(v)))),
        y.push(r);
    l &&
      ((n = g[f - 1]),
      (r = g[0]),
      (v = G.IntersectionTests.lineSegmentPlane(n, r, K, re)),
      !V.defined(v) ||
        He.Cartesian3.equalsEpsilon(v, n, ze.BMMath.EPSILON7) ||
        He.Cartesian3.equalsEpsilon(v, r, ze.BMMath.EPSILON7) ||
        (e.arcType === Y.ArcType.GEODESIC
          ? y.push(He.Cartesian3.clone(v))
          : e.arcType === Y.ArcType.RHUMB &&
            ((w = u.cartesianToCartographic(v, ie).longitude),
            (i = u.cartesianToCartographic(n, ie)),
            (s = u.cartesianToCartographic(r, se)),
            m.setEndPoints(i, s),
            (M = m.findIntersectionWithLongitude(w, oe)),
            (v = u.cartographicToCartesian(M, re)),
            !V.defined(v) ||
              He.Cartesian3.equalsEpsilon(v, n, ze.BMMath.EPSILON7) ||
              He.Cartesian3.equalsEpsilon(v, r, ze.BMMath.EPSILON7) ||
              y.push(He.Cartesian3.clone(v)))));
    var T = y.length,
      E = new Array(T);
    for (t = 0; t < T; t++) {
      var _ = He.Cartographic.fromCartesian(y[t], u);
      (_.height = 0), (E[t] = _);
    }
    if (!((T = (E = j.arrayRemoveDuplicates(E, He.Cartographic.equalsEpsilon)).length) < 2)) {
      var B = [],
        O = [],
        b = [],
        L = [],
        P = $,
        A = ee,
        k = ae,
        S = te,
        I = ne,
        x = E[0],
        N = E[1];
      for (
        P = J(u, E[T - 1], h, P),
          S = J(u, N, h, S),
          A = J(u, x, h, A),
          k = J(u, x, C, k),
          I = l ? Q(P, A, k, S, I) : W(x, N, C, u, I),
          He.Cartesian3.pack(I, O, 0),
          He.Cartesian3.pack(A, b, 0),
          He.Cartesian3.pack(k, L, 0),
          B.push(x.latitude),
          B.push(x.longitude),
          U(x, N, h, C, c, d, u, O, b, L, B),
          t = 1;
        t < T - 1;
        ++t
      ) {
        (P = He.Cartesian3.clone(A, P)), (A = He.Cartesian3.clone(S, A));
        var R = E[t];
        J(u, R, C, k),
          J(u, E[t + 1], h, S),
          Q(P, A, k, S, I),
          (a = O.length),
          He.Cartesian3.pack(I, O, a),
          He.Cartesian3.pack(A, b, a),
          He.Cartesian3.pack(k, L, a),
          B.push(R.latitude),
          B.push(R.longitude),
          U(E[t], E[t + 1], h, C, c, d, u, O, b, L, B);
      }
      var D = E[T - 1],
        z = E[T - 2];
      if (((A = J(u, D, h, A)), (k = J(u, D, C, k)), l)) {
        var H = E[0];
        I = Q((P = J(u, z, h, P)), A, k, (S = J(u, H, h, S)), I);
      } else I = W(z, D, C, u, I);
      if (
        ((a = O.length),
        He.Cartesian3.pack(I, O, a),
        He.Cartesian3.pack(A, b, a),
        He.Cartesian3.pack(k, L, a),
        B.push(D.latitude),
        B.push(D.longitude),
        l)
      ) {
        for (U(D, x, h, C, c, d, u, O, b, L, B), a = O.length, t = 0; t < 3; ++t)
          (O[a + t] = O[t]), (b[a + t] = b[t]), (L[a + t] = L[t]);
        B.push(x.latitude), B.push(x.longitude);
      }
      return (function(e, a, t, n, r, i, s) {
        var o,
          l,
          u,
          c,
          d,
          p,
          h = a._ellipsoid,
          C = t.length / 3 - 1,
          g = 8 * C,
          f = 4 * g,
          v = 36 * C,
          M = 65535 < g ? new Uint32Array(v) : new Uint16Array(v),
          w = new Float64Array(3 * g),
          m = new Float32Array(f),
          y = new Float32Array(f),
          T = new Float32Array(f),
          E = new Float32Array(f),
          _ = new Float32Array(f);
        s &&
          ((u = new Float32Array(f)),
          (c = new Float32Array(f)),
          (d = new Float32Array(f)),
          (p = new Float32Array(2 * g)));
        var B = i.length / 2,
          O = 0,
          b = Ke;
        b.height = 0;
        var L = $e;
        L.height = 0;
        var P = ea,
          A = aa;
        if (s)
          for (l = 0, o = 1; o < B; o++)
            (b.latitude = i[l]),
              (b.longitude = i[l + 1]),
              (L.latitude = i[l + 2]),
              (L.longitude = i[l + 3]),
              (P = a.project(b, P)),
              (A = a.project(L, A)),
              (O += He.Cartesian3.distance(P, A)),
              (l += 2);
        var k = n.length / 3;
        A = He.Cartesian3.unpack(n, 0, A);
        var S,
          I = 0;
        for (l = 3, o = 1; o < k; o++)
          (P = He.Cartesian3.clone(A, P)),
            (A = He.Cartesian3.unpack(n, l, A)),
            (I += He.Cartesian3.distance(P, A)),
            (l += 3);
        l = 3;
        var x = 0,
          N = 0,
          R = 0,
          D = 0,
          z = !1,
          H = He.Cartesian3.unpack(t, 0, na),
          V = He.Cartesian3.unpack(n, 0, aa),
          G = He.Cartesian3.unpack(r, 0, ia);
        if (e) {
          var j = He.Cartesian3.unpack(t, t.length - 6, ta);
          qe(G, j, H, V) && (G = He.Cartesian3.negate(G, G));
        }
        var Y = 0,
          F = 0,
          X = 0;
        for (o = 0; o < C; o++) {
          var Z,
            q,
            W,
            U,
            J = He.Cartesian3.clone(H, ta),
            Q = He.Cartesian3.clone(V, ea),
            K = He.Cartesian3.clone(G, ra);
          if (
            (z && (K = He.Cartesian3.negate(K, K)),
            (H = He.Cartesian3.unpack(t, l, na)),
            (V = He.Cartesian3.unpack(n, l, aa)),
            (G = He.Cartesian3.unpack(r, l, ia)),
            (z = qe(G, J, H, V)),
            (b.latitude = i[x]),
            (b.longitude = i[x + 1]),
            (L.latitude = i[x + 2]),
            (L.longitude = i[x + 3]),
            s)
          ) {
            var $ = Qe(b, L);
            Z = a.project(b, pa);
            var ee = Ze((q = a.project(L, ha)), Z, _a);
            (ee.y = Math.abs(ee.y)),
              (W = Ca),
              (U = ga),
              0 === $ || He.Cartesian3.dot(ee, He.Cartesian3.UNIT_Y) > Xe
                ? ((W = We(a, b, K, Z, Ca)), (U = We(a, L, G, q, ga)))
                : 1 === $
                  ? ((U = We(a, L, G, q, ga)),
                    (W.x = 0),
                    (W.y = ze.BMMath.sign(b.longitude - Math.abs(L.longitude))),
                    (W.z = 0))
                  : ((W = We(a, b, K, Z, Ca)),
                    (U.x = 0),
                    (U.y = ze.BMMath.sign(b.longitude - L.longitude)),
                    (U.z = 0));
          }
          var ae = He.Cartesian3.distance(Q, V),
            te = Ye.EncodedCartesian3.fromCartesian(J, Ta),
            ne = He.Cartesian3.subtract(H, J, fa),
            re = He.Cartesian3.normalize(ne, wa),
            ie = He.Cartesian3.subtract(Q, J, va);
          ie = He.Cartesian3.normalize(ie, ie);
          var se = He.Cartesian3.cross(re, ie, wa);
          se = He.Cartesian3.normalize(se, se);
          var oe = He.Cartesian3.cross(ie, K, ma);
          oe = He.Cartesian3.normalize(oe, oe);
          var le = He.Cartesian3.subtract(V, H, Ma);
          le = He.Cartesian3.normalize(le, le);
          var ue = He.Cartesian3.cross(G, le, ya);
          ue = He.Cartesian3.normalize(ue, ue);
          var ce,
            de,
            pe,
            he = ae / I,
            Ce = Y / I,
            ge = 0,
            fe = 0,
            ve = 0;
          if (s) {
            (ge = He.Cartesian3.distance(Z, q)),
              (ce = Ye.EncodedCartesian3.fromCartesian(Z, Ea)),
              (de = He.Cartesian3.subtract(q, Z, _a));
            var Me = (pe = He.Cartesian3.normalize(de, Ba)).x;
            (pe.x = pe.y), (pe.y = -Me), (fe = ge / O), (ve = F / O);
          }
          for (S = 0; S < 8; S++) {
            var we = D + 4 * S,
              me = N + 2 * S,
              ye = we + 3,
              Te = S < 4 ? 1 : -1,
              Ee = 2 === S || 3 === S || 6 === S || 7 === S ? 1 : -1;
            He.Cartesian3.pack(te.high, m, we),
              (m[ye] = ne.x),
              He.Cartesian3.pack(te.low, y, we),
              (y[ye] = ne.y),
              He.Cartesian3.pack(oe, T, we),
              (T[ye] = ne.z),
              He.Cartesian3.pack(ue, E, we),
              (E[ye] = he * Te),
              He.Cartesian3.pack(se, _, we);
            var _e = Ce * Ee;
            0 === _e && Ee < 0 && (_e = 9),
              (_[ye] = _e),
              s &&
                ((u[we] = ce.high.x),
                (u[we + 1] = ce.high.y),
                (u[we + 2] = ce.low.x),
                (u[we + 3] = ce.low.y),
                (d[we] = -W.y),
                (d[we + 1] = W.x),
                (d[we + 2] = U.y),
                (d[we + 3] = -U.x),
                (c[we] = de.x),
                (c[we + 1] = de.y),
                (c[we + 2] = pe.x),
                (c[we + 3] = pe.y),
                (p[me] = fe * Te),
                0 === (_e = ve * Ee) && Ee < 0 && (_e = 9),
                (p[me + 1] = _e));
          }
          var Be = ca,
            Oe = da,
            be = la,
            Le = ua,
            Pe = He.Rectangle.fromCartographicArray(sa, oa),
            Ae = Fe.getMinimumMaximumHeights(Pe, h),
            ke = Ae.minimumTerrainHeight,
            Se = Ae.maximumTerrainHeight;
          (X += ke), (X += Se), Ue(J, Q, ke, Se, Be, be), Ue(H, V, ke, Se, Oe, Le);
          var Ie = He.Cartesian3.multiplyByScalar(se, ze.BMMath.EPSILON5, Oa);
          He.Cartesian3.add(Be, Ie, Be),
            He.Cartesian3.add(Oe, Ie, Oe),
            He.Cartesian3.add(be, Ie, be),
            He.Cartesian3.add(Le, Ie, Le),
            Je(Be, Oe),
            Je(be, Le),
            He.Cartesian3.pack(Be, w, R),
            He.Cartesian3.pack(Oe, w, R + 3),
            He.Cartesian3.pack(Le, w, R + 6),
            He.Cartesian3.pack(be, w, R + 9),
            (Ie = He.Cartesian3.multiplyByScalar(se, -2 * ze.BMMath.EPSILON5, Oa)),
            He.Cartesian3.add(Be, Ie, Be),
            He.Cartesian3.add(Oe, Ie, Oe),
            He.Cartesian3.add(be, Ie, be),
            He.Cartesian3.add(Le, Ie, Le),
            Je(Be, Oe),
            Je(be, Le),
            He.Cartesian3.pack(Be, w, R + 12),
            He.Cartesian3.pack(Oe, w, R + 15),
            He.Cartesian3.pack(Le, w, R + 18),
            He.Cartesian3.pack(be, w, R + 21),
            (x += 2),
            (l += 3),
            (N += 16),
            (R += 24),
            (D += 32),
            (Y += ae),
            (F += ge);
        }
        var xe = (l = 0);
        for (o = 0; o < C; o++) {
          for (S = 0; S < Pa; S++) M[l + S] = La[S] + xe;
          (xe += 8), (l += Pa);
        }
        var Ne = ba;
        Ve.BoundingSphere.fromVertices(t, He.Cartesian3.ZERO, 3, Ne[0]),
          Ve.BoundingSphere.fromVertices(n, He.Cartesian3.ZERO, 3, Ne[1]);
        var Re = Ve.BoundingSphere.fromBoundingSpheres(Ne);
        Re.radius += X / (2 * C);
        var De = {
          position: new je.GeometryAttribute({
            componentDatatype: Ge.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            normalize: !1,
            values: w,
          }),
          startHiAndForwardOffsetX: Aa(m),
          startLoAndForwardOffsetY: Aa(y),
          startNormalAndForwardOffsetZ: Aa(T),
          endNormalAndTextureCoordinateNormalizationX: Aa(E),
          rightNormalAndTextureCoordinateNormalizationY: Aa(_),
        };
        s &&
          ((De.startHiLo2D = Aa(u)),
          (De.offsetAndRight2D = Aa(c)),
          (De.startEndNormals2D = Aa(d)),
          (De.texcoordNormalization2D = new je.GeometryAttribute({
            componentDatatype: Ge.ComponentDatatype.FLOAT,
            componentsPerAttribute: 2,
            normalize: !1,
            values: p,
          })));
        return new je.Geometry({ attributes: De, indices: M, boundingSphere: Re });
      })(l, p, b, L, O, B, o);
    }
  };
  var R = new He.Cartesian3(),
    D = new Ve.Matrix3(),
    z = new Ve.Quaternion();
  function qe(e, a, t, n) {
    var r = Ze(t, a, R),
      i = He.Cartesian3.dot(r, e);
    if (Xe < i || i < m) {
      var s = Ze(n, t, N),
        o = i < m ? ze.BMMath.PI_OVER_TWO : -ze.BMMath.PI_OVER_TWO,
        l = Ve.Quaternion.fromAxisAngle(s, o, z),
        u = Ve.Matrix3.fromQuaternion(l, D);
      return Ve.Matrix3.multiplyByVector(u, e, e), !0;
    }
    return !1;
  }
  var H = new He.Cartographic(),
    le = new He.Cartesian3(),
    ue = new He.Cartesian3();
  function We(e, a, t, n, r) {
    var i = He.Cartographic.toCartesian(a, e._ellipsoid, le),
      s = He.Cartesian3.add(i, t, ue),
      o = !1,
      l = e._ellipsoid,
      u = l.cartesianToCartographic(s, H);
    Math.abs(a.longitude - u.longitude) > ze.BMMath.PI_OVER_TWO &&
      ((o = !0), (s = He.Cartesian3.subtract(i, t, ue)), (u = l.cartesianToCartographic(s, H))),
      (u.height = 0);
    var c = e.project(u, r);
    return (
      ((r = He.Cartesian3.subtract(c, n, r)).z = 0),
      (r = He.Cartesian3.normalize(r, r)),
      o && He.Cartesian3.negate(r, r),
      r
    );
  }
  var ce = new He.Cartesian3(),
    de = new He.Cartesian3();
  function Ue(e, a, t, n, r, i) {
    var s = He.Cartesian3.subtract(a, e, ce);
    He.Cartesian3.normalize(s, s);
    var o = t - Z,
      l = He.Cartesian3.multiplyByScalar(s, o, de);
    He.Cartesian3.add(e, l, r);
    var u = n - q;
    (l = He.Cartesian3.multiplyByScalar(s, u, de)), He.Cartesian3.add(a, l, i);
  }
  var pe = new He.Cartesian3();
  function Je(e, a) {
    var t = i.Plane.getPointDistance(K, e),
      n = i.Plane.getPointDistance(K, a),
      r = pe;
    ze.BMMath.equalsEpsilon(t, 0, ze.BMMath.EPSILON2)
      ? ((r = Ze(a, e, r)),
        He.Cartesian3.multiplyByScalar(r, ze.BMMath.EPSILON2, r),
        He.Cartesian3.add(e, r, e))
      : ze.BMMath.equalsEpsilon(n, 0, ze.BMMath.EPSILON2) &&
        ((r = Ze(e, a, r)),
        He.Cartesian3.multiplyByScalar(r, ze.BMMath.EPSILON2, r),
        He.Cartesian3.add(a, r, a));
  }
  function Qe(e, a) {
    var t = Math.abs(e.longitude),
      n = Math.abs(a.longitude);
    if (ze.BMMath.equalsEpsilon(t, ze.BMMath.PI, ze.BMMath.EPSILON11)) {
      var r = ze.BMMath.sign(a.longitude);
      return (e.longitude = r * (t - ze.BMMath.EPSILON11)), 1;
    }
    if (ze.BMMath.equalsEpsilon(n, ze.BMMath.PI, ze.BMMath.EPSILON11)) {
      var i = ze.BMMath.sign(e.longitude);
      return (a.longitude = i * (n - ze.BMMath.EPSILON11)), 2;
    }
    return 0;
  }
  var Ke = new He.Cartographic(),
    $e = new He.Cartographic(),
    ea = new He.Cartesian3(),
    aa = new He.Cartesian3(),
    ta = new He.Cartesian3(),
    na = new He.Cartesian3(),
    ra = new He.Cartesian3(),
    ia = new He.Cartesian3(),
    sa = [Ke, $e],
    oa = new He.Rectangle(),
    la = new He.Cartesian3(),
    ua = new He.Cartesian3(),
    ca = new He.Cartesian3(),
    da = new He.Cartesian3(),
    pa = new He.Cartesian3(),
    ha = new He.Cartesian3(),
    Ca = new He.Cartesian3(),
    ga = new He.Cartesian3(),
    fa = new He.Cartesian3(),
    va = new He.Cartesian3(),
    Ma = new He.Cartesian3(),
    wa = new He.Cartesian3(),
    ma = new He.Cartesian3(),
    ya = new He.Cartesian3(),
    Ta = new Ye.EncodedCartesian3(),
    Ea = new Ye.EncodedCartesian3(),
    _a = new He.Cartesian3(),
    Ba = new He.Cartesian3(),
    Oa = new He.Cartesian3(),
    ba = [new Ve.BoundingSphere(), new Ve.BoundingSphere()],
    La = [
      0,
      2,
      1,
      0,
      3,
      2,
      0,
      7,
      3,
      0,
      4,
      7,
      0,
      5,
      4,
      0,
      1,
      5,
      5,
      7,
      4,
      5,
      6,
      7,
      5,
      2,
      6,
      5,
      1,
      2,
      3,
      6,
      2,
      3,
      7,
      6,
    ],
    Pa = La.length;
  function Aa(e) {
    return new je.GeometryAttribute({
      componentDatatype: Ge.ComponentDatatype.FLOAT,
      componentsPerAttribute: 4,
      normalize: !1,
      values: e,
    });
  }
  return (
    (y._projectNormal = We),
    function(e, a) {
      return Fe.initialize().then(function() {
        return V.defined(a) && (e = y.unpack(e, a)), y.createGeometry(e);
      });
    }
  );
});
