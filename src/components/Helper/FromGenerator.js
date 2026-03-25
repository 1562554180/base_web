import React, { PureComponent } from 'react';
import _ from 'lodash';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import { Select, DatePicker, Row, Col, Input, Checkbox, Tooltip, Switch } from 'antd';
import { ip2int } from 'utils/utils';
import config from 'utils/config';
import { ipTypeFields, emunTypeFields, timeTypeFields } from 'utils/classifier_fields';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const regHex =/^[0-9a-fA-F]{1,}$/;
const ipReg = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
const types = [
  {key: 'range', label: '区间'}, 
  {key: 'gte', label: '大于等于'}, 
  {key: 'lte', label: '小于等于'}, 
  {key: 'gt', label: '大于'}, 
  {key: 'lt', label: '小于'}, 
  {key: 'equal', label: '等于'}, 
  {key: 'noEqual', label: '不等于'}, 
];
const mailFields = ['attch_info', 'mailfrom', 'rcptto','from','to','cc','bcc', 'queries', 'answers'];

const specialField = {}

export default class MultiColHorizontalFormGenerator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  updateIpValues = (n, f, v) => {
    const ipValues = this.state[f] || {};
    const newIpValues = _.cloneDeep(ipValues)
    newIpValues[n] = v;
    this.setState({
      [f]: newIpValues,
    },() => this.setIpFieldsValue(f))
  }

  setIpFieldsValue = (f) => {
    config.disableSubmit = false;
    const rangeValues = this.state[f] || {};
    const type = this.state[`${f}_type`] || 'equal';
    const { setFields } = this.props.form;
    if(type !== 'range') {
      if(rangeValues[1] && !ipReg.test(rangeValues[1])) {
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: rangeValues[1]}, errors: [new Error('请输入正确的IP格式')]}})
      } else {
        return setFields({[f]: {value: {type, value: rangeValues[1]}}})
      }
    } else if(type === 'range') {
      if(!rangeValues[1] || !rangeValues[2]) {
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: [rangeValues[1] || '', rangeValues[2] || '']}, errors: [new Error('区间类型时，区间范围不能为空')]}})
      } else if((rangeValues[1] && !ipReg.test(rangeValues[1])) || (rangeValues[2] && !ipReg.test(rangeValues[2]))) {
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: [rangeValues[1], rangeValues[2]]}, errors: [new Error('请输入正确的IP格式')]}})
      } else if(ip2int(rangeValues[1]) > ip2int(rangeValues[2])){
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: [rangeValues[1], rangeValues[2]]}, errors: [new Error('请输入正确的IP范围')]}})
      } else {
        return setFields({[f]: {value: {type, value: [rangeValues[1], rangeValues[2]]}}})
      }
    }
  }

  updateTextValues = (n, f, v) => {
    const textValues = this.state[f] || {};
    const newTextValues = _.cloneDeep(textValues)
    newTextValues[n] = v;
    this.setState({
      [f]: newTextValues,
    },() => this.setTextFieldsValue(f))
  }

  setTextFieldsValue = (f) => {
    const values = this.state[f] || {};
    const { setFieldsValue } = this.props.form;
    setFieldsValue({[f]: {value: values.value, type: values.checked === true ? 'complex' : 'simple'}})
  }

  updateKeywordValues = (v, f, t) => {
    const rangeValues = this.state[f] || {};
    const newRangeValues = _.cloneDeep(rangeValues)
    newRangeValues[t] = v;
    this.setState({
      [f]: newRangeValues,
    },() => this.setKeywordFieldsValue(f))
  }

  setKeywordFieldsValue = (f) => {
    const values = this.state[f] || {};
    const { setFieldsValue } = this.props.form;
    setFieldsValue({[f]: {value: values.value, type: values.type || 'startWith'}})
  }

  updateLongValues = (n, f, v) => {
    const rangeValues = this.state[f] || {};
    const newRangeValues = _.cloneDeep(rangeValues)
    newRangeValues[n] = v;
    this.setState({
      [f]: newRangeValues,
    },() => this.setLongFieldsValue(f))
  }

  setLongFieldsValue = (f) => {
    config.disableSubmit = false;
    const rangeValues = this.state[f] || {};
    const type = this.state[`${f}_type`] || 'equal';
    const { setFields } = this.props.form;
    if(type !== 'range') {
      if(rangeValues[1] && isNaN(Number(rangeValues[1]))) {
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: rangeValues[1]}, errors: [new Error('请输入正确的格式')]}})
      } else {
        return setFields({[f]: {value: {type, value: rangeValues[1]}}})
      }
    } else if(type === 'range') {
      if(!rangeValues[1] || !rangeValues[2]) {
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: rangeValues[1]}, errors: [new Error('区间类型时，区间范围不能为空')]}})
      } else if((rangeValues[1] && isNaN(Number(rangeValues[1]))) || (rangeValues[2] && isNaN(Number(rangeValues[2])))) {
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: [rangeValues[1], rangeValues[2]]}, errors: [new Error('请输入正确的格式')]}})
      } else if(Number(rangeValues[1]) > Number(rangeValues[2])){
        config.disableSubmit = true;
        return setFields({[f]: {value: {type, value: [rangeValues[1], rangeValues[2]]}, errors: [new Error('请输入正确的范围')]}})
      } else {
        return setFields({[f]: {value: {type, value: [rangeValues[1], rangeValues[2]]}}})
      }
    }
  }

  isIntType = (type) => {
    return ['long', 'integer'].includes(type)
  }

  isStrType = (type) => {
    return ['keyword', 'text', 'string'].includes(type)
  }
 
  componentWillReceiveProps(nextProps) {
    if(this.props.isReset !== nextProps.isReset) {
      const newState = _.cloneDeep(this.state);
      for(const i in newState) {
        newState[i] = null;
      }
      this.setState(newState);
    }
    if(!_.isEqual(this.props.fieldParams, nextProps.fieldParams) ||
      this.props.updatefieldParams !== nextProps.updatefieldParams
    ) {
      const { type, value, field, ...otherState } = nextProps.fieldParams || {};
      if(emunTypeFields[field]) {
        const { setFields } = this.props.form || {};
        if(setFields) {
          setFields({[field]: {value: value + ''}})
        }
      } else {
        this.setState(otherState, () => {
          if(ipTypeFields[field]) {
            this.setIpFieldsValue(field)
          } else if(this.isStrType(type)) {
            this.setKeywordFieldsValue(field)
          } else if(this.isIntType(type)) {
            this.setLongFieldsValue(field)
          }
        })
      }
    }
  }

  updatelongtype = (value, key) => {
    this.setState({
      [`${key}_type`]: value,
    }, () => this.setLongFieldsValue(key))
  }

  updateiptype = (value, key) => {
    this.setState({
      [`${key}_type`]: value,
    }, () => this.setIpFieldsValue(key))
  }

  createInput = (item, form) => {
    if(config.protoHiddenFields[item.field_name]) return null;
    const getFieldDecorator = form.getFieldDecorator;
    
    const required = false;

    item.name = item.mapped_name ? item.mapped_name : item.field_name;
    const type = item.field_type;
    if(emunTypeFields[item.name]) {
      const obj = emunTypeFields[item.name];
      const arr = _.keys(obj)
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>} fieldName={item.name}>
            {getFieldDecorator(item.name, {
                initialValue: item.value || '',
                rules:[{required, message:`${item.readable_name}为必填项` }],
              })
              (
                <Select allowClear size={config.smallSize ? 'small' : 'default'}>
                  {
                    arr.map(e=>{
                      return (<Select.Option key={e} value={e}>{obj[e]}</Select.Option>)
                    })
                  }
                </Select>)
            }
          </FormItem>
        </Col>
      )
    } else if (timeTypeFields[item.field_name] || type === 'date') {
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>} fieldName={item.name}>
            {getFieldDecorator(item.name, {
              })
              (<RangePicker style={{width: item.width || 310, minWidth: 310}} format='YYYY-MM-DD HH:mm:ss' showTime size={config.smallSize ? 'small' : 'default'} />)
            }
          </FormItem>
        </Col>
      )
    } else if(ipTypeFields[item.field_name] || type === 'ip') {
      const value = this.state[`${item.field_name}_type`] || 'equal';
      const values = this.state[item.field_name] || {};
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem>
            <Tooltip title={`字段英文名: ${item.field_name}`}><span>{item.readable_name}</span></Tooltip>
            {getFieldDecorator(item.field_name, {
              })
              (<div />)}
            <div style={{marginTop: 8, display: 'flex'}}>
              <Input 
                value={values[1] || ''}
                size={config.smallSize ? 'small' : 'default'} 
                style={{width: value !== 'range' ? '100%' : 'calc(65% - 5px)'}} 
                onChange={(e)=> this.updateIpValues(1, item.field_name, e.target.value)} 
                addonBefore={
                  <Select style={{width: 100}} size={config.smallSize ? 'small' : 'default'} onChange={(e) => this.updateiptype(e, item.field_name)} value={value}>
                    {
                      types.map(t => {
                        return <Select.Option key={t.key}>{t.label}</Select.Option>
                      })
                    }
                  </Select>
                }
              />
              {value === 'range' && <div style={{width: 10, textAlign: 'center'}}>-</div>}
              <Input value={values[2] || ''} size={config.smallSize ? 'small' : 'default'} style={{width: 'calc(35% - 5px)', display: value === 'range' ? 'block' : 'none'}} onChange={(e)=> this.updateIpValues(2, item.field_name, e.target.value)} />
            </div>
          </FormItem>
        </Col>
      )
    } else if(this.isStrType(type) || mailFields.includes(item.field_name)) {
      const values = this.state[specialField[item.field_name] || item.field_name] || {};
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem fieldName={item.name}>
            <Tooltip title={`字段英文名: ${item.field_name}`}><span>{item.readable_name}</span></Tooltip>
            {getFieldDecorator(specialField[item.field_name] || item.field_name, {
                initialValue: item.value || '',
                rules:[{required: false, message:`${item.readable_name}为必填项` }],
              })
              (<div />)
            }
            <Input 
              style={{marginTop: 8}}
              value={values.value || ''}
              size={config.smallSize ? 'small' : 'default'} 
              onChange={(e) => this.updateKeywordValues(e.target.value, specialField[item.field_name] || item.field_name, 'value')}
              addonBefore={(
                <Select style={{width: 80}} size={config.smallSize ? 'small' : 'default'} onChange={(e) => this.updateKeywordValues(e, specialField[item.field_name] || item.field_name, 'type')} value={values.type || 'startWith'}>
                  <Select.Option value='equal'>等于</Select.Option>
                  <Select.Option value='startWith'>前缀</Select.Option>
                  <Select.Option value='endWith'>后缀</Select.Option>
                  <Select.Option value='include'>包含</Select.Option>
                  <Select.Option value='outclude'>不包含</Select.Option>
                </Select>)
              } 
            />
          </FormItem>
        </Col>
      )
    } else if(this.isIntType(type)) {
      const value = this.state[`${item.field_name}_type`] || 'equal';
      const values = this.state[item.field_name] || {};

      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem>
            <Tooltip title={`字段英文名: ${item.field_name}`}><span>{item.readable_name}</span></Tooltip>
            {getFieldDecorator(item.field_name, {
              })
              (<div />)}
            <div style={{marginTop: 8, display: 'flex'}}>
              <Input
                addonBefore={
                  <Select style={{width: 100}} size={config.smallSize ? 'small' : 'default'} onChange={(e) => this.updatelongtype(e, item.field_name)} value={value}>
                    {
                      types.map(t => {
                        return <Select.Option key={t.key}>{t.label}</Select.Option>
                      })
                    }
                  </Select>
                }
                size={config.smallSize ? 'small' : 'default'} 
                style={{width: value !== 'range' ? '100%' : 'calc(65% - 5px)'}} 
                value={values[1] || ''}
                onChange={(e)=> this.updateLongValues(1, item.field_name, e.target.value)} 
              />
              {value === 'range' && <div style={{width: 10, textAlign: 'center'}}>-</div>}
              <Input value={values[2] || ''} size={config.smallSize ? 'small' : 'default'} onChange={(e)=> this.updateLongValues(2, item.field_name, e.target.value)} style={{width: 'calc(35% - 5px)', display: value === 'range' ? 'block' : 'none'}} />
            </div>
          </FormItem>
        </Col>
      )
    } else if (type === 'port') {
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>}>
            {getFieldDecorator(item.name, {
              rules:[{pattern: new RegExp(portReg), message: '请输入正确的端口格式'}],
              })
              (<Input placeholder='请输入' size={config.smallSize ? 'small' : 'default'} />)
            }
          </FormItem>
        </Col>
      )
    } else if (type === 'hex') {
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>} fieldName={item.name}>
            {getFieldDecorator(item.name, {
                rules: [{pattern: new RegExp(regHex), message: '请输入十六进制格式'}],
              })
              (<Input placeholder='请输入' size={config.smallSize ? 'small' : 'default'} />)
            }
          </FormItem>
        </Col>
      )
    } else if (type === 'ip') {
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>} fieldName={item.name}>
            {getFieldDecorator(item.name, {
                rules:[{pattern: new RegExp(ipReg), message: '请输入正确的IP格式'}],
              })
              (<Input placeholder='请输入' size={config.smallSize ? 'small' : 'default'} />)
            }
          </FormItem>
        </Col>
      )
    } else if(type === 'text' || type === 'string') {
      const textValues = this.state[item.field_name] || {};
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>} fieldName={item.name}>
            <div style={{display: 'flex'}}>
              <div style={{width: 50}}>
                <Tooltip title={textValues.checked === true ? '切换为简单搜索' : '切换为高级搜索'}>
                  <Switch checked={textValues.checked || false} onChange={(e)=>this.updateTextValues('checked', item.field_name, e)} />
                </Tooltip>
              </div>
              {getFieldDecorator(item.name, {
                  initialValue: item.value || '',
                  rules:[{required: false, message:`${item.readable_name}为必填项` }].concat(item.rules || []),
                })
                (<div />)
              }
              <Input size={config.smallSize ? 'small' : 'default'} value={textValues.value || ''} onChange={(e)=>this.updateTextValues('value', item.field_name, e.target.value)} style={{width: 'calc(100% - 50px)'}} placeholder='请输入'  />
            </div>
          </FormItem>
        </Col>
      )
    } else if(type === 'checkbox') {
      return (
        <Col style={{height: 68, paddingTop: 32}} key={item.field_name} span={12}>
          <FormItem fieldName={item.name}>
            <Tooltip title={`字段英文名: ${item.field_name}`}><span>{item.readable_name}</span></Tooltip>
            {getFieldDecorator(item.name, {
                initialValue: item.value || '',
                rules:[{required: false, message:`${item.readable_name}为必填项` }],
              })
              (<Checkbox style={{float:'left',marginRight:8}} />)
            }
          </FormItem>
        </Col>
      )
    } else if(type === 'select') {
      const options = item.children || [];
      return (
        <Col style={{height: 68}} key={item.field_name} span={12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>} fieldName={item.name}>
            {getFieldDecorator(item.name, {
                initialValue: item.value || '',
                rules:[{required, message:`${item.readable_name}为必填项` }],
              })
              (
                <Select allowClear size={config.smallSize ? 'small' : 'default'}>
                  {
                    options.length > 0 && options.map(e=>{
                      return (<Select.Option key={e.key} value={e.key}>{e.value}</Select.Option>)
                    })
                  }
                </Select>)
            }
          </FormItem>
        </Col>
      )
    } else if(type === 'simpletext') {
      const style = {};
      if(item.field_name === 'debug_type') {
        style.width = '50%';
      }
      return (
        <Col style={{height: 68}} key={item.field_name} span={item.field_name === 'debug_type' ? 24 : 12}>
          <FormItem label={<Tooltip title={`字段英文名: ${item.field_name}`}>{item.readable_name}</Tooltip>} fieldName={item.name}>
            {getFieldDecorator(item.name, {
                initialValue: item.value || '',
                rules:[{required: false, message:`${item.readable_name}为必填项` }].concat(item.rules || []),
              })
              (<Input style={style} size={config.smallSize ? 'small' : 'default'}  />)
            }
          </FormItem>
        </Col>
      )
    }
    return null;
  }

  render() {
    const {
      formItems,
      form,
      code,
      additional,
    } = this.props;
    const newformItems = _.cloneDeep(formItems);
    newformItems.forEach(item => {
      if(additional && item.field_name) {
        item.field_name = additional + item.field_name
      }
      if(additional && item.mapped_name) {
        item.mapped_name =  additional + item.mapped_name
      }
    })
    const items = newformItems.map(item => this.createInput(item, form, code))
    return (
      <div layout='horizontal'>
        <Row gutter={16}>
          {items}
        </Row>
      </div>
    )
  }
}
