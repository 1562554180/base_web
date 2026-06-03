import { mockData } from '../data/mockData';

const BASE_URL = '/api/v1';
const USE_MOCK = true; // 设置为 false 可切换到真实 API

// 模拟网络延迟
function mockDelay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(path) {
  // Mock 模式：直接返回模拟数据
  if (USE_MOCK) {
    await mockDelay();
    switch (path) {
      case '/system/status':
        return {
          device: mockData.device,
          network: mockData.networkScenarios,
          systemResource: mockData.systemResource,
          disk: mockData.disk,
          timeSync: mockData.timeSync,
        };
      case '/system/cpu-modules':
        // 默认返回 64 核场景，可切换为 scenario8 / scenario32 / scenario64 / scenario128 / scenario128x4
        return mockData.statusModules.scenario64;
      case '/hardware/topology':
        return {
          chains: [], // 前端会根据 matrix + rfPorts 计算
          rfPorts: mockData.rfPorts,
          matrix: mockData.matrix,
          converters: mockData.converters.items,
          dvbCards: mockData.dvbCards.items,
          adCards: mockData.adCards.items,
        };
      case '/hardware/ports':
        return {
          ports: mockData.rfPorts.connections.map(conn => ({
            portId: conn.port,
            level: conn.level,
          })),
        };
      case '/hardware/cards':
        return {
          adCards: mockData.adCards.items,
          dvbCards: mockData.dvbCards.items,
        };
      default:
        throw new Error(`Unknown mock endpoint: ${path}`);
    }
  }

  // 真实 API 模式
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`);
  } catch (networkErr) {
    throw new Error(`Network error: ${networkErr.message}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  let result;
  try {
    result = await response.json();
  } catch (parseErr) {
    throw new Error(`Invalid JSON response: ${parseErr.message}`);
  }

  if (!result.success) {
    throw new Error(result.error || 'Request failed');
  }
  return result.data;
}

export function getSystemStatus() {
  return request('/system/status');
}

export function getCpuModules() {
  return request('/system/cpu-modules');
}

export function getHardwareTopology() {
  return request('/hardware/topology');
}

export function getHardwarePorts() {
  return request('/hardware/ports');
}

export function getHardwareCards() {
  return request('/hardware/cards');
}
