/**
 * online
 */
import React, { Component } from 'react'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

// const formatUtil = echarts.format;

export default class Line extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  
  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      return true;
    }
    return false;
  }

  getLevelOption = () => {
    return [
      {
        itemStyle: {
          borderColor: '#777',
          borderWidth: 0,
          gapWidth: 3,
        },
        upperLabel: {
          show: false,
        },
      },
      {
        itemStyle: {
          borderColor: '#555',
          borderWidth: 5,
          gapWidth: 1,
        },
        emphasis: {
          itemStyle: {
            borderColor: '#ddd',
          },
        },
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
            gapWidth: 1,
            borderWidth: 5,
            borderColorSaturation: 0.6,
        },
      },
    ];
  }

  getOption = () => {
    const option = {
      title: {
        text: '',
        left: 'center',
      },

      tooltip: {
        formatter: (info) => {
          const treePathInfo = info.treePathInfo;
          const treePath = [];

          for (const i in treePathInfo) {
              treePath.push(treePathInfo[i].name);
          }
        },
      },

    series: [
        {
          name: this.props.summaryText || '总体分布',
          type: 'treemap',
          visibleMin: 300,
          label: {
              show: true,
              formatter: '{b}',
          },
          upperLabel: {
            show: true,
            heigth: 25,
          },
          itemStyle: {
              borderColor: '#fff',
          },
          levels: this.getLevelOption(),
          data: this.props.data,
        },
      ],
    }
    return option;
  }

  render() {
    const { handleClick, style, title } = this.props;
    const onEvents = {};
    if(handleClick) {
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
