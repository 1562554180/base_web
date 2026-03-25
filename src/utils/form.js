import _ from 'lodash';
import moment from 'moment';
import { showErrorMessage } from './utils';
import { l } from './localization';

let validators = {};
const validatorDesc = {
  digits: 'Must be digits',
  letters: 'Must be letters and digits',
  alphanumeric: 'Must be Letters, digits, and minus sign',
  alphanumeric_ex: 'Must be Letters, digits, minus sign and dot mark',
  url: 'Must be valid url',
  password: 'Password is too simple',
  email: 'Must be valid email',
  number: 'Must be valid number',
  ipv4: 'Must be valid ipv4 address',
  ipv6: 'Must be valid ipv6 address',
  datehour: 'Must be date with hour, eg: 1998-01-01 19:01',
  datetime: 'Must be date with hour and minutes, eg: 1998-01-01 19:01:01',
  date: 'Must be date, eg: 1998-01-01',
  joined_digits: 'Must be digits joined by comma, eg: 1,2,3',
  base64: 'Must be valid base64 encoded value',
  hex: 'Must be hex string',
  file: 'The file type is invalid',
  general: 'The field is invalid',
  generalRequired: '{0} is required',
  fileSize: 'File size must between {0} ~ {1}',
};

function rangeError(v1, v2) {
  return l('Input value range is [{0}, {1}]', v1, v2);
}

const rangeErrorDesc = {
  'min': v => l('The minimum value is {0}', v),
  'max': v => l('The maximum value is {0}', v),
  'range': rangeError,
  '[]': rangeError,
  '[)': (v1, v2) => l('Input value range is [{0}, {1})', v1, v2),
  '(]': (v1, v2) => l('Input value range is ({0}, {1}]', v1, v2),
  '()': (v1, v2) => l('Input value range is ({0}, {1})', v1, v2),
};

function compareValidator(rule, v, callback) {
  const { rs } = rule;
  let invalid = false;
  const value = parseInt(v, 10);

  if (rs[0] === 'min') {
    invalid = rs[1] > value;
  } else if (rs[0] === 'max') {
    invalid = rs[1] < value;
  } else if (rs[0] === '[]' || rs[0] === 'range') {
    invalid = value < rs[1][0] || value > rs[1][1];
  } else if (rs[0] === '[)') {
    invalid = value < rs[1][0] || value >= rs[1][1];
  } else if (rs[0] === '(]') {
    invalid = value <= rs[1][0] || value > rs[1][1];
  } else if (rs[0] === '()') {
    invalid = value <= rs[1][0] || value >= rs[1][1];
  }
  if (invalid) callback(new Error(validatorDesc.general));
  else callback();
}

function isOptionalRule(rules) {
  for (const r of rules) {
    if (!_.isUndefined(r.required)) {
      return r.required !== true;
    }
  }
  return true;
}

export function createGroupFormItemValidateStatus(groups) {
  const state = {
    _names: {},
  };

  const ret = [];

  for (const n of groups) {
    const name = n.join('_');

    ret.push(name);
    n.reduce((p, item) => {
      p[item] = name;
      return p;
    }, state._names);
    state[name] = {
      help: '',
      validateStatus: '',
    }
  }

  ret.push(state);

  return ret;
}

export function generateGroupFormItemValidateStatus(err, state) {
  const newState = {};

  if (err) {
    for (const k in err.rules) {
      const n = state._names[k];

      if (n) {
        if (!newState[n]) newState[n] = {};
        newState[n].help = err.rules[k].errors[0].message;
        newState[n].validateStatus = 'error';
      }
    }
  }
  for (const k in state) {
    if (k === '_names') continue;
    if (!newState[k]) {
      newState[k] = state[k];
    }
  }

  return newState;
}

export function getGroupFormItemValidateStatus(name, state) {
  return state[name] || {};
}

function createRegExValidatorByArray (rules) {
  return  (rule, value, callback) => {
    if (!value && isOptionalRule(rules)) {
      callback();
      return;
    }
    const { rs } = rule;
    for (let i = 0, cnt = rs[0].length; i < cnt; ++i) {
      let r;
      if (rs[1][i]) r = new RegExp(rs[0][i], rs[1][i]);
      else r = new RegExp(rs[0][i]);
      if (!r.test(value)) {
        callback(new Error(rule.message || validatorDesc.general));
        return;
      }
    }
    callback();
  }
}

