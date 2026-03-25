import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';

import Modal from 'utils/modal';
import { Tag, Row, Col } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import * as localization from 'utils/localization';
import { Scrollbars } from 'react-custom-scrollbars';
import _ from 'lodash';
import config from 'utils/config';

const { l } = localization;
const defM2VersionView = {time: ['导出时间', 'blue', (t) => {return moment(t * 1000).format('YYYY-MM-DD HH:mm:ss')}], branch: ['分支', 'green'], categories: ['导出类别', 'green'], tags: ['产品型号', 'green'], template: ['模板', 'green']};

@Form.create()
@connect(({ global }) => ({
  aboutData: global.aboutData,
  webAboutData: global.webAboutData,
}))
export default class About extends Component {
  state = {
    m2VersionView: defM2VersionView,
  }

  getModulesInfo = (obj) => {
    const arr = [];
    for(const i in obj) {
      arr.push({key: i, value: `${obj[i]}`})
    };
    return arr;
  }

  renderContent() {
    const { aboutData = {}, webAboutData = [] } = this.props;
    const labelStyle={textAlign: 'right'}
    const fields = [
      {value: 'soft_version', label: '软件包版本号'},
      {value: 'hardware_sn', label: '设备序列号'},
    ]
    return (
      <Scrollbars style={{height:350}}>
        {!config.hideCompanyInformation && (
        <Row>
          <Col style={labelStyle} span={6}>公司名称 ： </Col>
          <Col span={18}>{l('compayName')}</Col>
          <Col style={labelStyle} span={6}>版权所有 ： </Col>
          <Col span={18}>{l('compayName')}</Col>
        </Row>
        )}
        {fields.map(i => {
          return <Row key={i.value}><Col style={labelStyle} span={6}>{i.label} ：</Col><Col span={18}>{aboutData[i.value]}</Col></Row>
        })}
        {!_.isEmpty(webAboutData) && webAboutData.map(i =>{
          return (
            <Row key={i.dev_name}><Col style={labelStyle} span={6}>{i.dev_name} ：</Col><Col span={18}>{i.dev_version}</Col></Row>
          )
        })}
      </Scrollbars>
    )
  }

  renderM2Version = (m2Version) => {
    const content = [];
    const { m2VersionView } = this.state;
    for (const i in m2VersionView) {
      if (m2Version[i]) {
        const item = m2VersionView[i];
        const fn = item[2] || false;
        let value = fn ? fn(m2Version[i]) : m2Version[i];
        if (_.isArray(value)) {
          value = value.join(',');
        }
        const title = `${item[0]}：${value}`;
        if (value) content.push(<Tag key={i} title={title} color={item[1]}>{value}</Tag>);
      }
    }
    return content;
  }

  render() {
    const { modalVisible, handleModalVisible, isDialog = true } = this.props;
    if (!isDialog) {
      return this.renderContent();
    }
    return (
      (<Modal
        open={modalVisible}
        className='aboutBox'
        headstyle={{
          background:'#142a4f',
        }}
        onOk={this.handleOk}
        width={600}
        style={{marginTop:100}}
        title={
          <div style={{marginBottom:24}}>
            {!config.hideCompanyInformation && <span style={{marginLeft:10}}><img src='./yuantek_others/logo.png' /></span>}
            <span style={{marginLeft:20}}>{l('productName')}</span>
          </div>}
        footer={null}
        onCancel={() => handleModalVisible(false)}
      >
        { this.renderContent() }
      </Modal>)
    );
  }
}
