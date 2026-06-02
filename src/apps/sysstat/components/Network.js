import React from 'react';
import styles from './Network.less';

function formatBitrate(bps) {
  if (bps >= 1e9) return (bps / 1e9).toFixed(2) + ' Gbps';
  if (bps >= 1e6) return (bps / 1e6).toFixed(2) + ' Mbps';
  if (bps >= 1e3) return (bps / 1e3).toFixed(2) + ' kbps';
  return bps + ' bps';
}

function formatTraffic(value) {
  if (value == null || value === '') return '--';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return formatBitrate(num);
}

export default function Network({ data }) {
  const interfaces = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.interfaces)) {
      return data.interfaces;
    }
    if (data.dual && Array.isArray(data.dual.interfaces)) {
      return data.dual.interfaces;
    }
    return [];
  }, [data]);

  return (
    <section className={`module-section ${styles.networkSection}`}>
      <div className="module-header">
        <span>网络</span>
      </div>
      <div className={`module-content ${styles.networkContent}`}>
        {interfaces.map((iface, index) => (
          <div key={index}>
            <table className="data-table">
              <tbody>
                <tr>
                  <th>网卡名称</th>
                  <td>
                    <span className={styles.statusIndicator}>
                      <span className={`${styles.statusDot} ${styles[iface.status]}`}></span>
                      {iface.name}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>IP地址</th>
                  <td>{iface.ip || '--'}</td>
                </tr>
                <tr>
                  <th>MAC地址</th>
                  <td><span style={{ fontFamily: 'var(--font-mono)' }}>{iface.mac}</span></td>
                </tr>
                <tr>
                  <th>子网掩码</th>
                  <td>{iface.netmask || '--'}</td>
                </tr>
                <tr>
                  <th>默认网关</th>
                  <td>{iface.gateway || '--'}</td>
                </tr>
                <tr>
                  <th>流量状态</th>
                  <td>
                    <span className="value-normal">
                      RX: {formatTraffic(iface.traffic?.rx)} / TX: {formatTraffic(iface.traffic?.tx)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            {index < interfaces.length - 1 && (
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
