import request from 'utils/request';
import uri from 'utils/uri';

const mock = false;
const baseUri = {
  m: uri.component('system', 'system_upgrade'),
  restfulApi: false,
  mock,
};

export async function getUpgradeInfo (params) {
  const op = 'get_upgrade_info'
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

export async function updateVersion (params) {
  const op = 'update_version'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export function downloadVersion(params) {
  return uri.ops({op: 'download', ...baseUri, ...params})
}

export function getUploadUrl(params = {}) {
  return uri.ops({ op: 'upload_version', ...baseUri, ...params })
}
