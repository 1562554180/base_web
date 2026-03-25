import fetch from 'dva/fetch';
import _ from 'lodash';
import { showOpsNotification, showErrorMessage, $echo } from './utils';
import uri from './uri';
import config from './config';
import { l } from './localization';

const codeMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function throwError(txt, name, res) {
  const error = new Error(txt);
  error.name = name;
  error.response = res;
  const serverTag = localStorage.getItem('serverTag')
  if (!JSON.parse(serverTag)) {
    throw error;
  }
}

function checkStatus(response) {
  if ((response.status >= 200 && response.status < 300) || response.url.endsWith('/_nlpcn/sql')) {
    return response;
  }
  const serverTag = localStorage.getItem('serverTag')
  if (!JSON.parse(serverTag)) {
    throwError(response.status, codeMessage[response.status] || response.statusText, response);
  }
}

function showError(e, cb, url) {
  const serverTag = localStorage.getItem('serverTag')
  if (e.name === -1) {
    let msg = l('Please login');
    if (e.response) {
      if (e.response.type === 'relogin') {
        msg = e.response.message;
        if (msg === 'dup_login') {
          msg = '该账户已使用新客户端登录';
        } else if (msg === 'logout') {
          msg = '该账户长时间未操作，需要重新登录';
        } else {
          msg = '用户权限更新，需要重新登录';
        }
      } else if (e.response.message) {
        msg = e.response.message;
      }
    }

    if (!uri.isPassportComponent()) {
      if (!JSON.parse(serverTag)) {
        showErrorMessage(msg);
      }
      config.store.dispatch({
        type: 'passport/logout',
      });
    }
    return;
  }
  const defaultError = ['sys_reboot', 'get_web_config', 'sys_shutdown', 'sys_restart', 'version_check_nrfluxui_status']
  const isdefault = defaultError.some(i => url?.url.includes(i))
  const res = { success: false, message: l('Request failed, the reason is: {0}', l(e.message)) };
  // 报错拦截
  if (!JSON.parse(serverTag) && !isdefault) {
    showOpsNotification(res);
  }
  if (cb) {
    cb({})
  }
}

function createFormData(data, parent) {
  let r = '';
  let sep = '';

  for (const k in data) {
    const kk = parent ? `${parent}[${k}]` : k;
    if (_.isObject(data[k])) {
      r += sep + createFormData(data[k], kk);
    } else {
      r += `${sep}${kk}=${encodeURIComponent(data[k])}`;
    }
    if (!sep) sep = '&';
  }
  return r;
}

function checkLogin(ret) {
  if (ret && ((ret.data && ret.data.toLogin) || ret.type === 'relogin')) {
    throwError('', -1, ret);
  }
  return ret;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function requestWithCallBack(url, options, cb) {
  const defaultOptions = {
    credentials: 'include',
  };
  let newOptions;
  let dstUrl;

  if (typeof (url) !== 'string') {
    newOptions = { ...defaultOptions, ...url };
    dstUrl = newOptions.url;
    delete newOptions.url;
  } else {
    dstUrl = url;
    newOptions = { ...defaultOptions, ...options };
  }

  if (options?.headers) {
    newOptions.headers = { ...newOptions?.headers, ...options?.headers }
  }

  const data = newOptions.body || newOptions.data;
  let method = newOptions.method ? newOptions.method.toUpperCase() : false;

  if (data && method !== 'POST' && method !== 'PUT') method = 'POST';
  if (data && (method === 'POST' || method === 'PUT')) {
    if (newOptions.json) {
      delete newOptions.json;
      newOptions.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(data);
    } else if (!(data instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        ...newOptions.headers,
      };
      try {
        newOptions.body = createFormData(data, '');
      } catch (ex) {
        if (cb) {
          showErrorMessage('数据格式错误');
          cb({});
          return;
        }
      }
    }
  }

  return fetch(dstUrl, newOptions)
    .then(checkStatus)
    .then(response => {
      if (response.url.endsWith('/_nlpcn/sql')) {
        if (response.status >= 500) {
          if (response.status === 503) {
            showErrorMessage('ElasticSearch还未正常恢复，请稍后再重试');
          } else {
            showErrorMessage('SQL查询出现错误，请检查SQL语句语法后重试');
          }
          return {};
        } else if (response.status >= 400) {
          showErrorMessage('索引不存在，当前没有该数据索引');
          return {};
        }
        return response.json();
      }
      if (response.headers.get('Content-Type').toLowerCase().indexOf('application/json') >= 0) {
        return response.json();
      }
      const txt = response.text();
      if (txt === 'connect to es timeout') {
        showErrorMessage('连接ElasticSearch服务超时');
        return {};
      }
      return txt;
    }).then(checkLogin).then(cb).catch((e) => showError(e, cb, url));
}

export default function request(url, options) {
  return requestWithCallBack(url, options, $echo);
}

function createResponseChecker(cb, opt) {
  const { alwaysCall, errMsg } = opt || {};
  return (res) => {
    if (res && res.success) {
      if (cb) cb(true, res.data);
    } else {
      const serverTag = localStorage.getItem('serverTag')
      if (!JSON.parse(serverTag)) {
        showErrorMessage(res.message || errMsg || '操作失败');
      }
      if (alwaysCall) cb(false);
    }
  }
}

export function requestWithResponseCheck(url, options, cb, opt) {
  const checker = createResponseChecker(cb, opt);
  return requestWithCallBack(url, options, checker);
}
