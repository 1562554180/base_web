/**
 * online
 */
import React, { PureComponent, Fragment } from 'react'
import {
  Spin,
  Card,
  } from 'antd';
import _ from 'lodash'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'

export default class Line extends PureComponent {
  getOption = () => {
    const { initData, legend, tooltipFormatter } = this.props;
    const legendList = [];
    initData.forEach(item => {
      legendList.push(item.name);
    });
    
    const tooltip = {
      trigger: 'item',
    };
    if (tooltipFormatter) {
      tooltip.formatter = tooltipFormatter;
    }
    const option = {
      tooltip,
      legend: _.isUndefined(legend) ? {
        orient: 'vertical',
        x: 'left',
        y: 'top',
        itemWidth: 12,
        itemHeight: 8,
        padding: [5, 60, 0, 10],
        itemGap: 3,
        data: legendList,
        textStyle: {
          color: '#fff',
        },
      } : legend,
      color: ['#5070dd', '#b6d634', '#0dee20ff','#ff994d','#0ca8df','#ffd10a','#fb628b','#785db0','#3fbe95'],
      series: [{
        type: 'pie',
        radius: '50%',
        // radius: ['30%','88%'],
        // center: ['50%','50%'],
        data: initData,
        itemStyle:{
          shadowBlur: 10,
          sgadiwOffsetX: 0,
          shadowColor: 'rgba(30, 144, 255, 0.5)',
        },
        // lableLine:{
        //   normal: {
        //     show: false,
        //   },
        // },
        label: {
          textStyle: {
            color: '#fff',
          },
          normal:{
            formatter: (ev) => {
              return `${ev.data.name}：(${ev.percent}%)`
            },
          },
        },
      }],
    }
    return option;
  }

  render() {
    const { handleClick, style, extraButton, title, CardStyle } = this.props;
    const onEvents = {};
    if (handleClick) {
      onEvents.click = handleClick;
    }
    return (
      <Fragment>
        <Card extra={extraButton} title={title || "系统元数据统计"} type="inner" style={CardStyle || {marginBottom:'24px'}} bordered={false} className='card_new_border'>
          <Spin spinning={false}>
            <ReactEcharts
              notMerge
              lazyUpdate
              option={this.getOption()}
              style={style}
              onEvents={onEvents}
            />
          </Spin>
        </Card>
      </Fragment>
    );
  }
}
