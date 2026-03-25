import React from 'react';

export default class SimpleFlexBox extends React.Component {

  render() {
    const { leftItem, rightItem, mainStyle, leftStyle, rightStyle } = this.props;

    return (
      <div style={{display: 'flex', alignItems: 'center', ...mainStyle}}>
        <div 
          style={{...leftStyle}} 
        >
          {leftItem}
        </div>
        <div style={{...rightStyle}}>
          <div>{rightItem}</div>
        </div>
      </div>
    )
  }
}