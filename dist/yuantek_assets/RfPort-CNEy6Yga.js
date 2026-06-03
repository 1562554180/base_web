import { j as e } from './bootstrap-CaGnHU9H.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
const l = 'RfPort-module__rfList--5Afhk',
  n = 'RfPort-module__rfItem--SSmYr',
  f = 'RfPort-module__rfPort--TT8Rt',
  m = 'RfPort-module__rfSep--O8c2G',
  c = 'RfPort-module__rfConn--oGcy9',
  i = 'RfPort-module__rfLevel--qZxOk',
  r = { rfList: l, rfItem: n, rfPort: f, rfSep: m, rfConn: c, rfLevel: i };
function a(s) {
  return s > -20 ? 'value-good' : s > -30 ? '' : s > -40 ? 'value-warning' : 'value-error';
}
function _({ data: s }) {
  return e.jsxs('section', {
    className: 'module-section',
    children: [
      e.jsxs('div', { className: 'module-header', children: ['射频输入口 (', s?.count, ')'] }),
      e.jsx('div', {
        className: 'module-content',
        children: e.jsx('div', {
          className: r.rfList,
          children: (s?.connections || []).map((t, o) =>
            e.jsxs(
              'div',
              {
                className: r.rfItem,
                children: [
                  e.jsxs('span', { className: r.rfPort, children: ['IN-', t.port] }),
                  e.jsx('span', { className: r.rfSep, children: '→' }),
                  e.jsx('span', { className: r.rfConn, children: t.connectedTo }),
                  t.level !== null
                    ? e.jsxs('span', {
                        className: `${r.rfLevel} ${a(t.level)}`,
                        children: [t.level, 'dBm'],
                      })
                    : e.jsx('span', { className: `${r.rfLevel} text-muted`, children: '--' }),
                ],
              },
              o
            )
          ),
        }),
      }),
    ],
  });
}
export { _ as default };
