import React, { PureComponent, createRef, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Dropdown, Tree } from 'antd';
import { MoreOutlined, ArrowUpOutlined, ArrowDownOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { connect } from 'dva';
import { getStorageData, setStorageData } from 'utils/storage';
import { parseJson } from 'utils/utils';
import ResizeObserver from 'rc-resize-observer';
import SearchBar from '../newStandardTable/searchBar';
import AutoSizeDialog from 'components/Dialog';
import './index.less';

// 注册 AG Grid 模块
ModuleRegistry.registerModules([AllCommunityModule]);

// 自定义表头组件 - 带更多图标和下拉菜单
const CustomHeader = (props) => {
  const { displayName, column, api, setColumnConfig, enableSorting, progressSort, setSort, onAdjustColumns } = props;
  const colId = column.colId;
  // 从 column 的 colDef 中获取 textAlign，如果没有则默认左对齐
  const textAlign = column?.getColDef?.()?.textAlign || column?.colDef?.textAlign || 'left';

  // 使用 state 来存储排序状态，以便在排序变化时重新渲染
  const [sort, setSortState] = React.useState(column?.getSort?.() || null);

  // 监听排序变化
  React.useEffect(() => {
    const onSortChanged = () => {
      setSortState(column?.getSort?.() || null);
    };

    if (api) {
      api.addEventListener('sortChanged', onSortChanged);
      return () => {
        api.removeEventListener('sortChanged', onSortChanged);
      };
    }
  }, [api, column]);

  const handleMenuClick = (e) => {
    e.domEvent.stopPropagation();
    const key = e.key;

    switch (key) {
      case 'align_center':
        setColumnConfig(colId, { textAlign: 'center' });
        break;
      case 'align_left':
        setColumnConfig(colId, { textAlign: 'left' });
        break;
      case 'align_right':
        setColumnConfig(colId, { textAlign: 'right' });
        break;
      case 'sort_asc':
        setColumnConfig(colId, { sort: 'asc' });
        break;
      case 'sort_desc':
        setColumnConfig(colId, { sort: 'desc' });
        break;
      case 'pin_left':
        setColumnConfig(colId, { fixed: 'left' });
        break;
      case 'pin_right':
        setColumnConfig(colId, { fixed: 'right' });
        break;
      case 'unpin':
        setColumnConfig(colId, { fixed: null });
        break;
      case 'hide':
        setColumnConfig(colId, { hidden: true });
        break;
      case 'adjust_columns':
        onAdjustColumns?.();
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { key: 'align_center', label: '文本居中' },
    { key: 'align_left', label: '文本居左' },
    { key: 'align_right', label: '文本居右' },
    { type: 'divider' },
    { key: 'sort_asc', label: '正序' },
    { key: 'sort_desc', label: '倒序' },
    { type: 'divider' },
    { key: 'pin_left', label: '固定左侧' },
    { key: 'pin_right', label: '固定右侧' },
    { key: 'unpin', label: '取消固定' },
    { type: 'divider' },
    { key: 'hide', label: '隐藏' },
    { key: 'adjust_columns', label: '调整表头' },
  ];

  const handleHeaderClick = (e) => {
    // 点击更多图标时不触发排序
    if (e.target.closest('.ag-header-more-icon')) return;
    if (enableSorting && progressSort) {
      progressSort(false);
    }
  };

  // 渲染排序图标
  const renderSortIcon = () => {
    if (!sort) return null;
    return sort === 'asc'
      ? <ArrowUpOutlined className="ag-header-sort-icon" />
      : <ArrowDownOutlined className="ag-header-sort-icon" />;
  };
  return (
    <div className="ag-custom-header" onClick={handleHeaderClick} style={{ textAlign, width: '100%' }}>
      <span className="ag-header-cell-text">{displayName}</span>
      {renderSortIcon()}
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['click']}
        placement="bottomRight"
      >
        <MoreOutlined
          className="ag-header-more-icon"
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    </div>
  );
};

// 展开图标单元格渲染器
const ExpanderCellRenderer = (props) => {
  const { data, isExpanded, onToggleExpand, rowKey } = props;
  const id = _.isFunction(rowKey) ? rowKey(data) : data[rowKey];

  const handleClick = (e) => {
    e.stopPropagation();
    onToggleExpand(id, data);
  };

  return (
    <span
      className="ag-expander-icon"
      onClick={handleClick}
      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}
    >
      {isExpanded ? <DownOutlined style={{ fontSize: 12 }} /> : <RightOutlined style={{ fontSize: 12 }} />}
    </span>
  );
};

