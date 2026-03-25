import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, Modal } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
// import _ from 'lodash';
import { sizer, elements } from 'utils/layout';
import { l } from 'utils/localization';
import styles from 'utils/utils.less';

function isMax(v) {
  return v === 'max';
}

let uuid = 1;

class AutoSizeDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.id = 'dialog-' + uuid;
    uuid += 1;
    this.state = {
      width: props.maxWidth || 300,
      height: props.maxHeight || 300,
    };
  }

  componentDidMount() {
    if (this.props.maximize || isMax(this.props.height) || isMax(this.props.width)) {
      sizer.add(this);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (!this.props.visible) return false;
  //   if (!_.isEqual(this.props, nextProps)) {
  //     return true;
  //   }
  //   if (! _.isEqual(this.state, nextState)) {
  //     return true;
  //   }
  //   return false;
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.maxHeight !== this.props.maxHeight) {
      this.setState({
        height: nextProps.maxHeight,
      })
    }

    if (nextProps.maxWidth !== this.props.maxWidth) {
      this.setState({
        width: nextProps.maxWidth,
      })
    }
  }

  componentWillUnmount() {
    if (this.props.maximize || isMax(this.props.height) || isMax(this.props.width)) {
      sizer.remove(this);
    }
  }

  getMaxHeight() {
    let deltaHeight = this.props.deltaHeight || 0;
    if (!deltaHeight && top !== window) deltaHeight = 50;
    const ht = window.innerHeight - 160

    return ht + (this.props.title ? 0 : 50);
  }

  getMaxWidth() {
    return window.innerWidth - 96;
  }

  updateSize() {
    const size = {};
    if (this.props.maximize || isMax(this.props.height)) size.height = this.getMaxHeight();
    if (this.props.maximize || isMax(this.props.width)) size.width = this.getMaxWidth();
    if (size.height !== this.state.height || size.width !== this.state.width) {
      this.setState(size);
    }
    const { updateDialogContentSize } = this.props;
    if (updateDialogContentSize) updateDialogContentSize(size);
  }

  render() {
    const { offsetTop, onOk, onCancel, loading, okText, cancelText, iconType, imageType, keyboard, customFooter, noFooter, noCancel, closable, scrollbarProps, otherFooter, submitId, before, isSave, ...props } = this.props;
    const scrollbarStyle = { width: 'auto', height: this.state.height };
    const width = this.state.width;
    let footer = null;

    if (imageType) {
      props.title = (<span><img src={imageType} /> {props.title}</span>);
    } else if (iconType) {
      props.title = (<span><LegacyIcon type={iconType} /> {props.title}</span>);
    }
    if (onCancel) props.onCancel = onCancel;
    if (noFooter !== true) {
      if (noCancel) {
        footer = [
          <Button id={submitId || ''} key="submit" type="primary" size='small' loading={loading} onClick={onOk} disabled={isSave}>{okText || l('Ok')}</Button>,
        ];
      } else {
        footer = [
          <Button key="back" onClick={onCancel} size='small' disabled={loading}>{cancelText || l('Cancel')}</Button>,
          <Button id={submitId || ''} key="submit" type="primary" size='small' loading={loading} onClick={onOk} disabled={isSave}>{okText || l('Ok')}</Button>,
        ];
        if (otherFooter && !before) footer.push(otherFooter);
        if (otherFooter && before) footer.unshift(otherFooter);
      }
    }

    if (!this.props.maximize && !isMax(this.props.width)) scrollbarStyle.width = 'auto';
    props.maskClosable = this.props.maskClosable || false;
    return (
      <Modal
        width={width}
        {...props}
        keyboard={keyboard || false}
        wrapClassName="vertical-center-modal"
        closable={closable || false}
        footer={customFooter || footer}
      >
        <Scrollbars id={this.id} className={styles.scrollBar} autoHide {...scrollbarProps} style={scrollbarStyle} renderThumbVertical={elements.contentScrollbarThumb}>
          {this.props.children}
        </Scrollbars>
      </Modal>
    )
  }
}

export default AutoSizeDialog
