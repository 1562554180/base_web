import React from 'react';
import styles from './SystemResource.less';

const COMPONENT_ORDER = [
  '入向组链路', '出向组链路', '授权控制', 'AD采集',
  '中间件', '控制中台', '数据输出', 'DVB采集'
];

const NAME_MAP = {
  '入向组链路处理': '入向组链路',
  '出向组链路处理': '出向组链路',
  '授权控制': '授权控制',
  'AD数据采集': 'AD采集',
  '中间件': '中间件',
  '控制中台': '控制中台',
  '数据输出管理': '数据输出',
  'DVB数据采集': 'DVB采集'
};

function getCpuUsageClass(value) {
  if (value >= 80) return styles['value-error'];
  if (value >= 60) return styles['value-warning'];
  return styles['value-good'];
}

function getCpuProgressClass(value) {
  if (value >= 80) return styles['high'];
  if (value >= 60) return styles['medium'];
  return styles['low'];
}

function getMemPercentage(usedGB) {
  return Math.round(usedGB / 256 * 100);
}

function getMemUsageClass(value) {
  const percent = getMemPercentage(value);
  if (percent >= 90) return styles['value-error'];
  if (percent >= 75) return styles['value-warning'];
  return styles['value-normal'];
}

function getMemProgressClass(value) {
  if (value >= 90) return styles['high'];
  if (value >= 75) return styles['medium'];
  return styles['low'];
}

export default function SystemResource({ data, cpuModules }) {
  const cpuData = React.useMemo(() => {
    if (!cpuModules || cpuModules.length === 0) {
      return {
        totalCores: data?.cpu?.totalCores ?? 0,
        systemUsage: data?.cpu?.systemUsage ?? 0
      };
    }

    const totalCores = cpuModules.reduce((sum, mod) => sum + mod.totalCores, 0);
    const totalWeight = cpuModules.reduce(
      (sum, mod) => sum + mod.systemUsage * mod.totalCores,
      0
    );
    const systemUsage = totalCores > 0 ? Math.round(totalWeight / totalCores) : 0;

    return { totalCores, systemUsage };
  }, [data, cpuModules]);

  const mergedComponents = React.useMemo(() => {
    const memComponents = data?.components || [];

    const list = memComponents.map((mem) => {
      const cpuMod = cpuModules?.find(
        (mod) => NAME_MAP[mod.title] === mem.name
      );
      return {
        name: mem.name,
        cpuUsage: cpuMod ? cpuMod.systemUsage : 0,
        memoryGB: mem.memoryGB
      };
    });

    return list.sort(
      (a, b) => COMPONENT_ORDER.indexOf(a.name) - COMPONENT_ORDER.indexOf(b.name)
    );
  }, [data, cpuModules]);

  const memTotalGB = data?.memory?.totalGB ?? 0;
  const memSystemUsage = data?.memory?.systemUsage ?? 0;
  const memPercentage = getMemPercentage(memSystemUsage);

  return (
    <section className={styles['module-section']}>
      <div className={styles['module-header']}>系统资源</div>
      <div className={styles['module-content']}>
        {/* 总体概览：CPU + 内存 */}
        <div className={styles['resource-overview']}>
          <div className={styles['overview-block']}>
            <div className={styles['overview-header']}>
              <span className={`${styles['overview-icon']} ${styles['cpu-icon']}`}>
                CPU
              </span>
              <span className={styles['overview-stat']}>
                <span className={styles['overview-label']}>总核数</span>
                <span className={styles['overview-value']}>
                  {cpuData.totalCores}
                </span>
              </span>
            </div>
            <div className={styles['overview-detail']}>
              <span className={styles['overview-label']}>总占用</span>
              <span
                className={`${styles['overview-value']} ${getCpuUsageClass(
                  cpuData.systemUsage
                )}`}
              >
                {cpuData.systemUsage}%
              </span>
              <span className={styles['progress-bar']}>
                <span
                  className={`${styles['progress-bar-fill']} ${getCpuProgressClass(
                    cpuData.systemUsage
                  )}`}
                  style={{ width: `${cpuData.systemUsage}%` }}
                />
              </span>
            </div>
          </div>

          <div className={styles['overview-divider']} />

          <div className={styles['overview-block']}>
            <div className={styles['overview-header']}>
              <span className={`${styles['overview-icon']} ${styles['mem-icon']}`}>
                MEM
              </span>
              <span className={styles['overview-stat']}>
                <span className={styles['overview-label']}>总量</span>
                <span className={styles['overview-value']}>
                  {memTotalGB} GB
                </span>
              </span>
            </div>
            <div className={styles['overview-detail']}>
              <span className={styles['overview-label']}>占用</span>
              <span
                className={`${styles['overview-value']} ${getMemUsageClass(
                  memSystemUsage
                )}`}
              >
                {memSystemUsage} GB
              </span>
              <span className={styles['progress-bar']}>
                <span
                  className={`${styles['progress-bar-fill']} ${getMemProgressClass(
                    memPercentage
                  )}`}
                  style={{ width: `${memPercentage}%` }}
                />
              </span>
              <span className={styles['overview-percent']}>
                ({memPercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* 8个组件资源网格 */}
        <div className={styles['resource-grid']}>
          {mergedComponents.map((comp, index) => {
            const compMemPercent = getMemPercentage(comp.memoryGB);
            return (
              <div key={index} className={styles['resource-cell']}>
                <div className={styles['cell-name']}>{comp.name}</div>
                <div className={styles['cell-metrics']}>
                  <div className={styles['cell-metric']}>
                    <span className={styles['metric-label']}>CPU</span>
                    <span className={styles['metric-bar-track']}>
                      <span
                        className={`${styles['metric-bar-fill']} ${styles['cpu-fill']} ${getCpuProgressClass(
                          comp.cpuUsage
                        )}`}
                        style={{ width: `${comp.cpuUsage}%` }}
                      />
                    </span>
                    <span
                      className={`${styles['metric-value']} ${getCpuUsageClass(
                        comp.cpuUsage
                      )}`}
                    >
                      {comp.cpuUsage}%
                    </span>
                  </div>
                  <div className={styles['cell-metric']}>
                    <span className={styles['metric-label']}>MEM</span>
                    <span className={styles['metric-bar-track']}>
                      <span
                        className={`${styles['metric-bar-fill']} ${styles['mem-fill']} ${getMemProgressClass(
                          compMemPercent
                        )}`}
                        style={{ width: `${compMemPercent}%` }}
                      />
                    </span>
                    <span className={styles['metric-value']}>
                      {comp.memoryGB} GB
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
