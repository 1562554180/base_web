define([
  'exports',
  './defined-30a32f90',
  './Math-fbd31710',
  './Cartesian2-06dac25b',
  './EllipsoidTangentPlane-3eacb5a3',
  './PolygonPipeline-3dd0399b',
  './PolylinePipeline-93ffdac4',
], function(e, A, w, M, b, C, E) {
  'use strict';
  var i = {};
  var O = new M.Cartographic(),
    B = new M.Cartographic();
  var L = new Array(2),
    F = new Array(2),
    H = { positions: void 0, height: void 0, granularity: void 0, ellipsoid: void 0 };
  (i.computePositions = function(e, i, t, n, r, o) {
    var a = (function(e, i, t, n) {
      var r = i.length;
      if (!(r < 2)) {
        var o = A.defined(n),
          a = A.defined(t),
          l = !0,
          h = new Array(r),
          s = new Array(r),
          g = new Array(r),
          d = i[0];
        h[0] = d;
        var p = e.cartesianToCartographic(d, O);
        a && (p.height = t[0]), (l = l && p.height <= 0), (s[0] = p.height), (g[0] = o ? n[0] : 0);
        for (var P, c, f = 1, v = 1; v < r; ++v) {
          var y = i[v],
            u = e.cartesianToCartographic(y, B);
          a && (u.height = t[v]),
            (l = l && u.height <= 0),
            (P = p),
            (c = u),
            w.BMMath.equalsEpsilon(P.latitude, c.latitude, w.BMMath.EPSILON14) &&
            w.BMMath.equalsEpsilon(P.longitude, c.longitude, w.BMMath.EPSILON14)
              ? p.height < u.height && (s[f - 1] = u.height)
              : ((h[f] = y),
                (s[f] = u.height),
                (g[f] = o ? n[v] : 0),
                M.Cartographic.clone(u, p),
                ++f);
        }
        if (!(l || f < 2))
          return (
            (h.length = f),
            (s.length = f),
            (g.length = f),
            { positions: h, topHeights: s, bottomHeights: g }
          );
      }
    })(e, i, t, n);
    if (A.defined(a)) {
      if (((i = a.positions), (t = a.topHeights), (n = a.bottomHeights), 3 <= i.length)) {
        var l = b.EllipsoidTangentPlane.fromPoints(i, e).projectPointsOntoPlane(i);
        C.PolygonPipeline.computeWindingOrder2D(l) === C.WindingOrder.CLOCKWISE &&
          (i.reverse(), t.reverse(), n.reverse());
      }
      var h,
        s,
        g = i.length,
        d = g - 2,
        p = w.BMMath.chordLength(r, e.maximumRadius),
        P = H;
      if (((P.minDistance = p), (P.ellipsoid = e), o)) {
        var c,
          f = 0;
        for (c = 0; c < g - 1; c++) f += E.PolylinePipeline.numberOfPoints(i[c], i[c + 1], p) + 1;
        (h = new Float64Array(3 * f)), (s = new Float64Array(3 * f));
        var v = L,
          y = F;
        (P.positions = v), (P.height = y);
        var u = 0;
        for (c = 0; c < g - 1; c++) {
          (v[0] = i[c]), (v[1] = i[c + 1]), (y[0] = t[c]), (y[1] = t[c + 1]);
          var m = E.PolylinePipeline.generateArc(P);
          h.set(m, u),
            (y[0] = n[c]),
            (y[1] = n[c + 1]),
            s.set(E.PolylinePipeline.generateArc(P), u),
            (u += m.length);
        }
      } else
        (P.positions = i),
          (P.height = t),
          (h = new Float64Array(E.PolylinePipeline.generateArc(P))),
          (P.height = n),
          (s = new Float64Array(E.PolylinePipeline.generateArc(P)));
      return { bottomPositions: s, topPositions: h, numCorners: d };
    }
  }),
    (e.WallGeometryLibrary = i);
});
