import ReactDOM from 'react-dom';
import React from 'react';
import { Graph, Point } from '@antv/x6';
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

// Map shape names to React components
const NODE_COMPONENTS = {
  'rf-node': RfNode,
  'matrix-node': MatrixNode,
  'converter-node': ConverterNode,
  'ad-node': AdNode,
  'dvb-node': DvbNode,
};

// Track mounted React roots for cleanup
const mountedRoots = new WeakMap();

// Custom anchors for Matrix node ports
// Position matches MatrixNode HTML rendering:
//   sidePorts container: top:0, bottom:0, justifyContent:center, gap:6px
//   portRow height: 10px
//   dot center offset within row: rowH/2 = 5px
function matrixPortY(nodeView, args) {
  const node = nodeView.cell;
  const data = node.getData() || {};
  const bbox = node.getBBox();
  const count = args.side === 'left' ? data.inPorts || 4 : data.outPorts || 4;
  const idx = args.portIndex ?? 0;
  const rowH = 10;
  const gap = 6;
  const total = count * rowH + Math.max(0, count - 1) * gap;
  const startY = (bbox.height - total) / 2;
  return new Point(
    args.side === 'left' ? bbox.x : bbox.x + bbox.width,
    bbox.y + startY + idx * (rowH + gap) + rowH / 2
  );
}

Graph.registerAnchor('matrix-in', (nodeView, magnet, ref, args) => {
  return matrixPortY(nodeView, { ...args, side: 'left' });
});

Graph.registerAnchor('matrix-out', (nodeView, magnet, ref, args) => {
  return matrixPortY(nodeView, { ...args, side: 'right' });
});

export function registerTopologyNodes() {
  // Register each node type as an html shape component
  Object.keys(NODE_COMPONENTS).forEach(shape => {
    Graph.registerHTMLComponent(shape, node => {
      const el = document.createElement('div');
      el.style.width = '100%';
      el.style.height = '100%';
      el.style.overflow = 'visible';
      el.style.borderRadius = '4px';

      const Component = NODE_COMPONENTS[shape];
      ReactDOM.render(React.createElement(Component, { node }), el);
      mountedRoots.set(node, el);
      return el;
    });
  });
}

export function unmountAllNodes(graph) {
  if (!graph) return;
  graph.getNodes().forEach(node => {
    const el = mountedRoots.get(node);
    if (el) {
      ReactDOM.unmountComponentAtNode(el);
      mountedRoots.delete(node);
    }
  });
}

export { NODE_WIDTH, NODE_HEIGHT };
