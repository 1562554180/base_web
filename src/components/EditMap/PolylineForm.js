import React, { PureComponent } from 'react';
import { EditOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import { Row, Col, Table, DatePicker, Checkbox } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import AutoSizeDialog from 'components/Dialog';
import FromItemCreator from 'components/FromItemCreator';
import { connect } from 'dva';
import { createSubmitHandler } from 'utils/form';

// const RangePicker = DatePicker.RangePicker;

if(!window.polyline_id) {
  window.polyline_id = moment().format('X') * 1;
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
    this.state = {
      timeStatus: {},
      selectedItem: {},
      dataSource: [{time: '2020-01-21 10:35:46', lng: '114.356', lat: '28.144', id: 36454}],
    };
    this.markerItems = [
      {label: '名称', field_name: 'marker_name', type: 'input', usedValue: 'marker_name'},
      {label: '英文名称', field_name: 'ename', type: 'input', usedValue: 'ename'},
      {label: '经度', field_name: 'lng', type: 'input', usedValue: 'lng', props: {disabled: true}},
      {label: '纬度', field_name: 'lat', type: 'input', usedValue: 'lat', props: {disabled: true}},
    ]
    this.Items = [
      {label: '名称', field_name: 'name', type: 'input', usedValue: 'name'},
      {label: '颜色', field_name: 'color', type: 'input', usedValue: 'color'},
      {label: '备注', field_name: 'tags', type: 'textarea', usedValue: 'tags', span: 24},
    ]
    this.columns = [
      {title: '时间', key: 'time', dataIndex: 'time', render: this.timeRender, width: 200},
      {title: '经度', key: 'lng', dataIndex: 'lng', width: 100},
      {title: '纬度', key: 'lat', dataIndex: 'lat', width: 100},
    ]
  }

  updateTimeStatus = (r, value) => {
    const id = r.id;
    const { timeStatus } = this.state;
    const o = {...timeStatus};
    if(value) {
      o[id] = true;
    } else {
      delete o[id];
    }
    this.setState({
      timeStatus: o,
      selectedItem: value ? r : {},
    })
  }

  timeRender = (t, r) => {
    const timeStatus = this.state.timeStatus;
    const selectedItem = this.state.selectedItem;
    const id = r.id;
    const edit = timeStatus[id];
    if(edit) {
      return (
        <span>
          <DatePicker format='YYYY-MM-DD HH:mm:ss' showTime size='small' value={moment(selectedItem.time)} onChange={this.pickerChange} />&nbsp;&nbsp;&nbsp;
          <SaveOutlined onClick={() => this.updateTimeStatus(r, false)} />
        </span>
      );
    }
    return (
      <span>
        <span>{t}</span>&nbsp;&nbsp;&nbsp;
        <EditOutlined onClick={() => this.updateTimeStatus(r, true)} />
      </span>
    );
  }

  pickerChange = (time) => {
    const { selectedItem } = this.state;
    const o = {...selectedItem};
    o.time = moment(time).format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      selectedItem: o,
    })
  }

  onOk = (err, fields) => {
    if(err) return;
    const { handleModalVisible, updateDrawPolyline } = this.props;
    if(updateDrawPolyline) {
      updateDrawPolyline(fields.f)
      handleModalVisible(false)
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

  createMarkerPath = () => {
    // return (
    //   <Form style={{height: 640, overflow: 'auto'}}>
    //     <Row type='flex' justify='space-between'>
    //       {
    //         this.markerItems.map(item => {
    //           return (
    //             <Col key={item.field_name} span={12}>
    //               <FromItemCreator item={{...item, value: values[item.usedValue], style: {width: 265}}} form={form} />
    //             </Col>
    //           )
    //         })
    //       }

    //     </Row>
    //     {
    //       customFields && customFields.map(item => {
    //         return (
    //           <Row type='flex' justify='space-between' key={item}>
    //             <Col span={12}>
    //               <FromItemCreator item={{field_name: `attribute${item}`, type: 'input', label: `自定义属性${item}`, value: customValue[`attribute${item}`], style: {width: 265}}} form={form} />
    //             </Col>
    //             <Col span={12}>
    //               <FromItemCreator item={{field_name: `value${item}`, type: 'input', label: `自定义值${item}`, value: customValue[`value${item}`], style: {width: 265}}} form={form} />
    //             </Col>
    //           </Row>
    //         )
    //       })
    //     }
    //     <div span={24} style={{textAlign:'center'}}>
    //       <Button type='dashed' style={{width: '80%', margin:'auto'}} onClick={this.addField}>
    //         <PlusOutlined /> 自定义属性
    //       </Button>
    //     </div>
    //   </Form>
    // )
  }

  createLineTable = () => {
    return <Table columns={this.columns} dataSource={this.state.dataSource} />
  }

  render() {
    const { form, modaleVisible, handleModalVisible, values = {}, isEdit } = this.props;
    if (!this.submitHandler) {
      this.submitHandler = createSubmitHandler({
        form,
        onSubmit: this.onOk.bind(this),
      })
    }

    return (
      <AutoSizeDialog
        title={isEdit ? '编辑目标' : '创建目标'}
        visible={modaleVisible}
        height={800}
        width={1200}
        maxHeight={800}
        bodyStyle={{width: 1200, height: 700}}
        onOk={this.submitHandler}
        onCancel={() => handleModalVisible(false)}
      >
        <span>
          <Checkbox>作为辅助线</Checkbox>
          <Checkbox>作为目标轨迹</Checkbox>
        </span>
        <Row>
          <Col span={12}>
            <Form style={{height: 640, overflow: 'auto'}}>
              <Row type='flex' justify='space-between'>
                {
                  this.Items.map(item => {
                    return (
                      <Col key={item.field_name} span={item.span || 12}>
                        <FromItemCreator item={{...item, value: values[item.usedValue], style: {width: item.field_name === 'tags' ? 558 : 265}}} form={form} />
                      </Col>
                    )
                  })
                }
              </Row>
            </Form>
          </Col>
          <Col span={12}>
            {this.createLineTable()}
          </Col>
        </Row>

      </AutoSizeDialog>
    );
  }
}
