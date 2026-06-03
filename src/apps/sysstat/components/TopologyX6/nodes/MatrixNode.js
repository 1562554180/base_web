import React from 'react';
import styles from './index.less';

export default function MatrixNode({ node }) {
  const data = node.getData() || {};
  const { label, inPorts, outPorts, connections } = data;

  const inPortArray = Array.from({ length: inPorts || 4 }, (_, i) => i);
  const outPortArray = Array.from({ length: outPorts || 4 }, (_, i) => i);

  const isPortActive = (type, idx) => {
    if (!connections) return false;
    return connections.some(c => (type === 'in' ? c.input === idx : c.output === idx));
  };

  return (
    <div className={`${styles.nodeWrapper} ${styles.matrixNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodePorts}>
          {inPortArray.map(i => (
            <span
              key={`in-${i}`}
              className={`${styles.portDot} ${isPortActive('in', i) ? styles.portDotActive : ''}`}
              style={{ color: 'var(--device-matrix, #06b6d4)' }}
              title={`IN-${i}`}
            />
          ))}
        </div>
        <div className={styles.nodePorts}>
          {outPortArray.map(i => (
            <span
              key={`out-${i}`}
              className={`${styles.portDot} ${isPortActive('out', i) ? styles.portDotActive : ''}`}
              style={{ color: 'var(--device-matrix, #06b6d4)' }}
              title={`OUT-${i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
