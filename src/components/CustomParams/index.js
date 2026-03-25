import React, { Component } from "react";
import _ from 'lodash';
import { connect } from 'dva';
import AceEdit from 'common/AceEditor';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Radio, Table, Button, Input } from 'antd';

@connect(({ main }) => ({
  selectedTheme: main.selectedTheme,
}))
export default class CustomParams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioType: props.paramsType || 'form',
      listData: this.getListData(props.paramsData || []),
      jsonView: !_.isEmpty(props.paramsJsonData) ? props.paramsJsonData : {},
    }
    this.isJsonView = true;
    this.addKey = _.isArray(props.paramsData) ? props.paramsData.length : 0;
    const columnsWidth = props.columnsWidth || {};
    this.tableColumns = [
      {title: props.attributeTitle || '自定义属性', key: 'attribute', dataIndex: 'attribute', width: columnsWidth.attribute || 100, render: (t, r) => {
        return (
          <Input
            value={t}
            size={props.size || 'default'}
            onChange={(e) => this.changeParamsValue(e.target.value, r.id, 'attribute')}
          />
        )
      }},
      {title: '自定义值', key: 'value', dataIndex: 'value', width: columnsWidth.value || 80, render: (t, r) => {
        return (
          <Input
            value={t}
            size={props.size || 'default'}
            onChange={(e) => this.changeParamsValue(e.target.value, r.id, 'value')}
          />
        )
      }},
      {title: '操作', key: 'operation', dataIndex: 'operation', width: columnsWidth.operation || 50, render: (t, r) => {
        return (
          <Button
            size={props.size || 'default'}
            icon={<DeleteOutlined />}
            style={{ border: 'none' }}
            onClick={() => this.deleteParams(r.id)}
          />
        );
      }},
    ];
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }

  getListData = (paramsData) => {
    const newData = paramsData.filter(item => item.attribute && item.value);
    return newData || [];
  }

  changeParamsValue = (v, id, value) => {
    const { listData } = this.state;
    const newList = _.cloneDeep(listData);
    for(const item of newList) {
      if (item.id === id) {
        item[value] = v;
      }
    }
    this.setState({
      listData: newList,
    })
  }

  deleteParams = (id) => {
    const { listData } = this.state;
    const newList = listData.filter(item => item.id !== id);
    this.addKey = _.isArray(newList) ? newList.length : 0;
    this.setState({
      listData: newList,
    })
  }

  setRadioType = (value) => {
    this.setState({
      radioType: value,
    })
  }

  addListData = () => {
    const { listData } = this.state;
    listData.push({attribute: '', value: '', id: this.addKey += 1})
    this.setState({
      listData: [...listData],
    })
  }

  isJson = (str) => {
    if (typeof str === 'string') {
      try {
        const obj = JSON.parse(str) || {};
        if (typeof obj === 'object' && obj) {
          this.isJsonView = true;
          return true;
        } else {
          this.isJsonView = false;
          return false;
        }
      } catch {
        this.isJsonView = false;
        return false;
      }
    }
    this.isJsonView = false;
    return false;
  }

  onEditChange = (v) => {
    const newList = [];
    if (this.isJson(v)) {
      const obj = JSON.parse(v);
      for (const i in obj) {
        newList.push({attribute: i, value: obj[i], id: this.addKey += 1})
      }
      this.setState({
        jsonView: obj,
      })
    }
  }

  render() {
    const { size, limitDataLength, scrollY, viewWidth, viewHeight } = this.props;
    const { radioType, listData, jsonView } = this.state;
    const disabled = limitDataLength ? listData.length >= limitDataLength : false;
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
          <Radio.Group
            size={size || 'default'}
            value={radioType}
            onChange={(e) => this.setRadioType(e.target.value)}
          >
            <Radio.Button value='form'>Form表单</Radio.Button>
            <Radio.Button value='json'>JSON</Radio.Button>
          </Radio.Group>
          {radioType === 'form' && (
            <Button type='dashed' size={size || 'default'} style={{ marginLeft: 8 }} disabled={disabled} onClick={this.addListData}>
              <PlusOutlined /> 添加
            </Button>
          )}
        </div>
        {radioType === 'form' && (
          <Table
            rouKey="id"
            scroll={{y : scrollY || 300 }}
            pagination={false}
            style={{ width: viewWidth || 300 }}
            dataSource={listData || []}
            columns={this.tableColumns}
          />
        )}
        {radioType === 'json' && (
          <div style={{ width: viewWidth || 300 }}>
            <AceEdit
              name="UNIQUE_ID_OD_DIV"
              mode="json"
              theme={this.props.selectedTheme === 'highlight' ? "xcode" : 'monokai'}
              value={JSON.stringify(jsonView, null, '\t')}
              style={{height: viewHeight || 120, width: viewWidth || 300 }}
              parent={this}
              onChange={this.onEditChange}
            />
          </div>
        )}
      </div>
    );
  }
}
