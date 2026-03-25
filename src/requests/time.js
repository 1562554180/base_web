import request from 'utils/request';
import uri from 'utils/uri';
import { getConfigEip } from 'common/utils';

const mock = false;
const baseUri = {
  m: uri.component('dev', 'set_date'),
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

export async function list (params = {}) {
  const op = 'list';
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  })
}

export async function setTime (params = {}) {
  const op = 'set_date';
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  })
}

export async function setDateTime (params = {}) {
  const op = 'ntpdate';
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: {...params, ...getConfigEip()},
  })
}



