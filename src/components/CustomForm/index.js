import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import FormItem from 'components/FromItemCreator';
import { Row, Col, Button } from 'antd'
import { createSubmitHandler } from 'components/FromItemCreator/utils';
import _ from 'lodash';

@Form.create()
class CustomForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items || [],
      values: props.values || {},
    };
    props.parent.currentFormValues = this.state.values
  }

  componentWillReceiveProps(nextProps) {
    if (
      (!_.isEqual(this.props.values, nextProps.values)) ||
      (!_.isEqual(this.props.items, nextProps.items) && !_.isEmpty(nextProps.items))
    ) {
      this.initValues(nextProps)
    }
  }

  initValues = (nextProps) => {
    const items = nextProps.items || [];
    const mapping = nextProps.relevanceMapping || {};
    const relevanceFields = nextProps.relevanceFields || [];
    const newItems = [];
    const values = _.cloneDeep(nextProps.values || {});
    for (const i of items) {
      if (relevanceFields.includes(i.field_name)) {
        if (_.isUndefined(values[i.field_name]) && (!i.defaultValue || i.defaultValue === '')) values[i.field_name] = i.options[0]?.key
        if (_.isUndefined(values[i.field_name]) && i.defaultValue && i.defaultValue !== '') values[i.field_name] = i.defaultValue
      }
    }

    for (const i of items) {
      if (i.type === 'select' && mapping[i.field_name]) {
        const item = mapping[i.field_name];
        if (_.isString(item.relevancefield)) {
          const relevance = item.relevance || {};
          const v = values[item.relevancefield];
          newItems.push({ ...i, options: relevance[v]?.data })
        } else {
          const relevance = item.relevance;
          const v = item.relevancefield.map(j => values[j]).join('&&');
          newItems.push({ ...i, options: relevance[v]?.data })
        }
      } else if (!_.isUndefined(values[i.field_name])) {
        newItems.push({...i, value: values[i.field_name]});
      } else {
        newItems.push(i)
      }
    }
    const newValues = {}
    for (const i of newItems) {
      const fieldName = i.field_name;
      if (!_.isUndefined(values[fieldName]) && values[fieldName] && values[fieldName] !== '') {
          newValues[fieldName] = values[fieldName];
        } else if (String(values[fieldName]) === '0') {
          newValues[fieldName] = values[fieldName];
        }
    }
    this.setState({ items: newItems, values: newValues }, () => {
      const { setFieldsValue } = nextProps.form;
      setFieldsValue(newValues)
    })
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    const { isFirstChangeConfig } = this.props
    if(!isFirstChangeConfig) return
    this.onFirstChange(isFirstChangeConfig.field, isFirstChangeConfig.value)
  }

  onFirstChange = (field_name, value) => {
    const { items } = this.state;
    const { relevanceFields = [], relevanceMapping = {}, relationMapping = {}, form, onValuesChange, isFirstChangeConfig, noInit } = this.props;
    if (!isFirstChangeConfig) return
    const field = field_name;
    const { getFieldValue } = form;
    if (relevanceFields.includes(field) || relationMapping[field]) {
      const fields = [];
      const val = value;
      const values = { [field]: val };
      const optionMapping = {};
      for (const i in relevanceMapping) {
        const item = relevanceMapping[i];
        if (_.isString(item.relevancefield) && item.relevancefield === field) {
          fields.unshift({ ...item, field: i })
        } else if (_.isArray(item.relevancefield) && item.relevancefield.includes(field)) {
          fields.push({ ...item, field: i })
        }
      }
      for (const i of fields) {
        if (_.isString(i.relevancefield)) {
          const relevance = i.relevance;
          const firstKey = values[i.relevancefield];
          const options = relevance[firstKey]?.data || [];
          if ((!items.find(j => j?.[i.field])?.defaultValue || items.find(j => j?.[i.field])?.defaultValue === '') && !noInit) {
            values[i.field] = options[0]?.key;
          }
          // values[i.field] = options[0]?.key;
          optionMapping[i.field] = options;
        } else {
          const relevance = i.relevance;
          const relevances = i.relevancefield;
          const key1 = relevances[0];
          const key2 = relevances[1];
          const v1 = values[key1] || getFieldValue(key1)
          const v2 = values[key2] || getFieldValue(key2)
          const key = [v1, v2].join('&&');
          const options = relevance[key]?.data || [];
          // values[i.field] = options[0]?.key;
          if ((items.find(j => j?.[i.field])?.defaultValue || items.find(j => j?.[i.field])?.defaultValue === '') && !noInit) {
            values[i.field] = options[0]?.key;
          }
          optionMapping[i.field] = options;
        }
      }
      const newItems = [];
      for (const i of items) {
        const relation = i.relation || [];
        const relationValues = relation.map(r => r.value)
        const relationMappingValues = relation.map(r => values[r.key])
        const hidden = relationValues.length > 0 && relationValues.join(',') !== relationMappingValues.join(',');

        if (i.type === 'select' && optionMapping[i.field_name]) {
          newItems.push({ ...i, options: optionMapping[i.field_name], hidden })
        } else {
          newItems.push({ ...i, hidden })
        }
      }
      this.setState({ values, items: newItems }, () => {
        // const setFieldsValue = form.setFieldsValue;
        // if (setFieldsValue) setFieldsValue(values)
      })
    }
  }

  onChange = (e, record) => {
    const { items } = this.state;
    const { relevanceFields = [], relevanceMapping = {}, relationMapping = {}, form, onValuesChange } = this.props;
    const field = record.field_name;
    const { getFieldValue } = form;
    const val = e.target ? e.target.value : e;
    const values = { [field]: val };
    if (relevanceFields.includes(field) || relationMapping[field]) {
      const fields = [];

      const optionMapping = {};
      for (const i in relevanceMapping) {
        const item = relevanceMapping[i];
        if (_.isString(item.relevancefield) && item.relevancefield === field) {
          fields.unshift({ ...item, field: i })
        } else if (_.isArray(item.relevancefield) && item.relevancefield.includes(field)) {
          fields.push({ ...item, field: i })
        }
      }
      for (const i of fields) {
        if (_.isString(i.relevancefield)) {
          const relevance = i.relevance;
          const firstKey = values[i.relevancefield];
          const options = relevance[firstKey]?.data || [];
          values[i.field] = options[0]?.key;
          optionMapping[i.field] = options;
        } else {
          const relevance = i.relevance;
          const relevances = i.relevancefield;
          const key1 = relevances[0];
          const key2 = relevances[1];
          const v1 = values[key1] || getFieldValue(key1)
          const v2 = values[key2] || getFieldValue(key2)
          const key = [v1, v2].join('&&');
          const options = relevance[key]?.data || [];
          values[i.field] = options[0]?.key;
          optionMapping[i.field] = options;
        }
      }
      const newItems = [];
      for (const i of items) {
        const relation = i.relation || [];
        const relationValues = relation.map(r => r.value)
        const relationMappingValues = relation.map(r => values[r.key])
        const hidden = relationValues.length > 0 && relationValues.join(',') !== relationMappingValues.join(',');

        if (i.type === 'select' && optionMapping[i.field_name]) {
          newItems.push({ ...i, options: optionMapping[i.field_name], hidden })
        } else {
          newItems.push({ ...i, hidden })
        }
      }

      this.setState({ values, items: newItems }, () => {
        const setFieldsValue = form.setFieldsValue;
        if (setFieldsValue) setFieldsValue(values)
      })
      if (onValuesChange) onValuesChange(e, record, values, newItems)
    } else if (onValuesChange) {
      onValuesChange(e, record, values, items)
    }
  }

  getFormItemWidth = (item) => {
    const { contentWidth, hasBr } = this.props;
    const span = item.span || 12;
    const width = contentWidth / 24 * span;
    const offset = item.span === 24 ? 0 : 13;
    const requiredWidth = item.required ? 0 : 10;
    if (hasBr) return width;
    return width - item.pxWidth - offset - 14 + requiredWidth;
  }

  resetForm = () => {
    const { form, onReset } = this.props;
    const { resetFields } = form;
    this.initValues(this.props)
    resetFields()
    if (onReset) {
      onReset()
    }
  }

  setFieldsValue = (value) => {
    const { form } = this.props;
    this.props.form.setFieldsValue(value);
  }

  getFieldValue = (field) => {
    const { form } = this.props;
    return this.props.form.getFieldValue(field);
  }

  getValue = (values, item) => {
    if (!_.isUndefined(values[item.field_name]) && values[item.field_name] && values[item.field_name] !== '' || String(values[item.field_name]) === '0') {
      return values[item.field_name];
    } else if (!_.isUndefined(item.value) && item.value && item.value !== '' && values[item.field_name] && values[item.field_name] !== '') {
      return item.value;
    } else if (item.defaultValue && item.defaultValue !== '') {
      return item.defaultValue
    }
  }

  render() {
    const { items, values } = this.state;
    const { form, config, onSubmit, style, parent, submitKey, buttonList, disabled, hasBr, labelSuffixArray = {}, disabledStatus = {},
      formItemLayout = {}, layout, suffixComponent, span, itemStyle = {}, size } = this.props;
    if (parent && submitKey && !parent[submitKey]) {
      parent[submitKey] = createSubmitHandler({ form, onSubmit })
    }
    return (
      <Form layout={layout || "horizontal"} className='custom_form'>
        <Row style={style} gutter={10}>
          {items?.map(item => {
            if (item?.hidden) return null;
            const itemDisabled = disabledStatus[item.field_name] || item.disabled || disabled;
            return (
              <Col style={{ ...itemStyle }} key={item.field_name} span={span || item.span || 12}>
                <FormItem
                  hasBr={hasBr}
                  marginBottom={layout == "vertical" ? 0 : 6}
                  defaultValues={this.props.values || {}}
                  item={{
                    config, ...item,
                    labelSuffix: labelSuffixArray[item.field_name],
                    props: { onChange: (e) => this.onChange(e, item), ...item.props, disabled: itemDisabled, size},
                    value: this.getValue(values, item),
                    style: { width: item.style && item.style.width ? item.style.width : this.getFormItemWidth(item) },
                    formItemLayout: { ...formItemLayout },
                  }}
                  form={form}
                />
              </Col>
            )
          })}
          {
            suffixComponent && suffixComponent()
          }
          {buttonList && !_.isEmpty(buttonList) && buttonList.map(item => {
            return (
              <Col span={item.span || 3}>
                <Button style={{ ...item.style }} submitKey={item.submitKey || ""} type={item.type || ""} onClick={item.submitKey !== "reset" ? item.onClick : this.resetForm}>{item.label}</Button>
              </Col>
            )
          })}
        </Row>
      </Form>
    )
  }
}

export default CustomForm;
