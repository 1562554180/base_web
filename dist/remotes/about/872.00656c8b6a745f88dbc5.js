/*! For license information please see 872.00656c8b6a745f88dbc5.js.LICENSE.txt */
'use strict';
(self.webpackChunkpage_about = self.webpackChunkpage_about || []).push([
  [832, 872],
  {
    20: (e, n, r) => {
      r(228);
      var t = r(995),
        a = 60103;
      if ('function' == typeof Symbol && Symbol.for) {
        var o = Symbol.for;
        (a = o('react.element')), o('react.fragment');
      }
      var s = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
        i = Object.prototype.hasOwnProperty,
        c = { key: !0, ref: !0, __self: !0, __source: !0 };
      function l(e, n, r) {
        var t,
          o = {},
          l = null,
          p = null;
        for (t in (void 0 !== r && (l = '' + r),
        void 0 !== n.key && (l = '' + n.key),
        void 0 !== n.ref && (p = n.ref),
        n))
          i.call(n, t) && !c.hasOwnProperty(t) && (o[t] = n[t]);
        if (e && e.defaultProps) for (t in (n = e.defaultProps)) void 0 === o[t] && (o[t] = n[t]);
        return { $$typeof: a, type: e, key: l, ref: p, props: o, _owner: s.current };
      }
      (n.jsx = l), (n.jsxs = l);
    },
    56: (e, n, r) => {
      e.exports = function(e) {
        var n = r.nc;
        n && e.setAttribute('nonce', n);
      };
    },
    72: e => {
      var n = [];
      function r(e) {
        for (var r = -1, t = 0; t < n.length; t++)
          if (n[t].identifier === e) {
            r = t;
            break;
          }
        return r;
      }
      function t(e, t) {
        for (var o = {}, s = [], i = 0; i < e.length; i++) {
          var c = e[i],
            l = t.base ? c[0] + t.base : c[0],
            p = o[l] || 0,
            d = ''.concat(l, ' ').concat(p);
          o[l] = p + 1;
          var u = r(d),
            f = { css: c[1], media: c[2], sourceMap: c[3], supports: c[4], layer: c[5] };
          if (-1 !== u) n[u].references++, n[u].updater(f);
          else {
            var m = a(f, t);
            (t.byIndex = i), n.splice(i, 0, { identifier: d, updater: m, references: 1 });
          }
          s.push(d);
        }
        return s;
      }
      function a(e, n) {
        var r = n.domAPI(n);
        return (
          r.update(e),
          function(n) {
            if (n) {
              if (
                n.css === e.css &&
                n.media === e.media &&
                n.sourceMap === e.sourceMap &&
                n.supports === e.supports &&
                n.layer === e.layer
              )
                return;
              r.update((e = n));
            } else r.remove();
          }
        );
      }
      e.exports = function(e, a) {
        var o = t((e = e || []), (a = a || {}));
        return function(e) {
          e = e || [];
          for (var s = 0; s < o.length; s++) {
            var i = r(o[s]);
            n[i].references--;
          }
          for (var c = t(e, a), l = 0; l < o.length; l++) {
            var p = r(o[l]);
            0 === n[p].references && (n[p].updater(), n.splice(p, 1));
          }
          o = c;
        };
      };
    },
    113: e => {
      e.exports = function(e, n) {
        if (n.styleSheet) n.styleSheet.cssText = e;
        else {
          for (; n.firstChild; ) n.removeChild(n.firstChild);
          n.appendChild(document.createTextNode(e));
        }
      };
    },
    228: e => {
      var n = Object.getOwnPropertySymbols,
        r = Object.prototype.hasOwnProperty,
        t = Object.prototype.propertyIsEnumerable;
      e.exports = (function() {
        try {
          if (!Object.assign) return !1;
          var e = new String('abc');
          if (((e[5] = 'de'), '5' === Object.getOwnPropertyNames(e)[0])) return !1;
          for (var n = {}, r = 0; r < 10; r++) n['_' + String.fromCharCode(r)] = r;
          if (
            '0123456789' !==
            Object.getOwnPropertyNames(n)
              .map(function(e) {
                return n[e];
              })
              .join('')
          )
            return !1;
          var t = {};
          return (
            'abcdefghijklmnopqrst'.split('').forEach(function(e) {
              t[e] = e;
            }),
            'abcdefghijklmnopqrst' === Object.keys(Object.assign({}, t)).join('')
          );
        } catch (e) {
          return !1;
        }
      })()
        ? Object.assign
        : function(e, a) {
            for (
              var o,
                s,
                i = (function(e) {
                  if (null == e)
                    throw new TypeError('Object.assign cannot be called with null or undefined');
                  return Object(e);
                })(e),
                c = 1;
              c < arguments.length;
              c++
            ) {
              for (var l in (o = Object(arguments[c]))) r.call(o, l) && (i[l] = o[l]);
              if (n) {
                s = n(o);
                for (var p = 0; p < s.length; p++) t.call(o, s[p]) && (i[s[p]] = o[s[p]]);
              }
            }
            return i;
          };
    },
    314: e => {
      e.exports = function(e) {
        var n = [];
        return (
          (n.toString = function() {
            return this.map(function(n) {
              var r = '',
                t = void 0 !== n[5];
              return (
                n[4] && (r += '@supports ('.concat(n[4], ') {')),
                n[2] && (r += '@media '.concat(n[2], ' {')),
                t && (r += '@layer'.concat(n[5].length > 0 ? ' '.concat(n[5]) : '', ' {')),
                (r += e(n)),
                t && (r += '}'),
                n[2] && (r += '}'),
                n[4] && (r += '}'),
                r
              );
            }).join('');
          }),
          (n.i = function(e, r, t, a, o) {
            'string' == typeof e && (e = [[null, e, void 0]]);
            var s = {};
            if (t)
              for (var i = 0; i < this.length; i++) {
                var c = this[i][0];
                null != c && (s[c] = !0);
              }
            for (var l = 0; l < e.length; l++) {
              var p = [].concat(e[l]);
              (t && s[p[0]]) ||
                (void 0 !== o &&
                  (void 0 === p[5] ||
                    (p[1] = '@layer'
                      .concat(p[5].length > 0 ? ' '.concat(p[5]) : '', ' {')
                      .concat(p[1], '}')),
                  (p[5] = o)),
                r &&
                  (p[2]
                    ? ((p[1] = '@media '.concat(p[2], ' {').concat(p[1], '}')), (p[2] = r))
                    : (p[2] = r)),
                a &&
                  (p[4]
                    ? ((p[1] = '@supports ('.concat(p[4], ') {').concat(p[1], '}')), (p[4] = a))
                    : (p[4] = ''.concat(a))),
                n.push(p));
            }
          }),
          n
        );
      };
    },
    365: (e, n, r) => {
      r.d(n, { A: () => i });
      var t = r(601),
        a = r.n(t),
        o = r(314),
        s = r.n(o)()(a());
      s.push([
        e.id,
        ".page {\n  font-family: 'Segoe UI', Arial, sans-serif;\n  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(14, 165, 233, 0.15));\n  border-radius: 12px;\n  padding: 32px;\n  box-shadow: 0 12px 32px rgba(30, 64, 175, 0.15);\n  color: #0f172a;\n  min-height: 280px;\n}\n\n.page__title {\n  margin: 0 0 12px;\n  font-size: 24px;\n  color: #312e81;\n}\n\n.page__subtitle {\n  margin: 0 0 16px;\n  font-size: 20px;\n}\n\n.page__body {\n  margin: 0 0 24px;\n  line-height: 1.6;\n}\n\n.team {\n  display: flex;\n  gap: 24px;\n}\n\n.team__sidebar {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-width: 180px;\n}\n\n.team__member {\n  border: 1px solid rgba(30, 64, 175, 0.3);\n  border-radius: 8px;\n  padding: 12px;\n  background-color: transparent;\n  cursor: pointer;\n  text-align: left;\n  transition: all 0.2s ease;\n}\n\n.team__member:hover,\n.team__member--active {\n  background-color: rgba(30, 64, 175, 0.1);\n  border-color: rgba(30, 64, 175, 0.6);\n}\n\n.team__member-name {\n  font-weight: 600;\n}\n\n.team__member-role {\n  font-size: 12px;\n  color: #4b5563;\n}\n\n.team__detail {\n  flex: 1;\n  background-color: rgba(255, 255, 255, 0.65);\n  border-radius: 12px;\n  padding: 20px;\n  box-shadow: inset 0 0 0 1px rgba(30, 64, 175, 0.1);\n}\n\n\n\n",
        '',
      ]);
      const i = s;
    },
    540: e => {
      e.exports = function(e) {
        var n = document.createElement('style');
        return e.setAttributes(n, e.attributes), e.insert(n, e.options), n;
      };
    },
    601: e => {
      e.exports = function(e) {
        return e[1];
      };
    },
    659: e => {
      var n = {};
      e.exports = function(e, r) {
        var t = (function(e) {
          if (void 0 === n[e]) {
            var r = document.querySelector(e);
            if (window.HTMLIFrameElement && r instanceof window.HTMLIFrameElement)
              try {
                r = r.contentDocument.head;
              } catch (e) {
                r = null;
              }
            n[e] = r;
          }
          return n[e];
        })(e);
        if (!t)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid."
          );
        t.appendChild(r);
      };
    },
    788: (e, n, r) => {
      var t = r(72),
        a = r.n(t),
        o = r(825),
        s = r.n(o),
        i = r(659),
        c = r.n(i),
        l = r(56),
        p = r.n(l),
        d = r(540),
        u = r.n(d),
        f = r(113),
        m = r.n(f),
        b = r(365),
        g = {};
      (g.styleTagTransform = m()),
        (g.setAttributes = p()),
        (g.insert = c().bind(null, 'head')),
        (g.domAPI = s()),
        (g.insertStyleElement = u()),
        a()(b.A, g),
        b.A && b.A.locals && b.A.locals;
    },
    825: e => {
      e.exports = function(e) {
        if ('undefined' == typeof document) return { update: function() {}, remove: function() {} };
        var n = e.insertStyleElement(e);
        return {
          update: function(r) {
            !(function(e, n, r) {
              var t = '';
              r.supports && (t += '@supports ('.concat(r.supports, ') {')),
                r.media && (t += '@media '.concat(r.media, ' {'));
              var a = void 0 !== r.layer;
              a && (t += '@layer'.concat(r.layer.length > 0 ? ' '.concat(r.layer) : '', ' {')),
                (t += r.css),
                a && (t += '}'),
                r.media && (t += '}'),
                r.supports && (t += '}');
              var o = r.sourceMap;
              o &&
                'undefined' != typeof btoa &&
                (t += '\n/*# sourceMappingURL=data:application/json;base64,'.concat(
                  btoa(unescape(encodeURIComponent(JSON.stringify(o)))),
                  ' */'
                )),
                n.styleTagTransform(t, e, n.options);
            })(n, e, r);
          },
          remove: function() {
            !(function(e) {
              if (null === e.parentNode) return !1;
              e.parentNode.removeChild(e);
            })(n);
          },
        };
      };
    },
    848: (e, n, r) => {
      e.exports = r(20);
    },
    872: (e, n, r) => {
      r.r(n), r.d(n, { default: () => s });
      var t = r(995),
        a = (r(788), r(848));
      const o = [
          { name: 'Alice', role: '前端负责人', focus: 'Module Federation 架构设计' },
          { name: 'Bob', role: '后端联调', focus: '契约、接口与部署流程' },
          { name: 'Carol', role: '产品体验', focus: '跨页面一致性和性能指标' },
        ],
        s = ({ standalone: e = !1, userInfo: n, onSelectMember: r, sendMessage: s }) => {
          const [i, c] = (0, t.useState)(o[0]);
          return (0, a.jsxs)('section', {
            className: 'page page--about',
            children: [
              e &&
                (0, a.jsx)('h1', { className: 'page__title', children: 'About Remote Standalone' }),
              n &&
                (0, a.jsxs)('div', {
                  style: {
                    background: '#e6f7ff',
                    padding: '12px 16px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                    border: '1px solid #91d5ff',
                  },
                  children: [
                    (0, a.jsx)('strong', { children: '主应用用户信息：' }),
                    (0, a.jsxs)('span', { children: [' ', n.name || 'Guest'] }),
                    n.isLogined &&
                      (0, a.jsx)('span', { style: { color: '#52c41a' }, children: ' (已登录)' }),
                  ],
                }),
              (0, a.jsx)('h2', { className: 'page__subtitle', children: '关于本示例' }),
              (0, a.jsx)('p', {
                className: 'page__body',
                children:
                  '该页面演示了另一个远程 bundle，可以独立构建并部署，Shell 在运行时按需加载。',
              }),
              s &&
                (0, a.jsx)('button', {
                  onClick: () => {
                    s &&
                      s({
                        type: 'ABOUT_PAGE_EVENT',
                        payload: { member: i, timestamp: Date.now() },
                      });
                  },
                  style: {
                    marginBottom: '16px',
                    padding: '8px 16px',
                    background: '#1890ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  },
                  children: '向主应用发送消息',
                }),
              (0, a.jsxs)('div', {
                className: 'team',
                children: [
                  (0, a.jsx)('aside', {
                    className: 'team__sidebar',
                    children: o.map(e =>
                      (0, a.jsxs)(
                        'button',
                        {
                          type: 'button',
                          className:
                            'team__member' + (i.name === e.name ? ' team__member--active' : ''),
                          onClick: () =>
                            (e => {
                              c(e), r && r(e);
                            })(e),
                          children: [
                            (0, a.jsx)('div', { className: 'team__member-name', children: e.name }),
                            (0, a.jsx)('div', { className: 'team__member-role', children: e.role }),
                          ],
                        },
                        e.name
                      )
                    ),
                  }),
                  (0, a.jsxs)('article', {
                    className: 'team__detail',
                    children: [
                      (0, a.jsx)('h3', { children: i.name }),
                      (0, a.jsx)('p', { children: i.role }),
                      (0, a.jsxs)('p', { children: ['关注点：', i.focus] }),
                    ],
                  }),
                ],
              }),
            ],
          });
        };
    },
  },
]);
