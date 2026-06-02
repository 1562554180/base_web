import React from 'react';
import styles from './DiskIO.less';

function getUsageClass(value) {
  if (value >= 95) return 'value-error';
  if (value >= 80) return 'value-warning';
  return 'value-good';
}

function formatIo(value) {
  if (value == null) return { value: '--', unit: '' };
  const num = typeof value === 'object' && value.value != null ? value.value : value;
  if (typeof num !== 'number' || isNaN(num)) return { value: String(num), unit: '' };
  if (num >= 1e9) return { value: (num / 1e9).toFixed(2), unit: 'GB/s' };
  if (num >= 1e6) return { value: (num / 1e6).toFixed(2), unit: 'MB/s' };
  if (num >= 1e3) return { value: (num / 1e3).toFixed(2), unit: 'KB/s' };
  return { value: num.toFixed(0), unit: 'B/s' };
}

export default function DiskIO({ data }) {
  const ioRead = React.useMemo(() => formatIo(data?.ioRate?.read), [data?.ioRate?.read]);
  const ioWrite = React.useMemo(() => formatIo(data?.ioRate?.write), [data?.ioRate?.write]);

  return (
    <section className={`module-section ${styles.diskSection}`}>
      <div className="module-header">磁盘IO</div>
      <div className={`module-content ${styles.diskContent}`}>
        <div className={styles.subCard}>
          <div className={styles.subHeader}>分区使用</div>
          <div className={styles.mountList}>
            {(data?.mounts || []).map((mount, index) => (
              <div key={index} className={styles.mountItem}>
                <span className={styles.mountName}>{mount.path}</span>
                <span className={styles.mountSize}>{mount.used} / {mount.total} GB</span>
                <span className={`${styles.mountPercent} ${getUsageClass(mount.usage)}`}>
                  {mount.usage?.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.subDivider}></div>

        <div className={styles.subCard}>
          <div className={styles.subHeader}>IO 速率</div>
          <div className={styles.ioMetrics}>
            <div className={styles.ioMetric}>
              <span className={styles.ioLabel}>
                <span className={`${styles.ioIcon} ${styles.readIcon}`}>R</span>
                读取
              </span>
              <span className={`${styles.ioValue} value-good`}>
                {ioRead.value}
                <span className={styles.ioUnit}>{ioRead.unit}</span>
              </span>
            </div>
            <div className={styles.ioMetric}>
              <span className={styles.ioLabel}>
                <span className={`${styles.ioIcon} ${styles.writeIcon}`}>W</span>
                写入
              </span>
              <span className={`${styles.ioValue} value-warning`}>
                {ioWrite.value}
                <span className={styles.ioUnit}>{ioWrite.unit}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
