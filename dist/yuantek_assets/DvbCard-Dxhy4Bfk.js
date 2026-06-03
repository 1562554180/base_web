import { j as s } from './bootstrap-CaGnHU9H.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
const n = 'DvbCard-module__dvbCardList--zZqFE',
  r = 'DvbCard-module__dvbCardItem--c7lOR',
  t = 'DvbCard-module__dvbCardTitle--zewoY',
  i = 'DvbCard-module__dvbCardGrid--HsH6E',
  v = 'DvbCard-module__dvbStat--U3GGo',
  b = 'DvbCard-module__dvbLabel--cQyA1',
  c = 'DvbCard-module__dvbValue--saQqE',
  m = 'DvbCard-module__mono--vjMhF',
  e = {
    dvbCardList: n,
    dvbCardItem: r,
    dvbCardTitle: t,
    dvbCardGrid: i,
    dvbStat: v,
    dvbLabel: b,
    dvbValue: c,
    mono: m,
  };
function u(d) {
  return d >= 70 ? 'value-error' : d >= 60 ? 'value-warning' : '';
}
function o(d) {
  return d > -20 ? 'value-good' : d > -30 ? '' : d > -40 ? 'value-warning' : 'value-error';
}
function L({ data: d }) {
  return s.jsxs('section', {
    className: 'module-section',
    children: [
      s.jsxs('div', { className: 'module-header', children: ['DVB板卡 (', d?.count, ' 块)'] }),
      s.jsx('div', {
        className: 'module-content',
        children: s.jsx('div', {
          className: e.dvbCardList,
          children: (d?.items || []).map((a, l) =>
            s.jsxs(
              'div',
              {
                className: e.dvbCardItem,
                children: [
                  s.jsxs('div', { className: e.dvbCardTitle, children: ['DVB-', a.id] }),
                  s.jsxs('div', {
                    className: e.dvbCardGrid,
                    children: [
                      s.jsxs('span', {
                        className: e.dvbStat,
                        children: [
                          s.jsx('span', { className: e.dvbLabel, children: '版本' }),
                          s.jsx('span', { className: e.dvbValue, children: a.version }),
                        ],
                      }),
                      s.jsxs('span', {
                        className: e.dvbStat,
                        children: [
                          s.jsx('span', { className: e.dvbLabel, children: '输入口' }),
                          s.jsxs('span', { className: e.dvbValue, children: [a.inputPorts, '口'] }),
                        ],
                      }),
                      s.jsxs('span', {
                        className: e.dvbStat,
                        children: [
                          s.jsx('span', { className: e.dvbLabel, children: 'DNA' }),
                          s.jsx('span', { className: `${e.dvbValue} ${e.mono}`, children: a.dna }),
                        ],
                      }),
                      s.jsxs('span', {
                        className: e.dvbStat,
                        children: [
                          s.jsx('span', { className: e.dvbLabel, children: '通道' }),
                          s.jsxs('span', {
                            className: e.dvbValue,
                            children: [a.channels?.used, '/', a.channels?.total],
                          }),
                        ],
                      }),
                      s.jsxs('span', {
                        className: `${e.dvbStat} ${u(a.temperature)}`,
                        children: [
                          s.jsx('span', { className: e.dvbLabel, children: '温度' }),
                          s.jsxs('span', {
                            className: e.dvbValue,
                            children: [a.temperature, '°C'],
                          }),
                        ],
                      }),
                      s.jsxs('span', {
                        className: `${e.dvbStat} ${o(a.level)}`,
                        children: [
                          s.jsx('span', { className: e.dvbLabel, children: '电平' }),
                          s.jsxs('span', { className: e.dvbValue, children: [a.level, 'dBm'] }),
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
      }),
    ],
  });
}
export { L as default };
