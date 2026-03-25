import React, { Component } from 'react';
import { connect } from 'dva';
import {Row, Col, message, Spin } from "antd"
import AutoSizeDialog from 'components/Dialog';
import * as rqHome from 'requests/home';
import { parseJson } from 'utils/utils';
import Modal from 'utils/modal'
import config from 'utils/config'
import { Form } from '@ant-design/compatible';
import FromItemCreator from 'components/FromItemCreator';
import { createSubmitHandler } from 'utils/form';

// import '@ant-design/compatible/assets/index.css';


const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
const { confirm } = Modal
@Form.create()
@connect(({ main }) => ({
  hasLogined: main.hasLogined,
  groupMode: main.groupMode,
  globalNodeType: main.globalNodeType,
}))
export default class LoginModal extends Component {
  constructor(props) {
    super(props);
    let loading = true;
    const programAlertNum = props.programAlertNum || 0;
    if (programAlertNum > 0) {
      loading = false;
    }
    this.state = {
      loading,
      isSend: 0,
      isCollect: 0,
      deviceSweep: '',
      isRequest: false,
      // programAlertNum: props.programAlertNum,
    };
    this.deviceSweep = {};
    this.Items = [
      { formItemLayout, label: '账号', field_name: 'username', type: 'input', placeholder: "请输入账号", span: 24, required: true, props: { onPressEnter: this.onPressEnter } },
      { formItemLayout, label: '密码', field_name: 'password', type: 'password', span: 24, required: true, isNoPattern: true, props: { onPressEnter: this.onPressEnter } },
    ]
  }

  // 检测发射状态
  detectionSendStatus = () => {
    const { hasLogined, handleModalVisible, groupMode } = this.props;
    if (groupMode === '1') { // 发射版本时再请求
      const params = {command: 'get', params: {}};
      rqHome.saveWebStatus(params, (res) => {
        if(res.code === 0 && res.data.jz_status !== 0) {
          handleModalVisible(false)
          return message.warning(`用户${hasLogined}正在发射校准中，请稍后尝试登录`);
        } else {
          this.setState({isSend: -1})
        }
      })
    } else {
      this.setState({isSend: -1})
    }
  }

  // 检测采集状态
  detectionCollectStatus = () => {
    const params = {command: 'get'};
    const { hasLogined, handleModalVisible } = this.props;
    rqHome.getCaptureConnectStatus(params, (res) => {
      if (res.code === 1) {
        handleModalVisible(false)
        return message.warning(`用户${hasLogined}数据采集中，请稍后尝试登录`)
      } else {
        this.setState({isCollect: -1})
      }
    })
  }

  // 检测扫频状态
  detectionSweepStatus = () => {
    const { globalNodeType } = this.props;
    if (globalNodeType === 'master') {
      rqHome.getCluserDevList({}, (res) => {
        const list = res.data || [];
        const data = [];
        for (const i of list) {
          data.push(i.node_ip);
          this.deviceSweep[i.node_ip] = 0;
        }
        this.setState({ipList: data}, () => {
          this.getSweepStatus()
        })
      })
    } else {
      const url = config.isLocal ? config.localTestUrl : window.location.hostname;
      this.deviceSweep[url] = 0;
      this.setState({ipList: [url]}, this.getSweepStatus)
    }
  }

