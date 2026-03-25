import React, {PureComponent} from 'react';
import moment from 'moment';
import { localNumeral, getByteSize } from 'utils/utils';
import { getComponentColor } from 'common/colors';


export default class Relationtooltip extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    const { offsetX, offsetY, disabledDrag } = this.props;
    if(!disabledDrag) {
      document.onmousemove = (ev) => {
        const tooltipBox = document.getElementById('relation_tooltip');
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        const event = ev || window.event;
        if(tooltipBox) {
          tooltipBox.style.top = scrollTop + event.clientY - (offsetY || 80) + 'px';
          tooltipBox.style.left = scrollLeft + event.clientX - (offsetX || 180) + 'px';
        }
      }
    }
  }

  componentWillUnmount () {
    document.onmousemove = null;
  }

  render() {
    const { modelVisible, info = {}, children, style = {} } = this.props;
    const NodeTooltip = getComponentColor('nodeTooltipBgc');
    const contentText = children || (
      <div>
        <div>通信次数： {localNumeral(info.traffic_count)}</div>
        <div>通信流量： {getByteSize(info.traffic_size)}</div>
        <div>通信对象： {info.id}</div>
        <div>通信起始地： {info.ip1_country}</div>
        <div>最后目的地： {info.ip2_country}</div>
        <div>通信开始时间： {moment(info.begin_time).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div>最后通信时间： {moment(info.last_time).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    )
    return (
      <div 
        id='relation_tooltip'
        style={{
          minWidth:'300px',
          // pointerEvents: 'none',
          paddingBottom: 12,
          backgroundImage: `url(${NodeTooltip})`,
          backgroundSize: '100% 100%',
          position:'fixed',
          left:0,
          top:0,
          display: modelVisible ? 'block' : 'none',
          padding: '16px 10px',
          ...style,
          zIndex: this.state.zIndex,
        }}
      >
        {contentText}
      </div>
    );
  }
}
