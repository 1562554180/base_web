import React from 'react';
import { Drawer } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { sizer, elements } from 'utils/layout';
import styles from 'utils/utils.less';

function getMaxHeight(footer, footerHeight, offset) {
  return window.innerHeight - (76 + (footer ? (footerHeight || 50) : 0)) + (offset || 0);
}

export default class AutoScrollDrawer extends React.Component {
  constructor(props) {
    super(props);
    const state = {};
    if (!(props.placement === 'bottom' || props.placement === 'top')) {
      state.height = getMaxHeight(this.props.footer, this.props.footerHeight, this.props.scrollbarOffset);
    }
    this.state = {...state};
  }

  componentDidMount () {
    if (!(this.props.placement === 'bottom' || this.props.placement === 'top')) {
      sizer.add(this);
    }
  }

  componentWillUnmount () {
    if (!(this.props.placement === 'bottom' || this.props.placement === 'top')) {
      sizer.remove(this);
    }
  }

  updateSize() {
    this.setState({
      height: getMaxHeight(this.props.footer, this.props.footerHeight, this.props.scrollbarOffset),
    });
  }

  render () {
    const { scrollbarProps, width, footerHeight, children, footer, scrollbarOffset, visible, height, ...props } = this.props;
    const drawerWidth = width || 360;
    const scrollbarStyle = {width: 'auto'};
    const otherProps = {};
    const visibleShow = visible || false;

    if (props.placement === 'bottom' || props.placement === 'top') {
      otherProps.width = '100%';
      otherProps.height = 360;
      scrollbarStyle.height = 360;
    } else {
      otherProps.width = drawerWidth;
      scrollbarStyle.height = height || this.state.height;
    }
    return (
      (<Drawer
        open={visibleShow}
        {...props}
        {...otherProps}
      >
        <Scrollbars className={styles.scrollBar} autoHide {...scrollbarProps} style={scrollbarStyle} renderThumbVertical={elements.contentScrollbarThumb}>
          {children}
        </Scrollbars>
        {footer}
      </Drawer>)
    );
  }
}
