import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, message } from 'antd';
import EditHeader from 'common/EditHeader';
import { initColumns } from 'common/utils';
import AgTable from 'components/agTable';
import * as rqHome from 'requests/home';
import { Form } from '@ant-design/compatible';

@Form.create()
@connect(({ main }) => ({
  masterIp: main.masterIp,
  globalNodeType: main.globalNodeType || 'normal',
}))
export default class HomeIndex extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      refreshFlag: false,
      selectedRowKeys: [],
    }
    this.columns = [{title: '姓名', dataIndex: 'name'}, {title: '年龄', dataIndex: 'age'}, {title: '性别', dataIndex: 'xb'}]
    this.subData = [];
    for (let i = 0; i < 200; i++) {
      this.subData.push({id: i, name: `姓名${i}`, age: `年龄${i}`, xb: `性别${i}`})
    }
  }

  componentDidMount() {
    // this.updateHeaders([]);
  }

  updateHeaders = (list) => {
    const columns = initColumns(list);
    console.log(list, 12333)
    // 添加操作列
    // const operColumn = columns.find(c => c.dataIndex === 'oper');
    // if (operColumn) {
    //   operColumn.render = (text, record) => (
    //     <span>
    //       <a onClick={() => this.handleEdit(record)}>编辑</a>
    //       &nbsp;|&nbsp;
    //       <a onClick={() => this.handleDelete(record.id)} style={{ color: '#ff4d4f' }}>删除</a>
    //     </span>
    //   );
    //   operColumn.is_disabled = true;
    //   operColumn.fixed = 'right';
    //   operColumn.width = 120;
    // }
    const item = {title: '操作', dataIndex: 'oper', fixed: 'right', width: 120, is_disabled: true, render:  (text, record) => (
      <span>
        <a onClick={() => this.handleEdit(record)}>编辑</a>
        &nbsp;|&nbsp;
        <a onClick={() => this.handleDelete(record.id)} style={{ color: '#ff4d4f' }}>删除</a>
      </span>
    ) }
    this.setState({ columns: [...columns, item] });
  }

  // fetchData 方法 - 供 AgTable 自动调用
  // params: AgTable 内部合并的参数（currentPage, pageSize, order, sorter, 搜索条件）
  // callback: 回调函数，将接口返回数据透传给 AgTable
  fetchData = (params, callback) => {
    // 适配后端接口参数（agTable 用 currentPage，后端用 page）
    const apiParams = {
      ...params,
      page: params.currentPage,
      sortField: params.sorter,
      sortOrder: params.order,
    };
    delete apiParams.currentPage;
    delete apiParams.sorter;
    delete apiParams.order;

    rqHome.getUdpData(apiParams, (res) => {
      callback(res.data);  // 透传 res.data，配合 dataField="list"
    });
  }

  // 触发刷新（改变 isUpdate 值）
  handleRefresh = () => {
    this.setState(prevState => ({
      refreshFlag: !prevState.refreshFlag,
    }));
  }

  // 新增
  handleAdd = () => {
    const newItem = {
      data_type: 'UDP',
      sock_type: 'TCP',
      remote_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      remote_port: String(Math.floor(Math.random() * 64512) + 1024),
      send_ok_pkts: Math.floor(Math.random() * 10000),
      send_fl_pkts: Math.floor(Math.random() * 50),
      send_ok_bytes: Math.floor(Math.random() * 5000000),
      send_fl_bytes: Math.floor(Math.random() * 1000),
      task_status: '运行中',
      other: '已启用',
    };
    rqHome.addUdpData(newItem, (res) => {
      if (res.code === 0) {
        message.success('新增成功');
        this.handleRefresh();
      } else {
        message.error(res.message || '新增失败');
      }
    });
  }

  // 编辑
  handleEdit = (record) => {
    const updatedItem = {
      ...record,
      task_status: record.task_status === '运行中' ? '暂停' : '运行中',
    };
    rqHome.updateUdpData(record.id, updatedItem, (res) => {
      if (res.code === 0) {
        message.success('更新成功');
        this.handleRefresh();
      } else {
        message.error(res.message || '更新失败');
      }
    });
  }

  // 删除
  handleDelete = (id) => {
    rqHome.deleteUdpData(id, (res) => {
      if (res.code === 0) {
        message.success('删除成功');
        this.handleRefresh();
      } else {
        message.error(res.message || '删除失败');
      }
    });
  }

  // 批量删除
  handleBatchDelete = () => {
    const { selectedRowKeys } = this.state;
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的数据');
      return;
    }
    rqHome.batchDeleteUdpData(selectedRowKeys, (res) => {
      if (res.code === 0) {
        message.success(`成功删除 ${res.data.deleted_count} 条数据`);
        this.setState({ selectedRowKeys: [] });
        this.handleRefresh();
      } else {
        message.error(res.message || '批量删除失败');
      }
    });
  }

  renderExtra = () => {
    return (
      <span>
        <Button type="primary" onClick={this.handleAdd} style={{ marginRight: 8 }}>
          新增
        </Button>
        <Button danger onClick={this.handleBatchDelete} style={{ marginRight: 8 }}>
          批量删除
        </Button>
        <EditHeader
          type='udp_show_config'
          updateHeaders={this.updateHeaders}
        />
      </span>
    )
  }

  expandedRowRender = (record) => {
    return (
      <AgTable
        height={200}
        columns={this.columns}
        data={this.subData}
        enableColumnDrag
        pagination={false}
      />
    )
  }

  onSelectedRow = (rowKeys) => {
    this.setState({ selectedRowKeys: rowKeys });
  }

  render() {
    const { columns, refreshFlag } = this.state;
    return (
      <Fragment>
        <Card title="UDP数据 (AG Grid)" extra={this.renderExtra()}>
          <AgTable
            height={500}
            // tableKey='udp_show_config'
            columns={columns}
            fetchData={this.fetchData}
            dataField="list"
            isUpdate={refreshFlag}
            pageSize={100}
            enableRowDrag
            enableColumnDrag
            onSelectRow={this.onSelectedRow}
            expandedRowRender={this.expandedRowRender}
            pagination
          />
        </Card>
      </Fragment>
    );
  }
}
