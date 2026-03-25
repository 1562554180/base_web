import React, { Component } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { DatePicker, Dropdown, Button, message } from 'antd';
import _ from 'lodash';
import Modal from 'utils/modal';
import config from 'utils/config';
import { calcTimeDiff } from 'utils/utils';
import classNames from 'classnames';
import { searchTimesLimit, getTimeDifference, createTimeLimitMsg } from 'utils/utils';
import moment from 'moment';
import styles from './index.less';

const confirm = Modal.confirm;
const formatText = 'YYYY-MM-DD HH:mm:ss';
const formatZero = 'YYYY-MM-DD 00:00';
const typeObj = {
  s: '秒',
  m: '分钟',
  h: '小时',
  d: '天',
  w: '周',
  M: '月',
  y: '年',
}
const positionTimeRanges = [
  {value: 2, type: 'h', label: '最近2小时', key: '2h'},
  {value: 1, type: 'd', label: '最近1天', key: '1d'},
  {value: 2, type: 'd', label: '最近2天', key: '2d'},
  {value: 1, type: 'w', label: '最近1周', key: '1w'},
  // {value: 2, type: 'w', label: '最近2周', key: '2w'},
  // {value: 1, type: 'M', label: '最近1个月', key: '1M'},
  // {value: 3, type: 'M', label: '最近3个月', key: '3M'},
  // {value: 6, type: 'M', label: '最近6个月', key: '6M'},
  // {value: 1, type: 'y', label: '最近1年', key: '1y'},
];

const RangePicker = DatePicker.RangePicker;

export default class CustomDatePicker extends Component {
  constructor(props) {
    super(props)
    const state = this.initBaseState(props);
    this.state = {
      open: false,
      visible: false,
      historyTimes: [],
      posTimeRanges: props.positionTimeRanges || positionTimeRanges,
      ...state,
    }
    this.historyId = 0;
  }

  initBaseState = (props, isChange) => {
    const { timeOption = {}, format, onPickerChange } = props;
    const { timeIntervalOption, defaultValue } = timeOption;
    const newState = {
      showText: '',
      pickerValue: [],
      showPickerValue: [],
      timerKey: '-1',
    };

    if(timeIntervalOption && timeIntervalOption !== 'custom') {
      const value = parseInt(timeIntervalOption, 10);
      const type = timeIntervalOption[timeIntervalOption.length - 1];
      if(typeObj[type] && !isNaN(value) && value > 0) {
        const showText = `最近${value}${typeObj[type]}`;
        const item = {value, type, label: showText, key: timeIntervalOption};
        this.getRelationTimeRange(item, newState, props.format, isChange, props.timeUnit)
      };
    } else if(defaultValue && defaultValue.length > 0) {
      const timer1 = moment.isMoment(defaultValue[0]) ? defaultValue[0] : moment(defaultValue[0]);
      const timer2 = moment.isMoment(defaultValue[1]) ? defaultValue[1] : moment(defaultValue[1]);
      const preValue = moment(timer1).format(format || formatText);
      const nextValue = moment(timer2).format(format || formatText);
      const showText = `${preValue} - ${nextValue}`;
      const value = [timer1, timer2];
      newState.pickerValue = value;
      newState.showPickerValue = value;
      newState.showText = showText;
      newState.timerKey = 'custom';
    }
    // if(onPickerChange) onPickerChange(newState.timerKey, newState.pickerValue, newState.pickerValue)

    return newState;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.update !== nextProps.update
      || !_.isEqual(this.props.timeOption, nextProps.timeOption)
  ) {
      const newState = this.initBaseState(nextProps);
      this.setState(newState)
    }

