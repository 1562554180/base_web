import _ from 'lodash';
import dayjs from 'dayjs';

function getSubmitValues(values, format, allowNull) {
  const needValues = {};
  for (const i in values) {
    if (!allowNull && (values[i] === undefined || values[i] === null)) continue;
    needValues[i] = values[i];
    if (dayjs.isDayjs(values[i])) {
      needValues[i] = dayjs(values[i]).format(format || 'YYYY-MM-DD HH:mm:ss');
    }
    if (_.isArray(values[i]) && dayjs.isDayjs(values[i][0])) {
      needValues[i] = [
        dayjs(values[i][0]).format(format || 'YYYY-MM-DD HH:mm:ss'),
        dayjs(values[i][1]).format(format || 'YYYY-MM-DD HH:mm:ss'),
      ];
    } else if (_.isArray(values[i])) {
      needValues[i] = values[i];
    }

    if (_.isBoolean(values[i])) {
      needValues[i] = values[i] ? 1 : 0;
    }
  }
  return needValues;
}

export function filterValues(values) {
  const newValues = {};
  for (const i in values) {
    if (values[i] !== '' && values[i] !== undefined) {
      newValues[i] = values[i];
      if (dayjs.isDayjs(values[i])) {
        newValues[i] = dayjs(values[i]).format('YYYY-MM-DD HH:mm:ss');
      }
      if (_.isArray(values[i]) && dayjs.isDayjs(values[i][0])) {
        newValues[i] = [
          dayjs(values[i][0]).format('YYYY-MM-DD HH:mm:ss'),
          dayjs(values[i][1]).format('YYYY-MM-DD HH:mm:ss'),
        ];
      }
    }
  }
  return newValues;
}

export function createSubmitHandler({ form, onSubmit, format, allowNull }) {
  const resetFields = () => form.resetFields();
  return (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    form
      .validateFields()
      .then((values) => {
        const fvs = getSubmitValues(values, format, allowNull);
        onSubmit(null, fvs, resetFields);
      })
      .catch((errInfo) => {
        onSubmit(errInfo, null, null);
      });
  };
}
