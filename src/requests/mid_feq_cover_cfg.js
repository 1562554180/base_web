import request from 'utils/request';
import uri from 'utils/uri';

const mock = false;
const baseUri = {
  m: uri.component('system_setting/mid_feq_cover_cfg'),
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

export async function forminit (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function formEditCommit (params) {
  const op = 'update'
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


const baseUriNew = {
  m: uri.component('set_config'),
  restfulApi: false,
  mock,
};

export async function formCommit (params) {
  const op = 'set_freqconvertab'
  return request({
    url: uri.ops({ op, ...baseUriNew }),
    method: 'post',
    body: params,
  })
}

export async function getUniqueBandListConfig (params) {
  const op = 'freq_band_list';
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取小区流量转换配置默认值
export async function getStationConfigDefaultValue (params) {
  const op = 'get_config';
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function handleUpdateConfig (params) {
  const op = 'update_freq_band';
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}
