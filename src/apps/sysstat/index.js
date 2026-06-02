import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  getSystemStatus,
  getCpuModules,
  getHardwareTopology,
  getHardwarePorts,
  getHardwareCards,
} from './api/v1Client';

import CpuModule from './components/CpuModule';
import DeviceTimeSync from './components/DeviceTimeSync';
import SystemResource from './components/SystemResource';
import Network from './components/Network';
import DiskIO from './components/DiskIO';
import TopologyGraph from './components/TopologyGraph';
import RfPort from './components/RfPort';
import Matrix from './components/Matrix';
import AdCard from './components/AdCard';
import DvbCard from './components/DvbCard';
import Converter from './components/Converter';

import './styles/industrial.css';
import styles from './index.less';

const STATUS_POLL_INTERVAL_MS = 3000;

export default function SysStat() {
  const [activeTab, setActiveTab] = useState('status');
  const [topoGraphMode, setTopoGraphMode] = useState('table');

  const [v1SystemStatus, setV1SystemStatus] = useState(null);
  const [v1CpuModules, setV1CpuModules] = useState(null);
  const [v1Topology, setV1Topology] = useState(null);
  const [v1Ports, setV1Ports] = useState(null);
  const [v1Cards, setV1Cards] = useState(null);

  const [topologyData, setTopologyData] = useState({
    chains: [],
    rfPorts: { count: 0, connections: [] },
    matrix: { count: 0, items: [] },
    converters: [],
    dvbCards: [],
    adCards: [],
  });
  const [topologyError, setTopologyError] = useState(null);

  const statusPollTimer = useRef(null);
  const cpuPollTimer = useRef(null);

  const currentCpuModules = useMemo(() => {
    return v1CpuModules?.modules || [];
  }, [v1CpuModules]);

  const systemStatusData = useMemo(() => {
    return v1SystemStatus || {};
  }, [v1SystemStatus]);

  const stopStatusPolling = useCallback(() => {
    if (statusPollTimer.current) {
      clearInterval(statusPollTimer.current);
      statusPollTimer.current = null;
    }
    if (cpuPollTimer.current) {
      clearInterval(cpuPollTimer.current);
      cpuPollTimer.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopStatusPolling();

    statusPollTimer.current = setInterval(() => {
      loadSystemStatus();
    }, STATUS_POLL_INTERVAL_MS);

    cpuPollTimer.current = setInterval(() => {
      loadCpuModules();
    }, STATUS_POLL_INTERVAL_MS);
  }, [stopStatusPolling]);

  const loadSystemStatus = useCallback(async () => {
    try {
      const data = await getSystemStatus();
      if (!data) return;
      setV1SystemStatus(data);
    } catch (err) {
      console.error('[V1] 系统状态加载失败:', err);
    }
  }, []);

  const loadCpuModules = useCallback(async () => {
    try {
      const data = await getCpuModules();
      if (!data) return;
      setV1CpuModules(data);
    } catch (err) {
      console.error('[V1] CPU 模块加载失败:', err);
    }
  }, []);

  const loadV1Topology = useCallback(async () => {
    setTopologyError(null);
    try {
      const data = await getHardwareTopology();
      if (!data) {
        setTopologyData({
          chains: [],
          rfPorts: { count: 0, connections: [] },
          matrix: { count: 0, items: [] },
          converters: [],
          dvbCards: [],
          adCards: [],
        });
        setTopologyError('拓扑数据加载失败');
        return false;
      }
      setV1Topology(data);
      const converters = (data.converters || []).map((conv) => ({
        id: conv.id,
        type: conv.type,
        device: conv.device,
        onlineStatus: conv.onlineStatus,
        freq: conv.freq,
        ifFreq: conv.ifMod != null ? conv.ifMod + 'MHz' : '—',
        centerLfFreq: conv.freq,
        gain: conv.outGain != null ? conv.outGain : 0,
      }));

      setTopologyData({
        chains: data.chains || [],
        rfPorts: data.rfPorts || { count: 0, connections: [] },
        matrix: data.matrix || { count: 0, items: [] },
        converters,
        dvbCards: data.dvbCards || [],
        adCards: data.adCards || [],
      });
      return true;
    } catch (err) {
      setTopologyData({
        chains: [],
        rfPorts: { count: 0, connections: [] },
        matrix: { count: 0, items: [] },
        converters: [],
        dvbCards: [],
        adCards: [],
      });
      setTopologyError(err.message);
      console.error('[V1] 拓扑加载失败:', err);
      return false;
    }
  }, []);

  const loadPorts = useCallback(async () => {
    try {
      const data = await getHardwarePorts();
      if (!data?.ports) return;
      setV1Ports(data);
      setTopologyData((prev) => {
        const updatedConnections = (prev.rfPorts?.connections || []).map((conn) => {
          const v1Port = data.ports.find((p) => p.portId === conn.port);
          return v1Port ? { ...conn, level: v1Port.level } : conn;
        });
        return {
          ...prev,
          rfPorts: {
            ...prev.rfPorts,
            connections: updatedConnections,
          },
        };
      });
    } catch (err) {
      console.error('[V1] 端口加载失败:', err);
    }
  }, []);

  const loadCards = useCallback(async () => {
    try {
      const data = await getHardwareCards();
      if (!data) return;
      setV1Cards(data);
      setTopologyData((prev) => {
        let next = { ...prev };
        if (data.adCards && prev.adCards) {
          const updatedAdCards = prev.adCards.map((card) => {
            const updated = data.adCards.find((c) => c.id === card.id);
            if (updated) {
              return {
                ...card,
                temperature: updated.temperature ?? card.temperature,
                level: updated.level ?? card.level,
                status: updated.status ?? card.status,
              };
            }
            return card;
          });
          next = { ...next, adCards: updatedAdCards };
        }
        if (data.dvbCards && prev.dvbCards) {
          const updatedDvbCards = prev.dvbCards.map((card) => {
            const updated = data.dvbCards.find((c) => c.id === card.id);
            if (updated) {
              return {
                ...card,
                temperature: updated.temperature ?? card.temperature,
                level: updated.level ?? card.level,
                status: updated.status ?? card.status,
              };
            }
            return card;
          });
          next = { ...next, dvbCards: updatedDvbCards };
        }
        return next;
      });
    } catch (err) {
      console.error('[V1] 板卡加载失败:', err);
    }
  }, []);

  const reloadStatusData = useCallback(async () => {
    stopStatusPolling();
    await loadSystemStatus();
    await loadCpuModules();
    if (activeTab === 'status') {
      startPolling();
    }
  }, [stopStatusPolling, loadSystemStatus, loadCpuModules, activeTab, startPolling]);

  const reloadTopologyData = useCallback(async () => {
    stopStatusPolling();
    const loaded = await loadV1Topology();
    if (!loaded) {
      return;
    }
    await loadPorts();
    await loadCards();
  }, [stopStatusPolling, loadV1Topology, loadPorts, loadCards]);

  useEffect(() => {
    if (activeTab === 'status') {
      reloadStatusData();
    } else if (activeTab === 'topology') {
      reloadTopologyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'status') {
      reloadStatusData();
    } else if (activeTab === 'topology') {
      stopStatusPolling();
      reloadTopologyData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    return () => {
      stopStatusPolling();
    };
  }, [stopStatusPolling]);

  return (
    <div className={`sysstat-page ${styles.statusPage}`}>
      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'status' ? styles.active : ''}`}
          onClick={() => setActiveTab('status')}
        >
          系统状态
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'topology' ? styles.active : ''}`}
          onClick={() => setActiveTab('topology')}
        >
          系统拓扑
        </button>
      </nav>

      <div className={styles.tabContent}>
        {activeTab === 'status' && (
          <div className={`${styles.tabPanel} ${styles.tabScrollable}`}>
            <div className={styles.scenarioBar}>
              <span className={styles.scenarioLabel}>状态:</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                {v1SystemStatus ? '已连接' : '加载中...'}
              </span>
              <button
                className={styles.scenarioBtn}
                onClick={reloadStatusData}
                title="刷新数据"
              >
                刷新
              </button>
            </div>

            <div className="grid-container">
              {currentCpuModules.map((mod) => (
                <CpuModule
                  key={mod.key}
                  title={mod.title}
                  data={{
                    totalCores: mod.totalCores,
                    systemUsage: mod.systemUsage,
                    cores: mod.cores,
                    numa: mod.numa,
                    cpuIds: mod.cpuIds,
                    status: mod.status,
                    lastUpdateTime: mod.lastUpdateTime,
                  }}
                  className={`grid-area-${mod.key}`}
                />
              ))}
              <DeviceTimeSync
                deviceData={systemStatusData.device || {}}
                timeSyncData={systemStatusData.timeSync || {}}
                className="grid-area-device-timesync"
              />
              <SystemResource
                data={systemStatusData.systemResource || {}}
                cpuModules={currentCpuModules}
                className="grid-area-memory"
              />
              <Network
                data={systemStatusData.network || {}}
                className="grid-area-network"
              />
              <DiskIO
                data={systemStatusData.disk || {}}
                className="grid-area-disk"
              />
            </div>
          </div>
        )}

        {activeTab === 'topology' && (
          <div className={styles.tabPanel}>
            <div className={styles.scenarioBar}>
              <span className={styles.scenarioLabel}>状态:</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                {topologyData.chains?.length > 0 ? '已连接' : '加载中...'}
              </span>
              <button
                className={styles.scenarioBtn}
                onClick={reloadTopologyData}
                title="刷新拓扑"
              >
                刷新
              </button>
            </div>
            {topologyError && (
              <div style={{ color: 'red', padding: '10px' }}>错误: {topologyError}</div>
            )}

            <div className={styles.topologyContainer}>
              <div
                className={`${styles.topologyGraphWrapper} ${
                  topoGraphMode === 'rack' ? styles.graphRack : ''
                }`}
              >
                <TopologyGraph
                  data={topologyData}
                  onViewModeChange={setTopoGraphMode}
                />
              </div>
              <div className={styles.topologyGrid}>
                {topologyData.rfPorts && (
                  <RfPort data={topologyData.rfPorts} className={styles.rfNarrow} />
                )}
                {topologyData.matrix?.count > 0 && (
                  <Matrix data={topologyData.matrix} />
                )}
                {topologyData.converters?.length > 0 && (
                  <Converter
                    data={{
                      count: topologyData.converters.length,
                      items: topologyData.converters,
                    }}
                  />
                )}
                {topologyData.adCards?.length > 0 && (
                  <AdCard
                    data={{
                      count: topologyData.adCards.length,
                      items: topologyData.adCards,
                    }}
                    className={styles.adSpan}
                  />
                )}
                {topologyData.dvbCards?.length > 0 && (
                  <DvbCard
                    data={{
                      count: topologyData.dvbCards.length,
                      items: topologyData.dvbCards,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
