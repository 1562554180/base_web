import React, { Component } from 'react';
import { Input } from 'antd';
import AutoSizeDialog from 'components/Dialog';


export default class ModeDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  };

  onOk = () => {
    const { handleModalVisible } = this.props;
    if(handleModalVisible) handleModalVisible(false, true)
  }

  changeValue = (e) => {
    this.setState({password: e.target.value});
  }

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { password } =this.state;
    return (
      <AutoSizeDialog
        title="验证密码切换配置模式"
        visible={modalVisible}
        width={400}
        maxHeight={150}
        onOk={this.onOk}
        onCancel={() => handleModalVisible(false)}
        closable
      >
        <div style={{textAlign: 'center', marginTop: 30}}>
          <span>
            密码：
            <Input value={password} type='password' onChange={this.changeValue} style={{width: 200}} />
          </span>
        </div>
      </AutoSizeDialog>
    );
  }
}
