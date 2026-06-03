import { r as a, j as e } from './bootstrap-CaGnHU9H.js';
import {
  getSystemStatus as I,
  getCpuModules as F,
  getHardwareTopology as U,
  getHardwarePorts as q,
  getHardwareCards as A,
} from './v1Client-BUALcd7e.js';
import W from './CpuModule-CVIv3Eis.js';
import H from './DeviceTimeSync-0fuO4wAY.js';
import z from './SystemResource-DWS4QKHl.js';
import Q from './Network-5SuEXGNC.js';
import O from './DiskIO-DN98_5Ho.js';
import X from './TopologyGraph-B391IygL.js';
import J from './RfPort-CNEy6Yga.js';
import Z from './Matrix-_95i5-IS.js';
import K from './AdCard-C-UvHvcZ.js';
import Y from './DvbCard-Dxhy4Bfk.js';
import tt from './Converter-DEPX3kwR.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
import './mockData-Jc3uHu98.js';
import './TopologyGV-Byo8D-aR.js';
import './_baseSet-BT-05xLc.js';
import './toInteger-B7KQihtg.js';
const et = 'index-module__statusPage--V8Qkn',
  at = 'index-module__tabNav--WertA',
  st = 'index-module__tabBtn--csg06',
  rt = 'index-module__active--sCNr7',
  ot = 'index-module__tabContent--3QJpL',
  nt = 'index-module__tabPanel--ja2sk',
  lt = 'index-module__tabScrollable--XW9nQ',
  ct = 'index-module__scenarioBar--FnivX',
  it = 'index-module__scenarioLabel--rUt9l',
  dt = 'index-module__scenarioBtn--6aUt-',
  ut = 'index-module__topologyContainer--rqneN',
  mt = 'index-module__topologyGraphWrapper--V24ho',
  pt = 'index-module__graphRack--3BDjH',
  ft = 'index-module__topologyGrid--fizCZ',
  Ct = 'index-module__rfNarrow--SeDwf',
  s = {
    statusPage: et,
    tabNav: at,
    tabBtn: st,
    active: rt,
    tabContent: ot,
    tabPanel: nt,
    tabScrollable: lt,
    scenarioBar: ct,
    scenarioLabel: it,
    scenarioBtn: dt,
    topologyContainer: ut,
    topologyGraphWrapper: mt,
    graphRack: pt,
    topologyGrid: ft,
    rfNarrow: Ct,
  },
  D = 3e3;
