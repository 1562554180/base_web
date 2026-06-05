import React from 'react';
import { Graph } from '@antv/x6';
import styles from './index.less';
import { registerTopologyNodes, unmountAllNodes } from './registerNodes';
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
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // Initialize graph
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Inject style to fix foreignObject overflow during drag
    const styleId = 'topology-x6-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = '.x6-node foreignObject { overflow: visible !important; }';
      document.head.appendChild(style);
    }

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
      translating: {
        snap: false,
      },
      // No explicit connectionPoint - edges connect directly to port positions
    });

    graphRef.current = graph;
    forceUpdate();

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      graph.resize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      unmountAllNodes(graph);
      graph.dispose();
      graphRef.current = null;
    };
  }, []);

  // Update data
  React.useEffect(
    () => {
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
      unmountAllNodes(graph);
      graph.clearCells();

      // Add nodes
      nodes.forEach(nodeConfig => {
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

      // Add edges - source/target specify port for anchor-based connections
      edges.forEach(edgeConfig => {
        graph.addEdge({
          source: edgeConfig.source,
          target: edgeConfig.target,
          attrs: {
            line: {
              stroke: '#00ff88',
              strokeWidth: 1,
              opacity: 0.25,
              targetMarker: {
                name: 'classic',
                size: 6,
                fill: '#00ff88',
                stroke: '#00ff88',
              },
            },
          },
          connector: {
            name: 'smooth',
          },
        });
      });

      // Apply layout
      const hasSavedLayout = loadLayout(graph);
      if (!hasSavedLayout) {
        applyDagreLayout(graph);
        graph.zoomToFit({ padding: 20 });
      }
    },
    [chains, rfPorts, matrixItems, converters, dvbCards, adCards]
  );

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
