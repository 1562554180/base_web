import React from 'react';
import styles from './Converter.less';

function formatFreqKhz(khz) {
  return (khz / 1e3).toFixed(0) + 'MHz';
}

export default function Converter({ data }) {
  const mappedItems = React.useMemo(() => {
    return (data?.items || []).map(item => ({
      id: item.id,
      type: item.type,
      device: item.device || item.version || '—',
      ifFreq: item.ifMod != null ? item.ifMod + 'MHz' : (item.ifFreq || '—'),
      centerLfFreq: item.freq != null ? formatFreqKhz(item.freq) : (item.centerLfFreq || '—'),
      gain: item.outGain != null ? item.outGain : (item.gain || 0),
      onlineStatus: item.onlineStatus || 'off'
    }));
  }, [data?.items]);

  return (
    <section className="module-section">
      <div className="module-header">变频器 ({data?.count} 个)</div>
      <div className="module-content">
        <div className={styles.convCardList}>
          {mappedItems.map((item, index) => (
            <div key={index} className={styles.convCardItem}>
              <div className={styles.convCardTitle}>
                CONV-{item.id}
                <span className={styles.statusIndicator}>
                  <span className={`${styles.statusDot} ${item.onlineStatus === 'on' ? styles.normal : styles.error}`}></span>
                  <span className={styles.statusText}>{item.onlineStatus === 'on' ? '在线' : '离线'}</span>
                </span>
              </div>
              <div className={styles.convCardGrid}>
                <span className={styles.convStat}>
                  <span className={styles.convLabel}>类型</span>
                  <span className={styles.convValue}>{item.type}</span>
                </span>
                <span className={styles.convStat}>
                  <span className={styles.convLabel}>设备</span>
                  <span className={styles.convValue}>{item.device}</span>
                </span>
                <span className={styles.convStat}>
                  <span className={styles.convLabel}>中频模式</span>
                  <span className={`${styles.convValue} ${styles.mono}`}>{item.ifFreq}</span>
                </span>
                <span className={styles.convStat}>
                  <span className={styles.convLabel}>频率</span>
                  <span className={`${styles.convValue} ${styles.mono}`}>{item.centerLfFreq}</span>
                </span>
                <span className={styles.convStat}>
                  <span className={styles.convLabel}>增益</span>
                  <span className={`${styles.convValue} ${styles.mono}`}>{item.gain}dB</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
