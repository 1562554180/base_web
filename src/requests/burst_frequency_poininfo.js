import request from 'utils/request';
import uri from 'utils/uri';

const mock = false;
const baseUri = {
  m: uri.component('burst_frequency_poininfo'),
  restfulApi: false,
  mock,
};

const wSUri = {
  m: uri.component('waveform_separation'),
  restfulApi: false,
  mock,
};

const baseUri2 = {
  m: uri.component('set_config'),
  restfulApi: false,
  mock,
};

const indexUri = {
  m: uri.component('index'),
  restfulApi: false,
  mock,
};

export async function $(params) {
  const op = '$'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function list(params) {
  const op = 'list'
  const res = request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
  return res;
}

export async function burstcountlist(params) {
  const op = 'burst_count_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function countchart(params) {
  const op = 'count_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function burstchart(params) {
  const op = 'burst_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function tableList(params) {
  const op = 'entry_group'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function create(params) {
  const op = 'create'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function remove(params) {
  const op = 'del'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function update(params) {
  const op = 'edit'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function changeStatus(params) {
  const op = 'set_group'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function forminitSecond(params) {
  const op = 'get_command'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function countChart(params) {
  const op = 'count_chart'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}
// export function getSignalingData(params, cb) {
//   return requestWithCallBack({
//     url: '/yuantek/?m=/burst_frequency_poininfo&op=entry_group',
//     method: 'post',
//     body: params,
//     credentials: 'same-origin',
//   }, null, cb)
// }
export async function getDevtype(params) {
  // const op = 'get_devtype'
  return request({
    url: '/yuantek/?m=/burst_frequency_poininfo&op=get_devtype',
    // url: uri.addProxyOps({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function lw2EntryGroup(params) {
  const op = 'lw2_entry_group'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取skyEdgeII 小组状态列表
export async function getSEIIList(params) {
  const op = 'get_se2netinfo'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取VMP-IDEV 小组状态列表
export async function getIDEVList(params) {
  const op = 'get_idnetinfo'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 计算变频器中心流量辅助计算
export async function countCenterFrequency(params) {
  const op = 'get_center_freq'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取分配突发总数统计
export async function getBurstcountListNum(params) {
  const op = 'get_devtype'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取活跃终端数统计
export async function getActiveTerminalNum(params) {
  const op = 'get_devtype'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取占空比统计
export async function getSiginalZhanKongRate(params) {
  const op = 'get_devtype'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取小区用户数量
export async function getSubStationUserCount(params) {
  const op = 'get_devtype'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 通道参数设置
export async function channelSetting(params) {
  const op = 'set_agent_config'
  return request({
    url: uri.ops({ op, ...baseUri2 }),
    method: 'post',
    body: params,
  })
}

export async function getCollectStatus(params) {
  const op = 'get_collect_status'
  return request({
    url: uri.ops({ op, ...wSUri }),
    method: 'post',
    body: params,
  })
}

export async function getSeparateSchedule(params) {
  const op = 'get_separate_schedule'
  return request({
    url: uri.ops({ op, ...wSUri }),
    method: 'post',
    body: params,
  })
}

export async function getHistorySeparateSchedule(params) {
  const op = 'get_separate_history'
  return request({
    url: uri.ops({ op, ...wSUri }),
    method: 'post',
    body: params,
  })
}

export async function getBurstNumber(params) {
  const op = 'get_burst_number'
  return request({
    url: uri.ops({ op, ...wSUri }),
    method: 'post',
    body: params,
  })
}

export async function delSeparateHistory(params) {
  const op = 'separate_history_del'
  return request({
    url: uri.ops({ op, ...wSUri }),
    method: 'post',
    body: params,
  })
}

export async function getDiskInfo(params) {
  const op = 'get_disk_info'
  return request({
    url: uri.ops({ op, ...indexUri }),
    method: 'post',
    body: params,
  })
}

export async function getCurrentTaskStatus(params) {
  const op = 'get_task_status'
  return request({
    url: uri.ops({ op, ...indexUri }),
    method: 'post',
    body: params,
  })
}
