import React, { PureComponent } from 'react';
import * as echarts from 'echarts';
import { getByteSize, localNumeral } from 'utils/utils';
import _ from 'lodash';

let myChart = null;

export default class TreePolyLineChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      
    }
  }

  componentDidMount() {
    const { data } = this.props;
    if (!_.isEmpty(data)) {
      this.initChart(data);
    }
    if (myChart) {
      window.addEventListener('resize', myChart.resize);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data)) {
      this.initChart(nextProps.data);
    }
  }

  initChart = (data) => {
    const { id, options, nodeType, edgeType, defaultExpandLevel, collapsed, nodeStyle, labelStyle, edgeStyle, otherOptionsProps ={}, customOrient } = this.props;
    if (myChart) {
      myChart.dispose();
      myChart = null;
    }
    const container = document.getElementById(id || 'ecahrtsPolyLineTree');
    myChart = echarts.init(container);
    let customOptions = {
      renderer: 'canvas',
      useDirtyRect: false,
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: function(arg) {
          return arg.name;
        }
      },
      series: [
        {
          type: 'tree',
          data: [data],
          left: '2%',
          right: '2%',
          top: '5%',
          bottom: '100px',
          // 空心 emptyCircle 实心 circle
          symbol: nodeType || 'circle',
          symbolSize: 12,
          layerPadding: 5,
          nodePadding: 5,
          edgeShape: edgeType || "polyline",
          // 默认树展开的层级 默认为2
          initialTreeDepth: defaultExpandLevel || 4,
          orient: customOrient || 'vertical',
          expandAndCollapse: collapsed || false,
          itemStyle: nodeStyle || {
            color: '#4FA0F1',
          },
          label: labelStyle || {
            position: 'bottom',
            rotate: -90,
            offset: [0, 0],
            align: 'left',
            verticalAlign: 'middle',
            fontSize: 15,
            color: "#4FA0F1",
            fontWeight: 'bold',
          },
          tooltip: {
            formatter: (params) => {
              const data = params.data || {};
              if (data.pkts || data.bytes) {
                return `${params.name}<br/>${data.pkts ? `包数：${localNumeral(data.pkts)}`: ''}<br/>${data.bytes ? `流量：${getByteSize(data.bytes)}` : ''}`;
              } else {
                return `${params.name}`;
              }
            }
          },
          // labelLayout: function(params) {
          //   return {
          //     x: params.rect.x + params.rect.width / 2,
          //     y: params.rect.y + params.rect.height + 10,
          //     verticalAlign: 'middle',
          //     align: 'center'
          //   }
          // },
          leaves: {
            label: {
              position: 'bottom',
              rotate: -90,
              offset: [0, 0],
              verticalAlign: 'middle',
              align: 'left',
              fontSize: 12,
              color: "#4FA0F1",
              fontWeight: 'bold',
            }
          },
          lineStyle: edgeStyle || {
            color: '#48566e'
          },
          // emphasis: {
          //   focus: 'descendant',
          // },
          // select: {
          //   itemStyle: {
          //     color: '#56f463'
          //   },
          //   lineStyle: {
          //     color: '#FFFFFF'
          //   }
          // },
          // 5.30开始支持选中整个类 series  之前版本只支持 single(单个)和multiple(多个)
          // selectedMode: "single",
          animationDuration: 550,
          animationDurationUpdate: 750,
          ...otherOptionsProps
        }
      ]
    }
    if (options) {
      customOptions = options;
    }
    myChart.setOption(customOptions);
    const nodes = myChart._chartsViews[0]._data._graphicEls;
    let allNode = 0;
    for(let index=0; index < nodes.length; index++) {
      const node = nodes[index];
      if (node === undefined) {
        continue;
      }
      allNode++;
    }
    const windowWidth = window.innerWidth;
    const currentWidth = 15 * allNode;
    const newWdith = Math.max(currentWidth, windowWidth);
    container.style.width = newWdith + 'px';
    myChart.resize(); 
    let isAdjusted = false;
    myChart.on('click', this.handleClickChart);
    myChart.on('finished', () => {
      if(isAdjusted) return;
      const seriesModel = myChart.getModel().getSeriesByIndex(0);
      const data = seriesModel.getData();
      let rootNode = data.tree.root;
      let rootNodeX = 100;
      if (this.props.handleChartBoxScroll) {
        this.props.handleChartBoxScroll(currentWidth/2 - rootNodeX);
      }
      isAdjusted = true;
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data)) {
      this.initChart(nextProps.data);
    }
  }

  componentWillUnmount() {
    this.myChart = null;
  }

  handleClickChart = (param) => {
    if(this.props.handleClickChart) {
      this.props.handleClickChart(param.data || {});
    }
  }
  
  render() {
    const { width, height, otherStyles={}, id } = this.props;
    const styles={
      width: width || '100%',
      height: height || '100%',
      ...otherStyles,
    }
    return (
      <div style={styles} id={id ||'ecahrtsPolyLineTree'} />
    );
  }
}