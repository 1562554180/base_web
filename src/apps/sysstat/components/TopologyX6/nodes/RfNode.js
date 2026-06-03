import React from 'react';
import styles from './index.less';

export default function RfNode({ node }) {
  const data = node.getData() || {};
  const { label, level } = data;

  return (
    <div className={`${styles.nodeWrapper} ${styles.rfNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>{level || '--'}</div>
      </div>
    </div>
  );
}
