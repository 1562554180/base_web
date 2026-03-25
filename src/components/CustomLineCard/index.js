/**
 * 样式卡片
 */
import React, { Component } from 'react';

import styles from './index.less';

export default class CustomLineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleRenderCardHeader = () => {
    const { title, extra, titleContent } = this.props;
    return (
      <div className={styles.customCardHeader}>
        <div className={styles.customCardHeaderTitleBox}>
          <span className={styles.customCardHeaderTitleChain}></span>
          <span className={styles.customCardHeaderTitleContent}>{title || ''}</span>
        </div>
        {titleContent && (
          <div className={styles.customCardHeaderTitleContent}>{titleContent || ''}</div>
        )}
        {
          extra && (
            <div className={styles.customCardExtra}>
              {
                extra || ''
              }
            </div>
          )
        }
      </div>
    )
  }

  handleRenderCardContent = () => {
    const { content } = this.props;
    if (content) {
      return (
        <div>
          {
            content
          }
        </div>
      )
    } else {
      return '';
    }
  }

  render() {
    return (
      <div className={styles.customLineCard}>
        {
          this.handleRenderCardHeader()
        }
        {
          this.handleRenderCardContent()
        }
      </div>
    )
  }
}