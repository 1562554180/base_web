import request from 'utils/request';
import uri from 'utils/uri';

const mock = false;
const baseUri = {
  m: uri.component('/ncas/nca_dev'),
  restfulApi: false,
  mock,
};

export async function list (params) {
  const op = 'dev_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function nca (params) {
  const op = 'realtime'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function history (params) {
  const op = 'history'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

const baseUriAdd = {
  m: uri.component('nodes'),
  restfulApi: false,
  mock,
};

export async function getIpListRightData (params) {
  return request({
    url: uri.ops({ op: 'list', ...baseUriAdd }),
    method: 'post',
     body: params,
  });
}

export async function getNcaList (params) {
  const op = 'dev_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getSelectedIpLLData (params) {
  const op = 'LLlist'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function trafficHistory (params) {
  const op = 'traffic_history'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getMessageChart (params) {
  const op = 'MessageChart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function realtimeDevData (params) {
  const op = 'realtime_dev_data'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getDevInfo (params) {
  const op = 'get_dev_info'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setOutputConfig(params) {
  return request({
    url: uri.ops({ op: 'set_output_config', ...baseUri }),
    method: 'post',
    body: params,
  });
} 

export async function setDevInfo(params) {
  return request({
    url: uri.ops({ op: 'set_dev_info', ...baseUri }),
    method: 'post',
    body: params,
  });
} 





