import React from 'react';
import styles from './AdCard.less';

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

export default function AdCard({ data }) {
  return (
    <section className="module-section">
      <div className="module-header">AD板卡 ({data?.count} 块)</div>
      <div className="module-content">
        <div className={styles.adCardList}>
          {(data?.items || []).map((card, index) => (
            <div key={index} className={styles.adCardItem}>
              <div className={styles.adCardTitle}>
                AD-
                {card.id}
              </div>
              <div className={styles.adCardGrid}>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>版本</span>
                  <span className={styles.adValue}>{card.version}</span>
                </span>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>输入口</span>
                  <span className={styles.adValue}>{card.inputPorts}口</span>
                </span>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>DNA</span>
                  <span className={`${styles.adValue} ${styles.mono}`}>{card.dna}</span>
                </span>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>通道</span>
                  <span className={styles.adValue}>
                    {card.channels?.used}/{card.channels?.total}
                  </span>
                </span>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>符号率</span>
                  <span className={styles.adValue}>
                    {card.symbolRate?.used}/{card.symbolRate?.total}
                  </span>
                </span>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>数据</span>
                  <span className="status-indicator">
                    <span className={`status-dot ${styles[card.dataStatus]}`} />
                  </span>
                </span>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>菊花链</span>
                  <span className="status-indicator">
                    <span
                      className={`status-dot ${
                        card.daisyChain === 'synchronized' ? 'normal' : 'warning'
                      }`}
                    />
                  </span>
                </span>
                <span className={styles.adStat}>
                  <span className={styles.adLabel}>戳丢失</span>
                  <span className="status-indicator">
                    <span className={`status-dot ${card.sampleStampLoss ? 'error' : 'normal'}`} />
                  </span>
                </span>
                <span className={`${styles.adStat} ${getTempClass(card.temperature)}`}>
                  <span className={styles.adLabel}>温度</span>
                  <span className={styles.adValue}>
                    {card.temperature}
                    °C
                  </span>
                </span>
                <span className={`${styles.adStat} ${getLevelClass(card.level)}`}>
                  <span className={styles.adLabel}>电平</span>
                  <span className={styles.adValue}>
                    {card.level}
                    dBm
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
