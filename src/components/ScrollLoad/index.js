import React, { PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Spin, Button } from 'antd';
import _ from 'lodash';
import config from 'utils/config';
import classNames from 'classnames';
import styles from './index.less';

if (!window.AllfoldStatus) {
  window.AllfoldStatus = {};
}

export default class ScrollLoad extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      ...this.initStateFoldStatus(props),
    };
  }

  initStateFoldStatus = (props) => {
    const { id } = props;
    const unfold = _.isUndefined(window.AllfoldStatus[id]) ? true : window.AllfoldStatus[id];
    return {unfold};
  }

  checkScroll = () => {
    const { id } = this.props;
    const node = document.getElementById(id);
    if (!node) return;
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.setState({
            loading: false,
          })
          observer.unobserve(node);
        }
      })
    });
    this.observer.observe(node);
  }

  componentDidMount() {
    const { disableScrollLoad } = this.props;
    if (!disableScrollLoad) {
      this.checkScroll();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.params, nextProps.params)) {
      const state = this.initStateFoldStatus(nextProps);
      this.setState(state)
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  renderChild() {
    const { loading } = this.state;
    const { children, disableScrollLoad } = this.props;

    if (disableScrollLoad) {
      return children;
    }

    return loading ? <Spin /> : children;
  }

  updateFoldStatus = () => {
    const { id } = this.props;
    const { unfold } = this.state;
    this.setState({unfold: !unfold}, () => {
      window.AllfoldStatus[id] = !unfold;
    })
  }

  renderTag() {
    const { unfold } = this.state;
    const { id, name, img, otherContent, createSettings, params = {}, protocolShowSetting, updatePageSize, getCurrentPage, pageSize } = this.props;
    const { detailData = {}} = params;
    const svgId = 'icon-algin-left';

    if (name && img) {
      const current = getCurrentPage ? getCurrentPage(params.tn) : 0;
      const dataLen = detailData[params.tn] ? detailData[params.tn].length : 0;
      const onePageSize = pageSize || config.protocolMetaDataPageSize;

      return (
        <div className={classNames(styles.detailTitleBox, 'detailTitleBoxBgc')} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <svg className='icon' width='100%' height='100%'>
              <use xlinkHref={`#${svgId}`} />
            </svg>
            <span>{name}</span> 
          </span>
          <div style={{ display: 'flex' }}>
            {detailData && id.includes('protoBasic') && protocolShowSetting === 'single' && dataLen > onePageSize && (
              <div style={{ marginRight: 5 }}>
                总条数：{dataLen}&nbsp;
                <Button size="small" disabled={current === 1} onClick={() => updatePageSize('last', params.tn)}>上一页</Button>&nbsp;
                <Button size="small" disabled={current * onePageSize >= dataLen} onClick={() => updatePageSize('next', params.tn)}>下一页</Button>
              </div>
            )}
            {otherContent} {createSettings ? createSettings(params) : null}
            <a>
              <LegacyIcon 
                style={{marginLeft: 3}} 
                type={unfold ? "down" : "right"} 
                onClick={this.updateFoldStatus} 
              />  
            </a>
          </div>
        </div>
      );
    }
  }

  render() {
    const { unfold } = this.state;
    const { style, contentStyle, isNoHasBorder, id, basicBgc } = this.props;
    return (
      <div className={isNoHasBorder ?  '' : 'scrollItem'} id={id} style={{...style}}>
        { this.renderTag() }
        <div style={{...contentStyle, display: unfold ? 'block' : 'none'}} className={basicBgc ? 'basicPropertyBgc' : ''}>
          { this.renderChild() }
        </div>
      </div>
    )
  }
}