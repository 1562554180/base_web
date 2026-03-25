// 默认表单配置
module.exports = {
  // DVB参数配置
  defaultDVBConfigParam: [{
    "ch_name": "私人流量(K)",
    "default_value": "",
    "en_name": "lfreq_K",
    "field_type": "input",
    "id": "lfreq_K",
    "required": "1",
    "span": "7",
    "unit": "",
    "value_range": "[950000,2150000]"
  }, {
    "ch_name": "符号率(Bd)",
    "default_value": "",
    "en_name": "symbol_rate",
    "field_type": "input",
    "id": "symbol_rate",
    "required": "1",
    "span": "7",
    "unit": "",
    "value_range": "[128000,125000000]"
  }, {
    "ch_name": "VSAT体量",
    "en_name": "vsat_name",
    "field_type": "select",
    "id": "vsat_name",
    "options": "[{\"id\":\"fdbb6e90-717b-11ef-8454-8bb2756e96e5\",\"key\":\"HX/HN\",\"value\":\"HX/HN\"},{\"id\":\"fdfeb920-717b-11ef-8454-8bb2756e96e5\",\"key\":\"IDEV_DISP\",\"value\":\"IDEV_DISP\"},{\"id\":\"6d0b1160-717c-11ef-8907-cbc77d0317c9\",\"key\":\"UHP\",\"value\":\"UHP\"},{\"id\":\"7153b790-717c-11ef-8907-cbc77d0317c9\",\"key\":\"SkyEdgeII\",\"value\":\"SkyEdgeII\"},{\"id\":\"a4db30c0-7f0f-11ef-9144-27e48ef0180b\",\"key\":\"SkyEdgeII-C\",\"value\":\"SkyEdgeII-C\"},{\"id\":\"88d51e50-a7cc-11ef-8498-f196a853ce89\",\"key\":\"IDVL_PRE\",\"value\":\"IDVL_PRE\"},{\"id\":\"23102f50-d18a-11ef-acd7-9d0ddefd335a\",\"key\":\"IDEV_PRE\",\"value\":\"IDEV_PRE\"},{\"id\":\"29fea120-d18a-11ef-acd7-9d0ddefd335a\",\"key\":\"HT\",\"value\":\"HT\"},{\"id\":\"30ee2460-d18a-11ef-acd7-9d0ddefd335a\",\"key\":\"SkyWan5G\",\"value\":\"SkyWan5G\"},{\"id\":\"a7a39dc0-d24c-11ef-9328-9fabce4c50c7\",\"key\":\"HXSS\",\"value\":\"HXSS\"},{\"id\":\"cb086a50-d6d1-11ef-8ca7-2f0948fad9b2\",\"key\":\"IDVL_DISP\",\"value\":\"IDVL_DISP\"},{\"id\":\"3de2c620-8d1f-11f0-8d92-eb8154e8bb62\",\"key\":\"SatNET\",\"value\":\"SatNET\"}]",
    "required": "1",
    "span": "5"
  }, {
    "ch_name": "滚降系数",
    "en_name": "rolloff",
    "field_type": "select",
    "id": "rolloff",
    "options": [
      { "id": "9e83fce0-d6ff-11f0-895a-cbaffde35c01", "key": "自动", "value": "0" },
      { "id": "c5601ba0-d6ff-11f0-895a-cbaffde35c01", "key": "0.05", "value": "5" },
      { "id": "c77b8190-d6ff-11f0-895a-cbaffde35c01", "key": "0.1", "value": "10" },
      { "id": "cd4b8b10-d6ff-11f0-895a-cbaffde35c01", "key": "0.15", "value": "15" },
      { "id": "cd9f9e80-d6ff-11f0-895a-cbaffde35c01", "key": "0.2", "value": "20" },
      { "id": "cde1b090-d6ff-11f0-895a-cbaffde35c01", "key": "0.25", "value": "25" },
      { "id": "ce1ae900-d6ff-11f0-895a-cbaffde35c01", "key": "0.35", "value": "35" }
    ],
    "required": "1",
    "span": "5"
  }, {
    "ch_name": "增益控制",
    "default_value": "0",
    "en_name": "filter_mode",
    "field_type": "select",
    "id": "filter_mode",
    "options": [
      {
        "id": "c8a95500-d189-11ef-acd7-9d0ddefd335a",
        "key": "固定增益",
        "value": "0"
      },
      {
        "id": "cfe43920-d189-11ef-acd7-9d0ddefd335a",
        "key": "自动增益",
        "value": "1"
      }
    ],
    "required": "1",
    "span": "7"
  }, {
    "ch_name": "增益",
    "default_value": "0",
    "en_name": "filter_gain",
    "field_type": "input",
    "id": "filter_gain",
    "required": "1",
    "span": "7",
    "value_range": "[-30,0]",
  }],
  // 解调通道参数配置
  defaultTdmaConfig: [
    {
      "ch_name": "体量",
      "en_name": "vsat_name",
      "field_type": "select",
      "id": "vsat_name",
      "options": "[{\"id\":\"3e083220-1d6d-11ef-95cb-ad1553c0da7a\",\"key\":\"HX/HN\",\"value\":\"HX/HN\"},{\"id\":\"3e4f4d40-1d6d-11ef-95cb-ad1553c0da7a\",\"key\":\"IDEV_DISP\",\"value\":\"IDEV_DISP\"},{\"id\":\"3e8159c0-1d6d-11ef-95cb-ad1553c0da7a\",\"key\":\"IDVL_DISP\",\"value\":\"IDVL_DISP\"},{\"id\":\"3e9c34c0-1d6d-11ef-95cb-ad1553c0da7a\",\"key\":\"LinkWayS2\",\"value\":\"LinkWayS2\"},{\"id\":\"a34f8010-58a1-11ef-90c9-05b12159116c\",\"key\":\"UHP\",\"value\":\"UHP\"},{\"id\":\"a6ccbff0-58a1-11ef-90c9-05b12159116c\",\"key\":\"SkyEdgeII\",\"value\":\"SkyEdgeII\"},{\"id\":\"e098f510-5eef-11ef-9e67-2b825d0e6e96\",\"key\":\"IDIN\",\"value\":\"IDIN\"},{\"id\":\"e8660710-5eef-11ef-9e67-2b825d0e6e96\",\"key\":\"SCPC_IDIN\",\"value\":\"SCPC_IDIN\"},{\"id\":\"5f088e30-8f95-11ef-a3c5-af63bd7e14a1\",\"key\":\"IDEV_PRE\",\"value\":\"IDEV_PRE\"},{\"id\":\"54f90ec0-9ca5-11ef-8be7-2b69f0e868e7\",\"key\":\"IDVL_PRE\",\"value\":\"IDVL_PRE\"},{\"id\":\"ac4e97a0-a7ac-11ef-9521-75f7942bd97d\",\"key\":\"HT_OQPSK\",\"value\":\"HT_OQPSK\"},{\"id\":\"7b6c3430-a7b6-11ef-8157-73202f49b0dc\",\"key\":\"HT_8PSK\",\"value\":\"HT_8PSK\"},{\"id\":\"9767f020-d22c-11ef-9163-c748ad87a46c\",\"key\":\"SkyEdgeII-C\",\"value\":\"SkyEdgeII-C\"},{\"id\":\"bb997ac0-d24c-11ef-9328-9fabce4c50c7\",\"key\":\"HXSS\",\"value\":\"HXSS\"},{\"id\":\"1b68bcd0-d3f2-11ef-9601-d5854a407e3f\",\"key\":\"UHP-MESH\",\"value\":\"UHP-MESH\"},{\"id\":\"a452edc0-d6ce-11ef-b0fe-bbba704334af\",\"key\":\"HT\",\"value\":\"HT\"},{\"id\":\"f1f6d890-d6d1-11ef-8ca7-2f0948fad9b2\",\"key\":\"SkyWan5G\",\"value\":\"SkyWan5G\"},{\"id\":\"09394d20-d8c2-11ef-bc9c-ef079c849ccd\",\"key\":\"LinkWay\",\"value\":\"LinkWay\"},{\"id\":\"88f080a0-d8c3-11ef-8c20-bdb539d4c1f0\",\"key\":\"SkyWan\",\"value\":\"SkyWan\"},{\"id\":\"4c102910-322d-11f0-9e0f-cba73cd09a56\",\"key\":\"专用DVB\",\"value\":\"专用DVB\"},{\"id\":\"487a3830-8d1e-11f0-8d92-eb8154e8bb62\",\"key\":\"SatNET\",\"value\":\"SatNET\"},{\"id\":\"f06a8e50-cf4a-11f0-b6fd-b347636ae16a\",\"key\":\"SCPC-QFLEX\",\"value\":\"SCPC-QFLEX\"},{\"id\":\"f08960f0-cf4a-11f0-b6fd-b347636ae16a\",\"key\":\"SCPC-DATUM\",\"value\":\"SCPC-DATUM\"},{\"id\":\"f0a83390-cf4a-11f0-b6fd-b347636ae16a\",\"key\":\"SCPC-CDM625\",\"value\":\"SCPC-CDM625\"}]",
      "required": "1",
      "span": "5",
      "width": ""
    },
    {
      "ch_name": "编码方式",
      "en_name": "dec_type",
      "field_type": "select",
      "id": "dec_type",
      "relevance_config": "{\"HT\":{\"data\":[{\"id\":\"e0e8ceb0-d6d0-11ef-9f4f-1b2cac669e12\",\"key\":\"LDPC\",\"value\":\"LDPC\"}],\"readableName\":\"HT\"},\"HT_8PSK\":{\"data\":[{\"id\":\"b336d090-d22d-11ef-9163-c748ad87a46c\",\"key\":\"LDPC\",\"value\":\"LDPC\"}],\"readableName\":\"HT_8PSK\"},\"HT_OQPSK\":{\"data\":[{\"id\":\"98ac6190-d22d-11ef-9163-c748ad87a46c\",\"key\":\"LDPC\",\"value\":\"LDPC\"}],\"readableName\":\"HT_OQPSK\"},\"HX/HN\":{\"data\":[{\"id\":\"e8584e30-d22c-11ef-9163-c748ad87a46c\",\"key\":\"Turbo\",\"value\":\"Turbo\"},{\"id\":\"f1466090-d22c-11ef-9163-c748ad87a46c\",\"key\":\"LDPC\",\"value\":\"LDPC\"}],\"readableName\":\"HX/HN\"},\"HXSS\":{\"data\":[{\"id\":\"f0c69bb0-d24c-11ef-8fd4-d1d70c70165f\",\"key\":\"Turbo\",\"value\":\"Turbo\"}],\"readableName\":\"HXSS\"},\"IDEV_DISP\":{\"data\":[{\"id\":\"b3c5aea0-d223-11ef-b022-5ffd4a52a8f6\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"IDEV_DISP\"},\"IDEV_PRE\":{\"data\":[{\"id\":\"85a1f600-d22d-11ef-9163-c748ad87a46c\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"IDEV_PRE\"},\"IDIN\":{\"data\":[{\"id\":\"69e60be0-d22d-11ef-9163-c748ad87a46c\",\"key\":\"TPC\",\"value\":\"TPC\"}],\"readableName\":\"IDIN\"},\"IDVL_DISP\":{\"data\":[{\"id\":\"05c93b50-d22d-11ef-9163-c748ad87a46c\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"IDVL_DISP\"},\"IDVL_PRE\":{\"data\":[{\"id\":\"8f145390-d22d-11ef-9163-c748ad87a46c\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"IDVL_PRE\"},\"LinkWay\":{\"data\":[{\"id\":\"1fd013c0-d8c2-11ef-bb71-8d660fcffc40\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"LinkWay\"},\"LinkWayS2\":{\"data\":[{\"id\":\"1345d680-d22d-11ef-9163-c748ad87a46c\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"LinkWayS2\"},\"SCPC_IDIN\":{\"data\":[{\"id\":\"d6b70500-d22b-11ef-9163-c748ad87a46c\",\"key\":\"TPC\",\"value\":\"TPC\"}],\"readableName\":\"SCPC_IDIN\"},\"SkyEdgeII\":{\"data\":[{\"id\":\"e7cdaf80-d22e-11ef-8d11-c3d21ccac723\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"SkyEdgeII\"},\"SkyEdgeII-C\":{\"data\":[{\"id\":\"93dbaa30-d22e-11ef-919b-0f924bc729f6\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"SkyEdgeII-C\"},\"SkyWan\":{\"data\":[{\"id\":\"9225fc40-d8c3-11ef-b95e-67705ecc2a24\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"SkyWan\"},\"SkyWan5G\":{\"data\":[{\"id\":\"104f8da0-d6d2-11ef-b2e2-1f3008170389\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"ca8a8840-9dc5-11f0-a9bc-bb0dd00db7ad\",\"key\":\"TurboΦ\",\"value\":\"TurboΦ\"}],\"readableName\":\"SkyWan5G\"},\"UHP\":{\"data\":[{\"id\":\"22680b60-d22d-11ef-9163-c748ad87a46c\",\"key\":\"LDPC\",\"value\":\"LDPC\"}],\"readableName\":\"UHP\"},\"UHP-MESH\":{\"data\":[{\"id\":\"31d4f100-d3f2-11ef-affc-7f27e9fdbb3b\",\"key\":\"LDPC\",\"value\":\"LDPC\"}],\"readableName\":\"UHP-MESH\"},\"SatNET\":{\"data\":[{\"id\":\"d2053a70-8d30-11f0-8d92-eb8154e8bb62\",\"key\":\"TCC\",\"value\":\"TCC\"}],\"readableName\":\"SatNET\"}}",
      "relevance_field": "vsat_name",
      "required": "1",
      "span": "5",
      "useCascader": "0"
    },
    {
      "ch_name": "调制方式",
      "en_name": "mod_type",
      "field_type": "select",
      "id": "mod_type",
      "relevance_config": "{\"\":{\"data\":[],\"readableName\":\"\"},\"HT\":{\"data\":[{\"id\":\"fa6f1420-d6d0-11ef-9a15-33080208eae3\",\"key\":\"OQPSK\",\"value\":\"OQPSK\"},{\"id\":\"001a7ea0-d6d1-11ef-9a15-33080208eae3\",\"key\":\"8PSK\",\"value\":\"8PSK\"},{\"id\":\"8c46d210-7678-11f0-923e-57ad8d3fbb9d\",\"key\":\"ACM\",\"value\":\"ACM\"}],\"readableName\":\"HT\"},\"HT_8PSK\":{\"data\":[{\"id\":\"611d0650-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"HT_8PSK\"},\"HT_OQPSK\":{\"data\":[{\"id\":\"51ca99b0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"OQPSK\",\"value\":\"OQPSK\"}],\"readableName\":\"HT_OQPSK\"},\"HX/HN\":{\"data\":[{\"id\":\"91c72ca0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"OQPSK\",\"value\":\"OQPSK\"}],\"readableName\":\"HX/HN\"},\"HX/HN&&BPSK\":{\"data\":[{\"id\":\"141f1920-d225-11ef-951e-813f6d854366\",\"key\":\"OQPSK\",\"value\":\"OQPSK\"}],\"readableName\":\"\"},\"HX/HN&&Turbo\":{\"data\":[{\"id\":\"b7d5ed70-d228-11ef-8265-2111a6b3c892\",\"key\":\"OQPSK\",\"value\":\"OQPSK\"}],\"readableName\":\"\"},\"HXSS\":{\"data\":[{\"id\":\"5eadadd0-d24d-11ef-b4d5-41ffef2cf4c7\",\"key\":\"OQPSK\",\"value\":\"OQPSK\"}],\"readableName\":\"HXSS\"},\"IDEV_DISP\":{\"data\":[{\"id\":\"a43e31d0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"a7fd5cb0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"aaba0bb0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"ad89a670-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"IDEV_DISP\"},\"IDEV_PRE\":{\"data\":[{\"id\":\"33a94850-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"360cb3c0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"391bc880-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"3a38aa30-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"IDEV_PRE\"},\"IDIN\":{\"data\":[{\"id\":\"0a7fde30-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"0bb7c1f0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"0fe5db40-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"IDIN\"},\"IDVL_DISP\":{\"data\":[{\"id\":\"b6f35170-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"b7e94a30-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"bb0186b0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"c7f2aac0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"},{\"id\":\"caa6f550-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"16QAM\",\"value\":\"16QAM\"}],\"readableName\":\"IDVL_DISP\"},\"IDVL_PRE\":{\"data\":[{\"id\":\"41e255b0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"44415450-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"46be3b30-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"49725eb0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"IDVL_PRE\"},\"LinkWay\":{\"data\":[{\"id\":\"2f3915a0-d8c2-11ef-bb71-8d660fcffc40\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"LinkWay\"},\"LinkWayS2\":{\"data\":[{\"id\":\"d546d660-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"d6fb6430-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"d968bab0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"dcf75fb0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"LinkWayS2\"},\"SCPC_IDIN\":{\"data\":[{\"id\":\"187a0dd0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"1a570b30-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"1da91c60-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"SCPC_IDIN\"},\"SkyEdgeII\":{\"data\":[{\"id\":\"fde4f070-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"feeaeec0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"0351cb50-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"SkyEdgeII\"},\"SkyEdgeII-C\":{\"data\":[{\"id\":\"69a83830-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"6b06ddd0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"6eca0050-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"70b814b0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"},{\"id\":\"7435f0d0-d230-11ef-a81d-818f5e4ad16b\",\"key\":\"16QAM\",\"value\":\"16QAM\"}],\"readableName\":\"SkyEdgeII-C\"},\"SkyWan\":{\"data\":[{\"id\":\"a1184780-d8c3-11ef-a69d-814751635969\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"SkyWan\"},\"SkyWan5G\":{\"data\":[{\"id\":\"15b19310-d6d2-11ef-b2e2-1f3008170389\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"SkyWan5G\"},\"UHP\":{\"data\":[{\"id\":\"e9013100-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"ea4b3d30-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"ecbd75b0-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"f10e5940-d22f-11ef-a81d-818f5e4ad16b\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"UHP\"},\"UHP-MESH\":{\"data\":[{\"id\":\"441c33a0-d3f2-11ef-891f-bd9197ea971c\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"48eb6ef0-d3f2-11ef-891f-bd9197ea971c\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"4cd10d90-d3f2-11ef-891f-bd9197ea971c\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"4ffdbc70-d3f2-11ef-891f-bd9197ea971c\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"UHP-MESH\"},\"SatNET\":{\"data\":[{\"id\":\"252a79e0-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"2d43b010-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"BPSK\",\"value\":\"BPSK\"},{\"id\":\"31f04830-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"QPSK\",\"value\":\"QPSK\"},{\"id\":\"366d6be0-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"8PSK\",\"value\":\"8PSK\"}],\"readableName\":\"SatNET\"}}",
      "relevance_field": "vsat_name",
      "required": "1",
      "span": "5",
      "useCascader": "0"
    },
    {
      "ch_name": "纠错码率",
      "en_name": "fec_rate",
      "field_type": "select",
      "id": "fec_rate",
      "relevance_config": "{\"HT&&LDPC\":{\"data\":[{\"id\":\"1c265d80-d6d1-11ef-9a15-33080208eae3\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"201bdaa0-d6d1-11ef-9a15-33080208eae3\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"22630b80-d6d1-11ef-9a15-33080208eae3\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"24e52280-d6d1-11ef-9a15-33080208eae3\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"277e9210-d6d1-11ef-9a15-33080208eae3\",\"key\":\"8/9\",\"value\":\"8/9\"},{\"id\":\"2a8ae7b0-d6d1-11ef-9a15-33080208eae3\",\"key\":\"9/10\",\"value\":\"9/10\"}],\"readableName\":\"\"},\"HT_8PSK&&LDPC\":{\"data\":[{\"id\":\"35d122a0-d236-11ef-9f81-9f62643df659\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"376186a0-d236-11ef-9f81-9f62643df659\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"39e12ca0-d236-11ef-9f81-9f62643df659\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"3e088f30-d236-11ef-9f81-9f62643df659\",\"key\":\"8/9\",\"value\":\"8/9\"}],\"readableName\":\"\"},\"HT_OQPSK&&LDPC\":{\"data\":[{\"id\":\"19da2b50-d236-11ef-bcf3-b9ab81f9171b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"1ac46440-d236-11ef-bcf3-b9ab81f9171b\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"1cce6510-d236-11ef-bcf3-b9ab81f9171b\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"1f41d610-d236-11ef-bcf3-b9ab81f9171b\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"21aa4a90-d236-11ef-bcf3-b9ab81f9171b\",\"key\":\"9/10\",\"value\":\"9/10\"}],\"readableName\":\"\"},\"HX/HN\":{\"data\":[{\"id\":\"06f7a2d0-d225-11ef-b7a5-7759314beb7d\",\"key\":\"Turbo\",\"value\":\"Turbo\"}],\"readableName\":\"\"},\"HX/HN&&LDPC\":{\"data\":[{\"id\":\"ee324920-d234-11ef-9546-3b8be75b4d6d\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"f3515220-d234-11ef-9546-3b8be75b4d6d\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"f5b532c0-d234-11ef-9546-3b8be75b4d6d\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"f97f3310-d234-11ef-9546-3b8be75b4d6d\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"fc78eb10-d234-11ef-9546-3b8be75b4d6d\",\"key\":\"9/10\",\"value\":\"9/10\"}],\"readableName\":\"\"},\"HX/HN&&Turbo\":{\"data\":[{\"id\":\"be020330-d234-11ef-b8e0-3bb5cbd30d02\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"ce5516f0-d234-11ef-aa6f-71a8879e96a3\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"de5b9150-d234-11ef-bb62-c3977bc53c86\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"e27893a0-d234-11ef-bb62-c3977bc53c86\",\"key\":\"4/5\",\"value\":\"4/5\"}],\"readableName\":\"\"},\"HXSS&&LDPC\":{\"data\":[],\"readableName\":\"\"},\"HXSS&&Turbo\":{\"data\":[{\"id\":\"71d676d0-d24d-11ef-a427-c53884070213\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"76cb89a0-d24d-11ef-a427-c53884070213\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"79f7c350-d24d-11ef-a427-c53884070213\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"7cc62590-d24d-11ef-a427-c53884070213\",\"key\":\"4/5\",\"value\":\"4/5\"}],\"readableName\":\"\"},\"IDEV_DISP&&TCC\":{\"data\":[{\"id\":\"16c69f30-d235-11ef-b75f-356c7865ba12\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"18c4b920-d235-11ef-b75f-356c7865ba12\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"1acf5630-d235-11ef-b75f-356c7865ba12\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"1e8afea0-d235-11ef-b75f-356c7865ba12\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"2161c550-d235-11ef-b75f-356c7865ba12\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"24acf8b0-d235-11ef-b75f-356c7865ba12\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"IDEV_PRE&&TCC\":{\"data\":[{\"id\":\"49fc8400-d235-11ef-8e40-4be494a6560d\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"4b38fba0-d235-11ef-8e40-4be494a6560d\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"4ecdbb20-d235-11ef-8e40-4be494a6560d\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"502e83a0-d235-11ef-8e40-4be494a6560d\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"526adf10-d235-11ef-8e40-4be494a6560d\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"551a47a0-d235-11ef-8e40-4be494a6560d\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"IDIN&&TPC\":{\"data\":[{\"id\":\"9ab0ce00-d236-11ef-a7b3-295a406d56f0\",\"key\":\"0.431\",\"value\":\"0.431\"},{\"id\":\"9d0397a0-d236-11ef-a7b3-295a406d56f0\",\"key\":\"0.533\",\"value\":\"0.533\"},{\"id\":\"9f0b9ca0-d236-11ef-a7b3-295a406d56f0\",\"key\":\"0.66\",\"value\":\"0.66\"},{\"id\":\"a1286220-d236-11ef-a7b3-295a406d56f0\",\"key\":\"0.793\",\"value\":\"0.793\"}],\"readableName\":\"\"},\"IDVL_DISP&&TCC\":{\"data\":[{\"id\":\"8c708a20-d235-11ef-b998-c1f61fa7a7a3\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"8cb53440-d235-11ef-b998-c1f61fa7a7a3\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"9232d800-d235-11ef-b998-c1f61fa7a7a3\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"94dc9b40-d235-11ef-b998-c1f61fa7a7a3\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"98e52b30-d235-11ef-b998-c1f61fa7a7a3\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"9d71b830-d235-11ef-b998-c1f61fa7a7a3\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"IDVL_PRE&&TCC\":{\"data\":[{\"id\":\"660136f0-d235-11ef-9d83-4d2de0cf2936\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"6a6d1c90-d235-11ef-9d83-4d2de0cf2936\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"6ce596a0-d235-11ef-9d83-4d2de0cf2936\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"6f201d50-d235-11ef-9d83-4d2de0cf2936\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"71adf420-d235-11ef-9d83-4d2de0cf2936\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"747885d0-d235-11ef-9d83-4d2de0cf2936\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"LinkWay&&auto\":{\"data\":[{\"id\":\"3bcd9ac0-d8c2-11ef-88fd-93065122996f\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"\"},\"LinkWayS2&&TCC\":{\"data\":[{\"id\":\"b2a03c40-d235-11ef-8f86-a976184e82e1\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"b57fb580-d235-11ef-8f86-a976184e82e1\",\"key\":\"1/3\",\"value\":\"1/3\"},{\"id\":\"b7760740-d235-11ef-8f86-a976184e82e1\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"ba731aa0-d235-11ef-8f86-a976184e82e1\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"bcde2730-d235-11ef-8f86-a976184e82e1\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"bf95cd20-d235-11ef-8f86-a976184e82e1\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"c1f281d0-d235-11ef-8f86-a976184e82e1\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"SCPC_IDIN&&TPC\":{\"data\":[{\"id\":\"b7e156c0-d236-11ef-91d7-a714f2b04d46\",\"key\":\"0.495\",\"value\":\"0.495\"},{\"id\":\"b8d79da0-d236-11ef-91d7-a714f2b04d46\",\"key\":\"0.533\",\"value\":\"0.533\"},{\"id\":\"bd1dabc0-d236-11ef-91d7-a714f2b04d46\",\"key\":\"0.793\",\"value\":\"0.793\"},{\"id\":\"c149c940-d236-11ef-91d7-a714f2b04d46\",\"key\":\"0.879\",\"value\":\"0.879\"}],\"readableName\":\"\"},\"SkyEdgeII&&TCC\":{\"data\":[{\"id\":\"74334a00-d236-11ef-b746-f96d202411bc\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"75511610-d236-11ef-b746-f96d202411bc\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"7969d2a0-d236-11ef-b746-f96d202411bc\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"7ab8e7e0-d236-11ef-b746-f96d202411bc\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"7f24a670-d236-11ef-b746-f96d202411bc\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"82ad7f10-d236-11ef-b746-f96d202411bc\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"SkyEdgeII-C&&TCC\":{\"data\":[{\"id\":\"50dfb5c0-d236-11ef-aabc-ad74a4988e3b\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"54359780-d236-11ef-aabc-ad74a4988e3b\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"56080d90-d236-11ef-aabc-ad74a4988e3b\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"597ac620-d236-11ef-aabc-ad74a4988e3b\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"5c2c78a0-d236-11ef-aabc-ad74a4988e3b\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"5dbf9bc0-d236-11ef-aabc-ad74a4988e3b\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"SkyWan&&auto\":{\"data\":[{\"id\":\"aa418e20-d8c3-11ef-a3d9-d52b7dc7e06e\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"\"},\"SkyWan5G&&auto\":{\"data\":[{\"id\":\"2277d690-d6d2-11ef-b42a-1b7980b7fd64\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"\"},\"UHP&&LDPC\":{\"data\":[{\"id\":\"d26ad0d0-d235-11ef-b8f1-b57e2e37b2d2\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"d8a5d120-d235-11ef-b8f1-b57e2e37b2d2\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"daf4a320-d235-11ef-b8f1-b57e2e37b2d2\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"dd3125a0-d235-11ef-b8f1-b57e2e37b2d2\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"df79b610-d235-11ef-b8f1-b57e2e37b2d2\",\"key\":\"5/6\",\"value\":\"5/6\"}],\"readableName\":\"\"},\"UHP-MESH&&LDPC\":{\"data\":[{\"id\":\"661b5b70-d3f2-11ef-9c5c-ff151ce9a6e2\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"6cdc54a0-d3f2-11ef-9c5c-ff151ce9a6e2\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"6f766070-d3f2-11ef-9c5c-ff151ce9a6e2\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"71e3b6f0-d3f2-11ef-9c5c-ff151ce9a6e2\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"74eab560-d3f2-11ef-9c5c-ff151ce9a6e2\",\"key\":\"5/6\",\"value\":\"5/6\"}],\"readableName\":\"\"},\"HX/HN&&TCC\":{\"data\":[{\"id\":\"56d616c0-249a-11f0-8d99-0b058ce41b48\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"\"},\"\":{\"data\":[],\"readableName\":\"\"},\"SatNET&&TCC\":{\"data\":[{\"id\":\"57312d80-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"auto\",\"value\":\"auto\"},{\"id\":\"5b8433f0-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"1/2\",\"value\":\"1/2\"},{\"id\":\"5f70d770-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"2/3\",\"value\":\"2/3\"},{\"id\":\"632f17f0-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"3/4\",\"value\":\"3/4\"},{\"id\":\"678d41f0-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"4/5\",\"value\":\"4/5\"},{\"id\":\"6c2fef00-8d31-11f0-8d92-eb8154e8bb62\",\"key\":\"6/7\",\"value\":\"6/7\"}],\"readableName\":\"\"},\"SkyWan5G&&TurboΦ\":{\"data\":[{\"id\":\"e27e46d0-9dc5-11f0-a9bc-bb0dd00db7ad\",\"key\":\"auto\",\"value\":\"auto\"}],\"readableName\":\"\"}}",
      "relevance_field": "dec_type",
      "required": "1",
      "span": "4",
      "useCascader": "1"
    },
    {
      "ch_name": "正/反谱",
      "default_value": "0",
      "en_name": "invert",
      "field_type": "radioButton",
      "id": "invert",
      "options": [
        {
          "id": "6624fb50-d224-11ef-b1f4-ff645a548ea0",
          "key": "正谱",
          "value": "0"
        },
        {
          "id": "66ce33a0-d224-11ef-b1f4-ff645a548ea0",
          "key": "反谱",
          "value": "1"
        }
      ],
      "required": "1",
      "span": "5"
    },
    {
      "ch_name": "流量模式",
      "default_value": "1",
      "en_name": "freq_mod",
      "field_type": "radioButton",
      "id": "freq_mod",
      "options": [
        {
          "id": "df2c0520-e516-11ef-a1d9-154a29a8dd5f",
          "key": "公用",
          "value": "0"
        },
        {
          "id": "fb9e46f0-e516-11ef-a1d9-154a29a8dd5f",
          "key": "私人",
          "value": "1"
        }
      ],
      "required": "1",
      "span": "5"
    },
    {
      "ch_name": "公用流量(K)",
      "en_name": "freq",
      "field_type": "input",
      "id": "freq_c",
      "range_relevance": "[{\"id\":\"3d38f090-f35b-11ef-966e-df9c04fd46cf\",\"field\":\"freq_mod\",\"key\":\"0\",\"value\":\"0\"}]",
      "required": "1",
      "span": "6",
      "value_range": "[100000,180000]"
    },
    {
      "ch_name": "私人流量(K)",
      "en_name": "freq",
      "field_type": "input",
      "id": "freq_l",
      "range_relevance": "[{\"id\":\"4c1bd280-f35b-11ef-966e-df9c04fd46cf\",\"field\":\"freq_mod\",\"key\":\"1\",\"value\":\"1\"}]",
      "required": "1",
      "span": "6",
      "value_range": "[950000,2150000]"
    },
    {
      "ch_name": "调制速率(Bd)",
      "en_name": "symbol_rate",
      "field_type": "input",
      "id": "symbol_rate",
      "required": "1",
      "span": "6",
      "value_range": "[128000,12500000]"
    }
  ]
}
