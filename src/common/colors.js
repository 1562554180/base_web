import devStatusGreen01 from 'assets/devStatusGreen-01.png';
import devStatusGreen02 from 'assets/devStatusGreen-02.png';
import devStatusGreen03 from 'assets/devStatusGreen-03.png';
import devStatusGreen04 from 'assets/devStatusGreen-04.png';
import devStatusGreen05 from 'assets/devStatusGreen-05.png';
import devStatusGreen06 from 'assets/devStatusGreen-06.png';
import devStatusWrite01 from 'assets/devStatusWrite-01.png';
import devStatusWrite02 from 'assets/devStatusWrite-02.png';
import devStatusWrite03 from 'assets/devStatusWrite-03.png';
import devStatusWrite04 from 'assets/devStatusWrite-04.png';
import devStatusWrite05 from 'assets/devStatusWrite-05.png';
import devStatusWrite06 from 'assets/devStatusWrite-06.png';
import devStatusDefault01 from 'assets/devStatusDefault-01.png';
import devStatusDefault02 from 'assets/devStatusDefault-02.png';
import devStatusDefault03 from 'assets/devStatusDefault-03.png';
import devStatusDefault04 from 'assets/devStatusDefault-04.png';
import devStatusDefault05 from 'assets/devStatusDefault-05.png';
import devStatusDefault06 from 'assets/devStatusDefault-06.png';
import F14 from 'assets/F-14.png';
import F15 from 'assets/F-15.png';
import F15White from 'assets/F-15-white.png';
import F15Green from 'assets/F-15-green.png';
import F16 from 'assets/F-16.png';
import F16White from 'assets/F-16-white.png';
import F16Green from 'assets/F-16-green.png';
import F14White from 'assets/F-14-white.png';
import F14Green from 'assets/F-14-green.png';
import S1 from 'assets/S-01.png';
import S1Green from 'assets/S-01-green.png';
import S1White from 'assets/S-01-white.png';
import F1 from 'assets/F-01.png';
import F1Green from 'assets/F-01-green.png';
import F1White from 'assets/F-01-white.png';
import F302 from 'assets/F3-02.png';
import F302White from 'assets/F3-02-white.png';
import F302Green from 'assets/F3-02-green.png';
import F7 from 'assets/F3-07.png';
import F7White from 'assets/F3-07-white.png';
import F7Green from 'assets/F3-07-green.png';
import NodeTooltip from 'assets/nodeTooltip.png';
import NodeTooltipWhite from 'assets/nodeTooltipWhite.png';
import NodeTooltipGreen from 'assets/nodeTooltipGreen.png';
import TopoDefault from 'assets/topoDefault.png';
import TopoWhite from 'assets/topoWhite.png';
import TopoGreen from 'assets/topoGreen.png';
import NodesPng from 'assets/nodes.png'
import EdgesPng from 'assets/edges.png'
import NodesWhitePng from 'assets/nodesWhite.png'
import EdgesWhitePng from 'assets/edgesWhite.png'
import NodesGreenPng from 'assets/nodesGreen.png'
import EdgesGreenPng from 'assets/edgesGreen.png'

import ShutDownBlue from 'assets/shutDownBlue.png';
import RestartBlue from 'assets/restartBlue.png';
import ReloadBlue from 'assets/reloadBlue.png';
import ShutDownWhite from 'assets/shutDownWhite.png';
import RestartWhite from 'assets/restartWhite.png';
import ReloadWhite from 'assets/reloadWhite.png';
import ShutDownGreen from 'assets/shutDownGreen.png';
import RestartGreen from 'assets/restartGreen.png';
import ReloadGreen from 'assets/reloadGreen.png';
import TitleIcon from 'assets/quickViewTypeIcon.png';
import showChartPng from 'assets/showChart.png';
import showChartHighPng from 'assets/showChartHighLight.png';
import TitleIconWhite from 'assets/quickViewTypeIconWhite.png';
import cornerLTBlue from 'assets/cornerImg/cornerLTBlue.png';
import cornerRTBlue from 'assets/cornerImg/cornerRTBlue.png';
import cornerRBBlue from 'assets/cornerImg/cornerRBBlue.png';
import cornerLBBlue from 'assets/cornerImg/cornerLBBlue.png';
import cornerLTWhite from 'assets/cornerImg/cornerLTWhite.png';
import cornerRTWhite from 'assets/cornerImg/cornerRTWhite.png';
import cornerRBWhite from 'assets/cornerImg/cornerRBWhite.png';
import cornerLBWhite from 'assets/cornerImg/cornerLBWhite.png';
import cornerLTGreen from 'assets/cornerImg/cornerLTGreen.png';
import cornerRTGreen from 'assets/cornerImg/cornerRTGreen.png';
import cornerRBGreen from 'assets/cornerImg/cornerRBGreen.png';
import cornerLBGreen from 'assets/cornerImg/cornerLBGreen.png';

