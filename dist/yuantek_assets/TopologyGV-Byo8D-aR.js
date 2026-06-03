import { pZ as ui, bm as Wu, R as ie, j as W } from './bootstrap-CaGnHU9H.js';
import {
  l as fi,
  m as Ys,
  n as Yu,
  o as ci,
  p as di,
  r as Ie,
  e as Le,
  f as de,
  q as hi,
  c as zu,
  s as Ku,
  t as li,
  d as vi,
  k as Ge,
  u as Hu,
  i as Xu,
  v as zs,
  w as Ks,
  x as pi,
  y as gi,
  b as yi,
  a as mi,
  h as Hs,
  g as Zu,
  z as Xs,
  j as Ju,
  A as Qu,
  B as ef,
} from './_baseSet-BT-05xLc.js';
import {
  y as Ae,
  z as _i,
  A as rf,
  B as Se,
  C as bi,
  p as nf,
  q as Zs,
  D as Js,
  h as qi,
  E as Ne,
  t as Qs,
  v as xi,
  d as wi,
  e as eu,
  f as ru,
  i as nu,
  F as Be,
  o as $e,
  G as tu,
  b as tf,
  s as af,
  g as of,
  j as sf,
  k as Ue,
  l as iu,
  c as au,
  H as ou,
  x as uf,
  I as ff,
  J as su,
  m as cf,
  w as df,
  K as hf,
  L as lf,
  r as vf,
} from './toInteger-B7KQihtg.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
var Ke, ki;
function pf() {
  if (ki) return Ke;
  ki = 1;
  var e = fi();
  function u() {
    (this.__data__ = new e()), (this.size = 0);
  }
  return (Ke = u), Ke;
}
var He, Pi;
function gf() {
  if (Pi) return He;
  Pi = 1;
  function e(u) {
    var i = this.__data__,
      t = i.delete(u);
    return (this.size = i.size), t;
  }
  return (He = e), He;
}
var Xe, Ti;
function yf() {
  if (Ti) return Xe;
  Ti = 1;
  function e(u) {
    return this.__data__.get(u);
  }
  return (Xe = e), Xe;
}
var Ze, Oi;
function mf() {
  if (Oi) return Ze;
  Oi = 1;
  function e(u) {
    return this.__data__.has(u);
  }
  return (Ze = e), Ze;
}
var Je, Li;
function _f() {
  if (Li) return Je;
  Li = 1;
  var e = fi(),
    u = Ys(),
    i = Yu(),
    t = 200;
  function r(a, o) {
    var n = this.__data__;
    if (n instanceof e) {
      var f = n.__data__;
      if (!u || f.length < t - 1) return f.push([a, o]), (this.size = ++n.size), this;
      n = this.__data__ = new i(f);
    }
    return n.set(a, o), (this.size = n.size), this;
  }
  return (Je = r), Je;
}
var Qe, Ni;
function Ve() {
  if (Ni) return Qe;
  Ni = 1;
  var e = fi(),
    u = pf(),
    i = gf(),
    t = yf(),
    r = mf(),
    a = _f();
  function o(n) {
    var f = (this.__data__ = new e(n));
    this.size = f.size;
  }
  return (
    (o.prototype.clear = u),
    (o.prototype.delete = i),
    (o.prototype.get = t),
    (o.prototype.has = r),
    (o.prototype.set = a),
    (Qe = o),
    Qe
  );
}
var er, Fi;
function Fe() {
  if (Fi) return er;
  Fi = 1;
  var e = ci(),
    u = di();
  function i(t, r, a, o) {
    var n = !a;
    a || (a = {});
    for (var f = -1, c = r.length; ++f < c; ) {
      var s = r[f],
        d = o ? o(a[s], t[s], s, a, t) : void 0;
      d === void 0 && (d = t[s]), n ? u(a, s, d) : e(a, s, d);
    }
    return a;
  }
  return (er = i), er;
}
var rr, Di;
function bf() {
  if (Di) return rr;
  Di = 1;
  var e = Fe(),
    u = Ae();
  function i(t, r) {
    return t && e(r, u(r), t);
  }
  return (rr = i), rr;
}
var nr, ji;
function qf() {
  if (ji) return nr;
  ji = 1;
  function e(u) {
    var i = [];
    if (u != null) for (var t in Object(u)) i.push(t);
    return i;
  }
  return (nr = e), nr;
}
var tr, Gi;
function xf() {
  if (Gi) return tr;
  Gi = 1;
  var e = Ie(),
    u = _i(),
    i = qf(),
    t = Object.prototype,
    r = t.hasOwnProperty;
  function a(o) {
    if (!e(o)) return i(o);
    var n = u(o),
      f = [];
    for (var c in o) (c == 'constructor' && (n || !r.call(o, c))) || f.push(c);
    return f;
  }
  return (tr = a), tr;
}
var ir, Bi;
function Me() {
  if (Bi) return ir;
  Bi = 1;
  var e = rf(),
    u = xf(),
    i = Se();
  function t(r) {
    return i(r) ? e(r, !0) : u(r);
  }
  return (ir = t), ir;
}
var ar, $i;
function wf() {
  if ($i) return ar;
  $i = 1;
  var e = Fe(),
    u = Me();
  function i(t, r) {
    return t && e(r, u(r), t);
  }
  return (ar = i), ar;
}
var Oe = { exports: {} };
Oe.exports;
var Ui;
function uu() {
  return (
    Ui ||
      ((Ui = 1),
      (function(e, u) {
        var i = Le(),
          t = u && !u.nodeType && u,
          r = t && !0 && e && !e.nodeType && e,
          a = r && r.exports === t,
          o = a ? i.Buffer : void 0,
          n = o ? o.allocUnsafe : void 0;
        function f(c, s) {
          if (s) return c.slice();
          var d = c.length,
            h = n ? n(d) : new c.constructor(d);
          return c.copy(h), h;
        }
        e.exports = f;
      })(Oe, Oe.exports)),
    Oe.exports
  );
}
var or, Vi;
function fu() {
  if (Vi) return or;
  Vi = 1;
  function e(u, i) {
    for (var t = -1, r = u == null ? 0 : u.length, a = 0, o = []; ++t < r; ) {
      var n = u[t];
      i(n, t, u) && (o[a++] = n);
    }
    return o;
  }
  return (or = e), or;
}
var sr, Wi;
function cu() {
  if (Wi) return sr;
  Wi = 1;
  function e() {
    return [];
  }
  return (sr = e), sr;
}
var ur, Yi;
function Ei() {
  if (Yi) return ur;
  Yi = 1;
  var e = fu(),
    u = cu(),
    i = Object.prototype,
    t = i.propertyIsEnumerable,
    r = Object.getOwnPropertySymbols,
    a = r
      ? function(o) {
          return o == null
            ? []
            : ((o = Object(o)),
              e(r(o), function(n) {
                return t.call(o, n);
              }));
        }
      : u;
  return (ur = a), ur;
}
var fr, zi;
function Ef() {
  if (zi) return fr;
  zi = 1;
  var e = Fe(),
    u = Ei();
  function i(t, r) {
    return e(t, u(t), r);
  }
  return (fr = i), fr;
}
var cr, Ki;
function Ri() {
  if (Ki) return cr;
  Ki = 1;
  function e(u, i) {
    for (var t = -1, r = i.length, a = u.length; ++t < r; ) u[a + t] = i[t];
    return u;
  }
  return (cr = e), cr;
}
var dr, Hi;
function du() {
  if (Hi) return dr;
  Hi = 1;
  var e = Ri(),
    u = bi(),
    i = Ei(),
    t = cu(),
    r = Object.getOwnPropertySymbols,
    a = r
      ? function(o) {
          for (var n = []; o; ) e(n, i(o)), (o = u(o));
          return n;
        }
      : t;
  return (dr = a), dr;
}
var hr, Xi;
function Rf() {
  if (Xi) return hr;
  Xi = 1;
  var e = Fe(),
    u = du();
  function i(t, r) {
    return e(t, u(t), r);
  }
  return (hr = i), hr;
}
var lr, Zi;
function hu() {
  if (Zi) return lr;
  Zi = 1;
  var e = Ri(),
    u = de();
  function i(t, r, a) {
    var o = r(t);
    return u(t) ? o : e(o, a(t));
  }
  return (lr = i), lr;
}
var vr, Ji;
function lu() {
  if (Ji) return vr;
  Ji = 1;
  var e = hu(),
    u = Ei(),
    i = Ae();
  function t(r) {
    return e(r, i, u);
  }
  return (vr = t), vr;
}
var pr, Qi;
function If() {
  if (Qi) return pr;
  Qi = 1;
  var e = hu(),
    u = du(),
    i = Me();
  function t(r) {
    return e(r, i, u);
  }
  return (pr = t), pr;
}
var gr, ea;
function Af() {
  if (ea) return gr;
  ea = 1;
  var e = hi(),
    u = Le(),
    i = e(u, 'DataView');
  return (gr = i), gr;
}
var yr, ra;
function Sf() {
  if (ra) return yr;
  ra = 1;
  var e = hi(),
    u = Le(),
    i = e(u, 'Promise');
  return (yr = i), yr;
}
var mr, na;
function vu() {
  if (na) return mr;
  na = 1;
  var e = hi(),
    u = Le(),
    i = e(u, 'Set');
  return (mr = i), mr;
}
var _r, ta;
function ke() {
  if (ta) return _r;
  ta = 1;
  var e = Af(),
    u = Ys(),
    i = Sf(),
    t = vu(),
    r = nf(),
    a = zu(),
    o = Ku(),
    n = '[object Map]',
    f = '[object Object]',
    c = '[object Promise]',
    s = '[object Set]',
    d = '[object WeakMap]',
    h = '[object DataView]',
    l = o(e),
    q = o(u),
    y = o(i),
    v = o(t),
    m = o(r),
    g = a;
  return (
    ((e && g(new e(new ArrayBuffer(1))) != h) ||
      (u && g(new u()) != n) ||
      (i && g(i.resolve()) != c) ||
      (t && g(new t()) != s) ||
      (r && g(new r()) != d)) &&
      (g = function(p) {
        var b = a(p),
          x = b == f ? p.constructor : void 0,
          E = x ? o(x) : '';
        if (E)
          switch (E) {
            case l:
              return h;
            case q:
              return n;
            case y:
              return c;
            case v:
              return s;
            case m:
              return d;
          }
        return b;
      }),
    (_r = g),
    _r
  );
}
var br, ia;
function Mf() {
  if (ia) return br;
  ia = 1;
  var e = Object.prototype,
    u = e.hasOwnProperty;
  function i(t) {
    var r = t.length,
      a = new t.constructor(r);
    return (
      r &&
        typeof t[0] == 'string' &&
        u.call(t, 'index') &&
        ((a.index = t.index), (a.input = t.input)),
      a
    );
  }
  return (br = i), br;
}
var qr, aa;
function pu() {
  if (aa) return qr;
  aa = 1;
  var e = Le(),
    u = e.Uint8Array;
  return (qr = u), qr;
}
var xr, oa;
function Ii() {
  if (oa) return xr;
  oa = 1;
  var e = pu();
  function u(i) {
    var t = new i.constructor(i.byteLength);
    return new e(t).set(new e(i)), t;
  }
  return (xr = u), xr;
}
var wr, sa;
function Cf() {
  if (sa) return wr;
  sa = 1;
  var e = Ii();
  function u(i, t) {
    var r = t ? e(i.buffer) : i.buffer;
    return new i.constructor(r, i.byteOffset, i.byteLength);
  }
  return (wr = u), wr;
}
var Er, ua;
function kf() {
  if (ua) return Er;
  ua = 1;
  var e = /\w*$/;
  function u(i) {
    var t = new i.constructor(i.source, e.exec(i));
    return (t.lastIndex = i.lastIndex), t;
  }
  return (Er = u), Er;
}
var Rr, fa;
function Pf() {
  if (fa) return Rr;
  fa = 1;
  var e = li(),
    u = e ? e.prototype : void 0,
    i = u ? u.valueOf : void 0;
  function t(r) {
    return i ? Object(i.call(r)) : {};
  }
  return (Rr = t), Rr;
}
var Ir, ca;
function gu() {
  if (ca) return Ir;
  ca = 1;
  var e = Ii();
  function u(i, t) {
    var r = t ? e(i.buffer) : i.buffer;
    return new i.constructor(r, i.byteOffset, i.length);
  }
  return (Ir = u), Ir;
}
var Ar, da;
function Tf() {
  if (da) return Ar;
  da = 1;
  var e = Ii(),
    u = Cf(),
    i = kf(),
    t = Pf(),
    r = gu(),
    a = '[object Boolean]',
    o = '[object Date]',
    n = '[object Map]',
    f = '[object Number]',
    c = '[object RegExp]',
    s = '[object Set]',
    d = '[object String]',
    h = '[object Symbol]',
    l = '[object ArrayBuffer]',
    q = '[object DataView]',
    y = '[object Float32Array]',
    v = '[object Float64Array]',
    m = '[object Int8Array]',
    g = '[object Int16Array]',
    p = '[object Int32Array]',
    b = '[object Uint8Array]',
    x = '[object Uint8ClampedArray]',
    E = '[object Uint16Array]',
    w = '[object Uint32Array]';
  function k(P, M, G) {
    var D = P.constructor;
    switch (M) {
      case l:
        return e(P);
      case a:
      case o:
        return new D(+P);
      case q:
        return u(P, G);
      case y:
      case v:
      case m:
      case g:
      case p:
      case b:
      case x:
      case E:
      case w:
        return r(P, G);
      case n:
        return new D();
      case f:
      case d:
        return new D(P);
      case c:
        return i(P);
      case s:
        return new D();
      case h:
        return t(P);
    }
  }
  return (Ar = k), Ar;
}
var Sr, ha;
function yu() {
  if (ha) return Sr;
  ha = 1;
  var e = Zs(),
    u = bi(),
    i = _i();
  function t(r) {
    return typeof r.constructor == 'function' && !i(r) ? e(u(r)) : {};
  }
  return (Sr = t), Sr;
}
var Mr, la;
function Of() {
  if (la) return Mr;
  la = 1;
  var e = ke(),
    u = vi(),
    i = '[object Map]';
  function t(r) {
    return u(r) && e(r) == i;
  }
  return (Mr = t), Mr;
}
var Cr, va;
function Lf() {
  if (va) return Cr;
  va = 1;
  var e = Of(),
    u = qi(),
    i = Js(),
    t = i && i.isMap,
    r = t ? u(t) : e;
  return (Cr = r), Cr;
}
var kr, pa;
function Nf() {
  if (pa) return kr;
  pa = 1;
  var e = ke(),
    u = vi(),
    i = '[object Set]';
  function t(r) {
    return u(r) && e(r) == i;
  }
  return (kr = t), kr;
}
var Pr, ga;
function Ff() {
  if (ga) return Pr;
  ga = 1;
  var e = Nf(),
    u = qi(),
    i = Js(),
    t = i && i.isSet,
    r = t ? u(t) : e;
  return (Pr = r), Pr;
}
var Tr, ya;
function mu() {
  if (ya) return Tr;
  ya = 1;
  var e = Ve(),
    u = xi(),
    i = ci(),
    t = bf(),
    r = wf(),
    a = uu(),
    o = Qs(),
    n = Ef(),
    f = Rf(),
    c = lu(),
    s = If(),
    d = ke(),
    h = Mf(),
    l = Tf(),
    q = yu(),
    y = de(),
    v = Ne(),
    m = Lf(),
    g = Ie(),
    p = Ff(),
    b = Ae(),
    x = Me(),
    E = 1,
    w = 2,
    k = 4,
    P = '[object Arguments]',
    M = '[object Array]',
    G = '[object Boolean]',
    D = '[object Date]',
    U = '[object Error]',
    Y = '[object Function]',
    H = '[object GeneratorFunction]',
    te = '[object Map]',
    xe = '[object Number]',
    _e = '[object Object]',
    Pe = '[object RegExp]',
    Te = '[object Set]',
    Ce = '[object String]',
    we = '[object Symbol]',
    ge = '[object WeakMap]',
    R = '[object ArrayBuffer]',
    I = '[object DataView]',
    C = '[object Float32Array]',
    j = '[object Float64Array]',
    K = '[object Int8Array]',
    ee = '[object Int16Array]',
    re = '[object Int32Array]',
    oe = '[object Uint8Array]',
    Ee = '[object Uint8ClampedArray]',
    se = '[object Uint16Array]',
    _ = '[object Uint32Array]',
    A = {};
  (A[P] = A[M] = A[R] = A[I] = A[G] = A[D] = A[C] = A[j] = A[K] = A[ee] = A[re] = A[te] = A[xe] = A[
    _e
  ] = A[Pe] = A[Te] = A[Ce] = A[we] = A[oe] = A[Ee] = A[se] = A[_] = !0),
    (A[U] = A[Y] = A[ge] = !1);
  function F(O, z, L, B, V, Z) {
    var T,
      $ = z & E,
      S = z & w,
      N = z & k;
    if ((L && (T = V ? L(O, B, V, Z) : L(O)), T !== void 0)) return T;
    if (!g(O)) return O;
    var Q = y(O);
    if (Q) {
      if (((T = h(O)), !$)) return o(O, T);
    } else {
      var J = d(O),
        ue = J == Y || J == H;
      if (v(O)) return a(O, $);
      if (J == _e || J == P || (ue && !V)) {
        if (((T = S || ue ? {} : q(O)), !$)) return S ? f(O, r(T, O)) : n(O, t(T, O));
      } else {
        if (!A[J]) return V ? O : {};
        T = l(O, J, $);
      }
    }
    Z || (Z = new e());
    var fe = Z.get(O);
    if (fe) return fe;
    Z.set(O, T),
      p(O)
        ? O.forEach(function(ye) {
            T.add(F(ye, z, L, ye, O, Z));
          })
        : m(O) &&
          O.forEach(function(ye, me) {
            T.set(me, F(ye, z, L, me, O, Z));
          });
    var he = N ? (S ? s : c) : S ? x : b,
      be = Q ? void 0 : he(O);
    return (
      u(be || O, function(ye, me) {
        be && ((me = ye), (ye = O[me])), i(T, me, F(ye, z, L, me, O, Z));
      }),
      T
    );
  }
  return (Tr = F), Tr;
}
var Or, ma;
function Df() {
  if (ma) return Or;
  ma = 1;
  var e = mu(),
    u = 4;
  function i(t) {
    return e(t, u);
  }
  return (Or = i), Or;
}
var Lr, _a;
function jf() {
  if (_a) return Lr;
  _a = 1;
  var e = Se();
  function u(i, t) {
    return function(r, a) {
      if (r == null) return r;
      if (!e(r)) return i(r, a);
      for (
        var o = r.length, n = t ? o : -1, f = Object(r);
        (t ? n-- : ++n < o) && a(f[n], n, f) !== !1;

      );
      return r;
    };
  }
  return (Lr = u), Lr;
}
var Nr, ba;
function We() {
  if (ba) return Nr;
  ba = 1;
  var e = wi(),
    u = jf(),
    i = u(e);
  return (Nr = i), Nr;
}
var Fr, qa;
function _u() {
  if (qa) return Fr;
  qa = 1;
  var e = xi(),
    u = We(),
    i = eu(),
    t = de();
  function r(a, o) {
    var n = t(a) ? e : u;
    return n(a, i(o));
  }
  return (Fr = r), Fr;
}
var Dr, xa;
function bu() {
  return xa || ((xa = 1), (Dr = _u())), Dr;
}
var jr, wa;
function Gf() {
  if (wa) return jr;
  wa = 1;
  var e = We();
  function u(i, t) {
    var r = [];
    return (
      e(i, function(a, o, n) {
        t(a, o, n) && r.push(a);
      }),
      r
    );
  }
  return (jr = u), jr;
}
var Gr, Ea;
function Bf() {
  if (Ea) return Gr;
  Ea = 1;
  function e(u, i) {
    for (var t = -1, r = u == null ? 0 : u.length; ++t < r; ) if (i(u[t], t, u)) return !0;
    return !1;
  }
  return (Gr = e), Gr;
}
var Br, Ra;
function qu() {
  if (Ra) return Br;
  Ra = 1;
  var e = ru(),
    u = Bf(),
    i = nu(),
    t = 1,
    r = 2;
  function a(o, n, f, c, s, d) {
    var h = f & t,
      l = o.length,
      q = n.length;
    if (l != q && !(h && q > l)) return !1;
    var y = d.get(o),
      v = d.get(n);
    if (y && v) return y == n && v == o;
    var m = -1,
      g = !0,
      p = f & r ? new e() : void 0;
    for (d.set(o, n), d.set(n, o); ++m < l; ) {
      var b = o[m],
        x = n[m];
      if (c) var E = h ? c(x, b, m, n, o, d) : c(b, x, m, o, n, d);
      if (E !== void 0) {
        if (E) continue;
        g = !1;
        break;
      }
      if (p) {
        if (
          !u(n, function(w, k) {
            if (!i(p, k) && (b === w || s(b, w, f, c, d))) return p.push(k);
          })
        ) {
          g = !1;
          break;
        }
      } else if (!(b === x || s(b, x, f, c, d))) {
        g = !1;
        break;
      }
    }
    return d.delete(o), d.delete(n), g;
  }
  return (Br = a), Br;
}
var $r, Ia;
function $f() {
  if (Ia) return $r;
  Ia = 1;
  function e(u) {
    var i = -1,
      t = Array(u.size);
    return (
      u.forEach(function(r, a) {
        t[++i] = [a, r];
      }),
      t
    );
  }
  return ($r = e), $r;
}
var Ur, Aa;
function Ai() {
  if (Aa) return Ur;
  Aa = 1;
  function e(u) {
    var i = -1,
      t = Array(u.size);
    return (
      u.forEach(function(r) {
        t[++i] = r;
      }),
      t
    );
  }
  return (Ur = e), Ur;
}
var Vr, Sa;
function Uf() {
  if (Sa) return Vr;
  Sa = 1;
  var e = li(),
    u = pu(),
    i = Ge(),
    t = qu(),
    r = $f(),
    a = Ai(),
    o = 1,
    n = 2,
    f = '[object Boolean]',
    c = '[object Date]',
    s = '[object Error]',
    d = '[object Map]',
    h = '[object Number]',
    l = '[object RegExp]',
    q = '[object Set]',
    y = '[object String]',
    v = '[object Symbol]',
    m = '[object ArrayBuffer]',
    g = '[object DataView]',
    p = e ? e.prototype : void 0,
    b = p ? p.valueOf : void 0;
  function x(E, w, k, P, M, G, D) {
    switch (k) {
      case g:
        if (E.byteLength != w.byteLength || E.byteOffset != w.byteOffset) return !1;
        (E = E.buffer), (w = w.buffer);
      case m:
        return !(E.byteLength != w.byteLength || !G(new u(E), new u(w)));
      case f:
      case c:
      case h:
        return i(+E, +w);
      case s:
        return E.name == w.name && E.message == w.message;
      case l:
      case y:
        return E == w + '';
      case d:
        var U = r;
      case q:
        var Y = P & o;
        if ((U || (U = a), E.size != w.size && !Y)) return !1;
        var H = D.get(E);
        if (H) return H == w;
        (P |= n), D.set(E, w);
        var te = t(U(E), U(w), P, M, G, D);
        return D.delete(E), te;
      case v:
        if (b) return b.call(E) == b.call(w);
    }
    return !1;
  }
  return (Vr = x), Vr;
}
var Wr, Ma;
function Vf() {
  if (Ma) return Wr;
  Ma = 1;
  var e = lu(),
    u = 1,
    i = Object.prototype,
    t = i.hasOwnProperty;
  function r(a, o, n, f, c, s) {
    var d = n & u,
      h = e(a),
      l = h.length,
      q = e(o),
      y = q.length;
    if (l != y && !d) return !1;
    for (var v = l; v--; ) {
      var m = h[v];
      if (!(d ? m in o : t.call(o, m))) return !1;
    }
    var g = s.get(a),
      p = s.get(o);
    if (g && p) return g == o && p == a;
    var b = !0;
    s.set(a, o), s.set(o, a);
    for (var x = d; ++v < l; ) {
      m = h[v];
      var E = a[m],
        w = o[m];
      if (f) var k = d ? f(w, E, m, o, a, s) : f(E, w, m, a, o, s);
      if (!(k === void 0 ? E === w || c(E, w, n, f, s) : k)) {
        b = !1;
        break;
      }
      x || (x = m == 'constructor');
    }
    if (b && !x) {
      var P = a.constructor,
        M = o.constructor;
      P != M &&
        'constructor' in a &&
        'constructor' in o &&
        !(typeof P == 'function' && P instanceof P && typeof M == 'function' && M instanceof M) &&
        (b = !1);
    }
    return s.delete(a), s.delete(o), b;
  }
  return (Wr = r), Wr;
}
var Yr, Ca;
function Wf() {
  if (Ca) return Yr;
  Ca = 1;
  var e = Ve(),
    u = qu(),
    i = Uf(),
    t = Vf(),
    r = ke(),
    a = de(),
    o = Ne(),
    n = Be(),
    f = 1,
    c = '[object Arguments]',
    s = '[object Array]',
    d = '[object Object]',
    h = Object.prototype,
    l = h.hasOwnProperty;
  function q(y, v, m, g, p, b) {
    var x = a(y),
      E = a(v),
      w = x ? s : r(y),
      k = E ? s : r(v);
    (w = w == c ? d : w), (k = k == c ? d : k);
    var P = w == d,
      M = k == d,
      G = w == k;
    if (G && o(y)) {
      if (!o(v)) return !1;
      (x = !0), (P = !1);
    }
    if (G && !P)
      return b || (b = new e()), x || n(y) ? u(y, v, m, g, p, b) : i(y, v, w, m, g, p, b);
    if (!(m & f)) {
      var D = P && l.call(y, '__wrapped__'),
        U = M && l.call(v, '__wrapped__');
      if (D || U) {
        var Y = D ? y.value() : y,
          H = U ? v.value() : v;
        return b || (b = new e()), p(Y, H, m, g, b);
      }
    }
    return G ? (b || (b = new e()), t(y, v, m, g, p, b)) : !1;
  }
  return (Yr = q), Yr;
}
var zr, ka;
function xu() {
  if (ka) return zr;
  ka = 1;
  var e = Wf(),
    u = vi();
  function i(t, r, a, o, n) {
    return t === r
      ? !0
      : t == null || r == null || (!u(t) && !u(r))
        ? t !== t && r !== r
        : e(t, r, a, o, i, n);
  }
  return (zr = i), zr;
}
var Kr, Pa;
function Yf() {
  if (Pa) return Kr;
  Pa = 1;
  var e = Ve(),
    u = xu(),
    i = 1,
    t = 2;
  function r(a, o, n, f) {
    var c = n.length,
      s = c,
      d = !f;
    if (a == null) return !s;
    for (a = Object(a); c--; ) {
      var h = n[c];
      if (d && h[2] ? h[1] !== a[h[0]] : !(h[0] in a)) return !1;
    }
    for (; ++c < s; ) {
      h = n[c];
      var l = h[0],
        q = a[l],
        y = h[1];
      if (d && h[2]) {
        if (q === void 0 && !(l in a)) return !1;
      } else {
        var v = new e();
        if (f) var m = f(q, y, l, a, o, v);
        if (!(m === void 0 ? u(y, q, i | t, f, v) : m)) return !1;
      }
    }
    return !0;
  }
  return (Kr = r), Kr;
}
var Hr, Ta;
function wu() {
  if (Ta) return Hr;
  Ta = 1;
  var e = Ie();
  function u(i) {
    return i === i && !e(i);
  }
  return (Hr = u), Hr;
}
var Xr, Oa;
function zf() {
  if (Oa) return Xr;
  Oa = 1;
  var e = wu(),
    u = Ae();
  function i(t) {
    for (var r = u(t), a = r.length; a--; ) {
      var o = r[a],
        n = t[o];
      r[a] = [o, n, e(n)];
    }
    return r;
  }
  return (Xr = i), Xr;
}
var Zr, La;
function Eu() {
  if (La) return Zr;
  La = 1;
  function e(u, i) {
    return function(t) {
      return t == null ? !1 : t[u] === i && (i !== void 0 || u in Object(t));
    };
  }
  return (Zr = e), Zr;
}
var Jr, Na;
function Kf() {
  if (Na) return Jr;
  Na = 1;
  var e = Yf(),
    u = zf(),
    i = Eu();
  function t(r) {
    var a = u(r);
    return a.length == 1 && a[0][2]
      ? i(a[0][0], a[0][1])
      : function(o) {
          return o === r || e(o, r, a);
        };
  }
  return (Jr = t), Jr;
}
var Qr, Fa;
function Hf() {
  if (Fa) return Qr;
  Fa = 1;
  function e(u, i) {
    return u != null && i in Object(u);
  }
  return (Qr = e), Qr;
}
var en, Da;
function Ru() {
  if (Da) return en;
  Da = 1;
  var e = Hf(),
    u = Hu();
  function i(t, r) {
    return t != null && u(t, r, e);
  }
  return (en = i), en;
}
var rn, ja;
function Xf() {
  if (ja) return rn;
  ja = 1;
  var e = xu(),
    u = Xu(),
    i = Ru(),
    t = zs(),
    r = wu(),
    a = Eu(),
    o = Ks(),
    n = 1,
    f = 2;
  function c(s, d) {
    return t(s) && r(d)
      ? a(o(s), d)
      : function(h) {
          var l = u(h, s);
          return l === void 0 && l === d ? i(h, s) : e(d, l, n | f);
        };
  }
  return (rn = c), rn;
}
var nn, Ga;
function Iu() {
  if (Ga) return nn;
  Ga = 1;
  function e(u) {
    return function(i) {
      return i?.[u];
    };
  }
  return (nn = e), nn;
}
var tn, Ba;
function Zf() {
  if (Ba) return tn;
  Ba = 1;
  var e = pi();
  function u(i) {
    return function(t) {
      return e(t, i);
    };
  }
  return (tn = u), tn;
}
var an, $a;
function Jf() {
  if ($a) return an;
  $a = 1;
  var e = Iu(),
    u = Zf(),
    i = zs(),
    t = Ks();
  function r(a) {
    return i(a) ? e(t(a)) : u(a);
  }
  return (an = r), an;
}
var on, Ua;
function qe() {
  if (Ua) return on;
  Ua = 1;
  var e = Kf(),
    u = Xf(),
    i = $e(),
    t = de(),
    r = Jf();
  function a(o) {
    return typeof o == 'function'
      ? o
      : o == null
        ? i
        : typeof o == 'object'
          ? t(o)
            ? u(o[0], o[1])
            : e(o)
          : r(o);
  }
  return (on = a), on;
}
var sn, Va;
function Au() {
  if (Va) return sn;
  Va = 1;
  var e = fu(),
    u = Gf(),
    i = qe(),
    t = de();
  function r(a, o) {
    var n = t(a) ? e : u;
    return n(a, i(o, 3));
  }
  return (sn = r), sn;
}
var un, Wa;
function Qf() {
  if (Wa) return un;
  Wa = 1;
  var e = tu(),
    u = ke(),
    i = gi(),
    t = de(),
    r = Se(),
    a = Ne(),
    o = _i(),
    n = Be(),
    f = '[object Map]',
    c = '[object Set]',
    s = Object.prototype,
    d = s.hasOwnProperty;
  function h(l) {
    if (l == null) return !0;
    if (
      r(l) &&
      (t(l) || typeof l == 'string' || typeof l.splice == 'function' || a(l) || n(l) || i(l))
    )
      return !l.length;
    var q = u(l);
    if (q == f || q == c) return !l.size;
    if (o(l)) return !e(l).length;
    for (var y in l) if (d.call(l, y)) return !1;
    return !0;
  }
  return (un = h), un;
}
var fn, Ya;
function Su() {
  if (Ya) return fn;
  Ya = 1;
  var e = We(),
    u = Se();
  function i(t, r) {
    var a = -1,
      o = u(t) ? Array(t.length) : [];
    return (
      e(t, function(n, f, c) {
        o[++a] = r(n, f, c);
      }),
      o
    );
  }
  return (fn = i), fn;
}
var cn, za;
function Mu() {
  if (za) return cn;
  za = 1;
  var e = yi(),
    u = qe(),
    i = Su(),
    t = de();
  function r(a, o) {
    var n = t(a) ? e : i;
    return n(a, u(o, 3));
  }
  return (cn = r), cn;
}
var dn, Ka;
function ec() {
  if (Ka) return dn;
  Ka = 1;
  function e(u, i, t, r) {
    var a = -1,
      o = u == null ? 0 : u.length;
    for (r && o && (t = u[++a]); ++a < o; ) t = i(t, u[a], a, u);
    return t;
  }
  return (dn = e), dn;
}
var hn, Ha;
function rc() {
  if (Ha) return hn;
  Ha = 1;
  function e(u, i, t, r, a) {
    return (
      a(u, function(o, n, f) {
        t = r ? ((r = !1), o) : i(t, o, n, f);
      }),
      t
    );
  }
  return (hn = e), hn;
}
var ln, Xa;
function Cu() {
  if (Xa) return ln;
  Xa = 1;
  var e = ec(),
    u = We(),
    i = qe(),
    t = rc(),
    r = de();
  function a(o, n, f) {
    var c = r(o) ? e : t,
      s = arguments.length < 3;
    return c(o, i(n, 4), f, s, u);
  }
  return (ln = a), ln;
}
var vn, Za;
function nc() {
  if (Za) return vn;
  Za = 1;
  var e = Iu(),
    u = e('length');
  return (vn = u), vn;
}
var pn, Ja;
function tc() {
  if (Ja) return pn;
  Ja = 1;
  var e = '\\ud800-\\udfff',
    u = '\\u0300-\\u036f',
    i = '\\ufe20-\\ufe2f',
    t = '\\u20d0-\\u20ff',
    r = u + i + t,
    a = '\\ufe0e\\ufe0f',
    o = '\\u200d',
    n = RegExp('[' + o + e + r + a + ']');
  function f(c) {
    return n.test(c);
  }
  return (pn = f), pn;
}
var gn, Qa;
function ic() {
  if (Qa) return gn;
  Qa = 1;
  var e = '\\ud800-\\udfff',
    u = '\\u0300-\\u036f',
    i = '\\ufe20-\\ufe2f',
    t = '\\u20d0-\\u20ff',
    r = u + i + t,
    a = '\\ufe0e\\ufe0f',
    o = '[' + e + ']',
    n = '[' + r + ']',
    f = '\\ud83c[\\udffb-\\udfff]',
    c = '(?:' + n + '|' + f + ')',
    s = '[^' + e + ']',
    d = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    h = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    l = '\\u200d',
    q = c + '?',
    y = '[' + a + ']?',
    v = '(?:' + l + '(?:' + [s, d, h].join('|') + ')' + y + q + ')*',
    m = y + q + v,
    g = '(?:' + [s + n + '?', n, d, h, o].join('|') + ')',
    p = RegExp(f + '(?=' + f + ')|' + g + m, 'g');
  function b(x) {
    for (var E = (p.lastIndex = 0); p.test(x); ) ++E;
    return E;
  }
  return (gn = b), gn;
}
var yn, eo;
function ac() {
  if (eo) return yn;
  eo = 1;
  var e = nc(),
    u = tc(),
    i = ic();
  function t(r) {
    return u(r) ? i(r) : e(r);
  }
  return (yn = t), yn;
}
var mn, ro;
function oc() {
  if (ro) return mn;
  ro = 1;
  var e = tu(),
    u = ke(),
    i = Se(),
    t = tf(),
    r = ac(),
    a = '[object Map]',
    o = '[object Set]';
  function n(f) {
    if (f == null) return 0;
    if (i(f)) return t(f) ? r(f) : f.length;
    var c = u(f);
    return c == a || c == o ? f.size : e(f).length;
  }
  return (mn = n), mn;
}
var _n, no;
function sc() {
  if (no) return _n;
  no = 1;
  var e = xi(),
    u = Zs(),
    i = wi(),
    t = qe(),
    r = bi(),
    a = de(),
    o = Ne(),
    n = mi(),
    f = Ie(),
    c = Be();
  function s(d, h, l) {
    var q = a(d),
      y = q || o(d) || c(d);
    if (((h = t(h, 4)), l == null)) {
      var v = d && d.constructor;
      y ? (l = q ? new v() : []) : f(d) ? (l = n(v) ? u(r(d)) : {}) : (l = {});
    }
    return (
      (y ? e : i)(d, function(m, g, p) {
        return h(l, m, g, p);
      }),
      l
    );
  }
  return (_n = s), _n;
}
var bn, to;
function uc() {
  if (to) return bn;
  to = 1;
  var e = li(),
    u = gi(),
    i = de(),
    t = e ? e.isConcatSpreadable : void 0;
  function r(a) {
    return i(a) || u(a) || !!(t && a && a[t]);
  }
  return (bn = r), bn;
}
var qn, io;
function Si() {
  if (io) return qn;
  io = 1;
  var e = Ri(),
    u = uc();
  function i(t, r, a, o, n) {
    var f = -1,
      c = t.length;
    for (a || (a = u), n || (n = []); ++f < c; ) {
      var s = t[f];
      r > 0 && a(s) ? (r > 1 ? i(s, r - 1, a, o, n) : e(n, s)) : o || (n[n.length] = s);
    }
    return n;
  }
  return (qn = i), qn;
}
var xn, ao;
function fc() {
  if (ao) return xn;
  ao = 1;
  var e = vu(),
    u = af(),
    i = Ai(),
    t = 1 / 0,
    r =
      e && 1 / i(new e([, -0]))[1] == t
        ? function(a) {
            return new e(a);
          }
        : u;
  return (xn = r), xn;
}
var wn, oo;
function cc() {
  if (oo) return wn;
  oo = 1;
  var e = ru(),
    u = of(),
    i = sf(),
    t = nu(),
    r = fc(),
    a = Ai(),
    o = 200;
  function n(f, c, s) {
    var d = -1,
      h = u,
      l = f.length,
      q = !0,
      y = [],
      v = y;
    if (s) (q = !1), (h = i);
    else if (l >= o) {
      var m = c ? null : r(f);
      if (m) return a(m);
      (q = !1), (h = t), (v = new e());
    } else v = c ? [] : y;
    e: for (; ++d < l; ) {
      var g = f[d],
        p = c ? c(g) : g;
      if (((g = s || g !== 0 ? g : 0), q && p === p)) {
        for (var b = v.length; b--; ) if (v[b] === p) continue e;
        c && v.push(p), y.push(g);
      } else h(v, p, s) || (v !== y && v.push(p), y.push(g));
    }
    return y;
  }
  return (wn = n), wn;
}
var En, so;
function dc() {
  if (so) return En;
  so = 1;
  var e = Si(),
    u = Ue(),
    i = cc(),
    t = iu(),
    r = u(function(a) {
      return i(e(a, 1, t, !0));
    });
  return (En = r), En;
}
var Rn, uo;
function hc() {
  if (uo) return Rn;
  uo = 1;
  var e = yi();
  function u(i, t) {
    return e(t, function(r) {
      return i[r];
    });
  }
  return (Rn = u), Rn;
}
var In, fo;
function ku() {
  if (fo) return In;
  fo = 1;
  var e = hc(),
    u = Ae();
  function i(t) {
    return t == null ? [] : e(t, u(t));
  }
  return (In = i), In;
}
var An, co;
function ve() {
  if (co) return An;
  co = 1;
  var e;
  if (typeof ui == 'function')
    try {
      e = {
        clone: Df(),
        constant: ou(),
        each: bu(),
        filter: Au(),
        has: Hs(),
        isArray: de(),
        isEmpty: Qf(),
        isFunction: mi(),
        isUndefined: au(),
        keys: Ae(),
        map: Mu(),
        reduce: Cu(),
        size: oc(),
        transform: sc(),
        union: dc(),
        values: ku(),
      };
    } catch {}
  return e || (e = window._), (An = e), An;
}
var Sn, ho;
function Mi() {
  if (ho) return Sn;
  ho = 1;
  var e = ve();
  Sn = r;
  var u = '\0',
    i = '\0',
    t = '';
  function r(s) {
    (this._isDirected = e.has(s, 'directed') ? s.directed : !0),
      (this._isMultigraph = e.has(s, 'multigraph') ? s.multigraph : !1),
      (this._isCompound = e.has(s, 'compound') ? s.compound : !1),
      (this._label = void 0),
      (this._defaultNodeLabelFn = e.constant(void 0)),
      (this._defaultEdgeLabelFn = e.constant(void 0)),
      (this._nodes = {}),
      this._isCompound && ((this._parent = {}), (this._children = {}), (this._children[i] = {})),
      (this._in = {}),
      (this._preds = {}),
      (this._out = {}),
      (this._sucs = {}),
      (this._edgeObjs = {}),
      (this._edgeLabels = {});
  }
  (r.prototype._nodeCount = 0),
    (r.prototype._edgeCount = 0),
    (r.prototype.isDirected = function() {
      return this._isDirected;
    }),
    (r.prototype.isMultigraph = function() {
      return this._isMultigraph;
    }),
    (r.prototype.isCompound = function() {
      return this._isCompound;
    }),
    (r.prototype.setGraph = function(s) {
      return (this._label = s), this;
    }),
    (r.prototype.graph = function() {
      return this._label;
    }),
    (r.prototype.setDefaultNodeLabel = function(s) {
      return e.isFunction(s) || (s = e.constant(s)), (this._defaultNodeLabelFn = s), this;
    }),
    (r.prototype.nodeCount = function() {
      return this._nodeCount;
    }),
    (r.prototype.nodes = function() {
      return e.keys(this._nodes);
    }),
    (r.prototype.sources = function() {
      var s = this;
      return e.filter(this.nodes(), function(d) {
        return e.isEmpty(s._in[d]);
      });
    }),
    (r.prototype.sinks = function() {
      var s = this;
      return e.filter(this.nodes(), function(d) {
        return e.isEmpty(s._out[d]);
      });
    }),
    (r.prototype.setNodes = function(s, d) {
      var h = arguments,
        l = this;
      return (
        e.each(s, function(q) {
          h.length > 1 ? l.setNode(q, d) : l.setNode(q);
        }),
        this
      );
    }),
    (r.prototype.setNode = function(s, d) {
      return e.has(this._nodes, s)
        ? (arguments.length > 1 && (this._nodes[s] = d), this)
        : ((this._nodes[s] = arguments.length > 1 ? d : this._defaultNodeLabelFn(s)),
          this._isCompound &&
            ((this._parent[s] = i), (this._children[s] = {}), (this._children[i][s] = !0)),
          (this._in[s] = {}),
          (this._preds[s] = {}),
          (this._out[s] = {}),
          (this._sucs[s] = {}),
          ++this._nodeCount,
          this);
    }),
    (r.prototype.node = function(s) {
      return this._nodes[s];
    }),
    (r.prototype.hasNode = function(s) {
      return e.has(this._nodes, s);
    }),
    (r.prototype.removeNode = function(s) {
      var d = this;
      if (e.has(this._nodes, s)) {
        var h = function(l) {
          d.removeEdge(d._edgeObjs[l]);
        };
        delete this._nodes[s],
          this._isCompound &&
            (this._removeFromParentsChildList(s),
            delete this._parent[s],
            e.each(this.children(s), function(l) {
              d.setParent(l);
            }),
            delete this._children[s]),
          e.each(e.keys(this._in[s]), h),
          delete this._in[s],
          delete this._preds[s],
          e.each(e.keys(this._out[s]), h),
          delete this._out[s],
          delete this._sucs[s],
          --this._nodeCount;
      }
      return this;
    }),
    (r.prototype.setParent = function(s, d) {
      if (!this._isCompound) throw new Error('Cannot set parent in a non-compound graph');
      if (e.isUndefined(d)) d = i;
      else {
        d += '';
        for (var h = d; !e.isUndefined(h); h = this.parent(h))
          if (h === s)
            throw new Error('Setting ' + d + ' as parent of ' + s + ' would create a cycle');
        this.setNode(d);
      }
      return (
        this.setNode(s),
        this._removeFromParentsChildList(s),
        (this._parent[s] = d),
        (this._children[d][s] = !0),
        this
      );
    }),
    (r.prototype._removeFromParentsChildList = function(s) {
      delete this._children[this._parent[s]][s];
    }),
    (r.prototype.parent = function(s) {
      if (this._isCompound) {
        var d = this._parent[s];
        if (d !== i) return d;
      }
    }),
    (r.prototype.children = function(s) {
      if ((e.isUndefined(s) && (s = i), this._isCompound)) {
        var d = this._children[s];
        if (d) return e.keys(d);
      } else {
        if (s === i) return this.nodes();
        if (this.hasNode(s)) return [];
      }
    }),
    (r.prototype.predecessors = function(s) {
      var d = this._preds[s];
      if (d) return e.keys(d);
    }),
    (r.prototype.successors = function(s) {
      var d = this._sucs[s];
      if (d) return e.keys(d);
    }),
    (r.prototype.neighbors = function(s) {
      var d = this.predecessors(s);
      if (d) return e.union(d, this.successors(s));
    }),
    (r.prototype.isLeaf = function(s) {
      var d;
      return this.isDirected() ? (d = this.successors(s)) : (d = this.neighbors(s)), d.length === 0;
    }),
    (r.prototype.filterNodes = function(s) {
      var d = new this.constructor({
        directed: this._isDirected,
        multigraph: this._isMultigraph,
        compound: this._isCompound,
      });
      d.setGraph(this.graph());
      var h = this;
      e.each(this._nodes, function(y, v) {
        s(v) && d.setNode(v, y);
      }),
        e.each(this._edgeObjs, function(y) {
          d.hasNode(y.v) && d.hasNode(y.w) && d.setEdge(y, h.edge(y));
        });
      var l = {};
      function q(y) {
        var v = h.parent(y);
        return v === void 0 || d.hasNode(v) ? ((l[y] = v), v) : v in l ? l[v] : q(v);
      }
      return (
        this._isCompound &&
          e.each(d.nodes(), function(y) {
            d.setParent(y, q(y));
          }),
        d
      );
    }),
    (r.prototype.setDefaultEdgeLabel = function(s) {
      return e.isFunction(s) || (s = e.constant(s)), (this._defaultEdgeLabelFn = s), this;
    }),
    (r.prototype.edgeCount = function() {
      return this._edgeCount;
    }),
    (r.prototype.edges = function() {
      return e.values(this._edgeObjs);
    }),
    (r.prototype.setPath = function(s, d) {
      var h = this,
        l = arguments;
      return (
        e.reduce(s, function(q, y) {
          return l.length > 1 ? h.setEdge(q, y, d) : h.setEdge(q, y), y;
        }),
        this
      );
    }),
    (r.prototype.setEdge = function() {
      var s,
        d,
        h,
        l,
        q = !1,
        y = arguments[0];
      typeof y == 'object' && y !== null && 'v' in y
        ? ((s = y.v),
          (d = y.w),
          (h = y.name),
          arguments.length === 2 && ((l = arguments[1]), (q = !0)))
        : ((s = y),
          (d = arguments[1]),
          (h = arguments[3]),
          arguments.length > 2 && ((l = arguments[2]), (q = !0))),
        (s = '' + s),
        (d = '' + d),
        e.isUndefined(h) || (h = '' + h);
      var v = n(this._isDirected, s, d, h);
      if (e.has(this._edgeLabels, v)) return q && (this._edgeLabels[v] = l), this;
      if (!e.isUndefined(h) && !this._isMultigraph)
        throw new Error('Cannot set a named edge when isMultigraph = false');
      this.setNode(s),
        this.setNode(d),
        (this._edgeLabels[v] = q ? l : this._defaultEdgeLabelFn(s, d, h));
      var m = f(this._isDirected, s, d, h);
      return (
        (s = m.v),
        (d = m.w),
        Object.freeze(m),
        (this._edgeObjs[v] = m),
        a(this._preds[d], s),
        a(this._sucs[s], d),
        (this._in[d][v] = m),
        (this._out[s][v] = m),
        this._edgeCount++,
        this
      );
    }),
    (r.prototype.edge = function(s, d, h) {
      var l =
        arguments.length === 1 ? c(this._isDirected, arguments[0]) : n(this._isDirected, s, d, h);
      return this._edgeLabels[l];
    }),
    (r.prototype.hasEdge = function(s, d, h) {
      var l =
        arguments.length === 1 ? c(this._isDirected, arguments[0]) : n(this._isDirected, s, d, h);
      return e.has(this._edgeLabels, l);
    }),
    (r.prototype.removeEdge = function(s, d, h) {
      var l =
          arguments.length === 1 ? c(this._isDirected, arguments[0]) : n(this._isDirected, s, d, h),
        q = this._edgeObjs[l];
      return (
        q &&
          ((s = q.v),
          (d = q.w),
          delete this._edgeLabels[l],
          delete this._edgeObjs[l],
          o(this._preds[d], s),
          o(this._sucs[s], d),
          delete this._in[d][l],
          delete this._out[s][l],
          this._edgeCount--),
        this
      );
    }),
    (r.prototype.inEdges = function(s, d) {
      var h = this._in[s];
      if (h) {
        var l = e.values(h);
        return d
          ? e.filter(l, function(q) {
              return q.v === d;
            })
          : l;
      }
    }),
    (r.prototype.outEdges = function(s, d) {
      var h = this._out[s];
      if (h) {
        var l = e.values(h);
        return d
          ? e.filter(l, function(q) {
              return q.w === d;
            })
          : l;
      }
    }),
    (r.prototype.nodeEdges = function(s, d) {
      var h = this.inEdges(s, d);
      if (h) return h.concat(this.outEdges(s, d));
    });
  function a(s, d) {
    s[d] ? s[d]++ : (s[d] = 1);
  }
  function o(s, d) {
    --s[d] || delete s[d];
  }
  function n(s, d, h, l) {
    var q = '' + d,
      y = '' + h;
    if (!s && q > y) {
      var v = q;
      (q = y), (y = v);
    }
    return q + t + y + t + (e.isUndefined(l) ? u : l);
  }
  function f(s, d, h, l) {
    var q = '' + d,
      y = '' + h;
    if (!s && q > y) {
      var v = q;
      (q = y), (y = v);
    }
    var m = { v: q, w: y };
    return l && (m.name = l), m;
  }
  function c(s, d) {
    return n(s, d.v, d.w, d.name);
  }
  return Sn;
}
var Mn, lo;
function lc() {
  return lo || ((lo = 1), (Mn = '2.1.8')), Mn;
}
var Cn, vo;
function vc() {
  return vo || ((vo = 1), (Cn = { Graph: Mi(), version: lc() })), Cn;
}
var kn, po;
function pc() {
  if (po) return kn;
  po = 1;
  var e = ve(),
    u = Mi();
  kn = { write: i, read: a };
  function i(o) {
    var n = {
      options: { directed: o.isDirected(), multigraph: o.isMultigraph(), compound: o.isCompound() },
      nodes: t(o),
      edges: r(o),
    };
    return e.isUndefined(o.graph()) || (n.value = e.clone(o.graph())), n;
  }
  function t(o) {
    return e.map(o.nodes(), function(n) {
      var f = o.node(n),
        c = o.parent(n),
        s = { v: n };
      return e.isUndefined(f) || (s.value = f), e.isUndefined(c) || (s.parent = c), s;
    });
  }
  function r(o) {
    return e.map(o.edges(), function(n) {
      var f = o.edge(n),
        c = { v: n.v, w: n.w };
      return e.isUndefined(n.name) || (c.name = n.name), e.isUndefined(f) || (c.value = f), c;
    });
  }
  function a(o) {
    var n = new u(o.options).setGraph(o.value);
    return (
      e.each(o.nodes, function(f) {
        n.setNode(f.v, f.value), f.parent && n.setParent(f.v, f.parent);
      }),
      e.each(o.edges, function(f) {
        n.setEdge({ v: f.v, w: f.w, name: f.name }, f.value);
      }),
      n
    );
  }
  return kn;
}
var Pn, go;
function gc() {
  if (go) return Pn;
  go = 1;
  var e = ve();
  Pn = u;
  function u(i) {
    var t = {},
      r = [],
      a;
    function o(n) {
      e.has(t, n) ||
        ((t[n] = !0), a.push(n), e.each(i.successors(n), o), e.each(i.predecessors(n), o));
    }
    return (
      e.each(i.nodes(), function(n) {
        (a = []), o(n), a.length && r.push(a);
      }),
      r
    );
  }
  return Pn;
}
var Tn, yo;
function Pu() {
  if (yo) return Tn;
  yo = 1;
  var e = ve();
  Tn = u;
  function u() {
    (this._arr = []), (this._keyIndices = {});
  }
  return (
    (u.prototype.size = function() {
      return this._arr.length;
    }),
    (u.prototype.keys = function() {
      return this._arr.map(function(i) {
        return i.key;
      });
    }),
    (u.prototype.has = function(i) {
      return e.has(this._keyIndices, i);
    }),
    (u.prototype.priority = function(i) {
      var t = this._keyIndices[i];
      if (t !== void 0) return this._arr[t].priority;
    }),
    (u.prototype.min = function() {
      if (this.size() === 0) throw new Error('Queue underflow');
      return this._arr[0].key;
    }),
    (u.prototype.add = function(i, t) {
      var r = this._keyIndices;
      if (((i = String(i)), !e.has(r, i))) {
        var a = this._arr,
          o = a.length;
        return (r[i] = o), a.push({ key: i, priority: t }), this._decrease(o), !0;
      }
      return !1;
    }),
    (u.prototype.removeMin = function() {
      this._swap(0, this._arr.length - 1);
      var i = this._arr.pop();
      return delete this._keyIndices[i.key], this._heapify(0), i.key;
    }),
    (u.prototype.decrease = function(i, t) {
      var r = this._keyIndices[i];
      if (t > this._arr[r].priority)
        throw new Error(
          'New priority is greater than current priority. Key: ' +
            i +
            ' Old: ' +
            this._arr[r].priority +
            ' New: ' +
            t
        );
      (this._arr[r].priority = t), this._decrease(r);
    }),
    (u.prototype._heapify = function(i) {
      var t = this._arr,
        r = 2 * i,
        a = r + 1,
        o = i;
      r < t.length &&
        ((o = t[r].priority < t[o].priority ? r : o),
        a < t.length && (o = t[a].priority < t[o].priority ? a : o),
        o !== i && (this._swap(i, o), this._heapify(o)));
    }),
    (u.prototype._decrease = function(i) {
      for (
        var t = this._arr, r = t[i].priority, a;
        i !== 0 && ((a = i >> 1), !(t[a].priority < r));

      )
        this._swap(i, a), (i = a);
    }),
    (u.prototype._swap = function(i, t) {
      var r = this._arr,
        a = this._keyIndices,
        o = r[i],
        n = r[t];
      (r[i] = n), (r[t] = o), (a[n.key] = i), (a[o.key] = t);
    }),
    Tn
  );
}
var On, mo;
function Tu() {
  if (mo) return On;
  mo = 1;
  var e = ve(),
    u = Pu();
  On = t;
  var i = e.constant(1);
  function t(a, o, n, f) {
    return r(
      a,
      String(o),
      n || i,
      f ||
        function(c) {
          return a.outEdges(c);
        }
    );
  }
  function r(a, o, n, f) {
    var c = {},
      s = new u(),
      d,
      h,
      l = function(q) {
        var y = q.v !== d ? q.v : q.w,
          v = c[y],
          m = n(q),
          g = h.distance + m;
        if (m < 0)
          throw new Error(
            'dijkstra does not allow negative edge weights. Bad edge: ' + q + ' Weight: ' + m
          );
        g < v.distance && ((v.distance = g), (v.predecessor = d), s.decrease(y, g));
      };
    for (
      a.nodes().forEach(function(q) {
        var y = q === o ? 0 : Number.POSITIVE_INFINITY;
        (c[q] = { distance: y }), s.add(q, y);
      });
      s.size() > 0 && ((d = s.removeMin()), (h = c[d]), h.distance !== Number.POSITIVE_INFINITY);

    )
      f(d).forEach(l);
    return c;
  }
  return On;
}
var Ln, _o;
function yc() {
  if (_o) return Ln;
  _o = 1;
  var e = Tu(),
    u = ve();
  Ln = i;
  function i(t, r, a) {
    return u.transform(
      t.nodes(),
      function(o, n) {
        o[n] = e(t, n, r, a);
      },
      {}
    );
  }
  return Ln;
}
var Nn, bo;
function Ou() {
  if (bo) return Nn;
  bo = 1;
  var e = ve();
  Nn = u;
  function u(i) {
    var t = 0,
      r = [],
      a = {},
      o = [];
    function n(f) {
      var c = (a[f] = { onStack: !0, lowlink: t, index: t++ });
      if (
        (r.push(f),
        i.successors(f).forEach(function(h) {
          e.has(a, h)
            ? a[h].onStack && (c.lowlink = Math.min(c.lowlink, a[h].index))
            : (n(h), (c.lowlink = Math.min(c.lowlink, a[h].lowlink)));
        }),
        c.lowlink === c.index)
      ) {
        var s = [],
          d;
        do (d = r.pop()), (a[d].onStack = !1), s.push(d);
        while (f !== d);
        o.push(s);
      }
    }
    return (
      i.nodes().forEach(function(f) {
        e.has(a, f) || n(f);
      }),
      o
    );
  }
  return Nn;
}
var Fn, qo;
function mc() {
  if (qo) return Fn;
  qo = 1;
  var e = ve(),
    u = Ou();
  Fn = i;
  function i(t) {
    return e.filter(u(t), function(r) {
      return r.length > 1 || (r.length === 1 && t.hasEdge(r[0], r[0]));
    });
  }
  return Fn;
}
var Dn, xo;
function _c() {
  if (xo) return Dn;
  xo = 1;
  var e = ve();
  Dn = i;
  var u = e.constant(1);
  function i(r, a, o) {
    return t(
      r,
      a || u,
      o ||
        function(n) {
          return r.outEdges(n);
        }
    );
  }
  function t(r, a, o) {
    var n = {},
      f = r.nodes();
    return (
      f.forEach(function(c) {
        (n[c] = {}),
          (n[c][c] = { distance: 0 }),
          f.forEach(function(s) {
            c !== s && (n[c][s] = { distance: Number.POSITIVE_INFINITY });
          }),
          o(c).forEach(function(s) {
            var d = s.v === c ? s.w : s.v,
              h = a(s);
            n[c][d] = { distance: h, predecessor: c };
          });
      }),
      f.forEach(function(c) {
        var s = n[c];
        f.forEach(function(d) {
          var h = n[d];
          f.forEach(function(l) {
            var q = h[c],
              y = s[l],
              v = h[l],
              m = q.distance + y.distance;
            m < v.distance && ((v.distance = m), (v.predecessor = y.predecessor));
          });
        });
      }),
      n
    );
  }
  return Dn;
}
var jn, wo;
function Lu() {
  if (wo) return jn;
  wo = 1;
  var e = ve();
  (jn = u), (u.CycleException = i);
  function u(t) {
    var r = {},
      a = {},
      o = [];
    function n(f) {
      if (e.has(a, f)) throw new i();
      e.has(r, f) ||
        ((a[f] = !0), (r[f] = !0), e.each(t.predecessors(f), n), delete a[f], o.push(f));
    }
    if ((e.each(t.sinks(), n), e.size(r) !== t.nodeCount())) throw new i();
    return o;
  }
  function i() {}
  return (i.prototype = new Error()), jn;
}
var Gn, Eo;
function bc() {
  if (Eo) return Gn;
  Eo = 1;
  var e = Lu();
  Gn = u;
  function u(i) {
    try {
      e(i);
    } catch (t) {
      if (t instanceof e.CycleException) return !1;
      throw t;
    }
    return !0;
  }
  return Gn;
}
var Bn, Ro;
function Nu() {
  if (Ro) return Bn;
  Ro = 1;
  var e = ve();
  Bn = u;
  function u(t, r, a) {
    e.isArray(r) || (r = [r]);
    var o = (t.isDirected() ? t.successors : t.neighbors).bind(t),
      n = [],
      f = {};
    return (
      e.each(r, function(c) {
        if (!t.hasNode(c)) throw new Error('Graph does not have node: ' + c);
        i(t, c, a === 'post', f, o, n);
      }),
      n
    );
  }
  function i(t, r, a, o, n, f) {
    e.has(o, r) ||
      ((o[r] = !0),
      a || f.push(r),
      e.each(n(r), function(c) {
        i(t, c, a, o, n, f);
      }),
      a && f.push(r));
  }
  return Bn;
}
var $n, Io;
function qc() {
  if (Io) return $n;
  Io = 1;
  var e = Nu();
  $n = u;
  function u(i, t) {
    return e(i, t, 'post');
  }
  return $n;
}
var Un, Ao;
function xc() {
  if (Ao) return Un;
  Ao = 1;
  var e = Nu();
  Un = u;
  function u(i, t) {
    return e(i, t, 'pre');
  }
  return Un;
}
var Vn, So;
function wc() {
  if (So) return Vn;
  So = 1;
  var e = ve(),
    u = Mi(),
    i = Pu();
  Vn = t;
  function t(r, a) {
    var o = new u(),
      n = {},
      f = new i(),
      c;
    function s(h) {
      var l = h.v === c ? h.w : h.v,
        q = f.priority(l);
      if (q !== void 0) {
        var y = a(h);
        y < q && ((n[l] = c), f.decrease(l, y));
      }
    }
    if (r.nodeCount() === 0) return o;
    e.each(r.nodes(), function(h) {
      f.add(h, Number.POSITIVE_INFINITY), o.setNode(h);
    }),
      f.decrease(r.nodes()[0], 0);
    for (var d = !1; f.size() > 0; ) {
      if (((c = f.removeMin()), e.has(n, c))) o.setEdge(c, n[c]);
      else {
        if (d) throw new Error('Input graph is not connected: ' + r);
        d = !0;
      }
      r.nodeEdges(c).forEach(s);
    }
    return o;
  }
  return Vn;
}
var Wn, Mo;
function Ec() {
  return (
    Mo ||
      ((Mo = 1),
      (Wn = {
        components: gc(),
        dijkstra: Tu(),
        dijkstraAll: yc(),
        findCycles: mc(),
        floydWarshall: _c(),
        isAcyclic: bc(),
        postorder: qc(),
        preorder: xc(),
        prim: wc(),
        tarjan: Ou(),
        topsort: Lu(),
      })),
    Wn
  );
}
var Yn, Co;
function Rc() {
  if (Co) return Yn;
  Co = 1;
  var e = vc();
  return (Yn = { Graph: e.Graph, json: pc(), alg: Ec(), version: e.version }), Yn;
}
var zn, ko;
function pe() {
  if (ko) return zn;
  ko = 1;
  var e;
  if (typeof ui == 'function')
    try {
      e = Rc();
    } catch {}
  return e || (e = window.graphlib), (zn = e), zn;
}
var Kn, Po;
function Ic() {
  if (Po) return Kn;
  Po = 1;
  var e = mu(),
    u = 1,
    i = 4;
  function t(r) {
    return e(r, u | i);
  }
  return (Kn = t), Kn;
}
var Hn, To;
function Ye() {
  if (To) return Hn;
  To = 1;
  var e = Ge(),
    u = Se(),
    i = Zu(),
    t = Ie();
  function r(a, o, n) {
    if (!t(n)) return !1;
    var f = typeof o;
    return (f == 'number' ? u(n) && i(o, n.length) : f == 'string' && o in n) ? e(n[o], a) : !1;
  }
  return (Hn = r), Hn;
}
var Xn, Oo;
function Ac() {
  if (Oo) return Xn;
  Oo = 1;
  var e = Ue(),
    u = Ge(),
    i = Ye(),
    t = Me(),
    r = Object.prototype,
    a = r.hasOwnProperty,
    o = e(function(n, f) {
      n = Object(n);
      var c = -1,
        s = f.length,
        d = s > 2 ? f[2] : void 0;
      for (d && i(f[0], f[1], d) && (s = 1); ++c < s; )
        for (var h = f[c], l = t(h), q = -1, y = l.length; ++q < y; ) {
          var v = l[q],
            m = n[v];
          (m === void 0 || (u(m, r[v]) && !a.call(n, v))) && (n[v] = h[v]);
        }
      return n;
    });
  return (Xn = o), Xn;
}
var Zn, Lo;
function Sc() {
  if (Lo) return Zn;
  Lo = 1;
  var e = qe(),
    u = Se(),
    i = Ae();
  function t(r) {
    return function(a, o, n) {
      var f = Object(a);
      if (!u(a)) {
        var c = e(o, 3);
        (a = i(a)),
          (o = function(d) {
            return c(f[d], d, f);
          });
      }
      var s = r(a, o, n);
      return s > -1 ? f[c ? a[s] : s] : void 0;
    };
  }
  return (Zn = t), Zn;
}
var Jn, No;
function Mc() {
  if (No) return Jn;
  No = 1;
  var e = ff(),
    u = qe(),
    i = uf(),
    t = Math.max;
  function r(a, o, n) {
    var f = a == null ? 0 : a.length;
    if (!f) return -1;
    var c = n == null ? 0 : i(n);
    return c < 0 && (c = t(f + c, 0)), e(a, u(o, 3), c);
  }
  return (Jn = r), Jn;
}
var Qn, Fo;
function Cc() {
  if (Fo) return Qn;
  Fo = 1;
  var e = Sc(),
    u = Mc(),
    i = e(u);
  return (Qn = i), Qn;
}
var et, Do;
function Fu() {
  if (Do) return et;
  Do = 1;
  var e = Si();
  function u(i) {
    var t = i == null ? 0 : i.length;
    return t ? e(i, 1) : [];
  }
  return (et = u), et;
}
var rt, jo;
function kc() {
  if (jo) return rt;
  jo = 1;
  var e = su(),
    u = eu(),
    i = Me();
  function t(r, a) {
    return r == null ? r : e(r, u(a), i);
  }
  return (rt = t), rt;
}
var nt, Go;
function Pc() {
  if (Go) return nt;
  Go = 1;
  function e(u) {
    var i = u == null ? 0 : u.length;
    return i ? u[i - 1] : void 0;
  }
  return (nt = e), nt;
}
var tt, Bo;
function Tc() {
  if (Bo) return tt;
  Bo = 1;
  var e = di(),
    u = wi(),
    i = qe();
  function t(r, a) {
    var o = {};
    return (
      (a = i(a, 3)),
      u(r, function(n, f, c) {
        e(o, f, a(n, f, c));
      }),
      o
    );
  }
  return (tt = t), tt;
}
var it, $o;
function Ci() {
  if ($o) return it;
  $o = 1;
  var e = Xs();
  function u(i, t, r) {
    for (var a = -1, o = i.length; ++a < o; ) {
      var n = i[a],
        f = t(n);
      if (f != null && (c === void 0 ? f === f && !e(f) : r(f, c)))
        var c = f,
          s = n;
    }
    return s;
  }
  return (it = u), it;
}
var at, Uo;
function Oc() {
  if (Uo) return at;
  Uo = 1;
  function e(u, i) {
    return u > i;
  }
  return (at = e), at;
}
var ot, Vo;
function Lc() {
  if (Vo) return ot;
  Vo = 1;
  var e = Ci(),
    u = Oc(),
    i = $e();
  function t(r) {
    return r && r.length ? e(r, i, u) : void 0;
  }
  return (ot = t), ot;
}
var st, Wo;
function Du() {
  if (Wo) return st;
  Wo = 1;
  var e = di(),
    u = Ge();
  function i(t, r, a) {
    ((a !== void 0 && !u(t[r], a)) || (a === void 0 && !(r in t))) && e(t, r, a);
  }
  return (st = i), st;
}
var ut, Yo;
function ju() {
  if (Yo) return ut;
  Yo = 1;
  function e(u, i) {
    if (!(i === 'constructor' && typeof u[i] == 'function') && i != '__proto__') return u[i];
  }
  return (ut = e), ut;
}
var ft, zo;
function Nc() {
  if (zo) return ft;
  zo = 1;
  var e = Fe(),
    u = Me();
  function i(t) {
    return e(t, u(t));
  }
  return (ft = i), ft;
}
var ct, Ko;
function Fc() {
  if (Ko) return ct;
  Ko = 1;
  var e = Du(),
    u = uu(),
    i = gu(),
    t = Qs(),
    r = yu(),
    a = gi(),
    o = de(),
    n = iu(),
    f = Ne(),
    c = mi(),
    s = Ie(),
    d = cf(),
    h = Be(),
    l = ju(),
    q = Nc();
  function y(v, m, g, p, b, x, E) {
    var w = l(v, g),
      k = l(m, g),
      P = E.get(k);
    if (P) {
      e(v, g, P);
      return;
    }
    var M = x ? x(w, k, g + '', v, m, E) : void 0,
      G = M === void 0;
    if (G) {
      var D = o(k),
        U = !D && f(k),
        Y = !D && !U && h(k);
      (M = k),
        D || U || Y
          ? o(w)
            ? (M = w)
            : n(w)
              ? (M = t(w))
              : U
                ? ((G = !1), (M = u(k, !0)))
                : Y
                  ? ((G = !1), (M = i(k, !0)))
                  : (M = [])
          : d(k) || a(k)
            ? ((M = w), a(w) ? (M = q(w)) : (!s(w) || c(w)) && (M = r(k)))
            : (G = !1);
    }
    G && (E.set(k, M), b(M, k, p, x, E), E.delete(k)), e(v, g, M);
  }
  return (ct = y), ct;
}
var dt, Ho;
function Dc() {
  if (Ho) return dt;
  Ho = 1;
  var e = Ve(),
    u = Du(),
    i = su(),
    t = Fc(),
    r = Ie(),
    a = Me(),
    o = ju();
  function n(f, c, s, d, h) {
    f !== c &&
      i(
        c,
        function(l, q) {
          if ((h || (h = new e()), r(l))) t(f, c, q, s, n, d, h);
          else {
            var y = d ? d(o(f, q), l, q + '', f, c, h) : void 0;
            y === void 0 && (y = l), u(f, q, y);
          }
        },
        a
      );
  }
  return (dt = n), dt;
}
var ht, Xo;
function jc() {
  if (Xo) return ht;
  Xo = 1;
  var e = Ue(),
    u = Ye();
  function i(t) {
    return e(function(r, a) {
      var o = -1,
        n = a.length,
        f = n > 1 ? a[n - 1] : void 0,
        c = n > 2 ? a[2] : void 0;
      for (
        f = t.length > 3 && typeof f == 'function' ? (n--, f) : void 0,
          c && u(a[0], a[1], c) && ((f = n < 3 ? void 0 : f), (n = 1)),
          r = Object(r);
        ++o < n;

      ) {
        var s = a[o];
        s && t(r, s, o, f);
      }
      return r;
    });
  }
  return (ht = i), ht;
}
var lt, Zo;
function Gc() {
  if (Zo) return lt;
  Zo = 1;
  var e = Dc(),
    u = jc(),
    i = u(function(t, r, a) {
      e(t, r, a);
    });
  return (lt = i), lt;
}
var vt, Jo;
function Gu() {
  if (Jo) return vt;
  Jo = 1;
  function e(u, i) {
    return u < i;
  }
  return (vt = e), vt;
}
var pt, Qo;
function Bc() {
  if (Qo) return pt;
  Qo = 1;
  var e = Ci(),
    u = Gu(),
    i = $e();
  function t(r) {
    return r && r.length ? e(r, i, u) : void 0;
  }
  return (pt = t), pt;
}
var gt, es;
function $c() {
  if (es) return gt;
  es = 1;
  var e = Ci(),
    u = qe(),
    i = Gu();
  function t(r, a) {
    return r && r.length ? e(r, u(a, 2), i) : void 0;
  }
  return (gt = t), gt;
}
var yt, rs;
function Uc() {
  if (rs) return yt;
  rs = 1;
  var e = pi(),
    u = Ju(),
    i = Qu();
  function t(r, a, o) {
    for (var n = -1, f = a.length, c = {}; ++n < f; ) {
      var s = a[n],
        d = e(r, s);
      o(d, s) && u(c, i(s, r), d);
    }
    return c;
  }
  return (yt = t), yt;
}
var mt, ns;
function Vc() {
  if (ns) return mt;
  ns = 1;
  var e = Uc(),
    u = Ru();
  function i(t, r) {
    return e(t, r, function(a, o) {
      return u(t, o);
    });
  }
  return (mt = i), mt;
}
var _t, ts;
function Wc() {
  if (ts) return _t;
  ts = 1;
  var e = Fu(),
    u = hf(),
    i = df();
  function t(r) {
    return i(u(r, void 0, e), r + '');
  }
  return (_t = t), _t;
}
var bt, is;
function Yc() {
  if (is) return bt;
  is = 1;
  var e = Vc(),
    u = Wc(),
    i = u(function(t, r) {
      return t == null ? {} : e(t, r);
    });
  return (bt = i), bt;
}
var qt, as;
function zc() {
  if (as) return qt;
  as = 1;
  var e = Math.ceil,
    u = Math.max;
  function i(t, r, a, o) {
    for (var n = -1, f = u(e((r - t) / (a || 1)), 0), c = Array(f); f--; )
      (c[o ? f : ++n] = t), (t += a);
    return c;
  }
  return (qt = i), qt;
}
var xt, os;
function Kc() {
  if (os) return xt;
  os = 1;
  var e = zc(),
    u = Ye(),
    i = lf();
  function t(r) {
    return function(a, o, n) {
      return (
        n && typeof n != 'number' && u(a, o, n) && (o = n = void 0),
        (a = i(a)),
        o === void 0 ? ((o = a), (a = 0)) : (o = i(o)),
        (n = n === void 0 ? (a < o ? 1 : -1) : i(n)),
        e(a, o, n, r)
      );
    };
  }
  return (xt = t), xt;
}
var wt, ss;
function Hc() {
  if (ss) return wt;
  ss = 1;
  var e = Kc(),
    u = e();
  return (wt = u), wt;
}
var Et, us;
function Xc() {
  if (us) return Et;
  us = 1;
  function e(u, i) {
    var t = u.length;
    for (u.sort(i); t--; ) u[t] = u[t].value;
    return u;
  }
  return (Et = e), Et;
}
var Rt, fs;
function Zc() {
  if (fs) return Rt;
  fs = 1;
  var e = Xs();
  function u(i, t) {
    if (i !== t) {
      var r = i !== void 0,
        a = i === null,
        o = i === i,
        n = e(i),
        f = t !== void 0,
        c = t === null,
        s = t === t,
        d = e(t);
      if (
        (!c && !d && !n && i > t) ||
        (n && f && s && !c && !d) ||
        (a && f && s) ||
        (!r && s) ||
        !o
      )
        return 1;
      if (
        (!a && !n && !d && i < t) ||
        (d && r && o && !a && !n) ||
        (c && r && o) ||
        (!f && o) ||
        !s
      )
        return -1;
    }
    return 0;
  }
  return (Rt = u), Rt;
}
var It, cs;
function Jc() {
  if (cs) return It;
  cs = 1;
  var e = Zc();
  function u(i, t, r) {
    for (var a = -1, o = i.criteria, n = t.criteria, f = o.length, c = r.length; ++a < f; ) {
      var s = e(o[a], n[a]);
      if (s) {
        if (a >= c) return s;
        var d = r[a];
        return s * (d == 'desc' ? -1 : 1);
      }
    }
    return i.index - t.index;
  }
  return (It = u), It;
}
var At, ds;
function Qc() {
  if (ds) return At;
  ds = 1;
  var e = yi(),
    u = pi(),
    i = qe(),
    t = Su(),
    r = Xc(),
    a = qi(),
    o = Jc(),
    n = $e(),
    f = de();
  function c(s, d, h) {
    d.length
      ? (d = e(d, function(y) {
          return f(y)
            ? function(v) {
                return u(v, y.length === 1 ? y[0] : y);
              }
            : y;
        }))
      : (d = [n]);
    var l = -1;
    d = e(d, a(i));
    var q = t(s, function(y, v, m) {
      var g = e(d, function(p) {
        return p(y);
      });
      return { criteria: g, index: ++l, value: y };
    });
    return r(q, function(y, v) {
      return o(y, v, h);
    });
  }
  return (At = c), At;
}
var St, hs;
function ed() {
  if (hs) return St;
  hs = 1;
  var e = Si(),
    u = Qc(),
    i = Ue(),
    t = Ye(),
    r = i(function(a, o) {
      if (a == null) return [];
      var n = o.length;
      return (
        n > 1 && t(a, o[0], o[1]) ? (o = []) : n > 2 && t(o[0], o[1], o[2]) && (o = [o[0]]),
        u(a, e(o, 1), [])
      );
    });
  return (St = r), St;
}
var Mt, ls;
function rd() {
  if (ls) return Mt;
  ls = 1;
  var e = ef(),
    u = 0;
  function i(t) {
    var r = ++u;
    return e(t) + r;
  }
  return (Mt = i), Mt;
}
var Ct, vs;
function nd() {
  if (vs) return Ct;
  vs = 1;
  function e(u, i, t) {
    for (var r = -1, a = u.length, o = i.length, n = {}; ++r < a; ) {
      var f = r < o ? i[r] : void 0;
      t(n, u[r], f);
    }
    return n;
  }
  return (Ct = e), Ct;
}
var kt, ps;
function td() {
  if (ps) return kt;
  ps = 1;
  var e = ci(),
    u = nd();
  function i(t, r) {
    return u(t || [], r || [], e);
  }
  return (kt = i), kt;
}
var Pt, gs;
function ne() {
  if (gs) return Pt;
  gs = 1;
  var e;
  if (typeof ui == 'function')
    try {
      e = {
        cloneDeep: Ic(),
        constant: ou(),
        defaults: Ac(),
        each: bu(),
        filter: Au(),
        find: Cc(),
        flatten: Fu(),
        forEach: _u(),
        forIn: kc(),
        has: Hs(),
        isUndefined: au(),
        last: Pc(),
        map: Mu(),
        mapValues: Tc(),
        max: Lc(),
        merge: Gc(),
        min: Bc(),
        minBy: $c(),
        now: vf(),
        pick: Yc(),
        range: Hc(),
        reduce: Cu(),
        sortBy: ed(),
        uniqueId: rd(),
        values: ku(),
        zipObject: td(),
      };
    } catch {}
  return e || (e = window._), (Pt = e), Pt;
}
var Tt, ys;
function id() {
  if (ys) return Tt;
  (ys = 1), (Tt = e);
  function e() {
    var t = {};
    (t._next = t._prev = t), (this._sentinel = t);
  }
  (e.prototype.dequeue = function() {
    var t = this._sentinel,
      r = t._prev;
    if (r !== t) return u(r), r;
  }),
    (e.prototype.enqueue = function(t) {
      var r = this._sentinel;
      t._prev && t._next && u(t),
        (t._next = r._next),
        (r._next._prev = t),
        (r._next = t),
        (t._prev = r);
    }),
    (e.prototype.toString = function() {
      for (var t = [], r = this._sentinel, a = r._prev; a !== r; )
        t.push(JSON.stringify(a, i)), (a = a._prev);
      return '[' + t.join(', ') + ']';
    });
  function u(t) {
    (t._prev._next = t._next), (t._next._prev = t._prev), delete t._next, delete t._prev;
  }
  function i(t, r) {
    if (t !== '_next' && t !== '_prev') return r;
  }
  return Tt;
}
var Ot, ms;
function ad() {
  if (ms) return Ot;
  ms = 1;
  var e = ne(),
    u = pe().Graph,
    i = id();
  Ot = r;
  var t = e.constant(1);
  function r(c, s) {
    if (c.nodeCount() <= 1) return [];
    var d = n(c, s || t),
      h = a(d.graph, d.buckets, d.zeroIdx);
    return e.flatten(
      e.map(h, function(l) {
        return c.outEdges(l.v, l.w);
      }),
      !0
    );
  }
  function a(c, s, d) {
    for (var h = [], l = s[s.length - 1], q = s[0], y; c.nodeCount(); ) {
      for (; (y = q.dequeue()); ) o(c, s, d, y);
      for (; (y = l.dequeue()); ) o(c, s, d, y);
      if (c.nodeCount()) {
        for (var v = s.length - 2; v > 0; --v)
          if (((y = s[v].dequeue()), y)) {
            h = h.concat(o(c, s, d, y, !0));
            break;
          }
      }
    }
    return h;
  }
  function o(c, s, d, h, l) {
    var q = l ? [] : void 0;
    return (
      e.forEach(c.inEdges(h.v), function(y) {
        var v = c.edge(y),
          m = c.node(y.v);
        l && q.push({ v: y.v, w: y.w }), (m.out -= v), f(s, d, m);
      }),
      e.forEach(c.outEdges(h.v), function(y) {
        var v = c.edge(y),
          m = y.w,
          g = c.node(m);
        (g.in -= v), f(s, d, g);
      }),
      c.removeNode(h.v),
      q
    );
  }
  function n(c, s) {
    var d = new u(),
      h = 0,
      l = 0;
    e.forEach(c.nodes(), function(v) {
      d.setNode(v, { v, in: 0, out: 0 });
    }),
      e.forEach(c.edges(), function(v) {
        var m = d.edge(v.v, v.w) || 0,
          g = s(v),
          p = m + g;
        d.setEdge(v.v, v.w, p),
          (l = Math.max(l, (d.node(v.v).out += g))),
          (h = Math.max(h, (d.node(v.w).in += g)));
      });
    var q = e.range(l + h + 3).map(function() {
        return new i();
      }),
      y = h + 1;
    return (
      e.forEach(d.nodes(), function(v) {
        f(q, y, d.node(v));
      }),
      { graph: d, buckets: q, zeroIdx: y }
    );
  }
  function f(c, s, d) {
    d.out ? (d.in ? c[d.out - d.in + s].enqueue(d) : c[c.length - 1].enqueue(d)) : c[0].enqueue(d);
  }
  return Ot;
}
var Lt, _s;
function od() {
  if (_s) return Lt;
  _s = 1;
  var e = ne(),
    u = ad();
  Lt = { run: i, undo: r };
  function i(a) {
    var o = a.graph().acyclicer === 'greedy' ? u(a, n(a)) : t(a);
    e.forEach(o, function(f) {
      var c = a.edge(f);
      a.removeEdge(f),
        (c.forwardName = f.name),
        (c.reversed = !0),
        a.setEdge(f.w, f.v, c, e.uniqueId('rev'));
    });
    function n(f) {
      return function(c) {
        return f.edge(c).weight;
      };
    }
  }
  function t(a) {
    var o = [],
      n = {},
      f = {};
    function c(s) {
      e.has(f, s) ||
        ((f[s] = !0),
        (n[s] = !0),
        e.forEach(a.outEdges(s), function(d) {
          e.has(n, d.w) ? o.push(d) : c(d.w);
        }),
        delete n[s]);
    }
    return e.forEach(a.nodes(), c), o;
  }
  function r(a) {
    e.forEach(a.edges(), function(o) {
      var n = a.edge(o);
      if (n.reversed) {
        a.removeEdge(o);
        var f = n.forwardName;
        delete n.reversed, delete n.forwardName, a.setEdge(o.w, o.v, n, f);
      }
    });
  }
  return Lt;
}
var Nt, bs;
function ce() {
  if (bs) return Nt;
  bs = 1;
  var e = ne(),
    u = pe().Graph;
  Nt = {
    addDummyNode: i,
    simplify: t,
    asNonCompoundGraph: r,
    successorWeights: a,
    predecessorWeights: o,
    intersectRect: n,
    buildLayerMatrix: f,
    normalizeRanks: c,
    removeEmptyRanks: s,
    addBorderNode: d,
    maxRank: h,
    partition: l,
    time: q,
    notime: y,
  };
  function i(v, m, g, p) {
    var b;
    do b = e.uniqueId(p);
    while (v.hasNode(b));
    return (g.dummy = m), v.setNode(b, g), b;
  }
  function t(v) {
    var m = new u().setGraph(v.graph());
    return (
      e.forEach(v.nodes(), function(g) {
        m.setNode(g, v.node(g));
      }),
      e.forEach(v.edges(), function(g) {
        var p = m.edge(g.v, g.w) || { weight: 0, minlen: 1 },
          b = v.edge(g);
        m.setEdge(g.v, g.w, { weight: p.weight + b.weight, minlen: Math.max(p.minlen, b.minlen) });
      }),
      m
    );
  }
  function r(v) {
    var m = new u({ multigraph: v.isMultigraph() }).setGraph(v.graph());
    return (
      e.forEach(v.nodes(), function(g) {
        v.children(g).length || m.setNode(g, v.node(g));
      }),
      e.forEach(v.edges(), function(g) {
        m.setEdge(g, v.edge(g));
      }),
      m
    );
  }
  function a(v) {
    var m = e.map(v.nodes(), function(g) {
      var p = {};
      return (
        e.forEach(v.outEdges(g), function(b) {
          p[b.w] = (p[b.w] || 0) + v.edge(b).weight;
        }),
        p
      );
    });
    return e.zipObject(v.nodes(), m);
  }
  function o(v) {
    var m = e.map(v.nodes(), function(g) {
      var p = {};
      return (
        e.forEach(v.inEdges(g), function(b) {
          p[b.v] = (p[b.v] || 0) + v.edge(b).weight;
        }),
        p
      );
    });
    return e.zipObject(v.nodes(), m);
  }
  function n(v, m) {
    var g = v.x,
      p = v.y,
      b = m.x - g,
      x = m.y - p,
      E = v.width / 2,
      w = v.height / 2;
    if (!b && !x) throw new Error('Not possible to find intersection inside of the rectangle');
    var k, P;
    return (
      Math.abs(x) * E > Math.abs(b) * w
        ? (x < 0 && (w = -w), (k = (w * b) / x), (P = w))
        : (b < 0 && (E = -E), (k = E), (P = (E * x) / b)),
      { x: g + k, y: p + P }
    );
  }
  function f(v) {
    var m = e.map(e.range(h(v) + 1), function() {
      return [];
    });
    return (
      e.forEach(v.nodes(), function(g) {
        var p = v.node(g),
          b = p.rank;
        e.isUndefined(b) || (m[b][p.order] = g);
      }),
      m
    );
  }
  function c(v) {
    var m = e.min(
      e.map(v.nodes(), function(g) {
        return v.node(g).rank;
      })
    );
    e.forEach(v.nodes(), function(g) {
      var p = v.node(g);
      e.has(p, 'rank') && (p.rank -= m);
    });
  }
  function s(v) {
    var m = e.min(
        e.map(v.nodes(), function(x) {
          return v.node(x).rank;
        })
      ),
      g = [];
    e.forEach(v.nodes(), function(x) {
      var E = v.node(x).rank - m;
      g[E] || (g[E] = []), g[E].push(x);
    });
    var p = 0,
      b = v.graph().nodeRankFactor;
    e.forEach(g, function(x, E) {
      e.isUndefined(x) && E % b !== 0
        ? --p
        : p &&
          e.forEach(x, function(w) {
            v.node(w).rank += p;
          });
    });
  }
  function d(v, m, g, p) {
    var b = { width: 0, height: 0 };
    return arguments.length >= 4 && ((b.rank = g), (b.order = p)), i(v, 'border', b, m);
  }
  function h(v) {
    return e.max(
      e.map(v.nodes(), function(m) {
        var g = v.node(m).rank;
        if (!e.isUndefined(g)) return g;
      })
    );
  }
  function l(v, m) {
    var g = { lhs: [], rhs: [] };
    return (
      e.forEach(v, function(p) {
        m(p) ? g.lhs.push(p) : g.rhs.push(p);
      }),
      g
    );
  }
  function q(v, m) {
    var g = e.now();
    try {
      return m();
    } finally {
      console.log(v + ' time: ' + (e.now() - g) + 'ms');
    }
  }
  function y(v, m) {
    return m();
  }
  return Nt;
}
var Ft, qs;
function sd() {
  if (qs) return Ft;
  qs = 1;
  var e = ne(),
    u = ce();
  Ft = { run: i, undo: r };
  function i(a) {
    (a.graph().dummyChains = []),
      e.forEach(a.edges(), function(o) {
        t(a, o);
      });
  }
  function t(a, o) {
    var n = o.v,
      f = a.node(n).rank,
      c = o.w,
      s = a.node(c).rank,
      d = o.name,
      h = a.edge(o),
      l = h.labelRank;
    if (s !== f + 1) {
      a.removeEdge(o);
      var q, y, v;
      for (v = 0, ++f; f < s; ++v, ++f)
        (h.points = []),
          (y = { width: 0, height: 0, edgeLabel: h, edgeObj: o, rank: f }),
          (q = u.addDummyNode(a, 'edge', y, '_d')),
          f === l &&
            ((y.width = h.width),
            (y.height = h.height),
            (y.dummy = 'edge-label'),
            (y.labelpos = h.labelpos)),
          a.setEdge(n, q, { weight: h.weight }, d),
          v === 0 && a.graph().dummyChains.push(q),
          (n = q);
      a.setEdge(n, c, { weight: h.weight }, d);
    }
  }
  function r(a) {
    e.forEach(a.graph().dummyChains, function(o) {
      var n = a.node(o),
        f = n.edgeLabel,
        c;
      for (a.setEdge(n.edgeObj, f); n.dummy; )
        (c = a.successors(o)[0]),
          a.removeNode(o),
          f.points.push({ x: n.x, y: n.y }),
          n.dummy === 'edge-label' &&
            ((f.x = n.x), (f.y = n.y), (f.width = n.width), (f.height = n.height)),
          (o = c),
          (n = a.node(o));
    });
  }
  return Ft;
}
var Dt, xs;
function je() {
  if (xs) return Dt;
  xs = 1;
  var e = ne();
  Dt = { longestPath: u, slack: i };
  function u(t) {
    var r = {};
    function a(o) {
      var n = t.node(o);
      if (e.has(r, o)) return n.rank;
      r[o] = !0;
      var f = e.min(
        e.map(t.outEdges(o), function(c) {
          return a(c.w) - t.edge(c).minlen;
        })
      );
      return (
        (f === Number.POSITIVE_INFINITY || f === void 0 || f === null) && (f = 0), (n.rank = f)
      );
    }
    e.forEach(t.sources(), a);
  }
  function i(t, r) {
    return t.node(r.w).rank - t.node(r.v).rank - t.edge(r).minlen;
  }
  return Dt;
}
var jt, ws;
function Bu() {
  if (ws) return jt;
  ws = 1;
  var e = ne(),
    u = pe().Graph,
    i = je().slack;
  jt = t;
  function t(n) {
    var f = new u({ directed: !1 }),
      c = n.nodes()[0],
      s = n.nodeCount();
    f.setNode(c, {});
    for (var d, h; r(f, n) < s; )
      (d = a(f, n)), (h = f.hasNode(d.v) ? i(n, d) : -i(n, d)), o(f, n, h);
    return f;
  }
  function r(n, f) {
    function c(s) {
      e.forEach(f.nodeEdges(s), function(d) {
        var h = d.v,
          l = s === h ? d.w : h;
        !n.hasNode(l) && !i(f, d) && (n.setNode(l, {}), n.setEdge(s, l, {}), c(l));
      });
    }
    return e.forEach(n.nodes(), c), n.nodeCount();
  }
  function a(n, f) {
    return e.minBy(f.edges(), function(c) {
      if (n.hasNode(c.v) !== n.hasNode(c.w)) return i(f, c);
    });
  }
  function o(n, f, c) {
    e.forEach(n.nodes(), function(s) {
      f.node(s).rank += c;
    });
  }
  return jt;
}
var Gt, Es;
function ud() {
  if (Es) return Gt;
  Es = 1;
  var e = ne(),
    u = Bu(),
    i = je().slack,
    t = je().longestPath,
    r = pe().alg.preorder,
    a = pe().alg.postorder,
    o = ce().simplify;
  (Gt = n),
    (n.initLowLimValues = d),
    (n.initCutValues = f),
    (n.calcCutValue = s),
    (n.leaveEdge = l),
    (n.enterEdge = q),
    (n.exchangeEdges = y);
  function n(p) {
    (p = o(p)), t(p);
    var b = u(p);
    d(b), f(b, p);
    for (var x, E; (x = l(b)); ) (E = q(b, p, x)), y(b, p, x, E);
  }
  function f(p, b) {
    var x = a(p, p.nodes());
    (x = x.slice(0, x.length - 1)),
      e.forEach(x, function(E) {
        c(p, b, E);
      });
  }
  function c(p, b, x) {
    var E = p.node(x),
      w = E.parent;
    p.edge(x, w).cutvalue = s(p, b, x);
  }
  function s(p, b, x) {
    var E = p.node(x),
      w = E.parent,
      k = !0,
      P = b.edge(x, w),
      M = 0;
    return (
      P || ((k = !1), (P = b.edge(w, x))),
      (M = P.weight),
      e.forEach(b.nodeEdges(x), function(G) {
        var D = G.v === x,
          U = D ? G.w : G.v;
        if (U !== w) {
          var Y = D === k,
            H = b.edge(G).weight;
          if (((M += Y ? H : -H), m(p, x, U))) {
            var te = p.edge(x, U).cutvalue;
            M += Y ? -te : te;
          }
        }
      }),
      M
    );
  }
  function d(p, b) {
    arguments.length < 2 && (b = p.nodes()[0]), h(p, {}, 1, b);
  }
  function h(p, b, x, E, w) {
    var k = x,
      P = p.node(E);
    return (
      (b[E] = !0),
      e.forEach(p.neighbors(E), function(M) {
        e.has(b, M) || (x = h(p, b, x, M, E));
      }),
      (P.low = k),
      (P.lim = x++),
      w ? (P.parent = w) : delete P.parent,
      x
    );
  }
  function l(p) {
    return e.find(p.edges(), function(b) {
      return p.edge(b).cutvalue < 0;
    });
  }
  function q(p, b, x) {
    var E = x.v,
      w = x.w;
    b.hasEdge(E, w) || ((E = x.w), (w = x.v));
    var k = p.node(E),
      P = p.node(w),
      M = k,
      G = !1;
    k.lim > P.lim && ((M = P), (G = !0));
    var D = e.filter(b.edges(), function(U) {
      return G === g(p, p.node(U.v), M) && G !== g(p, p.node(U.w), M);
    });
    return e.minBy(D, function(U) {
      return i(b, U);
    });
  }
  function y(p, b, x, E) {
    var w = x.v,
      k = x.w;
    p.removeEdge(w, k), p.setEdge(E.v, E.w, {}), d(p), f(p, b), v(p, b);
  }
  function v(p, b) {
    var x = e.find(p.nodes(), function(w) {
        return !b.node(w).parent;
      }),
      E = r(p, x);
    (E = E.slice(1)),
      e.forEach(E, function(w) {
        var k = p.node(w).parent,
          P = b.edge(w, k),
          M = !1;
        P || ((P = b.edge(k, w)), (M = !0)),
          (b.node(w).rank = b.node(k).rank + (M ? P.minlen : -P.minlen));
      });
  }
  function m(p, b, x) {
    return p.hasEdge(b, x);
  }
  function g(p, b, x) {
    return x.low <= b.lim && b.lim <= x.lim;
  }
  return Gt;
}
var Bt, Rs;
function fd() {
  if (Rs) return Bt;
  Rs = 1;
  var e = je(),
    u = e.longestPath,
    i = Bu(),
    t = ud();
  Bt = r;
  function r(f) {
    switch (f.graph().ranker) {
      case 'network-simplex':
        n(f);
        break;
      case 'tight-tree':
        o(f);
        break;
      case 'longest-path':
        a(f);
        break;
      default:
        n(f);
    }
  }
  var a = u;
  function o(f) {
    u(f), i(f);
  }
  function n(f) {
    t(f);
  }
  return Bt;
}
var $t, Is;
function cd() {
  if (Is) return $t;
  Is = 1;
  var e = ne();
  $t = u;
  function u(r) {
    var a = t(r);
    e.forEach(r.graph().dummyChains, function(o) {
      for (
        var n = r.node(o),
          f = n.edgeObj,
          c = i(r, a, f.v, f.w),
          s = c.path,
          d = c.lca,
          h = 0,
          l = s[h],
          q = !0;
        o !== f.w;

      ) {
        if (((n = r.node(o)), q)) {
          for (; (l = s[h]) !== d && r.node(l).maxRank < n.rank; ) h++;
          l === d && (q = !1);
        }
        if (!q) {
          for (; h < s.length - 1 && r.node((l = s[h + 1])).minRank <= n.rank; ) h++;
          l = s[h];
        }
        r.setParent(o, l), (o = r.successors(o)[0]);
      }
    });
  }
  function i(r, a, o, n) {
    var f = [],
      c = [],
      s = Math.min(a[o].low, a[n].low),
      d = Math.max(a[o].lim, a[n].lim),
      h,
      l;
    h = o;
    do (h = r.parent(h)), f.push(h);
    while (h && (a[h].low > s || d > a[h].lim));
    for (l = h, h = n; (h = r.parent(h)) !== l; ) c.push(h);
    return { path: f.concat(c.reverse()), lca: l };
  }
  function t(r) {
    var a = {},
      o = 0;
    function n(f) {
      var c = o;
      e.forEach(r.children(f), n), (a[f] = { low: c, lim: o++ });
    }
    return e.forEach(r.children(), n), a;
  }
  return $t;
}
var Ut, As;
function dd() {
  if (As) return Ut;
  As = 1;
  var e = ne(),
    u = ce();
  Ut = { run: i, cleanup: o };
  function i(n) {
    var f = u.addDummyNode(n, 'root', {}, '_root'),
      c = r(n),
      s = e.max(e.values(c)) - 1,
      d = 2 * s + 1;
    (n.graph().nestingRoot = f),
      e.forEach(n.edges(), function(l) {
        n.edge(l).minlen *= d;
      });
    var h = a(n) + 1;
    e.forEach(n.children(), function(l) {
      t(n, f, d, h, s, c, l);
    }),
      (n.graph().nodeRankFactor = d);
  }
  function t(n, f, c, s, d, h, l) {
    var q = n.children(l);
    if (!q.length) {
      l !== f && n.setEdge(f, l, { weight: 0, minlen: c });
      return;
    }
    var y = u.addBorderNode(n, '_bt'),
      v = u.addBorderNode(n, '_bb'),
      m = n.node(l);
    n.setParent(y, l),
      (m.borderTop = y),
      n.setParent(v, l),
      (m.borderBottom = v),
      e.forEach(q, function(g) {
        t(n, f, c, s, d, h, g);
        var p = n.node(g),
          b = p.borderTop ? p.borderTop : g,
          x = p.borderBottom ? p.borderBottom : g,
          E = p.borderTop ? s : 2 * s,
          w = b !== x ? 1 : d - h[l] + 1;
        n.setEdge(y, b, { weight: E, minlen: w, nestingEdge: !0 }),
          n.setEdge(x, v, { weight: E, minlen: w, nestingEdge: !0 });
      }),
      n.parent(l) || n.setEdge(f, y, { weight: 0, minlen: d + h[l] });
  }
  function r(n) {
    var f = {};
    function c(s, d) {
      var h = n.children(s);
      h &&
        h.length &&
        e.forEach(h, function(l) {
          c(l, d + 1);
        }),
        (f[s] = d);
    }
    return (
      e.forEach(n.children(), function(s) {
        c(s, 1);
      }),
      f
    );
  }
  function a(n) {
    return e.reduce(
      n.edges(),
      function(f, c) {
        return f + n.edge(c).weight;
      },
      0
    );
  }
  function o(n) {
    var f = n.graph();
    n.removeNode(f.nestingRoot),
      delete f.nestingRoot,
      e.forEach(n.edges(), function(c) {
        var s = n.edge(c);
        s.nestingEdge && n.removeEdge(c);
      });
  }
  return Ut;
}
var Vt, Ss;
function hd() {
  if (Ss) return Vt;
  Ss = 1;
  var e = ne(),
    u = ce();
  Vt = i;
  function i(r) {
    function a(o) {
      var n = r.children(o),
        f = r.node(o);
      if ((n.length && e.forEach(n, a), e.has(f, 'minRank'))) {
        (f.borderLeft = []), (f.borderRight = []);
        for (var c = f.minRank, s = f.maxRank + 1; c < s; ++c)
          t(r, 'borderLeft', '_bl', o, f, c), t(r, 'borderRight', '_br', o, f, c);
      }
    }
    e.forEach(r.children(), a);
  }
  function t(r, a, o, n, f, c) {
    var s = { width: 0, height: 0, rank: c, borderType: a },
      d = f[a][c - 1],
      h = u.addDummyNode(r, 'border', s, o);
    (f[a][c] = h), r.setParent(h, n), d && r.setEdge(d, h, { weight: 1 });
  }
  return Vt;
}
var Wt, Ms;
function ld() {
  if (Ms) return Wt;
  Ms = 1;
  var e = ne();
  Wt = { adjust: u, undo: i };
  function u(c) {
    var s = c.graph().rankdir.toLowerCase();
    (s === 'lr' || s === 'rl') && t(c);
  }
  function i(c) {
    var s = c.graph().rankdir.toLowerCase();
    (s === 'bt' || s === 'rl') && a(c), (s === 'lr' || s === 'rl') && (n(c), t(c));
  }
  function t(c) {
    e.forEach(c.nodes(), function(s) {
      r(c.node(s));
    }),
      e.forEach(c.edges(), function(s) {
        r(c.edge(s));
      });
  }
  function r(c) {
    var s = c.width;
    (c.width = c.height), (c.height = s);
  }
  function a(c) {
    e.forEach(c.nodes(), function(s) {
      o(c.node(s));
    }),
      e.forEach(c.edges(), function(s) {
        var d = c.edge(s);
        e.forEach(d.points, o), e.has(d, 'y') && o(d);
      });
  }
  function o(c) {
    c.y = -c.y;
  }
  function n(c) {
    e.forEach(c.nodes(), function(s) {
      f(c.node(s));
    }),
      e.forEach(c.edges(), function(s) {
        var d = c.edge(s);
        e.forEach(d.points, f), e.has(d, 'x') && f(d);
      });
  }
  function f(c) {
    var s = c.x;
    (c.x = c.y), (c.y = s);
  }
  return Wt;
}
var Yt, Cs;
function vd() {
  if (Cs) return Yt;
  Cs = 1;
  var e = ne();
  Yt = u;
  function u(i) {
    var t = {},
      r = e.filter(i.nodes(), function(c) {
        return !i.children(c).length;
      }),
      a = e.max(
        e.map(r, function(c) {
          return i.node(c).rank;
        })
      ),
      o = e.map(e.range(a + 1), function() {
        return [];
      });
    function n(c) {
      if (!e.has(t, c)) {
        t[c] = !0;
        var s = i.node(c);
        o[s.rank].push(c), e.forEach(i.successors(c), n);
      }
    }
    var f = e.sortBy(r, function(c) {
      return i.node(c).rank;
    });
    return e.forEach(f, n), o;
  }
  return Yt;
}
var zt, ks;
function pd() {
  if (ks) return zt;
  ks = 1;
  var e = ne();
  zt = u;
  function u(t, r) {
    for (var a = 0, o = 1; o < r.length; ++o) a += i(t, r[o - 1], r[o]);
    return a;
  }
  function i(t, r, a) {
    for (
      var o = e.zipObject(
          a,
          e.map(a, function(h, l) {
            return l;
          })
        ),
        n = e.flatten(
          e.map(r, function(h) {
            return e.sortBy(
              e.map(t.outEdges(h), function(l) {
                return { pos: o[l.w], weight: t.edge(l).weight };
              }),
              'pos'
            );
          }),
          !0
        ),
        f = 1;
      f < a.length;

    )
      f <<= 1;
    var c = 2 * f - 1;
    f -= 1;
    var s = e.map(new Array(c), function() {
        return 0;
      }),
      d = 0;
    return (
      e.forEach(
        n.forEach(function(h) {
          var l = h.pos + f;
          s[l] += h.weight;
          for (var q = 0; l > 0; ) l % 2 && (q += s[l + 1]), (l = (l - 1) >> 1), (s[l] += h.weight);
          d += h.weight * q;
        })
      ),
      d
    );
  }
  return zt;
}
var Kt, Ps;
function gd() {
  if (Ps) return Kt;
  Ps = 1;
  var e = ne();
  Kt = u;
  function u(i, t) {
    return e.map(t, function(r) {
      var a = i.inEdges(r);
      if (a.length) {
        var o = e.reduce(
          a,
          function(n, f) {
            var c = i.edge(f),
              s = i.node(f.v);
            return { sum: n.sum + c.weight * s.order, weight: n.weight + c.weight };
          },
          { sum: 0, weight: 0 }
        );
        return { v: r, barycenter: o.sum / o.weight, weight: o.weight };
      } else return { v: r };
    });
  }
  return Kt;
}
var Ht, Ts;
function yd() {
  if (Ts) return Ht;
  Ts = 1;
  var e = ne();
  Ht = u;
  function u(r, a) {
    var o = {};
    e.forEach(r, function(f, c) {
      var s = (o[f.v] = { indegree: 0, in: [], out: [], vs: [f.v], i: c });
      e.isUndefined(f.barycenter) || ((s.barycenter = f.barycenter), (s.weight = f.weight));
    }),
      e.forEach(a.edges(), function(f) {
        var c = o[f.v],
          s = o[f.w];
        !e.isUndefined(c) && !e.isUndefined(s) && (s.indegree++, c.out.push(o[f.w]));
      });
    var n = e.filter(o, function(f) {
      return !f.indegree;
    });
    return i(n);
  }
  function i(r) {
    var a = [];
    function o(c) {
      return function(s) {
        s.merged ||
          ((e.isUndefined(s.barycenter) ||
            e.isUndefined(c.barycenter) ||
            s.barycenter >= c.barycenter) &&
            t(c, s));
      };
    }
    function n(c) {
      return function(s) {
        s.in.push(c), --s.indegree === 0 && r.push(s);
      };
    }
    for (; r.length; ) {
      var f = r.pop();
      a.push(f), e.forEach(f.in.reverse(), o(f)), e.forEach(f.out, n(f));
    }
    return e.map(
      e.filter(a, function(c) {
        return !c.merged;
      }),
      function(c) {
        return e.pick(c, ['vs', 'i', 'barycenter', 'weight']);
      }
    );
  }
  function t(r, a) {
    var o = 0,
      n = 0;
    r.weight && ((o += r.barycenter * r.weight), (n += r.weight)),
      a.weight && ((o += a.barycenter * a.weight), (n += a.weight)),
      (r.vs = a.vs.concat(r.vs)),
      (r.barycenter = o / n),
      (r.weight = n),
      (r.i = Math.min(a.i, r.i)),
      (a.merged = !0);
  }
  return Ht;
}
var Xt, Os;
function md() {
  if (Os) return Xt;
  Os = 1;
  var e = ne(),
    u = ce();
  Xt = i;
  function i(a, o) {
    var n = u.partition(a, function(y) {
        return e.has(y, 'barycenter');
      }),
      f = n.lhs,
      c = e.sortBy(n.rhs, function(y) {
        return -y.i;
      }),
      s = [],
      d = 0,
      h = 0,
      l = 0;
    f.sort(r(!!o)),
      (l = t(s, c, l)),
      e.forEach(f, function(y) {
        (l += y.vs.length),
          s.push(y.vs),
          (d += y.barycenter * y.weight),
          (h += y.weight),
          (l = t(s, c, l));
      });
    var q = { vs: e.flatten(s, !0) };
    return h && ((q.barycenter = d / h), (q.weight = h)), q;
  }
  function t(a, o, n) {
    for (var f; o.length && (f = e.last(o)).i <= n; ) o.pop(), a.push(f.vs), n++;
    return n;
  }
  function r(a) {
    return function(o, n) {
      return o.barycenter < n.barycenter
        ? -1
        : o.barycenter > n.barycenter
          ? 1
          : a
            ? n.i - o.i
            : o.i - n.i;
    };
  }
  return Xt;
}
var Zt, Ls;
function _d() {
  if (Ls) return Zt;
  Ls = 1;
  var e = ne(),
    u = gd(),
    i = yd(),
    t = md();
  Zt = r;
  function r(n, f, c, s) {
    var d = n.children(f),
      h = n.node(f),
      l = h ? h.borderLeft : void 0,
      q = h ? h.borderRight : void 0,
      y = {};
    l &&
      (d = e.filter(d, function(x) {
        return x !== l && x !== q;
      }));
    var v = u(n, d);
    e.forEach(v, function(x) {
      if (n.children(x.v).length) {
        var E = r(n, x.v, c, s);
        (y[x.v] = E), e.has(E, 'barycenter') && o(x, E);
      }
    });
    var m = i(v, c);
    a(m, y);
    var g = t(m, s);
    if (l && ((g.vs = e.flatten([l, g.vs, q], !0)), n.predecessors(l).length)) {
      var p = n.node(n.predecessors(l)[0]),
        b = n.node(n.predecessors(q)[0]);
      e.has(g, 'barycenter') || ((g.barycenter = 0), (g.weight = 0)),
        (g.barycenter = (g.barycenter * g.weight + p.order + b.order) / (g.weight + 2)),
        (g.weight += 2);
    }
    return g;
  }
  function a(n, f) {
    e.forEach(n, function(c) {
      c.vs = e.flatten(
        c.vs.map(function(s) {
          return f[s] ? f[s].vs : s;
        }),
        !0
      );
    });
  }
  function o(n, f) {
    e.isUndefined(n.barycenter)
      ? ((n.barycenter = f.barycenter), (n.weight = f.weight))
      : ((n.barycenter =
          (n.barycenter * n.weight + f.barycenter * f.weight) / (n.weight + f.weight)),
        (n.weight += f.weight));
  }
  return Zt;
}
var Jt, Ns;
function bd() {
  if (Ns) return Jt;
  Ns = 1;
  var e = ne(),
    u = pe().Graph;
  Jt = i;
  function i(r, a, o) {
    var n = t(r),
      f = new u({ compound: !0 }).setGraph({ root: n }).setDefaultNodeLabel(function(c) {
        return r.node(c);
      });
    return (
      e.forEach(r.nodes(), function(c) {
        var s = r.node(c),
          d = r.parent(c);
        (s.rank === a || (s.minRank <= a && a <= s.maxRank)) &&
          (f.setNode(c),
          f.setParent(c, d || n),
          e.forEach(r[o](c), function(h) {
            var l = h.v === c ? h.w : h.v,
              q = f.edge(l, c),
              y = e.isUndefined(q) ? 0 : q.weight;
            f.setEdge(l, c, { weight: r.edge(h).weight + y });
          }),
          e.has(s, 'minRank') &&
            f.setNode(c, { borderLeft: s.borderLeft[a], borderRight: s.borderRight[a] }));
      }),
      f
    );
  }
  function t(r) {
    for (var a; r.hasNode((a = e.uniqueId('_root'))); );
    return a;
  }
  return Jt;
}
var Qt, Fs;
function qd() {
  if (Fs) return Qt;
  Fs = 1;
  var e = ne();
  Qt = u;
  function u(i, t, r) {
    var a = {},
      o;
    e.forEach(r, function(n) {
      for (var f = i.parent(n), c, s; f; ) {
        if (((c = i.parent(f)), c ? ((s = a[c]), (a[c] = f)) : ((s = o), (o = f)), s && s !== f)) {
          t.setEdge(s, f);
          return;
        }
        f = c;
      }
    });
  }
  return Qt;
}
var ei, Ds;
function xd() {
  if (Ds) return ei;
  Ds = 1;
  var e = ne(),
    u = vd(),
    i = pd(),
    t = _d(),
    r = bd(),
    a = qd(),
    o = pe().Graph,
    n = ce();
  ei = f;
  function f(h) {
    var l = n.maxRank(h),
      q = c(h, e.range(1, l + 1), 'inEdges'),
      y = c(h, e.range(l - 1, -1, -1), 'outEdges'),
      v = u(h);
    d(h, v);
    for (var m = Number.POSITIVE_INFINITY, g, p = 0, b = 0; b < 4; ++p, ++b) {
      s(p % 2 ? q : y, p % 4 >= 2), (v = n.buildLayerMatrix(h));
      var x = i(h, v);
      x < m && ((b = 0), (g = e.cloneDeep(v)), (m = x));
    }
    d(h, g);
  }
  function c(h, l, q) {
    return e.map(l, function(y) {
      return r(h, y, q);
    });
  }
  function s(h, l) {
    var q = new o();
    e.forEach(h, function(y) {
      var v = y.graph().root,
        m = t(y, v, q, l);
      e.forEach(m.vs, function(g, p) {
        y.node(g).order = p;
      }),
        a(y, q, m.vs);
    });
  }
  function d(h, l) {
    e.forEach(l, function(q) {
      e.forEach(q, function(y, v) {
        h.node(y).order = v;
      });
    });
  }
  return ei;
}
var ri, js;
function wd() {
  if (js) return ri;
  js = 1;
  var e = ne(),
    u = pe().Graph,
    i = ce();
  ri = {
    positionX: q,
    findType1Conflicts: t,
    findType2Conflicts: r,
    addConflict: o,
    hasConflict: n,
    verticalAlignment: f,
    horizontalCompaction: c,
    alignCoordinates: h,
    findSmallestWidthAlignment: d,
    balance: l,
  };
  function t(m, g) {
    var p = {};
    function b(x, E) {
      var w = 0,
        k = 0,
        P = x.length,
        M = e.last(E);
      return (
        e.forEach(E, function(G, D) {
          var U = a(m, G),
            Y = U ? m.node(U).order : P;
          (U || G === M) &&
            (e.forEach(E.slice(k, D + 1), function(H) {
              e.forEach(m.predecessors(H), function(te) {
                var xe = m.node(te),
                  _e = xe.order;
                (_e < w || Y < _e) && !(xe.dummy && m.node(H).dummy) && o(p, te, H);
              });
            }),
            (k = D + 1),
            (w = Y));
        }),
        E
      );
    }
    return e.reduce(g, b), p;
  }
  function r(m, g) {
    var p = {};
    function b(E, w, k, P, M) {
      var G;
      e.forEach(e.range(w, k), function(D) {
        (G = E[D]),
          m.node(G).dummy &&
            e.forEach(m.predecessors(G), function(U) {
              var Y = m.node(U);
              Y.dummy && (Y.order < P || Y.order > M) && o(p, U, G);
            });
      });
    }
    function x(E, w) {
      var k = -1,
        P,
        M = 0;
      return (
        e.forEach(w, function(G, D) {
          if (m.node(G).dummy === 'border') {
            var U = m.predecessors(G);
            U.length && ((P = m.node(U[0]).order), b(w, M, D, k, P), (M = D), (k = P));
          }
          b(w, M, w.length, P, E.length);
        }),
        w
      );
    }
    return e.reduce(g, x), p;
  }
  function a(m, g) {
    if (m.node(g).dummy)
      return e.find(m.predecessors(g), function(p) {
        return m.node(p).dummy;
      });
  }
  function o(m, g, p) {
    if (g > p) {
      var b = g;
      (g = p), (p = b);
    }
    var x = m[g];
    x || (m[g] = x = {}), (x[p] = !0);
  }
  function n(m, g, p) {
    if (g > p) {
      var b = g;
      (g = p), (p = b);
    }
    return e.has(m[g], p);
  }
  function f(m, g, p, b) {
    var x = {},
      E = {},
      w = {};
    return (
      e.forEach(g, function(k) {
        e.forEach(k, function(P, M) {
          (x[P] = P), (E[P] = P), (w[P] = M);
        });
      }),
      e.forEach(g, function(k) {
        var P = -1;
        e.forEach(k, function(M) {
          var G = b(M);
          if (G.length) {
            G = e.sortBy(G, function(te) {
              return w[te];
            });
            for (var D = (G.length - 1) / 2, U = Math.floor(D), Y = Math.ceil(D); U <= Y; ++U) {
              var H = G[U];
              E[M] === M &&
                P < w[H] &&
                !n(p, M, H) &&
                ((E[H] = M), (E[M] = x[M] = x[H]), (P = w[H]));
            }
          }
        });
      }),
      { root: x, align: E }
    );
  }
  function c(m, g, p, b, x) {
    var E = {},
      w = s(m, g, p, x),
      k = x ? 'borderLeft' : 'borderRight';
    function P(D, U) {
      for (var Y = w.nodes(), H = Y.pop(), te = {}; H; )
        te[H] ? D(H) : ((te[H] = !0), Y.push(H), (Y = Y.concat(U(H)))), (H = Y.pop());
    }
    function M(D) {
      E[D] = w.inEdges(D).reduce(function(U, Y) {
        return Math.max(U, E[Y.v] + w.edge(Y));
      }, 0);
    }
    function G(D) {
      var U = w.outEdges(D).reduce(function(H, te) {
          return Math.min(H, E[te.w] - w.edge(te));
        }, Number.POSITIVE_INFINITY),
        Y = m.node(D);
      U !== Number.POSITIVE_INFINITY && Y.borderType !== k && (E[D] = Math.max(E[D], U));
    }
    return (
      P(M, w.predecessors.bind(w)),
      P(G, w.successors.bind(w)),
      e.forEach(b, function(D) {
        E[D] = E[p[D]];
      }),
      E
    );
  }
  function s(m, g, p, b) {
    var x = new u(),
      E = m.graph(),
      w = y(E.nodesep, E.edgesep, b);
    return (
      e.forEach(g, function(k) {
        var P;
        e.forEach(k, function(M) {
          var G = p[M];
          if ((x.setNode(G), P)) {
            var D = p[P],
              U = x.edge(D, G);
            x.setEdge(D, G, Math.max(w(m, M, P), U || 0));
          }
          P = M;
        });
      }),
      x
    );
  }
  function d(m, g) {
    return e.minBy(e.values(g), function(p) {
      var b = Number.NEGATIVE_INFINITY,
        x = Number.POSITIVE_INFINITY;
      return (
        e.forIn(p, function(E, w) {
          var k = v(m, w) / 2;
          (b = Math.max(E + k, b)), (x = Math.min(E - k, x));
        }),
        b - x
      );
    });
  }
  function h(m, g) {
    var p = e.values(g),
      b = e.min(p),
      x = e.max(p);
    e.forEach(['u', 'd'], function(E) {
      e.forEach(['l', 'r'], function(w) {
        var k = E + w,
          P = m[k],
          M;
        if (P !== g) {
          var G = e.values(P);
          (M = w === 'l' ? b - e.min(G) : x - e.max(G)),
            M &&
              (m[k] = e.mapValues(P, function(D) {
                return D + M;
              }));
        }
      });
    });
  }
  function l(m, g) {
    return e.mapValues(m.ul, function(p, b) {
      if (g) return m[g.toLowerCase()][b];
      var x = e.sortBy(e.map(m, b));
      return (x[1] + x[2]) / 2;
    });
  }
  function q(m) {
    var g = i.buildLayerMatrix(m),
      p = e.merge(t(m, g), r(m, g)),
      b = {},
      x;
    e.forEach(['u', 'd'], function(w) {
      (x = w === 'u' ? g : e.values(g).reverse()),
        e.forEach(['l', 'r'], function(k) {
          k === 'r' &&
            (x = e.map(x, function(D) {
              return e.values(D).reverse();
            }));
          var P = (w === 'u' ? m.predecessors : m.successors).bind(m),
            M = f(m, x, p, P),
            G = c(m, x, M.root, M.align, k === 'r');
          k === 'r' &&
            (G = e.mapValues(G, function(D) {
              return -D;
            })),
            (b[w + k] = G);
        });
    });
    var E = d(m, b);
    return h(b, E), l(b, m.graph().align);
  }
  function y(m, g, p) {
    return function(b, x, E) {
      var w = b.node(x),
        k = b.node(E),
        P = 0,
        M;
      if (((P += w.width / 2), e.has(w, 'labelpos')))
        switch (w.labelpos.toLowerCase()) {
          case 'l':
            M = -w.width / 2;
            break;
          case 'r':
            M = w.width / 2;
            break;
        }
      if (
        (M && (P += p ? M : -M),
        (M = 0),
        (P += (w.dummy ? g : m) / 2),
        (P += (k.dummy ? g : m) / 2),
        (P += k.width / 2),
        e.has(k, 'labelpos'))
      )
        switch (k.labelpos.toLowerCase()) {
          case 'l':
            M = k.width / 2;
            break;
          case 'r':
            M = -k.width / 2;
            break;
        }
      return M && (P += p ? M : -M), (M = 0), P;
    };
  }
  function v(m, g) {
    return m.node(g).width;
  }
  return ri;
}
var ni, Gs;
function Ed() {
  if (Gs) return ni;
  Gs = 1;
  var e = ne(),
    u = ce(),
    i = wd().positionX;
  ni = t;
  function t(a) {
    (a = u.asNonCompoundGraph(a)),
      r(a),
      e.forEach(i(a), function(o, n) {
        a.node(n).x = o;
      });
  }
  function r(a) {
    var o = u.buildLayerMatrix(a),
      n = a.graph().ranksep,
      f = 0;
    e.forEach(o, function(c) {
      var s = e.max(
        e.map(c, function(d) {
          return a.node(d).height;
        })
      );
      e.forEach(c, function(d) {
        a.node(d).y = f + s / 2;
      }),
        (f += s + n);
    });
  }
  return ni;
}
var ti, Bs;
function Rd() {
  if (Bs) return ti;
  Bs = 1;
  var e = ne(),
    u = od(),
    i = sd(),
    t = fd(),
    r = ce().normalizeRanks,
    a = cd(),
    o = ce().removeEmptyRanks,
    n = dd(),
    f = hd(),
    c = ld(),
    s = xd(),
    d = Ed(),
    h = ce(),
    l = pe().Graph;
  ti = q;
  function q(R, I) {
    var C = I && I.debugTiming ? h.time : h.notime;
    C('layout', function() {
      var j = C('  buildLayoutGraph', function() {
        return P(R);
      });
      C('  runLayout', function() {
        y(j, C);
      }),
        C('  updateInputGraph', function() {
          v(R, j);
        });
    });
  }
  function y(R, I) {
    I('    makeSpaceForEdgeLabels', function() {
      M(R);
    }),
      I('    removeSelfEdges', function() {
        Pe(R);
      }),
      I('    acyclic', function() {
        u.run(R);
      }),
      I('    nestingGraph.run', function() {
        n.run(R);
      }),
      I('    rank', function() {
        t(h.asNonCompoundGraph(R));
      }),
      I('    injectEdgeLabelProxies', function() {
        G(R);
      }),
      I('    removeEmptyRanks', function() {
        o(R);
      }),
      I('    nestingGraph.cleanup', function() {
        n.cleanup(R);
      }),
      I('    normalizeRanks', function() {
        r(R);
      }),
      I('    assignRankMinMax', function() {
        D(R);
      }),
      I('    removeEdgeLabelProxies', function() {
        U(R);
      }),
      I('    normalize.run', function() {
        i.run(R);
      }),
      I('    parentDummyChains', function() {
        a(R);
      }),
      I('    addBorderSegments', function() {
        f(R);
      }),
      I('    order', function() {
        s(R);
      }),
      I('    insertSelfEdges', function() {
        Te(R);
      }),
      I('    adjustCoordinateSystem', function() {
        c.adjust(R);
      }),
      I('    position', function() {
        d(R);
      }),
      I('    positionSelfEdges', function() {
        Ce(R);
      }),
      I('    removeBorderNodes', function() {
        _e(R);
      }),
      I('    normalize.undo', function() {
        i.undo(R);
      }),
      I('    fixupEdgeLabelCoords', function() {
        te(R);
      }),
      I('    undoCoordinateSystem', function() {
        c.undo(R);
      }),
      I('    translateGraph', function() {
        Y(R);
      }),
      I('    assignNodeIntersects', function() {
        H(R);
      }),
      I('    reversePoints', function() {
        xe(R);
      }),
      I('    acyclic.undo', function() {
        u.undo(R);
      });
  }
  function v(R, I) {
    e.forEach(R.nodes(), function(C) {
      var j = R.node(C),
        K = I.node(C);
      j &&
        ((j.x = K.x),
        (j.y = K.y),
        I.children(C).length && ((j.width = K.width), (j.height = K.height)));
    }),
      e.forEach(R.edges(), function(C) {
        var j = R.edge(C),
          K = I.edge(C);
        (j.points = K.points), e.has(K, 'x') && ((j.x = K.x), (j.y = K.y));
      }),
      (R.graph().width = I.graph().width),
      (R.graph().height = I.graph().height);
  }
  var m = ['nodesep', 'edgesep', 'ranksep', 'marginx', 'marginy'],
    g = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: 'tb' },
    p = ['acyclicer', 'ranker', 'rankdir', 'align'],
    b = ['width', 'height'],
    x = { width: 0, height: 0 },
    E = ['minlen', 'weight', 'width', 'height', 'labeloffset'],
    w = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: 'r' },
    k = ['labelpos'];
  function P(R) {
    var I = new l({ multigraph: !0, compound: !0 }),
      C = ge(R.graph());
    return (
      I.setGraph(e.merge({}, g, we(C, m), e.pick(C, p))),
      e.forEach(R.nodes(), function(j) {
        var K = ge(R.node(j));
        I.setNode(j, e.defaults(we(K, b), x)), I.setParent(j, R.parent(j));
      }),
      e.forEach(R.edges(), function(j) {
        var K = ge(R.edge(j));
        I.setEdge(j, e.merge({}, w, we(K, E), e.pick(K, k)));
      }),
      I
    );
  }
  function M(R) {
    var I = R.graph();
    (I.ranksep /= 2),
      e.forEach(R.edges(), function(C) {
        var j = R.edge(C);
        (j.minlen *= 2),
          j.labelpos.toLowerCase() !== 'c' &&
            (I.rankdir === 'TB' || I.rankdir === 'BT'
              ? (j.width += j.labeloffset)
              : (j.height += j.labeloffset));
      });
  }
  function G(R) {
    e.forEach(R.edges(), function(I) {
      var C = R.edge(I);
      if (C.width && C.height) {
        var j = R.node(I.v),
          K = R.node(I.w),
          ee = { rank: (K.rank - j.rank) / 2 + j.rank, e: I };
        h.addDummyNode(R, 'edge-proxy', ee, '_ep');
      }
    });
  }
  function D(R) {
    var I = 0;
    e.forEach(R.nodes(), function(C) {
      var j = R.node(C);
      j.borderTop &&
        ((j.minRank = R.node(j.borderTop).rank),
        (j.maxRank = R.node(j.borderBottom).rank),
        (I = e.max(I, j.maxRank)));
    }),
      (R.graph().maxRank = I);
  }
  function U(R) {
    e.forEach(R.nodes(), function(I) {
      var C = R.node(I);
      C.dummy === 'edge-proxy' && ((R.edge(C.e).labelRank = C.rank), R.removeNode(I));
    });
  }
  function Y(R) {
    var I = Number.POSITIVE_INFINITY,
      C = 0,
      j = Number.POSITIVE_INFINITY,
      K = 0,
      ee = R.graph(),
      re = ee.marginx || 0,
      oe = ee.marginy || 0;
    function Ee(se) {
      var _ = se.x,
        A = se.y,
        F = se.width,
        O = se.height;
      (I = Math.min(I, _ - F / 2)),
        (C = Math.max(C, _ + F / 2)),
        (j = Math.min(j, A - O / 2)),
        (K = Math.max(K, A + O / 2));
    }
    e.forEach(R.nodes(), function(se) {
      Ee(R.node(se));
    }),
      e.forEach(R.edges(), function(se) {
        var _ = R.edge(se);
        e.has(_, 'x') && Ee(_);
      }),
      (I -= re),
      (j -= oe),
      e.forEach(R.nodes(), function(se) {
        var _ = R.node(se);
        (_.x -= I), (_.y -= j);
      }),
      e.forEach(R.edges(), function(se) {
        var _ = R.edge(se);
        e.forEach(_.points, function(A) {
          (A.x -= I), (A.y -= j);
        }),
          e.has(_, 'x') && (_.x -= I),
          e.has(_, 'y') && (_.y -= j);
      }),
      (ee.width = C - I + re),
      (ee.height = K - j + oe);
  }
  function H(R) {
    e.forEach(R.edges(), function(I) {
      var C = R.edge(I),
        j = R.node(I.v),
        K = R.node(I.w),
        ee,
        re;
      C.points
        ? ((ee = C.points[0]), (re = C.points[C.points.length - 1]))
        : ((C.points = []), (ee = K), (re = j)),
        C.points.unshift(h.intersectRect(j, ee)),
        C.points.push(h.intersectRect(K, re));
    });
  }
  function te(R) {
    e.forEach(R.edges(), function(I) {
      var C = R.edge(I);
      if (e.has(C, 'x'))
        switch (
          ((C.labelpos === 'l' || C.labelpos === 'r') && (C.width -= C.labeloffset), C.labelpos)
        ) {
          case 'l':
            C.x -= C.width / 2 + C.labeloffset;
            break;
          case 'r':
            C.x += C.width / 2 + C.labeloffset;
            break;
        }
    });
  }
  function xe(R) {
    e.forEach(R.edges(), function(I) {
      var C = R.edge(I);
      C.reversed && C.points.reverse();
    });
  }
  function _e(R) {
    e.forEach(R.nodes(), function(I) {
      if (R.children(I).length) {
        var C = R.node(I),
          j = R.node(C.borderTop),
          K = R.node(C.borderBottom),
          ee = R.node(e.last(C.borderLeft)),
          re = R.node(e.last(C.borderRight));
        (C.width = Math.abs(re.x - ee.x)),
          (C.height = Math.abs(K.y - j.y)),
          (C.x = ee.x + C.width / 2),
          (C.y = j.y + C.height / 2);
      }
    }),
      e.forEach(R.nodes(), function(I) {
        R.node(I).dummy === 'border' && R.removeNode(I);
      });
  }
  function Pe(R) {
    e.forEach(R.edges(), function(I) {
      if (I.v === I.w) {
        var C = R.node(I.v);
        C.selfEdges || (C.selfEdges = []),
          C.selfEdges.push({ e: I, label: R.edge(I) }),
          R.removeEdge(I);
      }
    });
  }
  function Te(R) {
    var I = h.buildLayerMatrix(R);
    e.forEach(I, function(C) {
      var j = 0;
      e.forEach(C, function(K, ee) {
        var re = R.node(K);
        (re.order = ee + j),
          e.forEach(re.selfEdges, function(oe) {
            h.addDummyNode(
              R,
              'selfedge',
              {
                width: oe.label.width,
                height: oe.label.height,
                rank: re.rank,
                order: ee + ++j,
                e: oe.e,
                label: oe.label,
              },
              '_se'
            );
          }),
          delete re.selfEdges;
      });
    });
  }
  function Ce(R) {
    e.forEach(R.nodes(), function(I) {
      var C = R.node(I);
      if (C.dummy === 'selfedge') {
        var j = R.node(C.e.v),
          K = j.x + j.width / 2,
          ee = j.y,
          re = C.x - K,
          oe = j.height / 2;
        R.setEdge(C.e, C.label),
          R.removeNode(I),
          (C.label.points = [
            { x: K + (2 * re) / 3, y: ee - oe },
            { x: K + (5 * re) / 6, y: ee - oe },
            { x: K + re, y: ee },
            { x: K + (5 * re) / 6, y: ee + oe },
            { x: K + (2 * re) / 3, y: ee + oe },
          ]),
          (C.label.x = C.x),
          (C.label.y = C.y);
      }
    });
  }
  function we(R, I) {
    return e.mapValues(e.pick(R, I), Number);
  }
  function ge(R) {
    var I = {};
    return (
      e.forEach(R, function(C, j) {
        I[j.toLowerCase()] = C;
      }),
      I
    );
  }
  return ti;
}
var ii, $s;
function Id() {
  if ($s) return ii;
  $s = 1;
  var e = ne(),
    u = ce(),
    i = pe().Graph;
  ii = { debugOrdering: t };
  function t(r) {
    var a = u.buildLayerMatrix(r),
      o = new i({ compound: !0, multigraph: !0 }).setGraph({});
    return (
      e.forEach(r.nodes(), function(n) {
        o.setNode(n, { label: n }), o.setParent(n, 'layer' + r.node(n).rank);
      }),
      e.forEach(r.edges(), function(n) {
        o.setEdge(n.v, n.w, {}, n.name);
      }),
      e.forEach(a, function(n, f) {
        var c = 'layer' + f;
        o.setNode(c, { rank: 'same' }),
          e.reduce(n, function(s, d) {
            return o.setEdge(s, d, { style: 'invis' }), d;
          });
      }),
      o
    );
  }
  return ii;
}
var ai, Us;
function Ad() {
  return Us || ((Us = 1), (ai = '0.8.5')), ai;
}
var oi, Vs;
function Sd() {
  return (
    Vs ||
      ((Vs = 1),
      (oi = {
        graphlib: pe(),
        layout: Rd(),
        debug: Id(),
        util: { time: ce().time, notime: ce().notime },
        version: Ad(),
      })),
    oi
  );
}
var Md = Sd();
const Ws = Wu(Md),
  Cd = 'TopologyGV-module__interactive--mWlsv',
  kd = 'TopologyGV-module__active--bIMOx',
  Pd = 'TopologyGV-module__saved--R0Obg',
  le = {
    'topo-gv': 'TopologyGV-module__topo-gv--ct3R3',
    interactive: Cd,
    'topo-svg': 'TopologyGV-module__topo-svg--7om9b',
    'topo-dock': 'TopologyGV-module__topo-dock--u-Xq6',
    'dock-btn': 'TopologyGV-module__dock-btn--CKB7R',
    active: kd,
    saved: Pd,
    'dock-sep': 'TopologyGV-module__dock-sep--F0kYH',
    'topo-node': 'TopologyGV-module__topo-node--B-TEF',
  },
  Td = { matrix: '#06b6d4', converter: '#8b5cf6', ad: '#f97316', dvb: '#22c55e' },
  si = 'topo-layout-v2';
