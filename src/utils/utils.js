import React from 'react';
import moment from 'moment';
import { notification, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import numeral from 'numeral';
import _ip from 'ip';
import less from 'less';
import * as Base64 from 'base64-arraybuffer';
// import PopupProtoList from 'common/PopupProtoList';
import { setStorageData, getStorageData } from 'utils/storage';
import themes from './theme';
import { l } from './localization';
import config from './config';

const BigInt = window.BigInt;
const allcolor = {
  default: {
    '#fbd437': ['#fbd437', 'rgba(138, 131, 73, .3)', '#94f6bb'], // 黄色
    '#94f6bb': ['#94f6bb', 'rgba(86, 148, 139, .3)', '#fbd437'], // 绿色
    colorText: ['#e0e9ee', '#fe4545', '#1baff4'],
  },
  highlight: {
    '#fbd437': ['#557be6', 'rgba(176, 192, 235, .3)', '#e58e54'], // 紫色
    '#94f6bb': ['#e58e54', 'rgba(236, 168, 123, .3)', '#557be6'], // 蓝色
    colorText: ['#222222', '#eb100b', '#215acd'],
  },
  greenTheme: {
    '#fbd437': ['#56baca', 'rgba(70, 107, 113, .3)', '#ccb35e'], // 绿色
    '#94f6bb': ['#ccb35e', 'rgba(125, 120, 76, .3)', '#56baca'], // 黄色
    colorText: ['#b0afbf', '#eb100b', '#fff'],
  },
};

// svgFile
const svgFile = {
  default: '#071530',
  highlight: '#ffffff',
  greenTheme: '#201f2b',
};

const supportedTheme = ['default', 'highlight', 'greenTheme'];
export function arrToObj(arr) {
  return arr.reduce((pre, v) => {
    pre[v] = true;
    return pre;
  }, {});
}

export function changeTheme(theme, callback) {
  let selectedTheme = theme;
  if (!selectedTheme || !supportedTheme.includes(selectedTheme)) {
    selectedTheme = supportedTheme[0];
  }
  const themeConfig = themes[selectedTheme];
  less.modifyVars(themeConfig)
  .then(() => {
    if (callback) callback(selectedTheme);
    saveTheme(selectedTheme);
  })
  .catch(error => {
    console.log(error)
  });
  return selectedTheme;
}

export function getSelectedTheme() {
  let theme = supportedTheme[0];
  try {
    theme = 'default' || getStorageData('selectedTheme');
    if (!supportedTheme.includes(theme)) {
      theme = supportedTheme[0];
    }
  } catch (e) {
    console.log(e)
  }
  return theme;
}

export function saveTheme(theme) {
  try {
    setStorageData('selectedTheme', theme);
  } catch (e) {
    console.log(e)
  }
}

export function loadSelectedTheme() {
  if (config.isThemeEnabled) {
    config.selectedTheme = getSelectedTheme();
    changeTheme(config.selectedTheme);
  } else {
    config.selectedTheme = supportedTheme[0];
    changeTheme(config.selectedTheme);
  }
}

export function parseJson(json, d) {
  if (!json) return d;
  if (_.isObject(json)) return json;
  try {
    return JSON.parse(json);
  } catch (e) {
    return d;
  }
}

export function getSearchField(search, key) {
  const searchArray = search.split('?');
  if (searchArray.length <= 1) return '';
  const fields = searchArray[1].split('&&');
  for (const f of fields) {
    if (f) {
      const fs = f.split('=');
      if (key === fs[0]) return decodeURIComponent(fs[1]);
    }
  }
  return '';
}

export function getUniqKey(length) {
  let freeDomStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  freeDomStr += 'abcdefghijklmnopqrstuvwxyz';
  freeDomStr += '0123456780-_';
  let str = '';
  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * freeDomStr.length);
    str += freeDomStr.substring(random, random + 1);
  }
  return str;
}

export function stringToHex(str, sep = ',') {
  let val = '';
  for (let i = 0; i < str.length; i++) {
    if (val === '') {
      val = str.charCodeAt(i).toString(16);
    } else {
      if (sep) val += sep;
      val += str.charCodeAt(i).toString(16);
    }
  }
  return val;
}

export function hexToString(str) {
  let val = '';
  const arr = str.split(',');
  for (let i = 0; i < arr.length; i++) {
    val += String.fromCharCode(i);
  }
  return val;
}

export function stringFromHex(str) {
  let val = '';
  for (let i = 0; i < str.length;) {
    const code = (parseInt(str[i], 16) << 4) | parseInt(str[i + 1], 16);
    val += String.fromCharCode(code);
    i += 2;
  }
  return val;
}

export function toLocalTime(d, fmt = 'yyyy-MM-dd hh:mm:ss') {
  const o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds(),
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  }
  return fmt;
}

export function getNowTime(fmt = 'yyyy-MM-dd-hh-mm-ss') {
  return toLocalTime(new Date(), fmt);
}

