import React, { PureComponent } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import { Row, Col, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import AutoSizeDialog from 'components/Dialog';
import FromItemCreator from 'components/FromItemCreator';
import { parseJson } from 'utils/utils';
import { connect } from 'dva';
import { createSubmitHandler } from 'utils/form';

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


@Form.create()
@connect(({ witData, targetConfig, loading }) => ({
  witData,
  loading,
  targetConfig,
}))
export default class Targetattrdialog extends PureComponent {
  constructor(props) {
    super(props);
    const customFields = getattribute(props.values);
    this.state = {
      customFields,
    };
    this.fieldIds = customFields.length;
    this.Items = [
      {label: '名称', field_name: 'name', type: 'input', usedValue: 'name'},
      {label: '英文名称', field_name: 'ename', type: 'input', usedValue: 'ename'},
      {label: '经度', field_name: 'lng', type: 'input', usedValue: 'lng', props: {disabled: true}},
      {label: '纬度', field_name: 'lat', type: 'input', usedValue: 'lat', props: {disabled: true}},
    ]
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
  
  onOk = (err, fields) => {
    if(err) return;
    // const { id, name, notes, type, ...nodeProps } = fields.f;
    const f = fields.f;
    const custom = {};
    const otherProps = {};
    for(const i in f) {
      if(i.startsWith('attribute')) {
        const num = i.split('attribute')[1]
        custom[i] = f[i];
        custom[`value${num}`] = f[`value${num}`];
      } else if(!i.startsWith('value')) {
        otherProps[i] = f[i]
      };
    }
    if(this.props.createMarker) {
      this.props.handleModalVisible(false)
      this.props.createMarker({...otherProps, custom, target_id: window.target_id})
      window.target_id += 1;
    }
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

  render() {
    const { customFields } = this.state;
    const { form, modaleVisible, handleModalVisible, values = {}, isEdit } = this.props;
    if (!this.submitHandler) {
      this.submitHandler = createSubmitHandler({
        form,
        onSubmit: this.onOk.bind(this),
      })
    }
    let customValue = values.custom || {};
    if(_.isString(values.custom)) {
      customValue = parseJson(values.custom, {})
    }
    return (
      <AutoSizeDialog
        title={isEdit ? '编辑目标' : '创建目标'}
        visible={modaleVisible}
        height={800}
        width={600}
        maxHeight={800}
        bodyStyle={{width: 600, height: 700}}
        onOk={this.submitHandler}
        onCancel={() => handleModalVisible(false)}
      >
        <Form style={{height: 640, overflow: 'auto'}}>
          <Row type='flex' justify='space-between'>
            {
              this.Items.map(item => {
                return (
                  <Col key={item.field_name} span={12}>
                    <FromItemCreator item={{...item, value: values[item.usedValue], style: {width: 265}}} form={form} />
                  </Col>
                )
              })
            }
            
          </Row>
          {
            customFields && customFields.map(item => {
              return (
                <Row type='flex' justify='space-between' key={item}>
                  <Col span={12}>
                    <FromItemCreator item={{field_name: `attribute${item}`, type: 'input', label: `自定义属性${item}`, value: customValue[`attribute${item}`], style: {width: 265}}} form={form} />
                  </Col>
                  <Col span={12}>
                    <FromItemCreator item={{field_name: `value${item}`, type: 'input', label: `自定义值${item}`, value: customValue[`value${item}`], style: {width: 265}}} form={form} />
                  </Col>
                </Row>
              )
            })
          }
          <div span={24} style={{textAlign:'center'}}>
            <Button type='dashed' style={{width: '80%', margin:'auto'}} onClick={this.addField}>
              <PlusOutlined /> 自定义属性
            </Button>
          </div>
        </Form>
      </AutoSizeDialog>
    );
  }
}