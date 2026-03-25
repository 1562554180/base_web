import React, { PureComponent, useContext, useRef, useEffect } from 'react';
import { Table, Radio, Dropdown, Menu, Select, Input, DatePicker, Button, Tooltip } from 'antd';
import { Resizable } from 'react-resizable';
import _ from 'lodash';
import _ip from 'ip';
import { v4 as uuidv4 } from 'uuid';
import { EllipsisOutlined, InfoCircleOutlined } from '@ant-design/icons';
import uri from 'utils/uri';
import ResizeObserver from 'rc-resize-observer';
import { l } from 'utils/localization';
import config from 'utils/config';
import moment from 'moment';
import 'react-resizable/css/styles.css';
import { getStorageData, setStorageData } from 'utils/storage'
import { DndProvider, useDrag, useDrop, DndContext } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getDistance, parseJson } from 'utils/utils';
import update from 'immutability-helper';
import SearchBar from './searchBar';
import SetColumnsDialog from './setColumnsDialog';
import './index.less';


/**
 * 通过onRowMove这个回调 传回拖拽后的list 使用这个list替换你的data.list即可
 */

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const ConditionalDndProvider = ({ children }) => {
  const dndContext = useContext(DndContext);
  const hasDndProvider = dndContext && typeof dndContext.dragDropManager !== 'undefined' && dndContext.dragDropManager !== null;
  const isBackendSetUp = typeof document !== 'undefined' && document.body && document.body.__isReactDndBackendSetUp === true;
  if (hasDndProvider || isBackendSetUp) {
    return children;
  }
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

const ResizeAbleTitle = props => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      handle={<span className='react-resizable-handle' onClick={e => e.stopPropagation()} />}
      draggableOpts={{enableUserSelectHack: true}}
      height={0}
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const DraggableHeaderCell = ({ index, column, moveColumn, createOverlay, enableHeaderDrag }) => {
  if (!enableHeaderDrag) {
    return (
      <Dropdown trigger={['contextMenu']} dropdownRender={() => createOverlay(column)}>
        <div className={column.ellipsis ? 'whiteSpace' : ''}>
          <a onClick={(e) => e.stopPropagation()}>{column.title}</a>
        </div>
      </Dropdown>
    )
  }
  const ref = useRef()

  const [, drag] = useDrag({
    type: 'DraggableColumn',
    item: column,
    collect: (monitor) => {
      return {isDragging: monitor.isDragging()};
    },
  })
  const [, drop] = useDrop({
    accept: 'DraggableColumn',
    drop: (item) => {
      if (item.dataIndex === column.dataIndex) return false;
      if (moveColumn) moveColumn(item, column);
    },
    collect: (monitor) => {
      const { dataIndex } = monitor.getItem() || {};
      if (dataIndex === column.dataIndex || column.fixed) {
        return {};
      }
      return {
        isOver: monitor.isOver(), canDrop: monitor.canDrop(),
        dropClassName: column.index < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
  })

  useEffect(() => {
    drag(drop(ref))
  }, [drag, drop, ref]);

  return (
    <Dropdown trigger={['contextMenu']} dropdownRender={() => createOverlay(column)}>
      <div style={{cursor: 'move'}} className={column.ellipsis ? 'whiteSpace' : ''} ref={column.fixed ? null : ref}>
        <a onClick={(e) => e.stopPropagation()}>{column.title}</a>
      </div>
    </Dropdown>
  )
}

class StandardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      total: 0,
      sorter: {},
      ...this.initBaseState(props),
    };
    this.uuId = uuidv4();
    this.tableRef = React.createRef();
    if (props.parent) {
      props.parent.getCurrentTableData = this.getCurrentTableData;
    }
  }

  initBaseState = (props) => {
    const { columns=[], tableKey } = props;
    this.tableKey = tableKey;
    const tableConfigStr = this.tableKey ? getStorageData(this.tableKey) : '';

    const defaultColumns = [];
    for (const i of columns) {
      let width = i.width;
      if (!width) {
        width = _.isString(i.title) ? i.title.pxWidth(14) + 20 : 100;
      }
      defaultColumns.push({...i, width, ellipsis: _.isUndefined(i.ellipsis) ? true : i.ellipsis})
    }
    const state = {
      params: props.params,
      pageSize: props.pageSize || 30,
      searchObj: props.searchObj || {},
      selectedRowKeys: props.selectedRowKeys || [],
      columns: defaultColumns,
      data: props.defaultData || [],
      selectedRecord: props.selectedRecord || {},
    }
    if (tableConfigStr) {
      const tableConfig = parseJson(tableConfigStr, {});
      const columnConfig = {};
      const storeColumns = tableConfig.columns || [];
      for (const i of defaultColumns) {
        columnConfig[i.dataIndex] = i;
      }
      const newColumns = [];
      const leftColumns = [];
      const rightColumns = [];
      for (const i of storeColumns) {
        const dataIndex = i.dataIndex;
        const localColumn = columnConfig[dataIndex] || {};
        const item = { ...localColumn, ...i, sortOrder: null, filtered: false};
        const _title = localColumn.title; // title 是dom时
        if (_title instanceof Object) item.title = _title;
        if (!item.width) {
          item.width = _.isString(i.title) ? i.title.pxWidth(14) + 20 : 100;
        }
        if (item.fixed === 'left') {
          leftColumns.push(item);
        } else if (item.fixed === 'right') {
          rightColumns.push(item);
        } else {
          newColumns.push(item);
        }
      }
      const cls = [...leftColumns.sort((a, b) => a.index - b.index), ...newColumns.sort((a, b) => a.index - b.index), ...rightColumns.sort((a, b) => a.index - b.index)];
      state.columns = cls;
      if (tableConfig.pageSize) state.pageSize = tableConfig.pageSize;
    }
    return state;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.props, nextProps)) {
      let change = false;
      let key = ''
      for (const i in nextProps) {
        const isObj = _.isObject(nextProps[i])

        if (!isObj && this.props[i] !== nextProps[i]) {
          change = true;
          key = i;
          break;
        }
        if (isObj && !_.isEqual(this.props[i], nextProps[i])) {
          change = !_.isFunction(nextProps[i]) && i !== 'locale';
          if (change) {
            key = i;
            break;
          }
        }
      }
      return change;
    }
    if (!_.isEqual(this.state, nextState)) {
      return true;
    }
    return false
  }

  componentWillReceiveProps = (nextProps) => {
    const state = {};
    if (!_.isEqual(this.props.defaultData, nextProps.defaultData)) {
      state.data = nextProps.defaultData;
    }
    if (!_.isEqual(this.props.searchObj, nextProps.searchObj)) {
      state.searchObj = nextProps.searchObj;
    }
    if (!_.isEqual(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
      state.selectedRowKeys = nextProps.selectedRowKeys;
    }
    if (!_.isEqual(this.props.columns, nextProps.columns)) {
      const newState = this.initBaseState(nextProps);
      this.setState(newState, () => {
        if (this.state.boxWidth) {
          this.tableResize({width: this.state.boxWidth})
        }
      })
    }
    if (!_.isEqual(this.props.params, nextProps.params)) {
      state.params = nextProps.params;
      state.current = 1;
    }
    if (!_.isEqual(this.props.selectedRecord, nextProps.selectedRecord)) {
      state.selectedRecord = nextProps.selectedRecord;
    }
    if (this.props.update !== nextProps.update) {
      this.getTableData()
      if (nextProps.interval) this.createInterval(nextProps.interval);
    }
    if (!_.isEmpty(state)) {
      this.setState(state, () => {
        if (state.current === 1) {
          this.getTableData();
          if (nextProps.interval) this.createInterval(nextProps.interval);
        }
      })
    }
  }

  componentDidMount() {
    this._isUnmounted = false;
    this.getTableData()
    const { interval } = this.props;
    if (interval) this.createInterval(interval);
    this.setTableBodyMinHeight()
  }

  componentDidUpdate(prevProps) {
    if (this.props.height !== prevProps.height) {
      this.setTableBodyMinHeight()
    }
  }

  setTableBodyMinHeight = () => {
    if (this._isUnmounted) return;
    setTimeout(() => {
      const tableElement = this.tableRef.current;
      if (tableElement) {
        const tableBody = tableElement.querySelector('.ant-table-body');
        if (tableBody && this.props.height) {
          const scrollY = this.getScroll().y;
          if (scrollY) {
            tableBody.style.minHeight = scrollY + 'px';
          }
        }
      }
    }, 0)
  }

  createInterval = (interval) => {
    this.stopInterval()
    this.timer = setInterval(() => {
      // 通过定时器请求时，不显loading效果
      this.getTableData(true)
    }, interval)
  }

  stopInterval = () => {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  componentWillUnmount () {
    this._isUnmounted = true;
    this.stopInterval()
    // 清理所有可能的监听器和引用
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  createOverlay = (column) => {
    const selectedKeys = [`align_${column.align || 'left'}`, `ellipsis_${_.isUndefined(column.ellipsis) ? 'false' : String(column.ellipsis)}`];

    if (column.fixed) {
      selectedKeys.push(`fixed_${column.fixed}`);
    }
    if (column.sortOrder) {
      selectedKeys.push(`sortOrder_${column.sortOrder}`);
    }
    const { setDetailFields } = this.props;
    const title = setDetailFields ? '调整表头及详情字段' : '调整表头';
    if (column.is_disabled) {
      return (
        <Menu selectedKeys={selectedKeys} onClick={(e) => this.handleMenuClick(e, column)}>
          <Menu.Item key="ellipsis_false">超出内容换行</Menu.Item>
          <Menu.Item key="ellipsis_true">超出内容省略</Menu.Item>
          {column.sorter && <Menu.Divider />}
          {column.sorter && <Menu.Item key="sortOrder_ascend">排序升序</Menu.Item>}
          {column.sorter && <Menu.Item key="sortOrder_descend">排序降序</Menu.Item>}
          {column.sorter && <Menu.Item key="sortOrder_null">取消排序</Menu.Item>}
        </Menu>
      )
    }
    return (
      <Menu selectedKeys={selectedKeys} onClick={(e) => this.handleMenuClick(e, column)} style={{width: 120}}>
        <Menu.Item key="hidden">隐藏该列</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="ellipsis_false">超出内容换行</Menu.Item>
        <Menu.Item key="ellipsis_true">超出内容省略</Menu.Item>
        <Menu.Divider />
        {column.sorter && <Menu.Item key="sortOrder_ascend">排序升序</Menu.Item>}
        {column.sorter && <Menu.Item key="sortOrder_descend">排序降序</Menu.Item>}
        {column.sorter && <Menu.Item key="sortOrder_null">取消排序</Menu.Item>}
        {column.sorter && <Menu.Divider />}
        <Menu.Item key="fixed_left">固定左侧</Menu.Item>
        <Menu.Item key="fixed_right">固定右侧</Menu.Item>
        <Menu.Item key="noFixed">取消固定</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="align_center">内容居中</Menu.Item>
        <Menu.Item key="align_left">内容居左</Menu.Item>
        <Menu.Item key="align_right">内容居右</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="title_setting">{title}</Menu.Item>
      </Menu>
    )
  }

  hideSetTableTitleVisible = () => {
    this.setState({setDialogVisible: false})
  }

  handleMenuClick = (e, column) => {
    const { columns, sorter, pageSize, tableWidth } = this.state;
    const { action, requestFunction } = this.props;
    const newColumns = [];
    const options = {
      hidden: {hidden: true}, sortOrder_descend: {sortOrder: 'descend'}, sortOrder_ascend: {sortOrder: 'ascend'}, sortOrder_null: {sortOrder: null}, align_right: {align: 'right'},
      fixed_left: {fixed: 'left', disabled: true}, fixed_right: {fixed: 'right', disabled: true}, noFixed: {fixed: false, disabled: false}, align_center: {align: 'center'}, align_left: {align: 'left'}, ellipsis_false: {ellipsis: false}, ellipsis_true: {ellipsis: true},
    }
    const leftColumns = [];
    const rightColumns = [];

    e.domEvent.preventDefault();
    e.domEvent.stopPropagation();
    const key = e.key;
    if (key === 'title_setting') {
      this.setState({setDialogVisible: true})
      return false;
    }
    let w = 0;
    const state = {};

    const attrs = options[key];

    for (const i of columns) {
      if (i.dataIndex === column.dataIndex) {
        if (!attrs.hidden && !i.hidden) w += i.width;
        if (key === 'fixed_left') {
          leftColumns.push({...i, ...attrs});
        } else if (key === 'fixed_right') {
          rightColumns.push({...i, ...attrs});
        } else {
          newColumns.push({...i, ...attrs})
        }
        if (['sortOrder_descend', 'sortOrder_ascend', 'sortOrder_null'].includes(key)) {
          state.sorter = key === 'sortOrder_null' ? null : {
            field: i.dataIndex,
            order: attrs.sortOrder,
          }
          if (sorter.field !== i.dataIndex || sorter.order !== attrs.sortOrder) {
            state.current = 1;
          }
        }
      } else if (i.dataIndex !== column.dataIndex) {
        if (!i.hidden) w += i.width;
        if (i.fixed === 'left') {
          leftColumns.push({...i, sortOrder: ['sortOrder_descend', 'sortOrder_ascend', 'sortOrder_null'].includes(key) ? null : i.sortOrder || null});
        } else if (i.fixed === 'right') {
          rightColumns.push({...i, sortOrder: ['sortOrder_descend', 'sortOrder_ascend', 'sortOrder_null'].includes(key) ? null : i.sortOrder || null});
        } else {
          newColumns.push({...i, sortOrder: ['sortOrder_descend', 'sortOrder_ascend', 'sortOrder_null'].includes(key) ? null : i.sortOrder || null});
        }
      }
    }
    const cls = [...leftColumns.sort((a, b) => a.index - b.index), ...newColumns.sort((a, b) => a.index - b.index), ...rightColumns.sort((a, b) => a.index - b.index)];
    const newState = {...state, columns: cls, xScroll: w};
    const changeColumns = [];

    if (key === 'hidden' && w < tableWidth) {
      for (const i of cls) {
        if (i.hidden) {
          changeColumns.push(i)
        } else {
          changeColumns.push({...i, width: i.width / w * tableWidth})
        }
      }
      newState.columns = changeColumns;
      newState.xScroll = tableWidth;
    }

    this.setState(newState, () => {
      if (action || requestFunction && ['sortOrder_descend', 'sortOrder_ascend', 'sortOrder_null'].includes(key)) {
        this.getTableData()
      }
      if (this.tableKey) setStorageData(this.tableKey, JSON.stringify({columns: changeColumns.length > 0 ? changeColumns : cls, pageSize}))
    })
  }

  moveColumn = (item1, item2) => {
    const { columns, pageSize } = this.state;
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
    this.setState({columns: cls}, () => {
      if (this.tableKey) setStorageData(this.tableKey, JSON.stringify({columns: cls, pageSize}))
    })
  }

  DraggableBodyRow = (row) => {
    const { index, moveRow, className, style, children, ...otherProps } = row;
    const [{isOver, dropClassName}, drop] = useDrop({
      accept: 'DraggableBodyRow',
      collect: (monitor) => {
        const { dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        }
      },
      drop: (item) => {
        if (item.index || String(item.index) === '0') {
          if (moveRow) moveRow(item.index, index);
        }
      },
    })
    const [, drag] = useDrag({
      type: 'DraggableBodyRow',
      item: {index},
      collect: (monitor) => {
        return {isDragging: monitor.isDragging()};
      },
    })
    const ref = useRef()

    useEffect(() => {
      drop(drag(ref))
    }, [drag, drop, ref]);

    return (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{cursor: 'move', ...style}}
        {...otherProps}
      >
        {children}
      </tr>
    )
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const list = data || [];
    const { onRowMove } = this.props;
    const dragRow = list[dragIndex];
    const newList = update(list, {$splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]});
    this.setState({data: newList}, () => {
      if (onRowMove) onRowMove(newList)
    })
  }

  onRowContextMenu = (e, r, i) => {
    e.stopPropagation();
    if (this.props.onRowContextMenu) this.props.onRowContextMenu(e, r, i)
  }

  getCurrentTableData = () => {
    return this.state.searchData || (this.props.data?this.props.data.list : []) || [];
  }

  getRowKey = (props) => {
    return (props || this.props).rowKey || "id";
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { hoverSelected } = this.state;
    const { needHoverStatus } = this.props;
    const state =  {selectedRowKeys}
    if (needHoverStatus) {
      const o = {...hoverSelected};
      for (const i of selectedRowKeys) {
        o[i] = true;
      }
      state.hoverSelected = o;
    }
    this.setState(state);
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRowKeys, selectedRows);
    }
  };

  handleRowSelect = (record, isSelected) => {
    if (this.props.onSelectOneRow) {
      this.props.onSelectOneRow(record, isSelected);
    }
  };

  handleSelectAll = (selected, selectedRows, changedRows) => {
    if (this.props.onSelectAll) {
      this.props.onSelectAll(selected, selectedRows, changedRows);
    }
  }

  handleSelectInvert = (selectedRows) => {
    if (this.props.onSelectInvert) {
      this.props.onSelectInvert(selectedRows);
    }
  }

  handleTableChange = (p, f, s) => {
    const { columns, sorter, pageSize, current } = this.state;
    const { onTableChange } = this.props
    const newPageination = {
      sorter: s,
      current: current === p.current && (s.order !== sorter.order || s.field !== sorter.field) ? 1 : p.current,
      pageSize: p.pageSize,
    };
    if (onTableChange) onTableChange(newPageination, f, s);

    const newColumns = [];
    for (const i of columns) {
      if (i.dataIndex === s.field) {
        newColumns.push({...i, sortOrder: s.order})
      } else {
        newColumns.push({...i, sortOrder: null})
      }
    }
    this.setState({ columns: newColumns, ...newPageination }, () => {
      this.getTableData();
      if (p.pageSize !== pageSize) {
        if (this.tableKey) setStorageData(this.tableKey, JSON.stringify({columns: newColumns, pageSize: p.pageSize}))
      }
    })
  };

  onRowClick = (record, index) => {
    this.setState({
      selectedRecord: record,
    }, () => {
      if (this.props.onRowClick) {
        return this.props.onRowClick(record, index)
      }
    })
  }

  onRowDoubleClick = (record, index) => {
    if (this.props.onRowDoubleClick) {
      this.props.onRowDoubleClick(record, index)
    }
  }

  createSwitch = () => {
    const { switchGroup } = this.state;
    return (
      <div style={{ textAlign: 'right', margin: '6px 0px' }}>
        <Radio.Group value={switchGroup} onChange={this.changeGroup} style={{ width: 300 }}>
          <Radio.Button value='table'>表格展示</Radio.Button>
          <Radio.Button value='card'>卡片展示</Radio.Button>
        </Radio.Group>
      </div>
    )
  }

  changeGroup = (e) => {
    this.setState({
      switchGroup: e.target.value,
    })
  }

  setDisabledCheckbox = (record) => {
    const { setDisabledBox } = this.props;
    if (setDisabledBox) {
      return {disabled: record.disabled || setDisabledBox(record)};
    }
    return {disabled: record.disabled};
  }

  renderCardContent = (record, idx) => {
    const { columns } = this.state;
    return (
      <>
        {columns.map(item=> {
          if (!item.isShowInCard) return null;
          const title = item.title;
          const dataIndex = item.dataIndex;
          return (
            <div>{title + ':' + (item.render ? item.render(record[dataIndex], record, idx) || '暂无' : (record[dataIndex] || '暂无'))}</div>
          );
        })}
      </>
    )
  }

  sorterOrFilterData = () => {
    if (this._isUnmounted) return;

    const { callbackData, searchArray } = this.props;
    const { data, searchObj, columns } = this.state;
    const newColumns = [];
    for (const i of columns) {
      const dataIndex = i.dataIndex;
      newColumns.push({...i, filtered: !searchArray && i.isSearch && !_.isUndefined(searchObj[dataIndex]) && searchObj[dataIndex] !== ''})
    }

    const state = {searchData: false, columns: newColumns};

    if (_.isEmpty(searchObj)) {
      if (callbackData) callbackData(data)
    } else {
      const list = [];
      for (const i of data) {
        let add = true;
        for (const j in searchObj) {
          if (!String(i[j]).toLowerCase().includes(String(searchObj[j]).toLowerCase())) {
            add = false;
            break
          }
        }
        if (add) {
          list.push(i)
        }
      }
      if (callbackData) callbackData(list)
      state.searchData = list;
    }

    if (!this._isUnmounted) {
      this.setState(state)
    }
  }

  filterSearchObj = (searchObj, pParams, sParams) => {
    const { columns } = this.state;
    const { searchArray } = this.props;
    const array = searchArray || columns.filter(i => i.isSearch) || []
    for (const i of array) {
      const type = i.type;
      const dataIndex = i.dataIndex;
      if (!_.isUndefined(searchObj[dataIndex])) {
        let v = searchObj[dataIndex];
        if (type === 'date') {
          v = moment(searchObj[dataIndex]).format(i.dateFormat || 'YYYY-MM-DD HH:mm:ss')
        } else if (type === 'range_date' && v.length === 2) {
          v = [moment(searchObj[dataIndex][0]).format(i.dateFormat || 'YYYY-MM-DD HH:mm:ss'), moment(searchObj[dataIndex][1]).format(i.dateFormat || 'YYYY-MM-DD HH:mm:ss')]
        }
        if (i.searchInS) {
          sParams[dataIndex] = v;
        } else {
          pParams[dataIndex] = v;
        }
      }
    }
  }

  getTableData = (byInterval) => {
    if (this._isUnmounted) return;

    const dispatch = config.store.dispatch;
    const { current, pageSize, searchObj, sorter, params } = this.state;
    const { action, requestFunction,
    orderField, defaultData, sorterAndSearchInWeb, isLocalPage, initData } = this.props;
    const orderParams = {};
    if ((sorterAndSearchInWeb && this.state.data.length > 0) || !_.isUndefined(defaultData)) return this.sorterOrFilterData()
    if (!_.isUndefined(defaultData)) return false;
    if (_.keys(sorter).length > 0 && sorter.order) {
      orderParams.order = sorter.order;
      orderParams[orderField || 'sorter'] = sorter.field;
    }
    const tableParams = {...orderParams, ...params};
    if (!isLocalPage) {
      tableParams.currentPage = current;
      tableParams.pageSize = pageSize;
    }

    if (!_.isEmpty(searchObj)) {
      const sParams = {};
      this.filterSearchObj(searchObj, tableParams, sParams);
      if (!_.isEmpty(sParams)) {
        tableParams.s = sParams
      }
    }
    this.setState({isLoading: byInterval !== true}, () => {
      if (this._isUnmounted) return;

      const payload = tableParams;
      if (requestFunction) {
        requestFunction(payload, (res) => {
          if (this._isUnmounted) return;
          const data = initData ? initData(res) : res.data || {};
          this.callbackData(data, tableParams)
        })
      } else if (action) {
        dispatch({type: action, payload, callback: (res) => {
          if (this._isUnmounted) return;
          this.callbackData(res, tableParams)
        }})
      } else {
        this.setState({
          isLoading: false,
        })
      }
    })
  }

  callbackData = (res, tableParams) => {
    if (this._isUnmounted) return;

    const { dataKey, onRowClick, hasDefaultValue, getTotal, totalField, columnField, searchArray } = this.props;
    const data = res[dataKey] || res.data || [];
    if (columnField && res[columnField] && res[columnField].length > 0) {
      state.columns = res[columnField];
    }

    const { searchObj, columns } = this.state;
    const newColumns = [];
    for (const i of columns) {
      const dataIndex = i.dataIndex;
      newColumns.push({...i, filtered: !searchArray && i.isSearch && !_.isUndefined(searchObj[dataIndex]) && searchObj[dataIndex] !== ''})
    }
    const state = {data, isLoading: false, columns: newColumns};
    if (this.props.callbackData) {
      this.props.callbackData(data, tableParams, res);
    }

    if (!this._isUnmounted) {
      this.setState({...state, total: res[totalField] || res.total || 0})
    }

    if (getTotal) {
      getTotal(res[totalField] || res.total || data.length || 0)
    }
    if (onRowClick && hasDefaultValue && res.data && res.data[0]) {
      onRowClick(res.data[0])
    } else if (onRowClick) {
      onRowClick({})
    }
  }

  createSearchBar = () => {
    const { hideSearchBar, extraButton, colSpan, searchArray, searchShowMore, otherButton, searchArrayStyle } = this.props;
    const { searchObj = {}, isSearch, columns } = this.state;
    const props = {searchShowMore};
    if (!hideSearchBar) {
      return (
        <SearchBar
          columns={columns}
          isSearch={isSearch}
          searchObj={searchObj}
          onReset={this.onReset}
          onSearch={this.onSearch}
          extraButton={extraButton}
          searchArray={searchArray}
          searchArrayStyle={searchArrayStyle}
          updateSearchObj={this.updateSearchObj}
          colSpan={colSpan}
          otherButton={otherButton}
          {...props}
        />
      )
    } else {
      return '';
    }
  }

  updateSearchObj = (value, key) => {
    const { searchObj } = this.state;
    const newSearchObj = _.cloneDeep(searchObj);
    if (!value || value.length === 0) {
      delete newSearchObj[key]
    } else {
      newSearchObj[key] = value;
    }
    this.setState({
      searchObj: newSearchObj,
    })
  }

  onSearch = () => {
    this.setState({current: 1}, () => {
      this.getTableData()
    })
  }

  onReset = () => {
    const { handleReset } = this.props;
    if (handleReset) {
      handleReset();
    }
    this.setState({
      searchData: false,
      searchObj: {},
    }, () => {
      this.getTableData()
    })
  }

  createClassName = (record, index) => {
    const { hoverSelected = {}, selectedRecord = {} } = this.state;
    const { rowClassName, activeClass, needHoverStatus } = this.props;
    const rowKey = this.getRowKey();
    let className = index % 2 === 0 ? 'double_fixed_data_table2_select_row' : 'single_fixed_data_table2_select_row';
    if (needHoverStatus && hoverSelected[record[rowKey]]) {
      className += ' hover-select-table-row'
    }
    if (rowClassName) {
      className += typeof rowClassName === 'string' ? " " + rowClassName : " " + rowClassName(record, index);
      if (rowKey && (selectedRecord[rowKey]||selectedRecord[rowKey]===0) && selectedRecord[rowKey] === record[rowKey]) {
        if (activeClass) {
          return className + " " + activeClass;
        }
        return className + ' ant-table-row-selected';
      }
    } else if (rowKey && (selectedRecord[rowKey] || String(selectedRecord[rowKey]) === '0') && String(selectedRecord[rowKey]) === String(record[rowKey])) {
      return className + " " + activeClass || 'ant-table-row-selected';
    }
    return className;
  }

  sorterData = (a, b, item) => {
    const dataIndex = item.dataIndex;
    if (['long', 'integer', 'number'].includes(item.dataType)) {
      return a[dataIndex] - b[dataIndex];
    }
    if (item.dataType === 'ip') {
      return _ip.toLong(a[dataIndex]) - _ip.toLong(a[dataIndex]);
    }
    return String(a[dataIndex]).localeCompare(String(b[dataIndex]));
  }

  createSearchItem = (item) => {
    const field = item.dataIndex;
    const { searchObj } = this.state;
    const props = item.props || {};
    const uLabel = item.label || item.title;
    if (item.type === 'select') {
      const fieldNames = item.fieldNames || {};
      const value = searchObj[field] || (props.mode === 'multiple' ? [] : '');
      return (
        <Select
          allowClear
          showSearch={item.showSearch || false}
          value={value || item.defaultValue}
          filterOption={(input, option) => option.props.children.toLocaleUpperCase().indexOf(input.toLocaleUpperCase()) >= 0}
          style={{ width: '100%' }}
          {...props}
          onChange={e => this.updateSearchObj(e, field, field)}
          placeholder={item.placeholder || `请选择${uLabel}`}
        >
          {(item.options || []).map(child => {
            const v = child[fieldNames.value] || child.value;
            const label = child[fieldNames.value] || child.label;
            return <Option key={value} value={v}>{label}</Option>
          })}
        </Select>
      )
    } else if (item.type === 'input') {
      return (
        <Input placeholder={item.placeholder || `请输入${uLabel}`} allowClear {...props} value={searchObj[field] || ''} style={props.style || { width: '100%' }} onChange={(e) => this.updateSearchObj(e.target.value, field)} />
      )
    } else if (item.type === 'date') {
      let format = 'YYYY-MM-DD';
      if (item.showTime) {
        format = 'YYYY-MM-DD HH:mm:ss';
        props.showTime = true;
      }
      return (
        <DatePicker
          allowClear
          format={item.props || format}
          value={searchObj[field] || ''}
          onChange={(d) => this.updateSearchObj(d, field)}
          {...props}
        />

      )
    } else if (item.type === 'range_date') {
       let format = 'YYYY-MM-DD';
      if (item.showTime) {
        format = 'YYYY-MM-DD HH:mm:ss';
        props.showTime = true;
      }
      return (
        <RangePicker
          allowClear
          format={format}
          style={props.style || {width: '100%'}}
          value={searchObj[field] || []}
          onChange={(d) => this.updateSearchObj(d, field)}
          {...props}
        />
      )
    }
  }

  createFilterDropdown = (col) => {
    const dataIndex = col.dataIndex;
    const searchArray = this.state.searchArray;
    if (searchArray || !col.isSearch || !col.type) return {};
    return {
      filterDropdown: ({ confirm }) => (
        <div className='tableColumnSearch' style={{padding: 6, borderRadius: 6, display: 'flex'}}>
          {this.createSearchItem(col)}
          <Button
            type="primary"
            onClick={() => this.getTableData()}
            size="small"
            style={{width: 50, margin: '0px 8px'}}
          >
            查询
          </Button>
          <Button style={{width: 50}} onClick={() => this.handleResetTheField(dataIndex, confirm)} size="small">
            重置
          </Button>
        </div>
      ),
    }
  }

  handleResetTheField = (dataIndex, confirm) => {
    const { searchObj } = this.state;
    const o = {...searchObj};
    delete o[dataIndex];
    if (confirm) confirm()
    this.setState({searchObj: o, current: 1}, this.getTableData)
  }

  createCellOverlay = (column, r, t) => {
    return (
      <Menu onClick={(e) => this.handleMenuCellClick(e, column, r, t)} style={{width: 120}}>
        <Menu.Item key="copy">复制内容</Menu.Item>
      </Menu>
    )
  }

  handleMenuCellClick = (e, column, item, v) => {
    if (e.key === 'copy') {
      this.handleCopy(v)
    }
  }

  handleCopy = (v) => {
    const container = document.createElement('textarea');
    container.innerHTML = v;
    document.body.appendChild(container);
    container.select();
    document.execCommand('copy');
    document.body.removeChild(container);
  }

  createColumnRender = (t, r, i, col) => {
    const v = col.render ? col.render(t, r, i) : t;
    const { enableRowDrag, onRowMove, onRowContextMenu } = this.props;
    if(_.isObject(v)) {
      return v
    }
    if (col.ellipsis) {
      const title = col.titleRender ? col.titleRender(t, r) : v;
      if ((!enableRowDrag && !onRowMove) || onRowContextMenu) return <Tooltip title={v}><div style={{width: col.width - 18}} className='whiteSpace'>{v}</div></Tooltip>
      return <Tooltip title={title}><Dropdown trigger={['contextMenu']} overlay={this.createCellOverlay(col, r, t)}><div style={{width: col.width - 18}} className='whiteSpace'>{v}</div></Dropdown></Tooltip>
    }
    if ((!enableRowDrag && !onRowMove) || onRowContextMenu) return <div style={{width: col.width - 18}} className='whiteSpace'>{v}</div>
    return <Dropdown trigger={['contextMenu']} overlay={this.createCellOverlay(col, r, t)}><div style={{width: col.width - 18}}>{v}</div></Dropdown>
  }

  createRowKey = (record) => {
    const { rowKey } = this.props;
    if (this.props.createRowKey) {
      return this.props.createRowKey(record);
    }
    return rowKey ? record[rowKey] : record.id
  }

  getComponent = () => {
    const components = {};

    const { enableRowDrag, onRowMove, enableResizeHeader = true } = this.props;

    if (enableResizeHeader) {
      components.header = {
        cell: ResizeAbleTitle,
      }
    }

    if (enableRowDrag || onRowMove) {
      components.body = {
        row: this.DraggableBodyRow,
      }
    }
    return components;
  }

  tableResize = (e) => {
    const width = e.width;
    let w = 0;
    let uw = 0;
    const newColumns = [];
    const { columns, pageSize } = this.state;
    const { onSelectRow, expandedRowRender } = this.props;
    let offsetX = 0;
    if (onSelectRow) {
      offsetX += 40;
    }
    if (expandedRowRender) {
      offsetX += 40;
    }
    for (const i of columns) {
      if (i.is_disabled) {
        offsetX += i.width;
      }
    }

    const cw = width - offsetX;

    for (const i of columns) {
      if (i.is_disabled) continue;
      w += i.width;
      if (!i.hidden) uw += i.width;
    }
    // const tableConfigStr = getStorageData(this.tableKey);
    let idx = -1;

    for (const i of columns) {
      idx += 1;
      const nw = i.is_disabled ? i.width : i.width / w * cw;
      newColumns.push({...i, width: uw < cw ? nw : i.width, index: _.isUndefined(i.index) ? idx : i.index})
    }
    const newState = {columns: newColumns, tableWidth: cw, xScroll: uw > cw ? uw : cw, offsetX, boxWidth: width};

    this.setState(newState, () => {
      if (!_.isEmpty(newColumns)) {
        if (this.tableKey) setStorageData(this.tableKey, JSON.stringify({columns: newColumns, pageSize}))
      }
    })
  }

  getScroll = () => {
    const { tableWidth, xScroll, offsetX = 0 } = this.state;
    const { height, subtract = 0, noPager, pagination } = this.props;
    let offset = 0;
    if (noPager || (_.isUndefined(pagination) && !pagination)) {
      offset = 30;
    }

    const uXScroll = xScroll + offsetX;
    const y = height ? getDistance(height, subtract + offset) : null;
    return {x: Math.abs(tableWidth - xScroll) < 3 ? false : uXScroll, y}
  }

  handleResize = col => (e, { size }) => {
    // 使用 setTimeout 延迟状态更新，避免在拖拽事件处理期间导致组件卸载
    // 检查组件是否已卸载
    if (this._isUnmounted) {
      return;
    }

    const { columns, tableWidth, pageSize } = this.state;
    const newColumns = [];

    let width = 0;
    const allDragColumns = columns.filter(i => !i.hidden && !i.is_disabled)
    let idx = -1;
    let item = null;
    console.log(allDragColumns, 'allDragColumns')

    if (allDragColumns.length < 2) return false;
    for (const i of allDragColumns) {
      idx += 1;
      if (col.dataIndex === i.dataIndex) {
        width += size.width;
        item = allDragColumns[idx + 1] || allDragColumns[idx - 1];
      } else {
        width += i.width
      }
    }
    if (width > tableWidth) {
      for (const i of columns) {
        if (col.dataIndex === i.dataIndex) {
          newColumns.push({...i, width: size.width})
        } else {
          newColumns.push(i)
        }
      }
    } else {
      for (const i of columns) {
        if (col.dataIndex === i.dataIndex) {
          newColumns.push({...i, width: size.width})
        } else if (item.dataIndex === i.dataIndex) {
          newColumns.push({...i, width: i.width + tableWidth - width})
        } else {
          newColumns.push(i)
        }
      }
    }
    this.setState({columns: newColumns, xScroll: width}, () => {
      if (!this._isUnmounted) {
        if (this.tableKey) setStorageData(this.tableKey, JSON.stringify({columns: newColumns, pageSize}))
      }
    })
  };

  updateColumns = (state) => {
    const { pageSize } = this.state;
    this.setState(state, () => {
      if (this.tableKey) setStorageData(this.tableKey, JSON.stringify({columns: state.columns, pageSize}))
    })
  }

  render () {
    const { style, expandIcon, selectedRowKeys, columns, data, searchData, isLoading, pageSize, current, total, setDialogVisible, tableWidth } = this.state;
    const { onRow, enableHeaderDrag = true, rowClassName, onChange, onRowClick, hiddenRowKey, activeClass, components, loading, isDraggable, moveRow, pagePosition, setDetailFields, detailFields, virtual,
    expandedRowKeys, defaultExpandedRowKeys, onSelectRow, childrenColumnName, rowSelectionType, expandedRowRender, onExpandedRowsChange, showHeader, noPager, size, showTotal, height, pagination, className, ...tableProps } = this.props;
    const list = searchData || data || [];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      current,
      size: 'small',
      total: total || list.length,
      position: ['null', 'bottomRight'],
    };
    if (pagePosition) {
      paginationProps.position = pagePosition;
    }

    if (showTotal) {
      paginationProps.showTotal = (t, range) => l('{0}-{1} of {2} items', range[0], range[1], t);
    }

    this.draggableColumns = columns.filter(i => !i.hidden).map((col, index) => ({
      ...col,
      onHeaderCell: column => {
        return {
          column,
          width: column.width,
          onResize: this.handleResize(col),
        }
      },
      width: col.width,
      sorter: col.sorter ? ((a, b) => this.sorterData(a, b, col)) : false,
      render: (...obj) => this.createColumnRender(...obj, col),
      filterIcon: col.filtered ? <InfoCircleOutlined style={{fontSize: 14}} type='filter' theme='fill' className='custom_standard_table_header_filter_active' /> : <InfoCircleOutlined style={{fontSize: 14}} type='filter' theme='fill' />,
      title: <DraggableHeaderCell enableHeaderDrag={enableHeaderDrag} column={col} index={index} createOverlay={this.createOverlay} moveColumn={this.moveColumn} />,
      ...this.createFilterDropdown(col),
      ellipsis: false,
    }));
    const rowSelection = onSelectRow ? {
      selectedRowKeys: this.props.selectedRowKeys || selectedRowKeys,
      onChange: this.handleRowSelectChange,
      onSelect: this.handleRowSelect,
      onSelectAll: this.handleSelectAll,
      onSelectInvert: this.handleSelectInvert,
      getCheckboxProps: this.setDisabledCheckbox,
      type: rowSelectionType || 'checkbox',
      columnWidth: 40,
      fixed: 'left',
    } : null;

    const otherProps = {};

    const localExpandable = {fixed: 'left', columnWidth: 40, showExpandColumn: _.isFunction(expandedRowRender)};
    if (expandIcon) localExpandable.expandIcon = expandIcon;
    if (expandedRowKeys) localExpandable.expandedRowKeys = expandedRowKeys;
    if (expandedRowRender) localExpandable.expandedRowRender = expandedRowRender;
    if (childrenColumnName) localExpandable.childrenColumnName = childrenColumnName;
    if (onExpandedRowsChange) localExpandable.onExpandedRowsChange = onExpandedRowsChange;
    if (defaultExpandedRowKeys) localExpandable.defaultExpandedRowKeys = defaultExpandedRowKeys;
    otherProps.expandable = localExpandable;
    if (showHeader === false) otherProps.showHeader = false;
    if (noPager !== true) otherProps.pagination = { ...paginationProps, ...pagination };
    else otherProps.pagination = false;
    const scroll = this.getScroll();

    const dataSource = searchData || data || [];
    const tableClassNames = [];
    if (className) tableClassNames.push(className);
    if (dataSource.length === 0) {
      tableClassNames.push('hide_empty_table_border')
    }
    let scrollOffsetY = 0;
    if (!scroll.x) {
      tableClassNames.push('hide_table_scroll_x')
    } else {
      scrollOffsetY = virtual ? 12 : 0;
    }
    console.log(scroll, this.state.tableWidth, 'tableWidth')
    return (
      <ConditionalDndProvider>
        {this.props.children}
        {this.createSearchBar()}
        <ResizeObserver onResize={this.tableResize}>
          <div ref={this.tableRef}>
            <Table
              {...otherProps}
              {...tableProps}
              rowSelection={rowSelection}
              // size={size || (config.smallSize ? 'small' : 'default')}
              className={tableClassNames.join(' ')}
              components={this.getComponent()}
              dataSource={searchData || data}
              onChange={this.handleTableChange}
              rowKey={this.createRowKey}
              loading={isLoading}
              virtual={virtual || false}
              rowClassName={this.createClassName}
              onRow={(record, index) => ({
                index,
                onClick: () => this.onRowClick(record, index),
                onDoubleClick: () => this.onRowDoubleClick(record, index),
                moveRow: this.moveRow,
                onContextMenu: (e) => this.onRowContextMenu(e, record, index),
              })}
              columns={this.draggableColumns}
              bordered
              style={{height: height + scrollOffsetY, ...style}}
              scroll={scroll}
              listItemHeight={25}
            />
          </div>

        </ResizeObserver>
        {setDialogVisible && <SetColumnsDialog updateColumns={this.updateColumns} columns={columns} visible={setDialogVisible} tableWidth={tableWidth} handleModalVisible={this.hideSetTableTitleVisible} />}
      </ConditionalDndProvider>
    );
  }
}

export default StandardTable;
