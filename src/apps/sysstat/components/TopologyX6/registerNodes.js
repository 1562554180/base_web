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

// Single, shared port-anchor function used by every node type.
// Position matches the side-port HTML rendering in *Node components:
//   sidePorts container: top:0, bottom:0, justifyContent:center, gap=6px
//   portRow height: 10px (rowH)
//   dot center offset within row: rowH/2 = 5px
//   rows are vertically centered inside the node bbox.
const PORT_ROW = 10;
const PORT_GAP = 6;

function portY(nodeView, args) {
  const node = nodeView.cell;
  const data = node.getData() || {};
  const bbox = node.getBBox();
  const side = args.side; // 'left' | 'right'
  const inKey = args.inKey || 'inPorts';
  const outKey = args.outKey || 'outPorts';
  const defaultCount = args.defaultCount ?? 1;
  const count = side === 'right' ? data[outKey] || defaultCount : data[inKey] || defaultCount;
  const idx = args.portIndex ?? 0;
  const total = count * PORT_ROW + Math.max(0, count - 1) * PORT_GAP;
  const startY = (bbox.height - total) / 2;
  return new Point(
    side === 'right' ? bbox.x + bbox.width : bbox.x,
    bbox.y + startY + idx * (PORT_ROW + PORT_GAP) + PORT_ROW / 2
  );
}

function registerSideAnchors(name, inArgs, outArgs) {
  Graph.registerAnchor(`${name}-in`, (nodeView, magnet, ref, args) =>
    portY(nodeView, { ...inArgs, ...args, side: 'left' })
  );
  if (outArgs !== null) {
    Graph.registerAnchor(`${name}-out`, (nodeView, magnet, ref, args) =>
      portY(nodeView, { ...outArgs, ...args, side: 'right' })
    );
  }
}

// Matrix: configurable in/out on both sides (default 4)
registerSideAnchors(
  'matrix',
  { inKey: 'inPorts', outKey: 'outPorts', defaultCount: 4 },
  { inKey: 'inPorts', outKey: 'outPorts', defaultCount: 4 }
);
// AD: only left input ports
registerSideAnchors('ad', { inKey: 'inPorts', outKey: 'inPorts', defaultCount: 1 }, null);
// DVB: only left input ports
registerSideAnchors('dvb', { inKey: 'inPorts', outKey: 'inPorts', defaultCount: 1 }, null);

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

// Compute a node's outer height so the side-port rows fit inside the body.
// Uses the same PORT_ROW / PORT_GAP constants as the portY anchor function
// and the *Node component render, so the visual and the anchor line up.
export function computeNodeHeight(type, data, baseHeight) {
  let portCount = 0;
  if (type === 'matrix') {
    portCount = Math.max(data?.inPorts || 0, data?.outPorts || 0);
  } else if (type === 'ad' || type === 'dvb') {
    portCount = data?.inPorts || 0;
  }
  if (!portCount) return baseHeight;

  const portsHeight = portCount * PORT_ROW + Math.max(0, portCount - 1) * PORT_GAP;
  // body has to be at least as tall as the port column; matrix body has only
  // a title (1 line ≈ 14px), other bodies have title + 2 details (~40px).
  const bodyMinHeight = type === 'matrix' ? 20 : 40;
  return Math.max(baseHeight, Math.max(portsHeight, bodyMinHeight) + 8);
}
