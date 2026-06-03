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
  './createTaskProcessorWorker',
  './GeometryOffsetAttribute-718df502',
  './VertexFormat-f7b9c25e',
  './BoxGeometry-fd8dd362',
  './CylinderGeometryLibrary-e9f97f38',
  './CylinderGeometry-e35ec01e',
  './EllipsoidGeometry-14c76c5b',
  './Color-15acb289',
], function(F, e, t, n, R, r, P, a, i, d, o, s, c, Z, f, l, u, D, h, q, W, S) {
  'use strict';
  function V(e) {
    (this.offset = e.offset),
      (this.count = e.count),
      (this.color = e.color),
      (this.batchIds = e.batchIds);
  }
  var b = new R.Cartesian3(),
    p = P.Matrix4.packedLength + R.Cartesian3.packedLength,
    y = P.Matrix4.packedLength + 2,
    x = P.Matrix4.packedLength + R.Cartesian3.packedLength,
    g = R.Cartesian3.packedLength + 1,
    v = { modelMatrix: new P.Matrix4(), boundingVolume: new P.BoundingSphere() };
  function _(e, t) {
    var n = t * p,
      r = R.Cartesian3.unpack(e, n, b);
    n += R.Cartesian3.packedLength;
    var a = P.Matrix4.unpack(e, n, v.modelMatrix);
    P.Matrix4.multiplyByScale(a, r, a);
    var i = v.boundingVolume;
    return R.Cartesian3.clone(R.Cartesian3.ZERO, i.center), (i.radius = Math.sqrt(3)), v;
  }
  function j(e, t) {
    var n = t * y,
      r = e[n++],
      a = e[n++],
      i = R.Cartesian3.fromElements(r, r, a, b),
      d = P.Matrix4.unpack(e, n, v.modelMatrix);
    P.Matrix4.multiplyByScale(d, i, d);
    var o = v.boundingVolume;
    return R.Cartesian3.clone(R.Cartesian3.ZERO, o.center), (o.radius = Math.sqrt(2)), v;
  }
  function z(e, t) {
    var n = t * x,
      r = R.Cartesian3.unpack(e, n, b);
    n += R.Cartesian3.packedLength;
    var a = P.Matrix4.unpack(e, n, v.modelMatrix);
    P.Matrix4.multiplyByScale(a, r, a);
    var i = v.boundingVolume;
    return R.Cartesian3.clone(R.Cartesian3.ZERO, i.center), (i.radius = 1), v;
  }
  function N(e, t) {
    var n = t * g,
      r = e[n++],
      a = R.Cartesian3.unpack(e, n, b),
      i = P.Matrix4.fromTranslation(a, v.modelMatrix);
    P.Matrix4.multiplyByUniformScale(i, r, i);
    var d = v.boundingVolume;
    return R.Cartesian3.clone(R.Cartesian3.ZERO, d.center), (d.radius = 1), v;
  }
  var T = new R.Cartesian3();
  function Y(e, t, n, r, a) {
    if (F.defined(t)) {
      for (
        var i = n.length,
          d = r.attributes.position.values,
          o = r.indices,
          s = e.positions,
          c = e.vertexBatchIds,
          f = e.indices,
          l = e.batchIds,
          u = e.batchTableColors,
          h = e.batchedIndices,
          b = e.indexOffsets,
          p = e.indexCounts,
          y = e.boundingVolumes,
          x = e.modelMatrix,
          g = e.center,
          v = e.positionOffset,
          C = e.batchIdIndex,
          m = e.indexOffset,
          I = e.batchedIndicesOffset,
          k = 0;
        k < i;
        ++k
      ) {
        var M = a(t, k),
          B = M.modelMatrix;
        P.Matrix4.multiply(x, B, B);
        for (var w = n[k], A = d.length, O = 0; O < A; O += 3) {
          var L = R.Cartesian3.unpack(d, O, T);
          P.Matrix4.multiplyByPoint(B, L, L),
            R.Cartesian3.subtract(L, g, L),
            R.Cartesian3.pack(L, s, 3 * v + O),
            (c[C++] = w);
        }
        for (var E = o.length, U = 0; U < E; ++U) f[m + U] = o[U] + v;
        var G = k + I;
        (h[G] = new V({ offset: m, count: E, color: S.Color.fromRgba(u[w]), batchIds: [w] })),
          (l[G] = w),
          (b[G] = m),
          (p[G] = E),
          (y[G] = P.BoundingSphere.transform(M.boundingVolume, B)),
          (v += A / 3),
          (m += E);
      }
      (e.positionOffset = v),
        (e.batchIdIndex = C),
        (e.indexOffset = m),
        (e.batchedIndicesOffset += i);
    }
  }
  var H = new R.Cartesian3(),
    J = new P.Matrix4();
  function K(e, t, n) {
    var r = n.length,
      a =
        2 +
        r * P.BoundingSphere.packedLength +
        1 +
        (function(e) {
          for (var t = e.length, n = 0, r = 0; r < t; ++r)
            n += S.Color.packedLength + 3 + e[r].batchIds.length;
          return n;
        })(t),
      i = new Float64Array(a),
      d = 0;
    (i[d++] = e), (i[d++] = r);
    for (var o = 0; o < r; ++o)
      P.BoundingSphere.pack(n[o], i, d), (d += P.BoundingSphere.packedLength);
    var s = t.length;
    i[d++] = s;
    for (var c = 0; c < s; ++c) {
      var f = t[c];
      S.Color.pack(f.color, i, d),
        (d += S.Color.packedLength),
        (i[d++] = f.offset),
        (i[d++] = f.count);
      var l = f.batchIds,
        u = l.length;
      i[d++] = u;
      for (var h = 0; h < u; ++h) i[d++] = l[h];
    }
    return i;
  }
  return f(function(e, t) {
    var n = F.defined(e.boxes) ? new Float32Array(e.boxes) : void 0,
      r = F.defined(e.boxBatchIds) ? new Uint16Array(e.boxBatchIds) : void 0,
      a = F.defined(e.cylinders) ? new Float32Array(e.cylinders) : void 0,
      i = F.defined(e.cylinderBatchIds) ? new Uint16Array(e.cylinderBatchIds) : void 0,
      d = F.defined(e.ellipsoids) ? new Float32Array(e.ellipsoids) : void 0,
      o = F.defined(e.ellipsoidBatchIds) ? new Uint16Array(e.ellipsoidBatchIds) : void 0,
      s = F.defined(e.spheres) ? new Float32Array(e.spheres) : void 0,
      c = F.defined(e.sphereBatchIds) ? new Uint16Array(e.sphereBatchIds) : void 0,
      f = F.defined(n) ? r.length : 0,
      l = F.defined(a) ? i.length : 0,
      u = F.defined(d) ? o.length : 0,
      h = F.defined(s) ? c.length : 0,
      b = D.BoxGeometry.getUnitBox(),
      p = q.CylinderGeometry.getUnitCylinder(),
      y = W.EllipsoidGeometry.getUnitEllipsoid(),
      x = b.attributes.position.values,
      g = p.attributes.position.values,
      v = y.attributes.position.values,
      C = x.length * f;
    (C += g.length * l), (C += v.length * (u + h));
    var m = b.indices,
      I = p.indices,
      k = y.indices,
      M = m.length * f;
    (M += I.length * l), (M += k.length * (u + h));
    var B = new Float32Array(C),
      w = new Uint16Array(C / 3),
      A = Z.IndexDatatype.createTypedArray(C / 3, M),
      O = f + l + u + h,
      L = new Uint16Array(O),
      E = new Array(O),
      U = new Uint32Array(O),
      G = new Uint32Array(O),
      S = new Array(O);
    !(function(e) {
      var t = new Float64Array(e),
        n = 0;
      R.Cartesian3.unpack(t, n, H), (n += R.Cartesian3.packedLength), P.Matrix4.unpack(t, n, J);
    })(e.packedBuffer);
    var V = {
      batchTableColors: new Uint32Array(e.batchTableColors),
      positions: B,
      vertexBatchIds: w,
      indices: A,
      batchIds: L,
      batchedIndices: E,
      indexOffsets: U,
      indexCounts: G,
      boundingVolumes: S,
      positionOffset: 0,
      batchIdIndex: 0,
      indexOffset: 0,
      batchedIndicesOffset: 0,
      modelMatrix: J,
      center: H,
    };
    Y(V, n, r, b, _), Y(V, a, i, p, j), Y(V, d, o, y, z), Y(V, s, c, y, N);
    var T = K(A.BYTES_PER_ELEMENT, E, S);
    return (
      t.push(B.buffer, w.buffer, A.buffer),
      t.push(L.buffer, U.buffer, G.buffer),
      t.push(T.buffer),
      {
        positions: B.buffer,
        vertexBatchIds: w.buffer,
        indices: A.buffer,
        indexOffsets: U.buffer,
        indexCounts: G.buffer,
        batchIds: L.buffer,
        packedBuffer: T.buffer,
      }
    );
  });
});
