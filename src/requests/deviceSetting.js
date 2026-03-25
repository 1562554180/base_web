import uri from 'utils/uri';
import request, { requestWithCallBack } from 'utils/request';
import { getConfigEip } from 'common/utils';

const mock = false;
const baseUri = {
  m: uri.component('dev', 'app_setting'),
  restfulApi: false,
  mock,
};

const baseUriOne = {
  m: uri.component('system', 'system_core_conf'),
  restfulApi: false,
  mock,
}

const devStatsUri = {
  m: uri.component('dev', 'stats'),
  restfulApi: false,
  mock,
}

export async function $ (params) {
  const op = '$'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function newDeviceRestart (params, cb) {
  const op = 'new_device_restart'
  return requestWithCallBack({
    url: uri.ops({ op, ...devStatsUri }),
    method: 'post',
    body: params,
  }, null, cb)
}

export async function list (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  })
}

export async function create (params) {
  const op = 'create'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  })
}

export async function createDataCenter(params) {
  return request({
    url: uri.ops({ op: 'create_data_center', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function dataCenter(params) {
  return request({
    url: uri.ops({ op: 'data_center', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function metadataPreserve(params) {
  return request({
    url: uri.ops({ op: 'get_metadata_preserve', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function createMetadataPreserve(params) {
  return request({
    url: uri.ops({ op: 'create_metadata_preserve', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function clearAllEsData(params) {
  return request({
    url: uri.ops({ op: 'clear_all_es_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getSystemConfig(params) {
  return request({
    url: uri.ops({ op: 'get_core_config_structure', ...baseUriOne }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  });
}

export async function setSystemConfig(params) {
  return request({
    url: uri.ops({ op: 'set_conf', ...baseUriOne }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  });
}

export async function setLocalSystemConfig(params) {
  return request({
    url: uri.ops({ op: 'set_data_analysis_conf', ...baseUriOne }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  });
}
