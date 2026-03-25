import _ from 'lodash';
import moment from 'moment';

function getSubmitValues (values, format, allowNull) {
  const needValues = {};
  for(const i in values) {
    if(!allowNull && (values[i] === undefined || values[i] === null)) continue;
    needValues[i] = values[i];
    if(moment.isMoment(values[i])) {
      needValues[i] = moment(values[i]).format(format || 'YYYY-MM-DD HH:mm:ss');
    }
    if(_.isArray(values[i]) && moment.isMoment(values[i][0])) {
      needValues[i] = [moment(values[i][0]).format(format || 'YYYY-MM-DD HH:mm:ss'), moment(values[i][1]).format(format || 'YYYY-MM-DD HH:mm:ss')];
    } else if (_.isArray(values[i])) {
      needValues[i] = values[i];
    }

    if(_.isBoolean(values[i])) {
      needValues[i] = values[i] ? 1 : 0;
    }
  }
  return needValues;
}

export function filterValues (values) {
  const newValues = {}
  for(const i in values) {
    if(values[i] !== '' && values[i] !== undefined) {
      newValues[i] = values[i];
      if(moment.isMoment(values[i])) {
        newValues[i] = moment(values[i]).format('YYYY-MM-DD HH:mm:ss');
      }
      if(_.isArray(values[i]) && moment.isMoment(values[i][0])) {
        newValues[i] = [moment(values[i][0]).format('YYYY-MM-DD HH:mm:ss'), moment(values[i][1]).format('YYYY-MM-DD HH:mm:ss')];
      }
      // if(_.isArray(values[i]) && values[i].length === 0) {
      //   delete newValues[i];
      // }
      // if(_.isObject(values[i]) && values[i].length === undefined && !values[i].value && values[i].type) {
      //   delete newValues[i];
      // }
    }
  }
  return newValues;
}

export function createSubmitHandler ({form, onSubmit, format, allowNull}) {
  const resetFields = () => form.resetFields();
  return (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const fvs = getSubmitValues(values, format, allowNull);
      onSubmit(err, fvs, resetFields)
    });
  };
}
