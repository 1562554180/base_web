import _ from 'lodash';
import config from 'utils/config';
import { parseJson } from './utils';
import { aggregationsToTree, aggregationsToNetwork, isEsService } from './es';

export function getSql(oldsql, value, key) {
  const isEmpty = value === false;
  let o = oldsql.replace(/(^\s*)|(\s*$)/g, '');
  if (o.endsWith('where')) return isEmpty ? o : `${o} ${value}`;
  if (o.endsWith('_*')) return isEmpty ? o : `${o} where ${value}`;
  const groupBy = ' group by ';
  const pos = o.indexOf(groupBy);
  let other = '';
  if (pos !== -1) {
    other = o.substr(pos);
    o = o.substr(0, pos);
  }
  const sqlArr = o.split(/ where | where|where |where/);
  const prefix = replaceField(key, value, sqlArr[1], isEmpty);
  if (!prefix) return sqlArr[0] + other;
  return `${sqlArr[0]} where ${prefix.replace(/(^\s*)|(\s*$)/g, '')}${other}`;
}

const sqlOperaters = ['<>', '>=', '<=', '=', '>', '<'];

function hasCondition(key, where) {
  for (const op of sqlOperaters) {
    if (where.indexOf(`${key}${op}`) !== -1) {
      return true;
    }
  }

  return false;
}

function isCondition(key, con) {
  for (const op of sqlOperaters) {
    if (con.startsWith(`${key}${op}`)) {
      return true;
    }
  }
  return false;
}

function addblank(t) {
  if(t.startsWith('(')) {
    return `( ${t.substr(1, t.length)}`
  } else if(t.endsWith(')')) {
    if(t.startsWith('ct') || t.startsWith('ctms') || t.startsWith('sip') || t.startsWith('dip') || t.startsWith('in_terms(')) {
      return t;
    }
    return `${t.substr(0, t.length - 1)} )`
  } else {
    return t;
  }
}

function replaceField(key, value, a, isEmpty) {
  if (!a) return '';
  let hasNo = false;

  if (!hasCondition(key, a)) {
    hasNo = true;
  }
  if (hasNo && (a.endsWith('and') || a.endsWith('or'))) {
    if (isEmpty) return a;
    return `${a} ${value}`
  } else if (hasNo) {
    if (isEmpty) return a;
    return `${a} and ${value}`
  }
  const newA = a.replace(/\s/g, '');
  const arr = a.split(/ and | or | and|and | or|or /);
  let sql = '';
  arr.forEach(it => {
    const item = it.replace(/\s/g, '');
    let val = item;
    if (isCondition(key, item)) {
      if (isEmpty) return;
      val = value;
    }
    const n = newA.indexOf(item);
    if (n === 0) {
      sql += addblank(val);
    } else if (n !== 0) {
      let t = ' ';
      const s = newA.slice(0, n)
      if (s.endsWith('or')) {
        t = ' or '
      }
      if (s.endsWith('and')) {
        t = ' and '
      }
      sql += `${t}${addblank(val)}`
    }
  })
  if (a.endsWith('and')) {
    return `${sql} and `;
  }
  if (a.endsWith('or')) {
    return `${sql} or `;
  }
  sql = sql.trim();
  if (sql.startsWith('and')) {
    sql = sql.substr(3);
  }
  if (sql.startsWith('or')) {
    sql = sql.substr(2);
  }
  return sql.trim();
}

export function getMetaDataPageSize() {
  return config.metaDataPageSize || 50;
}

export function getSqlScrollTag() {
  if (!isEsService()) return '';
  return `/*! USE_SCROLL(${getMetaDataPageSize()},${config.metaDataScrollTime * 60 * 1000})*/`;
}

export function getSqlLimitTag(currentPage, pgSize, startNum) {
  if (isEsService()) return '';

  const pageSize = pgSize || getMetaDataPageSize();
  const start = startNum || ((currentPage <= 1 ? 0 : currentPage - 1) * pageSize);
  return `limit ${start}, ${pageSize}`;
}

export function getSearchAfterTag(orderFieldValue, identity) {
  if (!isEsService()) return '';

  let v = '';

  if (orderFieldValue !== null) {
    v = orderFieldValue.toString().replace(/"/ig, '\\"');
  }
  return `/*! SEARCH_AFTER("${v}", "${identity}")*/`;
}

export function getTotalHitTag() {
  if (!isEsService()) return '';
  return '/*! TRACK_TOTAL_HITS(true)*/ ';
}

export function processQueryPayload(payload, isEsQuery, isFields) {
  const { options = {}, vsource = '', taskId = '', ruleId = '', is_field_analysis = '' } = payload;
  let sql = payload.sql.trim();

  if (options.disablePage) return { sql };

  const op = sql.substr(0, 7);
  if (op.toLowerCase() === 'select ') {
    sql = 'select ' + getSqlScrollTag() + ' ' + sql.substr(7);
  }
  if(isFields) {
    return { sql, is_field_analysis };
  }
  if(isEsQuery){
    return { sql };
  }
  return { sql, vsource, taskId, ruleId, is_field_analysis }
}

export function processQueryResult(ret, opt) {
  let data = ret;
  const options = opt || {};

  if (_.isString(data)) data = parseJson(data, false);
  if (!data) {
    return {success: false, error: 'unknown error'};
  }
  if (!_.isUndefined(data.success)) {
    if (_.isString(data.message)) {
      return {error: data.message, success: false};
    } else if (data.error) {
      return data;
    }
    return {};
  }
  if (options.aggsToTree && data.aggregations) {
    data = aggregationsToTree(data.aggregations, options.dataConvertor);
  } else if (options.aggsToNetwork) {
    data = aggregationsToNetwork(data.aggregations, options);
  }
  return {success: true, data, type: 'info'};
}

const emptyResult = {
  data: [],
  total: 0,
  hasMore: false,
}

export function toTableData(res) {
  if (!res || !res.hits) {
    return {...emptyResult};
  }
  let data = [];
  let total = 0;
  if (res.hits.hits) {
    for (const item of res.hits.hits) {
      if (item._source) {
        const r = item._source;
        for (const k in item) {
          if (k !== '_source') {
            r[k] = item[k];
          }
        }
        data.push(r);
      } else {
        data.push(item);
      }
    }
    if (res.hits && res.hits.total) {
      total = res.hits.total.value || res.hits.total;
    }
  } else {
    if (isEsService()) {
      return {...emptyResult};
    }
    data = res.hits;
    if (res.total) {
      total = res.total.value || res.total;
    }
  }
  const pageSize = getMetaDataPageSize() * (isEsService() ? config.metaDataShardNum || 1 : 1);

  const ret = { data, total, hasMore: data.length >= pageSize };

  if (res.took) ret.queryTime = res.took;

  return ret;
}
