import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import Modal from 'utils/modal';
import { Button, message, Tooltip } from 'antd';
import styles from './index.less';

function getFileNameFromHeader(header) {
  if (!header) {
    return null;
  }
  const split = header.split(";");
  for (let i = 0; i < split.length; i++) {
    const item = split[i];
    if (item.startsWith("filename=")) {
      return item.substring("filename=".length);
    }
  }
  return null;
}

/**
 * 参数名           说明                             类型                            默认值
 * --------------------------------------------------------------------------------------------------
 * method         请求方法                           string                           GET
 * href           导出的请求url                      string                          无 （必须）
 * body           请求体                            object|function                 无
 * progressHref   存储导出进度url                    string                          无 （可选）
 *                后端此接口返回值格式：
 *                {success:boolean,data:number}
 * text           按钮的文字                         string                          导出
 * icon           按钮的图标                         string                          'export' 会自动根据text变化
 * size           大小                              string  mini small default      default 设置为mini会显示图标和tooltip
 * intervalTime   查询进度间隔                       number(ms)                      0
 * showPercent    是否加载时显示加载百分比             boolean                         false
 * modalRender    参数设置界面                       reactNode                       无
 * modalProps     参数设置弹窗的属性                  object
 * fileName       文件名                             string                          默认从响应头Content-Disposition提取
 */
export default class ExportButton extends PureComponent {

  state = {
    percent: 0, // 实际已导出百分比 0-100
    estimatedPercent: 0, // 预计已导出百分比 0-100
    loading: false, // 正在导出 false/true
    modalVisible: false,
  }

  getProgress = (noStartReqHref, limit) => {
    const { text, intervalTime, subText, progressHref, msgText } = this.props;
    const msgTextReal = msgText || text;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", progressHref, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = () => {
      // 响应就绪
      if (xmlhttp.readyState === 4) {
        // 导致导出结束的三种情况
        // 1.响应状态非200 代表请求有误 未知原因结束 需要进行bug修复
        // 2.响应内容中success为false 代表服务端无法正常获取导出结果 需要注意
        // 3.响应内容中data为100 正常结束
        if (xmlhttp.status !== 200 || JSON.parse(xmlhttp.responseText).code !== 200 || JSON.parse(xmlhttp.responseText).data === 100) { // 导出结束
          if (xmlhttp.status !== 200 || JSON.parse(xmlhttp.responseText).code !== 200) { // 导出失败
            message.error(`${msgTextReal || '导出'}失败，请重试`)
          } else { // 导出成功
            message.success(`${msgTextReal || '导出'}成功${subText || "!"}`);
          }
          // 导出结束
          this.setState({
            loading: false,
          })
        } else { // 导出未出错 未结束
          if (noStartReqHref) { // 若尚未发送导出请求 则发送导出请求 并将noStartReqHref（是否未发送导出请求）变量改为false
            this.exportRequest(limit);
          }
          // 更改percent（导出百分比）状态
          this.setState({
            percent: Number(JSON.parse(xmlhttp.responseText).data),
          },() => { // 递归发送请求来获得下一个百分比
            setTimeout(this.getProgress, intervalTime || 0)
          })
        }
      }
    }
  }

  startExport = () => {
    const { progressHref, showPercent, estimatedTime } = this.props;
    this.setState({ // 初始化百分比 设置正在导出状态
      percent: 0,
      estimatedPercent: 0,
      loading: true,
    })
    // 若有progressHref（查询导出是否完成的请求url）参数 即导出并开启查询当前导出进度功能 否则只做导出
    if (progressHref) {
      // 若showPercent(显示百分比) 且estimatedTime（预计导出所需时间） 则开启获得预计导出百分功能
      // 因为获得实际导出百分比需要请求后台 百分比变化相对不够平滑 此选项能够有效改善此情况
      if (showPercent && estimatedTime) {
        const timerEstimated = setInterval(() => {
          const { percent, estimatedPercent } = this.state;
          this.setState({
            estimatedPercent: Math.max(percent - 1, estimatedPercent) + 1, // 若真实导出进度大于预计导出进度 则将预计导出进度调整为真实导出进度的值
          })
          if (estimatedPercent >= 98) { // 预计导出进度最大值为99
            clearInterval(timerEstimated);
          }
        }, estimatedTime / 100)
      }
      // 获得实时百分比 发送导出请求
      this.getProgress(true);
    } else {
      this.exportListenOver();
    }
  }

  exportRequest = onprogress => {
    const { href, method = 'GET', body, fileName } = this.props;
    const xhr = new XMLHttpRequest();
    xhr.open(method, window.encodeURI(href), true);
    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhr.responseType = "blob";
    if (onprogress) {
      xhr.onprogress = onprogress;
    }
    xhr.onload = ev => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const blob = new Blob([xhr.response]);
        const csvUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = csvUrl;
        console.log(xhr.getResponseHeader("Content-Disposition"))
        link.download = fileName || getFileNameFromHeader(xhr.getResponseHeader("Content-Disposition"));
        link.click();
        this.setState({
          loading: false,
        })
      }
    }
    if (body) {
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }
  }

  exportListenOver = () => {
    const { showPercent } = this.props;
    this.exportRequest(ev => {
      if (ev.lengthComputable) {
        if (showPercent) {
          this.setState({
            percent: Math.floor(ev.loaded / ev.total * 100),
          })
        }
      }
    })
  }

  buttonClick = () => {
    const { href, modalRender } = this.props;
    if (modalRender) {
      this.changeModalVisible(true);
    } else if (href) {
      this.startExport();
    } else {
      message.info("功能维护中")
    }
  }

  changeModalVisible = visible => {
    this.setState({
      modalVisible: visible,
    })
  }

  getButton = () => {
    const { percent, estimatedPercent, loading } = this.state;
    const { text, icon, size, showPercent, buttonStyle, children } = this.props;
    const iconDefault = (text && (text.indexOf('下载') !== -1 || text.indexOf('download') !== -1)) ? 'download' : 'export';

    const styleProps = buttonStyle ? {...buttonStyle} : {};
    let showPercentStr;
    if (loading) { // 若正在导出 则不可点击导出按钮 并计算当前导出百分比
      styleProps.cursor = "not-allowed";
      showPercentStr = `${Math.max(percent, estimatedPercent)}%`;
    }

    if(size === 'mini') {
      return (
        <Tooltip title={(showPercent && showPercentStr) || text || '导出'}>
          <LegacyIcon
            className={styles.exportIcon}
            type={loading ? 'loading' : icon || 'download'}
            onClick={loading ? () => message.info("正在进行，请稍后") : this.buttonClick}
            style={styleProps}
          />
        </Tooltip>
      );
    }
    return (
      <Button
        type='primary'
        size={size||'default'}
        icon={<LegacyIcon type={loading ? 'loading':icon || iconDefault} />}
        onClick={loading ? () => message.info("正在进行，请稍后") : this.buttonClick}
        style={styleProps}
      >
        {(showPercent && showPercentStr) || children || text || '导出'}
      </Button>
    );
  }

  render() {
    const { modalRender, modalProps } = this.props;
    const { modalVisible } = this.state;

    return (
      (<Fragment>
        {this.getButton()}
        {modalRender &&
        <Modal
          title="参数设置"
          open={modalVisible}
          onCancel={() => this.changeModalVisible(false)}
          // footer={null}
          destroyOnClose
          onOk={() => {
            this.changeModalVisible(false);
            this.startExport();
          }}
          {...modalProps}
        >
          {modalRender}
        </Modal>}
      </Fragment>)
    );
  }
}
