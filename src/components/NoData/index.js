/**
 * 无数据
 */
import React, { Component } from 'react';
import emptyPng from '../../assets/empty.png';
import styles from './noData.less';

export default class NodataBox extends Component {
  state = {
   
  };

  componentDidMount() {
    
  };

  render() {
    const { imgWidth, imgHeight, isHiddenBox } = this.props;
    return (
      <div className={styles.noDataBox} style={{ display: isHiddenBox === true ? 'none' : 'block' }}>
        <img src={emptyPng} style={{ width: imgWidth || 300, height: imgHeight || 300 }} />
      </div>
    );
  }
}