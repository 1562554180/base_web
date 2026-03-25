import React, { Component } from 'react';
import {
  Tree, Input, Row, Col, Button,
} from 'antd';

const { TreeNode } = Tree;
const { Search } = Input;

const mockData = ['a.b', 'a.c', 'b.c', 'a.c', 'a.c.d', 'a.b.d'];

export default class FieldManage extends Component {
  constructor (props) {
		super(props);
		this.handleCreateTreeData = this.handleCreateTreeData.bind(this, mockData)
    this.state = {
			treeData: this.handleCreateTreeData(mockData),
			autoExpandParent: true,
			searchValue: '',
			expandedKeyData: [],
			isAllExpand: false,
		};
		this.showLine = true;
	}
	
	handleCreateTreeData = (data) => {
		const result = [];
		data.forEach((path) => {
			path.split('.').reduce((level, key) => {
				let temp = level.find(({ name }) => key === name);
				if (!temp) {
					temp = { name: key, children: [] };
					level.push(temp);
				}
				return temp.children;
			}, result)
		})
		return result;
	}

	renderTreeNode = (data) => {
		return data.map((item) => {
			if (item.children) {
				return (
  <TreeNode
    title={
      // onClick={() => this.handleSelectTreeNode(item)}
      <Col>
        <span style={{marginLeft: '10px'}}>{item.name}</span>
      </Col>
  	}
    key={item.name}
    dataRef={item}
  >
    {this.renderTreeNode(item.children || [])}
  </TreeNode>
				);
			}
			return (
  <TreeNode
    title={item.name}
    key={item.name}
  />
			)
		})
	}
	
	// 封装数组扁平化方法
  flattening = (arr, newArr = []) => {
    for(let i = 0; i < arr.length; i++) {
      if(Array.isArray(arr[i])) {
        this.flattening(arr[i], newArr);
      } else {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }
  
  handleChecked = () => {
    const { treeData, isAllExpand } = this.state;
    const expandedKeys = [];
    if (isAllExpand === false) {
      treeData.forEach(item => {
        expandedKeys.push(this.deepTraversa(item));
      })
      this.setState({
        expandedKeyData: this.flattening(expandedKeys),
        isAllExpand: true,
      })
    } else {
      this.setState({
        expandedKeyData: [],
        isAllExpand: false,
      })
    }
	}
	
	onExpand = expandedKeys => {
    this.setState({
      expandedKeyData: expandedKeys,
      autoExpandParent: false,
    })
	}
	
	handleChangeSearchValue = (e) => {
		const { value } = e.target;
		this.setState({
			searchValue: value,
		})
	}

	handleSearch = (tree, value) => {
    const expandedKeys = this.deepSearch(tree, value);
    if (value !== '') {
      this.setState({
        expandedKeyData: this.flattening(expandedKeys),
      })
    } else {
      this.setState({
        expandedKeyData: [],
      })
    }
  }
  
  deepSearch = (tree, value, targetList = []) => {
    tree.forEach(item => {
      if (item.children && item.children !== undefined) {
        this.deepSearch(item.children, value, targetList);
      }
      if (String(item.name).toLowerCase().indexOf(value.toLowerCase()) > -1) {
        targetList.push(item.name + '');
      }
    })
    return targetList;
	}
	
	handleSearchTree = (value) => {
		const { treeData } = this.state;
		this.handleSearch(treeData, value);
	}

	handleSearch = (tree, value) => {
    const expandedKeys = this.deepSearch(tree, value);
    if (value !== '') {
      this.setState({
        expandedKeyData: this.flattening(expandedKeys),
      })
    } else {
      this.setState({
        expandedKeyData: [],
      })
    }
	}
	
	deepTraversa = (node, nodeList = []) => {
    if (node !== null) {
      nodeList.push(node.name + '');
      const children = node.children || [];
      for (let i = 0; i< children.length;i++) {
        this.deepTraversa(children[i], nodeList);
      }
    }
    return nodeList;
  }

  render() {
		const { isMadal, modalVisible } = this.props;
		const { treeData, autoExpandParent, searchValue, expandedKeyData, isAllExpand } = this.state;
    return (
      <Row>
        <Search style={{ marginBottom: 8, width: 200 }} placeholder="请输入名称" value={searchValue} onChange={this.handleChangeSearchValue} onSearch={this.handleSearchTree} />
        <Row>
          <Button type="primary" size="small" onClick={this.handleChecked}>
            {isAllExpand === true ? '全部闭合' : '全部展开'}
          </Button>
				</Row>
				<Tree
					showLine={this.showLine}
					showIcon={false}
					autoExpandParent={autoExpandParent}s
					expandedKeys={expandedKeyData}
					onExpand={this.onExpand}
				>
					{this.renderTreeNode(treeData)}
				</Tree>
			</Row>
    );
  }
}
