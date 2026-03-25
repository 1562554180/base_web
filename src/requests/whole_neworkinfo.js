import request,{requestWithCallBack} from 'utils/request';
import uri from 'utils/uri';
import config from 'utils/config';


const serviceSuffix = config.isLocal ? 'http://172.16.10.172:54028' :  `http://${window.location.hostname}:${config.vsatSourceStateChartPort || '43210'}`

const mock = false;
const baseUri = {
  m: uri.component('whole_neworkinfo'),
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

export async function loadPageConfig (params) {
  const op = 'loadPageConfig'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function list (params) {
  const op = 'list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function burstcountlist (params) {
  const op = 'burst_count_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function countchart (params) {
  const op = 'count_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function burstchart (params) {
  const op = 'burst_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function create (params) {
  const op = 'create'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function remove (params) {
  const op = 'del'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function update (params) {
  const op = 'edit'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getBarChartData (params) {
  const op = 'termid_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getHeatData (params) {
  const op = 'burst_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 定位数据采集获取采集中弹框数据
export async function getEntryingData (params) {
  const op = 'data_collection'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取旧的时频图数据
export async function getOldTimeHeatData (params) {
  const op = 'time_freq'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取新增时频图数据
export async function getTimeHeatData (params) {
  const op = 'time_freq_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取占空比数据
export async function getZhanKongChartData (params) {
  const op = 'small_station_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取LW2时频图数据
export async function lw2TimeFreq (params) {
  const op = 'lw2_time_freq'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function vmpidburstcountlist (params) {
  const op = 'vmpid_burst_count_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取小区历史统计分配突发数量、正确接收数量、完整率
export async function getSubStionHistoryData (params) {
  const op = 'burst_count_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取小区历史统计分配突发数量、正确接收数量、完整率热力图
export async function getSubStionHistoryHeatData (params) {
  const op = 'burst_count_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取小区的的频偏数据
export function getSubStionFreqOffsetLineData(params, cb) {
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/HistorySmallCellFrameoffsetCnt?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&desc64=${params.desc64}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取小区的信噪比数据
export function getSubStionSnrLineData(params, cb) {
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/HistorySmallCellSNRCnt?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&desc64=${params.desc64}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

//  获取小区占空比数据
export function getTerminalDutyCycleData(params, cb) {
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/terminal_duty_cycle?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&terminal_type=${params.terminal_type}&terminal_id=${params.terminal_id}&group_id=${params.group_id}&net_number=${params.net_number}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取折线图数据
export function getGroupChannelEchData(params, cb) {
  // let desc64 = params.desc64;
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/HistorySmallCellDutyCnt?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&desc64=${params.desc64}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取热力图数据
export  function getGroupHeatChartData (params,cb) {
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/HistorySmallCellDutyCntByMode?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&desc64=${params.desc64}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取码率热力图数据
export  function getCodeRateHeatChart (params,cb) {
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/HistorySmallCellDutyCntByRate?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&desc64=${params.desc64}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}
// 获取信噪比热力图数据
export  function getSnrHeatChart (params,cb) {
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/HistorySmallCellDutyCntBySNR?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&desc64=${params.desc64}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 获取小区突发数
// export async function getStationBurstChartData(params) {
//   const op = 'assignid_frequency_heat_chart'
//   return request({
//     url: uri.ops({ op, ...baseUri }),
//     method: 'post',
//     body: params,
//   })
// }
export  function getStationBurstChartData (params,cb) {
  return requestWithCallBack({
    url: `${serviceSuffix}/ServerStat/HistoryRemoteFreqCnt?vsat_id=${params.vsat_id}&Start=${params.Start}&End=${params.End}&desc64=${params.desc64}`,
    method: 'get',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}
