/* eslint-disable no-case-declarations */
import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import { Input, Radio, Checkbox, Select, Switch, DatePicker, Cascader, Tooltip, InputNumber } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Icon from 'components/Icon';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const RangePicker = DatePicker.RangePicker;
const regHex = /^[0-9a-fA-F]{1,}$/;
const ipReg = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
const password = /^(?=.*\d{1,})(?=.*[A-Z]{1,})(?=.*[a-z]{1,}).{6,16}$/

class FormItemCreator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowPasswordEye: false,
    };
  }

  toMomentData = (type, value, format) => {
    if (type === 'date') {
      if (!value) {
        return null;
      }
      if (_.isString(value) || _.isNumber(value)) {
        return moment(value * 1)
      }
      return moment(value[0] * 1)
    }
    if (type === 'date_range') {
      if (_.isArray(value)) {
        if (!value[0]) {
          return [];
        } else {
          return [moment(value[0], format || 'YYYY-MM-DD HH:mm:ss'), moment(value[1], format || 'YYYY-MM-DD HH:mm:ss')]
        }
      } else {
        return [];
      }
    }
  }

  numRangeChange = (value, idx, field, callback, valueRange = '', values) => {
    const { form } = this.props;
    const { getFieldValue } = form;
    if (valueRange.startsWith('(') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value >= v2) {
        callback(`取值错误，(${v1},${v2})`)
      }
    } else if (valueRange.startsWith('(') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value > v2) {
        callback(`取值错误，(${v1},${v2}]`)
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value >= v2) {
        callback(`取值错误，[${v1},${v2})`)
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value > v2) {
        callback(`取值错误，[${v1},${v2}]`)
      }
    } else if (idx === 0) {
      const value1 = getFieldValue(field) || '';
      if (value && value1 && Number(value1) < Number(value)) {
        callback(`取值错误，应小于${value1}`)
      }
    } else if (idx === 1) {
      const value1 = getFieldValue(field) || '';
      if (value && value1 && Number(value1) > Number(value)) {
        callback(`取值错误，应大于于${value1}`)
      }
    }
    callback()
  }

  initValidatorPlaceholder = (valueRange, values) => {
    if (valueRange.startsWith('>')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      return `>${uv}`
    } else if (valueRange.startsWith('<')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      return `<${uv}`
    } else if (valueRange.startsWith('(') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      return `(${v1 || 0},${v2 || 0})`;
    } else if (valueRange.startsWith('(') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      return `(${v1 || 0},${v2 || 0}]`;
    } else if (valueRange.startsWith('[') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      return `[${v1 || 0},${v2 || 0})`;
    } else if (valueRange.startsWith('[') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      return `[${v1 || 0},${v2 || 0}]`;
    }
    return ''
  }

  validatorInput = (value, valueRange, callback, values) => {
    if (valueRange.startsWith('>')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      if (value < uv) {
        callback(`取值错误，>${uv}`)
      }
    } else if (valueRange.startsWith('<')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      if (value > uv) {
        callback(`取值错误，<${uv}`)
      }
    } else if (valueRange.startsWith('(') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value >= v2) {
        callback(`取值错误，(${v1},${v2})`)
      }
    } else if (valueRange.startsWith('(') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value > v2) {
        callback(`取值错误，(${v1},${v2}]`)
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value >= v2) {
        callback(`取值错误，[${v1},${v2})`)
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value > v2) {
        callback(`取值错误，[${v1},${v2}]`)
      }
    }
    callback()
  }

  onSelectChange = (value) => {
    const { onSelectChange } = this.props
    if (!onSelectChange) return;
    onSelectChange(value)
  }

  handleRenderPasswordAddon = () => {
    const { isShowPasswordEye } = this.state;
    return (
      <Tooltip title={isShowPasswordEye ? '隐藏密码' : '显示密码'}>
        <Icon type="eye" style={{ cursor: 'pointer' }} onClick={this.handleSwithPasswordVisible} />
      </Tooltip>
    )
  }

  handleSwithPasswordVisible = () => {
    const { isShowPasswordEye } = this.state;
    this.setState({
      isShowPasswordEye: !isShowPasswordEye,
    })
  }

  ItemCreate = (item) => {
    const { form, children, style, hasBr } = this.props;
    const { marginBottom = 12, marginTop = 0, defaultValues = {} } = this.props;
    const { isShowPasswordEye } = this.state;
    const { getFieldDecorator } = form;
    const required = item.required;
    const onChange = item.onChange;

    const label = item.pxWidth ? <span><span style={{ display: 'inline-block', width: item.pxWidth, textAlign: 'left' }}>{item.label}</span>{item.labelSuffix}</span> : <span>{item.ulabel || item.label}{item.labelSuffix}</span>;
    const rules = [
      { required, message: <span>{item.label}为必填项</span> },
    ];
    if (item.pattern) {
      rules.push({ pattern: item.pattern, message: '请输入正确格式' })
    }
    if (children) {
      return (
        <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
          {getFieldDecorator(item.field_name, {
            initialValue: item.value,
            rules: rules.concat(item.rules || []),
          })(<div />)}
          {children}
        </FormItem>
      )
    }
    switch (item.type) {
      case 'hex':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
            {getFieldDecorator(item.field_name, {
              initialValue: item.value,
              rules: [
                { required, message: <span>{label}为必填项</span> },
                { pattern: new RegExp(regHex), message: '请输入十六进制格式' },
              ],
            })(<Input style={{ width: '200px', ...item.style }} {...item.props} />)}
          </FormItem>)
      case 'ip':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
            {getFieldDecorator(item.field_name, {
              initialValue: item.value,
              rules: [
                { required, message: <span>{label}为必填项</span> },
                { pattern: new RegExp(ipReg), message: '请输正确的IP格式' },
              ],
            })(<Input placeholder={item.placeholder || '请输入IP'} style={{ width: item.max ? null : '200px', ...item.style }} {...item.props} />)}
            <span>{item.other || ''}</span>
          </FormItem>)
      case 'password':
        if (item.showPasswordEye) {
          return (
            <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
              {getFieldDecorator(item.field_name, {
                initialValue: item.value,
                rules: [
                  { required: true, message: <span>{item.label}为必填项</span> },
                  { pattern: !item.isNoPattern ? new RegExp(password) : true, message: '密码过于简单(长度6-16)、必须包含数字、字母及大小写' },
                ],
              })(<Input type={isShowPasswordEye ? "text" : 'password'} placeholder={item.placeholder || '请输入密码'} style={{ width: item.width || '200px', ...item.style }} addonAfter={this.handleRenderPasswordAddon()} {...item.props} />)}
            </FormItem>)
        } else {
          return (
            <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
              {getFieldDecorator(item.field_name, {
                initialValue: item.value,
                rules: [
                  { required: true, message: `${item.label}为必填项` },
                  { pattern: !item.isNoPattern ? new RegExp(password) : true, message: '密码过于简单(长度6-16)、必须包含数字、字母及大小写' },
                ],
              })(<Input type="password" placeholder={item.placeholder || '请输入密码'} style={{ width: item.width || '200px', ...item.style }} {...item.props} />)}
            </FormItem>)
        }
      case 'port':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
            {getFieldDecorator(item.field_name, {
              initialValue: item.value,
              rules: [
                { required, message: `${label}为必填项` },
                { pattern: new RegExp(portReg), message: '请输正确的端口格式' },
              ],
            })(<Input placeholder={item.placeholder || '请输入端口'} style={{ width: '200px', ...item.style }} {...item.props} />)}
          </FormItem>)
      case 'inputNumber':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
            {getFieldDecorator(item.field_name, {
              initialValue: item.value,
              rules: [
                { required, message: `${label}为必填项` },
              ],
            })(<InputNumber placeholder={item.placeholder || ''} style={{ width: '200px', ...item.style }} {...item.props} />)}
          </FormItem>)
      case 'input':
        // eslint-disable-next-line no-case-declarations
        let ph = ''
        if (item.value_range) {
          rules.push({
            validator: (rule, value, callback) => this.validatorInput(value, item.value_range, callback, defaultValues),
          })
          ph = this.initValidatorPlaceholder(item.value_range, defaultValues);
        }
        // eslint-disable-next-line no-case-declarations
        const ruleConfig = {
          initialValue: item.value,
          rules: rules.concat(item.rules || []),
        }
        return (
          item.tooltip ? <Tooltip title={item.tooltip}>
            <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={<span>{label || ''}{item.labelOther || ''}</span> } key={item.field_name}>
              {getFieldDecorator(item.field_name, ruleConfig)(
                <Input
                  disabled={item.disabled || false}
                  placeholder={ph || item.placeholder || ''}
                  style={{ width: item.max ? null : '200px', ...item.style, ...item.valueStyle }}
                  {...item.props}
                  suffix={item.labelBefore || ''}
                  addonBefore={item.addonBefore || ''}
                  onBlur={item.onBlur && item.onBlur}
                />
              )}
              <span>{item.other || ''}</span>
            </FormItem>
          </Tooltip> : <FormItem style={{ marginTop: item?.marginTop || '', marginBottom, ...style }} {...item.formItemLayout} label={<span>{label || ''}{item.labelOther || ''}</span>} key={item.field_name}>
              {getFieldDecorator(item.field_name, ruleConfig)(
                <Input
                  disabled={item.disabled || false}
                  placeholder={ph || item.placeholder || ''}
                  style={{ width: item.max ? null : '200px', ...item.style, ...item.valueStyle }}
                  {...item.props}
                  suffix={item.labelBefore || ''}
                  addonBefore={item.addonBefore || ''}
                  onBlur={item.onBlur && item.onBlur}
                />
              )}
              <span>{item.other || ''}</span>
            </FormItem>
        )
      case 'textarea':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || ''} key={item.field_name}>
            {getFieldDecorator(item.field_name, {
              initialValue: item.value,
              rules: rules.concat(item.rules || []),
            })(<TextArea disabled={item.disabled || false} placeholder={item.placeholder || ''} onPressEnter={(e) => item.noEnter && e.preventDefault()} style={{ width: item.max ? null : '200px', ...item.style }} {...item.props} />)}
          </FormItem>)
      case 'select':
        return (
          item.tooltip ? <Tooltip title={item.tooltip}>
            <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={item.isHideLabel ? false : <span>{label || '下拉框'}{item?.labelOther || ''}</span>}>
              {getFieldDecorator(item.field_name, {
                rules: [{
                  required,
                  message: <span>{label}为必填项</span>,
                }].concat(item.rules || []),
                initialValue: String(item.value) === '0' ? item.value : String(item.value) === '' ? null : item.value,
              })(
                <Select allowClear={!required} placeholder={item.placeholder || ''} disabled={item.disabled || false} mode={item.mode || ''} onChange={item.onChange || this.onSelectChange} style={{ width: '200px', ...item.style }} {...item.props}>
                  {
                    (item.options || []).map((i) => {
                      const config = item.config || {}
                      return (<Option key={i[config.value] || i.value} value={i[config.value] || i.value} disabled={i.disabled || false}>{i[config.label] || i.label}</Option>)
                    })
                  }
                </Select>)}
            </FormItem>
          </Tooltip> : <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={item.isHideLabel ? false : <span>{label || '下拉框'}{item?.labelOther || ''}</span>}>
              {getFieldDecorator(item.field_name, {
                rules: [{
                  required,
                  message: <span>{label}为必填项</span>,
                }].concat(item.rules || []),
                initialValue: String(item.value) === '0' ? item.value : String(item.value) === '' ? null : item.value,
              })(
                <Select allowClear={!required} placeholder={item.placeholder || ''} disabled={item.disabled || false} mode={item.mode || ''} onChange={item.onChange || this.onSelectChange} style={{ width: '200px', ...item.style }} {...item.props}>
                  {
                    (item.options || []).map((i) => {
                      const config = item.config || {}
                      return (<Option key={i[config.value] || i.value} value={i[config.value] || i.value} disabled={i.disabled || false}>{i[config.label] || i.label}</Option>)
                    })
                  }
                </Select>)}
            </FormItem>)
      case 'radio':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} key={item.field_name} label={label || '单选框'}>
            {getFieldDecorator(item.field_name, {
              rules: [{
                required,
                message: <span>{label}为必填项</span>,
              }].concat(item.rules || []),
              initialValue: item.value,
            })(
              <Radio.Group {...item.props} disabled={item.disabled}>
                {
                  item.options.map((r) => {
                    if (item.btn) {
                      return (
                        <Radio.Button key={r.value} value={r.value}>
                          {r.label}
                        </Radio.Button>
                      );
                    } else {
                      return (
                        <Radio key={r.value} value={r.value}>
                          {r.label}
                        </Radio>
                      );
                    }
                  })
                }
              </Radio.Group>)}
            {item.other ? item.other() : ''}
          </FormItem>)
      case 'radioButton':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} key={item.field_name} label={label || '单选框'}>
            {getFieldDecorator(item.field_name, {
              rules: [
                { required, message: <span>{label}为必填项</span> },
              ].concat(item.rules || []),
              initialValue: item.value,
            })(
              <Radio.Group {...item.props} style={{ width: '200px', ...item.style }}>
                {
                  item.options.map((r) => {
                    return (
                      <Radio.Button key={r.value} value={r.value}>
                        {r.label || r.key || ""}
                      </Radio.Button>
                    )
                  })
                }
              </Radio.Group>)}
          </FormItem>)
      case 'date':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} key={item.field_name} label={label}>
            {getFieldDecorator(item.field_name, {
              rules: [
                { required, message: <span>{label}为必填项</span> },
              ].concat(item.rules || []),
              initialValue: this.toMomentData('date', item.value, item.paramsFormat),
            })(<DatePicker style={{ width: 200, ...item.style }} format={item.format || 'YYYY-MM-DD HH:mm:ss'} showTime {...item.props} />)}
          </FormItem>)
      case 'date_range':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} key={item.field_name} label={label}>
            {getFieldDecorator(item.field_name, {
              rules: [
                { required, message: <span>{label}为必填项</span> },
              ].concat(item.rules || []),
              initialValue: this.toMomentData('date_range', item.value, item.paramsFormat),
            })(<RangePicker style={item.style} format={item.format || 'YYYY-MM-DD HH:mm:ss'} showTime {...item.props} />)}
          </FormItem>)
      case 'checkbox':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} key={item.field_name} label={label}>
            {getFieldDecorator(item.field_name, {
              initialValue: item.value || false,
              valuePropName: 'checked',
            })
              (item?.options ? <Checkbox.Group
                options={item?.options}
              /> : <Checkbox {...item.props} />)

            }
          </FormItem>
        )
      case 'switch':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} key={item.field_name} label={label}>
            {getFieldDecorator(item.field_name, {
              initialValue: item.value === 1 || item.value || false,
              valuePropName: 'checked',
            })
              (<Switch {...item.props} />)
            }
          </FormItem>
        )
      case 'cascader':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || '下拉框'}>
            {getFieldDecorator(item.field_name, {
              rules: [{
                required,
                message: <span>{label}为必填项</span>,
              }].concat(item.rules || []),
              initialValue: item.value,
            })(
              <Cascader
                fieldNames={item.options}
                options={item.data}
                disabled={item.disabled || false}
                allowClear={item.allowClear}
                onChange={(e) => onChange ? onChange(e, item.linkFields) : null}
                style={{ width: '200px', ...item.style }}
                {...item.props}
              />)}
          </FormItem>)
      case 'number_range':
        if (!item.field_name.includes(',')) return null;
        const fields = item.field_name.split(',')
        const offsetWidth = hasBr ? 35 : 15
        const width = item.style && item.style.width ? parseInt(item.style.width, 10) / 2 - offsetWidth : 100
        return (
          <span style={{ display: 'flex' }}>
            <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} label={label || '下拉框'}>
              {getFieldDecorator(fields[0] || '', {
                rules: [{
                  message: '必填项',
                  required: item.required,
                }, {
                  validator: (rule, value, callback) => this.numRangeChange(value, 0, fields[1], callback, item.value_range, defaultValues),
                }],
                initialValue: item.value,
              })(
                <Input
                  disabled={item.disabled || false}
                  placeholder={item.placeholder || ''}
                  style={{ ...item.style, width }}
                  {...item.props}
                  suffix={item.labelBefore || ''}
                />)}
            </FormItem>
            <span style={{ padding: '8px 10px 0px', display: 'inline-block' }}>~</span>
            <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout}>
              {getFieldDecorator(fields[1] || '', {
                rules: [{
                  message: '必填项',
                  required: item.required,
                }, {
                  validator: (rule, value, callback) => this.numRangeChange(value, 1, fields[0], callback, item.value_range, defaultValues),
                }],
                initialValue: item.value,
              })(
                <Input
                  disabled={item.disabled || false}
                  placeholder={item.placeholder || ''}
                  style={{ ...item.style, width }}
                  {...item.props}
                  suffix={item.labelBefore || ''}
                />)}
            </FormItem>
          </span>
        )
      case 'text':
        return (
          <FormItem style={{ marginTop, marginBottom, ...style }} {...item.formItemLayout} key={item.field_name} label={label}>
            {getFieldDecorator(item.field_name, {
              rules: [{
                required,
                message: <span>{label}为必填项</span>,
              }].concat(item.rules || []),
              initialValue: item.value,
            })(
              <span>
                {item.render ? item.render(item.value) : item.value}
              </span>)}
          </FormItem>
        )
      default:
        return <div />;
    }
  }

  render() {
    const { item } = this.props;
    return <span className={styles.formLayout}>{this.ItemCreate(item)}</span>
  }
}

export default FormItemCreator;
