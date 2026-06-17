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
  left: '-10px',
  alignItems: 'flex-end',
};

const rightPortsStyle = {
  ...sidePortsStyle,
  right: '-10px',
  alignItems: 'flex-start',
};

const portRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  height: '10px',
};

const portLabelStyle = {
  fontSize: '8px',
  color: '#94a3b8',
  fontFamily: 'monospace',
  lineHeight: 1,
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

export default function MatrixNode({ node }) {
  const data = node.getData() || {};
  const { label, inPorts, outPorts, connections } = data;

  const inPortArray = Array.from({ length: inPorts || 4 }, (_, i) => i);
  const outPortArray = Array.from({ length: outPorts || 4 }, (_, i) => i);

  const isPortActive = (type, idx) => {
    if (!connections) return false;
    return connections.some(c => (type === 'in' ? c.input === idx : c.output === idx));
  };

  const color = 'var(--device-matrix, #06b6d4)';

  return (
    <div
      className={`${styles.nodeWrapper} ${styles.matrixNode}`}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}
    >
      <div className={styles.nodeBody}>
        <div className={styles.nodeHeaderGlow} style={{ background: color }} />
        <div className={styles.nodeTitle}>{label}</div>
      </div>
      {/* Side ports rendered AFTER the body so they stack on top of it
          (the body has a solid background and overflow:hidden). */}
      <div style={leftPortsStyle}>
        {inPortArray.map(i => (
          <div key={`in-${i}`} style={portRowStyle}>
            <span style={portLabelStyle}>{i}</span>
            <span style={getPortStyle(isPortActive('in', i), color)} title={`IN-${i}`} />
          </div>
        ))}
      </div>
      <div style={rightPortsStyle}>
        {outPortArray.map(i => (
          <div key={`out-${i}`} style={portRowStyle}>
            <span style={getPortStyle(isPortActive('out', i), color)} title={`OUT-${i}`} />
            <span style={portLabelStyle}>{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