function createRegExValidator(p, rules) {
  return  (rule, value, callback) => {
    if (!value && isOptionalRule(rules)) {
      callback();
      return;
    }
    const r = new RegExp(p);
    if (!r.test(value)) {
      callback(new Error(rule.message || validatorDesc.general));
      return;
    }
    callback();
  }
}

function checkFileList(rule, fileList) {
  if (!rule || !rule.rs || !fileList) return true;
  for (const file of fileList) {
    let value = file.name.toLowerCase();
    const pos = value.lastIndexOf('.');
    if (pos === -1) break;
    value = value.substr(pos + 1);
    if (rule.rs[value]) {
      if (rule.size) {
        if (file.size < rule.size[0] || file.size > rule.size[1]) {
          return validatorDesc.fileSize;
        }
      }
      return true;
    }
  }
  return validatorDesc.file;
}
function fileValidator (rule, fileList, callback) {
  const ret = checkFileList(rule, fileList);
  if (ret === true) callback();
  else callback(new Error(ret));
}

export function isFileValid(settings, formName, name, fileList) {
  const form = settings.formRules && settings.formRules[formName] && settings.formRules[formName].$ ? settings.formRules[formName].$ : {};

  if (!form[name] || !form[name].rules) return true;
  for (const rule of form[name].rules) {
    if (rule.validator === fileValidator) {
      return checkFileList(rule, fileList);
    }
  }
  return true;
}

export function setValidators(v) {
  if (v) validators = v;
}

export function isValidPort(data) {
  if (!data || data.startsWith('0')) return false;
  if (!isFieldValid(data, 'digits')) return false;

  const v = parseInt(data, 10);

  return !isNaN(v) && v > 0 && v < 65536;
}

export function isFieldValid(data, ruleName) {
  if (!validators[ruleName]) return -1;

  const rule = validators[ruleName];

  if (_.isArray(rule)) {
    for (let i = 0, cnt = rule[0].length; i < cnt; ++i) {
      let r;
      if (rule[1][i]) r = new RegExp(rule[0][i], rule[1][i]);
      else r = new RegExp(rule[0][i]);
      if (!r.test(data)) {
        return validatorDesc[ruleName] || validatorDesc.general;
      }
    }
  } else {
    const r = new RegExp(rule);

    if (!r.test(data)) {
      return validatorDesc[ruleName] || validatorDesc.general;
    }
  }

  return true;
}

function changeRuleRequiredFlag(rules, d) {
  for (const r of rules) {
    if (!_.isUndefined(r.required)) {
      r.required = d === 1;
      break;
    }
  }
}

function restoreRuleRequiredFlag(rules) {
  for (const r of rules) {
    if (!_.isUndefined(r.required)) {
      r.required = r.default;
      break;
    }
  }
}

function fixRules(rules, op) {
  if (!op) {
    restoreRuleRequiredFlag(rules);
    return;
  }
  const tag = 'op_' + op;
  for (const r of rules) {
    if (!_.isUndefined(r[tag])) {
      changeRuleRequiredFlag(rules, r[tag]);
      return;
    }
  }
}

function fillInitialValue(r, itemType, values, name) {
  if (itemType === 'file' || !values || _.isUndefined(values[name])) {
    if (itemType && itemType.startsWith('date')) {
      return;
    }
    r.initialValue = '';
  } else if (itemType === 'datetime') {
    r.initialValue = moment(values[name], 'YYYY-MM-DD HH:mm:ss');
  } else if (itemType === 'date') {
    r.initialValue = moment(values[name], 'YYYY-MM-DD');
  } else if (itemType === 'datehour') {
    r.initialValue = moment(values[name], 'YYYY-MM-DD HH:mm');
  } else if (itemType === 'datetime_range') {
    r.initialValue = [moment(values[name][0], 'YYYY-MM-DD HH:mm:ss'), moment(values[name][1], 'YYYY-MM-DD HH:mm:ss')];
  } else if (itemType === 'date_range') {
    r.initialValue = [moment(values[name][0], 'YYYY-MM-DD'), moment(values[name][1], 'YYYY-MM-DD')];
  } else if (itemType === 'datehour_range') {
    r.initialValue = [moment(values[name][0], 'YYYY-MM-DD HH:mm'), moment(values[name][1], 'YYYY-MM-DD HH:mm')];
  } else {
    r.initialValue = values[name];
    // try to guess date range picker
    if (_.isArray(r.initialValue) && r.initialValue.length === 2 && !isMomentObject(r.initialValue[0])) {
      const v1 = moment(r.initialValue[0]);
      const v2 = moment(r.initialValue[1]);
      if (v1.isValid() && v2.isValid()) {
        r.initialValue[0] = v1;
        r.initialValue[1] = v2;
      }
    }
  }
}

