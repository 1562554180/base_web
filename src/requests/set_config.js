import request, { requestWithCallBack } from 'utils/request';
import uri from 'utils/uri';

const mock = false;
const baseUri = {
  m: uri.component('set_config'),
  restfulApi: false,
  mock,
};

export async function setChannel(params) {
  const op = 'set_channel'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setChannelProgress(params) {
  const op = 'set_channel'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setupGroup(params) {
  const op = 'setup_group'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setupGroupProgress(params) {
  const op = 'setup_group'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setDvbStatus(params) {
  const op = 'set_dvb'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function list(params) {
  const op = 'get_net_output'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getFileOutput(params) {
  const op = 'get_file_output'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setFileOutput(params) {
  const op = 'set_file_output'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function forminit(params) {
  const op = 'get_dvb'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getFrequency(params) {
  const op = 'get_frequency '
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setFrequency(params) {
  const op = 'set_frequency'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setDevId(params) {
  const op = 'set_dev_id'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getNetOutput(params) {
  const op = 'get_net_output'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setNetOutput(params) {
  const op = 'set_net_output'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setSignaldiag(params) {
  const op = 'set_signaldiag'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setLw2Frequency(params) {
  const op = 'set_lw2_frequency'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getLw2Frequency(params) {
  const op = 'get_lw2_frequency'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function resetLw2Freq(params) {
  const op = 'reset_lw2_freq'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getClockConfig(params) {
  const op = 'get_clock_config'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}


export async function setClockConfig(params) {
  const op = 'set_clock_config'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 保存推荐变频器中心流量
export async function setFrequencyConfig(params) {
  const op = 'set_frequency'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 开始采集定位数据
export async function startEntryLocation(params) {
  const op = 'set_adcguard_start_loc'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 停止采集定位数据
export async function stopEntryLocation(params) {
  const op = 'set_adcguard_stop_loc'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 操作模式设置
export async function setOperationMode(params) {
  const op = 'set_operation_mode'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取当前的操作模式
export async function getTargetOperationMode(params) {
  const op = 'get_operation_mode'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 软件总线开启和关闭
export async function setSoftwareBusCheck(params) {
  const op = 'set_sub_outer'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取软件总线开启状态
export async function getSoftwareBusStatus(params) {
  const op = 'get_sub_outer'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取m2列表
export async function getMTwoList(params) {
  const op = 'get_m_two_list'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取下载文件列表
export async function getDownloadList(params) {
  const op = 'get_sub_outer_files'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 修改小区状态 定位频谱和参考站频谱
export async function changeStationSperam(params) {
  const op = 'set_signaldiag_entry'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 修改DDC
export async function setDdc(params) {
  const op = 'set_ddc'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 设置公用输出配置
export async function setMidBandConfig(params) {
  const op = 'set_freq_output_mode'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取公用输出默认配置
export async function getDefaultMidBand(params) {
  const op = 'get_freq_output_mode'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 获取星座图数据
export async function getStarPic(params) {
  const op = 'set_constellation'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 启用tcp数据传输/启用软总数据传输/重启软总数据传输
export async function startDataOutPut(params) {
  const op = 'set_data_trans_mode'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// m2应用
export async function setDataMAdd(params) {
  const op = 'set_data_m_two_add'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}


// 新的网络输出配置下 请求TCP与UDP的数据
export async function getNetOutputMode(params) {
  const op = 'get_net_output_mode'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getSignalingEnabled(params) {
  const op = 'get_signaling_enabled'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}


export async function setSignalingEnabled(params) {
  const op = 'set_signaling_enabled'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// skyEdgeII 设置子网状态
export async function setSEIIGroupStatus(params) {
  const op = 'set_setwo_group'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 公用调理配置
export async function getMidBandConfigInfo(params) {
  const op = 'get_conver_gain'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}


// 设置公用调理
export async function setMidBandConfigGain(params) {
  const op = 'set_conver_gain'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

// 设置变频器通道新接口
export async function setTransducerChannel(params) {
  const op = 'set_two_frequency'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setGroupTdmaStart(params) {
  const op = 'set_group_tdma_start'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setGroupTdmaStop(params) {
  const op = 'set_group_tdma_stop'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function uploadLicense() {
  const op = 'upload_license'
  return uri.ops({ op, ...baseUri })
}

export async function setSoftReboot(params) {
  const op = 'set_soft_reboot'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setIpDecompression(params) {
  const op = 'set_ip_decompression'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setDelallTdma(params) {
  const op = 'set_delall_tdma'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function setTesting(params) {
  const op = 'set_testing'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getAdDdcFiles(params) {
  const op = 'get_ad_ddc_files'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function downloadSubOuter(params) {
  return uri.ops({ op: 'download_sub_outer', ...baseUri, ...params })
}

export async function setAgentConfig(params) {
  const op = 'set_agent_config'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export async function getDataByFileName(params) {
  const op = 'get_agent_config'
  return request({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  })
}

export function setAllConfig(params, cb) {
  const op = 'set_all_config'
  return requestWithCallBack({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    body: params,
  }, null, cb)
}

export function getAllConfig(params, cb) {
  const op = 'get_all_config'
  return requestWithCallBack({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    credentials: 'same-origin',
    body: params,
  }, null, cb)
}

export function userLogin(params, cb) {
  const op = 'user_login'
  return requestWithCallBack({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    credentials: 'same-origin',
    body: params,
  }, null, cb)
}

export function userLogout(params, cb) {
  const op = 'user_logout'
  return requestWithCallBack({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    credentials: 'same-origin',
    body: params,
  }, null, cb)
}

export function getUserLoginStatus(params, cb) {
  const op = 'get_user_login_status'
  return requestWithCallBack({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    credentials: 'same-origin',
    body: params,
  }, null, cb)
}

export function downLoadCollection(params) {
  const url = uri.ops({ op: 'download_sub_outer', ...baseUri, ...params });
  return url
}

export function setAllSweepConfig(params, cb) {
  const op = 'set_all_config'
  return requestWithCallBack({
    // url: uri.ops({ op, ...baseUri }),
    url: '/services/api/set_all_cf.php',
    method: 'post',
    body: params,
  }, null, cb)
}

export function getAllSweepConfig(params, cb) {
  const op = 'get_all_config'
  return requestWithCallBack({
    // url: uri.ops({ op, ...baseUri }),
    url: '/services/api/get_all_cf.php',
    method: 'post',
    credentials: 'same-origin',
    body: params,
  }, null, cb)
}

export function getAssignIdList(params, cb) {
  const op = 'get_assign_id_list'
  return requestWithCallBack({
    url: uri.ops({ op, ...baseUri }),
    method: 'post',
    credentials: 'same-origin',
    body: params,
  }, null, cb)
}
