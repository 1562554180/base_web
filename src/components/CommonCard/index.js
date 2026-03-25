import React, { Component } from 'react';
import { Card } from "antd"
import leftPng from 'assets/homeIcon/left.png';
import rightPng from 'assets/homeIcon/right.png';
import centerPng from 'assets/homeIcon/center.png';
import styles from './index.less';
/*
  style: Card总体样式
  bodyStyle: 内容样式
  headStyle: 头部样式
*/
const cardHeaderStyle = {
  backgroundImage: 'url("./yuantek_others/beautiful_title.svg")',
  backgroundRepeat: 'no-repeat',
  border: '0rem solid red',
  height: "40rem",
  minHeight: '40rem',
  paddingLeft: '30rem',
  position: 'relative',
  lineHeight: '5rem',
  marginTop:'5rem',
  display: 'flex',
  alignItems: 'center',
  minWidth: '300rem',
  backgroundSize: 'cover',
};
const bottomLeftImageSytle = {
  width: '14rem',
  height: '14rem',
  position: 'absolute',
  left: '-5rem',
  bottom: '-5rem',
}
const bottomrightImageSytle = {
  width: '14rem',
  height: '14rem',
  position: 'absolute',
  right: '-5rem',
  bottom: '-5rem',
}
const bottomLeftTriangleStyle = {
  position: 'absolute',
  left: '0',
  bottom: '0',
  width: '0',
  height: '0',
  borderRight: '10rem solid transparent',
  borderBottom: '10rem solid #133a65',
}
const bottomRightTriangleStyle = {
  position: 'absolute',
  right: '0',
  bottom: '0',
  width: '0',
  height: '0',
  borderLeft: '10rem solid transparent',
  borderBottom: '10rem solid #133a65',
}
const bottomRightTopImageSytle = {
  width: '14rem',
  height: '14rem',
  position: 'absolute',
  transform: 'rotate(180deg)',
  right: '-5rem',
  top: '-5rem',
}
const bottomrightTopImageSytle = {
  width: '14rem',
  height: '14rem',
  position: 'absolute',
  transform: 'rotate(180deg)',
  left: '-5rem',
  top: '-5rem',
}
const imgDisplay = {
  display: 'none',
}
export default class CommonCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { title = "", children, extra, style, isSelected = true, titleStyle, noMargin } = this.props;
    if (!title && !extra) {
      return (
        <div style={{ position: 'relative', margin: noMargin ? 1 : 5, ...style }}>
          {children}
          <div style={bottomLeftTriangleStyle} />
          <div style={bottomRightTriangleStyle} />
          <img src={leftPng} style={isSelected ? bottomLeftImageSytle : imgDisplay} />
          <img src={leftPng} style={isSelected ? bottomRightTopImageSytle : imgDisplay} />
          <img src={centerPng} style={isSelected ? { position: 'absolute', bottom: 0, width: '100%', height: '2rem' } : imgDisplay} />
          <img src={rightPng} style={isSelected ? bottomrightImageSytle : imgDisplay} />
          <img src={rightPng} style={isSelected ? bottomrightTopImageSytle : imgDisplay} />
        </div>
      )
    }
    return (
      <div className={styles.customCard} style={{...style}}>
        <div style={{ display: 'flex', justifyContent: title ? 'space-between' : 'flex-end', alignItems: 'center' }}>
          {title && <div style={{...cardHeaderStyle, ...titleStyle}}><span style={{ fontSize: '16rem', fontWeight: 600 }}>&nbsp;&nbsp;&nbsp;{title}</span></div>}
          <div>{extra}</div>
        </div>
        <Card>
          {children}
          <div style={bottomLeftTriangleStyle} />
          <div style={bottomRightTriangleStyle} />
          <img src={leftPng} style={bottomLeftImageSytle} />
          <img src={centerPng} style={{ position: 'absolute', bottom: 0, width: '100%', height: '2rem' }} />
          <img src={rightPng} style={bottomrightImageSytle} />
        </Card>
      </div>
    );
  }
};
