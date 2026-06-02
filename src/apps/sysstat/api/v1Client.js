const BASE_URL = '/api/v1'

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Request failed')
  }
  return result.data
}

export function getSystemStatus() {
  return request('/system/status')
}

export function getCpuModules() {
  return request('/system/cpu-modules')
}

export function getHardwareTopology() {
  return request('/hardware/topology')
}

export function getHardwarePorts() {
  return request('/hardware/ports')
}

export function getHardwareCards() {
  return request('/hardware/cards')
}
