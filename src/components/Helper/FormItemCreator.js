import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import { Input, Checkbox, Select } from 'antd';
import _ from 'lodash';
import classNames from 'classnames';
import { validateValue } from 'utils/form';
import * as keyboardFilters from 'utils/keyboard';
import config from 'utils/config';

const FormItem = Form.Item;
const Option = Select.Option;

class FormItemCreator extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isValid: true,
      errorMessage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.data.isValid === false) {
      this.setState({
        isValid: false,
      });
    }
  }

  onChange = (v) => {
    const { data, fieldName, formRules } = this.props;
    const nv = _.isObject(v) && v.target ? v.target.value : v;
    if (!formRules) {
      data[fieldName] = nv;
      return;
    }
    const ret = validateValue(nv, data, fieldName, formRules);

    this.setState({isValid: ret === true, errorMessage: ret});
  }

  digitInput(defaultValue, r, disabled, size) {
    let fn = keyboardFilters.digit;
    if (r.isRange) fn = keyboardFilters.chain(keyboardFilters.range, fn);
    return (<Input defaultValue={defaultValue} onChange={this.onChange} size={size} disabled={disabled} onKeyPress={fn} />)
  }

  input(defaultValue, r, disabled, size) {
    if (r.field_type && window.isDigitType) {
      if (window.isDigitType(r.field_type)) {
        return this.digitInput(defaultValue, r, disabled, size);
      } else if (r.field_type === 'double') {
        let fn = keyboardFilters.doubleValue;
        if (r.isRange) fn = keyboardFilters.chain(keyboardFilters.range, fn);
        return (<Input defaultValue={defaultValue} onChange={this.onChange} size={size} disabled={disabled} onKeyPress={fn} />)
      }
    }
    return (<Input defaultValue={defaultValue} onChange={this.onChange} size={size} disabled={disabled} />)
  }

  checkbox(defaultValue, r, disabled, size) {
    return (<Checkbox defaultValue={defaultValue} onChange={this.onChange} size={size} disabled={disabled} />)
  }

  select(defaultValue, r, disabled, size) {
    const { item } = this.props;
    const items = _.isFunction(window[item.items]) ? window[item.items]() : item.items;
    return (
      <Select defaultValue={defaultValue} onChange={this.onChange} size={size} style={{width: '100%'}} disabled={disabled}>
        {items.map(i => <Option key={i[0]} value={i[0]}>{i[1]}</Option>)}
      </Select>
    );
  }

  render() {
    const { item, data, defaultValue, useFormItem, fieldName } = this.props;
    const divProps = {};

    if (!useFormItem && !this.state.isValid) {
      divProps.title = this.state.errorMessage;
    }
    return useFormItem ? (
      <FormItem validateStatus={this.state.isValid ? '' : 'error'} hasFeedback={item.type === 'input'}>
        {this[item.type](defaultValue, data, data[fieldName + '_disabled'] === true, 'default')}
      </FormItem>
    ) : (
      <div className={classNames({'has-error': !this.state.isValid})} {...divProps}>
        {this[item.type](defaultValue, data, data[fieldName + '_disabled'] === true, config.smallSize ? 'small' : 'default')}
      </div>
    );
  }
}

export default FormItemCreator;