function qt() {
  const [l, N] = a.useState('status'),
    [M, V] = a.useState('table'),
    [x, G] = a.useState(null),
    [j, E] = a.useState(null),
    [xt, R] = a.useState(null),
    [gt, L] = a.useState(null),
    [yt, $] = a.useState(null),
    [n, m] = a.useState({
      chains: [],
      rfPorts: { count: 0, connections: [] },
      matrix: { count: 0, items: [] },
      converters: [],
      dvbCards: [],
      adCards: [],
    }),
    [_, g] = a.useState(null),
    f = a.useRef(null),
    C = a.useRef(null),
    P = a.useMemo(() => j?.modules || [], [j]),
    p = a.useMemo(() => x || {}, [x]),
    d = a.useCallback(() => {
      f.current && (clearInterval(f.current), (f.current = null)),
        C.current && (clearInterval(C.current), (C.current = null));
    }, []),
    k = a.useCallback(
      () => {
        d(),
          (f.current = setInterval(() => {
            y();
          }, D)),
          (C.current = setInterval(() => {
            b();
          }, D));
      },
      [d]
    ),
    y = a.useCallback(async () => {
      try {
        const t = await I();
        if (!t) return;
        G(t);
      } catch (t) {
        console.error('[V1] 系统状态加载失败:', t);
      }
    }, []),
    b = a.useCallback(async () => {
      try {
        const t = await F();
        if (!t) return;
        E(t);
      } catch (t) {
        console.error('[V1] CPU 模块加载失败:', t);
      }
    }, []),
    B = a.useCallback(async () => {
      g(null);
      try {
        const t = await U();
        if (!t)
          return (
            m({
              chains: [],
              rfPorts: { count: 0, connections: [] },
              matrix: { count: 0, items: [] },
              converters: [],
              dvbCards: [],
              adCards: [],
            }),
            g('拓扑数据加载失败'),
            !1
          );
        R(t);
        const c = (t.converters || []).map(r => ({
          id: r.id,
          type: r.type,
          device: r.device,
          onlineStatus: r.onlineStatus,
          freq: r.freq,
          ifFreq: r.ifMod != null ? r.ifMod + 'MHz' : '—',
          centerLfFreq: r.freq,
          gain: r.outGain != null ? r.outGain : 0,
        }));
        return (
          m({
            chains: t.chains || [],
            rfPorts: t.rfPorts || { count: 0, connections: [] },
            matrix: t.matrix || { count: 0, items: [] },
            converters: c,
            dvbCards: t.dvbCards || [],
            adCards: t.adCards || [],
          }),
          !0
        );
      } catch (t) {
        return (
          m({
            chains: [],
            rfPorts: { count: 0, connections: [] },
            matrix: { count: 0, items: [] },
            converters: [],
            dvbCards: [],
            adCards: [],
          }),
          g(t.message),
          console.error('[V1] 拓扑加载失败:', t),
          !1
        );
      }
    }, []),
    w = a.useCallback(async () => {
      try {
        const t = await q();
        if (!t?.ports) return;
        L(t),
          m(c => {
            const r = (c.rfPorts?.connections || []).map(u => {
              const o = t.ports.find(i => i.portId === u.port);
              return o ? { ...u, level: o.level } : u;
            });
            return { ...c, rfPorts: { ...c.rfPorts, connections: r } };
          });
      } catch (t) {
        console.error('[V1] 端口加载失败:', t);
      }
    }, []),
    T = a.useCallback(async () => {
      try {
        const t = await A();
        if (!t) return;
        $(t),
          m(c => {
            let r = { ...c };
            if (t.adCards && c.adCards) {
              const u = c.adCards.map(o => {
                const i = t.adCards.find(S => S.id === o.id);
                return i
                  ? {
                      ...o,
                      temperature: i.temperature ?? o.temperature,
                      level: i.level ?? o.level,
                      status: i.status ?? o.status,
                    }
                  : o;
              });
              r = { ...r, adCards: u };
            }
            if (t.dvbCards && c.dvbCards) {
              const u = c.dvbCards.map(o => {
                const i = t.dvbCards.find(S => S.id === o.id);
                return i
                  ? {
                      ...o,
                      temperature: i.temperature ?? o.temperature,
                      level: i.level ?? o.level,
                      status: i.status ?? o.status,
                    }
                  : o;
              });
              r = { ...r, dvbCards: u };
            }
            return r;
          });
      } catch (t) {
        console.error('[V1] 板卡加载失败:', t);
      }
    }, []),
    v = a.useCallback(
      async () => {
        d(), await y(), await b(), l === 'status' && k();
      },
      [d, y, b, l, k]
    ),
    h = a.useCallback(
      async () => {
        d(), (await B()) && (await w(), await T());
      },
      [d, B, w, T]
    );
  return (
    a.useEffect(() => {
      l === 'status' ? v() : l === 'topology' && h();
    }, []),
    a.useEffect(
      () => {
        l === 'status' ? v() : l === 'topology' && (d(), h());
      },
      [l]
    ),
    a.useEffect(
      () => () => {
        d();
      },
      [d]
    ),
    e.jsx('div', {
      className: `sysstat-page ${s.statusPage}`,
      children: e.jsxs('div', {
        className: 'app-container',
        children: [
          e.jsxs('nav', {
            className: s.tabNav,
            children: [
              e.jsx('button', {
                className: `${s.tabBtn} ${l === 'status' ? s.active : ''}`,
                onClick: () => N('status'),
                children: '系统状态',
              }),
              e.jsx('button', {
                className: `${s.tabBtn} ${l === 'topology' ? s.active : ''}`,
                onClick: () => N('topology'),
                children: '系统拓扑',
              }),
            ],
          }),
          e.jsxs('div', {
            className: s.tabContent,
            children: [
              l === 'status' &&
                e.jsxs('div', {
                  className: `${s.tabPanel} ${s.tabScrollable}`,
                  children: [
                    e.jsxs('div', {
                      className: s.scenarioBar,
                      children: [
                        e.jsx('span', { className: s.scenarioLabel, children: '状态:' }),
                        e.jsx('span', {
                          style: { color: 'var(--text-muted)', fontSize: '10px' },
                          children: x ? '已连接' : '加载中...',
                        }),
                        e.jsx('button', {
                          className: s.scenarioBtn,
                          onClick: v,
                          title: '刷新数据',
                          children: '刷新',
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'grid-container',
                      children: [
                        P.map(t =>
                          e.jsx(
                            W,
                            {
                              title: t.title,
                              data: {
                                totalCores: t.totalCores,
                                systemUsage: t.systemUsage,
                                cores: t.cores,
                                numa: t.numa,
                                cpuIds: t.cpuIds,
                                status: t.status,
                                lastUpdateTime: t.lastUpdateTime,
                              },
                              className: `grid-area-${t.key}`,
                            },
                            t.key
                          )
                        ),
                        e.jsx(H, {
                          deviceData: p.device || {},
                          timeSyncData: p.timeSync || {},
                          className: 'grid-area-device-timesync',
                        }),
                        e.jsx(z, {
                          data: p.systemResource || {},
                          cpuModules: P,
                          className: 'grid-area-memory',
                        }),
                        e.jsx(Q, { data: p.network || {}, className: 'grid-area-network' }),
                        e.jsx(O, { data: p.disk || {}, className: 'grid-area-disk' }),
                      ],
                    }),
                  ],
                }),
              l === 'topology' &&
                e.jsxs('div', {
                  className: s.tabPanel,
                  children: [
                    e.jsxs('div', {
                      className: s.scenarioBar,
                      children: [
                        e.jsx('span', { className: s.scenarioLabel, children: '状态:' }),
                        e.jsx('span', {
                          style: { color: 'var(--text-muted)', fontSize: '10px' },
                          children: n.chains?.length > 0 ? '已连接' : '加载中...',
                        }),
                        e.jsx('button', {
                          className: s.scenarioBtn,
                          onClick: h,
                          title: '刷新拓扑',
                          children: '刷新',
                        }),
                      ],
                    }),
                    _ &&
                      e.jsxs('div', {
                        style: { color: 'red', padding: '10px' },
                        children: ['错误: ', _],
                      }),
                    e.jsxs('div', {
                      className: s.topologyContainer,
                      children: [
                        e.jsx('div', {
                          className: `${s.topologyGraphWrapper} ${M === 'rack' ? s.graphRack : ''}`,
                          children: e.jsx(X, { data: n, onViewModeChange: V }),
                        }),
                        e.jsxs('div', {
                          className: s.topologyGrid,
                          children: [
                            n.rfPorts && e.jsx(J, { data: n.rfPorts, className: s.rfNarrow }),
                            n.matrix?.count > 0 && e.jsx(Z, { data: n.matrix }),
                            n.converters?.length > 0 &&
                              e.jsx(tt, {
                                data: { count: n.converters.length, items: n.converters },
                              }),
                            n.adCards?.length > 0 &&
                              e.jsx(K, {
                                data: { count: n.adCards.length, items: n.adCards },
                                className: s.adSpan,
                              }),
                            n.dvbCards?.length > 0 &&
                              e.jsx(Y, { data: { count: n.dvbCards.length, items: n.dvbCards } }),
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
    })
  );
}
export { qt as default };
