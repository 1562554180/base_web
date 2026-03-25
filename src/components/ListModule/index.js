import React, { PureComponent } from 'react';
import { Input, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import _ from 'lodash'
import styles from './index.less';

export default class ListModule extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listValue: '',
      listData: props.data || [],
      selectdRecord: {},
    };
  }

   componentDidMount() {
    const { data = [], defaultChecked } = this.props;
    if (defaultChecked) this.clickListRecord(data[0] || {});
  }

  componentWillReceiveProps(nextProps){
    const { defaultChecked } = this.props;
    if(!_.isEqual(this.props.data, nextProps.data)) {
      this.setState({
        listValue: '',
        searchData: false,
        selectdRecord: nextProps.selectdRecord,
        listData: nextProps.data,
      }, defaultChecked ? () => this.clickListRecord(nextProps.selectdRecord || nextProps.data[0] || {}) : null)
    }
  }

  clickListRecord = (record) => {
    const { onClickRecord } = this.props;
    this.setState({
      selectdRecord: record,
    }, onClickRecord ? onClickRecord(record) : null)
  }

  searchChange = (e) => {
    this.setState({
      listValue: e.target.value,
    })
  }

  onSearch = () => {
    const { listValue, listData = [] } = this.state;
    const { options = {} } = this.props;
    const { name = 'name' } = options;
    let searchData = false;
    if(listValue) {
      searchData = listData.filter(item => item[name].toLowerCase().indexOf(listValue.toLowerCase()) !== -1);
    }
    this.setState({
      searchData,
    })
  }

  onReset = () => {
    this.setState({
      listValue: '',
      searchData: false,
    })
  }

  searchRender = () => {
    const { listValue } = this.state;
    return (
      <div>
        <Input
          size='small'
          value={listValue}
          style={{width: 200, marginBottom: 6}}
          placeholder='请输入搜索内容'
          onChange={this.searchChange}
          onPressEnter={this.onSearch}
        />
        <Button size='small' style={{margin: '0px 4px'}} onClick={this.onSearch} type='primary'>查询</Button>
        <Button size='small' onClick={this.onReset} type='primary'>重置</Button>
      </div>
    )
  }

  render() {
    const { options = {}, listHeight, renderName, useUnderlineClass } = this.props;
    const { listData = [], selectdRecord = {}, searchData } = this.state;
    const { key = 'key', name = 'name' } = options;
    const defaultClass = useUnderlineClass ? 'listDefault_underLine' : 'listDefault';
    return (
      <>
        {this.searchRender()}
        <Scrollbars style={{height: listHeight || 'calc(100vh - 150px)'}}>
          {(searchData || listData).map((item) => {
              return (
                <div
                  key={item[key]}
                  onClick={() => this.clickListRecord(item)}
                  className={`${styles.listRecord} ${selectdRecord[key] === item[key] ? 'listActive' : defaultClass}`}
                >
                  {renderName ? renderName(item) : item[name]}
                </div>
              )
            })}
        </Scrollbars>
      </>
    );
  }
}
