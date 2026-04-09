import React from 'react';
import _ from 'lodash';
import config from 'utils/config';
import numeral from 'numeral';
import Icon from 'components/Icon';
import _ip from 'ip';
import { parseJson, getByteSize, changeTheme } from 'utils/utils';
import moment from 'moment';
import { getComponentColor } from 'common/colors.js';



export function isAllDataSource(dataSourceInfo) {
  if (!config.isMevilMode) {
    return false;
  }
  if (!dataSourceInfo) {
    return false;
  }
  const { offlineID } = dataSourceInfo;

  return !offlineID;
}

export function getTitleAndIcon(title) {
  const imgsrc = getComponentColor('showChartImg');
  return (
    <>
      <img style={{ marginRight: 6, verticalAlign: 'middle' }} src={imgsrc} />
      <span style={{ marginTop: 2, verticalAlign: 'middle', fontSize: 14 }}>{title}</span>
    </>
  )
}

export function isShowDetailOnExpand() {
  return config.showDetailOnExpand;
}

export function isAdmin() {
  if (!config.loginUser) return false;
  return config.loginUser.role === 1;
}

export function getConfigEip() {
  if (config.eip) return { eip: config.eip };
  return {};
}

export function isOrgidSame(r) {
  if (isAdmin() || config.loginUser.org_id === r.user_org_id) return true;
  return false;
}

function convertTime(t) {
  return String(t).length === 10 ? t * 1000 : t;
}


export function updateUserSettings(cfgParams = {}) {
  const mainState = {};

  if (config.isThemeEnabled && cfgParams.selectedTheme) {
    const theme = cfgParams.selectedTheme;
    config.selectedTheme = theme;
    mainState.selectedTheme = theme;
    changeTheme(theme, () => {
      config.store.dispatch({
        type: 'main/updateState',
        payload: mainState,
      });
    });
  } else if (!_.isEmpty(mainState)) {
    config.store.dispatch({
      type: 'main/updateState',
      payload: mainState,
    });
  }
}

export function getTransValue(data, path) {
  let finalValue = '';
  const fieldsArr = path.split(".");
  if (data) {
    for (let it = 0; it < fieldsArr.length; it++) {
      if (it === 0) {
        if (data[fieldsArr[it]]) {
          finalValue = data[fieldsArr[it]];
        }
      } else if (finalValue[fieldsArr[it]]) {
        finalValue = finalValue[fieldsArr[it]];
      } else {
        if (!_.isString(finalValue)) {
          finalValue = '';
        }
        break;
      }
    }
  }
  if (String(finalValue) === 'NULL') {
    finalValue = '';
  }
  return finalValue;
}
const calcAtions = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

