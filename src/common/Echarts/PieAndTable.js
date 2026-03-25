/**
 * online
 */
import React, { Component } from 'react'
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { ExportOutlined } from '@ant-design/icons';
import { Row, Col, Table, Menu, Card, Dropdown } from 'antd';
import numeral from 'numeral';
import _ from 'lodash';
import exportExcel from 'common/exportDataToExcel';
import { getByteSize } from 'utils/utils';
import moment from 'moment';
import Pie from './Pie';
import './index.less';

let changeFlagModul = false

function totalValue(list) {
  let n = 0;
  (list || []).forEach(item => {
    n += item.value
  });
  return n;
}

export default class PieAndTable extends Component {
  constructor(props) {
    super(props) 
    this.state={
      changeFlag: true,
    }
    this.columns = [
      {title: '协议', dataIndex: 'name', width: '50%'},
      {title: '流量', dataIndex: props.trafficKey || 'traffic_total_size', width: '50%', sorter: (a, b) => a.value - b.value, render: (t) => getByteSize(t)},
    ]
  }

  shouldComponentUpdate(nextProps) {
    if(!_.isEqual(this.props.outData, nextProps.outData) || this.props.title !== nextProps.title || changeFlagModul ) {
      changeFlagModul = false
      return true;
    }
    return false;
  }

  exportData = (nextProps) => {
    const data = [];
    const { outData = [] } = nextProps || this.props;
    outData.forEach(item => {
      data.push({'协议名称': item.name, '流量': getByteSize(item.value)});
    });
    return data;
  }

  handleClick = (item) => {
    const { handleClick, type } = this.props;
    if(handleClick) {
      handleClick(item, type)
    }
  }

  onMenuClick = (e) => {
    const { changeFlag } = this.state;
    if(e.key === 'change') {
      changeFlagModul = true
      this.setState({changeFlag: !changeFlag})
    }
    if(e.key === 'export') {
      const { title } = this.props;
      exportExcel.exportExcelData(`${title}-${moment().format("YYYY-MM-DD")}`, this.exportData(), ['协议名称', '流量'], ['协议名称', '流量'])
    }
  }

  allDropdown = () => {
    const { changeFlag } = this.state;
    const { disabledExportButton } = this.props;
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

  createExtraButton = () => {
    const { changeFlag } = this.state;
    const { extraButton, extraSearch } = this.props;
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        {!changeFlag && extraSearch && (<div>{extraSearch}</div>)}
        {extraButton}
        <Dropdown trigger={['click']} overlay={this.allDropdown()}>
          <svg className='icon' width='100%' height='100%' style={{cursor:'pointer'}}>
            <use xlinkHref='#icon-gengduo' />
          </svg>
        </Dropdown>
      </div>
    )
  }

  renderContend = () => {
    const { changeFlag } = this.state
    const { 
      dblHandleClick, outData, inData, title, style = {}, dblClick, rowKey, isTrafficSize, 
      imgWidth, smallStatus, padding, emptyCard, isHiddenTitle, isHideTable = false, cardClass, pieTableData = [] } = this.props;
    const num = totalValue(inData);
    const columns = [
      {title: '名称',dataIndex: 'name', key: 'name', width: 200},
      {title: '占比', key: 'value', dataIndex: 'value', width: 100,
     render: (text) => {
       if(text / num < 0.00001) return '< 0.001%';
       return <div>{numeral(text/num).format('0.001%')}</div>
     }}];
    if(smallStatus){
      return (
        <div style={{position:'relative'}}>
          {
            changeFlag ?
            (
              <h4 style={{zIndex: 100}}>{title || ''}</h4>
            ) :
            (
              <h4 style={{position:'absolute', left: 2, top: -5, zIndex: 100}}>{title || ''}</h4>
            )
          }
          <div style={{position:'absolute', right: 12, top: -5, zIndex: 100}}>
            {this.createExtraButton()}
          </div>
          {outData && outData.length > 0  && 
            (
              changeFlag ? 
              (
                <Pie style={{...style, width: '100%'}} padding={padding} isTrafficSize={isTrafficSize} dblHandleClick={dblHandleClick} handleClick={this.handleClick} outData={outData} />
              ) : 
              (
                <Table 
                  style={{paddingTop: 28}} 
                  dataSource={outData || []} 
                  columns={this.props.columns || this.columns} 
                  rowKey='name' 
                  scroll={{y: style.height - 40}} 
                  pagination={false}
                />
              )
            )
          }
        </div>
      )
    }
    if(outData && outData.length > 0){
      return (
        <div>
          <Card className={cardClass} extra={title ? this.createExtraButton() : null} title={isHiddenTitle ? '' : title} type="inner">
            {outData && outData.length > 0 && changeFlag && (
              <Row type='flex' justify='space-around'>
                <Col span={(inData && inData.length > 0 && !isHideTable) ? 14 : 24}>
                  <Pie style={{...style, width: '100%'}} padding={padding} isTrafficSize={isTrafficSize} dblHandleClick={dblHandleClick} handleClick={this.handleClick} outData={outData} />
                </Col>
                {(inData && inData.length > 0 && !isHideTable) && (
                <Col span={10} style={{paddingBottom: 5}}>
                  <Table 
                    rowKey={rowKey || 'id'}
                    className='tableStyle' 
                    style={{marginRight:6, marginTop: 12}} 
                    columns={columns} 
                    dataSource={inData.sort((a, b ) => b.value - a.value)} 
                    pagination={false} 
                    scroll={{y: style.height ? style.height - 75 : 305, x: 300}} 
                    onRow={(record)=>{
                      return {
                        onDoubleClick:()=>{
                          if(dblClick) {
                            dblClick(record)
                          }
                        },
                      }
                    }}
                  />
                </Col>)}
              </Row>)}
            {!changeFlag && <Table dataSource={pieTableData || outData || []} columns={this.props.columns || this.columns} rowKey='name' scroll={{y: style.height - 40}} pagination={false} />}
          </Card>
        </div>
      )
    }
    if(emptyCard){
      return (
        <Card extra={title ? this.createExtraButton() : null} className='card_new_border' title={title || ''} type="inner" bordered={false}>
          <div style={{width:imgWidth || 200, height: style.height || 300 }} className='noDataPng' />
        </Card>
      )
    }

    return (<div style={{width:imgWidth || 200}} className='noDataPng' />)
  }

  render() {
    return (
      <div>
        {this.renderContend()}
      </div>
    );
  }
}