function Od(e) {
  return e == null ? '--' : (e / 1e3).toFixed(0) + 'MHz';
}
function Vd({ chains: e, rfPorts: u, matrixItems: i, converters: t, dvbCards: r, adCards: a }) {
  const o = ie.useRef(null),
    [n, f] = ie.useState(!1),
    [c, s] = ie.useState(!1),
    [d, h] = ie.useState(1),
    [l, q] = ie.useState(0),
    [y, v] = ie.useState(0),
    [m, g] = ie.useState(!1),
    [p, b] = ie.useState(null),
    x = ie.useRef({ x: 0, y: 0 }),
    E = ie.useRef({ x: 0, y: 0 }),
    w = ie.useRef({}),
    k = ie.useRef({}),
    P = ie.useRef(!1),
    M = e || [],
    G = u || [],
    D = t || [],
    U = a || [],
    Y = r || [],
    H = i || [];
  function te(_, A) {
    const F = o.current;
    if (!F) return { x: _, y: A };
    const O = F.getBoundingClientRect(),
      z = _ - O.left,
      L = A - O.top;
    return { x: (z - l) / d, y: (L - y) / d };
  }
  function xe() {
    const _ = { nodes: { ...w.current }, rfs: { ...k.current }, panX: l, panY: y, zoom: d };
    localStorage.setItem(si, JSON.stringify(_)), s(!0), setTimeout(() => s(!1), 1500);
  }
  function _e() {
    try {
      const _ = localStorage.getItem(si);
      if (!_) return !1;
      const A = JSON.parse(_);
      return (
        A.nodes && (w.current = { ...A.nodes }),
        A.rfs && (k.current = { ...A.rfs }),
        A.panX != null && q(A.panX),
        A.panY != null && v(A.panY),
        A.zoom != null && h(A.zoom),
        !0
      );
    } catch {
      return !1;
    }
  }
  function Pe() {
    (w.current = {}),
      (k.current = {}),
      localStorage.removeItem(si),
      h(1),
      q(0),
      v(0),
      setTimeout(ge, 50);
  }
  function Te() {
    f(_ => !_);
  }
  function Ce(_, A) {
    const F = _.map(N => N.x).concat(A.map(N => N.x)),
      O = _.map(N => N.x + N.w).concat(A.map(N => N.x + 14)),
      z = _.map(N => N.y).concat(A.map(N => N.y)),
      L = _.map(N => N.y + N.h).concat(A.map(N => N.y + 10)),
      B = F.length ? Math.min(...F) : 0,
      V = O.length ? Math.max(...O) : 300,
      Z = z.length ? Math.min(...z) : 0,
      T = L.length ? Math.max(...L) : 100,
      $ = Math.max(0, V - B),
      S = Math.max(0, T - Z);
    return {
      minX: B,
      maxX: V,
      minY: Z,
      maxY: T,
      contentW: $,
      contentH: S,
      w: Math.max(300, $),
      h: Math.max(100, S),
    };
  }
  function we(_, A, F) {
    const O = o.current;
    if (!O) return;
    const z = O.clientWidth,
      L = O.clientHeight;
    if (!z || !L) return;
    const B = Ce(_, A),
      V = B.contentW || 300,
      Z = B.contentH || 100;
    V <= 0 || Z <= 0 || (q((z - V * F) / 2 - B.minX * F), v((L - Z * F) / 2 - B.minY * F));
  }
  function ge(_, A) {
    const F = o.current;
    if (!F) return;
    const O = F.clientWidth,
      z = F.clientHeight;
    if (!O || !z) return;
    const L = Ce(_, A),
      B = L.contentW || 300,
      V = L.contentH || 100;
    if (B <= 0 || V <= 0) return;
    const Z = O / B,
      T = z / V,
      $ = Math.min(Z, T),
      S = Math.max(0.1, $);
    h(S);
    const N = (O - B * S) / 2 - L.minX * S,
      Q = (z - V * S) / 2 - L.minY * S;
    q(N), v(Q);
  }
  const R = ie.useMemo(
      () => {
        const _ = new Ws.graphlib.Graph(),
          A = (T, $ = 0) => Math.max(10, 6 + $ * 2 + T * 2),
          F = (T, $ = 0, S = '') => {
            if (!S || S.length <= 6) return 20;
            const Q = (4 + S.length) * 1.9 + 2;
            return Math.max(20, Math.ceil(Q));
          };
        _.setGraph({
          rankdir: 'LR',
          nodesep: 2,
          ranksep: 18,
          marginx: 0,
          marginy: 0,
          ranker: 'network-simplex',
        }),
          _.setDefaultEdgeLabel(() => ({}));
        const O = {},
          z = {},
          L = {},
          B = {},
          V = {};
        M.forEach(T => {
          if (T.matrix) {
            const $ = T.matrix.deviceId ?? T.matrix.id,
              S = T.matrixInPort ?? 0,
              N = T.matrixOutPort ?? 0;
            (z[$] = Math.max(z[$] || 0, S + 1)), (L[$] = Math.max(L[$] || 0, N + 1));
          }
          if (T.outType === 'AD') {
            const $ = T.inputPort ?? 0,
              S =
                typeof T.output == 'string' ? parseInt(T.output.split('-')[1]) : T.output?.id ?? 0;
            B[S] = Math.max(B[S] || 0, $ + 1);
          } else if (T.outType === 'DVB') {
            const $ = T.inputPort ?? 0,
              S =
                typeof T.output == 'string' ? parseInt(T.output.split('-')[1]) : T.output?.id ?? 0;
            V[S] = Math.max(V[S] || 0, $ + 1);
          }
        }),
          G.forEach(T => {
            const $ = `RF-${T.port}`;
            (O[$] = !0), _.setNode($, { width: 14, height: 5 });
          });
        const Z = T => (T ? (typeof T == 'string' ? T : `${T.type}-${T.id}`) : null);
        return (
          M.forEach(T => {
            if (!T.active) return;
            if (T.matrix && !O[T.matrix.deviceId ?? T.matrix.id]) {
              const S = T.matrix.deviceId ?? T.matrix.id,
                N = `MATRIX-${S}`;
              (O[S] = !0), (O[N] = !0);
              const Q = T.matrix.inputPorts || 4,
                J = T.matrix.outputPorts || 4,
                ue = z[S] || 0,
                fe = L[S] || 0,
                he = Math.max(Q, ue),
                be = Math.max(J, fe);
              _.setNode(N, {
                width: 24,
                height: A(Math.max(he, be), 0),
                matrixId: S,
                inputPorts: he,
                outputPorts: be,
              });
            }
            if (T.converter != null && D.find(S => S.id === T.converter)) {
              const S = `CV-${T.converter}`;
              O[S] || ((O[S] = !0), _.setNode(S, { width: 20, height: A(1, 1) }));
            }
            const $ = Z(T.output);
            if ($ && !O[$]) {
              const S = $.startsWith('DVB'),
                N = S ? Y : U,
                Q = S ? V : B,
                J = parseInt($.split('-')[1]),
                ue = isNaN(J) ? void 0 : N.find(he => he.id === J),
                fe = Math.max(ue?.inputPorts || 1, Q[J] || 1);
              (O[$] = !0), _.setNode($, { width: F(fe, 2, ue?.dna), height: A(fe, 2), ports: fe });
            }
          }),
          U.forEach(T => {
            const $ = `AD-${T.id}`;
            if (!O[$]) {
              const S = Math.max(T.inputPorts || 1, B[T.id] || 1);
              (O[$] = !0), _.setNode($, { width: F(S, 2, T.dna), height: A(S, 2), ports: S });
            }
          }),
          Y.forEach(T => {
            const $ = `DVB-${T.id}`;
            if (!O[$]) {
              const S = Math.max(T.inputPorts || 1, V[T.id] || 1);
              (O[$] = !0), _.setNode($, { width: F(S, 2, T.dna), height: A(S, 2), ports: S });
            }
          }),
          D.forEach(T => {
            const $ = `CV-${T.id}`;
            O[$] || ((O[$] = !0), _.setNode($, { width: 20, height: A(1, 1) }));
          }),
          M.forEach(T => {
            if (!T.active) return;
            const $ = `RF-${T.rf}`,
              S = Z(T.output);
            if (T.matrix) {
              const N = `MATRIX-${T.matrix.deviceId ?? T.matrix.id}`;
              if ((_.setEdge($, N), T.converter != null)) {
                const Q = `CV-${T.converter}`;
                _.setEdge(N, Q), S && _.setEdge(Q, S);
              } else S && _.setEdge(N, S);
            } else if (T.converter != null) {
              const N = `CV-${T.converter}`;
              _.setEdge($, N), S && _.setEdge(N, S);
            } else S && _.setEdge($, S);
          }),
          Ws.layout(_),
          _
        );
      },
      [M, G, D, U, Y]
    ),
    I = ie.useMemo(
      () => {
        const _ = R,
          A = [],
          F = {},
          O = {},
          z = {},
          L = {};
        return (
          M.forEach(B => {
            if (B.matrix) {
              const V = B.matrix.deviceId ?? B.matrix.id;
              (F[V] = Math.max(F[V] || 0, (B.matrixInPort ?? 0) + 1)),
                (O[V] = Math.max(O[V] || 0, (B.matrixOutPort ?? 0) + 1));
            }
            if (B.outType === 'AD') {
              const V =
                typeof B.output == 'string' ? parseInt(B.output.split('-')[1]) : B.output?.id ?? 0;
              z[V] = Math.max(z[V] || 0, (B.inputPort ?? 0) + 1);
            } else if (B.outType === 'DVB') {
              const V =
                typeof B.output == 'string' ? parseInt(B.output.split('-')[1]) : B.output?.id ?? 0;
              L[V] = Math.max(L[V] || 0, (B.inputPort ?? 0) + 1);
            }
          }),
          _.nodes().forEach(B => {
            const V = _.node(B);
            if (!V || B.startsWith('RF-')) return;
            let Z = V.x - V.width / 2,
              T = V.y - V.height / 2;
            const $ = w.current[B];
            $ && ((Z = $.x), (T = $.y));
            let S = B.startsWith('MATRIX')
              ? 'matrix'
              : B.startsWith('CV')
                ? 'converter'
                : B.startsWith('AD')
                  ? 'ad'
                  : 'dvb';
            const N = parseInt(B.replace(/\D/g, ''), 10),
              Q = [];
            let J = 1,
              ue = S === 'converter' ? 1 : 0;
            if (S === 'matrix') {
              const X = H.find(ae => ae.deviceId === N);
              (J = Math.max(X?.inputPorts || 4, F[N] || 0)),
                (ue = Math.max(X?.outputPorts || 4, O[N] || 0));
            }
            if (S === 'converter') {
              const X = N,
                ae = D.find(De => De.id === X);
              ae && Q.push(`F:${Od(ae.freq)}`), (J = 1), (ue = 1);
            }
            if (S === 'ad') {
              const X = U.find(ae => ae.id === N);
              X &&
                ((J = Math.max(X.inputPorts || 1, z[N] || 1)),
                Q.push(`DNA:${X.dna || '--'}`),
                Q.push(`CH:${X.channels?.used ?? '-'}/${X.channels?.total ?? '-'}`));
            }
            if (S === 'dvb') {
              const X = Y.find(ae => ae.id === N);
              X &&
                ((J = Math.max(X.inputPorts || 1, L[N] || 1)),
                Q.push(`DNA:${X.dna || '--'}`),
                Q.push(`CH:${X.channels?.used ?? '-'}/${X.channels?.total ?? '-'}`));
            }
            const fe = V.width,
              he = V.height,
              be = 2,
              ye = Math.max(0, (J - 1) * be),
              me = T + he / 2 - ye / 2,
              Re = Array.from({ length: J }, (X, ae) => ({ y: me + ae * be, on: !1 })),
              ze = Array.from({ length: ue }, (X, ae) => ({ y: me + ae * be, on: !1 })),
              $u = X => (X ? (typeof X == 'string' ? X : `${X.type}-${X.id}`) : null);
            M.forEach(X => {
              if (X.active) {
                if (
                  S === 'matrix' &&
                  String(N) === String(X.matrix?.deviceId ?? X.matrix?.id ?? '')
                ) {
                  const ae = X.matrixInPort ?? 0,
                    De = X.matrixOutPort ?? 0;
                  Re[ae] && (Re[ae].on = !0), ze[De] && (ze[De].on = !0);
                }
                (S === 'ad' || S === 'dvb') &&
                  $u(X.output) === B &&
                  Re[X.inputPort ?? 0] &&
                  (Re[X.inputPort ?? 0].on = !0),
                  S === 'converter' && D.find(ae => ae.id === N) && Re[0] && (Re[0].on = !0);
              }
            });
            const Uu = { matrix: '矩阵', converter: '变频器', ad: 'AD', dvb: 'DVB' }[S],
              Vu = S === 'matrix' ? N : null;
            A.push({
              id: B,
              x: Z,
              y: T,
              w: fe,
              h: he,
              label: `${Uu}-${N}`,
              color: Td[S],
              dd: Q,
              ddY: T + 5.5 + 2,
              inPorts: Re,
              outPorts: ze,
              mx: S === 'matrix' ? H.find(X => X.deviceId === Vu) : null,
            });
          }),
          A
        );
      },
      [R, M, D, U, Y, H]
    ),
    C = ie.useMemo(
      () => {
        const _ = R,
          A = [];
        return (
          G.forEach((F, O) => {
            const z = `RF-${F.port}`,
              L = _.node(z),
              B = k.current[z];
            let V, Z;
            B
              ? ((V = B.x), (Z = B.y))
              : L
                ? ((V = L.x - L.width / 2), (Z = L.y - L.height / 2))
                : ((V = 0), (Z = 6 + O * 12)),
              A.push({
                id: z,
                port: F.port,
                x: V,
                y: Z,
                label: `RF-${F.port}`,
                lev: F?.level != null ? F.level + 'dBm' : '--',
                online: F?.level != null,
              });
          }),
          A
        );
      },
      [R, G]
    ),
    j = ie.useMemo(
      () => {
        const _ = [];
        let A = 0;
        const F = L => I.find(B => B.id === L),
          O = L => (L ? `MATRIX-${L}` : null),
          z = L => (L ? (typeof L == 'string' ? L : `${L.type}-${L.id}`) : null);
        return (
          M.forEach(L => {
            if (!L.active) return;
            const B = C.find(S => S.port === L.rf);
            if (!B) return;
            const V = B.x + 14,
              Z = B.y + 5,
              T = z(L.output),
              $ = L.matrix
                ? O(L.matrix.deviceId ?? L.matrix.id)
                : L.converter != null
                  ? `CV-${L.converter}`
                  : T;
            if ($) {
              const S = F($);
              if (S) {
                const N = L.matrix
                    ? L.matrixInPort ?? 0
                    : L.converter != null
                      ? 0
                      : L.inputPort ?? 0,
                  Q = S.inPorts[N]?.y ?? S.y + S.h / 2,
                  J = Math.min(16, Math.max(8, (S.x - V) / 3));
                _.push({ k: A++, d: `M ${V} ${Z} C ${V + J} ${Z} ${S.x - J} ${Q} ${S.x} ${Q}` });
              }
            }
            if (L.matrix && L.converter != null) {
              const S = F(O(L.matrix.deviceId ?? L.matrix.id)),
                N = F(`CV-${L.converter}`);
              if (S && N) {
                const Q = L.matrixOutPort ?? 0,
                  J = S.outPorts[Q]?.y ?? S.y + S.h / 2,
                  ue = N.inPorts[0]?.y ?? N.y + N.h / 2,
                  fe = Math.min(16, Math.max(8, (N.x - S.x - S.w) / 3));
                _.push({
                  k: A++,
                  d: `M ${S.x + S.w} ${J} C ${S.x + S.w + fe} ${J} ${N.x - fe} ${ue} ${N.x} ${ue}`,
                });
              }
            }
            if (T) {
              const S = F(T);
              if (S) {
                const N =
                  L.converter != null
                    ? F(`CV-${L.converter}`)
                    : L.matrix
                      ? F(O(L.matrix.deviceId ?? L.matrix.id))
                      : null;
                if (N) {
                  const Q = L.converter != null ? 0 : L.matrix ? L.matrixOutPort : 0,
                    J = N.outPorts[Q]?.y ?? N.y + N.h / 2,
                    ue = L.inputPort ?? 0,
                    fe = S.inPorts[ue]?.y ?? S.y + S.h / 2,
                    he = Math.min(16, Math.max(8, (S.x - N.x - N.w) / 3));
                  _.push({
                    k: A++,
                    d: `M ${N.x + N.w} ${J} C ${N.x + N.w + he} ${J} ${S.x - he} ${fe} ${
                      S.x
                    } ${fe}`,
                  });
                }
              }
            }
          }),
          _
        );
      },
      [I, C, M]
    );
  ie.useEffect(() => {
    P.current = _e();
    const _ = setTimeout(() => {
        P.current ? we(I, C, d) : ge(I, C);
      }, 50),
      A = o.current;
    if (!A) return () => clearTimeout(_);
    const F = new ResizeObserver(() => {
      P.current ? we(I, C, d) : ge(I, C);
    });
    return (
      F.observe(A),
      () => {
        clearTimeout(_), F.disconnect();
      }
    );
  }, []),
    ie.useEffect(
      () => {
        (w.current = {}), (k.current = {}), h(1), q(0), v(0);
        const _ = setTimeout(() => ge(I, C), 50);
        return () => clearTimeout(_);
      },
      [M]
    );
  function K(_) {
    if (!n) return;
    _.preventDefault();
    const A = o.current;
    if (!A) return;
    const F = A.getBoundingClientRect(),
      O = _.clientX - F.left,
      z = _.clientY - F.top,
      L = _.deltaY > 0 ? 0.9 : 1.1,
      B = Math.max(0.1, Math.min(5, d * L)),
      V = B / d;
    q(O - (O - l) * V), v(z - (z - y) * V), h(B);
  }
  function ee(_) {
    p || (g(!0), (x.current = { x: _.clientX, y: _.clientY }));
  }
  function re(_, A) {
    _.stopPropagation(), b(A);
    const F = te(_.clientX, _.clientY),
      O = I.find(z => z.id === A) || C.find(z => z.id === A);
    O && (E.current = { x: F.x - O.x, y: F.y - O.y });
  }
  function oe(_) {
    if (p) {
      const O = te(_.clientX, _.clientY);
      p.startsWith('RF-')
        ? (k.current = { ...k.current, [p]: { x: O.x - E.current.x, y: O.y - E.current.y } })
        : I.find(B => B.id === p) &&
          (w.current = { ...w.current, [p]: { x: O.x - E.current.x, y: O.y - E.current.y } }),
        q(L => L);
      return;
    }
    const A = _.clientX - x.current.x,
      F = _.clientY - x.current.y;
    (x.current = { x: _.clientX, y: _.clientY }), m && (q(O => O + A), v(O => O + F));
  }
  function Ee() {
    g(!1), b(null);
  }
  const se = p ? 'grabbing' : m ? 'grab' : 'default';
  return W.jsxs('div', {
    ref: o,
    className: `${le['topo-gv']} ${n ? le.interactive : ''}`,
    onWheel: K,
    onMouseDown: ee,
    onMouseMove: oe,
    onMouseUp: Ee,
    onMouseLeave: Ee,
    children: [
      W.jsxs('svg', {
        className: le['topo-svg'],
        style: { cursor: se },
        children: [
          W.jsx('defs', {
            children: W.jsx('marker', {
              id: 'gv-arrow',
              markerWidth: '6',
              markerHeight: '4.5',
              refX: '5',
              refY: '2.1',
              orient: 'auto',
              children: W.jsx('polygon', {
                points: '0 0, 6 2.1, 0 4.2',
                fill: '#00ff88',
                opacity: '0.4',
              }),
            }),
          }),
          W.jsx('rect', { width: '100%', height: '100%', fill: 'transparent' }),
          W.jsx('g', {
            transform: `translate(${l},${y})`,
            children: W.jsxs('g', {
              transform: `scale(${d})`,
              children: [
                I.map(_ =>
                  W.jsxs(
                    'g',
                    {
                      children: [
                        _.inPorts.map((A, F) =>
                          W.jsxs(
                            'g',
                            {
                              children: [
                                W.jsx('circle', {
                                  cx: _.x,
                                  cy: A.y,
                                  r: '.6',
                                  fill: A.on ? _.color : '#1e293b',
                                  stroke: A.on ? _.color : '#475569',
                                  strokeWidth: '.2',
                                }),
                                W.jsx('text', {
                                  x: _.x - 1,
                                  y: A.y + 0.8,
                                  fill: '#94a3b8',
                                  fontSize: '1.8',
                                  textAnchor: 'end',
                                  fontFamily: 'monospace',
                                  children: F,
                                }),
                              ],
                            },
                            `i${F}`
                          )
                        ),
                        _.outPorts.map((A, F) =>
                          W.jsxs(
                            'g',
                            {
                              children: [
                                W.jsx('circle', {
                                  cx: _.x + _.w,
                                  cy: A.y,
                                  r: '.6',
                                  fill: A.on ? _.color : '#1e293b',
                                  stroke: A.on ? _.color : '#475569',
                                  strokeWidth: '.2',
                                }),
                                W.jsx('text', {
                                  x: _.x + _.w + 1,
                                  y: A.y + 0.8,
                                  fill: '#94a3b8',
                                  fontSize: '1.8',
                                  textAnchor: 'start',
                                  fontFamily: 'monospace',
                                  children: F,
                                }),
                              ],
                            },
                            `o${F}`
                          )
                        ),
                      ],
                    },
                    `p${_.id}`
                  )
                ),
                j.map(_ =>
                  W.jsx(
                    'g',
                    {
                      children: W.jsx('path', {
                        d: _.d,
                        fill: 'none',
                        stroke: '#00ff88',
                        strokeWidth: '.3',
                        opacity: '.25',
                        markerEnd: 'url(#gv-arrow)',
                      }),
                    },
                    _.k
                  )
                ),
                I.map(_ =>
                  W.jsxs(
                    'g',
                    {
                      className: le['topo-node'],
                      onMouseDown: A => re(A, _.id),
                      children: [
                        W.jsx('rect', {
                          x: _.x,
                          y: _.y,
                          width: _.w,
                          height: _.h,
                          rx: '1',
                          fill: '#0f172a',
                          stroke: 'none',
                        }),
                        W.jsx('rect', {
                          x: _.x,
                          y: _.y,
                          width: _.w,
                          height: _.h,
                          rx: '1',
                          fill: 'none',
                          stroke: _.color,
                          strokeWidth: '.4',
                        }),
                        W.jsx('rect', {
                          x: _.x + 0.5,
                          y: _.y + 0.5,
                          width: _.w - 1,
                          height: '3',
                          rx: '.6',
                          fill: _.color,
                          opacity: '.08',
                        }),
                        W.jsx('text', {
                          x: _.x + _.w / 2,
                          y: _.y + 3,
                          fill: 'white',
                          fontSize: '2.5',
                          fontWeight: '600',
                          textAnchor: 'middle',
                          fontFamily: "'Consolas',monospace",
                          children: _.label,
                        }),
                        _.dd.map((A, F) =>
                          W.jsx(
                            'text',
                            {
                              x: _.x + 1,
                              y: _.ddY + F * 1.8 + 1.2,
                              fill: '#cbd5e1',
                              fontSize: '1.7',
                              fontFamily: "'Consolas',monospace",
                              letterSpacing: '0.2',
                              children: A,
                            },
                            F
                          )
                        ),
                        _.mx &&
                          _.inPorts.length &&
                          _.outPorts.length &&
                          W.jsx('g', {
                            children: _.mx.internalConnections?.map((A, F) =>
                              W.jsx(
                                'path',
                                {
                                  d: `M ${_.x} ${_.inPorts[A.input]?.y} C ${_.x + _.w * 0.4} ${
                                    _.inPorts[A.input]?.y
                                  } ${_.x + _.w * 0.6} ${_.outPorts[A.output]?.y} ${_.x + _.w} ${
                                    _.outPorts[A.output]?.y
                                  }`,
                                  fill: 'none',
                                  stroke: '#f59e0b',
                                  strokeWidth: '.35',
                                  opacity: '.6',
                                },
                                F
                              )
                            ),
                          }),
                      ],
                    },
                    `m${_.id}`
                  )
                ),
                C.map(_ =>
                  W.jsxs(
                    'g',
                    {
                      className: le['topo-node'],
                      onMouseDown: A => re(A, _.id),
                      children: [
                        W.jsx('rect', {
                          x: _.x,
                          y: _.y,
                          width: '14',
                          height: '10',
                          rx: '.8',
                          fill: _.online ? 'rgba(59,130,246,0.1)' : 'var(--bg-primary)',
                          stroke: _.online ? 'var(--device-rf)' : 'var(--border-color)',
                          strokeWidth: '.4',
                        }),
                        W.jsx('text', {
                          x: _.x + 7,
                          y: _.y + 4,
                          fill: 'white',
                          fontSize: '3',
                          fontWeight: '600',
                          textAnchor: 'middle',
                          fontFamily: "'Consolas',monospace",
                          children: _.label,
                        }),
                        W.jsx('text', {
                          x: _.x + 7,
                          y: _.y + 7,
                          fill: '#94a3b8',
                          fontSize: '2',
                          textAnchor: 'middle',
                          children: _.lev,
                        }),
                      ],
                    },
                    `r${_.port}`
                  )
                ),
              ],
            }),
          }),
        ],
      }),
      W.jsxs('div', {
        className: le['topo-dock'],
        onMouseDown: _ => _.stopPropagation(),
        onWheel: _ => _.stopPropagation(),
        children: [
          W.jsx('button', {
            className: `${le['dock-btn']} ${n ? le.active : ''}`,
            onClick: Te,
            title: n ? '关闭滚轮缩放' : '开启滚轮缩放',
            children: W.jsxs('svg', {
              width: '12',
              height: '12',
              viewBox: '0 0 16 16',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              children: [
                W.jsx('circle', { cx: '6.5', cy: '6.5', r: '5' }),
                W.jsx('line', { x1: '10.2', y1: '10.2', x2: '15', y2: '15' }),
                n && W.jsx('line', { x1: '4', y1: '6.5', x2: '9', y2: '6.5' }),
                n && W.jsx('line', { x1: '6.5', y1: '4', x2: '6.5', y2: '9' }),
              ],
            }),
          }),
          W.jsx('button', {
            className: le['dock-btn'],
            onClick: Pe,
            title: '一键整理视图',
            children: W.jsxs('svg', {
              width: '12',
              height: '12',
              viewBox: '0 0 16 16',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              children: [
                W.jsx('rect', { x: '2', y: '2', width: '5', height: '5', rx: '0.5' }),
                W.jsx('rect', { x: '9', y: '2', width: '5', height: '5', rx: '0.5' }),
                W.jsx('rect', { x: '2', y: '9', width: '5', height: '5', rx: '0.5' }),
                W.jsx('rect', { x: '9', y: '9', width: '5', height: '5', rx: '0.5' }),
              ],
            }),
          }),
          W.jsx('div', { className: le['dock-sep'] }),
          W.jsx('button', {
            className: `${le['dock-btn']} ${c ? le.saved : ''}`,
            onClick: xe,
            title: '保存当前布局',
            children: W.jsxs('svg', {
              width: '12',
              height: '12',
              viewBox: '0 0 16 16',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              children: [
                W.jsx('path', { d: 'M3 1h8l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z' }),
                W.jsx('rect', { x: '5', y: '1', width: '5', height: '4', rx: '0.5' }),
                W.jsx('rect', { x: '4.5', y: '9', width: '7', height: '4', rx: '0.5' }),
                c && W.jsx('line', { x1: '5', y1: '11.5', x2: '11', y2: '11.5' }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
export { Vd as default };