    if(this.props.format !== nextProps.format) {
      const newState = this.initBaseState(nextProps, true);
      this.setState({isUnitChange: true})
      this.setState(newState)
    }
  }

  getRelationTimeRange = (item, state, matt, isChange, unit) => {
    const { format, timeUnit, callbackTimes, customThisTime } = this.props;
    const times = {h: 1000 * 60 * 60, m: 1000 * 60};
    const dates = {d: 'days', M: 'months', w: 'weeks', y: 'years'};
    const { value, type, label, key } = item;
    let pickerValue = [];
    const thisTime = customThisTime ? customThisTime : moment().format('X') * 1000;
    if(times[type]) {
      pickerValue = [moment(thisTime - value * times[type]), moment(thisTime)]
    } else if(dates[type]) {
      pickerValue = [moment(thisTime).subtract(value, type), moment(thisTime)]
    }
    let showText = label;
    if (pickerValue.length === 2) {
      showText = <span>{pickerValue[0].format(matt || format || formatText)} - {pickerValue[1].format(matt || format || formatText)} {label}</span>
      // showText = <span>{pickerValue[0].format(((isChange && unit === 0) ? formatZero : matt ) || format || formatText)} - {pickerValue[1].format(((isChange && unit === 0) ? formatZero : matt ) || format || formatText)} {label}</span>
    }

    state.pickerValue = pickerValue;
    state.showPickerValue = pickerValue;
    state.showText = showText;
    state.timerKey = key;
    if(callbackTimes) {
      this.props.callbackTimes(pickerValue)
    }
  }

  setRelationTimeRange = (item, disabledAdd) => {
    if (this.props.changeRightTime) this.props.changeRightTime();
    const { format } = this.props;
    const state = {};
    this.getRelationTimeRange(item, state);
    const pickerValue = state.pickerValue || [];
    let timeValue = [];
    if(pickerValue && pickerValue[0]) {
      timeValue = [moment(pickerValue[0]).format(format || formatText), moment(pickerValue[1]).format(format || formatText)];
    }
    const newState = {
      ...state,
      visible: false,
    }
    if (!disabledAdd) {
      const { historyTimes } = this.state;
      const list = _.cloneDeep(historyTimes);
      list.unshift({time: item})
      newState.historyTimes = list;
    }

    this.setState(newState, () => {
      const { onPickerChange } = this.props;
      this.useCustomTimes = false;
      if(onPickerChange) onPickerChange(state.timerKey, state.pickerValue, timeValue, true)
    })
  }

  clearTimer = () => {
    const that = this;
    this.setState({
      visible: false,
    }, () => {
      confirm({
        title:'确定要切换至 不限时间吗？',
        okText:'是',
        cancelText:'否',
        onOk(){
          that.setState({
            pickerValue: [],
            showPickerValue: [],
            showText: '不限时间',
            visible: false,
            timerKey: '-1',
          }, () => {
            const { onPickerChange } = that.props;
            if(onPickerChange) onPickerChange('-1', [], [], {})
          })
        },
      });
    })
  }

  timeSelect = () => {
    const { timerKey, posTimeRanges } = this.state;
    const timeLimit = config.timeLimit;
    return (
      <div style={{fontSize: 12, paddingLeft: 20, marginLeft: 40, borderLeft: '1px solid #48566e'}}>
        {
          (posTimeRanges || []).map(item => {
            const limit = searchTimesLimit[timeLimit] || {};
            const { limitArr } = limit;
            const isLimit = !_.isEmpty(limitArr) && limitArr.includes(item.key);
            let className = timerKey === item.key ? classNames(styles.active_time_label, 'activeTimeLabel') : 'time_label';
            if (isLimit) {
              className = styles.custom_time_label;
            }
            return (
              <div
                onClick={() => !isLimit ? this.setRelationTimeRange(item) : null}
                className={className}
                key={item.label}
              >
                {item.label}
              </div>
            )
          })
        }
        <div className={timerKey === 'custom' ? classNames(styles.active_time_label, 'activeTimeLabel') : styles.custom_time_label}>自定义时间</div>
        {/* { !this.props.positionTimeRanges && (!timeLimit) &&
          <div className={timerKey === '-1' ? classNames(styles.active_time_label, 'activeTimeLabel') : 'time_label'} onClick={() => this.clearTimer()}>不限时间（谨慎）</div>
        } */}
      </div>
    )
  }

  timeChange = (t, y) => {
    const { onChangeTime } = this.props;
    this.useCustomTimes = true;
    this.setState({
      pickerValue: t,
    }, () => {
      if(onChangeTime) {
        onChangeTime(t, y, this.props.lineType)
      }
    })
  }

  onOpenChange = (a) => {
    this.setState({
      open: a,
    })
  }

  getTimeInterval = () => {
    const { format } = this.props;
    const { showPickerValue } = this.state;
    let timer;
    if(showPickerValue.length === 2 && showPickerValue[1]) {
      timer = calcTimeDiff(moment(showPickerValue[0]).format(format || formatText), moment(showPickerValue[1]).format(format || formatText));
    }
    return timer;
  }

  createPicker = () => {
    const { format, size, style, otherProps={} } = this.props;
    const { pickerValue, historyTimes, open, isUnitChange } = this.state;
    const timer = this.getTimeInterval();
    return (
      (<div onClick={(e) => e.stopPropagation()}>
        <div onClick={(e) => e.stopPropagation()}>
          <RangePicker
            showTime={{defaultValue: moment('00:00', 'HH:mm')}}
            open={open}
            onOpenChange={this.onOpenChange}
            popupClassName='custom_picker'
            value={pickerValue}
            size={size || 'small'}
            allowClear={false}
            style={{width: size === 'default' ? 350 : 320, ...style}}
            onChange={this.timeChange}
            format={format || formatText}
            {...otherProps}
          />
          <Button type='primary' size={size || 'small'} style={{margin: 15}} onClick={this.setShowText}>确认</Button>
        </div>
        {timer && <div style={{marginBottom: 7}}>间隔：{`${timer[0]} ${timer[1]}`}</div>}
        {historyTimes && historyTimes.length > 0 && (
        <h4>
          最近使用时间
        </h4>)}
        {
          historyTimes.map((i, index) => {
            const item = i.time;
            this.historyId += 1;
            if(index > 4) return null;
            if (_.isArray(item)) {
              return (
                <div
                  className='time_label'
                  onClick={() => this.useHistoryTime(item)}
                  style={{cursour: 'pointer', padding: '0 10px'}}
                  key={this.historyId}
                >
                  {moment(item[0]).format(format || formatText)} - {moment(item[1]).format(format || formatText)}
                </div>)
            } else {
              return (
                <div className='time_label' onClick={() => this.setRelationTimeRange(item, true)} style={{cursour: 'pointer'}} key={this.historyId}>
                  {item.label}
                </div>
              )
            }
          })
        }
        <div className={styles.periodStyle} style={{display: 'flex', justifyContent: 'space-between', width: 380}} />
      </div>)
    );
  }

  useHistoryTime = (item) => {
    const { format } = this.props;
    const timer1 = item[0];
    const timer2 = item[1];
    const timeLimit = config.timeLimit;
    const time = searchTimesLimit[timeLimit] || {};
    const isLimit = getTimeDifference(timer1, timer2, format);
    if (isLimit) {
      return message.warning(createTimeLimitMsg(time.char));
    }
    const prevtime = moment(timer1).format(format || formatText);
    const nexttime = moment(timer2).format(format || formatText);
    this.setState({
      visible: false,
      timerKey: 'custom',
      showText: `${prevtime} - ${nexttime}`,
      pickerValue: item,
      showPickerValue: item,
    }, () => {
      const { onPickerChange } = this.props;
      if (onPickerChange) {
        onPickerChange('custom', item, [prevtime, nexttime])
      }
    })
  }

  createPopoverContent = () => {
    return (
      <div className='customDataPickerBox'>
        {this.createPicker()}
        {this.timeSelect()}
      </div>
    )
  }

  setShowText = () => {
    const { format } = this.props;
    const { pickerValue, historyTimes } = this.state;
    const timer1 = pickerValue[0];
    const timer2 = pickerValue[1];
    const timeLimit = config.timeLimit;
    const time = searchTimesLimit[timeLimit] || {};
    const isLimit = getTimeDifference(timer1, timer2, format);
    if (isLimit) {
      return message.warning(createTimeLimitMsg(time.char));
    }
    const prevtime = moment(timer1).format(format || formatText);
    const nexttime = moment(timer2).format(format || formatText);
    const showText = `${prevtime} - ${nexttime}`;
    const list = _.cloneDeep(historyTimes);
    list.unshift({time: pickerValue})
    this.setState({
      visible: false,
      showPickerValue: pickerValue,
      showText,
      timerKey: 'custom',
      historyTimes: list,
    }, () => {
      const { onPickerChange } = this.props;
      if (onPickerChange) {
        onPickerChange('custom', pickerValue, [prevtime, nexttime])
      }
    })
  }

  updateVisible = (v) => {
    const { open } = this.state;
    if (open) return false;
    this.setState({
      visible: v,
    })
  }

  showInterval = () => {
    const { timerKey } = this.state;
    const timer = this.getTimeInterval();
    if (timerKey === 'custom' && timer && timer.length > 0) {
      return ` 间隔${timer[0]} ${timer[1]}`
    }
    return null;
  }

  render() {
    const { disabled, size, height, otherStyle={} } = this.props;
    const { visible, showText } = this.state;
    const style = {...otherStyle};
    if(disabled) {
      style.background = '#405186';
      style.cursor = 'not-allowed';
      style.color = 'rgb(170, 170, 170)';
    }
    if (size === 'default') {
      style.height = 'auto';
      style.lineHeight = '35px';
    }
    if(height) {
      style.height = height
      style.lineHeight = `${height}px`;
    }
    return <>
      <Dropdown
        open={visible}
        trigger={['click']}
        overlay={this.createPopoverContent()}
        onVisibleChange={(v) => this.updateVisible(v)}
      >
        <div
          onClick={() => this.setState({visible: disabled ? false : !visible})}
          className={disabled ? 'timeBoxDisabled' : 'timeBox'}
          style={{fontSize: 13, width: this.props.width || 'auto', verticalAlign: 'top', ...style }}
        >
          <span className={styles.timeContent}>{showText}{this.showInterval()}</span>
        </div>
      </Dropdown>

    </>;
  }
}