  componentDidMount() {
    this.detectionSendStatus()
    this.detectionCollectStatus()
    this.detectionSweepStatus()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isSend !== prevState.isSend || this.state.isCollect !== prevState.isCollect || this.state.deviceSweep !== prevState.deviceSweep) {
      const deviceSweep = parseJson(this.state.deviceSweep, {})
      if (this.state.loading && this.state.isSend === -1 && this.state.isCollect === -1 && _.keys(deviceSweep).length > 0 && _.keys(deviceSweep).filter(i => deviceSweep[i] === -1).length === this.state.ipList?.length) {
        this.setLoadingStatus(false)
        message.info('设备空闲，请登录')
      }
    }
  }

  setLoadingStatus = (v) => {
    this.setState({loading: v})
  }

  getSweepStatus = () => {
    const { ipList } = this.state;
    for (const i of ipList) {
      this[`ws${i}`] = new WebSocket(`ws://${i}:8090/img`);
      this[`ws${i}`].onmessage = (e) => this.wsMessage(e, i);
      this[`ws${i}`].onopen = () => this.handleConnectSocket(i)
    }
  }

  handleConnectSocket = (i) => {
    const options = `node=0,type=spectrum_scan,cmd=init,scrw=${1920},scrh=${980},imgw=${1340},imgh=${227},CH=${0}`;
    if (this[`ws${i}`] && this[`ws${i}`].send && this[`ws${i}`].readyState === 1) {
      this[`ws${i}`].send(options);
    }
  }

  wsMessage = (res, i) => {
    const responseData = parseJson(res.data, {});

    if (responseData.type === 'overview') {
      this[`ws${i}`].close();
      const list = responseData.overview || []
      let isSweep = 0
      for (const j of list) {
        if (j.status !== '扫频就绪') {
          isSweep = 1
          '设备正在执行扫频业务，请稍后登录';
          message.warning(`用户${hasLogined}数据采集中，请稍后尝试登录`)
          handleModalVisible(false)
          break;
        }
      }
      if (isSweep === 0) {
        isSweep = -1
      }
      this.deviceSweep[i] = isSweep;
      this.setState({deviceSweep: JSON.stringify(this.deviceSweep)})
    } else if (responseData.type === 'warning') {
      // this.deviceSweep[i] = 2;
      message.warning(responseData.message)
    }
  }

  handleCheckCapture = (checked) => {
    const params = {command: 'get'}
    rqHome.getCaptureConnectStatus(params, (res) => {
      if (res.code === 1) {
        return message.warning(`用户${hasLogined}数据采集中，请稍后尝试登录`)
      } else {
        this.setState({isCollect: -1})
      }
    })
  }

  onPressEnter = () => {
    this.submitHandler()
  }

  loginFetch = (params) => {
    const { handleModalVisible, handleLogin, dispatch, handleGetShowMenu } = this.props;
    this.setState({loading: true}, () => {
      rqHome.handleLogin(params, (res) => {
        if (!res) return;
        const response = parseJson(res, {})
        if (response?.code == 1) {
          message.success(response?.message || "登录成功");
          dispatch({
            type: 'main/updateState',
            payload: { username: params.username || "" },
          })
          handleGetShowMenu()
          handleModalVisible(false)
          handleLogin(true)
          localStorage.setItem('username', params.username)
          this.setState({
            loading: false,
          })
        } else {
          message.error(response?.message || "登录失败，请稍后重试");
          this.setState({loading: false})
        }
      })
    })
  }

  onOk = (err, fields) => {
    const { handleModalVisible } = this.props;
    if (err) return;
    const { f } = fields
    const params = { ...f }
    const that = this
    const hasLogined = this.props.hasLogined
    if (hasLogined?.length > 0) {
      confirm({
        title: `用户${hasLogined[0]?.client_ipaddr}已处于配置模式，是否强行登录`,
        okText: '是',
        cancelText: '否',
        onOk: () => {
          that.loginFetch(params)
        },
        onCancel: () => {
          handleModalVisible(false)
        },
      });
    } else {
      this.loginFetch(params)
    }
  };

  render() {
    const { title, modalVisible, handleModalVisible, form, loadFreq, isSpectrumIng, freqTipMsg } = this.props;
    const { loading } = this.state;
    if (!this.submitHandler) {
      this.submitHandler = createSubmitHandler({
        form,
        onSubmit: this.onOk.bind(this),
      })
    }
    return (
      <AutoSizeDialog
        title={title || `登录`}
        visible={modalVisible}
        width={400}
        maxHeight={140}
        submitId="login_submit_btn"
        onCancel={() => handleModalVisible(false)}
        onOk={this.submitHandler}
        loading={loading}
        noFooter={isSpectrumIng}
      >
        <Spin spinning={loading} tip={<span>正在检测设备是否被占用，请稍等...</span>} >
          <Form style={{ overflow: 'auto', padding: 10 }}>
            <Row type='flex' justify='space-between'>
              {
                this.Items.map(item => {
                  return (
                    <Col key={item.field_name} span={item.span || 24}>
                      <FromItemCreator item={{ ...item, value: '', style: { width: "100%" } }} form={form} />
                    </Col>
                  )
                })
              }
            </Row>
          </Form>
        </Spin>
      </AutoSizeDialog>
    );
  }
}
