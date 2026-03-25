import React from 'react';
import {
  message,
  Progress,
  Button,
} from 'antd';
import moment from 'moment';
import config from 'utils/config';
import AutoSizeDialog from 'components/Dialog';
import styles from './index.less';

export default class ScanningProgress extends React.Component {
  constructor() {
    super()
    this.state={
      settingProgressPercent: 0,
      settingprogressData: {},
    }
    this.num = 0;
    this.requestMore = false;
  }

  componentDidMount() {
    this.timer = setInterval(this.getProgressInfo, config.timerInterval1);
  }

  componentWillUnmount () {
    if(this.timer) {
      clearInterval(this.timer);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.settingProgressPercent !== prevState.settingProgressPercent) {
      if(this.state.settingProgressPercent === 100 || this.state.settingProgressPercent === '100') {
        if(this.props.callback) this.props.callback('success');
      }

      if(this.state.settingProgressPercent === 100 || this.state.settingProgressPercent === '100' || ( this.state.settingProgressPercent < 0) && this.timer) {
        clearInterval(this.timer);
        if(this.props.handleVisible) {
          setTimeout(() => {
            this.props.handleVisible(false)
          }, config.timerInterval2)
        }
      }
    }
  }

  getProgressInfo = () => {
    const { dispatch, action, params } = this.props;
    this.num += 1;
    const that = this;
    dispatch({
      type: action,
      payload: params,
      callback: (data) => {
        if(data) {
          that.requestMore = true;
        }
        if(data.process < 0) {
          message.error(data.message || '失败');
        }
        that.setState({
          settingprogressData: data,
          settingProgressPercent: data.process,
        })
      },
    })
  }

  handleRenderInfo = (data) => {
    const settingProgressPercent = data.process || 0;
    const mainInfoData = data.content || [];
    return (
      <div style={{ marginLeft: 20, fontSize: 16 }}>
        {
          mainInfoData.map((item, index) => {
            return (
              <div style={{ marginTop: index > 0 ? 10 : 0 }} key={item.name}>
                { item.label || '' }
                <span style={{ fontWeight: 'bold', marginLeft: 5 }}>{`${item.value || ''} ${item.unit || ''}`}</span>
              </div>
            )
          })
        }
        <div style={{ marginTop: 10, display: 'flex' }}>
          <div>当前进度  : </div>
          <div style={{ width: 400, marginLeft: 10 }}>
            <Progress percent={settingProgressPercent} strokeWidth={15} />
          </div>
        </div>
      </div>
    )
  }

  handleTransTimeStamp = (d) => {
    if (d !== 0) {
      if (String(d).length < 13) {
        return moment(d * 1000).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return moment(d).format('YYYY-MM-DD HH:mm:ss');
      }
    } else {
      return '';
    }
  }
  
  render(){
    const { modalTitle } = this.props;
    const { settingProgressPercent, settingprogressData } = this.state;
    if(this.num === 10000 && settingProgressPercent === 0 && this.timer && !this.requestMore) {
      clearInterval(this.timer)
    } 
    return (
      <div>
        <AutoSizeDialog
          title={modalTitle || '进度信息'}
          visible={this.props.visible}
          height={350}
          width={720}
          noFooter
          className={styles.scanningBoxModal}
        >
          <div>
            {this.handleRenderInfo(settingprogressData)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            {
              settingProgressPercent !== 100 ? 
              (
                <Button type="primary" onClick={() => this.props.handleStopProgress()}>停止扫描</Button>
              ) : 
              (
                <Button type="primary" onClick={() => this.props.handleVisible(false)}>关闭弹框</Button>
              )
            }
          </div>
        </AutoSizeDialog>
      </div>
    )
  }
}