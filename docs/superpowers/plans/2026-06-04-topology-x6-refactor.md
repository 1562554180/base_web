# 系统拓扑图 X6 重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 @antv/x6 + 自定义 React 节点重构系统拓扑图，替代当前 dagre + 原生 SVG 实现，提升交互体验和可维护性。

**Architecture:** X6 负责画布管理（缩放、平移、拖拽、事件系统），React 组件负责节点内部渲染（矩形、文字、端口、状态），dagre 负责初始自动布局。节点位置支持手动拖拽调整并保存到 localStorage。

**Tech Stack:** React 17, @antv/x6 ^1.28.1, @antv/x6-react-shape ^1.6.6, dagre ^0.8.5, CSS Modules

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `src/apps/sysstat/components/TopologyX6/index.js` | 主容器组件，创建 X6 Graph 实例，数据转换，布局管理 |
| `src/apps/sysstat/components/TopologyX6/nodes/RfNode.js` | RF 端口节点 React 组件 |
| `src/apps/sysstat/components/TopologyX6/nodes/MatrixNode.js` | 矩阵节点 React 组件 |
| `src/apps/sysstat/components/TopologyX6/nodes/ConverterNode.js` | 变频器节点 React 组件 |
| `src/apps/sysstat/components/TopologyX6/nodes/AdNode.js` | AD 卡节点 React 组件 |
| `src/apps/sysstat/components/TopologyX6/nodes/DvbNode.js` | DVB 卡节点 React 组件 |
| `src/apps/sysstat/components/TopologyX6/TopoToolbar.js` | 工具栏组件（缩放/适应/保存/重置） |
| `src/apps/sysstat/components/TopologyX6/index.less` | 拓扑图容器和工具栏样式 |
| `src/apps/sysstat/components/TopologyX6/nodes/index.less` | 节点通用样式 |
| `src/apps/sysstat/components/TopologyGraph.js` | 修改：替换 TopologyGV 为 TopologyX6 |

---

## Task 1: 创建 X6 节点 React 组件

**Files:**
- Create: `src/apps/sysstat/components/TopologyX6/nodes/RfNode.js`
- Create: `src/apps/sysstat/components/TopologyX6/nodes/MatrixNode.js`
- Create: `src/apps/sysstat/components/TopologyX6/nodes/ConverterNode.js`
- Create: `src/apps/sysstat/components/TopologyX6/nodes/AdNode.js`
- Create: `src/apps/sysstat/components/TopologyX6/nodes/DvbNode.js`
- Create: `src/apps/sysstat/components/TopologyX6/nodes/index.less`

- [ ] **Step 1: 创建节点通用样式文件**

```less
// src/apps/sysstat/components/TopologyX6/nodes/index.less
.nodeWrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.nodeBody {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #0f172a;
  border: 1px solid;
  display: flex;
  flex-direction: column;
  padding: 4px 6px;
  box-sizing: border-box;
}

.nodeTitle {
  font-size: 12px;
  font-weight: 600;
  color: white;
  font-family: 'Consolas', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nodeDetail {
  font-size: 10px;
  color: #94a3b8;
  font-family: 'Consolas', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.nodePorts {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.portDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1e293b;
  border: 1px solid #475569;
}

.portDotActive {
  background: currentColor;
  border-color: currentColor;
  box-shadow: 0 0 3px currentColor;
}

// Node type colors
.rfNode .nodeBody {
  border-color: var(--device-rf, #3b82f6);
}

.matrixNode .nodeBody {
  border-color: var(--device-matrix, #06b6d4);
}

.converterNode .nodeBody {
  border-color: var(--device-converter, #8b5cf6);
}

.adNode .nodeBody {
  border-color: var(--device-ad, #f97316);
}

.dvbNode .nodeBody {
  border-color: var(--device-dvb, #22c55e);
}
```

- [ ] **Step 2: 创建 RfNode 组件**

