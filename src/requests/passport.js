import request from 'utils/request';
import uri from 'utils/uri';

const m = 'passport';
const restfulApi = false;
const mock = false;

export async function login (params) {
  return request({
    url: uri.ops({ op: 'login', restfulApi, m, mock }),
    method: 'post',
    body: params,
  })
}

export async function logout () {
  return request({
    url: uri.ops({ op: 'logout', restfulApi, m, mock }),
    method: 'get',
  })
}

export async function changePassword (params) {
  return request({
    url: uri.ops({ op: 'pwd', restfulApi, m, mock }),
    method: 'post',
    body: params,
  })
}

export async function $ (params) {
  return request({
    url: uri.ops({ op: '$', restfulApi, m, mock }),
    method: 'get',
    body: params,
  })
}

export async function sync (params) {
  return request({
    url: uri.ops({ op: 'sync', restfulApi, m, mock }),
    method: 'get',
    body: params,
  })
}

export async function aboutSat (params) {
  return request({
    url: uri.ops({ op: 'list', restfulApi, m: 'nodes', mock }),
    method: 'get',
    body: params,
  })
}

export async function aboutMevil (params) {
  return request({
    url: uri.ops({ op: 'about', restfulApi, m: '/dev/stats', mock }),
    method: 'get',
    body: params,
  })
}

export function manualUrl () {
  return uri.ops({op: 'download', restfulApi, m: uri.component('dev','stats'), mock})
}

export function manualSdkUrl () {
  return uri.ops({op: 'download_sdk', restfulApi, m: uri.component('dev','stats'), mock})
}
