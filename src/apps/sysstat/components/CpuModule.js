import React from 'react';
import styles from './CpuModule.less';

const NUMA_MAX_COLORS = 8;

function getCpuId(index, cpuIds) {
  if (cpuIds) return cpuIds[index];
  return index;
}

function getUsageClass(value) {
  if (value >= 80) return 'value-error';
  if (value >= 60) return 'value-warning';
  return 'value-good';
}

function getBarClass(value) {
  if (value >= 80) return 'high';
  if (value >= 60) return 'medium';
  return 'low';
}

function getCoreClass(value) {
  if (value >= 80) return styles['core-high'];
  if (value >= 60) return styles['core-medium'];
  return styles['core-low'];
}

export default function CpuModule({ title, data }) {
  const numaGroups = React.useMemo(
    () => {
      if (!data.numa) return [];
      let offset = 0;
      return data.numa.map(count => {
        const group = {
          cores: data.cores.slice(offset, offset + count),
          ids: data.cpuIds
            ? data.cpuIds.slice(offset, offset + count)
            : Array.from({ length: count }, (_, i) => offset + i),
          count,
        };
        offset += count;
        return group;
      });
    },
    [data]
  );

  const gridColumns = data.totalCores > 64 ? 16 : 8;

  return (
    <section className={`module-section ${styles['cpu-module']}`}>
      <div className="module-header">
        <span className={styles['header-title']}>{title}</span>
        <span className={styles['header-meta']}>
          <span className="status-indicator">
            <span className={`status-dot ${data.status === 'normal' ? 'normal' : 'error'}`} />
          </span>
          <span className={styles['update-time']}>{data.lastUpdateTime}</span>
        </span>
      </div>

      <div className="module-content">
        <div className={styles['cpu-summary']}>
          <span className={styles['cpu-stat']}>
            核数 <strong>{data.totalCores}</strong>
          </span>
          <span className={styles['cpu-stat']}>
            占用
            <strong className={getUsageClass(data.systemUsage)}>{data.systemUsage}%</strong>
            <span className={styles['mini-bar']}>
              <span
                className={`${styles['mini-bar-fill']} ${getBarClass(data.systemUsage)}`}
                style={{ width: `${data.systemUsage}%` }}
              />
            </span>
          </span>
        </div>

        {!data.numa && (
          <div
            className={styles['core-grid']}
            style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
          >
            {data.cores.map((usage, i) => (
              <div
                key={i}
                className={`${styles['core-cell']} ${getCoreClass(usage)}`}
                title={`CPU ${getCpuId(i, data.cpuIds)}: ${usage}%`}
              >
                <span className={styles['core-id']}>{getCpuId(i, data.cpuIds)}</span>
                <span className={styles['core-val']}>{usage}%</span>
              </div>
            ))}
          </div>
        )}

        {data.numa && (
          <div className={styles['numa-layers']}>
            {numaGroups.map((group, gi) => (
              <div key={gi} className={styles['numa-layer']}>
                <div className={styles['numa-row']}>
                  {group.cores.map((usage, ci) => (
                    <div
                      key={ci}
                      className={`${styles['core-cell']} ${styles['numa-core']} ${getCoreClass(
                        usage
                      )} ${styles[`numa-accent-${gi % NUMA_MAX_COLORS}`]}`}
                      title={`CPU ${group.ids[ci]} (NUMA ${gi}): ${usage}%`}
                    >
                      <span className={`${styles['core-id']} ${styles['numa-id']}`}>
                        {group.ids[ci]}
                      </span>
                      <span className={styles['core-val']}>{usage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
