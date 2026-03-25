import React, { PureComponent } from 'react';
import * as echarts from 'echarts';
import config from 'utils/config';
import _ from 'lodash';

let myChart = null;

export default class EchartsHeatMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state={

    }
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    const { data } = this.props;
    if (!_.isEmpty(data)) {
      this.initChart(this.props);
    }
  }

  initChart = (props) => {
    const { id, options, data, xData, yData, chartName, customPieces, legendTextColor, yLineColor, yTextColor, xLineColor, xTextColor, selectedTheme } = props;
    const container = document.getElementById(id || 'ecahrtsHeatMap');
    myChart = echarts.init(container);
    let commonColor = '#FFFFFF';
    if (selectedTheme === 'highlight') {
      commonColor = '#012032';
    }
    let grid = {
      height: '90%',
      top: '5%',
      bottom: '5%'
    }
    if (yData.length < 10 && yData.length > 5) {
      grid = {
        height: '75%',
        top: '10%',
        bottom: '15%'
      }
    } else if (yData.length < 5 && yData.length > 1) {
      grid = {
        height: '70%',
        top: '15%',
        bottom: '15%'
      }
    } else if (yData.length == 1) {
      grid = {
        height: '47%',
        top: '28%',
        bottom: '25%'
      }
    }
    let customOptions = {
      tooltip: {
        position: 'top',
        formatter: (pointObj)=>{
          if(pointObj.data){
            if (this.props.customFormatter) {
              return this.props.customFormatter(pointObj.data);
            } else {
              return null;
            }
          }
        },
      },
      grid: grid,
      xAxis: {
        type: 'category',
        data: xData || [],
        axisLine: {
          show: true,
          lineStyle: {
            color: xLineColor || commonColor,
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {
          textStyle: {
            color: xTextColor || commonColor
          }
        },
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: yData || [],
        axisLabel: {
          textStyle: {
            color: yTextColor || commonColor
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: yLineColor || commonColor,
            width: 1,
            type: "solid"
          }
        },
        splitArea: {
          show: true
        }
      },
      visualMap: {
        show: !_.isEmpty(customPieces) ? true : false,
        min: 0,
        max: 1,
        calculable: true,
        splitNumber: 5,
        orient: 'horizontal',
        left: 'center',
        top: '0%',
        itemHeight: 15,
        textStyle: {
          color: legendTextColor || commonColor,
          fontSize: 15
        },
        type: "piecewise",
        pieces: customPieces || []
      },
      series: [
        {
          name: chartName || '',
          type: 'heatmap',
          data: data || [],
          label: {
            show: false
          },
          itemStyle: {
            borderWidth: 0.3,
            borderColor: selectedTheme === 'highlight'? '#071530' : '#FFFFFF'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    if (options) {
      customOptions = options;
    }
    myChart.setOption(customOptions);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data) || !_.isEqual(this.props.xData, nextProps.xData) || !_.isEqual(this.props.yData, nextProps.yData) || this.props.selectedTheme !== nextProps.selectedTheme) {
      this.initChart(nextProps);
    }
  }

  componentWillUnmount() {
    this.myChart = null;
  }

  handleSaveAsPng = () => {
    if (myChart) {
      const picInfo = myChart.getDataURL({
        type: 'png',
        pixelRatio: 1.5,
        backgroundColor: '#071530',
      })
      const elink = document.createElement('a');
      elink.download = '小区在线概览';
      elink.style.display = 'none';
      elink.href = picInfo;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
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
      <div style={styles} id={id ||'ecahrtsHeatMap'} />
    );
  }
}
