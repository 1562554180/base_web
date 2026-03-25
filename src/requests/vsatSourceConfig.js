import request, { requestWithCallBack } from 'utils/request';
import uri from 'utils/uri';
import _ from 'lodash';
import config from 'utils/config';

const localTestUrl = config.isLocal ? `http://${config.statePageUrl}:54028` : `http://${window.location.hostname}:${config.vsatSourceStateChartPort || 54028}`;

const mock = false;
const baseUri = {
  m: uri.component('vsat'),
  restfulApi: false,
  mock,
};

const baseUriOne = {
  m: uri.component('satellite_statistics_analysis'),
  restfulApi: false,
  mock,
  servicePrefix: "./slot",
}

const baseUriTwo = {
  m: uri.component('system/device_manage'),
  restfulApi: false,
  mock,
  servicePrefix: "./slot",
}

const baseUriThree = {
  m: uri.component('/system/relation_params_manage'),
  restfulApi: false,
  mock,
  servicePrefix: "./slot",
}

function getParam (fields, param) {
  let finalStr = '';
  if (!_.isEmpty(fields)) {
    for(const item of fields) {
      if (param[item.value] || String(param[item.value]) ==='0') {
        finalStr += `&${item.key}=${param[item.value] || ''}`;
      }
    }
  }
  return finalStr;
}

export async function getFreqList(params) {
  const op = 'frequency_info'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,

  })
}

export async function getSubStationList(params) {
  const op = 'station_info'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,

  })
}

export async function getAgreementData(params) {
  const op = 'get_business_protion'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getFlowData(params) {
  const op = 'get_traffic'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getSubStationStatusData(params) {
  const op = 'small_station_status'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getSubStationTopuData(params) {
  const op = 'station_topo'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getStationPositionData(params) {
  const op = 'get_station_postion'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getStationPositionHistoryData(params) {
  const op = 'get_station_postion_history'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getMainSlotTimeData(params) {
  const op = 'get_small_station_slot_allocation'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getSubEverySlotTimeData(params) {
  const op = 'get_small_station_slot_allocation'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getSubStationSlotTimeData(params) {
  const op = 'get_small_station_slot_allocation'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getNetTdmaData(params) {
  const op = 'get_tdma_slot_allocation'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getCommonSearchData(params) {
  const op = 'search_value_data'
  return request({
    url: uri.ops({ op, ...baseUriOne }),
    method: 'post',
    body: params,

  })
}

export async function getTreeChartData(params) {
  const op = 'tree_chart_analysis'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,

  })
}

export async function getHeatChartData(params) {
  const op = 'heat_chart_analysis'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,

  })
}

export async function getCountNumber(params) {
  const op = 'get_frequency_count'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,

  })
}

export async function getHardWareNum(params) {
  const op = 'topo_search_data'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,

  })
}

export async function getDeviceList(params) {
  const op = 'get_device'
  return request({
    url: uri.ops({ op, ...baseUriTwo }),
    method: 'post',
    body: params,

  })
}

export async function handleSetTreeRootInfo(params) {
  const op = 'set_tree_host_info'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,

  })
}

export async function getParams(params) {
  const op = 'params'
  return request({
    url: uri.ops({ op, ...baseUriThree }),
    method: 'post',
    body: params,

  })
}

export async function getParamsCreate(params) {
  const op = 'params_create'
  return request({
    url: uri.ops({ op, ...baseUriThree }),
    method: 'post',
    body: params,

  })
}

