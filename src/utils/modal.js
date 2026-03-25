import { Modal } from 'antd';

// 存储全局 modal 实例
let globalModalInstance = null;

/**
 * 设置全局 modal 实例
 * 应该在 App 组件中调用
 */
export function setGlobalModal(modal) {
  globalModalInstance = modal;
}

/**
 * 获取全局 modal 实例
 */
function getGlobalModal() {
  return globalModalInstance;
}

/**
 * 包装的 Modal 对象，提供与 antd Modal 相同的 API
 * 静态方法（confirm, info, success, error, warning）会使用全局 modal 实例（如果可用），
 * 否则回退到原始 Modal
 * 其他方法和属性直接使用原始 Modal
 */
const CustomModal = Object.create(Modal);
Object.setPrototypeOf(CustomModal, Modal);

// 重写静态方法，使其使用全局 modal 实例
CustomModal.confirm = (config) => {
  const modal = getGlobalModal();
  if (modal && modal.confirm) {
    return modal.confirm({...config, className: `custom_modal ${config.className || ''}`});
  }
  // 回退到原始 Modal.confirm
  return Modal.confirm({...config, className: `custom_modal ${config.className || ''}`});
};

CustomModal.info = (config) => {
  const modal = getGlobalModal();
  if (modal && modal.info) {
    return modal.info({...config, className: `custom_modal ${config.className || ''}`});
  }
  return Modal.info({...config, className: `custom_modal ${config.className || ''}`});
};

CustomModal.success = (config) => {
  const modal = getGlobalModal();
  if (modal && modal.success) {
    return modal.success({...config, className: `custom_modal ${config.className || ''}`});
  }
  return Modal.success({...config, className: `custom_modal ${config.className || ''}`});
};

CustomModal.error = (config) => {
  const modal = getGlobalModal();
  if (modal && modal.error) {
    return modal.error({...config, className: `custom_modal ${config.className || ''}`});
  }
  return Modal.error({...config, className: `custom_modal ${config.className || ''}`});
};

CustomModal.warning = (config) => {
  const modal = getGlobalModal();
  if (modal && modal.warning) {
    return modal.warning({...config, className: `custom_modal ${config.className || ''}`});
  }
  return Modal.warning({...config, className: `custom_modal ${config.className || ''}`});
};

export default CustomModal;
