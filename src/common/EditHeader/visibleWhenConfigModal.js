import React, { Component } from 'react';
import { parseJson } from 'utils/utils';
import { Button, Select, Input, Popover } from 'antd';
import _ from 'lodash';

const { Option } = Select;

/**
 * 条件显示配置弹窗
 * 用于配置字段在什么条件下显示
 *
 * visible_when_config 格式:
 * {
 *   dependOn: 'field_name',      // 依赖的字段名
 *   operator: 'equals',          // 操作符: equals | notEquals | in | notIn
 *   value: 'expected_value'      // 匹配值（in/notIn 时为数组）
 * }
 */
class VisibleWhenConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      ...this.initState(props),
    };

    // 操作符选项
    this.operatorOptions = [
      { value: 'equals', label: '等于' },
      { value: 'notEquals', label: '不等于' },
      { value: 'in', label: '包含于' },
      { value: 'notIn', label: '不包含于' },
    ];
  }

  initState = (props) => {
    const { config } = props;
    const parsedConfig = parseJson(config, {});

    return {
      dependOn: parsedConfig.dependOn || '',
      operator: parsedConfig.operator || 'equals',
      value: parsedConfig.value || '',
    };
  };

  // 获取可选的字段列表（排除当前字段）
  getAvailableFields = () => {
    const { allFields, currentField } = this.props;
    return (allFields || []).filter((f) => f.en_name !== currentField);
  };

  // 获取依赖字段的选项（如果依赖字段是 select 类型）
  getDepFieldOptions = () => {
    const { allFields } = this.props;
    const { dependOn } = this.state;

    if (!dependOn) return [];

    const depField = (allFields || []).find((f) => f.en_name === dependOn);
    if (!depField || depField.field_type !== 'select') return [];

    return parseJson(depField.options, []);
  };

  // 判断是否需要多选
  isMultipleValue = () => {
    const { operator } = this.state;
    return operator === 'in' || operator === 'notIn';
  };

  handleDependOnChange = (value) => {
    this.setState({
      dependOn: value,
      value: '', // 切换依赖字段时清空值
    });
  };

  handleOperatorChange = (value) => {
    this.setState({
      operator: value,
      value: '', // 切换操作符时清空值
    });
  };

  handleValueChange = (value) => {
    this.setState({ value });
  };

  handleModalVisible = (v) => {
    this.setState({ visible: v });
  };

  onSubmit = () => {
    const { updateData } = this.props;
    const { dependOn, operator, value } = this.state;

    if (!dependOn) {
      // 如果没有配置依赖字段，清空配置
      if (updateData) {
        updateData('');
      }
    } else {
      const config = {
        dependOn,
        operator,
        value,
      };

      if (updateData) {
        updateData(JSON.stringify(config));
      }
    }

    this.handleModalVisible(false);
  };

  onClear = () => {
    const { updateData } = this.props;
    if (updateData) {
      updateData('');
    }
    this.setState({
      dependOn: '',
      operator: 'equals',
      value: '',
    });
    this.handleModalVisible(false);
  };

  hasConfig = () => {
    const { config } = this.props;
    const parsedConfig = parseJson(config, {});
    return !!(parsedConfig.dependOn);
  };

  renderValueInput = () => {
    const { operator, value, dependOn } = this.state;
    const depFieldOptions = this.getDepFieldOptions();
    const isMultiple = this.isMultipleValue();

    // 如果依赖字段有选项，使用 Select
    if (depFieldOptions.length > 0) {
      return (
        <Select
          size="small"
          mode={isMultiple ? 'multiple' : undefined}
          style={{ width: 150 }}
          placeholder="选择匹配值"
          value={value || undefined}
          onChange={this.handleValueChange}
          allowClear
        >
          {depFieldOptions.map((opt) => (
            <Option key={opt.key} value={opt.key}>
              {opt.value}
            </Option>
          ))}
        </Select>
      );
    }

    // 否则使用 Input
    return (
      <Input
        size="small"
        style={{ width: 150 }}
        placeholder={isMultiple ? '多个值用逗号分隔' : '请输入匹配值'}
        value={isMultiple && Array.isArray(value) ? value.join(',') : value}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (isMultiple) {
            // 将逗号分隔的字符串转为数组
            const arr = inputValue.split(',').map((s) => s.trim()).filter(Boolean);
            this.handleValueChange(arr);
          } else {
            this.handleValueChange(inputValue);
          }
        }}
      />
    );
  };

  renderContent = () => {
    const { dependOn, operator } = this.state;
    const availableFields = this.getAvailableFields();

    return (
      <div style={{ padding: '8px 0', width: 320 }}>
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 80 }}>依赖字段：</span>
          <Select
            size="small"
            style={{ width: 200 }}
            placeholder="选择依赖字段"
            value={dependOn || undefined}
            onChange={this.handleDependOnChange}
            allowClear
          >
            {availableFields.map((f) => (
              <Option key={f.en_name} value={f.en_name}>
                {f.ch_name} ({f.en_name})
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 80 }}>条件：</span>
          <Select
            size="small"
            style={{ width: 200 }}
            value={operator}
            onChange={this.handleOperatorChange}
          >
            {this.operatorOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
          <span style={{ width: 80 }}>匹配值：</span>
          {this.renderValueInput()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="small" onClick={this.onClear}>
            清空
          </Button>
          <Button size="small" type="primary" onClick={this.onSubmit}>
            确定
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { visible } = this.state;

    return (
      <Popover
        title="条件显示配置"
        trigger="click"
        placement="right"
        content={this.renderContent()}
        visible={visible}
        onVisibleChange={this.handleModalVisible}
      >
        <Button size="small">
          {this.hasConfig() ? '已配置' : '配置'}
        </Button>
      </Popover>
    );
  }
}

export default VisibleWhenConfigModal;
