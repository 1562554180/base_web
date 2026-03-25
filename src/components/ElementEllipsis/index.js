import React, { Component } from 'react';
import styles from './index.less';

export default class Ellipsis extends Component {

  state = {
    ellipsis: false,
  }

  shouldResize = true;

  resize = () => {
    if (this.container && this.helper) {
      const { offsetWidth } = this.container;
      const { offsetWidth: helperWidth } = this.helper;
      if (offsetWidth < helperWidth) {
        this.setState({
          ellipsis: true,
        })
      } else {
        this.setState({
          ellipsis: false,
        })
      }
    }
  }

  render() {
    const { children, style } = this.props;
    const { ellipsis } = this.state;
    if (this.shouldResize) {
      setTimeout(this.resize);
      this.shouldResize = false;
    } else {
      this.shouldResize = true;
    }

    return (
      <div style={{...style, display: 'flex'}} ref={ref => { this.container = ref }}>
        <div ref={ref => { this.helper = ref }} className={styles.childrenWidthHelper}>
          {children}
        </div>
        {ellipsis ? (
          <>
            <div style={{ width: 'calc(100% - 10px)' }} className={styles.childrenWrapped}>
              {children}
            </div>
            <span className={styles.ellipsis}>...</span>
          </>
        ) : children}
      </div>
    );
  }
}
