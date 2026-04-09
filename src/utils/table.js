import React from 'react';
import { Input, Checkbox, Select } from 'antd';
import _ from 'lodash';
import { l } from './localization';
import config from './config';
import { validateValue } from 'utils/form';
import * as keyboardFilters from 'utils/keyboard';
import classNames from 'classnames';

const Option = Select.Option;

// [dataIndex, title, width, sort, render, className, editable, fieldType, domHtml]
function createColumn(item, colOptions, context, formRules, totalWidth) {
  let name = '';
  if (config.tableHeaderLanguage === '1' || config.tableHeaderLanguage === '2') {
    name = (item[9] && item[9] !== 'null') ? `（${item[9]}）` : '';
  }
  const col = {
    title: item[8] ? (<div>{item[8]}{name}</div>) : (item[1] ? l(item[1]) : ''),
    width: totalWidth ? _.isString(item[2]) ? parseInt((100 * parseInt(item[2], 10) / totalWidth), 10) + '%' : ((item[2] ? item[2] : '10') + 'px') : item[2],
  }
  const dataIndex = item[0];
  const editable = item[6];
  const colDataIndex = item[5] === true ? dataIndex : item[5];

  if (dataIndex) {
    col.key = dataIndex;
    col.dataIndex = dataIndex;
  }
  if (item[3]) {
    if (colOptions && colOptions.sorter && colOptions.sorter[dataIndex]) col.sorter = colOptions.sorter[dataIndex];
    else col.sorter = true;
  }
  if (editable) {
    col.render = (t, r) => {
      const fieldName = dataIndex || item[4];
      const disabled = r[fieldName + '_disabled'] === true;
      const onChange = (v) => {
        const nv = _.isObject(v) && v.target ? v.target.value : v;
        if (!formRules) {
          r[fieldName] = nv;
          return;
        }
        validateValue(nv, r, fieldName, formRules);
      };
      if (_.isString(editable) && editable === 'select') {
        const items = _.isFunction(window[item.items]) ? window[item.items]() : item.items;
        return (
          <Select defaultValue={t} onChange={onChange} size="default" style={{ width: '100%' }} disabled={disabled}>
            {items.map((i) => <Option key={i[0]} value={i[0]}>{i[1]}</Option>)}
          </Select>
        );
      }
      if (_.isString(editable) && editable === 'checkbox') {
        return <Checkbox defaultValue={t} onChange={onChange} size="default" disabled={disabled} />;
      }
      return <Input defaultValue={t} onChange={onChange} size={config.smallSize ? 'small' : 'default'} disabled={disabled} />;
    };
  } else if (colOptions) {
    if (colOptions.render) {
      if (colOptions.render[dataIndex] || colOptions.render[item[4]]) {
        const render = colOptions.render[item[4]] || colOptions.render[dataIndex];
        col.render = (t, r, recordIndex) => render(t, r, context, dataIndex, item[1], item[7], recordIndex);
      }
    }
    if (!col.render && colOptions.renderForAll) {
      const render = colOptions.renderForAll;
      col.render = (t, r, recordIndex) => render(t, r, context, dataIndex, item[1], item[7], recordIndex);
    }
    if (colOptions.fixed && colOptions.fixed[dataIndex]) {
      col.fixed = colOptions.fixed[dataIndex] === true ? 'left' : colOptions.fixed[dataIndex];
    }
    if (colOptions.filters && colOptions.filters[dataIndex]) {
      const filter = colOptions.filters[dataIndex];

      if (_.isArray(filter[0])) {
        col.filters = filter[0];
      } else {
        col.filterDropdown = filter[0];
        if (filter[2]) col.onFilterDropdownVisibleChange = filter[2];
      }
      col.onFilter = filter[1];
    }
    if (item.length >= 6) {
      col.className = colOptions.className ? colOptions.className[colDataIndex] : item[5];
    }
  }
  if (colOptions.headerClassName && !_.isUndefined(colOptions.headerClassName[item[4]])) {
    col.headerClassName = colOptions.headerClassName[item[4]];
  }
  if (colOptions.defaultOrder && colOptions.defaultOrder.name === col.dataIndex) {
    col.defaultSortOrder = colOptions.defaultOrder.order || 'descend';
  }
  if (colOptions.showTip && colOptions.showTip[dataIndex]) {
    const showTip = colOptions.showTip[dataIndex];
    if (showTip === true) {
      col.showTip = () => true;
    } else {
      col.showTip = (t, r, recordIndex) => showTip(t, r, context, dataIndex, item[1], item[7], recordIndex);
    }
  }
  return col;
}
/*
headers:
{
  names: [
    ["", "", 40, false, "avatar", true],
    ["name", "Name", "10", true, true],
    ["", "", "20", false, "operation"]
  ]
}
colOptions:
{
    render: {
      avatar (text, record) {
        return (<RandomAvatar text={record.nickName.substr(0, 1)}/>)
      },
      name (text, record) {
        return (<Link title={l('Click to update user information')} onClick={e => handleClickUser(record)}>{text}</Link>)
      },
      operation (text, record) {
        return (<DropOption onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />)
      },
      ...
    },
    className: {
      avatar: styles.avatar
    },
  }
*/
export function createTableColumn (headers, colOptions, context, formRules) {
  if (!headers || !headers.names || headers.names.length === 0) return false;
  const cols = [];
  let totalWidth = 0;
  if (!colOptions || !colOptions.predefinedWidth) {
    totalWidth += 1;
    for (const item of headers.names) {
      if (_.isString(item[2])) {
        totalWidth += parseInt(item[2], 10);
      }
    }
  }
  for (const item of headers.names) {
    if (config.disableSearchAll && item[0] === 'search_all_source') continue;
    cols.push(createColumn(item, colOptions, context, formRules, totalWidth));
  }
  return cols;
}

export function toTableData(res, params) {
  return {
    data: {
      list: res.data.data,
      pagination: {
        ...config.tablePagination,
        ...params,
        total: res.data.total ? res.data.total : 0,
        showTotal: (total, range) => l('{0}-{1} of {2} items', range[0], range[1], total),
      },
    },
  };
}

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

export function handleTableChange(dispatch, type, searchValues, pagination, filtersArg, sorter, callback) {
  if(!dispatch) return false;
  const filters = filtersArg ? Object.keys(filtersArg).reduce((obj, key) => {
    const newObj = { ...obj };
    newObj[key] = getValue(filtersArg[key]);
    return newObj;
  }, {}) : {};

  const params = {
    currentPage: pagination.current,
    pageSize: pagination.pageSize,
    ...searchValues,
    ...filters,
  };
  if (sorter && sorter.field) {
    params.sorter = sorter.field;
    params.order = sorter.order;
  }

  dispatch({
    type,
    payload: params,
    callback: (data) => {
      if(callback) callback(data);
    },
  });
}
