import React from 'react';
import _ from 'lodash';

export default class DialogManager {
  constructor(props) {
    this.init(props.dialogsToShow, props.context)
  }

  init(dialogsToShow, context) {
    const dialogs = {};
    for (const k in dialogsToShow) {
      const c = dialogsToShow[k];
      let component;

      if (c.componentCreator) {
        component = {
          fn: true,
          component: (componentProps) => c.componentCreator(context.props, context, k, this.isDialogVisible, this.setDialogVisible, componentProps),
          check: c.check,
          preCheck: c.preCheck,
          alwaysRender: c.alwaysRender,
        }
      } else if (_.isArray(c)) {
        component = {
          component: c[0],
          check: c[1],
        };
        if (c[2]) {
          component.alwaysRender = true;
        }
      } else if (c.component) {
        component = c;
      } else {
        component = {
          component: c,
        };
      }
      dialogs[k] = component;
    }
    this.dialogs = dialogs;
    this.context = context;
    const _this = this;
    context.setDialogVisible = (key, visible, state) => {
      _this.setDialogVisible(key, visible, state);
    };
    context.toggleDialogVisible = (key, state) => {
      _this.toggleDialogVisible(key, state);
    };
  }

  setDialogVisible = (key, visible, state) => {
    const context = this.context;
    const dialog = this.dialogs[key];
    if (!dialog) return;
    if (visible && dialog.check && dialog.check(context, this) === false) {
      return;
    }
    const oldDialogVisible = context.state.dialogVisible;
    const dialogVisible = {...oldDialogVisible, [`${key}Visible`]: visible};
    context.setState({
      dialogVisible,
      ...state,
    });
    if (!visible && dialog.onClose) dialog.onClose(context);
  }

  isDialogVisible = (key) => {
    const { dialogVisible } = this.context.state;
    return !!dialogVisible[`${key}Visible`];
  }

  toggleDialogVisible = (key, state) => {
    this.setDialogVisible(key, !this.isDialogVisible(key), state);
  }

  hideAll() {
    const context = this.context;
    const { dialogVisible } = context.state;
    let changed = false;

    for (const k in dialogVisible) {
      const v = !!dialogVisible[k];
      if (v) {
        dialogVisible[k] = false;
        changed = true;
      }
    }
    if (changed) {
      context.setState({
        dialogVisible: {
          ...dialogVisible,
        },
      });
    }
  }

  render(dialogProps) {
    const context = this.context;
    const dialogsToShow = [];
    const { dialogVisible } = context.state;

    for (const k in dialogVisible) {
      const v = !!dialogVisible[k];
      const dialogKey = k.substr(0, k.length - 7);
      const d = this.dialogs[dialogKey];

      if (!d) continue;
      if (d.preCheck && d.preCheck() === false) continue;
      if (!v && !d.alwaysRender) continue;

      let component;
      const props = {
        ...dialogProps,
        modalVisible: v,
        visible: v,
        handleModalVisible: (visible) => this.setDialogVisible(dialogKey, visible),
        hideModal: () => this.setDialogVisible(dialogKey, false),
      }

      if (d.fn) {
        component = d.component(props);
      } else {
        let otherProps = {};

        if (d.createProps) {
          otherProps = d.createProps(context, this.setDialogVisible, dialogKey);
        }
        component = <d.component {...props} {...otherProps} />;
      }
      dialogsToShow.push(component);
    }

    return dialogsToShow;
  }
}