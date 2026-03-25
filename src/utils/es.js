import _ from 'lodash';
import { l } from './localization';
import config from './config';

export function getEsResponseData(response) {
  if (!response) return false;
  if ((response.success && response.data && !response.data.error)) {
    return response.data || {};
  } else if (response.success !== false && !response.error) {
    return response;
  }

  return false;
}

export function getEsError(response) {
  let err = response;

  if(response && response.data && response.data.error) {
    err = response.data;
  }
  if (err && err.error && err.error.reason) {
    const errRoot = err.error;
    err = errRoot.reason;
    if (err && err.startsWith) {
      if (err.startsWith('no such index')) {
        err = '当前无任何数据';
      } else if (err.startsWith('sql format error')) {
        err = '查询语句中数据类型不合法，请仔细检查';
      } else if (err.startsWith('Connection refused')) {
        err = 'ElasticSearch数据存储服务未启动';
      } else if (errRoot.root_cause && _.isArray(errRoot.root_cause) && errRoot.root_cause[0] && errRoot.root_cause[0].reason){
        const errRootCause = errRoot.root_cause[0];
        if (errRootCause.reason === 'runtime error') {
          err = '查询语句出现运行时错误';
          if (errRoot.root_cause[0].script) {
            err += '. 内部执行出现的错误语句：' + errRoot.root_cause[0].script;
          }
        } else if (errRootCause.type === 'cluster_block_exception') {
          if (errRootCause.reason.includes('state not recovered')) {
            err = 'ElasticSearch正在初始化索引';
          } else {
            err = 'ElasticSearch集群状态未初始化完成';
          }
        } else {
          err = errRoot.root_cause[0].reason;
        }
      }
    }
  } else {
    err = err && err.message ? err.message : '未知错误，请检查SQL语句是否正确';
  }

  return err;
}

export function parseResult(data) {
  if (data && !_.isUndefined(data.success)) {
    if (_.isString(data.message)) {
      return {error: data.message};
    }
    return {};
  }
  if (!data) return {error: 'Unkonw error'};
  let ret = data;
  if (_.isString(data)) ret = JSON.parse(data);
  if (ret.error && _.isString(ret.error)) {
    try {
      ret.error = JSON.parse(ret.error);
      if (ret.error.error) ret.error = ret.error.error;
    } catch (e) {}
  }

  return ret;
}
export function toTableData(res, params) {
  let data = [];
  let total = 0;
  let scrollId = '';

  if (res && res.hits) {
    total = res.hits.total;
    data = res.hits.hits.map(item => {
      const s = item._source;
      s.id = item._id;
      s.index = item._index;
      if (item.highlight) {
        s.highlight = item.highlight;
        delete item.highlight;
      }
      return s;
    });
    if (res._scroll_id) scrollId = res._scroll_id;
  }
  return {
    data: {
      list: data,
      params: {
        scrollId,
      },
      pagination: {
        ...config.tablePagination,
        ...params,
        total,
        showTotal: (t, range) => l('{0}-{1} of {2} items', range[0], range[1], t),
      },
    },
  };
}
function addBuckets(root, data, dataConvertor) {
  let child = root.children;

  if (!child) {
    child = [];
    root.children = child;
  }
  for (const key in data) {
    const buckets = data[key].buckets;
    const item = {name: key};

    child.push(item);
    if (!buckets || !buckets.length) continue;
    const children = [];
    for (const bucket of buckets) {
      const childItem = {props: {}};

      for (const bk in bucket) {
        const bv = bucket[bk];
        if (bk === 'key') {
          childItem.name = dataConvertor ? dataConvertor(bv, item.name) : bv;
        } else if (key === 'doc_count') {
          childItem.count = bv;
        } else if (bv.buckets) {
          addBuckets(childItem, {[bk]: bv}, dataConvertor);
        } else if (!_.isUndefined(bv.value)) {
          childItem.props[bk] = bv.value;
        }
      }
      children.push(childItem);
    }
    item.children = children;
  }
}
export function aggregationsToTree(data, dataConvertor) {
  const tree = {name: "root"};

  addBuckets(tree, data, dataConvertor);

  return tree;
}
function addNode(key, nodes, nodesTag, bucket, options) {
  const id = `${key}-${bucket.key}`;
  let n = nodesTag[id];
  if (n) {
    return n;
  }
  n = {
    id,
    fieldName: key,
    value: 0,
    docCount: bucket.doc_count,
    label: options.dataConvertor ? options.dataConvertor(bucket.key, key) : bucket.key,
  };
  nodesTag[id] = n;
  if (options.colors && options.colors[key]) n.color = options.colors[key];
  nodes.push(n);

  return n;
}
function addEdge(n1, n2, edges, edgesTag, bucket, options) {
  let from = n1;
  let to = n2;

  if (n2.id < n1.id) {
    from = n2;
    to = n1;
  }
  
  const id = `${from.id}-${to.id}`;

  if (edgesTag[id]) {
    return;
  }
  n1.value += 1;
  n2.value += 1;
  const e = {
    id,
    from: from.id,
    to: to.id,
    fromCount: from.docCount,
    toCount: to.docCount,
  };
  for (const bk2 in bucket) {
    const bv2 = bucket[bk2];
    if (bv2.value) {
      e[bk2] = bv2.value;
    }
  }
  edges.push(e);
}

