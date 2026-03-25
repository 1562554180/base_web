import request, { requestWithCallBack } from 'utils/request';
import uri from 'utils/uri';
import { getMultiInstanceDevIp } from 'utils/utils';
import { convertIndicesByMultiInstanceDev } from 'common/utils';
import config from 'utils/config';


const mock = false;
const baseUri = {
  m: uri.component('wit_data'),
  restfulApi: false,
  mock,
};

const dataViewBaseUri = {
  m: uri.component('system', 'data_view'),
  restfulApi: false,
  mock,
};

const systemUpgradeUri = {
  m: uri.component('system', 'system_upgrade'),
  restfulApi: false,
  mock,
};

const indexStatsUri = {
  m: uri.component('system', 'index'),
  restfulApi: false,
  mock,
};

const imsiManageUri = {
  m: uri.component('system', 'imsi_manage'),
  restfulApi: false,
  mock,
}

const appSoftwareUri = {
  m: uri.component('system', 'app_software'),
  restfulApi: false,
  mock,
}

const metadataSaveRule = {
  m: uri.component('system', 'metadata_save_rule'),
  restfulApi: false,
  mock,
}

const relationTemplateManageRule = {
  m: uri.component('system', 'relation_template_manage'),
  restfulApi: false,
  mock,
}

const relationParamsManageRule = {
  m: uri.component('system/relation_params_manage'),
  restfulApi: false,
  mock,
};

const baseUri2 = {
  m: uri.component('biz_setting/target'),
  restfulApi: false,
  mock,
};

const topoBaseUri = {
  m: uri.component('topu'),
  restfulApi: false,
  mock,
};

const mevilBaseUri = {
  m: uri.component('rule_admin/command'),
  restfulApi: false,
  mock,
};

const importantTargetFeatureUri = {
  m: uri.component('important_target_feature'),
  restfulApi: false,
  mock,
}

const importantBaseUri = {
  m: uri.component('important_ip'),
  restfulApi: false,
  mock,
}

const importantTargetUri = {
  m: uri.component('important_target'),
  restfulApi: false,
  mock,
}

const nddsRunningUri = {
  m: uri.component('system', 'system_module_running_status'),
  restfulApi: false,
  mock,
};

const componentStatusUri = {
  m: uri.component('component_status'),
  restfulApi: false,
  mock,
};

const deviceManageUri = {
  m: uri.component('system', 'device_manage'),
  restfulApi: false,
  mock,
};

const appPortalUri = {
  m: uri.component('portal', 'log/report'),
  restfulApi: false,
  mock,
};

const faultLogUri = {
  m: uri.component('portal', 'log/fault_log'),
  restfulApi: false,
  mock,
}

const beOnDutyClassUri = {
  m: uri.component('portal', 'on_duties_system/task_types_manage'),
  restfulApi: false,
  mock,
}

const dutiesUri = {
  m: uri.component('portal', 'on_duties_system/duties'),
  restfulApi: false,
  mock,
}

const handoverUri = {
  m: uri.component('portal', 'on_duties_system/handover_duty'),
  restfulApi: false,
  mock,
}

const orgManageUri = {
  m: uri.component('system', 'org_manage'),
  restfulApi: false,
  mock,
}

const calendarUri = {
  m: uri.component('portal', 'on_duties_system/calendar'),
  restfulApi: false,
  mock,
}

const dutyRuleUri = {
  m: uri.component('portal', 'on_duties_system/duty_rule_settings'),
  restfulApi: false,
  mock,
}

const userStatusUri = {
  m: uri.component('portal', 'on_duties_system/user_status_manage'),
  restfulApi: false,
  mock,
}


function getSource() {
  return convertIndicesByMultiInstanceDev(config.dataSource) || '';
}

function checkAssetParams(params) {
  if (config.isGlobalAsset || config.assetCollectMode === 'global') params.globalAsset = '1';
}

function checkAssetSource(params) {
  if (config.isGlobalAsset || config.assetCollectMode === 'global') {
    params.globalAsset = '1';
    params.source = 'ottall';
  }
}

