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
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './WebMercatorProjection-07b55356',
  './createTaskProcessorWorker',
  './EllipsoidTangentPlane-3eacb5a3',
  './OrientedBoundingBox-e0f45029',
  './TerrainEncoding-1d2a6a4b',
], function(Ft, Ot, t, i, Vt, e, Yt, Ut, a, r, n, o, s, u, kt, h, Ht, Lt, jt) {
  'use strict';
  var Dt = Uint16Array.BYTES_PER_ELEMENT,
    Gt = Int32Array.BYTES_PER_ELEMENT,
    zt = Uint32Array.BYTES_PER_ELEMENT,
    qt = Float32Array.BYTES_PER_ELEMENT,
    Jt = Float64Array.BYTES_PER_ELEMENT;
  function Kt(t, e, a) {
    a = i.defaultValue(a, Ot.BMMath);
    for (var r = t.length, n = 0; n < r; ++n)
      if (a.equalsEpsilon(t[n], e, Ot.BMMath.EPSILON12)) return n;
    return -1;
  }
  var Qt = new Vt.Cartographic(),
    Xt = new Vt.Cartesian3(),
    Zt = new Vt.Cartesian3(),
    $t = new Vt.Cartesian3(),
    te = new Yt.Matrix4();
  function ee(t, e, a, r, n, i, o, s, u, h) {
    for (var d = o.length, c = 0; c < d; ++c) {
      var l = o[c],
        g = l.cartographic,
        m = l.index,
        p = t.length,
        M = g.longitude,
        v = g.latitude;
      v = Ot.BMMath.clamp(v, -Ot.BMMath.PI_OVER_TWO, Ot.BMMath.PI_OVER_TWO);
      var I = g.height - i.skirtHeight;
      (i.hMin = Math.min(i.hMin, I)),
        Vt.Cartographic.fromRadians(M, v, I, Qt),
        u && (Qt.longitude += s),
        u ? (c === d - 1 ? (Qt.latitude += h) : 0 === c && (Qt.latitude -= h)) : (Qt.latitude += s);
      var E = i.ellipsoid.cartographicToCartesian(Qt);
      t.push(E),
        e.push(I),
        a.push(Vt.Cartesian2.clone(a[m])),
        0 < r.length && r.push(r[m]),
        Yt.Matrix4.multiplyByPoint(i.toENU, E, Xt);
      var f = i.minimum,
        T = i.maximum;
      Vt.Cartesian3.minimumByComponent(Xt, f, f), Vt.Cartesian3.maximumByComponent(Xt, T, T);
      var B = i.lastBorderPoint;
      if (Ft.defined(B)) {
        var N = B.index;
        n.push(N, p - 1, p, p, m, N);
      }
      i.lastBorderPoint = l;
    }
  }
  return h(function(t, e) {
    (t.ellipsoid = Vt.Ellipsoid.clone(t.ellipsoid)),
      (t.rectangle = Vt.Rectangle.clone(t.rectangle));
    var a = (function(t, e, a, r, n, i, o, s, u, h) {
        var d, c, l, g, m, p;
        p = Ft.defined(r)
          ? ((d = r.west), (c = r.south), (l = r.east), (g = r.north), (m = r.width), r.height)
          : ((d = Ot.BMMath.toRadians(n.west)),
            (c = Ot.BMMath.toRadians(n.south)),
            (l = Ot.BMMath.toRadians(n.east)),
            (g = Ot.BMMath.toRadians(n.north)),
            (m = Ot.BMMath.toRadians(r.width)),
            Ot.BMMath.toRadians(r.height));
        var M,
          v,
          I = [c, g],
          E = [d, l],
          f = Yt.Transforms.eastNorthUpToFixedFrame(e, a),
          T = Yt.Matrix4.inverseTransformation(f, te);
        s &&
          ((M = kt.WebMercatorProjection.geodeticLatitudeToMercatorAngle(c)),
          (v = 1 / (kt.WebMercatorProjection.geodeticLatitudeToMercatorAngle(g) - M)));
        var B = new DataView(t),
          N = Number.POSITIVE_INFINITY,
          x = Number.NEGATIVE_INFINITY,
          b = Zt;
        (b.x = Number.POSITIVE_INFINITY),
          (b.y = Number.POSITIVE_INFINITY),
          (b.z = Number.POSITIVE_INFINITY);
        var C = $t;
        (C.x = Number.NEGATIVE_INFINITY),
          (C.y = Number.NEGATIVE_INFINITY),
          (C.z = Number.NEGATIVE_INFINITY);
        var S,
          P,
          w = 0,
          y = 0,
          A = 0;
        for (P = 0; P < 4; ++P) {
          var R = w;
          (S = B.getUint32(R, !0)), (R += zt);
          var _ = Ot.BMMath.toRadians(180 * B.getFloat64(R, !0));
          (R += Jt), -1 === Kt(E, _) && E.push(_);
          var W = Ot.BMMath.toRadians(180 * B.getFloat64(R, !0));
          (R += Jt), -1 === Kt(I, W) && I.push(W), (R += 2 * Jt);
          var F = B.getInt32(R, !0);
          (R += Gt), (y += F), (F = B.getInt32(R, !0)), (A += 3 * F), (w += S + zt);
        }
        var O = [],
          V = [],
          Y = new Array(y),
          U = new Array(y),
          k = new Array(y),
          H = s ? new Array(y) : [],
          L = new Array(A),
          j = [],
          D = [],
          G = [],
          z = [],
          q = 0,
          J = 0;
        for (P = w = 0; P < 4; ++P) {
          S = B.getUint32(w, !0);
          var K = (w += zt),
            Q = Ot.BMMath.toRadians(180 * B.getFloat64(w, !0));
          w += Jt;
          var X = Ot.BMMath.toRadians(180 * B.getFloat64(w, !0));
          w += Jt;
          var Z = Ot.BMMath.toRadians(180 * B.getFloat64(w, !0)),
            $ = 0.5 * Z;
          w += Jt;
          var tt = Ot.BMMath.toRadians(180 * B.getFloat64(w, !0)),
            et = 0.5 * tt;
          w += Jt;
          var at = B.getInt32(w, !0);
          w += Gt;
          var rt = B.getInt32(w, !0);
          (w += Gt), (w += Gt);
          for (var nt = new Array(at), it = 0; it < at; ++it) {
            var ot = Q + B.getUint8(w++) * Z;
            Qt.longitude = ot;
            var st = X + B.getUint8(w++) * tt;
            Qt.latitude = st;
            var ut = B.getFloat32(w, !0);
            if (
              ((w += qt),
              0 !== ut && ut < h && (ut *= -Math.pow(2, u)),
              (ut *= 6371010 * i),
              (Qt.height = ut),
              -1 !== Kt(E, ot) || -1 !== Kt(I, st))
            ) {
              var ht = Kt(O, Qt, Vt.Cartographic);
              if (-1 !== ht) {
                nt[it] = V[ht];
                continue;
              }
              O.push(Vt.Cartographic.clone(Qt)), V.push(q);
            }
            (nt[it] = q),
              Math.abs(ot - d) < $
                ? j.push({ index: q, cartographic: Vt.Cartographic.clone(Qt) })
                : Math.abs(ot - l) < $
                  ? G.push({ index: q, cartographic: Vt.Cartographic.clone(Qt) })
                  : Math.abs(st - c) < et
                    ? D.push({ index: q, cartographic: Vt.Cartographic.clone(Qt) })
                    : Math.abs(st - g) < et &&
                      z.push({ index: q, cartographic: Vt.Cartographic.clone(Qt) }),
              (N = Math.min(ut, N)),
              (x = Math.max(ut, x)),
              (k[q] = ut);
            var dt = a.cartographicToCartesian(Qt);
            (Y[q] = dt),
              s && (H[q] = (kt.WebMercatorProjection.geodeticLatitudeToMercatorAngle(st) - M) * v),
              Yt.Matrix4.multiplyByPoint(T, dt, Xt),
              Vt.Cartesian3.minimumByComponent(Xt, b, b),
              Vt.Cartesian3.maximumByComponent(Xt, C, C);
            var ct = (ot - d) / (l - d);
            ct = Ot.BMMath.clamp(ct, 0, 1);
            var lt = (st - c) / (g - c);
            (lt = Ot.BMMath.clamp(lt, 0, 1)), (U[q] = new Vt.Cartesian2(ct, lt)), ++q;
          }
          for (var gt = 3 * rt, mt = 0; mt < gt; ++mt, ++J)
            (L[J] = nt[B.getUint16(w, !0)]), (w += Dt);
          if (S !== w - K) throw new Ut.RuntimeError('Invalid terrain tile.');
        }
        (Y.length = q), (U.length = q), (k.length = q), s && (H.length = q);
        var pt = q,
          Mt = J,
          vt = {
            hMin: N,
            lastBorderPoint: void 0,
            skirtHeight: o,
            toENU: T,
            ellipsoid: a,
            minimum: b,
            maximum: C,
          };
        j.sort(function(t, e) {
          return e.cartographic.latitude - t.cartographic.latitude;
        }),
          D.sort(function(t, e) {
            return t.cartographic.longitude - e.cartographic.longitude;
          }),
          G.sort(function(t, e) {
            return t.cartographic.latitude - e.cartographic.latitude;
          }),
          z.sort(function(t, e) {
            return e.cartographic.longitude - t.cartographic.longitude;
          });
        var It = 1e-5;
        if (
          (ee(Y, k, U, H, L, vt, j, -It * m, !0, -It * p),
          ee(Y, k, U, H, L, vt, D, -It * p, !1),
          ee(Y, k, U, H, L, vt, G, It * m, !0, It * p),
          ee(Y, k, U, H, L, vt, z, It * p, !1),
          0 < j.length && 0 < z.length)
        ) {
          var Et = j[0].index,
            ft = pt,
            Tt = z[z.length - 1].index,
            Bt = Y.length - 1;
          L.push(Tt, Bt, ft, ft, Et, Tt);
        }
        y = Y.length;
        var Nt,
          xt = Yt.BoundingSphere.fromPoints(Y);
        Ft.defined(r) && (Nt = Lt.OrientedBoundingBox.fromRectangle(r, N, x, a));
        for (
          var bt = new jt.EllipsoidalOccluder(a).computeHorizonCullingPointPossiblyUnderEllipsoid(
              e,
              Y,
              N
            ),
            Ct = new Ht.AxisAlignedBoundingBox(b, C, e),
            St = new jt.TerrainEncoding(Ct, vt.hMin, x, f, !1, s),
            Pt = new Float32Array(y * St.getStride()),
            wt = 0,
            yt = 0;
          yt < y;
          ++yt
        )
          wt = St.encode(Pt, wt, Y[yt], U[yt], k[yt], void 0, H[yt]);
        var At = j
            .map(function(t) {
              return t.index;
            })
            .reverse(),
          Rt = D.map(function(t) {
            return t.index;
          }).reverse(),
          _t = G.map(function(t) {
            return t.index;
          }).reverse(),
          Wt = z
            .map(function(t) {
              return t.index;
            })
            .reverse();
        return (
          Rt.unshift(_t[_t.length - 1]),
          Rt.push(At[0]),
          Wt.unshift(At[At.length - 1]),
          Wt.push(_t[0]),
          {
            vertices: Pt,
            indices: new Uint16Array(L),
            maximumHeight: x,
            minimumHeight: N,
            encoding: St,
            boundingSphere3D: xt,
            orientedBoundingBox: Nt,
            occludeePointInScaledSpace: bt,
            vertexCountWithoutSkirts: pt,
            indexCountWithoutSkirts: Mt,
            westIndicesSouthToNorth: At,
            southIndicesEastToWest: Rt,
            eastIndicesNorthToSouth: _t,
            northIndicesWestToEast: Wt,
          }
        );
      })(
        t.buffer,
        t.relativeToCenter,
        t.ellipsoid,
        t.rectangle,
        t.nativeRectangle,
        t.exaggeration,
        t.skirtHeight,
        t.includeWebMercatorT,
        t.negativeAltitudeExponentBias,
        t.negativeElevationThreshold
      ),
      r = a.vertices;
    e.push(r.buffer);
    var n = a.indices;
    return (
      e.push(n.buffer),
      {
        vertices: r.buffer,
        indices: n.buffer,
        numberOfAttributes: a.encoding.getStride(),
        minimumHeight: a.minimumHeight,
        maximumHeight: a.maximumHeight,
        boundingSphere3D: a.boundingSphere3D,
        orientedBoundingBox: a.orientedBoundingBox,
        occludeePointInScaledSpace: a.occludeePointInScaledSpace,
        encoding: a.encoding,
        vertexCountWithoutSkirts: a.vertexCountWithoutSkirts,
        indexCountWithoutSkirts: a.indexCountWithoutSkirts,
        westIndicesSouthToNorth: a.westIndicesSouthToNorth,
        southIndicesEastToWest: a.southIndicesEastToWest,
        eastIndicesNorthToSouth: a.eastIndicesNorthToSouth,
        northIndicesWestToEast: a.northIndicesWestToEast,
      }
    );
  });
});
