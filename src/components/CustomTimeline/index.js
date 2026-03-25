import React, { Component } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import './index.less'

const TimeNode = Timeline.Item;


export default class DataSearchAnalyze extends Component { 
  constructor(props) {
    super(props) 
    const state = this.initBaseState(props);
    this.state = {
      ...state,
    }
  }

  initBaseState = (props) => {
    const { timeKey, data, timeLabel, isFormat, useKey, mode } = props;
    const newData = _.orderBy(data || [], [timeKey || 'time'], ['asc']);
    const state = {
      mode: mode || 'left', // alternate两侧展示
      useKey,
      isFormat,
      data: newData,
      timeKey: timeKey || 'time',
      timeLabel: timeLabel || 'label',
    }
    return state;
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data)) {
      const newState = this.initBaseState(nextProps);
      this.setState(...newState)
    }
  }

  formatTitm = (time) => {
    if (!time) return '';
    const { isFormat } = this.state;
    if (isFormat) {
      const useTime = time.toString().length === 10 ? time * 1000 : time;
      return moment(useTime).format('YYYY-MM-DD HH:mm:ss')
    }
    return time;
  }

  createNode = (item) => {
    const { createCustomNode } = this.props;
    const { timeKey, timeLabel } = this.state;
    let content = null;
    if (createCustomNode) {
      content = createCustomNode(item)
    } else {
      content = item[timeLabel] || null;
    }
    return (
      <div>
        <div>{this.formatTitm(item[timeKey] || item.time || '')}</div>
        {content}
      </div>
    )
  }

  render() {
    const { data, timeKey, useKey, mode } = this.state;
    return (
      <Timeline style={{marginTop: 20, marginLeft: 10}} mode={mode}>
        {
          data.map(item => {
            const key = item[timeKey];
            const nodeProps = {
              key: item[useKey] || key,
              className: 'custom_time_node',
              dot: <ClockCircleOutlined />,
            }
            return (
              <TimeNode
                {...nodeProps}
              >
                {this.createNode(item)}
              </TimeNode>
            )
          })
        }
        {data && data.length > 0 && (
        <TimeNode 
          className='custom_time_node'
          dot={<ClockCircleOutlined />}
        />)}
      </Timeline>
    );
  }
}