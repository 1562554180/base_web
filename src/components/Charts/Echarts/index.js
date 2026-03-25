import React, { PureComponent } from 'react';
import * as echarts from 'echarts';
import _ from 'lodash';
import { Empty } from 'antd';

export default class EchartsHeatMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.chart = null;
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    const { options } = this.props;
    if (!_.isEmpty(options)) {
      this.initChart(this.props);
    }
    if (this.chart) {
      window.addEventListener('resize', this.handleResize);
    }
  }

  handleResize = (e) => {
    const { isUseCustomResize, handleCustomResize } = this.props;
    if (isUseCustomResize) {
      handleCustomResize();
    } else {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }

  initChart = (props) => {
    const { id, options, selectedTheme } = props;
    const container = document.getElementById(id || 'ecahrtsBox');
    if (container) {
      // if (this.chart) {
      //   this.chart.dispose();
      //   this.chart = null;
      // }
      if (!this.chart) {
        this.chart = echarts.init(container);
      }
      let customOptions = {};
      if (options) {
        customOptions = options;
      }
      if (this.chart) {
        this.chart.resize();
        this.chart.setOption(customOptions, true);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.data, nextProps.data) || this.props.selectedTheme !== nextProps.selectedTheme || this.props.id !== nextProps.id) {
      this.initChart(nextProps);
    }
  }

  componentWillUnmount() {
    this.chart = null;
    window.removeEventListener('resize', this.handleResize);
  }

  handleSaveAsPng = () => {
    if (this.chart) {
      const picInfo = this.chart.getDataURL({
        type: 'png',
        pixelRatio: 1.5,
        backgroundColor: '#071530',
      })
      const elink = document.createElement('a');
      elink.download = '数据';
      elink.style.display = 'none';
      elink.href = picInfo;
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    }
  }

  render() {
    const { width, height, otherStyles = {}, id, options = {} } = this.props;
    const styles = {
      width: width || '100%',
      height: height || '100%',
      ...otherStyles,
    }
    return (
      <>
        <div style={styles} id={id || 'ecahrtsBox'} />
      </>
    );
  }
}