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
    <section className={styles['topologySection']}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="module-header">
        <span>系统拓扑图</span>
        <div className={styles['viewToggle']}>
          <button
            style={{ padding: '2px 10px' }}
            className={`${styles['viewBtn']} ${
              viewMode === 'table' ? styles['viewBtnActive'] : ''
            }`}
            onClick={() => switchView('table')}
          >
            表格
          </button>
          <button
            style={{ padding: '2px 10px' }}
            className={`${styles['viewBtn']} ${viewMode === 'rack' ? styles['viewBtnActive'] : ''}`}
            onClick={() => switchView('rack')}
          >
            图形
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }} className="module-content">
        {viewMode === 'table' && (
          <div className="table-scroll">
            <table className={styles['chainTable']} aria-label="信号链路拓扑">
              <thead>
                <tr>
                  <th className={styles['colIdx']}>#</th>
                  <th className={styles['colSrc']}>射频口</th>
                  {hasMatrix && (
                    <>
                      <th className={styles['colArrow']} />
                      <th className={styles['colMatrix']}>矩阵</th>
                    </>
                  )}
                  {hasConverter && (
                    <>
                      <th className={styles['colArrow']} />
                      <th className={styles['colConv']}>变频器</th>
                    </>
                  )}
                  <th className={styles['colArrow']} />
                  <th className={styles['colOut']}>输出端口</th>
                  <th className={styles['colStatus']} />
                </tr>
              </thead>
              <tbody>
                {signalChains.map((chain, idx) => (
                  <tr key={idx} className={!chain.active ? styles['chainInactive'] : undefined}>
                    <td className={styles['colIdx']}>{idx + 1}</td>
                    <td className={styles['colSrc']}>
                      {chain.rf !== null ? (
                        <span className={`${styles['nodeTag']} ${styles['rfTag']}`}>
                          <span>
                            RF-
                            {chain.rf}
                          </span>
                          <span className={styles['tagDetail']}>{getRfLevel(chain.rf)}</span>
                        </span>
                      ) : (
                        <span className={styles['emptyTag']}>--</span>
                      )}
                    </td>
                    {hasMatrix && (
                      <>
                        <td className={styles['colArrow']}>
                          {chain.rf !== null && <span className={styles['arrowSep']}>&#8594;</span>}
                        </td>
                        <td className={styles['colMatrix']}>
                          {chain.matrix ? (
                            <span className={`${styles['nodeTag']} ${styles['matrixTag']}`}>
                              <span>{chain.matrix.id}</span>
                              <span className={styles['tagDetail']}>
                                IN
                                {chain.matrixInPort}
                                &#8594;OUT
                                {chain.matrixOutPort}
                              </span>
                            </span>
                          ) : (
                            <span className={styles['emptyTag']}>--</span>
                          )}
                        </td>
                      </>
                    )}
                    {hasConverter && (
                      <>
                        <td className={styles['colArrow']}>
                          {(hasMatrix ? chain.matrix : chain.rf !== null) && (
                            <span className={styles['arrowSep']}>&#8594;</span>
                          )}
                        </td>
                        <td className={styles['colConv']}>
                          {chain.converter !== null ? (
                            <span className={`${styles['nodeTag']} ${styles['convTag']}`}>
                              <span>
                                CV-
                                {chain.converter}
                              </span>
                              <span className={styles['tagDetail']}>
                                {getConvFreq(chain.converter) ?? '--'}
                              </span>
                            </span>
                          ) : (
                            <span className={styles['emptyTag']}>--</span>
                          )}
                        </td>
                      </>
                    )}
                    <td className={styles['colArrow']}>
                      {chain.active && <span className={styles['arrowSep']}>&#8594;</span>}
                    </td>
                    <td className={styles['colOut']}>
                      {chain.output ? (
                        <span
                          className={`${styles['nodeTag']} ${
                            chain.outType === 'AD' ? styles['adTag'] : styles['dvbTag']
                          }`}
                        >
                          <span>{chain.output}</span>
                          {chain.inputPort != null && (
                            <span className={styles['tagDetail']}>
                              IN
                              {chain.inputPort}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className={styles['emptyTag']}>--</span>
                      )}
                    </td>
                    <td className={styles['colStatus']}>
                      <span
                        className={`status-dot ${chain.active ? 'active' : 'empty'}`}
                        title={chain.active ? '已连接' : '未连接'}
                      />
                    </td>
                  </tr>
                ))}
                {signalChains.length === 0 && (
                  <tr>
                    <td colSpan={colSpanEmpty} className={styles['emptyRow']}>
                      暂无信号链路数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'rack' && (
          <div className={styles['mermaidWrapper']}>
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
          <div className={styles['topologyLegend']}>
            <span className={styles['legendItem']}>
              <span className={styles['legendColor']} style={{ background: 'var(--device-rf)' }} />{' '}
              射频
            </span>
            {hasMatrix && (
              <span className={styles['legendItem']}>
                <span
                  className={styles['legendColor']}
                  style={{ background: 'var(--device-matrix)' }}
                />{' '}
                矩阵
              </span>
            )}
            {hasConverter && (
              <span className={styles['legendItem']}>
                <span
                  className={styles['legendColor']}
                  style={{ background: 'var(--device-converter)' }}
                />{' '}
                变频器
              </span>
            )}
            <span className={styles['legendItem']}>
              <span className={styles['legendColor']} style={{ background: 'var(--device-ad)' }} />{' '}
              AD
            </span>
            <span className={styles['legendItem']}>
              <span className={styles['legendColor']} style={{ background: 'var(--device-dvb)' }} />{' '}
              DVB
            </span>
            <span className={styles['legendItem']}>
              <span className={`status-dot ${styles['legendDot']} normal`} /> 已连接
            </span>
            <span className={styles['legendItem']}>
              <span className={`status-dot ${styles['legendDot']} offline`} /> 未连接
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
