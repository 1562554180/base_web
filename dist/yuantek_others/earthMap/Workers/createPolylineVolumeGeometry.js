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
  './GeometryAttributes-38e93c79',
  './AttributeCompression-4610093c',
  './GeometryPipeline-b073abaf',
  './EncodedCartesian3-b7dd761a',
  './IndexDatatype-a3dd2038',
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './VertexFormat-f7b9c25e',
  './arrayRemoveDuplicates-7ced389a',
  './BoundingRectangle-15b8287e',
  './EllipsoidTangentPlane-3eacb5a3',
  './EllipsoidRhumbLine-62acd3ce',
  './PolygonPipeline-3dd0399b',
  './PolylineVolumeGeometryLibrary-39bd8ba7',
  './EllipsoidGeodesic-edb379ae',
  './PolylinePipeline-93ffdac4',
], function(u, i, e, c, g, t, G, n, r, A, R, a, D, o, I, l, O, d, s, y, p, m, h, f, B, b, v, E) {
  'use strict';
  var P = {};
  function S(e, t) {
    u.defined(P[e]) || ((P[e] = !0), console.warn(c.defaultValue(t, e)));
  }
  function _(e) {
    var t = (e = c.defaultValue(e, c.defaultValue.EMPTY_OBJECT)).polylinePositions,
      n = e.shapePositions;
    (this._positions = t),
      (this._shape = n),
      (this._ellipsoid = g.Ellipsoid.clone(c.defaultValue(e.ellipsoid, g.Ellipsoid.WGS84))),
      (this._cornerType = c.defaultValue(e.cornerType, b.CornerType.ROUNDED)),
      (this._vertexFormat = y.VertexFormat.clone(
        c.defaultValue(e.vertexFormat, y.VertexFormat.DEFAULT)
      )),
      (this._granularity = c.defaultValue(e.granularity, i.BMMath.RADIANS_PER_DEGREE)),
      (this._workerName = 'createPolylineVolumeGeometry');
    var r = 1 + t.length * g.Cartesian3.packedLength;
    (r += 1 + n.length * g.Cartesian2.packedLength),
      (this.packedLength = r + g.Ellipsoid.packedLength + y.VertexFormat.packedLength + 2);
  }
  (S.geometryOutlines =
    'Entity geometry outlines are unsupported on terrain. Outlines will be disabled. To enable outlines, disable geometry terrain clamping by explicitly setting height to 0.'),
    (S.geometryZIndex =
      'Entity geometry with zIndex are unsupported when height or extrudedHeight are defined.  zIndex will be ignored'),
    (S.geometryHeightReference =
      'Entity corridor, ellipse, polygon or rectangle with heightReference must also have a defined height.  heightReference will be ignored'),
    (S.geometryExtrudedHeightReference =
      'Entity corridor, ellipse, polygon or rectangle with extrudedHeightReference must also have a defined extrudedHeight.  extrudedHeightReference will be ignored'),
    (_.pack = function(e, t, n) {
      var r;
      n = c.defaultValue(n, 0);
      var i = e._positions,
        a = i.length;
      for (t[n++] = a, r = 0; r < a; ++r, n += g.Cartesian3.packedLength)
        g.Cartesian3.pack(i[r], t, n);
      var o = e._shape;
      for (a = o.length, t[n++] = a, r = 0; r < a; ++r, n += g.Cartesian2.packedLength)
        g.Cartesian2.pack(o[r], t, n);
      return (
        g.Ellipsoid.pack(e._ellipsoid, t, n),
        (n += g.Ellipsoid.packedLength),
        y.VertexFormat.pack(e._vertexFormat, t, n),
        (n += y.VertexFormat.packedLength),
        (t[n++] = e._cornerType),
        (t[n] = e._granularity),
        t
      );
    });
  var x = g.Ellipsoid.clone(g.Ellipsoid.UNIT_SPHERE),
    k = new y.VertexFormat(),
    V = {
      polylinePositions: void 0,
      shapePositions: void 0,
      ellipsoid: x,
      vertexFormat: k,
      cornerType: void 0,
      granularity: void 0,
    };
  _.unpack = function(e, t, n) {
    var r;
    t = c.defaultValue(t, 0);
    var i = e[t++],
      a = new Array(i);
    for (r = 0; r < i; ++r, t += g.Cartesian3.packedLength) a[r] = g.Cartesian3.unpack(e, t);
    i = e[t++];
    var o = new Array(i);
    for (r = 0; r < i; ++r, t += g.Cartesian2.packedLength) o[r] = g.Cartesian2.unpack(e, t);
    var l = g.Ellipsoid.unpack(e, t, x);
    t += g.Ellipsoid.packedLength;
    var d = y.VertexFormat.unpack(e, t, k);
    t += y.VertexFormat.packedLength;
    var s = e[t++],
      p = e[t];
    return u.defined(n)
      ? ((n._positions = a),
        (n._shape = o),
        (n._ellipsoid = g.Ellipsoid.clone(l, n._ellipsoid)),
        (n._vertexFormat = y.VertexFormat.clone(d, n._vertexFormat)),
        (n._cornerType = s),
        (n._granularity = p),
        n)
      : ((V.polylinePositions = a),
        (V.shapePositions = o),
        (V.cornerType = s),
        (V.granularity = p),
        new _(V));
  };
  var L = new m.BoundingRectangle();
  return (
    (_.createGeometry = function(e) {
      var t = e._positions,
        n = p.arrayRemoveDuplicates(t, g.Cartesian3.equalsEpsilon),
        r = e._shape;
      if (
        ((r = b.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(r)),
        !(n.length < 2 || r.length < 3))
      ) {
        B.PolygonPipeline.computeWindingOrder2D(r) === B.WindingOrder.CLOCKWISE && r.reverse();
        var i = m.BoundingRectangle.fromPoints(r, L);
        return (function(e, t, n, r) {
          var i = new D.GeometryAttributes();
          r.position &&
            (i.position = new R.GeometryAttribute({
              componentDatatype: A.ComponentDatatype.DOUBLE,
              componentsPerAttribute: 3,
              values: e,
            }));
          var a,
            o,
            l,
            d,
            s,
            p,
            u = t.length,
            c = e.length / 3,
            g = (c - 2 * u) / (2 * u),
            y = B.PolygonPipeline.triangulate(t),
            m = (g - 1) * u * 6 + 2 * y.length,
            h = O.IndexDatatype.createTypedArray(c, m),
            f = 2 * u,
            b = 0;
          for (a = 0; a < g - 1; a++) {
            for (o = 0; o < u - 1; o++)
              (p = (l = 2 * o + a * u * 2) + f),
                (s = (d = l + 1) + f),
                (h[b++] = d),
                (h[b++] = l),
                (h[b++] = s),
                (h[b++] = s),
                (h[b++] = l),
                (h[b++] = p);
            (s = (d = (l = 2 * u - 2 + a * u * 2) + 1) + f),
              (p = l + f),
              (h[b++] = d),
              (h[b++] = l),
              (h[b++] = s),
              (h[b++] = s),
              (h[b++] = l),
              (h[b++] = p);
          }
          if (r.st || r.tangent || r.bitangent) {
            var v,
              E,
              P = new Float32Array(2 * c),
              _ = 1 / (g - 1),
              x = 1 / n.height,
              k = n.height / 2,
              V = 0;
            for (a = 0; a < g; a++) {
              for (v = a * _, E = x * (t[0].y + k), P[V++] = v, P[V++] = E, o = 1; o < u; o++)
                (E = x * (t[o].y + k)), (P[V++] = v), (P[V++] = E), (P[V++] = v), (P[V++] = E);
              (E = x * (t[0].y + k)), (P[V++] = v), (P[V++] = E);
            }
            for (o = 0; o < u; o++) (v = 0), (E = x * (t[o].y + k)), (P[V++] = v), (P[V++] = E);
            for (o = 0; o < u; o++)
              (v = (g - 1) * _), (E = x * (t[o].y + k)), (P[V++] = v), (P[V++] = E);
            i.st = new R.GeometryAttribute({
              componentDatatype: A.ComponentDatatype.FLOAT,
              componentsPerAttribute: 2,
              values: new Float32Array(P),
            });
          }
          var L = c - 2 * u;
          for (a = 0; a < y.length; a += 3) {
            var w = y[a] + L,
              C = y[a + 1] + L,
              F = y[a + 2] + L;
            (h[b++] = w),
              (h[b++] = C),
              (h[b++] = F),
              (h[b++] = F + u),
              (h[b++] = C + u),
              (h[b++] = w + u);
          }
          var T = new R.Geometry({
            attributes: i,
            indices: h,
            boundingSphere: G.BoundingSphere.fromVertices(e),
            primitiveType: R.PrimitiveType.TRIANGLES,
          });
          if ((r.normal && (T = I.GeometryPipeline.computeNormal(T)), r.tangent || r.bitangent)) {
            try {
              T = I.GeometryPipeline.computeTangentAndBitangent(T);
            } catch (e) {
              S(
                'polyline-volume-tangent-bitangent',
                'Unable to compute tangents and bitangents for polyline volume geometry'
              );
            }
            r.tangent || (T.attributes.tangent = void 0),
              r.bitangent || (T.attributes.bitangent = void 0),
              r.st || (T.attributes.st = void 0);
          }
          return T;
        })(b.PolylineVolumeGeometryLibrary.computePositions(n, r, i, e, !0), r, i, e._vertexFormat);
      }
    }),
    function(e, t) {
      return (
        u.defined(t) && (e = _.unpack(e, t)),
        (e._ellipsoid = g.Ellipsoid.clone(e._ellipsoid)),
        _.createGeometry(e)
      );
    }
  );
});
