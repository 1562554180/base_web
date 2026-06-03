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
  './when-1faa3867',
  './AttributeCompression-4610093c',
  './IndexDatatype-a3dd2038',
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './WebMercatorProjection-07b55356',
  './createTaskProcessorWorker',
  './EllipsoidTangentPlane-3eacb5a3',
  './OrientedBoundingBox-e0f45029',
  './TerrainEncoding-1d2a6a4b',
], function(Te, pe, e, t, fe, r, Ee, n, i, o, a, ve, ye, s, d, Me, c, Ne, we, xe) {
  'use strict';
  function be() {
    pe.DeveloperError.throwInstantiationError();
  }
  r.defineProperties(be.prototype, {
    errorEvent: { get: pe.DeveloperError.throwInstantiationError },
    credit: { get: pe.DeveloperError.throwInstantiationError },
    tilingScheme: { get: pe.DeveloperError.throwInstantiationError },
    ready: { get: pe.DeveloperError.throwInstantiationError },
    readyPromise: { get: pe.DeveloperError.throwInstantiationError },
    hasWaterMask: { get: pe.DeveloperError.throwInstantiationError },
    hasVertexNormals: { get: pe.DeveloperError.throwInstantiationError },
    availability: { get: pe.DeveloperError.throwInstantiationError },
  });
  var h = [];
  be.getRegularGridIndices = function(e, t) {
    var r = h[e];
    Te.defined(r) || (h[e] = r = []);
    var n = r[t];
    return (
      Te.defined(n) ||
        p(
          e,
          t,
          (n =
            e * t < pe.BMMath.SIXTY_FOUR_KILOBYTES
              ? (r[t] = new Uint16Array((e - 1) * (t - 1) * 6))
              : (r[t] = new Uint32Array((e - 1) * (t - 1) * 6))),
          0
        ),
      n
    );
  };
  var u = [];
  be.getRegularGridIndicesAndEdgeIndices = function(e, t) {
    var r = u[e];
    Te.defined(r) || (u[e] = r = []);
    var n = r[t];
    if (!Te.defined(n)) {
      var i = be.getRegularGridIndices(e, t),
        o = T(e, t),
        a = o.westIndicesSouthToNorth,
        s = o.southIndicesEastToWest,
        d = o.eastIndicesNorthToSouth,
        c = o.northIndicesWestToEast;
      n = r[t] = {
        indices: i,
        westIndicesSouthToNorth: a,
        southIndicesEastToWest: s,
        eastIndicesNorthToSouth: d,
        northIndicesWestToEast: c,
      };
    }
    return n;
  };
  var g = [];
  function T(e, t) {
    var r,
      n = new Array(t),
      i = new Array(e),
      o = new Array(t),
      a = new Array(e);
    for (r = 0; r < e; ++r) i[(a[r] = r)] = e * t - 1 - r;
    for (r = 0; r < t; ++r) (o[r] = (r + 1) * e - 1), (n[r] = (t - r - 1) * e);
    return {
      westIndicesSouthToNorth: n,
      southIndicesEastToWest: i,
      eastIndicesNorthToSouth: o,
      northIndicesWestToEast: a,
    };
  }
  function p(e, t, r, n) {
    for (var i = 0, o = 0; o < t - 1; ++o) {
      for (var a = 0; a < e - 1; ++a) {
        var s = i,
          d = s + e,
          c = d + 1,
          h = s + 1;
        (r[n++] = s), (r[n++] = d), (r[n++] = h), (r[n++] = h), (r[n++] = d), (r[n++] = c), ++i;
      }
      ++i;
    }
  }
  function l(e, t, r, n) {
    for (var i = e[0], o = e.length, a = 1; a < o; ++a) {
      var s = e[a];
      (r[n++] = i),
        (r[n++] = s),
        (r[n++] = t),
        (r[n++] = t),
        (r[n++] = s),
        (r[n++] = t + 1),
        (i = s),
        ++t;
    }
    return n;
  }
  (be.getRegularGridAndSkirtIndicesAndEdgeIndices = function(e, t) {
    var r = g[e];
    Te.defined(r) || (g[e] = r = []);
    var n = r[t];
    if (!Te.defined(n)) {
      var i = e * t,
        o = (e - 1) * (t - 1) * 6,
        a = 2 * e + 2 * t,
        s = i + a,
        d = o + 6 * Math.max(0, a - 4),
        c = T(e, t),
        h = c.westIndicesSouthToNorth,
        u = c.southIndicesEastToWest,
        l = c.eastIndicesNorthToSouth,
        I = c.northIndicesWestToEast,
        m = ye.IndexDatatype.createTypedArray(s, d);
      p(e, t, m, 0),
        be.addSkirtIndices(h, u, l, I, i, m, o),
        (n = r[t] = {
          indices: m,
          westIndicesSouthToNorth: h,
          southIndicesEastToWest: u,
          eastIndicesNorthToSouth: l,
          northIndicesWestToEast: I,
          indexCountWithoutSkirts: o,
        });
    }
    return n;
  }),
    (be.addSkirtIndices = function(e, t, r, n, i, o, a) {
      var s = i;
      (a = l(e, s, o, a)),
        (a = l(t, (s += e.length), o, a)),
        (a = l(r, (s += t.length), o, a)),
        l(n, (s += r.length), o, a);
    }),
    (be.heightmapTerrainQuality = 0.25),
    (be.getEstimatedLevelZeroGeometricErrorForAHeightmap = function(e, t, r) {
      return (2 * e.maximumRadius * Math.PI * be.heightmapTerrainQuality) / (t * r);
    }),
    (be.prototype.requestTileGeometry = pe.DeveloperError.throwInstantiationError),
    (be.prototype.getLevelMaximumGeometricError = pe.DeveloperError.throwInstantiationError),
    (be.prototype.getTileDataAvailable = pe.DeveloperError.throwInstantiationError),
    (be.prototype.loadTileDataAvailability = pe.DeveloperError.throwInstantiationError);
  var Se = 32767,
    Ae = new fe.Cartesian3(),
    Ce = new fe.Cartesian3(),
    Be = new fe.Cartesian3(),
    Pe = new fe.Cartographic(),
    We = new fe.Cartesian2(),
    De = new fe.Cartesian3(),
    Fe = new Ee.Matrix4(),
    Ve = new Ee.Matrix4();
  function ke(e, t, r, n, i, o, a, s, d) {
    var c = Number.POSITIVE_INFINITY,
      h = i.north,
      u = i.south,
      l = i.east,
      I = i.west;
    l < I && (l += pe.BMMath.TWO_PI);
    for (var m = e.length, g = 0; g < m; ++g) {
      var T = e[g],
        p = r[T],
        f = n[T];
      (Pe.longitude = pe.BMMath.lerp(I, l, f.x)),
        (Pe.latitude = pe.BMMath.lerp(u, h, f.y)),
        (Pe.height = p - t);
      var E = o.cartographicToCartesian(Pe, Ae);
      Ee.Matrix4.multiplyByPoint(a, E, E),
        fe.Cartesian3.minimumByComponent(E, s, s),
        fe.Cartesian3.maximumByComponent(E, d, d),
        (c = Math.min(c, Pe.height));
    }
    return c;
  }
  function _e(e, t, r, n, i, o, a, s, d, c, h, u, l, I, m) {
    var g = Te.defined(a),
      T = d.north,
      p = d.south,
      f = d.east,
      E = d.west;
    f < E && (f += pe.BMMath.TWO_PI);
    for (var v = r.length, y = 0; y < v; ++y) {
      var M = r[y],
        N = i[M],
        w = o[M];
      (Pe.longitude = pe.BMMath.lerp(E, f, w.x) + I),
        (Pe.latitude = pe.BMMath.lerp(p, T, w.y) + m),
        (Pe.height = N - c);
      var x,
        b = s.cartographicToCartesian(Pe, Ae);
      if (g) {
        var S = 2 * M;
        if (((We.x = a[S]), (We.y = a[1 + S]), 1 !== h)) {
          var A = ve.AttributeCompression.octDecode(We.x, We.y, De),
            C = Ee.Transforms.eastNorthUpToFixedFrame(Ae, s, Ve),
            B = Ee.Matrix4.inverseTransformation(C, Fe);
          Ee.Matrix4.multiplyByPointAsVector(B, A, A),
            (A.z *= h),
            fe.Cartesian3.normalize(A, A),
            Ee.Matrix4.multiplyByPointAsVector(C, A, A),
            fe.Cartesian3.normalize(A, A),
            ve.AttributeCompression.octEncode(A, We);
        }
      }
      n.hasWebMercatorT &&
        (x = (Me.WebMercatorProjection.geodeticLatitudeToMercatorAngle(Pe.latitude) - u) * l),
        (t = n.encode(e, t, b, w, Pe.height, We, x));
    }
  }
  function He(e, t) {
    var r;
    return (
      'function' == typeof e.slice && 'function' != typeof (r = e.slice()).sort && (r = void 0),
      Te.defined(r) || (r = Array.prototype.slice.call(e)),
      r.sort(t),
      r
    );
  }
  return c(function(e, t) {
    var r,
      n,
      i = e.quantizedVertices,
      o = i.length / 3,
      a = e.octEncodedNormals,
      s =
        e.westIndices.length + e.eastIndices.length + e.southIndices.length + e.northIndices.length,
      d = e.includeWebMercatorT,
      c = fe.Rectangle.clone(e.rectangle),
      h = c.west,
      u = c.south,
      l = c.east,
      I = c.north,
      m = fe.Ellipsoid.clone(e.ellipsoid),
      g = e.exaggeration,
      T = e.minimumHeight * g,
      p = e.maximumHeight * g,
      f = e.relativeToCenter,
      E = Ee.Transforms.eastNorthUpToFixedFrame(f, m),
      v = Ee.Matrix4.inverseTransformation(E, new Ee.Matrix4());
    d &&
      ((r = Me.WebMercatorProjection.geodeticLatitudeToMercatorAngle(u)),
      (n = 1 / (Me.WebMercatorProjection.geodeticLatitudeToMercatorAngle(I) - r)));
    var y = i.subarray(0, o),
      M = i.subarray(o, 2 * o),
      N = i.subarray(2 * o, 3 * o),
      w = Te.defined(a),
      x = new Array(o),
      b = new Array(o),
      S = new Array(o),
      A = d ? new Array(o) : [],
      C = Ce;
    (C.x = Number.POSITIVE_INFINITY),
      (C.y = Number.POSITIVE_INFINITY),
      (C.z = Number.POSITIVE_INFINITY);
    var B = Be;
    (B.x = Number.NEGATIVE_INFINITY),
      (B.y = Number.NEGATIVE_INFINITY),
      (B.z = Number.NEGATIVE_INFINITY);
    for (
      var P = Number.POSITIVE_INFINITY,
        W = Number.NEGATIVE_INFINITY,
        D = Number.POSITIVE_INFINITY,
        F = Number.NEGATIVE_INFINITY,
        V = 0;
      V < o;
      ++V
    ) {
      var k = y[V],
        _ = M[V],
        H = k / Se,
        O = _ / Se,
        G = pe.BMMath.lerp(T, p, N[V] / Se);
      (Pe.longitude = pe.BMMath.lerp(h, l, H)),
        (Pe.latitude = pe.BMMath.lerp(u, I, O)),
        (Pe.height = G),
        (P = Math.min(Pe.longitude, P)),
        (W = Math.max(Pe.longitude, W)),
        (D = Math.min(Pe.latitude, D)),
        (F = Math.max(Pe.latitude, F));
      var Y = m.cartographicToCartesian(Pe);
      (x[V] = new fe.Cartesian2(H, O)),
        (b[V] = G),
        (S[V] = Y),
        d &&
          (A[V] = (Me.WebMercatorProjection.geodeticLatitudeToMercatorAngle(Pe.latitude) - r) * n),
        Ee.Matrix4.multiplyByPoint(v, Y, Ae),
        fe.Cartesian3.minimumByComponent(Ae, C, C),
        fe.Cartesian3.maximumByComponent(Ae, B, B);
    }
    var z,
      R,
      L,
      U = He(e.westIndices, function(e, t) {
        return x[e].y - x[t].y;
      }),
      j = He(e.eastIndices, function(e, t) {
        return x[t].y - x[e].y;
      }),
      q = He(e.southIndices, function(e, t) {
        return x[t].x - x[e].x;
      }),
      Q = He(e.northIndices, function(e, t) {
        return x[e].x - x[t].x;
      });
    1 !== g &&
      ((R = Ee.BoundingSphere.fromPoints(S)),
      (z = we.OrientedBoundingBox.fromRectangle(c, T, p, m))),
      (1 !== g || T < 0) &&
        (L = new xe.EllipsoidalOccluder(m).computeHorizonCullingPointPossiblyUnderEllipsoid(
          f,
          S,
          T
        ));
    var K = T;
    (K = Math.min(K, ke(e.westIndices, e.westSkirtHeight, b, x, c, m, v, C, B))),
      (K = Math.min(K, ke(e.southIndices, e.southSkirtHeight, b, x, c, m, v, C, B))),
      (K = Math.min(K, ke(e.eastIndices, e.eastSkirtHeight, b, x, c, m, v, C, B))),
      (K = Math.min(K, ke(e.northIndices, e.northSkirtHeight, b, x, c, m, v, C, B)));
    for (
      var X = new Ne.AxisAlignedBoundingBox(C, B, f),
        Z = new xe.TerrainEncoding(X, K, p, E, w, d),
        J = Z.getStride(),
        $ = new Float32Array(o * J + s * J),
        ee = 0,
        te = 0;
      te < o;
      ++te
    ) {
      if (w) {
        var re = 2 * te;
        if (((We.x = a[re]), (We.y = a[1 + re]), 1 !== g)) {
          var ne = ve.AttributeCompression.octDecode(We.x, We.y, De),
            ie = Ee.Transforms.eastNorthUpToFixedFrame(S[te], m, Ve),
            oe = Ee.Matrix4.inverseTransformation(ie, Fe);
          Ee.Matrix4.multiplyByPointAsVector(oe, ne, ne),
            (ne.z *= g),
            fe.Cartesian3.normalize(ne, ne),
            Ee.Matrix4.multiplyByPointAsVector(ie, ne, ne),
            fe.Cartesian3.normalize(ne, ne),
            ve.AttributeCompression.octEncode(ne, We);
        }
      }
      ee = Z.encode($, ee, S[te], x[te], b[te], We, A[te]);
    }
    var ae = Math.max(0, 2 * (s - 4)),
      se = e.indices.length + 3 * ae,
      de = ye.IndexDatatype.createTypedArray(o + s, se);
    de.set(e.indices, 0);
    var ce = 1e-4 * (W - P),
      he = 1e-4 * (F - D),
      ue = -ce,
      le = ce,
      Ie = he,
      me = -he,
      ge = o * J;
    return (
      _e($, ge, U, Z, b, x, a, m, c, e.westSkirtHeight, g, r, n, ue, 0),
      _e(
        $,
        (ge += e.westIndices.length * J),
        q,
        Z,
        b,
        x,
        a,
        m,
        c,
        e.southSkirtHeight,
        g,
        r,
        n,
        0,
        me
      ),
      _e(
        $,
        (ge += e.southIndices.length * J),
        j,
        Z,
        b,
        x,
        a,
        m,
        c,
        e.eastSkirtHeight,
        g,
        r,
        n,
        le,
        0
      ),
      _e(
        $,
        (ge += e.eastIndices.length * J),
        Q,
        Z,
        b,
        x,
        a,
        m,
        c,
        e.northSkirtHeight,
        g,
        r,
        n,
        0,
        Ie
      ),
      be.addSkirtIndices(U, q, j, Q, o, de, e.indices.length),
      t.push($.buffer, de.buffer),
      {
        vertices: $.buffer,
        indices: de.buffer,
        westIndicesSouthToNorth: U,
        southIndicesEastToWest: q,
        eastIndicesNorthToSouth: j,
        northIndicesWestToEast: Q,
        vertexStride: J,
        center: f,
        minimumHeight: T,
        maximumHeight: p,
        boundingSphere: R,
        orientedBoundingBox: z,
        occludeePointInScaledSpace: L,
        encoding: Z,
        indexCountWithoutSkirts: e.indices.length,
      }
    );
  });
});
