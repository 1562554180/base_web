/**
 * 步骤条组件
 */
import React, { Component } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';

const themeConfig = {
  "default": {
    outDotNormalColor: '#FFFFFF',
    outDotSelectedColor: '#00ffdd',
    innerDotNormalColor: '#071530',
    innerDotSelectedColor: '#FBD437',
    lineColor: '#FFFFFF',
  },
  "highlight": {
    outDotNormalColor: '#173690',
    outDotSelectedColor: '#557BE6',
    innerDotNormalColor: '#FFFFFF',
    innerDotSelectedColor: '#36f9f6',
    lineColor: '#173690',
  },
  "greenTheme": {
    outDotNormalColor: '#FFFFFF',
    outDotSelectedColor: '#00ffdd',
    innerDotNormalColor: '#071530',
    innerDotSelectedColor: '#FBD437',
    lineColor: '#FFFFFF',
  },
  "techBlack": {
    outDotNormalColor: '#3d4a5c',
    outDotSelectedColor: '#4da8d4',
    innerDotNormalColor: '#201f2b',
    innerDotSelectedColor: '#89cad8',
    lineColor: '#3d4a5c',
  },
}

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class CustomStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepData: props.data || [],
      selectedDot: props.selectedDot || -1,
      stepBtnSize: props.stepBtnSize || 20,
    }
  }

  componentWillReceiveProps(nextProps) {
    const state = {};
    if(!_.isEqual(this.props.data, nextProps.data)) {
      state.stepData = nextProps.data || [];
    }
    if(!_.isEqual(this.props.selectedDot, nextProps.selectedDot)) {
      state.selectedDot = nextProps.selectedDot;
    }
    if (!_.isEmpty(state)) {
      this.setState(state);
    }
  }

  handleRenderContent = () => {
    const { prevInfo, nextInfo } = this.props;
    const { stepData, stepBtnSize } = this.state;

    if (!_.isEmpty(stepData) && _.isArray(stepData)) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {
            !this.props.hideStepBtn && (
              <Tooltip title={prevInfo || '上一个'}>
                <div style={{ marginRight: 10 }}>
                  <LeftOutlined
                    style={{ cursor: 'pointer', fontSize: stepBtnSize || 20 }}
                    onClick={this.handleClickPrev}
                  />
                </div>
              </Tooltip>
            )
          }
          {
            stepData.map((item, index) => {
              return this.handleRenderStepItem(item, index, stepData.length);
            })
          }
          {
            !this.props.hideStepBtn && (
              <Tooltip title={nextInfo || '下一个'}>
                <div style={{ marginLeft: 10 }}>
                  <RightOutlined
                    style={{ cursor: 'pointer', fontSize: stepBtnSize || 20 }}
                    onClick={this.handleClickNext}
                  />
                </div>
              </Tooltip>
            )
          }
        </div>
      );
    }
  }

  handleClickPrev = () => {
    const { stepData, selectedDot } = this.state;
    let nextSelectedDot = selectedDot - 1;

    if (nextSelectedDot < 0) nextSelectedDot = 0;
    if (selectedDot === nextSelectedDot) return;
    if (this.props.handleClickDot) {
      this.props.handleClickDot(stepData[nextSelectedDot]);
    }
    this.setState({
      selectedDot: nextSelectedDot,
    });
  }

  handleClickNext = () => {
    const { stepData, selectedDot } = this.state;
    let nextSelectedDot = selectedDot + 1;

    if (nextSelectedDot >= stepData.length) nextSelectedDot = stepData.length - 1;
    if (selectedDot === nextSelectedDot) return;
    if (this.props.handleClickDot) {
      this.props.handleClickDot(stepData[nextSelectedDot]);
    }
    this.setState({
      selectedDot: nextSelectedDot,
    })
  }

  handleClickDot = (item, index) => {
    const { selectedDot } = this.state;
    if (index === selectedDot) return;
    if (this.props.handleClickDot) {
      this.props.handleClickDot(item);
    }
    this.setState({
      selectedDot: index,
    })
  }

  handleRenderStepItem = (item, index, length) => {
    if(index !== length - 1) {
      return (
        <>
          {
            this.handleRenderDot(item, index)
          }
          {
            this.handleRenderLine(item)
          }
        </>
      )
    } else {
      return (
        <>
          {
            this.handleRenderDot(item, index)
          }
        </>
      )
    }
  }

  handleRenderDot = (item, index) => {
    const titleContent = (
      <p style={{ marginTop: 5 }}>{item.description || ''}</p>
    )
    return (
      <div style={{ position: 'relative' }}>
        <Tooltip title={item.description ? titleContent : ''}>
          <div style={{ width: this.handleRenderDotSelectSize(item, 'width'), height: this.handleRenderDotSelectSize(item, 'height'), borderRadius: '50%', display: 'flex', alignItems: 'center', 'justifyContent': 'center', background: this.handleRenderDotBgc(item), cursor: 'pointer' }} onClick={() => this.handleClickDot(item, index)}>
            <div style={{ width: this.handleRenderDotSelectSize(item, 'width') - 10, height: this.handleRenderDotSelectSize(item, 'height') - 10, borderRadius: '50%', background: this.handleRenderInnerDotBgc(item) }} />
          </div>
        </Tooltip>
        {
          this.handleRenderInfo(item)
        }
      </div>
    )
  }

  handleRenderInfo = (item) => {
    const { selectedDot } = this.state;
    return (
      <div style={{ position: 'absolute', left: item.id === selectedDot ? '-50%' : '-100%', width: item.infoWidth || 300, textAlign: 'left' }}>
        { item.showTitle && !_.isEmpty(item.title) && (<div>{item.title || ''}</div>) }
      </div>
    )
  }

  handleRenderDotBgc = (item) => {
    const { selectedTheme } = this.props;
    const { selectedDot } = this.state;
    let finalColorStr = themeConfig[selectedTheme].outDotNormalColor;
    if (item.id === selectedDot) {
      if (item.dotSelectColor) {
        finalColorStr = item.dotSelectColor;
      } else {
        finalColorStr = themeConfig[selectedTheme].outDotSelectedColor;
      }
    } else if(item.dotNormalColor) {
      finalColorStr = item.dotNormalColor;
    }
    return finalColorStr;
  }

  handleRenderInnerDotBgc = (item) => {
    const { selectedTheme } = this.props;
    const { selectedDot } = this.state;
    let finalColorStr = themeConfig[selectedTheme].innerDotNormalColor;
    if (item.id === selectedDot) {
      if (item.dotSelectInnerColor) {
        finalColorStr = item.dotSelectInnerColor;
      } else {
        finalColorStr = themeConfig[selectedTheme].innerDotSelectedColor;
      }
    } else if(item.dotNormalInnerColor) {
      finalColorStr = item.dotNormalInnerColor;
    }
    return finalColorStr;
  }

  handleRenderDotSelectSize = (item, type) => {
    const { selectedDot } = this.state;
    let finalWidth = item.dotWidth || 50;
    let finalHeight = item.dotHeight || 50;
    if (item.id === selectedDot) {
      if (item.dotWidth) {
        finalWidth = Number(item.dotWidth) + 15;
      } else {
        finalWidth = 65;
      }
      if (item.dotHeight) {
        finalHeight = Number(item.dotHeight) + 15;
      } else {
        finalHeight = 65;
      }
    }
    if (type === 'width') {
      return finalWidth;
    } else if (type === 'height') {
      return finalHeight;
    }
  }

  handleRenderLine = (item) => {
    const { selectedTheme } = this.props;
    return (
      <div style={{ width: item.lineWidth || 100, height: item.lineHeight || 5, background: item.lineColor || themeConfig[selectedTheme].lineColor, borderRadius: item.lineRadius || '10%', margin: item.lineMargin || "0 5px"  }} />
    )
  }

  render() {
    return (
      <div>
        {
          this.handleRenderContent()
        }
      </div>
    );
  }
}
