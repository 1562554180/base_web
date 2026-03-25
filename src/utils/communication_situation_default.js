module.exports = {
  // 通信网态势默认配置
  "isShowNetStateBtn": "1", // 是否打开态势功能
  "isSendSwitchSiginalToOtherGroup": "0", // 切换网时是否给第三方发送指令
  "mainComponentTitle": "通信网态势", // 态势模块配置-标题
  "isShowNetworkStateSwitchBtn": "0", // 是否显示机器切换按钮
  "isUseDefaultVastId": "0", // 是否使用默认VSAT_ID
  "networkStateDefaultId": "1", // 默认VSAT_ID
  "subStationTopuLabelShow": "小区", // 主-小区拓扑节点前缀 该配置代码内已注释
  "networkTabDefaultkey": "netstation_relation_topu", // 态势模块配置-默认选中项
  "networkStateTabConfig": [ // 态势模块配置-模块名称
    {
      "hidden": "1",
      "key": "old_terminal_time",
      "name": "终端通联时序(旧)",
    },
    {
      "hidden": "1",
      "key": "main_small_carrier",
      "name": "主小区",
    },
    {
      "hidden": "1",
      "key": "tree_uniq",
      "name": "树状图",
    },
    {
      "hidden": "0",
      "key": "netstation_relation_topu",
      "name": "VSAT网关系拓扑",
    },
    {
      "hidden": "0",
      "key": "tree_relation",
      "name": "VSAT IP设备拓扑",
    },
    {
      "hidden": "0",
      "key": "relation_topu",
      "name": "VSAT IP设备通联拓扑",
    },
    {
      "hidden": "0",
      "key": "terminal_time",
      "name": "VSAT终端通联时序",
    },
    {
      "hidden": "0",
      "key": "carrier_combine",
      "name": "VSAT统计",
    },
    {
      "hidden": "0",
      "key": "small_carrier_count",
      "name": "VSAT小区统计",
    },
    {
      "hidden": "0",
      "key": "station_copy_count",
      "name": "主小区抄收数据统计",
    },
    {
      "hidden": "0",
      "key": "main_station_count",
      "name": "主校区状态统计",
    },
    {
      "hidden": "0",
      "key": "data_analysis",
      "name": "服务数据统计",
    },
    {
      "hidden": "1",
      "key": "new_station_count",
      "name": "小区态势统计",
    },
  ],
  "smallCarrierCountConfig": [ // VSAT小区统计模块配置-模块配置
    {
      "hidden": "0",
      "key": "subStationHistoryChart",
      "name": "分配突发",
    },
    {
      "hidden": "0",
      "key": "subStionFreqOffsetLineChart",
      "name": "频偏",
    },
    {
      "hidden": "0",
      "key": "subStionSnrLineChart",
      "name": "信噪比",
    },
    {
      "hidden": "0",
      "key": "modeTypeHeatChart",
      "name": "调制方式热力图",
    },
    {
      "hidden": "0",
      "key": "codeRateHeatChart",
      "name": "码率热力图",
    },
    {
      "hidden": "0",
      "key": "snrHeatChart",
      "name": "信噪比热力图",
    },
    {
      "hidden": "0",
      "key": "substationBurstCountChart",
      "name": "小区分布",
    },
    {
      "hidden": "0",
      "key": "terminal_duty_cycle",
      "name": "小区占空比",
    },
  ],
  "mainStationCountConfig": [ // 主校区状态统计模块配置-模块配置
    {
      "hidden": "0",
      "key": "main_station_snr_count",
      "name": "主校区信噪比统计",
    },
    {
      "hidden": "0",
      "key": "main_station_level_count",
      "name": "主校区电平统计",
    },
    {
      "hidden": "0",
      "key": "main_station_offset_count",
      "name": "主校区频偏统计",
    },
    {
      "hidden": "0",
      "key": "main_station_modcode_count",
      "name": "主校区ModCode统计",
    },
  ],
  "carrierCombineSwitchConfig": [ // VSAT统计模块配置-模块配置
    {
      "hidden": "0",
      "key": "carrier_status",
      "name": "状态",
    },
    {
      "hidden": "0",
      "key": "carrier_list",
      "name": "列表",
    },
    {
      "hidden": "0",
      "key": "carrier_cycle_count",
      "name": "占空比统计",
    },
  ],
  "carrierCombineTableHeaderConfig": [ // VSAT统计模块配置-表头配置
    {
      "align": "center",
      "ch_name": "站类型",
      "en_name": "carrier_type",
      "id": "1066ae00-9783-11f0-8e6e-cf752de48506",
      "width": "150",
    },
    {
      "align": "center",
      "ch_name": "组ID",
      "en_name": "group_id",
      "id": "0509e590-9783-11f0-8e6e-cf752de48506",
      "width": "120",
    },
    {
      "align": "center",
      "ch_name": "符号率(Bd)",
      "en_name": "symbol_rate",
      "id": "f9141170-9782-11f0-8e6e-cf752de48506",
      "width": "200",
    },
    {
      "align": "center",
      "ch_name": "ID",
      "en_name": "carrier_id",
      "id": "ebf7beb0-9782-11f0-8e6e-cf752de48506",
      "width": "120",
    },
    {
      "align": "center",
      "ch_name": "流量(K)",
      "en_name": "Frequency",
      "id": "df60a180-9782-11f0-8e6e-cf752de48506",
      "width": "200",
    },
    {
      "align": "center",
      "ch_name": "调试码率",
      "en_name": "Rate",
      "id": "d83eeab0-9782-11f0-8e6e-cf752de48506",
      "width": "200",
    },
    {
      "align": "center",
      "ch_name": "调制方式",
      "en_name": "Mod",
      "id": "c3f23b20-9782-11f0-8e6e-cf752de48506",
      "width": "150",
    },
  ],
  "isShowNetworkStateStorageTimeConfig": "1", // 是否显示存储时间配置
  "isShowNetworkStationEditBtn": "1", // 是否显示机器编辑按钮
  "dataAnalysisConfig": [ // 服务数据统计模块配置
    {
      "hidden": "0",
      "key": "ip_pie_analysis",
      "name": "服务IP端口统计",
    },
    {
      "hidden": "0",
      "key": "proto_pie_analysis",
      "name": "服务协议统计",
    },
  ],
}
