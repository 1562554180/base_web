import React from 'react';
import { BarsOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';
import _ from 'lodash';

const { SubMenu } = Menu;

const DropOption = ({ onMenuClick, menuOptions = [], buttonStyle, dropdownProps, size, type, title, menuProps }) => {
const menu = menuOptions.map(item => {
  if (item.key === 'divider') return <Menu.Divider key={item.key} />;
  if(item.subTitle && !_.isEmpty(item.subMenuData)) {
    const subMenuData = item.subMenuData;
    return (
      <SubMenu title={item.subTitle || ''}>
        {
          subMenuData.map((core) => {
            return (
              <Menu.Item style={core.menuItemStyle} disabled={core.disabled} key={core.key}>{core.name}</Menu.Item>
            )
          })
        }
      </SubMenu>
    )
  } else {
    return <Menu.Item style={item.menuItemStyle} disabled={item.disabled} key={item.key}>{item.name}</Menu.Item>;
  }
})
  return (
    <Dropdown
      overlay={<Menu {...menuProps} onClick={onMenuClick}>{menu}</Menu>}
      {...dropdownProps}
    >
      <Button style={{ border: 'none', ...buttonStyle }} size={size || 'default'} type={type || null}>
        {title}
        <BarsOutlined style={{ marginRight: 2 }} />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}

export default DropOption;
