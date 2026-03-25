import React, { PureComponent } from 'react';
import { Tree, Row, Col } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import AutoSizeDialog from 'components/Dialog';
import update from 'immutability-helper';


export default class SetTableTitleDialog extends PureComponent {
  constructor(props) {
    super(props);
    const columns = props.columns || [];
    const detailFields = props.detailFields || [];
    const keys = detailFields.map(i => i.dataIndex);
    const otherFields = columns.filter(i => !keys.includes(i.dataIndex))
    this.state = {
      columns,
      detailFields: detailFields.map((i, idx) => {return {...i, index: idx}}),
      allFields: [...detailFields, ...otherFields].map((i, idx) => {return {...i, index: idx}}),
    }
  };

  onDrop = (e) => {
    const node = e.node;
    const dragNode = e.dragNode;
    if (node.disabled) return false;
    this.moveColumn(dragNode.props.data, node.props.data)
  }

  onDetailFieldsDrop = (e) => {
    const node = e.node;
    const dragNode = e.dragNode;
    this.moveDetailFields(dragNode.props.data, node.props.data)
  }

  moveDetailFields = (item1, item2) => {
    const { allFields, detailFields } = this.state;
    const sorterFields = allFields.sort((a, b) => a.index - b.index);
    const newList = update(sorterFields, {$splice: [[item1.index, 1], [item2.index, 0, item1]]}).map((i, idx) => {return {...i, index: idx}});
    const keys = detailFields.map(i => i.dataIndex);
    this.setState({allFields: newList, detailFields: newList.filter(i => keys.includes(i.dataIndex))})
  }

  moveColumn = (item1, item2) => {
    const { columns } = this.state;
    const sorterColumns = columns.sort((a, b) => a.index - b.index);
    const newList = update(sorterColumns, {$splice: [[item1.index, 1], [item2.index, 0, item1]]}).map((i, idx) => {return {...i, index: idx}});
    const newColumns = [];
    const leftColumns = [];
    const rightColumns = [];
    for (const item of newList) {
      if (item.fixed === 'left') {
        leftColumns.push(item);
      } else if (item.fixed === 'right') {
        rightColumns.push(item);
      } else {
        newColumns.push(item);
      }
    }
    const cls = [...leftColumns, ...newColumns, ...rightColumns];
    this.setState({columns: cls})
  }

  onDetailFieldsCheck = (keys) => {
    const { columns } = this.state;
    this.setState({detailFields: columns.filter(i => keys.includes(i.dataIndex))})
  }

  onCheck = (keys) => {
    const { columns, tableWidth } = this.state;
    const newColumns = [];
    const leftColumns = [];
    const rightColumns = [];
    let w = 0;
    for (const i of columns) {
      if (keys.includes(i.dataIndex)) w += i.width;
      const item = {...i, hidden: !keys.includes(i.dataIndex)};
      if (item.fixed === 'left') {
        leftColumns.push(item);
      } else if (item.fixed === 'right') {
        rightColumns.push(item);
      } else {
        newColumns.push(item);
      }
    }
    const cls = [...leftColumns.sort((a, b) => a.index - b.index), ...newColumns.sort((a, b) => a.index - b.index), ...rightColumns.sort((a, b) => a.index - b.index)];
    const state = {columns: cls, xScroll: w};
    if (w < tableWidth) {
      const changeColumns = [];
      for (const i of cls) {
        if (i.hidden) {
          changeColumns.push(i)
        } else {
          changeColumns.push({...i, width: i.width / w * tableWidth})
        }
      }
      state.columns = changeColumns;
      state.xScroll = tableWidth;
    }

    this.setState({columns: cls})
  }

  onOk = () => {
    const { columns, xScroll, detailFields } = this.state;
    if (this.props.updateColumns) this.props.updateColumns({columns, xScroll})
    if (this.props.handleModalVisible) this.props.handleModalVisible(false);
    if (this.props.setDetailFields) this.props.setDetailFields(detailFields)
  }

  contentRender = () => {
    const { columns } = this.state;
    return (
      <Tree
        treeData={columns}
        fieldNames={{key: 'dataIndex'}}
        draggable
        checkable
        onDrop={this.onDrop}
        onCheck={this.onCheck}
        checkedKeys={columns.filter(i => !i.hidden).map(i => i.dataIndex)}
      />
    )
  }

  contentDetailFieldsSelectRender = () => {
    const { detailFields, allFields } = this.state;
    return (
      <Tree
        treeData={allFields}
        fieldNames={{key: 'dataIndex'}}
        draggable
        checkable
        onDrop={this.onDetailFieldsDrop}
        onCheck={this.onDetailFieldsCheck}
        checkedKeys={detailFields.map(i => i.dataIndex)}
      />
    )
  }

  createContent = () => {
    const { setDetailFields } = this.props;
    if (setDetailFields) {
      return (
        <Row>
          <Col span={12}>
            <Scrollbars style={{height: 290}}>
              {this.contentRender()}
            </Scrollbars>
          </Col>
          <Col span={12}>
            <Scrollbars style={{height: 290}}>
              {this.contentDetailFieldsSelectRender()}
            </Scrollbars>
          </Col>
        </Row>
      )
    }
    return this.contentRender()
  }

  render () {
    const { visible, handleModalVisible, setDetailFields } = this.props;
    return (
      <AutoSizeDialog
        title={setDetailFields ? '调整表头及详情字段' : '调整表头'}
        visible={visible}
        width={setDetailFields ? 800 : 500}
        maxHeight={300}
        closable
        onCancel={() => handleModalVisible(false)}
        onOk={this.onOk}
      >
        {this.createContent()}
      </AutoSizeDialog>
    );
  }
}
