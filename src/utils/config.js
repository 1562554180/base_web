// const ip = '172.16.10.139';
// const ip = '172.16.10.140';
// const ip = '172.16.10.135';
// const ip = '172.16.10.128';

// const ip = '172.17.96.120';
// const ip = '172.17.96.81';
// const ip = '172.17.96.80';
// const ip = '172.16.10.137';
// const ip = '172.17.96.82';
// const ip = '172.17.96.127';
// const ip = '172.17.96.82';

const ip = '172.16.10.26';


// const ip = '172.16.10.171';

export default {
  prefix: 'pelican',
  publicPath: '/',
  inDebug: true,
  restfulApi: false,
  mockServicePrefix: '/_mock',
  servicePrefix: '/services',
  routeUriPrefix: '/',
  passportRoot: '/passport',
  loginPath: '/home',
  portalRoot: '/portal',
  locale: 'zhCN',
  iframeOffset: top === window ? 0 : 1,
  localTestUrl: ip,
  // localTestUrl: '172.16.10.',
  timerInterval_1: 100,
  timerInterval_5: 500,
  timerInterval1: 1000 * (window.$globalConfig.timerInterval || 30),
  timerInterval2: 2000 * (window.$globalConfig.timerInterval || 30),
  timerInterval3: 3000 * (window.$globalConfig.timerInterval || 30),
  timerInterval4: 4000 * (window.$globalConfig.timerInterval || 30),
  timerInterval5: 5000 * (window.$globalConfig.timerInterval || 30),
  timerInterval6: 6000 * (window.$globalConfig.timerInterval || 30),
  timerInterval7: 7000 * (window.$globalConfig.timerInterval || 30),
  timerInterval8: 8000 * (window.$globalConfig.timerInterval || 30),
  timerInterval9: 9000 * (window.$globalConfig.timerInterval || 30),
  timerInterval10: 10000 * (window.$globalConfig.timerInterval || 30),
  clogReconnectInterval: 2,
  nrfluxLocalTestUrl: `${ip}:28888`,
  adjustConnectIp: ip,
  // nrfluxLocalTestUrl: '172.17.1.205',
  isCheckDataMode: true,
  statePageUrl: ip,
  versionManageUrl: `http://${ip}:5050/#/version`,
  // 测试ip
  isLocal: true,
  // 是否开启校验校准状态
  isCheckAdjustStatus: true,
  // 是否开启发射版本-全网信息添加小区统计按钮
  isShowSendFunctionCountModal: false,
  adjustConnectPort: "8090",
  isShowDistanceControlFilterFreq: true,
  offlineModeChNum: '7',
  companyConfigVsatNameField: 'vsat_name',
  smallStationSnrYRange: [0, 25],
  smallStationLevelYRange: [-80, 10],
  map: {
    mapUrl: 'http://192.168.0.38:8081',
    minZoom: 3,
    maxZoom: 16,
    zoom: 6,
    lng: 26.034,
    lat: 78.203,
    useEarth: false,
  },
  content: {
    isChanged: false,
  },
  netStatePolarizationConfig: [
    {
      key: "L",
      value: 0
    },
    {
      key: "S",
      value: 1
    },
    {
      key: "C",
      value: 2
    },
    {
      key: "X",
      value: 3,
    },
    {
      key: "Ku",
      value: 4,
    }
    ,
    {
      key: "Ka",
      value: 5,
    },
  ],
  netStateBandConfig: [
    {
      key: "H",
      value: 0,
    },
    {
      key: "v",
      value: 1,
    },
    {
      key: "L",
      value: 2,
    },
    {
      key: "R",
      value: 3,
    },
  ],
  screenMediaList: {
    'screen-xs': { maxWidth: 575 },
    'screen-sm': { minWidth: 576, maxWidth: 767 },
    'screen-md': { minWidth: 768, maxWidth: 991 },
    'screen-lg': { minWidth: 992, maxWidth: 1199 },
    'screen-xl': { minWidth: 1200 },
  },
  layout: {},
  tablePagination: {
    currentPage: 1,
    pageSize: 30,
    defaultPageSize: 30,
    pageSizeOptions: ['10', '30', '50', '100'],
  },
  userMenu: {
    default: [
      { name: 'userConfig', text: '偏好设置', icon: 'setting' },
      { name: 'resetAll', text: '全网重置', icon: 'reload' },
      { name: 'systemStatus', text: '系统状态', icon: 'line-chart' },
    ],
  },
  menuConf: {},
  isUseOldMenuConfig: false,
  isThemeEnabled: true,
  selectedTheme: 'dark',
  isSuperAdministrator: false,
  checkServiceInfoField: "service_status_info",
  isShowFreqPicOperation: false,
  freqImgZoomRange: [0, 2],
  freqImgZoomStep: 0.1,
  subStationSlotConfigNum: 8,
  specialFieldMapping: {},
  hideCompanyInformation: false,
  vsatSourceStateChartPort: 54028,
  midSpectrumTableFilterChNum: 35,
  isHideAuthStatus: false,
  needChangeWkTypeAndHideRfConfig: [3, 7, 8, 9, 10],
  wkTypeMapping: {
    "0":"DVB配置",
    "1":"TDMA网控配置",
    "2":"SCPC设置",
    "3":"无网控",
    "4":"SkyLinx8000网控配置",
    "5":"nrftx_config",
    "6":"网络态势",
    "7":"专用DVB",
    "8":"通用SCPC",
    "9":"离线AD模式",
    "10":"网络DDC",
  },
  rfLimitConfig: {
    // DVB配置
    '0': {master: ['dvb'], slave: ['ad']}, // 表示主校区只能选dvb类型的rf口，小区只能选ad类型的rf口
    // TDMA网控配置
    '1': {master: ['ad'], slave: ['ad']},
    // SCPC设置
    '2': {master: ['ad'], slave: ['ad']},
    // 无网控
    '3': {master: ['ad'], slave: ['ad']},
    // SkyLinx8000网控配置
    '4': {master: ['dvb'], slave: ['ad']},
    // 专用DVB
    '7': {master: ['ad'], slave: ['ad']},
    // 通用SCPC
    '8': {master: ['ad'], slave: ['ad']},
  },

//   VSAT成网抄收->DVB配置 的 主校区RF口，只能展示dst_type有dvb的RF口。 小区RF口，小区RF口，只能展示dst_type有tdma的RF口；
// VSAT成网抄收->TDMA网控配置/SCPC设置 的主校区RF口，只能展示dst_type有tdma的RF口；小区RF口，只能展示dst_type有tdma的RF口；
// TDMA抄收/通用SCPC/专用DVB -> 无网控，只能展示dst_type有tdma的RF口；
// 发射抄收->DVB配置/Skylinx8000 的 主校区RF口，只能展示dst_type有dvb的RF口。 小区RF口，小区RF口，只能展示dst_type有tdma的RF口；
// 发射抄收->TDMA网控配置/SCPC设置 的主校区RF口，只能展示dst_type有tdma的RF口；小区RF口，只能展示dst_type有tdma的RF口；
  workModeGroup: {
    '0': {
      modeOpts: [
        {label: 'VSAT成网抄收', key: 0, childNetWork: [{label: 'DVB配置', key: 0},{label: 'TDMA网控配置', key: 1},{label: 'SCPC设置', key: 2}]},
        {label: 'TDMA抄收', key: 1, childNetWork: [{label: '无网控', key: 3}]},
        {label: '通用SCPC', key: 2, childNetWork: [{label: '通用SCPC', key: 8}]},
        {label: '专用DVB', key: 3, childNetWork: [{label: '专用DVB', key: 7}]},
        {label: '离线AD', key: 4, childNetWork: [{label: '离线AD', key: 9}]},
        {label: '网络DDC', key: 5, childNetWork: [{label: '网络DDC', key: 10}]},
      ],
      mapping: {
        '0': [0, 1, 2],
        '1': [3],
        '2': [8],
        '3': [7],
        '4': [9],
        '5': [10],
      }
    },
    '1': {
      modeOpts: [
        {label: '发射抄收', key: 6, childNetWork: [{label: 'DVB配置', key: 0},{label: 'TDMA网控配置', key: 1},{label: 'SCPC设置', key: 2},{label: 'Skylinx8000', key: 4}]},
        {label: '发射', key: 7, childNetWork: [{label: 'nrftx_config', key: 5}]},
        {label: '发射网络态势', key: 8, childNetWork: [{label: '网络态势', key: 6}]},
      ],
      mapping: {
        '6': [0, 1, 2, 4],
        '7': [5],
        '8': [6]
      },
    }
  },
  networkSignal: [
    {
      label: "DVB配置",
      wk_type: 0,
    },
    {
      label: "TDMA网控配置",
      wk_type: 1,
    },
    {
      label: "SCPC设置",
      wk_type: 2,
    },
    {
      label: "无网控",
      wk_type: 3,
    },
    {
      label: "SkyLinx8000网控配置",
      wk_type: 4,
    },
    {
      label: "nrftx_config",
      wk_type: 5,
    },
    {
      label: "网络态势",
      wk_type: 6,
    },
    {
      label: "专用DVB",
      wk_type: 7,
    },
    {
      label: "通用SCPC",
      wk_type: 8,
    },
    {
      label: "离线AD模式",
      wk_type: 9,
    },
    {
      label: "网络DDC",
      wk_type: 10,
    },
  ],
  hasOpenStatusWkType: [9, 10],
  modifyOptionsNoAuto: [
    { label: "是", value: 1 },
    { label: "否", value: 0 },
  ],
  modifyOptions: [
    { label: "是", value: 1 },
    { label: "否", value: 0 },
    { label: "自动", value: 2 },
  ],
  vsatTypeList: {
    DVB: ["HX/HN", "IDEV_DISP", "UHP", "SkyEdgeII", "SkyEdgeII-C", "IDVL", "IDEV_PRE", "HT", "Skywan5G"],
    TDMANet: ["LinkWayS2", "UHP", "Skywan5G"],
    TDMAUser: ["HX/HN", "IDEV_DISP", "IDVL_DISP", "LinkWayS2", "UHP", "SkyedgeII", "IDIN", "IDEV_PRE", "IDVL_PRE", "HT_OQPSK", "HT_8PSK", "Skywan5G"],
    SCPC: ["SCPC_IDIN"],
  },
  simpleGainConfig: {
    "0": "固定增益",
    "1": "自动增益",
  },
  sendOutputSiginalConfig: [
    {
      key: "IDIN",
      name: "IDIN",
    },
    {
      key: "IDEV_PRE",
      name: "IDEV_PRE",
    },
    {
      key: "IDEV_DISP",
      name: "IDEV_DISP",
    },
    {
      key: "HX/HN",
      name: "HX/HN",
    },
    {
      key: "SkyLinx8000",
      name: "SkyLinx8000",
    },
    {
      key: "LinkWayS2",
      name: "LinkWayS2",
    },
  ],
  gainFilter: [
    {
      label: "112Mbandpass+固定增益",
      value: 0,
    },
    {
      label: "1倍bandpass+固定增益",
      value: 0,
    },
    {
      label: "手动bandpass+固定增益",
      value: 0,
    },
    {
      label: "1倍bandpass+自动增益",
      value: 1,
    },
    {
      label: "2倍bandpass+自动增益",
      value: 2,
    },
  ],
  spreadOptions: [
    { label: '无', value: 1 },
    { label: '2', value: 2 },
    { label: '4', value: 4 },
    { label: '8', value: 8 },
  ],
  deviceTypeList: [
    { en_type: 'rfin', type: '射频入口', title: '射频入口', key: 0, outLimit: ["矩阵", "功分", "dvb卡", "ad卡"] },
    { en_type: 'matrix', type: '矩阵', title: '矩阵', key: 1, inlimit: ["射频入口", "功分"], outLimit: ["dvb卡", "ad卡"] },
    // { en_type: 'filter', type: '滤波器', title: '滤波器', key: 2, outLimit: ["dvb卡"], inlimit: ["射频入口", "功分", "矩阵"] },
    // { en_type: 'iffront', type: '变频器', title: '变频器', key: 3, outLimit: ["ad卡"], inlimit: ["射频入口", "功分", "矩阵"] },
    { en_type: 'dvb', type: 'dvb卡', title: 'dvb卡', key: 4, outLimit: ["组网", "数据输出"], inlimit: ["射频入口", "功分", "矩阵"] },
    { en_type: 'ad', type: 'ad卡', title: 'ad卡', key: 5, outLimit: ["解调", "组网", "数据输出", "发射输出"], inlimit: ["功分", "射频入口", "矩阵"] },
    // { en_type: 'nrcore', type: '解调组件', title: '解调组件', key: 6, outLimit: ["组网", "数据输出"], inlimit: ["ad卡"] },
    // { en_type: 'nrcore', type: '解调组件', title: '解调组件', key: 6, inlimit: ["ad卡"] },
    // { en_type: 'outrouter', type: '组网', title: '组网', key: 7, outLimit: ["数据输出"], inlimit: ["解调", "dvb卡", "ad卡"] },
    // { en_type: 'outer', type: '数据输出', title: '数据输出', key: 8, inlimit: ["解调", "dvb卡", "组网", "ad卡"] },
    { en_type: 'power_divider', type: '功分', title: '功分', key: 9, outLimit: ["矩阵", "dvb卡", "ad卡"], inlimit: ["射频入口"] },
    { en_type: 'txout', type: '发射输出', title: '发射输出', key: 10, inlimit: ["ad卡"] },
    // { en_type: 'xmitter', type: 'NRXmit', title: 'NRXmit', key: 11 },
  ],
  skylinux: 4,
  specialDvb: 7,
  specialScpc: 8,
  nrftxConfig: 5,
  mockData: {
    "code": 0,
    "data": [
      {
        "file_md5": "c38afcab1fb35c04cbc80ba31db3712c",
        "file_name": "/Yuantek/NRF2_release-v2.x-v2.12.0-28-g11d81b0-2025-04-07_2025-04-09 14:25:15",
        "file_size": 276437634,
        "file_state": 0,
        "file_time": "2025-04-09 14:21:38",
        "file_version": "release-v2.x-v2.12.0-28-g11d81b0-2025-04-07",
      },
      {
        "file_md5": "8f39a8d5f6b4f7394b96a314ea754929",
        "file_name": "NRF2",
        "file_size": 25240734,
        "file_state": 1,
        "file_time": "2025-04-09 14:25:16",
        "file_version": "release-v2.x-v2.12.0-28-g11d81b0-2025-04-07",
      },
    ],
    "message": "当前操作执行成功!",
  },
  dvbDefaultValues: {
    board_id: {
      value: 0,
    },
    card_dna: {
      value: 'XXXXX',
    },
    channel_id: {
      value: '0,1,2'
    },
    input_port_id_list: {
      value: '0~1',
    },
    // output_port_id_list: {
    //   value: '0~1'
    // },
    agent_ip: {
      value: '127.0.0.1',
    },
    agent_port: {
      value: '33284',
    },
  },
  adDefaultValues: {
    board_id: {
      value: 0,
    },
    channel_id: {
      value: '0~95',
    },
    input_port_id_list: {
      value: '0~1',
    },
    // output_port_id_list: {
    //   value: '0~1'
    // },
    lf_range: {
      value: '720000',
    },
    agent_ip: {
      value: '127.0.0.1',
    },
    agent_port: {
      value: '22302',
    },
    ad_tx_port_id: {
      value: 0,
    },
    ad_tx_lch_range: {
      value: '0~7',
    },
    tx_max_symbol_rate: {
      value: 100000000,
    },
    tx_lf_range: {
      value: 36000,
    },
    card_dna: {
      value: 'XXXXX',
    },
    max_symbol_rate: {
      value: 60000000,
    },
  },
  iffrontDefaultValues: {
    input_port_id_list: {
      value: '1~1',
    },
    output_port_id_list: {
      value: '1~1',
    },
    agent_ip: {
      value: '127.0.0.1',
    },
    agent_port: {
      value: '22302',
    },
    type: {
      value: 1,
    },
    interface: {
      value: 1,
    },
    address: {
      value: 1,
    },
    port: {
      value: 1,
    },

  },
  nrcoreDefaultValues: {
    input_port_id_list: {
      value: '1~1',
    },
    output_port_id_list: {
      value: '1~1',
    },
    agent_ip: {
      value: '127.0.0.1',
    },
    agent_port: {
      value: '20000',
    },
  },
  netDefaultValues: {
    input_port_id_list: {
      value: '1~1',
    },
    output_port_id_list: {
      value: '1~1',
    },
    agent_ip: {
      value: '127.0.0.1',
    },
    agent_port: {
      value: '8002',
    },
  },
  dataOutDefaultValues: {
    input_port_id_list: {
      value: '1~1',
    },
    output_port_id_list: {
      value: '1~1',
    },
    agent_ip: {
      value: '127.0.0.1',
    },
    agent_port: {
      value: '39999',
    },
  },
  xnrDefaultValues: {
    input_port_id_list: {
      value: '1~1',
    },
    xmitter_ip: {
      value: '127.0.0.1',
    },
    xmitter_port: {
      value: '24301',
    },
    output_port_id_list: {
      value: '0~0',
    },
  },
  optionVsat: ["HX/HN", "IDEV_DISP", "IDVL_DISP", "LinkWayS2", "UHP", "SkyedgeII", "IDIN", "IDEV_PRE", "IDVL_PRE", "HT_OQPSK", "HT_8PSK", "SkyWan5G", "SkyEdgeII-C", "HT", "SCPC_IDIN", 'HXSS', 'UHP-MESH', 'LinkWay', 'SkyWay5G', 'SkyWay', 'SkyLinx8000', '默认'],
  spectrumJson: {
    "isHaveEditCrops": true,
    "defaultChannel": 0,
    "defaultVisualType": "spectrum_scan",
    "timeOutNum": 10,
    "resultTableSubDataField": "tdma_info",
    "filterEmptyField": [
      "real_freq",
      "real_symbolrate",
    ],
    "isAddOneKeySweep": true,
    "isShowHistoryInfoBtn": true,
    "clientHandleInfo": "为了保证改系统页面的正常使用，请关闭其他用户暂不使用的系统页面，点击浏览器刷新按钮,刷新页面即可!",
    "rightContentButton": {
      "buttonList": [
        {
          "key": "1",
          "label": "一键抄收",
          "isUseLocalHost": true,
          "otherHost": "http://172.17.96.179",
          "url": ":8080/#/system_setting/master_station_cfg",
          "params": [
            {
              "key": "real_freq",
              "calculate_type": "/",
              "calculate_value": 1000,
            },
            {
              "key": "real_symbolrate",
              "calculate_type": "*",
              "calculate_value": 1,
            },
          ],
        },
      ],
    },
    "historyParamConfig": [
      {
        "label": "任务名称",
        "field": "task_name",
        "hidden": false,
      },
      {
        "label": "起始流量",
        "field": "start_freq",
        "hidden": false,
      },
      {
        "label": "终止流量",
        "field": "end_freq",
        "hidden": false,
      },
      {
        "label": "抄收时长",
        "field": "copy_time",
        "hidden": false,
      },
      {
        "label": "滤波器增益",
        "field": "filter_gain",
        "hidden": false,
      },
      {
        "label": "本振流量",
        "field": "osi_freq",
        "hidden": false,
      },
      {
        "label": "转发差",
        "field": "repeater_diff",
        "hidden": false,
      },
    ],
    "historyStatusConfig": [
      {
        "label": "扫频模式",
        "field": "scan_mode",
        "hidden": true,
      },
      {
        "label": "轮询间隔",
        "field": "period(min)",
        "hidden": false,
        "unit": "min",
      },
      {
        "label": "已完成",
        "field": "scan_done",
        "hidden": false,
        "unit": "次",
      },
      {
        "label": "总次数",
        "field": "scan_total",
        "hidden": false,
        "unit": "次",
      },
      {
        "label": "扫频状态",
        "field": "scan_status",
        "hidden": true,
      },
      {
        "label": "发现包络",
        "field": "peaks_found",
        "hidden": false,
        "unit": "个",
      },
      {
        "label": "锁定包络",
        "field": "peaks_locked",
        "hidden": false,
        "unit": "个",
      },
      {
        "label": "未锁定包络",
        "field": "peaks_unlocked",
        "hidden": false,
        "unit": "个",
      },
      {
        "label": "已处理非DVB",
        "field": "nondvb_dealed",
        "hidden": false,
        "unit": "个",
      },
      {
        "label": "DVB识别",
        "field": "dvb_recognized",
        "hidden": false,
        "unit": "个",
      },
    ],
  },

  // const freqConfig = config.freqConfig
  // const freqFormConfig = config.freqFormConfig
  // const freqHeaderConfig = config.freqHeaderConfig
  // const tdmaTableConfig = config.tdmaTableConfig
  freqConfig: { "success": true, "type": "info", "data": { "id": "25", "type": "freq_info", "params": "[{\"id\":\"340dbad0-2239-11ef-a7a5-f5f9ea5058ed\",\"ch_name\":\"扫频模式\",\"en_name\":\"scan_mode\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\",\"text_color\":\"#48ff00\",\"tooltip\":\"\"},{\"id\":\"f49180f0-20c4-11ef-8818-3b229139be96\",\"ch_name\":\"轮询间隔\",\"en_name\":\"period(min)\",\"type\":\"number\",\"is_relation\":\"1\",\"relation\":\"[{\\\"id\\\":\\\"78740720-2251-11ef-a423-f709865b10fe\\\",\\\"key\\\":\\\"scan_mode\\\",\\\"value\\\":\\\"轮询扫频\\\"}]\",\"span\":\"4\",\"unit\":\"min\"},{\"id\":\"c6bb1410-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"已完成\",\"en_name\":\"scan_done\",\"type\":\"number\",\"tofixed\":\"\",\"is_relation\":\"1\",\"relation\":\"[{\\\"id\\\":\\\"830f0630-2251-11ef-a423-f709865b10fe\\\",\\\"key\\\":\\\"scan_mode\\\",\\\"value\\\":\\\"轮询扫频\\\"}]\",\"span\":\"4\",\"text_color\":\"\",\"default_value\":\"0\",\"hidden\":\"0\"},{\"id\":\"c91075c0-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"总次数\",\"en_name\":\"scan_total\",\"type\":\"number\",\"tofixed\":\"\",\"is_relation\":\"1\",\"relation\":\"[{\\\"id\\\":\\\"156638c0-2255-11ef-a855-5f2f17d6a8a7\\\",\\\"key\\\":\\\"scan_mode\\\",\\\"value\\\":\\\"轮询扫频\\\"}]\",\"span\":\"4\",\"hidden\":\"0\"},{\"id\":\"cd44f7b0-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"扫频状态\",\"en_name\":\"scan_status\",\"type\":\"text\",\"tofixed\":\"\",\"is_relation\":\"0\",\"relation\":\"[]\",\"is_mapping\":\"0\",\"span\":\"4\",\"text_color\":\"#FFCC00\"},{\"id\":\"e3ae93d0-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"发现包络\",\"en_name\":\"peak_found\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\",\"default_value\":\"0\",\"unit\":\"个\"},{\"id\":\"e72e92d0-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"锁定包络\",\"en_name\":\"peaks_locked\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\",\"default_value\":\"0\",\"unit\":\"个\"},{\"id\":\"f216ee90-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"未锁定包络\",\"en_name\":\"peaks_unlocked\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\",\"default_value\":\"0\",\"unit\":\"个\"},{\"id\":\"f546aab0-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"已处理非DVB\",\"en_name\":\"nondvb_dealed\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\",\"default_value\":\"0\",\"unit\":\"个\"},{\"id\":\"d4845e30-70de-11ef-85b3-5d0209fd2309\",\"ch_name\":\"TDMA\",\"en_name\":\"tdma_found\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\"},{\"id\":\"cc160320-70de-11ef-85b3-5d0209fd2309\",\"ch_name\":\"VSAT\",\"en_name\":\"vsat_found\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\"},{\"id\":\"fd941040-20c5-11ef-b4b1-67b3a925b43d\",\"ch_name\":\"DVB识别\",\"en_name\":\"dvb_recognized\",\"type\":\"text\",\"tofixed\":\"\",\"span\":\"4\",\"default_value\":\"0\",\"unit\":\"个\"}]", "create_time": "2024-06-02 16:46:05", "update_time": "2024-06-02 16:54:42" } },
  freqFormConfig: { "success": true, "type": "info", "data": { "id": "24", "type": "freqFormConfig", "params": "[{\"id\":\"277197b0-53d5-11ef-8107-f59839e2466e\",\"en_name\":\"scan_mode\",\"ch_name\":\"扫频模式\",\"required\":\"1\",\"span\":\"24\",\"field_type\":\"radioButton\",\"options\":\"[{\\\"id\\\":\\\"3a7bdc30-53d5-11ef-8107-f59839e2466e\\\",\\\"value\\\":\\\"one_time\\\",\\\"key\\\":\\\"单次扫频\\\"},{\\\"id\\\":\\\"9597d5b0-53d5-11ef-8107-f59839e2466e\\\",\\\"key\\\":\\\"轮询扫频\\\",\\\"value\\\":\\\"multi_times\\\"}]\",\"default_value\":\"one_time\"},{\"id\":\"a853e400-23ce-11ef-9ce6-678e33673a37\",\"ch_name\":\"任务名称\",\"en_name\":\"task_name\",\"width\":\"180\",\"span\":\"24\",\"field_type\":\"select\",\"is_relation\":\"0\",\"default_value\":\"扫频任务\",\"required\":\"1\",\"relation\":\"[{\\\"id\\\":\\\"910e4910-295b-11ef-afdf-b3e8d5d6ba8a\\\",\\\"key\\\":\\\"DVBconste\\\",\\\"value\\\":\\\"DVBconste\\\"}]\",\"options\":\"[]\",\"hidden\":\"0\"},{\"id\":\"fafd87f0-2267-11ef-b903-19310741ec63\",\"ch_name\":\"轮询次数\",\"en_name\":\"scan_times\",\"required\":\"1\",\"width\":\"180\",\"field_type\":\"input\",\"is_relation\":\"1\",\"relation\":\"[{\\\"id\\\":\\\"de9ba460-2268-11ef-b903-19310741ec63\\\",\\\"key\\\":\\\"scan_mode\\\",\\\"value\\\":\\\"multi_times\\\"}]\",\"span\":\"24\",\"defaultValue\":\"1\",\"default_value\":\"1\",\"relevance_field\":\"task_name\",\"value_range\":\">1\"},{\"id\":\"0b64e700-2268-11ef-b903-19310741ec63\",\"en_name\":\"scan_period\",\"ch_name\":\"轮询间隔(min)\",\"required\":\"1\",\"width\":\"180\",\"field_type\":\"input\",\"is_relation\":\"1\",\"span\":\"24\",\"relation\":\"[{\\\"id\\\":\\\"13431920-22ee-11ef-a35d-4f01dfb09265\\\",\\\"key\\\":\\\"scan_mode\\\",\\\"value\\\":\\\"multi_times\\\"}]\",\"defaultValue\":\"1\",\"default_value\":\"1\",\"relevance_field\":\"task_name\",\"value_range\":\">1\"},{\"id\":\"2e5de900-20c4-11ef-b7b4-5f5823f346d6\",\"ch_name\":\"流量范围起始(M)\",\"en_name\":\"fstart\",\"width\":\"180\",\"required\":\"1\",\"number\":\"[950,2150]\",\"field_type\":\"input\",\"span\":\"24\",\"defaultValue\":\"950\",\"default_value\":\"950\",\"value_range\":\"[950,2150]\"},{\"id\":\"ea351bb0-22ec-11ef-a35d-4f01dfb09265\",\"ch_name\":\"流量范围终止(M)\",\"en_name\":\"fend\",\"required\":\"1\",\"width\":\"180\",\"span\":\"24\",\"number\":\"[950, 2150]\",\"field_type\":\"input\",\"defaultValue\":\"2150\",\"default_value\":\"2150\",\"value_range\":\"(950,2150]\"},{\"id\":\"7222e4c0-2267-11ef-82aa-218490ff2e2c\",\"en_name\":\"gain_mode\",\"ch_name\":\"增益模式\",\"required\":\"1\",\"field_type\":\"select\",\"width\":\"180\",\"options\":\"[{\\\"id\\\":\\\"abca1c20-2267-11ef-b903-19310741ec63\\\",\\\"key\\\":\\\"default\\\",\\\"value\\\":\\\"default\\\"},{\\\"id\\\":\\\"ad6814b0-2267-11ef-b903-19310741ec63\\\",\\\"key\\\":\\\"user\\\",\\\"value\\\":\\\"user\\\"}]\",\"span\":\"24\",\"defaultValue\":\"default\",\"default_value\":\"default\"},{\"id\":\"b24532b0-2267-11ef-b903-19310741ec63\",\"ch_name\":\"增益值(dB)\",\"en_name\":\"gain\",\"required\":\"1\",\"width\":\"180\",\"field_type\":\"input\",\"span\":\"24\",\"defaultValue\":\"0\",\"default_value\":\"0\"},{\"id\":\"c17941e0-2267-11ef-b903-19310741ec63\",\"en_name\":\"copy_time\",\"ch_name\":\"抄收时长(秒)\",\"required\":\"1\",\"width\":\"180\",\"field_type\":\"input\",\"span\":\"24\",\"defaultValue\":\"15\",\"default_value\":\"15\"},{\"id\":\"ca61aef0-2267-11ef-b903-19310741ec63\",\"ch_name\":\"本振流量(M)\",\"en_name\":\"osi_freq\",\"required\":\"1\",\"width\":\"180\",\"field_type\":\"input\",\"span\":\"24\",\"defaultValue\":\"21500000\",\"default_value\":\"5150\"},{\"id\":\"dfde5300-2267-11ef-b903-19310741ec63\",\"ch_name\":\转发差(M)\",\"en_name\":\"repeater_diff\",\"required\":\"1\",\"width\":\"180\",\"field_type\":\"input\",\"span\":\"24\",\"defaultValue\":\"5150\",\"default_value\":\"2225\"}]", "create_time": "2024-06-02 16:42:22", "update_time": null } },
  mockPzData: [
    { "GID": 1, "NID": 1, "array": [{ "ActiveR": 0, "CID": 0, "CTID": 0, "Duration": 0, "DutyR": 82.29, "Freq": 14558070, "GID": 1, "NID": 1, "NUM": 0, "PLen": 0, "Pilot": 0, "SP": 1, "Symbol": 256000, "acm": "false", "alloc_fps": 91.2, "alloc_num": 456, "aloha_fps": 44.4, "aloha_num": 222, "carrie_key": "vsat_id_1_1_1_14558070_256000", "chid": "0", "dec_type": "LDPC", "down_link_freq_K": 11854070, "fec_rate": "1/2", "fec_type": "LDPC", "frameD_100M": 4500000, "idle_fps": 22.2, "idle_num": 111, "insertamble": "", "is_active": 1, "is_ess": 0, "lfreq_K": 1854070, "map_id": "0", "mode": "OQPSK", "mode_type": "OQPSK", "name": "vsat_id_1", "net_work_status": 1, "outrouted_ip": "127.0.0.1", "outrouted_port": 8002, "postamble": "", "preamble": "", "process_time": 6258472167563, "rate": "1/2", "raw_Symbol": 256000, "response_timestamp": 1745804754.6256266, "rf_port": 0, "sample": 6258467555057, "slot_type": "ALLOC|ALOHA", "symbol_rate": 256000, "system_id": 1, "time": 17458047545875556, "up_link_freq_K": 14558070, "vsat_id": 1 }], "count": 1, "group_key": "vsat_id_1_1_1" },
    { "GID": 1, "NID": 1, "array": [{ "ActiveR": 0, "CID": 0, "CTID": 0, "Duration": 0, "DutyR": 82.29, "Freq": 14558070, "GID": 1, "NID": 1, "NUM": 0, "PLen": 0, "Pilot": 0, "SP": 1, "Symbol": 256000, "acm": "false", "alloc_fps": 91.2, "alloc_num": 456, "aloha_fps": 44.4, "aloha_num": 222, "carrie_key": "vsat_id_1_1_1_14558070_256001", "chid": "0", "dec_type": "LDPC", "down_link_freq_K": 11854070, "fec_rate": "1/2", "fec_type": "LDPC", "frameD_100M": 4500000, "idle_fps": 22.2, "idle_num": 111, "insertamble": "", "is_active": 1, "is_ess": 0, "lfreq_K": 1854070, "map_id": "0", "mode": "OQPSK", "mode_type": "OQPSK", "name": "vsat_id_1", "net_work_status": 1, "outrouted_ip": "127.0.0.1", "outrouted_port": 8002, "postamble": "", "preamble": "", "process_time": 6258472167563, "rate": "1/2", "raw_Symbol": 256000, "response_timestamp": 1745804754.6256266, "rf_port": 0, "sample": 6258467555057, "slot_type": "ALLOC|ALOHA", "symbol_rate": 256000, "system_id": 1, "time": 17458047545875556, "up_link_freq_K": 14558070, "vsat_id": 1 }, { "ActiveR": 0, "CID": 0, "CTID": 0, "Duration": 0, "DutyR": 82.29, "Freq": 14558070, "GID": 1, "NID": 1, "NUM": 0, "PLen": 0, "Pilot": 0, "SP": 1, "Symbol": 256000, "acm": "false", "alloc_fps": 91.2, "alloc_num": 456, "aloha_fps": 44.4, "aloha_num": 222, "carrie_key": "vsat_id_1_1_1_14558070_256003", "chid": "0", "dec_type": "LDPC", "down_link_freq_K": 11854070, "fec_rate": "1/2", "fec_type": "LDPC", "frameD_100M": 4500000, "idle_fps": 22.2, "idle_num": 111, "insertamble": "", "is_active": 1, "is_ess": 0, "lfreq_K": 1854070, "map_id": "0", "mode": "OQPSK", "mode_type": "OQPSK", "name": "vsat_id_1", "net_work_status": 1, "outrouted_ip": "127.0.0.1", "outrouted_port": 8002, "postamble": "", "preamble": "", "process_time": 6258472167563, "rate": "1/2", "raw_Symbol": 256000, "response_timestamp": 1745804754.6256266, "rf_port": 0, "sample": 6258467555057, "slot_type": "ALLOC|ALOHA", "symbol_rate": 256000, "system_id": 1, "time": 17458047545875556, "up_link_freq_K": 14558070, "vsat_id": 1 }], "count": 1, "group_key": "vsat_id_1_1_2" },
  ],
  mockDvbTemp: [{ "label": "私人流量(K)", "field_name": "lfreq_K", "type": "input", "required": true, "value_range": "[950000,2150000]", "value": "", "options": [], "defaultValue": "", "pxWidth": 86, "span": 8 }, { "label": "符号率(Bd)", "field_name": "symbol_rate", "type": "input", "required": true, "value_range": "[128000,125000000]", "value": "", "options": [], "defaultValue": "", "pxWidth": 70, "span": 8 }, { "label": "VSAT体量", "field_name": "vsat_name", "type": "select", "required": true, "value": "", "options": [{ "id": "fdbb6e90-717b-11ef-8454-8bb2756e96e5", "key": "HX/HN", "value": "HX/HN" }, { "id": "fdfeb920-717b-11ef-8454-8bb2756e96e5", "key": "IDEV_DISP", "value": "IDEV_DISP" }, { "id": "6d0b1160-717c-11ef-8907-cbc77d0317c9", "key": "UHP", "value": "UHP" }, { "id": "7153b790-717c-11ef-8907-cbc77d0317c9", "key": "SkyEdgeII", "value": "SkyEdgeII" }, { "id": "a4db30c0-7f0f-11ef-9144-27e48ef0180b", "key": "SkyEdgeII-C", "value": "SkyEdgeII-C" }, { "id": "88d51e50-a7cc-11ef-8498-f196a853ce89", "key": "IDVL_PRE", "value": "IDVL_PRE" }, { "id": "23102f50-d18a-11ef-acd7-9d0ddefd335a", "key": "IDEV_PRE", "value": "IDEV_PRE" }, { "id": "29fea120-d18a-11ef-acd7-9d0ddefd335a", "key": "HT", "value": "HT" }, { "id": "30ee2460-d18a-11ef-acd7-9d0ddefd335a", "key": "SkyWan5G", "value": "SkyWan5G" }, { "id": "a7a39dc0-d24c-11ef-9328-9fabce4c50c7", "key": "HXSS", "value": "HXSS" }, { "id": "cb086a50-d6d1-11ef-8ca7-2f0948fad9b2", "key": "IDVL_DISP", "value": "IDVL_DISP" }], "defaultValue": "", "pxWidth": 63, "span": 5 }, { "label": "增益控制", "field_name": "filter_mode", "type": "select", "required": true, "value": "0", "options": [{ "id": "c8a95500-d189-11ef-acd7-9d0ddefd335a", "key": "固定增益", "value": "0" }, { "id": "cfe43920-d189-11ef-acd7-9d0ddefd335a", "key": "自动增益", "value": "1" }], "defaultValue": "0", "pxWidth": 56, "span": 8 }, { "label": "增益", "field_name": "filter_gain", "type": "input", "required": true, "value_range": "[-30,0]", "value": "0", "options": [], "defaultValue": "0", "pxWidth": 28, "span": 8 }],
  mockScpc: [{ "label": "体量", "field_name": "vsat_name", "type": "select", "required": true, "value": "", "options": [{ "id": "e8660710-5eef-11ef-9e67-2b825d0e6e96", "key": "SCPC_IDIN", "value": "SCPC_IDIN" }], "defaultValue": "", "pxWidth": 56, "span": 5 }, { "label": "编码方式", "field_name": "dec_type", "type": "select", "required": true, "value": "", "options": [], "defaultValue": "", "pxWidth": 56, "span": 5 }, { "label": "调制方式", "field_name": "mod_type", "type": "select", "required": true, "value": "", "options": [], "defaultValue": "", "pxWidth": 56, "span": 5 }, { "label": "纠错码率", "field_name": "fec_rate", "type": "select", "required": true, "value": "", "defaultValue": "", "pxWidth": 56, "span": 4 }, { "label": "正/反谱", "field_name": "invert", "type": "radioButton", "required": true, "value": "0", "options": [{ "id": "6624fb50-d224-11ef-b1f4-ff645a548ea0", "key": "正谱", "value": "0" }, { "id": "66ce33a0-d224-11ef-b1f4-ff645a548ea0", "key": "反谱", "value": "1" }], "defaultValue": "0", "pxWidth": 48, "span": 5 }, { "label": "流量模式", "field_name": "freq_mod", "type": "radioButton", "required": true, "value": "1", "options": [{ "id": "df2c0520-e516-11ef-a1d9-154a29a8dd5f", "key": "公用", "value": "0" }, { "id": "fb9e46f0-e516-11ef-a1d9-154a29a8dd5f", "key": "私人", "value": "1" }], "defaultValue": "1", "pxWidth": 56, "span": 5 }, { "label": "私人流量(K)", "field_name": "freq", "type": "input", "required": true, "value_range": "[950000,2150000]", "value": "", "options": [], "defaultValue": "", "pxWidth": 86, "span": 6 }, { "label": "调制速率(Bd)", "field_name": "symbol_rate", "type": "input", "required": true, "value_range": "[128000,12500000]", "value": "", "options": [], "defaultValue": "", "pxWidth": 84, "span": 6 }],
  meshNetworks: ['LinkWay', 'LinkWayS2', 'UHP-MESH'],
  meshNetworksBlock: [
    "netstation_relation_topu", // VSAT网关系拓扑
    "main_station_level_count", // 主校区电平统计
    "main_station_snr_count", // 主校区信噪比统计
    "main_station_offset_count", // 主校区频偏统计
    "main_station_modcode_count", // 主校区ModCode统计
  ],
  meshNetworksNoMain: [
    "tree_relation", // VSAT IP设备拓扑
    "relation_topu", // VSAT IP设备通联拓扑
    "station_copy_count", // 主小区抄收数据统计"
  ],
  mainHiddenKey: 'master_station',
  workModaCfg: [
    {
      id: "0",
      optional_wk_type: [0,1,2],
      wm_name: "VSAT成网抄收"
    },
    {
      id: "1",
      optional_wk_type: [3],
      wm_name: "TDMA抄收"
    },
    {
      id: "2",
      optional_wk_type: [8],
      wm_name: "通用SCPC"
    },
    {
      id: "3",
      optional_wk_type: [7],
      wm_name: "专用DVB"
    },
    {
      id: "4",
      optional_wk_type: [9],
      wm_name: "离线AD"
    },
    {
      id: "5",
      optional_wk_type: [10],
      wm_name: "网络DDC"
    },
    // {
    //   id: "6",
    //   is_send: true,
    //   optional_wk_type: [0,1,2,4],
    //   wm_name: "发射抄收"
    // },
    // {
    //   id: "7",
    //   is_send: true,
    //   optional_wk_type: [5],
    //   wm_name: "发射"
    // },
    // {
    //   id: "8",
    //   is_send: true,
    //   optional_wk_type: [6],
    //   wm_name: "发射网络态势"
    // },
  ],
  iconMappingDefaultColor: '#ff0000',
  ...window.$globalConfig,
};