export function clearEmptyTime(o, t) {
  if (_.isUndefined(o[t])) return;
  if (!o[t] || o[t] === '0') delete o[t];
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function intToNumberString(v) {
  const rv = numeral(v).format('0,0');
  if (rv === '0') return v;
  return rv.replace(/,/, ', ');
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getTimePass(delta, isFixed) {
  const t = parseInt(delta, 10);

  if (t < 60) {
    return t + ' 秒';
  } else if (t < 60 * 60) {
    return isFixed ? (t / 60).toFixed(1) + ' 分钟' : (t / 60) + ' 分钟';
  } else if (t < 24 * 60 * 60) {
    return isFixed ? (t / (60 * 60)).toFixed(1) + ' 小时' : (t / (60 * 60)) + ' 小时';
  }

  return isFixed ? (t / (24 * 60 * 60)).toFixed(1) + ' 天' : (t / (24 * 60 * 60)) + ' 天';
}

export function getTimePassByMs(delta) {
  const t = _.isString(delta) ? parseInt(delta, 10) : delta;

  if (t <= 1000) {
    return `${delta} 毫秒`;
  }
  const ft = Math.floor(t / 1000);
  const int = t - ft;
  if (ft < 60) {
    if (int > 0) {
      return `${ft}秒,${int}毫秒`;
    }
    return ft + ' 秒';
  } else if (ft < 60 * 60) {
    return (ft / 60).toFixed(1) + ' 分钟';
  } else if (ft < 24 * 60 * 60) {
    return (ft / (60 * 60)).toFixed(1) + ' 小时';
  }

  return (ft / (24 * 60 * 60)).toFixed(1) + ' 天';
}

export function getTimePassByMsInEn(delta) {
  let t = _.isString(delta) ? parseInt(delta, 10) : delta;
  const ms = t % 1000;

  t = Math.floor(t / 1000);

  const v = numeral(t).format('00:00:00');

  return ms > 0 ? `${v}.${ms}` : v;
}

export function getNumByUnit(delta, unit = 1000) {
  let t = _.isString(delta) ? parseInt(delta, 10) : delta;
  const d = t % unit;

  t = Math.floor(t / unit);

  const v = numeral(t).format('0,0');

  return d > 0 ? `${v}.${d}` : v;
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData, onlyChild) {
  let routes = [];
  if (!onlyChild) {
    routes = routerData.$.filter(routePath => routePath === path);
    if (routes.length === 0) {
      routes = routerData.$.filter(routePath => routePath.indexOf(path) === 0);
    }
  } else if (routes.length === 0) {
    routes = routerData.$.filter(routePath => routePath.indexOf(path) === 0 && routePath !== path);
  }
  if (routes.length === 0) return [];
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

const urlPrefix = /^https?:\/\//i;

export function startsWithHttp(path) {
  return urlPrefix.test(path);
}

export function showOpsNotification(data, title, sucMessage, failedMessage) {
  let msg;
  let type;

  if (data && data.success) {
    type = 'success';
    msg = sucMessage || (data.message ? data.message : l('The operation is succeeded'));
  } else {
    type = 'error';
    msg =
      failedMessage ||
      (data && data.message ? data.message : l('Operation is failed. The error is known'));
  }
  if (!title) title = l('Operation notification');
  if (data && data.notification) {
    notification[type]({
      message: title,
      description: msg,
    });
  } else {
    message[type](msg);
  }
}

let lastShowMsgTime = 0;
let lastMsg = null;

export function showErrorMessage(msg) {
  if (_.isString(msg)) {
    const dt = new Date().getTime();
    if (lastShowMsgTime + 2000 >= dt && msg === lastMsg) return;
    lastShowMsgTime = dt;
    lastMsg = msg;
    message.error(msg);
    return;
  }
  message.error('表单中仍有部分值格式填写不正确，请重新检查后提交');
}

window.serverWarnings = [];

export function showServerErrorMessage(msg, justSave) {
  if (!msg) return;
  window.serverWarnings.push({
    time: toLocalTime(new Date()),
    msg,
    error: true,
  });
  if (!justSave) message.error(msg);
}

export function showServerWarningMessage(msg, justSave) {
  if (!msg) return;
  window.serverWarnings.push({
    time: toLocalTime(new Date()),
    msg,
    warning: true,
  });
  if (!justSave) message.warn(msg);
}

export function showMessage(msg) {
  message.info(msg);
}

export function pv(o, k, d) {
  if (!o) return d;

  return _.isUndefined(o[k]) ? d : o[k];
}

export function updateConfig(v) {
  if (!v) return config.layout;

  let isSame = true;
  for (const k in v) {
    if (v[k] !== config.layout[k]) {
      isSame = false;
    }
  }
  if (isSame) return;
  config.layout = { ...config.layout, ...v };
  config.layout.changed = true;
}

export function numberToChinese(num, type = '') {
  if (!num) return 0;
  const strNum = Number((num + '').replace(/[,，]*/g, '')) + '';
  num = Number(strNum);
  let capitalAr = '零一二三四五六七八九十';
  let unitAr = ['十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千'];
  if (type) {
    capitalAr = '零壹贰叁肆伍陆柒捌玖拾佰';
    unitAr = ['拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'];
  }
  const resultAr = [];
  const index = strNum.length - 1;
  let idx = 0;
  const percent = 10;
  const turnNum = (n, p, tIndex) => {
    const unit = n / p;
    const capital = capitalAr[Number(strNum[tIndex])];
    if (unit < 1) {
      resultAr.push(capital);
      // 出现11 【一十一】这种情况
      if (Number(strNum[tIndex]) === 1 && (strNum.length === 2 || strNum.length === 6 || strNum.length === 10)) {
        resultAr.pop();
      }
      // 结束递归
      return false;
    } else {
      if (capital === '零') {
        // 万和亿单位不删除
        if (!['万', '亿'].includes(resultAr[resultAr.length - 1])) {
          resultAr.pop();
        }
        // 前面有零再删掉一个零
        if (resultAr[resultAr.length - 1] === '零') {
          resultAr.pop();
        }
      }
      resultAr.push(capital);
      // 过滤存在 【零万】【零亿】这种情况
      if (['万', '亿'].includes(resultAr[resultAr.length - 2]) && capital === '零') {
        resultAr.pop();
      }
      // 过滤 【1亿万】这种情况
      if (resultAr[0] === '万' && resultAr[1] === '亿') {
        resultAr.shift();
      }
      // 末尾【零】删掉
      if (resultAr[0] === '零') {
        resultAr.pop();
      }
      resultAr.push(unitAr[idx+=1]);
      // eslint-disable-next-line no-plusplus
      turnNum(n, p * 10, --tIndex);
    }
  }
  turnNum(num, percent, index);
  return resultAr.reverse().join('');
}

export function localNumeral(num, options) {
  const { hasBlank, bracket, format } = options || {};
  if (!num) return 0;
  if (num < 10000) {
    return bracket
      ? `${num + (hasBlank ? ' ' : '')} (${numeral(num).format('0,0')})`
      : num + (hasBlank ? ' ' : '');
  } else if (num >= 10000 && num < 100000000) {
    return bracket
      ? `${numeral(num / 10000).format(format || '0.00') + (hasBlank ? ' ' : '') + '万'} (${numeral(
        num
      ).format('0,0')})`
      : numeral(num / 10000).format(format || '0.00') + (hasBlank ? ' ' : '') + '万';
  } else {
    return bracket
      ? `${numeral(num / 100000000).format(format || '0.00') +
      (hasBlank ? ' ' : '') +
      '亿'} (${numeral(num).format('0,0')})`
      : numeral(num / 100000000).format(format || '0.00') + (hasBlank ? ' ' : '') + '亿';
  }
}

export function recombinantString(str, o, n) {
  if (!str) return '';
  let newStr = '';
  const arr = str.split(o);
  arr.forEach((item, index) => {
    if (index === arr.length - 1) {
      newStr += `${item}`;
    } else {
      newStr += `${item}${n}`;
    }
  });
  return l(newStr);
}

export function getByteSize(size, getUnit, isLower, unit = 1024, len) {
  if (!size) {
    return getUnit ? 0 : isLower ? '0 b' : '0 B';
  }
  const s = parseInt(size, 10);
  if (len === null || len === undefined) {
    len = 2;
  }
  if (s < unit) {
    return getUnit ? 0 : s + (isLower ? ' b' : ' B');
  } else if (s < unit * unit) {
    return getUnit ? 1 : ((s * 1.0) / unit).toFixed(len) + (isLower ? ' kb' : ' KB');
  } else if (s < unit * unit * unit) {
    return getUnit ? 2 : ((s * 1.0) / (unit * unit)).toFixed(len) + (isLower ? ' mb' : ' MB');
  } else if (s < unit * unit * unit * unit) {
    return getUnit
      ? 3
      : ((s * 1.0) / (unit * unit * unit)).toFixed(len) + (isLower ? ' gb' : ' GB');
  }
  return getUnit
    ? 4
    : ((s * 1.0) / (unit * unit * unit * unit)).toFixed(len) + (isLower ? ' tb' : ' TB');
}
export function getMiniUnitByteSize(size) {
  if (!size) return '0';
  const byteUnit = ['GB', 'MB', 'KB', 'gb', 'mb', 'kb'];
  const lastUnit = size.substring(size.length - 1, size.length);
  const newUnit = size.substring(size.length - 2, size.length);
  const newSize = size.substring(0, size.length - 2);
  const lastSize = size.substring(0, size.length - 1);
  if ((lastUnit === 'b' || lastUnit === 'B') && !byteUnit.includes(newUnit)) {
    return lastSize * 1;
  }
  if (newUnit === 'gb' || newUnit === 'GB') {
    return 1024 * 1024 * 1024 * newSize;
  } else if (newUnit === 'mb' || newUnit === 'MB') {
    return 1024 * 1024 * newSize;
  } else if (newUnit === 'kb' || newUnit === 'KB') {
    return 1024 * newSize;
  }
}

export function getSize(size, unit) {
  if (!size) {
    return '';
  }
  const num = 1024.0;
  if (unit === 0) {
    return size;
  } else if (unit === 1) {
    return (size / num).toFixed(2);
  } else if (unit === 2) {
    return (size / (num * num)).toFixed(2);
  } else if (unit === 3) {
    return (size / (num * num * num)).toFixed(2);
  } else {
    return (size / (num * num * num * num)).toFixed(2);
  }
}

export function toNeedByte(list) {
  if (!list || list.length === 0) return [];
  const arr = _.sortBy(list, e => e);
  let n = 0;
  const len = list.length;
  if (len % 2 === 0) {
    n = (arr[len / 2] + arr[len / 2 - 1]) / 2;
  } else {
    n = arr[(len - 1) / 2];
  }
  const unit = getByteSize(n, true);
  const unitObj = { '1': 'KB', '2': 'MB', '3': 'GB', '4': 'TB' };
  const brr = [];
  list.forEach(i => {
    brr.push(getSize(i, unit));
  });
  return [brr, unitObj[unit]];
}

export function $noop() { }

export function $echo(r) { return r; }

/* eslint-disable camelcase */
export function get_ip_b_subnet($ip) {
  const $ips = $ip.split('.');
  return (parseInt($ips[0], 10) << 8) | parseInt($ips[1], 10);
}
export function get_ip_c_subnet($ip) {
  const $ips = $ip.split('.');
  return (parseInt($ips[0], 10) << 16) | (parseInt($ips[1], 10) << 8) | parseInt($ips[2], 10);
}
export function get_ip_b_subnet_int($ip) {
  const $i2 = ($ip >> 16) & 0xff;
  const $i3 = ($ip >> 24) & 0xff;
  return ($i3 << 8) | $i2;
}
export function get_ip_c_subnet_int($ip) {
  const $i1 = ($ip >> 8) & 0xff;
  const $i2 = ($ip >> 16) & 0xff;
  const $i3 = ($ip >> 24) & 0xff;
  return ($i3 << 16) | ($i2 << 8) | $i1;
}

let $intranet_192;
let $intranet_10;
let $intranet_172;
let $intranet_169;

export function initIntranetTag() {
  $intranet_192 = get_ip_b_subnet('192.168.0.1');
  $intranet_169 = get_ip_b_subnet('169.254.0.1');
  $intranet_172 = [get_ip_b_subnet('172.16.0.1'), get_ip_b_subnet('172.31.0.1')];
  $intranet_10 = [get_ip_b_subnet('10.0.0.1'), get_ip_b_subnet('10.254.0.1')];
}

export function is_subnet_intranet(id) {
  let $id = id;
  if (_.isString($id)) $id = get_ip_b_subnet($id);
  if ($id === $intranet_192) return true;
  if ($id === $intranet_169) return true;
  if ($id >= $intranet_172[0] && $id <= $intranet_172[1]) return true;
  if ($id >= $intranet_10[0] && $id <= $intranet_10[1]) return true;

  return false;
}

export function sorterForObj(ls, o, k) {
  if (!ls) return [];
  const n = [];
  for (const i in o) {
    const s = ls.filter(item => item[k] === i)[0];
    if (o[i] && s) {
      n.push(s);
    }
  }
  return n;
}

export function creatProtocolNumber() {
  const protocolList = [
    { shortName: 'NIP', dname: 'NIP', name: 'nip', num: 0 },
    { shortName: 'ICMP (1)', dname: 'ICMP', name: 'icmp', num: 1 },
    { shortName: 'IGMP (2)', dname: 'IGMP', name: 'igmp', num: 2 },
    { shortName: 'GGP (3)', dname: 'GGP', name: 'ggp', num: 3 },
    { shortName: 'EGP (8)', dname: 'EGP', name: 'egp', num: 8 },
    { shortName: 'IDPRP (35)', dname: 'IDPRP', name: 'idprp', num: 35 },
    { shortName: 'IDRP (45)', dname: 'IDRP', name: 'idrp', num: 45 },
    { shortName: 'RSVP (46)', dname: 'RSVP', name: 'rsvp', num: 46 },
    { shortName: 'GRE (47)', dname: 'GRE', name: 'gre', num: 47 },
    { shortName: 'NHRP (54)', dname: 'NHRP', name: 'nhrp', num: 54 },
    { shortName: 'EIGRP (88)', dname: 'EIGRP', name: 'eigrp', num: 88 },
    { shortName: 'OSPF (89)', dname: 'OSPF', name: 'ospf', num: 89 },
    { shortName: 'SCTP (132)', dname: 'SCTP', name: 'sctp', num: 132 },
  ];
  const protocolNumber = [];
  for (let i = 0; i <= 255; i++) {
    if (
      i !== 1 &&
      i !== 2 &&
      i !== 3 &&
      i !== 6 &&
      i !== 8 &&
      i !== 17 &&
      i !== 35 &&
      i !== 45 &&
      i !== 46 &&
      i !== 47 &&
      i !== 54 &&
      i !== 88 &&
      i !== 132
    ) {
      protocolNumber.push(i);
    }
  }
  protocolNumber.unshift(...protocolList);
  return protocolNumber;
}

export function getTaskParams() {
  const taskObject = JSON.parse(localStorage.getItem('taskId')) || {};
  const { task = {} } = taskObject || {};
  return task;
}

export function getParams(name) {
  const matchReg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let search = window.location.href;
  if (search.indexOf('?') > -1) {
    search = search.split('?')[1];
  }
  const urlParams = decodeURIComponent(`?${search}`);
  const r = urlParams.substr(1).match(matchReg);
  if (r != null) {
    return r[2];
  }
  return null;
}

export function sorterNodesByCount(r, theme, nodeDetail) {
  if (!r || !r.nodes) return {};
  const nr = { ...r };
  const { nodes } = nr;
  const idx = {};
  const maxNode =
    _.maxBy(nodes, item => {
      const len = item.e ? item.e.length || 0 : 0;
      return len;
    }) || {};
  const num = nodes && nodes.length > 30 ? 40 : 10;
  const max = maxNode.e ? maxNode.e.length || 1 : 1;
  const fontsize = config.relationFontSize ? config.relationFontSize.rFontsize : '';

  nodes.forEach((node, index) => {
    const len = node.e ? node.e.length || 0 : 0;
    const size = 20 + (len / max) * num;

    idx[node.id] = index;
    const c = allcolor[theme || 'default'][node.defaultColor] || [];
    const colorText = allcolor[theme || 'default'].colorText;
    node.color1 = c[0];
    node.color2 = c[2];
    node.color = node.showColor ? node.color : c[0];
    node._label = node.label;
    node.size = size;
    node.font = {
      size: Number(fontsize || size),
      face: 'Tahoma',
      color: colorText[0],
    };
    for (const j of nodeDetail) {
      if (j.name === node.label && j.img_path) {
        node.image = j.img_path;
        node.shape = 'circularImage';
      }
    }
  });
  return { ...nr, idx };
}

export function updateSorterNodes(r, selectedNode = {}, positions, hidden, showCircleEdge, theme) {
  if (!r || !r.nodes) return {};
  const nr = { ...r };
  const { nodes, edges } = nr;
  const e = selectedNode.e || [];
  const selNodefontsize = config.relationFontSize ? config.relationFontSize.rNodeFontsize : '';

  nodes.forEach((node, index) => {
    const p = positions[node.id];
    if (p) {
      node.x = p.x;
      node.y = p.y;
    }
    node.hidden = false;
    const c = allcolor[theme || 'default'][node.defaultColor] || [];
    const colorText = allcolor[theme || 'default'].colorText;
    node.color1 = c[0];
    node.color2 = c[1];
    node.color = node.color1;
    node.font.strokeWidth = 0;
    node.font.color = colorText[0];
    if (selectedNode.id === node.id || e.includes(index)) {
      node.color = node.color1;
      if (selectedNode.id === node.id) {
        node.font.color = colorText[2];
        node.font.strokeWidth = 2;
        node.font.strokeColor = colorText[2];
        node.font.size = Number(selNodefontsize || node.font.size);
      } else {
        node.font.color = colorText[2];
      }
    } else if (selectedNode.id) {
      node.hidden = hidden;
      node.color = node.color2;
      node.font.color = colorText[0];
      node.font.size = Number(selNodefontsize || node.font.size);
    }
  });
  edges.forEach(edge => {
    if (edge.from === edge.to) {
      edge.hidden = !showCircleEdge;
    }
    if (selectedNode.id) {
      const c = allcolor[theme || 'default'][selectedNode.defaultColor] || [];
      const cf = allcolor[theme || 'default']['#fbd437'] || [];
      if (edge.from === selectedNode.id) {
        edge.color = { color: c[0], highlight: c[0], hover: c[0] };
      } else if (edge.to === selectedNode.id) {
        edge.color = { color: c[3], highlight: c[3], hover: c[3] };
      } else {
        edge.color = { color: c[1], highlight: cf[0], hover: cf[0] };
      }
    } else {
      edge.color = {};
    }
  });
  return nr;
}

export function getDisposeValue(n, v, type = '') {
  const values = [];
  for (let i = 0, len = v.length; i < len / n; i++) {
    const str = v.slice(n * i, n * (i + 1));
    values.push(str);
  }
  if (type === 'node') {
    return (
      <div style={{ cursor: 'pointer' }}>
        {values.map(item => (
          <p key={item} style={{ marginBottom: 4 }}>
            {item}
          </p>
        ))}
      </div>
    );
  }
  return values;
}

export function getNumber(id, isSymbol) {
  const num = id * 1;
  if (num <= 9) {
    if (isSymbol) return `000${num + 1}`;
    return `-000${num + 1}`;
  }
  if (num > 9 && num <= 99) {
    if (isSymbol) return `00${num + 1}`;
    return `-00${num + 1}`;
  }
  if (num > 99 && num <= 999) {
    if (isSymbol) return `0${num + 1}`;
    return `-0${num + 1}`;
  }
  if (num > 999) {
    if (isSymbol) return num + 1;
    return `-${num + 1}`;
  }
}

export function iframeDowdnloadFile(href) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none'; // 防止影响页面
  iframe.style.height = 0; // 防止影响页面
  iframe.src = href;
  document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
  // 多少分钟之后删除
  setTimeout(() => {
    iframe.remove();
  }, 1 * 60 * 5000);
}

export function getRankingData(d, currentPage) {
  const newData = _.cloneDeep(d);
  const { data = [] } = newData;
  for (const i in data) {
    data[i].ranking = (currentPage - 1) * 10 + i * 1 + 1;
  }
  return newData;
}

export function getVisOptions(
  data,
  fontStyle,
  edgesColor,
  physics,
  layout,
  fontColor,
  hiddenHover,
  borderColor = {},
  edgesarrows,
  arrowsselectionwidth,
) {
  const smooth = { type: 'curvedCW', roundness: 0.1 };
  if (data && data.nodes && data.nodes.length > 0 && data.nodes.length < 1000) {
    return {
      interaction: { hover: !hiddenHover },
      nodes: {
        shape: 'ellipse',
        scaling: {
          min: 10,
          max: 50,
          label: {
            min: 8,
            maxVisible: 20,
          },
        },
        chosen: !hiddenHover,
        font: {
          size: 20,
          face: 'Tahoma',
          color: fontColor || '#fff',
          ...fontStyle,
        },
        color: {
          border: borderColor.border_color || 'red',
          background: borderColor.border_bgc || 'red',
        },
      },
      edges: {
        color: edgesColor || { inherit: 'from' },
        width: 0.15,
        arrows: edgesarrows || {},
        hoverWidth: 5,
        selectionWidth: arrowsselectionwidth || 1,
        font: {
          size: 11,
          color: fontColor || '#fff',
          strokeWidth: 0,
        },
        smooth,
      },
      layout: layout || {},
      physics: physics || false,
    };
  }

  return {
    nodes: {
      borderWidth: 0,
      shape: 'ellipse',
      size: 9,
      color: {
        border: borderColor.border_color || '#00e1ff',
        background: borderColor.border_bgc || '#19325a',
      },
      scaling: {
        min: 11,
        max: 25,
        label: false,
      },
      chosen: !hiddenHover,
      font: {
        size: 11,
        face: 'Tahoma',
        color: fontColor || '#fff',
        ...fontStyle,
      },
      shapeProperties: {
        useBorderWithImage: true,
      },
    },
    interaction: { hover: !hiddenHover },
    edges: {
      color: edgesColor || { inherit: 'from' },
      width: 0.15,
      smooth,
      font: {
        size: 11,
        color: fontColor || 'white',
        strokeWidth: 0,
      },
    },
    layout: layout || {},
    physics: physics || false,
  };
}

/* eslint-enable camelcase */

export function getalledgeslnglat(relation) {
  if (!relation || !relation.nodes) return false;
  const { edges = [], nodes = [] } = relation;
  const nedges = _.cloneDeep(edges);
  nedges.forEach(edge => {
    const toNode = nodes.filter(node => node.id === edge.to)[0] || {};
    const fromNode = nodes.filter(node => node.id === edge.from)[0] || {};
    if (toNode.lng && toNode.lat) {
      edge.tolnglat = toNode;
    }
    if (fromNode.lng && fromNode.lat) {
      edge.fromlnglat = fromNode;
    }
  });
  return nedges;
}
// edge_relation
function getTotalbandwidth(edge) {
  const bandwidth = {};
  const { from = [], to = [] } = edge;
  let hidden = false;
  from.forEach(i => {
    if (i.counts > 3) {
      hidden = true;
      return false;
    }
    const key = i.dst_interface_port + '_' + i.src_interface_port + '_' + i.bandwidth;
    if (!bandwidth[key] && i.counts > 3) {
      bandwidth[key] = i.bandwidth * 1;
    }
  });
  if (hidden) return 0;
  to.forEach(i => {
    if (i.counts > 3) {
      hidden = true;
      return false;
    }
    const key = i.src_interface_port + '_' + i.dst_interface_port + '_' + i.bandwidth;
    if (!bandwidth[key] && i.counts > 3) {
      bandwidth[key] = i.bandwidth * 1;
    }
  });
  if (hidden) return 0;
  let n = 0;
  for (const i in bandwidth) {
    n += bandwidth[i];
  }
  return n;
}

export function toRelationData(relationData, switchAddrs = {}) {
  if (!relationData || !relationData.nodes || !switchAddrs) return {};
  const dataOfIdx = switchAddrs.dataOfIdx || {};
  const dataByIds = {};
  const r = _.cloneDeep(relationData);
  r.nodes.forEach(node => {
    const lnglatinfo = dataOfIdx[node.switch_addr2];
    if (lnglatinfo) {
      dataByIds[node.id] = { ...lnglatinfo, ...node };
      if (lnglatinfo.lng) {
        node.lng = Number(lnglatinfo.lng);
      }
      if (lnglatinfo.lat) {
        node.lat = Number(lnglatinfo.lat);
      }
      node.info1 = lnglatinfo.info1;
      node.info2 = lnglatinfo.info2;
    }
  });
  const edges = [];
  const objEdgeids = {};
  if (r.edges) {
    r.edges.forEach(edge => {
      const bandwidthTotal = getTotalbandwidth(edge.edge_relation || {});
      edge.id = edge.from + '_' + edge.to;
      edge.bandwidthTotal = bandwidthTotal;
      const toNode = dataByIds[edge.to];
      const fromNode = dataByIds[edge.from];
      if (toNode && toNode.lng && toNode.lat) {
        edge.tolnglat = { ...toNode, lng: Number(toNode.lng), lat: Number(toNode.lat) };
      }
      if (fromNode && fromNode.lng && fromNode.lat) {
        edge.fromlnglat = { ...fromNode, lng: Number(fromNode.lng), lat: Number(fromNode.lat) };
      }
      objEdgeids[edge.id] = edge;
      edges.push(edge);
    });
  }
  return { ...r, edges: _.orderBy(edges, ['bandwidthTotal'], ['desc']), objEdgeids };
}

export function ipInSubnet(net, ip) {
  if (!_ip.isV4Format(ip)) return false;
  const nets = net.split('/');
  let patchNet = net;
  if (nets.length === 1) {
    patchNet = net + '/32';
  }
  if (!_ip.isV4Format(nets[0])) return false;
  if (_ip.isV4Format(nets[1])) {
    const subnet = _ip.subnet(nets[0], nets[1]);
    const length = subnet.subnetMaskLength;
    return _ip.isV4Format(ip) && _ip.cidrSubnet(`${nets[0]}/${length}`).contains(ip);
  }
  return _ip.isV4Format(ip) && _ip.cidrSubnet(patchNet).contains(ip);
}

let autoDownloadId = 0;

export function getAutoDownloadId() {
  autoDownloadId += 1;

  return 'downId' + autoDownloadId;
}

export function createAutoDownloadBlankPage(url, newId) {
  const id = newId || Math.random();
  const o = document.getElementById(id);

  if (o) {
    o.click();
    return;
  }

  const a = document.createElement('a');

  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.setAttribute('id', id);
  a.setAttribute('download', '');
  document.body.appendChild(a);
  a.click();
}

export function createEnableEditPcapDownload(url, name) {
  downloadCros(url, name);
}

export function getQueryString(name) {
  const testStr = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = window.location.hash.substr(1).match(testStr);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}

export function joinBy(list, f, k, limt) {
  if (!list || list.length === 0 || (!f && !k)) return '';
  let t = '';
  if (limt && list.length > limt) {
    list.forEach((i, idx) => {
      if (idx > limt) {
        return false;
      } else if (idx === limt) {
        t += `...`;
      } else if (i[f] && t === '') {
        t += i[f];
      } else if (i[f] && t !== '') {
        t += `${k}${i[f]}`;
      }
    });
    return t;
  }
  list.forEach(i => {
    if (i[f] && t === '') {
      t += i[f];
    } else if (i[f] && t !== '') {
      t += `${k}${i[f]}`;
    }
  });
  return t;
}

export function arrayJoinBy(arr, sep) {
  if (arr && _.isArray(arr)) {
    return arr.join(sep);
  }

  return arr;
}

export function joinBytoArray(list, f) {
  if (!list || list.length === 0 || f === undefined) return '';
  const arr = [];
  list.forEach(i => {
    arr.push(i[f]);
  });
  return arr;
}

export function getRouterIds(list) {
  if (!list || list.length === 0) return {};
  const o = {};
  list.forEach(i => {
    o[i[2]] = i[0];
  });
  return o;
}

export function getNetAndIpArray(list) {
  if (!list || list.length === 0) return {};
  const o = {};
  list.forEach(i => {
    o[i[0]] = i;
  });
  return o;
}

export function _Once(f, params, timeKey, long) {
  if (window[timeKey]) {
    clearTimeout(window[timeKey]);
  }
  window[timeKey] = setTimeout(() => {
    f(params);
    window[timeKey] = null;
  }, long || 300);
}

export function arrayToObject(list, key) {
  if (!list || list.length === 0) return {};
  const o = {};
  list.forEach(item => {
    const k = item[key];
    if (k) {
      o[k] = item;
    }
  });
  return o;
}

export function objectToArray(o) {
  if (!o) return [];
  // const o = {};
  const list = [];
  for (const i in o) {
    list.push(o[i]);
  }
  return list;
}

export function objectKeyAsValue(o) {
  if (!o) return {};
  // const o = {};
  const obj = {};
  for (const i in o) {
    obj[o[i]] = i;
  }
  return obj;
}

export function calcTimeDiff(timeStart, timeEnd, format = 'YYYY-MM-DD HH:mm:ss', differenceDays) {
  const start = moment(timeStart, format);
  const end = moment(timeEnd, format);
  const dura = end.diff(start);
  let times = '';
  let diffTime = '';

  if (dura > 86400000) {
    const modTime = dura % 86400000;
    times = modTime === 0 ? '' : numeral(modTime / 1000).format('00:00:00');
    const difference = end.diff(start, 'days');
    diffTime = difference + 'days';
    if (differenceDays) return difference;
  } else {
    times = numeral(dura / 1000).format('00:00:00');
  }

  return [diffTime, times];
}

export function insertStr(source) {
  if (!source || source.length !== 8) return '';
  const newSource = source.slice(0, 4) + '-' + source.slice(4);
  const finSource = newSource.slice(0, 7) + '-' + newSource.slice(7);
  return finSource;
}

export function getLicenceFreeTime(time) {
  if (!time) return '';
  const startTime = moment(config.now_time * 1000 || new Date()).format('YYYY-MM-DD');
  const endTime = moment(time).format('YYYY-MM-DD');
  const currentDate = new Date(startTime);
  const nextDate = new Date(endTime);
  const diff = nextDate.getTime() - currentDate.getTime();
  const dateDiff = Math.floor(diff / (24 * 3600 * 1000));
  return dateDiff;
}

export function getIntervalMinutes(timeType, timeStart, timeEnd, timeOption) {
  if (timeType !== '1m') return timeType;
  const currentDate = new Date(timeStart);
  const nextDate = new Date(timeEnd);
  const dateDiff = currentDate.getTime() - nextDate.getTime();
  const minuteDiff = Math.floor(Math.abs(dateDiff) / (60 * 1000));
  if (timeOption === '-1') return '1d';
  if (minuteDiff < 5) {
    return '1s';
  } else if (minuteDiff < 10) {
    return '2s';
  } else if (minuteDiff < 15) {
    return '4s';
  } else if (minuteDiff < 20) {
    return '5s';
  } else if (minuteDiff < 30) {
    return '8s';
  } else if (minuteDiff < 60) {
    return '10s';
  } else if (minuteDiff < 2 * 60) {
    return '20s';
  } else if (minuteDiff < 4 * 60) {
    return '30s';
  } else if (minuteDiff < 8 * 60) {
    return '45s';
  } else if (minuteDiff < 12 * 60) {
    return '1m';
  } else if (minuteDiff < 18 * 60) {
    return '2m';
  } else if (minuteDiff < 1 * 24 * 60) {
    return '5m';
  } else if (minuteDiff < 2 * 24 * 60) {
    return '10m';
  } else if (minuteDiff < 3 * 24 * 60) {
    return '15m';
  } else if (minuteDiff < 10 * 24 * 60) {
    return '30m';
  } else if (minuteDiff < 20 * 24 * 60) {
    return '45m';
  } else if (minuteDiff < (30 * 24 * 60)) {
    return '1h';
  } else if (minuteDiff < (90 * 24 * 60)) {
    return '2h';
  } else if (minuteDiff < (182 * 24 * 60)) {
    return '4h';
  } else if (minuteDiff < (265 * 24 * 60)) {
    return '8h';
  } else if (minuteDiff < (365 * 24 * 60)) {
    return '12h';
  }
  return '1d';
}

export function getAddDateValue(timeType, date) {
  let oldDate = new Date(parseInt(date, 10));
  const timeObj = {
    '1s': 1000,
    '2s': 2 * 1000,
    '4s': 4 * 1000,
    '5s': 5 * 1000,
    '8s': 8 * 1000,
    '10s': 10 * 1000,
    '20s': 20 * 1000,
    '30s': 30 * 1000,
    '45s': 45 * 1000,
    '1m': 1 * 60 * 1000,
    '2m': 2 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '10m': 10 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '45m': 45 * 60 * 1000,
    '1h': 1 * 3600 * 1000,
    '2h': 2 * 3600 * 1000,
    '4h': 4 * 3600 * 1000,
    '8h': 8 * 3600 * 1000,
    '12h': 12 * 3600 * 1000,
    '1d': 1 * 24 * 3600 * 1000,
    '1w': 7 * 24 * 3600 * 1000,
    '1M': 30 * 24 * 3600 * 1000,
    '1y': 365 * 24 * 3600 * 1000,
  }
  if (timeType === 'eachTypeValue') {
    return timeObj;
  }
  const addSecendNum = timeObj[timeType] || 1000;
  oldDate = oldDate.getTime() + addSecendNum;
  const newDate = new Date(oldDate);
  return newDate;
}

export function getIntervalByDate(value) {
  if (!value) return 0;
  const type = value[value.length - 1];
  const num = parseInt(value, 10);
  if (isNaN(num) || num <= 0) return 0;
  const types = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 24 * 60 * 60 * 1000 * 7,
    M: 24 * 60 * 60 * 1000 * 30,
    y: 24 * 60 * 60 * 1000 * 365,
  };
  const interval = types[type];
  if (!interval) return false;
  return num * interval;
}

export function removeSpecialCharsForSql(sql) {
  return sql
    .trim()
    .replace(/[\r\n\t]/g, '')
    .trim();
}

const jsRegExSpecialChars = '*^$+?=!.()\\/[]{}&|'.split('').reduce((pre, v) => {
  pre[v] = true;
  return pre;
}, {});
const esRegChars = [
  '\\',
  '.',
  '?',
  '+',
  '*',
  '|',
  '{',
  '}',
  '[',
  ']',
  '(',
  ')',
  '"',
  '#',
  '@',
  '&',
  '<',
  '>',
  '~',
  '/',
];
const escapeString = esRegChars.map(v => [
  new RegExp(jsRegExSpecialChars[v] ? '\\' + v : v, 'ig'),
  '\\' + v,
]);

escapeString.unshift([/\\t/, '\t']);

export function escapeRegExValue(itemValue) {
  let v = itemValue;
  for (const item of escapeString) {
    v = v.replace(item[0], item[1]);
  }
  return v;
}

const escapeStringInString = esRegChars.map(v => [new RegExp('\\\\\\' + v, 'ig'), '\\\\' + v]);

escapeStringInString.push([/\\s/, '[ \t]']);
escapeStringInString.push([/\\S/, '[^ \t]']);

export function escapeRegExValueInString(itemValue) {
  let v = itemValue;
  for (const item of escapeStringInString) {
    v = v.replace(item[0], item[1]);
  }
  return v;
}

export function escapeSingleQuotation(itemValue) {
  return itemValue.replace(/'/g, "\\\\'");
}

export function convertStringValueForSql(itemValue) {
  let name = itemValue;
  if (typeof name !== 'string') {
    return name;
  }
  name = itemValue.trim();
  if (
    name.startsWith('/') ||
    name.indexOf(' ') !== -1 ||
    name.indexOf('\t') !== -1 ||
    name.indexOf('\r') !== -1 ||
    name.indexOf('\n') !== -1 ||
    name.indexOf(',') !== -1
  ) {
    if (
      (name.startsWith("'") && name.endsWith("'")) ||
      (name.startsWith('"') && name.endsWith('"'))
    ) {
      name = name.substr(1, name.length - 2);
    }
    if (name.indexOf("'") === -1) return `'${name}'`;
    else if (name.indexOf('"') === -1) return `"${name}"`;
    return `'${name.replace(/'/g, "\\'")}'`;
  }
  return name;
}

export function objectArrayToTree(arr, key = 'name', sep = '.', options) {
  if (!arr || !arr.length) return [];
  const tree = [];
  toTree(tree, arr, key, sep, 0, options || {});
  return tree;
}

export function toTree(arr, brr, key, sep, n, options) {
  const { isReverse, disabledProps } = options;
  const treeNodes = {};
  const keyObj = {};
  const infos = {};
  // for (const item of brr) {
  brr.forEach(item => {
    let names = item.names;

    if (!names) {
      let v = item[key];
      if (_.isString(v)) {
        if (v.length === 0) {
          // continue;
        }
      } else {
        v = v.toString();
        if (v.length === 0) {
          // continue;
        }
        item[key] = v;
      }
      names = isReverse ? v.split(sep).reverse() : v.split(sep);
    }
    if (!item.names) {
      item.names = names;
    }
    const name = names[n];
    if (!name) return;
    const node = treeNodes[name];
    if (!node) {
      const keys = names.slice(0, n + 1);
      keyObj[name] = isReverse ? keys.reverse().join(sep) : keys.join(sep);
      treeNodes[name] = [item];
      infos[name] = item;
    } else {
      node.push(item);
    }
  });
  for (const nodeId in treeNodes) {
    const treeNode = { name: nodeId, key: keyObj[nodeId] || nodeId, children: [] };
    if (!disabledProps) {
      treeNode.props = infos[nodeId];
    }
    arr.push(treeNode);
    toTree(treeNode.children, treeNodes[nodeId], nodeId, sep, n + 1, options);
  }
}

function findNodePath(n1, n2, nodes, paths, getConnectedNodes, nodesTag) {
  if (n1 === n2) {
    return true;
  }
  const ns = getConnectedNodes(n1);
  for (const n of ns) {
    if (nodesTag[n]) continue;
    nodesTag[n] = true;
    nodes.push(n);
    paths.push({ from: n1, to: n });
    if (findNodePath(n, n2, nodes, paths, getConnectedNodes, nodesTag)) {
      return true;
    }
    nodes.pop();
    paths.pop();
  }
}

export function findPathsByNode(n1, n2, getConnectedNodes) {
  const result = {
    targetNodes: [n1, n2],
    nodes: [n1],
    paths: [],
  };

  if (n1 === n2) {
    result.paths.push({ from: n1, to: n1 });
    return result;
  }
  if (!findNodePath(n1, n2, result.nodes, result.paths, getConnectedNodes, {})) {
    result.nodes = [];
  }

  return result;
}

export function findPathsByNodeFilter(graph, filterNode, getConnectedNodes) {
  const { nodes = [] } = graph;
  const targetNodes = [];

  for (const n of nodes) {
    if (filterNode(n)) {
      targetNodes.push(n);
    }
    if (targetNodes.length === 2) {
      break;
    }
  }
  if (targetNodes.length !== 2) {
    return false;
  }

  return findPathsByNode(targetNodes[0].id, targetNodes[1].id, getConnectedNodes);
}

export function getMultiInstanceDevIp(devId) {
  if (devId && window.systemParams && window.systemParams.MultiInstance) {
    const checkId = devId.trim();
    let instanceIp = window.systemParams.MultiInstance[checkId];
    if (instanceIp) return instanceIp;
    for (const k in window.systemParams.MultiInstance) {
      instanceIp = window.systemParams.MultiInstance[k];
      if (instanceIp === checkId) {
        return instanceIp;
      }
    }
    return false;
  }
  return false;
}

export function getOfflineTaskInfo(offlineID) {
  if (offlineID && window.allOfflineTask && window.allOfflineTask.length > 0) {
    const offlineInfo = window.allOfflineTask.find(item => item.task_id === offlineID);
    return offlineInfo;
  }
  return false;
}

export function convertToInt(v, def) {
  const vs = parseInt(v, 10);

  if (_.isUndefined(def)) return vs;
  return isNaN(vs) ? def : vs;
}

export function decodeBase64(v, justDecode) {
  if (!v) return '';
  const middle = Base64.decode(v.replace(/[^A-Za-z0-9\+\/\=]/g, ''));
  return justDecode ? middle : objToStrValue(middle);
}

export function isJson(data) {
  return (_.isObject(data) && !data.$$typeof) || _.isArray(data);
}

export function exportOtherFile(content, fileName) {
  const blob = new Blob([content]);
  const aHtml = document.createElement('a');
  aHtml.href = window.URL.createObjectURL(blob);
  aHtml.download = fileName;
  aHtml.click();
  window.URL.revokeObjectURL(aHtml.href);
}

export function renderByteStr(value) {
  if (!value || String(value) === '0') {
    return `0 字节`;
  } else {
    return `${numeral(value).format('0,0')} 字节`;
  }
}

export function countProtoNum(params) {
  const { data = [], type, unit, isShowPopList } = params;
  const isProto = type === 'proto';
  const newData = data.filter(item => (isProto ? item.type !== 'ct' : item.type === 'ct'));
  const num = newData.length;
  if (newData.length > 0 && isShowPopList) {
    // return (
    //   <PopupProtoList
    //     noTourSite
    //     dataSource={newData}
    //     filterSource
    //     source={sessionId}
    //     {...popListOtherProps}
    //   >
    //     <span style={{ cursor: 'pointer' }}>{`${num}${unit}`}</span>
    //   </PopupProtoList>
    // );
  } else {
    return <span style={{ cursor: 'pointer' }}>{`${num}${unit}`}</span>;
  }
}

export function getSameElems(arr1, arr2) {
  const diffArr = _.difference(arr1, arr2);
  const sameArr = _.difference(arr1, diffArr);
  return sameArr;
}

export function isValidPageSize(pageSize) {
  return pageSize && pageSize > 0 && !isNaN(pageSize);
}

const imageBackgrounds = {
  default: [7, 21, 48],
  highlight: [255, 255, 255],
  greenTheme: [32, 31, 43],
};

export function downloadImageByCanvas(id, name, fileType, bgColorOption) {
  const idDom = document.getElementById(id);
  if (!idDom) return false;
  const cans = idDom.getElementsByTagName('canvas')[0];
  if (!cans) return false;
  const ctx = cans.getContext('2d');
  const imageData = ctx.getImageData(0, 0, cans.width, cans.height);
  const backgroundConfig = (bgColorOption || imageBackgrounds)[config.selectedTheme];
  if (backgroundConfig) {
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        imageData.data[i] = backgroundConfig[0];
        imageData.data[i + 1] = backgroundConfig[1];
        imageData.data[i + 2] = backgroundConfig[2];
        imageData.data[i + 3] = 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  cans.toBlob(blob => {
    const aDom = document.createElement('a');
    document.body.appendChild(aDom);
    let fileSuffix = '.jpg';
    if (fileType) {
      fileSuffix = `.${fileType}`;
    }
    aDom.download = name + fileSuffix;
    aDom.href = window.URL.createObjectURL(blob);
    aDom.click();
  });
}

export function objToStrValue(value) {
  if (_.isString(value)) return value;
  if (value === undefined || value === null) return '';
  const ctor = value.constructor;
  if (ctor === Buffer || ctor === ArrayBuffer) {
    const cv = ctor === ArrayBuffer ? Buffer.from(value) : value;
    return (new TextDecoder('utf-8')).decode(cv);
  }
  return value.toString();
}

export function sortByNet(a, b) {
  if (!a.key || !b.key) return false;
  const neta = a.key.split('/');
  const netb = b.key.split('/');

  const ipInfoa = _ip.subnet(neta[0], neta[1]);
  const ipInfob = _ip.subnet(netb[0], netb[1]);
  return _ip.toLong(ipInfoa.networkAddress) - _ip.toLong(ipInfob.networkAddress);
}

export function exportFileByWeb(data, type, fileName) {
  if (!data || !type || !fileName) return false;
  const blob = new Blob([data], { type })
  const event = document.createEvent('MouseEvents');
  const a = document.createElement('a');
  a.download = fileName;
  const href = window.URL.createObjectURL(blob);
  a.href = href;
  a.dataset.downloadurl = [type, a.download, a.href].join(':');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(event);
  window.URL.revokeObjectURL(href)
}

export function latLngFixed(value) {
  if (value === 0 || value === '0') {
    return 0;
  } else if (value && _.isString(value)) {
    if (_.isNumber(Number(value))) {
      return Number(value).toFixed(3);
    } else {
      return ''
    }
  } else if (value && _.isNumber(value)) {
    return value.toFixed(3);
  }
  return ''
}

export function calculateTimeDifference(time) {
  if (!time) return false;
  const currentDate = new Date();
  const dataStr = moment(time).unix();
  const date = new Date(dataStr * 1000);
  const days = (parseInt(currentDate - date, 10) / 1000 / 60 / 60 / 24);
  const configOnLineRouterDay = config.onLineRouterDay || 7;
  if (days >= 0 && days <= configOnLineRouterDay) {
    return true;
  } else {
    return false;
  }
}

function initSvgConfig() {
  const C2S = window.C2S;
  if (!C2S) return false;
  C2S.prototype.init = 1;
  C2S.prototype.circle = CanvasRenderingContext2D.prototype.circle;
  C2S.prototype.square = CanvasRenderingContext2D.prototype.square;
  C2S.prototype.triangle = CanvasRenderingContext2D.prototype.triangle;
  C2S.prototype.triangleDown = CanvasRenderingContext2D.prototype.triangleDown;
  C2S.prototype.star = CanvasRenderingContext2D.prototype.star;
  C2S.prototype.diamond = CanvasRenderingContext2D.prototype.diamond;
  C2S.prototype.roundRect = CanvasRenderingContext2D.prototype.roundRect;
  C2S.prototype.ellipse_vis = CanvasRenderingContext2D.prototype.ellipse_vis;
  C2S.prototype.database = CanvasRenderingContext2D.prototype.database;
  C2S.prototype.arrowEndpoint = CanvasRenderingContext2D.prototype.arrowEndpoint;
  C2S.prototype.circleEndpoint = CanvasRenderingContext2D.prototype.circleEndpoint;
  C2S.prototype.dashedLine = CanvasRenderingContext2D.prototype.dashedLine;
}

export function exportSvg(network, options, name) {
  window.svgFill = svgFile[config.selectedTheme] || '#FFF'
  const svgStyle = { width: window.innerWidth, height: window.innerHeight, embedImages: true };
  const C2S = window.C2S;
  if (!C2S) return message.error('导出异常，请联系管理员');
  if (C2S.prototype.init !== 1) {
    initSvgConfig();
  }
  const ctx = new C2S(svgStyle);
  const canvasProto = network.canvas.__proto__;
  const currentGetContext = canvasProto.getContext;
  canvasProto.getContext = () => { return ctx; }

  const svgOptions = {
    nodes: {
      shapeProperties: {
        interpolation: false, // so images are not scaled svg will get full image
      },
      scaling: { label: { drawThreshold: 0 } },
      font: { color: '#000000' },
    },
    edges: {
      scaling: { label: { drawThreshold: 0 } },
    },
  };
  network.setOptions(svgOptions);
  network.redraw();
  network.setOptions(options);
  canvasProto.getContext = currentGetContext;
  ctx.waitForComplete(() => {
    const svg = ctx.getSerializedSvg();
    showSvg(svg, name);
  });
}

function showSvg(svg, name) {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
  openBlob(svgBlob, name || "network.svg");
}

function openBlob(blob, fileName) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // blobToDataURL(blob, function(dataurl){window.open(dataurl);});
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    let a = document.getElementById("blobLink");
    if (!a) {
      a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("id", "blobLink");
      a.style = "display: none";
    }
    const data = window.URL.createObjectURL(blob);
    a.href = data;
    a.download = fileName;
    a.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, config.timerInterval_1);
  }
}