export function createFieldRules (settings, formName, name, values, op) {
  const dv = { rules: [] };
  let r = dv;
  const form = settings.formRules && settings.formRules[formName] && settings.formRules[formName].$ ? settings.formRules[formName].$ : {};
  let itemType = false;
  if (form[name]) {
    r = form[name].rule;
    itemType = form[name].itemType;
  }
  fixRules(r.rules, op);
  fillInitialValue(r, itemType, values, name);

  return r;
}

export function getFieldDecorator(form, settings, formName, name, values, op) {
  const args = [formName ? formName + '.' + name : name];
  const r = createFieldRules(settings, formName, name, values, op);

  if (!_.isUndefined(r.initialValue) || r.rules.length > 0) args.push(r);

  return form.getFieldDecorator(...args);
}

export function getFieldDecoratorEx({form, settings, formName, values}, fieldName, op) {
  return getFieldDecorator(form, settings, formName, fieldName, values, op);
}

export function getFormFieldLabel(settings, formName, name) {
  if (!formName) return l(name);

  const form = settings.formRules && settings.formRules[formName] ? settings.formRules[formName] : {};

  if (form[name] && form[name].name) return form[name].name;

  const fn = formName + '.' + name;
  const t = l(fn);

  if (t !== fn) return t;

  return l(name);
}

export function getFormFieldLabelEx({settings, formName}, fieldName) {
  return getFormFieldLabel(settings, formName, fieldName);
}

function isMomentObject(o) {
  return o && o.constructor && o.constructor.name === 'Moment';
}

function getDateTimeValue(o) {
  if(moment.isMoment(o)) {
    return o.format('YYYY-MM-DD HH:mm:ss');
  }
  return o;
}

function  formalizedValue(value, rule, fieldName) {
  if (!value || !value.constructor) return;

  const name = value.constructor.name;
  if (rule && rule[fieldName] && rule[fieldName].itemType) {
    let itemType = rule[fieldName].itemType;
    if (itemType.startsWith('date')) {
      if (itemType.endsWith('range')) {
        const nv = [0, 0];
        itemType = itemType.substr(0, itemType.length - 6);
        if (itemType === 'datetime') {
          nv[0] = getDateTimeValue(value[0]);
          nv[1] = getDateTimeValue(value[1]);
        } else if (itemType === 'date') {
          nv[0] = value[0].format('YYYY-MM-DD');
          nv[1] = value[1].format('YYYY-MM-DD');
        } else if (itemType === 'datehour') {
          nv[0] = value[0].format('YYYY-MM-DD HH:mm');
          nv[1] = value[1].format('YYYY-MM-DD HH:mm');
        }
        return nv;
      } else if (itemType === 'datetime') {
        return getDateTimeValue(value);
      } else if (itemType === 'date') {
        return value.format('YYYY-MM-DD');
      } else if (itemType === 'datehour') {
        return value.format('YYYY-MM-DD HH:mm');
      }
      return;
    }
  }
  if (name === 'Moment') {
    return getDateTimeValue(value);
  } else if (name === 'Array') {
    if (value.length === 2) {
      const nv = [0, 0];
      if (isMomentObject(value[0])) {
        nv[0] = getDateTimeValue(value[0]);
      } else {
        nv[0] = value[0];
      }
      if (isMomentObject(value[1])) {
        nv[1] = getDateTimeValue(value[1]);
      } else {
        nv[1] = value[1];
      }
      return;
    }
  }

  return value;
}

function formalizedValues(values, dst, rule) {
  for (const k in values) {
    const nv = formalizedValue(values[k], rule, k);
    if (!_.isUndefined(nv)) dst[k] = nv;
  }
}

function formalizedFormValues(values, dst, formRules, formName) {
  const rule = formRules && formName && formRules[formName] && formRules[formName].$ ? formRules[formName].$ : false;

  formalizedValues(values, dst, rule);
}

function checkResult(err) {
  this.err = err;
}

function validateFieldValue(value, r, itemType) {
  if (r.len && value.length !== r.len) return r.message;
  if (r.min && value.length < r.min) return r.message;
  if (r.max && value.length > r.max) return r.message;
  if (r.validator) {
    const ret = {};

    r.validator(r, value, checkResult.bind(ret));
    if (ret.err) return ret.err.message;
  }
  return true;
}

