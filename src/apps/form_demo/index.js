import React, { Fragment, PureComponent, createRef } from 'react';
import { Card, Button, message, Modal, Popconfirm } from 'antd';
import AgTable from 'components/agTable';
import FormSubmit from 'components/FormSubmit';
import EditHeader from 'common/EditHeader';
import { initFormItems } from 'common/utils';

export default class FormDemo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      modalVisible: false,
      editRecord: null,
      nextId: 1,
      // 自定义表单配置（来自 EditHeader）
      customFormConfig: [],
    };
    this.formRef = createRef();
    this.editHeaderRef = createRef();
  }

  // 获取当前表单项和联动配置（优先使用自定义配置，否则使用默认配置）
  getCurrentFormConfig = () => {
    const { customFormConfig } = this.state;
    if (customFormConfig && customFormConfig.length > 0) {
      // 使用 EditHeader 配置的数据，通过 initFormItems 转换
      const result = initFormItems(customFormConfig);
      console.log(result, 'result')
      return {
        formItems: result.items,
        linkageConfig: result.linkageConfig,
      };
    }
    // 没有自定义配置时返回空（EditHeader 还没加载数据）
    return {
      formItems: [],
      linkageConfig: { visibleWhen: {}, optionsLinkage: {} },
    };
  };

  // EditHeader 配置更新回调
  handleCustomFormUpdate = (config) => {
    this.setState({ customFormConfig: config });
  };

  // 表格列配置
  getColumns = () => {
    const baseColumns = [
      { title: 'ID', dataIndex: 'id', width: 60 },
      { title: '设备名称', dataIndex: 'name', width: 120 },
      { title: '设备类型', dataIndex: 'type', width: 100, render: (v) => {
        const map = { server: '服务器', network: '网络设备', terminal: '终端' };
        return map[v] || v;
      }},
      { title: 'IP 地址', dataIndex: 'ip', width: 140 },
      { title: '端口', dataIndex: 'port', width: 80 },
      { title: '省份', dataIndex: 'province', width: 80 },
      { title: '城市', dataIndex: 'city', width: 80 },
      { title: '区县', dataIndex: 'district', width: 80 },
      { title: '状态', dataIndex: 'status', width: 80, render: (v) => {
        const map = { online: '在线', offline: '离线', maintain: '维护中' };
        return map[v] || v;
      }},
      { title: '标识颜色', dataIndex: 'color', width: 80, render: (v) => (
        v ? <span><span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: v, marginRight: 6, verticalAlign: 'middle' }} />{v}</span> : '-'
      )},
      { title: '启用', dataIndex: 'enabled', width: 60, render: (v) => v ? '是' : '否' },
      { title: '备注', dataIndex: 'desc', width: 150, ellipsis: true },
      {
        title: '操作', dataIndex: 'oper', width: 120, fixed: 'right', is_disabled: true,
        render: (_, record) => (
          <span>
            <a onClick={() => this.handleEdit(record)}>编辑</a>
            &nbsp;|&nbsp;
            <Popconfirm title="确定删除？" onConfirm={() => this.handleDelete(record.id)}>
              <a style={{ color: '#ff4d4f' }}>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return baseColumns;
  };

  // 新增
  handleAdd = () => {
    this.setState({ modalVisible: true, editRecord: null });
  };

  // 编辑
  handleEdit = (record) => {
    this.setState({ modalVisible: true, editRecord: record });
  };

  // 删除
  handleDelete = (id) => {
    this.setState(prevState => ({
      dataSource: prevState.dataSource.filter(item => item.id !== id),
    }), () => {
      message.success('删除成功');
    });
  };

  // 表单提交
  handleFormSubmit = (values) => {
    const { editRecord } = this.state;

    if (editRecord) {
      // 编辑模式：替换对应记录
      this.setState(prevState => ({
        dataSource: prevState.dataSource.map(item =>
          item.id === editRecord.id ? { ...item, ...values } : item
        ),
        modalVisible: false,
        editRecord: null,
      }), () => {
        message.success('编辑成功');
      });
    } else {
      // 新增模式：添加新记录
      this.setState(prevState => ({
        dataSource: [...prevState.dataSource, { id: prevState.nextId, ...values }],
        nextId: prevState.nextId + 1,
        modalVisible: false,
      }), () => {
        message.success('新增成功');
      });
    }
  };

  render() {
    const { dataSource, modalVisible, editRecord, customFormConfig } = this.state;
    const { formItems, linkageConfig } = this.getCurrentFormConfig();

    return (
      <Fragment>
        <Card
          title="FormSubmit 组件演示"
          extra={
            <span>
              <EditHeader
                ref={this.editHeaderRef}
                title="配置表单字段"
                type="form_demo_config"
                columnsType="formItem"
                updateHeaders={this.handleCustomFormUpdate}
              />
              &nbsp;
              <Button type="primary" onClick={this.handleAdd}>
                新增设备
              </Button>
            </span>
          }
        >
          <AgTable
            height={500}
            tableKey="form_demo"
            columns={this.getColumns()}
            data={dataSource}
            pagination
            pageSize={20}
          />
        </Card>

        <Modal
          title={editRecord ? '编辑设备' : '新增设备'}
          open={modalVisible}
          onCancel={() => this.setState({ modalVisible: false, editRecord: null })}
          footer={null}
          width={760}
          destroyOnClose
        >
          {customFormConfig.length > 0 ? (
            <FormSubmit
              ref={this.formRef}
              items={formItems}
              formItemLayout={{ label: 6, wrapper: 18 }}
              linkageConfig={linkageConfig}
              onSubmit={this.handleFormSubmit}
              onReset={() => {}}
              values={editRecord || {}}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              请先配置表单字段
            </div>
          )}
        </Modal>
      </Fragment>
    );
  }
}
