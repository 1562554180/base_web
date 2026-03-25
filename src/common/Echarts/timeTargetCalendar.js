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
import Echarts from 'components/Charts/Echarts';

export default class Bar extends PureComponent {
  getOption = () => {
    const { data=[], hours=[], days=[], max, isShowPercent, handleCustomToolTip, customGrid, unit, selectedTheme, customInRange, customAutoSizeMargin } = this.props;
    const newHours = hours.map((text) => {
       return moment(parseInt(text,10)*1000).format("MM-DD HH:mm");
     })
    let autosizeMargin = '30%';
    const length = days.length || 1;
    if (length < 7 || length === 7) {
      autosizeMargin = '3%';
    } else if (length > 7 && length < 20) {
      autosizeMargin = '20%';
    } else if (length > 20) {
      autosizeMargin = '40%';
    }
    if (customAutoSizeMargin) {
      autosizeMargin = customAutoSizeMargin;
    }
    const option = {
      grid: customGrid || {
        height: "50%",
        left: "6%",
        top: length > 7 ? '3%' : '8%',
        bottom: "10%",
        right: "3%",
      },
      // backgroundColor: '#19325a',
      backgroundColor: `${window.selectedTheme === 'highlight' ? '#173690' : 'transparent'}`,
      textStyle:{
        // color:'white',
        color:`${selectedTheme === 'highlight' ? '#173690' :'#FFFFFF'}`,
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
        hidedelay: 2000,
        formatter: (pointObj)=>{
          if(pointObj.data){
            if (handleCustomToolTip) {
              return handleCustomToolTip(pointObj);
            } else {
              return `<span style='width:50px;display:inline-block;letter-spacing:20px'>数量</span>：${isShowPercent ? pointObj.data[3] : pointObj.data[2]} </br> ${isShowPercent ? `<span style='width:50px;display:inline-block;letter-spacing:3px'>正确率</span>：${pointObj.data[2]} %` : ''}</br> <span style='width:50px;display:inline-block;letter-spacing:20px'>时间</span>：${newHours[pointObj.value[0]]}`;
            }
          } else {
            return '';
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
        name: unit || '',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: "bold",
          fontSize: 12,
          padding: [0, 0, -10, 0],
        },
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
          // color: 'white',
          color:`${selectedTheme === 'highlight' ? '#173690' :'#FFFFFF'}`,
        },
        inRange: {
          color: customInRange || ['#21202e', '#5a6ac1', '#4caf50', '#ffeb3b', '#ec230c'],
        },
      },
      series: [{
        name:"SNR",
        type:'heatmap',
        progressive: 0,
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
    const { handleClick, style, title, id, data } = this.props;
    const onEvents = {};
    if(handleClick) {
      onEvents.click = handleClick;
    }
    return (
      <div style={{ position: 'relative' }}>
        <h4 style={{padding:10,borderBottom:'0px solid #48566e',textAlign:'center',marginTop:'15px'}}>{title}</h4>
        <Echarts id={id} data={data} options={this.getOption()} width='calc(100% - 10px)' otherStyles={{...style, minHeight: 250}} />
      </div>
    );
  }
}
