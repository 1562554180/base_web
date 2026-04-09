import React, { Component } from 'react';
import { parseJson } from 'utils/utils';
import { Button, Input, Select, Popover, Cascader } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import StandardTable from 'components/newStandardTable';
import styles from './index.less'

const { Option } = Select

/**
 * 从依赖链构建级联选择器的树形结构
 * @param {Object} record - 当前字段配置（如 district）
 * @param {Object} relevanceNode - 直接依赖字段配置（如 city）
 * @param {Array} allFields - 所有字段配置
 * @returns {Object} { selectedData, useCascader }
 */
function buildCascaderOptionsFromChain(record, relevanceNode, allFields) {
  const useCascader = record.useCascader === '1';

  if (!useCascader) {
    // 非级联模式，直接使用依赖字段的选项
    const selectedData = parseJson(relevanceNode.options, []);
    return { selectedData, useCascader: false };
  }

  // 级联模式：需要从依赖链构建树形结构
  // 例如：district -> city -> province
  // 第一级：province 的 options
  // 第二级：city 的 relevance_config 中对应的选项

  const tree = [];
  const fieldOptions = parseJson(relevanceNode.options, []);
  const relevanceConfig = parseJson(relevanceNode.relevance_config, {});

  // 获取依赖字段的依赖字段（如 city 的依赖是 province）
  const depFieldName = relevanceNode.relevance_field;
  const depField = allFields?.find(f => f.en_name === depFieldName);

  if (!depField) {
    // 如果找不到上一级依赖，退化为简单模式
    return { selectedData: fieldOptions, useCascader: false };
  }

  // 第一级选项来自 province 的 options
  const firstLevelOptions = parseJson(depField.options, []);

  // 遍历第一级选项，构建树
  for (const firstOpt of firstLevelOptions) {
    const firstValue = firstOpt.key;
    const firstLabel = firstOpt.value;

    // 从 city 的 relevance_config 获取第二级选项
    const secondLevelData = relevanceConfig[firstValue]?.data || [];

    const children = secondLevelData.map(item => ({
      value: item.key,
      label: item.value,
    }));

    tree.push({
      value: firstValue,
      label: firstLabel,
      children,
    });
  }

  return { selectedData: tree, useCascader: true };
}

/**
 * 将当前记录的 relevance_config 转换为级联选择器值
 * @param {string} configStr - relevance_config JSON 字符串
 * @returns {Array} 级联选择器的值
 */
function parseSelectedValue(configStr) {
  const config = parseJson(configStr, {});
  const firstKey = _.keys(config)[0] || '';

  if (!firstKey) return [];

  // key 格式可能是 "beijing&&haidian" 或 "beijing"
  const parts = firstKey.split('&&');
  return parts;
}

class RelevanceConfigModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      useCascader: false,
      selectedData: [],
      ...this.initState(props),
    };

    this.columns = [
      {title: 'KEY', dataIndex: 'key', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'key')},
      {title: 'Value', dataIndex: 'value', width: 200, render: (t, r, i) => this.renderInput(t, r, i, 'value')},
      {title: '', dataIndex: 'id', width: 80, render: this.renderDeleteBtn},
    ]
  }

  initState = (props) => {
    const { record, relevanceNode, allFields } = props;

    // 判断是否使用级联模式
    const useCascader = record?.useCascader === '1';

    let selectedData = [];
    let actualUseCascader = false;

    if (useCascader && !_.isEmpty(allFields)) {
      // 级联模式：从依赖链构建
      const result = buildCascaderOptionsFromChain(record, relevanceNode, allFields);
      selectedData = result.selectedData;
      actualUseCascader = result.useCascader;
    } else if (!_.isEmpty(relevanceNode?.relevance_config)) {
      // 旧逻辑：从 relevance_config 构建（兼容旧数据）
      const relevanceConfig = parseJson(relevanceNode.relevance_config, {});
      const fieldOptions = parseJson(relevanceNode.options, []);
      selectedData = buildCascaderOptions(relevanceConfig, fieldOptions);
      actualUseCascader = selectedData.length > 0;
    } else {
      // 简单模式：直接使用 options
      selectedData = parseJson(relevanceNode?.options, []);
      actualUseCascader = false;
    }

    const config = parseJson(record?.relevance_config, {});
    const selectedValue = useCascader ? parseSelectedValue(record?.relevance_config) : (_.keys(config)[0] || '');

    // 获取初始数据
    const firstKey = Array.isArray(selectedValue) ? selectedValue.join('&&') : selectedValue;
    const firstNode = config[firstKey] || {};

    return {
      useCascader: actualUseCascader,
      selectedData,
      config,
      selectedValue,
      data: firstKey ? firstNode.data || [] : [],
      readableName: firstNode.readableName || '',
    };
  }

  onSelectChange = (e, b) => {
    const { config, data, selectedValue, readableName } = this.state;
    const label = b?.props?.label;

    const state = {selectedValue: e, data: config[e]?.data || [], readableName: label};
    if (selectedValue && readableName) {
      state.config = {...config, [selectedValue]: {data, readableName}}
    }
    this.setState(state)
  }

  onCascaderChange = (e) => {
    const { config, data, selectedValue } = this.state;
    if (!e || e.length === 0) return;

    const key = e.join('&&');
    const state = {selectedValue: e, data: config[key]?.data || [], readableName: ''};
    if (selectedValue && selectedValue.length > 0) {
      const key2 = selectedValue.join('&&');
      state.config = {...config, [key2]: {data, readableName: ''}};
    }
    this.setState(state);
  }

  renderSelect = () => {
    const { selectedValue, selectedData, useCascader } = this.state;

    if (useCascader) {
      return (
        <Cascader
          size='small'
          options={selectedData}
          onChange={this.onCascaderChange}
          value={selectedValue}
          placeholder="选择级联选项"
          style={{ width: 200 }}
        />
      );
    }

    return (
      <Select size='small' onChange={this.onSelectChange} allowClear style={{width: 150}} value={selectedValue}>
        {selectedData.map(i => <Option value={i.key} label={i.value} key={i.key}>{i.value}</Option>)}
      </Select>
    )
  }

  renderContent = () => {
    const { data } = this.state;

    return (
      <div style={{ padding: '4px 0' }}>
        {this.renderSelect()}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 1px' }}>
          <Button style={{marginTop: 5}} size='small' onClick={this.add}>添加</Button>
        </div>
        <div style={{width: 500, margin: '8px 0px'}}>
          <StandardTable
            defaultData={data}
            rowSelection={false}
            columns={this.columns}
            height={220}
            noPager
          />
        </div>
        <div><Button size='small' onClick={this.onSubmit}>确定</Button></div>
      </div>
    )
  }

  renderMapping = () => {
    const { disabled } = this.props;
    const { visible, title } = this.state;
    return (
      <div>
        <Popover
          title={title || '依赖配置项'}
          trigger='click'
          placement='right'
          content={this.renderContent()}
          visible={visible}
          onVisibleChange={this.handleModalVisible}
          overlayClassName={styles.selfPopoverModal}

        >
          <Button disabled={disabled} size='small'>{title || '依赖配置项'}</Button>
        </Popover>
      </div>
    )
  }

  renderDeleteBtn = (i) => {
    return (
      <Button onClick={() => this.deleteRow(i)} size='small'>删除</Button>
    )
  }

  onChange = (v, i, r, field) => {
    const item = {...r, [field]: v};
    const { data = [] } = this.state;
    this.setState({data: [...data.slice(0, i), item, ...data.slice(i + 1)]})
  }

  renderInput = (t, r, i, field) => {
    return (<Input size='small' onChange={(e) => this.onChange(e.target.value, i, r, field)} value={t} />)
  }

  handleModalVisible = (v) => {
    const { disabled } = this.props;
    if (disabled) return false;
    this.setState({
      visible: v,
    })
  }

  onSave = () => {
    const { data, selectedValue, config, readableName, useCascader } = this.state;
    if (!selectedValue || selectedValue.length === 0) return false;
    const key = useCascader ? selectedValue.join('&&') : selectedValue
    this.setState({ config: { ...config, [key]: { data, readableName } } })
  }

  onSaveAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { data, selectedValue, config, readableName, useCascader } = this.state;
        if (!selectedValue || (Array.isArray(selectedValue) && selectedValue.length === 0)) {
          resolve();
          return;
        }
        const key = useCascader ? selectedValue.join('&&') : selectedValue;
        const _data = data.filter(ele => ele.key && ele.value);
        this.setState({ config: { ...config, [key]: { data: _data, readableName } } }, resolve);
      }, 0);
    })
  }

  onSubmitPre = () => {
    const { config, useCascader } = this.state;
    const { updateData, dataField, record } = this.props;
    if (updateData) {
      updateData(JSON.stringify(config), dataField, { ...record, useCascader: useCascader ? '1' : '0' })
    }
    this.handleModalVisible(false)
  }

  onSubmit = () => {
    this.onSaveAsync().then(this.onSubmitPre)
  }

  add = () => {
    const { data = [] } = this.state;
    this.setState({data: [...data, {id: uuidv4()}]})
  }

  deleteRow = (id) => {
    const { data } = this.state;
    this.setState({data: data.filter(i => i.id !== id)})
  }

  render () {
    return this.renderMapping()
  }
}

/**
 * 将扁平的 relevance_config key（如 "beijing&&haidian"）转换为级联选择器需要的树形结构
 * @param {Object} relevanceConfig - 扁平的配置对象
 * @param {Object} fieldOptions - 依赖字段的选项（用于获取标签名）
 * @returns {Array} 级联选择器的 options
 */
function buildCascaderOptions(relevanceConfig, fieldOptions = []) {
  const tree = {};

  // 遍历所有 key，构建树形结构
  for (const key in relevanceConfig) {
    const parts = key.split('&&');
    if (parts.length < 2) continue;

    const firstLevel = parts[0];
    const secondLevel = parts.slice(1).join('&&'); // 支持多级

    // 初始化第一级
    if (!tree[firstLevel]) {
      const option = fieldOptions.find(opt => opt.key === firstLevel);
      tree[firstLevel] = {
        value: firstLevel,
        label: option?.value || firstLevel,
        children: {},
      };
    }

    // 添加第二级
    tree[firstLevel].children[secondLevel] = {
      value: secondLevel,
      label: secondLevel,
    };
  }

  // 转换为数组格式
  return Object.values(tree).map(node => ({
    value: node.value,
    label: node.label,
    children: Object.values(node.children),
  }));
}

export default RelevanceConfigModal;