export function saveVisToHtml(data, positions, options, fileName) {
  const background = svgFile[config.selectedTheme] || '#FFF';
  const host = window.location.hostname !== 'localhost' ? `http://${window.location.hostname}` : 'http://192.168.0.5';
  const htmlTemplate = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fileName}</title>
        <script type="text/javascript" src="${host}/yuantek_others/vis.js?hashTime"></script>
      <body>
        <div id="mynetwork" style="width:100vw;height:100vh;background:${background};"></div>
        <link rel="stylesheet/less" type="text/css" href="${host}/yuantek_others/color.less?hashTime" />
      </body>
      <script type="text/javascript">
        var data = ${JSON.stringify(data || {})};
        var options = ${JSON.stringify(options || {})};
        var positions = ${JSON.stringify(positions || {})};
        var container = document.getElementById('mynetwork');
        const nodes = data.nodes || [];
        for (const i of nodes) {
          if (positions[i.id]) {
            i.x = positions[i.id].x;
            i.y = positions[i.id].y;
          }
        }
        const relationData = {nodes, edges: data.edges || []}
        network = new vis.Network(container, data, options);
        setTimeout(() => {
          network.setOptions({physics: false})
        }, config.timerInterval3)
      </script>
    </html>
    <style>
      .vis-network {
        outline: none !important;
      }
    </style>
  `

  exportFileByWeb(htmlTemplate, 'text/html', fileName + '.html')
}


export function getExportFileName(prefix) {
  return `${prefix}_${getNowTime()}`;
}

let charsets = false;

export function getCharsets() {
  if (!charsets) {
    charsets = [{
      "value": "raw",
      "label": "原始内容",
    }, {
      "value": "utf-8",
      "label": "UTF-8",
    }, {
      "value": "gbk",
      "label": "GBK",
    }, {
      "value": "gb2312",
      "label": "GBK2312",
    }, {
      "value": "big-5",
      "label": "BIG-5",
    }, {
      "value": "hz",
      "label": "HZ",
    }, {
      "value": "euc-tw",
      "label": "EUC-TW",
    }, {
      "value": "euc-jp",
      "label": "EUC-JP",
    }, {
      "value": "shift_jis",
      "label": "Shift_JIS",
    }, {
      "value": "iso-2022-jp",
      "label": "ISO-2022-JP",
    }, {
      "value": "jis",
      "label": "JIS",
    }, {
      "value": "uhc",
      "label": "UHC",
    }, {
      "value": "euc-kr",
      "label": "EUC-KR",
    }, {
      "value": "iso-2022-kr",
      "label": "ISO-2022-KR",
    }, {
      "value": "cp936",
      "label": "CP936",
    }, {
      "value": "cp950",
      "label": "CP950",
    }, {
      "value": "koi8-r",
      "label": "KOI8-R",
    }, {
      "value": "koi8-u",
      "label": "KOI8-U",
    }, {
      "value": "utf-7",
      "label": "UTF-7",
    }, {
      "value": "utf-16",
      "label": "UTF-16",
    }, {
      "value": "utf-16be",
      "label": "UTF-16BE",
    }, {
      "value": "utf-16le",
      "label": "UTF-16LE",
    }, {
      "value": "utf-32",
      "label": "UTF-32",
    }, {
      "value": "utf-32be",
      "label": "UTF-32BE",
    }, {
      "value": "utf-32le",
      "label": "UTF-32LE",
    }, {
      "value": "cp1251",
      "label": "CP1251",
    }, {
      "value": "cp1252",
      "label": "CP1252",
    }, {
      "value": "iso-8859-1",
      "label": "ISO-8859-1",
    }];
  }
  return charsets;
}

let codeType = false;

export function getCodeType() {
  if (!codeType) {
    codeType = [{
      "value": "binary",
      "label": "默认",
    }, {
      "value": "base64",
      "label": "Base64",
    }, {
      "value": "hex",
      "label": "十六进制",
    }];
  }
  return codeType;
}

export function getDistanceByOffset(distance, offset) {
  if (_.isNumber(distance)) {
    return distance - offset;
  }
  const v = distance.split(' - ');
  const n = parseFloat(v[1], 10);
  return `${v[0]} - ${n + offset}px)`;
}

export function escapeExcelValue(value) {
  if (!value || !_.isString(value)) {
    return value;
  }

  const hasQuota = value.includes('"');
  if (hasQuota || value.includes(',') || value.includes("\r") || value.includes("\n")) {
    let v = value;
    if (hasQuota) v = value.replace(/\"/g, '""');

    return '"' + v + '"';
  }

  return value;
}

export function getTableScrollWidth(columns) {
  let normalWidth = 0;
  if (!_.isEmpty(columns) && _.isArray(columns)) {
    for (const item of columns) {
      normalWidth += Number(item.width);
    }
  }
  const finnalWidth = normalWidth + 50;
  return finnalWidth;
}

export function getDates(v) {
  if (!v) return '';
  const data = v.replace(/\b(0+)/gi, '');
  return data;
}

export function getFreeTime(start, end) {
  if (!start || !end) return '';
  const diff = calcTimeDiff(start, end);
  let times = '';
  if (diff[0]) {
    const days = diff[0].split('days');
    times += days[0] + '天';
  }
  if (diff[1]) {
    const dates = diff[1].split(':');
    if (dates[0].indexOf('-') !== -1) return times;
    const h = getDates(dates[0]);
    const m = getDates(dates[1]);
    const s = getDates(dates[2]);
    if (h) times += `${h}小时`;
    if (m) times += `${m}分钟`;
    if (s) {
      times += s < 10 ? `0${s}秒` : `${s}秒`;
    } else {
      times += '00秒';
    }
  }
  return times;
}
export function ip2int(ipStr) {
  const ip = ipStr.split(".");
  return (parseInt(ip[0], 10) << 24) | (parseInt(ip[1], 10) << 16) | (parseInt(ip[2], 10) << 8) | parseInt(ip[3], 10);
}

export function getRandomRgbColor(opicity) {
  const rValue = Math.floor(Math.random() * 255);
  const gValue = Math.floor(Math.random() * 255);
  const bValue = Math.floor(Math.random() * 255);
  return `rgba(${rValue}, ${gValue}, ${bValue}, ${opicity || 1})`;
}

function numCmpAB(a, b) {
  return Number(a) - Number(b);
}

function numCmpBA(a, b) {
  return Number(b) - Number(a);
}

function strCmpAB(a, b) {
  return String(a).localeCompare(String(b));
}

function strCmpBA(a, b) {
  return String(b).localeCompare(String(a));
}

function createNumCmpAB(key) {
  return (a, b) => Number(a[key]) - Number(b[key]);
}

function createNumCmpBA(key) {
  return (a, b) => Number(b[key]) - Number(a[key]);
}

function createStrCmpAB(key) {
  return (a, b) => String(a[key]).localeCompare(String(b[key]));
}

function createStrCmpBA(key) {
  return (a, b) => String(b[key]).localeCompare(String(a[key]));
}

export function sorterArrData(data, dataType, sorterType, sorterKey, sorterOrder) {
  const finalData = _.cloneDeep(data);
  if (dataType === 'arr') {
    if (sorterType === 'num') {
      if (sorterOrder === 'desc') {
        finalData.sort(numCmpBA);
      } else {
        finalData.sort(numCmpAB);
      }
    } else if (sorterType === 'string') {
      if (sorterOrder === 'desc') {
        finalData.sort(strCmpBA);
      } else {
        finalData.sort(strCmpAB);
      }
    }
  } else if (dataType === 'arrObject') {
    if (sorterType === 'num') {
      if (sorterOrder === 'desc') {
        finalData.sort(createNumCmpBA(sorterKey));
      } else {
        finalData.sort(createNumCmpAB(sorterKey));
      }
    } else if (sorterType === 'string') {
      if (sorterOrder === 'desc') {
        finalData.sort(createStrCmpBA(sorterKey));
      } else {
        finalData.sort(createStrCmpAB(sorterKey));
      }
    }
  }

  return finalData;
}

export function getByteSizeBps(s, value, unit) {
  if (!s) {
    return `0${unit}`;
  }
  if (s < 1024) {
    return s + (unit ? ` ${unit}` : ' bps');
  } else if (s >= 1024 && s < 1024 * 1024) {
    if (value) return (s / 1024).toFixed(2) + (unit ? ` K${unit}` : ' Kbps');
    return (s / 1024 * 8).toFixed(2) + (unit ? ` K${unit}` : ' Kbps');
  } else if (s >= 1024 * 1024) {
    if (value) return (s / 1024 / 1024).toFixed(2) + (unit ? ` M${unit}` : ' Mbps');
    return (s / 1024 / 1024 * 8).toFixed(2) + (unit ? ` M${unit}` : ' Mbps');
  }
}

const topoLayoutOptions = {
  // 标准
  fastFR: ['快速弹性布局', '采用力学模型、碰撞检测处理，性能优异，适用于大规模网络布局'],
  layerCircle: ['多层圆形布局'],
  concentric: ['中心圆形布局'],
  singleCirlce: ['单圆形布局'],
  dualCirlce: ['双圆环布局', '指定圆环内部或外部的节点个数，按度进行排列'],
  arf: ['球面网络布局', '网络布局在一个圆球面上分布'],
  sphere: ['球体布局'],
  kk: ['关系路径布局', '使用最短路径进行布局，效果较好，适用于中小规模网络'],
  tree: ['标准树形布局', '标准树形结构，一个或多个根节点'],
  radiatree: ['径向树形布局'],
  hive: ['放射性布局'],
  grid: ['矩形布局'],
  // 扩展
  frDirect: ['快速布局', '采用力学模型实现'],
  spring2: ['弹簧力学布局', '对弹簧模型及力模型的合并优化'],
  fr: ['经典网络布局', '使用与中小规模的网络布局，效果优异'],
  noverlap: ['节点不重叠布局', '调整使节点互相不重叠'],
  layered: ['分层布局'],
  balloon: ['圆形树形布局'],
  topoCircle: ['对称树形布局', '相同子节点时的对称树形布局'],
  fruchtermanReingold: ['FR力导向布局', '通过FruchtermanReingold算法实现的力导向布局'],
  d3force: ['D3力导向布局', '通过d3force算法实现的力导向布局'],
  // gather	群体分组布局，节点需要指定cluster属性后按该属性分组
};

export function getTopoLayoutOptions() {
  return topoLayoutOptions;
}

export function int2ip(num) {
  return [((num >>> 24) >>> 0).toString(),
  (((num << 8) >>> 24) >>> 0).toString(),
  ((num << 16) >>> 24).toString(),
  ((num << 24) >>> 24).toString(),
  ].join('.');
}

export function int2ipReverse(num) {
  return [((num >>> 24) >>> 0).toString(),
  (((num << 8) >>> 24) >>> 0).toString(),
  ((num << 16) >>> 24).toString(),
  ((num << 24) >>> 24).toString(),
  ].reverse().join('.');
}

export function toIpString(t) {
  if (config.isStrIpv4) return t;
  if (_.isInteger(t)) return int2ip(t);
  if (!t || t.indexOf('.') !== -1) return t;
  if (isNaN(Number(t))) return t;
  return int2ip(parseInt(t, 10));
}

export function toIpStringReverse(t) {
  if (_.isInteger(t)) return int2ipReverse(t);
  if (isNaN(Number(t))) return t;
  return int2ipReverse(parseInt(t, 10));
}

export function toHex(i) {
  let v = _.isString(i) ? parseInt(i, 10) : i;

  if (isNaN(v)) return i;

  v = v.toString(16);
  // 判断是否为偶数个数，如果不是，前面需要补0
  if (v.length & 0x01) v = '0' + v;

  return `0x${v}`;
}

export function toHexString(i) {
  let v = _.isString(i) ? parseInt(i, 10) : i;

  if (isNaN(v)) return i;

  v = v.toString(16);
  // 判断是否为偶数个数，如果不是，前面需要补0
  if (v.length & 0x01) v = '0' + v;

  return `0x${v}(${i})`;
}

export function convertToMacString(value) {
  return _.isNumber(value) ? value.toString(16) : value;
}

export function convertEsHighlightHtml(v) {
  if (!v || v.length === 0) return '';
  const isMulti = _.isArray(v);
  const rv = isMulti ? v : [v];

  for (let i = 0, cnt = rv.length; i < cnt; i += 1) {
    rv[i] = rv[i].replace(/<hit>/ig, '===hit===').replace(/<\/hit>/ig, '===ehit===').
      replace(/</ig, '&gt;').replace(/>/ig, '&lt;').
      replace(/===hit===/ig, '<hit>').replace(/===ehit===/ig, '</hit>').replace(/\n/ig, '<br />');
  }

  return isMulti ? rv : rv[0];
}

export function convertMultiLineHtml(v) {
  if (!v || v.length === 0) return '';
  const isMulti = _.isArray(v);
  const rv = isMulti ? v : [v];

  for (let i = 0, cnt = rv.length; i < cnt; i += 1) {
    rv[i] = rv[i].replace(/</ig, '&gt;').replace(/>/ig, '&lt;').replace(/\n/ig, '<br />');
  }

  return isMulti ? rv : rv[0];
}

export function getEnToCnCountries() {
  return {
    'Afghanistan': '阿富汗',
    'Singapore': '新加坡',
    'Angola': '安哥拉',
    'taiwan': '中国台湾',
    'Albania': '阿尔巴尼亚',
    'United Arab Emirates': '阿联酋',
    'Argentina': '阿根廷',
    'Armenia': '亚美尼亚',
    'French Southern and Antarctic Lands': '法属南半球和南极领地',
    'Australia': '澳大利亚',
    'Austria': '奥地利',
    'Azerbaijan': '阿塞拜疆',
    'Burundi': '布隆迪',
    'Belgium': '比利时',
    'Benin': '贝宁',
    'Burkina Faso': '布基纳法索',
    'Bangladesh': '孟加拉国',
    'Bulgaria': '保加利亚',
    'The Bahamas': '巴哈马',
    'Bosnia and Herzegovina': '波黑',
    'Belarus': '白俄罗斯',
    'Belize': '伯利兹',
    'Bermuda': '百慕大',
    'Bolivia': '玻利维亚',
    'Brazil': '巴西',
    'Brunei': '文莱',
    'Bhutan': '不丹',
    'Botswana': '博茨瓦纳',
    'Central African Republic': '中非',
    'Canada': '加拿大',
    'Switzerland': '瑞士',
    'Chile': '智利',
    'China': '中国',
    'Ivory Coast': '科特迪瓦',
    'Cameroon': '喀麦隆',
    'Democratic Republic of the Congo': '刚果民主共和国',
    'Congo': '刚果共和国（布）',
    'Colombia': '哥伦比亚',
    'Costa Rica': '哥斯达黎加',
    'Cuba': '古巴',
    'Northern Cyprus': '北塞浦路斯',
    'Cyprus': '塞浦路斯',
    'Czech Republic': '捷克',
    'Germany': '德国',
    'Djibouti': '吉布提',
    'Denmark': '丹麦',
    'Dominican Republic': '多米尼加',
    'Algeria': '阿尔及利亚',
    'Ecuador': '厄瓜多尔',
    'Egypt': '埃及',
    'Eritrea': '厄立特里亚',
    'Spain': '西班牙',
    'Estonia': '爱沙尼亚',
    'Ethiopia': '埃塞俄比亚',
    'Finland': '芬兰',
    'Fiji': '斐济',
    'Falkland Islands': '福克兰群岛',
    'France': '法国',
    'Gabon': '加蓬',
    'United Kingdom': '英国',
    'Georgia': '格鲁吉亚',
    'Ghana': '加纳',
    'Guinea': '几内亚',
    'Gambia': '冈比亚',
    'Guinea Bissau': '几内亚比绍',
    'Equatorial Guinea': '赤道几内亚',
    'Greece': '希腊',
    'Greenland': '格陵兰',
    'Guatemala': '危地马拉',
    'French Guiana': '法属圭亚那',
    'Guyana': '圭亚那',
    'Honduras': '洪都拉斯',
    'Croatia': '克罗地亚',
    'Haiti': '海地',
    'Hungary': '匈牙利',
    'Indonesia': '印度尼西亚',
    'India': '印度',
    'Ireland': '爱尔兰',
    'Iran': '伊朗',
    'Iraq': '伊拉克',
    'Iceland': '冰岛',
    'Israel': '以色列',
    'Italy': '意大利',
    'Jamaica': '牙买加',
    'Jordan': '约旦',
    'Japan': '日本',
    'Kazakhstan': '哈萨克斯坦',
    'Kenya': '肯尼亚',
    'Kyrgyzstan': '吉尔吉斯',
    'Cambodia': '柬埔寨',
    'Korea': '韩国',
    'Kosovo': '科索沃',
    'Kuwait': '科威特',
    'Laos': '老挝',
    'Lebanon': '黎巴嫩',
    'Liberia': '利比里亚',
    'Libya': '利比亚',
    'Sri Lanka': '斯里兰卡',
    'Lesotho': '莱索托',
    'Lithuania': '立陶宛',
    'Luxembourg': '卢森堡',
    'Latvia': '拉脱维亚',
    'Morocco': '摩纳哥',
    'Moldova': '摩尔多瓦',
    'Madagascar': '马达加斯加',
    'Mexico': '墨西哥',
    'Macedonia': '马其顿',
    'Mali': '马里',
    'Myanmar': '缅甸',
    'Montenegro': '黑山',
    'Mongolia': '蒙古',
    'Mozambique': '莫桑比克',
    'Mauritania': '毛里塔尼亚',
    'Malawi': '马拉维',
    'Malaysia': '马来西亚',
    'Namibia': '纳米比亚',
    'New Caledonia': '新喀里多尼亚',
    'Niger': '尼日尔',
    'Nigeria': '尼日利亚',
    'Nicaragua': '尼加拉瓜',
    'Netherlands': '荷兰',
    'Norway': '挪威',
    'Nepal': '尼泊尔',
    'New Zealand': '新西兰',
    'Oman': '阿曼',
    'Pakistan': '巴基斯坦',
    'Panama': '巴拿马',
    'Peru': '秘鲁',
    'Philippines': '菲律宾',
    'Papua New Guinea': '巴布亚新几内亚',
    'Poland': '波兰',
    'Puerto Rico': '波多黎各',
    'North Korea': '朝鲜',
    'Portugal': '葡萄牙',
    'Paraguay': '巴拉圭',
    'Qatar': '卡塔尔',
    'Romania': '罗马尼亚',
    'Russia': '俄罗斯',
    'Rwanda': '卢旺达',
    'Western Sahara': '西撒哈拉',
    'Saudi Arabia': '沙特阿拉伯',
    'Sudan': '苏丹',
    'South Sudan': '南苏丹',
    'Senegal': '塞内加尔',
    'Solomon Islands': '所罗门群岛',
    'Sierra Leone': '塞拉利昂',
    'El Salvador': '萨尔瓦多',
    'Somaliland': '索马里兰',
    'Somalia': '索马里',
    'Republic of Serbia': '塞尔维亚',
    'Suriname': '苏里南',
    'Slovakia': '斯洛伐克',
    'Slovenia': '斯洛文尼亚',
    'Sweden': '瑞典',
    'Swaziland': '斯威士兰',
    'Syria': '叙利亚',
    'Chad': '乍得',
    'Togo': '多哥',
    'Thailand': '泰国',
    'Tajikistan': '塔吉克斯坦',
    'Turkmenistan': '土库曼斯坦',
    'East Timor': '东帝汶',
    'Trinidad and Tobago': '特里尼达和多巴哥',
    'Tunisia': '突尼斯',
    'Turkey': '土耳其',
    'Tanzania': '坦桑尼亚',
    'Uganda': '乌干达',
    'Ukraine': '乌克兰',
    'Uruguay': '乌拉圭',
    'United States': '美国',
    'Uzbekistan': '乌兹别克斯坦',
    'Venezuela': '委内瑞拉',
    'Vietnam': '越南',
    'Vanuatu': '瓦努阿图',
    'West Bank': '西岸',
    'Yemen': '也门',
    'South Africa': '南非',
    'Zambia': '赞比亚',
    'Zimbabwe': '津巴布韦',
    'Mauritius': '毛里求斯',
    'Guam': '关岛',
    'Palestine': '巴勒斯坦',
    'Malta': '马耳他',
    'Seychelles': '塞舌尔',
    'Cape Verde': '佛得角',
    'Bahrain': '巴林',
    'Grenada': '格林纳达',
    'Micronesia': '密克罗尼西亚',
    'Barbados': '巴巴多斯',
    'Liechtenstein': '列支敦士登',
    'Andorra': '安道尔',
    'Dominica': '多米尼克',
    'American Samoa': '美属萨摩亚',
    'Samoa': '萨摩亚',
  };
}

export function createFormAndSubmit(id, params, url, attrs) {
  const body = document.getElementById('functional');
  if (!body) return;
  let post = '';
  let form = '';
  const formAttrs = {
    method: 'POST',
    id,
    action: url,
    target: '_blank',
    ...attrs,
  };

  for (const k in formAttrs) {
    form += ` ${k}="${formAttrs[k]}"`;
  }
  for (const k in params) {
    const v = params[k].toString().replace(/"/ig, '&quot;');
    post += `<input name="${k}" value="${v}" type="hidden" />`;
  }
  body.innerHTML = `<form${form}>${post}</form$>`;
  const o = document.getElementById(id);
  o.submit();
  o.remove();
}

let sqlKeywordMap = false;

export function convertSqlKeyword(key) {
  if (!sqlKeywordMap) {
    const keys = config.sqlKeywords || ['exists', 'select', 'from', 'distinct', 'having', 'in', 'on', 'union'];
    sqlKeywordMap = {};
    for (const k of keys) {
      sqlKeywordMap[k] = '`' + k + '`';
    }
  }
  return sqlKeywordMap[key] || key;
}

export function toBoolean(value, def = true) {
  if (value === true || value === false) return value;
  if (value === undefined || value === 'undefined' || value === 'NaN') return def;
  const v = String(value).toLowerCase();
  return v === 'true' || v === '1' || v === 'on';
}

export function toInt(v, def = 0, min = -1) {
  if (_.isUndefined(v) || v === 'undefined' || v === 'NaN') {
    return def;
  }

  const tv = parseInt(v.toString(), 10);

  if (isNaN(tv)) {
    return def;
  }
  if (tv < min) {
    return def;
  }

  return tv;
}

export function keywordToFuzzySearch(keyword) {
  const t = keyword.trim();
  if (t.length > 0) {
    if (t.indexOf(' ') !== -1) {
      const items = t.split(' ');
      const search = [];
      for (const item of items) {
        const v = item.trim();
        if (v) {
          search.push(`*${item}*`);
        }
      }
      return search;
    }
    return `*${t}*`;
  }
  return '';
}

export function convertTimeSpan(delta) {
  let t = _.isString(delta) ? parseInt(delta, 10) : delta;
  const ms = t % 1000;

  t = Math.floor(t / 1000);

  const v = numeral(t).format('00:00:00');

  return ms > 0 ? `${v}.${ms}` : v;
}

export function convertTimeRangeSeconds(delta) {
  const t = _.isString(delta) ? parseInt(delta, 10) : delta;

  return numeral(t).format('00:00:00');
}

export function turnToStringArray(string) {
  if (!string) return [];
  const array = string.split(',');
  const newArray = [];
  for (const value of array) {
    newArray.push(`"${value}"`)
  }
  return newArray;
}

export function getBlob(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }
    xhr.send()
  })
}

export function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename)
  } else {
    const link = document.createElement('a');
    const body = document.querySelector('body');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href)
  }
}

export function downloadCros(url, filename) {
  getBlob(url).then(blob => {
    saveAs(blob, filename)
  })
}

export function getDownloadParams(type, curTn) {
  const nsmDownloadParams = {
    http: { file_suffix_fields: 'http.content_type_resp', download_fields: 'http.respbody', dump_field: 'http.respbody' },
    smb: { file_suffix_fields: 'smb.filename', download_fields: 'smb.attach_content' },
    ftp: { file_suffix_fields: 'ftp.filename', download_fields: 'ftp.file_content' },
    credent: { download_fields: 'x509.raw', file_suffix: 'cer' },
    mail: {
      eml: { download_fields: 'email.body', file_suffix_fields: 'eml', field: 'file_suffix' },
      txt: { download_fields: 'email.body_txt', file_suffix_fields: 'txt', field: 'file_suffix' },
      file: { download_fields: 'email.attach_content', file_suffix_fields: 'email.filename' },
    },
  }
  const satDownloadParams = {
    http: { file_suffix_fields: 'http.http_res_head.response_conType', download_fields: 'http.http_res_body.response_content', dump_field: 'http.http_res_body.response_content' },
    smb: { file_suffix_fields: (config.smbFileNameField || 'smb.fileName'), download_fields: (config.smbFileNameField || 'smb.fileData') },
    ftp: { file_suffix_fields: (config.ftpFileNameField || 'ftp.ftp_filename'), download_fields: (config.ftpFileField || 'ftp.ftp_file_cont') },
    credent: { download_fields: !config.isNsmMetaData && curTn === 'SSL' ? 'ssl.certificate.x509_certificate.raw' : 'x509.raw', file_suffix: 'cer' },
    mail: {
      eml: { download_fields: 'email.eml.raw_eml', file_suffix_fields: 'eml', field: 'file_suffix' },
      txt: { download_fields: 'email.cont_text_info.content_text', file_suffix_fields: 'txt', field: 'file_suffix' },
      file: { download_fields: 'email.attach_info.attach_content', file_suffix_fields: 'email.attach_info.attFileName' },
    },
    httpUri: { file_suffix_fields: 'http.http_res_head.response_conType', download_fields: 'http.http_res_body.response_content', dir_path_field: 'http.http_req_line.req_uri_path,http.http_req_line.URL', req_host: 'http.http_req_head.host' },
  }
  const satDevDownloadParams = {
    http: { file_suffix_fields: 'http.responseHeader.contentType', download_fields: 'http.responseBody.content', dump_field: 'http.responseBody.content' },
    smb: { file_suffix_fields: 'smb.filename', download_fields: 'smb.fileData' },
    ftp: { file_suffix_fields: 'ftp.filename', download_fields: 'ftp.fileContent' },
    credent: { download_fields: 'x509.originalCertificate', file_suffix: 'cer' },
    mail: {
      eml: { download_fields: 'email.eml.imf', file_suffix_fields: 'eml', field: 'file_suffix' },
      txt: { download_fields: 'email.bodyTextInfo.bodyText', file_suffix_fields: 'txt', field: 'file_suffix' },
      file: { download_fields: 'email.attachmentInfo.fileContent', file_suffix_fields: 'email.attachmentInfo.filename' },
    },
    httpUri: { file_suffix_fields: 'http.responseHeader.contentType', download_fields: 'http.responseBody.content', dir_path_field: 'http.requestLine.uriPath,http.requestLine.uri', req_host: 'http.requestHeader.host' },
  }

  if (config.isSatDevMetaData) {
    return satDevDownloadParams[`${type}`];
  } else if (config.isNsmMetaData || config.productType === 'ntm') {
    return nsmDownloadParams[`${type}`];
  } else {
    return satDownloadParams[`${type}`];
  }
}

export function getDistance(height = 500, distance) {
  const dt = distance || 0;
  if (_.isNumber(height)) {
    return height - dt;
  } else if (!height.includes(' - ')) {
    return (parseFloat(height) || 0) - dt;
  }
  const arr = height.split(' - ');
  return `${arr[0]} - ${(parseFloat(arr[1]) || 0) + dt}px)`
}

export function daysBetweenTimestampAndToday(timestamp) {
  let utimestamp
  if (timestamp.length === 10) {
    utimestamp = `${timestamp}000`
  } else {
    utimestamp = timestamp
  }
  const today = new Date();
  const dateFormTimestamp = new Date(utimestamp);
  today.setHours(0, 0, 0, 0);
  dateFormTimestamp.setHours(0, 0, 0, 0)
  const timeDiff = today - dateFormTimestamp;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff === 0 ? 0 : Math.abs(daysDiff)
}

export function daysBetweenTimeAndToday(datetime) {
  const dateFormDateTime = new Date(datetime);
  const now = new Date();
  const timeDiff = now - dateFormDateTime;
  const diffInsconds = Math.floor(timeDiff / 1000);
  const diffInminutes = Math.floor(timeDiff / (1000 * 60));
  const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60));
  const diffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  if (diffInsconds < 60) {
    return `${diffInsconds}秒`
  } else if (diffInminutes < 60) {
    return `${diffInminutes}分钟`
  } else if (diffInHours < 24) {
    return `${diffInHours}小时`
  } else {
    return `${diffInDays}天`
  }
}

export function setAttributeToArray(list, key) {
  if (!list || list.length === 0 || !key) return [];
  const arr = [];
  for (const i of list) {
    if (!_.isUndefined(i[key])) arr.push(i[key])
  }
  return arr;
}

export function initHeatData(data, options = {}) {
  const xData = [];
  const yData = [];
  const vData = [];
  const obj = {};
  const mKey = options.m || 'Mode';
  const vKey = options.v || 'burst_count';
  const yKey = options.y || 'Mod_STR';
  const tKey = options.t || 'timestamp';
  let max;
  let min;
  for (const i of data) {
    xData.push(i[tKey]);
    const modes = i[mKey] || [];
    const item = {}
    for (const m of modes) {
      if (!yData.includes(m[yKey])) {
        yData.push(m[yKey])
      }
      item[m[yKey]] = m;
      if (!obj[i[tKey]]) {
        obj[i[tKey]] = item;
      }
    }
  }
  xData.forEach((i, idx) => {
    yData.forEach((j, jdx) => {
      const vItem = obj[i][j] || {};
      const v = _.isUndefined(vItem[vKey]) ? null : vItem[vKey];
      if (!max) {
        max = v;
      }
      if (v > max) {
        max = v;
      }
      if (!min) {
        min = v;
      }
      if (v < min) {
        min = v;
      }
      const item = [idx, jdx, v, i, vItem, v];

      vData.push(item)

    })
  })
  return { x: xData, y: yData, v: vData, max, min }
}

export function calculateUnique(mata = {}) {
  if ('vsatid' in mata && 'GID' in mata && 'AID' in mata && 'DID' in mata && typeof mata === 'object') {
    let unique = BigInt(0)
    unique |= BigInt(mata?.vsatid);
    unique <<= BigInt(16);
    unique |= BigInt(mata?.GID);
    unique <<= BigInt(16);
    unique |= BigInt(mata?.AID);
    unique <<= BigInt(28);
    unique |= BigInt(mata?.DID);
    return unique.toString()
  }
}

export function addPropertyToItems(arr = [], field, newProp, newValue) {
  return arr?.map((item) => {
    if (item.dataIndex === field) {
      return { ...item, [newProp]: newValue }
    }
    return item
  })
}

export function addRenderToItems(arr = [], fieldConfigMapping = {}) {
  const fieldRenderNameList = Object.entries(fieldConfigMapping).map(([key]) => key)
  return arr?.map((item) => {
    if (fieldRenderNameList.includes(item.dataIndex)) {
      return { ...item, render: fieldConfigMapping[item.dataIndex] }
    }
    return item
  })
}

export function handleThrottle(fn, delay) {
  let flag = true;
  return () => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, delay || 500)
  }
}

export function randomStr(length) {
  let freeDomStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  freeDomStr += 'abcdefghijklmnopqrstuvwxyz';
  freeDomStr += '0123456780-_';
  let str = '';
  for (let i = 0; i < length; i++) {
    const random = Math.floor(Math.random() * freeDomStr.length);
    str += freeDomStr.substring(random, random + 1);
  }
  return str;
}

export function exportDownFileByWeb(data, type, fileName) {
  if (!data || !type || !fileName) return false;
  const blob = new Blob([data], { type })
  const event = document.createEvent('MouseEvents');
  const a = document.createElement('a');
  a.download = fileName;
  const href = window.URL.createObjectURL(blob);
  a.href = href;
  a.dataset.downloadurl = [type, a.download, a.href].join(':');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(event);
  window.URL.revokeObjectURL(href)
}

export function jsonToXml(json, nodeName = 'root') {
  let xml = '';

  // 处理值转义
  const escapeValue = (value) => {
    return String(value).replace(/[<>&'"]/g, (match) => ({
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '\'': '&apos;',
      '"': '&quot;',
    }[match]));
  };

  // 处理数组
  if (Array.isArray(json)) {
    json.forEach(item => {
      xml += jsonToXml(item, nodeName);
    });
    return xml;
  }
  // 处理对象
  else if (typeof json === 'object') {
    let childXml = '';
    for (const key in json) {
      childXml += jsonToXml(json[key], key);
    }
    xml += `<${nodeName}>${childXml}</${nodeName}>`;
  }
  // 处理简单值
  else {
    xml += `<${nodeName}>${escapeValue(json)}</${nodeName}>`;
  }

  return xml;
}

export function handleFilterSortArray(array = [], filterFieled = '', filterMode = '') {
  const targetArray = [...array]
  if (filterFieled && filterMode) {
    if (filterMode === "ascend") {
      targetArray.sort((a, b) => a[filterFieled] - b[filterFieled])
    } else if (filterMode === "descend") {
      targetArray.sort((a, b) => b[filterFieled] - a[filterFieled])
    }
  }
  return targetArray
}

export function newWindow(url, id) {
  const a = document.createElement("a");
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.setAttribute('id', id);
  // 防止反复添加
  if (!document.getElementById(id)) {
    document.body.appendChild(a);
  }
  a.click();
}

export const mergeAttributes = (dataObj, arr) => {
  if (!dataObj || !arr) return
  return arr.map(item => {
    const fieldName = item.field_name
    if (dataObj.hasOwnProperty(fieldName)) {
      return {
        ...item,
        ...dataObj[fieldName],
      }
    }
    return item
  })
}

export const addpendItems = (arrary, count, outerList, type) => {
  const needPort = outerList.length > 1;
  let result = [...arrary]
  result = result.filter(item => !item.field_name || !item.field_name.startsWith('channel_route_output_port_id_list_'))
  for (let i = 0; i <= count; i++) {
    if (type === 'dvb') {
      // result.push({
      //   field_name: `channel_route_output_port_id_list_${i}`,
      //   label: `${needPort ? `输出口${outerList[i]}对应的DVB通道编号` : '通道路由输出口'}`,
      //   type: 'input',
      //   max: true,
      //   required: true,
      //   rules: [
      //     { pattern: new RegExp(/^0$|^[1-9]\d*$/), message: '编号格式必须为正整数或0' },
      //   ],
      //   other: !type ? '' : <Tooltip title={type === 'dvb' ? '输出口对应的DVB卡的通道号，不同的输出口内的通道号不能出现重复，DVB组件内输入口与输出口一一对应，且通道对应关系也保持一致，例如：输入口0的通道号与输出口0对应的通道号一致' : '输出口对应的AD卡通道号，通道号对应输出口要连接的解调、组网程序'}><QuestionCircleOutlined style={{ color: '#ff8b00', marginLeft: '5px', position: 'absolute', right: '-20px', top: '4px' }} /></Tooltip>,
      // })
    } else {
      result.push({
        field_name: `channel_route_output_port_id_list_${i}`,
        label: `${needPort ? `通道路由输出口_输出口${outerList[i]}` : '通道路由输出口'}`,
        type: 'input',
        max: true,
        required: true,
        rules: [
          // { pattern: new RegExp(/^(\d+(,\d+)*)?$/), message: '编号必须以,隔开且不能用空格' },
          { pattern: new RegExp(/^\d+(?:~\d+)?$/), message: '编号格式必须符合1~7且不能出现空格' },
        ],
        other: !type ? '' : <Tooltip title={type === 'dvb' ? '输出口对应的DVB卡的通道号，不同的输出口内的通道号不能出现重复，DVB组件内输入口与输出口一一对应，且通道对应关系也保持一致，例如：输入口0的通道号与输出口0对应的通道号一致' : '输出口对应的AD卡通道号，通道号对应输出口要连接的解调、组网程序'}><QuestionCircleOutlined style={{ color: '#ff8b00', marginLeft: '5px', position: 'absolute', right: '-20px', top: '4px' }} /></Tooltip>,
      })
    }
  }
  return result
}

export const transformArrary = (objects, fields) => {
  return objects.map(obj => {
    const newObj = { ...obj }
    fields.forEach(field => {
      if (field === 'channel_id' && Array.isArray(newObj[field])) {
        newObj[field] = newObj[field]?.map(c => (Number(c)));
      } else if (newObj[field] && typeof newObj[field] === 'string') {
        newObj[field] = newObj[field].split(',').map(item => {
          const trimmedItem = item.trim()
          return isNaN(trimmedItem) ? trimmedItem : parseInt(trimmedItem, 10)
        })
      }
    })
    return newObj
  })
}

export const getChannelPutArrary = (inputArray) => {
  return inputArray.map(item => {
    if (item.hasOwnProperty('channel_route_output_port_id_list_0') || item.hasOwnProperty('channel_route_output_port_id_list_1')) {
      const newObj = {
        ...item,
        channel_route_output_port_id_list: {},
      }
      Object.keys(item).forEach(key => {
        if (key.startsWith('channel_route_output_port_id_list_')) {
          const index = key.split('_').pop()
          const uValues = item.output_port_id_list
          let values

          if(item?.[key]?.includes('~')) {
            const rangeValues = convertRAngeToArr(item?.[key])
            values = rangeValues
          } else if(typeof item?.[key] === 'string' && !item?.[key]?.includes('~')) {
            values = (item?.[key]?.trim() === '' || !item[key]) ? [] : [Number(item?.[key]?.trim())]
          } else if(Array.isArray(item?.[key])) {
            values = item?.[key] || []
          }
          newObj.channel_route_output_port_id_list[`output_port_id_list_${uValues?.[index]}`] = values
          delete newObj[key]
        }
      })
      return newObj
    }
    return item
  })
}

export const converFieldsToNumber = (objectArrary, fields) => {
  return objectArrary.map(obj => {
    const newObj = { ...obj }
    fields.forEach(field => {
      if (newObj.hasOwnProperty(field) && newObj[field] !== null && !isNaN(Number(newObj[field]))) {
        newObj[field] = Number(newObj[field])
      }
    })
    return newObj
  })
}

export const getConnectionsRelectionships = (dataSource, nodeRelationships) => {
  const moduleMap = {}
  nodeRelationships.forEach(relationship => {
    moduleMap[relationship.module_type] = relationship
  })
  const result = []
  dataSource.forEach(item => {
    const sourceType = item.source.split('组件')[0].trim()
    const targetType = item.targetNode.split('组件')[0].trim()
    const sourceModule = moduleMap[sourceType]
    const targetModule = moduleMap[targetType]
    if(sourceModule && targetModule && sourceModule.output_port_id_list && targetModule.input_port_id_list){
      sourceModule.output_port_id_list.forEach(outputPort => {
        targetModule.input_port_id_list.forEach(inputPort => {
          const connectionKey = `${sourceModule.module_type}:输出口${outputPort}`
          const connectionValue = `${targetModule.module_type}:输出口${inputPort}`
          const connectionObj = {}
          connectionObj[connectionKey] = connectionValue
          if(!result.some(obj => JSON.stringify(obj) === JSON.stringify(connectionObj))) {
            result.push(connectionObj)
          }
        })
      })
    }
  })
  return result

}

export const transformObject = (original, disabledKeys=[]) => {
  const transformd = {}
  Object.keys(original).forEach(key => {
    const isDisabled = disabledKeys.includes(key)
    transformd[key] = {
      value: original[key],
      disabled: isDisabled,
      // disabled: true
    }
  })
  return transformd
}


export const mergeArrarysAndDisplay = (obj) => {
  const mergedArray = Object.values(obj).flat()
  return JSON.stringify(mergedArray)
}

export const checkModuleCoverage = (excludeTypes, requiredTypes, moduleArray ) => {
  const observedTypes = new Set(moduleArray.map(item => item.module_type))
  for(const type of requiredTypes) {
    if(!observedTypes.has(type) && !excludeTypes.includes(type)) {
      return false
    }
  }
  return true
}


export const cleanObject = (obj) => {
  if(!obj) return
  for(const key in obj) {
    if(obj[key] === undefined || obj[key] === null) {
      delete obj[key]
    }
  }
  return obj
}

export const giveNullValue = (obj) => {
  if(!obj) return
  for(const key in obj) {
    if(key !== 'max_symbol_rate') {
      if(obj[key] === 'undefined' || obj[key] === null || !obj[key]) {
        obj[key] = ''
     }
    }
  }
  return obj
}

export const convertRAngeToArr = (rangeStr='') => {
  if(typeof rangeStr !== 'string') return
  const rangeStrTrim = rangeStr?.trim()
  const [startStr, endStr] = rangeStrTrim.split('~')
  const start = parseInt(startStr, 10)
  const end = parseInt(endStr, 10)

  if(isNaN(start) || isNaN(end)) {
    return []
  }
  const result = []
  for(let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

export const searchTimesLimit = {
  '1w': {limitArr: ['2w', '1M', '3M', '6M', '1y'], differenceDays: 7, char: '一周'},
  '2w': {limitArr: ['1M', '3M', '6M', '1y'], differenceDays: 14, char: '两周'},
  '1M': {limitArr: ['3M', '6M', '1y'], differenceDays: 30, char: '一个月'},
  '3M': {limitArr: ['6M', '1y'], differenceDays: 90, char: '三个月'},
  '6M': {limitArr: ['1y'], differenceDays: 180, char: '六个月'},
}

export function  getTimeDifference(timer1, timer2, format) {
  const timeLimit = config.timeLimit;
  const newFormat = 'YYYY-MM-DD HH:mm:ss';
  const timer = calcTimeDiff(moment(timer1).format(format), moment(timer2).format(format), newFormat, true);
  const timeObj = searchTimesLimit[timeLimit] || {};
  const { differenceDays } = timeObj;
  return (timeLimit && (Number(timer) > differenceDays));
}

export function createTimeLimitMsg(char) {
  return `当前查询时间范围超出数据时间区间限制（${char}），请重新选择！`;
}

export function toMinuteTimeStamp (timeStamp) {
  const date = new Date(timeStamp);
  date.setSeconds(0,0);
  return moment(date).format('X');
}

export const processArrary = (arr) => {
  const processValue = (value) => {
    if(Array.isArray(value)) {
      if(value.length === 1 && value[0] === null) {
        return []
      }
      return value.map(processValue)
    } else if(typeof value === 'object' && value !== null) {
      const newObj = {}
      for(const [key, val] of Object.entries(value)) {
        newObj[key] = processValue(val)
      }
      return newObj
    }
    return value
  }
  return arr.map(processValue)
}


export const findFieldUpdateArr = (arr, field, value, newData) => {
  const target = arr?.find(item => item[field] === value)
  if (target) {
    Object.assign(target, newData)
  }
  return arr
}


export const createRangeRegex = (min, max) => {
  // 验证输入
  if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
    throw new Error('Both arguments must be valid numbers');
  }
  if (min > max) [min, max] = [max, min];
  if (min === max) return new RegExp('^' + escapeRegExp(String(min)) + '$');

  const patterns = [];

  // 处理负数部分
  if (min < 0) {
    const negMax = Math.min(max, -1);
    if (min <= negMax) {
      patterns.push(generateNegativePattern(min, negMax));
    }
  }

  // 处理零
  if (min <= 0 && max >= 0) {
    patterns.push('0');
  }

  // 处理正数部分
  if (max > 0) {
    const posMin = Math.max(min, 1);
    if (posMin <= max) {
      patterns.push(generatePositivePattern(posMin, max));
    }
  }

  return new RegExp('^(?:' + patterns.join('|') + ')$');
}

// 生成负数范围的正则（修正版）
export const generateNegativePattern = (min, max) => {
  // 确保min和max都是负数
  min = Math.min(min, max);
  max = Math.max(min, max);

  const absMin = Math.abs(min);
  const absMax = Math.abs(max);

  // 特殊处理：单个负数
  if (absMin === absMax) return '-' + absMin;

  // 生成正数部分的正则，然后加上负号
  const positivePattern = generatePositivePattern(absMax, absMin);
  return '-' + (positivePattern.includes('|') ? `(${positivePattern})` : positivePattern);
}

// 生成正数范围的正则（优化版）
export const generatePositivePattern = (min, max) => {
  if (min > max) return '';
  if (min === max) return String(min);

  const patterns = [];
  let current = min;

  while (current <= max) {
    const digits = String(current).length;
    const segmentMax = Math.min(max, 10 ** digits - 1);

    // 小范围直接枚举
    if (segmentMax - current < 10) {
      for (let i = current; i <= segmentMax; i++) {
        patterns.push(i);
      }
    }
    // 处理整十数范围
    else if (current % 10 === 0 && segmentMax % 10 === 9 && segmentMax - current >= 9) {
      const prefix = String(current).slice(0, -1);
      patterns.push(prefix + '\\d');
    }
    // 处理一般情况
    else {
      const minStr = String(current);
      const maxStr = String(segmentMax);
      let i = 0;

      // 找到第一个不同的数字位
      while (i < minStr.length && minStr[i] === maxStr[i]) {
        i += 1;
      }

      const prefix = minStr.substring(0, i);
      const minDigit = minStr[i] || '0';
      const maxDigit = maxStr[i] || '9';
      const suffixLength = minStr.length - i - 1;

      // 生成模式
      if (i === minStr.length - 1) {
        patterns.push(prefix + '[' + minDigit + '-' + maxDigit + ']');
      } else if (minDigit === '0' && maxDigit === '9') {
          patterns.push(prefix + '\\d{' + (minStr.length - i) + '}');
        } else {
          patterns.push(prefix + '[' + minDigit + '-' + maxDigit + ']\\d{' + suffixLength + '}');
        }
    }

    current = segmentMax + 1;
  }

  return patterns.join('|');
}

// 转义正则特殊字符
export const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const createEnhancedRequest = (requestFunction, cfg, noError) => {
  // 默认配置
  const defaultConfig = {
    interval: 30000,
    maxRetries: 3,
    currentRetry: 0,
    isRunning: true,
  };
    // 使用传入的配置覆盖默认配置
  const mergedConfig = { ...defaultConfig, ...cfg, interval: 60000 };

  async function enhancedRequest(onSuccess, onError) {
    if (!mergedConfig.isRunning) return;
    try {
      const response = await requestFunction();
      if (response.code !== 0 && !noError) return message.error(response.message)
      // 成功则重置重试计数
      mergedConfig.currentRetry = 0;
      // 通知外部请求成功
      onSuccess(response);
      // 等待间隔后继续
      setTimeout(() => enhancedRequest(onSuccess, onError), mergedConfig.interval);
    } catch (error) {
      if (mergedConfig.currentRetry < mergedConfig.maxRetries) {
        // 增加重试计数并立即重试
        mergedConfig.currentRetry += 1;
        setTimeout(() => enhancedRequest(onSuccess, onError), config.timerInterval1);
      } else {
        // 超过最大重试次数，停止
        mergedConfig.isRunning = false;
        // 通知外部请求失败
        onError(error);
      }
    }
  }

  function stopEnhancedRequest() {
    mergedConfig.isRunning = false;
  }

  return {
    start: (onSuccess, onError) => {
      if (mergedConfig.isRunning === false) {
        mergedConfig.isRunning = true;
      }
      enhancedRequest(onSuccess, onError)
    },
    stop: stopEnhancedRequest,
  };
}

export function throttleWithSingleTrigger(func, delay) {
  let isTriggered = false;
  return () => {
    const context = this;
    const args = arguments;

    if (!isTriggered) {
      // 第一次触发
      func.apply(context, args);
      isTriggered = true;
      setTimeout(() => {
        isTriggered = false;
      }, delay);
    }
  };
}

export function getFilesSuffix(fileName, options = {}) {
  if (typeof fileName !== 'string' || fileName.trim() === '') {
    console.warn('文件名必须是有效字符串');
    return '';
  }
  const { lowercase = true } = options;
  const pureFileName = fileName.split(/[\\/]/).pop();
  const parts = pureFileName.split('.');
  if (parts.length <= 1 || parts[parts.length - 1] === '') {
    return '';
  }
  let suffix = parts[parts.length - 1];
  if (lowercase) {
    suffix = suffix.toLowerCase();
  }
  return suffix;
}

// defaultData默认数据, linkData=[]关联数据, fields=[]需要更新的字段, linkField = 'key'关联字段，默认key
export function mergeData(defaultData, linkData=[], fields=[], linkField = 'key') {
  const mapping = {};
  const newData = [];

  for (const i of linkData) {
    mapping[i[linkField]] = i;
  }
  for (const i of defaultData) {
    // 解构重新赋值，不会影响defaultData的原始数据
    const item = {...i};
    const oi = mapping[i[linkField]];
    if (oi) {
      for (const j of fields) {
        item[j] = oi[j]
      }
    }
    newData.push(item);
  }
  // 返回关联后的新数据
  return newData;
}

export function getCompanyConfig(data={}, defaultData={}) {
  const _data = {};
  for (const key in defaultData) {
    if (data.hasOwnProperty(key) && !_.isUndefined(data[key])) {
      _data[key] = data[key];
    } else {
      _data[key] = defaultData[key];
    }
  }
  return _data;
}

window.$getConfig = () => {
  return config;
}
