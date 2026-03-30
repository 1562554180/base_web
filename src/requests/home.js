import { requestWithCallBack } from 'utils/request';
import _ from 'lodash';
import config from 'utils/config'


const origin = config.isLocal ? `http://${config.localTestUrl}` : `http://${window.location.hostname}`;
const nrfluxOrigin = config.isLocal ? `http://${config.nrfluxLocalTestUrl}` : `http://${window.location.hostname}:28888`;
const nrfluxOriginStatus = config.isLocal ? `${origin}:5000` : `http://${window.location.hostname}:5000`;
const versionUrl = config.isLocal ? `${origin}:5000` : `http://${window.location.hostname}:5000`;
const localTestUrl = origin + ':5590'
const toGroupUrl = config.isLocal ? `http://${config.statePageUrl}:54028` : `http://${window.location.hostname}:${config.vsatSourceStateChartPort || 54028}`;

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

export function getUploadOfflineSourceFile() {
  return `${nrfluxOrigin}/upload_offline_data_source_file`
}

export function downEssFile(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/download_hx_ess_file`,
    method: 'post',
    json: false,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getOfflineSourceFile(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/show_offline_data_source_file`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setOfflineDataSource(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_offline_data_source`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setOfflineSourceFile(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/submit_offline_data_source`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function deleteOfflineSourceFile(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/remove_offline_data_source_file`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function downLoadOfflineSourceFile(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/download_offline_data_source_file`,
    method: 'post',
    json: false,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getNrfluxModularData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/nrflux_protocol`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getDvbExpertData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_dvb_hwn_resource`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setDvbExpertData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_dvb_hwn_resource_signal`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getPowerCnHistory(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_master_power_cn_history_5day`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function checkADExpertData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/check_ad_hwn_resource`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setADExpertData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_ad_hwn_resource_and_signal`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getRestartProgress(params, cb) {
  return requestWithCallBack({
    url: `${versionUrl}/restart_progress`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function saveStorageDir(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_fileAgent_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}


export function getAdExpertData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_ad_hwn_resource`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}


export function saveWebStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/save_web_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}


export function getDvbByRfPort(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_dvb_dev_info_by_rf_port`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function resetEssData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/do_reset_vsat_ess_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function resetIpInfoData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/reset_vsat_assembler_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function resetCallData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/reset_SkyLinx8000_call_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getAllVsatNameList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_vsat_name_list`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function execuChScript(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/execu_sh_script`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}



export function getDownCompany(params, cb) {
  return requestWithCallBack({
    // 172.17.96.33
    // 172.17.1.205
    url: `${nrfluxOrigin}/vendor_mode_config`,
    method: 'post',
    json: false,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getDownCompanyUrl() {
  return `${nrfluxOrigin}/vendor_mode_config`
}


export function resetNumber(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_reset_outrouter_kernel_container_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setTxSwitch(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_tx_switch`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getTxFreqOffset(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_tx_freq_offset`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setStarLandTx(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_star_land_tx_parameters`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setXmitParams(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_xmit_params`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setFreeTxLch(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/free_tx_lch`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSystemStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_hardware_message`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}


export function getOpTypeList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_sys_ops_logs_type`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}



// export function handleGetServiceMessage(params, cb) {
//   return requestWithCallBack({
//     url: `${nrfluxOrigin}/get_service_message`,
//     method: 'post',
//     json: true,
//     body: params || {},
//     credentials: 'same-origin',
//   }, null, cb)
// }

// export function handleSetService(params, cb) {
//   return requestWithCallBack({
//     url: `${nrfluxOrigin}/set_service`,
//     method: 'post',
//     json: true,
//     body: params || {},
//     credentials: 'same-origin',
//   }, null, cb)
// }

// v2.0接口

export function handleUserToken(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/user_token`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetWebConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_web_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetWebConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_web_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetLicense(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_license_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleresetSbs(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_reset_vsat_sbus_task_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetLicenses(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_licenses`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleCheckNrStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOriginStatus}/version_check_nrfluxui_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetPrimary(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_primary`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetSlave(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_slave`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function tdmaConfigNotice(params, cb) {
  return requestWithCallBack({
    url: `${toGroupUrl}/cnst/tdma_config_notice`,
    method: 'post',
    json: false,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

// export function sendTdmaConfigParamToSatGroup(params, cb) {
//   return requestWithCallBack({
//     url: `${nrfluxOrigin}/set_slave`,
//     method: 'post',
//     json: true,
//     body: params || {},
//     credentials: 'same-origin',
//   }, null, cb)
// }

export function handleConversion(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/convert_topo_sn`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetNet(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_net`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetFreqGainByChannel(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_freq_gain_by_channel`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetFreqGainByChannel(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_freq_gain_by_channel`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetFreqGainByPort(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_freq_gain_by_port`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetIffrontGainByChannel(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_iffront_gain_by_channel`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetFreqConvert(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_freq_convert`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getFilepathConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_filepath_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setFilepathConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_filepath_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function vendorPatternLogin(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/vendor_pattern_login`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetFreqConvert(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_freq_convert`,
    // url: 'http://172.17.1.205:28888/get_freq_convert',
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getDvbChannelData(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_freq_convert`,
    // url: 'http://172.17.1.205:28888/get_dvb_channel_data',
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function resetNrf(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/sys_reboot`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function checkIffront(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/check_iffront_freq_change`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}


export function handleSetTxParameters(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_tx_parameters`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getTxFreqRange(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_tx_freq_range`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetAllStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_all_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetAllLockStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_vsat_lock_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetIsNetUsed(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_vsat_id_is_used_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetBuc(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_buc_convert`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetBuc(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_buc_convert`,
    method: 'post',
    json: true,
    body: params || null,
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetWk(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_wk`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetWkAndCopy(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_wk_v2`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetAllNet(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_all_net`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getAllNetEvent(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_all_net_event`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setModifyTdmaChannelParams(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_modify_tdma_channel_params`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleDelVsat(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/del_vsat`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetAuto(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_netctrl_auto_tracking`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}


export function handleDelWebConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/del_web_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetModify(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_modify_tdma_channel_params`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSaveWebConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/save_web_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSearchWebConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/search_web_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function changeNtpIpUpdateTime(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/change_ntp_ip_updateTime`,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function getTime(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_time`,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetHardwareMessage(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_hardware_message`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetServiceMessage(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_service_message`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetService(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_service`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleQueryHardwareInfo(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/nrflux_protocol`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSa2agentAddress(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_sa2agent_address`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetDvbStatusCoroutine(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_dvb_status_coroutine`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetSaveTask(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_save_task`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSaveTask(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_save_task`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGgetVmpun2Name(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_vmpun2_name`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetVendorModeConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_vendor_mode_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleImportVendorModeConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/import_vendor_mode_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetVastOutputStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_vast_output_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSysConnectConfig(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_sys_connect_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getSysRfPortConnectStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_sys_rfport_connect_status `,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleHwmGetRfPortInfo(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/hwm_get_rf_port_info `,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetSocketSendTask(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_socket_send_task `,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSocketTaskDtatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_socket_task_status `,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetGainBord(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_gain_board_id`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetDatatypeMap(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_datatype_map`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getSetInfo(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_set_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getKeysFileList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_keys_file_list`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function delHxEss(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/del_hx_ess`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getHxEssList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_hx_ess_list`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setHxEssList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_hx_ess_file`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}


export function uploadMainEssFile() {
  return `${nrfluxOrigin}/upload_main_ess_file`
}


export function uploadSamEssFile() {
  return `${nrfluxOrigin}/upload_sam_ess_file`
}

export function uploadLicenseFile() {
  return `${nrfluxOrigin}/upload_license_file`
}

export function getNtpMessage(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_ntp_message`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setNtpMessage(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/change_ntp_ip_updateTime`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function changeTime(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/change_time`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setSoftBusParams(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_soft_bus_params`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function controlSbusTask(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/control_sbus_task`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function resetDvbChannelStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_reset_dvb_channel_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getNrfluxVersion(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_nrflux_version`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleLogin(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/login/`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleChangePassword(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/change_password`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetIpMessage(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_ip_message`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleChangeNet(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/change_net`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetAllFreqPort(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_all_freq_port`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetAllIffPort(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_freq_gain_by_channel`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSyncInfo(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_sync_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetShowMenu(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_show_menu`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSysRestart(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/sys_restart`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSysShutdown(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/sys_shutdown`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSoftBusRegister(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_soft_bus_register`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSoftBusTaskInfo(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_soft_bus_task_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSetVsatNumber(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/vsat_number`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleCloseNet(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/close_net`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetStorageTaskStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_storage_task_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetStorageTask(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_storage_task`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetStorageFileInfo(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_storage_file_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleGetSysOpsLogs(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_sys_ops_logs`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function handleSetNrcoreStatusClearByCh(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_nrcore_status_clear_by_ch`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}
export function getModuleList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_device_topo_info`,
    method: 'get',
    json: false,
    // body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function addModuleList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_device_topo_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function addDevice(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_device_id_type_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getDevice(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_device_id_type_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getCaptureConnectStatus(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_capture_connect_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setAdcMode(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_adc_mode`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setFreqConvertList(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_freq_convert_list`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getDvbChannelInfo(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_dvb_channel_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getDvbChannel(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_dvb_channel`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setCustomStarDelayValue(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_tx_star_value`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function setDvbChannel(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_dvb_channel`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

// 修改发射通道增益
export function changeSendChannelUdcGain(params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/modify_tx_udc_gain`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getVersionManager(params, cb, cbHeaders) {

  return requestWithCallBack({
    url: `${versionUrl}/version_manager`,
    method: 'post',
    json: false,
    body: params || {},
    credentials: 'same-origin',
    responseType: 'blob',
  }, null, cb, cbHeaders)
}

export function getVersionManagerUrl() {

  return  `${versionUrl}/version_manager`
}

export function getUploadJsonFileUrl() {
  return  `${nrfluxOrigin}/upload_jsonfile`
}

// 获取主校区MOD CODE表格数据
export function getMainStationModData(params, cb) {
  const fields = [
    {key: 'push_interval', value: 'push_interval'},
    {key: 'rows', value: 'rows'},
    {key: 'End', value: 'End'},
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
    {key: 'Start', value: 'Start'},
    {key: 'End', value: 'End'},
  ];
  const otherParamStr = getParam(fields, params);
  return requestWithCallBack({
    url: `${localTestUrl}/ServerStat/dvb_modcod_info_hmp?vsat_id=${params.vsat_id}${otherParamStr}`,
    method: 'GET',
    credentials: 'same-origin',
    mode: 'cors',
  }, null, cb)
}

// 向宋台星那边发送已经切网成功的
export function sendSwitchSiginalToGroupPort(params, cb) {
  return requestWithCallBack({
    url: `${toGroupUrl}/cnst/switch_signal`,
    method: 'get',
    json: false,
    credentials: 'same-origin',
  }, null, cb)
}

// 离线AD 网路DDC设置/获取
export function handleOfflineMode (params, cb, cbHeaders) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_off_ddc_ad_mode`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb, cbHeaders)
}

// 网络DDC 数据库信息设置和获取
export function handleGetDataBaseInfo (params, cb, cbHeaders) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/set_network_ddc_ad_db_info`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb, cbHeaders)
}

// 网络DDC模式参数下发记录查询
export function getNetWorkDdcHistoryData (params, cb, cbHeaders) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_network_ddc_set_params_and_status`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb, cbHeaders)
}

export function getYoYoInfo (params, cb, cbHeaders) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/do_yoyo_softbus_cmd`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb, cbHeaders)
}

export function getTxSendDifftime (params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/get_tx_send_difftime`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getMatrixGainConfig (params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/matrix_gain_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getMatrixGainConfigV2 (params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/matrix_gain_config_v2`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function getMatrixGainConfigV3 (params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/matrix_gain_config_v3`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function hwmIsDvbExist (params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/hwm_is_dvb_exist`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function resetOutroutedEvent (params, cb) {
  return requestWithCallBack({
    url: `${nrfluxOrigin}/reset_outrouted_event`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

export function allStation(params, cb) {
  return requestWithCallBack({
    url: `${toGroupUrl}/cnst/web_data_info/all_station`,
    method: 'get',
    json: false,
    credentials: 'same-origin',
  }, null, cb)
}

export function serviceProto(params, cb) {
  return requestWithCallBack({
    url: `${toGroupUrl}/cnst/web_data_info/service_proto`,
    method: 'get',
    json: false,
    credentials: 'same-origin',
  }, null, cb)
}

export function getAllStation(params, cb) {
  return requestWithCallBack({
    url: `${toGroupUrl}/cnst/web_data_info/all_station?vsat_id=${params.vsat_id}&station_type=0&remote_type=${params.remoteType}`,
    method: 'get',
    json: false,
    credentials: 'same-origin',
  }, null, cb)
}

export function getServiceIpPort(params, cb) {
  const times = params.times || [];
  const url =`${toGroupUrl}/cnst/web_data_info/service_ip_port?vsat_id=${params.vsat_id}&remote_type=${params.remoteType}&bgn_time=${times[0]}&end_time=${times[1]}&all=${params.all}`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params.data,
    credentials: 'same-origin',
  }, null, cb)
}

export function getServiceProto(params, cb) {
  const times = params.times || [];
  const url =`${toGroupUrl}/cnst/web_data_info/service_proto?vsat_id=${params.vsat_id}&remote_type=${params.remoteType}&bgn_time=${times[0]}&end_time=${times[1]}&all=${params.all}`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params.data,
    credentials: 'same-origin',
  }, null, cb)
}

export function nodeType(params, cb) {
  const url =`${nrfluxOrigin}/node_type`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function joinClusterMaster(params, cb) {
  const url =`${nrfluxOrigin}/join_cluster_master`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function slaveOutCluster(params, cb) {
  const url =`${nrfluxOrigin}/slave_out_cluster`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function addClusterSlave(params, cb) {
  const url =`${nrfluxOrigin}/add_cluster_slave`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function delClusterSlave(params, cb) {
  const url =`${nrfluxOrigin}/del_cluster_slave`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function getCluserDevList(params, cb) {
  const url =`${nrfluxOrigin}/get_cluser_dev_list`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function getClusterAllStatusInfo(params, cb) {
  const url =`${nrfluxOrigin}/get_cluster_all_status_info`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: false,
    credentials: 'same-origin',
  }, null, cb)
}

export function getClusterResourcesInfo(params, cb) {
  const url =`${nrfluxOrigin}/get_cluster_resources_info`;
  return requestWithCallBack({
    url,
    method: 'get',
    json: false,
    credentials: 'same-origin',
  }, null, cb)
}

export function getClusterLicenseInfo(params, cb) {
  const url =`${nrfluxOrigin}/get_cluster_license_info`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function getClusterServerInfo(params, cb) {
  const url =`${nrfluxOrigin}/get_cluster_server_info`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function getClusterSystemInfo(params, cb) {
  const url =`${nrfluxOrigin}/get_cluster_system_info`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function getClusterTopoInfo(params, cb) {
  const url =`${nrfluxOrigin}/get_cluster_topo_info`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function setClusterServerCmd(params, cb) {
  const url =`${nrfluxOrigin}/set_cluster_server_cmd`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

export function checkMatrixInnerLink(params, cb) {
  const url =`${nrfluxOrigin}/check_matrix_inner_link`;
  return requestWithCallBack({
    url,
    method: 'post',
    json: true,
    body: params,
    credentials: 'same-origin',
  }, null, cb)
}

const pythonService = 'http://localhost:5000/api'

// 获取 UDP 数据（支持分页、排序、搜索）
export function getUdpData(params, cb) {
  return requestWithCallBack({
    url: `${pythonService}/get_udp_data`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

// 新增 UDP 数据
export function addUdpData(params, cb) {
  return requestWithCallBack({
    url: `${pythonService}/udp_data`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

// 更新 UDP 数据
export function updateUdpData(id, params, cb) {
  return requestWithCallBack({
    url: `${pythonService}/udp_data/${id}`,
    method: 'put',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}

// 删除 UDP 数据
export function deleteUdpData(id, cb) {
  return requestWithCallBack({
    url: `${pythonService}/udp_data/${id}`,
    method: 'delete',
    json: true,
    credentials: 'same-origin',
  }, null, cb)
}

// 批量删除 UDP 数据
export function batchDeleteUdpData(ids, cb) {
  return requestWithCallBack({
    url: `${pythonService}/udp_data/batch_delete`,
    method: 'post',
    json: true,
    body: { ids },
    credentials: 'same-origin',
  }, null, cb)
}

export function dealColumnConfig(params, cb) {
  return requestWithCallBack({
    url: `${pythonService}/column_config`,
    method: 'post',
    json: true,
    body: params || {},
    credentials: 'same-origin',
  }, null, cb)
}
