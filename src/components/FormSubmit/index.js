import React, { forwardRef, useImperativeHandle, useMemo, useRef, useCallback } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  Cascader,
  Row,
  Col,
  Button,
} from 'antd';
import {
  getDefaultRules,
  mergeRules,
  getPlaceholder,
  normalizeItems,
  normalizeOptions,
} from './utils';

const { TextArea, Password } = Input;
const { RangePicker } = DatePicker;

/**
 * 判断字段是否满足显示条件
 * @param {Object} condition - 条件配置
 * @param {any} value - 依赖字段的值
 * @param {Object} allValues - 所有字段值
 * @returns {boolean} 是否显示
 */
const checkVisibleCondition = (condition, value, allValues) => {
  if (!condition) return true;

  if (condition.show !== undefined) {
    return condition.show(value, allValues);
  }
  if (condition.equals !== undefined) {
    return value === condition.equals;
  }
  if (condition.notEquals !== undefined) {
    return value !== condition.notEquals;
  }
  if (condition.in !== undefined) {
    return condition.in.includes(value);
  }
  if (condition.notIn !== undefined) {
    return !condition.notIn.includes(value);
  }
  return true;
};

/**
 * FormSubmit 表单提交控件
 * 支持多种表单类型，自动校验，灵活布局，字段联动
 */
