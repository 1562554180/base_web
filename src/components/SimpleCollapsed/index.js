import React, { Component } from "react";
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import _ from 'lodash';

export default class AutoCollapsed extends Component {
  constructor(props) {
    super();
    this.state = {
      data: props.data,
      planLength: props.length,
      collapsed: false,
    }
  }

  componentWillReceiveProps(nextProps){
    if (_.isEqual(this.props, nextProps)) {
      this.setState({
        data: nextProps.data,
        planLength: nextProps.length,
        collapsed: false,
      })
    }
  }

  toggleCollapsed = (e) => {
    e.stopPropagation();
    const { collapsed } = this.state;
    this.setState({
      collapsed:!collapsed,
    })
  }

  render() {
    const { data, collapsed, planLength } = this.state;
    return (
      <span>
        <span style={{ wordWrap: 'break-word' }}>{collapsed === true ?  String(data) : String(data).substr(0, planLength)}</span>
        {
          collapsed === true ? 
          (
            <Button type="primary" icon={<UpOutlined />} size="small" style={{ marginLeft: 5 }} onClick={(e) => this.toggleCollapsed(e)} />
          ) : 
          (
            <Button type="primary" icon={<DownOutlined />} size="small" style={{ marginLeft: 5 }} onClick={(e) => this.toggleCollapsed(e)} />
          )
        }
      </span>
    );
  }
}