import React, { PureComponent, createRef } from 'react';
import { Table, List, Card, Radio } from 'antd';
import { Resizable } from 'react-resizable';
import ResizeObserver from "rc-resize-observer"
import _ from 'lodash';
import { l } from 'utils/localization';
import classNames from "classnames"
import config from 'utils/config';
import moment, { isMoment } from 'moment';
import styles from './index.less';
import SearchBar from './searchBar';
import 'react-resizable/css/styles.css';



const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};


class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const state = {
      data: [],
      total: 0,
      current: 1,
      sorter: {},
      searchObj: {},
      switchGroup: 'table',
      isSearch: false,
      isLoading: false,
      tableWidth: 0,
      selectedRowKeys: props.selectRowKeys || [],
      searchInputValue: '',
      columns: props.columns || [],
      pageSize: props.defaultPageSize || 30,
    };
    this.initState(state, props);
    this.state = state;
    this.request = 1;
    this.gridRef = createRef()
    this.widthColumnCount = props.columns ? props?.columns?.filter(({ width }) => !width).length : 0
    this.mergedColumns = props.columns ? props?.columns?.map(item => {
      if (item.width) {
        return item
      }
      return {
        ...item,
        width: Math.floor(this.state.tableWidth / this.widthColumnCount),
      }
    }) : []
    const obj = {}
    Object.defineProperty(obj, "scrollLeft", {
      get: () => {
        if (this.gridRef.current) {
          return this.gridRef.current?.state?.scrollLeft
        }
        return null
      },
      set: (scrollLeft) => {
        if (this.gridRef.current) {
          this.gridRef.current.scrollTo({ scrollLeft })
        }
      },
    })
    this.connectObject = obj
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
    if (!this.props.isStopGetTableData) {
      this.createTimer();
    }
  }

  initState(state, props) {
    const { searchArray = [] } = props;
    const { total } = this.state || {};
    const searchObj = {};

    (searchArray || []).forEach(item => {
      if (item.value) {
        searchObj[item.field] = item.value;
      }
    });
    state.total = total || 0;
    state.current = 1;
    state.searchObj = searchObj;
  }

  createTimer = () => {
    this.getTableData()
    if (!this.timer && this.props.createTimer) {
      this.timer = setInterval(this.getTableData, this.props.timeInterval || 2000)
    }
  }

  componentWillReceiveProps(nextProps) {
    const state = {};

    if (!_.isEqual(this.props.selectedRecord, nextProps.selectedRecord)) {
      state.selectedRecord = nextProps.selectedRecord
    }

    if (!_.isEqual(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
      state.selectedRowKeys = nextProps.selectedRowKeys;
    }

    if (!_.isEqual(this.props.params, nextProps.params)) {
      state.current = 1;
    }

    if (!_.isEqual(this.props.searchArray, nextProps.searchArray)) {
      this.initState(state, nextProps)
    }

    if (!_.isEqual(this.props.columns, nextProps.columns)) {
      state.columns = nextProps.columns;
    }

    if (!_.isEmpty(state)) {
      this.setState(state);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isUpdate !== prevProps.isUpdate ||
      this.state.pageSize !== prevState.pageSize ||
      this.state.isSearch !== prevState.isSearch ||
      !_.isEqual(this.props.params, prevProps.params) ||
      !_.isEqual(this.state.sorter, prevState.sorter) ||
      this.props.disabledRequest !== prevProps.disabledRequest) {
      this.request = 1
      const disabledRequest = this.state.pageSize !== prevState.pageSize || this.state.isSearch !== prevState.isSearch || !_.isEqual(this.state.sorter, prevState.sorter);
      this.getTableData(this.state, disabledRequest)
    }
    if (this.state.current !== prevState.current) {
      if (this.props.disabledRequestByCurrent) {
        return false;
      } else {
        this.request = 1
        this.getTableData(this.state, true)
      }
    }
    if (this.state.tableWidth !== prevState.tableWidth) {
      this.resetVirtualGrid()
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  filterSearchObj = (searchObj, dateFormat) => {
    const params = {};
    for (const i in searchObj) {
      if (searchObj[i]) {
        if (isMoment(searchObj[i])) {
          params[i] = moment(searchObj[i]).format(dateFormat || 'YYYY-MM-DD HH:mm:ss');
        } else {
          params[i] = searchObj[i];
        }
        if (_.isArray(searchObj[i]) && searchObj[i][0]) {
          params[i] = [moment(searchObj[i][0]).format(dateFormat || 'YYYY-MM-DD HH:mm:ss'), moment(searchObj[i][1]).format(dateFormat || 'YYYY-MM-DD HH:mm:ss')];
        }
        if (_.isArray(searchObj[i]) && !searchObj[i][0]) {
          delete params[i];
        }
      }
    }
    return params;
  }

  sorterOrFilterData = () => {
    const { data, searchObj, sorter } = this.state;
    if (_.isEmpty(searchObj) && !sorter.order) {
      this.setState({ searchData: false })
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
      let searchData = list;
      if (sorter.order) {
        searchData = this.sorterData(list, sorter)
      }
      this.setState({ searchData })
    }
  }

  sorterData = (list, sorter) => {
    const { field, order, column } = sorter;
    const type = column.fieldType;
    if (type === 'number') {
      return list.sort((a, b) => order === 'ascend' ? a[field] - b[field] : b[field] - a[field])
    } else if (type === 'string') {
      return list.sort((a, b) => order === 'ascend' ? (a[field] || '').localeCompare(b[field] || '') : (b[field] || '').localeCompare(a[field] || ''))
    }
    return list;
  }

  getTableData = (state, disable) => {
    const paramsState = state || this.state || {};
    const { current, pageSize, searchObj, sorter } = paramsState;
    const { dataKey, dispatch, action, params = {},
      orderField, dateFormat, onRowClick, hasDefaultValue, getTotal, totalField, disabledRequest, defaultData, emptyPayload, sorterAndSearchInWeb } = this.props;
    const orderParams = {};
    if (disabledRequest || !_.isUndefined(defaultData) || !_.isFunction(dispatch)) {
      if (onRowClick) onRowClick(defaultData[0] || {})
      return false
    };
    if (sorterAndSearchInWeb && disable && this.state.data && this.state.data.length > 0) return this.sorterOrFilterData()
    if (_.keys(sorter).length > 0 && sorter.order) {
      orderParams.order = sorter.order;
      orderParams[orderField || 'field'] = sorter.field;
    }
    const tableParams = { currentPage: current, pageSize, ...orderParams, ...params };
    if (!_.isEmpty(searchObj)) {
      const stateS = this.filterSearchObj(searchObj, dateFormat);
      tableParams.s = { ...stateS, ...params.s };
    }
    this.setState({
      isLoading: true,
    })

    dispatch({
      type: action,
      payload: emptyPayload ? {} : tableParams,
      callback: (res) => {
        const data = res[dataKey] || res.data || [];
        if (tableParams.currentPage !== 1 && data.length < 1) {
          this.setState({
            current: 1,
            data,
            isLoading: false,
            total: res.total || 0,
          })
        } else {
          if (this.props.callbackData) {
            this.props.callbackData(data, tableParams, res);
          }
          this.setState({ data, isLoading: false, total: res.total || 0 })
          if (getTotal) {
            getTotal(res[totalField] || res.total || data.length || 0)
          }
          if (onRowClick && hasDefaultValue && res.data && res.data[0]) {
            onRowClick(res.data[0])
          } else if (onRowClick) {
            onRowClick({})
          }
        }
        this.request += 1
      },
    })
  }

  updateSearchObj = (value, key) => {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }
    const { searchObj } = this.state;
    const newSearchObj = _.cloneDeep(searchObj);
    newSearchObj[key] = value;
    this.setState({
      searchObj: newSearchObj,
    })
  }

  onReset = () => {
    const { isSearch } = this.state;
    const { reset } = this.props;
    if (reset) {
      reset()
    }
    this.setState({
      current: 1,
      sorter: {},
      pageSize: this.props.defaultPageSize || 30,
      searchObj: {},
      isSearch: !isSearch,
    })
  }

  createSearchBar = () => {
    const { searchArray, extraButton, colSpan, otherButton, colProps, searchRightDisplay } = this.props;
    const { searchObj = {}, isSearch, columns } = this.state;

    return (
      <SearchBar
        columns={columns}
        colSpan={colSpan}
        colProps={colProps}
        isSearch={isSearch}
        searchObj={searchObj}
        onReset={this.onReset}
        onSearch={this.onSearch}
        otherButton={otherButton}
        extraButton={extraButton}
        searchArray={searchArray}
        searchRightDisplay={searchRightDisplay}
        updateSearchObj={this.updateSearchObj}
      />
    )
  }

  createClassName = (record, index) => {
    const { hoverSelected = {}, selectedRecord = {} } = this.state;
    const { rowClassName, activeClass, rowKey, needHoverStatus } = this.props;
    const key = this.createRowKey(record);
    const hoverKey = this.createRowKey(hoverSelected);
    const selectedKey = this.createRowKey(selectedRecord);

    const isSelected = key === selectedKey;
    let className = index % 2 === 0 ? 'double_fixed_data_table2_row' : 'single_fixed_data_table2_row';
    if (needHoverStatus && hoverKey) {
      className += ' hover-select-table-row'
    }

    let selectedClassName = index % 2 === 0 ? 'single_fixed_data_table2_select_row' : 'single_fixed_data_table2_select_row';

    if (isSelected) {
      if (rowClassName) {
        selectedClassName += typeof rowClassName === 'string' ? " " + rowClassName : " " + rowClassName(record, index);
      }
      if (activeClass) {
        return selectedClassName + " " + activeClass;
      }
      return selectedClassName + ' ant-table-row-selected';
    }
    return className;
  }

  onSearch = () => {
    const { isSearch, searchObj } = this.state;
    const { searchFun } = this.props;
    if (searchFun) searchFun(searchObj);
    this.setState({
      isSearch: !isSearch,
      current: 1,
    })
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }
    if (this.props.createTimer) {
      this.timer = setInterval(this.getTableData, this.props.timeInterval || 2000)
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRowKeys, selectedRows);
    }
  };

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

  handleTableChange = (pagination, filters, sorterInfo) => {
    const { pageSize, sorter } = this.state;
    const { onTableChange } = this.props
    const { ...nsorter } = sorterInfo;
    const newPageination = {
      sorter: nsorter,
      current: pagination.current,
      pageSize: pagination.pageSize || pageSize,
    };
    if (pageSize !== pagination.pageSize || !_.isEqual(nsorter, sorter)) {
      newPageination.current = 1;
    }
    this.setState(newPageination)
    if (onTableChange) {
      onTableChange(newPageination, filters, sorterInfo)
    }
  };

  handleCardChange = (current, pageSize) => {
    const newPageination = {
      current,
      pageSize,
    };
    this.setState(newPageination)
  }

  onRowClick = (record, index) => {
    this.setState({ selectedRecord: record })
    if (this.props.onRowClick) {
      return this.props.onRowClick(record, index)
    }
  }

  onDoubleClick = (record, index) => {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(record, index)
    }
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width || size.x,
      };
      return { columns: nextColumns };
    });
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  renderCardContent = (record, idx) => {
    const { columns } = this.state;
    return (
      <>
        {columns.map(item => {
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

  createRowKey = (r) => {
    const { rowKey = 'id' } = this.props;
    if (this.props.createRowKey) {
      return this.props.createRowKey(r);
    }
    return r[rowKey];
  }

  clearData = (callback = null) => {
    this.setState({
      data: [],
    }, callback)
  }

  getDataSource = () => {
    const { defaultData } = this.props;
    const { searchData, data } = this.state;
    return searchData || defaultData || data || [];
  }

  resetVirtualGrid = () => {
    this.gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    })
  }

  render() {
    const { selectedRowKeys, columns, current, pageSize, data, total, isLoading, switchGroup, searchData } = this.state;
    const { action, loading, isDraggable, components, moveRow, activeClass, pagePosition, pageSizeOptions, scroll, pagination, showTotal,
      rowKey, noRowSelection, rowSelectionType, expandedRowRender, showHeader, noPager, size, searchPosition, otherLoading, defaultData,
      tableCardSwitch, hideOnSinglePage = true, stopLoading, getCheckboxProps, selectAllProps, isVirtual = false, rowSelectionProps = null, ...tableProps } = this.props;
    if (components) {
      this.components = components;
      this.components.header = {
        cell: ResizeableTitle,
      };
    };

    if (isDraggable) {
      this.draggableColumns = columns.map((col, index) => ({
        ...col,
        onHeaderCell: column => {
          return {
            width: column.width,
            onResize: this.handleResize(index),
          }
        },
      }));
    }

    const rowSelection = noRowSelection ? null : {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => {
        if (getCheckboxProps) return getCheckboxProps(record);
        return {
          disabled: record.disabled,
        }
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selectAllProps) return selectAllProps(selected, selectedRows, changeRows)
      },
      type: rowSelectionType || 'checkbox',
    };

    const otherProps = {};
    const paginationProps = { current, pageSize, total, showSizeChanger: false, hideOnSinglePage };

    if (pageSizeOptions) {
      paginationProps.showSizeChanger = true;
      paginationProps.pageSizeOptions = pageSizeOptions;
    }

    if (pagePosition) {
      paginationProps.position = pagePosition;
    }

    if (expandedRowRender) otherProps.expandedRowRender = expandedRowRender;
    if (showHeader === false) otherProps.showHeader = false;
    if (noPager !== true) {
      otherProps.pagination = { ...paginationProps, ...pagination };
    } else otherProps.pagination = false;
    if (showTotal && otherProps.pagination) {
      otherProps.pagination.showTotal = (t, range) => l('{0}-{1} of {2} items', range[0], range[1], t);
    }
    let stateLoading = false;
    if (!stopLoading) {
      if (this.request === 1) {
        stateLoading = isLoading;
      }
      if (otherLoading) {
        stateLoading = true;
      }
    }
    return (
      <ResizeObserver
        onResize={({ width }) => {
          this.setState({ tableWidth: width })
        }}
      >
        <div className={styles.standardTable}>
          <div style={{ marginTop: '10px' }}> {this.createSearchBar()}</div>
          {tableCardSwitch && this.createSwitch()}
          <Table
            loading={stateLoading}
            rowKey={this.createRowKey}
            rowSelection={rowSelectionProps || rowSelection}
            components={this.components}
            dataSource={this.getDataSource()}
            onChange={this.handleTableChange}
            scroll={{ ...scroll }}
            {...otherProps}
            {...tableProps}
            rowClassName={this.createClassName}
            onRow={(record, index) => ({
              index,
              onClick: () => this.onRowClick(record, index),
              onDoubleClick: () => this.onDoubleClick(record, index),
              moveRow: moveRow || null,
            })}
            size='small'
            columns={isDraggable ? this.draggableColumns : columns}
          />
        </div>
      </ResizeObserver>
    );
  }
}

export default StandardTable;
