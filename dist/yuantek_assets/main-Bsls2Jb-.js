const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = ['yuantek_assets/bootstrap-CaGnHU9H.js', 'yuantek_assets/bootstrap-DiVHRZ-F.css'])
) => i.map(i => d[i]);
(function() {
  const l = document.createElement('link').relList;
  if (l && l.supports && l.supports('modulepreload')) return;
  for (const e of document.querySelectorAll('link[rel="modulepreload"]')) d(e);
  new MutationObserver(e => {
    for (const t of e)
      if (t.type === 'childList')
        for (const r of t.addedNodes) r.tagName === 'LINK' && r.rel === 'modulepreload' && d(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function u(e) {
    const t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === 'use-credentials'
        ? (t.credentials = 'include')
        : e.crossOrigin === 'anonymous'
          ? (t.credentials = 'omit')
          : (t.credentials = 'same-origin'),
      t
    );
  }
  function d(e) {
    if (e.ep) return;
    e.ep = !0;
    const t = u(e);
    fetch(e.href, t);
  }
})();
const y = 'modulepreload',
  g = function(c) {
    return '/' + c;
  },
  m = {},
  v = function(l, u, d) {
    let e = Promise.resolve();
    if (u && u.length > 0) {
      let r = function(o) {
        return Promise.all(
          o.map(i =>
            Promise.resolve(i).then(
              a => ({ status: 'fulfilled', value: a }),
              a => ({ status: 'rejected', reason: a })
            )
          )
        );
      };
      document.getElementsByTagName('link');
      const n = document.querySelector('meta[property=csp-nonce]'),
        f = n?.nonce || n?.getAttribute('nonce');
      e = r(
        u.map(o => {
          if (((o = g(o)), o in m)) return;
          m[o] = !0;
          const i = o.endsWith('.css'),
            a = i ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${o}"]${a}`)) return;
          const s = document.createElement('link');
          if (
            ((s.rel = i ? 'stylesheet' : y),
            i || (s.as = 'script'),
            (s.crossOrigin = ''),
            (s.href = o),
            f && s.setAttribute('nonce', f),
            document.head.appendChild(s),
            i)
          )
            return new Promise((p, h) => {
              s.addEventListener('load', p),
                s.addEventListener('error', () => h(new Error(`Unable to preload CSS for ${o}`)));
            });
        })
      );
    }
    function t(r) {
      const n = new Event('vite:preloadError', { cancelable: !0 });
      if (((n.payload = r), window.dispatchEvent(n), !n.defaultPrevented)) throw r;
    }
    return e.then(r => {
      for (const n of r || []) n.status === 'rejected' && t(n.reason);
      return l().catch(t);
    });
  };
v(() => import('./bootstrap-CaGnHU9H.js').then(c => c.p_), __vite__mapDeps([0, 1]));
export { v as _ };