export function getServerStat(params, cb) {
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/StationCarrier?Vsat_id=${params.vsat_id}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

export function getStationIpMod(params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'start',
    },
    {
      key: 'End',
      value: 'end',
    },
    {
      key: 'Carrier_id',
      value: 'carrier_id',
    }
  ];
  const otherParamStr = getParam(fields, params);
  let upModUrl = `${localTestUrl}/ServerStat/RemoteChangeCarrier?Vsat_id=${params.vsat_id}${otherParamStr}`;
  return requestWithCallBack({
    url: upModUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

export function getNetStateList (params, cb) {
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/NetStation`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取小区抄收数据统计-折线图
export function getSubStationChartData(params, cb) {
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/sat_h_r_burst_count?vsat_id=${params.vsat_id}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取波束占空比数据
export function getDutyCycleChartData(params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'start',
    },
    {
      key: 'End',
      value: 'end',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/CarrierDutyCycle?Vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取主校区抄收数据统计-信噪比
export function getMainStationCountSnr (params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'start',
    },
    {
      key: 'End',
      value: 'end',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/dvb_carrier_snrinfo?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取主校区抄收数据统计-电平
export function getMainStationCountLevel(params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'start',
    },
    {
      key: 'End',
      value: 'end',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/dvb_carrier_lvlinfo?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取主校区抄收数据统计-频偏
export function getMainStationCountFreqOffset(params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'start',
    },
    {
      key: 'End',
      value: 'end',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/dvb_carrier_foffset?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取主校区MOD CODE表格数据
export function getMainStationModData(params, cb) {
  const fields = [
    {
      key: 'push_interval',
      value: 'push_interval',
    },
    {
      key: 'rows',
      value: 'rows',
    },
    {
      key: 'End',
      value: 'End',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/dvb_modcod_info_xls?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取主校区MODE CODE热力图数据
export function getMainStationModeHeatData(params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'Start',
    },
    {
      key: 'End',
      value: 'End',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/dvb_modcod_info_hmp?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取小区抄收数据统计-表格
export function getSubStationTableData (params, cb) {
  const fields = [
    {
      key: 'key_type',
      value: 'key_type',
    },
    {
      key: 'key_id',
      value: 'key_id',
    }
  ];
  // ${otherParamStr} 可以先不传，后期有拓展可以传
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/sat_remote_tdma_cnt?vsat_id=${params.vsat_id}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取拓扑图数据
export function getServerTopuData(params, cb) {
  const fields = [
    {
      key: 'max_sub_node',
      value: 'loadNode',
    },
    {
      key: 'load_node',
      value: 'max',
    },
    {
      key: 'layout_type',
      value: 'layoutType',
    }
  ];
  const otherParamStr = getParam(fields, params);
  let upModUrl = `${localTestUrl}/ServerStat/station_ip_relation?vsat_id=${params.vsat_id}${otherParamStr}`;
  return requestWithCallBack({
    url: upModUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取小区拓扑图数据
export function getServerSubstationTopuData(params, cb) {
  const fields = [
    {
      key: 'load_node',
      value: 'max',
    },
    {
      key: 'layout_type',
      value: 'layoutType',
    }
  ];
  const otherParamStr = getParam(fields, params);
  let upModUrl = `${localTestUrl}/ServerStat/hub_remote_relation?vsat_id=${params.vsat_id}${otherParamStr}`;
  return requestWithCallBack({
    url: upModUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取树图topu数据
export function getServerTreeTopuData(params, cb) {
  const fields = [
    {
      key: 'load_node',
      value: 'max',
    },
    {
      key: 'layout_type',
      value: 'layoutType',
    }
  ];
  const otherParamStr = getParam(fields, params);
  let upModUrl = `${localTestUrl}/ServerStat/sat_h_r_ip_relation?vsat_id=${params.vsat_id}${otherParamStr}`;
  return requestWithCallBack({
    url: upModUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取树图数据
export function getServerTreeData(params, cb) {
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/tree_chart_analysis?vsat_id=${params.vsat_id}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取热力图数据
export function getServerHeatData(params, cb) {
  const fields = [
    {
      key: 'begin_time',
      value: 'start',
    },
    {
      key: 'end_time',
      value: 'end',
    },
  ]
  const otherParamStr = getParam(fields, params);
  let upModUrl = `${localTestUrl}/ServerStat/heat_chart_analysis?vsat_id=${params.vsat_id}${otherParamStr}`;
  return requestWithCallBack({
    url: upModUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取网络组成数据
export function getNetMakeUpdata(params, cb) {
  const reqUrl = `${localTestUrl}/ServerStat/network_comp_arch?day_time=${params.time}`;
  return requestWithCallBack({
    url: reqUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取默认保存参数
export function getDefaultSourceConfig (params, cb) {
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/data_source`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 检测功能/保存配置
export function setSourceConfig(params, cb) {
  let upModUrl = `${localTestUrl}/ServerStat/create_data_source?work_mode=${params.work_mode}&mount_way=${params.mount_way}&source_path=${params.source_path}&username=${params.username}&password=${params.password}`;
  if (params.version) {
    upModUrl = `${localTestUrl}/ServerStat/create_data_source?work_mode=${params.work_mode}&mount_way=${params.mount_way}&source_path=${params.source_path}&username=${params.username}&password=${params.password}&version=${params.version}`;
  }
  return requestWithCallBack({
    url: upModUrl,
    method: 'POST',
    credentials: 'same-origin',
    json: true,
    body: params ? params : {},
  }, null, cb)
}

// 获取时间范围内所有有数据时间
export function getTimeRangeTableData(params, cb) {
  let upModUrl = `${localTestUrl}/ServerStat/data_day?begin_time=${params.startTime}&end_time=${params.endTime}`;
  return requestWithCallBack({
    url: upModUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取某个时间点内所有的networkingid
export function getMatchTimeNetWorkingIdList(params, cb) {
  let upModUrl = `${localTestUrl}/ServerStat/networkid?day_time=${params.time}`;
  return requestWithCallBack({
    url: upModUrl,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取存储配置设置
export function getStorageConfig(params, cb) {
  let otherParamStr = `?type=${params.type}`;
  if (params.time) {
    otherParamStr = `?type=${params.type}&time=${params.time}`;
  }
  let configUrl = `${localTestUrl}/ServerStat/DataInterval${otherParamStr}`;
  return requestWithCallBack({
    url: configUrl,
    method: 'POST',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 配置机器等设置
export function setNetStationBand(params, cb) {
  const fields = [
    {
      key: 'net_name',
      value: 'net_name',
    },
    {
      key: 'location',
      value: 'location',
    },
    {
      key: 'polarization',
      value: 'polarization',
    },
    {
      key: 'band',
      value: 'band',
    },
    {
      key: 'center_freq',
      value: 'center_freq',
    }
  ]
  const otherParamStr = getParam(fields, params);
  let configUrl = `${localTestUrl}/ServerStat/ModNetStation${otherParamStr}?Vsat_id=${params.vsat_id}${otherParamStr}`;
  return requestWithCallBack({
    url: configUrl,
    method: 'POST',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取发射版本小区信噪比数据
export function getLaunchStationSnrData(params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'Start',
    },
    {
      key: 'End',
      value: 'End',
    },
    {
      key: 'terminal_type',
      value: 'terminal_type',
    },
    {
      key: 'terminal_id',
      value: 'terminal_id',
    },
    {
      key: 'group_id',
      value: 'group_id',
    },
    {
      key: 'net_number',
      value: 'net_number',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/terminal_snr?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取发射版本小区电平数据
export function getLaunchStationLevelData(params, cb) {
  const fields = [
    {
      key: 'Start',
      value: 'Start',
    },
    {
      key: 'End',
      value: 'End',
    },
    {
      key: 'terminal_type',
      value: 'terminal_type',
    },
    {
      key: 'terminal_id',
      value: 'terminal_id',
    },
    {
      key: 'group_id',
      value: 'group_id',
    },
    {
      key: 'net_number',
      value: 'net_number',
    }
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/terminal_level?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}
