import React, { PureComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SyncOutlined } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Input, Select, DatePicker, Button, Row, Col } from 'antd';
import 'react-resizable/css/styles.css';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class SearchBar extends PureComponent {
  constructor(props) {
    super(props)
    this.uuid = 'search' + uuidv4();
    this.state = {
      expand: false,
    }
    this.height = 0;
  }

  updateSearchObj = (value, key) => {
    this.props.updateSearchObj(value, key)
  }

  onReset = () => {
    this.props.onReset()
  }

  showAllSearch = () => {
    const { expand } = this.state;
    this.height = document.getElementById(this.uuid);
    this.setState({
      expand: !expand,
    }, () => {
      if (this.props.getDivHeight) {
        this.props.getDivHeight(this.height.offsetHeight || 0);
      }
    })
  }

  createSearch = () => {
    const { expand } = this.state;
    const {
      columns = [], extraButton, searchObj = {}, searchShowMore, colProps, colSpan, spaceBetweenStyle,
      otherButton, searchArray, searchArryStyle = {}, searchRightDisplay, noButton } = this.props;
    const style = { display: 'flex', ...searchArryStyle };
    const defaultSpan = colSpan || 6;
    const num = Math.floor(24 / defaultSpan);
    const uuid = this.uuid;
    if (spaceBetweenStyle) {
      style.justifyContent = 'space-between';
    }
    let searchList = searchArray || columns.filter(i => i.isSearch);
    if (searchList.length === 0) {
      if (extraButton) return <div>{extraButton}</div>
      return null;
    }

    const searchListLength = searchList.length;
    if (!expand && searchShowMore) {
      searchList = searchList.filter((item, index) => { return index < num });
    }
    let localColProps = {};
    localColProps.span = defaultSpan;
    if (colProps) {
      localColProps = colProps;
    }
    const defaultStyle = { flex: 1 };
    if (searchRightDisplay) {
      defaultStyle.justifyContent = 'flex-end';
    }
    return (
      <div style={style} id={uuid}>
        {extraButton}
        <Row gutter={12} type="flex" style={defaultStyle}>
          {
            searchList.map(item => {
              const label = item.title || item.label;
              const field = item.field || item.dataIndex;
              const props = { ...item.props };
              if (searchObj[field]) {
                props.value = searchObj[field];
              }
              if (item.placeholder) {
                props.placeholder = item.placeholder;
              }
              if (item.style) {
                props.style = item.style;
              }
              if (item.span) {
                localColProps.span = item.span;
              }
              if (item.type === 'select') {
                const options = item.options || {};
                const value = searchObj[field] || (props.mode === 'multiple' ? [] : '');
                return (
                  <Col {...localColProps} key={uuid + field}>
                    <span key={field} style={{ margin: '0px 15px 10px 0px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                      {label && <span className='spliceTextColor' style={{ whiteSpace: 'nowrap', marginRight: 10 }}>{`${label}: `}</span>}
                      <Select allowClear value={value || props.defaultValue} style={{ width: '100%' }} {...props} onChange={e => this.updateSearchObj(e, field, item.type)}>
                        {
                          (item.children || item.selectChildren || []).map(child => {
                            const optionKey = child[options.key] || child.key || child.name;
                            const optionLabel = child[options.value] || child.label || child.value;
                            return <Option key={optionKey} value={optionKey}>{optionLabel}</Option>
                          })
                        }
                      </Select>
                    </span>
                  </Col>
                )
              }
              if (item.type === 'input') {
                return (
                  <Col {...localColProps} key={uuid + field}>
                    <span key={field} style={{ margin: '0px 15px 10px 0px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                      {label && <span className='spliceTextColor' style={{ whiteSpace: 'nowrap', marginRight: 10 }}>{`${label}: `}</span>}
                      <Input {...props} value={searchObj[field] || ''} style={props.style || { width: '100%' }} onChange={(e) => this.updateSearchObj(e.target.value, field, item.type)} />
                      {item.unit && <span>&nbsp;&nbsp;{item.unit}</span>}
                    </span>
                  </Col>
                )
              }
              if (item.type === 'date') {
                let format = 'YYYY-MM-DD HH:mm:ss';
                if (item.showTime === false) {
                  format = 'YYYY-MM-DD';
                } else {
                  props.showTime = true;
                }
                if (item.disabledDate) props.disabledDate = true;
                return (
                  <Col {...localColProps} key={uuid + field}>
                    <span key={field} style={{ margin: '0px 15px 10px 0px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                      {label && <span className='spliceTextColor' style={{ whiteSpace: 'nowrap', marginRight: 10 }}>{`${label}: `}</span>}
                      <DatePicker
                        allowClear
                        format={format}
                        value={searchObj[field] || ''}
                        onChange={(d) => this.updateSearchObj(d, field, item.type)}
                        {...props}
                      />
                    </span>
                  </Col>
                )
              }
              if (item.type === 'rangedate') {
                let format = 'YYYY-MM-DD HH:mm:ss';
                if (item.showTime === false) {
                  format = 'YYYY-MM-DD';
                } else {
                  props.showTime = true;
                }
                if (item.disabledDate) props.disabledDate = true;
                return (
                  <Col {...localColProps} key={uuid + field}>
                    <span key={field} style={{ margin: '0px 15px 10px 0px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                      {label && <span className='spliceTextColor' style={{ whiteSpace: 'nowrap', marginRight: 10 }}>{`${label}: `}</span>}
                      <div>
                        <RangePicker
                          allowClear
                          format={format}
                          style={props.style || { width: '100%' }}
                          value={searchObj[field] || props.defaultValue || []}
                          onChange={(d) => this.updateSearchObj(d, field, item.type)}
                          {...props}
                        />
                      </div>
                    </span>
                  </Col>
                )
              }
              return <div />
            })
          }
        </Row>
        {
          noButton ? null : (
            <div style={{ display: 'flex' }}>
              <Button onClick={this.onSearch} type='primary' style={{ margin: '0 8px 0 5px' }}>查询</Button>
              <Button onClick={this.onReset}> <SyncOutlined />重置</Button>
              {otherButton}
              {searchListLength > num && searchShowMore && (
                <Button style={{ marginLeft: 5 }} onClick={this.showAllSearch}>{expand ? '收起' : '展开'} <LegacyIcon type={expand ? 'up' : "down"} /></Button>
              )}
            </div>
          )
        }
      </div>
    );
  }

  onSearch = () => {
    this.props.onSearch()
  }

  render() {
    return this.createSearch();
  }
}

export default SearchBar;
