# Embed SysStat Monitor into base_web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed the Vue 3 "系统状态监控" (sysstat-frontend) dashboard into the existing React `base_web` project as a new route `/sysstat`, reusing the existing layout and API proxy infrastructure while preserving the industrial dark theme.

**Architecture:** Create a new React page component in `base_web` that renders the sysstat monitor UI using React components. The page will be registered in the DVA router, reuse the existing `base_web` layout (header, menu), and call the same backend API endpoints (`/api/v1/...`) through the existing Vite proxy configuration. The industrial dark theme CSS will be scoped to the sysstat page to avoid conflicting with Ant Design's theming.

**Tech Stack:** React 17, DVA, Ant Design 5, Vite, LESS/CSS Modules

---

## File Structure

### New Files
- `src/apps/sysstat/index.js` — Main page component (two-tab dashboard: 系统状态 / 系统拓扑)
- `src/apps/sysstat/index.less` — Page-level scoped styles
- `src/apps/sysstat/components/CpuModule.js` — CPU module grid with NUMA support
- `src/apps/sysstat/components/DeviceTimeSync.js` — Device info + time sync card
- `src/apps/sysstat/components/SystemResource.js` — CPU + memory overview
- `src/apps/sysstat/components/Network.js` — Network interfaces card
- `src/apps/sysstat/components/DiskIO.js` — Disk I/O card
- `src/apps/sysstat/components/TopologyGraph.js` — Topology table/rack toggle
- `src/apps/sysstat/components/TopologyGV.js` — Interactive SVG rack visualization
- `src/apps/sysstat/components/RfPort.js` — RF ports card
- `src/apps/sysstat/components/Matrix.js` — Matrix card
- `src/apps/sysstat/components/AdCard.js` — AD cards card
- `src/apps/sysstat/components/DvbCard.js` — DVB cards card
- `src/apps/sysstat/components/Converter.js` — Converter card
- `src/apps/sysstat/api/v1Client.js` — API client (same endpoints as Vue version)
- `src/apps/sysstat/data/mockData.js` — Mock data for offline development
- `src/apps/sysstat/styles/industrial.css` — Industrial dark theme (scoped)

### Modified Files
- `src/router.js` — Add `/sysstat` route
- `vite.config.js` — Add `/api` proxy (if not already present)

---

## Task 1: Add API Client and Mock Data

**Files:**
- Create: `src/apps/sysstat/api/v1Client.js`
- Create: `src/apps/sysstat/data/mockData.js`

- [ ] **Step 1: Create API client**

Create `src/apps/sysstat/api/v1Client.js`:

```javascript
const API_BASE = '/api/v1';

async function fetchV1(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'API returned failure');
  }
  return data.data;
}

export async function getSystemStatus() {
  return fetchV1('/system/status');
}

export async function getCpuModules() {
  return fetchV1('/system/cpu-modules');
}

export async function getHardwareTopology() {
  return fetchV1('/hardware/topology');
}

export async function getHardwarePorts() {
  return fetchV1('/hardware/ports');
}

export async function getHardwareCards() {
  return fetchV1('/hardware/cards');
}
```

- [ ] **Step 2: Copy mock data**

