import React, { Component } from 'react';
import { DataSet } from 'DataSet';
import { connect } from 'dva';
import { getByteSize } from 'utils/utils';
import _ from 'lodash';
import { Chart, Geom, Axis, Tooltip, Coord, Label } from 'bizcharts';
import { colorObj } from 'common/colors';

const { DataView } = DataSet;

function getTotalValue(data) {
  let num = 0;
  data.forEach(item => {
    num += item.value;
  })
  return num;
}

function toFixedFive (val, total) {
  if(val === 0) return '0';
  const percent = val / total;
  if(percent < 0.0001) return '< 0.01%';
  return `${(percent * 100).toFixed(2)}%`;
}


@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class Chartsmodel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.initBaseState(props),
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.selectedTheme !== nextProps.selectedTheme) {
      const state = this.initBaseState(nextProps);
      this.setState(state)
    }
  }

  initBaseState = (props) => {
    const { selectedTheme } = props;
    const state = colorObj.pieChart[selectedTheme ||'default'];
    return state;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  render(){
    const { fill, stroke, colors } = this.state;
    const { outData = [], style = {}, handleClick, dblHandleClick, isTrafficSize, unit, padding } = this.props;
    const totalValue = getTotalValue(outData || []);
    const cals = {
      percent: {
        formatter: val => toFixedFive(val, totalValue),
      },
    };
    const dv = new DataView();
    dv.source(outData).transform({
      type: 'percent',
      field: 'value',
      dimension: 'name',
      as: 'percent',
    });
    const chartStyle = {height: style.height || 400};
    if(style.width && _.isNumber(style.width)) {
      chartStyle.width = style.width;
    }
    return (
      <div style={{cursor: 'pointer',...style}}>
        <Chart
          {...chartStyle}
          data={dv}
          scale={cals}
          forceFit
          animate={false}
          padding={padding || [80,80,20,80]}
          onPlotClick={ev=>{
            if(handleClick && ev.data) {
              handleClick(ev)
            }
          }}
          onPlotDblClick={ev=>{
            if(dblHandleClick && ev.data) {
              dblHandleClick(ev)
            }
          }}
        >
          <Coord type='theta' radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name} : {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color={colors}
            tooltip={['name*value',(name, value) => {
              const otherValue = unit ? `${value} ${unit}` : value;
              const uval = `${toFixedFive(value, totalValue)} (${isTrafficSize ? `${getByteSize(value)}，${value}字节` : otherValue})`;
              return {
                name,
                value: uval,
              };
            }]}
            style={{lineWidth: 1, stroke}}
          >
            <Label
              content='percent'
              textStyle={{fill}}
              formatter={(val, item) => {
              const v = toFixedFive(item.point.value, totalValue);
              return `${item.point.name}: ${v}`;
              }}
            />
          </Geom>
        </Chart>
      </div>
    )
  }
}
