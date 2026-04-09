import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'dva';
import { Row, Col, message, Spin, Form } from 'antd';
import AutoSizeDialog from 'components/Dialog';
import * as rqHome from 'requests/home';
import { parseJson } from 'utils/utils';
import Modal from 'utils/modal';
import config from 'utils/config';
import FromItemCreator from 'components/FromItemCreator';
import _ from 'lodash';

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
const { confirm } = Modal;

const LoginModal = ({
  hasLogined,
  groupMode,
  globalNodeType,
  title,
  modalVisible,
  handleModalVisible,
  handleLogin,
  dispatch,
  handleGetShowMenu,
  loadFreq,
  isSpectrumIng,
  freqTipMsg,
  programAlertNum,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(programAlertNum > 0 ? false : true);
  const [isSend, setIsSend] = useState(0);
  const [isCollect, setIsCollect] = useState(0);
  const [deviceSweep, setDeviceSweep] = useState('');
  const [ipList, setIpList] = useState([]);
  const deviceSweepRef = useRef({});
  const wsRef = useRef({});
  const submitHandlerRef = useRef(null);

  const Items = [
    {
      formItemLayout,
      label: '账号',
      field_name: 'username',
      type: 'input',
      placeholder: '请输入账号',
      span: 24,
      required: true,
    },
    {
      formItemLayout,
      label: '密码',
      field_name: 'password',
      type: 'password',
      span: 24,
      required: true,
      isNoPattern: true,
    },
  ];

  const loginFetch = (params) => {
    setLoading(true);
    rqHome.handleLogin(params, (res) => {
      if (!res) return;
      const response = parseJson(res, {});
      if (response?.code == 1) {
        message.success(response?.message || '登录成功');
        dispatch({
          type: 'main/updateState',
          payload: { username: params.username || '' },
        });
        handleGetShowMenu();
        handleModalVisible(false);
        handleLogin(true);
        localStorage.setItem('username', params.username);
        setLoading(false);
      } else {
        message.error(response?.message || '登录失败，请稍后重试');
        setLoading(false);
      }
    });
  };

  const onOk = useCallback(
    (err, fields) => {
      if (err) return;
      const params = { ...fields };
      if (hasLogined?.length > 0) {
        confirm({
          title: `用户${hasLogined[0]?.client_ipaddr}已处于配置模式，是否强行登录`,
          okText: '是',
          cancelText: '否',
          onOk: () => {
            loginFetch(params);
          },
          onCancel: () => {
            handleModalVisible(false);
          },
        });
      } else {
        loginFetch(params);
      }
    },
    [hasLogined, handleModalVisible]
  );

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(null, values);
      })
      .catch((errInfo) => {
        onOk(errInfo, null);
      });
  };

  const handleConnectSocket = (i) => {
    const options = `node=0,type=spectrum_scan,cmd=init,scrw=${1920},scrh=${980},imgw=${1340},imgh=${227},CH=${0}`;
    if (wsRef.current[i] && wsRef.current[i].send && wsRef.current[i].readyState === 1) {
      wsRef.current[i].send(options);
    }
  };

  const wsMessage = (res, i) => {
    const responseData = parseJson(res.data, {});
    if (responseData.type === 'overview') {
      wsRef.current[i].close();
      const list = responseData.overview || [];
      let isSweep = 0;
      for (const j of list) {
        if (j.status !== '扫频就绪') {
          isSweep = 1;
          message.warning(`用户${hasLogined}数据采集中，请稍后尝试登录`);
          handleModalVisible(false);
          break;
        }
      }
      if (isSweep === 0) {
        isSweep = -1;
      }
      deviceSweepRef.current[i] = isSweep;
      setDeviceSweep(JSON.stringify(deviceSweepRef.current));
    } else if (responseData.type === 'warning') {
      message.warning(responseData.message);
    }
  };

  const getSweepStatus = (ips) => {
    for (const i of ips) {
      wsRef.current[i] = new WebSocket(`ws://${i}:8090/img`);
      wsRef.current[i].onmessage = (e) => wsMessage(e, i);
      wsRef.current[i].onopen = () => handleConnectSocket(i);
    }
  };

  const detectionSweepStatus = () => {
    if (globalNodeType === 'master') {
      rqHome.getCluserDevList({}, (res) => {
        const list = res.data || [];
        const data = [];
        for (const i of list) {
          data.push(i.node_ip);
          deviceSweepRef.current[i.node_ip] = 0;
        }
        setIpList(data);
        getSweepStatus(data);
      });
    } else {
      const url = config.isLocal ? config.localTestUrl : window.location.hostname;
      deviceSweepRef.current[url] = 0;
      setIpList([url]);
      getSweepStatus([url]);
    }
  };

  const detectionCollectStatus = () => {
    const params = { command: 'get' };
    rqHome.getCaptureConnectStatus(params, (res) => {
      if (res.code === 1) {
        handleModalVisible(false);
        message.warning(`用户${hasLogined}数据采集中，请稍后尝试登录`);
      } else {
        setIsCollect(-1);
      }
    });
  };

  const detectionSendStatus = () => {
    if (groupMode === '1') {
      const params = { command: 'get', params: {} };
      rqHome.saveWebStatus(params, (res) => {
        if (res.code === 0 && res.data.jz_status !== 0) {
          handleModalVisible(false);
          message.warning(`用户${hasLogined}正在发射校准中，请稍后尝试登录`);
        } else {
          setIsSend(-1);
        }
      });
    } else {
      setIsSend(-1);
    }
  };

  useEffect(() => {
    detectionSendStatus();
    detectionCollectStatus();
    detectionSweepStatus();
  }, []);

  useEffect(() => {
    const deviceSweepObj = parseJson(deviceSweep, {});
    if (
      loading &&
      isSend === -1 &&
      isCollect === -1 &&
      _.keys(deviceSweepObj).length > 0 &&
      _.keys(deviceSweepObj).filter((i) => deviceSweepObj[i] === -1).length === ipList?.length
    ) {
      setLoading(false);
      message.info('设备空闲，请登录');
    }
  }, [isSend, isCollect, deviceSweep, ipList]);

  return (
    <AutoSizeDialog
      title={title || '登录'}
      visible={modalVisible}
      width={400}
      maxHeight={140}
      submitId="login_submit_btn"
      onCancel={() => handleModalVisible(false)}
      onOk={handleSubmit}
      loading={loading}
      noFooter={isSpectrumIng}
    >
      <Spin spinning={loading} tip={<span>正在检测设备是否被占用，请稍等...</span>}>
        <Form form={form} style={{ overflow: 'auto', padding: 10 }}>
          <Row type="flex" justify="space-between">
            {Items.map((item) => {
              return (
                <Col key={item.field_name} span={item.span || 24}>
                  <FromItemCreator item={{ ...item, value: '', style: { width: '100%' } }} />
                </Col>
              );
            })}
          </Row>
        </Form>
      </Spin>
    </AutoSizeDialog>
  );
};

export default connect(({ main }) => ({
  hasLogined: main.hasLogined,
  groupMode: main.groupMode,
  globalNodeType: main.globalNodeType,
}))(LoginModal);
