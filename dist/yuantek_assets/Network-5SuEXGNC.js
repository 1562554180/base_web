import { R as d, j as t } from './bootstrap-CaGnHU9H.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
const l = 'Network-module__networkSection--35tsZ',
  c = 'Network-module__networkContent--GS0K4',
  u = 'Network-module__statusIndicator--y0Che',
  a = 'Network-module__statusDot--HidsD',
  x = 'Network-module__enabled--Li9ha',
  h = 'Network-module__disabled--iV5xB',
  m = 'Network-module__error--Hju45',
  n = {
    networkSection: l,
    networkContent: c,
    statusIndicator: u,
    statusDot: a,
    enabled: x,
    disabled: h,
    error: m,
  };
function j(r) {
  return r >= 1e9
    ? (r / 1e9).toFixed(2) + ' Gbps'
    : r >= 1e6
      ? (r / 1e6).toFixed(2) + ' Mbps'
      : r >= 1e3
        ? (r / 1e3).toFixed(2) + ' kbps'
        : r + ' bps';
}
function i(r) {
  if (r == null || r === '') return '--';
  const s = typeof r == 'string' ? parseFloat(r) : r;
  return isNaN(s) ? String(r) : j(s);
}
function F({ data: r }) {
  const s = d.useMemo(
    () =>
      r
        ? Array.isArray(r.interfaces)
          ? r.interfaces
          : r.dual && Array.isArray(r.dual.interfaces)
            ? r.dual.interfaces
            : []
        : [],
    [r]
  );
  return t.jsxs('section', {
    className: `module-section ${n.networkSection}`,
    children: [
      t.jsx('div', { className: 'module-header', children: t.jsx('span', { children: '网络' }) }),
      t.jsx('div', {
        className: `module-content ${n.networkContent}`,
        children: s.map((e, o) =>
          t.jsxs(
            'div',
            {
              children: [
                t.jsx('table', {
                  className: 'data-table',
                  children: t.jsxs('tbody', {
                    children: [
                      t.jsxs('tr', {
                        children: [
                          t.jsx('th', { children: '网卡名称' }),
                          t.jsx('td', {
                            children: t.jsxs('span', {
                              className: 'status-indicator',
                              children: [
                                t.jsx('span', { className: `status-dot ${n[e.status]}` }),
                                e.name,
                              ],
                            }),
                          }),
                        ],
                      }),
                      t.jsxs('tr', {
                        children: [
                          t.jsx('th', { children: 'IP地址' }),
                          t.jsx('td', { children: e.ip || '--' }),
                        ],
                      }),
                      t.jsxs('tr', {
                        children: [
                          t.jsx('th', { children: 'MAC地址' }),
                          t.jsx('td', {
                            children: t.jsx('span', {
                              style: { fontFamily: 'var(--font-mono)' },
                              children: e.mac,
                            }),
                          }),
                        ],
                      }),
                      t.jsxs('tr', {
                        children: [
                          t.jsx('th', { children: '子网掩码' }),
                          t.jsx('td', { children: e.netmask || '--' }),
                        ],
                      }),
                      t.jsxs('tr', {
                        children: [
                          t.jsx('th', { children: '默认网关' }),
                          t.jsx('td', { children: e.gateway || '--' }),
                        ],
                      }),
                      t.jsxs('tr', {
                        children: [
                          t.jsx('th', { children: '流量状态' }),
                          t.jsx('td', {
                            children: t.jsxs('span', {
                              className: 'value-normal',
                              children: ['RX: ', i(e.traffic?.rx), ' / TX:', ' ', i(e.traffic?.tx)],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                o < s.length - 1 &&
                  t.jsx('hr', {
                    style: {
                      border: 'none',
                      borderTop: '1px solid var(--border-color)',
                      margin: '4px 0',
                    },
                  }),
              ],
            },
            o
          )
        ),
      }),
    ],
  });
}
export { F as default };
