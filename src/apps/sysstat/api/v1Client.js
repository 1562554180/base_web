const BASE_URL = '/api/v1';

async function request(path) {
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
