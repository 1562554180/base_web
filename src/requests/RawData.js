import request, { requestWithCallBack } from 'utils/request';
import uri from 'utils/uri';
import { getMultiInstanceDevIp } from 'utils/utils';
import config from 'utils/config';
import { convertIndicesByMultiInstanceDev, getConfigEip, getDevId } from 'common/utils';
import { isClickHouseService } from 'utils/es';
import { getPcapFilePath } from 'common/DataConvertor';
import qs from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const mock = false;
const baseUri = {
  m: uri.component('raw_data'),
  restfulApi: false,
  mock,
};

const upGrade = {
  m: uri.component('system', 'system_upgrade'),
  restfulApi: false,
  mock,
};

const importData = {
  m: uri.component('system', 'metadata_import'),
  restfulApi: false,
  mock,
};

const systemStatus = {
  m: uri.component('system', 'system_modules_status'),
  restfulApi: false,
  mock,
};

const dataSearchBaseUri = {
  m: uri.component('system', 'data_search_history'),
  restfulApi: false,
  mock,
};

const downloadUrl = {
  m: uri.component('download'),
  restfulApi: false,
  mock,
};

function checkAssetSource(params) {
  if (config.isGlobalAsset || config.assetCollectMode === 'global') {
    params.globalAsset = '1';
    params.source = 'ottall';
  }
}

function addDataSourceEngine(params) {
  if (!config.dataEngine) return;
  if (isClickHouseService()) {
    params.engine = 'clickhouse';
  } else {
    params.engine = 'es';
  }
}

export async function importMetaDataToGraph(params) {
  const op = 'es_data_del'
  return request({
    url: uri.ops({ op, ...downloadUrl }),
    method: 'post',
    body: params,
  })
}

export async function searchHistoryList(params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...dataSearchBaseUri }),
    method: 'post',
    body: params,
  })
}


const downloadBaseUri = {
  m: uri.component('download'),
  restfulApi: false,
  mock,
};

function getSource() {
  return convertIndicesByMultiInstanceDev(config.dataSource) || '';
}

function addAuthHeaders(params) {
  if (config.sqlDataAuthorization) {
    params.headers = {
      Authorization: config.sqlDataAuthorization,
    }
  }
  return params;
}

export async function search(params = {}) {
  const { filterSource, ...newParams } = params;
  if (!newParams.source) {
    newParams.source = getSource()
  }
  if (isClickHouseService()) {
    if (params.did) {
      const cons = params.cons ? '(' + params.cons.map(item => `${item[0]}=${item[1]}`).join(' and ') + ') and ' : '';
      const ckParams = {
        sql: `select * from ${params.index_name} where ${cons}id='${params.did}'`,
        engine: 'clickhouse',
        columnNameReplace: true,
      };
      return request(addAuthHeaders({
        url: `${config.esApi}/_nlpcn/sql`,
        method: 'post',
        credentials: 'same-origin',
        mode: 'cors',
        json: true,
        body: ckParams,
      }));
    }
  }
  return request({
    url: uri.ops({ op: 'search', ...baseUri }),
    method: 'post',
    body: newParams,
  });
}

export async function knowledgeData(params = {}) {
  const { filterSource, ...newParams } = params;
  if (!newParams.source) {
    newParams.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'knowledge_data', ...baseUri }),
    method: 'post',
    body: newParams,
  });
}

export async function getFields(params) {
  const { filterSource, ...newParams } = params;
  if (!newParams.source) {
    newParams.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'get_fields', ...baseUri }),
    method: 'post',
    body: newParams,
  });
}