function initDataType (i) {
  if (['format', 'percent', 'time', 'traffic'].includes(i.type)) {
    return {dataType: 'number', numberConvertType: i.ype};
  }
  if (i.type === 'number' && i.calculate_type && i.calculate_value && Number(i.calculate_value)) {
    return {dataType: 'number', numberConvertType: 'calculate', calculate_value: i.calculate_type + i.calculate_value};
  }
  if (i.type === 'number' && i.tofixed) {
    return {dataType: 'number', numberConvertType: 'tofixed'};
  }
  return {dataType: i.type, numberConvertType: i.numberConvertType};
}
function createRender(item) {
  const m = parseJson(item.mapping, []);
  const enName = item.en_name || '';
  const o= initDataType(item);
  if (item.is_mapping === '1' && !_.isEmpty(m)) {
    const mapping = {};
    for (const i of m) {
      mapping[i.key] = i.value;
      if (i.icon) {
        const style = {};
        if (i.color) style.color = i.color;
        if (i.font) style.fontSize = Number(i.font) || 12;
        mapping[i.key] = getIcon(style, i.icon)
      } else if (i.color) {
        mapping[i.key] = <span style={{ color: i.color }}>{i.value}</span>
      }
    }
    return (t, record) => {
      if ((_.isUndefined(t) || t === '') && !enName.includes('.')) return item.defaultValue || '--';
      const tValue = getTransValue(record, item.en_name) ? getTransValue(record, item.en_name) : t;
      return mapping[tValue] || tValue
    };
  }
  const type = o.dataType;

  if (type === 'text') {
    return (t, record) => {
      if ((_.isUndefined(t) || t === '') && !enName.includes('.')) return item.defaultValue || '--';

      const tValue = getTransValue(record, item.en_name) ? getTransValue(record, item.en_name) : t;
      return item.unit ? tValue + ` (${item.unit})` : tValue
    };
  } else if (type === 'number') {
    return (t, record) => {
      if ((_.isUndefined(t) || t === '') && !enName.includes('.')) return item.defaultValue || '--';
      if (t === 0) return '0';
      let tValue = String(getTransValue(record, item.en_name)) === '0' ? 0 : getTransValue(record, item.en_name) ? getTransValue(record, item.en_name) : t;
      if (!_.isNumber(tValue)) {
        if (item.en_name === 'symbolrate') {
          return '--';
        } else if (item.en_name === 'group_id' || item.en_name === 'network_id' || item.en_name === 'carrier_id') {
          return '0';
        } else {
          return '';
        }
      }
      let ov = tValue;
      const numberConvertType = o.numberConvertType;
      if (numberConvertType === 'format') {
        const v = numeral(ov).format('0,0');
        return item.unit ? v + ` (${item.unit})` : v;
      } else if (numberConvertType === 'percent') {
        return String(tValue).endsWith('%') ? tValue : tValue + '%';
      } else if (numberConvertType === 'time') {
        if (typeof tValue === 'number') tValue = parseInt(tValue);
        return _.isString(tValue) ? tValue : moment(convertTime(tValue)).format('YYYY-MM-DD HH:mm:ss');
      } else if (numberConvertType === 'traffic') {
        return getByteSize(tValue);
      } else if (numberConvertType === 'calculate') {
        let calculateValue = o.calculate_value;
        if (!calculateValue) return tValue;
        const prefix = calculateValue[0];
        calculateValue = calculateValue.substr(1);
        const calcValue = calcAtions[prefix] ? calcAtions[prefix](tValue * 1, calculateValue * 1) : tValue;
        return  item.unit ? calcValue + ` (${item.unit})` : calcValue;
      } else if (numberConvertType === 'tofixed') {
        const fixed = Number(item.tofixed);
        return Number(ov).toFixed(fixed);
      }
      return item.unit ? tValue + ` (${item.unit})` : tValue;
    }
  }
  return (t, record) => {
    if ((_.isUndefined(t) || t === '') && !enName.includes('.')) return item.defaultValue || '--';
    const tValue = getTransValue(record, item.en_name) ? getTransValue(record, item.en_name) : t;
    if (!_.isUndefined(tValue)) {
      return item.unit ? tValue + ` (${item.unit})` : tValue;
    } else {
      return '';
    }
  };
}

function getWidth(i) {
  const title = i.ch_name || '';
  const defaultWidth = _.isString(title) ? title.pxWidth(14) + 20 : 100;
  if (i.width) return parseFloat(i.width, 10) || defaultWidth;
  return defaultWidth;
}

function renderSorter (a, b, item) {
  const field = item.key;
  if (item.type === 'number') {
    return a[field] - b[field];
  }
  if (item.type === 'ip') {
    return _ip.toLong(a[field]) - _ip.toLong(a[field]);
  }
  return a[field].localeCompare(b[field]);
}

