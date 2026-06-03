define([
  './defined-30a32f90',
  './freezeObject-4d675126',
  './defaultValue-5903a66b',
  './when-1faa3867',
], function(i, e, f, o) {
  'use strict';
  return function(a) {
    var s;
    return function(e) {
      var r = e.data,
        n = [],
        t = { id: r.id, result: void 0, error: void 0 };
      return o
        .when(
          (function(e, r, n) {
            try {
              return e(r, n);
            } catch (e) {
              return o.when.reject(e);
            }
          })(a, r.parameters, n)
        )
        .then(function(e) {
          t.result = e;
        })
        .otherwise(function(e) {
          e instanceof Error
            ? (t.error = { name: e.name, message: e.message, stack: e.stack })
            : (t.error = e);
        })
        .always(function() {
          i.defined(s) || (s = f.defaultValue(self.webkitPostMessage, self.postMessage)),
            r.canTransferArrayBuffer || (n.length = 0);
          try {
            s(t, n);
          } catch (e) {
            (t.result = void 0),
              (t.error =
                'postMessage failed with error: ' +
                (function(e) {
                  var r,
                    n = e.name,
                    t = e.message;
                  r = i.defined(n) && i.defined(t) ? n + ': ' + t : e.toString();
                  var a = e.stack;
                  return i.defined(a) && (r += '\n' + a), r;
                })(e) +
                '\n  with responseMessage: ' +
                JSON.stringify(t)),
              s(t);
          }
        });
    };
  };
});
