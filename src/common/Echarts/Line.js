import React, { Component } from 'react'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import { connect } from 'dva';
import numeral from 'numeral';
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { colorObj } from 'common/colors';
import { lineDataChange } from './utils';

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class Line extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.initBaseState(props),
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      return true;
    }
    return false;
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

  getDefaultGridLeft = (ydata, yFontSize) => {
    const reg = /^[0-9]*[1-9]*$/;
    const maxList = [];
    let fontSize = yFontSize;
    let yMaxData = '';
    for (const item of ydata) {
      const data = item.data;
      let yMax = 0;
      for(const i of data) {
        if(i.length > yMax) {
          yMax = i;
        }
      }
      maxList.push(yMax);
    }
    for (const i of maxList) {
      if (i.length > yMaxData.length) {
        yMaxData = i;
      }
    }
    if (!reg.test(yMaxData)) {
      fontSize += 4;
      return yMaxData.pxWidth(fontSize);
    } else if (yMaxData < 1000) {
      yMaxData = 10000;
      fontSize += 8;
    } else {
      fontSize += 10;
    }

    return `${numeral(yMaxData).format('0,0')}`.pxWidth(fontSize);
  }

  getOption = () => {
    const {
      ylabeFormat, xdata, isLegendShow, dataZoomIsShow, endData, isPlug, unit, hiddenUnit, tool, ydata, markLine, themeBackground = {}, selectedTheme,
      grid, customTooltip, creatTooltip, dataZoomHeight, xRotate, xInterval,seriesOpacity, showWholeNumber, propsNormalColor, prolegendColor,
      animation, yFontSize = 12, yFontWeight = '', series, boundaryGap, chartType, isShowToolbox, brushType, legendFormat, startData } = this.props;
    const { labelColor, lineColor, normalColor,  legendColor, backgroundColor, zoomLabelColor, splitLineColor, dataZoomFillerBgc, dataZoomBgc, dataZoomLeftRight, dataZoomBorder } = this.state
    const yAxisLabel =  {
      textStyle: {
        color: labelColor,
      },
    };
    const legend = prolegendColor || {
      x: 'center',
      y: '10px',
      show: isLegendShow,
      textStyle: {
        color: legendColor,
      },
    };
    if (ylabeFormat) {
      yAxisLabel.formatter = ylabeFormat;
    }
    if (legendFormat) {
      legend.formatter = legendFormat;
    }

    const option = {
      backgroundColor: themeBackground[selectedTheme] || backgroundColor,
      title: {
        show: false,
        textStyle: {
          fontSize: 14,
          align: 'center',
          color: '#ccc',
        },
      },
      animation: animation || true,
      grid: grid || {
        left: this.getDefaultGridLeft(ydata, yFontSize),
        right: '80px',
        bottom: isPlug ? '130px' : '70px',
        top: '50px',
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          if(creatTooltip){
            return creatTooltip(params, unit)
          } else if (customTooltip) {
            return customTooltip(params)
          } else if (params&&tool&&unit){
            return (params[0].marker + tool + params[0].data + unit);
          } else {
            return null
          }
        },
        axisPointer:{
          type:'cross',
          label:{
            backgroundColor: '#6a7985',
          },
        },
      },
      legend,
      xAxis: {
        type: 'category',
        boundaryGap: boundaryGap || false,
        data: xdata || [],
        axisLabel: {
          interval: xInterval || 'auto',
          rotate: xRotate === 0 ? 0: (xRotate || -50),
          textStyle:{
            color: labelColor,
          },
        },
        splitLine:{
          show: false,
          lineStyle:{
            color: splitLineColor,
            type: 'solid',
          },
        },
        axisLine:{
          lineStyle:{
            color: lineColor,
          },
        },
        splitNumber: 5,
      },
      yAxis: [
        {
          type: 'value',
          name: hiddenUnit ? '' : (unit || 'bps'),
          nameTextStyle: {
            color: labelColor,
            fontSize: yFontSize,
            fontWeight: yFontWeight,
          },
          splitLine:{
            show: true,
            lineStyle:{
              color: splitLineColor,
              type: 'solid',
            },
          },
          axisLine: {
            lineStyle: {
              color: lineColor,
            },
          },
          axisLabel: yAxisLabel,
          minInterval: showWholeNumber ? 1 : null,
        },
      ],
      dataZoom: isPlug ? [
        {
          show: dataZoomIsShow || false,
          realtime: true,
          start: isPlug ? (startData !== null && startData !== undefined ? startData : 90) : 0,
          end: isPlug ? 100 : endData || 100,
          height: dataZoomHeight || 12,
          textStyle:{
            color: zoomLabelColor,
          },
          handleColor: dataZoomLeftRight,
          handleStyle:{
            borderColor: dataZoomBorder,
          },
          fillerColor: dataZoomFillerBgc,
          backgroundColor: dataZoomBgc,
        },
        {
          type: 'inside',
          start: isPlug ? 90 : 0,
          end: isPlug ? 100 : 20,
          textStyle:{
            color: zoomLabelColor,
          },
        },
      ] : null,
      toolbox: isShowToolbox ? {
        feature: {
          brush: {
            type: [brushType || 'none'],
          },
        },
        right: 25,
      } : {show: false},
      brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        brushType: 'lineX',
        brushMode: 'single',
        transformable: false,
        outOfBrush: {
          colorAlpha: 0.1,
        },

      },
      series: series || lineDataChange(ydata, null, (chartType || null), {opacity: seriesOpacity ? 0 : 0.3 }, markLine),
      color: propsNormalColor || normalColor || '#00f0ff',
    }
    return option;
  }

  render() {
    const { handleClick, style, title, echartbrushSelected } = this.props;
    const onEvents = {};
    if (handleClick) {
      onEvents.click = handleClick;
    }
    if (echartbrushSelected) {
      onEvents.brushSelected = echartbrushSelected;
    }
    return (
      <>
        {
          title ? (
            <div>
              <h4 style={{padding:10,borderBottom:'1px solid #48566e'}}>{title}</h4>
              <ReactEcharts
                notMerge
                lazyUpdate
                option={this.getOption()}
                style={style}
                onEvents={onEvents}
              />
            </div>
          ) : (
            <ReactEcharts
              notMerge
              lazyUpdate
              option={this.getOption()}
              style={style}
              onEvents={onEvents}
            />
          )
        }
      </>
    );
  }
}
