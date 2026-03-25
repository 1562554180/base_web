/**
 * online
 */
import React, { Component } from 'react'
import { connect } from 'dva';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react';
import { colorObj } from 'common/colors';
import _ from 'lodash';

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class Line extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.initBaseState(props),
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      return true;
    }
    return false;
  }


  componentWillReceiveProps(nextProps){
    if (this.props.selectedTheme !== nextProps.selectedTheme) {
      const state = this.initBaseState(nextProps);
      this.setState(state)
    }
  }

  initBaseState = (props) => {
    const { selectedTheme } = props;
    const state = colorObj.pieMore[selectedTheme ||'default'];
    return state;
  }

  getOption = () => {
    const { colorText } = this.state;
    const option = {
      title: {
        textStyle: {
          fontSize: 14,
          align: 'center',
        },
        subtextStyle: {
          align: 'center',
        },
      },
      series: {
        type: 'sunburst',
        data: this.props.data,
        radius: [0, '95%'],
        sort: null,
        label:{color: colorText},

        emphasis: {
          focus: 'ancestor',
        },

        levels: [{}, {
          r0: '15%',
          r: '35%',
          itemStyle: {
            borderWidth: 2,
          },
          label: {
            rotate: 'tangential',
          },
        }, {
            r0: '35%',
            r: '70%',
            label: {
              align: 'right',
            },
        }, {
            r0: '70%',
            r: '72%',
            label: {
              position: 'outside',
              padding: 3,
              silent: false,
            },
            itemStyle: {
              borderWidth: 3,
            },
        }],
      },
    }
    return option;
  }

  render() {
    const { handleClick, style, title } = this.props;
    const onEvents = {};
    if (handleClick) {
      onEvents.click = handleClick;
    }
    return (
      <>
        {
          title ? (
            <div>
              <h4 style={{padding:10,borderBottom:'1px solid #48566e'}}>{title}</h4>
              <ReactEcharts
                notMerge
                lazyUpdate
                option={this.getOption()}
                style={style}
                onEvents={onEvents}
              />
            </div>
          ) : (
            <ReactEcharts
              notMerge
              lazyUpdate
              option={this.getOption()}
              style={style}
              onEvents={onEvents}
            />
          )
        }
      </>
    );
  }
}
