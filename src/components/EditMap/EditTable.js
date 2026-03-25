import React, { PureComponent } from 'react';
import { Table, Input } from 'antd';  
import _ from 'lodash';
import moment from 'moment';
import AutoSizeDialog from 'components/Dialog';
import { parseJson } from 'utils/utils';

function getattribute(value) {
  if(!value) return [];
  let custom = value.custom;
  if(_.isString(value.custom)) {
    custom = parseJson(value.custom, {})
  }
  const list = _.keys(custom);
  const newList = [];
  list.forEach(item => {
    if(_.startsWith(item, 'attribute')) {
      newList.push(item.split('attribute')[1])
    }
  });
  return newList;
}

if(!window.target_id) {
  window.target_id = moment().format('X') * 1;
}

const TextArea = Input.TextArea;


export default class Targetattrdialog extends PureComponent {
  constructor(props) {
    super(props);
    const customFields = getattribute(props.values);
    this.state = {
      customFields,
    };
    this.columns = [
      {title: '源节点', key: 'source', dataIndex: 'source', width: 100},
      {title: '目的节点', key: 'target', dataIndex: 'target', width: 100},
      {title: '源节点坐标', key: 'source_location', dataIndex: 'source_location', width: 100},
      {title: '目的节点坐标', key: 'target_location', dataIndex: 'target_location', width: 100},
      {title: '时间', key: 'time', dataIndex: 'time', width: 100},
      {title: '方向', key: 'direction', dataIndex: 'direction', width: 100},
      {title: '连接线颜色', key: 'line_color', dataIndex: 'line_color', width: 100},
      {title: '备注', key: 'tag', dataIndex: 'tag', width: 100},
    ]
    this.fieldIds = customFields.length;
    this.Items = [
      {label: '名称', field_name: 'name', type: 'input', usedValue: 'name'},
      {label: '英文名称', field_name: 'ename', type: 'input', usedValue: 'ename'},
      {label: '经度', field_name: 'lng', type: 'input', usedValue: 'lng'},
      {label: '纬度', field_name: 'lat', type: 'input', usedValue: 'lat'},
    ]
    this.customId = moment().format('X');
  }
  
  usedGetRelationData = (fields, props) => {
    const { getRelationData, updateRelationData, values } = props;
    const relationData = getRelationData() || {};
    const { id, name, notes, type, ...nodeProps } = fields.f;
    const custom = {};
    const otherProps = {};
    let sourceTarget = {};
    for(const i in nodeProps) {
      if(i.startsWith('attribute')) {
        const num = i.split('attribute')[1]
        custom[i] = nodeProps[i];
        custom[`value${num}`] = nodeProps[`value${num}`];
      } else if(!i.startsWith('value')) {
        otherProps[i] = nodeProps[i]
      };
    }

    (relationData.nodes || []).forEach(item => {
      if(item.id === values.id) {
        item.label = name;
        item.notes = notes;
        item.custom = custom;
        item.targetType = type;
        for(const i in otherProps) {
          item[i] = otherProps[i];
        }
        sourceTarget = item;
      }
    })
    if(updateRelationData) updateRelationData(relationData, {SerialNumber: sourceTarget.SerialNumber, source_target: sourceTarget})
  }
  
  onOk = () => {
    const { createRelation, handleModalVisible } = this.props;
    const { nodes, dataSource } = this.state;
    if(!nodes || _.keys(nodes).length === 0) return false;
    if(createRelation) createRelation(dataSource, nodes)
    if(handleModalVisible) handleModalVisible(false)
  };

  addField = () => {
    this.fieldIds += 1;
    const { customFields } = this.state;
    const customs = _.cloneDeep(customFields);
    customs.push(this.fieldIds)
    this.setState({
      customFields: customs,
    })
  }

  // getPosition = (t) => {
  //   // const arr = t.split(',')
  // }

  textchange = (e) => {
    const value = e.target.value;
    if(!value) return false;
    const arr = value.split(/[\n]/)
    const brr = []
    const nodes = {};
    if(arr.length > 1) {
      arr.forEach(item => {
        if(item !== '') {
          const list = item.split(/[\s]/);
          const sourceNode = {name:  list[0], lng: _.random(750000, 1190000) / 10000, lat: _.random(210000, 530000) / 10000, marker_type: 'relation'};
          const targetNode = {name:  list[1], lng: _.random(750000, 1190000) / 10000, lat: _.random(210000, 530000) / 10000, marker_type: 'relation'};
          if(!nodes[list[0]]) {
            nodes[list[0]] = {...sourceNode, id: window.target_id}
            window.target_id += 1;
          }
          if(!nodes[list[1]]) {
            nodes[list[1]] = {...targetNode, id: window.target_id}
            window.target_id += 1;
          }
          brr.push({
            source: list[0],
            target: list[1],
            source_location: list[2],
            target_location: list[3],
            direction: list[4],
            line_color: list[5],
            time: list[6],
            tag: `${list[7]} ${list[8]}`,
          })
        }
      })
    }
    this.setState({dataSource: brr, nodes})
  }

  render() {
    const { dataSource } = this.state;
    const { modaleVisible, handleModalVisible } = this.props;
    return (
      <AutoSizeDialog
        title='创建通联关系'
        visible={modaleVisible}
        maxWidth={1200}
        maxHeight={800}
        onOk={this.onOk}
        onCancel={() => handleModalVisible(false)}
      >
        <div>
          <TextArea onChange={this.textchange} />
        </div>
        <Table columns={this.columns} dataSource={dataSource || []} />          
      </AutoSizeDialog>
    );
  }
}