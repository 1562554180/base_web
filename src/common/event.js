export function createEvent(name, data) {
  const evt = new CustomEvent(name, { detail: data || {} });
  if (window.dispatchEvent) {
    window.dispatchEvent(evt);
  } else {
    window.fireEvent(evt);
  }
}

let perviewConfigId = 0;
export function showPerviewConfig(data) {
  perviewConfigId += 1;
  createEvent('perviewConfig', {
    id: 'perview' + perviewConfigId,
    data,
  })
}

let outputConfigId = 0;
export function showOutputConfig(data) {
  outputConfigId += 1;
  createEvent('outputConfig', {
    id: 'output' + outputConfigId,
    data,
  })
}

let resetNetControlId = 0;
export function showResetNetControl(data) {
  resetNetControlId += 1;
  createEvent('resetNetControl', {
    id: 'resetNetControl' + resetNetControlId,
    data,
  })
}

let changeWkTypeId = 0;
export function setWkTypeByCustomEvent(data) {
  changeWkTypeId += 1;
  createEvent('changeWkValue', {
    id: 'changeWkValue' + changeWkTypeId,
    data,
  })
}

let saveConfigId = 0;
export function showSaveConfig(data) {
  saveConfigId += 1;
  createEvent('saveConfig', {
    id: 'saveConfig' + saveConfigId,
    data,
  })
}
