/**
 * online
 */
import React, { PureComponent } from 'react'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import moment from 'moment';
import ReactEcharts from 'echarts-for-react'

export default class Bar extends PureComponent {
  getOption = () => {
    const { data=[], hours=[], days=[], max, isShowPercent } = this.props;
    const newHours = hours.map((text) => {
       return moment(parseInt(text,10)*1000).format("MM-DD HH:mm");
     })
    let autosizeMargin = '30%';
    const length = days.length || 1;
    if (length < 7 || length === 7) {
      autosizeMargin = '10%';
    } else if (length > 7) {
      autosizeMargin = '35%';
    }
    const option = {
      grid:{
        height: "50%",
        left: "6%",
        top: length > 7 ? '3%' : '8%',
        bottom: "10%",
        right: "3%",
      },
      backgroundColor: '#19325a',
      textStyle:{
        color:'white',
      },
      title: {
        show: false,
        textStyle: {
          fontSize: 14,
          align: 'center',
          color: '#ccc',
        },
      },
      tooltip: {
        // position: 'top',
        formatter: (pointObj)=>{
          if(pointObj.data){
          return `<span style='width:50px;display:inline-block;letter-spacing:20px'>数量</span>：${isShowPercent ? pointObj.data[3] : pointObj.data[2]} </br> ${isShowPercent ? `<span style='width:50px;display:inline-block;letter-spacing:3px'>正确率</span>：${pointObj.data[2]} %` : ''}</br> <span style='width:50px;display:inline-block;letter-spacing:20px'>时间</span>：${newHours[pointObj.value[0]]}`;
          }
        },
      },
      animation: false,
      xAxis: {
        type: 'category',
        data: newHours,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        // name: unit || '',
        data: days,
        axisLabel: {
          interval: 0,
        },
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        // show: length > 1,
        show: true,
        min: 0,
        max:max || 50,
        formatter: '{value}',
        itemHeight: 350,
        calculable: true,
        splitNumber: 5,
        orient: 'horizontal',
        left: 'center',
        bottom: autosizeMargin,
        textStyle: {
          color: 'white',
        },
        color:['#ec230c','#ffeb3b','#4caf50','#5a6ac1'],
      },
      series: [{
        name:"SNR",
        type:'heatmap',
        data,
        itemStyle:{
          emphasis:{
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
      }],
    }
    return option;
  }

  render() {
    const { handleClick, style, title, unit, days=[] } = this.props;
    const onEvents = {};
    if(handleClick) {
      onEvents.click = handleClick;
    }
    return (
      <div style={{ position: 'relative' }}>
        <h4 style={{padding:10,borderBottom:'0px solid #48566e',textAlign:'center'}}>{title}</h4>
        <div style={{ position: 'absolute', left: 17, top: days.length === 1 ? 27 : 42, fontWeight: 'bold', zIndex: 100 }}>{unit || ''}</div>
        <ReactEcharts
          notMerge
          lazyUpdate
          option={this.getOption()}
          onEvents={onEvents}
          style={{...style, minHeight: 200}}
        />
      </div>
    );
  }
}