```jsx
// src/apps/sysstat/components/TopologyX6/nodes/RfNode.js
import React from 'react';
import styles from './index.less';

export default function RfNode({ node }) {
  const data = node.getData() || {};
  const { label, level, online } = data;

  return (
    <div className={`${styles.nodeWrapper} ${styles.rfNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>{level || '--'}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 MatrixNode 组件**

```jsx
// src/apps/sysstat/components/TopologyX6/nodes/MatrixNode.js
import React from 'react';
import styles from './index.less';

export default function MatrixNode({ node }) {
  const data = node.getData() || {};
  const { label, inPorts, outPorts, connections } = data;

  const inPortArray = Array.from({ length: inPorts || 4 }, (_, i) => i);
  const outPortArray = Array.from({ length: outPorts || 4 }, (_, i) => i);

  const isPortActive = (type, idx) => {
    if (!connections) return false;
    return connections.some(c =>
      type === 'in' ? c.input === idx : c.output === idx
    );
  };

  return (
    <div className={`${styles.nodeWrapper} ${styles.matrixNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodePorts}>
          {inPortArray.map(i => (
            <span
              key={`in-${i}`}
              className={`${styles.portDot} ${isPortActive('in', i) ? styles.portDotActive : ''}`}
              style={{ color: 'var(--device-matrix, #06b6d4)' }}
              title={`IN-${i}`}
            />
          ))}
        </div>
        <div className={styles.nodePorts}>
          {outPortArray.map(i => (
            <span
              key={`out-${i}`}
              className={`${styles.portDot} ${isPortActive('out', i) ? styles.portDotActive : ''}`}
              style={{ color: 'var(--device-matrix, #06b6d4)' }}
              title={`OUT-${i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 ConverterNode 组件**

```jsx
// src/apps/sysstat/components/TopologyX6/nodes/ConverterNode.js
import React from 'react';
import styles from './index.less';

export default function ConverterNode({ node }) {
  const data = node.getData() || {};
  const { label, freq } = data;

  return (
    <div className={`${styles.nodeWrapper} ${styles.converterNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>{freq || '--'}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 创建 AdNode 组件**

```jsx
// src/apps/sysstat/components/TopologyX6/nodes/AdNode.js
import React from 'react';
import styles from './index.less';

export default function AdNode({ node }) {
  const data = node.getData() || {};
  const { label, dna, channels } = data;

  return (
    <div className={`${styles.nodeWrapper} ${styles.adNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>DNA:{dna || '--'}</div>
        <div className={styles.nodeDetail}>
          CH:{channels?.used ?? '-'}/{channels?.total ?? '-'}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: 创建 DvbNode 组件**

```jsx
// src/apps/sysstat/components/TopologyX6/nodes/DvbNode.js
import React from 'react';
import styles from './index.less';

export default function DvbNode({ node }) {
  const data = node.getData() || {};
  const { label, dna, channels } = data;

  return (
    <div className={`${styles.nodeWrapper} ${styles.dvbNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>DNA:{dna || '--'}</div>
        <div className={styles.nodeDetail}>
          CH:{channels?.used ?? '-'}/{channels?.total ?? '-'}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/apps/sysstat/components/TopologyX6/nodes/
git commit -m "feat(topology): add X6 React node components for RF/Matrix/Converter/AD/DVB"
```

---

## Task 2: 注册 X6 节点类型

**Files:**
- Create: `src/apps/sysstat/components/TopologyX6/registerNodes.js`

- [ ] **Step 1: 注册节点类型**

```js
// src/apps/sysstat/components/TopologyX6/registerNodes.js
import { Graph } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import RfNode from './nodes/RfNode';
import MatrixNode from './nodes/MatrixNode';
import ConverterNode from './nodes/ConverterNode';
import AdNode from './nodes/AdNode';
import DvbNode from './nodes/DvbNode';

const NODE_WIDTH = {
  rf: 80,
  matrix: 120,
  converter: 100,
  ad: 120,
  dvb: 120,
};

const NODE_HEIGHT = {
  rf: 50,
  matrix: 80,
  converter: 60,
  ad: 80,
  dvb: 80,
};

export function registerTopologyNodes() {
  register({
    shape: 'rf-node',
    width: NODE_WIDTH.rf,
    height: NODE_HEIGHT.rf,
    component: RfNode,
  });

  register({
    shape: 'matrix-node',
    width: NODE_WIDTH.matrix,
    height: NODE_HEIGHT.matrix,
    component: MatrixNode,
  });

  register({
    shape: 'converter-node',
    width: NODE_WIDTH.converter,
    height: NODE_HEIGHT.converter,
    component: ConverterNode,
  });

  register({
    shape: 'ad-node',
    width: NODE_WIDTH.ad,
    height: NODE_HEIGHT.ad,
    component: AdNode,
  });

  register({
    shape: 'dvb-node',
    width: NODE_WIDTH.dvb,
    height: NODE_HEIGHT.dvb,
    component: DvbNode,
  });
}

export { NODE_WIDTH, NODE_HEIGHT };
```

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/TopologyX6/registerNodes.js
git commit -m "feat(topology): register X6 node shapes for topology visualization"
```

---

## Task 3: 创建数据转换工具

**Files:**
- Create: `src/apps/sysstat/components/TopologyX6/buildGraphData.js`

- [ ] **Step 1: 实现数据转换函数**

```js
// src/apps/sysstat/components/TopologyX6/buildGraphData.js

function formatFreqKhz(khz) {
  if (khz == null) return '--';
  return (khz / 1e3).toFixed(0) + 'MHz';
}

export function buildGraphData({
  chains,
  rfPorts,
  matrixItems,
  converters,
  dvbCards,
  adCards,
}) {
  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  const chainsArr = chains || [];
  const rfPortsArr = rfPorts || [];
  const convertersArr = converters || [];
  const adCardsArr = adCards || [];
  const dvbCardsArr = dvbCards || [];
  const matrixItemsArr = matrixItems || [];

  // Add RF nodes
  rfPortsArr.forEach((rf) => {
    const id = `RF-${rf.port}`;
    nodes.push({
      id,
      shape: 'rf-node',
      data: {
        label: `RF-${rf.port}`,
        level: rf?.level != null ? rf.level + 'dBm' : '--',
        online: rf?.level != null,
      },
    });
    nodeMap.set(id, true);
  });

  // Add Matrix nodes
  const matrixConnections = {};
  chainsArr.forEach((c) => {
    if (c.matrix) {
      const mxId = c.matrix.deviceId ?? c.matrix.id;
      if (!matrixConnections[mxId]) {
        matrixConnections[mxId] = { inPorts: 0, outPorts: 0, connections: [] };
      }
      matrixConnections[mxId].inPorts = Math.max(
        matrixConnections[mxId].inPorts,
        (c.matrixInPort ?? 0) + 1
      );
      matrixConnections[mxId].outPorts = Math.max(
        matrixConnections[mxId].outPorts,
        (c.matrixOutPort ?? 0) + 1
      );
      matrixConnections[mxId].connections.push({
        input: c.matrixInPort ?? 0,
        output: c.matrixOutPort ?? 0,
      });
    }
  });

  Object.entries(matrixConnections).forEach(([mxId, conn]) => {
    const id = `MATRIX-${mxId}`;
    const mx = matrixItemsArr.find((m) => m.deviceId === Number(mxId));
    nodes.push({
      id,
      shape: 'matrix-node',
      data: {
        label: `矩阵-${mxId}`,
        inPorts: Math.max(mx?.inputPorts || 4, conn.inPorts),
        outPorts: Math.max(mx?.outputPorts || 4, conn.outPorts),
        connections: conn.connections,
      },
    });
    nodeMap.set(id, true);
  });

  // Add Converter nodes
  const converterSet = new Set();
  chainsArr.forEach((c) => {
    if (c.converter != null) converterSet.add(c.converter);
  });
  convertersArr.forEach((cv) => converterSet.add(cv.id));

  converterSet.forEach((cvId) => {
    const id = `CV-${cvId}`;
    const cv = convertersArr.find((c) => c.id === cvId);
    nodes.push({
      id,
      shape: 'converter-node',
      data: {
        label: `变频器-${cvId}`,
        freq: formatFreqKhz(cv?.freq),
      },
    });
    nodeMap.set(id, true);
  });

  // Add AD/DVB nodes
  const addOutputNode = (card, isDvb) => {
    const id = `${isDvb ? 'DVB' : 'AD'}-${card.id}`;
    nodes.push({
      id,
      shape: isDvb ? 'dvb-node' : 'ad-node',
      data: {
        label: `${isDvb ? 'DVB' : 'AD'}-${card.id}`,
        dna: card.dna || '--',
        channels: {
          used: card.channels?.used ?? '-',
          total: card.channels?.total ?? '-',
        },
      },
    });
    nodeMap.set(id, true);
  };

  adCardsArr.forEach((card) => addOutputNode(card, false));
  dvbCardsArr.forEach((card) => addOutputNode(card, true));

  // Build edges from active chains
  chainsArr.forEach((c) => {
    if (!c.active) return;

    const rfId = `RF-${c.rf}`;
    const outputId = typeof c.output === 'string' ? c.output : null;

    if (c.matrix) {
      const mxId = `MATRIX-${c.matrix.deviceId ?? c.matrix.id}`;
      edges.push({ source: rfId, target: mxId });

      if (c.converter != null) {
        const cvId = `CV-${c.converter}`;
        edges.push({ source: mxId, target: cvId });
        if (outputId) edges.push({ source: cvId, target: outputId });
      } else if (outputId) {
        edges.push({ source: mxId, target: outputId });
      }
    } else if (c.converter != null) {
      const cvId = `CV-${c.converter}`;
      edges.push({ source: rfId, target: cvId });
      if (outputId) edges.push({ source: cvId, target: outputId });
    } else if (outputId) {
      edges.push({ source: rfId, target: outputId });
    }
  });

  return { nodes, edges };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/TopologyX6/buildGraphData.js
git commit -m "feat(topology): add data transformer for X6 graph"
```

---

## Task 4: 创建 dagre 布局工具

**Files:**
- Create: `src/apps/sysstat/components/TopologyX6/layout.js`

- [ ] **Step 1: 实现 dagre 布局函数**

```js
// src/apps/sysstat/components/TopologyX6/layout.js
import dagre from 'dagre';
import { NODE_WIDTH, NODE_HEIGHT } from './registerNodes';

const LAYOUT_KEY = 'topo-x6-layout-v1';

export function applyDagreLayout(graph) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'LR',
    nodesep: 40,
    ranksep: 80,
    marginx: 20,
    marginy: 20,
  });
  g.setDefaultEdgeLabel(() => ({}));

  const nodes = graph.getNodes();
  const edges = graph.getEdges();

  nodes.forEach((node) => {
    const shape = node.shape;
    const w = NODE_WIDTH[shape.replace('-node', '')] || 100;
    const h = NODE_HEIGHT[shape.replace('-node', '')] || 60;
    g.setNode(node.id, { width: w, height: h });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.getSourceCellId(), edge.getTargetCellId());
  });

  dagre.layout(g);

  g.nodes().forEach((nodeId) => {
    const pos = g.node(nodeId);
    const node = graph.getCellById(nodeId);
    if (node) {
      node.position(pos.x - pos.width / 2, pos.y - pos.height / 2);
    }
  });
}

export function saveLayout(graph) {
  const positions = {};
  graph.getNodes().forEach((node) => {
    positions[node.id] = node.getPosition();
  });
  const data = {
    positions,
    zoom: graph.zoom(),
    center: graph.getScrollbarPosition(),
  };
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(data));
}

export function loadLayout(graph) {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.positions) {
      Object.entries(data.positions).forEach(([id, pos]) => {
        const node = graph.getCellById(id);
        if (node) node.position(pos.x, pos.y);
      });
    }
    if (data.zoom != null) graph.zoom(data.zoom);
    return true;
  } catch {
    return false;
  }
}

export function clearLayout() {
  localStorage.removeItem(LAYOUT_KEY);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/TopologyX6/layout.js
git commit -m "feat(topology): add dagre layout and layout persistence"
```

---

## Task 5: 创建工具栏组件

**Files:**
- Create: `src/apps/sysstat/components/TopologyX6/TopoToolbar.js`
- Create: `src/apps/sysstat/components/TopologyX6/index.less`

- [ ] **Step 1: 创建工具栏组件**

```jsx
// src/apps/sysstat/components/TopologyX6/TopoToolbar.js
import React from 'react';
import styles from './index.less';

export default function TopoToolbar({ graph, onAutoLayout, onResetLayout }) {
  const [zoom, setZoom] = React.useState(1);
  const [justSaved, setJustSaved] = React.useState(false);

  React.useEffect(() => {
    if (!graph) return;
    const handler = () => setZoom(graph.zoom());
    graph.on('scale', handler);
    return () => graph.off('scale', handler);
  }, [graph]);

  const handleZoomIn = () => {
    if (graph) graph.zoom(0.2);
  };

  const handleZoomOut = () => {
    if (graph) graph.zoom(-0.2);
  };

  const handleFit = () => {
    if (graph) graph.zoomToFit({ padding: 20 });
  };

  const handleSave = () => {
    if (!graph) return;
    const positions = {};
    graph.getNodes().forEach((node) => {
      positions[node.id] = node.getPosition();
    });
    localStorage.setItem('topo-x6-layout-v1', JSON.stringify({
      positions,
      zoom: graph.zoom(),
    }));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  return (
    <div className={styles.toolbar}>
      <button className={styles.toolBtn} onClick={handleZoomOut} title="缩小">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6.5" cy="6.5" r="5" />
          <line x1="4" y1="6.5" x2="9" y2="6.5" />
          <line x1="10.2" y1="10.2" x2="15" y2="15" />
        </svg>
      </button>
      <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>
      <button className={styles.toolBtn} onClick={handleZoomIn} title="放大">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6.5" cy="6.5" r="5" />
          <line x1="4" y1="6.5" x2="9" y2="6.5" />
          <line x1="6.5" y1="4" x2="6.5" y2="9" />
          <line x1="10.2" y1="10.2" x2="15" y2="15" />
        </svg>
      </button>
      <div className={styles.toolSep} />
      <button className={styles.toolBtn} onClick={handleFit} title="适应视图">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="5" height="5" rx="0.5" />
          <rect x="9" y="2" width="5" height="5" rx="0.5" />
          <rect x="2" y="9" width="5" height="5" rx="0.5" />
          <rect x="9" y="9" width="5" height="5" rx="0.5" />
        </svg>
      </button>
      <button className={styles.toolBtn} onClick={onAutoLayout} title="自动布局">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 4h12M2 8h12M2 12h12" />
        </svg>
      </button>
      <div className={styles.toolSep} />
      <button
        className={`${styles.toolBtn} ${justSaved ? styles.saved : ''}`}
        onClick={handleSave}
        title="保存布局"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 1h8l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
          <rect x="5" y="1" width="5" height="4" rx="0.5" />
          <rect x="4.5" y="9" width="7" height="4" rx="0.5" />
        </svg>
      </button>
      <button className={styles.toolBtn} onClick={onResetLayout} title="重置布局">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="1 4 1 1 4 1" />
          <path d="M1 1l3 3" />
          <path d="M1 8a7 7 0 1 0 1.5-4" />
        </svg>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 创建样式文件**

```less
// src/apps/sysstat/components/TopologyX6/index.less
.topologyX6Container {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--bg-primary, #000e2f);
  overflow: hidden;
}

.graphContainer {
  width: 100%;
  height: 100%;
}

.toolbar {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(148, 163, 184, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.toolBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #e2e8f0;
    background: rgba(148, 163, 184, 0.1);
  }

  &.saved {
    color: #00ff88;
  }
}

.zoomValue {
  font-size: 11px;
  color: #94a3b8;
  min-width: 36px;
  text-align: center;
  font-family: 'Consolas', monospace;
}

.toolSep {
  width: 1px;
  height: 14px;
  background: rgba(148, 163, 184, 0.15);
  margin: 0 2px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/apps/sysstat/components/TopologyX6/TopoToolbar.js
git add src/apps/sysstat/components/TopologyX6/index.less
git commit -m "feat(topology): add topology toolbar with zoom/fit/save/reset"
```

---

## Task 6: 创建主容器组件 TopologyX6

**Files:**
- Create: `src/apps/sysstat/components/TopologyX6/index.js`

- [ ] **Step 1: 实现主容器组件**

```jsx
// src/apps/sysstat/components/TopologyX6/index.js
import React from 'react';
import { Graph } from '@antv/x6';
import styles from './index.less';
import { registerTopologyNodes } from './registerNodes';
import { buildGraphData } from './buildGraphData';
import { applyDagreLayout, loadLayout, clearLayout } from './layout';
import TopoToolbar from './TopoToolbar';

// Register nodes once
registerTopologyNodes();

export default function TopologyX6({
  chains,
  rfPorts,
  matrixItems,
  converters,
  dvbCards,
  adCards,
}) {
  const containerRef = React.useRef(null);
  const graphRef = React.useRef(null);

  // Initialize graph
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const graph = new Graph({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
      background: { color: 'transparent' },
      grid: {
        visible: false,
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'mouseWheel'],
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.2,
        maxScale: 3,
      },
      connecting: {
        enabled: false,
      },
      selecting: {
        enabled: false,
      },
      interacting: {
        nodeMovable: true,
        edgeMovable: false,
        edgeLabelMovable: false,
      },
    });

    graphRef.current = graph;

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      graph.resize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      graph.dispose();
      graphRef.current = null;
    };
  }, []);

  // Update data
  React.useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    const { nodes, edges } = buildGraphData({
      chains,
      rfPorts,
      matrixItems,
      converters,
      dvbCards,
      adCards,
    });

    // Clear and rebuild
    graph.clearCells();

    // Add nodes
    nodes.forEach((nodeConfig) => {
      graph.addNode({
        ...nodeConfig,
        attrs: {
          body: {
            stroke: 'none',
            fill: 'transparent',
          },
        },
      });
    });

    // Add edges
    edges.forEach((edgeConfig) => {
      graph.addEdge({
        source: edgeConfig.source,
        target: edgeConfig.target,
        attrs: {
          line: {
            stroke: '#00ff88',
            strokeWidth: 1,
            targetMarker: {
              name: 'block',
              width: 6,
              height: 4,
              fill: '#00ff88',
            },
          },
        },
        router: {
          name: 'manhattan',
          args: {
            padding: 10,
          },
        },
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
      });
    });

    // Apply layout
    const hasSavedLayout = loadLayout(graph);
    if (!hasSavedLayout) {
      applyDagreLayout(graph);
      graph.zoomToFit({ padding: 20 });
    }
  }, [chains, rfPorts, matrixItems, converters, dvbCards, adCards]);

  const handleAutoLayout = () => {
    const graph = graphRef.current;
    if (!graph) return;
    applyDagreLayout(graph);
    graph.zoomToFit({ padding: 20 });
  };

  const handleResetLayout = () => {
    const graph = graphRef.current;
    if (!graph) return;
    clearLayout();
    applyDagreLayout(graph);
    graph.zoomToFit({ padding: 20 });
  };

  return (
    <div className={styles.topologyX6Container}>
      <TopoToolbar
        graph={graphRef.current}
        onAutoLayout={handleAutoLayout}
        onResetLayout={handleResetLayout}
      />
      <div ref={containerRef} className={styles.graphContainer} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/TopologyX6/index.js
git commit -m "feat(topology): add TopologyX6 main container with X6 graph"
```

---

## Task 7: 替换 TopologyGraph 中的 TopologyGV

**Files:**
- Modify: `src/apps/sysstat/components/TopologyGraph.js`

- [ ] **Step 1: 修改导入和渲染**

将 `TopologyGV` 替换为 `TopologyX6`：

```js
// 修改导入
import TopologyX6 from './TopologyX6';
// 删除: import TopologyGV from './TopologyGV';
```

在 `viewMode === 'rack'` 的渲染部分：

```jsx
{viewMode === 'rack' && (
  <div className={styles['mermaidWrapper']}>
    <TopologyX6
      chains={signalChains}
      rfPorts={rfPorts}
      matrixItems={matrixItems}
      converters={converters}
      dvbCards={dvbCards}
      adCards={adCards}
    />
  </div>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/apps/sysstat/components/TopologyGraph.js
git commit -m "feat(topology): replace TopologyGV with TopologyX6 in TopologyGraph"
```

---

## Task 8: 构建验证

- [ ] **Step 1: 运行构建**

```bash
npm run build
```

Expected: 构建成功，无错误。

- [ ] **Step 2: 启动开发服务器验证**

```bash
npm start
```

打开浏览器访问 `http://localhost:8000/#/sysstat`，切换到"系统拓扑"标签，点击"图形"按钮，验证：
1. 拓扑图正确渲染（RF/矩阵/变频器/AD/DVB 节点）
2. 节点之间有连线
3. 可以拖拽节点
4. 可以缩放画布（Ctrl+滚轮）
5. 可以平移画布（拖拽空白处）
6. 工具栏按钮工作正常

- [ ] **Step 3: Commit（如需要修复）**

```bash
git add -A
git commit -m "fix(topology): fix X6 integration issues"
```

---

## Self-Review

**Spec coverage:**
- ✅ X6 画布管理（缩放、平移、拖拽）
- ✅ React 自定义节点渲染
- ✅ dagre 自动布局
- ✅ 手动拖拽调整 + localStorage 保存
- ✅ 工具栏（缩放/适应/保存/重置）
- ✅ 边固定不可编辑

**Placeholder scan:** 无 TBD/TODO/placeholder。

**Type consistency:** 节点 shape 名称（`rf-node`, `matrix-node` 等）在 registerNodes.js、buildGraphData.js 和节点组件文件中一致。