import config from 'utils/config';

export const colorObj = {
  devstatus: {
    default: {
      colorsValue: ['#f35679','#08f5e1', '#f99515', '#03a9f4', '#7b19f9'],
      themeImage: [devStatusDefault01, devStatusDefault02, devStatusDefault03, devStatusDefault04, devStatusDefault05, devStatusDefault06],
    },
    highlight: {
      colorsValue: ['#2d89e9','#1037a6', '#0fb6ed', '#fc8a0c', '#2bbc1d'],
      themeImage: [devStatusWrite01, devStatusWrite02, devStatusWrite03, devStatusWrite04, devStatusWrite05, devStatusWrite06],
    },
    greenTheme: {
      colorsValue: ['#2d89e9','#1037a6', '#0fb6ed', '#fc8a0c', '#2bbc1d'],
      themeImage: [devStatusGreen01, devStatusGreen02, devStatusGreen03, devStatusGreen04, devStatusGreen05, devStatusGreen06],
    },
    techBlack: {
      colorsValue: ['#3d7ab8', '#4da8d4', '#e8a838', '#2bbc8d', '#e84a5f'],
      themeImage: [devStatusDefault01, devStatusDefault02, devStatusDefault03, devStatusDefault04, devStatusDefault05, devStatusDefault06],
    },
  },
  chartColor: {
    default: {
      labelColor: '#fff',
      lineColor: '#ccc',
      legendColor: '#fff',
      backgroundColor: '#19325a',
      zoomLabelColor: '#fff',
      splitLineColor: 'rgba(255,255,255,0.1)',
      barColor: ['#faae1b','#2f9bff'],
      normalColor: ['#5d92e8', '#3468bc'],
      dataZoomFillerBgc: 'none',
      dataZoomBgc: '#526788',
      dataZoomLeftRight: '#a5b5ca',
      dataZoomBorder: '#babfc7',
      lineTopColor: '#1890ff',
      areaColor: 'rgba(24, 144, 255, 0.15)',
      unitColor: '#fff',
    },
    highlight: {
      labelColor: '#444b59',
      lineColor: '#ccc',
      legendColor: '#5c7093',
      backgroundColor: '#fff',
      zoomLabelColor: '#5c7093',
      splitLineColor: '#dde2e9',
      barColor: ['#0e09dc', '#fc7524'],
      normalColor: ['#95a9e0', '#3658c3'],
      dataZoomFillerBgc: 'rgba(16, 55, 166, 0.06)',
      dataZoomBgc: '#f6f8fc',
      dataZoomLeftRight: '#bbbec8',
      dataZoomBorder: '#cacdd8',
      lineTopColor: '#8ba0da',
      areaColor: 'rgba(50, 93, 215, 0.1)',
      unitColor: '#3e3e3e',

    },
    greenTheme: {
      labelColor: '#ccc',
      lineColor: '#2d3c41',
      legendColor: '#5c7093',
      backgroundColor: '#21202e',
      zoomLabelColor: '#fff',
      splitLineColor: '#2d3c41',
      barColor: ['#0ed1d8', '#e85e47'],
      normalColor: ['#16a4b8', '#c88e1f'],
      dataZoomFillerBgc: 'none',
      dataZoomBgc: '#526788',
      dataZoomLeftRight: '#bbbec8',
      dataZoomBorder: '#cacdd8',
      lineTopColor: '#16a4b8',
      areaColor: 'rgba(61, 124, 136, 0.4)',
      unitColor: '#89cad8',
    },
    techBlack: {
      labelColor: '#89cad8',
      lineColor: '#2b4c56',
      legendColor: '#89cad8',
      backgroundColor: '#2a2938',
      zoomLabelColor: '#89cad8',
      splitLineColor: 'rgba(137, 202, 216, 0.1)',
      barColor: ['#3d7ab8', '#4da8d4'],
      normalColor: ['#3d7ab8', '#214e85'],
      dataZoomFillerBgc: 'none',
      dataZoomBgc: '#2b4c56',
      dataZoomLeftRight: '#5d8ab8',
      dataZoomBorder: '#2b4c56',
      lineTopColor: '#4da8d4',
      areaColor: 'rgba(77, 168, 212, 0.15)',
      unitColor: '#89cad8',
    },
  },
  visColor: {
    default: {
      colorText: ['#e0e9ee', '#fe4545', '#1baff4'],
    },
    highlight: {
      colorText: ['#5a5a5a', '#222222', '#1037a6'] ,
    },
    techBlack: {
      colorText: ['#89cad8', '#e84a5f', '#4da8d4'],
    },
  },
  fieldRelation: {
    default: {
      defaultColor: '#e0e9ee',
    },
    highlight: {
      defaultColor: '#5a5a5a',
    },
    techBlack: {
      defaultColor: '#89cad8',
    },
  },
  spiGraph: {
    default: {
      sessionBarColor: ['#609bd2'],
      otherBarColor: ['#5d92e8','#3468bc'],
    },
    highlight: {
      sessionBarColor: ['#3658c3'],
      otherBarColor: ['#95a9e0', '#3658c3'],
    },
    greenTheme: {
      sessionBarColor: ['#16a4b8'],
      otherBarColor: ['#16a4b8', '#c88e1f'],
    },
    techBlack: {
      sessionBarColor: ['#3d7ab8'],
      otherBarColor: ['#3d7ab8', '#214e85'],
    },
  },
  pieChart: {
    default: {
      fill: '#fff',
      stroke: '#fff',
      colors: ['name'],

    },
    highlight: {
      fill: '#5c7093',
      stroke: '#5c7093',
      colors: ['name'],
    },
    greenTheme: {
      fill: '#a0c1c8',
      stroke: '#a0c1c8',
      colors: ['name','#2ba2b0-#adcb48-#b0492f-#5a55af-#3c8097-#2972ab-#a6429b-#cb7b1d'],
    },
    techBlack: {
      fill: '#89cad8',
      stroke: '#89cad8',
      colors: ['name', '#3d7ab8-#4da8d4-#e8a838-#2bbc8d-#e84a5f-#214e85-#3d5a8a-#2a5a7a'],
    },
  },
  httpBeautify: {
    default: {
      themeType: 'monokai',
    },
    highlight: {
      themeType: 'xcode',
    },
    greenTheme: {
      themeType: 'terminal',
    },
    techBlack: {
      themeType: 'monokai',
    },
  },
  oneLineHexColors: {
    default: {
      title: '#c2dce4',
      titleSelect: '#ffba18',
      ip: 'rgb(217, 77, 234)',
      tu: 'rgb(220, 196, 31)',
      hitColor: '#7afafc',
      sepLine: '#6b7173',
      hexPointSelect: '#ffba18',
      leftTextColor: '#c2dce4',
      errorAckColor: '#ff4242',
      errorAckBgc: 'none',
    },
    highlight: {
      title: '#3c3c3c',
      titleSelect: 'rgb(255, 139, 57)',
      ip: '#ff7a0e',
      tu: '#00bc2c',
      hitColor: '#7afafc',
      sepLine: ' #dde2e9',
      hexPointSelect: 'rgb(255, 139, 57)',
      leftTextColor: '#3c3c3c',
      errorAckColor: '#ff0c19',
      errorAckBgc: '#e3e8f4',
    },
    greenTheme: {
      title: '#5d858d',
      titleSelect: '#ffed92',
      ip: '#ba4444',
      tu: '#4ca558',
      hitColor: '#5d858d',
      sepLine: ' #dde2e9',
      hexPointSelect: '#ffed92',
      leftTextColor: '#5d858d',
      errorAckColor: '#ff4242',
      errorAckBgc: 'none',
    },
    techBlack: {
      title: '#6a8a9a',
      titleSelect: '#4da8d4',
      ip: '#e8a838',
      tu: '#2bbc8d',
      hitColor: '#89cad8',
      sepLine: '#2b4c56',
      hexPointSelect: '#4da8d4',
      leftTextColor: '#6a8a9a',
      errorAckColor: '#e84a5f',
      errorAckBgc: 'none',
    },
  },
  sequenceColors: {
    default: {
      colorText: '#fff',
      columns1Bgc: '#4a72b3',
      columns2Bgc: '#1c51a6',
      columns3Bgc: '#316bc9',
      columns4Bgc: '#264d8c',
      errorAckColor: '#ff4242',
      errorAckBgc: 'none',
    },
    highlight: {
      colorText: '#fff',
      columns1Bgc: '#2f74ff',
      columns2Bgc: '#0073df',
      columns3Bgc: '#008af4',
      columns4Bgc: '#0b62e4',
      errorAckColor: '#ff0c19',
      errorAckBgc: '#e3e8f4',
    },
    greenTheme: {
      colorText: '#fff',
      columns1Bgc: '#50a5b3',
      columns2Bgc: '#5d858d',
      columns3Bgc: '#3b7c87',
      columns4Bgc: '#445a61',
      errorAckColor: '#ff4242',
      errorAckBgc: 'none',
    },
    techBlack: {
      colorText: '#89cad8',
      columns1Bgc: '#2d5a8a',
      columns2Bgc: '#214e85',
      columns3Bgc: '#3d7ab8',
      columns4Bgc: '#1a3d5a',
      errorAckColor: '#e84a5f',
      errorAckBgc: 'none',
    },
  },
  pieMore: {
    default: {
      colorText: '#fff',
    },
    highlight: {
      colorText: '#1037a6',
    },
    greenTheme: {
      colorText: '#56baca',
    },
    techBlack: {
      colorText: '#89cad8',
    },
  },
  mapColors: {
    default: {
      colors: ['#1566aa', '#1d81d6','#48a1ec', '#7cc3ff'],
    },
    highlight: {
      colors: ['#1037a6', '#416ade','#6185ec', '#99b3ff'],
    },
    greenTheme: {
      colors: ['#2dccea', '#41adc2','#467f8a', '#3a5b61'],
    },
    techBlack: {
      colors: ['#214e85', '#3d7ab8', '#4da8d4', '#5d8ab8'],
    },
  },
  aceTheme: {
    default: {
      themeType: 'monokai',
    },
    highlight: {
      themeType: 'xcode',
    },
    greenTheme: {
      themeType: 'terminal',
    },
    techBlack: {
      themeType: 'monokai',
    },
  },
  offineFileStats: {
    default: {
      iconColor: {'done': '#12b329', 'doing': '#ccc','error':'#de1111'},
    },
    highlight: {
      iconColor: {'done': '#158ceb', 'doing': '#7c7b7b','error':'#de1111'},
    },
    greenTheme: {
      iconColor: {'done': '#158ceb', 'doing': '#7c7b7b','error':'#de1111'},
    },
    techBlack: {
      iconColor: {'done': '#2bbc8d', 'doing': '#4a5a6c', 'error': '#e84a5f'},
    },
  },
  dataViewColorArray: {
    viewColor: {
      default: {
        fill: '#314b7d',
        stroke: '#314b7d',
        textProps: {
          fill: '#FFF',
        },
      },
      highlight: {
        fill: '#f3f6fd',
        stroke: '#325dd7',
        textProps: {
          fill: '#303238',
        },
      },
      greenTheme: {
        fill: 'rgba(38,174,196,0.15)',
        stroke: '#36b9d2',
        textProps: {
          fill: '#f3fdff',
        },
      },
      techBlack: {
        fill: 'rgba(61, 122, 184, 0.2)',
        stroke: '#3d7ab8',
        textProps: {
          fill: '#89cad8',
        },
      },
    },

    warnColor: {
      default: {
        fill: 'rgba(255,46,24,0.2)',
        stroke: '#ff433a',
        textProps: {
          fill: '#FFF',
        },
      },
      highlight: {
        fill: '#ffe6e6',
        stroke: '#ff3636',
        textProps: {
          fill: '#303238',
        },
      },
      greenTheme: {
        fill: 'rgba(240,47,8,0.15)',
        stroke: '#ff4622',
        textProps: {
          fill: '#f3fdff',
        },
      },
      techBlack: {
        fill: 'rgba(232, 74, 95, 0.15)',
        stroke: '#e84a5f',
        textProps: {
          fill: '#89cad8',
        },
      },
    },
    deleteColor:{
      default: {
        fill: '#2b3038',
        stroke: '#969aa1',
        textProps: {
          fill: '#ff4f4f',
        },
      },
      highlight: {
        fill: '#e1e2e6',
        stroke: '#8c8f99',
        textProps: {
          fill: '#fe4027',
        },
      },
      greenTheme: {
        fill: 'rgba(143,156,158,0.15)',
        stroke: '#acacac',
        textProps: {
          fill: '#f71d1d',
        },
      },
      techBlack: {
        fill: 'rgba(61, 74, 92, 0.3)',
        stroke: '#4a5a6c',
        textProps: {
          fill: '#e84a5f',
        },
      },
    },
  },
  volumpStatusColors: {
    default: ['rgb(208, 151, 23)', 'rgb(24 144 255)', 'rgb(37 179 88)', '#e4594f'],
    highlight: ['rgb(236, 164, 33)', 'rgb(53, 122, 247)', 'rgb(88, 210, 37)', 'rgb(245, 89, 79)'],
    greenTheme: ['rgb(169, 150, 14)', 'rgb(40 130 195)', 'rgb(28, 152, 7)', 'rgb(179 50 41)'],
    techBlack: ['rgb(232, 168, 56)', 'rgb(61, 122, 184)', 'rgb(43, 188, 141)', 'rgb(232, 74, 95)'],
  },
  tasksBtnColors: {
    default: ['rgb(24 144 255)', 'rgb(37 179 88)', '#e4594f', 'rgb(115, 130, 152)'],
    highlight: ['rgb(53, 122, 247)', 'rgb(88, 210, 37)', 'rgb(245, 89, 79)', 'rgb(114, 138, 156)'],
    greenTheme: ['rgb(40 130 195)', 'rgb(28, 152, 7)', 'rgb(179 50 41)', 'rgb(102 110 111)'],
    techBlack: ['rgb(61, 122, 184)', 'rgb(43, 188, 141)', 'rgb(232, 74, 95)', 'rgb(74, 90, 108)'],
  },
  offLineTasksBtnColors: {
    default: ['rgb(133, 138, 146)', 'rgb(208, 151, 23)', 'rgb(59, 154, 243)', 'rgb(37 179 88)', 'rgb(115, 130, 152)', 'rgb(226, 124, 19)', '#e4594f'],
    highlight: ['rgb(177, 178, 183)', 'rgb(236, 164, 33)', 'rgb(65, 100, 199)', 'rgb(88, 210, 37)', 'rgb(114, 138, 156)', 'rgb(251, 133, 32)','rgb(245, 89, 79)'],
    greenTheme: ['rgb(61, 109, 115)', 'rgb(169, 150, 14)', 'rgb(59, 96, 230)', 'rgb(28, 152, 7)', 'rgb(102 110 111)', 'rgb(187, 109, 29)', 'rgb(179 50 41)'],
    techBlack: ['rgb(74, 90, 108)', 'rgb(232, 168, 56)', 'rgb(61, 122, 184)', 'rgb(43, 188, 141)', 'rgb(74, 90, 108)', 'rgb(232, 168, 56)', 'rgb(232, 74, 95)'],
  },
  importStats: {
    default: ['rgb(59, 154, 243)', 'rgb(37 179 88', '#e4594f', 'rgb(226, 124, 19)'],
    highlight: ['rgb(65, 100, 199)', 'rgb(88, 210, 37)', 'rgb(245, 89, 79)', 'rgb(251, 133, 32)'],
    greenTheme: ['rgb(59, 96, 230)', 'rgb(28, 152, 7)', 'rgb(179 50 41)', 'rgb(187, 109, 29)'],
    techBlack: ['rgb(61, 122, 184)', 'rgb(43, 188, 141)', 'rgb(232, 74, 95)', 'rgb(232, 168, 56)'],
  },

  toposBackgroundObj: {
    default: {
      testBackgroundObj: {'1': '#99c5df', '2': '#9e96da', '3': '#62a0d9', '5': '#60b2c3', '10': '#c9c84e', 'max': '#db8f17', add: '#b35e5e', del: '#58b556',dif: '#af3d3d'},
      colorObj: {'1': '#a5cfe8', '2': '#b5b0fb', '3': '#70b2ef', '5': '#7ed3e5', '10': '#dad955', 'max': '#e79f2c'},
      unChooseColor: {'1': `rgba(162,232,245, ${config.topoColorOpacity})`, '2': `rgba(162,174,245, ${config.topoColorOpacity})`, '3': `rgba(73,145,198, ${config.topoColorOpacity})`, '5': `rgba(148,246,187, ${config.topoColorOpacity})`, '10': `rgba(241,215,13, ${config.topoColorOpacity})`, 'max': `rgba(254,69,69, ${config.topoColorOpacity})`} ,
      edgeColor: {color: '#6d737f',highlight: '#fff',hover: '#ddd9ff'},
      colorOpacityObj: {'1': 'rgba(255,255,255,.5)', '2': 'rgba(255,255,255,.5)', '3': 'rgba(27,175,244,.5)', '5': 'rgba(254,69,69,.5)', '10': 'rgba(254,69,69,.8)', 'max': 'rgba(254,69,69,.8)'} ,
      backgroundObj: {'1': '#4991c6', '3': '#fbd437', '5': '#fbd437', '10': '#fbd437', add: '#b35e5e', del: '#58b556',dif: '#af3d3d'},
      bgpColorObj: {'1': 'black', '3': 'blue', '5': 'red'},
      bgpAsBgcObj: {'bgp': '#7b3da6', 'as': '#9a6134'},
      borderColor: {chooseColor: '#fb4646', searchColor: '#e9ef11', chooseBorderColor: '#fb4646'},
      unChooseBgc: {'1': `rgba(162,232,245, ${config.topoColorOpacity})`, '2': `rgba(162,174,245, ${config.topoColorOpacity})`, '3': `rgba(73,145,198, ${config.topoColorOpacity})`, '5': `rgba(148,246,187, ${config.topoColorOpacity})`, '10': `rgba(241,215,13, ${config.topoColorOpacity})`, 'max': `rgba(254,69,69, ${config.topoColorOpacity})`} ,
      unSvgChooseBgc: 'rgba(0,0,0,0.3)',
      bgpColor: '#fff',
      eigrpBgc: {
        inside: '#f9aeef', //内部背景
        outside: '#81cbf1', //外部背景
        insideAndOutSide: ['#eedca0', '#79e2d9'],//内外部背景
        titleBgc: ['#ab469e', '#0068d3', '#8241ee'], //内部、外部、内外部title
      },
      defaultTopoTypeColor: '#c4c4c4',
    },
    highlight: {
      testBackgroundObj: {'1': '#85cdf7', '2': '#8c85e7', '3': '#3698f3', '5': '#4eb6cc', '10': '#f6cb05', 'max': '#db8f17', add: '#0ad226', del: '#0ad226',dif: '#af3d3d'},
      // colorObj: {'1': '#227fd5', '2': '#ac2be7', '3': '#2754de', '5': '#e843bc', '10': '#f68522', 'max': '#0371f9'},
      colorObj: {'1': '#78c2ed', '2': '#7871d9', '3': '#2882d5', '5': '#2a99b5', '10': '#e3bc08', 'max': '#f0a42d'},
      edgeColor: {color: '#3e3e3e',highlight: '#111111',hover: '#ddd9ff'},
      colorOpacityObj: {'1': 'rgba(42,232,245,.5)', '2': 'rgba(187,74,238,.5)', '3': 'rgba(45,91,231,.5)', '5': 'rgba(239,101,201,.5)', '10': 'rgba(252,150,60,.8)', 'max': 'rgba(25,166,221,.8)'} ,
      backgroundObj: {'1': '#f7b8f6', '3': '#73c0de', '5': '#fac858', '10': '#c0b1ef', add: '#b35e5e', del: '#58b556',dif: '#af3d3d'},
      bgpColorObj: {'1': '#3e3e3e', '3': '#3e3e3e', '5': '#3e3e3e', '10': '#3e3e3e'},
      bgpAsBgcObj: {'bgp': '#7048ea', 'as': '#f47a29'},
      borderColor: {chooseColor: '#fb4646', searchColor: '#ffa02f', chooseBorderColor: '#fb4646'},
      unChooseBgc: {'1': `rgba(42,232,245, ${config.topoColorOpacity})`, '2': `rgba(187,74,238, ${config.topoColorOpacity})`, '3': `rgba(45,91,231, ${config.topoColorOpacity})`, '5': `rgba(239,101,201, ${config.topoColorOpacity})`, '10': `rgba(252,150,60, ${config.topoColorOpacity})`, 'max': `rgba(25,166,221, ${config.topoColorOpacity})`} ,
      unSvgChooseBgc: 'rgba(255,255,255,0.4)',
      bgpColor: '#3e3e3e',
      eigrpBgc: {
        inside: '#f4bdf3',
        outside: '#b8d2f6',
        insideAndOutSide: ['#ffe596', '#9deeff'],
        titleBgc: ['#c641c4', '#355ede', '#ec35a1'],
      },
      defaultTopoTypeColor: '#000',
    },
    greenTheme: {
      testBackgroundObj: {'1': '#a5cfe8', '2': '#a990d0', '3': '#63a2dc', '5': '#64acbb', '10': '#cfc85a', 'max': '#db8f17', add: '#ff2828', del: '#15e315',dif: '#af3d3d'},
      colorObj: {'1': '#a5cfe8', '2': '#b198d8', '3': '#7fb9ef', '5': '#91d3b9', '10': '#e1da67', 'max': '#eba941'},
      edgeColor: {color: '#696874',highlight: '#fff',hover: '#ddd9ff'},
      colorOpacityObj: {'1': 'rgba(45,233,210,.8)', '2': 'rgba(244,231,18,.8)', '3': 'rgba(157,147,255,.8)', '5': 'rgba(239,101,201,.8)', '10': 'rgba(252,150,60,.8)', 'max': 'rgba(25,166,221,.8)'} ,
      backgroundObj: {'1': '#70dfff', '3': '#f6c4f9', '5': '#f0e754', '10': '#027b6b', add: '#b35e5e', del: '#58b556',dif: '#af3d3d'},
      bgpColorObj: {'1': '#3e3e3e', '3': '#3e3e3e', '5': '#3e3e3e', '10': '#fff'},
      bgpAsBgcObj: {'bgp': '#cb22d5', 'as': '#ee701d '},
      borderColor: {chooseColor: '#fb4646', searchColor: '#ffec1b', chooseBorderColor: '#fb4646'},
      unChooseBgc: {'1': `rgba(45,233,210, ${config.topoColorOpacity})`, '2': `rgba(244,231,18, ${config.topoColorOpacity})`, '3': `rgba(157,147,255, ${config.topoColorOpacity})`, '5': `rgba(239,101,201, ${config.topoColorOpacity})`, '10': `rgba(252,150,60, ${config.topoColorOpacity})`, 'max': `rgba(25,166,221, ${config.topoColorOpacity})`} ,
      unSvgChooseBgc: 'rgba(0,0,0,0.3)',
      bgpColor: '#fff',
      eigrpBgc: {
        inside: '#ffc5fe',
        outside: '#93e6fb',
        insideAndOutSide: ['#feffa1', '#84fcef'],
        titleBgc: ['#d41cd1', '#005b72', '#533fe8'],
      },
      defaultTopoTypeColor: '#c4c4c4',
    },
  },

  ospfColorsObj: {
    default: {
      backgroundObj: {'ABR': '#9a6134', 'ASBR': '#ba3b8c', 'VR': '#7b3da6', 'IR': '#3e7355'}, //ospf --ABR、ASBR、VR、IR 背景色
    },
    highlight: {
      backgroundObj: {'ABR': '#3661e8', 'ASBR': '#e040de', 'VR': '#f47a29', 'IR': '#7048ea'},
    },
    greenTheme: {
      backgroundObj: {'ABR': '#146dff', 'ASBR': '#cb22d5', 'VR': '#ee701d', 'IR': '#027b6b'},
    },
  },
  toposBtn: {
    default: {topoModeImg: F14, svgModeImg: F16, topoLastImg: F15},
    highlight: {topoModeImg: F14White, svgModeImg: F16White, topoLastImg: F15White},
    greenTheme: {topoModeImg: F14Green, svgModeImg: F16Green, topoLastImg: F15Green},
  },
  toposBtn2: {
    default: {topoAddImg: F302, topoOverviewImg: F1, tableOverviewImg: S1, topoPhotoImg: F7},
    highlight: {topoAddImg: F302White, topoOverviewImg: F1White, tableOverviewImg: S1White, topoPhotoImg: F7White},
    greenTheme: {topoAddImg: F302Green, topoOverviewImg: F1Green, tableOverviewImg: S1Green, topoPhotoImg: F7Green},
  },
  nodeTooltipBgc: {
    default: NodeTooltip,
    highlight: NodeTooltipWhite,
    greenTheme: NodeTooltipGreen,
  },
  topoIcon: {
    default: TopoDefault,
    highlight: TopoWhite,
    greenTheme: TopoGreen,
  },
  nodesAndEdgesIcon: {
    default: [NodesPng, EdgesPng],
    highlight: [NodesWhitePng, EdgesWhitePng],
    greenTheme: [NodesPng, EdgesPng],
  },
  statsIconObj: {
    default: {
      shutDownImg: ShutDownBlue,
      restartImg: RestartBlue,
      reloadImg: ReloadBlue,
    },
    highlight: {
      shutDownImg: ShutDownWhite,
      restartImg: RestartWhite,
      reloadImg: ReloadWhite,
    },
    greenTheme: {
      shutDownImg: ShutDownGreen,
      restartImg: RestartGreen,
      reloadImg: ReloadGreen,
    },
  },
  quickTitleImg: {
    default: TitleIcon,
    highlight: TitleIconWhite,
    greenTheme: TitleIcon,
  },

  cornerImg: {
    default: {leftTop: cornerLTBlue, rightTop: cornerRTBlue, rightBottom: cornerRBBlue, leftBottom: cornerLBBlue},
    highlight: {leftTop: cornerLTWhite, rightTop: cornerRTWhite, rightBottom: cornerRBWhite, leftBottom: cornerLBWhite},
    greenTheme: {leftTop: cornerLTGreen, rightTop: cornerRTGreen, rightBottom: cornerRBGreen, leftBottom: cornerLBGreen},
  },

  showChartImg: {
    default: showChartPng,
    highlight: showChartHighPng,
    greenTheme: showChartPng,
  },
  
}

export function getComponentColor(name) {
  return colorObj[name][config.selectedTheme || 'default'];
}