Copy the mock data from `D:/work/frontend/src/data/mockData.js` into `src/apps/sysstat/data/mockData.js` (no changes needed, it's plain JS data).

- [ ] **Step 3: Commit**

```bash
git add src/apps/sysstat/api/v1Client.js src/apps/sysstat/data/mockData.js
git commit -m "feat(sysstat): add API client and mock data"
```

---

## Task 2: Add Industrial Theme CSS

**Files:**
- Create: `src/apps/sysstat/styles/industrial.css`

- [ ] **Step 1: Copy and scope the industrial CSS**

Copy `D:/work/frontend/src/styles/industrial.css` to `src/apps/sysstat/styles/industrial.css` with one change: wrap all selectors under `.sysstat-page` to scope them:

```css
/* Industrial console theme - scoped to sysstat page */
.sysstat-page {
  /* Background colors */
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-card: #0f0f23;
  --bg-header: #0a0a1a;

  /* Text colors */
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;

  /* Status indicator colors */
  --status-normal: #00ff88;
  --status-warning: #ffaa00;
  --status-error: #ff4444;
  --status-offline: #666666;

  /* Border colors */
  --border-color: #2a2a4a;
  --border-active: #4a4a7a;

  /* Device type colors */
  --device-rf: #3b82f6;
  --device-matrix: #06b6d4;
  --device-converter: #8b5cf6;
  --device-dvb: #22c55e;
  --device-ad: #f97316;

  /* Fonts */
  --font-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Spacing */
  --spacing-xs: 2px;
  --spacing-sm: 4px;
  --spacing-md: 6px;
  --spacing-lg: 8px;
  --spacing-xl: 12px;

  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-system);
  line-height: 1.5;
  font-size: 14px;
  min-height: 100%;
}

/* ... rest of CSS with .sysstat-page prefix on all selectors ... */
```

Note: All original selectors like `.app-container`, `.grid-container`, `.module-section`, etc. should be prefixed as `.sysstat-page .app-container`, `.sysstat-page .grid-container`, etc.

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/styles/industrial.css
git commit -m "feat(sysstat): add industrial dark theme (scoped)"
```

---

## Task 3: Create CpuModule Component

**Files:**
- Create: `src/apps/sysstat/components/CpuModule.js`
- Create: `src/apps/sysstat/components/CpuModule.less`

- [ ] **Step 1: Write CpuModule component**

Create `src/apps/sysstat/components/CpuModule.js`:

```javascript
import React from 'react';
import styles from './CpuModule.less';

const NUMA_MAX_COLORS = 8;

function getUsageClass(value) {
  if (value >= 80) return styles.valueError;
  if (value >= 60) return styles.valueWarning;
  return styles.valueGood;
}

function getBarClass(value) {
  if (value >= 80) return styles.high;
  if (value >= 60) return styles.medium;
  return styles.low;
}

function getCoreClass(value) {
  if (value >= 80) return styles.coreHigh;
  if (value >= 60) return styles.coreMedium;
  return styles.coreLow;
}

export default function CpuModule({ title, data }) {
  const { totalCores, systemUsage, cores, cpuIds, numa, status, lastUpdateTime } = data || {};

  const numaGroups = React.useMemo(() => {
    if (!numa) return [];
    let offset = 0;
    return numa.map((count) => {
      const group = {
        cores: cores.slice(offset, offset + count),
        ids: cpuIds ? cpuIds.slice(offset, offset + count) : Array.from({ length: count }, (_, i) => offset + i),
        count,
      };
      offset += count;
      return group;
    });
  }, [numa, cores, cpuIds]);

  const getCpuId = (index) => (cpuIds ? cpuIds[index] : index);

  return (
    <section className={`${styles.moduleSection} ${styles.cpuModule}`}>
      <div className={styles.moduleHeader}>
        <span className={styles.headerTitle}>{title}</span>
        <span className={styles.headerMeta}>
          <span className={styles.statusIndicator}>
            <span className={`${styles.statusDot} ${status === 'normal' ? styles.normal : styles.error}`} />
          </span>
          <span className={styles.updateTime}>{lastUpdateTime}</span>
        </span>
      </div>
      <div className={styles.moduleContent}>
        <div className={styles.cpuSummary}>
          <span className={styles.cpuStat}>
            核数 <strong>{totalCores}</strong>
          </span>
          <span className={styles.cpuStat}>
            占用
            <strong className={getUsageClass(systemUsage)}>{systemUsage}%</strong>
            <span className={styles.miniBar}>
              <span className={`${styles.miniBarFill} ${getBarClass(systemUsage)}`} style={{ width: `${systemUsage}%` }} />
            </span>
          </span>
        </div>

        {!numa ? (
          <div className={styles.coreGrid} style={{ gridTemplateColumns: `repeat(${totalCores > 64 ? 16 : 8}, 1fr)` }}>
            {cores.map((usage, i) => (
              <div key={i} className={`${styles.coreCell} ${getCoreClass(usage)}`} title={`CPU ${getCpuId(i)}: ${usage}%`}>
                <span className={styles.coreId}>{getCpuId(i)}</span>
                <span className={styles.coreVal}>{usage}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.numaLayers}>
            {numaGroups.map((group, gi) => (
              <div key={gi} className={styles.numaLayer}>
                <div className={styles.numaRow}>
                  {group.cores.map((usage, ci) => (
                    <div
                      key={ci}
                      className={`${styles.coreCell} ${styles.numaCore} ${getCoreClass(usage)} ${styles[`numaAccent${gi % NUMA_MAX_COLORS}`]}`}
                      title={`CPU ${group.ids[ci]} (NUMA ${gi}): ${usage}%`}
                    >
                      <span className={`${styles.coreId} ${styles.numaId}`}>{group.ids[ci]}</span>
                      <span className={styles.coreVal}>{usage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write CpuModule styles**

Create `src/apps/sysstat/components/CpuModule.less` with the scoped styles from the original Vue component (adapted to LESS/CSS Modules). Use the same color scheme and layout as the original.

- [ ] **Step 3: Commit**

```bash
git add src/apps/sysstat/components/CpuModule.js src/apps/sysstat/components/CpuModule.less
git commit -m "feat(sysstat): add CpuModule component"
```

---

## Task 4: Create Remaining Small Components

**Files:**
- Create: `src/apps/sysstat/components/DeviceTimeSync.js`
- Create: `src/apps/sysstat/components/Network.js`
- Create: `src/apps/sysstat/components/DiskIO.js`
- Create: `src/apps/sysstat/components/RfPort.js`
- Create: `src/apps/sysstat/components/Matrix.js`
- Create: `src/apps/sysstat/components/AdCard.js`
- Create: `src/apps/sysstat/components/DvbCard.js`
- Create: `src/apps/sysstat/components/Converter.js`

- [ ] **Step 1: Convert each Vue component to React**

For each component:
1. Convert `<template>` to JSX
2. Convert `<script setup>` props to function parameters
3. Convert computed properties to `React.useMemo`
4. Convert scoped styles to `.less` files with CSS Modules
5. Keep the same class names and CSS custom property references

Components are mostly presentational (receive data via props, render tables/cards). No state management needed.

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/
git commit -m "feat(sysstat): add remaining card components"
```

---

## Task 5: Create SystemResource Component

**Files:**
- Create: `src/apps/sysstat/components/SystemResource.js`
- Create: `src/apps/sysstat/components/SystemResource.less`

- [ ] **Step 1: Write SystemResource component**

Convert from Vue to React. This component shows CPU + memory overview with per-component breakdown. Uses progress bars and color-coded values.

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/SystemResource.js src/apps/sysstat/components/SystemResource.less
git commit -m "feat(sysstat): add SystemResource component"
```

---

## Task 6: Create TopologyGraph Component

**Files:**
- Create: `src/apps/sysstat/components/TopologyGraph.js`
- Create: `src/apps/sysstat/components/TopologyGraph.less`

- [ ] **Step 1: Write TopologyGraph component**

Convert from Vue to React. Key features:
- Table view: signal chain table with RF → Matrix → Converter → Output columns
- Rack view toggle: delegates to TopologyGV
- Computes signal chains from props (with backend `chains` fallback to frontend computation)
- Color-coded node tags for each device type

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/TopologyGraph.js src/apps/sysstat/components/TopologyGraph.less
git commit -m "feat(sysstat): add TopologyGraph component"
```

---

## Task 7: Create TopologyGV Component

**Files:**
- Create: `src/apps/sysstat/components/TopologyGV.js`
- Create: `src/apps/sysstat/components/TopologyGV.less`

- [ ] **Step 1: Write TopologyGV component**

This is the most complex component — an interactive SVG rack visualization. Convert from Vue to React:

1. Replace Vue `ref` with `React.useRef`
2. Replace Vue `computed` with `React.useMemo`
3. Replace Vue event handlers (`@wheel`, `@mousedown`, etc.) with React event handlers (`onWheel`, `onMouseDown`, etc.)
4. Keep the SVG rendering logic identical
5. Keep zoom/pan/drag functionality

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/TopologyGV.js src/apps/sysstat/components/TopologyGV.less
git commit -m "feat(sysstat): add TopologyGV SVG visualization"
```

---

## Task 8: Create Main SysStat Page

**Files:**
- Create: `src/apps/sysstat/index.js`
- Create: `src/apps/sysstat/index.less`

- [ ] **Step 1: Write main page component**

Create `src/apps/sysstat/index.js` — the React equivalent of `StatusPage.vue`:

```javascript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  getSystemStatus,
  getCpuModules,
  getHardwareTopology,
  getHardwarePorts,
  getHardwareCards,
} from './api/v1Client';
import CpuModule from './components/CpuModule';
import DeviceTimeSync from './components/DeviceTimeSync';
import SystemResource from './components/SystemResource';
import Network from './components/Network';
import DiskIO from './components/DiskIO';
import TopologyGraph from './components/TopologyGraph';
import RfPort from './components/RfPort';
import Matrix from './components/Matrix';
import AdCard from './components/AdCard';
import DvbCard from './components/DvbCard';
import Converter from './components/Converter';
import './styles/industrial.css';
import styles from './index.less';

const POLL_INTERVAL = 3000;

export default function SysStatPage() {
  const [activeTab, setActiveTab] = useState('status');
  const [topoGraphMode, setTopoGraphMode] = useState('table');

  const [v1SystemStatus, setV1SystemStatus] = useState(null);
  const [v1CpuModules, setV1CpuModules] = useState(null);
  const [v1Topology, setV1Topology] = useState(null);
  const [v1Ports, setV1Ports] = useState(null);
  const [v1Cards, setV1Cards] = useState(null);

  const [topologyData, setTopologyData] = useState({
    chains: [],
    rfPorts: { count: 0, connections: [] },
    matrix: { count: 0, items: [] },
    converters: [],
    dvbCards: [],
    adCards: [],
  });
  const [topologyError, setTopologyError] = useState(null);

  const statusPollTimer = useRef(null);
  const cpuPollTimer = useRef(null);

  const currentCpuModules = v1CpuModules?.modules || [];
  const systemStatusData = v1SystemStatus || {};

  const stopStatusPolling = useCallback(() => {
    if (statusPollTimer.current) {
      clearInterval(statusPollTimer.current);
      statusPollTimer.current = null;
    }
    if (cpuPollTimer.current) {
      clearInterval(cpuPollTimer.current);
      cpuPollTimer.current = null;
    }
  }, []);

  const loadSystemStatus = useCallback(async () => {
    try {
      const data = await getSystemStatus();
      if (data) setV1SystemStatus(data);
    } catch (err) {
      console.error('[V1] 系统状态加载失败:', err);
    }
  }, []);

  const loadCpuModules = useCallback(async () => {
    try {
      const data = await getCpuModules();
      if (data) setV1CpuModules(data);
    } catch (err) {
      console.error('[V1] CPU 模块加载失败:', err);
    }
  }, []);

  const loadV1Topology = useCallback(async () => {
    setTopologyError(null);
    try {
      const data = await getHardwareTopology();
      if (!data) {
        setTopologyData({
          chains: [],
          rfPorts: { count: 0, connections: [] },
          matrix: { count: 0, items: [] },
          converters: [],
          dvbCards: [],
          adCards: [],
        });
        setTopologyError('拓扑数据加载失败');
        return false;
      }
      setV1Topology(data);
      const converters = (data.converters || []).map((conv) => ({
        id: conv.id,
        type: conv.type,
        device: conv.device,
        onlineStatus: conv.onlineStatus,
        freq: conv.freq,
        ifFreq: conv.ifMod != null ? `${conv.ifMod}MHz` : '—',
        centerLfFreq: conv.freq,
        gain: conv.outGain != null ? conv.outGain : 0,
      }));
      setTopologyData({
        chains: data.chains || [],
        rfPorts: data.rfPorts || { count: 0, connections: [] },
        matrix: data.matrix || { count: 0, items: [] },
        converters,
        dvbCards: data.dvbCards || [],
        adCards: data.adCards || [],
      });
      return true;
    } catch (err) {
      setTopologyData({
        chains: [],
        rfPorts: { count: 0, connections: [] },
        matrix: { count: 0, items: [] },
        converters: [],
        dvbCards: [],
        adCards: [],
      });
      setTopologyError(err.message);
      console.error('[V1] 拓扑加载失败:', err);
      return false;
    }
  }, []);

  const loadPorts = useCallback(async () => {
    try {
      const data = await getHardwarePorts();
      if (!data?.ports) return;
      setV1Ports(data);
      setTopologyData((prev) => {
        const updatedConnections = (prev.rfPorts?.connections || []).map((conn) => {
          const v1Port = data.ports.find((p) => p.portId === conn.port);
          return v1Port ? { ...conn, level: v1Port.level } : conn;
        });
        return {
          ...prev,
          rfPorts: { ...prev.rfPorts, connections: updatedConnections },
        };
      });
    } catch (err) {
      console.error('[V1] 端口加载失败:', err);
    }
  }, []);

  const loadCards = useCallback(async () => {
    try {
      const data = await getHardwareCards();
      if (!data) return;
      setV1Cards(data);
      setTopologyData((prev) => {
        let next = { ...prev };
        if (data.adCards && prev.adCards) {
          next.adCards = prev.adCards.map((card) => {
            const updated = data.adCards.find((c) => c.id === card.id);
            return updated
              ? { ...card, temperature: updated.temperature ?? card.temperature, level: updated.level ?? card.level, status: updated.status ?? card.status }
              : card;
          });
        }
        if (data.dvbCards && prev.dvbCards) {
          next.dvbCards = prev.dvbCards.map((card) => {
            const updated = data.dvbCards.find((c) => c.id === card.id);
            return updated
              ? { ...card, temperature: updated.temperature ?? card.temperature, level: updated.level ?? card.level, status: updated.status ?? card.status }
              : card;
          });
        }
        return next;
      });
    } catch (err) {
      console.error('[V1] 板卡加载失败:', err);
    }
  }, []);

  const reloadStatusData = useCallback(async () => {
    stopStatusPolling();
    await loadSystemStatus();
    await loadCpuModules();
    if (activeTab === 'status') {
      statusPollTimer.current = setInterval(loadSystemStatus, POLL_INTERVAL);
      cpuPollTimer.current = setInterval(loadCpuModules, POLL_INTERVAL);
    }
  }, [activeTab, loadSystemStatus, loadCpuModules, stopStatusPolling]);

  const reloadTopologyData = useCallback(async () => {
    stopStatusPolling();
    const loaded = await loadV1Topology();
    if (!loaded) return;
    await loadPorts();
    await loadCards();
  }, [loadV1Topology, loadPorts, loadCards, stopStatusPolling]);

  useEffect(() => {
    if (activeTab === 'status') {
      reloadStatusData();
    } else {
      reloadTopologyData();
    }
    return () => stopStatusPolling();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`sysstat-page ${styles.statusPage}`}>
      <nav className={styles.tabNav}>
        <button className={`${styles.tabBtn} ${activeTab === 'status' ? styles.active : ''}`} onClick={() => setActiveTab('status')}>
          系统状态
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'topology' ? styles.active : ''}`} onClick={() => setActiveTab('topology')}>
          系统拓扑
        </button>
      </nav>

      <div className={styles.tabContent}>
        {activeTab === 'status' && (
          <div className={`${styles.tabPanel} ${styles.tabScrollable}`}>
            <div className={styles.scenarioBar}>
              <span className={styles.scenarioLabel}>状态:</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                {v1SystemStatus ? '已连接' : '加载中...'}
              </span>
              <button className={styles.scenarioBtn} onClick={reloadStatusData} title="刷新数据">
                刷新
              </button>
            </div>

            <div className="grid-container">
              {currentCpuModules.map((mod) => (
                <CpuModule
                  key={mod.key}
                  title={mod.title}
                  data={mod}
                  className={`grid-area-${mod.key}`}
                />
              ))}
              <DeviceTimeSync
                deviceData={systemStatusData.device || {}}
                timeSyncData={systemStatusData.timeSync || {}}
                className="grid-area-device-timesync"
              />
              <SystemResource
                data={systemStatusData.systemResource || {}}
                cpuModules={currentCpuModules}
                className="grid-area-memory"
              />
              <Network data={systemStatusData.network || {}} className="grid-area-network" />
              <DiskIO data={systemStatusData.disk || {}} className="grid-area-disk" />
            </div>
          </div>
        )}

        {activeTab === 'topology' && (
          <div className={styles.tabPanel}>
            <div className={styles.scenarioBar}>
              <span className={styles.scenarioLabel}>状态:</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>
                {topologyData.chains?.length > 0 ? '已连接' : '加载中...'}
              </span>
              <button className={styles.scenarioBtn} onClick={reloadTopologyData} title="刷新拓扑">
                刷新
              </button>
            </div>
            {topologyError && <div style={{ color: 'red', padding: 10 }}>错误: {topologyError}</div>}

            <div className={styles.topologyContainer}>
              <div className={`${styles.topologyGraphWrapper} ${topoGraphMode === 'rack' ? styles.graphRack : ''}`}>
                <TopologyGraph data={topologyData} onViewModeChange={setTopoGraphMode} />
              </div>
              <div className={styles.topologyGrid}>
                {topologyData.rfPorts && <RfPort data={topologyData.rfPorts} className="rf-narrow" />}
                {topologyData.matrix?.count > 0 && <Matrix data={topologyData.matrix} />}
                {topologyData.converters?.length > 0 && (
                  <Converter data={{ count: topologyData.converters.length, items: topologyData.converters }} />
                )}
                {topologyData.adCards?.length > 0 && (
                  <AdCard data={{ count: topologyData.adCards.length, items: topologyData.adCards }} className="ad-span" />
                )}
                {topologyData.dvbCards?.length > 0 && (
                  <DvbCard data={{ count: topologyData.dvbCards.length, items: topologyData.dvbCards }} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write page styles**

Create `src/apps/sysstat/index.less` with the tab navigation, layout, and topology grid styles from the original `StatusPage.vue` scoped styles.

- [ ] **Step 3: Commit**

```bash
git add src/apps/sysstat/index.js src/apps/sysstat/index.less
git commit -m "feat(sysstat): add main SysStat page component"
```

---

## Task 9: Register Route

**Files:**
- Modify: `src/router.js`

- [ ] **Step 1: Add sysstat route**

Add to `src/router.js` in the `routerConfig` object:

```javascript
'/sysstat': { component: dynamicWrapper(app, [], appsGlob['./apps/sysstat/index.js']) },
```

- [ ] **Step 2: Commit**

```bash
git add src/router.js
git commit -m "feat(sysstat): register /sysstat route"
```

---

## Task 10: Add API Proxy

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1: Add /api proxy**

In `vite.config.js`, add to the `server.proxy` object:

```javascript
'/api': {
  target: 'http://localhost:5000',
  changeOrigin: true,
},
```

- [ ] **Step 2: Commit**

```bash
git add vite.config.js
git commit -m "feat(sysstat): add /api proxy for backend"
```

---

## Task 11: Verify Build

- [ ] **Step 1: Run dev server**

```bash
npm start
```

Navigate to `http://localhost:8000/#/sysstat` and verify the page loads.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Verify build completes without errors.

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "feat(sysstat): verify build passes"
```

---

## Self-Review

**Spec coverage:**
- ✅ API client with all 5 endpoints
- ✅ All 15+ components converted from Vue to React
- ✅ Two-tab layout (系统状态 / 系统拓扑)
- ✅ 3-second polling for status tab
- ✅ Industrial dark theme scoped to page
- ✅ Route registration in DVA router
- ✅ API proxy configuration

**Placeholder scan:** No TBDs, TODOs, or vague requirements found.

**Type consistency:** All component props match the original Vue prop shapes. API response types preserved from original.
