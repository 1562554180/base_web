/**
 * FormSubmit 工具函数
 * 包含校验规则、占位符生成等
 */

// IP 地址校验正则
const IP_REGEX = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

// 端口号范围
const PORT_MIN = 1;
const PORT_MAX = 65535;

// 十六进制校验正则
const HEX_REGEX = /^[0-9A-Fa-f]+$/;

// 密码校验正则：6-16位，包含数字、大小写字母
const PASSPORT_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;

/**
 * 根据表单类型获取默认校验规则
 * @param {string} type - 表单类型
 * @param {boolean} required - 是否必填
 * @returns {Array} 校验规则数组
 */
export const getDefaultRules = (type, required = false) => {
  const rules = [];

  // 必填规则
  if (required) {
    rules.push({
      required: true,
      message: '此项为必填项',
    });
  }

  // 类型特定规则
  switch (type) {
    case 'ip':
      rules.push({
        pattern: IP_REGEX,
        message: '请输入正确的 IP 地址格式，如：192.168.1.1',
      });
      break;

    case 'port':
      rules.push({
        validator: (_, value) => {
          if (value === undefined || value === null || value === '') {
            return Promise.resolve();
          }
          const num = Number(value);
          if (isNaN(num) || num < PORT_MIN || num > PORT_MAX) {
            return Promise.reject(new Error(`端口号范围：${PORT_MIN}-${PORT_MAX}`));
          }
          return Promise.resolve();
        },
      });
      break;

    case 'hex':
      rules.push({
        pattern: HEX_REGEX,
        message: '请输入正确的十六进制格式，如：1A2B3C',
      });
      break;

    case 'passport':
      rules.push({
        pattern: PASSPORT_REGEX,
        message: '密码长度6-16位，必须包含数字、大写字母和小写字母',
      });
      break;

    default:
      break;
  }

  return rules;
};

/**
 * 合并用户自定义规则和默认规则
 * @param {Array} defaultRules - 默认规则
 * @param {Array|Object} customRules - 自定义规则
 * @returns {Array} 合并后的规则
 */
export const mergeRules = (defaultRules, customRules) => {
  if (!customRules) return defaultRules;

  // 支持单个规则对象
  if (!Array.isArray(customRules)) {
    customRules = [customRules];
  }

  return [...defaultRules, ...customRules];
};

/**
 * 根据类型和标签生成占位符
 * @param {string} type - 表单类型
 * @param {string} label - 字段标签
 * @returns {string} 占位符文本
 */
export const getPlaceholder = (type, label) => {
  const actionMap = {
    input: '请输入',
    select: '请选择',
    ip: '请输入',
    port: '请输入',
    hex: '请输入',
    passport: '请输入',
    number: '请输入',
    number_range: '请输入',
    textarea: '请输入',
    radio: '请选择',
    radio_group: '请选择',
    checkbox: '请选择',
    checkbox_group: '请选择',
    date: '请选择',
    date_range: '请选择',
    cascader: '请选择',
    color: '请选择',
  };

  const action = actionMap[type] || '请输入';
  return `${action}${label || ''}`;
};

/**
 * 标准化 items 为数组格式
 * @param {Array|Object} items - 表单项配置
 * @returns {Array} 标准化后的数组
 */
export const normalizeItems = (items) => {
  if (Array.isArray(items)) {
    return items;
  }

  if (items && typeof items === 'object') {
    return Object.keys(items).map((key) => ({
      field_name: key,
      ...items[key],
    }));
  }

  return [];
};

/**
 * 获取选项的 value 和 label 字段名
 * @param {Object} config - 配置对象 {value, label}
 * @returns {Object} 字段名映射
 */
export const getOptionKeys = (config = {}) => {
  return {
    valueKey: config.value || 'key',
    labelKey: config.label || 'value',
  };
};

/**
 * 转换选项格式
 * @param {Array} options - 原始选项
 * @param {Object} config - 字段映射配置
 * @returns {Array} 标准化后的选项
 */
export const normalizeOptions = (options = [], config = {}) => {
  const { valueKey, labelKey } = getOptionKeys(config);

  return options.map((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return { value: item, label: String(item) };
    }
    return {
      ...item,
      value: item[valueKey],
      label: item[labelKey],
    };
  });
};
