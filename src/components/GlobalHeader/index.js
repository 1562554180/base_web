import React, { PureComponent } from 'react';
import { Tooltip, Badge, Popconfirm, Switch, Tabs, List, message, Button, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import rule from 'assets/rule.png'
import Modal from 'utils/modal';
import { DeleteOutlined } from '@ant-design/icons';
import Debounce from 'lodash-decorators/debounce';
import * as rqHome from 'requests/home';
import { parseJson, daysBetweenTimeAndToday, getNowTime, createEnhancedRequest } from 'utils/utils';
import { sizer } from 'utils/layout';
import Icon from 'components/Icon';
import moment from 'moment';
import { matomo } from 'utils/matomo';
import _ from 'lodash'
import config from 'utils/config';
import AutoSizeDialog from 'components/Dialog';
import { ThemeContext } from '@/config';
import LoginModal from './login/LoginModal.js';
import UserIcon from './userIcon.js';
import styles from './index.less';


const configInter = {
  interval: 30000,
  maxRetries: 2,
};
let ws = null;
let checkTokenTimer = null
let serviceMessageTimer = null
let ntpMessageTimer = null
const { confirm } = Modal
const { TabPane } = Tabs
const { TextArea } = Input

export default class GlobalHeader extends PureComponent {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      isList: false,
      isLoginedFlag: false,
      msgCount: 0,
      programName: 'NRFLuxUI',
      ntpMessageData: {},
      nowTime: '',
      loginVisible: false,
      messageData: [],
      delayTime: '0ms',
      isRemoveTokening: false,
      isCompany: this.props.location.pathname === '/companyMode',
    }
    this.ntpRequestCount = 0;
    this.msgRef = React.createRef();
    this.enhancedRequestInstance = createEnhancedRequest(this.getMesaageFetch, configInter, true);
  }

  componentDidMount() {
    // this.handleGetProgramName()
    // this.handleCheckToken()
    // this.getNtpMessage()
    // this.handleGetServiceMessage()
    // this.handleGetDelayTime();
    // sizer.add(this);
    // const { enablePageStatics } = config;
    // if (enablePageStatics) {
    //   this.menuMapping = createMenuMapping(this.props.menuData);
    //   this.startMatomo();
    // }
    // document.addEventListener('mousedown', this.handleClickOutside)
    // const body = document.body;
    // const style = window.getComputedStyle(body);
    // this.setState({ bodyBgc: style.backgroundColor })
    // this.getMesaageInter('first')
  }

  handleGetDelayTime = () => {
    if (!this.delayTimeTimer) {
      this.delayTimeTimer = setInterval(() => {
        this.setState({
          delayTime: this.getRandomNumber(),
        })
      }, 3000)
    }
  }

  handleCleaarDelayTimeTimer = () => {
    if (this.delayTimeTimer) {
      clearInterval(this.delayTimeTimer);
    }
  }

  getRandomNumber = () => {
    const random = Math.random() * 2 + 1;
    return `${Number(random.toFixed(1))} ms`;
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
    sizer.remove(this);
    document.removeEventListener('mousedown', this.handleClickOutside)
    if (this.freqInfoWs) {
      this.freqInfoWs.onCloseWs()
    }
    this.handleClearTimeoutCheckToken()
    this.clearTimeoutGetServiceMessage()
    this.clearTimeoutGetNtpMessage()
    this.handleCleaarDelayTimeTimer();
    if (this.enhancedRequestInstance) {
      this.enhancedRequestInstance.stop();
      this.enhancedRequestInstance = null;
    }
  }

  handleGetProgramName = () => {
    const params = {
      Command: 'get_vmpun2_name',
    }
    rqHome.handleGgetVmpun2Name(params, (res) => {
      const response = parseJson(res, {})
      if (response.code === 0) {
        this.setState({ programName: response.data })
      }
    })
  }

  handleCheckToken = () => {
    this.handleClearTimeoutCheckToken();
    const { dispatch } = this.props
    const params = {
      session_id: 1,
      Command: 'update_lock_token',
      scope: 'part',
    }
    rqHome.handleUserToken(params, (res) => {
      const response = parseJson(res, {})
      const currentToken = localStorage.getItem('token') || ''
      if (response.code === 0) {
        const tokenList = response.data.map(item => item.token)
        const flag = tokenList.includes(currentToken)

        if (!flag && this.state.isLoginedFlag) {
          this.renderMessage(response?.data)
        }

        this.setState({ isLoginedFlag: flag }, () => {
          dispatch({
            type: 'main/updateState',
            payload: { loginFlag: flag, token: currentToken || null, hasLogined: response?.data },
          })
          this.handleGetShowMenu(flag)
          if (!flag && this.props.loginFlag) {
            dispatch({
              type: 'main/updateLogout',
              payload: {},
            })
          }
        })
      } else {
        this.setState({ isLoginedFlag: false }, () => {
          dispatch({
            type: 'main/updateState',
            payload: { loginFlag: false, token: currentToken || null },
          })
          dispatch({
            type: 'main/updateLogout',
            payload: {},
          })
        })
      }
      this.handleTimeoutCheckToken()
    })
  }

  renderMessage = (data) => {
    const { msgCount = 0 } = this.state
    // const hasLogined = this.props.main.hasLogined?.[0]?.client_ipaddr
    const hasLogined = data?.[0]?.client_ipaddr
    if (msgCount > 0) return
    message.warning(`用户${hasLogined}登录，您已被动退出`);
    // 清除发射二次登录记录状态
    if (localStorage.getItem('reLoginStatus')) {
      localStorage.removeItem('reLoginStatus');
    }
    this.setState(prevState => ({
      msgCount: prevState.msgCount+1,
    }))
  }

  handleTimeoutCheckToken = () => {
    checkTokenTimer = setTimeout(() => {
      this.handleCheckToken()
    }, config.timerInterval3);
  }

  handleClearTimeoutCheckToken = () => {
    if (checkTokenTimer) {
      clearTimeout(checkTokenTimer)
      checkTokenTimer = null;
    }
  }

  updateSize() {
    const state = {
      width: window.innerWidth,
    };
    this.setState(state);
  }

  componentWillReceiveProps(nextProps) {
    const state = {};
    if (nextProps.location.pathname !== this.props.location.pathname) {
      const isCompany = nextProps.location.pathname === '/companyMode';
      this.setState({isCompany}, this.getMesaageInter)
    }
    if (!_.isEmpty(state)) this.setState(state);
  }

  updatePageStats = (location) => {
    const { matomoSetting } = config;
    const { pathname } = location;
    matomo({ pathUrl: window.location.href, pathName: this.menuMapping[pathname] || '' }, matomoSetting);
  }

  startMatomo = () => {
    const { history } = this.props;
    history.listen(this.updatePageStats);
  }

  updateDropdownVisible = (newData) => {
    this.setState(newData)
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  isUseSearchMenu() {
    return config.header.useSearchMenu;
  }

  clickReload = () => {
    window.location.reload()
  }

  /* eslint-disable */
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  /* eslint-enable */

  getUserIcon() {
    const { settings, onMenuClick } = this.props;
    const { isLoginedFlag } = this.state
    return <UserIcon isLoginedFlag={isLoginedFlag} userMenu={settings.userMenu} onMenuClick={onMenuClick} />
  }

  returnBgcColor = () => {
    const { bodyBgc } = this.state
    if (bodyBgc === 'rgb(255, 255, 255)') {
      return 'rgb(255, 255, 255)'
    } else if (bodyBgc === 'rgb(32, 31, 43)') {
      return 'rgb(32, 31, 43)'
    } else if (bodyBgc === 'rgb(25, 50, 90)') {
      return 'rgb(25, 50, 90)'
    }
  }

  returnFontColor = () => {
    const { bodyBgc } = this.state
    if (bodyBgc === 'rgb(255, 255, 255)') {
      return 'rgb(255, 255, 255)'
    } else if (bodyBgc === 'rgb(32, 31, 43)') {
      return '#89cad8'
    } else if (bodyBgc === 'rgb(25, 50, 90)') {
      return 'rgb(25, 50, 90)'
    }
  }

  renderMode = () => {
    const { isLoginedFlag } = this.state
    const isLogined = isLoginedFlag
    return (
      <span style={{ marginRight: 20 }} onClick={() => { }}>
        <Switch
          checked={isLogined}
          onClick={(checked) => this.handleCheckCapture(checked)}
          // style={{ width: 80 }}
          unCheckedChildren='仅浏览'
          checkedChildren='管理员'
        />
      </span>
    )
  }

  // () => onMenuClick(isLoginedKey)弹窗登录

  // 目前只有前端登录缓存token操作，如果浏览模式仅仅删除token缓存（单用户操作）
  // 多用户的话需要添加删除接口，请求头携带token (invalidate_lock_token)

  handleCheckCapture = (checked) => {
    const { dispatch } = this.props;
    if (!checked) {
      dispatch({type: 'main/updateState', payload: { token: null, loginFlag: false }});
      dispatch({type: 'main/updateLogout', payload: {}});
      this.removeTokenFetch();
      this.setState({ isLoginedFlag: false });
    } else {
      this.setState({loginVisible: true})
    }
  }

  handleLogin = (flag) => {
    if (flag) {
      const { dispatch } = this.props
      let params = {}
      params = {
        session_id: 1,
        Command: 'http_update_lock_token',
        scope: 'part',
      }
      rqHome.handleUserToken(params, (res) => {
        const response = parseJson(res, {})
        if (response.code === 0) {
          if (flag) {
            dispatch({
              type: 'main/updateState',
              payload: { token: response?.data, loginFlag: true },
            })
            this.setState({ isLoginedFlag: true, msgCount: 0 })
            localStorage.setItem('token', response?.data)
            if (ws) {
              ws.close();
              ws = null;
            }
          }
        } else {
          message.error(response.message || '切换失败')
        }
      })
    }
  }

  removeTokenFetch = () => {
    const { isRemoveTokening } = this.state;
    const params = {
      session_id: 1,
      Command: 'invalidate_lock_token',
      token: localStorage.getItem('token'),
    }
    if (!isRemoveTokening) {
      this.setState({
        isRemoveTokening: true,
      })
      rqHome.handleUserToken(params, res => {
        if (res.code === 0) {
          this.props.dispatch({
            type: 'main/updateState',
            payload: { hasLogined: res?.data },
          });
          message.success('退出成功')
          localStorage.removeItem('token')
          // 清除发射二次登录记录状态
          if (localStorage.getItem('reLoginStatus')) {
            localStorage.removeItem('reLoginStatus');
          }
          this.setState({
            isRemoveTokening: false,
          })
        } else {
          message.error(res.message);
          this.setState({
            isRemoveTokening: false,
          })
        }
      })
    }
  }

  handleClickOutside = (event) => {
    if (this.msgRef.current && !this.msgRef.current.contains(event.target)) {
      this.setState({ isList: false })
    }
  }

  renderMsg = () => {
    const { isList, warnList } = this.state
    const msgListData = warnList || []
    return (
      <span style={{ position: 'relative' }}>
        <Tooltip placement='topLeft' title={msgListData?.length === 0 ? '暂无消息' : null}>
          <Badge
            count={msgListData?.filter(item => item?.is_read === 0)?.length}
            onClick={this.toggleVisibility}
          >
            <span><Icon type='bell' style={{ color: '#ffffff', fontSize: '22px' }} /></span>
          </Badge>
        </Tooltip>
        {isList && msgListData?.length > 0 && this.renderMsgList()}
      </span>
    )
  }

  toggleVisibility = () => {
    this.setState((prevState) => ({ isList: !prevState.isList }))
  }

  allRead = () => {
    const msgListData = this.state.warnList
    const freqParams = { 'Command': 'set_all_carriers_freq_change_info', 'function_option': 'update' };
    if (msgListData?.filter(item => item?.is_read === 0)?.length > 0) {
      this.freqInfoWs.onSendWsMessage(freqParams);
    } else {
      message.info('当前暂无未读消息！')
    }
  }

  readMsg = (item) => {
    if ((!_.isUndefined(item?.carriers_freq_change_sn) || item?.carriers_freq_change_sn !== '') && item?.is_read !== 1) {
      const obj = {}
      obj.Command = 'set_some_carriers_freq_change_info';
      obj.function_option = 'update';
      obj.carriers_freq_change_sn_list = [item.carriers_freq_change_sn]
      this.freqInfoWs.onSendWsMessage(obj);
    }
  }

  onDel = (item) => {
    if (!_.isUndefined(item?.carriers_freq_change_sn) || item?.carriers_freq_change_sn !== '') {
      const obj = {}
      obj.Command = 'set_some_carriers_freq_change_info';
      obj.function_option = 'del';
      obj.carriers_freq_change_sn_list = [item.carriers_freq_change_sn]
      this.freqInfoWs.onSendWsMessage(obj);
    }
  }

  renderMsgList = () => {
    const msgListData = this.state.warnList
    return (
      <div style={{ position: 'absolute', top: '28px', left: '-90px', zIndex: '999' }} className='global_msg_content cancel-tabs' ref={this.msgRef}>
        {/* 多个tab时去除cancel-tabs */}
        <Tabs defaultActiveKey='1'>
          <TabPane />
          <TabPane tab={<div style={{ color: '#ffffff' }}>告警提示</div>} key='1'>
            <div className='cancel-list'>
              <List
                style={{ height: '400px', overflowY: 'auto', minHeight: '210px' }}
                dataSource={msgListData}
                renderItem={item => (
                  <List.Item>
                    <div style={{ width: '200px', padding: '10px', borderBottom: '1px solid #ffffff54' }}>
                      <div style={{ color: '#ffffff', display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                        { item?.is_read === 0 && <div className='red-dot' /> }
                      </div>
                      <div className='left-warp' style={{ color: '#ffffff' }}>{item?.carriers_freq_change_msg}</div>
                      <div className='flex-sb-center'>
                        <div style={{ color: '#ffffff' }}>{daysBetweenTimeAndToday(item?.update_time)}前</div>
                        <div className='flex-sb-center'>
                          {/* <div style={{ marginRight: '10px' }} onClick={() => this.onDel(item)}><Icon type='delete' /></div> */}
                          <div><Icon type='message' onClick={() => this.readMsg(item)} /></div>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />

            </div>
            <div style={{ position: 'fixed', height: '40px', lineHeight: '40px', width: '210px', paddingRight: '15px', cursor: 'pointer' }} className='global_msg_content'>
              <div onClick={this.allRead}>一键已读</div>
            </div>
          </TabPane>
          <TabPane />
        </Tabs>
      </div>
    )
  }

  handleGetServiceMessage = () => {
    this.clearTimeoutGetServiceMessage();
    const params = {}
    rqHome.handleGetServiceMessage(params, (res) => {
      this.handleTimeoutGetServiceMessage();
      if (!res) return;
      const response = parseJson(res, {})
      if (response?.code === 1) {
        const resData = response?.message || []
        const errorList = resData.filter(item => !item.active)
        this.setState({ programAlertNum: errorList.length })
      }
    })
  }

  getNtpMessage = () => {
    this.clearTimeoutGetNtpMessage();
    const { dispatch } = this.props
    const params = {};
    if (this.ntpRequestCount % 30 === 0) {
      rqHome.getNtpMessage(params, (res) => {
        this.handleTimeoutGetNtpMessage()
        if (!res) return;
        const response = parseJson(res, {})
        if (response?.code === 1) {
          const { now_time } = response.message
          this.setState({ ntpMessageData: response.message || {}, nowTime: now_time })
          dispatch({
            type: 'main/updateState',
            payload: { ntpMessageData: response.message || {} },
          })
        }
      })
    } else {
      const { ntpMessageData , nowTime } = this.state;
      const newTime = moment(nowTime).add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss');
      this.setState({
        nowTime: newTime,
        ntpMessageData:{...ntpMessageData, now_time: ntpMessageData},
      })
      this.handleTimeoutGetNtpMessage()
    }
    this.ntpRequestCount += 1;
  }

  handleTimeoutGetNtpMessage = () => {
    ntpMessageTimer = setTimeout(() => {
      this.getNtpMessage()
    }, config.timerInterval1);
  }

  clearTimeoutGetNtpMessage = () => {
    if (ntpMessageTimer) {
      clearTimeout(ntpMessageTimer);
      ntpMessageTimer = null;
    }
  }

  handleTimeoutGetServiceMessage = () => {
    serviceMessageTimer = setTimeout(() => {
      this.handleGetServiceMessage()
    }, 5000);
  }

  clearTimeoutGetServiceMessage = () => {
    if (serviceMessageTimer) {
      clearTimeout(serviceMessageTimer)
      serviceMessageTimer = null;
    }
  }

  renderProgramAlert = () => {
    const { programAlertNum } = this.state;
    if (!programAlertNum) return null;
    return (
      <div className='globalheader_bell_box' style={{position: 'relative'}}>
        <div className='custom_badge'>{programAlertNum}</div>
        <Tooltip title='程序异常'>
          <span>
            <Icon
              type='bell'
              theme='fill'
              onClick={() => this.handleOpenSystemProgram()}
              style={{ cursor: 'pointer', color: '#1890ff' }}
            />
          </span>
        </Tooltip>
      </div>
    )
  }

  handleOpenSystemProgram = () => {
    const { onMenuClick } = this.props;
    onMenuClick({ key: 'systemStatus' })
  }

  handleLoginVisible = (visible) => {
    this.setState({ loginVisible: visible })
  }

  returnHidden = (data, field) => {
    return data?.find(i => i?.key === field)?.hidden === '0'
  }

  getAllConfig = (flag) => {
    const params = {
      net_id: 1,
      session_id: 1,
      Command: 'get_column_type_params',
      params: {
        type: 'all_config_company_data',
      },
    }
    rqHome.dealColumnConfig(params, (res) => {
      if (res.code === 0) {
        const data = res?.data?.all_config_company_data || {}
        const mainControl = data?.mainControl?.map(i => (
          {
            ...i,
            text: i.label,
            name: i.key,
          }
        ))?.filter(j => j.hidden === '0') || []
        const payload = {
          allConfigCompanyData: data,
          couldChangeRfMod: this.returnHidden(data?.btnList, 'couldChangeRfMod'),
          offlineMode: this.returnHidden(data?.btnList, 'offlineMode'),
          syncInfo: this.returnHidden(data?.btnList, 'syncInfo'),
          EssInfoDisplay: this.returnHidden(data?.btnList, 'EssInfoDisplay'),
          haveSpectrumSweep: this.returnHidden(data?.btnList, 'haveSpectrumSweep'),
          IPFraInfoDisplay: this.returnHidden(data?.btnList, 'IPFraInfoDisplay'),
          frequencyShow: this.returnHidden(data?.btnList, 'frequencyShow'),
          adCardShow: this.returnHidden(data?.btnList, 'adCardShow'),
          adaptiveShow: this.returnHidden(data?.btnList, 'adaptiveShow'),
          netControlDemodulationShow: this.returnHidden(data?.btnList, 'netControlDemodulationShow'),
          columnSetting: this.returnHidden(data?.btnList, 'columnSetting'),
          vsatInfo: this.returnHidden(data?.btnList, 'vsatInfo'),
          higherConfig: this.returnHidden(data?.btnList, 'higherConfig'),
          averageDeep: this.returnHidden(data?.btnList, 'averageDeep'),
          spreadSpectrumShow: this.returnHidden(data?.btnList, 'spreadSpectrumShow'),
        }
        if (flag || config.isLocal) {
          payload.userMenu = mainControl.reverse();
        }

        this.props.dispatch({
          type: 'main/updateLogin',
          payload,
        })
      } else {
        message.error('获取数据失败')
      }
    })
  }

  handleGetShowMenu = (flag) => {
    this.getAllConfig(flag)
  }

  handleSysRestart = () => {
    confirm({
      title: `是否重启`,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        const params = {}
        rqHome.handleSysRestart(params, (res) => {
          const response = parseJson(res, {})
          if (response?.code === 1) {
            message.success('正在重启...')
          } else {
            message.error(response?.message || '重启失败')
          }
        })
      },
    });
  }

  handleSysShutdown = () => {
    confirm({
      title: `是否关机`,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        const params = {}
        rqHome.handleSysShutdown(params, (res) => {
          const response = parseJson(res, {})
          if (response?.code === 1) {
            message.success('正在关机...')
          } else {
            message.error(response?.message || '关机失败')
          }
        })
      },
    });
  }

  resetNrf = () => {
    confirm({
      title: `确定要一键重启nrf系统吗？`,
      okText: '是',
      cancelText: '否',
      onOk: () => {
        rqHome.resetNrf(null, res => {
          if (res.code === 1) {
            message.success('重启成功！')
          }
        })
      },
    });
  }

  renderMessageCard = () => {
    return <span onClick={this.openMessageCard}>{this.renderMessageContent()}</span>
  }

  openMessageCard = () => {
    this.setState({ isMessage: true })
  }

  sendMessage = () => {
    this.setState({ isSend: true })
  }

  delMessage = (i) => {
    const { messageData = [] } = this.state
    this.setState({ messageData: messageData?.filter(item => item.id !== i.id) })
    this.saveMesaageFetch(messageData?.filter(item => item.id !== i.id), 'del')
  }

  saveMesaageFetch = (data, type) => {
    const params = {
      net_id: 1,
      session_id: 1,
      Command: 'set_column_type_params',
      params: {
        type: 'all_message_data',
        config: JSON.stringify(data),
      },
    }
    rqHome.dealColumnConfig(params, (res) => {
      const response = parseJson(res, {})
      if (response?.code === 0) {
        message.success(type ? '删除成功' : '留言成功')
        this.setState({ isSend: false, messageValue: null }, this.getMesaageInter)
      } else {
        message.error(response?.message || '留言失败')
      }
    })
  }

  getMesaageInter = (str) => {
    const { isCompany } = this.state;
    if (!this.enhancedRequestInstance) {
      this.enhancedRequestInstance = createEnhancedRequest(this.getMesaageFetch, configInter, true);
    }
    if (!isCompany) {
      this.enhancedRequestInstance.start(
        (res) => {
          const md = res?.data?.all_message_data || [];
          const pm = {
            messageData: md,
          }
          if (!_.isEmpty(md) && str === 'first' && !_.isEqual(this.state.messageData, md)) {
            pm.isMessage = true;
          }
          this.setState(pm)
        },
        (error) => {
          console.log('外部获取到的请求失败结果:', error);
        }
      );
    } else {
      this.enhancedRequestInstance.stop()
    }
  }

  getMesaageFetch = () => {
    const params = {
      net_id: 1,
      session_id: 1,
      Command: 'get_column_type_params',
      params: {
        type: 'all_message_data',
      },
    }
    return rqHome.dealColumnConfig(params)
  }

  renderMessageList = () => {
    const { messageData = [], isLoginedFlag } = this.state;
    return (
      <>
        <div className='self-list'>
          <List
            style={{ border: '1px solid #fffefe24', height: '400px', overflowY: 'auto' }}
            dataSource={messageData}
            itemLayout='horizontal'
            bordered
            renderItem={item => (
              <List.Item>
                <div style={{ borderBottom: '1px solid #fffefe24', width: '100%', paddingLeft: '5px', paddingRight: '5px' }}>
                  <div style={{ fontSize: '15px', color: '#fff7f7' }}>{item.value}</div>
                  <div style={{ color: '#8f989ca1' }}>ip: {item.ip}<span style={{ marginLeft: '15px' }}>{item.time}</span>
                    {
                      isLoginedFlag ? (
                        <Tooltip title='删除该条留言'>
                          <Popconfirm
                            title='确定要删除该条留言吗?'
                            onConfirm={() => this.delMessage(item)}
                          >
                            <DeleteOutlined style={{ marginLeft: '15px', color: '#ff4747ba' }} />
                          </Popconfirm>
                        </Tooltip>
                      ) : <Tooltip title='请先登录'>  <DeleteOutlined style={{ marginLeft: '15px', color: '#ff4747ba' }} /></Tooltip>
                    }
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button style={{ marginBottom: '10px', marginTop: '10px' }} type='primary' onClick={this.sendMessage}>
            发布留言
          </Button>
        </div>
      </>
    )
  }

  handleSubmitMessage = () => {
    const { messageValue, messageData = [] } = this.state
    const client_ipaddr = this.props.hasLogined?.[0]?.client_ipaddr
    if (!messageValue) return message.error('请填写完整')
    // this.setState({ messageData: [{ ip: client_ipaddr, time: getNowTime(), value: messageValue, id: uuidv4() }, ...messageData] })
    this.saveMesaageFetch([{ ip: client_ipaddr, time: getNowTime(), value: messageValue, id: uuidv4() }, ...messageData])
  }

  changeMessage = (e) => {
    const value = e.target.value.trim()
    this.setState({ messageValue: value })
  }

  renderMessageContent = () => {
    const { messageData = [] } = this.state
    const ipLists = messageData?.sort((a, b) => a?.time - b?.time)
    return (
      <div style={{display: 'flex', alignItems: 'center', paddingLeft: 6, paddingRight: 6}}>
        {/* <img src={soundImg} /> &nbsp; */}
        <marquee scrollamount='5'>
          {ipLists?.[0]?.value || ''}
        </marquee>
      </div>
    )
  }

  renderNoMessage = () => {
    return (
      <Tooltip title='暂无留言， 点击留言'>
        {/* <img src={soundImg} style={{marginLeft: 5}} onClick={this.openMessageCard} /> */}
      </Tooltip>
    )
  }

  render () {
    const userIcon = this.getUserIcon();
    const { sendNetstationConfig } = this.props
    const { programAlertNum, programName, ntpMessageData, nowTime, loginVisible, isMessage, isSend, messageData = [], messageValue, delayTime, isCompany, isSpectrumIng, freqTipMsg, loadFreq } = this.state;

    // 从 context 获取主题颜色
    const themeCustom = this.context?.theme?.custom || {};
    const headerBg = themeCustom.headerBg || 'linear-gradient(to bottom, #164676, #2c73ba)';
    const headerBorderBg = themeCustom.headerBorderBg || 'linear-gradient(to bottom, #0e3f71, #0a3f74,#024378)';
    const headerBorderImage = themeCustom.headerBorderImage || 'linear-gradient(to right, #2c8cbd, #2272a3, #4777a0, #3e5e85, #253b60, #0b1b3c) 1 stretch';
    const textColor = themeCustom.textColor || '#ffffff';

    let currentDate = '--'
    let currentTime = '--'
    if (nowTime) {
      const timeStr = nowTime.split(' ')
      currentDate = timeStr[0]
      currentTime = timeStr[1]
    }
    let timeType = '';
    if ((ntpMessageData.b_switch && ntpMessageData.irigb)) {
      timeType = 'B码时间';
    } else if (ntpMessageData.ntp_switch) {
      timeType = 'NTP时间';
    } else {
      timeType = '本地时间';
    }

    return (
      <>
        <div className='global_header_content' style={{ width: '100%', display: 'flex' }}>
          <div
            style={{
              textAlign: 'center', fontSize: '24px',
              fontFamily: 'fantasy', color: 'white', padding: '0px 20px',
              background: headerBg,
              backgroundRepeat: 'no-repeat',
            }}
          >
            {programName}
          </div>
          <div
            style={{
              height: 40,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              borderBottom: '2px solid',
              justifyContent: 'space-between',
              background: headerBorderBg,
              borderImage: headerBorderImage,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '5%', color: textColor }}>
              <div style={{ width: 63, paddingLeft: 17, marginRight: 14, height: 14, lineHeight: '14px' }}>1PPS</div>
              <div style={{ width: 63, paddingLeft: 17, marginRight: 14, height: 14, lineHeight: '14px' }}>10M</div>
              {timeType}<span className='time_color' style={{ fontSize: 14, marginLeft: 10 }}>{currentDate}&nbsp;{currentTime}</span>
              {String(sendNetstationConfig.isShowSystemDelay) === '1' && (
                <span style={{ fontSize: 14, marginLeft: 5, marginRight: 14 }}>
                  <span>系统延时: <span className='time_color'>{delayTime}</span></span>
                </span>
              )}
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              {!isCompany && (
                <div className={styles.globalHeaderNotice}>
                  {messageData?.length > 0 ? this.renderMessageCard() : this.renderNoMessage()}
                </div>
              )}
              {!isCompany && this.renderMode()}
              {!isCompany && this.renderProgramAlert()}
              {!isCompany && userIcon}
              {isCompany && (
                <div>
                  <span style={{ color: textColor, marginRight: 20 }}>厂商模式 </span>
                  <img style={{ width: 21, height: 21 }} src={rule} />
                </div>
              )}
            </div>
          </div>
          {loginVisible && (
            <LoginModal
              programAlertNum={programAlertNum}
              handleGetShowMenu={this.handleGetShowMenu}
              modalVisible={loginVisible}
              handleLogin={this.handleLogin}
              handleModalVisible={this.handleLoginVisible}
            />
          )}
          <AutoSizeDialog
            title='留言板'
            visible={isMessage}
            width={650}
            maxHeight={450}
            onCancel={() => this.setState({ isMessage: false })}
            closable
            noFooter
          >
            {this.renderMessageList()}
          </AutoSizeDialog>
          <AutoSizeDialog
            title='留言'
            visible={isSend}
            width={450}
            maxHeight={250}
            onCancel={() => this.setState({ isSend: false })}
            closable
            onOk={this.handleSubmitMessage}
          >
            <TextArea rows={10} onChange={this.changeMessage} value={messageValue} />
          </AutoSizeDialog>
        </div>
      </>
    );
  }
}
