import request from 'utils/request';
import uri from 'utils/uri';

const mock = false;
const restfulApi = false;
const baseUri = {
  m: uri.component('set_config'),
  restfulApi: false,
  mock,
};
const machineBaseUri = {
  m: uri.component('dev', 'stats'),
  restfulApi: false,
  mock,
};


export async function $(m = null) {
  return request(uri.ops({ op: '$', m, restfulApi, mock }), {
    method: 'get',
  });
}

export async function setSoftReboot(params) {
  const op = 'set_soft_reboot'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function deviceRestart(params) {
  const op = 'device_restart'
  return request({
    url: uri.ops({ op, ...machineBaseUri }),
    method: 'post',
    body: params,
  })
}