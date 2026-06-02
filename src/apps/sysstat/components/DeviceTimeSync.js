import React from 'react';
import styles from './DeviceTimeSync.less';

const STATUS_MAP = {
  enabled: { dotClass: 'enabled', text: '已启用' },
  disabled: { dotClass: 'disabled', text: '未启用' },
  error: { dotClass: 'error', text: '异常' }
};

export default function DeviceTimeSync({ deviceData, timeSyncData }) {
  const syncItems = React.useMemo(() => [
    { key: 'pps', label: '1pps', ...STATUS_MAP[timeSyncData?.pps?.status ?? 'disabled'], error: timeSyncData?.pps?.error },
    { key: '10mhz', label: '10MHz', ...STATUS_MAP[timeSyncData?.clock10mhz?.status ?? 'disabled'], error: timeSyncData?.clock10mhz?.error },
    { key: 'ntp', label: 'NTP', ...STATUS_MAP[timeSyncData?.ntp?.status ?? 'disabled'], error: timeSyncData?.ntp?.error }
  ], [timeSyncData]);

  return (
    <section className={`module-section ${styles.deviceTimesyncSection}`}>
      <div className="module-header">设备信息</div>
      <div className={`module-content ${styles.deviceTimesyncContent}`}>
        <div className={styles.subCard}>
          <div className={styles.subHeader}>设备序列号</div>
          <table className={`data-table ${styles.denseTable}`}>
            <tbody>
              <tr>
                <th>SN号</th>
                <td>{deviceData?.sn}</td>
              </tr>
              <tr>
                <th>设备ID</th>
                <td>{deviceData?.deviceId}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.subDivider}></div>

        <div className={styles.subCard}>
          <div className={styles.subHeader}>时间同步</div>
          <table className={`data-table ${styles.denseTable}`}>
            <tbody>
              {syncItems.map(item => (
                <tr key={item.key}>
                  <th>{item.label}</th>
                  <td>
                    <span className={styles.statusIndicator}>
                      <span className={`${styles.statusDot} ${styles[item.dotClass]}`}></span>
                      {item.text}
                      {item.error && (
                        <span className={styles.errorBadge}>!
                          <span className={styles.errorTip}>{item.error}</span>
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <th>当前时间</th>
                <td className="value-normal" style={{ fontFamily: 'var(--font-mono)' }}>{timeSyncData?.currentTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
