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

  nodes.forEach(node => {
    const shape = node.shape;
    const w = NODE_WIDTH[shape.replace('-node', '')] || 100;
    const h = NODE_HEIGHT[shape.replace('-node', '')] || 60;
    g.setNode(node.id, { width: w, height: h });
  });

  edges.forEach(edge => {
    g.setEdge(edge.getSourceCellId(), edge.getTargetCellId());
  });

  dagre.layout(g);

  g.nodes().forEach(nodeId => {
    const pos = g.node(nodeId);
    const node = graph.getCellById(nodeId);
    if (node) {
      node.position(pos.x - pos.width / 2, pos.y - pos.height / 2);
    }
  });
}

export function saveLayout(graph) {
  const positions = {};
  graph.getNodes().forEach(node => {
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
