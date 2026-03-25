import React, { PureComponent } from 'react';
import _ from 'lodash';
import { content, disablePortrait } from 'utils/config';
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Button, Table, Select, Popconfirm, Checkbox, DatePicker, message } from 'antd';
import moment from 'moment';

const Option = Select.Option;

const types = {keyword: 'keyword', long: 'long', float: 'float', date: 'date', ip: 'ip'};
const analysisTypes = {ip: 'IP画像', mac: 'MAC画像', router: '路由画像'};
const units = {s: '秒级', ms: '毫秒级'};

export default class EditTable extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data || [],
      tableName: props.tableName,
      anotherName: props.anotherName,
      dragRowIds: [],
      searchData: [],
      isSearch: false,
      searchValue: '',
      isUpdate: false,
      selectedRowKeys: [],
      ...this.initColumns(props),
    };
    if(this.state.data && this.state.data.length > 0) {
      for(const [index, item] of this.state.data.entries()) {
        item._id = `id_${new Date().getTime()}_${_.random(1, 1000)}_${index}`
      }
    }

    if (props.parent) {
      if (props.dataKey) {
        props.parent[`get${props.dataKey}Data`] = this.getData;
        props.parent[`get${props.dataKey}TableName`] = this.getTableName;
        props.parent[`get${props.dataKey}AnotherName`] = this.getAnotherName;
      } else {
        props.parent.getData = this.getData;
        props.parent.getTableName = this.getTableName;
        props.parent.getAnotherName = this.getAnotherName;
      }
      props.parent.createRender = this.createRender;
    };
  };

  initColumns = (props) => {
    const oldColumns = props.columns || [
      {title: '字段名', dataIndex: 'mapped_name', key: 'mapped_name', width: 150, type: 'input', sorter: true},
      {title: '中文名', width: 180, key: 'readable_name', dataIndex: 'readable_name', type: 'input'},
      {title: '类型', dataIndex: 'field_type', key: 'field_type', width: 130, sorter: true, type: 'select', options: types},
      {title: 'IP类型', width: 70, key: 'ip_long', dataIndex: 'ip_long', type: 'checkbox'},
      {title: '时间戳', width: 70, key: 'is_timestamp', dataIndex: 'is_timestamp', type: 'checkbox', controlField: 'time_unit', checkedControlVal: 'ms', unCheckedControlVal: ''},
      {title: '时间戳单位', width: 70, key: 'time_unit', dataIndex: 'time_unit', type: 'select', options: units, placeholder: '默认毫秒级', controlledField: 'is_timestamp', controlledDisabledValue: false},
    ];
    if (!disablePortrait) {
      // this.columns = this.columns.concat([
      //   {title: '展示画像', width: 70, key: 'analysis', dataIndex: 'analysis', type: 'checkbox', controlField: 'analysis_type', checkedControlVal: 'ip', unCheckedControlVal: ''},
      //   {title: '画像类型', width: 70, key: 'analysis_type', dataIndex: 'analysis_type', type: 'select', options: analysisTypes, placeholder: '默认IP画像', controlledField: 'analysis', controlledDisabledValue: false},
      // ])
    }

    const columns = [];
    for (const item of oldColumns) {
      columns.push(item.render ? item : {...item, render: (t, r, i) => this.createRender(t, r, i, item)})
    };
    const deleteItem = {
      title: '', dataIndex: 'delete', key: 'delete', width: 100,
      render: (t, r, i) => (
        <Popconfirm
          title={`确定删除该${props.addFieldName || '字段'}？`}
          onConfirm={() => this.delete(r, i)}
        >
          <Button
            size={props.cellSize || 'default'}
            style={r.style || {margin: 0}}
            disabled={(r.disabled && r.disabled !== '0') || r.disabled === '1' || r.is_default === '1'}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
    }
    if(!props.hiddenDel) {
      columns.push(deleteItem);
    }
    let xScroll = 0;
    for (const i of columns) {
      xScroll += i.width;
    }
    return {columns, xScroll};
  }

  componentDidMount() {
    const { isUpdate } = this.state;
    this.setState({isUpdate: !isUpdate}, this.initDraggableRow)
  }

  componentWillReceiveProps(nextProps) {
    const state = {}
    if (!_.isEqual(this.props.data, nextProps.data)) {
      state.data = nextProps.data
      if(nextProps.data && nextProps.data.length > 0) {
        for(const [index, item] of nextProps.data.entries()) {
          item._id = `id_${new Date().getTime()}_${_.random(1, 1000)}_${index}`
        }
      }
    }
    if (!_.isEqual(this.props.columns, nextProps.columns)) {
      const columnsInfo = this.initColumns(nextProps);
      state.columns = columnsInfo.columns;
      state.xScroll = columnsInfo.xScroll;
    }
    if (!_.isEmpty(state)) {
      this.setState(state, this.initDraggableRow)
    }
  }

  initColumnRender = (item) => {
    item.render = (t, r, i) => this.createRender(t, r, i, item);
  };

  getData = () => {
    const { data } = this.state;
    const array = _.cloneDeep(data)
    for(const i of array) {
      delete i._id;
    }
    return array;
  };

  getTableName = () => {
    return this.state.tableName;
  };

  getAnotherName = () => {
    return this.state.anotherName;
  };

  createRender = (t, r, i, item) => {
    const { cellSize } = this.props;
    if (item.type === 'input') {
      return (
        <Input
          size={cellSize || 'default'}
          value={t}
          placeholder={item.placeholder || ''}
          onChange={e => this.updateData(e.target.value, r, i, item.dataIndex)}
          disabled={(r.disabled && r.disabled !== '0') || r.disabled === '1' || r.is_default === '1'}
        />
      )
    } else if (item.type === 'select') {
      const options = item.options || {};
      const controlledField = item.controlledField;
      const currentControlledValue = r[controlledField];
      const controlDisabled = !_.isUndefined(controlledField) && (_.isUndefined(currentControlledValue) || currentControlledValue === item.controlledDisabledValue);

      return (
        <Select
          size={cellSize || 'default'}
          value={t}
          style={{minWidth: 100}}
          placeholder={item.placeholder || ''}
          onChange={e => this.updateData(e, r, i, item.dataIndex)}
          disabled={controlDisabled || (r.disabled && r.disabled !== '0') || r.disabled === '1' || r.is_default === '1'}
        >
          {
            _.isArray(options) ? (
              options.map(option => <Option value={option.key || option.id} key={option.key || option.id}>{option.label || option.name}</Option>)
            ):(
              _.keys(options).map(option => <Option value={option} key={option}>{options[option]}</Option>)
            )
          }
        </Select>
      )
    } else if (item.type === 'checkbox') {
      const controlField = item.controlField;
      const checkedControlVal = item.checkedControlVal || '';
      const unCheckedControlVal = item.unCheckedControlVal || '';
      return (
        <Checkbox
          onChange={e => {
            const otherAttrs = {};
            if (controlField) {
              otherAttrs[controlField] = e.target.checked ? checkedControlVal : unCheckedControlVal;
            }
            this.updateData(e.target.checked, r, i, item.dataIndex, otherAttrs)
          }}
          checked={t}
          disabled={(r.disabled && r.disabled !== '0') || r.disabled === '1' || r.is_default === '1'}
        />
      )
    } else if (item.type === 'date') {
      return (
        <DatePicker
          size='small'
          value={t ? moment(t) : ''}
          allowClear
          onChange={e => this.updateData(e, r, i, item.dataIndex)}
          style={{width: '100%'}}
          format={item.format || 'YYYY-MM-DD'}
        />
      )
    } else if(item.type === 'show') {
      return t;
    }
    return t;
  };

  updateData = (v, r, i, key, attrs = {}) => {
    const uData = _.cloneDeep(this.state.data || []);
    if (uData.length === 0) return false;

    const { specialChange, addEventListenerDataChange } = this.props;
    if (addEventListenerDataChange) {
      content.isChanged = true;
    }
    if (!uData[i]) return false;
    if(specialChange) {
      specialChange(key, v, r, i, () => {
        uData[i] = {...uData[i], [key]: v, ...attrs};
        this.setState({data: uData});
      })
    } else {
      uData[i] = {...uData[i], [key]: v, ...attrs};
      this.setState({data: uData});
    }
  };

  delete = (record) => {
    const { addEventListenerDataChange } = this.props;

    if (addEventListenerDataChange) {
      content.isChanged = true;
    }
    const { data, dragRowIds } = this.state;
    const newData = data.filter((item) => item._id !== record._id);
    const newDragRowIds = dragRowIds.filter((val) => val !== record._id);
    this.setState({data: newData, dragRowIds: newDragRowIds})
  }

  addData = () => {
    const { data } = this.state;
    const { requiredSelect, isOrder, addDefaultRow, selectedData, addEventListenerDataChange } = this.props;
    if(requiredSelect && _.isEmpty(selectedData)) return message.error(requiredSelect)
    if (addEventListenerDataChange) {
      content.isChanged = true;
    }
    const newData = _.cloneDeep(data);
    const object = addDefaultRow? addDefaultRow(newData) : {};
    let index = 0;
    if(newData && newData.length > 0) {
      index = newData[newData.length - 1]._id.lastIndexOf('_');
      index = newData[newData.length - 1]._id.substring(index + 1)
    }
    object._id = `id_${new Date().getTime()}_${_.random(1, 1000)}_${Number(index) + 1}`;
    if(isOrder) {
      newData.push(object);
    }else {
      newData.unshift(object);
    }
    this.setState({
      data: newData,
    }, this.initDraggableRow)
  }

  changeTableName = (e) => {
    const { addEventListenerDataChange } = this.props;

    if (addEventListenerDataChange) {
      content.isChanged = true;
    }
    this.setState({
      tableName: e.target.value,
    })
  };

  changeAnotherName = (e) => {
    const { addEventListenerDataChange } = this.props;

    if (addEventListenerDataChange) {
      content.isChanged = true;
    }
    this.setState({
      anotherName: e.target.value,
    })
  };


  renderTableName = () => {
    const { tableName, anotherName } = this.state;
    const { readOnlyName, tableNameLabel, hiddenTableName, tableNamePlaceholder } = this.props;
    const label = tableNameLabel || '表名';
    if (hiddenTableName) return '';
    return (
      <span>
        {label}：
        <Input
          value={tableName}
          style={{width: 350}}
          readOnly={readOnlyName}
          placeholder={tableNamePlaceholder}
          onChange={this.changeTableName}
        />
        &nbsp;&nbsp;
        别名：
        <Input
          value={anotherName}
          style={{width: 200}}
          placeholder='请输入别名'
          onChange={this.changeAnotherName}
        />
      </span>
    )
  }

  initDraggableRow = () => {
    const rows = document.getElementsByClassName('draggableRow');
    for (let i = 0; i < rows.length; i += 1) {
      rows[i].style.cursor = 'move';
      rows[i].draggable = true;
    }
  };

  createClassName = (record, index) => {
    let className = index % 2 === 0 ? 'double_fixed_data_table2_select_row' : 'single_fixed_data_table2_select_row';
    className += ` draggableRow ${this.getRowClassName(record)}`;
    return className;
  }

  getRowClassName = record => {
    const { dragRowIds } = this.state;
    const id = this.getKey(record);
    for (let i = 0; i < dragRowIds.length; i++) {
      if (id === dragRowIds[i]) {
        return 'dragRow';
      }
    }
    return '';
  }

  getKey = record => {
    const key = '_id';
    return record[key];
  }

  onClickRow = (e, record) => {
    if (e.ctrlKey) {
      const { dragRowIds } = this.state;
      const id = record._id;
      if (dragRowIds.indexOf(id) === -1) {
        this.setState({
          dragRowIds: [...dragRowIds, id],
        })
      } else {
        this.setState({
          dragRowIds: dragRowIds.filter(row => row !== id),
        })
      }
    }
  }

  onDragOver = e => {
    e.preventDefault();
  };

  onDragStart = (e, index) => {
    this.sourceIndex = index;
  };

  onDrop = (e, record, index) => {
    e.preventDefault();
    const { addEventListenerDataChange } = this.props;
    const { dragRowIds, data } = this.state;
    const { sourceIndex } = this;
    if (index !== sourceIndex) { // 把自己拖向自己则不重新排序
      const targetRecord = data[index];
      if (dragRowIds.length > 0 && dragRowIds.indexOf(this.getKey(data[sourceIndex])) === -1) {
        message.error('有选中的数据时，不能拖动其他数据');
        return;
      }
      const toUp = sourceIndex > index; // true: 从下往上拖 false: 从上往下拖
      const dragRecords = this.getDragRecords(dragRowIds.length > 0 ? dragRowIds : [this.getKey(data[sourceIndex])]);
      // 检查移动方向
      for (let i = 0; i < dragRecords.length; i++) {
        if (dragRecords[i].index === index) {
          message.error('不能拖向已选中行');
          return;
        }
        if (dragRecords[i].index > index !== toUp) {
          message.error('只能向同方向拖动');
          return;
        }
      }
      // 移出
      for (let i = dragRecords.length - 1; i >= 0; i--) {
        data.splice(dragRecords[i].index, 1);
      }
      // 移入
      let targetIndex = data.findIndex(item => item === targetRecord);
      if (!toUp) {
        targetIndex += 1;
      }
      data.splice(targetIndex, 0, ...(dragRecords.map(item => item.record)))
      if (addEventListenerDataChange) {
        content.isChanged = true;
      }
      // 渲染
      this.forceUpdate();
      // this.reset();
    }
  };

  getDragRecords = dragRowIds => {
    const { data } = this.state;
    const key = '_id';
    const dragRecords = [];
    dragRowIds.forEach(item => {
      for (let i = 0; i < data.length; i++) {
        if (data[i][key] === item) {
          dragRecords.push({id: item, index: i, record: data[i]})
        }
      }
    })
    return dragRecords.sort((a, b) => a.index - b.index);
  }

  searchChange = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  handleFormReset = () => {
    this.setState({
      searchData: [],
      searchValue: '',
      isSearch: false,
    })
  };

  onSearch = () => {
    const { searchValue, data = [] } = this.state;
    const { searchField } = this.props;
    const searchData = [];

    if(!searchValue) {
      this.setState({isSearch: false, searchData: []})
    } else {
      for(const i in data) {
        for(const k of searchField) {
          if(data[i][k] && data[i][k].indexOf(searchValue) > -1) {
            searchData.push(data[i]);
            break;
          }
        }
      }
      this.setState({searchData, isSearch: true})
    }
  };

  handleMoreDel = () => {
    const { addFieldName, addEventListenerDataChange } = this.props;
    const { selectedRowKeys, data, dragRowIds } = this.state;
    if (selectedRowKeys.length === 0) {
      message.warn(`请选择需要删除的${addFieldName || '字段'}`)
      return;
    }
    if (addEventListenerDataChange) {
      content.isChanged = true;
    }
    let newData = [];
    let newDragRowIds = [];
    for(const i of selectedRowKeys) {
      newData = data.filter(item => item._id !== i);
      newDragRowIds = dragRowIds.filter(val => val !== i);
    }
    this.setState({
      data: newData,
      selectedRowKeys: [],
      dragRowIds: newDragRowIds,
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    })
  }

  render() {
    const { data, searchValue, searchData, isSearch, selectedRowKeys, columns, xScroll } = this.state;
    const { hiddenTableName, scroll, addFieldName, hiddenSearch, extraBtn, moreDel, style, hiddenHeader } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return <>
      <div style={{marginBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
        <div>
          {!hiddenTableName && this.renderTableName()}
          <Button disabled={isSearch} style={{margin: '0px 10px'}} onClick={this.addData} type='primary' icon={<PlusOutlined />}>添加{addFieldName || '字段'}</Button>
          {moreDel && (
            <Popconfirm title='确定要删除选中的字段吗？' onConfirm={this.handleMoreDel}>
              <Button type='primary' style={{marginRight: '10px'}}>批量删除</Button>
            </Popconfirm>
          )}
          {extraBtn}
        </div>
        {!hiddenSearch && (
          <div style={{textAlign: 'right'}}>
            <Input placeholder='请输入搜索内容' value={searchValue} onChange={this.searchChange} style={{width: 200}}  />
            <Button type='primary' icon={<SearchOutlined />} style={{margin: '0px 10px'}} onClick={this.onSearch}>搜索</Button>
            <Button type='primary' icon={<ReloadOutlined />} onClick={this.handleFormReset}>重置</Button>
          </div>
        )}
      </div>
      <div>
        <Table
          bordered
          rowKey='_id'
          style={style}
          pagination={false}
          columns={columns}
          showHeader={!hiddenHeader}
          rowClassName={this.createClassName}
          scroll={{x: xScroll, ...scroll}}
          rowSelection={moreDel ? rowSelection:null}
          dataSource={isSearch ? searchData : data || []}
          onRow={(record, index) => {
            return {
              onDragOver: this.onDragOver,
              onDrop: e => this.onDrop(e, record, index),
              onDragStart: e => this.onDragStart(e, index),
              onClick: e => this.onClickRow(e, record, index),
            }
          }}
        />
      </div>
    </>;
  }
}