export function initColumns(list) {
  if (!list) return [];
  const columns = [];
  for (const i of list) {
    if (!i.ch_name || !i.en_name) continue;
    if (i.hidden === '1') continue;
    const sorterIconWidth = i.is_sorter ? 45 : 0
    const width = getWidth(i)
    const c = {
      dataType: i.type,
      title: i.ch_name,
      dataIndex: i.en_name,
      key: i.en_name,
      width: width + sorterIconWidth,
      fixed: i.position,
      isEdit: i.is_edit === '1',
      align: i.align,
      tooltip: i.tooltip,
      type: 'input',
      isDisabled: i.isDisabled === '1',
      sorter: i.is_sorter === '1',
      en_name_form: i.en_name_form || false,
      defaultValue: i.default_value || '',
      show_in_detail: i.show_in_detail || '',
    }
    if (i.is_search) {
      c.isSearch = true;
    }
    if (i.type) {
      if (i.mapping) {
        c.type = 'select'
        c.selectChildren = parseJson(i.mapping, [])
      }
      if (i.type === 'time') {
        c.type = 'date_range'
      }
    }
    if (i.is_relation === '1') {
      c.is_relation = '1';
      c.relation = i.relation;
    }
    if (i.span) {
      c.span = Number(i.span);
    }
    if (i.text_color) {
      c.color = i.text_color;
    }
    if (i.align) {
      c.align = i.align;
    }
    if (i.default_value) {
      c.defaultValue = i.default_value;
    }
    if (i.is_edit) {
      c.isEdit = i.is_edit === '1';
    }
    if (i.tooltip) {
      c.tooltip = i.tooltip;
    }
    c.render = i.render || createRender(i)
    columns.push(c)
  }
  const arr = columns
  const ucolumns = columns.map(i => {
    if (i.sorter) {
      return { ...i, sorter: (a, b) => renderSorter(a, b, i), sortDirections: ['descend', 'ascend'] }
    } else {
      return i
    }
  })
  return ucolumns;
}

const numberReg = /^[0-9]\d*$/
function initOptions(str) {
  const list = parseJson(str, [])
  const data = []
  for (const i of list) {
    if (numberReg.test(i.key)) {
      data.push({ ...i, key: Number(i.key) })
    } else {
      data.push(i)
    }
  }
  return data
}

function getIcon(style, icon) {
  if (icon.startsWith('__fill_')) {
    const type = icon.substr(7)
    return <Icon customIcon style={style} type={type} theme='Filled' />
  }
  if (icon.startsWith('__twoTone_')) {
    const type = icon.substr(10)
    return <Icon customIcon style={style} type={type} theme='TwoTone' />
  }
  if (icon.startsWith('customIcon')) {
    const type = icon.substr(11)
    return <Icon customIcon style={style} type={type} />
  }
  return <Icon style={style} type={icon} />
}

/**
 * 将旧格式 relevance_config 的 data 转换为 FormSubmit 需要的 options 格式
 * 旧格式: {key, value} -> 新格式: {value: key, label: value}
 */
function transformRelevanceDataToOptions(data) {
  if (!Array.isArray(data)) return [];
  return data.map(item => ({
    key: item.key,
    value: item.value || item.label,
  }));
}

/**
 * 解析 visible_when_config 并生成 FormSubmit 的 visibleWhen 条件
 */
function parseVisibleWhenConfig(configStr) {
  if (!configStr) return null;
  const cfg = parseJson(configStr);
  if (!cfg || !cfg.dependOn) return null;

  const { dependOn, operator = 'equals', value } = cfg;

  // 根据 operator 生成对应的条件对象
  switch (operator) {
    case 'equals':
      return { field: dependOn, equals: value };
    case 'notEquals':
      return { field: dependOn, notEquals: value };
    case 'in':
      return { field: dependOn, in: Array.isArray(value) ? value : [value] };
    case 'notIn':
      return { field: dependOn, notIn: Array.isArray(value) ? value : [value] };
    default:
      return { field: dependOn, equals: value };
  }
}

