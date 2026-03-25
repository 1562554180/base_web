import React, { Component } from 'react';
import ArrowRight from 'assets/arrowRight.png';
import LinePoint from 'assets/linePoint.png';
import BrightLine from 'assets/bottomBrightLine.png';
import styles from './index.less';

export default class GradientCardBox extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleRenderContent = () => {
    const { content, title, otherContent } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <div className={styles.contentBox}>
          {
            title && (
              <div className={styles.titleBox} style={{minWidth:'350px'}}>
                <img src={ArrowRight} className={styles.arrowRight} />
                <span className={styles.titleContent}>{title}</span>
              </div>
            )
          }
          <div style={{ marginLeft: title ? 0 : 10 }}>
            {
              content
            }
          </div>
        </div>
        {
          otherContent && (
            <div style={{ marginTop: 5 }}>
              {
                otherContent
              }
            </div>
          )
        }
      </div>
    )
  }

  render() {
    const { mainStyle={} } = this.props
    const theme = window.selectedTheme
    return (
      <div className={styles.mainBox} style={{backgroundColor:`${theme === 'highlight' ? '#173690' :'#224474'}`, ...mainStyle}}>
        <div className={styles.topLineOne} />
        <div className={styles.topLineTwo} />
        {this.handleRenderContent()}
        <img src={BrightLine} className={styles.brightLine} />
        <img src={LinePoint} className={styles.bottomPoint} />
      </div>
    );
  }
}
