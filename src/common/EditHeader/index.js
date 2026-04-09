import React, { Component } from 'react';
import { parseJson, exportDownFileByWeb } from 'utils/utils';
import { Button, Input, Select, Popconfirm, Checkbox, Tooltip, Upload, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import defaultColumnsArray from 'utils/default_columns_array';
import * as rqHome from 'requests/home';
import Icon from 'components/Icon';
import DraggableTable from 'components/agTable';
import AutoSizeDialog from 'components/Dialog';
import MappingModal from './mappingModal';
import RelevanceConfigModal from './relevanceConfigModal';
import VisibleWhenConfigModal from './visibleWhenConfigModal';


class EditHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title: props.title || '',
      modalVisible: false,

      selectedRows: [],
      selectedRowKeys: [],
    };
    this.numberOptions = [
      { value: 'format', label: '千分位'},
      { value: 'percent', label: '百分比'},
      { value: 'time', label: '时间' },
      { value: 'traffic', label: '流量' },
      { value: 'calculate', label: '运算', render: this.renderCalculate},
      { value: 'tofixed', label: '小数点', render: this.renderToFixed},
    ]
    this.typeOptions = [
      { value: 'text', label: '文本' },
      { value: 'number', label: 'Number'},
      { value: 'ipv4', label: 'IP' },
    ];
    const fieldTypeOptions = [
      { value: 'text', label: '文本' },
      { value: 'input', label: '文本框' },
      { value: 'select', label: '下拉框' },
      { value: 'date', label: '时间选择框' },
      { value: 'date_range', label: '时间范围' },
      { value: 'switch', label: 'Switch' },
      { value: 'checkbox', label: '复选框' },
      { value: 'radioButton', label: '单选按钮' },
      { value: 'number_range', label: '区间' },
      { value: 'ip', label: 'IP' },
    ];

    const textAlignOptions = [
      { value: 'right', label: '右对齐' },
      { value: 'center', label: '居中' },
      { value: 'left', label: '左对齐' },
    ];

    const fixedOptions = [{ value: 'left', label: '固定左侧' }, { value: 'right', label: '固定右侧' }];
    // header
    this.headerColumns = [
      { title: '中文名', dataIndex: 'ch_name', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'ch_name') },
      { title: '英文名', dataIndex: 'en_name', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'en_name') },
      { title: '详情显示', dataIndex: 'show_in_detail', width: 150, render: (t, r, i) => this.renderCheckbox(t, r, i, 'show_in_detail') },
      { title: '禁止调整', dataIndex: 'is_disabled', width: 160, render: (t, r, i) => this.renderCheckbox(t, r, i, 'is_disabled') },
      { title: 'Form回显字段', dataIndex: 'en_name_form', width: 140, render: (t, r, i) => this.renderInput(t, r, i, 'en_name_form') },
      { title: '隐藏', dataIndex: 'hidden', width: 100, render: (t, r, i) => this.renderCheckbox(t, r, i, 'hidden') },
      { title: '类型', dataIndex: 'type', width: 360, render: (t, r, i) => this.renderFieldType(t, r, i, 'type', this.typeOptions) },
      { title: '固定', dataIndex: 'position', width: 110, render: (t, r, i) => this.renderSelect(t, r, i, 'position', fixedOptions) },
      { title: '对齐方式', dataIndex: 'align', width: 150, render: (t, r, i) => this.renderSelect(t, r, i, 'align', textAlignOptions) },
      { title: '宽度', dataIndex: 'width', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'width') },
      // { title: '保留小数点', dataIndex: 'tofixed', width: 120, render: this.renderToFixed },
      // { title: '基础运算', dataIndex: 'calculate_type', width: 160, render: this.renderCalculate },
      { title: '映射字段', dataIndex: 'mapping', width: 200, render: this.renderMapping },
      // {title: '依赖展示', dataIndex: 'relevance', width: 200, render: this.renderRelevanceMapping},
      { title: '单位', dataIndex: 'unit', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'unit') },
      { title: '排序支持', dataIndex: 'is_sorter', width: 90, render: (t, r, i) => this.renderCheckbox(t, r, i, 'is_sorter') },
      { title: '查询支持', dataIndex: 'is_search', width: 90, render: (t, r, i) => this.renderCheckbox(t, r, i, 'is_search') },
      { title: '操作', dataIndex: 'id', width: 100, render: this.renderDeleteBtn, fixed: 'right', disabled: true },
    ];

    this.formItemColumns = [
      { title: '中文名', dataIndex: 'ch_name', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'ch_name') },
      { title: '英文名', dataIndex: 'en_name', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'en_name') },
      { title: '隐藏', dataIndex: 'hidden', width: 100, render: (t, r, i) => this.renderCheckbox(t, r, i, 'hidden') },
      { title: '必填项', dataIndex: 'required', width: 100, render: (t, r, i) => this.renderCheckbox(t, r, i, 'required') },
      { title: '栅格占比', dataIndex: 'span', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'span') },
      { title: this.renderValuesTip(), dataIndex: 'value_range', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'value_range') },
      // {title: '正则', dataIndex: 'reg', width: 180, render: (t, r, i) => this.renderInput(t, r, i, 'reg')},
      { title: '类型', dataIndex: 'field_type', width: 130, render: (t, r, i) => this.renderSelect(t, r, i, 'field_type', fieldTypeOptions) },
      { title: 'Options', dataIndex: 'options', width: 150, render: this.renderOptions },
      { title: '默认值', dataIndex: 'default_value', width: 130, render: (t, r, i) => this.renderInput(t, r, i, 'default_value') },
      { title: '依赖字段', dataIndex: 'relevance_field', width: 210, render: this.relevanceConfig },
      { title: '条件显示', dataIndex: 'visible_when_config', width: 150, render: this.renderVisibleWhenConfig },
      { title: '单位', dataIndex: 'unit', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'unit') },
      { title: '操作', dataIndex: 'id', width: 100, render: this.renderDeleteBtn, disabled: true},
    ];

    this.textColumns = [
      { title: '中文名', dataIndex: 'ch_name', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'ch_name') },
      { title: '英文名', dataIndex: 'en_name', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'en_name') },
      { title: '提示信息', dataIndex: 'tooltip', width: 160, render: (t, r, i) => this.renderInput(t, r, i, 'tooltip') },
      { title: '默认值', dataIndex: 'default_value', width: 130, render: (t, r, i) => this.renderInput(t, r, i, 'default_value') },
      { title: '可编辑', dataIndex: 'is_edit', width: 130, render: (t, r, i) => this.renderCheckbox(t, r, i, 'is_edit') },
      { title: '隐藏', dataIndex: 'hidden', width: 130, render: (t, r, i) => this.renderCheckbox(t, r, i, 'hidden') },
      { title: '类型', dataIndex: 'type', width: 360, render: (t, r, i) => this.renderFieldType(t, r, i, 'type', this.typeOptions) },
      // { title: '保留小数点', dataIndex: 'tofixed', width: 160, render: this.renderToFixed },
      // { title: '基础运算', dataIndex: 'calculate_type', width: 160, render: this.renderCalculate },
      { title: '映射字段', dataIndex: 'mapping', width: 200, render: this.renderMapping },
      { title: '单位', dataIndex: 'unit', width: 120, render: (t, r, i) => this.renderInput(t, r, i, 'unit') },
      { title: '操作', dataIndex: 'id', width: 100, render: this.renderDeleteBtn, disabled: true },
    ];
    this.getColumnsFromType()
  }

  renderCalculate = (t, r, i) => {
    return (
      <>
        <Input
          size='small'
          defaultValue={r.calculate_value}
          style={{ width: 86 }}
          onChange={(e) => this.onDefaultValueChange(e.target.value, i, r, 'calculate_value')}
        />
      </>
    )
  }

  getColumnsFromType = () => {
    const { isAddShowInDetail, columnsType } = this.props;
    const type = columnsType;
    let columns = [];
    if (!type || type === 'headers') {
      columns = isAddShowInDetail ? this.headerColumns : this.headerColumns.filter(i => i.dataIndex !== 'show_in_detail');
    }
    if (type === 'formItem') columns = this.formItemColumns;
    if (type === 'text') columns = this.textColumns;
    this.columns = columns;
    this.scrollX = 0;
    for (const i of this.columns) {
      this.scrollX += i.width;
    }
  }

  relevanceConfig = (t, r, i) => {
    // 使用 defaultData 或 state.data 获取最新的数据
    const data = this.defaultData || this.state.data || [];
    const options = data.filter(j => j.field_type === 'select' && j.useCascader !== '1' && j.en_name !== r.en_name && j.relevance_field !== r.en_name) || []
    return (
      <div style={{ display: 'flex' }}>
        <Select size='small' onChange={(e) => this.onDefaultValueChange(e, i, r, 'relevance_field')} defaultValue={t} style={{ width: 100 }}>
          {options.map(j => <Select.Option key={j.en_name}>{j.ch_name}</Select.Option>)}
        </Select>
        {this.renderRelevanceConfig(t, r, i, options)}
      </div>
    )
  }

  renderValuesTip = () => {
    return (
      <span>取值范围&nbsp;<Tooltip title={this.createTip()}><a><Icon type='info-circle' /></a></Tooltip></span>
    )
  }

  createTip = () => {
    return (
      <div>
        <div>{`>500: 值必须大于500;`}</div>
        <div>{`<500: 值必须小于500;`}</div>
        <div>(100, 200): 值必须大于100且小于200;</div>
        <div>[100, 200): 值必须大于等于100且小于200;</div>
        <div>(100, 200]: 值必须大于100且小于等于200;</div>
        <div>[100, 200]: 值必须大于等于100且小于等于200;</div>
      </div>
    )
  }

  transformArrayToStructure = (arr) => {
    return arr.reduce((acc, key) => {
      if (key === '默认') {
        acc.default_field = { data: [] }
      } else {
        acc[key] = { data: [] }
      }
      return acc
    }, {})
  }

  filterObjectArray = (obj) => {
    const result = {}
    for (const key in obj) {
      if (obj[key] && obj[key].data && obj[key].data.length > 0) {
        result[key] = obj[key]
      }
    }
    return result
  }

  componentDidMount() {
    this.getheaders()
  }

  renderToFixed = (t, r, i) => {
    const disable = r.type !== 'number';
    return this.renderInput(t, r, i, 'tofixed', disable, '保留小数点')
  }

  renderOptions = (t, r, i) => {
    return <MappingModal dataField='options' title='配置项' updateData={(v, type) => this.onDefaultValueChange(v, i, r, type)} record={r} />
  }

  renderMapping = (t, r, i) => {
    return <MappingModal checkBoxField='is_mapping' dataField='mapping' updateData={(v, type) => this.onDefaultValueChange(v, i, r, type)} record={r} />
  }

  renderRelevanceMapping = (t, r, i) => {
    return <MappingModal checkBoxField='has_relevance' title="配置项" dataField='relevance_mapping' updateData={(v, type) => this.onDefaultValueChange(v, i, r, type)} record={r} />
  }

  renderRelevanceConfig = (t, r, i, data) => {
    const currentNode = data.filter(j => j.en_name === t)[0] || {};
    const selectedData = parseJson(currentNode.options, [])
    // 获取完整的数据数组，用于级联模式查找依赖链
    const allFields = this.defaultData || this.state.data || [];
    return (
      <RelevanceConfigModal
        relevanceNode={currentNode}
        selectedData={selectedData}
        disabled={!t}
        dataField='relevance_config'
        updateData={(v, type, record) => this.onDefaultValueChange(v, i, record, type)}
        record={r}
        allFields={allFields}
      />
)
  }

  renderVisibleWhenConfig = (t, r, i) => {
    const data = this.defaultData || this.state.data || [];
    // 获取所有可选的字段（排除当前字段）
    const allFields = data.filter(j => j.en_name !== r.en_name);
    return (
      <VisibleWhenConfigModal
        allFields={allFields}
        currentField={r.en_name}
        config={t}
        updateData={(v) => this.onDefaultValueChange(v, i, r, 'visible_when_config')}
      />
    );
  }

  getheaders = () => {
    const { type, updateHeaders, localType } = this.props;
    const params = {
      net_id: 1,
      session_id: 1,
      Command: "get_column_type_params",
      params: {type},
    }
    rqHome.dealColumnConfig(params, (res) => {
      const response = parseJson(res, {})
      const defaultColumns = localType ? defaultColumnsArray[localType] || [] : defaultColumnsArray[type] || [];
      let data = defaultColumns;
      if (response?.code === 0) {
        data = parseJson(response.data, defaultColumns);
        if (data.length === 0) {
          data = defaultColumns;
        }
      }
      const udata = this.initHeaders(data);
      if (updateHeaders) updateHeaders(udata);
      this.setState({data: udata});
    })
  }

  renderDeleteBtn = (i) => {
    return (
      <Popconfirm title='确定删除当前数据？' onConfirm={() => this.deleteRow(i)}>
        <Button size='small'>删除</Button>
      </Popconfirm>
    )
  }

  deleteRow = (id) => {
    const { data, selectedRowKeys, selectedRows } = this.state;
    const newData = data.filter(i => i.id !== id);
    this.defaultData = [...newData];  // 同步更新 defaultData
    this.setState({
      data: newData,
      selectedRows: selectedRows.filter(i => i.id !== id),
      selectedRowKeys: selectedRowKeys.filter(i => i !== id),
    })
  }

  initHeaders = (data) => {
    if (!_.isArray(data)) return [];
    const result = data.map(i => { return { ...i, id: i.id ? i.id : uuidv4() } });
    this.defaultData = [...result];  // 同步到 defaultData
    return result;
  }

  renderFieldType = (t, r, i, field, options) => {
    // 从 defaultData 获取最新的值以保持 UI 同步
    const currentValue = (this.defaultData && this.defaultData[i]) ? this.defaultData[i][field] : t;
    const rowId = r.id; // 使用行 ID 作为 key 的一部分

    return (
      <>
        <Select
          key={`${rowId}-${field}-${currentValue}`}
          defaultValue={currentValue}
          allowClear
          size='small'
          options={options}
          style={{ width: 90 }}
          onChange={(v) => this.onDefaultValueChange(v, i, r, field)}
        />
        {currentValue === 'number' && this.renderNumberOption(r, i)}
      </>
    )
  }

  renderNumberOption = (r, i) => {
    // 从 defaultData 获取最新的值
    const currentRow = (this.defaultData && this.defaultData[i]) || r;
    const t = currentRow.numberConvertType;
    const findRenderItme = this.numberOptions.find(item => item.value === t);
    const rowId = r.id;

    return (
      <span style={{paddingLeft: 4}}>
        <Select
          key={`${rowId}-numberConvertType-${t}`}
          defaultValue={t}
          allowClear
          size='small'
          placeholder='展示方式'
          options={this.numberOptions}
          style={{ width: 100 }}
          onChange={(v) => this.onDefaultValueChange(v, i, r, 'numberConvertType')}
        />
        {(findRenderItme && findRenderItme.render) && findRenderItme.render(currentRow[t] || '', currentRow, i)}
      </span>
    )
  }

  renderFieldChildren = (type, r, i) => {
    const findOp = this.typeOptions.find(item => item.value === type);
    if (!findOp || !findOp.children) return null;
    // 使用 defaultData 获取最新值
    const currentRow = (this.defaultData && this.defaultData[i]) || r;
    return (
      <>
        {findOp.children.map(item => {
          const field = item.value;
          const t = currentRow[field] || '';
          return (
            <React.Fragment key={field}>
              <Checkbox
                checked={t === '1'}
                style={{ width: 'auto' }}
                onChange={e => {
                  // 直接更新 defaultData 并触发重渲染
                  if (this.defaultData && this.defaultData[i]) {
                    this.defaultData[i][field] = e.target.checked ? '1' : '0';
                    this.setState({ data: [...this.defaultData] });
                  }
                }}
              >
                {item.label}
              </Checkbox>
              {t === '1' && (
                <>
                  {item.renderToFixed && item.renderToFixed(currentRow.tofixed, currentRow, i)}
                  &nbsp;&nbsp;
                  {item.renderCalculate && item.renderCalculate(t, currentRow, i)}
                  &nbsp;&nbsp;
                </>
              )}
            </React.Fragment>
          )
        })}
      </>
    )
  }

  renderSelect = (t, r, i, field, options) => {
    return (
      <Select
        defaultValue={t}
        allowClear
        size='small'
        options={options}
        style={{ width: '90%' }}
        onChange={(v) => this.onDefaultValueChange(v, i, r, field)}
      />
    )
  }

  renderCheckbox = (t, r, i, field) => {
    return (
      <Checkbox
        defaultChecked={t === '1'}
        style={{ width: '90%' }}
        onChange={(e) => this.onDefaultValueChange(e.target.checked ? '1' : '0', i, r, field)}
      />
    )
  }

  // 非受控组件的数据变更处理（不触发 setState）
  onDefaultValueChange = (v, i, r, field) => {
    if (!this.defaultData || !this.defaultData[i]) return;

    this.defaultData[i] = { ...this.defaultData[i], [field]: v };

    // 处理 type 变化时的联动字段清理
    if (field === 'type' && v !== 'number') {
      this.defaultData[i].tofixed = '';
      this.defaultData[i].numberConvertType = '';
      this.defaultData[i].calculate_value = '';
    }

    // 处理 numberConvertType 联动
    if (field === 'numberConvertType') {
      if (v === 'tofixed') {
        this.defaultData[i].calculate_value = '';
        this.defaultData[i].tofixed = '3';
      } else if (v === 'calculate') {
        this.defaultData[i].calculate_value = '*1';
        this.defaultData[i].tofixed = '';
      } else {
        this.defaultData[i].calculate_value = '';
        this.defaultData[i].tofixed = '';
      }
    }

    // 需要立即更新 UI 的字段 - 只更新单行而非整个数组
    const immediateUpdateFields = ['type', 'numberConvertType'];
    if (immediateUpdateFields.includes(field)) {
      // 使用函数式更新，只修改变化的那一行
      this.setState({ data: this.defaultData });
    }
  }

  renderInput = (t, r, i, field, disabled, placeholder = '请输入') => {
    return (
      <Input
        size='small'
        placeholder={placeholder}
        disabled={disabled || false}
        defaultValue={t}
        style={field === 'tofixed' ? {width: 86} : null}
        onChange={(e) => this.onDefaultValueChange(e.target.value, i, r, field)}
      />
    );
  }

  handleModalVisible = (v) => {
    if (!v) {
      // 关闭弹窗时，将 defaultData 同步回 state.data
      this.setState({
        modalVisible: false,
        data: [...this.defaultData],
      });
    } else {
      this.setState({ modalVisible: v });
    }
  }

  getEmptyNameIndexes = (array) => {
    if (Array.isArray(array)) {
      // return array.reduce((indexes, item, index) => {
      //   if (!item.en_name || !item.ch_name) {
      //     indexes.push(index+1)
      //   }
      //   return indexes
      // }, [])
      return array.findIndex(item => !item.en_name || !item.ch_name)
    }
  }

  combineColumns = (data1, data2) => {
    const finalData = [];
    if (!_.isEmpty(data1) && !_.isEmpty(data2) && !_.isEqual(data1, data2)) {
      for(const item of data1) {
        let newObj = {...item};
        for(const core of data2) {
          if (core.en_name === item.en_name) {
            newObj = {...core, ...item};
          }
        }
        finalData.push(newObj);
      }
    }
    if (!_.isEmpty(finalData)) {
      return finalData;
    } else {
      return data1;
    }
  }

  onSubmit = () => {
    const { type, updateHeaders } = this.props
    // 使用 defaultData 获取最新的编辑数据
    const data = this.defaultData || this.state.data || [];
    // , propsVsatName, tdmaOPtions = []
    const lSourceData = JSON.parse(localStorage.getItem(this.props.type)) || {};
    const calcPrefixs = ['+', '-', '*', '/'];
    for (const item of data) {
      let isHasCalc = 0;
      if (item.type === 'number' && item.numberConvertType === 'calculate') {
        isHasCalc = 1;
        for (const prefix of calcPrefixs) {
          if (item.calculate_value && item.calculate_value.startsWith(prefix)) {
            isHasCalc = 2;
            break;
          }
        }
      }
      if (isHasCalc === 1) return message.warning(`${item.ch_name}运算值输入错误`);
    }
    const cansubmit = this.getEmptyNameIndexes(data)
    if (cansubmit && cansubmit >= 0) return message.error(`第${cansubmit + 1}有空的中文名或英文名`)

    const params = {
      net_id: 1,
      session_id: 1,
      Command: "set_column_type_params",
      params: {
        type,
        config: JSON.stringify(lSourceData),
      },
    }
    rqHome.dealColumnConfig(params, (res) => {
      const response = parseJson(res, {})
      if (response?.code === 0) {
        message.success("配置存储成功")
        if (type) {
          localStorage.removeItem(`pelican-${type}`);
        }
        if (updateHeaders) updateHeaders(data)
        this.handleModalVisible(false)
      } else {
        message.error(response?.message || "配置存储失败")
      }
    })
  }

  moveRow = (list) => {
    this.defaultData = [...list];  // 同步更新 defaultData
    this.setState({data: list})
  }

  onSelectRow = (rowKeys, rows) => {
    this.setState({ selectedRows: rows, selectedRowKeys: rowKeys })
  }

  add = () => {
    const { data = [] } = this.state;
    const newItem = { id: uuidv4() };
    this.defaultData = [...data, newItem];  // 同步更新 defaultData
    this.setState({ data: [...data, newItem] })
  }

  delete = () => {
    const { data, selectedRowKeys } = this.state;
    const newData = data.filter(i => !selectedRowKeys.includes(i.id));
    this.defaultData = [...newData];  // 同步更新 defaultData
    this.setState({ data: newData, selectedRowKeys: [], selectedRows: [] })
  }

  beforeUpload = (info) => {
    let isFileType = true;
    if (info.type !== 'application/json') {
      isFileType = false;
      message.warning('请上传json格式文件');
    }
    return isFileType;
  }

  handleUpload = (info) => {
    const { file } = info;
    if (info.file && info.file.response && info.file.response.code === 0) {
      if (file.status === 'done') {
        message.success('上传成功');
        const data = file?.response?.data || [];
        const sData = this.state.data || [];
        const newData = [...sData, ...data];
        this.defaultData = [...newData];  // 同步更新 defaultData
        this.setState({ data: newData })
      }
    }
  }

  getDownLoad = () => {
    const { data, vsatName } = this.state;
    if (!data || data.length === 0) return message.error('当前数据为空');
    if (data) {
      exportDownFileByWeb(JSON.stringify(data), 'application/json', `${vsatName || '默认'}_${new Date().getTime()}`)
    }
  }

  changeVsat = (value) => {
    const { data = [], vsatName } = this.state
    this.setState({ vsatName: value })
    const lVsatData = JSON.parse(localStorage.getItem(this.props.type))
    const defaultField = 'default_field'
    if (vsatName) {
      // 上一个体量 保存到本地（使用 defaultData 确保数据是最新的）
      const currentDataToSave = this.defaultData || data;
      if (vsatName === '默认') {
        lVsatData.default_field.data = currentDataToSave
      } else {
        const defaultObj = {
          [`${vsatName}`]: {
            data: currentDataToSave,
          },
        }
        Object.assign(lVsatData, defaultObj)
      }
      localStorage.setItem(this.props.type, JSON.stringify(lVsatData))
      // 读取当前体量得值并且设置到页面
      const currentData = lVsatData[`${value === '默认' ? defaultField : value}`]?.data || []
      // 初始化 defaultData
      this.defaultData = currentData.map(i => ({ ...i }));
      this.setState({ data: currentData })
    }
  }

  renderDialog = () => {
    const { data, modalVisible } = this.state;
    const { modalTitle, title, hideAdd, columnsType = 'header' } = this.props;
    const uploadProps = {
      name: 'file',
      accept: '.json,application/json',
      onChange: (info) => this.handleUpload(info),
      beforeUpload: (info) => this.beforeUpload(info),
      showUploadList: false,
      action: rqHome.getUploadJsonFileUrl(),
    };

    return (
      <AutoSizeDialog
        title={modalTitle || title || ''}
        visible={modalVisible}
        maxWidth='95vw'
        maxHeight={window.innerHeight - 220}
        // maxHeight='80vh'
        closable
        onOk={this.onSubmit}
        onCancel={() => this.handleModalVisible(false)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ marginBottom: 20 }}>
            {!hideAdd && <Button size='small' onClick={this.add}>添加</Button>}
            &nbsp;&nbsp;&nbsp;
            <Popconfirm title='确定删除当前选中？' onConfirm={this.delete}>
              <Button size='small'>删除</Button>
            </Popconfirm>
            &nbsp;&nbsp;&nbsp;
            <Upload {...uploadProps}>
              <Button size='small'>导入数据</Button>
            </Upload>
            &nbsp;&nbsp;&nbsp;
            <Button size='small' onClick={this.getDownLoad}>下载</Button>
          </div>
        </div>
        <DraggableTable
          data={data}
          columns={this.columns}
          rowKey='id'
          noPager
          tableKey={'custom_edit_table_header' + columnsType}
          onRowMove={this.moveRow}
          onSelectRow={this.onSelectRow}
          // height='calc(80vh - 44px)'
          height={window.innerHeight - 284}
        />
      </AutoSizeDialog>
    );
  }

  render () {
    const { modalVisible, title } = this.state;
    const { disabled, style, isHideBtn, size, btnClassName } = this.props;
    return (
      <span onClick={e => e.stopPropagation()}>
        {this.renderDialog()}
        {
          !isHideBtn && (
            <Button
              size={size || 'default'}
              style={style}
              type="primary"
              disabled={disabled}
              onClick={() => this.handleModalVisible(!modalVisible)}
              className={btnClassName}
            >{title || '编辑表头'}
            </Button>
          )
        }
      </span>
    )
  }
}

export default EditHeader;
