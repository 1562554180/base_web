import React from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';

// import '@ant-design/compatible/assets/index.css';


import { Input, Button } from 'antd';
import * as keyboardFilters from 'utils/keyboard';
import * as inputFilters from 'utils/input';

const FormItem = Form.Item;
const InputGroup = Input.Group;

let uuid = 0;

class DynamicHosts extends React.Component {
  state = {
    hosts: this.props.hosts || [],
  };

  remove = (k) => {
    const { hosts } = this.state;

    this.setState({
      hosts: hosts.filter((item, index) => index !== k),
    });
  }

  add = () => {
    const { hosts } = this.state;
    
    hosts.push(['', '']);
    uuid += 1;
    this.setState({ hosts });
  }

  saveHosts = (type, nv, index) => {
    const { hosts } = this.state;

    if (type === 1) {
      if (inputFilters.ip(nv)) {
        hosts[index][0] = nv;
      }
    } else if (type === 2) {
      if (inputFilters.port(nv)) {
        hosts[index][1] = nv;
      }
    }
    this.setState({hosts});
    if (this.props.saveHosts) this.props.saveHosts(hosts);
  }

  render() {
    const { labelCol, wrapperCol, label, offset } = this.props;
    const { hosts } = this.state;
    const formItemLayout = {
      labelCol,
      wrapperCol,
    };
    const addButtonFormItemLayout = {
      labelCol,
      wrapperCol: {
        ...wrapperCol,
        offset,
      },
    };
    const formItems = hosts.map((item, index) => {
      const id = uuid + '_' + index;

      return (
        <FormItem
          {...(index === 0 ? formItemLayout : addButtonFormItemLayout)}
          label={index === 0 ? label : ''}
          key={`host_${id}`}
        >
          <InputGroup compact>
            <Input style={{ width: hosts.length > 1 ? '60%' : '70%' }} placeholder="IP" onChange={e=>this.saveHosts(1, e.target.value, index)} value={item[0]} onKeyPress={keyboardFilters.ip} />
            <Input style={{ width: '30%' }} placeholder="端口" value={item[1]} onChange={e=>this.saveHosts(2, e.target.value, index)} onKeyPress={keyboardFilters.number} />
            {hosts.length > 1 ? (
              <Button style={{ width: '10%' }} type="danger" icon={<MinusOutlined />} disabled={hosts.length === 1} onClick={() => this.remove(index)} />
            ) : null}
          </InputGroup>
        </FormItem>
      );
    });
    formItems.push((
      <FormItem {...addButtonFormItemLayout} key="host_add">
        <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
          <PlusOutlined /> 增加
        </Button>
      </FormItem>
    ));
    return formItems;
  }
}

export default DynamicHosts;
