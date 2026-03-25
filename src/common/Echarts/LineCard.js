import React, { Component, Fragment } from 'react';
import { ExportOutlined, LineChartOutlined } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Card, Spin, Table, Dropdown, Menu } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Line from 'common/Echarts/Line';
import exportExcel from 'common/exportDataToExcel';
import './index.less';

export default class LineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeFlag: props.isDrawer ? false : true,
    };
  }

  componentDidMount () {
    const { title, eventText, header } = this.props;
    exportExcel.exportDataToExcel(eventText,
    `${title}-${moment().format("YYYY-MM-DD")}`,
    this.exportData(),
    header,
    header)
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.lineFlowData, nextProps.lineFlowData)) {
      exportExcel.exportDataToExcel(nextProps.eventText,
        `${nextProps.title}-${moment().format("YYYY-MM-DD")}`,
        this.exportData(nextProps),
        nextProps.header,
        nextProps.header)
    }
  }

  exportData = (nextProps) => {
    const data = [];
    const { header = [], lineFlowData = {}, unit } = nextProps || this.props;
    const dataSource = this.toTableData(lineFlowData.xdate, lineFlowData.innerList, unit);
    dataSource.forEach(item => {
      data.push({[header[0]]: item.time, [header[1]]: item.value});
    });
    return data;
  }

  exportExcel = () => {
    const { eventText } = this.props;
    if(window[eventText]) {
      window[eventText]()
    }
  }

  onMenuClick = (e) => {
    const { changeFlag } = this.state;
    const { lineFlowData, isShowDataView, isShow, style = {}, color, unit, tool, lineClick,
     isPlug, markLine, data, isDrawer, showChartContent, ...otherProps } = this.props;
    const initData = lineFlowData || {};
    const LineProps = {
      style,
      color,
      unit,
      tool,
      isShowDataView,
      isLegendShow: isShow,
      handleClick: lineClick,
      xdata: initData.xdate || [],
      ydata: initData.innerList || [],
      isPlug,
      markLine,
      ...otherProps,
    }
    if(e.key === 'change') {
      if(isDrawer) {
        this.props.showChartContent(true, {...LineProps});
      } else {
        this.setState({changeFlag: !changeFlag})
      }
    }
    if(e.key === 'export') {
      this.exportExcel();
    }
  }

  chartContent = () => {
    const { lineFlowData, isShowDataView, isShow, style = {}, color, unit, tool, lineClick,
     isPlug, markLine, data, ...otherProps } = this.props;
    const initData = lineFlowData || {};
    const LineProps = {
      style,
      color,
      unit,
      tool,
      isShowDataView,
      isLegendShow: isShow,
      handleClick: lineClick,
      xdata: initData.xdate || [],
      ydata: initData.innerList || [],
      isPlug,
      markLine,
      ...otherProps,
    }
    return (
      <div style={{width: 600}}>
        <Line {...LineProps} />
      </div>
    );
  }

  allDropdown = () => {
    const { changeFlag } = this.state;
    const { isDrawer, disabledExportButton } = this.props;
    return (
      <Menu onClick={(e) => this.onMenuClick(e)}>
        <Menu.Item key='change'>
          {isDrawer ? (
            <span><LineChartOutlined /> 图表展示</span>
          ) : (
            <span><LegacyIcon type={changeFlag ? 'table' : 'line-chart'} /> {changeFlag ? '表格展示' : '图表展示'}</span>
          )}
        </Menu.Item>
        {!disabledExportButton && (
          <Menu.Item key='export'>
            <span><ExportOutlined /> 导出</span>
          </Menu.Item>
        )}
      </Menu>
    );
  }

  createExtraButton = () => {
    const { changeFlag } = this.state;
    const { extraButton, extraSearch, isDrawer, disableMenu } = this.props;
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        {isDrawer ? (<div>{extraSearch}</div>) : !changeFlag && extraSearch && (<div>{extraSearch}</div>)}
        {extraButton}
        {disableMenu?'':(
          <Dropdown trigger={['click']} overlay={this.allDropdown()}>
            <svg className='icon' width='100%' height='100%' style={{cursor:'pointer'}}>
              <use xlinkHref='#icon-gengduo' />
            </svg>
          </Dropdown>
        )}
      </div>
    )
  }

  toTableData = (xdata, ydata, unit) => {
    if(!xdata || !ydata) return [];
    const data = []
    xdata.forEach((item, index) => {
      data.push({time: item, value: ydata[0] && ydata[0].data ? (ydata[0].data[index]?ydata[0].data[index]:'0.00') + (unit || '') : '', key: index})
    });
    return data;
  }

  render() {
    const { changeFlag } = this.state;
    const { title, CardStyle, lineFlowData, cardProps,
      isShowDataView, isShow, style = {}, color, unit, tool, lineClick, extraButton, dataZoomIsShow, dataZoomHeight, creatTooltip, seriesOpacity,
      columns, isPlug, markLine,  data, isHideTitle, isDrawer, boundaryGap, xRotate, chartType, ...otherProps } = this.props;
    const initData = lineFlowData || {};
    const LineProps = {
      style,
      color,
      unit,
      tool,
      xRotate,
      chartType,
      boundaryGap,
      dataZoomIsShow,
      dataZoomHeight,
      creatTooltip,
      isShowDataView,
      isLegendShow: isShow,
      handleClick: lineClick,
      xdata: initData.xdate || [],
      ydata: initData.innerList || [],
      isPlug,
      markLine,
      seriesOpacity,
      ...otherProps,
    }
    let className = '';

    if(this.props.className) {
      className = this.props.className;
    }
    const dataSource = this.toTableData(initData.xdate, initData.innerList, unit);
    return (
      <Fragment>
        <Card
          extra={this.createExtraButton()}
          title={isHideTitle ? '' : title || "系统元数据统计"}
          type="inner"
          style={CardStyle || {marginBottom:'24px'}}
          className={className}
          bordered={false}
          {...cardProps}
        >
          <Spin spinning={false}>
            {isDrawer ? (
              (lineFlowData && lineFlowData.xdate && lineFlowData.xdate.length > 0) ? (
                <div>
                  <div>
                    <Table dataSource={data || dataSource || []} rowKey='time' columns={columns || [{title:'时间',dataIndex:'time', width: '50%'}, {title:'流量', dataIndex:'value', width: '50%'}]} scroll={{y: window.innerHeight - 210}} pagination={false} />
                  </div>
                </div>
              ) : (
                <div className='noDataPng' />
              )
            ) : (
              (lineFlowData && lineFlowData.xdate && lineFlowData.xdate.length > 0) ? (
                <div>
                  {changeFlag && <Line {...LineProps} />}
                  {!changeFlag && (
                  <div style={style}>
                    <Table dataSource={data || dataSource || []} rowKey='time' columns={columns || [{title:'时间',dataIndex:'time', width: '50%'}, {title:'流量', dataIndex:'value', width: '50%'}]} scroll={{y: style.height - 38}} pagination={false} />
                  </div>)}
                </div>
              ) : (
                <div className='noDataPng' />
              )
            )}

          </Spin>
        </Card>
      </Fragment>
    );
  }
}
