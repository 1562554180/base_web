import React, { Component } from 'react';
import { CloseOutlined } from '@ant-design/icons';

const titleStyle = {
  display: 'flex',
  padding: '10px 8px',
  justifyContent: 'space-between',
  borderBottom: '1px solid #48566e',
}


export default class CustomDialog extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render() {
    const { handleModalVisible, title, children } = this.props;
    return (
      <div
        style={{width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, background: 'rgba(0,0,0,0.7)'}}
      >
        <div
          style={{width: 'calc(100vw - 48px)', height: 'calc(100vh - 70px)', background: '#19325a', margin: '50px 24px 20px'}}
        >
          <h3 style={titleStyle}>{title}<CloseOutlined
            style={{cursor: 'pointer', margin: '5px 10px 0 0'}}
            onClick={() => handleModalVisible(false)} /></h3>
          <div style={{padding: 8, height: 'calc(100% - 70px)', overflow: 'auto'}}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
