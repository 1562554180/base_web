import React, { Component } from 'react';
import { parseJson } from 'utils/utils';
import { Button, Input, Select, Popover, Cascader } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import StandardTable from 'components/newStandardTable';
import styles from './index.less'

const { Option } = Select
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
    const record = props.record || {};
    const relevanceNode = props.relevanceNode;
    let selectedData = [];
    let useCascader = false;
    const relevanceConfig = parseJson(relevanceNode.relevance_config, {})
    if (!_.isEmpty(relevanceConfig)) {
      useCascader = true;
      for (const i in relevanceConfig) {
        const node = relevanceConfig[i];
        if (node.data && node.data.length > 0) {
          selectedData.push({key: i, value: node.readableName, children: node.data})
        }
      }
    } else {
      selectedData = parseJson(relevanceNode.options, [])
    }
    const config = parseJson(record.relevance_config, {})
    const firstKey = _.keys(config)[0] || '';
    const firstNode = config[firstKey] || {};
    const selectedValue = useCascader ? firstKey.split('&&') : firstKey;
    return {useCascader, selectedData, config, selectedValue, data: firstKey ? firstNode.data || [] : [], readableName: firstNode.readableName || ''}
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
    const key = e.join('&&');
    const state = {selectedValue: e, data: config[key]?.data || [], readableName: ''};
    if (selectedValue) {
      const key2 = selectedValue.join('&&')
      state.config = {...config, [key2]: {data, readableName: ''}}
    }
    this.setState(state)
  }

  renderSelect = () => {
    const { selectedValue, selectedData, useCascader } = this.state;
    if (useCascader) {
      return (<Cascader size='small' options={selectedData} onChange={this.onCascaderChange} fieldNames={{label: 'value', value: 'key'}} />)
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
    this.setState({ config: { ...config, [key]: { data, readableName } } }, () => {
      console.log(this.state.config)
    })
  }

  onSaveAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { data, selectedValue, config, readableName, useCascader } = this.state;
        if (!selectedValue || selectedValue.length === 0) return false;
        const key = useCascader ? selectedValue.join('&&') : selectedValue
        const _data = data.filter(ele => ele.key && ele.value);
        this.setState({ config: { ...config, [key]: { data: _data, readableName } } }, () => {
          console.log(this.state.config)
        })
        resolve()
      }, 0);
    })
  }

  onSubmitPre = ()=> {
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

export default RelevanceConfigModal;
