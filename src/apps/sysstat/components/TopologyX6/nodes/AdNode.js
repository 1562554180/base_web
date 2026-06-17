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

export default function AdNode({ node }) {
  const data = node.getData() || {};
  const { label, dna, channels, inPorts, activeInPorts } = data;

  const color = 'var(--device-ad, #f97316)';
  const portCount = inPorts || 1;
  const activeSet = new Set(activeInPorts || []);

  return (
    <div
      className={`${styles.nodeWrapper} ${styles.adNode}`}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}
    >
      <div className={styles.nodeBody}>
        <div className={styles.nodeHeaderGlow} style={{ background: color }} />
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>
          DNA:
          {dna || '--'}
        </div>
        <div className={styles.nodeDetail}>
          CH:
          {channels?.used ?? '-'}/{channels?.total ?? '-'}
        </div>
      </div>
      {/* Side ports rendered AFTER the body so they stack on top of it
          (the body has a solid background and overflow:hidden). */}
      <div style={leftPortsStyle}>
        {Array.from({ length: portCount }, (_, i) => (
          <div key={`in-${i}`} style={portRowStyle}>
            <span style={portLabelStyle}>{i}</span>
            <span style={getPortStyle(activeSet.has(i), color)} title={`IN-${i}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