export async function getOverviewData(params) {
  return request({
    url: uri.ops({ op: 'account_statistics', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function getMatchResultProtocols(params) {
  if (!params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'get_match_result_protos', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getAllMevilTasksAndGroups(params, cb) {
  return requestWithCallBack({
    url: uri.ops({ op: 'get_mevil_tasks_groups', ...baseUri }),
    method: 'post',
    body: { ...params },
  }, null, cb);
}

export async function executeSql(params) {
  return request({
    url: uri.ops({ op: 'sql', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function esSql(params) {
  return request(addAuthHeaders({
    url: uri.ops({ op: 'es_sql', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  }));
}

export async function fileData(params) {
  return request({
    url: uri.ops({ op: 'file_data', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function remove(params) {
  return request({
    url: uri.ops({ op: 'remove', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function create(params) {
  return request({
    url: uri.ops({ op: 'create', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function edit(params) {
  return request({
    url: uri.ops({ op: 'edit', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function listTables(params) {
  return request({
    url: uri.ops({ op: 'list_tables', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function saveRelation(params) {
  return request({
    url: uri.ops({ op: 'save_relation', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function createGrepPcap(params) {
  return request({
    url: uri.ops({ op: 'create_grep_pcap', ...baseUri }),
    method: 'post',
    body: params,
  });
}

function getPcapUrl(devId, checkProxy) {
  if (checkProxy && config.enableNginxProxy) {
    return './yuantek_assert_service';
  }
  const ip = getMultiInstanceDevIp(devId);
  if (ip === false) {
    return config.grepPcapUrl;
  }
  return `http://${ip}:` + (config.pcapServicePort || '8081');
}

function getPcapUrlParamsSuffix(devId, checkProxy, dataSource, sessionId) {
  if ((dataSource && dataSource.startsWith('ottperm')) ||
    (sessionId && sessionId.startsWith('ottperm')) ||
    (checkProxy && !config.enableNginxProxy)) {
    return '';
  }

  let ip = getMultiInstanceDevIp(devId);
  if (ip === false) {
    ip = '127.0.0.1';
  }
  if (config.nsm_center) {
    return `&assertIp=${ip}`;
  }
  return '';
}

export function downloadPcapBagFromJava(params, devId, dataSource) {
  return `${getPcapUrl(devId, false, dataSource, params.sessionId)}/pcapDownload?${uri.formatUrlParams(params)}` + getPcapUrlParamsSuffix(devId, false, dataSource, params.sessionId);
}

export function downloadPcapRowFromJava(params, devId, dataSource) {
  return `${getPcapUrl(devId, false, dataSource, params.sessionId)}/raw?${uri.formatUrlParams(params)}` + getPcapUrlParamsSuffix(devId, false, dataSource, params.sessionId);
}

const gravPrefix = 'grav://';

export function getGravDownloadUrl(gravUrl, fileName, record) {
  // grav://001/59400000130
  if (!gravUrl || !gravUrl.startsWith(gravPrefix)) return '';
  const params = gravUrl.substr(gravPrefix.length);
  const pos = params.indexOf('/');
  if (pos === -1) return '';
  const devId = getDevId(record);
  const ip = getMultiInstanceDevIp(devId);
  const ops = {
    ...baseUri,
    op: 'grav_file',
    path: params,
    ip: ip || '',
    fileName,
  };

  return uri.ops(ops);
}

export async function createGrepPcapFromJava(params, devId, dataSource) {
  return request({
    url: `${getPcapUrl(devId, true, dataSource, params.sessionId)}/pcap?${uri.formatUrlParams(params)}` + getPcapUrlParamsSuffix(devId, true, dataSource, params.sessionId),
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  });
}

export async function getPcapDownloadUrl(params) {
  return request({
    url: uri.ops({ op: 'download', ...baseUri }),
    method: 'post',
    body: { ...params, source: params.source || getSource() },
  });
}

export function downloadTmpPcap(params) {
  return uri.ops({ op: 'download_tmp_pcap', ...baseUri, ...params })
}

function getSourceNameFromIndexName(r, params) {
  let indexName = r ? (r._index || r.index_name) : '';
  if (!indexName && params) indexName = params._index || params.index_name;
  if (!indexName) return '';
  let pos = indexName.indexOf(':');
  if (pos !== -1) {
    indexName = indexName.substr(pos + 1);
  }
  if (indexName.startsWith('pelican_')) {
    pos = indexName.lastIndexOf('_');
    if (pos !== -1) {
      return indexName.substr(pos + 1);
    }
  }
  return '';
}

export function getPcapData(params = {}, r) {
  const _index = getSourceNameFromIndexName(r, params);
  let source = _index || (r && r.session_id ? r.session_id : (params.sessionId || params.source || getSource()))
  if (!source) source = '';
  if (config.isShbProduct && params.data_type === 'pcap') {
    params.pcapHead = true;
  } else if (config.isShbProduct && params.data_type === 'dat') {
    params.pcapHead = false;
  }
  const pcapParams = getPcapFilePath(r) || {};
  pcapParams.sessionId = source;
  const devId = getDevId(r);
  const payload = { ...params, ...pcapParams, ct: r.ct };
  return `${getPcapUrl(devId, false, _index)}/pcapData?${uri.formatUrlParams(payload)}` + getPcapUrlParamsSuffix(devId, false, _index)
}

export function downloadRawData(params = {}, r) {
  const _index = getSourceNameFromIndexName(r, params);
  let source = _index || (r && r.session_id ? r.session_id : (params.sessionId || params.source || getSource()))
  if (!source) source = '';
  if (config.isShbProduct && params.data_type === 'pcap') {
    params.pcapHead = true;
  } else if (config.isShbProduct && params.data_type === 'dat') {
    params.pcapHead = false;
  }
  if (r && (config.isMevilMode || config.downloadFromJava)) {
    const pcapParams = getPcapFilePath(r) || {};
    pcapParams.sessionId = source;
    let ct = false;
    if (r.ct) ct = r.ct;
    else if (r.dtime) ct = parseInt((r.dtime / 1000).toString(), 10);
    const newParams = { ...params, ...pcapParams };
    if (ct) newParams.ct = ct;
    return downloadPcapBagFromJava(newParams, getDevId(r), _index);
  };
  return uri.ops({ op: 'download', ...baseUri, ...params, source });
}

export function getPtVideo(params) {
  return uri.ops({ op: 'get_pt_viedo', ...baseUri, ...params, source: params.source || getSource() })
}

export function downloadField(params) {
  return uri.ops({ op: 'download_field', ...baseUri, ...params, source: params.source || getSource() })
}

export async function getDownloadFieldContent(params) {
  return request({
    url: uri.ops({ op: 'download_field', ...baseUri }),
    method: 'post',
    body: { ...params, source: params.source || getSource() },
  });
}

export function downloadRawValue(params) {
  return uri.ops({ op: 'raw_value', ...baseUri, ...params, source: params.source || getSource() })
}

export function downloadHttpContent(params) {
  return uri.ops({ op: 'http_content', ...baseUri, ...params })
}

export function getEmailHtml(params) {
  return uri.ops({ op: 'email_html', ...baseUri, ...params, source: params.source || getSource() });
}

export function getEmailAttachmentUrl(params) {
  return uri.ops({ op: 'email_attach', ...baseUri, ...params, source: params.source || getSource() });
}

export function getEmailEmlUrl(params) {
  return uri.ops({ op: 'email_eml', ...baseUri, ...params, source: params.source || getSource() });
}

export function getHttpContent(params) {
  return uri.ops({ op: 'http_content', ...baseUri, ...params, source: params.source || getSource() });
}

export function getRtmpViedo(params) {
  return uri.ops({ op: 'rtmp_viedo', ...baseUri, ...params, source: params.source || getSource() });
}

export async function downloadFiles(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'download_files', ...downloadBaseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function dataBackup(params) {
  return request({
    url: uri.ops({ op: 'data_backup', ...downloadBaseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function dataBackupStatus(params) {
  return request({
    url: uri.ops({ op: 'data_backup_status', ...downloadBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function downloadFileList(params) {
  return request({
    url: uri.ops({ op: 'download_file_list', ...downloadBaseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function delDownloadFile(params) {
  return request({
    url: uri.ops({ op: 'del_download_file', ...downloadBaseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function delDataFile(params) {
  return request({
    url: uri.ops({ op: 'es_data_del', ...downloadBaseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function downloadAllFile(params) {
  return uri.ops({ op: 'download_all_file', ...downloadBaseUri, ...params });
}

export async function getsDefaultSearch(params) {
  return request({
    url: uri.ops({ op: 'get_task_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getTmpTask(params) {
  return request({
    url: uri.ops({ op: 'get_tmp_task', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  })
}

export async function calcDataCount(params) {
  return request({
    url: uri.ops({ op: 'data_count', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  })
}

export async function listVsatNetwork(params) {
  return request({
    url: uri.ops({ op: 'list_vsat_network', ...baseUri }),
    method: 'post',
    body: { source: getSource(), ...params },
  });
}

export async function searchFiledRelation(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'search_filed_relation', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function getFieldsRelation(params) {
  delete params.relationType
  return request(addAuthHeaders({
    url: `${config.esApi}/relation`,
    method: 'post',
    credentials: 'same-origin',
    mode: 'cors',
    json: true,
    body: params,
  }));
}

export async function rawEsSql(params) {
  const newParams = { ...params };
  addDataSourceEngine(newParams);
  return request(addAuthHeaders({
    url: `${config.esApi}/_nlpcn/sql`,
    method: 'post',
    credentials: 'same-origin',
    mode: 'cors',
    json: true,
    body: newParams,
  }));
}

export async function rawEsScroll(params) {
  const newParams = { ...params };
  addDataSourceEngine(newParams);
  return request(addAuthHeaders({
    url: `${config.esApi}/_search/scroll`,
    method: 'post',
    credentials: 'same-origin',
    mode: 'cors',
    json: true,
    body: newParams,
  }));
}

export async function searchFiledsPaneRelation(params) {
  delete params.relationType
  return request(addAuthHeaders({
    url: `${config.esApi}/relation`,
    method: 'post',
    credentials: 'same-origin',
    mode: 'cors',
    json: true,
    body: params,
  }));
}

export async function searchAccount(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'search_account', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function searchMail(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'search_mail', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function checkCommand(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'check_command', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function metaSearch(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'search', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function getMatchResultProtos(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'get_match_result_protos', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function getMatchResultProtosWithCallback(params, cb) {
  if (!params.source) {
    params.source = getSource()
  }
  return requestWithCallBack({
    url: uri.ops({ op: 'get_match_result_protos', ...baseUri }),
    method: 'post',
    body: { ...params },
  }, null, cb);
}

export function saveSearchHistoryCallback(params, cb) {
  if (!params || !params) return false;
  return requestWithCallBack({
    url: uri.ops({ op: 'save_search_history', ...baseUri }),
    method: 'post',
    body: params,
  }, null, cb);
}

export async function listVsat(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'list_vsat', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function recommendIp(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'recommend_ip', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function targetPotions(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'target_potions', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function getMapUrl(zoom, x, y) {
  // 'tilemap/'+zoom+'/'+x+'/'+y+'.png';
  return uri.ops({
    op: 'map',
    zoom,
    x,
    y,
    ...baseUri,
  });
}

export async function labelStats(params = {}) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'label_stats', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getTaskData(params) {
  return request({
    url: uri.ops({ op: 'get_task_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function subnetDataSummary(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'subnet_data_summary', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function subnetTrafficCurrent(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'subnet_traffic_current', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function subnetTrafficInfo(params) {
  return request({
    url: uri.ops({ op: 'subnet_traffic_info', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function fileClassList(params) {
  return request({
    url: uri.ops({ op: 'file_class_list', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getIdentityData(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'get_identity_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getFieldGroup(params) {
  if (!params.source) {
    params.source = getSource()
  }
  return request({
    url: uri.ops({ op: 'get_field_group', ...baseUri }),
    method: 'post',
    body: params,
  });
}


export function getFieldGroupDownload(params) {
  return uri.ops({ op: 'get_field_group', ...baseUri, ...params, source: params.source || getSource() })
}

export async function getBgpData(params) {
  return request({
    url: uri.ops({ op: 'get_bgp_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getEigrpData(params) {
  return request({
    url: uri.ops({ op: 'get_eigrp_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getRelationEdgesDetail(params) {
  return request({
    url: uri.ops({ op: 'relation_edges_statistics', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function setDatasearchOperationmode(params) {
  return request({
    url: uri.ops({ op: 'set_datasearch_operationmode', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getDatasearchOperationmode(params) {
  return request({
    url: uri.ops({ op: 'get_datasearch_operationmode', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function saveNotes(params) {
  if (window.systemParams.MultiInstance) {
    const indexName = params.index_name || '';
    const tableName = indexName.split(':');
    if (tableName.length > 1) params.index_name = tableName[1];
    const eip = getMultiInstanceDevIp(params.devId);
    if (eip) params.eip = eip;
  }
  return request({
    url: uri.ops({ op: 'save_notes', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getOffineInfo(params) {
  return request({
    url: uri.ops({ op: 'get_offline_data', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function searchCancel(params) {
  if (!params || !params.taskId) return;
  return request({
    url: uri.ops({ op: 'search_cancel', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function importRules(params) {
  return uri.ops({ op: 'import_rules', ...baseUri, ...params })
}

export async function esSqlExportCsv(params) {
  return request({
    url: uri.ops({ op: 'es_sql_export_csv', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function downloadFilesCsv(params) {
  let url = uri.ops({ op: 'download_files', ...baseUri, ...params });
  if (config.enableCenterMode && config.eip && config.eip !== '127.0.0.1' && !window.location.host.includes(config.eip)) {
    url = `http://${config.eip}:${config.eport || '8881'}${url.substring(1)}`;
  }
  return url
}

export async function sumGroupTraffic(params) {
  return request({
    url: uri.ops({ op: 'sum_group_traffic', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export function upgradeSystem(params) {
  return uri.ops({ op: 'upgrade', ...upGrade, ...params })
}

export async function confirmOrCancelUpgrade(params) {
  return request({
    url: uri.ops({ op: 'upgrade', ...upGrade }),
    method: 'post',
    body: { ...params },
  });
}

export async function upgradeReclist(params) {
  return request({
    url: uri.ops({ op: 'list', ...upGrade }),
    method: 'post',
    body: { ...params },
  });
}

export async function backupList(params) {
  return request({
    url: uri.ops({ op: 'backup_list', ...upGrade }),
    method: 'post',
    body: { ...params },
  });
}

export async function delBackupDir(params) {
  return request({
    url: uri.ops({ op: 'del_backup_dir', ...upGrade }),
    method: 'post',
    body: { ...params },
  });
}

export async function getNodeUpgradeLog(params) {
  return request({
    url: uri.ops({ op: 'node_log', ...upGrade }),
    method: 'post',
    body: { ...params },
  });
}

export async function cancelUpgrade(params) {
  return request({
    url: uri.ops({ op: 'cancel_upgrade', ...upGrade }),
    method: 'post',
    body: { ...params },
  });
}

function getKnowledgeTopoUrl(path) {
  return `${config.knowledgeTopoUrl}${path}`
}

export async function createKnowledgeNode(params) {
  return request({
    url: getKnowledgeTopoUrl('/graph/create'),
    method: 'post',
    json: true,
    credentials: 'same-origin',
    body: params,
  });
}

export async function getGraphQueryStat(params) {
  return request({
    url: getKnowledgeTopoUrl('/graph/queryStat'),
    method: 'post',
    credentials: 'same-origin',
    json: true,
    body: params,
  });
}

export async function getKnowledgeRelationByLabel(params) {
  return request({
    url: getKnowledgeTopoUrl('/graph/searchByVELabel'),
    method: 'post',
    json: true,
    credentials: 'same-origin',
    body: params,
  });
}

export async function updateKnowledgeNode(params) {
  return request({
    url: getKnowledgeTopoUrl('/graph/update'),
    method: 'post',
    json: true,
    credentials: 'same-origin',
    body: params,
  });
}

export async function getKnowledgeRelation(params) {
  return request({
    url: getKnowledgeTopoUrl('/graph/search'),
    method: 'post',
    credentials: 'same-origin',
    json: true,
    body: params,
  });
}

export async function deleteNode(params) {
  return request({
    url: getKnowledgeTopoUrl('/graph'),
    method: 'delete',
    credentials: 'same-origin',
    json: true,
    body: params,
  });
}

export async function uodateNodeAttr(params) {
  return request({
    url: getKnowledgeTopoUrl('/graph/update'),
    method: 'post',
    credentials: 'same-origin',
    json: true,
    body: params,
  });
}

export async function getRelationType(params) {
  return request({
    url: `${config.esApi}/relation/coords`,
    method: 'post',
    credentials: 'same-origin',
    json: true,
    body: params,
  })
}


export async function uploadMeteData(params) {
  return uri.ops({ op: 'import_metadata', ...importData, ...params })
}

export async function importMeteData(params) {
  return request({
    url: uri.ops({ op: 'import_metadata', ...importData }),
    method: 'post',
    body: { ...params },
  });
}

export async function importMeteDataList(params) {
  return request({
    url: uri.ops({ op: 'list', ...importData }),
    method: 'post',
    body: { ...params },
  });
}

export async function getModulesStatus(params = {}) {
  return request({
    url: uri.ops({ op: 'get_modules_status', ...systemStatus }),
    method: 'post',
    body: { ...params, ...getConfigEip() },
  });
}

export async function getHistoryStatus(params = {}) {
  return request({
    url: uri.ops({ op: 'get_proc_running_history', ...systemStatus }),
    method: 'post',
    body: { ...params, ...getConfigEip() },
  });
}

export async function getProcRestart(params = {}) {
  return request({
    url: uri.ops({ op: 'system_proc_restart', ...systemStatus }),
    method: 'post',
    body: { ...params, ...getConfigEip() },
  });
}

export async function getLog(params = {}) {
  return request({
    url: uri.ops({ op: 'cat_proc_error_log', ...systemStatus }),
    method: 'post',
    body: { ...params, ...getConfigEip() },
  });
}

export async function getProcDetail(ip, port, api, params = {}, method = 'get') {
  let eip = ip
  if (config.eip) {
    eip = config.eip;
  }
  const hostIp = (!eip || eip === '127.0.0.1') ? window.location.hostname : eip;
  let url = `http://${hostIp}:${port}/${api}`;
  if (method === 'post') {
    return request({
      url,
      method: 'post',
      credentials: 'same-origin',
      mode: 'cors',
      json: true,
      body: params,
    });
  }
  if (Object.keys(params).length > 0) {
    const preString = qs.stringify(params, { addQueryPrefix: true });
    if (url.includes('?')) {
      url += '&' + preString;
    } else {
      url += '?' + preString;
    }
  }
  return request({
    url,
    method,
    credentials: 'same-origin',
  });
}

export async function deleteEsIndex(params = {}) {
  return request({
    url: uri.ops({ op: 'delete_es_index', ...systemStatus }),
    method: 'post',
    body: { ...params, ...getConfigEip() },
  });
}

export async function getExecEsCommand(params = {}) {
  return request({
    url: uri.ops({ op: 'exec_es_command', ...systemStatus }),
    method: 'post',
    body: { ...params, ...getConfigEip() },
  });
}

export async function getSeesionMetaDataHis(params) {
  return request({
    url: uri.ops({ op: 'get_session_metadata_history', ...systemStatus }),
    method: 'post',
    body: { ...params },
  });
}

export async function getQueryIp(params) {
  return request({
    url: uri.ops({ op: 'get_query_ip', ...baseUri }),
    method: 'post',
    body: { ...params },
  });
}

export async function saveThreat(params) {
  let url = `http://${config.threatCenterIp || ''}${config.threatCenterPort ? `:${config.threatCenterPort}` : ''}${config.threatCenterQBPath || '/threat/information/share/save'}`;
  if (config.wxNgnixProxy) {
    url = 'yuantek_wxqb';
  }
  return request({
    url,
    method: 'post',
    json: true,
    headers: { 'source': 'S00001', 'timestamp': moment().format('X'), sign: '', req_id: uuidv4() },
    body: params,
  });
}

const baseUriDev = {
  m: uri.component('device_info'),
  restfulApi: false,
  mock,
};

export async function getSubgroupStatus(params) {
  const op = 'get_subgroup_status'
  return request({
    url: uri.ops({ op, ...baseUriDev }),
    method: 'post',
    body: { ...params, ...getConfigEip() },
  })
}

export async function restartSub(params) {
  const op = 'restart_sub'
  return request({
    url: uri.ops({ op, ...baseUriDev }),
    method: 'post',
    body: params,
  })
}

export async function setWriterTrafficStatus(params) {
  const { ip, port, ...payload } = params;
  const url = `http://${ip}:${port}/trafficLimit`;
  return request({
    url,
    method: 'PUT',
    credentials: 'same-origin',
    json: true,
    body: payload,
  });
}

export async function setLoaderTrafficStatus(params) {
  const { ip, port, ...payload } = params;
  const url = `http://${ip}:${port}/mgsaInsertLimit`;
  return request({
    url,
    method: 'PUT',
    credentials: 'same-origin',
    json: true,
    body: payload,
  });
}

export async function getSearchIpPosition(params, cb) {
  if (!params.source) {
    params.source = getSource();
  }
  return requestWithCallBack({
    url: uri.ops({ op: 'get_search_ip_position', ...baseUri }),
    method: 'post',
    body: { ...params },
  }, null, cb);
}

const jrdBaseUri = {
  m: uri.component('jrd'),
  restfulApi: false,
  mock,
};

export async function getMacTerminalList(params) {
  return request({
    url: uri.ops({ op: 'mac_list', ...jrdBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function getMacTerminalModalList(params) {
  return request({
    url: uri.ops({ op: 'mac_type_list', ...jrdBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function getDataMarkList(params) {
  return request({
    url: uri.ops({ op: 'get_data_mark_info', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getIpPortraitIpRelation(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'get_ip_portrait_ip_relation', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getAllremoteinfo(params, cb) {
  return requestWithCallBack({
    url: config.hsServiceUrl + `/allremoteinfo?begin_time=${params.begin_time}&end_time=${params.end_time}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb);
}

export function getRemotehisinfo(params, cb) {
  return requestWithCallBack({
    url: config.hsServiceUrl + `/remotehisinfo?remoteid=${params.remoteId}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb);
}

export function getNetStationCount(cb) {
  return requestWithCallBack({
    url: config.hsServiceUrl + `/remotenumalltoday`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb);
}

export function getHistoryActCount(params, cb) {
  return requestWithCallBack({
    url: config.hsServiceUrl + `/remotenumhis?begin_time=${params.begin_time}&end_time=${params.end_time}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb);
}

export function getTopRemoteid(params, cb) {
  return requestWithCallBack({
    url: config.hsServiceUrl + `/top?remoteid=${params.remoteId}&date=${params.date}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb);
}

export function getShipInfoList(params, cb) {
  return requestWithCallBack({
    url: config.hsServiceUrl + `/allshipinfo?begin_time=${params.begin_time}&end_time=${params.end_time}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb);
}
