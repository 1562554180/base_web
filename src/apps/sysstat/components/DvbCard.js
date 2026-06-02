import React from 'react';
import styles from './DvbCard.less';

function getTempClass(value) {
  if (value >= 70) return 'value-error';
  if (value >= 60) return 'value-warning';
  return '';
}

function getLevelClass(value) {
  if (value > -20) return 'value-good';
  if (value > -30) return '';
  if (value > -40) return 'value-warning';
  return 'value-error';
}

export default function DvbCard({ data }) {
  return (
    <section className="module-section">
      <div className="module-header">DVB板卡 ({data?.count} 块)</div>
      <div className="module-content">
        <div className={styles.dvbCardList}>
          {(data?.items || []).map((card, index) => (
            <div key={index} className={styles.dvbCardItem}>
              <div className={styles.dvbCardTitle}>DVB-{card.id}</div>
              <div className={styles.dvbCardGrid}>
                <span className={styles.dvbStat}>
                  <span className={styles.dvbLabel}>版本</span>
                  <span className={styles.dvbValue}>{card.version}</span>
                </span>
                <span className={styles.dvbStat}>
                  <span className={styles.dvbLabel}>输入口</span>
                  <span className={styles.dvbValue}>{card.inputPorts}口</span>
                </span>
                <span className={styles.dvbStat}>
                  <span className={styles.dvbLabel}>DNA</span>
                  <span className={`${styles.dvbValue} ${styles.mono}`}>{card.dna}</span>
                </span>
                <span className={styles.dvbStat}>
                  <span className={styles.dvbLabel}>通道</span>
                  <span className={styles.dvbValue}>{card.channels?.used}/{card.channels?.total}</span>
                </span>
                <span className={`${styles.dvbStat} ${getTempClass(card.temperature)}`}>
                  <span className={styles.dvbLabel}>温度</span>
                  <span className={styles.dvbValue}>{card.temperature}°C</span>
                </span>
                <span className={`${styles.dvbStat} ${getLevelClass(card.level)}`}>
                  <span className={styles.dvbLabel}>电平</span>
                  <span className={styles.dvbValue}>{card.level}dBm</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
