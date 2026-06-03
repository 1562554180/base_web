import { j as o } from './bootstrap-CaGnHU9H.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
const e = 'Matrix-module__matrixItem--Vupdg',
  r = 'Matrix-module__matrixTitle--YrCHu',
  i = 'Matrix-module__matrixInfo--Apll1',
  m = 'Matrix-module__matrixStat--Ku2MZ',
  u = 'Matrix-module__matrixConnectionsHorizontal--evLWm',
  x = 'Matrix-module__connBlock--x2Ow4',
  d = 'Matrix-module__connLabel--qAMC9',
  p = 'Matrix-module__connTable--qRH8x',
  h = 'Matrix-module__connRow--f9-Z3',
  _ = 'Matrix-module__colPort--hI2KX',
  j = 'Matrix-module__colConn--4wn-C',
  N = 'Matrix-module__colArrow--KWhDc',
  v = 'Matrix-module__connInternal--ptXxK',
  M = 'Matrix-module__connRowInline--gw9q8',
  I = 'Matrix-module__connOutput--CkQYF',
  n = {
    matrixItem: e,
    matrixTitle: r,
    matrixInfo: i,
    matrixStat: m,
    matrixConnectionsHorizontal: u,
    connBlock: x,
    connLabel: d,
    connTable: p,
    connRow: h,
    colPort: _,
    colConn: j,
    colArrow: N,
    connInternal: v,
    connRowInline: M,
    connOutput: I,
  };
function T({ data: s }) {
  return o.jsxs('section', {
    className: 'module-section',
    children: [
      o.jsxs('div', { className: 'module-header', children: ['矩阵 (', s?.count, ' 台)'] }),
      o.jsx('div', {
        className: 'module-content',
        children: (s?.items || []).map((t, l) =>
          o.jsxs(
            'div',
            {
              className: n.matrixItem,
              children: [
                o.jsx('div', { className: n.matrixTitle, children: t.id }),
                o.jsxs('div', {
                  className: n.matrixInfo,
                  children: [
                    o.jsxs('span', {
                      className: n.matrixStat,
                      children: ['输入口: ', t.inputPorts],
                    }),
                    o.jsxs('span', {
                      className: n.matrixStat,
                      children: ['输出口: ', t.outputPorts],
                    }),
                  ],
                }),
                o.jsxs('div', {
                  className: n.matrixConnectionsHorizontal,
                  children: [
                    o.jsxs('div', {
                      className: `${n.connBlock} ${n.connInput}`,
                      children: [
                        o.jsx('div', { className: n.connLabel, children: '输入' }),
                        o.jsx('div', {
                          className: n.connTable,
                          children: Array.from({ length: t.inputPorts }).map((a, c) =>
                            o.jsxs(
                              'div',
                              {
                                className: n.connRow,
                                title: t.inputConnections?.[c] || '-',
                                children: [
                                  o.jsx('span', { className: n.colPort, children: c }),
                                  o.jsx('span', {
                                    className: n.colConn,
                                    children: t.inputConnections?.[c] || '',
                                  }),
                                ],
                              },
                              'in' + c
                            )
                          ),
                        }),
                      ],
                    }),
                    o.jsxs('div', {
                      className: `${n.connBlock} ${n.connInternal}`,
                      children: [
                        o.jsx('div', { className: n.connLabel, children: '内联' }),
                        o.jsx('div', {
                          className: n.connTable,
                          children: Array.from({ length: t.inputPorts }).map((a, c) =>
                            o.jsxs(
                              'div',
                              {
                                className: `${n.connRow} ${n.connRowInline} value-good`,
                                children: [
                                  o.jsx('span', { className: n.colPort, children: c }),
                                  o.jsx('span', { className: n.colArrow, children: '→' }),
                                  o.jsx('span', {
                                    className: n.colPort,
                                    children:
                                      t.outputPortMap?.[c] !== void 0 ? t.outputPortMap[c] : '',
                                  }),
                                ],
                              },
                              'int' + c
                            )
                          ),
                        }),
                      ],
                    }),
                    o.jsxs('div', {
                      className: `${n.connBlock} ${n.connOutput}`,
                      children: [
                        o.jsx('div', { className: n.connLabel, children: '输出' }),
                        o.jsx('div', {
                          className: n.connTable,
                          children: Array.from({ length: t.outputPorts }).map((a, c) =>
                            o.jsxs(
                              'div',
                              {
                                className: n.connRow,
                                title: t.outputConnections?.[c] || '-',
                                children: [
                                  o.jsx('span', { className: n.colPort, children: c }),
                                  o.jsx('span', {
                                    className: n.colConn,
                                    children: t.outputConnections?.[c] || '',
                                  }),
                                ],
                              },
                              'out' + c
                            )
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            },
            l
          )
        ),
      }),
    ],
  });
}
export { T as default };
