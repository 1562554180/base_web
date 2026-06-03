import React from 'react';
import styles from './TopologyGraph.less';
import TopologyGV from './TopologyGV';

export default function TopologyGraph({ data, onViewModeChange }) {
  const [viewMode, setViewMode] = React.useState('table');

  const rfPorts = React.useMemo(() => data?.rfPorts?.connections || [], [data]);
  const matrixItems = React.useMemo(() => data?.matrix?.items || [], [data]);
  const converters = React.useMemo(() => data?.converters || [], [data]);
  const dvbCards = React.useMemo(() => data?.dvbCards || [], [data]);
  const adCards = React.useMemo(() => data?.adCards || [], [data]);

  const signalChains = React.useMemo(
    () => {
      if (data?.chains && data.chains.length > 0) {
        return data.chains.map(c => ({
          rf: c.rf,
          matrix: c.matrix ? matrixItems.find(m => m.deviceId === c.matrix.id) : null,
          matrixInPort: c.matrix?.inPort ?? null,
          matrixOutPort: c.matrix?.outPort ?? null,
          dvb: c.output?.type === 'DVB' ? c.output.id : null,
          converter: c.converter,
          output: c.output ? `${c.output.type}-${c.output.id}` : null,
          outType: c.output?.type ?? null,
          inputPort: c.output?.inPort ?? null,
          active: c.active,
        }));
      }

      const chains = [];

      matrixItems.forEach(mx => {
        mx.internalConnections?.forEach(({ input: inIdx, output: outIdx }) => {
          const srcConn = mx.inputConnections?.[inIdx];
          const outConn = mx.outputConnections?.[outIdx];

          let rfIdx = null;
          if (srcConn && srcConn.startsWith('RF-')) {
            rfIdx = parseInt(srcConn.split('-')[1], 10);
          }

          let output = outConn || null;
          let outType = null;
          let convIdx = null;
          let dvbIdx = null;

          if (output) {
            if (output.startsWith('AD-')) {
              outType = 'AD';
              const adIdx = parseInt(output.split('-')[1], 10);
              convIdx = adIdx < converters.length ? adIdx : null;
            } else if (output.startsWith('DVB-')) {
              outType = 'DVB';
              dvbIdx = parseInt(output.split('-')[1], 10);
            }
          }

          const inputPort = mx.outputPortMap ? mx.outputPortMap[outIdx] ?? outIdx : outIdx;

          const active = srcConn != null && outConn != null;

          chains.push({
            rf: rfIdx,
            matrix: mx,
            matrixInPort: inIdx,
            matrixOutPort: outIdx,
            dvb: dvbIdx,
            converter: convIdx,
            output,
            outType,
            inputPort,
            active,
          });
        });
      });

      rfPorts.forEach((rf, rfIdx) => {
        if (rf.connectedTo && !rf.connectedTo.startsWith('MX-')) {
          const already = chains.some(c => c.rf === rfIdx);
          if (!already) {
            let outType = null;
            let output = null;
            let dvbIdx = null;
            let convIdx = null;
            let inputPort = null;
            const parts = rf.connectedTo.split('-');
            const inMatch = rf.connectedTo.match(/IN-(\d+)/);
            if (inMatch) inputPort = parseInt(inMatch[1], 10);
            if (rf.connectedTo.startsWith('DVB')) {
              outType = 'DVB';
              dvbIdx = parseInt(parts[1], 10);
              dvbIdx = Number.isNaN(dvbIdx) ? null : dvbIdx;
              output = dvbIdx != null ? 'DVB-' + dvbIdx : null;
            } else if (rf.connectedTo.startsWith('AD')) {
              outType = 'AD';
              const adIdx = parseInt(parts[1], 10);
              const adIdxValid = Number.isNaN(adIdx) ? null : adIdx;
              output = adIdxValid != null ? 'AD-' + adIdxValid : null;
              convIdx = adIdxValid;
            }
            chains.push({
              rf: rfIdx,
              matrix: null,
              matrixInPort: null,
              matrixOutPort: null,
              dvb: dvbIdx,
              converter: convIdx,
              output,
              outType,
              inputPort,
              active: rf.level !== null,
            });
          }
        }
      });

      chains.sort((a, b) => (a.rf ?? 99) - (b.rf ?? 99));
      return chains;
    },
    [data, matrixItems, rfPorts, converters]
  );

  const getRfLevel = React.useCallback(
    rfIdx => {
      const level = rfPorts[rfIdx]?.level;
      return level != null ? level + 'dBm' : '--';
    },
    [rfPorts]
  );

  const getConvFreq = React.useCallback(
    cvIdx => {
      const freq = converters[cvIdx]?.centerLfFreq;
      if (freq == null) return null;
      return (freq / 1e3).toFixed(0) + 'MHz';
    },
    [converters]
  );

  const hasMatrix = React.useMemo(() => signalChains.some(c => c.matrix !== null), [signalChains]);

  const hasConverter = React.useMemo(() => signalChains.some(c => c.converter !== null), [
    signalChains,
  ]);

  function switchView(mode) {
    setViewMode(mode);
    if (typeof onViewModeChange === 'function') {
      onViewModeChange(mode);
    }
  }

  const colSpanEmpty = 5 + (hasMatrix ? 2 : 0) + (hasConverter ? 2 : 0);

  return (
    <section className={styles['topology-section']}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between' }}
        className="module-header"
      >
        <span>系统拓扑图</span>
        <div className={styles['view-toggle']}>
          <button
            style={{ padding: '2px 10px' }}
            className={`${styles['view-btn']} ${viewMode === 'table' ? styles['active'] : ''}`}
            onClick={() => switchView('table')}
          >
            表格
          </button>
          <button
            style={{ padding: '2px 10px' }}
            className={`${styles['view-btn']} ${viewMode === 'rack' ? styles['active'] : ''}`}
            onClick={() => switchView('rack')}
          >
            图形
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }} className="module-content">
        {viewMode === 'table' && (
          <div className="table-scroll">
            <table className={styles['chain-table']} aria-label="信号链路拓扑">
              <thead>
                <tr>
                  <th className={styles['col-idx']}>#</th>
                  <th className={styles['col-src']}>射频口</th>
                  {hasMatrix && (
                    <>
                      <th className={styles['col-arrow']} />
                      <th className={styles['col-matrix']}>矩阵</th>
                    </>
                  )}
                  {hasConverter && (
                    <>
                      <th className={styles['col-arrow']} />
                      <th className={styles['col-conv']}>变频器</th>
                    </>
                  )}
                  <th className={styles['col-arrow']} />
                  <th className={styles['col-out']}>输出端口</th>
                  <th className={styles['col-status']} />
                </tr>
              </thead>
              <tbody>
                {signalChains.map((chain, idx) => (
                  <tr key={idx} className={!chain.active ? styles['chain-inactive'] : undefined}>
                    <td className={styles['col-idx']}>{idx + 1}</td>
                    <td className={styles['col-src']}>
                      {chain.rf !== null ? (
                        <span className={`${styles['node-tag']} ${styles['rf-tag']}`}>
                          <span>
                            RF-
                            {chain.rf}
                          </span>
                          <span className={styles['tag-detail']}>{getRfLevel(chain.rf)}</span>
                        </span>
                      ) : (
                        <span className={styles['empty-tag']}>--</span>
                      )}
                    </td>
                    {hasMatrix && (
                      <>
                        <td className={styles['col-arrow']}>
                          {chain.rf !== null && (
                            <span className={styles['arrow-sep']}>&#8594;</span>
                          )}
                        </td>
                        <td className={styles['col-matrix']}>
                          {chain.matrix ? (
                            <span className={`${styles['node-tag']} ${styles['matrix-tag']}`}>
                              <span>{chain.matrix.id}</span>
                              <span className={styles['tag-detail']}>
                                IN
                                {chain.matrixInPort}
                                &#8594;OUT
                                {chain.matrixOutPort}
                              </span>
                            </span>
                          ) : (
                            <span className={styles['empty-tag']}>--</span>
                          )}
                        </td>
                      </>
                    )}
                    {hasConverter && (
                      <>
                        <td className={styles['col-arrow']}>
                          {(hasMatrix ? chain.matrix : chain.rf !== null) && (
                            <span className={styles['arrow-sep']}>&#8594;</span>
                          )}
                        </td>
                        <td className={styles['col-conv']}>
                          {chain.converter !== null ? (
                            <span className={`${styles['node-tag']} ${styles['conv-tag']}`}>
                              <span>
                                CV-
                                {chain.converter}
                              </span>
                              <span className={styles['tag-detail']}>
                                {getConvFreq(chain.converter) ?? '--'}
                              </span>
                            </span>
                          ) : (
                            <span className={styles['empty-tag']}>--</span>
                          )}
                        </td>
                      </>
                    )}
                    <td className={styles['col-arrow']}>
                      {chain.active && <span className={styles['arrow-sep']}>&#8594;</span>}
                    </td>
                    <td className={styles['col-out']}>
                      {chain.output ? (
                        <span
                          className={`${styles['node-tag']} ${
                            chain.outType === 'AD' ? styles['ad-tag'] : styles['dvb-tag']
                          }`}
                        >
                          <span>{chain.output}</span>
                          {chain.inputPort != null && (
                            <span className={styles['tag-detail']}>
                              IN
                              {chain.inputPort}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className={styles['empty-tag']}>--</span>
                      )}
                    </td>
                    <td className={styles['col-status']}>
                      <span
                        className={`status-dot ${chain.active ? 'normal' : 'offline'}`}
                        title={chain.active ? '已连接' : '未连接'}
                      />
                    </td>
                  </tr>
                ))}
                {signalChains.length === 0 && (
                  <tr>
                    <td colSpan={colSpanEmpty} className={styles['empty-row']}>
                      暂无信号链路数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'rack' && (
          <div className={styles['mermaid-wrapper']}>
            <TopologyGV
              chains={signalChains}
              rfPorts={rfPorts}
              matrixItems={matrixItems}
              converters={converters}
              dvbCards={dvbCards}
              adCards={adCards}
            />
          </div>
        )}

        {viewMode === 'table' && (
          <div className={styles['topology-legend']}>
            <span className={styles['legend-item']}>
              <span className={styles['legend-color']} style={{ background: 'var(--device-rf)' }} />{' '}
              射频
            </span>
            {hasMatrix && (
              <span className={styles['legend-item']}>
                <span
                  className={styles['legend-color']}
                  style={{ background: 'var(--device-matrix)' }}
                />{' '}
                矩阵
              </span>
            )}
            {hasConverter && (
              <span className={styles['legend-item']}>
                <span
                  className={styles['legend-color']}
                  style={{ background: 'var(--device-converter)' }}
                />{' '}
                变频器
              </span>
            )}
            <span className={styles['legend-item']}>
              <span className={styles['legend-color']} style={{ background: 'var(--device-ad)' }} />{' '}
              AD
            </span>
            <span className={styles['legend-item']}>
              <span
                className={styles['legend-color']}
                style={{ background: 'var(--device-dvb)' }}
              />{' '}
              DVB
            </span>
            <span className={styles['legend-item']}>
              <span className={`status-dot ${styles['legend-dot']} ${styles['active']}`} /> 已连接
            </span>
            <span className={styles['legend-item']}>
              <span className={`status-dot ${styles['legend-dot']} offline`} /> 未连接
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
