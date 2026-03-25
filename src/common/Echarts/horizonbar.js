/**
 * online
 */
import React, { PureComponent } from 'react'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import { colorObj } from 'common/colors';


const myColors = [ '#69d169', '#00fdff', '#e779d1', '#e38641', '#a83ef9', '#d4ca5b', '#af6161', '#94ec79', '#585fdb', '#d9626a', '#4684d0', '#fefab6', '#c988d3', '#43a3eb', '#eea269', '#5d3ef9', '#54b4c2', '#b3ffb7', '#ffa5c3', '#8bc1fd']
const newColors = [];
myColors.forEach(item => {
  newColors.unshift(item)
})

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class Horizonbar extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      ...this.initBaseState(props),
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.selectedTheme !== nextProps.selectedTheme) {
      const state = this.initBaseState(nextProps);
      this.setState(state)
    }
  }

  initBaseState = (props) => {
    const { selectedTheme } = props;
    const state = colorObj.chartColor[selectedTheme ||'default'];
    return state;
  }

  getOption = () => {
    const { isLegendShow, unit, tooltipIsShow, xdata, ydata, createTooltipText,
      dataType, grid, themeBackground, selectedTheme } = this.props;
    const { labelColor, lineColor, legendColor, backgroundColor, splitLineColor } = this.state;

    const option = {
      backgroundColor: themeBackground[selectedTheme] || backgroundColor,
      grid: grid || {
        left:'30px',
        right: '50px',
        bottom: '80px',
        top: '50px',
      },
      tooltip: {
        trigger: 'axis',
        show: tooltipIsShow,
        formatter(params) {
          if(createTooltipText) return createTooltipText(params, unit, dataType);
          return (params[0].marker + " 流量为: " + params[0].data + unit);
        },
      },
      legend: {
        x: 'center',
        y: '10px',
        show: isLegendShow,
        textStyle: {
          color: legendColor,
        },
      },
      xAxis: {
        type: 'value',
        name: unit || '',
        axisLabel: {
          rotate: -40,
        },
        splitLine:{
          lineStyle:{
            color: splitLineColor,
            type:'solid',
          },
        },
        maxWidth: 20,
        axisLine: {
          lineStyle: {
            color: lineColor,
          },
        },
      },
      yAxis: [
        {
          type: 'category',
          splitLine:{
            show: false,
            lineStyle:{
              color: splitLineColor,
              type:'solid',
            },
          },
          axisLine: {
            lineStyle: {
              color: lineColor,
            },
          },
          axisLabel: {show: false},
          data: xdata,
        },
      ],

      series: [{
        // name: '11111',
        type: 'bar',
        barWidth: 22,
        itemStyle: {
          normal: {
            barBorderRadius: 22,
          },
        },
        label: {
          normal: {
            show: true,
            color: labelColor,
            formatter: (item) => {
              return item.name || ''
            },
          },
        },
        data: ydata[0] ? ydata[0].data : [],
      }],
      // color: color || '#00f0ff',
      // color: ['red', 'blue'],
      color: (params) => {
        const num = myColors.length;
        return newColors[params.dataIndex % num]
      },

    }
    return option;
  }

  render() {
    const { handleClick, style, xdata = [], ydata = [], title } = this.props;
    const onEvents = {};
    if(handleClick) {
      onEvents.click = handleClick;
    }
    return (
      <div>
        {title && <h4 style={{padding:10,borderBottom:'1px solid #48566e'}}>{title}</h4>}
        {xdata.length > 0 && ydata.length > 0 ? (
          <ReactEcharts
            notMerge
            lazyUpdate
            option={this.getOption()}
            onEvents={onEvents}
            style={style}
          />):(<div style={{width:260, height: 260}} className='noDataPng' />)
        }
      </div>
    );
  }
}
