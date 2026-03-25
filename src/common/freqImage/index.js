import React, { Component } from 'react';
import { connect } from 'dva';
import { createWebSocket } from 'utils/websocket';
import { parseJson, handleThrottle } from 'utils/utils';
import config from 'utils/config';
import _ from 'lodash';
import { Button, message, notification, Checkbox, Tooltip, Spin } from 'antd';
import FreqLoading from 'assets/freqLoading.png';

let isMouseMove = false;
const styleMapping = {
  spec2rain: '2', spec: '0', rain: '1', wave: '3',
}

const labelMapping = {
  '0': '频谱',
  '1': '实时时频',
  '2': '综合',
  '3': '波形',
}

@connect(({ main }) => ({
  adConfig: main.adConfig,
  isCloseSocket: main.isCloseSocket,
  commonStatusData: main.commonStatusData || {},
  // hasLogined: main.hasLogined || [],
}))

class FreqImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      startPointerPositionX: null,
      startPointerPositionY: null,
      currentNode: props.currentNode || {},
      willCmd: 'spectrumrt',
      localCmd: 'spectrumrt',
      localStyle: '0',
      willStyle: '',
      canReceive: false,
      isDrawer: false,
      localChannelId: props.currentCH,
      willChannelId: props.currentCH,
      isInitWave: false, // 波形图加载状态记录
      isInitSpectrumrt: false, // 频谱图加载状态记录
      chList: this.initAdCardInfo(props.adGuardInfo || []),
    };
    this.offsetWidth = 0;
    this.offsetHeight = 0;
    this.srcw = window.innerWidth;
    this.srch = window.innerHeight;
    this.imgw = props.imgw || '1336';
    this.imgh = props.imgh || '226';
    if (!_.isUndefined(props.currentCH) && props.currentCH !== '') this.handleInitConnect(props);
    this.initConnected = false;
    if (props.parent) {
      props.parent.handleSendCloseWs = this.handleSendCloseWs;
      props.parent.handleHighLight = this.handleHighLight
    }
    this.index = 0;
    this.wsErrorStatus = 0;
    this.ws2ErrorStatus = 0;
    this.second = new Date().getTime();
  }

  initAdCardInfo = (arr) => {
    const list = [];
    for (const i of arr) {
      if (i.node_rf_conn) {
        for (const j of i.node_rf_conn) {
          if (j.dst_type === 'ad') {
            list.push(`${j.ad_info?.adc_guard_ip}_${j.ad_info?.ad_port_id}`)
          }
        }
      } else if (i.ip) {
        list.push(`${i.ip}_${i.ad_port_id}`)
      }
    }
    return list;
  }

  componentDidMount() {
    const master = localStorage.getItem('master') || false
    const small = localStorage.getItem('small') || false
    this.setState({ smallChecked: JSON.parse(small), masterChecked: JSON.parse(master) })
    if (this.props.onRef) {
      this.props.onRef(this);
    }

    const shadowBox = document.getElementById('imgShadow');
    if (shadowBox && !this.props.readyOnly && this.props.allowOperation) {
      shadowBox.onwheel = handleThrottle(this.handleScrollWheel, 50);
      shadowBox.addEventListener('mousedown', this.handleMouseDown);
      shadowBox.addEventListener('mousemove', this.handleMouseMove);
      shadowBox.addEventListener('mouseup', this.handleMouseUp);
      shadowBox.addEventListener('click', this.handleClickPic);
      shadowBox.addEventListener('dblclick', this.handleDoubleClick);
    }
  }

  componentWillUnmount() {
    if (this.ws && String(this.ws.readyState) === '1') {
      this.ws.send(`cmd=clearmarkfreq,CH=${this.props.currentCH},style=0`)
    }
    this.setState({ smallChecked: false, masterChecked: false })
    localStorage.setItem('small', false)
    localStorage.setItem('master', false)
    if (this.newSwitchTimer) {
      clearTimeout(this.newSwitchTimer)
    };
    if (this.countInterval) {
      clearTimeout(this.countInterval)
    };

    if (this.wsErrorTimer) {
      clearTimeout(this.wsErrorTimer)
    };

    if (this.ws2ErrorTimer) {
      clearTimeout(this.ws2ErrorTimer)
    };
    this.closed = true;
    this.handleComplexClear();
  }

  changeStyleOrCmd = () => {
    const { selectedFreqOptions, isHideWs2 } = this.props;
    const { localCmd, localStyle, localChannelId } = this.state;
    if (selectedFreqOptions.cmd === localCmd && localStyle === selectedFreqOptions.style) return false;
    const ws2 = !isHideWs2 ? this.ws2 : this.ws;
    const nWs = selectedFreqOptions.cmd === 'wave' ? ws2 : this.ws;
    if (selectedFreqOptions.cmd !== localCmd) {
      const ws = localCmd === 'wave' ? ws2 : this.ws;
      ws.send(`cmd=stopshow,CH=${localChannelId},style=${localStyle}`)
    }
    setTimeout(() => {
      const str = `scrw=${this.srcw},scrh=${this.srch},imgw=${this.imgw},imgh=${this.imgh},cmd=startshow,type=${selectedFreqOptions.cmd},style=${selectedFreqOptions.style},CH=${localChannelId}`;
      const str2 = `cmd=setspecparam,CH=${localChannelId},maxhold=1,minhold=0,avghold=1,rtmhold=0,avgdeep=10`;
      nWs.send(str)
      if (selectedFreqOptions.cmd !== 'wave') {
        nWs.send(str2)
      }
    }, 200)
  }

  changeChannel = () => {
    const { currentCH, isHideWs2 } = this.props;
    const { localCmd, localStyle, localChannelId } = this.state;

    if (!isHideWs2) {
      if (localCmd === 'wave' && this.ws2 && String(this.ws2.readyState) === '1') this.ws2.send(`cmd=stopshow,CH=${localChannelId},style=3`);
      setTimeout(() => {
        if (localCmd === 'wave' && this.ws2 && String(this.ws2.readyState) === '1') this.ws2.send(`cmd=startshow,style=3,CH=${currentCH}`);
      }, 200);
    }
    if (localCmd != 'wave' && this.ws && String(this.ws.readyState) === '1') this.ws.send(`cmd=stopshow,CH=${localChannelId},style=${localStyle}`);
    setTimeout(() => {
      if (localCmd != 'wave' && this.ws && String(this.ws.readyState) === '1') this.ws.send(`cmd=startshow,CH=${currentCH},style=${localStyle}`);
      if (localCmd != 'wave' && this.ws && String(this.ws.readyState) === '1') this.ws.send(`cmd=setspecparam,CH=${currentCH},maxhold=1,minhold=0,avghold=1,rtmhold=0,avgdeep=10`);
    }, 200);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.isInitWave !== this.state.isInitWave || prevState.isInitSpectrumrt !== this.state.isInitSpectrumrt) {
      // 说明频谱图跟波形图的运行状态都查询完成了，根据查询结果重新处理参数
      if (this.state.isInitSpectrumrt && this.state.isInitWave) {
        this.sendCreateMessage()
      }
    }
    const options = this.props.selectedFreqOptions || {};
    const oOptions = prevProps.selectedFreqOptions || {};
    if (this.props.isLogin && (oOptions.cmd != options.cmd || oOptions.style != options.style)) {
      this.changeStyleOrCmd();
    }

    if (this.props.currentCH != prevProps.currentCH && !_.isUndefined(this.props.currentCH) && this.props.isLogin) {
      this.changeChannel()
    }
  }

  componentWillReceiveProps(nextProps) {
    const isLogin = nextProps.isLogin;
    const selectedFreqOptions = this.props.selectedFreqOptions || {};
    const nSelectedFreqOptions = nextProps.selectedFreqOptions || {};
    if (nSelectedFreqOptions.style != selectedFreqOptions.style) {
      message.info(`即将为您切换到${nSelectedFreqOptions.label || labelMapping[nSelectedFreqOptions.style]}`)
      this.setState({willCmd: nSelectedFreqOptions.cmd, willStyle: nSelectedFreqOptions.style})
    }

    if (this.props.isCloseSocket != nextProps.isCloseSocket) {
      if (this.ws) {
        this.ws.onCloseWs()
      }
      if (this.ws2) {
        this.ws2.onCloseWs()
      }
    }
    if (this.props.url != nextProps.url) {
      // if (this.ws && this.ws.readyState === 1 && isLogin && this.state.localStyle != 3) {
      //   this.ws.send(`cmd=stopshow,CH=${this.state.localChannelId},style=${this.state.localStyle}`)
      // }
      // if (this.ws2 && this.ws2.readyState === 1 && isLogin) {
      //   this.ws2.send(`cmd=stopshow,CH=${this.state.localChannelId},style=3`)
      // }
      if (this.ws) {
        this.ws.onCloseWs();
        this.ws = null;
      };
      if (this.ws2) {
        this.ws2.onCloseWs();
        this.ws2 = null;
      };

      const state = {
        willCmd: 'spectrumrt',
        localCmd: 'spectrumrt',
        localStyle: '0',
        willStyle: '',
        canReceive: false,
        isDrawer: false,
        waveInitStatus: {}, isInitWave: false,
        spectrumrtInitStatus: {}, isInitSpectrumrt: false,
        localChannelId: nextProps.currentCH,
        willChannelId: nextProps.currentCH,

      }
      this.setState({localChannelId: nextProps.currentCH, ...state}, () => {
        this.handleInitConnect(nextProps)
      })
    }

    if (this.props.isReconnect !== nextProps.isReconnect) {
      this.handleComplexClear();
      this.handleInitConnect(nextProps);
    }

    if (this.props.currentCH !== nextProps.currentCH && !_.isUndefined(nextProps.currentCH) && nextProps.isLogin) {
      this.setState({willChannelId: nextProps.currentCH})
    }
  }

  handleResetSpectrumrtLine = () => {
    const { selectedFreqOptions, currentCH } = this.props;
    if (selectedFreqOptions.cmd !== 'wave') {
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(`cmd=reset_history,CH=${currentCH}`)
      }
    }
  }

  handleReStart = () => {
    const { selectedFreqOptions, currentCH, isLogin } = this.props;
    if (selectedFreqOptions.cmd === 'wave') {
      if (this.ws2 && this.ws2.readyState === 1) {
        if (isLogin) this.ws2.send(`cmd=startshow,CH=${currentCH},style=3`)
      }
    } else if (this.ws && this.ws.readyState === 1) {
      if (isLogin) this.ws.send(`cmd=startshow,CH=${currentCH},style=${selectedFreqOptions.style}`)
      if (isLogin) this.ws.send(`cmd=setspecparam,CH=${currentCH},maxhold=1,minhold=0,avghold=1,rtmhold=0,avgdeep=10`);
      if (isLogin) this.ws.send(`cmd=clearmarkfreq,CH=${currentCH},style=0`);
    }
  }

  handleHighLight = (record) => {
    const { selectedFreqOptions, currentCH, isLogin } = this.props;
    if (!isLogin && selectedFreqOptions.style === "0") return message.warning("当前浏览模式不支持频谱高亮显示")
    const { symbol_rate, if_freq } = record
    if (selectedFreqOptions.style === "0" && this.ws && this.ws.readyState === 1) {
      if (isLogin) this.ws.send(`cmd=setmarkfreq,CH=${currentCH},style=${selectedFreqOptions.style},freq=${if_freq * 1000},symbolrate=${symbol_rate}`)
    }
  }

  sendCreateMessage = () => {
    const { isLogin, url='', hasLogined=[]} = this.props;
    const { waveInitStatus, spectrumrtInitStatus, localChannelId, isHideWs2, chList } = this.state;
    const waveChannels = parseJson(waveInitStatus.running, []);
    const spectrumrtChannels = parseJson(spectrumrtInitStatus.running, []);
    const ipStr = url.split(':')[1] || '';
    if (waveChannels.includes(1) || spectrumrtChannels.includes(1)) {
      // 说明后端画图服务是开启的不需要start, 但是无法获取明确的运行类型，只能根据返回的数据重新设置运行类型及运行通道等信息
      const runningStatus = waveChannels.includes(1) ? 'wave' : 'spectrumrt';
      const idx = waveChannels.indexOf(1);
      const idx2 = spectrumrtChannels.indexOf(1);
      const state = {runningStatus, canReceive: true};
      if (!isHideWs2 && runningStatus === 'wave' && idx != -1) {
        if (localChannelId != idx) {
          const currentIpAndRfPort = `${ipStr.substr(2)}_${idx}`
          if (!isLogin && chList.length > 0 && !chList.includes(currentIpAndRfPort)) {
            this.setState({isLoading: false})
            return message.info(`波形图被已登录用户切换至AD${localChannelId}，当前处于未登录状态，无法查看，请登录后查看波形图。`)
          }
          if (isLogin) {
            state.willCmd = 'wave';
            state.willStyle = '3';
            state.willChannelId = localChannelId * 1;
            this.ws2.send(`cmd=stopshow,CH=${idx},style=3`)
            this.ws2.send(`cmjd=startshow,CH=${localChannelId},style=3`)
          } else {
            state.willCmd = 'wave';
            state.willStyle = '3';
            state.willChannelId = idx;
            this.ws2.send(`cmd=get_status,CH=${idx}`);
          }
        }

      } else if (runningStatus === 'spectrumrt' && idx2 != -1) {
        if (localChannelId != idx2) {
          const currentIpAndRfPort = `${ipStr.substr(2)}_${idx2}`
          if (!isLogin && chList.length > 0 && !chList.includes(currentIpAndRfPort)) {
            this.setState({isLoading: false})
            return message.info(`频谱图被已登录用户切换至AD${localChannelId}，当前处于未登录状态，无法查看，请登录后查看频谱图。`)
          }
          if (isLogin) {
            state.willCmd = 'spectrumrt';
            state.willStyle = '0';
            state.willChannelId = localChannelId * 1;
            this.ws.send(`cmd=stopshow,CH=${idx2},style=${this.state.localStyle}`)
            this.ws.send(`cmd=startshow,CH=${localChannelId},style=0`);
            this.ws.send(`cmd=setspecparam,CH=${localChannelId},maxhold=1,minhold=0,avghold=1,rtmhold=0,avgdeep=10`);
          } else {
            state.willCmd = 'spectrumrt';
            state.willChannelId = idx2;
            this.ws.send(`cmd=get_status,CH=${idx2}`);
          }
        }
      }
      this.setState(state)
    } else if (this.ws && String(this.ws.readyState) === '1') {
      // 说明从来没有开启过，那就开启通道0的频谱图
      // this.ws2.send('cmd=startshow,CH=0,style=3');
      this.ws.send(`cmd=startshow,CH=${this.props.currentCH},style=0`);
      this.ws.send(`cmd=setspecparam,CH=${this.props.currentCH},maxhold=1,minhold=0,avghold=1,rtmhold=0,avgdeep=10`);
      spectrumrtChannels[0] = 1;
      this.setState({willChannelId: this.props.currentCH, willCmd: 'spectrumrt', willStyle: '0', canReceive: true, spectrumrtInitStatus: {...spectrumrtInitStatus, running: JSON.stringify(spectrumrtChannels)}})
    }
    this.initConnected = true;
  }

  handleInitConnect = (nextProps) => {
    const { url, isHideWs2, CH } = nextProps || this.props;
    let localChannelId = this.state.localChannelId;
    // if (localChannelId != currentCH)
    const waveParams = `node=0,type=wave,cmd=init,scrw=${this.srcw},scrh=${this.srch},imgw=${this.imgw},imgh=${this.imgh},CH=${localChannelId}`;
    const spectrumrtParams = `node=0,type=spectrumrt,cmd=init,scrw=${this.srcw},scrh=${this.srch},imgw=${this.imgw},imgh=${this.imgh},CH=${localChannelId}`;
    if (url) {
      const suffix = [`cmd=get_status,CH=${localChannelId}`];
      const ws = createWebSocket(url, spectrumrtParams, (msg) => {
        const res = parseJson(msg, {});
        this.wsErrorStatus = 0;
        if (!this.state.isInitSpectrumrt && res.type === 'running_status') {
          this.setState({spectrumrtInitStatus: res, isInitSpectrumrt: true})
        } else if (this.state.canReceive) {
          this.getImageSrc(res, 'spectrumrt')
        }
      }, suffix);

      if (!isHideWs2) {
        const ws2 = createWebSocket(url, waveParams, (msg) => {
          this.ws2ErrorStatus = 0;
          const res = parseJson(msg, {})
          if (!this.state.isInitWave && res.type === 'running_status') {
            this.setState({waveInitStatus: res, isInitWave: true})
          } else if (this.state.canReceive) {
            this.getImageSrc(res, 'wave')
          }
        }, suffix);
        ws2.onclose = (event) => this.onCloseWs(event, 'ws2');
        this.ws2 = ws2;
      }
      ws.onclose = (event) => this.onCloseWs(event, 'ws');
      this.ws = ws;
    }
  }

  onCloseWs = (event, k) => {
    if (event.code === 1006) {
      // 异常关闭重新开启
      const mapping = {ws: this.ws2, ws2: this.ws};
      const cws = mapping[k];
      if (cws && cws.readyState != 3) {
        cws.onCloseWs()
      }
      if (this.closed || this[`${k}ErrorStatus`]  > 5) {
        this.setState({isLoading: false})
        if (!this.freqImageError) {
         this.freqImageError = message.error(config.freqImageError || '频谱图程序异常，请重启sa2gent服务！', 5)
        }
        return false;
      }
      if (this[`${k}ErrorTimer`]) clearTimeout(this[`${k}ErrorTimer`]);
      this[`${k}ErrorTimer`] = setTimeout(() => {
        if (!this.closed && this[`${k}ErrorStatus`]  < 5) {
          this.handleInitConnect()
        }
        // 异常关闭后重连，连续五次重连失败就不再重连
      }, this[`${k}ErrorStatus`]  < 1 ? 100 : 2000)
      this[`${k}ErrorStatus`] += 1;
    }
  }

  handleSendCloseWs = () => {
    const selectedFreqOptions = this.props.selectedFreqOptions || {};
    const { currentCH, isLogin } = this.props
    if (this.ws && this.ws.readyState === 1 && isLogin) {
      this.ws.send(`cmd=stopshow,CH=${currentCH},style=${selectedFreqOptions.style}`)
    }
    if (this.ws2 && this.ws2.readyState === 1 && isLogin) {
      this.ws2.send(`cmd=stopshow,CH=${currentCH},style=${selectedFreqOptions.style}`)
    }
  }

  handleComplexClear = () => {
    const selectedFreqOptions = this.props.selectedFreqOptions || {};
    const { currentCH, isLogin } = this.props
    if (this.ws && this.ws.readyState === 1) {
      // this.ws.send(`cmd=stopshow,CH=${currentCH},style=0`)
      this.ws.onCloseWs()
    }
    if (this.ws2 && this.ws2.readyState === 1) {
      // this.ws2.send(`cmd=stopshow,CH=${currentCH},style=3`)
      this.ws2.onCloseWs()
    }
    this.clearTimer()
  }

  handleSendCommand = (type, commandStr) => {
    if (type === '1') {
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(commandStr);
      }
    } else if (this.ws2 && this.ws2.readyState === 1) {
      this.ws2.send(commandStr);
    }
  }

  clearTimer = () => {
    if (this.wsTimer) clearInterval(this.wsTimer)
  }

  drawShadowImg = (shadowNode) => {
    const { currentNode } = this.state;
    const { width, height } = this.props;
    if (!currentNode || !currentNode.task_id) return false;
    if (!shadowNode) return false;
    if (this.ws && this.ws.readyState === 1 && this.ws.onSendWsMessage) {
      let str = `imgw=${width},imgh=${height},cmd=focus,freq=${shadowNode.f_lnb},bw=${shadowNode.bw}`;
      const fields = ['task_id', 'task_line_id', 'task_line_md5'];
      for (const i of fields) {
        str += `,${i}=${currentNode[i]}`;
      }
      this.ws.send(str)
    }
  }

  handleReload = () => {
    window.location.reload();
  }

  getImageSrc = (res, cmd) => {
    const { getData } = this.props;
    if (!this.state.canReceive) return false;
    if (res.cmd === 'switch_old' && res.warning) {
      this.handleComplexClear();
      if (this.props.handleClearSocket) {
        this.props.handleClearSocket();
      }
      const notifiBtn = (
        <Button type="primary" size="small" onClick={this.handleReload}>重载</Button>
      )
      notification.warning({
        key: res.cmd,
        message: '注意',
        description: res.warning,
        duration: null,
        btn: notifiBtn,
      })
    } else if (res.cmd === 'switch_new' && res.warning) {
      if (this.newSwitchTimer) clearTimeout(this.newSwitchTimer)
      this.newSwitchTimer = setTimeout(() => {
        return message.warning(res.warning);
      }, 200)
    }

    if (res.img) {
      if (!this.state.canReceive) return false;
      const { willCmd, willStyle, willChannelId } = this.state;
      if (this.props.isLogin && (willCmd != cmd || (willStyle && String(willStyle) != String(styleMapping[res.type])) || res.channel_id != willChannelId)) {
        if (getData) getData(false, true);
        this.setState({ isLoading: true })
      } else {
        this.setState({ isLoading: false, imageSrc: res.img, localChannelId: res.channel_id, localCmd: cmd, localStyle: styleMapping[res.type] }, () => {
          if (getData) getData({ cmd, style: styleMapping[res.type], key: styleMapping[res.type], currentCH: res.channel_id }, false);
        })
      }
    } else if (res.type === 'running_status') {
      const currentStatus = cmd === 'wave' ? this.state.waveInitStatus : this.state.spectrumrtInitStatus;
      if (currentStatus.running != res.running && !this.props.isLogin) {
        this.setState({isInitSpectrumrt: false, isInitWave: false, canReceive: false})
      }
    } else if (res.type === 'warning') {
      return message.error(res.message)
    }
  }

  handleScrollWheel = (e) => {
    const { currentCH } = this.props
    const wheelDelta = e.wheelDelta;
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    let zoomValue = 1;
    if (wheelDelta > 0) {
      // zoomValue = Number(defaultZoomValue) - zoomStep;
      zoomValue = 1
    } else if (wheelDelta < 0) {
      // zoomValue = Number(defaultZoomValue) + zoomStep;
      zoomValue = -1
    }
    if (config.freqImgZoomRange && !_.isEmpty(config.freqImgZoomRange)) {
      const zoomRange = config.freqImgZoomRange;
      if (Number(zoomValue) > zoomRange[1]) {
        // zoomValue = zoomRange[1];
        zoomValue = 1
      }
      if (Number(zoomValue) < zoomRange[0]) {
        // zoomValue = zoomRange[0];
        zoomValue = -1
      }
    }
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(`cmd=mousescroll,CH=${currentCH},mx=${currentX},my=${currentY},scale=${zoomValue}`);
    }
  }

  handleMouseDown = (e) => {
    const { selectedFreqOptions } = this.props
    if (selectedFreqOptions.cmd != 'spectrumrt') return
    e.preventDefault()
    this.setState({
      startPointerPositionX: e.clientX,
      startPointerPositionY: e.clientY,
    });
    this.offsetWidth = e.clientX - e.offsetX;
    this.offsetHeight = e.clientY - e.offsetY;
    this.startPoint = { x: e.offsetX, y: e.offsetY };

    if (!this.state.isDrawer) {
      this.setState({ isDrawer: true })
    } else {
      this.setState({ isDrawer: false })
    }
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    this.setState({ startPositionX: currentX, startPositionY: currentY })
    const { currentCH } = this.props
    if (this.mouseDownTimer) clearTimeout(this.mouseDownTimer);
    this.mouseDownTimer = setTimeout(() => {
      if (this.ws && this.ws.readyState === 1) {
        // 校准
        this.ws.send(`cmd=mouseldown,CH=${currentCH},mx=${currentX},my=${currentY}`);
      }
    }, 300)
  };

  handleMouseMove = (e) => {
    const { selectedFreqOptions } = this.props
    if (selectedFreqOptions.cmd != 'spectrumrt') return
    const width = this.props.width;
    const height = this.props.height;
    if (this.state.startPointerPositionX !== null) {
      // 向右边界处理
      let clientX = e.clientX > this.offsetWidth + width ? this.offsetWidth + width : e.clientX;

      // 向下边界处理
      let clientY = e.clientY > this.offsetHeight + height ? this.offsetHeight + height : e.clientY;

      // 向左边界处理
      if (clientX - this.offsetWidth < 0) {
        clientX = this.offsetWidth;
      }
      // 向上边界处理
      if (clientY - this.offsetHeight < 0) {
        clientY = this.offsetHeight;
      }
      const startX = this.state.startPointerPositionX;
      const startY = this.state.startPointerPositionY;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      this.setState({ deltaX, deltaY })
    }
  };

  handleMouseUp = (e) => {
    const { selectedFreqOptions } = this.props
    if (selectedFreqOptions.cmd != 'spectrumrt') return
    const deltaX = this.state.deltaX;
    const deltaY = this.state.deltaY;
    const width = this.props.width;
    const height = this.props.height;

    // 向右边界处理

    let clientX = e.clientX > this.offsetWidth + width ? this.offsetWidth + width : e.clientX;

    let clientY = e.clientY > this.offsetHeight + height ? this.offsetHeight + height : e.clientY;

    // 向左边界处理
    if (clientX - this.offsetWidth < 0) {
      clientX = this.offsetWidth;
    }

    if (clientY - this.offsetHeight < 0) {
      clientY = this.offsetHeight;
    }

    e.preventDefault()
    const { currentCH } = this.props
    if (this.mouseUpTimer) clearTimeout(this.mouseUpTimer);
    this.mouseUpTimer = setTimeout(() => {
      const currentX = e.offsetX;
      const currentY = e.offsetY;

      const isBigX = this.state.startPositionX > currentX
      const isBigY = this.state.startPositionY > currentY
      if (this.ws && this.ws.readyState === 1 && (isBigX || isBigY)) {
        // this.ws.send(`cmd=mouseldown,CH=${currentCH},mx=${currentX + 40},my=${currentY}`);
        this.ws.send(`cmd=mouseldown,CH=${currentCH},mx=${currentX},my=${currentY}`);
      }

      if (this.ws && this.ws.readyState === 1) {
        // this.ws.send(`cmd=mouselup,CH=${currentCH},mx=${currentX},my=${currentY}`);
        // this.ws.send(`cmd=mouselup,CH=${currentCH},mx=${isBigX ? this.state.startPositionX : currentX + 40},my=${isBigY ? this.state.startPositionY : currentY}`);
        this.ws.send(`cmd=mouselup,CH=${currentCH},mx=${isBigX ? this.state.startPositionX : currentX},my=${isBigY ? this.state.startPositionY : currentY}`);

      }
      if (isMouseMove) {
        if (this.ws && this.ws.readyState === 1) {
          // this.ws.send(`cmd=mousemove,CH=${currentCH},mxs=${startX},mys=${startY},mxe=${currentX},mye=${currentY}`);
          // this.ws.send(`cmd=mousemove,CH=${currentCH},mxs=${Math.abs(deltaX)},mys=${Math.abs(deltaY)},mxe=${currentX + 40},mye=${currentY}`);
          this.ws.send(`cmd=mousemove,CH=${currentCH},mxs=${Math.abs(deltaX)},mys=${Math.abs(deltaY)},mxe=${currentX},mye=${currentY}`);
        }
        isMouseMove = false;
      }
    }, 300)
    this.setState({
      deltaX: 0,
      deltaY: 0,
      startPointerPositionX: null,
      startPointerPositionY: null,
    });
  };

  handleDoubleClick = (e) => {
    const { currentCH } = this.props
    if (this.mouseDownTimer) clearTimeout(this.mouseDownTimer);
    if (this.mouseUpTimer) clearTimeout(this.mouseUpTimer);
    const currentX = e.offsetX;
    const currentY = e.offsetY;
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(`cmd=mouseldclk,CH=${currentCH},mx=${currentX},my=${currentY}`);
    }
  }

  handleClickPic = () => {
    // console.log(e, '单击事件')
  }

  renderMarker = (value) => {
    return (
      <div
        key={`marker-${value}`}
        className="marker"
        onClick={() => this.handleMarkerClick(value)}
      >
        <div className="marker-indicator" />
        <span className="marker-label">{value}</span>
      </div>
    );
  };

  handleMarkerClick = (value) => {
    // 判断是否有经度标记
    if (this.hasMarker(value)) {
      // 获取整数经度值
      // 获取属于这个整数的小数经度值
      this.props.onMarkerClick(value)
    }
  };

  createCustomRef = (ref, key) => {
    this[key] = ref;
  }

  handleHighLightMast = (e, type) => {
    const { commonStatusData, currentCH } = this.props
    const { masterChecked, smallChecked } = this.state
    const adConfig = commonStatusData.ad_config || [];
    const value = e.target.checked
    const dvbList = this.transformArrary() || []
    const isDvb = dvbList?.length === 1
    const freqNormal = dvbList?.[0]?.if_freq / 1000
    if (isDvb && (freqNormal < 100 || freqNormal > 200) && type === 'master' && value) return message.error(`dvb主校区L流量转换成公用${dvbList?.[0]?.if_freq}值超过范围，请检查变频器中心流量`)
    const dvbPortList = dvbList || []
    const masterDvbList = dvbPortList.filter(i => i.vsat_id === this.props.currentNet.vsat_id) || []
    const smallDvbList = dvbPortList.filter(i => i.vsat_id !== this.props.currentNet.vsat_id) || []
    const list = adConfig.filter(item => String(item?.ad_port_id) === String(currentCH)) || []
    const masterList = list.filter(i => String(i.is_master) === '1') || []
    const smallList = list.filter(i => String(i.is_master) !== '1') || []
    const uList = type === 'master' ? masterList : smallList
    const uDvbList = type === 'master' ? masterDvbList : smallDvbList
    const uCmdList = uList?.concat(uDvbList)
    const usmallList = smallList?.concat(smallDvbList)
    const umasterList = masterList?.concat(masterDvbList)
    if (this.ws && this.ws.readyState === 1) {
      if (value) {
        this.ws.send(`cmd=clearmarkfreq,CH=${currentCH},style=0`)
        uCmdList.forEach(i => {
          this.ws.send(`cmd=hightmarkfreq,CH=${currentCH},style=${0},freq=${i?.if_freq * 1000},symbolrate=${i?.symbol_rate},color=${type === 'master' ? 7 : 4}`)
        })
      } else {
        this.ws.send(`cmd=clearmarkfreq,CH=${currentCH},style=0`)
      }
      if (type === 'master') {
        this.setState({ masterChecked: value })
      } else {
        this.setState({ smallChecked: value })
      }

      if ((type === 'master' && smallChecked && !value)) {
        this.ws.send(`cmd=clearmarkfreq,CH=${currentCH},style=0`)
        usmallList.forEach(i => {
          this.ws.send(`cmd=hightmarkfreq,CH=${currentCH},style=${0},freq=${i?.if_freq * 1000},symbolrate=${i?.symbol_rate},color=4`)
        })
      }
      if ((type === 'small' && masterChecked && !value)) {
        this.ws.send(`cmd=clearmarkfreq,CH=${currentCH},style=0`)
        umasterList.forEach(i => {
          this.ws.send(`cmd=hightmarkfreq,CH=${currentCH},style=${0},freq=${i?.if_freq * 1000},symbolrate=${i?.symbol_rate},color=7`)
        })
      }

      if ((type === 'master' && smallChecked && value) || (type === 'small' && masterChecked && value)) {
        this.ws.send(`cmd=clearmarkfreq,CH=${currentCH},style=0`)
        usmallList.forEach(i => {
          this.ws.send(`cmd=hightmarkfreq,CH=${currentCH},style=${0},freq=${i?.if_freq * 1000},symbolrate=${i?.symbol_rate},color=4`)
        })
        umasterList.forEach(i => {
          this.ws.send(`cmd=hightmarkfreq,CH=${currentCH},style=${0},freq=${i?.if_freq * 1000},symbolrate=${i?.symbol_rate},color=7`)
        })
      }
    }
    localStorage.setItem(type, value)
  }

  clearMarkFreq = () => {
    const { currentCH } = this.props;
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(`cmd=clearmarkfreq,CH=${currentCH},style=0`);
    }
  }

  transformArrary = () => {
    const { commonStatusData } = this.props;
    const arr = commonStatusData.dvb_config || [];
    return arr.map(item => {
      let if_freq
      // eslint-disable-next-line no-unused-expressions
      item?.ifreqs?.forEach(ifreq => {
        for (const key in ifreq) {
          const parts = key?.split('_')
          const number = parseInt(parts[parts.length - 1], 10)
          if (number >= 0 && number === this.props.currentCH) {
            if_freq = ifreq[key]
          }
        }
      })
      return {
        ...item,
        if_freq,
        symbol_rate: item?.symbolrate,
      }
    })
  }

  render() {
    const { width, height, selectedFreqOptions, isLogin, smallStationClassName='', hideHightLight, networkSignalType } = this.props;
    const { imageSrc, startPointerPositionX, startPointerPositionY, deltaX, deltaY, masterChecked, smallChecked, isLoading } = this.state;
    const left = deltaX > 0 ? startPointerPositionX : startPointerPositionX + deltaX;
    const top = deltaY > 0 ? startPointerPositionY : startPointerPositionY + deltaY;
    const key = selectedFreqOptions?.key
    const masterList = this.props.adConfig?.filter(item => (item?.ad_port_id === this.props.currentCH) && item?.is_master === 1) || []
    const samllList = this.props.adConfig?.filter(item => (item?.ad_port_id === this.props.currentCH)) || []
    const masterJson = masterList.map(i => i.ch || i.gch_id) || []
    // const smallJson = samllList.map(i => i.ch) || []
    const smallJson = samllList.filter(i => i.is_master !== this.props.currentNet.vsat_id) || []
    const dvbList = this.transformArrary() || []
    const masterDvbList = dvbList?.filter(item => item?.vsat_id === this.props.currentNet.vsat_id) || []
    // const smallDvbList = dvbList?.filter(item => item?.vsat_id != 1) || []
    const masterDvbJson = masterDvbList.map(i => i.channel_id || i.gch_id) || []
    // const smallDvbJson = smallDvbList.map(i => i.channel_id ) || []
    const smallDvbJson = dvbList.filter(i => i.vsat_id !== this.props.currentNet.vsat_id) || []
    const umasterJson = masterJson?.concat(masterDvbJson).filter(i => i !== undefined) || []
    const usmallJson = smallJson?.concat(smallDvbJson)?.filter(i => i !== undefined && i.is_master !== 1)?.map?.(item => item?.gch_id) || [];

    return (
      <>
        <div
          style={{ width, height, position: 'relative' }}
          ref={(ref) => this.createCustomRef(ref, 'ImageBox')}
        >
          {isLoading && (
            <div style={{ height, width, position: 'absolute', left: -3, top: 0, zIndex: 9, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: '0.5' }}>
              <Spin spinning={isLoading} tip='加载中...' />
            </div>
          )}
          <div
            id='imgShadow'
            style={{ height, width, position: 'absolute', left: -20, top: 0, zIndex: 9 }}
          />
          <img style={{ position: 'absolute', left: 0, top: 0, zIndex: 1, height, width }} src={imageSrc || FreqLoading} />
          {startPointerPositionX && <div className="mask" style={{ width: Math.abs(deltaX) || 0, height: Math.abs(deltaY) || 0, position: 'fixed', background: 'rgba(255,255,255,0.4)', left, top, zIndex: 5 }} />}
        </div>
        {
          ( key === '0' && this.props.currentNet.wk_type != 7 && !hideHightLight) && (
            <div style={{ display: 'flex', zIndex: 999, alignItems: 'center', position: 'absolute', right: '727px', top: '3px' }} className={smallStationClassName}>
              <Tooltip title={`当前输入口下的主校区通道：${umasterJson?.length > 0 ? JSON.stringify(umasterJson) : '[]'} ${dvbList?.length > 0 ? `dvb 板卡${dvbList[0]?.board_id}, 通道${dvbList[0]?.channel_id}` : ''}`}>
                <Checkbox onChange={(e) => this.handleHighLightMast(e, 'master')} disabled={!isLogin} checked={masterChecked}>
                  高亮当前机器主校区
                </Checkbox>
              </Tooltip>
              <Tooltip title={`当前输入口下的小区通道：${usmallJson?.length > 0 ? JSON.stringify(usmallJson) : '[]'}`}>
                <Checkbox onChange={(e) => this.handleHighLightMast(e, 'small')} disabled={!isLogin} checked={smallChecked}>
                  高亮当前机器小区
                </Checkbox>
              </Tooltip>
            </div>
          )
        }
      </>
    );
  }
}
export default FreqImage;