export function aggregationsToNetwork(data, options = {}) {
  const network = {
    nodes: [],
    edges: [],
  };
  const { nodes, edges } = network;
  const nodesTag = {};
  const edgesTag = {};

  for (const key in data) {
    const buckets = data[key].buckets;

    if (!buckets || !buckets.length) continue;
    for (const b1 of buckets) {
      const n1 = addNode(key, nodes, nodesTag, b1, options);
      for (const bk1 in b1) {
        const bv1 = b1[bk1];
        if (bv1.buckets) {
          for (const b2 of bv1.buckets) {
            const n2 = addNode(bk1, nodes, nodesTag, b2, options);
            addEdge(n1, n2, edges, edgesTag, b2, options);
          }
        } else if (!_.isUndefined(bv1.value)) {
          n1[bk1] = bv1.value;
        }
      }
    }
  }

  return network;
}

function addTableField(fields, fieldTag, key, fieldInfoConvertor, others) {
  if (fieldTag[key]) return;
  fieldTag[key] = true;
  const f = {
    mapped_name: key,
    readable_name: ['Asset', 'Asset.keyword'].includes(key)  ? '所有资产标注' : key,
    ...others,
  };
  if (fieldInfoConvertor) {
    const isUserDefinedField = key.endsWith('.keyword');
    const fieldName = isUserDefinedField ? key.substr(0, key.length - 8) : key;
    f.realMapName = fieldName;
    const info = fieldInfoConvertor(fieldName);
    if (info) {
      if (info[0]) f.readable_name = info[0];
      f.field_type = info[1] || (isUserDefinedField ? 'keyword' : '');
    }
  }
  fields.push(f);
}

function createTableItemId(data) {
  let id = '';
  for (const k in data) {
    id += data[k];
  }
  return id;
}

function addTableData(data, fields, tableData, fieldTag, fieldInfoConvertor, parentDataItem) {
  for (const key in data) {
    if (key === 'key' || key === 'doc_count') continue;

    const buckets = data[key].buckets;
    const docCountName = key + '$c';
    addTableField(fields, fieldTag, key, fieldInfoConvertor);
    if (!buckets || !buckets.length) continue;
    for (const bucket of buckets) {
      let hasSubBucket = false;
      const otherItems = {};
      for (const bk in bucket) {
        if (bk !== 'key' && bk !== 'doc_count') {
          const subBucket = bucket[bk];
          if (subBucket.buckets) {
            hasSubBucket = true;
            const dataItem = {...parentDataItem, [key]: bucket.key, [docCountName]: bucket.doc_count};
            addTableData(bucket, fields, tableData, fieldTag, fieldInfoConvertor, dataItem);
            break;
          } else if (!_.isUndefined(subBucket.value)) {
            otherItems[bk] = subBucket.value;
          }
        }
      }
      if (!hasSubBucket) {

        const newDataItem = {...parentDataItem, ...otherItems, [key]: bucket.key, "count$c": bucket.doc_count};
        if (key !== '__id') {
          newDataItem.__id = tableData.length;
        };
        newDataItem.__uid = createTableItemId(newDataItem);
        tableData.push(newDataItem);
      }
    }
  }
  addTableField(fields, fieldTag, "count$c", null, {readable_name: 'Count', mapped_name: "count$c"});
}

export function aggregationsToTableData(data, fieldInfoConvertor) {
  const res = {fields:[], data: []};
  const fieldTag = {};

  addTableData(data.aggregations, res.fields, res.data, fieldTag, fieldInfoConvertor, {});

  return res;
}

export function isEsService() {
  return !config.dataEngine || config.dataEngine === 'es';
}

export function isClickHouseService() {
  return config.dataEngine === 'clickhouse';
}