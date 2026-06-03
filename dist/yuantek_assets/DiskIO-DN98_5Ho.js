import { R as a, j as s } from './bootstrap-CaGnHU9H.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
const r = 'DiskIO-module__diskSection--MOe8W',
  l = 'DiskIO-module__diskContent--8crAb',
  d = 'DiskIO-module__subCard--CQSG6',
  m = 'DiskIO-module__subHeader---kU7g',
  I = 'DiskIO-module__subDivider--ElcJ0',
  _ = 'DiskIO-module__mountList--fUpz-',
  x = 'DiskIO-module__mountItem--TLZnH',
  N = 'DiskIO-module__mountName--TiLud',
  j = 'DiskIO-module__mountSize--TevKW',
  k = 'DiskIO-module__mountPercent--qO3GS',
  v = 'DiskIO-module__ioMetrics--FNYKh',
  h = 'DiskIO-module__ioMetric--vK8Ng',
  p = 'DiskIO-module__ioLabel--XSXrx',
  D = 'DiskIO-module__ioIcon--qXe3F',
  O = 'DiskIO-module__readIcon--iyU7T',
  b = 'DiskIO-module__writeIcon--T3XWc',
  f = 'DiskIO-module__ioValue--O5ZbW',
  M = 'DiskIO-module__ioUnit--Y-OJj',
  e = {
    diskSection: r,
    diskContent: l,
    subCard: d,
    subHeader: m,
    subDivider: I,
    mountList: _,
    mountItem: x,
    mountName: N,
    mountSize: j,
    mountPercent: k,
    ioMetrics: v,
    ioMetric: h,
    ioLabel: p,
    ioIcon: D,
    readIcon: O,
    writeIcon: b,
    ioValue: f,
    ioUnit: M,
  };
function C(i) {
  return i >= 95 ? 'value-error' : i >= 80 ? 'value-warning' : 'value-good';
}
function u(i) {
  if (i == null) return { value: '--', unit: '' };
  const o = typeof i == 'object' && i.value != null ? i.value : i;
  return typeof o != 'number' || isNaN(o)
    ? { value: String(o), unit: '' }
    : o >= 1e9
      ? { value: (o / 1e9).toFixed(2), unit: 'GB/s' }
      : o >= 1e6
        ? { value: (o / 1e6).toFixed(2), unit: 'MB/s' }
        : o >= 1e3
          ? { value: (o / 1e3).toFixed(2), unit: 'KB/s' }
          : { value: o.toFixed(0), unit: 'B/s' };
}
function w({ data: i }) {
  const o = a.useMemo(() => u(i?.ioRate?.read), [i?.ioRate?.read]),
    t = a.useMemo(() => u(i?.ioRate?.write), [i?.ioRate?.write]);
  return s.jsxs('section', {
    className: `module-section ${e.diskSection}`,
    children: [
      s.jsx('div', { className: 'module-header', children: '磁盘IO' }),
      s.jsxs('div', {
        className: `module-content ${e.diskContent}`,
        children: [
          s.jsxs('div', {
            className: e.subCard,
            children: [
              s.jsx('div', { className: e.subHeader, children: '分区使用' }),
              s.jsx('div', {
                className: e.mountList,
                children: (i?.mounts || []).map((n, c) =>
                  s.jsxs(
                    'div',
                    {
                      className: e.mountItem,
                      children: [
                        s.jsx('span', { className: e.mountName, children: n.path }),
                        s.jsxs('span', {
                          className: e.mountSize,
                          children: [n.used, ' / ', n.total, ' GB'],
                        }),
                        s.jsxs('span', {
                          className: `${e.mountPercent} ${C(n.usage)}`,
                          children: [n.usage?.toFixed(1), '%'],
                        }),
                      ],
                    },
                    c
                  )
                ),
              }),
            ],
          }),
          s.jsx('div', { className: e.subDivider }),
          s.jsxs('div', {
            className: e.subCard,
            children: [
              s.jsx('div', { className: e.subHeader, children: 'IO 速率' }),
              s.jsxs('div', {
                className: e.ioMetrics,
                children: [
                  s.jsxs('div', {
                    className: e.ioMetric,
                    children: [
                      s.jsxs('span', {
                        className: e.ioLabel,
                        children: [
                          s.jsx('span', { className: `${e.ioIcon} ${e.readIcon}`, children: 'R' }),
                          '读取',
                        ],
                      }),
                      s.jsxs('span', {
                        className: `${e.ioValue} value-good`,
                        children: [
                          o.value,
                          s.jsx('span', { className: e.ioUnit, children: o.unit }),
                        ],
                      }),
                    ],
                  }),
                  s.jsxs('div', {
                    className: e.ioMetric,
                    children: [
                      s.jsxs('span', {
                        className: e.ioLabel,
                        children: [
                          s.jsx('span', { className: `${e.ioIcon} ${e.writeIcon}`, children: 'W' }),
                          '写入',
                        ],
                      }),
                      s.jsxs('span', {
                        className: `${e.ioValue} value-warning`,
                        children: [
                          t.value,
                          s.jsx('span', { className: e.ioUnit, children: t.unit }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { w as default };
