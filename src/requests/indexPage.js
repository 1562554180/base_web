import request,{ requestWithCallBack } from 'utils/request';
import uri from 'utils/uri';

const mock = false;
const baseUri = {
  m: uri.component('index'),
  // m: uri.component('system_setting', 'frequency_converter_cfg'),
  restfulApi: false,
  mock,
};
const baseFileUri = {
  m: uri.component('set_config'),
  // m: uri.component('system_setting', 'frequency_converter_cfg'),
  restfulApi: false,
  mock,
};

export async function $ (params) {
  const op = '$'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function init (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}


export async function list (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function updateId (params) {
  const op = 'set_config'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getProgressModalStatus (params) {
  const op = 'program_execution'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getStatusInfo (params) {
  const op = 'status_info'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export function uploadTargetParam () {
  const url = uri.ops({op:'upload_config_file',...baseFileUri});
  return url
}
