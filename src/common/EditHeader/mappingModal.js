import React, { Component } from 'react';
import { parseJson } from 'utils/utils';
import { Table, Button, Input, Select, Popover, Checkbox, ColorPicker } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Icon from 'components/Icon';
import config from 'utils/config';
import './color.less'

class MappingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      visible: false,
      data: props.data || [],
      ...this.initState(props),
      showRows: props?.allData || [],
    };

    this.columns = [
      { title: 'KEY', dataIndex: 'key', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'key') },
      { title: 'Value', dataIndex: 'value', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'value') },
      { title: '图标', dataIndex: 'icon', width: 80, render: (t, r, i) => this.renderIconSelect(t, r, i) },
      { title: '图标大小', dataIndex: 'font', width: 80, render: (t, r, i) => this.renderInput(t, r, i, 'font') },
      { title: '颜色', dataIndex: 'color', width: 80, render: (t, r, i) => this.renderColorSelect(t, r, i) },
      { title: '', dataIndex: 'id', width: 80, render: this.renderDeleteBtn },
    ]
    this.relevanceColumns = [
      { title: '依赖字段', dataIndex: 'field', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'field') },
      { title: 'KEY', dataIndex: 'key', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'key') },
      { title: 'Value', dataIndex: 'value', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'value') },
      { title: '', dataIndex: 'id', width: 80, render: this.renderDeleteBtn },
    ]
  }

  changeColorPicker = (e, i, r) => {
    const v = '#' + e.toHex();
    this.onChange(v, i, r, 'color')
  }

  onOpen = () => {
    this.isOpen = true;
  }

  onClose = () => {
    this.isOpen = false;
  }

  renderIconSelect = (t, r, i) => {
    return (
      <Select size='small' onChange={(e) => this.onChange(e, i, r, 'icon')} value={t} style={{ width: 60 }}>
        <Select.Option value='lock'><Icon type='lock' /></Select.Option>
        <Select.Option value='unlock'><Icon type='unlock' /></Select.Option>
        <Select.Option value='setting'><Icon type='setting' /></Select.Option>
        <Select.Option value='__fill_bell'><Icon type='bell' /></Select.Option>
        <Select.Option value='__fill_bulb'><Icon type='bulb' /></Select.Option>
        <Select.Option value='__fill_eye'><Icon type='eye' /></Select.Option>
        <Select.Option value='__fill_eye-invisible'><Icon type='eye-invisible' /></Select.Option>
        <Select.Option value='customIcon_icon-big-circle'><Icon customIcon type='icon-big-circle' /></Select.Option>
      </Select>
    )
  }

  renderColorSelect = (t, r, i) => {
    return (
      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
        颜色
        <ColorPicker
          value={t || config.iconMappingDefaultColor}
          size='small'
          format='hex'
          onChange={(e) => this.changeColorPicker(e, i, r)}
        />
      </span>
    )
  }

  renderIsNetControl = (t, r, i) => {
    return (
      <Select size='small' onChange={(e) => this.onChange(e, i, r, 'isNetControl')} value={t} style={{ width: 100 }} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
        <Select.Option value={1}>网控</Select.Option>
        <Select.Option value={0}>非网控</Select.Option>
      </Select>
    )
  }

  renderRelateSiginalSelect = (t, r, i, list) => {
    return (
      <Select size='small' mode="multiple" onChange={(e) => this.onChange(e, i, r, 'relate_siginal')} value={t} style={{ minWidth: 120 }}>
        {(list || []).map((item) => <Select.Option value={item.key} key={item.key}>{item.name}</Select.Option>)}
      </Select>
    )
  }

  renderRelateDecType = (t, r, i) => {
    const { decList } = this.props;
    return (
      <Select size='small' mode="multiple" onChange={(e) => this.onChange(e, i, r, 'relate_dec_type')} value={t} style={{ minWidth: 120 }}>
        {
          (decList || []).map((item) => {
            return (
              <Select.Option value={item.key} key={item.key}>{item.value}</Select.Option>
            )
          })
        }
      </Select>
    )
  }

  initState = (props) => {
    const dataField = props.dataField || '';
    const checkBoxField = props.checkBoxField || '';
    const record = props.record || {};
    const title = props.title || '';
    return { title, dataField, checkBoxField, checked: record[checkBoxField] === '1', data: parseJson(record[dataField], []) }
  }

  renderContent = () => {
    const { checkSiginalType, checkDecType } = this.props;
    const { data, dataField } = this.state;

    let tableColumns = [];
    if (dataField != "range_relevance") {
      tableColumns = this.columns;
    } else {
      tableColumns = this.relevanceColumns;
    }
    let commonBoxWidth = 760;

    if (checkDecType && !_.isEmpty(checkDecType)) {
      const isHaveCheckDecType = (tableColumns.filter((core) => core.dataIndex === 'relate_dec_type')).length > 0;
      if (!isHaveCheckDecType) {
        const checkDecTypeItem = {
          title: '关联编码类型',
          dataIndex: 'relate_dec_type',
          width: 120,
          render: (t, r, i) => this.renderRelateDecType(t, r, i),
        }
        let fromIndex = 2;
        if (checkSiginalType && !_.isEmpty(checkSiginalType)) {
          fromIndex = 3;
        }
        tableColumns.splice(fromIndex, 0, checkDecTypeItem);
      }
      commonBoxWidth = 950;
    }
    return (
      <div style={{ padding: '4px 0', width: commonBoxWidth }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '8px 1px' }}>
          <Button size='small' onClick={this.add}>添加</Button>
          <Button size='small' onClick={this.onSubmit}>保存</Button>
        </div>
        <div style={{margin: '8px 0px'}}>
          <Table
            dataSource={data}
            rowSelection={false}
            rowKey='id'
            columns={tableColumns}
            // style={{ height: '680px', width: commonBoxWidth }}
            height={300}
            noPager
          />
        </div>
      </div>
    )
  }

  onSelectRow = (rowKeys, rows) => {
    this.setState({showRows: rows})
  }

  updateCheckedStatus = (e) => {
    const { checkBoxField } = this.state;
    const checked = e.target.checked;
    this.setState({ checked }, () => {
      if (this.props.updateData) {
        this.props.updateData(checked ? '1' : '0', checkBoxField)
      }
    })
  }

  renderMapping = () => {
    const { visible, checked, title, checkBoxField } = this.state;
    return (
      <>
        {checkBoxField && (
          <span>
            <Checkbox size='small' onChange={this.updateCheckedStatus} checked={checked} />
            &nbsp;&nbsp;&nbsp;
          </span>
        )}
        <Popover
          title={title || '映射内容'}
          trigger='click'
          placement='right'
          content={this.renderContent()}
          visible={visible}
          onVisibleChange={(v) => this.handleModalVisible(v)}
        >
          <Button disabled={checkBoxField ? !checked : false} size='small'>{title || '映射内容'}</Button>
        </Popover>
      </>
    )
  }

  renderDeleteBtn = (i) => {
    const { allVsatOptions } = this.props
    return (
      <Button onClick={() => this.deleteRow(i)} size='small' disabled={!!allVsatOptions}>删除</Button>
    )
  }

  onChange = (v, i, r, field) => {
    const item = { ...r, [field]: v };
    const { data = []} = this.state;
    this.setState({ data: [...data.slice(0, i), item, ...data.slice(i + 1)] })
  }

  renderInput = (t, r, i, field) => {
    const { allVsatOptions } = this.props
    return (<Input size='small' onChange={(e) => this.onChange(e.target.value, i, r, field)} value={t} disabled={!!allVsatOptions} />)
  }

  handleModalVisible = (v) => {
    const { checked, checkBoxField } = this.state;
    if (this.isOpen) return false;
    if (!checked && checkBoxField) return false;
    this.setState({
      visible: v,
    })
  }

  onSubmit = () => {
    const { data, dataField, showRows=[] } = this.state;
    const { updateData, allVsatOptions } = this.props;
    let uData = []
    if(allVsatOptions) {
      uData = showRows
    } else {
      uData = data
    }
    uData.forEach(element => {
      if (element.icon && _.isUndefined(element.color)) element.color = config.iconMappingDefaultColor;
    })
    if (updateData) updateData(JSON.stringify(uData), dataField)
    this.handleModalVisible(false)
  }

  add = () => {
    const { data } = this.state;
    this.setState({ data: [...data, { id: uuidv4() }] })
  }

  deleteRow = (id) => {
    const { data } = this.state;
    this.setState({ data: data.filter(i => i.id !== id) })
  }

  render () {
    return this.renderMapping()
  }
}

export default MappingModal;
