/* eslint-disable no-case-declarations */
import React, { useState } from 'react';
import { Form, Input, Radio, Checkbox, Select, Switch, DatePicker, Cascader, Tooltip, InputNumber } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import styles from './index.less';

const Option = Select.Option;
const { TextArea } = Input;
const RangePicker = DatePicker.RangePicker;

const regHex = /^[0-9a-fA-F]{1,}$/;
const ipReg = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
const password = /^(?=.*\d{1,})(?=.*[A-Z]{1,})(?=.*[a-z]{1,}).{6,16}$/;

const FormItemCreator = ({
  item,
  marginBottom = 12,
  marginTop = 0,
  defaultValues = {},
  style,
  hasBr,
  children,
  onSelectChange,
}) => {
  const [isShowPasswordEye, setIsShowPasswordEye] = useState(false);

  const toDayjsData = (type, value, format) => {
    if (type === 'date') {
      if (!value) {
        return null;
      }
      if (_.isString(value) || _.isNumber(value)) {
        return dayjs(value * 1);
      }
      return dayjs(value[0] * 1);
    }
    if (type === 'date_range') {
      if (_.isArray(value)) {
        if (!value[0]) {
          return [];
        }
        return [
          dayjs(value[0], format || 'YYYY-MM-DD HH:mm:ss'),
          dayjs(value[1], format || 'YYYY-MM-DD HH:mm:ss'),
        ];
      }
      return [];
    }
  };

  const numRangeChange = (value, idx, field, callback, valueRange = '', values) => {
    if (valueRange.startsWith('(') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value >= v2) {
        callback(`取值错误，(${v1},${v2})`);
      }
    } else if (valueRange.startsWith('(') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value > v2) {
        callback(`取值错误，(${v1},${v2}]`);
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value >= v2) {
        callback(`取值错误，[${v1},${v2})`);
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value > v2) {
        callback(`取值错误，[${v1},${v2}]`);
      }
    } else if (idx === 0) {
      const value1 = field ? value : '';
      if (value && value1 && Number(value1) < Number(value)) {
        callback(`取值错误，应小于${value1}`);
      }
    } else if (idx === 1) {
      const value1 = field ? value : '';
      if (value && value1 && Number(value1) > Number(value)) {
        callback(`取值错误，应大于${value1}`);
      }
    }
    callback();
  };

  const initValidatorPlaceholder = (valueRange, values) => {
    if (valueRange.startsWith('>')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      return `>${uv}`;
    } else if (valueRange.startsWith('<')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      return `<${uv}`;
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
    return '';
  };

  const validatorInput = (value, valueRange, callback, values) => {
    if (valueRange.startsWith('>')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      if (value < uv) {
        callback(`取值错误，>${uv}`);
      }
    } else if (valueRange.startsWith('<')) {
      const v = valueRange.substr(1);
      const uv = values[v] ? values[v] : Number(v);
      if (value > uv) {
        callback(`取值错误，<${uv}`);
      }
    } else if (valueRange.startsWith('(') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value >= v2) {
        callback(`取值错误，(${v1},${v2})`);
      }
    } else if (valueRange.startsWith('(') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value <= v1 || value > v2) {
        callback(`取值错误，(${v1},${v2}]`);
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(')')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value >= v2) {
        callback(`取值错误，[${v1},${v2})`);
      }
    } else if (valueRange.startsWith('[') && valueRange.endsWith(']')) {
      const v = valueRange.substr(1, valueRange.length - 2);
      const arr = v.split(',');
      const v1 = values[arr[0]] ? values[arr[0]] : Number(arr[0]);
      const v2 = values[arr[1]] ? values[arr[1]] : Number(arr[1]);
      if (value < v1 || value > v2) {
        callback(`取值错误，[${v1},${v2}]`);
      }
    }
    callback();
  };

  const handleSelectChange = (value) => {
    if (!onSelectChange) return;
    onSelectChange(value);
  };

  const handleRenderPasswordAddon = () => {
    return (
      <Tooltip title={isShowPasswordEye ? '隐藏密码' : '显示密码'}>
        <Icon type="eye" style={{ cursor: 'pointer' }} onClick={() => setIsShowPasswordEye(!isShowPasswordEye)} />
      </Tooltip>
    );
  };

  const buildRules = (item, label) => {
    const rules = [];
    if (item.required) {
      rules.push({ required: true, message: <span>{label}为必填项</span> });
    }
    if (item.pattern) {
      rules.push({ pattern: item.pattern, message: '请输入正确格式' });
    }
    if (item.rules) {
      rules.push(...item.rules);
    }
    return rules;
  };

  const getLabel = (item) => {
    if (item.pxWidth) {
      return (
        <span>
          <span style={{ display: 'inline-block', width: item.pxWidth, textAlign: 'left' }}>{item.label}</span>
          {item.labelSuffix}
        </span>
      );
    }
    return <span>{item.ulabel || item.label}{item.labelSuffix}</span>;
  };

  const renderFormItem = (item, children, extraRules = [], valuePropName = 'value') => {
    const label = getLabel(item);
    const rules = [...buildRules(item, label), ...extraRules];
    const formItemLayout = item.formItemLayout || {};

    return (
      <Form.Item
        style={{ marginTop, marginBottom, ...style }}
        {...formItemLayout}
        name={item.field_name}
        label={item.isHideLabel ? false : label}
        initialValue={item.value}
        rules={rules}
        valuePropName={valuePropName}
        key={item.field_name}
      >
        {children}
      </Form.Item>
    );
  };

  const renderFormItemWithLabel = (item, children, extraRules = [], labelContent) => {
    const rules = [...buildRules(item, labelContent), ...extraRules];
    const formItemLayout = item.formItemLayout || {};

    return (
      <Form.Item
        style={{ marginTop: item?.marginTop || marginTop, marginBottom, ...style }}
        {...formItemLayout}
        name={item.field_name}
        label={<span>{labelContent}{item.labelOther || ''}</span>}
        initialValue={item.value}
        rules={rules}
        key={item.field_name}
      >
        {children}
        <span>{item.other || ''}</span>
      </Form.Item>
    );
  };

  if (children) {
    const label = getLabel(item);
    return (
      <Form.Item
        style={{ marginTop, marginBottom, ...style }}
        {...item.formItemLayout}
        name={item.field_name}
        label={label || ''}
        initialValue={item.value}
        rules={buildRules(item, label)}
        key={item.field_name}
      >
        <div />
      </Form.Item>
    );
  }

  switch (item.type) {
    case 'hex':
      return renderFormItem(
        item,
        <Input style={{ width: '200px', ...item.style }} {...item.props} />,
        [
          { pattern: new RegExp(regHex), message: '请输入十六进制格式' },
        ]
      );

    case 'ip':
      return renderFormItem(
        item,
        <Input placeholder={item.placeholder || '请输入IP'} style={{ width: item.max ? null : '200px', ...item.style }} {...item.props} />,
        [
          { pattern: new RegExp(ipReg), message: '请输正确的IP格式' },
        ]
      );

    case 'password':
      if (item.showPasswordEye) {
        return renderFormItem(
          item,
          <Input
            type={isShowPasswordEye ? 'text' : 'password'}
            placeholder={item.placeholder || '请输入密码'}
            style={{ width: item.width || '200px', ...item.style }}
            addonAfter={handleRenderPasswordAddon()}
            {...item.props}
          />,
          [
            { pattern: !item.isNoPattern ? new RegExp(password) : true, message: '密码过于简单(长度6-16)、必须包含数字、字母及大小写' },
          ]
        );
      }
      return renderFormItem(
        item,
        <Input
          type="password"
          placeholder={item.placeholder || '请输入密码'}
          style={{ width: item.width || '200px', ...item.style }}
          {...item.props}
        />,
        [
          { pattern: !item.isNoPattern ? new RegExp(password) : true, message: '密码过于简单(长度6-16)、必须包含数字、字母及大小写' },
        ]
      );

    case 'port':
      return renderFormItem(
        item,
        <Input placeholder={item.placeholder || '请输入端口'} style={{ width: '200px', ...item.style }} {...item.props} />,
        [
          { pattern: new RegExp(portReg), message: '请输正确的端口格式' },
        ]
      );

    case 'inputNumber':
      return renderFormItem(
        item,
        <InputNumber placeholder={item.placeholder || ''} style={{ width: '200px', ...item.style }} {...item.props} />
      );

    case 'input': {
      let ph = '';
      const extraRules = [];
      if (item.value_range) {
        extraRules.push({
          validator: (rule, value, callback) => validatorInput(value, item.value_range, callback, defaultValues),
        });
        ph = initValidatorPlaceholder(item.value_range, defaultValues);
      }
      const label = getLabel(item);
      const inputElement = (
        <Input
          disabled={item.disabled || false}
          placeholder={ph || item.placeholder || ''}
          style={{ width: item.max ? null : '200px', ...item.style, ...item.valueStyle }}
          {...item.props}
          suffix={item.labelBefore || ''}
          addonBefore={item.addonBefore || ''}
          onBlur={item.onBlur && item.onBlur}
        />
      );

      if (item.tooltip) {
        return (
          <Tooltip title={item.tooltip} key={item.field_name}>
            {renderFormItemWithLabel(item, inputElement, extraRules, label || '')}
          </Tooltip>
        );
      }
      return renderFormItemWithLabel(item, inputElement, extraRules, label || '');
    }

    case 'textarea':
      return renderFormItem(
        item,
        <TextArea
          disabled={item.disabled || false}
          placeholder={item.placeholder || ''}
          onPressEnter={(e) => item.noEnter && e.preventDefault()}
          style={{ width: item.max ? null : '200px', ...item.style }}
          {...item.props}
        />
      );

    case 'select': {
      const config = item.config || {};
      const selectElement = (
        <Select
          allowClear={!item.required}
          placeholder={item.placeholder || ''}
          disabled={item.disabled || false}
          mode={item.mode || ''}
          onChange={item.onChange || handleSelectChange}
          style={{ width: '200px', ...item.style }}
          {...item.props}
        >
          {(item.options || []).map((i) => (
            <Option key={i[config.value] || i.value} value={i[config.value] || i.value} disabled={i.disabled || false}>
              {i[config.label] || i.label}
            </Option>
          ))}
        </Select>
      );

      const label = getLabel(item);
      const rules = [{ required: item.required, message: <span>{label}为必填项</span> }, ...(item.rules || [])];
      const formItemLayout = item.formItemLayout || {};
      const initialValue = String(item.value) === '0' ? item.value : String(item.value) === '' ? null : item.value;

      if (item.tooltip) {
        return (
          <Tooltip title={item.tooltip} key={item.field_name}>
            <Form.Item
              style={{ marginTop, marginBottom, ...style }}
              {...formItemLayout}
              name={item.field_name}
              label={item.isHideLabel ? false : <span>{label || '下拉框'}{item?.labelOther || ''}</span>}
              initialValue={initialValue}
              rules={rules}
            >
              {selectElement}
            </Form.Item>
          </Tooltip>
        );
      }

      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...formItemLayout}
          name={item.field_name}
          label={item.isHideLabel ? false : <span>{label || '下拉框'}{item?.labelOther || ''}</span>}
          initialValue={initialValue}
          rules={rules}
          key={item.field_name}
        >
          {selectElement}
        </Form.Item>
      );
    }

    case 'radio': {
      const label = getLabel(item);
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={label || '单选框'}
          initialValue={item.value}
          rules={[{ required: item.required, message: <span>{label}为必填项</span> }, ...(item.rules || [])]}
          key={item.field_name}
        >
          <Radio.Group {...item.props} disabled={item.disabled}>
            {item.options.map((r) => {
              if (item.btn) {
                return (
                  <Radio.Button key={r.value} value={r.value}>
                    {r.label}
                  </Radio.Button>
                );
              }
              return (
                <Radio key={r.value} value={r.value}>
                  {r.label}
                </Radio>
              );
            })}
          </Radio.Group>
          {item.other ? item.other() : ''}
        </Form.Item>
      );
    }

    case 'radioButton': {
      const label = getLabel(item);
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={label || '单选框'}
          initialValue={item.value}
          rules={[{ required: true, message: <span>{label}为必填项</span> }, ...(item.rules || [])]}
          key={item.field_name}
        >
          <Radio.Group {...item.props} style={{ width: '200px', ...item.style }}>
            {item.options.map((r) => (
              <Radio.Button key={r.value} value={r.value}>
                {r.label || r.key || ''}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      );
    }

    case 'date': {
      const label = getLabel(item);
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={label}
          initialValue={toDayjsData('date', item.value, item.paramsFormat)}
          rules={[{ required: item.required, message: <span>{label}为必填项</span> }, ...(item.rules || [])]}
          key={item.field_name}
        >
          <DatePicker style={{ width: 200, ...item.style }} format={item.format || 'YYYY-MM-DD HH:mm:ss'} showTime {...item.props} />
        </Form.Item>
      );
    }

    case 'date_range': {
      const label = getLabel(item);
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={label}
          initialValue={toDayjsData('date_range', item.value, item.paramsFormat)}
          rules={[{ required: item.required, message: <span>{label}为必填项</span> }, ...(item.rules || [])]}
          key={item.field_name}
        >
          <RangePicker style={item.style} format={item.format || 'YYYY-MM-DD HH:mm:ss'} showTime {...item.props} />
        </Form.Item>
      );
    }

    case 'checkbox':
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={getLabel(item)}
          initialValue={item.value || false}
          valuePropName="checked"
          key={item.field_name}
        >
          {item?.options ? <Checkbox.Group options={item?.options} /> : <Checkbox {...item.props} />}
        </Form.Item>
      );

    case 'switch':
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={getLabel(item)}
          initialValue={item.value === 1 || item.value || false}
          valuePropName="checked"
          key={item.field_name}
        >
          <Switch {...item.props} />
        </Form.Item>
      );

    case 'cascader': {
      const label = getLabel(item);
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={label || '下拉框'}
          initialValue={item.value}
          rules={[{ required: item.required, message: <span>{label}为必填项</span> }, ...(item.rules || [])]}
          key={item.field_name}
        >
          <Cascader
            fieldNames={item.options}
            options={item.data}
            disabled={item.disabled || false}
            allowClear={item.allowClear}
            onChange={(e) => item.onChange ? item.onChange(e, item.linkFields) : null}
            style={{ width: '200px', ...item.style }}
            {...item.props}
          />
        </Form.Item>
      );
    }

    case 'number_range':
      if (!item.field_name.includes(',')) return null;
      const fields = item.field_name.split(',');
      const offsetWidth = hasBr ? 35 : 15;
      const width = item.style && item.style.width ? parseInt(item.style.width, 10) / 2 - offsetWidth : 100;
      return (
        <span style={{ display: 'flex' }}>
          <Form.Item
            style={{ marginTop, marginBottom, ...style }}
            {...item.formItemLayout}
            name={fields[0] || ''}
            label={getLabel(item) || '下拉框'}
            initialValue={item.value}
            rules={[
              { message: '必填项', required: item.required },
              {
                validator: (rule, value, callback) => numRangeChange(value, 0, fields[1], callback, item.value_range, defaultValues),
              },
            ]}
          >
            <Input
              disabled={item.disabled || false}
              placeholder={item.placeholder || ''}
              style={{ ...item.style, width }}
              {...item.props}
              suffix={item.labelBefore || ''}
            />
          </Form.Item>
          <span style={{ padding: '8px 10px 0px', display: 'inline-block' }}>~</span>
          <Form.Item
            style={{ marginTop, marginBottom, ...style }}
            {...item.formItemLayout}
            name={fields[1] || ''}
            initialValue={item.value}
            rules={[
              { message: '必填项', required: item.required },
              {
                validator: (rule, value, callback) => numRangeChange(value, 1, fields[0], callback, item.value_range, defaultValues),
              },
            ]}
          >
            <Input
              disabled={item.disabled || false}
              placeholder={item.placeholder || ''}
              style={{ ...item.style, width }}
              {...item.props}
              suffix={item.labelBefore || ''}
            />
          </Form.Item>
        </span>
      );

    case 'text': {
      const label = getLabel(item);
      return (
        <Form.Item
          style={{ marginTop, marginBottom, ...style }}
          {...item.formItemLayout}
          name={item.field_name}
          label={label}
          initialValue={item.value}
          rules={[{ required: item.required, message: <span>{label}为必填项</span> }, ...(item.rules || [])]}
          key={item.field_name}
        >
          <span>{item.render ? item.render(item.value) : item.value}</span>
        </Form.Item>
      );
    }

    default:
      return <div />;
  }
};

export default FormItemCreator;
