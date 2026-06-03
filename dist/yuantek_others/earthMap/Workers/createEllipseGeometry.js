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
  './VertexFormat-f7b9c25e',
  './EllipseGeometryLibrary-b1a5ccfa',
  './GeometryInstance-23fe87b0',
  './EllipseGeometry-be88de37',
], function(r, e, t, a, n, i, d, o, s, c, f, b, l, m, p, u, y, G, E, C, A, _, I, P) {
  'use strict';
  return function(e, t) {
    return (
      r.defined(t) && (e = P.EllipseGeometry.unpack(e, t)),
      (e._center = n.Cartesian3.clone(e._center)),
      (e._ellipsoid = n.Ellipsoid.clone(e._ellipsoid)),
      P.EllipseGeometry.createGeometry(e)
    );
  };
});
