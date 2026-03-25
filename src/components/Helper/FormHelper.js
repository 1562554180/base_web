import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import { Input, DatePicker, Checkbox } from 'antd';
const FormItem = Form.Item;

// TODO
function createFormListInner(item) {
  const itemObj = {};
  itemObj.label = item[0];
  itemObj.field = item[1];
  itemObj.type = item[2] || 'input';
  itemObj.initialValue = item[3] || '';
  itemObj.rules = item[4] || [];
  return itemObj;
}

// TODO
export function createFormList(formList,values) {
  const newformList = JSON.parse(JSON.stringify(formList));
  const items = [];
  for (const item of newformList) {
    if (values) {
      item[3] = values[item[1]] || '';
    }
    items.push(createFormListInner(item));
  }
  return items;
}


/**
 *
 * @param form antd封装好的form对象
 * @param formList 配置数组
 */
export function generateFormItem(form,formList) {
  const formItemLayout = {
    labelCol: {
      xs: 24,
      sm: 4,
    },
    wrapperCol: {
      xs: 24,
      sm: 20,
    },
  };
  const formItemList = [];
  if (formList && formList.length > 0) {
    formList.forEach((item) => {
      const label = item.label;
      const field = item.field;
      const initialValue = item.initialValue || '';
      const placeholder = item.placeholder || '请输入';
      const rules = item.rules || [
        {
          required: true,
          message: '不能为空',
        },
        {
          min: 5, max: 10,
          message: '长度不在范围内',
        },
        {
          pattern: new RegExp('^\\w+$', 'g'),
          message: '必须以字母开头',
        },
      ];
      if (item.type === 'input') {
        const INPUT = (
          <FormItem label={label} key={field} {...formItemLayout}>
            {
                form.getFieldDecorator([field], {
                initialValue,
                rules,
                })(
                  <Input prefix={<UserOutlined />} type="text" placeholder={placeholder} />
                )
            }
          </FormItem>);
        formItemList.push(INPUT);
      } else if (item.type === '时间查询') {
        const begin_time = <FormItem label="查询时间" key={field}>
          {
            form.getFieldDecorator('begin_time', {})(
              <DatePicker showTime placeholder="开始时间" format="YYYY-MM-DD HH:mm:ss"/>
            )
          }
        </FormItem>
        formItemList.push(begin_time);
        const end_time = <FormItem label=" ~ " colon={false} key={field}>
          {
            form.getFieldDecorator('end_time', {})(
              <DatePicker showTime placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"/>
            )
          }

        </FormItem>;
        formItemList.push(end_time);
      } else if (item.type === 'checkbox') {
        const CHECKBOX = <FormItem label={label} key={field} {...formItemLayout}>
          {
            form.getFieldDecorator([field], {
              valuePropName:'checked',
              initialValue, // true | false
            })(
              <Checkbox>
                {label}
              </Checkbox>
            )
          }
        </FormItem>;
        formItemList.push(CHECKBOX);
      }
    })
  }
  return formItemList;
}
