import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash'

class ScatterDiagram extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.id = uuidv4()
  }

  componentDidMount() {
    const ecStat = window.ecStat;
    const echarts = window.echarts;
    const dom = document.getElementById(this.id);
    const myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false,
    });

    const data = this.props.data || [];

    // See https://github.com/ecomfe/echarts-stat
    echarts.registerTransform(ecStat.transform.clustering);
    const CLUSTER_COUNT = 6;
    const DIENSIION_CLUSTER_INDEX = 2;
    const COLOR_ALL = [
      '#f7df1e',
      '#f7df1e',
      '#f7df1e',
      '#f7df1e',
      '#f7df1e',
      '#f7df1e',
      '#f7df1e',
    ];
    const pieces = [];
    for (let i = 0; i < CLUSTER_COUNT; i++) {
      pieces.push({
        value: i,
        label: 'cluster ' + i,
        color: COLOR_ALL[i],
      });
    }

    const dataset = [
      {source: data.length > 0 ? data : [[120, 120]]},
      {
        transform: {
          type: 'ecStat:clustering',
          // print: true,
          config: {
            clusterCount: CLUSTER_COUNT,
            outputType: 'single',
            outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX,
          },
        },
      },
    ];
    if (data && data.length > 0) {
      dataset.push({source: data})
    }
    const option = {
      animation: false,
      dataset,
      tooltip: {
        show: false,
        position: 'top',
      },
      visualMap: {
        show: false,
        type: 'piecewise',
        top: 'middle',
        min: 0,
        max: CLUSTER_COUNT,
        left: 10,
        splitNumber: CLUSTER_COUNT,
        dimension: DIENSIION_CLUSTER_INDEX,
        pieces,
      },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      xAxis: {show: false, max: 60, min: -60},
      yAxis: {show: false, max: 60, min: -60},
      series: {
        type: 'scatter',
        encode: { tooltip: [0, 1] },
        symbolSize: 5,
        itemStyle: {
          color: 'yellow',
          borderColor: '#555',
        },
        datasetIndex: 1,
      },
    };

    if (option && typeof option === 'object') {
      // console.log(option, 'option')
      myChart.setOption(option);
    }
    this.myChart = myChart;

    window.addEventListener('resize', myChart.resize);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.data, prevProps.data)) {
      if (this.myChart && this.myChart) {
        const data = this.props.data || [];
        const option = {
          dataset: [
            {source: data.length > 0 ? data : [[120, 120]]},
          ],
        }
        this.myChart.setOption(option)
      }
    }
  }

  render() {
    return (
      <div id={this.id} style={{width: '100%', height: '100%'}} />
    );
  }
}

export default ScatterDiagram;
