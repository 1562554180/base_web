import React, { PureComponent } from 'react';
import { Dropdown } from 'antd';
import ArrowDownIcon from 'assets/arrowDownSolid.png';

export default class TableDropDownMenu extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
		const { menu } = this.props;
    return (
      <span style={{ marginLeft: 3 }}>
        <Dropdown 
          overlay={menu}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <img src={ArrowDownIcon} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </span>
    );
  }
}