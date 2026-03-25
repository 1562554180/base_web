import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Menu } from 'antd';
import { checkContentChanged } from 'utils/content';
import { startsWithHttp } from 'utils/utils';
import { Link } from 'dva/router';
import classNames from 'classnames';
import styles from './menu.less';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
export function getIcon(icon) {
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0 || icon.indexOf('/') > -1) {
      return <img style={{width: 16}} src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
    }
    if (icon.indexOf('#icon') > -1) {
      return (
        <svg className={classNames('icon', 'menuIcon')} width='100%' height='100%'>
          <use xlinkHref={icon} />
        </svg>
      )
    }
    return <LegacyIcon type={icon} />;
  }

  return icon;
}

// conversion Path
// 转化路径
function conversionPath(path) {
  if (path && startsWithHttp(path) === true) {
    return path;
  } else {
    return `/${path || ''}`.replace(/\/+/g, '/');
  }
}

/**
 * 判断是否是http链接.返回 Link 或 a
 * Judge whether it is http link.return a or Link
 */
export function getMenuItemPath(item, props) {
  const dialogMenu = [];
  const itemPath = conversionPath(item.path);
  const icon = getIcon(item.icon, props);
  const { target, name } = item;
  const linkText = (
    <span className={styles.iconText}>
      {icon}
      <span className={styles.menuText}>{name}</span>
    </span>
  );

  // Is it a http link
  if (item.path && item.iframe) {
    return (
      <Link
        key={itemPath}
        to={{pathname: item.path, _iframeHeader: item.iframe_height, _iframe: item.iframe, params: item.params}}
        target={target}
        replace={itemPath === props.location.pathname}
        onClick={e=>{
          if (props.isMobile) props.onCollapse(true);
          checkContentChanged(e, newPath);
        }}
      >
        {linkText}
      </Link>
    );
  }
  if (item.click) {
    const params = item.params;
    const protocol = item.protocol;
    return (
      <a key={itemPath} onClick={()=> window.clickModuleMenu(itemPath, params, protocol)}>
        {linkText}
      </a>
    );
  }
  if (item.params) {
    return (
      <a href={item.protocol + window.btoa(item.params)}>
        {linkText}
      </a>
    );
  }
  if (startsWithHttp(itemPath)) {
    return (
      <a key={itemPath} href={itemPath} target="_blank" rel="noopener noreferrer">
        {linkText}
      </a>
    );
  }
  if (dialogMenu.length > 0) {
    return (
      <a
        key={itemPath}
        onClick={()=> {
          if (props.updateDialogKey) {
            props.updateDialogKey(item.path)
          }
        }}
      >
        {linkText}
      </a>
    );
  }

  return (
    <Link
      to={itemPath}
      target={target}
      key={itemPath}
      replace={itemPath === props.location.pathname}
      onClick={e=>{
        if (props.isMobile) props.onCollapse(true);
        checkContentChanged(e, newPath);
      }}
    >
      {linkText}
    </Link>
  );
}

/**
 * get SubMenu or Item
 */
function getSubMenuOrItem(item, props, menuClass) {
  if (item.children && item.children.length > 0) {
    const childrenItems = getNavMenuItems(item.children, props, menuClass);
    // 当无子菜单时就不展示菜单
    if (childrenItems && childrenItems.length > 0) {
      const subProps = {};

      if (menuClass) subProps.className = menuClass;
      return (
        <SubMenu
          {...subProps}
          title={
            item.icon ? (
              <span className={styles.iconText}>
                {getIcon(item.icon)}
                {item.name}
              </span>
            ) : (
              item.name
            )
          }
          key={item.path}
        >
          {childrenItems}
        </SubMenu>
      );
    }
  }
  return <Menu.Item key={item.path}>{getMenuItemPath(item, props)}</Menu.Item>;
}

/**
 * 获得菜单子节点
 */
export function getNavMenuItems(menusData, props, menuClass) {
  if (!menusData || menusData.length === 0) {
    return [];
  }
  return menusData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => getSubMenuOrItem(item, props, menuClass))
    .filter(item => item);
}
