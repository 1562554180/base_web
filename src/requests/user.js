import uri from 'utils/uri';
import request, { requestWithCallBack } from 'utils/request';
import config from 'utils/config';

const mock = false;
const baseUri = {
  m: uri.component('user'),
  restfulApi: false,
  mock,
};

const newUri = {
  m: uri.component('system', 'disk_io'),
  restfulApi: false,
  mock,
};

export function setDiskIoData(params) {
  const op = 'set_disk_io_data'
  return request({
    url: uri.ops({ op, ...newUri }),
    method: 'post',
    body: params,
  })
}

export function getFileUploadUrl() {
  return uri.ops({ op: 'upload_avatar', ...baseUri })
}

export function getUserAvatarUrl(params) {
  return uri.ops({ op: 'avatar', ...baseUri, ...params })
}

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

export async function create (params) {
  const op = 'create'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function remove (params) {
  const op = 'del'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function update (params) {
  const op = 'edit'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}


export async function userGroup (params) {
  const op = 'user_group'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function userGroupList (params) {
  const op = 'user_group_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getFeilConfig (params) {
  const op = 'get_feil_config'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function updateMevilConfig (params) {
  const op = 'update_mevil_config'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export function getSystemSettingsWithCallback (params, cb) {
  const op = 'user_settings'
  return requestWithCallBack({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: {...params, source: config.dataSource},
    headers: {'UA':'95FE505BA1CB98'},
  }, null, cb)
}

export function getUploadUrl (params = {}) {
  return uri.ops({ op: 'upload_file', ...baseUri, ...params })
}