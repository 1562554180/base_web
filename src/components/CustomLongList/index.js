import React, { PureComponent } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { Spin, Tooltip, Table, Input, Button, Pagination } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import AutoScrollDrawer from 'components/AutoScrollDrawer';

import styles from './index.less';

const { Search } = Input;

class LongList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initBaseState(props)
    this.columns = [
      {dataIndex: 'name', width: '60%'},
      {dataIndex: 'value', width: '40%'},
    ]
  }

  initBaseState = (props) => {
    const defaultList = props.defaultList || [];
    const pageSize = props.pageSize || 50;
    const state = {
      pagingByWeb: true,
      modalVisible: false,
      list: defaultList,
      moreList: defaultList.slice(0, pageSize), 
      pageSize, 
      current: 1,
      total: defaultList.length,
      allTotal: defaultList.length,
      action: props.action,
      params: props.params,
      isLoading: true,
      moreLoading: false,
      hiddenRequest: props.hiddenRequest,
    };
    if (!_.isUndefined(props.pagingByWeb)) {
      state.pagingByWeb = props.pagingByWeb;
    }

    if (!_.isUndefined(props.isLoading)) {
      state.isLoading = props.isLoading;
    }
    return state;
  }

  componentDidMount() {
    this.getList()
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.defaultList, nextProps.defaultList)
      || !_.isEqual(this.props.params, nextProps.params)
      || this.props.isLoading !== nextProps.isLoading
    ) {
      const state = this.initBaseState(nextProps)
      this.setState(state, this.getList)
    }
  }

  filterProType = (val) => {
    if (!val) return;
    const proTypeCode = window.$proTypeCode;
    for (const k in proTypeCode) {
      if (proTypeCode[k].toLowerCase() === val.toLowerCase()) {
        return k;
      }
    }
    return val;
  }

  getList = () => {
    const { dispatch, getData, fieldName, hasSql, hasLike, hasProType } = this.props;
    const { action, params, hiddenRequest, pageSize, current, searchValue } = this.state;
    const payload = {...params, pageSize, currentPage: current};
    if (hasSql && searchValue) {
      if (hasLike) {
        if (hasProType) {
          const middlePro = this.filterProType(searchValue);
          payload.where += ` and ${fieldName} like "%${middlePro}%"`;
        } else {
          payload.where += ` and ${fieldName} like "%${searchValue}%"`;
        }
      } else {
        payload.where += `and ${fieldName} = grep('.*${searchValue}.*')`;
      }
    } else if (searchValue) {
      if (!payload.s) payload.s = {};
      payload.s[fieldName] = searchValue;
    }
    
    if (hiddenRequest) return false;
    if (!dispatch) return false;
    dispatch({
      type: action,
      payload,
      callback: (res) => {
        if (getData) {
          getData(res.data || [])
        }
        const list = res.data || [];
        const state = {
          time: res.time,
          isLoading: false,
          moreLoading: false,
          moreList: list.slice(0, pageSize),
          total: res.total || list.length,
        }
        
        if (current === 1 && !searchValue) {
          state.list = list;
          state.allTotal = res.total || list.length;
        }
        this.setState(state)
      },
    })
  }

  renderItem = (item, index) => {
    const { rowKey } = this.props;
    const columns = this.props.columns || this.columns || [];
    const key = rowKey || 'field_name';
    return (
      <div style={{width: '100%', display: 'flex'}} key={item[key]}>
        {
          columns.map((col, idx) => {
            const dataIndex = col.dataIndex;
            const render = col.render;
            const value = render ? render(item[dataIndex], item, index) : item[dataIndex];
            if (idx === 0) {
              return (
                <div style={{width: col.width, display: 'flex', alignItems: 'center', minHeight: 24}} key={dataIndex}>
                  <div className='quickViewIcon' />
                    <Tooltip placement='leftBottom' title={value}>
                      <div className={classNames('whiteSpace', 'overViewText')} style={{width: 'calc(100% - 13px)', textAlign: 'left', fontSize: 12}}>
                        {value}
                      </div>
                    </Tooltip>
                </div>
              )
            }
            return (
              <div 
                key={dataIndex}
                style={{
                  width: col.width, 
                  textAlign: idx === columns.length - 1 ? 'right' : 'left',
                }} 
                className={idx === columns.length - 1 ? 'overViewCount' : 'overViewCount2'}
              >
                {value}
              </div>
            )
          })
        }
      </div>
    )
  }

  renderOtherItem = () => {
    const { allTotal } = this.state;
    const { isTop } = this.props;
    if (!isTop) return null;
    if (allTotal < 11) return null;
    return (
      <a title='点击查看更多'>
        <EllipsisOutlined
          rotate={90}
          style={{cursor:'pointer', fontSize: 18, marginTop: 8}}
          onClick={() => this.handleModalVisible(true)} 
        />
      </a>
    );
  }

  handleModalVisible = (value) => {
    this.setState({
      modalVisible: value,
    })
  }

  pageChange = (current) => {
    const { pagingByWeb, list, pageSize, searchList } = this.state;
    if (pagingByWeb) {
      const data = searchList || list || [];
      const currentSize = pageSize * current;
      this.setState({current, moreList: data.slice(currentSize - pageSize, currentSize)})
    } else {
      this.setState({current, moreLoading: true}, this.getList)
    }
  }

  handleSearch = () => {
    const { searchValue, pagingByWeb } = this.state;
    const { defaultList = [], fieldName } = this.props
    if(pagingByWeb) {
      const searchList = defaultList.filter(item => item[fieldName] && item[fieldName].toString().indexOf(searchValue) > -1 );
      this.setState({current:1, searchList, total: searchList.length}, () => this.pageChange(1))
    } else {
      this.pageChange(1)
    }
  }

  handleChange = (e) => {
    this.setState({
      searchValue: e.target.value,
    })
  }

  handleReset = ()  => {
    const { pagingByWeb, list } = this.state;
    const state = {
      searchValue: '',
      searchList: false,
    };
    if (pagingByWeb) {
      state.total = list.length;
    }
    this.setState(state, () => this.pageChange(1))
  }

  moreContent = () => {
    const { moreList, pageSize, total, current, modalVisible, moreLoading, searchValue } = this.state;
    if (!modalVisible) return null;
    const { listTitle, title } = this.props;
   
    const pageProps = {
      current,
      total,
      pageSize,
      showSizeChanger: false,
      hideOnSinglePage: true, 
      onChange: this.pageChange,
      style: {marginTop: 20, textAlign: 'right'},
    }
    return (
      <AutoScrollDrawer
        title={`${listTitle || title} (${total})`}
        width={450}
        placement='right'
        closable
        onClose={() => this.handleModalVisible(false)}
        visible={modalVisible}
        footer={false}
      >
        <Spin spinning={moreLoading}>
          <div style={{padding: '0px 8px', margin: 'auto', height: 400}}>
            <Search 
              style={{width: '70%', margin: '10px 10px 10px 0px'}}
              value={searchValue}
              onSearch={this.handleSearch}
              onChange={this.handleChange}
            />
            <Button type='primary' onClick={this.handleReset}>重置</Button>
            <Table 
              scroll={{y: 'calc(100vh - 200px)'}}
              showHeader={false}
              pagination={false} 
              dataSource={moreList} 
              style={{height: 'calc(100vh - 200px)'}}
              columns={this.props.columns || this.columns || []} 
            />
            <Pagination {...pageProps} />
          </div>
        </Spin>
      </AutoScrollDrawer>
    );
  }

  createTitle = () => {
    const { time } = this.state;
    const { title, showTime } = this.props;
    if (showTime && time) {
      return (
        <Tooltip title={moment(time).format('YYYY-MM-DD')}>
          <span className='quickViewTitleText'>{title}</span>
        </Tooltip>
      )
    }
    return <span className='quickViewTitleText'>{title}</span>;
  }

  render() {
    const { list, isLoading } = this.state;
    const { style, isTop, listStyle, showEmpty, inDialog, height } = this.props;
    if (!isLoading && list.length === 0 && !showEmpty) return null;
    return (
      <div className={classNames(styles.longList, 'longListTheme')} style={style}>
        <div className={classNames('quickViewTitleStyle', inDialog ? 'quickViewTitleDialogTheme' : 'quickViewTitleTheme')}>
          {this.createTitle()}
          {this.renderOtherItem()}
        </div>
        <Spin spinning={isLoading}>
          <div className={classNames(inDialog ? 'quickViewLeftAndDialogRight' : 'quickViewLeftAndRight')} style={{padding: '0px 8px', minHeight: 50, textAlign: 'center', height: height || 290, ...listStyle }}>
            {
              list.map((item, index) => {
                if (isTop && index > 9) return null;
                return this.renderItem(item, index)
              })
            }
            {list.length === 0 && !isLoading && <div style={{width: 200, height: 200}} className='noDataPng' />}
          </div>
        </Spin>
        {this.moreContent()}
      </div>
    );
  }
}

export default LongList;