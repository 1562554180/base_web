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
  './IndexDatatype-a3dd2038',
  './IntersectionTests-dd48299d',
  './Plane-19a62994',
  './GeometryOffsetAttribute-718df502',
  './arrayRemoveDuplicates-7ced389a',
  './EllipsoidTangentPlane-3eacb5a3',
  './EllipsoidRhumbLine-62acd3ce',
  './PolygonPipeline-3dd0399b',
  './PolylineVolumeGeometryLibrary-39bd8ba7',
  './EllipsoidGeodesic-edb379ae',
  './PolylinePipeline-93ffdac4',
  './CorridorGeometryLibrary-6a294c56',
], function(S, c, e, h, R, t, g, i, r, U, F, o, Y, q, a, n, E, b, s, l, C, W, d, u, j) {
  'use strict';
  var z = new R.Cartesian3(),
    J = new R.Cartesian3(),
    K = new R.Cartesian3();
  function G(e, t) {
    var i,
      r,
      o,
      a = [],
      n = e.positions,
      s = e.corners,
      l = e.endPositions,
      d = new Y.GeometryAttributes(),
      u = 0,
      p = 0,
      f = 0;
    for (r = 0; r < n.length; r += 2)
      (u += o = n[r].length - 3), (f += (o / 3) * 4), (p += n[r + 1].length - 3);
    for (u += 3, p += 3, r = 0; r < s.length; r++) {
      i = s[r];
      var h = s[r].leftPositions;
      S.defined(h) ? (u += o = h.length) : (p += o = s[r].rightPositions.length),
        (f += (o / 3) * 2);
    }
    var y,
      c = S.defined(l);
    c && ((u += y = l[0].length - 3), (p += y), (f += 4 * (y /= 3)));
    var g,
      b,
      v,
      m,
      A,
      _,
      E = u + p,
      C = new Float64Array(E),
      G = 0,
      P = E - 1,
      T = y / 2,
      w = q.IndexDatatype.createTypedArray(E / 3, f + 4),
      L = 0;
    if (((w[L++] = G / 3), (w[L++] = (P - 2) / 3), c)) {
      a.push(G / 3), (_ = z), (A = J);
      var D = l[0];
      for (r = 0; r < T; r++)
        (_ = R.Cartesian3.fromArray(D, 3 * (T - 1 - r), _)),
          (A = R.Cartesian3.fromArray(D, 3 * (T + r), A)),
          j.CorridorGeometryLibrary.addAttribute(C, A, G),
          j.CorridorGeometryLibrary.addAttribute(C, _, void 0, P),
          (m = (b = G / 3) + 1),
          (v = (g = (P - 2) / 3) - 1),
          (w[L++] = g),
          (w[L++] = v),
          (w[L++] = b),
          (w[L++] = m),
          (G += 3),
          (P -= 3);
    }
    var k = 0,
      O = n[k++],
      V = n[k++];
    for (
      C.set(O, G), C.set(V, P - V.length + 1), o = V.length - 3, a.push(G / 3, (P - 2) / 3), r = 0;
      r < o;
      r += 3
    )
      (m = (b = G / 3) + 1),
        (v = (g = (P - 2) / 3) - 1),
        (w[L++] = g),
        (w[L++] = v),
        (w[L++] = b),
        (w[L++] = m),
        (G += 3),
        (P -= 3);
    for (r = 0; r < s.length; r++) {
      var N,
        x,
        H = (i = s[r]).leftPositions,
        I = i.rightPositions,
        M = K;
      if (S.defined(H)) {
        for (P -= 3, x = v, a.push(m), N = 0; N < H.length / 3; N++)
          (M = R.Cartesian3.fromArray(H, 3 * N, M)),
            (w[L++] = x - N - 1),
            (w[L++] = x - N),
            j.CorridorGeometryLibrary.addAttribute(C, M, void 0, P),
            (P -= 3);
        a.push(x - Math.floor(H.length / 6)),
          t === W.CornerType.BEVELED && a.push((P - 2) / 3 + 1),
          (G += 3);
      } else {
        for (G += 3, x = m, a.push(v), N = 0; N < I.length / 3; N++)
          (M = R.Cartesian3.fromArray(I, 3 * N, M)),
            (w[L++] = x + N),
            (w[L++] = x + N + 1),
            j.CorridorGeometryLibrary.addAttribute(C, M, G),
            (G += 3);
        a.push(x + Math.floor(I.length / 6)),
          t === W.CornerType.BEVELED && a.push(G / 3 - 1),
          (P -= 3);
      }
      for (
        O = n[k++],
          V = n[k++],
          O.splice(0, 3),
          V.splice(V.length - 3, 3),
          C.set(O, G),
          C.set(V, P - V.length + 1),
          o = V.length - 3,
          N = 0;
        N < V.length;
        N += 3
      )
        (b = (m = G / 3) - 1),
          (g = (v = (P - 2) / 3) + 1),
          (w[L++] = g),
          (w[L++] = v),
          (w[L++] = b),
          (w[L++] = m),
          (G += 3),
          (P -= 3);
      (G -= 3), (P += 3), a.push(G / 3, (P - 2) / 3);
    }
    if (c) {
      (G += 3), (P -= 3), (_ = z), (A = J);
      var B = l[1];
      for (r = 0; r < T; r++)
        (_ = R.Cartesian3.fromArray(B, 3 * (y - r - 1), _)),
          (A = R.Cartesian3.fromArray(B, 3 * r, A)),
          j.CorridorGeometryLibrary.addAttribute(C, _, void 0, P),
          j.CorridorGeometryLibrary.addAttribute(C, A, G),
          (b = (m = G / 3) - 1),
          (g = (v = (P - 2) / 3) + 1),
          (w[L++] = g),
          (w[L++] = v),
          (w[L++] = b),
          (w[L++] = m),
          (G += 3),
          (P -= 3);
      a.push(G / 3);
    } else a.push(G / 3, (P - 2) / 3);
    return (
      (w[L++] = G / 3),
      (w[L++] = (P - 2) / 3),
      (d.position = new F.GeometryAttribute({
        componentDatatype: U.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: C,
      })),
      { attributes: d, indices: w, wallIndices: a }
    );
  }
  function y(e) {
    var t = (e = h.defaultValue(e, h.defaultValue.EMPTY_OBJECT)).positions,
      i = e.width,
      r = h.defaultValue(e.height, 0),
      o = h.defaultValue(e.extrudedHeight, r);
    (this._positions = t),
      (this._ellipsoid = R.Ellipsoid.clone(h.defaultValue(e.ellipsoid, R.Ellipsoid.WGS84))),
      (this._width = i),
      (this._height = Math.max(r, o)),
      (this._extrudedHeight = Math.min(r, o)),
      (this._cornerType = h.defaultValue(e.cornerType, W.CornerType.ROUNDED)),
      (this._granularity = h.defaultValue(e.granularity, c.BMMath.RADIANS_PER_DEGREE)),
      (this._offsetAttribute = e.offsetAttribute),
      (this._workerName = 'createCorridorOutlineGeometry'),
      (this.packedLength = 1 + t.length * R.Cartesian3.packedLength + R.Ellipsoid.packedLength + 6);
  }
  y.pack = function(e, t, i) {
    i = h.defaultValue(i, 0);
    var r = e._positions,
      o = r.length;
    t[i++] = o;
    for (var a = 0; a < o; ++a, i += R.Cartesian3.packedLength) R.Cartesian3.pack(r[a], t, i);
    return (
      R.Ellipsoid.pack(e._ellipsoid, t, i),
      (i += R.Ellipsoid.packedLength),
      (t[i++] = e._width),
      (t[i++] = e._height),
      (t[i++] = e._extrudedHeight),
      (t[i++] = e._cornerType),
      (t[i++] = e._granularity),
      (t[i] = h.defaultValue(e._offsetAttribute, -1)),
      t
    );
  };
  var v = R.Ellipsoid.clone(R.Ellipsoid.UNIT_SPHERE),
    m = {
      positions: void 0,
      ellipsoid: v,
      width: void 0,
      height: void 0,
      extrudedHeight: void 0,
      cornerType: void 0,
      granularity: void 0,
      offsetAttribute: void 0,
    };
  return (
    (y.unpack = function(e, t, i) {
      t = h.defaultValue(t, 0);
      for (var r = e[t++], o = new Array(r), a = 0; a < r; ++a, t += R.Cartesian3.packedLength)
        o[a] = R.Cartesian3.unpack(e, t);
      var n = R.Ellipsoid.unpack(e, t, v);
      t += R.Ellipsoid.packedLength;
      var s = e[t++],
        l = e[t++],
        d = e[t++],
        u = e[t++],
        p = e[t++],
        f = e[t];
      return S.defined(i)
        ? ((i._positions = o),
          (i._ellipsoid = R.Ellipsoid.clone(n, i._ellipsoid)),
          (i._width = s),
          (i._height = l),
          (i._extrudedHeight = d),
          (i._cornerType = u),
          (i._granularity = p),
          (i._offsetAttribute = -1 === f ? void 0 : f),
          i)
        : ((m.positions = o),
          (m.width = s),
          (m.height = l),
          (m.extrudedHeight = d),
          (m.cornerType = u),
          (m.granularity = p),
          (m.offsetAttribute = -1 === f ? void 0 : f),
          new y(m));
    }),
    (y.createGeometry = function(e) {
      var t = e._positions,
        i = e._width,
        r = e._ellipsoid;
      t = (function(e, t) {
        for (var i = 0; i < e.length; i++) e[i] = t.scaleToGeodeticSurface(e[i], e[i]);
        return e;
      })(t, r);
      var o = b.arrayRemoveDuplicates(t, R.Cartesian3.equalsEpsilon);
      if (!(o.length < 2 || i <= 0)) {
        var a,
          n = e._height,
          s = e._extrudedHeight,
          l = !c.BMMath.equalsEpsilon(n, s, 0, c.BMMath.EPSILON2),
          d = {
            ellipsoid: r,
            positions: o,
            width: i,
            cornerType: e._cornerType,
            granularity: e._granularity,
            saveAttributes: !1,
          };
        if (l)
          (d.height = n),
            (d.extrudedHeight = s),
            (d.offsetAttribute = e._offsetAttribute),
            (a = (function(e) {
              var t = e.ellipsoid,
                i = G(j.CorridorGeometryLibrary.computePositions(e), e.cornerType),
                r = i.wallIndices,
                o = e.height,
                a = e.extrudedHeight,
                n = i.attributes,
                s = i.indices,
                l = n.position.values,
                d = l.length,
                u = new Float64Array(d);
              u.set(l);
              var p,
                f = new Float64Array(2 * d);
              if (
                ((l = C.PolygonPipeline.scaleToGeodeticHeight(l, o, t)),
                (u = C.PolygonPipeline.scaleToGeodeticHeight(u, a, t)),
                f.set(l),
                f.set(u, d),
                (n.position.values = f),
                (d /= 3),
                S.defined(e.offsetAttribute))
              ) {
                var h = new Uint8Array(2 * d);
                if (e.offsetAttribute === E.GeometryOffsetAttribute.TOP)
                  h = E.arrayFill(h, 1, 0, d);
                else {
                  var y = e.offsetAttribute === E.GeometryOffsetAttribute.NONE ? 0 : 1;
                  h = E.arrayFill(h, y);
                }
                n.applyOffset = new F.GeometryAttribute({
                  componentDatatype: U.ComponentDatatype.UNSIGNED_BYTE,
                  componentsPerAttribute: 1,
                  values: h,
                });
              }
              var c = s.length,
                g = q.IndexDatatype.createTypedArray(f.length / 3, 2 * (c + r.length));
              g.set(s);
              var b,
                v,
                m = c;
              for (p = 0; p < c; p += 2) {
                var A = s[p],
                  _ = s[p + 1];
                (g[m++] = A + d), (g[m++] = _ + d);
              }
              for (p = 0; p < r.length; p++) (v = (b = r[p]) + d), (g[m++] = b), (g[m++] = v);
              return { attributes: n, indices: g };
            })(d));
        else if (
          (((a = G(
            j.CorridorGeometryLibrary.computePositions(d),
            d.cornerType
          )).attributes.position.values = C.PolygonPipeline.scaleToGeodeticHeight(
            a.attributes.position.values,
            n,
            r
          )),
          S.defined(e._offsetAttribute))
        ) {
          var u = a.attributes.position.values.length,
            p = new Uint8Array(u / 3),
            f = e._offsetAttribute === E.GeometryOffsetAttribute.NONE ? 0 : 1;
          E.arrayFill(p, f),
            (a.attributes.applyOffset = new F.GeometryAttribute({
              componentDatatype: U.ComponentDatatype.UNSIGNED_BYTE,
              componentsPerAttribute: 1,
              values: p,
            }));
        }
        var h = a.attributes,
          y = g.BoundingSphere.fromVertices(h.position.values, void 0, 3);
        return new F.Geometry({
          attributes: h,
          indices: a.indices,
          primitiveType: F.PrimitiveType.LINES,
          boundingSphere: y,
          offsetAttribute: e._offsetAttribute,
        });
      }
    }),
    function(e, t) {
      return (
        S.defined(t) && (e = y.unpack(e, t)),
        (e._ellipsoid = R.Ellipsoid.clone(e._ellipsoid)),
        y.createGeometry(e)
      );
    }
  );
});