export function validateValue(value, record, fieldName, formRules) {
  const vr = formRules.$;

  record[fieldName] = formalizedValue(value, vr, fieldName);
  const rfv = record[fieldName];

  if (vr[fieldName]) {
    const or = formRules[fieldName];
    const txtName = or.name || l(fieldName);

    const isRequried = or.required === true;

    if (isRequried && (_.isUndefined(rfv) || (_.isString(rfv) && rfv.trim().length === 0))) {
      return l(validatorDesc.generalRequired, txtName);
    } else if (!isRequried && (_.isUndefined(rfv) || (_.isString(rfv) && rfv.trim().length === 0))) {
      return true;
    }

    const formRule = vr[fieldName];

    for (const r of formRule.rule.rules) {
      const msg = validateFieldValue(rfv, r, formRule.itemType);

      if (msg !== true) {
        return msg;
      }
    }
  }

  return true;
}

export function validateValues(values, dst, formRules, ignoreFields) {
  const ignored = {};
  const vr = formRules.$;

  if (ignoreFields) ignoreFields.map(i => {ignored[i] = 1; return 0;});
  formalizedValues(values, dst, vr);
  for (const name in vr) {
    if (ignored[name]) continue;
    const or = formRules[name];
    const equalTo = or['='];
    const value = dst[name];
    const txtName = or.name || l(name);

    if (equalTo) {
      if (value !== dst[equalTo]) {
        return l('The two field {0} and {1} must be same.',
          txtName, formRules[equalTo].name || l(equalTo));
      }
    }

    const isRequried = or.required === true;

    if (isRequried && (_.isUndefined(value) || (_.isString(value) && value.trim().length === 0))) {
      return l(validatorDesc.generalRequired, txtName);
    } else if (!isRequried && (_.isUndefined(value) || (_.isString(value) && value.trim().length === 0))) {
      continue;
    }

    const formRule = vr[name];

    for (const r of formRule.rule.rules) {
      const msg = validateFieldValue(value, r, formRule.itemType);

      if (msg !== true) {
        return msg;
      }
    }
  }

  return true;
}

export function submitForm ({form, onSubmit, dataKey, formRules, formName}) {
  const resetFields = () => form.resetFields();
  form.validateFieldsAndScroll((err, values) => {
    if (formName && values[formName]) values = values[formName];
    const fvs = {};
    formalizedFormValues(values, fvs, formRules, formName);
    if (!dataKey) dataKey = 'f';
    onSubmit(err, {
      [dataKey]: fvs,
    }, resetFields)
  });
}

function checkEqualFields(formRules, formName, values) {
  if (!formRules || !formName) return;

  const f = formRules[formName];

  for (const name in f) {
    if (name === '$') continue;
    const formRule = f[name];

    if (formRule['=']) {
      if (values[name] !== values[formRule['=']]) {
        showErrorMessage(l('The two field {0} and {1} must be same.', l(name), l(formRule['='])));
        return false;
      }
    }
  }
}
export function createSubmitHandler ({form, onSubmit, activeFields, dataKey, beforeSubmit, formRules, formName, onError}) {
  const resetFields = () => form.resetFields();
  if (activeFields) {
    return (e) => {
      if (e && e.preventDefault) e.preventDefault();
      const fields = _.isFunction(activeFields) ? activeFields() : activeFields;
      form.validateFieldsAndScroll(fields, { force: true }, (err, values) => {
        if (formName && values[formName]) values = values[formName];
        const fvs = {};
        formalizedFormValues(values, fvs, formRules, formName);
        if (checkEqualFields(formRules, formName, values) === false) return;
        if (beforeSubmit && beforeSubmit(fvs, err) === false) return;
        if (err) {
          if (onError) onError(err);
          return;
        }
        if (!dataKey) dataKey = 'f';
        onSubmit(err, {
          [dataKey]: fvs,
        }, resetFields);
      });
    }
  }
  return (e) => {
    if (e && e.preventDefault) e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (formName && values[formName]) values = values[formName];
      const fvs = {};
      formalizedFormValues(values, fvs, formRules, formName);
      if (checkEqualFields(formRules, formName, values) === false) return;
      if (beforeSubmit && beforeSubmit(fvs, err) === false) return;
      if (err) {
        if (onError) onError(err);
        return;
      }
      if (!dataKey) dataKey = 'f'
      onSubmit(err, {
        [dataKey]: fvs,
      }, resetFields)
    });
  };
}

export function createSubmitHandlerForSearch({form, onSubmit, beforeSubmit, formRules, formName, onError}) {
  return createSubmitHandler({
    form,
    onSubmit,
    beforeSubmit,
    formRules,
    formName,
    onError,
    dataKey: 's',
  });
}

