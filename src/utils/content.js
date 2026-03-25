import { routerRedux } from 'dva/router';
import { Modal } from 'antd';
import uri from './uri';
import { showMessage, isUrl } from './utils';
import config from './config';

export function setContentChange(v) {
  config.content.isChanged = v || false;
}

function nav(to) {
  if (isUrl(to)) {
    uri.toUrl(to);
  } else {
    const treeMenusAddSearch = config.header.treeMenusAddSearch.filter(item => to.indexOf(item) ===0) || [];
    if(config.dataSource && treeMenusAddSearch.length > 0) {
      config.store.dispatch(routerRedux.push(`${to}?id=${config.dataSource}`));
    } else {
      config.store.dispatch(routerRedux.push(to));
    }
  }
}

export function checkContentChanged(e, to, needNavigation) {
  if (!config.content.isChanged) {
    if (needNavigation) {
      nav(to);
    }
    return false;
  }
  e.defaultPrevented = true;
  if(e.preventDefault) e.preventDefault();
  Modal.confirm({
    title: '内容变化确认',
    content: '当前编辑的内容未保存，确认要离开当前页面吗？',
    onOk() {
      const cb = () => {
        config.content.isChanged = false;
        nav(to);
      }
      if (config.content.cbChanged) {
        showMessage('正在保存页面内容请稍后');
        config.content.cbChanged();
        setTimeout(cb, 10);
      } else {
        cb();
      }
    },
  });
}
