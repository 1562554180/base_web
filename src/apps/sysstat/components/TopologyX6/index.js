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

      // Add edges
      edges.forEach(edgeConfig => {
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
