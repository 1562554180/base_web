import React from 'react';
import dagre from 'dagre';
import styles from './TopologyGV.less';

const C = {
  matrix: '#06b6d4',
  converter: '#8b5cf6',
  ad: '#f97316',
  dvb: '#22c55e',
};

const LAYOUT_KEY = 'topo-layout-v2';

function formatFreqKhz(khz) {
  if (khz == null) return '--';
  return (khz / 1e3).toFixed(0) + 'MHz';
}

export default function TopologyGV({
  chains,
  rfPorts,
  matrixItems,
  converters,
  dvbCards,
  adCards,
}) {
  const topoRef = React.useRef(null);

  const [interactive, setInteractive] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [panX, setPanX] = React.useState(0);
  const [panY, setPanY] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [dragNode, setDragNode] = React.useState(null);
  const lastMouseRef = React.useRef({ x: 0, y: 0 });
  const dragOffsetRef = React.useRef({ x: 0, y: 0 });

  const nodeOffsetsRef = React.useRef({});
  const rfOffsetsRef = React.useRef({});
  const hasRestoredLayoutRef = React.useRef(false);

  const chainsArr = chains || [];
  const rfPortsArr = rfPorts || [];
  const convertersArr = converters || [];
  const adCardsArr = adCards || [];
  const dvbCardsArr = dvbCards || [];
  const matrixItemsArr = matrixItems || [];

  function screenToSvg(cx, cy) {
    const container = topoRef.current;
    if (!container) return { x: cx, y: cy };
    const rect = container.getBoundingClientRect();
    const px = cx - rect.left;
    const py = cy - rect.top;
    return { x: (px - panX) / zoom, y: (py - panY) / zoom };
  }

  function saveLayout() {
    const data = {
      nodes: { ...nodeOffsetsRef.current },
      rfs: { ...rfOffsetsRef.current },
      panX,
      panY,
      zoom,
    };
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(data));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  }

  function loadLayout() {
    try {
      const raw = localStorage.getItem(LAYOUT_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.nodes) nodeOffsetsRef.current = { ...data.nodes };
      if (data.rfs) rfOffsetsRef.current = { ...data.rfs };
      if (data.panX != null) setPanX(data.panX);
      if (data.panY != null) setPanY(data.panY);
      if (data.zoom != null) setZoom(data.zoom);
      return true;
    } catch {
      return false;
    }
  }

  function resetLayout() {
    nodeOffsetsRef.current = {};
    rfOffsetsRef.current = {};
    localStorage.removeItem(LAYOUT_KEY);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setTimeout(autoFit, 50);
  }

  function toggleInteractive() {
    setInteractive((v) => !v);
  }

  function getSvgBounds(modsVal, rfsVal) {
    const allX = modsVal.map((n) => n.x).concat(rfsVal.map((r) => r.x));
    const allR = modsVal
      .map((n) => n.x + n.w)
      .concat(rfsVal.map((r) => r.x + 14));
    const allY = modsVal.map((n) => n.y).concat(rfsVal.map((r) => r.y));
    const allB = modsVal
      .map((n) => n.y + n.h)
      .concat(rfsVal.map((r) => r.y + 10));
    const minX = allX.length ? Math.min(...allX) : 0;
    const maxX = allR.length ? Math.max(...allR) : 300;
    const minY = allY.length ? Math.min(...allY) : 0;
    const maxY = allB.length ? Math.max(...allB) : 100;
    const contentW = Math.max(0, maxX - minX);
    const contentH = Math.max(0, maxY - minY);
    return {
      minX,
      maxX,
      minY,
      maxY,
      contentW,
      contentH,
      w: Math.max(300, contentW),
      h: Math.max(100, contentH),
    };
  }

  function centerByCurrentZoom(modsVal, rfsVal, zm) {
    const container = topoRef.current;
    if (!container) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (!cw || !ch) return;
    const b = getSvgBounds(modsVal, rfsVal);
    const contentW = b.contentW || 300;
    const contentH = b.contentH || 100;
    if (contentW <= 0 || contentH <= 0) return;
    setPanX((cw - contentW * zm) / 2 - b.minX * zm);
    setPanY((ch - contentH * zm) / 2 - b.minY * zm);
  }

  function autoFit(modsVal, rfsVal) {
    const container = topoRef.current;
    if (!container) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (!cw || !ch) return;
    const b = getSvgBounds(modsVal, rfsVal);
    const contentW = b.contentW || 300;
    const contentH = b.contentH || 100;
    if (contentW <= 0 || contentH <= 0) return;
    const scaleX = cw / contentW;
    const scaleY = ch / contentH;
    const scale = Math.min(scaleX, scaleY);
    const newZoom = Math.max(0.1, scale);
    setZoom(newZoom);
    const newPanX = (cw - contentW * newZoom) / 2 - b.minX * newZoom;
    const newPanY = (ch - contentH * newZoom) / 2 - b.minY * newZoom;
    setPanX(newPanX);
    setPanY(newPanY);
  }

  // Build dagre graph
  const dagreGraph = React.useMemo(() => {
    const g = new dagre.graphlib.Graph();

    const nodeH = (ports, infoRows = 0) =>
      Math.max(10, 4 + 2 + infoRows * 2 + ports * 2);

    const nodeW = (ports, infoRows = 0, dna = '') => {
      const baseW = 20;
      if (!dna || dna.length <= 6) return baseW;
      const textW = (4 + dna.length) * 1.9 + 2;
      return Math.max(baseW, Math.ceil(textW));
    };

    g.setGraph({
      rankdir: 'LR',
      nodesep: 2,
      ranksep: 18,
      marginx: 0,
      marginy: 0,
      ranker: 'network-simplex',
    });
    g.setDefaultEdgeLabel(() => ({}));

    const a = {};

    const mxMaxInPorts = {};
    const mxMaxOutPorts = {};
    const adMaxPorts = {};
    const dvbMaxPorts = {};

    chainsArr.forEach((c) => {
      if (c.matrix) {
        const id = c.matrix.deviceId ?? c.matrix.id;
        const inPort = c.matrixInPort ?? 0;
        const outPort = c.matrixOutPort ?? 0;
        mxMaxInPorts[id] = Math.max(mxMaxInPorts[id] || 0, inPort + 1);
        mxMaxOutPorts[id] = Math.max(mxMaxOutPorts[id] || 0, outPort + 1);
      }
      if (c.outType === 'AD') {
        const port = c.inputPort ?? 0;
        const outId =
          typeof c.output === 'string'
            ? parseInt(c.output.split('-')[1])
            : c.output?.id ?? 0;
        adMaxPorts[outId] = Math.max(adMaxPorts[outId] || 0, port + 1);
      } else if (c.outType === 'DVB') {
        const port = c.inputPort ?? 0;
        const outId =
          typeof c.output === 'string'
            ? parseInt(c.output.split('-')[1])
            : c.output?.id ?? 0;
        dvbMaxPorts[outId] = Math.max(dvbMaxPorts[outId] || 0, port + 1);
      }
    });

    rfPortsArr.forEach((rf) => {
      const id = `RF-${rf.port}`;
      a[id] = true;
      g.setNode(id, { width: 14, height: 5 });
    });

    const getOutputId = (output) => {
      if (!output) return null;
      if (typeof output === 'string') return output;
      return `${output.type}-${output.id}`;
    };

    chainsArr.forEach((c) => {
      if (!c.active) return;
      if (c.matrix && !a[c.matrix.deviceId ?? c.matrix.id]) {
        const mxDeviceId = c.matrix.deviceId ?? c.matrix.id;
        const mxId = `MATRIX-${mxDeviceId}`;
        a[mxDeviceId] = true;
        a[mxId] = true;
        const declaredIn = c.matrix.inputPorts || 4;
        const declaredOut = c.matrix.outputPorts || 4;
        const inferredIn = mxMaxInPorts[mxDeviceId] || 0;
        const inferredOut = mxMaxOutPorts[mxDeviceId] || 0;
        const inputPorts = Math.max(declaredIn, inferredIn);
        const outputPorts = Math.max(declaredOut, inferredOut);
        g.setNode(mxId, {
          width: 24,
          height: nodeH(Math.max(inputPorts, outputPorts), 0),
          matrixId: mxDeviceId,
          inputPorts,
          outputPorts,
        });
      }
      if (
        c.converter != null &&
        convertersArr.find((cv) => cv.id === c.converter)
      ) {
        const id = `CV-${c.converter}`;
        if (!a[id]) {
          a[id] = true;
          g.setNode(id, { width: 20, height: nodeH(1, 1) });
        }
      }
      const outputId = getOutputId(c.output);
      if (outputId && !a[outputId]) {
        const isDvb = outputId.startsWith('DVB');
        const cardList = isDvb ? dvbCardsArr : adCardsArr;
        const maxMap = isDvb ? dvbMaxPorts : adMaxPorts;
        const cardIdx = parseInt(outputId.split('-')[1]);
        const card = isNaN(cardIdx)
          ? undefined
          : cardList.find((c) => c.id === cardIdx);
        const ports = Math.max(card?.inputPorts || 1, maxMap[cardIdx] || 1);
        a[outputId] = true;
        g.setNode(outputId, {
          width: nodeW(ports, 2, card?.dna),
          height: nodeH(ports, 2),
          ports,
        });
      }
    });

    adCardsArr.forEach((card) => {
      const outputId = `AD-${card.id}`;
      if (!a[outputId]) {
        const ports = Math.max(card.inputPorts || 1, adMaxPorts[card.id] || 1);
        a[outputId] = true;
        g.setNode(outputId, {
          width: nodeW(ports, 2, card.dna),
          height: nodeH(ports, 2),
          ports,
        });
      }
    });

    dvbCardsArr.forEach((card) => {
      const outputId = `DVB-${card.id}`;
      if (!a[outputId]) {
        const ports = Math.max(
          card.inputPorts || 1,
          dvbMaxPorts[card.id] || 1
        );
        a[outputId] = true;
        g.setNode(outputId, {
          width: nodeW(ports, 2, card.dna),
          height: nodeH(ports, 2),
          ports,
        });
      }
    });

    convertersArr.forEach((cv) => {
      const id = `CV-${cv.id}`;
      if (!a[id]) {
        a[id] = true;
        g.setNode(id, { width: 20, height: nodeH(1, 1) });
      }
    });

    chainsArr.forEach((c) => {
      if (!c.active) return;
      const rfId = `RF-${c.rf}`;
      const outputId = getOutputId(c.output);

      if (c.matrix) {
        const mxId = `MATRIX-${c.matrix.deviceId ?? c.matrix.id}`;
        g.setEdge(rfId, mxId);

        if (c.converter != null) {
          const cvId = `CV-${c.converter}`;
          g.setEdge(mxId, cvId);
          if (outputId) g.setEdge(cvId, outputId);
        } else if (outputId) {
          g.setEdge(mxId, outputId);
        }
      } else if (c.converter != null) {
        const cvId = `CV-${c.converter}`;
        g.setEdge(rfId, cvId);
        if (outputId) g.setEdge(cvId, outputId);
      } else if (outputId) {
        g.setEdge(rfId, outputId);
      }
    });

    dagre.layout(g);
    return g;
  }, [chainsArr, rfPortsArr, convertersArr, adCardsArr, dvbCardsArr]);

  const mods = React.useMemo(() => {
    const g = dagreGraph;
    const r = [];

    const mxMaxIn = {};
    const mxMaxOut = {};
    const adMaxIn = {};
    const dvbMaxIn = {};

    chainsArr.forEach((c) => {
      if (c.matrix) {
        const id = c.matrix.deviceId ?? c.matrix.id;
        mxMaxIn[id] = Math.max(mxMaxIn[id] || 0, (c.matrixInPort ?? 0) + 1);
        mxMaxOut[id] = Math.max(mxMaxOut[id] || 0, (c.matrixOutPort ?? 0) + 1);
      }
      if (c.outType === 'AD') {
        const outId =
          typeof c.output === 'string'
            ? parseInt(c.output.split('-')[1])
            : c.output?.id ?? 0;
        adMaxIn[outId] = Math.max(adMaxIn[outId] || 0, (c.inputPort ?? 0) + 1);
      } else if (c.outType === 'DVB') {
        const outId =
          typeof c.output === 'string'
            ? parseInt(c.output.split('-')[1])
            : c.output?.id ?? 0;
        dvbMaxIn[outId] = Math.max(
          dvbMaxIn[outId] || 0,
          (c.inputPort ?? 0) + 1
        );
      }
    });

    g.nodes().forEach((v) => {
      const n = g.node(v);
      if (!n || v.startsWith('RF-')) return;

      let ox = n.x - n.width / 2;
      let oy = n.y - n.height / 2;
      const off = nodeOffsetsRef.current[v];
      if (off) {
        ox = off.x;
        oy = off.y;
      }

      let t = v.startsWith('MATRIX')
        ? 'matrix'
        : v.startsWith('CV')
        ? 'converter'
        : v.startsWith('AD')
        ? 'ad'
        : 'dvb';
      const num = parseInt(v.replace(/\D/g, ''), 10);

      const dd = [];
      let inN = 1;
      let outN = t === 'converter' ? 1 : 0;

      if (t === 'matrix') {
        const mx = matrixItemsArr.find((m) => m.deviceId === num);
        inN = Math.max(mx?.inputPorts || 4, mxMaxIn[num] || 0);
        outN = Math.max(mx?.outputPorts || 4, mxMaxOut[num] || 0);
      }
      if (t === 'converter') {
        const cvId = num;
        const cv = convertersArr.find((c) => c.id === cvId);
        if (cv) dd.push(`F:${formatFreqKhz(cv.freq)}`);
        inN = 1;
        outN = 1;
      }
      if (t === 'ad') {
        const c = adCardsArr.find((a) => a.id === num);
        if (c) {
          inN = Math.max(c.inputPorts || 1, adMaxIn[num] || 1);
          dd.push(`DNA:${c.dna || '--'}`);
          dd.push(`CH:${c.channels?.used ?? '-'}/${c.channels?.total ?? '-'}`);
        }
      }
      if (t === 'dvb') {
        const c = dvbCardsArr.find((d) => d.id === num);
        if (c) {
          inN = Math.max(c.inputPorts || 1, dvbMaxIn[num] || 1);
          dd.push(`DNA:${c.dna || '--'}`);
          dd.push(`CH:${c.channels?.used ?? '-'}/${c.channels?.total ?? '-'}`);
        }
      }

      const w = n.width;
      const h = n.height;
      const portGap = 2;
      const portSpan = Math.max(0, (inN - 1) * portGap);
      const portStart = oy + h / 2 - portSpan / 2;
      const iP = Array.from({ length: inN }, (_, i) => ({
        y: portStart + i * portGap,
        on: false,
      }));
      const oP = Array.from({ length: outN }, (_, i) => ({
        y: portStart + i * portGap,
        on: false,
      }));

      const getOutputId = (output) => {
        if (!output) return null;
        if (typeof output === 'string') return output;
        return `${output.type}-${output.id}`;
      };

      chainsArr.forEach((c) => {
        if (!c.active) return;
        if (
          t === 'matrix' &&
          String(num) === String(c.matrix?.deviceId ?? c.matrix?.id ?? '')
        ) {
          const inIdx = c.matrixInPort ?? 0;
          const outIdx = c.matrixOutPort ?? 0;
          if (iP[inIdx]) iP[inIdx].on = true;
          if (oP[outIdx]) oP[outIdx].on = true;
        }
        if (
          (t === 'ad' || t === 'dvb') &&
          getOutputId(c.output) === v &&
          iP[c.inputPort ?? 0]
        )
          iP[c.inputPort ?? 0].on = true;
        if (
          t === 'converter' &&
          convertersArr.find((cv) => cv.id === num) &&
          iP[0]
        )
          iP[0].on = true;
      });

      const prefix = { matrix: '矩阵', converter: '变频器', ad: 'AD', dvb: 'DVB' }[
        t
      ];
      const matrixId = t === 'matrix' ? num : null;

      r.push({
        id: v,
        x: ox,
        y: oy,
        w,
        h,
        label: `${prefix}-${num}`,
        color: C[t],
        dd,
        ddY: oy + 5.5 + 2,
        inPorts: iP,
        outPorts: oP,
        mx:
          t === 'matrix'
            ? matrixItemsArr.find((m) => m.deviceId === matrixId)
            : null,
      });
    });

    return r;
  }, [dagreGraph, chainsArr, convertersArr, adCardsArr, dvbCardsArr, matrixItemsArr]);

  const rfs = React.useMemo(() => {
    const g = dagreGraph;
    const r = [];

    rfPortsArr.forEach((rf, idx) => {
      const id = `RF-${rf.port}`;
      const n = g.node(id);
      const off = rfOffsetsRef.current[id];

      let x, y;
      if (off) {
        x = off.x;
        y = off.y;
      } else if (n) {
        x = n.x - n.width / 2;
        y = n.y - n.height / 2;
      } else {
        x = 0;
        y = 6 + idx * 12;
      }

      r.push({
        id,
        port: rf.port,
        x,
        y,
        label: `RF-${rf.port}`,
        lev: rf?.level != null ? rf.level + 'dBm' : '--',
        online: rf?.level != null,
      });
    });

    return r;
  }, [dagreGraph, rfPortsArr]);

  const edges = React.useMemo(() => {
    const r = [];
    let k = 0;
    const fm = (l) => mods.find((m) => m.id === l);

    const getMatrixId = (matrixId) => (matrixId ? `MATRIX-${matrixId}` : null);
    const getOutputId = (output) => {
      if (!output) return null;
      if (typeof output === 'string') return output;
      return `${output.type}-${output.id}`;
    };

    chainsArr.forEach((c) => {
      if (!c.active) return;
      const rf = rfs.find((x) => x.port === c.rf);
      if (!rf) return;
      const sx = rf.x + 14;
      const sy = rf.y + 5;
      const outputId = getOutputId(c.output);

      // RF -> first level
      const t1 = c.matrix
        ? getMatrixId(c.matrix.deviceId ?? c.matrix.id)
        : c.converter != null
        ? `CV-${c.converter}`
        : outputId;
      if (t1) {
        const m1 = fm(t1);
        if (m1) {
          const pi = c.matrix
            ? c.matrixInPort ?? 0
            : c.converter != null
            ? 0
            : c.inputPort ?? 0;
          const ty = m1.inPorts[pi]?.y ?? m1.y + m1.h / 2;
          const cpDist = Math.min(16, Math.max(8, (m1.x - sx) / 3));
          r.push({
            k: k++,
            d: `M ${sx} ${sy} C ${sx + cpDist} ${sy} ${m1.x - cpDist} ${ty} ${m1.x} ${ty}`,
          });
        }
      }

      // Matrix -> Converter
      if (c.matrix && c.converter != null) {
        const mxM = fm(getMatrixId(c.matrix.deviceId ?? c.matrix.id));
        const cvM = fm(`CV-${c.converter}`);
        if (mxM && cvM) {
          const outPortIdx = c.matrixOutPort ?? 0;
          const oy = mxM.outPorts[outPortIdx]?.y ?? mxM.y + mxM.h / 2;
          const iy = cvM.inPorts[0]?.y ?? cvM.y + cvM.h / 2;
          const cpDist2 = Math.min(
            16,
            Math.max(8, (cvM.x - mxM.x - mxM.w) / 3)
          );
          r.push({
            k: k++,
            d: `M ${mxM.x + mxM.w} ${oy} C ${mxM.x + mxM.w + cpDist2} ${oy} ${cvM.x - cpDist2} ${iy} ${cvM.x} ${iy}`,
          });
        }
      }

      // Converter/Direct -> Output
      if (outputId) {
        const oM = fm(outputId);
        if (oM) {
          const hp = c.converter != null
            ? fm(`CV-${c.converter}`)
            : c.matrix
            ? fm(getMatrixId(c.matrix.deviceId ?? c.matrix.id))
            : null;
          if (hp) {
            const outPortIdx = c.converter != null ? 0 : c.matrix ? c.matrixOutPort : 0;
            const oy2 = hp.outPorts[outPortIdx]?.y ?? hp.y + hp.h / 2;
            const inPortIdx = c.inputPort ?? 0;
            const iy2 = oM.inPorts[inPortIdx]?.y ?? oM.y + oM.h / 2;
            const cpDist3 = Math.min(
              16,
              Math.max(8, (oM.x - hp.x - hp.w) / 3)
            );
            r.push({
              k: k++,
              d: `M ${hp.x + hp.w} ${oy2} C ${hp.x + hp.w + cpDist3} ${oy2} ${oM.x - cpDist3} ${iy2} ${oM.x} ${iy2}`,
            });
          }
        }
      }
    });

    return r;
  }, [mods, rfs, chainsArr]);

  // Mount / resize / chains change effects
  React.useEffect(() => {
    hasRestoredLayoutRef.current = loadLayout();
    const timer = setTimeout(() => {
      if (hasRestoredLayoutRef.current) {
        centerByCurrentZoom(mods, rfs, zoom);
      } else {
        autoFit(mods, rfs);
      }
    }, 50);

    const container = topoRef.current;
    if (!container) return () => clearTimeout(timer);

    const ro = new ResizeObserver(() => {
      if (hasRestoredLayoutRef.current) {
        centerByCurrentZoom(mods, rfs, zoom);
      } else {
        autoFit(mods, rfs);
      }
    });
    ro.observe(container);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    nodeOffsetsRef.current = {};
    rfOffsetsRef.current = {};
    setZoom(1);
    setPanX(0);
    setPanY(0);
    const timer = setTimeout(() => autoFit(mods, rfs), 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainsArr]);

  // Event handlers
  function onWheel(e) {
    if (!interactive) return;
    e.preventDefault();
    const container = topoRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const d = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * d));
    const ratio = newZoom / zoom;
    setPanX(mx - (mx - panX) * ratio);
    setPanY(my - (my - panY) * ratio);
    setZoom(newZoom);
  }

  function onMouseDown(e) {
    if (dragNode) return;
    setDragging(true);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }

  function startDragNode(e, nodeId) {
    e.stopPropagation();
    setDragNode(nodeId);
    const sp = screenToSvg(e.clientX, e.clientY);
    const cur = mods.find((m) => m.id === nodeId) || rfs.find((r) => r.id === nodeId);
    if (cur) dragOffsetRef.current = { x: sp.x - cur.x, y: sp.y - cur.y };
  }

  function onMouseMove(e) {
    if (dragNode) {
      const sp = screenToSvg(e.clientX, e.clientY);
      const isRf = dragNode.startsWith('RF-');
      if (isRf) {
        rfOffsetsRef.current = {
          ...rfOffsetsRef.current,
          [dragNode]: {
            x: sp.x - dragOffsetRef.current.x,
            y: sp.y - dragOffsetRef.current.y,
          },
        };
      } else {
        const cur = mods.find((m) => m.id === dragNode);
        if (cur) {
          nodeOffsetsRef.current = {
            ...nodeOffsetsRef.current,
            [dragNode]: {
              x: sp.x - dragOffsetRef.current.x,
              y: sp.y - dragOffsetRef.current.y,
            },
          };
        }
      }
      // Force re-render to update positions
      setPanX((v) => v);
      return;
    }
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    if (dragging) {
      setPanX((v) => v + dx);
      setPanY((v) => v + dy);
    }
  }

  function onMouseUp() {
    setDragging(false);
    setDragNode(null);
  }

  const cursorStyle = dragNode
    ? 'grabbing'
    : dragging
    ? 'grab'
    : 'default';

  return (
    <div
      ref={topoRef}
      className={`${styles['topo-gv']} ${interactive ? styles['interactive'] : ''}`}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <svg className={styles['topo-svg']} style={{ cursor: cursorStyle }}>
        <defs>
          <marker
            id="gv-arrow"
            markerWidth="6"
            markerHeight="4.5"
            refX="5"
            refY="2.1"
            orient="auto"
          >
            <polygon points="0 0, 6 2.1, 0 4.2" fill="#00ff88" opacity="0.4" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="transparent" />
        <g transform={`translate(${panX},${panY})`}>
          <g transform={`scale(${zoom})`}>
            {/* Ports */}
            {mods.map((n) => (
              <g key={`p${n.id}`}>
                {n.inPorts.map((p, pi) => (
                  <g key={`i${pi}`}>
                    <circle
                      cx={n.x}
                      cy={p.y}
                      r=".6"
                      fill={p.on ? n.color : '#1e293b'}
                      stroke={p.on ? n.color : '#475569'}
                      strokeWidth=".2"
                    />
                    <text
                      x={n.x - 1}
                      y={p.y + 0.8}
                      fill="#94a3b8"
                      fontSize="1.8"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {pi}
                    </text>
                  </g>
                ))}
                {n.outPorts.map((p, pi) => (
                  <g key={`o${pi}`}>
                    <circle
                      cx={n.x + n.w}
                      cy={p.y}
                      r=".6"
                      fill={p.on ? n.color : '#1e293b'}
                      stroke={p.on ? n.color : '#475569'}
                      strokeWidth=".2"
                    />
                    <text
                      x={n.x + n.w + 1}
                      y={p.y + 0.8}
                      fill="#94a3b8"
                      fontSize="1.8"
                      textAnchor="start"
                      fontFamily="monospace"
                    >
                      {pi}
                    </text>
                  </g>
                ))}
              </g>
            ))}

            {/* Edges */}
            {edges.map((e) => (
              <g key={e.k}>
                <path
                  d={e.d}
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth=".3"
                  opacity=".25"
                  markerEnd="url(#gv-arrow)"
                />
              </g>
            ))}

            {/* Nodes */}
            {mods.map((n) => (
              <g
                key={`m${n.id}`}
                className={styles['topo-node']}
                onMouseDown={(e) => startDragNode(e, n.id)}
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx="1"
                  fill="#0f172a"
                  stroke="none"
                />
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  rx="1"
                  fill="none"
                  stroke={n.color}
                  strokeWidth=".4"
                />
                <rect
                  x={n.x + 0.5}
                  y={n.y + 0.5}
                  width={n.w - 1}
                  height="3"
                  rx=".6"
                  fill={n.color}
                  opacity=".08"
                />
                <text
                  x={n.x + n.w / 2}
                  y={n.y + 3}
                  fill="white"
                  fontSize="2.5"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="'Consolas',monospace"
                >
                  {n.label}
                </text>
                {n.dd.map((d, di) => (
                  <text
                    key={di}
                    x={n.x + 1}
                    y={n.ddY + di * 1.8 + 1.2}
                    fill="#cbd5e1"
                    fontSize="1.7"
                    fontFamily="'Consolas',monospace"
                    letterSpacing="0.2"
                  >
                    {d}
                  </text>
                ))}
                {/* Matrix internal connections */}
                {n.mx && n.inPorts.length && n.outPorts.length && (
                  <g>
                    {n.mx.internalConnections?.map((ic, ii) => (
                      <path
                        key={ii}
                        d={`M ${n.x} ${n.inPorts[ic.input]?.y} C ${n.x + n.w * 0.4} ${n.inPorts[ic.input]?.y} ${n.x + n.w * 0.6} ${n.outPorts[ic.output]?.y} ${n.x + n.w} ${n.outPorts[ic.output]?.y}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth=".35"
                        opacity=".6"
                      />
                    ))}
                  </g>
                )}
              </g>
            ))}

            {/* RF nodes */}
            {rfs.map((rf) => (
              <g
                key={`r${rf.port}`}
                className={styles['topo-node']}
                onMouseDown={(e) => startDragNode(e, rf.id)}
              >
                <rect
                  x={rf.x}
                  y={rf.y}
                  width="14"
                  height="10"
                  rx=".8"
                  fill={
                    rf.online
                      ? 'rgba(59,130,246,0.1)'
                      : 'var(--bg-primary)'
                  }
                  stroke={
                    rf.online ? 'var(--device-rf)' : 'var(--border-color)'
                  }
                  strokeWidth=".4"
                />
                <text
                  x={rf.x + 7}
                  y={rf.y + 4}
                  fill="white"
                  fontSize="3"
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="'Consolas',monospace"
                >
                  {rf.label}
                </text>
                <text
                  x={rf.x + 7}
                  y={rf.y + 7}
                  fill="#94a3b8"
                  fontSize="2"
                  textAnchor="middle"
                >
                  {rf.lev}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>

      <div className={styles['topo-dock']} onMouseDown={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()}>
        <button
          className={`${styles['dock-btn']} ${interactive ? styles['active'] : ''}`}
          onClick={toggleInteractive}
          title={interactive ? '关闭滚轮缩放' : '开启滚轮缩放'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6.5" cy="6.5" r="5" />
            <line x1="10.2" y1="10.2" x2="15" y2="15" />
            {interactive && <line x1="4" y1="6.5" x2="9" y2="6.5" />}
            {interactive && <line x1="6.5" y1="4" x2="6.5" y2="9" />}
          </svg>
        </button>
        <button
          className={styles['dock-btn']}
          onClick={resetLayout}
          title="一键整理视图"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="5" height="5" rx="0.5" />
            <rect x="9" y="2" width="5" height="5" rx="0.5" />
            <rect x="2" y="9" width="5" height="5" rx="0.5" />
            <rect x="9" y="9" width="5" height="5" rx="0.5" />
          </svg>
        </button>
        <div className={styles['dock-sep']} />
        <button
          className={`${styles['dock-btn']} ${justSaved ? styles['saved'] : ''}`}
          onClick={saveLayout}
          title="保存当前布局"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 1h8l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
            <rect x="5" y="1" width="5" height="4" rx="0.5" />
            <rect x="4.5" y="9" width="7" height="4" rx="0.5" />
            {justSaved && <line x1="5" y1="11.5" x2="11" y2="11.5" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
