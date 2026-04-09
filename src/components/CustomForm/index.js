import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import { Form, Row, Col, Button } from 'antd';
import FormItem from 'components/FromItemCreator';
import { createSubmitHandler } from 'components/FromItemCreator/utils';
import _ from 'lodash';
import './index.less';

const CustomForm = forwardRef((props, ref) => {
  const {
    items: propItems = [],
    values: propValues = {},
    parent,
    relevanceMapping = {},
    relevanceFields = [],
    relationMapping = {},
    onValuesChange,
    onSubmit,
    onReset,
    config,
    contentWidth,
    style,
    submitKey,
    buttonList,
    disabled,
    hasBr,
    labelSuffixArray = {},
    disabledStatus = {},
    formItemLayout = {},
    layout,
    suffixComponent,
    span,
    itemStyle = {},
    size,
    isFirstChangeConfig,
    noInit,
  } = props;

  const [form] = Form.useForm();
  const [items, setItems] = useState(propItems);
  const [values, setValues] = useState(propValues);
  const isFirstChangeRef = useRef(true);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      initValues(props);
      form.resetFields();
      if (onReset) {
        onReset();
      }
    },
    setFieldsValue: (value) => {
      form.setFieldsValue(value);
    },
    getFieldValue: (field) => {
      return form.getFieldValue(field);
    },
    validateFields: () => {
      return form.validateFields();
    },
    getFormInstance: () => form,
  }));

  // 通过 onRef 回调暴露 ref
  useEffect(() => {
    if (props.onRef) {
      props.onRef(ref?.current || { resetForm, setFieldsValue, getFieldValue });
    }
  }, []);

  // 初始化值
  const initValues = (nextProps) => {
    const newItems = nextProps.items || [];
    const mapping = nextProps.relevanceMapping || {};
    const relevanceFieldsArr = nextProps.relevanceFields || [];
    const updatedItems = [];
    const newValues = _.cloneDeep(nextProps.values || {});

    for (const i of newItems) {
      if (relevanceFieldsArr.includes(i.field_name)) {
        if (_.isUndefined(newValues[i.field_name]) && (!i.defaultValue || i.defaultValue === '')) {
          newValues[i.field_name] = i.options[0]?.key;
        }
        if (_.isUndefined(newValues[i.field_name]) && i.defaultValue && i.defaultValue !== '') {
          newValues[i.field_name] = i.defaultValue;
        }
      }
    }

    for (const i of newItems) {
      if (i.type === 'select' && mapping[i.field_name]) {
        const item = mapping[i.field_name];
        if (_.isString(item.relevancefield)) {
          const relevance = item.relevance || {};
          const v = newValues[item.relevancefield];
          updatedItems.push({ ...i, options: relevance[v]?.data });
        } else {
          const relevance = item.relevance;
          const v = item.relevancefield.map((j) => newValues[j]).join('&&');
          updatedItems.push({ ...i, options: relevance[v]?.data });
        }
      } else if (!_.isUndefined(newValues[i.field_name])) {
        updatedItems.push({ ...i, value: newValues[i.field_name] });
      } else {
        updatedItems.push(i);
      }
    }

    const finalValues = {};
    for (const i of updatedItems) {
      const fieldName = i.field_name;
      if (!_.isUndefined(newValues[fieldName]) && newValues[fieldName] && newValues[fieldName] !== '') {
        finalValues[fieldName] = newValues[fieldName];
      } else if (String(newValues[fieldName]) === '0') {
        finalValues[fieldName] = newValues[fieldName];
      }
    }

    setItems(updatedItems);
    setValues(finalValues);
    form.setFieldsValue(finalValues);
  };

  // 监听 props 变化
  useEffect(() => {
    if (
      !_.isEqual(props.values, propValues) ||
      (!_.isEqual(props.items, propItems) && !_.isEmpty(props.items))
    ) {
      initValues(props);
    }
  }, [props.values, props.items]);

  // 首次变更配置
  useEffect(() => {
    if (isFirstChangeConfig && isFirstChangeRef.current) {
      isFirstChangeRef.current = false;
      onFirstChange(isFirstChangeConfig.field, isFirstChangeConfig.value);
    }
  }, [isFirstChangeConfig]);

  const onFirstChange = (field_name, value) => {
    if (!isFirstChangeConfig) return;

    const field = field_name;
    if (relevanceFields.includes(field) || relationMapping[field]) {
      const fields = [];
      const val = value;
      const newValues = { [field]: val };
      const optionMapping = {};

      for (const i in relevanceMapping) {
        const item = relevanceMapping[i];
        if (_.isString(item.relevancefield) && item.relevancefield === field) {
          fields.unshift({ ...item, field: i });
        } else if (_.isArray(item.relevancefield) && item.relevancefield.includes(field)) {
          fields.push({ ...item, field: i });
        }
      }

      for (const i of fields) {
        if (_.isString(i.relevancefield)) {
          const relevance = i.relevance;
          const firstKey = newValues[i.relevancefield];
          const options = relevance[firstKey]?.data || [];
          if ((!items.find((j) => j?.[i.field])?.defaultValue || items.find((j) => j?.[i.field])?.defaultValue === '') && !noInit) {
            newValues[i.field] = options[0]?.key;
          }
          optionMapping[i.field] = options;
        } else {
          const relevance = i.relevance;
          const relevances = i.relevancefield;
          const key1 = relevances[0];
          const key2 = relevances[1];
          const v1 = newValues[key1] || form.getFieldValue(key1);
          const v2 = newValues[key2] || form.getFieldValue(key2);
          const key = [v1, v2].join('&&');
          const options = relevance[key]?.data || [];
          if ((items.find((j) => j?.[i.field])?.defaultValue || items.find((j) => j?.[i.field])?.defaultValue === '') && !noInit) {
            newValues[i.field] = options[0]?.key;
          }
          optionMapping[i.field] = options;
        }
      }

      const newItems = [];
      for (const i of items) {
        const relation = i.relation || [];
        const relationValues = relation.map((r) => r.value);
        const relationMappingValues = relation.map((r) => newValues[r.key]);
        const hidden = relationValues.length > 0 && relationValues.join(',') !== relationMappingValues.join(',');

        if (i.type === 'select' && optionMapping[i.field_name]) {
          newItems.push({ ...i, options: optionMapping[i.field_name], hidden });
        } else {
          newItems.push({ ...i, hidden });
        }
      }

      setValues(newValues);
      setItems(newItems);
    }
  };

  const onChange = (e, record) => {
    const field = record.field_name;
    const val = e.target ? e.target.value : e;
    const newValues = { [field]: val };

    if (relevanceFields.includes(field) || relationMapping[field]) {
      const fields = [];
      const optionMapping = {};

      for (const i in relevanceMapping) {
        const item = relevanceMapping[i];
        if (_.isString(item.relevancefield) && item.relevancefield === field) {
          fields.unshift({ ...item, field: i });
        } else if (_.isArray(item.relevancefield) && item.relevancefield.includes(field)) {
          fields.push({ ...item, field: i });
        }
      }

      for (const i of fields) {
        if (_.isString(i.relevancefield)) {
          const relevance = i.relevance;
          const firstKey = newValues[i.relevancefield];
          const options = relevance[firstKey]?.data || [];
          newValues[i.field] = options[0]?.key;
          optionMapping[i.field] = options;
        } else {
          const relevance = i.relevance;
          const relevances = i.relevancefield;
          const key1 = relevances[0];
          const key2 = relevances[1];
          const v1 = newValues[key1] || form.getFieldValue(key1);
          const v2 = newValues[key2] || form.getFieldValue(key2);
          const key = [v1, v2].join('&&');
          const options = relevance[key]?.data || [];
          newValues[i.field] = options[0]?.key;
          optionMapping[i.field] = options;
        }
      }

      const newItems = [];
      for (const i of items) {
        const relation = i.relation || [];
        const relationValues = relation.map((r) => r.value);
        const relationMappingValues = relation.map((r) => newValues[r.key]);
        const hidden = relationValues.length > 0 && relationValues.join(',') !== relationMappingValues.join(',');

        if (i.type === 'select' && optionMapping[i.field_name]) {
          newItems.push({ ...i, options: optionMapping[i.field_name], hidden });
        } else {
          newItems.push({ ...i, hidden });
        }
      }

      setValues(newValues);
      setItems(newItems);
      form.setFieldsValue(newValues);

      if (onValuesChange) {
        onValuesChange(e, record, newValues, newItems);
      }
    } else if (onValuesChange) {
      onValuesChange(e, record, newValues, items);
    }
  };

  const getFormItemWidth = (item) => {
    const itemSpan = item.span || 12;
    const width = contentWidth / 24 * itemSpan;
    const offset = item.span === 24 ? 0 : 13;
    const requiredWidth = item.required ? 0 : 10;
    if (hasBr) return width;
    return width - (item.pxWidth || 0) - offset - 14 + requiredWidth;
  };

  const getValue = (vals, item) => {
    if (
      (!_.isUndefined(vals[item.field_name]) && vals[item.field_name] && vals[item.field_name] !== '') ||
      String(vals[item.field_name]) === '0'
    ) {
      return vals[item.field_name];
    } else if (
      !_.isUndefined(item.value) &&
      item.value &&
      item.value !== '' &&
      vals[item.field_name] &&
      vals[item.field_name] !== ''
    ) {
      return item.value;
    } else if (item.defaultValue && item.defaultValue !== '') {
      return item.defaultValue;
    }
  };

  const resetForm = () => {
    initValues(props);
    form.resetFields();
    if (onReset) {
      onReset();
    }
  };

  // 设置 parent 引用（向后兼容）
  useEffect(() => {
    if (parent) {
      parent.currentFormValues = values;
      if (submitKey && !parent[submitKey]) {
        parent[submitKey] = createSubmitHandler({ form, onSubmit });
      }
    }
  }, [parent, values, submitKey, onSubmit]);

  return (
    <Form form={form} layout={layout || 'horizontal'} className="custom_form">
      <Row style={style} gutter={10}>
        {items?.map((item) => {
          if (item?.hidden) return null;
          const itemDisabled = disabledStatus[item.field_name] || item.disabled || disabled;
          return (
            <Col style={{ ...itemStyle }} key={item.field_name} span={span || item.span || 12}>
              <FormItem
                hasBr={hasBr}
                marginBottom={layout === 'vertical' ? 0 : 6}
                defaultValues={props.values || {}}
                item={{
                  config,
                  ...item,
                  labelSuffix: labelSuffixArray[item.field_name],
                  props: {
                    onChange: (e) => onChange(e, item),
                    ...item.props,
                    disabled: itemDisabled,
                    size,
                  },
                  value: getValue(values, item),
                  style: {
                    width: item.style && item.style.width ? item.style.width : getFormItemWidth(item),
                  },
                  formItemLayout: { ...formItemLayout },
                }}
              />
            </Col>
          );
        })}
        {suffixComponent && suffixComponent()}
        {buttonList &&
          !_.isEmpty(buttonList) &&
          buttonList.map((item, index) => (
            <Col key={index} span={item.span || 3}>
              <Button
                style={{ ...item.style }}
                submitKey={item.submitKey || ''}
                type={item.type || ''}
                onClick={item.submitKey !== 'reset' ? item.onClick : resetForm}
              >
                {item.label}
              </Button>
            </Col>
          ))}
      </Row>
    </Form>
  );
});

CustomForm.displayName = 'CustomForm';

export default CustomForm;
