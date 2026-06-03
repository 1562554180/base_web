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
  './GeometryOffsetAttribute-718df502',
  './GeometryInstance-23fe87b0',
  './arrayRemoveDuplicates-7ced389a',
  './EllipsoidTangentPlane-3eacb5a3',
  './ArcType-e3f6a1cc',
  './EllipsoidRhumbLine-62acd3ce',
  './PolygonPipeline-3dd0399b',
  './PolygonGeometryLibrary-dae77554',
], function(v, E, e, f, c, t, A, i, r, _, G, o, L, n, T, a, H, l, s, O, D, y, x, I, u, C, w) {
  'use strict';
  var S = [],
    M = [];
  function R(e, t, i, r, o) {
    var n,
      a,
      l = x.EllipsoidTangentPlane.fromPoints(t, e).projectPointsOntoPlane(t, S);
    C.PolygonPipeline.computeWindingOrder2D(l) === C.WindingOrder.CLOCKWISE &&
      (l.reverse(), (t = t.slice().reverse()));
    var s = t.length,
      y = 0;
    if (r)
      for (n = new Float64Array(2 * s * 3), a = 0; a < s; a++) {
        var u = t[a],
          d = t[(a + 1) % s];
        (n[y++] = u.x),
          (n[y++] = u.y),
          (n[y++] = u.z),
          (n[y++] = d.x),
          (n[y++] = d.y),
          (n[y++] = d.z);
      }
    else {
      var p = 0;
      if (o === I.ArcType.GEODESIC)
        for (a = 0; a < s; a++)
          p += w.PolygonGeometryLibrary.subdivideLineCount(t[a], t[(a + 1) % s], i);
      else if (o === I.ArcType.RHUMB)
        for (a = 0; a < s; a++)
          p += w.PolygonGeometryLibrary.subdivideRhumbLineCount(e, t[a], t[(a + 1) % s], i);
      for (n = new Float64Array(3 * p), a = 0; a < s; a++) {
        var f;
        o === I.ArcType.GEODESIC
          ? (f = w.PolygonGeometryLibrary.subdivideLine(t[a], t[(a + 1) % s], i, M))
          : o === I.ArcType.RHUMB &&
            (f = w.PolygonGeometryLibrary.subdivideRhumbLine(e, t[a], t[(a + 1) % s], i, M));
        for (var c = f.length, g = 0; g < c; ++g) n[y++] = f[g];
      }
    }
    var h = 2 * (s = n.length / 3),
      m = H.IndexDatatype.createTypedArray(s, h);
    for (a = y = 0; a < s - 1; a++) (m[y++] = a), (m[y++] = a + 1);
    return (
      (m[y++] = s - 1),
      (m[y++] = 0),
      new D.GeometryInstance({
        geometry: new G.Geometry({
          attributes: new L.GeometryAttributes({
            position: new G.GeometryAttribute({
              componentDatatype: _.ComponentDatatype.DOUBLE,
              componentsPerAttribute: 3,
              values: n,
            }),
          }),
          indices: m,
          primitiveType: G.PrimitiveType.LINES,
        }),
      })
    );
  }
  function k(e, t, i, r, o) {
    var n,
      a,
      l = x.EllipsoidTangentPlane.fromPoints(t, e).projectPointsOntoPlane(t, S);
    C.PolygonPipeline.computeWindingOrder2D(l) === C.WindingOrder.CLOCKWISE &&
      (l.reverse(), (t = t.slice().reverse()));
    var s = t.length,
      y = new Array(s),
      u = 0;
    if (r)
      for (n = new Float64Array(2 * s * 3 * 2), a = 0; a < s; ++a) {
        y[a] = u / 3;
        var d = t[a],
          p = t[(a + 1) % s];
        (n[u++] = d.x),
          (n[u++] = d.y),
          (n[u++] = d.z),
          (n[u++] = p.x),
          (n[u++] = p.y),
          (n[u++] = p.z);
      }
    else {
      var f = 0;
      if (o === I.ArcType.GEODESIC)
        for (a = 0; a < s; a++)
          f += w.PolygonGeometryLibrary.subdivideLineCount(t[a], t[(a + 1) % s], i);
      else if (o === I.ArcType.RHUMB)
        for (a = 0; a < s; a++)
          f += w.PolygonGeometryLibrary.subdivideRhumbLineCount(e, t[a], t[(a + 1) % s], i);
      for (n = new Float64Array(3 * f * 2), a = 0; a < s; ++a) {
        var c;
        (y[a] = u / 3),
          o === I.ArcType.GEODESIC
            ? (c = w.PolygonGeometryLibrary.subdivideLine(t[a], t[(a + 1) % s], i, M))
            : o === I.ArcType.RHUMB &&
              (c = w.PolygonGeometryLibrary.subdivideRhumbLine(e, t[a], t[(a + 1) % s], i, M));
        for (var g = c.length, h = 0; h < g; ++h) n[u++] = c[h];
      }
    }
    s = n.length / 6;
    var m = y.length,
      b = 2 * (2 * s + m),
      P = H.IndexDatatype.createTypedArray(s + m, b);
    for (a = u = 0; a < s; ++a)
      (P[u++] = a), (P[u++] = (a + 1) % s), (P[u++] = a + s), (P[u++] = ((a + 1) % s) + s);
    for (a = 0; a < m; a++) {
      var v = y[a];
      (P[u++] = v), (P[u++] = v + s);
    }
    return new D.GeometryInstance({
      geometry: new G.Geometry({
        attributes: new L.GeometryAttributes({
          position: new G.GeometryAttribute({
            componentDatatype: _.ComponentDatatype.DOUBLE,
            componentsPerAttribute: 3,
            values: n,
          }),
        }),
        indices: P,
        primitiveType: G.PrimitiveType.LINES,
      }),
    });
  }
  function g(e) {
    var t = e.polygonHierarchy,
      i = f.defaultValue(e.ellipsoid, c.Ellipsoid.WGS84),
      r = f.defaultValue(e.granularity, E.BMMath.RADIANS_PER_DEGREE),
      o = f.defaultValue(e.perPositionHeight, !1),
      n = o && v.defined(e.extrudedHeight),
      a = f.defaultValue(e.arcType, I.ArcType.GEODESIC),
      l = f.defaultValue(e.height, 0),
      s = f.defaultValue(e.extrudedHeight, l);
    if (!n) {
      var y = Math.max(l, s);
      (s = Math.min(l, s)), (l = y);
    }
    (this._ellipsoid = c.Ellipsoid.clone(i)),
      (this._granularity = r),
      (this._height = l),
      (this._extrudedHeight = s),
      (this._arcType = a),
      (this._polygonHierarchy = t),
      (this._perPositionHeight = o),
      (this._perPositionHeightExtrude = n),
      (this._offsetAttribute = e.offsetAttribute),
      (this._workerName = 'createPolygonOutlineGeometry'),
      (this.packedLength =
        w.PolygonGeometryLibrary.computeHierarchyPackedLength(t) + c.Ellipsoid.packedLength + 8);
  }
  g.pack = function(e, t, i) {
    return (
      (i = f.defaultValue(i, 0)),
      (i = w.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy, t, i)),
      c.Ellipsoid.pack(e._ellipsoid, t, i),
      (i += c.Ellipsoid.packedLength),
      (t[i++] = e._height),
      (t[i++] = e._extrudedHeight),
      (t[i++] = e._granularity),
      (t[i++] = e._perPositionHeightExtrude ? 1 : 0),
      (t[i++] = e._perPositionHeight ? 1 : 0),
      (t[i++] = e._arcType),
      (t[i++] = f.defaultValue(e._offsetAttribute, -1)),
      (t[i] = e.packedLength),
      t
    );
  };
  var h = c.Ellipsoid.clone(c.Ellipsoid.UNIT_SPHERE),
    m = { polygonHierarchy: {} };
  return (
    (g.unpack = function(e, t, i) {
      t = f.defaultValue(t, 0);
      var r = w.PolygonGeometryLibrary.unpackPolygonHierarchy(e, t);
      (t = r.startingIndex), delete r.startingIndex;
      var o = c.Ellipsoid.unpack(e, t, h);
      t += c.Ellipsoid.packedLength;
      var n = e[t++],
        a = e[t++],
        l = e[t++],
        s = 1 === e[t++],
        y = 1 === e[t++],
        u = e[t++],
        d = e[t++],
        p = e[t];
      return (
        v.defined(i) || (i = new g(m)),
        (i._polygonHierarchy = r),
        (i._ellipsoid = c.Ellipsoid.clone(o, i._ellipsoid)),
        (i._height = n),
        (i._extrudedHeight = a),
        (i._granularity = l),
        (i._perPositionHeight = y),
        (i._perPositionHeightExtrude = s),
        (i._arcType = u),
        (i._offsetAttribute = -1 === d ? void 0 : d),
        (i.packedLength = p),
        i
      );
    }),
    (g.fromPositions = function(e) {
      return new g({
        polygonHierarchy: {
          positions: (e = f.defaultValue(e, f.defaultValue.EMPTY_OBJECT)).positions,
        },
        height: e.height,
        extrudedHeight: e.extrudedHeight,
        ellipsoid: e.ellipsoid,
        granularity: e.granularity,
        perPositionHeight: e.perPositionHeight,
        arcType: e.arcType,
        offsetAttribute: e.offsetAttribute,
      });
    }),
    (g.createGeometry = function(e) {
      var t = e._ellipsoid,
        i = e._granularity,
        r = e._polygonHierarchy,
        o = e._perPositionHeight,
        n = e._arcType,
        a = w.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(r, !o, t);
      if (0 !== a.length) {
        var l,
          s,
          y,
          u = [],
          d = E.BMMath.chordLength(i, t.maximumRadius),
          p = e._height,
          f = e._extrudedHeight;
        if (e._perPositionHeightExtrude || !E.BMMath.equalsEpsilon(p, f, 0, E.BMMath.EPSILON2))
          for (y = 0; y < a.length; y++) {
            if (
              (((l = k(
                t,
                a[y],
                d,
                o,
                n
              )).geometry = w.PolygonGeometryLibrary.scaleToGeodeticHeightExtruded(
                l.geometry,
                p,
                f,
                t,
                o
              )),
              v.defined(e._offsetAttribute))
            ) {
              var c = l.geometry.attributes.position.values.length / 3,
                g = new Uint8Array(c);
              (g =
                e._offsetAttribute === O.GeometryOffsetAttribute.TOP
                  ? O.arrayFill(g, 1, 0, c / 2)
                  : ((s = e._offsetAttribute === O.GeometryOffsetAttribute.NONE ? 0 : 1),
                    O.arrayFill(g, s))),
                (l.geometry.attributes.applyOffset = new G.GeometryAttribute({
                  componentDatatype: _.ComponentDatatype.UNSIGNED_BYTE,
                  componentsPerAttribute: 1,
                  values: g,
                }));
            }
            u.push(l);
          }
        else
          for (y = 0; y < a.length; y++) {
            if (
              (((l = R(
                t,
                a[y],
                d,
                o,
                n
              )).geometry.attributes.position.values = C.PolygonPipeline.scaleToGeodeticHeight(
                l.geometry.attributes.position.values,
                p,
                t,
                !o
              )),
              v.defined(e._offsetAttribute))
            ) {
              var h = l.geometry.attributes.position.values.length,
                m = new Uint8Array(h / 3);
              (s = e._offsetAttribute === O.GeometryOffsetAttribute.NONE ? 0 : 1),
                O.arrayFill(m, s),
                (l.geometry.attributes.applyOffset = new G.GeometryAttribute({
                  componentDatatype: _.ComponentDatatype.UNSIGNED_BYTE,
                  componentsPerAttribute: 1,
                  values: m,
                }));
            }
            u.push(l);
          }
        var b = T.GeometryPipeline.combineInstances(u)[0],
          P = A.BoundingSphere.fromVertices(b.attributes.position.values);
        return new G.Geometry({
          attributes: b.attributes,
          indices: b.indices,
          primitiveType: b.primitiveType,
          boundingSphere: P,
          offsetAttribute: e._offsetAttribute,
        });
      }
    }),
    function(e, t) {
      return (
        v.defined(t) && (e = g.unpack(e, t)),
        (e._ellipsoid = c.Ellipsoid.clone(e._ellipsoid)),
        g.createGeometry(e)
      );
    }
  );
});
