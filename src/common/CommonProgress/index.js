import React from 'react';
import {
  message,
  Progress,
} from 'antd';
import _ from 'lodash';
import AutoSizeDialog from 'components/Dialog';
import config from 'utils/config';

const unknowProgressNum = config.unknowProgressNum || 30;

export default class CommonProgress extends React.Component {
  constructor() {
    super()
    this.state={
      settingProgressPercent: 0,
      settingprogressMsg: '',
      exceptionState: 0,
    }
    this.num = 0;
  }

  getProgressMsg = (data) => {
    if(!data || !data.progress) return '';
    let msg = '';
    data.progress.forEach((item) => {
      if(item.exception && item.exception === 1){
        msg += "<span style='color:red'>"+item.message+"</span></br>";
      } else {
        msg += item.message + "</br>";
      }
    });
    return msg;
  }

  componentDidMount() {
    this.timer = setInterval(this.getProgressInfo, config.timerInterval1)
  }

  componentWillUnmount () {
    if(this.timer) {
      clearInterval(this.timer);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.settingProgressPercent !== prevState.settingProgressPercent || this.state.exceptionState !== prevState.exceptionState) {
      if(this.state.settingProgressPercent === 100 || this.state.settingProgressPercent === '100') {
        if(this.props.callback) this.props.callback('success');
        if(this.props.handleVisible) {
          setTimeout(() => {
            this.props.handleVisible(false)
          }, 1500)
        }
      }
      if((this.state.exceptionState === 1) && this.timer) {
        clearInterval(this.timer);
        if(this.props.callback) this.props.callback('error');
        if(this.props.handleVisible) {
          setTimeout(() => {
            this.props.handleVisible(false)
          }, 1500)
        }
      }
    }
  }

  getProgressInfo = () => {
    const { dispatch, action, params, handleVisible } = this.props;
    const clearTimeoutNum = this.props.unknowProgressNum || unknowProgressNum;
    const that = this;
    dispatch({
      type: action,
      payload: params,
      callback: (data) => {
        let exceptionState = 0;
        let lastNode = {};
        if (!data || _.isUndefined(data.progress)) {
          this.num += 1;
        }
        if (this.num === clearTimeoutNum) {
          clearInterval(this.timer)
          message.error('未知错误')
          if (handleVisible) handleVisible(false)
        }
        if(data && data.progress) {
          this.num = 0;
        }
        // console.log(this.num)
        if(data && data.progress && data.progress.length > 0) {
          lastNode = data.progress[data.progress.length - 1];
        }
        if(lastNode.code < 0 && lastNode.exception === 1) {
          exceptionState = 1;
          message.error(`错误码：${lastNode.code},错误信息：${lastNode.message}`);
        }
        if(lastNode.code !== undefined && lastNode.code < that.state.settingProgressPercent && lastNode.code > 0) {
          lastNode.code = that.state.settingProgressPercent;
        }
        if(lastNode.code === undefined && that.state.settingProgressPercent > 0) {
          lastNode.code = that.state.settingProgressPercent;
        }
        that.setState({
          exceptionState,
          settingProgressPercent: lastNode.code || 0,
          settingprogressMsg: that.getProgressMsg(data),
        })
      },
    })
  }

  render(){
    const { isHasModal } = this.props;
    const { settingProgressPercent, settingprogressMsg } = this.state;

    return (
      <div>
        {
          isHasModal !== 'true' ?
          (
            <AutoSizeDialog
              title='设置进行中，请稍后...'
              visible={this.props.visible}
              height={180}
              width={360}
              noFooter
            >
              <div>
                <Progress status='active' percent={settingProgressPercent} />
                <div dangerouslySetInnerHTML={{__html: settingprogressMsg}} />
              </div>
            </AutoSizeDialog>
          ) :
          (
            <div>
              <Progress status='active' percent={settingProgressPercent} />
              <div dangerouslySetInnerHTML={{__html: settingprogressMsg}} />
            </div>
          )
        }
      </div>
    )
  }
}
