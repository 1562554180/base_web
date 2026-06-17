import React from 'react';
import styles from './index.less';

export default function RfNode({ node }) {
  const data = node.getData() || {};
  const { label, level, online } = data;

  const color = online ? 'var(--device-rf, #3b82f6)' : 'var(--border-color, #475569)';

  return (
    <div
      className={`${styles.nodeWrapper} ${styles.rfNode}`}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}
    >
      <div className={styles.nodeBody} style={{ borderColor: color }}>
        <div className={styles.nodeHeaderGlow} style={{ background: color }} />
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>{level || '--'}</div>
      </div>
      {/* Right side output port */}
      <div
        style={{
          position: 'absolute',
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: online ? color : '#1e293b',
            border: `1px solid ${online ? color : '#475569'}`,
            display: 'block',
            boxShadow: online ? `0 0 2px ${color}` : 'none',
          }}
          title="OUT"
        />
      </div>
    </div>
  );
}