// 展开行详情渲染器 - 支持高度自适应
const DetailRowRenderer = (props) => {
  const { expandedRowRender, data, onHeightChange } = props;
  const containerRef = React.useRef(null);
  const heightRef = React.useRef(0);

  React.useEffect(() => {
    if (!containerRef.current || !onHeightChange) return;

    const resizeObserver = new window.ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        // 只有高度变化超过 1px 时才通知更新，避免频繁触发
        if (Math.abs(heightRef.current - height) > 1) {
          heightRef.current = height;
          onHeightChange(height);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [onHeightChange]);

  return (
    <div ref={containerRef} style={{ padding: '10px 20px', background: 'var(--ag-background-color, #fff)' }}>
      {expandedRowRender(data)}
    </div>
  );
};

/**
 * AG Grid 封装组件 (Class 写法)
 * 兼容 newStandardTable 的 API，支持渐进式迁移
 *
 * 兼容的 props（与 newStandardTable 对齐）：
 * - columns: 列配置
 * - data: 数据源，支持 { list: [] } 格式或直接数组
 * - height: 表格高度
 * - loading: 加载状态
 * - pagination: 是否分页
 * - pageSize: 每页条数
 * - selectedRowKeys: 选中的行 keys
 * - onSelectRow: 行选择回调
 * - onRowClick: 行点击回调
 * - onRowDoubleClick: 行双击回调
 * - expandedRowRender: 展开行渲染
 * - rowKey: 行唯一标识字段或函数
 * - rowClassName: 行类名
 * - rowSelectionType: 选择类型 'checkbox' | 'radio'
 * - tableKey: 表格唯一标识（用于保存配置）
 * - searchObj: 搜索对象
 * - onSearch: 搜索回调
 * - onReset: 重置回调
 * - searchShowMore: 搜索栏显示更多
 * - extraButton: 额外按钮
 * - otherButton: 其他按钮
 * - enableHeaderDrag: 是否启用表头拖拽
 * - children: 子元素
 * - style: 样式
 * - className: 类名
 * - showHeader: 是否显示表头
 * - noPager: 是否禁用分页
 */

class AgTable extends PureComponent {
  static defaultProps = {
    columns: [],
    data: [],
    height: 540,
    loading: false,
    pagination: true,
    pageSize: 30,
    selectedRowKeys: [],
    rowSelectionType: 'checkbox',
    rowKey: 'id',
    bordered: true,
    enableHeaderDrag: true,
    showHeader: true,
    noPager: false,
    searchObj: {},
    themeName: 'dark',
    rowHeight: 25,       // 行高
    headerHeight: 40,    // 表头高度
  };

  constructor(props) {
    super(props);
    this.gridRef = createRef();
    this.tableKey = props.tableKey;
    this._isUnmounted = false;
    this.prevThemeName = null;
    this.columnWidths = null; // 存储临时列宽 { colId: width }
    this.selectedRowIds = new Set(props.selectedRowKeys || []); // 存储选中行的 ID
    this.expandedRowIds = new Set(); // 存储展开行的 ID
    this.detailRowHeights = {}; // 存储每个详情行的高度
    this.state = {
      pageSize: props.pageSize,
      rowData: this.parseData(props.data),
      localSearchObj: props.searchObj,
      columns: this.initColumns(props.columns),
      boxWidth: 0,
      adjustColumnsVisible: false,
      tempCheckedKeys: null,
    };
  }

  // 解析数据，兼容 { list: [] } 格式和数组格式
  parseData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.list && Array.isArray(data.list)) return data.list;
    return [];
  };

  componentDidMount() {
    // 初始化主题名称
    this.prevThemeName = this.props.themeName;
  }

  // 根据主题名称获取 AG Grid 主题样式 (v32 使用 CSS 变量)
  getThemeStyle = () => {
    const { themeName } = this.props;

    // 科技黑主题
    if (themeName === 'techBlack') {
      return {
        '--ag-accent-color': '#214e85',
        '--ag-background-color': '#201f2b',
        '--ag-foreground-color': '#89cad8',
        '--ag-border-color': '#2b4c56',
        '--ag-header-background-color': '#2c4452',
        '--ag-header-foreground-color': '#ffffff',
        '--ag-odd-row-background-color': '#252430',
        '--ag-row-hover-color': '#2a3540',
        '--ag-selected-row-background-color': '#2d4560',
        '--ag-range-selection-background-color': 'rgba(33, 78, 133, 0.3)',
        '--ag-font-size': '12px',
        '--ag-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        '--ag-grid-size': '4px',
        '--ag-focus-border-color': 'transparent',
        colorScheme: 'dark',
      };
    }

    const isDark = themeName === 'dark';

    return isDark ? {
      // 深色主题
      '--ag-accent-color': '#1890FF',
      '--ag-background-color': '#19325a',
      '--ag-foreground-color': '#FFFFFF',
      '--ag-border-color': '#374a64',
      '--ag-header-background-color': '#12437e',
      '--ag-header-foreground-color': '#FFFFFF',
      '--ag-odd-row-background-color': '#19325a',
      '--ag-row-hover-color': '#0f315b',
      '--ag-selected-row-background-color': '#1a4477',
      '--ag-range-selection-background-color': 'rgba(24, 144, 255, 0.2)',
      '--ag-font-size': '12px',
      '--ag-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      '--ag-grid-size': '4px',
      '--ag-focus-border-color': 'transparent',  // 去掉 focus 边框
      colorScheme: 'dark',
    } : {
      // 浅色主题
      '--ag-accent-color': '#1890FF',
      '--ag-background-color': '#ffffff',
      '--ag-foreground-color': '#333333',
      '--ag-border-color': '#e8e8e8',
      '--ag-header-background-color': '#fafafa',
      '--ag-header-foreground-color': '#333333',
      '--ag-odd-row-background-color': '#ffffff',
      '--ag-row-hover-color': '#f5f5f5',
      '--ag-selected-row-background-color': '#e6f7ff',
      '--ag-range-selection-background-color': 'rgba(24, 144, 255, 0.1)',
      '--ag-font-size': '12px',
      '--ag-font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      '--ag-grid-size': '4px',
      '--ag-focus-border-color': 'transparent',  // 去掉 focus 边框
      colorScheme: 'light',
    };
  }

  componentWillUnmount() {
    this._isUnmounted = true;
    // 取消防抖函数
    if (this.debouncedUpdateColumns && this.debouncedUpdateColumns.cancel) {
      this.debouncedUpdateColumns.cancel();
    }
  }

  // 初始化列配置，与 newStandardTable 保持一致
  initColumns = (columns) => {
    if (_.isEmpty(columns)) return [];

    const defaultColumns = [];
    for (const i of columns) {
      let width = i.width;
      // 如果没有设置宽度，根据标题文字计算宽度
      if (!width) {
        width = _.isString(i.title) ? i.title.pxWidth(14) + 20 : 100;
      }

      defaultColumns.push({ ...i, width });
    }
    return defaultColumns;
  };

  // 容器大小变化时重新计算列宽，与 newStandardTable 的 tableResize 逻辑一致
  // 只在首次渲染或容器宽度变化时计算，不覆盖用户手动调整的列宽
  onTableResize = (e) => {
    const containerWidth = e.width;
    const { columns, pageSize, boxWidth } = this.state;

    // 首次渲染时 boxWidth 为 0，需要初始化列配置
    const isFirstRender = !boxWidth;

    // 避免重复计算（容器宽度变化小于 3px 不处理）
    if (!isFirstRender && Math.abs(boxWidth - containerWidth) < 3) return;

    if (_.isEmpty(columns)) return;

    // 如果不是首次渲染，只更新 boxWidth，不重新计算列宽（保留用户手动调整的列宽）
    if (!isFirstRender) {
      this.setState({ boxWidth: containerWidth });
      return;
    }

    // 首次渲染时计算列宽
    // 计算固定列(is_disabled/fixed)的宽度偏移
    let offsetX = 0;
    const { onSelectRow, expandedRowRender, height, pagination, rowHeight, headerHeight } = this.props;

    // 选择列占用宽度
    if (onSelectRow) {
      offsetX += 40;
    }
    // 展开行占用宽度
    if (expandedRowRender) {
      offsetX += 40;
    }

    // 固定列占用宽度
    for (const col of columns) {
      if (col.is_disabled || col.fixed) {
        offsetX += col.width;
      }
    }

    // 滚动条宽度固定为 14px
    const scrollbarWidth = 14;

    // 先计算可见列宽度之和，判断是否需要纵向滚动
    let visibleWidth = 0;
    for (const col of columns) {
      if (!col.hidden) {
        visibleWidth += col.width;
      }
    }

    // 判断是否需要显示纵向滚动条：数据行高 * 行数 + 表头高 > 表格高度
    // 使用 props 传入的 rowHeight 和 headerHeight
    const { rowData } = this.state;
    const tableContentHeight = (rowData?.length || 0) * rowHeight + headerHeight;
    const hasVerticalScroll = height && tableContentHeight > height;

    // 可用宽度 = 容器宽度 - 固定列偏移 - 纵向滚动条宽度（如果需要）
    const availableWidth = hasVerticalScroll ? containerWidth - offsetX - scrollbarWidth : containerWidth - offsetX;

    // 计算所有非固定列的宽度总和
    let totalWidth = 0;
    let unfixedVisibleWidth = 0;
    for (const col of columns) {
      if (col.is_disabled || col.fixed) continue;
      totalWidth += col.width;
      if (!col.hidden) {
        unfixedVisibleWidth += col.width;
      }
    }

    // 重新计算每列宽度
    const newColumns = [];
    let idx = -1;
    for (const col of columns) {
      idx += 1;
      // 固定列保持原宽度
      if (col.is_disabled || col.fixed) {
        newColumns.push({ ...col, index: _.isUndefined(col.index) ? idx : col.index });
      } else {
        // 如果可见列宽度之和小于可用宽度，按比例放大
        const newWidth = unfixedVisibleWidth < availableWidth
          ? (col.width / totalWidth) * availableWidth
          : col.width;
        newColumns.push({
          ...col,
          width: newWidth,
          index: _.isUndefined(col.index) ? idx : col.index,
        });
      }
    }
    this.setState({
      columns: newColumns,
      boxWidth: containerWidth,
    }, () => {
      // 保存列配置到本地存储
      if (this.tableKey && !_.isEmpty(newColumns)) {
        setStorageData(this.tableKey, JSON.stringify({ columns: newColumns, pageSize }));
      }
    });
  };

  // 加载存储的列状态
  loadColumnState = () => {
    if (!this.tableKey) return null;
    const configStr = getStorageData(this.tableKey);
    if (configStr) {
      const config = parseJson(configStr, {});
      return config.columnState || config.columns;
    }
    return null;
  };

  // 保存列状态
  saveColumnState = () => {
    if (!this.tableKey) return;
    if (this.gridRef.current && this.gridRef.current.api) {
      const { pageSize } = this.state;
      const columnState = this.gridRef.current.api.getColumnState();
      const currentColumns = this.state.columns;

      // 按照 AG Grid 的列顺序重建 columns
      const columns = columnState.map((state) => {
        const col = currentColumns.find(c => c.dataIndex === state.colId);
        if (col) {
          return { ...col, width: state.width, hidden: state.hide };
        }
        return null;
      }).filter(Boolean);

      // 添加可能不在 columnState 中的列
      currentColumns.forEach((col) => {
        if (!columnState.find(s => s.colId === col.dataIndex)) {
          columns.push(col);
        }
      });

      setStorageData(this.tableKey, JSON.stringify({ columns, pageSize }));
    }
  };

  // 设置列配置（对齐方式、排序、固定、隐藏等）
  setColumnConfig = (colId, config) => {
    if (this._isUnmounted) return;

    const { columns, pageSize, boxWidth } = this.state;
    let newColumns = columns.map((col) => {
      if (col.dataIndex === colId) {
        return { ...col, ...config };
      }
      return col;
    });

    // 如果是排序操作，需要清除其他列的排序状态
    if (config.sort !== undefined) {
      newColumns = newColumns.map((col) => {
        if (col.dataIndex !== colId && col.sort) {
          return { ...col, sort: null };
        }
        return col;
      });
    }

    // 如果是隐藏操作，检查是否需要重新计算列宽
    if (config.hidden === true) {
      newColumns = this.recalculateColumnWidths(newColumns, boxWidth);
    }

    this.setState({ columns: newColumns }, () => {
      if (this._isUnmounted) return;
      if (this.tableKey) {
        setStorageData(this.tableKey, JSON.stringify({ columns: newColumns, pageSize }));
      }
    });
  };

  // 重新计算列宽（当列隐藏或显示时）
  recalculateColumnWidths = (columns, boxWidth) => {
    if (!boxWidth) return columns;

    const { onSelectRow, expandedRowRender, height, rowHeight, headerHeight } = this.props;

    // 计算固定列宽度
    let fixedWidth = 0;
    if (onSelectRow) fixedWidth += 40;
    if (expandedRowRender) fixedWidth += 40;

    for (const col of columns) {
      if (col.is_disabled || col.fixed) {
        fixedWidth += col.width;
      }
    }

    // 判断是否有纵向滚动条
    const { rowData } = this.state;
    const tableContentHeight = (rowData?.length || 0) * rowHeight + headerHeight;
    const hasVerticalScroll = height && tableContentHeight > height;

    // 滚动条宽度
    const scrollbarWidth = 14;

    // 计算可用宽度
    let availableWidth = boxWidth - fixedWidth;
    if (hasVerticalScroll) {
      availableWidth -= scrollbarWidth;
    }

    // 计算可见列宽度之和（非固定列）
    let visibleWidth = 0;
    for (const col of columns) {
      if (!col.hidden && !col.is_disabled && !col.fixed) {
        visibleWidth += col.width;
      }
    }

    // 如果可见列宽度小于可用宽度，按比例放大
    if (visibleWidth < availableWidth && visibleWidth > 0) {
      const ratio = availableWidth / visibleWidth;
      return columns.map(col => {
        if (col.hidden || col.is_disabled || col.fixed) return col;
        return { ...col, width: Math.floor(col.width * ratio) };
      });
    }

    return columns;
  };

  // 打开/关闭调整表头弹框
  handleAdjustColumnsVisible = (visible) => {
    if (this._isUnmounted) return;
    this.setState({
      adjustColumnsVisible: visible,
      tempCheckedKeys: null,
    });
  }

  // 处理调整表头弹框中的列勾选
  handleColumnCheck = (checkedKeys) => {
    this.setState({ tempCheckedKeys: checkedKeys });
  }

  // 确认调整表头
  handleAdjustColumnsOk = () => {
    const { columns, pageSize, boxWidth, tempCheckedKeys } = this.state;

    // 使用临时勾选状态，如果没有则使用当前列状态
    const checkedKeySet = new Set(tempCheckedKeys || columns.filter(c => !c.hidden).map(c => c.dataIndex));

    // 更新列的隐藏状态
    let newColumns = columns.map(col => ({
      ...col,
      hidden: !checkedKeySet.has(col.dataIndex),
    }));

    // 重新计算列宽
    newColumns = this.recalculateColumnWidths(newColumns, boxWidth);

    this.setState({
      columns: newColumns,
      adjustColumnsVisible: false,
      tempCheckedKeys: null,
    }, () => {
      if (this._isUnmounted) return;
      if (this.tableKey) {
        setStorageData(this.tableKey, JSON.stringify({ columns: newColumns, pageSize }));
      }
    });
  }

  // IP 地址转数值（用于 IP 排序）
  ipToNumber = (ip) => {
    if (!ip) return 0;
    const parts = String(ip).split('.');
    let result = 0;
    for (let i = 0; i < 4; i++) {
      result = result * 256 + (parseInt(parts[i], 10) || 0);
    }
    return result;
  };

  // 根据 dataType 返回对应的比较器函数
  getComparator = (dataType) => {
    // 数值类型：按数字排序
    if (['long', 'integer', 'number'].includes(dataType)) {
      return (valueA, valueB, nodeA, nodeB, isInverted) => {
        const numA = parseFloat(valueA) || 0;
        const numB = parseFloat(valueB) || 0;
        return numA - numB;
      };
    }

    // IP 类型：按 IP 地址数值排序
    if (dataType === 'ip') {
      return (valueA, valueB, nodeA, nodeB, isInverted) => {
        return this.ipToNumber(valueA) - this.ipToNumber(valueB);
      };
    }

    // 字符串类型或默认：按字典序排序
    return (valueA, valueB, nodeA, nodeB, isInverted) => {
      return String(valueA || '').localeCompare(String(valueB || ''));
    };
  };

  // 转换 columns 为 AG Grid 的 columnDefs
  // 兼容 Antd Table 的 columns 配置
  getColumnDefs = () => {
    const { columns } = this.state;
    const { enableColumnDrag, enableRowDrag, rowKey, expandedRowRender, onSelectRow, rowSelectionType } = this.props;

    if (_.isEmpty(columns)) return [];

    const defs = [];
    const isRadio = rowSelectionType === 'radio';

    // 1. 如果有展开行渲染函数，添加展开列（最左侧）
    if (expandedRowRender) {
      defs.push({
        field: '__expander__',
        headerName: '',
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        resizable: false,
        sortable: false,
        filter: false,
        pinned: 'left',
        lockPosition: true,
        suppressMovable: true,
        suppressSizeToFit: true,
        headerComponent: () => null, // 不显示表头
        cellRenderer: (params) => {
          // 跳过详情行
          if (params.data.__isDetailRow__) return null;
          const id = _.isFunction(rowKey) ? rowKey(params.data) : params.data[rowKey];
          const isExpanded = this.expandedRowIds.has(id);
          return (
            <ExpanderCellRenderer
              data={params.data}
              isExpanded={isExpanded}
              onToggleExpand={this.handleToggleExpand}
              rowKey={rowKey}
            />
          );
        },
      });
    }

    // 2. 添加选择列（仅 radio 模式需要手动创建，checkbox 模式由 AG Grid 自动创建）
    if (onSelectRow && isRadio) {
      console.log(1)
      const selectorCol = {
        field: '__selector__',
        headerName: '',
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        resizable: false,
        sortable: false,
        filter: false,
        pinned: 'left',
        lockPosition: true,
        suppressMovable: true,
        suppressSizeToFit: true,
        suppressRowClickSelection: false,
        suppressHeaderMenuButton: true,
        headerComponent: () => null,
        cellRenderer: (params) => {
          if (params.data.__isDetailRow__) return null;
          const id = _.isFunction(rowKey) ? rowKey(params.data) : params.data[rowKey];
          const isSelected = this.selectedRowIds.has(id);
          return (
            <input
              type="radio"
              checked={isSelected}
              onChange={() => this.handleRadioSelect(id, params.data)}
              style={{ cursor: 'pointer' }}
            />
          );
        },
      };
      defs.push(selectorCol);
    }

    // 2.5 v32: checkbox 模式需要手动添加 checkbox 列
    if (onSelectRow && !isRadio) {
      console.log(2)

      defs.push({
        field: '__checkbox__',
        headerName: '',
        width: 40,
        minWidth: 40,
        maxWidth: 40,
        resizable: false,
        sortable: false,
        filter: false,
        pinned: 'left',
        lockPosition: true,
        suppressMovable: true,
        suppressSizeToFit: true,
        suppressRowClickSelection: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      });
    }

    const columnDefs = columns.map((col, index) => {
      // 优先从临时存储获取宽度
      const width = (this.columnWidths && this.columnWidths[col.dataIndex]) || col.width || 150;

      const def = {
        field: col.dataIndex,
        headerName: _.isString(col.title) ? col.title : '',
        width,
        minWidth: col.minWidth || 50,
        maxWidth: col.maxWidth,
        resizable: true,
        sortable: col.sorter !== false,
        filter: false,
        movable: enableColumnDrag && !col.fixed && !col.is_disabled,
        lockPosition: !!(col.fixed || col.is_disabled),
        pinned: col.fixed || null,
        suppressMovable: !!(col.fixed || col.is_disabled),
        hide: col.hidden || false,
        suppressSizeToFit: !!(col.fixed || col.is_disabled),
        sort: col.sort || null,
        // 根据 dataType 添加比较器
        comparator: col.sorter !== false ? this.getComparator(col.dataType) : undefined,
      };

      // 行拖拽 - 在第一个非隐藏列上启用
      if (enableRowDrag && !col.hidden) {
        // 检查是否是第一个可见列
        const isFirstVisible = columns.slice(0, index).every(c => c.hidden);
        if (isFirstVisible) {
          def.rowDrag = true;
        }
      }

      // 自定义表头 - 使用带下拉菜单的表头组件
      def.headerComponent = (params) => (
        <CustomHeader
          {...params}
          setColumnConfig={this.setColumnConfig}
          enableSorting={col.sorter !== false}
          onAdjustColumns={() => this.handleAdjustColumnsVisible(true)}
        />
      );

      // 传递 textAlign 到 colDef，供表头组件使用
      def.textAlign = col.textAlign || 'left';

      // 自定义渲染 - 兼容 Antd Table 的 render 函数
      // Antd render: (text, record, index) => ReactNode
      // AG Grid cellRenderer: (params) => ReactNode
      if (col.render) {
        def.cellRenderer = (params) => {
          // params.value 单元格值
          // params.data 整行数据
          // params.node.rowIndex 行索引
          // params.colDef 列定义
          const text = params.value;
          const record = params.data;
          const rowIndex = params.node?.rowIndex;

          // 兼容 Antd Table render 函数参数
          // 同时支持 AG Grid 原生 render 函数参数
          try {
            // 先尝试 Antd Table 格式: (text, record, index)
            const result = col.render(text, record, rowIndex);

            // 如果返回 undefined 或 null，显示空字符串或原值
            if (result === undefined || result === null) {
              return text ?? '';
            }

            return result;
          } catch (error) {
            console.error('cellRenderer error:', error);
            return text ?? '';
          }
        };
      }

      // 文本对齐
      def.cellStyle = (params) => {
        const baseStyle = { textAlign: col.textAlign || 'left' };

        // 支持 col.onCell 返回样式
        if (col.onCell) {
          const cellProps = col.onCell(params.data, params.node?.rowIndex);
          if (cellProps?.style) {
            return { ...baseStyle, ...cellProps.style };
          }
        }

        return baseStyle;
      };

      // 支持行类名
      if (col.onCell || col.className) {
        def.cellClass = (params) => {
          const classes = [];
          if (col.className) {
            classes.push(col.className);
          }
          if (col.onCell) {
            const cellProps = col.onCell(params.data, params.node?.rowIndex);
            if (cellProps?.className) {
              classes.push(cellProps.className);
            }
          }
          return classes.join(' ');
        };
      }

      return def;
    });

    return [...defs, ...columnDefs];
  };

  // 默认列配置
  getDefaultColDef = () => ({
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 50,
  });

  // 行选择配置 (v32 使用字符串模式)
  getRowSelection = () => {
    const { onSelectRow, rowSelectionType } = this.props;
    if (!onSelectRow) return undefined;
    // v32 API: 使用字符串 'single' 或 'multiple'
    const isRadio = rowSelectionType === 'radio';
    return isRadio ? 'single' : 'multiple';
  };

  // 处理选择变化 - 兼容 Antd Table 的 onSelectRow
  onSelectionChanged = (event) => {
    const { onSelectRow, onSelectOneRow, onSelectAll, onSelectInvert, rowKey } = this.props;
    const selectedRows = event.api.getSelectedRows();
    const selectedRowKeys = selectedRows.map(row => {
      if (_.isFunction(rowKey)) return rowKey(row);
      return row[rowKey];
    });

    // 保存选中状态到实例
    this.selectedRowIds = new Set(selectedRowKeys);

    // 兼容 Antd Table 的 onSelectRow: (selectedRowKeys, selectedRows) => void
    if (onSelectRow) {
      onSelectRow(selectedRowKeys, selectedRows);
    }
  };

  // 处理行点击 - 兼容 Antd Table 的 onRowClick
  onRowClicked = (event) => {
    const { onRowClick } = this.props;
    if (onRowClick) {
      // Antd: onRowClick(record, index)
      onRowClick(event.data, event.node?.rowIndex);
    }
  };

  // 处理行双击 - 兼容 Antd Table 的 onRowDoubleClick
  onRowDoubleClicked = (event) => {
    const { onRowDoubleClick } = this.props;
    if (onRowDoubleClick) {
      // Antd: onRowDoubleClick(record, index)
      onRowDoubleClick(event.data, event.node?.rowIndex);
    }
  };

  // 行拖拽结束
  onRowDragEnd = (event) => {
    const { onRowMove } = this.props;
    if (onRowMove) {
      const newRowData = [];
      event.api.forEachNode((node) => {
        newRowData.push(node.data);
      });
      onRowMove(newRowData);
    }
  };

  // 列状态变化时保存并更新 state.columns
  onColumnStateChanged = () => {
    if (!this.gridApi || this._isUnmounted) return;

    const { pageSize } = this.state;
    const columnState = this.gridApi.getColumnState();
    const currentColumns = this.state.columns;

    // 根据 AG Grid 的列顺序重建 columns
    const newColumns = columnState.map((state) => {
      const col = currentColumns.find(c => c.dataIndex === state.colId);
      if (col) {
        return {
          ...col,
          width: state.width,
          hidden: state.hide,
          fixed: state.pinned,
        };
      }
      return null;
    }).filter(Boolean);

    // 添加可能被隐藏的列（不在 columnState 中的）
    currentColumns.forEach((col) => {
      if (!columnState.find(s => s.colId === col.dataIndex)) {
        newColumns.push(col);
      }
    });

    this.setState({ columns: newColumns }, () => {
      if (this._isUnmounted) return;
      if (this.tableKey) {
        setStorageData(this.tableKey, JSON.stringify({ columns: newColumns, pageSize }));
      }
    });
  };

  // 防抖更新 state.columns（延迟 300ms 无操作后执行）
  debouncedUpdateColumns = _.debounce(function() {
    const { pageSize, columns } = this.state;
    if (!this.columnWidths) return;

    const newColumns = columns.map((col) => {
      if (this.columnWidths[col.dataIndex] !== undefined) {
        return { ...col, width: this.columnWidths[col.dataIndex] };
      }
      return col;
    });

    this.setState({ columns: newColumns }, () => {
      if (this._isUnmounted) return;
      if (this.tableKey) {
        setStorageData(this.tableKey, JSON.stringify({ columns: newColumns, pageSize }));
      }
    });
  }, 300);

  // 列宽调整时检查，确保所有列宽度之和不小于 boxWidth
  onColumnResized = (event) => {
    const api = this.gridApi || event.api;
    if (!api || !event.column) return;

    const containerWidth = this.state.boxWidth;
    if (containerWidth <= 0) {
      this.saveColumnState();
      return;
    }

    // 获取 AG Grid 当前列状态，临时存储到 this.columnWidths
    const columnState = api.getColumnState();
    this.columnWidths = this.columnWidths || {};
    columnState.forEach((state) => {
      this.columnWidths[state.colId] = state.width;
    });

    // 触发防抖更新
    this.debouncedUpdateColumns();
  };

  // 表格就绪时恢复列状态
  onGridReady = (params) => {
    this.gridApi = params.api;
    const savedColumns = this.loadColumnState();
    if (savedColumns && !_.isEmpty(savedColumns)) {
      // 合并保存的配置和原始列配置（保留 render 等函数属性）
      const originalColumns = this.initColumns(this.props.columns);
      const mergedColumns = savedColumns.map(savedCol => {
        const originalCol = originalColumns.find(c => c.dataIndex === savedCol.dataIndex);
        if (originalCol) {
          // 合并：原始列属性优先（包含 render 等函数），然后用保存的配置覆盖
          return { ...originalCol, ...savedCol };
        }
        return savedCol;
      });
      this.setState({ columns: mergedColumns }, () => {
        // 更新列配置后刷新单元格以应用行拖拽
        if (this.props.enableRowDrag) {
          params.api.refreshCells({ force: true });
        }
        // 恢复选中状态和展开状态（初始化时）
        this.restoreRowStates();
      });
    } else {
      // 没有保存的列配置时，也需要恢复选中状态（初始化时）
      this.restoreRowStates();
    }
  };

  // 分页变化
  onPaginationChanged = (event) => {
    if (!event.api) return;
    const { pageSize } = this.state;
    const newPageSize = event.api.paginationGetPageSize();
    if (newPageSize !== pageSize) {
      this.setState({ pageSize: newPageSize }); // eslint-disable-line react/no-did-update-set-state
    }
  };

  // 搜索栏更新
  updateSearchObj = (value, key) => {
    this.setState(prevState => ({
      localSearchObj: {
        ...prevState.localSearchObj,
        [key]: value,
      },
    }));
  };

  handleSearch = () => {
    const { onSearch } = this.props;
    const { localSearchObj } = this.state;
    if (onSearch) {
      onSearch(localSearchObj);
    }
  };

  handleReset = () => {
    const { onReset } = this.props;
    this.setState({ localSearchObj: {} }); // eslint-disable-line react/no-did-update-set-state
    if (onReset) {
      onReset();
    }
  };

  // 展开行配置
  getDetailCellRenderer = () => {
    const { expandedRowRender } = this.props;
    if (!expandedRowRender) return null;
    return (props) => (
      <div style={{ padding: '10px 20px' }}>
        {expandedRowRender(props.data)}
      </div>
    );
  };

  // 处理单选选择
  handleRadioSelect = (id, data) => {
    const { onSelectRow, rowKey } = this.props;
    // 单选：清空之前的选择，只选中当前行
    this.selectedRowIds = new Set([id]);

    if (this.gridApi) {
      // 清除所有选中状态
      this.gridApi.deselectAll();
      // 选中当前行
      this.gridApi.forEachNode((node) => {
        const nodeId = _.isFunction(rowKey) ? rowKey(node.data) : node.data[rowKey];
        if (nodeId === id) {
          node.setSelected(true);
        }
      });
    }

    if (onSelectRow) {
      onSelectRow([id], [data]);
    }

    // 强制刷新以更新 radio 状态
    this.forceUpdate();
  };

  // 处理展开/收起切换
  handleToggleExpand = (id, data) => {
    const { rowKey, expandedRowRender } = this.props;
    if (!expandedRowRender) return;

    const newExpandedRowIds = new Set(this.expandedRowIds);
    if (newExpandedRowIds.has(id)) {
      newExpandedRowIds.delete(id);
    } else {
      newExpandedRowIds.add(id);
    }
    this.expandedRowIds = newExpandedRowIds;

    // 强制刷新表格以更新展开图标和详情行
    this.forceUpdate();
  };

  // 获取带有展开详情行的 rowData
  getRowDataWithDetails = () => {
    const { rowData } = this.state;
    const { expandedRowRender, rowKey } = this.props;

    if (!expandedRowRender) return rowData;

    const result = [];
    rowData.forEach((row) => {
      const id = _.isFunction(rowKey) ? rowKey(row) : row[rowKey];
      result.push(row);

      // 如果该行展开，插入一个详情行
      if (this.expandedRowIds.has(id)) {
        result.push({
          __isDetailRow__: true,
          __parentData__: row,
          __parentId__: id,
        });
      }
    });

    return result;
  };

  // 处理展开状态变化
  onRowGroupOpened = (event) => {
    const { rowKey } = this.props;
    if (!event.node || !event.data) return;

    const id = _.isFunction(rowKey) ? rowKey(event.data) : event.data[rowKey];
    if (event.node.expanded) {
      this.expandedRowIds.add(id);
    } else {
      this.expandedRowIds.delete(id);
    }
  };

  // 获取行 ID 的回调函数，用于 AG Grid 识别行
  // 当 rowData 变化但 ID 相同时，AG Grid 会自动保持该行的选中状态、展开状态等
  getRowId = (params) => {
    const { rowKey } = this.props;

    // 如果是详情行，使用特殊的 ID
    if (params.data.__isDetailRow__) {
      return `detail_${params.data.__parentId__}`;
    }

    // 如果 rowKey 是函数，调用它
    if (_.isFunction(rowKey)) {
      return String(rowKey(params.data));
    }

    // 如果 rowKey 字段存在，使用它
    if (params.data[rowKey] !== undefined && params.data[rowKey] !== null) {
      return String(params.data[rowKey]);
    }

    // 回退：使用行索引作为唯一 ID
    // 注意：这要求 rowData 的顺序稳定，但比所有行返回相同 ID 好得多
    return `row_${params.node?.rowIndex ?? Math.random()}`;
  };

  // 判断是否为全宽行（详情行）
  isFullWidthRow = (params) => {
    return params.rowNode.data.__isDetailRow__ === true;
  };

  // 全宽单元格渲染器（用于展开详情行）
  fullWidthCellRenderer = (params) => {
    const { expandedRowRender } = this.props;
    if (!expandedRowRender || !params.data.__parentData__) return null;

    const parentId = params.data.__parentId__;
    return (
      <DetailRowRenderer
        expandedRowRender={expandedRowRender}
        data={params.data.__parentData__}
        onHeightChange={(height) => this.handleDetailHeightChange(parentId, height)}
      />
    );
  };

  // 处理详情行高度变化
  handleDetailHeightChange = (parentId, height) => {
    const newHeight = Math.ceil(height) + 20; // 加上 padding (10px * 2)
    if (this.detailRowHeights[parentId] !== newHeight) {
      this.detailRowHeights[parentId] = newHeight;
      // 通知 AG Grid 重新计算行高
      if (this.gridApi) {
        this.gridApi.resetRowHeights();
      }
    }
  };

  // 获取行高度（详情行高度较大，支持自适应）
  getRowHeight = (params) => {
    const { detailRowHeight, rowHeight } = this.props;
    if (params.data.__isDetailRow__) {
      const parentId = params.data.__parentId__;
      // 优先使用已计算的高度，否则使用默认值
      return this.detailRowHeights[parentId] || detailRowHeight || 200;
    }
    return rowHeight;
  };

  // 恢复选中状态和展开状态（仅在初始化时使用）
  restoreRowStates = () => {
    const { rowKey } = this.props;
    if (!this.gridRef.current || !this.gridRef.current.api) return;

    const api = this.gridRef.current.api;

    // 恢复选中状态
    if (this.selectedRowIds.size > 0) {
      api.forEachNode((node) => {
        const id = _.isFunction(rowKey) ? rowKey(node.data) : node.data[rowKey];
        node.setSelected(this.selectedRowIds.has(id));
      });
    }

    // 恢复展开状态
    if (this.expandedRowIds.size > 0) {
      api.forEachNode((node) => {
        const id = _.isFunction(rowKey) ? rowKey(node.data) : node.data[rowKey];
        if (this.expandedRowIds.has(id) && !node.expanded) {
          node.setExpanded(true);
        }
      });
    }
  };

  // 暴露给父组件的方法
  getApi = () => {
    return this.gridRef.current ? this.gridRef.current.api : null;
  };

  refresh = () => {
    if (this.gridRef.current && this.gridRef.current.api) {
      this.gridRef.current.api.refreshCells();
    }
  };

  getData = () => {
    return this.state.rowData;
  };

  getSelectedRows = () => {
    if (this.gridRef.current && this.gridRef.current.api) {
      return this.gridRef.current.api.getSelectedRows();
    }
    return [];
  };

  // 静态方法：初始化列配置
  static initColumnsStatic(columns) {
    if (_.isEmpty(columns)) return [];

    const defaultColumns = [];
    for (const i of columns) {
      let width = i.width;
      // 如果没有设置宽度，根据标题文字计算宽度
      if (!width) {
        width = _.isString(i.title) ? i.title.pxWidth(14) + 20 : 100;
      }
      defaultColumns.push({ ...i, width });
    }
    return defaultColumns;
  }

  // 生命周期
  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {};
    // 兼容 data 可能是 { list: [] } 格式
    const newRowData = nextProps.data?.list || nextProps.data || [];
    if (newRowData !== prevState.rowData && !_.isEqual(newRowData, prevState.rowData)) {
      newState.rowData = newRowData;
    }
    if (nextProps.searchObj !== prevState.prevSearchObj) {
      newState.localSearchObj = nextProps.searchObj;
      newState.prevSearchObj = nextProps.searchObj;
    }
    // columns 变化时重新初始化
    if (nextProps.columns !== prevState.prevPropsColumns) {
      newState.prevPropsColumns = nextProps.columns;
      // 只有在没有 boxWidth 时才重新初始化（首次加载）
      if (!prevState.boxWidth) {
        newState.columns = AgTable.initColumnsStatic(nextProps.columns);
      }
    }
    return Object.keys(newState).length > 0 ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const { selectedRowKeys, rowKey } = this.props;

    // 同步选中状态（外部传入的 selectedRowKeys 变化时）
    if (prevProps.selectedRowKeys !== selectedRowKeys) {
      this.selectedRowIds = new Set(selectedRowKeys || []);

      if (this.gridRef.current && this.gridRef.current.api) {
        this.gridRef.current.api.forEachNode((node) => {
          const key = _.isFunction(rowKey) ? rowKey(node.data) : node.data[rowKey];
          node.setSelected(selectedRowKeys?.includes(key) || false);
        });
      }
    }
  }


  render() {
    const {
      height,
      className,
      style,
      children,
      enableRowDrag,
      enableHeaderDrag,
      searchShowMore,
      extraButton,
      otherButton,
      otherSearchButton,
      colProps,
      colSpan,
      spaceBetweenStyle,
      searchArrayStyle,
      searchRightDisplay,
      isShowRequiredIcon,
      pagination,
      noPager,
      expandedRowRender,
      detailRowHeight,
      loading,
      bordered,
      showHeader,
      rowClassName,
      onRowClick,
      onRowDoubleClick,
      rowHeight,
      headerHeight,
    } = this.props;

    const { columns, pageSize, rowData, localSearchObj } = this.state;

    const columnDefs = this.getColumnDefs();
    const defaultColDef = this.getDefaultColDef();
    const rowSelection = this.getRowSelection();

    // 使用带有展开详情行的数据
    const displayRowData = this.getRowDataWithDetails();

    // 搜索栏配置
    const searchBarProps = {
      columns,
      searchObj: localSearchObj,
      searchShowMore,
      extraButton,
      otherButton,
      otherSearchButton,
      colProps,
      colSpan,
      spaceBetweenStyle,
      searchArrayStyle,
      searchRightDisplay,
      isShowRequiredIcon,
      updateSearchObj: this.updateSearchObj,
      onSearch: this.handleSearch,
      onReset: this.handleReset,
    };
    console.log(this.state.boxWidth, this.state.columns, 1234)

    // 渲染调整表头弹框
    const renderAdjustColumnsDialog = () => {
      const { columns, adjustColumnsVisible, tempCheckedKeys } = this.state;
      // 过滤掉 is_disabled 的列（固定操作列等）
      const adjustableColumns = columns.filter(c => !c.is_disabled);
      // 当前勾选的 keys
      const checkedKeys = tempCheckedKeys !== null ? tempCheckedKeys : columns.filter(c => !c.hidden && !c.is_disabled).map(c => c.dataIndex);

      return (
        <AutoSizeDialog
          title="调整表头"
          visible={adjustColumnsVisible}
          width={400}
          maxHeight={300}
          closable
          onCancel={() => this.handleAdjustColumnsVisible(false)}
          onOk={this.handleAdjustColumnsOk}
        >
          <Tree
            treeData={adjustableColumns}
            fieldNames={{ key: 'dataIndex', title: 'title' }}
            checkable
            defaultExpandedKeys={adjustableColumns.map(c => c.dataIndex)}
            checkedKeys={checkedKeys}
            onCheck={this.handleColumnCheck}
          />
        </AutoSizeDialog>
      );
    };

    return (
      <ResizeObserver onResize={this.onTableResize}>
        <div className={`ag-table-wrapper ${className || ''}`} style={style}>
          {children}
          {/* 搜索栏 */}
          {(columns.some(c => c.isSearch) || extraButton) && (
            <SearchBar {...searchBarProps} />
          )}
          {/* AG Grid 表格 */}
          <div
            className={`ag-theme-quartz ${bordered ? 'ag-table-bordered' : ''}`}
            style={{ height, width: '100%', ...this.getThemeStyle() }}
          >
            <AgGridReact
              ref={this.gridRef}
              rowData={displayRowData}
              getRowId={this.getRowId}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection={rowSelection}
              suppressRowClickSelection
              onSelectionChanged={this.onSelectionChanged}
              onRowClicked={this.onRowClicked}
              onRowDoubleClicked={this.onRowDoubleClicked}
              rowDragManaged={enableRowDrag}
              animateRows={enableRowDrag}
              onRowDragEnd={this.onRowDragEnd}
              onColumnMoved={this.onColumnStateChanged}
              onColumnResized={this.onColumnResized}
              pagination={pagination && !noPager}
              paginationPageSize={pageSize}
              onPaginationChanged={this.onPaginationChanged}
              onGridReady={this.onGridReady}
              loading={loading}
              rowHeight={rowHeight}
              headerHeight={headerHeight}
              rowModelType="clientSide"
              suppressDragLeaveHidesColumns
              suppressContextMenu={['hide']}
              suppressColumnVirtualisation={false}
              isFullWidthRow={this.isFullWidthRow}
              fullWidthCellRenderer={this.fullWidthCellRenderer}
              getRowHeight={this.getRowHeight}
            />
          </div>
          {/* 调整表头弹框 */}
          {renderAdjustColumnsDialog()}
        </div>
      </ResizeObserver>
    );
  }
}

// 使用 dva connect 包装，自动注入 themeName
const ConnectedAgTable = connect(({ main }) => ({
  themeName: main.themeName,
}))(AgTable);

export default ConnectedAgTable;
export { AgTable as PureAgTable };
