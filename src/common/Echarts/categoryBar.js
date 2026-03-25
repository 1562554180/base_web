import React, { PureComponent } from 'react'
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
import moreBtn from 'assets/moreBtn.png';
import ReactEcharts from 'echarts-for-react';
import exportExcel from 'common/exportDataToExcel';
import { colorObj } from 'common/colors';
import { lineDataChange } from './utils';


@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class CategoryBar extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      changeFlag: true,
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

  toTableData = (xdata, ydata, unit) => {
    if(!xdata || !ydata) return [];
    const data = []
    xdata.forEach((item, index) => {
      data.push({time: item, value: ydata[0] && ydata[0].data ? ydata[0].data[index] + unit : '', key: index})
    });
    return data;
  }

  exportData = (nextProps) => {
    const data = [];
    const { header = [], xdata = [], ydata, unit } = nextProps || this.props;
    const dataSource = this.toTableData(xdata, ydata, unit);
    dataSource.forEach(item => {
      data.push({[header[0]]: item.time, [header[1]]: item.value});
    });
    return data;
  }

  getOption = () => {
    const { isShowDataZoom, isSpliceTooltiop, isLegendShow, unit, color, tooltipIsShow, xdata, ydata,
      createTooltipText, dataType, grid, themeBackground, selectedTheme } = this.props;
    const { labelColor, lineColor, legendColor, backgroundColor, zoomLabelColor, splitLineColor } = this.state;
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
      yAxis: {
        type: 'category',
        // axisLabel: {
        //   rotate: rotate === undefined ? -40 : rotate,
        //   formatter(value) {
        //     if(isEllipsis && value.length > 7){
        //       return value.slice(0,7) + '...';
        //     } else{
        //       return value;
        //     }
        //   },
        // },
        axisLine: {
          lineStyle: {
            color: lineColor,
          },
        },
        axisLabel: {
          textStyle: {
            color: labelColor,
          },
        },
        data: xdata || [],
      },
      xAxis: [
        {
          type: 'value',
          name: unit || 'bps',
          splitLine:{
            show:true,
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
          axisLabel: {
            textStyle: {
              color: labelColor,
            },
          },
        },
      ],

      series: lineDataChange(ydata, null, 'bar', null),
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
      color: color || '#00f0ff',
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
    if(window[this.props.eventText]) {
      window[this.props.eventText]()
    }
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
    const { handleClick, style, xdata = [], ydata = [], unit, title, columns, header, eventText } = this.props;
    const onEvents = {};
    if(handleClick){
      onEvents.click = handleClick;
    }
    const dataSource = this.toTableData(xdata, ydata, unit);
    exportExcel.exportDataToExcel(eventText,
      `${title}-${moment().format("YYYY-MM-DD")}`,
      this.exportData(),
      header,
      header)

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
          ) : (<div style={{width:260, height: 260}} className='noDataPng' />)}
      </div>
    );
  }
}