/**
 * 初始化表单项配置，生成 items 和 linkageConfig
 * @param {Array} list - 表单项配置列表
 * @param {Object} formData - 当前表单数据（用于 range_relevance 判断）
 * @param {Boolean} noFormData - 是否包含隐藏字段
 * @returns {Object} { items, linkageConfig }
 */
export function initFormItems(list, formData, noFormData) {
  if (!list) return { items: [], linkageConfig: { visibleWhen: {}, optionsLinkage: {} } };

  const items = [];
  const linkageConfig = {
    visibleWhen: {},
    optionsLinkage: {},
  };

  // 用于存储依赖关系，构建 optionsLinkage
  const relevanceMapping = {};
  const values = {};

  // 处理有依赖关系的 select 字段，构建 relevanceMapping 和 linkageConfig.optionsLinkage
  const selectItems = list?.filter(i => i.field_type === 'select' && i.relevance_field)
    .sort((a, b) => (a.useCascader || '0').localeCompare(b.useCascader || '0'));

  for (const i of selectItems) {
    const field = i.relevance_field;
    const relevance = parseJson(i.relevance_config);

    if (i.useCascader !== '1') {
      // 单级联动
      values[field] = _.keys(relevance)[0] || '';
      relevanceMapping[i.en_name] = { relevance, relevancefield: field };

      // 构建 optionsLinkage
      const map = {};
      for (const key in relevance) {
        if (relevance[key]?.data) {
          map[key] = transformRelevanceDataToOptions(relevance[key].data);
        }
      }

      linkageConfig.optionsLinkage[i.en_name] = {
        dependOn: field,
        separator: '.',
        clearOnDepChange: true,
        map,
      };
    } else {
      // 多级联动（cascader 模式）
      // 检查依赖字段是否已经被处理过
      if (relevanceMapping[field]) {
        const oldfield = relevanceMapping[field].relevancefield;
        const dv = values[oldfield];
        for (const j in relevance) {
          if (j.startsWith(`${dv}&&`)) {
            values[field] = j.split('&&')[1];
            break;
          }
        }
        relevanceMapping[i.en_name] = { relevance, relevancefield: [oldfield, field] };

        // 构建 optionsLinkage（多级联动使用数组 dependOn）
        const map = {};
        for (const key in relevance) {
          if (relevance[key]?.data) {
            // 将 && 分隔符转换为 . 分隔符
            const newKey = key.replace(/&&/g, '.');
            map[newKey] = transformRelevanceDataToOptions(relevance[key].data);
          }
        }

        linkageConfig.optionsLinkage[i.en_name] = {
          dependOn: [oldfield, field],
          separator: '.',
          clearOnDepChange: true,
          map,
        };
      } else {
        // 如果依赖字段还没处理，可能是数据顺序问题
        // 尝试从 list 中直接获取依赖字段的配置
        const depField = list?.find(item => item.en_name === field);
        if (depField && depField.relevance_field) {
          // 二级联动：依赖字段本身也有依赖
          const oldfield = depField.relevance_field;
          relevanceMapping[i.en_name] = { relevance, relevancefield: [oldfield, field] };

          const map = {};
          for (const key in relevance) {
            if (relevance[key]?.data) {
              const newKey = key.replace(/&&/g, '.');
              map[newKey] = transformRelevanceDataToOptions(relevance[key].data);
            }
          }

          linkageConfig.optionsLinkage[i.en_name] = {
            dependOn: [oldfield, field],
            separator: '.',
            clearOnDepChange: true,
            map,
          };
        }
      }
    }
  }

  // 处理所有表单项
  for (const i of list) {
    if (!i.ch_name || !i.en_name) continue;

    // 处理 range_relevance（旧格式条件显示）
    if (i.range_relevance && i.range_relevance !== '[]') {
      if (!_.isEmpty(formData)) {
        const rangeRelevance = JSON.parse(i.range_relevance);
        if (!_.isEmpty(rangeRelevance)) {
          if (formData[rangeRelevance[0]?.field] !== rangeRelevance[0]?.value) {
            i.hidden = '1';
          } else {
            i.hidden = '0';
          }
        }
      } else {
        i.hidden = '1';
      }
    }

    if (i.hidden === '1' && !noFormData) continue;

    let _type = 'input';
    if (i.options) _type = 'select';
    if (i.field_type) _type = i.field_type;

    const c = {
      label: i.unit ? `${i.ch_name}(${i.unit})` : i.ch_name,
      field_name: i.en_name,
      type: _type,
      placeholder: i.placeholder ? i.placeholder : i.field_type === 'input' ? `请输入${i.ch_name}` : i.field_type === 'select' ? `请选择${i.ch_name}` : '',
      tooltip: i.placeholder ? i.placeholder : i.field_type === 'input' ? `请输入${i.ch_name}` : i.field_type === 'select' ? `请选择${i.ch_name}` : '',
      required: i.required === '1',
      value_range: i.value_range,
      value: i.default_value || '',
      options: initOptions(i.options, []),
      defaultValue: i.default_value || '',
    };

    if (_.isUndefined(values[i.en_name]) && i.default_value) {
      values[i.en_name] = i.default_value;
    }

    // text 类型特殊处理（渲染映射）
    if (i.field_type === 'text' && c.options.length > 0) {
      const mapping = {};
      for (const j of c.options) {
        mapping[j.key] = j.value;
        if (j.icon) {
          const style = {};
          if (j.color) style.color = j.color;
          if (j.font) style.fontSize = Number(j.font) || 12;
          mapping[j.key] = getIcon(style, j.icon);
        } else if (j.color) {
          mapping[j.key] = <span style={{ color: j.color }}>{j.value}</span>;
        }
      }
      c.render = (t) => mapping[t] || t;
    }

    const ulabel = c.label;
    const pxWidth = Math.ceil(ulabel.pxWidth(14));
    c.pxWidth = pxWidth;

    if (i.span) {
      c.span = Number(i.span);
    }

    // 处理 visible_when_config（新格式条件显示）
    if (i.visible_when_config) {
      const visibleCondition = parseVisibleWhenConfig(i.visible_when_config);
      if (visibleCondition) {
        linkageConfig.visibleWhen[i.en_name] = visibleCondition;
      }
    }

    // 兼容旧格式 is_relation
    if (i.is_relation === '1') {
      c.is_relation = '1';
      const relation = parseJson(i.relation, []);
      for (const r of relation) {
        // 将旧格式 relation 转换为 visibleWhen
        linkageConfig.visibleWhen[i.en_name] = {
          field: r.key,
          equals: r.value,
        };
        c.hidden = r.value !== values[r.key];
      }
    }

    if (values[i.en_name]) {
      c.value = values[i.en_name];
    }

    // 处理联动字段的 options（从 relevance_config 获取）
    if (i.relevance_field && i.useCascader !== '1') {
      const relevance = relevanceMapping[i.en_name]?.relevance;
      const v = values[i.relevance_field];
      c.options = relevance && v && relevance[v] ? relevance[v].data : [];
    } else if (i.relevance_field && i.useCascader === '1') {
      const relevance = relevanceMapping[i.en_name]?.relevance;
      const relevancefield = relevanceMapping[i.en_name]?.relevancefield || [];
      const v = relevancefield.map(j => values[j]).join('&&');
      c.options = relevance && v && relevance[v] ? relevance[v].data : [];
    }

    if (i.default_value) {
      c.value = i.default_value;
    }

    items.push(c);
  }

  return { items, linkageConfig };
}

export function initFormItemValues(item, columns) {
  if (!item) return {};
  if (!columns || columns.length === 0) return item;
  const obj = {};
  for (const i of columns) {
    if (i.en_name_form) {
      obj[i.en_name_form] = item[i.dataIndex];
    }
  }
  return { ...item, ...obj }
}
