import React, { Component } from 'react';
import * as echarts from 'echarts';
import moment from 'moment';
import config from 'utils/config';
import _ from 'lodash';

const defaultxAxis = {
  min: 0,
  max: 24,
}

const defaultyAxis = {
  title: '',
  unit: '',
}

const defaultStyles = {
  width: '100%',
  height: '500px',
}

export default class OnlineStatusChart extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || [],
      xAxis: props.xAxis || defaultxAxis,
      yAxis: props.yAxis || defaultyAxis,
      otherStyels: props.otherStyles || defaultStyles,
    }
    this.chartRef = React.createRef();
    this.chartInstance = null;
  }

  componentDidMount(){
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data) || !_.isEqual(this.props.xAxis, nextProps.xAxis) || !_.isEqual(this.props.yAxis, nextProps.yAxis) || !_.isEqual(this.props.otherStyles, nextProps.otherStyles)) {
      this.setState({
        data: nextProps.data || [],
        xAxis: nextProps.xAxis || defaultxAxis,
        yAxis: nextProps.yAxis || defaultyAxis,
        otherStyles: nextProps.otherStyles || defaultStyles,
      }, () => {
        this.initChart();
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }

  handleResize = () => {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }

  generateSeriesData = () => {
    const { data } = this.state;
    const finalData = [];
    if (!_.isEmpty(data)) {
      data.map((user, yIndex) => {
        const peruidsData = user.periods || [];
        if (!_.isEmpty(peruidsData)) {
          for(const core of peruidsData) {
            const obj = {
              value: [yIndex, core[0], core[1], user.color],
              name: user.name,
            }
            finalData.push(obj);
          }
        }
      })
    }
    return finalData;
  }

  handleTransTimeStampToTimeStr = (timeStamp, formatStr) => {
    if (String(timeStamp).length < 13) {
      return moment(timeStamp * 1000).format(formatStr);
    } else {
      return moment(timeStamp).format(formatStr);
    }
  }

  getOption = () => {
    const { barHeight, customToolTip, } = this.props;
    const { xAxis, yAxis, data } = this.state;
    let yAxisName = '';
    if (yAxis.title) {
      yAxisName = yAxis.title;
    }
    if (yAxis.unit) {
      yAxisName = `${yAxisName} ${yAxis.unit}`;
    }
    return {
      title: this.props.title ? this.props.title : '',
      tooltip: {
        formatter: params => {
          if (customToolTip) {
            return customToolTip(params);
          } else {
            return `小区${params.name} : ${this.handleTransTimeStampToTimeStr(params.value[1], 'YYYY-MM-DD HH:mm:ss')} - ${this.handleTransTimeStampToTimeStr(params.value[2], 'YYYY-MM-DD HH:mm:ss')} 活跃`;
          }
        }
      },
      xAxis: {
        type: 'value',
        min: xAxis.min,
        max: xAxis.max,
        name: '',
        axisLabel: {
          color: "#FFFFFF",
          formatter: val => `${this.handleTransTimeStampToTimeStr(val, 'YYYY-MM-DD HH:mm:ss')}`,
        },
        splitLine: {
          show: false,
          lineStyle:  {
            color: '#EEEEEE',
            width: 1,
          }
        },
        axisLine: {
          show: true,
          lineStyle:  {
            color: '#FFFFFF',
            width: 2,
          }
        },
      },
      yAxis: {
        type: 'category',
        data: data.map(user => user.name),
        name: yAxisName,
        axisLine: {
          show: true,
          lineStyle:  {
            color: '#FFFFFF',
            width: 2,
          }
        },
        axistick: {
          show: false,
        }
      },
      series: [
        {
          type: 'custom',
          renderItem: (params, api) => {
            const yIndex = api.value(0);
            const start = api.value(1);
            const end = api.value(2);
            const color = api.value(3);
            const yPos = api.coord([0, yIndex])[1];
            const xStart = api.coord([start, 0])[0];
            const xEnd = api.coord([end, 0])[0];

            const barHeight = this.props.barHeight || 28;
            const borderRadius = 6;
            return {
              type: 'rect',
              shape: {
                x: xStart,
                y: yPos - barHeight/2,
                width: xEnd - xStart,
                height: barHeight,
                r: borderRadius,
              },
              style: {
                fill: color,
                shadowColor: color,
                shadowBlur: 8,
                shadowOffsetY: 2,
              },
              emphasis: {
                style: {
                  fill: echarts.color.lift(color, 0.3)
                }
              }
            }
          },
          data: this.generateSeriesData(),
        }
      ]
    }
  }

  initChart = () => {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
    const dom = document.getElementById(this.props.id || 'chartsBox');
    if (dom) {
      this.chartInstance = echarts.init(dom);
      this.updateChart();
    }
  }

  updateChart = () => {
    if (this.chartInstance) {
      this.chartInstance.setOption(this.getOption(), true);
    }
  }

  handleSaveAsPng = () => {
    const { saveName } = this.props;
    if (this.chartInstance) {
      setTimeout(() => {
        const picInfo = this.chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 1.5,
          backgroundColor: '#071530',
        })
        const elink = document.createElement('a');
        elink.download = saveName || '在线状态';
        elink.style.display = 'none';
        elink.href = picInfo;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href);
        document.body.removeChild(elink);
      }, config.timerInterval_5);
    }
  }

  render() {
    const { otherStyles } = this.props;
    return (
      <div
        id={this.props.id || 'chartsBox'} style={otherStyles}
      />
    )
  }
}
