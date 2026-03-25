import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import EditHeader from 'common/EditHeader';
import { initColumns } from 'common/utils';
import JsonEditor from 'components/JsonEditor'
import StandardTable from 'components/newStandardTable';
import AgTable from 'components/agTable';
import * as rqHome from 'requests/home';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';
// import './index.less'

@Form.create()
@connect(({ main }) => ({
  masterIp: main.masterIp,
  globalNodeType: main.globalNodeType || 'normal',
}))
export default class HomeIndex extends PureComponent {
	constructor(props) {
		super(props);
    this.state = {columns: [], defaultData: []}
    this.columns = [{title: '姓名', dataIndex: 'name'}, {title: '年龄', dataIndex: 'age'}, {title: '性别', dataIndex: 'xb'}]
    this.subData = [];
    for (let i = 0; i < 200; i ++) {
      this.subData.push({id: i, name: `姓名${i}`, age: `年龄${i}`, xb: `性别${i}`})
    }
  }

  componentDidMount() {
    rqHome.getUdpData({}, (res) => {
      this.setState({defaultData: res.data})
      // console.log(res, 11111)
    })
  }

  updateHeaders = (list) => {
    const columns = initColumns(list);
    console.log(columns, 'columns')
    this.setState({columns})
  }

  renderExtra = () => {
    return (
      <EditHeader
        type='udp_show_config'
        updateHeaders={this.updateHeaders}
      />
    )
  }

  expandedRowRender = (record) => {
    // console.log(record, 11)
    return (
      <AgTable
        height={200}
        // tableKey='udp_show_config'
        columns={this.columns}
        data={this.subData}
        enableColumnDrag
        pagination={false}
      />
    )
  }

  onSelectedRow = (rowKeys, rows) => {
    console.log(rowKeys, rows, 'rowKeys, rows')
  }

	render () {
    const { columns, defaultData } = this.state;
    // console.log(defaultData, 'defaultData')
    return (
      <Fragment>
        <Card title={`UDP数据 (AG Grid) - ${defaultData.length} 条`} extra={this.renderExtra()}>
          <AgTable
            height={500}
            // tableKey='udp_show_config'
            columns={columns}
            data={defaultData}
            enableRowDrag
            enableColumnDrag
            onSelectRow={this.onSelectedRow}
            expandedRowRender={this.expandedRowRender}
            pagination={false}
          />
        </Card>

      </Fragment>
    );
	}
}
