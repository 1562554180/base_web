import uri from 'utils/uri';
import request, { requestWithCallBack } from 'utils/request';

const mock = false;
const baseUri = {
  m: uri.component('dev','op_log'),
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

export async function list (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function del (params) {
  const op = 'del'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}


export async function vsatDeviceLog (params) {
  const op = 'vsat_device_log'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export function exportLogFile (params) {
  const url = uri.ops({op: 'export_sys_logs', ...baseUri, ...params});
  return url
}

export function getAboutInfo (params, cb) {
  const op = 'about'
  return requestWithCallBack({
    url: uri.ops({ op, m: '/dev/stats'}),
    method: 'get',
    params,
  }, null, cb)

}