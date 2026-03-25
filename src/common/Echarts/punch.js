/**
 * online
 */

import React from 'react';
import _ from 'lodash';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import { getByteSize } from 'utils/utils';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import { colorObj } from 'common/colors';

function getTotalNum(n, l) {
  let num = 0;
  l.forEach(i => {
    if (n === i[1]) {
      num += i[2]
    }
  });
  return num;
}

function getNodeSize(n, t) {
  return Math.ceil((n / t) * 30) + 6;
}

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class Punch extends React.Component {
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

  shouldComponentUpdate(nextProps) {
    if(!_.isEqual(nextProps.data, this.props.data) || !_.isEqual(nextProps.heatMapDataY, this.props.heatMapDataY)) {
      return true;
    }
    return false;
  }

  getOption = () => {
    const { heatMapDataX, heatMapDataY, data, valueDesc, punchColor, themeBackground, selectedTheme, tooltip } = this.props;
    const { labelColor, backgroundColor, splitLineColor } = this.state;
    const middleBg = themeBackground ? themeBackground[selectedTheme] : backgroundColor;
    const option = {
      backgroundColor: middleBg,
      tooltip: tooltip || {
        position:'top',
        formatter: (params) => {
          return (valueDesc || 'IP流量分布值') + '：' + getByteSize(params.value[2]);
        },
      },
      grid:{
        left:2,
        bottom:30,
        right:50,
        containLabel: true,
      },


      xAxis:{
        type:'category',
        data:heatMapDataX,
        boundaryGap:false,
        splitLine:{
          show:true,
          lineStyle:{
            color: splitLineColor,
            type:'dashed',
          },
        },
        axisLine:{
          show:false,
        },
        axisLabel:{
          textStyle:{
            color: labelColor,
          },
        },
      },
      yAxis:{
        type:'category',
        data:heatMapDataY,
        splitLine:{
          show:true,
          lineStyle:{
            color: splitLineColor,
            type: 'dashed',
          },
        },
        axisLine:{
          show:false,

        },
        axisLabel:{
          rotate:45,
          textStyle:{
            color: labelColor,
          },
        },
      },
      series:[{
        name:'Punch',
        type:'scatter',
        color: punchColor || '#00f0ff',
        symbolSize: (val) => {
          const num = getTotalNum(val[1], data)
          if(val[2] === 0) return 0;
          return getNodeSize(val[2], num);
        },
        data,
        animationDelay: (idx) => {
          return idx * 5;
        },
      }],
    }
    return option;
  }

  render() {
    const { style, isData, onEvents, children } = this.props;

    return (
      <div>
        {children}
        {isData === 1 ? (
          <ReactEcharts
            notMerge
            lazyUpdate
            option={this.getOption()}
            onEvents={onEvents || {}}
            style={style || {}}
          />):(<div style={{width:260, height: 260}} className='noDataPng' />)
        }
      </div>
    );
  }
}
