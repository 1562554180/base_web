import React, { PureComponent } from 'react';
import {
  Form,
  Input,
} from 'antd';
import AutoSizeDialog from 'components/Dialog';
import FormItemEx from 'components/Helper/FormItem';
import { createSubmitHandler } from 'utils/form';
import { showErrorMessage } from 'utils/utils';

const formName = 'user';

@Form.create()
export default class UserDialog extends PureComponent {

  onOk = (err, fields, resetFields) => {
    if (err) {
      showErrorMessage(err);
      return;
    }
    if (this.props.isEdit) {
      fields.id = this.props.values.id;
    }
    this.props.dispatch({
      type: `user/${this.props.isEdit ? 'edit' : 'create'}`,
      payload: fields,
      callback: () => {
        resetFields();
        this.props.handleModalVisible(false);
      },
    });
  };

  render() {
    const { modalVisible, form, settings, loading, values, handleModalVisible, isEdit } = this.props;

    if (!this.submitHandler) {
      this.submitHandler = createSubmitHandler({
        form,
        onSubmit: this.onOk.bind(this),
        formName,
        formRules: settings.formRules,
      })
    }

    const formItemProps = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
      form,
      settings,
      formName,
      values,
    };

    return (
      <AutoSizeDialog 
        title={isEdit ? '编辑对象' : '创建对象'}
        visible={modalVisible}
        loading={loading}
        height={300}
        onOk={this.submitHandler}
        onCancel={() => handleModalVisible(false)}
      >
        {!isEdit && (
        <FormItemEx {...formItemProps} fieldName="name">
          <Input placeholder="请输入" disabled={isEdit} />
        </FormItemEx>)}
        <FormItemEx {...formItemProps} fieldName="description">
          <Input placeholder="请输入" />
        </FormItemEx>
      </AutoSizeDialog>
    );
  }
}
