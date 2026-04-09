import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { EditOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Row, Col, Table, DatePicker, Checkbox, Button } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import AutoSizeDialog from 'components/Dialog';
import FromItemCreator from 'components/FromItemCreator';
import { connect } from 'dva';
import { createSubmitHandler } from 'utils/form';

if (!window.polyline_id) {
  window.polyline_id = dayjs().format('X') * 1;
}

const Targetattrdialog = forwardRef((props, ref) => {
  const { modaleVisible, handleModalVisible, values = {}, isEdit, updateDrawPolyline, witData, loading, targetConfig } = props;

  const [form] = Form.useForm();
  const [timeStatus, setTimeStatus] = useState({});
  const [selectedItem, setSelectedItem] = useState({});
  const [dataSource] = useState([{ time: '2020-01-21 10:35:46', lng: '114.356', lat: '28.144', id: 36454 }]);
  const [customFields, setCustomFields] = useState([]);
  const fieldIdsRef = useRef(0);

  const markerItems = [
    { label: '名称', field_name: 'marker_name', type: 'input', usedValue: 'marker_name' },
    { label: '英文名称', field_name: 'ename', type: 'input', usedValue: 'ename' },
    { label: '经度', field_name: 'lng', type: 'input', usedValue: 'lng', props: { disabled: true } },
    { label: '纬度', field_name: 'lat', type: 'input', usedValue: 'lat', props: { disabled: true } },
  ];

  const Items = [
    { label: '名称', field_name: 'name', type: 'input', usedValue: 'name' },
    { label: '颜色', field_name: 'color', type: 'input', usedValue: 'color' },
    { label: '备注', field_name: 'tags', type: 'textarea', usedValue: 'tags', span: 24 },
  ];

  const updateTimeStatus = (r, value) => {
    const id = r.id;
    setTimeStatus((prev) => {
      const o = { ...prev };
      if (value) {
        o[id] = true;
      } else {
        delete o[id];
      }
      return o;
    });
    setSelectedItem(value ? r : {});
  };

  const timeRender = (t, r) => {
    const id = r.id;
    const edit = timeStatus[id];
    if (edit) {
      return (
        <span>
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime size="small" value={dayjs(selectedItem.time)} onChange={pickerChange} />
          &nbsp;&nbsp;&nbsp;
          <SaveOutlined onClick={() => updateTimeStatus(r, false)} />
        </span>
      );
    }
    return (
      <span>
        <span>{t}</span>&nbsp;&nbsp;&nbsp;
        <EditOutlined onClick={() => updateTimeStatus(r, true)} />
      </span>
    );
  };

  const pickerChange = (time) => {
    setSelectedItem((prev) => ({
      ...prev,
      time: dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    }));
  };

  const columns = [
    { title: '时间', key: 'time', dataIndex: 'time', render: timeRender, width: 200 },
    { title: '经度', key: 'lng', dataIndex: 'lng', width: 100 },
    { title: '纬度', key: 'lat', dataIndex: 'lat', width: 100 },
  ];

  const onOk = (err, fields) => {
    if (err) return;
    if (updateDrawPolyline) {
      updateDrawPolyline(fields.f);
      handleModalVisible(false);
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
        onOk(null, { f: formValues });
      })
      .catch((errInfo) => {
        onOk(errInfo, null);
      });
  };

  return (
    <AutoSizeDialog
      title={isEdit ? '编辑目标' : '创建目标'}
      visible={modaleVisible}
      height={800}
      width={1200}
      maxHeight={800}
      bodyStyle={{ width: 1200, height: 700 }}
      onOk={handleSubmit}
      onCancel={() => handleModalVisible(false)}
    >
      <span>
        <Checkbox>作为辅助线</Checkbox>
        <Checkbox>作为目标轨迹</Checkbox>
      </span>
      <Row>
        <Col span={12}>
          <Form form={form} style={{ height: 640, overflow: 'auto' }}>
            <Row type="flex" justify="space-between">
              {Items.map((item) => {
                return (
                  <Col key={item.field_name} span={item.span || 12}>
                    <FromItemCreator
                      item={{
                        ...item,
                        value: values[item.usedValue],
                        style: { width: item.field_name === 'tags' ? 558 : 265 },
                      }}
                    />
                  </Col>
                );
              })}
            </Row>
          </Form>
        </Col>
        <Col span={12}>
          <Table columns={columns} dataSource={dataSource} />
        </Col>
      </Row>
    </AutoSizeDialog>
  );
});

Targetattrdialog.displayName = 'Targetattrdialog';

export default connect(({ witData, targetConfig, loading }) => ({
  witData,
  loading,
  targetConfig,
}))(Targetattrdialog);
