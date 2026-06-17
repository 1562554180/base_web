import React from 'react';
import styles from './index.less';

export default function TopoToolbar({ graph, onAutoLayout, onResetLayout }) {
  const [zoom, setZoom] = React.useState(1);
  const [justSaved, setJustSaved] = React.useState(false);

  React.useEffect(
    () => {
      if (!graph) return;
      const handler = () => setZoom(graph.zoom());
      graph.on('scale', handler);
      return () => graph.off('scale', handler);
    },
    [graph]
  );

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
    graph.getNodes().forEach(node => {
      positions[node.id] = node.getPosition();
    });
    localStorage.setItem(
      'topo-x6-layout-v1',
      JSON.stringify({
        positions,
        zoom: graph.zoom(),
      })
    );
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1500);
  };

  return (
    <div className={styles.toolbar}>
      <button type="button" className={styles.toolBtn} onClick={handleZoomOut} title="缩小">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="6.5" cy="6.5" r="5" />
          <line x1="4" y1="6.5" x2="9" y2="6.5" />
          <line x1="10.2" y1="10.2" x2="15" y2="15" />
        </svg>
      </button>
      <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>
      <button type="button" className={styles.toolBtn} onClick={handleZoomIn} title="放大">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="6.5" cy="6.5" r="5" />
          <line x1="4" y1="6.5" x2="9" y2="6.5" />
          <line x1="6.5" y1="4" x2="6.5" y2="9" />
          <line x1="10.2" y1="10.2" x2="15" y2="15" />
        </svg>
      </button>
      <div className={styles.toolSep} />
      {/* <button type="button" className={styles.toolBtn} onClick={handleFit} title="适应视图">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="2" y="2" width="5" height="5" rx="0.5" />
          <rect x="9" y="2" width="5" height="5" rx="0.5" />
          <rect x="2" y="9" width="5" height="5" rx="0.5" />
          <rect x="9" y="9" width="5" height="5" rx="0.5" />
        </svg>
      </button> */}
      <button type="button" className={styles.toolBtn} onClick={onAutoLayout} title="自动布局">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 4h12M2 8h12M2 12h12" />
        </svg>
      </button>
      <div className={styles.toolSep} />
      {/* <button
        type="button"
        className={`${styles.toolBtn} ${justSaved ? styles.saved : ''}`}
        onClick={handleSave}
        title="保存布局"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 1h8l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
          <rect x="5" y="1" width="5" height="4" rx="0.5" />
          <rect x="4.5" y="9" width="7" height="4" rx="0.5" />
        </svg>
      </button> */}
      {/* <button type="button" className={styles.toolBtn} onClick={onResetLayout} title="重置布局">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="1 4 1 1 4 1" />
          <path d="M1 1l3 3" />
          <path d="M1 8a7 7 0 1 0 1.5-4" />
        </svg>
      </button> */}
    </div>
  );
}