function initErrorMessages() {
  if (validatorDesc._inited) return;
  for (const k in validatorDesc) {
    if (k.startsWith('_')) continue;
    validatorDesc[k] = l(validatorDesc[k]);
  }
  validatorDesc._inited = true;
}

const ignoredRules = {};

[ '_msg', '_sqlchar', 'mixed',
  '_from', 'array', 'name', 'ignored',
  'required', 'ui'].forEach(i => {ignoredRules[i] = 1;});

function createRule(r, rules, ruleName, ruleValue) {
  if (ruleName === 'file') {
    r.itemType = 'file';
    r.validator = fileValidator;
    r.message = validatorDesc.file;
    if (ruleValue.length > 0) {
      const rsArr = ruleValue[0].split(',');
      if (rsArr.length) {
        r.rs = {};
        for (const rsi of rsArr) {
          r.rs[rsi] = true;
        }
      }
      if (ruleValue[1]) {
        r.size = ruleValue[1].split(',');
        if (r.size.length === 1) {
          r.size = [1, r.size[0]];
        }
      }
    }
  } else if (ruleName === 'len') {
    r.len = ruleValue;
    r.message = l('The length of this field must be.', r.len);
  } else if (ruleName === 'rangelength') {
    [r.min, r.max] = ruleValue;
    if (!r.message) r.message = l('The length of this field must between {0} and {1}.', r.min, r.max);
  } else if (ruleName === 'minlength') {
    r.min = ruleValue;
    if (!r.message) r.message = l('The minimium length of this field must be {0}.', r.min);
  } else if (ruleName === 'maxlength') {
    r.max = ruleValue;
    if (!r.message) r.message = l('The maximum length of this field must be {0}.', r.max);
  } else if (rangeErrorDesc[ruleName]) {
    r.validator = compareValidator;
    r.message = rangeErrorDesc[ruleName](...ruleValue);
    r.rs = [ruleName, ruleValue];
  } else if (validators[ruleName]) {
    r.itemType = ruleName;
    if (ruleName.startsWith('date')) {
      r.type = ruleName.endsWith('range') ? 'array' : 'object';
    } else if (_.isArray(validators[ruleName])) {
      r.validator = createRegExValidatorByArray(rules);
      r.rs = validators[ruleName];
    } else {
      r.validator = createRegExValidator(validators[ruleName], rules);
    }
    if (validatorDesc[ruleName]) r.message = validatorDesc[ruleName];
  } else {
    if (ruleName.startsWith('date')) {
      r.itemType = ruleName;
      r.type = ruleName.endsWith('range') ? 'array' : 'object';
    }
    r[ruleName] = ruleValue;
  }
}

export function importFormRules (settings) {
  if (!settings || !settings.formRules) return;

  initErrorMessages();
  for (const p in settings.formRules) {
    const f = settings.formRules[p]
    f.$ = {};
    for (const name in f) {
      if (name === '$') continue;
      const formRule = f[name];

      if (!_.isUndefined(formRule.ui)) {
        if (formRule.ui === false) {
          continue;
        }
      }

      const newRules = { rules: [] };
      let itemType = false;
      let objectType = false;

      if (formRule.name) formRule.name = l(formRule.name);
      newRules.rules.push({
        required: !!formRule.required,
        default: !!formRule.required,
        message: l(validatorDesc.generalRequired, formRule.name || l('This field')),
      });
      for (const ruleName in formRule) {
        if (ignoredRules[ruleName]) continue;

        const ruleValue = formRule[ruleName];
        const r = {};
        if (createRule(r, newRules.rules, ruleName, ruleValue) !== false) {
          if (r.type) {
            objectType = r.type;
          }
          if (r.itemType) {
            itemType = r.itemType;
            delete r.itemType;
          }
          newRules.rules.push(r);
        }
      }
      if (newRules.rules.length > 0) {
        const msg =  formRule._msg ? l(formRule._msg) : validatorDesc.general;
        newRules.rules.forEach((r) => {
          if (!r.message) r.message = msg;
          if (objectType) r.type = objectType;
        });
        f.$[name] = {rule: newRules, itemType};
      } else {
        delete f[name]
      }
    }
  }
}

export function mergeFormRules (settings, newSettings) {
  if (!newSettings.formRules) return
  if (!settings.formRules) settings.formRules = newSettings.formRules
  else settings.formRules = { ...settings.formRules, ...newSettings.formRules }
}
