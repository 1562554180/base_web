import React from 'react';
import PropTypes from 'prop-types';
import { Layout, message, Spin, Row, Col, Input, Form, Button } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import _ from 'lodash';
import Modal from 'utils/modal';
import GlobalHeader from 'components/GlobalHeader';
import AutoSizeDialog from 'components/Dialog';
import SysStat from './sysstat';
import { getRoutes, parseJson, newWindow, randomStr, createEnhancedRequest } from 'utils/utils';
import AuthorizedRoute from 'components/Authorized/AuthorizedRoute';
import { sizer, elements } from 'utils/layout';
import uri from 'utils/uri';
import config from 'utils/config';
import { manualUrl, manualSdkUrl } from 'requests/passport';
import * as dSet from 'requests/deviceSetting';
import * as rqHome from 'requests/home';
import UserConfig from 'common/UserConfig';

const { Content, Header } = Layout;
const confirm = Modal.confirm;
let workModeTimer = null;
const modifyOptions = config.modifyOptions;
const configInter = {
  interval: 120000,
  maxRetries: 20,
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */

class AppLayout extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      layout: {},
      dialogPasswordVisible: false,
      authorizationVisible: false,
      slotAllocationVisible: false,
      systemStatusVisible: false,
      debuggerDetailVisible: false,
      netList: [],
      networkVisible: false,
      netWorkCompositionModalVisible: false,
      matrixGainVisible: false,
      showNodeTypeSetDialog: false,
      userConfigVisible: false,
    };
    this.showlicenceInfo = true;
    this.showHandoverRemind = true;
    this.dutyData = [];
    this.startUpRef = React.createRef(null);
  }

  syncConfig = () => {
    if (!config.layout.changed) return;
    const newLayout = { ...config.layout };

    const { layout } = this.state;
    const nlayout = { ...layout };
    for (const k in newLayout) {
      if (nlayout[k] !== newLayout[k]) {
        nlayout[k] = newLayout[k];
      }
    }
    const height = this.getContentHeight(nlayout);
    if (height) {
      config.layout.changed = false;
      this.setState({
        layout: nlayout,
      });
    }
  };

  getDutiesList = () => {
    this.props.dispatch({
      type: 'witData/getDutiesList',
      callback: response => {
        if (response.data) {
          this.dutyData = response.data.data;
        }
      },
    });
  };

  removeRootBorder() {
    if (window.yuantek) return;
    let o = document.querySelector('.root-border-top');
    if (o) o.style.border = '0px';
    o = document.querySelector('.root-border');
    if (o) o.style.border = '0px';
    o = document.querySelector('.root-border-bottom');
    if (o) o.style.border = '0px';
  }

  componentDidMount() {
    // 浏览器窗口logo 隐藏与展示 临时调整
    // if (!config.hideCompanyInformation) {
    //   const header = document.getElementsByTagName('head')[0];
    //   const linkTag = document.createElement('link');
    //   linkTag.rel = 'icon';
    //   linkTag.href = './yuantek_others/favicon.png?hashTime';
    //   linkTag.type = 'image/x-icon';
    //   header.appendChild(linkTag);
    // }
    // const container = document.getElementById('content-scroll');
    // if (container && config.iframeOffset) {
    //   const clsName = 'ifr-scroll';
    //   if (!container.className) {
    //     container.className = clsName;
    //   } else if (container.className.indexOf(clsName) === -1) {
    //     container.className += ' ' + clsName;
    //   }
    // }
    // this.removeRootBorder();
    // this.timer = setInterval(this.syncConfig, config.timerInterval_5);
    // const user = this.props.user;
    // if (user?.isLogined) {
    //   this.initUserTimer()
    // }
    // this.getFillData()
    // this.getNetListData()
    // this.handleCheckNrStatusInterIval()
    // this.handleGetInvertConfig()
    // this.handleGetWorkModeConfig()
    // this.getHwmIsDvbExist()
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.clusterRow, nextProps.clusterRow) && nextProps.clusterRow) {
      this.setState({ systemStatusVisible: true });
    }
  }

  getHwmIsDvbExist = () => {
    rqHome.hwmIsDvbExist(null, res => {
      const { code, data } = res || {};
      if (code === -1 || !data) {
        return false;
      }

      this.props.dispatch({
        type: 'main/updateState',
        payload: { isExist: data.is_exist === 1 },
      });
    });
  };

  handleGetInvertConfig = () => {
    const params = {
      net_id: 1,
      session_id: 1,
      Command: 'get_column_type_params',
      params: { type: 'set_invert_count' },
    };
    rqHome.dealColumnConfig(params, response => {
      let defaultData = modifyOptions;
      if (response?.code === 0) {
        defaultData = response.data?.set_invert_count || [];
      }
      this.props.dispatch({
        type: 'main/updateState',
        payload: { invertOptions: defaultData },
      });
    });
  };

  handleGetWorkModeConfig = () => {
    workModeTimer = createEnhancedRequest(this.handleGetWorkModeConfigFetch, configInter, true);
    workModeTimer.start(
      res => {
        const response = parseJson(res, {});
        if (response?.code === 0) {
          const data = parseJson(response.data?.all_expert_work_mode_vsat, []);
          this.props.dispatch({
            type: 'main/updateState',
            payload: { expertNets: data },
          });
        }
      },
      error => {
        console.log('外部获取到的请求失败结果:', error);
      }
    );
  };

  handleGetWorkModeConfigFetch = () => {
    const params = {
      net_id: 1,
      session_id: 1,
      Command: 'get_column_type_params',
      params: {
        type: 'all_expert_work_mode_vsat',
      },
    };
    return rqHome.dealColumnConfig(params);
  };

  handleCheckNrStatusInterIval = () => {
    const { stepsCount } = this.state;
    this.statusTimer = setInterval(() => {
      rqHome.handleCheckNrStatus(null, res => {
        if (res.code === -1) {
          if (!this.props.layoutSpin) {
            this.setState({ isUpdate: true });
            this.addServerTag();
          }
        } else if (res.code === 0) {
          if (this.props.layoutSpin && stepsCount >= 22) {
            this.props.dispatch({
              type: 'main/updateState',
              payload: { layoutSpin: false },
            });
            this.setState({ isUpdate: false });
            localStorage.setItem('serverTag', false);
            window.reload();
          }
        } else if (_.isEmpty(res) && this.props.layoutSpin) {
          this.props.dispatch({
            type: 'main/updateState',
            payload: { layoutSpin: false },
          });
          this.setState({ isUpdate: false });
          localStorage.setItem('serverTag', false);
          window.reload();
        }
      });
    }, config.timerInterval5);
  };

  componentDidUpdate(prevProps) {
    if (this.props.user?.isLogined !== prevProps.user?.isLogined) {
      if (this.props.user?.isLogined) {
        this.initUserTimer();
      } else {
        this.clearUserTimer();
      }
    }
  }

  initUserTimer = () => {
    this.clearUserTimer();
    this.userStatusTimer = setInterval(() => {
      this.props.dispatch({
        type: 'main/getLoginStatus',
      });
    }, config.timerInterval5);
  };

  clearUserTimer = () => {
    if (this.userStatusTimer) {
      clearInterval(this.userStatusTimer);
    }
  };

  componentWillUnmount() {
    sizer.remove(this);
    clearInterval(this.timer);
    this.clearUserTimer();
  }

  getContentHeight(layout) {
    const sc = elements.getBoundingRectById('content-scroll');

    if (!sc) return 0;

    let offset = config.iframeOffset;

    // iframe必然没有header
    if (offset === 0 && !(layout || this.state.layout).noHeader) {
      offset += sc.y || sc.top || 78;
    }
    return document.body.clientHeight - offset;
  }

  handleDownloadSdk = () => {
    const temp = manualSdkUrl();
    window.open(temp);
  };

  handleDownloadManual = () => {
    const temp = manualUrl();
    window.open(temp);
  };

  testIsOff = type => {
    const obj = {
      nrf: '重启nrf系统',
      off: '关机',
      restart: '重启',
    };
    const params = {
      session_id: 1,
      Command: 'get_all_web_config',
      scope: 'all',
    };
    rqHome.handleGetWebConfig(params, res => {
      if (Object.keys(res).length === 0) {
        if (type !== 'off') {
          message.success(`${obj[type]}成功, 即将重新加载页面`);
        } else {
          message.success(`${obj[type]}成功`);
        }
      } else {
        message.error(`${obj[type]}失败`);
      }
    });
  };

  handleSysShutdown = () => {
    const that = this;
    confirm({
      title: `是否关机`,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        const params = {};
        rqHome.handleSysShutdown(params, () => {
          that.addServerTag(true);
          message.success(`关机成功`);
        });
      },
    });
  };

  /**
   * 报错拦截标识
   */
  addServerTag = flag => {
    if (!flag) {
      this.props.dispatch({
        type: 'main/updateState',
        payload: { layoutSpin: true },
      });
      this.getRestartProgress();
    }
    localStorage.setItem('serverTag', true);
  };

  /**
   * 更新进度
   */
  getRestartProgress = () => {
    const { layoutSpin } = this.props;
    if (!layoutSpin) {
      this.setState({ progressWidth: 0, stepItem: null, stepsCount: 0 });
      return;
    }
    rqHome.getRestartProgress({}, res => {
      const restarts = res?.recent_restarts?.[0];
      const stepItem = restarts?.steps[restarts?.steps?.length - 1];
      const inProgressRecord = restarts?.overall_status === 'in_progress';
      const endTime = restarts?.end_time;
      const steps = restarts?.step_count || 0;
      // 点击升级以后，前几次获取回来的数据还是升级完成的数据，这里是解决后台没有写入的问题
      if (!inProgressRecord && !this.startUpRef.current) {
        setTimeout(this.getRestartProgress, 3000);
        return;
      }
      if (!this.startUpRef.current) this.startUpRef.current = true;
      const progressWidth = (100 / 22) * restarts.step_count;
      this.setState({
        progressWidth,
        stepItem,
        stepsCount: steps,
        otherUpdateVersion: restarts?.version,
      });
      if (endTime && steps >= 22) {
        this.startUpRef.current = false;
        window.location.reload();
      } else {
        setTimeout(this.getRestartProgress, 3000);
      }
    });
  };

  handleSysRestart = () => {
    const that = this;
    confirm({
      title: `是否重启`,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        const params = {};
        rqHome.handleSysRestart(params, () => {
          that.addServerTag();
          that.testIsOff('restart');
        });
      },
    });
  };

  resetNrf = () => {
    const that = this;
    confirm({
      title: `确定要一键重启nrf系统吗？`,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        rqHome.resetNrf(null, () => {
          that.addServerTag();
          that.testIsOff('nrf');
        });
      },
    });
  };

  getFillData = () => {
    rqHome.getFilepathConfig(null, res => {
      const response = parseJson(res, {});
      if (response.code === 0) {
        const data = parseJson(response.data, []);
        const pathMapping = {};
        for (const i of data) {
          pathMapping[i.path_name] = i.path;
        }
        this.setState({ pathMapping });
      }
    });
  };

  handleMenuClick = item => {
    const { dispatch, globalNodeType } = this.props;
    const menuKey = item.key;
    if (menuKey.startsWith('download_') && menuKey.endsWith('_file')) {
      const { pathMapping = {} } = this.state;
      // ${window.location.host}
      newWindow(`http://${window.location.host}${pathMapping[menuKey]}`, randomStr(20));
    } else if (menuKey === 'login') {
      this.handleDialogLoginVisible(true);
    } else if (menuKey === 'poweroff') {
      this.handleSysShutdown();
    } else if (menuKey === 'reload') {
      this.handleSysRestart();
    } else if (menuKey === 'resetAll') {
      this.handleResetNetControl();
    } else if (menuKey === 'resetNrf') {
      this.resetNrf();
    } else if (menuKey === 'changePassword') {
      this.handleDialogChangePsswordVisible(true);
    } else if (menuKey === 'logList') {
      this.handleDialogLogListVisible(true);
    } else if (menuKey === 'programZip') {
      // newWindow(`http://${window.location.host}/yuantek_assets/sdk/软件开发包.zip`, randomStr(20));
      newWindow(`http://${window.location.host}/yuantek_assets/sdk/sdk_demo.zip`, randomStr(20));
    } else if (menuKey === 'VSPClient') {
      newWindow(`http://172.16.10.26/yuantek_assets/sdk/VSP_Client.zip`, randomStr(20));
      // newWindow(`http://${window.location.host}/yuantek_assets/sdk/VSP_Client.zip`, randomStr(20));
    } else if (menuKey === 'userManaual') {
      // newWindow(`http://${window.location.host}/yuantek_assets/manual/用户使用手册.zip`, randomStr(20));
      newWindow(
        `http://${window.location.host}/yuantek_assets/manual/usermanual.zip`,
        randomStr(20)
      );
    } else if (menuKey === 'versionFile') {
      this.handleDialogversionFileVisible(true);
    } else if (menuKey === 'versionManage') {
      // window.open(`http://172.17.96.33:5050/#/version`)
      window.open(`${window.location.origin}:5050/#/version`);
    } else if (menuKey === 'inverterConfig') {
      this.handleDialoginverterConfigVisible(true);
    } else if (menuKey === 'systemSetting') {
      this.handleDialogsystemSettingVisible(true);
    } else if (menuKey === 'version') {
      this.handleDialogVersionVisible(true);
    } else if (menuKey === 'companyMode') {
      this.handleDialogCompanyModeVisible(true);
      // window.open(`${window.location.origin}/#/companyMode`)
    } else if (menuKey === 'systemStatus') {
      this.handleDialogSystemStatusVisible(true);
    } else if (menuKey === 'debuggerDetail') {
      this.handleDialogDebuggerDetailVisible(true);
    } else if (menuKey === 'slotAllocation') {
      this.handleDialogSlotAllocationVisible(true);
    } else if (menuKey === 'password') {
      this.handleDialogPasswordVisible(true);
    } else if (menuKey === 'authorization_manage') {
      this.handleDialogAuthorizationVisible(true);
    } else if (menuKey === 'logout') {
      dispatch({
        type: 'main/logout',
      });
    } else if (['softStart', 'reload', 'powerOff'].includes(menuKey)) {
      this.onSettingMenuClick(menuKey);
    } else if (menuKey === 'download_operation_manual') {
      this.handleDownloadManual();
    } else if (menuKey === 'download_client') {
      this.handleDownloadSdk();
    } else if (menuKey === 'networkState') {
      this.handleDialogNetworkStatus(true);
    } else if (menuKey === 'networkComposition') {
      this.handleUpdateStateValue(true, 'netWorkCompositionModalVisible');
    } else if (menuKey === 'matrixGain') {
      this.handleOpenMatrixGain(true);
    } else if (menuKey === 'setMaster') {
      this.setNodeTypeReq('master');
    } else if (menuKey === 'disslove') {
      this.dissloveFn();
    } else if (menuKey === 'joinCluster') {
      this.setState({ showNodeTypeSetDialog: true });
    } else if (menuKey === 'userConfig') {
      this.handleDialogUserConfigVisible(true);
    } else if (this.productFeatures) {
      this.productFeatures.handleMenuClick(menuKey);
    }
  };

  setNodeTypeReq = type => {
    confirm({
      title: '是否设置为主节点',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const params = { command: 'set', type };
        rqHome.nodeType(params, res => {
          if (res.code === 0) {
            message.success('设置成功');
            setTimeout(() => window.location.reload(), 600);
          } else {
            message.error(res.message || '设置节点类型失败');
          }
        });
      },
    });
  };

  dissloveFn = () => {
    confirm({
      title: '是否解散集群',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const params = { command: 'del_all' };
        rqHome.delClusterSlave(params, res => {
          if (res.code === 0) {
            message.success('解散集群成功');
            setTimeout(() => window.location.reload(), 600);
          } else {
            message.error(res.message || '解散集群失败');
          }
        });
      },
    });
  };

  joinClusterMasterFn = values => {
    const params = {
      ...values,
      rf_list: values.rf_list ? values.rf_list?.split(',').map(c => Number(c)) : [],
    };
    this.setState({ submitNodeSetLoading: true });
    rqHome.joinClusterMaster(params, res => {
      const d = { submitNodeSetLoading: false };
      if (res.code === 0) {
        message.success('加入集群成功');
        d.showNodeTypeSetDialog = false;
        window.location.reload();
      } else {
        message.error(res.message || '加入集群失败');
      }
      this.setState(d);
    });
  };

  renderNodeSet = () => {
    const { submitNodeSetLoading } = this.state;

    return (
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 12 }}
        onFinish={this.joinClusterMasterFn}
        style={{ marginTop: 24 }}
        initialValues={{ slave_ip: config.isLocal ? config.localTestUrl : window.location.host }}
      >
        <Form.Item
          label="主节点IP"
          name="master_node_ip"
          rules={[{ required: true }, { pattern: new RegExp(ipReg), message: '请输正确的IP格式' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="当前节点IP"
          name="slave_ip"
          rules={[{ required: true }, { pattern: new RegExp(ipReg), message: '请输正确的IP格式' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="RF"
          name="rf_list"
          rules={[{ pattern: new RegExp(/^(\d+(,\d+)*)?$/), message: '必须以,隔开且不能用空格' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 12 }}>
          <Button loading={submitNodeSetLoading} type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  };

  handleOpenMatrixGain = v => {
    this.setState({ matrixGainVisible: v });
  };

  renderMatrixGain = () => {
    const { matrixGainVisible } = this.state;
    if (!matrixGainVisible) return null;
    return (
      <MatrixGainControl handleVisible={this.handleOpenMatrixGain} visible={matrixGainVisible} />
    );
  };

  onSettingMenuClick = key => {
    switch (key) {
      case 'softStart':
        this.setSystemSetting('device_new_soft_restart');
        break;
      case 'reload':
        this.setSystemSetting('device_new_restart');
        break;
      case 'powerOff':
        this.setSystemSetting('device_new_poweroff');
        break;
      default:
        break;
    }
  };

  getNetListData = () => {
    const params = {
      session_id: 1,
      Command: 'get_all_web_config',
      scope: 'all',
    };
    rqHome.handleGetWebConfig(params, res => {
      const response = parseJson(res, {});
      if (response?.code === 0) {
        const { data = [] } = response;
        this.setState({ netList: data });
        const udata =
          data.map(i => {
            return {
              hidden: i.wk_type === 4 ? '1' : '0',
              config_name: i.config_name,
              vsat_id: i.vsat_id,
              wk_type: i.wk_type,
            };
          }) || [];
        this.props.dispatch({
          type: 'main/updateState',
          payload: {
            configAllNetList: udata,
            allNetList: data,
            allAdPort: response.all_ad_port_list || [],
          },
        });
      }
    });
  };

  handleResetNetControl = () => {
    const { netList = [] } = this.state;
    if (_.isEmpty(netList)) return message.error('重置失败');
    const vsatIdList = netList.map(item => Number(item.vsat_id));
    const freeDeviceResourceParams = {
      net_id: 1,
      session_id: 1,
      Command: 'free_device_resource',
      function_type: 'del',
      scope: 'all',
      params: {
        vsat_id: vsatIdList,
      },
    };
    confirm({
      title: `是否一键重置所有网控`,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        rqHome.handleDelVsat(freeDeviceResourceParams, delRes => {
          const delResponse = parseJson(delRes, {});
          if (delResponse?.code === 0) {
            message.success('重置成功');
            setTimeout(() => {
              window.location.reload();
            }, config.timerInterval1);
          } else {
            message.error(delResponse?.message || '重置失败');
          }
        });
      },
    });
  };

  setSystemSetting = t => {
    const mapping = {
      device_new_soft_restart: '软启动',
      device_new_restart: '重启',
      device_new_poweroff: '关机',
    };
    confirm({
      title: `是否${mapping[t]}？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        message.info(`即将${mapping[t]}，请稍后`);
        dSet.newDeviceRestart({ type: t }, res => {
          if (res && res.success) {
            message.success(res.message || `${mapping[t]}成功`);
          } else {
            message.error(res && res.message ? res.message : `${mapping[t]}失败`);
          }
        });
      },
    });
  };

  restart = type => {
    const { dispatch } = this.props;
    const title = type === 'reload' ? '是否重启设备？' : '是否关机？';
    const payloadType = type === 'reload' ? 'device_restart' : 'device_poweroff';
    confirm({
      title,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.info('reload' ? '即将重启，请稍后' : '即将关机，请稍后');
        dispatch({
          type: 'main/setDevice',
          payload: { type: payloadType },
        });
      },
    });
  };

  handleIconClick = e => {
    const tag = e.currentTarget.getAttribute('tag');

    if (tag === 'entry') {
      this.hideEntryDialog(true);
    }
  };

  getLayoutMargin() {
    if (config.iframeOffset) return '0';

    const { layout } = this.state;

    if (layout) {
      if (layout.margin) return layout.margin;
      if (layout.noMargin) return '0';
      if (layout.noFooter) return '10px 8px 0px';
    }
    return '8px 8px 8px';
  }

  getDialogComponent = (routerData, key) => {
    if (!routerData || !key) return [];
    let dialogComponent = [];
    for (const i in routerData) {
      if (i.indexOf(':') === -1 && i === key) {
        dialogComponent = [routerData[i]];
        return [routerData[i]];
      } else if (i.indexOf(':') > -1 && key.indexOf(i.split(':')[0]) > -1) {
        const keys = key.split('/');
        dialogComponent = [routerData[i], keys[keys.length - 1]];
        return [routerData[i], keys[keys.length - 1]];
      }
    }
    return dialogComponent;
  };

  updateSourceData = (menuData, selectModule) => {
    // if (config.dataCenter) return menuData;
    const newMenuData = _.cloneDeep(menuData);
    const selectModuleMenu = [];
    const filterData = config.menuConf.display[selectModule || 'default'] || {};
    const { type = 'include', paths = [] } = filterData;
    const includeType = type === 'include';
    newMenuData.forEach(item => {
      if ((paths.indexOf(item.path) === -1) !== includeType) {
        selectModuleMenu.push(item);
      }
    });
    return selectModuleMenu;
  };

  handleDialogLoginVisible = visible => {
    this.setState({
      dialogLoginVisible: !!visible,
    });
  };

  handleDialogPasswordVisible = visible => {
    this.setState({
      dialogPasswordVisible: !!visible,
    });
  };

  handleDialogCompanyModeVisible = visible => {
    this.setState({
      dialogCompanyModeVisible: !!visible,
    });
  };

  handleDialogSlotAllocationVisible = visible => {
    this.setState({
      slotAllocationVisible: !!visible,
    });
  };

  handleDialogSystemStatusVisible = visible => {
    this.setState({
      systemStatusVisible: !!visible,
    });
    if (!visible) {
      this.props.dispatch({
        type: 'main/updateState',
        payload: { clusterRow: null },
      });
    }
  };

  handleDialogDebuggerDetailVisible = visible => {
    this.setState({
      debuggerDetailVisible: !!visible,
    });
  };

  handleDialoginverterConfigVisible = visible => {
    this.setState({
      inverterConfigVisible: !!visible,
    });
  };

  handleDialogversionFileVisible = visible => {
    this.setState({
      versionFile: !!visible,
    });
  };

  handleDialogChangePsswordVisible = visible => {
    this.setState({
      changePsswordVisible: !!visible,
    });
  };

  handleDialogLogListVisible = visible => {
    this.setState({
      logListVisible: !!visible,
    });
  };

  handleDialogsystemSettingVisible = visible => {
    this.setState({
      systemSettingVisible: !!visible,
    });
  };

  handleDialogVersionVisible = visible => {
    this.setState({
      versionVisible: !!visible,
    });
  };

  handleDialogAuthorizationVisible = visible => {
    this.setState({
      authorizationVisible: !!visible,
    });
  };

  handleDialogUserConfigVisible = visible => {
    this.setState({
      userConfigVisible: !!visible,
    });
  };

  switchDataSource = () => {
    if (this.productFeatures) {
      this.productFeatures.switchDataSource();
    }
  };

  authorizedRouteCreator = item => {
    return (
      <AuthorizedRoute
        key={item.key}
        path={item.path}
        component={item.component}
        exact={item.exact}
        redirectPath={config.loginPath}
      />
    );
  };

  renderContent() {
    const { routerData } = this.props;
    const routers = getRoutes(uri.rootComponent(), routerData);
    return <Switch>{routers.map(this.authorizedRouteCreator)}</Switch>;
  }

  handleDialogNetworkStatus = visible => {
    this.setState({
      networkVisible: !!visible,
    });
  };

  handleUpdateStateValue = (value, field) => {
    this.setState({
      [field]: value,
    });
  };

  render() {
    const {
      location,
      settings,
      dispatch,
      hasLogined,
      clusterRow,
      selectedTheme,
      loginFlag,
      sendNetstationConfig,
    } = this.props;
    const dialogLoginProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogLoginVisible,
    };

    const dialogPasswordProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogPasswordVisible,
    };

    const dialogAuthorizationProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogAuthorizationVisible,
    };

    const dialogSlotAllocationProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogSlotAllocationVisible,
    };

    const dialogCompanyModeProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogCompanyModeVisible,
    };

    const systemStatusProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogSystemStatusVisible,
    };

    const networkStateProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogNetworkStatus,
    };

    const netWorkCompositionProps = {
      settings,
      dispatch,
      handleModalVisible: visible =>
        this.handleUpdateStateValue(visible, 'netWorkCompositionModalVisible'),
    };

    const debuggerDetailProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogDebuggerDetailVisible,
    };

    const inverterConfigProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialoginverterConfigVisible,
    };

    const systemSettingConfigProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogsystemSettingVisible,
    };

    const changePsswordProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogChangePsswordVisible,
    };

    const versionConfigProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogVersionVisible,
    };

    const logListProps = {
      settings,
      dispatch,
      handleModalVisible: this.handleDialogLogListVisible,
    };
    const { stepItem, progressWidth, stepsCount, otherUpdateVersion } = this.state;
    const statusMap = {
      success: '成功',
      in_progress: '进行中',
    };

    // @connect(({ main }) => ({
    //   loginFlag: main.loginFlag,
    //   hasLogined: main.hasLogined,
    //   settings: main.settings || {},
    //   selectedTheme: main.selectedTheme,
    //   sendNetstationConfig: main.sendNetstationConfig || {},
    // }))

    const globalProps = {
      loginFlag,
      hasLogined,
      settings,
      selectedTheme,
      sendNetstationConfig,
    };

    const pageContent = (
      <Layout>
        <Layout>
          <Header
            style={{ padding: 0 }}
            ref={n => {
              this.header = n;
            }}
          >
            <GlobalHeader
              {...globalProps}
              location={location}
              onMenuClick={this.handleMenuClick}
              dispatch={this.props.dispatch}
            />
          </Header>
          <Content style={{ height: 'calc(100vh - 50px)' }}>{this.renderContent()}</Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={`${settings.productName}`}>
        <ContainerQuery query={config.screenMediaList}>
          {params => (
            <div className={classNames(params)}>
              {pageContent}
              <UserConfig
                isModal
                modalVisible={this.state.userConfigVisible}
                handleModalVisible={this.handleDialogUserConfigVisible}
              />
              <AutoSizeDialog
                title="系统状态"
                visible={this.state.systemStatusVisible}
                onCancel={() => this.handleDialogSystemStatusVisible(false)}
                width="90vw"
                maxWidth={1600}
                maxHeight="85vh"
                noFooter
                closable
                maximize={false}
              >
                <SysStat />
              </AutoSizeDialog>
            </div>
          )}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ main }) => ({
  user: main.user,
  layoutSpin: main.layoutSpin,
  settings: main.settings || {},
  collapsed: main ? main.collapsed : true,
  globalNodeType: main.globalNodeType,
  clusterRow: main.clusterRow,
  loginFlag: main.loginFlag,
  hasLogined: main.hasLogined,
  selectedTheme: main.selectedTheme,
  sendNetstationConfig: main.sendNetstationConfig || {},
}))(AppLayout);
