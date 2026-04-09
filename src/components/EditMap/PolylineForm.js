import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Row, Col, Button } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import AutoSizeDialog from 'components/Dialog';
import FromItemCreator from 'components/FromItemCreator';
import { parseJson } from 'utils/utils';
import { connect } from 'dva';

function getattribute(value) {
  if (!value) return [];
  let custom = value.custom;
  if (_.isString(value.custom)) {
    custom = parseJson(value.custom, {});
  }
  const list = _.keys(custom);
  const newList = [];
  list.forEach((item) => {
    if (_.startsWith(item, 'attribute')) {
      newList.push(item.split('attribute')[1]);
    }
  });
  return newList;
}

if (!window.target_id) {
  window.target_id = dayjs().format('X') * 1;
}

const Targetattrdialog = forwardRef((props, ref) => {
  const {
    modaleVisible,
    handleModalVisible,
    values = {},
    isEdit,
    createMarker,
    getRelationData,
    updateRelationData,
    witData,
    loading,
    targetConfig,
  } = props;

  const [form] = Form.useForm();
  const customFieldsFromProps = getattribute(values);
  const [customFields, setCustomFields] = useState(customFieldsFromProps);
  const fieldIdsRef = useRef(customFieldsFromProps.length);

  const Items = [
    { label: '名称', field_name: 'name', type: 'input', usedValue: 'name' },
    { label: '英文名称', field_name: 'ename', type: 'input', usedValue: 'ename' },
    { label: '经度', field_name: 'lng', type: 'input', usedValue: 'lng', props: { disabled: true } },
    { label: '纬度', field_name: 'lat', type: 'input', usedValue: 'lat', props: { disabled: true } },
  ];

  const usedGetRelationData = (fields) => {
    const relationData = getRelationData() || {};
    const { id, name, notes, type, ...nodeProps } = fields;
    const custom = {};
    const otherProps = {};
    let sourceTarget = {};
    for (const i in nodeProps) {
      if (i.startsWith('attribute')) {
        const num = i.split('attribute')[1];
        custom[i] = nodeProps[i];
        custom[`value${num}`] = nodeProps[`value${num}`];
      } else if (!i.startsWith('value')) {
        otherProps[i] = nodeProps[i];
      }
    }

    (relationData.nodes || []).forEach((item) => {
      if (item.id === values.id) {
        item.label = name;
        item.notes = notes;
        item.custom = custom;
        item.targetType = type;
        for (const i in otherProps) {
          item[i] = otherProps[i];
        }
        sourceTarget = item;
      }
    });
    if (updateRelationData)
      updateRelationData(relationData, { SerialNumber: sourceTarget.SerialNumber, source_target: sourceTarget });
  };

  const onOk = (err, fields) => {
    if (err) return;
    const f = fields;
    const custom = {};
    const otherProps = {};
    for (const i in f) {
      if (i.startsWith('attribute')) {
        const num = i.split('attribute')[1];
        custom[i] = f[i];
        custom[`value${num}`] = f[`value${num}`];
      } else if (!i.startsWith('value')) {
        otherProps[i] = f[i];
      }
    }
    if (createMarker) {
      handleModalVisible(false);
      createMarker({ ...otherProps, custom, target_id: window.target_id });
      window.target_id += 1;
    }
  };

  const addField = () => {
    fieldIdsRef.current += 1;
    setCustomFields((prev) => [...prev, fieldIdsRef.current]);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((formValues) => {
        onOk(null, formValues);
      })
      .catch((errInfo) => {
        onOk(errInfo, null);
      });
  };

  let customValue = values.custom || {};
  if (_.isString(values.custom)) {
    customValue = parseJson(values.custom, {});
  }

  return (
    <AutoSizeDialog
      title={isEdit ? '编辑目标' : '创建目标'}
      visible={modaleVisible}
      height={800}
      width={600}
      maxHeight={800}
      bodyStyle={{ width: 600, height: 700 }}
      onOk={handleSubmit}
      onCancel={() => handleModalVisible(false)}
    >
      <Form form={form} style={{ height: 640, overflow: 'auto' }}>
        <Row type="flex" justify="space-between">
          {Items.map((item) => {
            return (
              <Col key={item.field_name} span={12}>
                <FromItemCreator
                  item={{
                    ...item,
                    value: values[item.usedValue],
                    style: { width: 265 },
                  }}
                />
              </Col>
            );
          })}
        </Row>
        {customFields &&
          customFields.map((item) => {
            return (
              <Row type="flex" justify="space-between" key={item}>
                <Col span={12}>
                  <FromItemCreator
                    item={{
                      field_name: `attribute${item}`,
                      type: 'input',
                      label: `自定义属性${item}`,
                      value: customValue[`attribute${item}`],
                      style: { width: 265 },
                    }}
                  />
                </Col>
                <Col span={12}>
                  <FromItemCreator
                    item={{
                      field_name: `value${item}`,
                      type: 'input',
                      label: `自定义值${item}`,
                      value: customValue[`value${item}`],
                      style: { width: 265 },
                    }}
                  />
                </Col>
              </Row>
            );
          })}
        <div span={24} style={{ textAlign: 'center' }}>
          <Button type="dashed" style={{ width: '80%', margin: 'auto' }} onClick={addField}>
            <PlusOutlined /> 自定义属性
          </Button>
        </div>
      </Form>
    </AutoSizeDialog>
  );
});

Targetattrdialog.displayName = 'Targetattrdialog';

export default connect(({ witData, targetConfig, loading }) => ({
  witData,
  loading,
  targetConfig,
}))(Targetattrdialog);
