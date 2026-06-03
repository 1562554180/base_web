import React from 'react';
import styles from './index.less';

export default function ConverterNode({ node }) {
  const data = node.getData() || {};
  const { label, freq } = data;

  return (
    <div className={`${styles.nodeWrapper} ${styles.converterNode}`}>
      <div className={styles.nodeBody}>
        <div className={styles.nodeTitle}>{label}</div>
        <div className={styles.nodeDetail}>{freq || '--'}</div>
      </div>
    </div>
  );
}
