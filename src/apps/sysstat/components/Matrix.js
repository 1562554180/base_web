import React from 'react';
import styles from './Matrix.less';

export default function Matrix({ data }) {
  return (
    <section className="module-section">
      <div className="module-header">矩阵 ({data?.count} 台)</div>
      <div className="module-content">
        {(data?.items || []).map((item, index) => (
          <div key={index} className={styles.matrixItem}>
            <div className={styles.matrixTitle}>{item.id}</div>
            <div className={styles.matrixInfo}>
              <span className={styles.matrixStat}>输入口: {item.inputPorts}</span>
              <span className={styles.matrixStat}>输出口: {item.outputPorts}</span>
            </div>
            <div className={styles.matrixConnectionsHorizontal}>
              <div className={`${styles.connBlock} ${styles.connInput}`}>
                <div className={styles.connLabel}>输入</div>
                <div className={styles.connTable}>
                  {Array.from({ length: item.inputPorts }).map((_, i) => (
                    <div key={'in'+i} className={styles.connRow} title={item.inputConnections?.[i] || '-'}>
                      <span className={styles.colPort}>{i}</span>
                      <span className={styles.colConn}>{item.inputConnections?.[i] || ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.connBlock} ${styles.connInternal}`}>
                <div className={styles.connLabel}>内联</div>
                <div className={styles.connTable}>
                  {Array.from({ length: item.inputPorts }).map((_, i) => (
                    <div key={'int'+i} className={`${styles.connRow} ${styles.connRowInline} value-good`}>
                      <span className={styles.colPort}>{i}</span>
                      <span className={styles.colArrow}>→</span>
                      <span className={styles.colPort}>
                        {item.outputPortMap?.[i] !== undefined ? item.outputPortMap[i] : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.connBlock} ${styles.connOutput}`}>
                <div className={styles.connLabel}>输出</div>
                <div className={styles.connTable}>
                  {Array.from({ length: item.outputPorts }).map((_, i) => (
                    <div key={'out'+i} className={styles.connRow} title={item.outputConnections?.[i] || '-'}>
                      <span className={styles.colPort}>{i}</span>
                      <span className={styles.colConn}>{item.outputConnections?.[i] || ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
