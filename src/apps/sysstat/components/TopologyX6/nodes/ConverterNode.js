import React from 'react';
import styles from './index.less';

const sidePortsStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '6px',
  pointerEvents: 'none',
};

const leftPortsStyle = {
  ...sidePortsStyle,
  left: '-6px',
  alignItems: 'flex-end',
};

const rightPortsStyle = {
  ...sidePortsStyle,
  right: '-6px',
  alignItems: 'flex-start',
};

const getPortStyle = (active, color) => ({
  width: '5px',
  height: '5px',
  borderRadius: '50%',
  background: active ? color : '#1e293b',
  border: `1px solid ${active ? color : '#475569'}`,
  display: 'block',
  boxShadow: active ? `0 0 2px ${color}` : 'none',
  flexShrink: 0,
});

export default function ConverterNode({ node }) {
  const data = node.getData() || {};
  const { label, freq } = data;

  const color = 'var(--device-converter, #8b5cf6)';

  return (
    <div
      className={`${styles.nodeWrapper} ${styles.converterNode}`}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* Left side input port */}
      <div style={leftPortsStyle}>
        <span style={getPortStyle(true, color)} title="IN" />
      </div>
      <div className={styles.nodeBody}>
        <div className={styles.nodeHeaderGlow} style={{ background: color }} />
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>{freq || '--'}</div>
      </div>
      {/* Right side output port */}
      <div style={rightPortsStyle}>
        <span style={getPortStyle(true, color)} title="OUT" />
      </div>
    </div>
  );
}