const FormSubmit = forwardRef((props, ref) => {
  const {
    items: propItems,
    formItemLayout = { label: 8, wrapper: 16 },
    onSubmit,
    onReset,
    values = {},
    linkageConfig,
    onValuesChange,
  } = props;

  const [form] = Form.useForm();

  // 用于追踪上一次依赖字段的值，判断是否需要清空下游字段
  const prevDepValuesRef = useRef({});

  // 标准化 items
  const items = useMemo(() => normalizeItems(propItems), [propItems]);

  // 收集所有需要监听的联动字段
  const watchedFields = useMemo(() => {
    const fields = new Set();
    // 收集 visibleWhen 依赖
    Object.values(linkageConfig?.visibleWhen || {}).forEach((cfg) => {
      fields.add(cfg.field);
    });
    // 收集 optionsLinkage 依赖
    Object.entries(linkageConfig?.optionsLinkage || {}).forEach(([_, cfg]) => {
      const deps = Array.isArray(cfg.dependOn) ? cfg.dependOn : [cfg.dependOn];
      deps.forEach((f) => fields.add(f));
    });
    return Array.from(fields);
  }, [linkageConfig]);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    validateFields: () => form.validateFields(),
    resetFields: () => form.resetFields(),
    setFieldsValue: (vals) => form.setFieldsValue(vals),
    getFieldValue: (name) => form.getFieldValue(name),
    getFieldsValue: () => form.getFieldsValue(),
    submit: () => form.submit(),
  }));

  // 判断字段是否可见
  const isFieldVisible = useCallback(
    (fieldName, allValues) => {
      const condition = linkageConfig?.visibleWhen?.[fieldName];
      if (!condition) return true;

      const depValue = allValues[condition.field];
      return checkVisibleCondition(condition, depValue, allValues);
    },
    [linkageConfig]
  );

  // 获取联动后的选项
  const getLinkedOptions = useCallback(
    (item, allValues) => {
      const linkage = linkageConfig?.optionsLinkage?.[item.field_name];
      if (!linkage) return item.options;

      const deps = Array.isArray(linkage.dependOn) ? linkage.dependOn : [linkage.dependOn];
      const separator = linkage.separator || '.';
      const key = deps.map((f) => allValues[f]).join(separator);

      return linkage.map[key] || item.options || [];
    },
    [linkageConfig]
  );

  // 处理字段值变化
  const handleValuesChange = useCallback(
    (changedValues, allValues) => {
      // 处理选项联动：依赖字段变化时清空下游字段
      console.log('chang', changedValues, allValues)
      if (linkageConfig?.optionsLinkage) {
        const changedFields = Object.keys(changedValues);
        const fieldsToClear = {};

        Object.entries(linkageConfig.optionsLinkage).forEach(([targetField, cfg]) => {
          const deps = Array.isArray(cfg.dependOn) ? cfg.dependOn : [cfg.dependOn];
          const clearOnDepChange = cfg.clearOnDepChange !== false;

          if (clearOnDepChange) {
            const depChanged = changedFields.some((f) => deps.includes(f));
            if (depChanged) {
              // 只有当目标字段有值时才需要清空
              if (allValues[targetField] !== undefined && allValues[targetField] !== null && allValues[targetField] !== '') {
                fieldsToClear[targetField] = undefined;
              }
            }
          }
        });

        if (Object.keys(fieldsToClear).length > 0) {
          form.setFieldsValue(fieldsToClear);
        }
      }

      // 更新 prevDepValuesRef
      prevDepValuesRef.current = { ...allValues };

      // 触发外部回调
      onValuesChange?.(changedValues, allValues);
    },
    [linkageConfig, form, onValuesChange]
  );

  // 提交处理
  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      // 处理 number_range 类型，合并为范围对象
      const processedValues = { ...formValues };
      items.forEach((item) => {
        if (item.type === 'number_range') {
          const fieldName = item.field_name;
          const minField = `${fieldName}_min`;
          const maxField = `${fieldName}_max`;
          if (formValues[minField] !== undefined || formValues[maxField] !== undefined) {
            processedValues[fieldName] = {
              min: formValues[minField],
              max: formValues[maxField],
            };
            delete processedValues[minField];
            delete processedValues[maxField];
          }
        }
      });

      // 过滤掉隐藏字段的值
      if (linkageConfig?.visibleWhen) {
        Object.keys(linkageConfig.visibleWhen).forEach((fieldName) => {
          if (!isFieldVisible(fieldName, processedValues)) {
            delete processedValues[fieldName];
          }
        });
      }

      onSubmit?.(processedValues);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 重置处理
  const handleReset = () => {
    form.resetFields();
    prevDepValuesRef.current = {};
    onReset?.();
  };

  // 渲染表单控件
  const renderFormControl = (item, currentValues) => {
    const { type, config = {}, placeholder, ...rest } = item;

    // 获取选项（支持联动）
    let options = item.options;
    if (linkageConfig?.optionsLinkage?.[item.field_name]) {
      options = getLinkedOptions(item, currentValues);
    }
    const normalizedOptions = normalizeOptions(options, config);

    switch (type) {
      case 'input':
        return <Input placeholder={placeholder} {...rest.props} />;

      case 'textarea':
        return <TextArea placeholder={placeholder} {...rest.props} />;

      case 'passport':
        return <Password placeholder={placeholder} {...rest.props} />;

      case 'number':
        return (
          <InputNumber
            placeholder={placeholder}
            style={{ width: '100%' }}
            {...rest.props}
          />
        );

      case 'number_range': {
        const fieldName = item.field_name;
        const minField = `${fieldName}_min`;
        const maxField = `${fieldName}_max`;
        return (
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name={minField} noStyle>
                <InputNumber
                  placeholder="最小值"
                  style={{ width: '100%' }}
                  {...rest.props}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={maxField} noStyle>
                <InputNumber
                  placeholder="最大值"
                  style={{ width: '100%' }}
                  {...rest.props}
                />
              </Form.Item>
            </Col>
          </Row>
        );
      }

      case 'select':
        return (
          <Select
            placeholder={placeholder}
            options={normalizedOptions}
            {...rest.props}
          />
        );

      case 'radio':
        return <Radio>{item.text || ''}</Radio>;

      case 'radio_group':
        return (
          <Radio.Group {...rest.props}>
            {normalizedOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'checkbox':
        return <Checkbox>{item.text || ''}</Checkbox>;

      case 'checkbox_group':
        return (
          <Checkbox.Group options={normalizedOptions} {...rest.props} />
        );

      case 'date':
        return <DatePicker placeholder={placeholder} style={{ width: '100%' }} {...rest.props} />;

      case 'date_range':
        return <RangePicker style={{ width: '100%' }} {...rest.props} />;

      case 'cascader':
        return (
          <Cascader
            placeholder={placeholder}
            options={normalizedOptions}
            {...rest.props}
          />
        );

      case 'color':
        return (
          <Input
            type="color"
            placeholder={placeholder}
            style={{ padding: '4px 8px', height: 36 }}
            {...rest.props}
          />
        );

      case 'ip':
      case 'port':
      case 'hex':
        return <Input placeholder={placeholder} {...rest.props} />;

      default:
        return <Input placeholder={placeholder} {...rest.props} />;
    }
  };

  // 渲染单个表单项
  const renderFormItem = (item, currentValues) => {
    const {
      field_name,
      label,
      type,
      required = false,
      placeholder,
      rules: customRules,
      span = 24,
      defaultValue,
    } = item;

    // 检查字段是否应该显示
    if (!isFieldVisible(field_name, currentValues)) {
      return null;
    }

    // number_range 需要特殊处理
    if (type === 'number_range') {
      const minField = `${field_name}_min`;
      const maxField = `${field_name}_max`;
      const defaultMin = values[minField] ?? defaultValue?.min;
      const defaultMax = values[maxField] ?? defaultValue?.max;

      const layout = {
        labelCol: { span: formItemLayout.label },
        wrapperCol: { span: formItemLayout.wrapper },
      };

      return (
        <Col span={span} key={field_name}>
          <Form.Item label={label} required={required} {...layout}>
            {renderFormControl(item, currentValues)}
          </Form.Item>
          <Form.Item name={minField} initialValue={defaultMin} noStyle hidden>
            <input type="hidden" />
          </Form.Item>
          <Form.Item name={maxField} initialValue={defaultMax} noStyle hidden>
            <input type="hidden" />
          </Form.Item>
        </Col>
      );
    }

    // 获取默认校验规则
    const defaultRules = getDefaultRules(type, required);
    // 合并自定义规则
    const finalRules = mergeRules(defaultRules, customRules);

    // 自动生成 placeholder
    const autoPlaceholder = placeholder || getPlaceholder(type, label);

    // 获取初始值
    const initialValue = values[field_name] ?? defaultValue;

    const layout = {
      labelCol: { span: formItemLayout.label },
      wrapperCol: { span: formItemLayout.wrapper },
    };

    return (
      <Col span={span} key={field_name}>
        <Form.Item
          name={field_name}
          label={label}
          rules={finalRules}
          initialValue={initialValue}
          valuePropName={type === 'checkbox' || type === 'switch' ? 'checked' : 'value'}
          {...layout}
        >
          {renderFormControl({ ...item, placeholder: autoPlaceholder }, currentValues)}
        </Form.Item>
      </Col>
    );
  };

  // 使用 Form.List 配合 render props 来获取当前值
  return (
    <Form form={form} layout="horizontal" onValuesChange={handleValuesChange}>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldsValue }) => {
          const currentValues = getFieldsValue();
          return (
            <Row gutter={16}>
              {items.map((item) => renderFormItem(item, currentValues))}
            </Row>
          );
        }}
      </Form.Item>
      {(onSubmit || onReset) && (
        <Row>
          <Col span={24} style={{ textAlign: 'center', marginTop: 16 }}>
            {onSubmit && (
              <Button type="primary" onClick={handleSubmit} style={{ marginRight: 8 }}>
                提交
              </Button>
            )}
            {onReset && (
              <Button onClick={handleReset}>
                重置
              </Button>
            )}
          </Col>
        </Row>
      )}
    </Form>
  );
});

FormSubmit.displayName = 'FormSubmit';

export default FormSubmit;
