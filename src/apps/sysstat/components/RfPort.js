import React from 'react';
import styles from './RfPort.less';

function getLevelClass(value) {
  if (value > -20) return 'value-good';
  if (value > -30) return '';
  if (value > -40) return 'value-warning';
  return 'value-error';
}

export default function RfPort({ data }) {
  return (
    <section className="module-section">
      <div className="module-header">射频输入口 ({data?.count})</div>
      <div className="module-content">
        <div className={styles.rfList}>
          {(data?.connections || []).map((conn, index) => (
            <div key={index} className={styles.rfItem}>
              <span className={styles.rfPort}>IN-{conn.port}</span>
              <span className={styles.rfSep}>→</span>
              <span className={styles.rfConn}>{conn.connectedTo}</span>
              {conn.level !== null ? (
                <span className={`${styles.rfLevel} ${getLevelClass(conn.level)}`}>
                  {conn.level}dBm
                </span>
              ) : (
                <span className={`${styles.rfLevel} text-muted`}>--</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
