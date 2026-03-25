import React, { PureComponent } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';

export default class DetailBox extends PureComponent { 
  constructor(props) {
    super(props)
    this.state={

    }
  }

  render() {
    const { children, title, handelVisible, visible, otherBtn, positionStyle={}, hiddenClose } = this.props;
    const boxStyle = {position:'absolute', zIndex: window.zIndex, display: visible ? 'block' : 'none', 
    border: '1px solid #344b7a', height: "auto", width: "420px",borderRadius: 2, ...positionStyle};
    // background: '#15294e', 
    return (
      <div style={boxStyle} className="drawBgc">
        <div className='drawHeader' style={{display: 'flex', justifyContent: 'space-between', padding: '10px'}}>
          <span>{title}</span>
          <div>
            {otherBtn}
            {!hiddenClose && <CloseOutlined
              style={{marginLeft: '15px', cursor: "pointer"}}
              onClick={() => handelVisible(false)} />}
          </div>
        </div>
        <Scrollbars className='contScroll' autoHide style={{ width: 'auto', height: 'calc(100vh - 224px)'}} id="content-scroll">
          {children}
        </Scrollbars>
      </div>
    );
  }
}