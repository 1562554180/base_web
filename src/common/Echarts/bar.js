/**
 * online
 */
import React, { Component } from 'react'
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { ExportOutlined } from '@ant-design/icons';
import { Table, Dropdown, Menu } from 'antd';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import moment from 'moment';
import { connect } from 'dva';
import _ from 'lodash';
import moreBtn from 'assets/moreBtn.png';
import ReactEcharts from 'echarts-for-react';
import { colorObj } from 'common/colors';
import exportExcel from 'common/exportDataToExcel';
import { lineDataChange } from './utils';

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class Bar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      changeFlag: true,
      ...this.initBaseState(props),
    }
  }

  shouldComponentUpdate(nextProps) {
    if(!_.isEqual(this.props.xdata, nextProps.xdata) || !_.isEqual(this.props.ydata, nextProps.ydata) || !_.isEqual(this.props.series, nextProps.series)) {
      return true;
    }
    if(nextProps.title || this.props.selectedTheme !== nextProps.selectedTheme) {
      return true;
    }
    if (this.props.unit !== nextProps.unit) {
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

  toTableData = (xdata, ydata, unit, series) => {
    if(!xdata || !ydata || _.isEmpty(series)) return [];
    const data = [];
    let seriesData = ydata[0] ? ydata[0].data : [];
    if (seriesData.length === 0 && (series.data && series.data.length > 0)) {
      seriesData = series.data
    }
    xdata.forEach((item, index) => {
      let value = ydata[0] && ydata[0].data ? ydata[0].data[index] + unit : '';
      if (value === '') {
        value = seriesData[index] || '';
      }
      data.push({time: item, value, key: index})
    });
    return data;
  }

  exportData = () => {
    const data = [];
    const { header = [], xdata = [], ydata = [], unit, series } = this.props;
    const dataSource = this.toTableData(xdata, ydata, unit, series);
    dataSource.forEach(item => {
      data.push({[header[0]]: item.time, [header[1]]: item.value});
    });
    return data;
  }

  getOption = () => {
    const { isShowDataZoom, isSpliceTooltiop, isLegendShow, unit, selectedTheme, hiddenUnit,
      tooltipIsShow, xdata, ydata, isEllipsis, createTooltipText, dataType, rotate, grid, themeBackground = {}, showWholeNumber, series, yFormatter, tooltipTextColor = 'red', yNameTextStyle = {}, customToolTipPosition } = this.props;
    const { labelColor, lineColor, legendColor, backgroundColor, zoomLabelColor, splitLineColor, barColor } = this.state

    const option = {
      backgroundColor: themeBackground[selectedTheme] || backgroundColor,
      grid: grid || {
        left:'90px',
        right: '50px',
        bottom: '120px',
        top: '50px',
      },
      tooltip: isSpliceTooltiop ? {
        trigger: 'axis',
      } : {
        trigger: 'axis',
        show: tooltipIsShow,
        position: customToolTipPosition || 'inside',
        formatter(params) {
          if(createTooltipText) return createTooltipText(params, unit, dataType);
          return (params[0].marker + " 流量为: " + params[0].data + unit);
        },
        textStyle: {
          color: tooltipTextColor,
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
        type: 'category',
        axisLabel: {
          rotate: rotate === undefined ? -40 : rotate,
          formatter(value) {
            if(isEllipsis && value.length > 7){
              return value.slice(0,7) + '...';
            } else{
              return value;
            }
          },
          textStyle: {
            color: labelColor,
          },
          minInterval: showWholeNumber ? 1 : 0,
        },
        axisLine: {
          lineStyle: {
            color: lineColor,
          },
        },
        data: xdata || [],
      },
      yAxis: [
        {
          type: 'value',
          name: hiddenUnit ? '' : (unit || 'bps'),
          nameTextStyle: {...yNameTextStyle, color: labelColor},
          minInterval: showWholeNumber ? 1 : null,
          splitLine:{
            show:true,
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
          axisLabel: {
            textStyle: {
              color: labelColor,
            },
            formatter: yFormatter ? (a, b, c) => {
              return yFormatter(a, b, c);
            } : null,
          },
        },
      ],

      series: series || lineDataChange(ydata, null, 'bar', null),
      dataZoom: isShowDataZoom ? [
        {
          show: true,
          start: 90,
          end: 100,
          textStyle:{
            color: zoomLabelColor,
          },
          height: 26,
        },
        {
          type: 'inside',
          start: 90,
          end: 100,
          textStyle:{
            color: zoomLabelColor,
          },
        },
    ] : null,
      color: barColor,
    }
    return option;
  }

  changeBarTable = () => {
    const { changeFlag } = this.state;
    this.setState({
      changeFlag: !changeFlag,
    })
  }

  exportExcel = () => {
    const { title, header } = this.props;
    exportExcel.exportExcelData( `${title}-${moment().format("YYYY-MM-DD")}`, this.exportData(), header, header)
  }

  onMenuClick = (e) => {
    if(e.key === 'change') {
      this.changeBarTable();
    }
    if(e.key === 'export') {
      this.exportExcel();
    }
  }

  allDropdown = () => {
    const { changeFlag, disabledExportButton } = this.state;
    return (
      <Menu onClick={(e) => this.onMenuClick(e)}>
        <Menu.Item key='change'>
          <span><LegacyIcon type={changeFlag ? 'table' : 'line-chart'} /> {changeFlag ? '表格展示' : '图表展示'}</span>
        </Menu.Item>
        <Menu.Item key='export'>
          {!disabledExportButton && (
            <span><ExportOutlined /> 导出</span>
          )}
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { changeFlag } = this.state
    const { handleClick, style, xdata = [], ydata = [], unit, title, columns, noDataStyle = {width: 200, height: 200}, series } = this.props;
    const onEvents = {};
    if(handleClick){
      onEvents.click = handleClick;
    }
    const dataSource = this.toTableData(xdata, ydata, unit, series);

    return (
      <div>
        {title && (
          <div style={{padding:3,borderBottom:'1px solid #48566e'}}>
            <span style={{lineHeight:'32px',marginLeft:'16px'}}>{title}</span>
            <Dropdown trigger={['click']} overlay={this.allDropdown()}>
              <img src={moreBtn} style={{cursor:'pointer', width: 18, height: 16, margin: '8px 10px 0px 6px', float: 'right'}} />
            </Dropdown>
          </div> )}
        {xdata.length > 0 ? (
          <div>
            {changeFlag && (
              <ReactEcharts
                notMerge
                lazyUpdate
                option={this.getOption()}
                onEvents={onEvents}
                style={style}
              />)
            }
            {!changeFlag && <Table dataSource={dataSource} rowKey='key' columns={columns || [{title:'IP', dataIndex:'time'}, {title:'流量', dataIndex:'value'}]} scroll={{y:style.height-38}} pagination={false} />}
          </div>
          ) : (<div style={noDataStyle} className='noDataPng' />)}
      </div>
    );
  }
}
