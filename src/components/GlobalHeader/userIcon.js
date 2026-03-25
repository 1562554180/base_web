import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Menu, Dropdown } from 'antd';
import Icon from 'components/Icon';
import { l } from 'utils/localization';
import { ThemeContext } from '@/config';
import styles from './index.less';


const clusterChildren = {
  master: [{key: 'disslove', name: '一键解散', disabled: false}],
  normal: [
    {key: 'setMaster', name: '设为集群主节点', disabled: false},
    // {key: 'setNormal', name: '设为普通节点', disabled: false},
    {key: 'joinCluster', name: '加入集群', disabled: false},
  ],
  slave: [],
}
function createMenuItem(item, nodeType) {
  const key = item.path || item.name;
  const kyes = Math.random() * 100 - 1;
  if (item === '') return (<Menu.Divider key={kyes + 'umd'} />);
  if (item.children) {
    return (
      <Menu.SubMenu
        key={key}
        title={
          <span>{item.icon && <Icon type={item.icon} />}{item.text ? l(item.text) : l(item.name)}</span>
        }
      >
        {item.children.map(i => {
          return (
            <Menu.Item key={i.name}>
              <Icon type={i.icon || i.name} />&nbsp;&nbsp;<span>{i.text ? l(i.text) : l(i.name)}</span>
            </Menu.Item>
          )
        })}
      </Menu.SubMenu>
    )
  }
  if (key === "cluster") {
    return (
      <Menu.SubMenu
        key="cluster"
        title={
          <span>{item.icon && <Icon type={item.icon} />}{item.text ? l(item.text) : l(item.name)}</span>
        }
      >
        {(clusterChildren[nodeType]||[]).map(i => {
          return (
            <Menu.Item key={i.key}>
              <span>{i.text ? l(i.text) : l(i.name)}</span>
            </Menu.Item>
          )
        })}
      </Menu.SubMenu>
    )
  }
  return (
    <Menu.Item key={key}>
      <Icon type={item.icon || item.name} /><span>{item.text ? l(item.text) : l(item.name)}</span>
    </Menu.Item>
  );
}

@connect(({ main }) => ({
  user: main.user,
  modeConfig: main.modeConfig,
  globalNodeType: main.globalNodeType,
}))
export default class UserIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userMenu: props.userMenu || [],
      userName: props.user?.name || '',
      isLoginedFlag: props.isLoginedFlag || false,
      modeConfig: props.modeConfig || 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.userMenu, nextProps.userMenu) ) {
      this.setState({
        userMenu: nextProps.userMenu,
      })
    }
    if (!_.isEqual(this.props.user?.name, nextProps.user?.name) ) {
      this.setState({
        userName: nextProps.user?.name,
      })
    }
    if (this.props.isLoginedFlag !== nextProps.isLoginedFlag) {
      this.setState({
        isLoginedFlag: nextProps.isLoginedFlag,
      })
    }
    if (!_.isEqual(this.props.modeConfig, nextProps.modeConfig) ) {
      this.setState({
        modeConfig: nextProps.modeConfig,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.state, nextState)) {
      return true
    }
    if (!_.isEqual(this.props.globalNodeType, nextProps.globalNodeType)) {
      return true
    }
    return false
  }

  render() {
    const { onMenuClick, globalNodeType } = this.props;
    const { isLoginedFlag, userMenu=[], userName, modeConfig } = this.state
    const defaultIcon = isLoginedFlag ? 'icon-guanliyuan' : 'icon-yonghuming';
    const junshiIcon = isLoginedFlag ? 'icon-leidashezhi' : 'icon-radar-line';

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {userMenu.map(item => createMenuItem(item, globalNodeType))}
      </Menu>
    );

    return (
      <ThemeContext.Consumer>
        {context => {
          const themeCustom = context?.theme?.custom || {};
          const { textColor } = themeCustom;
          return (
            <div className={styles.userBox} style={{ color: textColor }}>
              <Dropdown overlay={menu} trigger={['click']}>
                <span title={userName}>
                  <Icon size={18} color={textColor} type={modeConfig === 0 ? defaultIcon : junshiIcon} customIcon />
                </span>
              </Dropdown>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    )
  }
}
