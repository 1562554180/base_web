import React, { PureComponent } from 'react'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import _ from 'lodash';

/**
 * 折线图组件
 */

const propsOptions = {
  xAxis: { inverse: true },
}

export default class Linechart extends PureComponent {
  getOption(chartData, isPercent, text, unit, isState, propsOptions) {
    // const { xAxis } = propsOptions;
    const otherXAxis = chartData.xAxis || {};
    const otherYAxis = chartData.yAxis || {};
    const option = {
      legend: chartData.legend,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.xAxisData || [],
        axisLabel: {
          textStyle: {
            color: '#fff',
          },
        },
        ...otherXAxis
      },
      yAxis: chartData.yAxis || {
        name: chartData.unit || '',
        nameTextStyle: {
          color: '#fff',
        },
        type: 'value',
        max: isPercent ? 100 : null,
        axisLabel: {
          formatter: isPercent ? '{value} %' : '{value}',
          textStyle: {
            color: '#fff',
          },
        },
        // position: 'right',
        splitLine: chartData?.splitLine ?  chartData?.splitLine : {
          show: false,
        },
        ...otherYAxis,
      },
      grid: chartData.grid || {
        left: '60px',
        right: '80px',
        bottom: '50px',
        top: '35px',
      },
      tooltip: {
        trigger: 'axis',
        // formatter:(param = {}) => {
        //   const index = param[0].seriesIndex || 0;
        //   const useDisk = chartData.useDisk || [];
        //   const useMem = chartData.useMem || [];
        //   const v = useDisk[index] || '';
        //   const m = useMem[index] || '';
        //   let showText= '';
        //   if(isState === 'disk'){
        //     showText = `磁盘使用 ${v}，使用率 ${param[0].data+  (isPercent ? '%' : unit)}`;
        //   } else if(isState === 'mem') {
        //     showText = `内存使用 ${m}G，使用率 ${param[0].data+  (isPercent ? '%' : unit)}`;
        //   } else {
        //     showText =`${text} ${param[0].data+  (isPercent ? '%' : unit)}`;
        //   }
        //   return `<div>${showText}</div>`
        // }, 
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        ...chartData.tooltip
      },
      dataZoom: chartData?.dataZoom ? [
        {
          type: 'inside',
          start: 50,
          end: 100,
          textStyle: {
            color: '#fff',
          },
        },
        {
          show: true,
          type: 'slider',
          y: '92%',
          start: 50,
          end: 100,
          textStyle: {
            color: '#fff',
          },
          height: 20,
        },
      ] : [],
      series: chartData.series ? chartData.series : [{
        data: chartData.data || [],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          normal: {
            color: '#1890ff',
          },
        },
        itemStyle: {
          normal: {
            color: '#1890ff',
          },
        },
      }],
    }
    return option
  }

  render() {
    const { chartData, isPercent, text, unit, isState, maxHeight, propsOptions, style } = this.props;
    return (
      <ReactEcharts
        option={this.getOption(chartData, isPercent, text, unit, isState)}
        notMerge={true}
        style={{ height: maxHeight || 510, ...style }}
      />
    );
  }
}