export async function counters(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'counters', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function overall(params) {
  if(!params.isSummary) {
    if (params && !params.source) {
      params.source = getSource();
    }
  }

  return request({
    url: uri.ops({ op: 'overall', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function trafficData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'traffic_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'traffic_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function ipTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_traffic', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function targetRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'target_relation', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function ipRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_relation', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function business (params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'business', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function outer(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'outer', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function ipList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function smpIplist(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'smp_ip', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function accounts(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'accounts', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function protocols(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocol_heat', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function account(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'account', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function businessIps(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'business_ips', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function topIpTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_order_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function targetTopTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'target_top_traffic', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function protocol(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocol', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function targetTransProtocol(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'target_trans_protocol', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function protocolTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocol_traffic', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function overviewTotal(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'overview_total', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function sourceCount(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'source_count', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function sourcefileCount(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'sourcefile_count', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function IpPairRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_pair_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function internetAccess(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'internet_access', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function targetList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'list', ...baseUri2 }),
    method: 'post',
     body: params,
  });
}

export async function singleIpProtocolTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'single_ip_protocol_traffic', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function targetProtocolTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'target_protocol_traffic', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function fileInfo(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'file_info', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function extranetIpRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'extranet_ip_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function httpServer(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'http_server', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function httpServerEdit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'http_server_edit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function httpdKeyword(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'httpd_host_key_word', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function httpKeywordRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'httpd_host_key_word_relation', ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function asTopology(params = {}) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'as_topology', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function asTopologyRelation(params = {}) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'as_topology_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function voipAccount(params = {}) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'voip_account', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function mailAccount(params = {}) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mail_account', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function mailAccountRelations(params = {}) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mail_account_relations', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function voipAccountRelation(params = {}) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'voip_account_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function portList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'port_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function ipPortList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_port_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function portTrafficData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'traffic_data', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function ctTrafficData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ct_traffic_data', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function ipRelationList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_relation_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function ipPortTodayProtocol(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_port_today_protocol', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function ipPort(params) {
  return request({
    url: uri.ops({ op: 'ip_port', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function portIpRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'port_ip_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function httpdServerTree(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'httpd_server_tree', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function delHttpdCloud(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'del_httpd_cloud', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function httpdWordCloud(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  if(params.filterSource) {
    delete params.filterSource;
  }
  return request({
    url: uri.ops({ op: 'httpd_word_cloud', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function stationSerch(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'station_search', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getVoipAccountIps(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'voip_account_ip', ...baseUri }),
    method: 'post',
     body: params,
  });
}


export async function getMailAccountIps(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mail_account_ip', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getEpartmenlist(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'departmen_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getDepartmenOverview(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'departmen_overview', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getmailStatistics(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mail_statistics', ...baseUri }),
    method: 'post',
     body: params,
  });
}

const baseUriDevConfig = {
  m: uri.component('nodes'),
  restfulApi: false,
  mock,
};

export async function getIpListRightData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'list', ...baseUriDevConfig }),
    method: 'post',
     body: params,
  });
}

export async function getXYListData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'XYlist', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getOneXYData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'oneXYlist', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getAPSDData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'APSDlist', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getVOIPData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'VOIPlist', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveAddData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'XYadd', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveAPSDAddData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'APSDadd', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveVOIPAddData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'VOIPadd', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveDeleteData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'XYdelete', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveAPSDDeleteData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'APSDdelete', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveVOIPDeleteData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'VOIPdelete', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveEditData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'XYedit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveAPSDEditData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'APSDedit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function saveVOIPEditData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'VOIPedit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function startConfig(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'startConfig', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function createConfigParams(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'create_config_params', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function departmenRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'departmen_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function mailWordCloud(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mail_word_cloud', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function mailContentSearch(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mail_content_search', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function mailFileSearch(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mail_file_search', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function ipOverview(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_overview', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function iprelationOverview(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'iprelation_overview', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function iprelationStatistics(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'iprelation_statistics', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function networkSegmentList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function networkSegmentOverview(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_overview', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function protocoleveltraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocol_level_traffic', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function protocolIpRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocol_ip_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function serverDiscovery(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'server_discovery', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function initMap(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'country_position', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function country(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'country', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function isp(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'servpr', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function as(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'as', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function lang(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'lang', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function protocolList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocol_list', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function lineTopCount(params) {
  const op = 'work_data_scanning';
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({op, ...baseUri, ...params}),
    method: 'post',
    body: params,
  })
}

export async function attackTraffic(params) {
  const op = 'attack_traffic';
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({op, ...baseUri, ...params}),
    method: 'post',
    body: params,
  })
}

export async function databaseServer(params) {
  const op = 'database_server';
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({op, ...baseUri}),
    method: 'post',
    body: {...params},
  })
}

export async function ipExceptionRecord(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_exception_record', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function subnetPairRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'subnet_pair_relation', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function icmpTopo(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'icmp_topo', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function opsCities(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'cities', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function lsdbVis(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'lsdb_vis', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function lsdbPosition(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'lsdb_position', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function lsdbPositionCreate(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'lsdb_position_create', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function lsdbPositionEdit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'lsdb_position_edit ', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function lsdbPositionDel(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'lsdb_position_del', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getCitylist(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'cities_geonames', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function cityEdit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'cities_geonames_edit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function lsdbPositionSet(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'lsdb_position_set', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function lineTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'line_traffic', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function ospfParams(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ospf_params', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function editOspfParams(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ospf_params_edit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function opsIpTrafficRank(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ip_traffic_rank', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function ospfAlarmLog(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ospf_alarm_log', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function subnetTrafficInOut(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'subnet_traffic_in_out', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function switchAddr2(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_addr2', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function switchAddr2Create(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_addr2_create', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function switchAddr2Del(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_addr2_del', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function switchAddr2Edit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_addr2_edit', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function switchCache(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_cache', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function switchRelation(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_relation', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function protocolMeta(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocol_meta', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function ctmsAnalysis(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'ctms_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function metaAddTags(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  if (window.systemParams.MultiInstance) {
    const indexName = params.table_name || '';
    const tableName = indexName.split(':');
    if (tableName.length > 1) params.table_name = tableName[1];
    const eip = getMultiInstanceDevIp(params.devId);
    if (eip) params.eip = eip;
  }
  return request({
    url: uri.ops({ op: 'meta_add_tags', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getTagsStatus(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'get_tags_status', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export function getTagsStatusWithCallback(params, cb) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return requestWithCallBack({
    url: uri.ops({ op: 'get_tags_status', ...baseUri }),
    method: 'post',
     body: params,
  }, null, cb);
}

export async function shbEigrpUser(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_eigrp_user', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function shbEigrpUserCreate(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_eigrp_user_create', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function shbEigrpUserDel(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_eigrp_user_del', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function shbEigrpUserEdit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_eigrp_user_edit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function switchRelationDetail(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_relation_detail', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function switchRelationDelete(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'switch_relation_delete', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getSPIGraphData(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'spi_graph_page_analysis', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getMevilHit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'search_info', ...mevilBaseUri }),
    method: 'post',
     body: params,
  });
}


export async function shbBgpAsSite(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_ipss_data', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getIpssTypes(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_ipss', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function shbBgpAsSiteCreate(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_ipss_data_create', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function shbBgpAsSiteDel(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_ipss_data_del', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function shbBgpAsSiteEdit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'shb_ipss_data_edit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function macList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mac', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function macOverview(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mac_overview', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export function getEsStatus(cb, params) {
  let newUrl = uri.ops({ op: 'get_es_status', ...baseUri });
  if (params) {
    newUrl = uri.ops({ op: 'get_es_status', ...baseUri }) + '&' + params;
  }
  return requestWithCallBack({
    url: newUrl,
    method: 'get',
    headers: {
      "UA": "95FE505BA1CB98",
    },
  }, null, cb);
}

export function getVolumeStatus(params) {
  return request({
    url: uri.ops({ op: 'get_es_status', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function setDataSearchSessting(params) {
  return request({
    url: uri.ops({ op: 'create_config_params', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getProExpStats(params) {
  return request({
    url: uri.ops({ op: 'obj_stats', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function protocolmetaKeywordList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocolmeta_keyword_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function protocolmetaKeywordOverall(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'protocolmeta_keyword_overall', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function prometaKeyword(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'prometa_keyword', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function prometaKeywordCreate(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'prometa_keyword_create', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function prometaKeywordEdit(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'prometa_keyword_edit', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function prometaKeywordDelete(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'prometa_keyword_delete', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getMacUsername(params) {
  return request({
    url: uri.ops({ op: 'mac_username', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getMacUsernamelist(params) {
  return request({
    url: uri.ops({ op: 'mac_username_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export async function getMacpositionhistorylist(params) {
  return request({
    url: uri.ops({ op: 'mac_position_history_list', ...baseUri }),
    method: 'post',
     body: params,
  });
}

export function getUploadIpMarkFilesUrl() {
  return uri.ops({op: 'upload_ip_mark_files', ...baseUri})
}

export async function getOverViews(params) {
  checkAssetParams(params);
  return request({
    url: uri.ops({ op: 'overview', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function protoTrafficAnalysis(params) {
  return request({
    url: uri.ops({ op: 'proto_traffic_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getDateHistogramData(params) {
  return request({
    url: uri.ops({ op: 'date_histogram_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function assetsIpStatistics(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_ip_statistics', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getRangsIpStatistics(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_rangs_statistics', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function assetsSearch(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_search', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getTopHost(params) {
  return request({
    url: uri.ops({ op: 'top_http_host', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getProtoRealtimeTrafficAnalysis(params) {
  return request({
    url: uri.ops({ op: 'proto_realtime_traffic_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getAssetsSubnetDataStatistics(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_subnet_data_statistics', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function createConfigService(params) {
  return request({
    url: uri.ops({ op: 'create_config_params', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getAssetsSearchTop(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_search_top', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function assetsIpRelationList(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_ip_relation_list', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function unknownStatistics(params) {
  return request({
    url: uri.ops({ op: 'unknown_statistics', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getAssetsTypeIps(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_type_ips', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getAssetsWarningList(params) {
  return request({
    url: uri.ops({ op: 'assets_warning', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function editAssetsWarning(params) {
  return request({
    url: uri.ops({ op: 'assets_warning_edit', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function importAssets(params) {
  checkAssetSource(params);
  return uri.ops({op: 'import_assets', ...baseUri, ...params})
}

export function importAssetsByText(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'import_assets', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function exportAssets(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'export_assets', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function createView(params) {
  return request({
    url: uri.ops({ op: 'create', ...dataViewBaseUri }),
    method: 'post',
    body: params,
  });
}

export function getView(params) {
  return request({
    url: uri.ops({ op: 'get_view', ...dataViewBaseUri }),
    method: 'post',
    body: params,
  });
}

export function dataViewTaskData(params) {
  return request({
    url: uri.ops({ op: 'data_view_task_data', ...dataViewBaseUri }),
    method: 'post',
    body: params,
  });
}

export function exportView() {
  return uri.ops({op: 'export_view', ...dataViewBaseUri})
}

export function importView() {
  return uri.ops({op: 'import_view', ...dataViewBaseUri})
}

export function assetsStatistics(params) {
  checkAssetSource(params);
  return request({
    url: uri.ops({ op: 'assets_statistics', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function importViewCover(params) {
  return request({
    url: uri.ops({ op: 'import_view', ...dataViewBaseUri }),
    method: 'post',
    body: params,
  });
}

export function getHistoryView(params) {
  return request({
    url: uri.ops({ op: 'get_view_history', ...dataViewBaseUri }),
    method: 'post',
    body: params,
  });
}

export function getIndexStatsList(params) {
  return request({
    url: uri.ops({ op: 'list', ...indexStatsUri }),
    method: 'post',
    body: params,
  });
}

export function getforceMerge(params) {
  return request({
    url: uri.ops({ op: 'force_merge', ...indexStatsUri }),
    method: 'post',
    body: params,
  });
}

export function snmpServer(params) {
  return request({
    url: uri.ops({ op: 'snmp_server', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function snmpCommunity(params) {
  return request({
    url: uri.ops({ op: 'snmp_community', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function vpnIps(params) {
  return request({
    url: uri.ops({ op: 'vpn_ips', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function relationSearch(params) {
  return request({
    url: uri.ops({ op: 'relation_search', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getDatabaseConfig(params) {
  return request({
    url: uri.ops({ op: 'create_config_params', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getDataAnalysis(params) {
  return request({
    url: uri.ops({ op: 'data_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function uploadImage(params) {
  return uri.ops({op: 'upload_image', ...baseUri, ...params})
}

export function showImage(params) {
  return request({
    url: uri.ops({ op: 'show_image', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getAnalysisTree(params) {
  return request({
    url: uri.ops({ op: 'protocol_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function metaDataTree(params) {
  return request({
    url: uri.ops({ op: 'meta_data_tree_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function routerAssets(params) {
  return request({
    url: uri.ops({ op: 'router_assets', ...topoBaseUri }),
    method: 'post',
    body: params,
  });
}

export function protocolmetaIpRelation(params) {
  return request({
    url: uri.ops({ op: 'protocolmeta_ip_relation', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function macUsernameEdit(params) {
  return request({
    url: uri.ops({ op: 'mac_username_edit', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function macUsernameDelete(params) {
  return request({
    url: uri.ops({ op: 'mac_username_delete', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getDocumentAnalysicTreeData(params) {
  return request({
    url: uri.ops({ op: 'file_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getDocumentAnalysicChartData(params) {
  return request({
    url: uri.ops({ op: 'file_aggregations_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getSystemAnalysisTree(params) {
  return request({
    url: uri.ops({ op: 'system_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getUpgradeStatus(params) {
  return request({
    url: uri.ops({ op: 'get_upgrade_status', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function setUpgradeStatus(params) {
  return request({
    url: uri.ops({ op: 'set_upgrade_status', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function syncMolochData(params) {
  return request({
    url: uri.ops({ op: 'sync_moloch_data', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function taskAnalysis(params) {
  return request({
    url: uri.ops({ op: 'task_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getCardLlist(params) {
  return request({
    url: uri.ops({ op: 'signal_overview', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getSignalDateHistogram(params) {
  return request({
    url: uri.ops({ op: 'signal_date_histogram', ...baseUri }),
    method: 'post',
    body: params,
  });
}

const locationBaseUri = {
  m: uri.component('dataView'),
  restfulApi: false,
  mock,
};

export function openNewlocaltionNode(params) {
  return request({
    url: uri.ops({ op: 'localtion_node', ...locationBaseUri }),
    method: 'post',
    body: params,
  });
}

export function getUnitTree(params) {
  return request({
    url: uri.ops({ op: 'user_company', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getSelectUserInfo(params) {
  return request({
    url: uri.ops({ op: 'user_target', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macUserDomain(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'user_domain', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function userHandle(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'user_handle', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function userDataSend(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'user_data_send', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macLineTraffic(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'line_traffic', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macUserEventList(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'user_event_list', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macUserBusinessFocus(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'user_business_focus', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macPositionOverview(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mac_position_overview', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macUserDetail(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'user_detail', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macStatis(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mac_statis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macRelationIp(params) {
  if (params && !params.source) {
    params.source = getSource();
  }
  return request({
    url: uri.ops({ op: 'mac_relation_ip', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function reStartEs(params) {
  return request({
    url: uri.ops({ op: 'restart_es', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getDeviceCode(params) {
  return request({
    url: uri.ops({ op: 'get_device_code', ...systemUpgradeUri }),
    method: 'post',
    body: params,
  });
}

export async function checkLicenceCode(params) {
  return request({
    url: uri.ops({ op: 'check_licence_code', ...systemUpgradeUri }),
    method: 'post',
    body: params,
  });
}

export async function getTargetDataTreeAnalysis(params) {
  return request({
    url: uri.ops({ op: 'target_data_tree_analysis', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function getTimeLineTimeList(params) {
  return request({
    url: uri.ops({ op: 'relation_date_histogram', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function macPositionHistoryDelete(params) {
  return request({
    url: uri.ops({ op: 'mac_position_history_delete', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function importantIpList(params) {
  return request({
    url: uri.ops({ op: 'list', ...importantBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function importantIpAnalyse(params) {
  return request({
    url: uri.ops({ op: 'analyse', ...importantBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function createImportantIp(params) {
  return request({
    url: uri.ops({ op: 'create', ...importantBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function deleteImportantIp(params) {
  return request({
    url: uri.ops({ op: 'del', ...importantBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function editImportantIp(params) {
  return request({
    url: uri.ops({ op: 'edit', ...importantBaseUri }),
    method: 'post',
    body: params,
  });
}

export async function editUserInfo(params) {
  return request({
    url: uri.ops({ op: 'user_detail_edit', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function importantTargetList(params) {
  return request({
    url: uri.ops({ op: 'list', ...importantTargetUri }),
    method: 'post',
    body: params,
  });
}

export async function importantTargetAnalyse(params) {
  return request({
    url: uri.ops({ op: 'analyse', ...importantTargetUri }),
    method: 'post',
    body: params,
  });
}

export async function createImportantTarget(params) {
  return request({
    url: uri.ops({ op: 'create', ...importantTargetUri }),
    method: 'post',
    body: params,
  });
}

export async function deleteImportantTarget(params) {
  return request({
    url: uri.ops({ op: 'del', ...importantTargetUri }),
    method: 'post',
    body: params,
  });
}

export async function editImportantTarget(params) {
  return request({
    url: uri.ops({ op: 'edit', ...importantTargetUri }),
    method: 'post',
    body: params,
  });
}

export async function importantTargetListFeature(params) {
  return request({
    url: uri.ops({ op: 'list', ...importantTargetFeatureUri }),
    method: 'post',
    body: params,
  });
}

export async function importantTargetAnalyseFeature(params) {
  return request({
    url: uri.ops({ op: 'analyse', ...importantTargetFeatureUri }),
    method: 'post',
    body: params,
  });
}

export async function createImportantTargetFeature(params) {
  return request({
    url: uri.ops({ op: 'create', ...importantTargetFeatureUri }),
    method: 'post',
    body: params,
  });
}

export async function deleteImportantTargetFeature(params) {
  return request({
    url: uri.ops({ op: 'del', ...importantTargetFeatureUri }),
    method: 'post',
    body: params,
  });
}

export async function editImportantTargetFeature(params) {
  return request({
    url: uri.ops({ op: 'edit', ...importantTargetFeatureUri }),
    method: 'post',
    body: params,
  });
}

export async function getNddsRuningStatus (params) {
  const op = 'get_ndds_running_status'
  return request({
    url: uri.ops({ op, ...nddsRunningUri }),
    method: 'post',
    body: params,
  })
}

export async function getProtocolMetaUserTarget (params) {
  const op = 'protocol_meta_user_target'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getComponentStatusList (params) {
  return request({
    url: uri.ops({ op: 'get_database_tables', ...componentStatusUri }),
    method: 'post',
    body: params,
  })
}

export async function getComponentViewStatus (params) {
  return request({
    url: uri.ops({ op: 'get_component_view_status', ...componentStatusUri }),
    method: 'post',
    body: params,
  })
}

export async function createRelation (params) {
  return request({
    url: uri.ops({ op: 'create_relation', ...componentStatusUri }),
    method: 'post',
    body: params,
  })
}

export async function getNetworkData (params) {
  return request({
    url: uri.ops({ op: 'get_network_data', ...componentStatusUri }),
    method: 'post',
    body: params,
  })
}

export async function getNetworkDataDetail (params) {
  return request({
    url: uri.ops({ op: 'get_component_detail', ...componentStatusUri }),
    method: 'post',
    body: params,
  })
}

export async function getLineinfoData (params) {
  return request({
    url: uri.ops({ op: 'get_lineinfo_data', ...componentStatusUri }),
    method: 'post',
    body: params,
  })
}

export async function getAssetsWeakness (params) {
  return request({
    url: uri.ops({ op: 'assets_weakness', ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getImsiAnalysis (params) {
  return request({
    url: uri.ops({ op: 'imsi_analysis', ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getDeviceManage (params) {
  return request({
    url: uri.ops({ op: 'get_device', ...deviceManageUri }),
    method: 'post',
    body: params,
  })
}

export async function createDeviceManage (params) {
  return request({
    url: uri.ops({ op: 'device_type_create', ...deviceManageUri }),
    method: 'post',
    body: params,
  })
}

export async function deleteDeviceManage (params) {
  return request({
    url: uri.ops({ op: 'device_del', ...deviceManageUri }),
    method: 'post',
    body: params,
  })
}

export async function createImsiManage (params) {
  return request({
    url: uri.ops({ op: 'create', ...imsiManageUri }),
    method: 'post',
    body: params,
  })
}

export async function imsiManageList (params) {
  return request({
    url: uri.ops({ op: 'list', ...imsiManageUri }),
    method: 'post',
    body: params,
  })
}

export async function delImsiManage (params) {
  return request({
    url: uri.ops({ op: 'del', ...imsiManageUri }),
    method: 'post',
    body: params,
  })
}

export async function getDailyList(params) {
  const op = 'list';
  return request({
    url: uri.ops({ op, ...appPortalUri }),
    method: 'post',
    body: params,
  })
}

export async function createReport(params) {
  const op = 'create';
  return request({
    url: uri.ops({ op, ...appPortalUri }),
    method: 'post',
    body: params,
  })
}

export async function deleteReport(params) {
  const op = 'del';
  return request({
    url: uri.ops({ op, ...appPortalUri }),
    method: 'post',
    body: params,
  })
}

export async function editReport(params) {
  const op = 'edit';
  return request({
    url: uri.ops({ op, ...appPortalUri }),
    method: 'post',
    body: params,
  })
}

export async function createFaultLog(params) {
  const op = 'create';
  return request({
    url: uri.ops({ op, ...faultLogUri }),
    method: 'post',
    body: params,
  })
}

export async function editFaultLog(params) {
  const op = 'edit';
  return request({
    url: uri.ops({ op, ...faultLogUri }),
    method: 'post',
    body: params,
  })
}

export async function getFaultLog(params) {
  const op = 'list';
  return request({
    url: uri.ops({ op, ...faultLogUri }),
    method: 'post',
    body: params,
  })
}

export async function delFaultLog(params) {
  const op = 'del';
  return request({
    url: uri.ops({ op, ...faultLogUri }),
    method: 'post',
    body: params,
  })
}

export function getUploadFaultLogImgUrl(params) {
  return uri.ops({ op: 'upload_solution', ...faultLogUri, ...params })
}

export async function addDoc(params) {
  const method = params.method;
  delete params.method;
  return request({
    url: `${config.grepPcapUrl}/doc/file`,
    method,
    credentials: 'same-origin',
    mode: 'cors',
    json: true,
    body: params,
  });
}

export async function delDoc(params) {
  return request({
    url: `${config.grepPcapUrl}/doc/file/${params.id}`,
    method: 'DELETE',
    credentials: 'same-origin',
    mode: 'cors',
  });
}

export async function batchDelDoc(params) {
  return request({
    url: `${config.grepPcapUrl}/doc/file/batch`,
    method: 'DELETE',
    credentials: 'same-origin',
    mode: 'cors',
    json: true,
    body: params,
  });
}

export async function getDutyClasses(params) {
  const op = 'list';
  return request({
    url: uri.ops({ op, ...beOnDutyClassUri }),
    method: 'post',
    body: params,
  })
}

export async function createDutyClasses(params) {
  const op = 'create';
  return request({
    url: uri.ops({ op, ...beOnDutyClassUri }),
    method: 'post',
    body: params,
  })
}

export async function delDutyClasses(params) {
  const op = 'del';
  return request({
    url: uri.ops({ op, ...beOnDutyClassUri }),
    method: 'post',
    body: params,
  })
}

export async function editDutyClasses(params) {
  const op = 'edit';
  return request({
    url: uri.ops({ op, ...beOnDutyClassUri }),
    method: 'post',
    body: params,
  })
}

export async function createOrgManage(params) {
  const op = 'create';
  return request({
    url: uri.ops({ op, ...orgManageUri }),
    method: 'post',
    body: params,
  })
}

export async function editOrgManage(params) {
  const op = 'edit';
  return request({
    url: uri.ops({ op, ...orgManageUri }),
    method: 'post',
    body: params,
  })
}

export async function delOrgManage(params) {
  const op = 'del';
  return request({
    url: uri.ops({ op, ...orgManageUri }),
    method: 'post',
    body: params,
  })
}

export async function listOrgManage(params) {
  const op = 'list';
  return request({
    url: uri.ops({ op, ...orgManageUri }),
    method: 'post',
    body: params,
  })
}

export async function getDutiesList(params) {
  const op = 'list';
  return request({
    url: uri.ops({ op, ...dutiesUri }),
    method: 'post',
    body: params,
  })
}

export async function createDuties(params) {
  const op = 'create';
  return request({
    url: uri.ops({ op, ...dutiesUri }),
    method: 'post',
    body: params,
  })
}

export async function delDuties(params) {
  const op = 'del';
  return request({
    url: uri.ops({ op, ...dutiesUri }),
    method: 'post',
    body: params,
  })
}

export async function getHandoverDuty(params) {
  const op = 'list';
  return request({
    url: uri.ops({ op, ...handoverUri }),
    method: 'post',
    body: params,
  })
}

export async function createHandoverDuty(params) {
  const op = 'create';
  return request({
    url: uri.ops({ op, ...handoverUri }),
    method: 'post',
    body: params,
  })
}

export async function getHandoverDutyRemind(params) {
  const op = 'get_remind';
  return request({
    url: uri.ops({ op, ...handoverUri }),
    method: 'post',
    body: params,
  })
}

export async function getHandoverDutyEdit(params) {
  const op = 'edit';
  return request({
    url: uri.ops({ op, ...handoverUri }),
    method: 'post',
    body: params,
  })
}

export async function getMeetingRemind(params) {
  const op = 'schedule_remind';
  return request({
    url: uri.ops({ op, ...calendarUri }),
    method: 'post',
    body: params,
  })
}

export async function editMeetingRemind(params) {
  const op = 'event_edit';
  return request({
    url: uri.ops({ op, ...calendarUri }),
    method: 'post',
    body: params,
  })
}

export async function dataQuery (params) {
  return request({
    url: config.dataQueryUrl,
    method: 'post',
    credentials: 'same-origin',
    mode: 'cors',
    json: true,
    body: params,
  });
}

export function getDependableIp(params) {
  return request({
    url: uri.ops({ op: 'get_dependable_ip', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export async function settingDependableIp(params) {
  return request({
    url: uri.ops({ op: 'setting_dependable_ip', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function getServerConfigPort(params) {
  return request({
    url: uri.ops({ op: 'get_dependable_ip', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function setServerConfigPort(params) {
  return request({
    url: uri.ops({ op: 'get_dependable_ip', ...baseUri }),
    method: 'post',
    body: params,
  });
}

export function importSoftFile(params) {
  return uri.ops({ op: 'upload_tools', ...appSoftwareUri, ...params })
}

export function createTools(params) {
  return request({
    url: uri.ops({ op: 'create_tools', ...appSoftwareUri }),
    method: 'post',
    body: params,
  });
}

export function getToolsList(params) {
  return request({
    url: uri.ops({ op: 'get_tools', ...appSoftwareUri }),
    method: 'post',
    body: params,
  });
}

export function delTools(params) {
  return request({
    url: uri.ops({ op: 'tools_del', ...appSoftwareUri }),
    method: 'post',
    body: params,
  });
}

export function downloadTools(params) {
  return uri.ops({op: 'download_tools', ...appSoftwareUri, ...params})
}

export function getRuleSettings(params) {
  return request({
    url: uri.ops({ op: 'list', ...dutyRuleUri }),
    method: 'post',
    body: params,
  });
}

export function createRuleSettings(params) {
  return request({
    url: uri.ops({ op: 'create', ...dutyRuleUri }),
    method: 'post',
    body: params,
  });
}

export function delRuleSettings(params) {
  return request({
    url: uri.ops({ op: 'del', ...dutyRuleUri }),
    method: 'post',
    body: params,
  });
}

export function getStatusType(params) {
  return request({
    url: uri.ops({ op: 'get_user_status_conf', ...userStatusUri }),
    method: 'post',
    body: params,
  });
}

export function createStatusType(params) {
  return request({
    url: uri.ops({ op: 'status_type_create', ...userStatusUri }),
    method: 'post',
    body: params,
  });
}

export function createUserStatusType(params) {
  return request({
    url: uri.ops({ op: 'create_user_status', ...userStatusUri }),
    method: 'post',
    body: params,
  });
}

export async function getMetadataSaveRule (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...metadataSaveRule }),
    method: 'post',
    body: params,
  })
}

export async function createMetadataSaveRule (params) {
  const op = 'create'
  return request({
    url: uri.ops({ op, ...metadataSaveRule }),
    method: 'post',
    body: params,
  })
}

export async function updateMetadataSaveRule (params) {
  const op = 'edit'
  return request({
    url: uri.ops({ op, ...metadataSaveRule }),
    method: 'post',
    body: params,
  })
}

export async function removeMetadataSaveRule (params) {
  const op = 'del'
  return request({
    url: uri.ops({ op, ...metadataSaveRule }),
    method: 'post',
    body: params,
  })
}

export async function createRulePath (params) {
  const op = 'create_rule_path'
  return request({
    url: uri.ops({ op, ...metadataSaveRule }),
    method: 'post',
    body: params,
  })
}

export async function getRelationTemplateList (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...relationTemplateManageRule }),
    method: 'post',
    body: params,
  })
}

export async function createRelationTemplate (params) {
  const op = 'create'
  return request({
    url: uri.ops({ op, ...relationTemplateManageRule }),
    method: 'post',
    body: params,
  })
}

export async function deleteRelationTemplate (params) {
  const op = 'del'
  return request({
    url: uri.ops({ op, ...relationTemplateManageRule }),
    method: 'post',
    body: params,
  })
}

export async function getRelationIconParams(params) {
  return request({
    url: uri.ops({ op: 'params', ...relationParamsManageRule }),
    method: 'post',
     body: params,
  });
}
