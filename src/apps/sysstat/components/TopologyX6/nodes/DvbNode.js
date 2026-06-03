import React from 'react';
import styles from './index.less';

export default function DvbNode({ node }) {
  const data = node.getData() || {};
  const { label, dna, channels } = data;

  return (
    <div className={`${styles.nodeWrapper} ${styles.dvbNode}`}>
      <div className={styles.nodeBody}>
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
    </div>
  );
}
