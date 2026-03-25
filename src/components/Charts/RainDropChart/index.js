import React, { PureComponent } from 'react';
import * as echarts from 'echarts';
import 'echarts-liquidfill';
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
    const { id, grid, diameter, center, data, backgroundStyle, labelOption, outlineOption, colorOptions = {}, customOptions } = props;
    const container = document.getElementById(id || 'ecahrtsRainDropChart');
    myChart = echarts.init(container);
    let mainOptions = {
      grid: grid || {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: true,
      },
      series: [{
        type: 'liquidFill',
        // shape(string) 波浪形状,可以设置为"circle","rect","roundRect","triangle","diamond","pin","arrow"或者svg路径
        shape: "circle",
        // radius(string) 图的半径,可以设置为百分比如'50%'或者像素值"50px"
        radius: diameter || '97.1%',
        // center(string[]) 图的位置,第一个值为横坐标,第二个值为纵坐标,可设置为百分比如"50%"或者像素值"100px" 
        center: center || ['50%', '50%'],
        // color(string[]) 波浪颜色
        color: colorOptions.mainColor || ['#DAD44A'],
        // data 数值项的值,介于0~1之间
        data: data || [],
        backgroundStyle: backgroundStyle || {
          borderColor: colorOptions.bgBorderColor || '#DAD44A',
          borderWidth: 2,
          color: colorOptions.bgColor || 'transparent'
        },
        outline: outlineOption || {
          borderDistance: 5,
          itemStyle: {
            borderColor: colorOptions.outlineBorderColor || '#DAD44A',
            borderWidth: 1,
          }
        },
        label: labelOption || {
          show: true,
          formatter: `${(Math.round(data[0] * 100))}%`,
          color: colorOptions.labelColor || '#fff',
          fontSize: 16,
          fontWeight: 400,
          padding: [0, 0, -6, 0],
          align: 'center',
          baseline: 'bottom',
          position: 'inside'
        },
        // phase(number) 波浪的相位
        phase: 0,
        // period(number|'auto'|| function) 向前移动一个波长所需的毫秒数
        period: 4000,
        // waveLength(string|number) 波浪的长度，可设置为百分比如"100%"或者像素值"100px"
        waveLength: '100%',
        // amplitude(number) 波浪的振幅,可以设置为像素值活百分比,其中百分比是相对图的直径
        // amplitude: "8%",
        // 波浪滚动的方向
        // direction: "right",
        // waveAnimation(boolean) 是否开启波浪动画
        // waveAnimation: true,
        // animationDuration(number) 动画持续时间，单位为毫秒
        animationDuration: 0,
        // animationDurationUpdate(number) 数据更新动画持续时间
        animationDurationUpdate: 2000,
        // animationEasing(string) 当波浪从底部开始上升时，初始化动画的简化方法
        // animationEasing: "linear",
        // animationEasingUpdate(string) 其他动画的简化方法，例如，当数据改变以及波位改变时
        animationEasingUpdate: 'cubicOut',
      }]
    };
    if (customOptions) {
      mainOptions = customOptions;
    }
    myChart.setOption(mainOptions);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.grid, nextProps.grid) || !_.isEqual(this.props.diameter, nextProps.diameter) || !_.isEqual(this.props.center, nextProps.center) || this.props.selectedTheme !== nextProps.selectedTheme || !_.isEqual(this.props.data, nextProps.data) || !_.isEqual(this.props.backgroundStyle, nextProps.backgroundStyle) || !_.isEqual(this.props.labelOption, nextProps.labelOption) || !_.isEqual(this.props.outlineOption, nextProps.outlineOption) || !_.isEqual(this.props.colorOptions, nextProps.colorOptions) || !_.isEqual(this.props.customOptions, nextProps.customOptions)) {
      this.initChart(nextProps);
    }
  }

  componentWillUnmount() {
    this.myChart = null;
  }
  
  render() {
    const { width, height, otherStyles={}, id } = this.props;
    const styles={
      width: width || '100%',
      height: height || '100%',
      ...otherStyles,
    }
    return (
      <div style={styles} id={id ||'ecahrtsRainDropChart'} />
    );
  }
}