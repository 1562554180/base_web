import React, { Component } from 'react';
import _ from 'lodash';
import vis from 'vis';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';
import { Tooltip, Menu, Dropdown, Button, message, Spin } from 'antd';
import { getVisOptions, exportSvg, downloadImageByCanvas, saveVisToHtml, parseJson, exportToCsv, getRouterType } from 'utils/utils';
import config from 'utils/config';
import htmlToPdf from 'utils/htmlToPdf';
import RelationTooltip from './RelationTooltip';
import VisOptions from './visOptions';
import './common.less';

// const vis = window.vis;
const MenuItem = Menu.Item;
let cloneChart = {};
let num = 1;

export default class Visrelationmodul extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipObj: {},
      tooltipVisible: false,
      isDrag: false,
      isloading: true,
    };
    if(props.parent) {
      props.parent.onClickSave = this.onClickSave;
    }
  }

  setSelectedEdge = (edgeId) => {
    const { data = {} } = this.props;
    const selectedEdge = (data.edges || []).filter(edge => edge.id === edgeId)[0] || {};
    this.setState({
      tooltipObj: selectedEdge,
      tooltipVisible: true,
    })
  }

  setSelectedNode = (nodeId) => {
    const { data = {} } = this.props;
    const selectedNode = (data.nodes || []).filter(node => node.id === nodeId)[0] || {};
    this.setState({
      tooltipObj: selectedNode,
      tooltipVisible: true,
    })
  }

  doubleClick = (params) => {
    if(this.clicktimer) clearTimeout(this.clicktimer)
    const { doubleClickNode, doubleClickEdge } = this.props;
    if(params.nodes && params.nodes.length === 1 && doubleClickNode) {// 双击node
      doubleClickNode(params.nodes[0], params, this.props.data)
    } else if(params.edges && params.edges.length === 1 &&
       params.nodes && params.nodes.length === 0 && doubleClickEdge) {// 双击edge
      doubleClickEdge(params.edges[0], params, this.props.data)
    }
  }

  initVisComponent(containerId, data) {
    const that = this;
    const { onEdgeHover, onNodeHove, physics, onNodeClick, onPageClick, onEdgeClick, onNodeBlur, fontStyle, fontColor, edgesColor, showEdgeTooltip, showNodeTooltip,layout, hiddenHover, borderColor, onNodeDoubleClick, onEdgeDoubleClick, onPageDoubleClick, customNodeShape, clickNodeShowTooltip, defaultMould, edgesArrowsOption } = this.props;
    const options = getVisOptions(data, fontStyle, edgesColor, physics, layout, fontColor, hiddenHover, borderColor, edgesArrowsOption || {}, '', defaultMould)
    if (customNodeShape) {
      options.nodes.shape = customNodeShape;
    }
    this.options = options;
    const container = document.getElementById(containerId);
    const network = new vis.Network(container, data || {nodes:[], edges:[]}, options);
    network.on('doubleClick', this.doubleClick);
    network.on('blurEdge', () => {
      that.setState({
        tooltipVisible: false,
      })
    });
    network.on('zoom', () => {
      if (this.props.onZoom) {
        this.props.onZoom();
      }
    });

    network.on('click', (params) => {
      if(this.clicktimer) clearTimeout(this.clicktimer)
      if (clickNodeShowTooltip) {
        if (params && params.event && params.event.center) {
          this.setState({
            ownTipStyle: {top: params.event.center.y + 20, left: params.event.center.x - 20}
          })
        }
      }

      this.clicktimer = setTimeout(() => {
        if(this.props.routerVisible){
          this.props.routerVisible(true);
        }
        if(params.nodes && params.nodes.length === 1 && onNodeClick) {// 点击node
          onNodeClick(params.nodes[0], params, this.props.data);
        } else if(params.edges && params.edges.length === 1 && params.nodes && params.nodes.length === 0 && onEdgeClick) {// 点击edge
          onEdgeClick(params.edges[0], params, this.props.data)
        } else if (params.nodes.length === 0 && params.edges.length === 0 && onPageClick) {
          onPageClick(params, this.props.data)
        }
      }, 300)
    });

    network.on('doubleClick', (params) => {
      if(this.clicktimer) clearTimeout(this.clicktimer);
      if(this.dbclicktimer) clearTimeout(this.dbclicktimer);
      this.dbclicktimer = setTimeout(() => {
        if(this.props.routerVisible){
          this.props.routerVisible(true);
        }
        if(params.nodes && params.nodes.length === 1 && onNodeDoubleClick) {// 点击node
          onNodeDoubleClick(params.nodes[0], params, this.props.data)
        } else if(params.edges && params.edges.length === 1 && params.nodes && params.nodes.length === 0 && onEdgeDoubleClick) {// 点击edge
          onEdgeDoubleClick(params.edges[0], params, this.props.data)
        } else if (params.nodes.length === 0 && params.edges.length === 0 && onPageDoubleClick) {
          onPageDoubleClick(params, this.props.data)
        }
      }, 300)
    });

    network.on('dragEnd', (params) => {
      if (this.props.onDragEnd) {
        this.props.onDragEnd(params);
      }
      // if (params.nodes && params.nodes.length > 0) {
      //   network.clustering.updateClusteredNode(params.nodes[0], {physics: false});
      // }
      if (this.state.isDrag && !this.options.physics)  {
        this.onDragEnd(params);
      } else if (!this.options.physics) {
        this.onDragEndNoDrag(params);
      }
    });
    network.on('dragStart', (params) => {
      if (this.state.isDrag && !this.options.physics) {
        this.onDragStart(params);
      }
    });
    network.on('hoverEdge', (params) => {
      if(onEdgeHover) {
        onEdgeHover(params.edge)
      }
      if(showEdgeTooltip) {
        that.setSelectedEdge(params.edge)
      }
    });
    network.on('hoverNode', (params) => {
      if(onNodeHove && config.nodeHoverEvent) {
        onNodeHove(params)
      }
      if(showNodeTooltip) {
        that.setSelectedNode(params.node);
      }
    });

    network.on('blurNode', () => {
      that.setState({
        tooltipVisible: false,
      })
      if(onNodeBlur) {
        onNodeBlur(false, null)
      }
    });
    return network;
  }

  onDragStart = (params) => {
    this.oldNodePosition = params.pointer.canvas;
  }

  onDragEnd = (params) => {
    const { id } = this.props;
    const matchChartData = cloneChart[id] || {};
    const chart = {
      nodes: _.uniqBy(matchChartData.nodes, 'id'),
      edges: _.uniqBy(matchChartData.edges, 'id'),
    };
    const { nodes=[], edges=[] } = chart || {};
    const nodeId = params.nodes[0];
    const newNodePosition = params.pointer.canvas;
    const oldNode = nodes.filter(item => item.id === nodeId);
    const pos = this.network.getPositions() || {};
    const position = this.network.getViewPosition();
    const edgeBye = [];
    for (const it of edges) {
      if (String(it.from) === String(nodeId)) {
        edgeBye.push(it.to)
      }
      if (String(it.to) === String(nodeId)) {
        edgeBye.push(it.from)
      }
    }
    if (oldNode && oldNode[0]) {
      if (!oldNode[0].e || oldNode[0].e.length === 0) {
        oldNode[0].e = edgeBye;
      }
      const scale = this.network.getScale();
      const e = oldNode[0].e || [];
      const x = this.oldNodePosition.x - newNodePosition.x;
      const y = this.oldNodePosition.y - newNodePosition.y;
      for (const it of nodes) {
        const p = pos[it.id];
        if (e.includes(it.id)) {
          if(p) {
            it.x = p.x - x;
            it.y = p.y - y;
          } else {
            it.x -= x;
            it.y -= y;
          }
        } else if (nodeId === it.id) {
          it.x = newNodePosition.x;
          it.y = newNodePosition.y;
        } else if (p) {
          it.x = p.x;
          it.y = p.y;
        }
      }
      this.network.setData(chart);
      this.network.moveTo({position, scale});
    }
  }

  onDragEndNoDrag = (params) => {
    const { id } = this.props;
    const matchChartData = cloneChart[id] || {};
    const chart = {
      nodes: _.uniqBy(matchChartData.nodes, 'id'),
      edges: _.uniqBy(matchChartData.edges, 'id'),
    }
    const { nodes=[] } = chart || {};
    const nodeId = params.nodes[0];
    const newNodePosition = params.pointer.canvas;
    const scale = this.network.getScale();
    const pos = this.network.getPositions() || {};
    const position = this.network.getViewPosition();
    if (nodeId) {
      for (const it of nodes) {
        const p = pos[it.id]
        if (nodeId === it.id) {
          it.x = newNodePosition.x;
          it.y = newNodePosition.y;
        } else if (p) {
          it.x = p.x;
          it.y = p.y;
        }
      }
      this.network.setData(chart);
      this.network.moveTo({position, scale});
    }
  }

  componentDidMount() {
    num = 1;
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    document.oncontextmenu = () => {
      return false;
    }
    const { id, centerInfo } = this.props;
    cloneChart[id] = this.props.data;
    this.network = this.initVisComponent(id || 'vis_relation', this.unionRelation(this.props.data));
    if (centerInfo) this.network.moveTo(centerInfo);
    if (this.state.isloading) {
      this.setState({
        isloading: false,
      })
    }
    if(this.props.parent) {
      this.props.parent.network = this.network;
    }
  }

  unionRelation = (data) => {
    if(!data) return {};
    return {nodes: _.unionBy(data.nodes, 'id'), edges: _.unionBy(data.edges, 'id')}
  }

  updateGrapg = (nextProps) => {
    const { physics, data, fontStyle, edgesColor, layout, cbRedraw, fontColor, otherOptions, hiddenHover, borderColor, customNodeShape, defaultMould } = nextProps;
    const usedData = this.unionRelation(data)
    const options = getVisOptions(usedData, fontStyle, edgesColor, physics, layout, fontColor, hiddenHover, borderColor, {}, '', defaultMould);
    if (customNodeShape) {
      options.nodes.shape = customNodeShape;
    }
    const uOptions = {...options, ...otherOptions};
    uOptions.layout.improvedLayout = false;
    if(this.network) {
      cloneChart[this.props.id] = usedData;
      const scale = this.network.getScale();
      const position = this.network.getViewPosition();
      this.network.setOptions(uOptions);
      this.network.setData(usedData);
      if(this.network) this.network.moveTo({position, scale})
      if (num < 3) {
        num++;
        this.network.fit();
      }
    }
    if (cbRedraw) cbRedraw();
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.layout, nextProps.layout)
      || !_.isEqual(this.props.physics, nextProps.physics)
      || !_.isEqual(this.props.fontStyle, nextProps.fontStyle)
      || this.props.edgesColor !== nextProps.edgesColor
      || this.props.fontColor !== nextProps.fontColor
      || this.props.hiddenHover !== nextProps.hiddenHover
      || this.props.borderColor !== nextProps.borderColor
      && this.network) {
      const { physics, data, fontStyle, edgesColor, layout, fontColor, hiddenHover, borderColor, customNodeShape, defaultMould } = nextProps;
      const options = getVisOptions(data, fontStyle, edgesColor, physics, layout, fontColor, hiddenHover, borderColor, {}, '', defaultMould);
      if (customNodeShape) {
        options.nodes.shape = customNodeShape;
      }
      options.layout.improvedLayout = false;
      this.options = options;
      this.network.setOptions(options);
    }
    if((!_.isEqual(this.props.data, nextProps.data) || this.props.relationDataChange !== nextProps.relationDataChange) && this.network) {
      this.updateGrapg(nextProps)
    }

    if(!_.isEqual(this.props.centerInfo, nextProps.centerInfo)) {
      if (nextProps.centerInfo && nextProps.centerInfo.scale && nextProps.centerInfo.scale !== 0) {
        if (!nextProps.centerInfo.position || !_.isNumber(nextProps.centerInfo.position.x) || isNaN(nextProps.centerInfo.position.x)) return false;
        if(this.network) this.network.moveTo(nextProps.centerInfo)
      }
    }
    if (this.props.focusToCenter) {
      this.props.focusToCenter(this.network)
    }
  }

  saveToPicture = (type) => {
    const { id, downloadFilePrefix } = this.props;
    downloadImageByCanvas(id || 'vis_relation', downloadFilePrefix || '通联关系图', type);
  }

  saveToSvg = () => {
    const { downloadFilePrefix } = this.props;
    exportSvg(this.network, this.options, downloadFilePrefix || '通联关系图')
  }

  saveHtml = () => {
    const { data, downloadFilePrefix } = this.props;
    let positions = {}
    if (this.network) {
      positions = this.network.getPositions()
    }
    saveVisToHtml(data, positions, this.options, downloadFilePrefix || '通联关系图')
  }

  onClickSave = (e) => {
    if (e.key === 'png' || e.key === 'jpg') {
      this.saveToPicture(e.key)
    } else if (e.key === 'html') {
      this.saveHtml()
    } else if (e.key === 'svg') {
      this.saveToSvg()
    }
  }

  createDownloadMenuList = () => {
    return (
      <Menu onClick={this.onClickSave}>
        <MenuItem key='jpg'>保存为JPG图片</MenuItem>
        <MenuItem key='png'>保存为PNG图片</MenuItem>
        <MenuItem key='svg'>保存为SVG</MenuItem>
        <MenuItem key='html'>保存为HTML</MenuItem>
      </Menu>
    )
  }

  handelUpdateAd = (option={}, str) => {
    const { updateOptions } = this.props;
    if (_.isEmpty(this.props.data)) return message.warn('暂无数据');
    const { edges, physics } = option;
    let opt = {};

    if (str === 'edge') {
      opt = {
        edges: {
          ...this.options.edges,
          ...edges,
        },
      }
    } else if (str === 'physics') {
      opt = {
        physics: {
          ...this.options.physics,
          ...physics,
        },
      }
    }
    if (updateOptions) updateOptions(opt);
    this.network.setOptions(opt);
    const uOptions = {...this.options, ...opt};
    if (uOptions && uOptions.physics && uOptions.physics.enabled && this.state.isDrag && this.updateDragFlag) {
      this.updateDragFlag();
    }
    this.options = uOptions;
  }

  changeZoom = (str) => {
    if (_.isEmpty(this.props.data)) return message.warn('暂无数据');
    let scale = this.network.getScale();
    let step = 0.05;
    let flag = true;

    if (scale < 0.005) {
      step = 0.0005;
    } else if (scale < 0.05) {
      step = 0.005;
    } else if (scale < 0.5) {
      step = 0.02;
    }
    if (str === 'up') {
      scale += step;
      flag = true;
    }
    if (str === 'down' && scale > step) {
      scale -= step;
    } else if (str === 'down') {
      flag = false;
    }
    if (flag) {
      this.network.moveTo({scale});
    } else {
      message.warn('图层已缩小到最小');
    }
  }

  changeFont = (str) => {
    const { data } = this.props;
    if (_.isEmpty(data)) return message.warn('暂无数据');
    if (this.options.physics) {
      this.network.setOptions({physics: false});
      this.options.physics = false;
    }
    const step = config.topoFontSizeStep || 5;
    const usedData = this.unionRelation(data);
    const scale = this.network.getScale();
    const position = this.network.getViewPosition();
    const pos = this.network.getPositions() || {};
    let flag = true;
    for (const it of usedData.nodes) {
      const p = pos[it.id]
      if(p) {
        it.x = p.x;
        it.y = p.y;
      }
      if (str === 'up') {
        it.font.size += step;
        it.font.clonesize += step;
      }
      if (str === 'down') {
        if (it.font.size > 20) {
          it.font.size -= step;
          it.font.clonesize -= step;
        } else {
          flag = false;
        }
      }
    }
    if (flag) {
      this.network.setData(usedData);
      this.network.moveTo({position, scale});
    } else {
      message.warn('字体已缩小到最小');
    }
  }

  changeNodeDistance = (str) => {
    if (_.isEmpty(this.props.data)) return message.warn('暂无数据');
    const step = config.topoNodeDistanceStep || 30;
    const { otherOptions } = this.props;
    const uOptions = {...this.options, ...otherOptions};
    const scale = this.network.getScale();
    const position = this.network.getViewPosition();
    const phyOptions = this.network.physics.options;
    const solv = phyOptions.solver;
    const midspringLength = phyOptions[solv].springLength;
    let flag = true;
    if (!uOptions.physics) {
      uOptions.physics = {};
      uOptions.physics.solver = solv;
      uOptions.physics[solv] = phyOptions[solv];
    } else {
      uOptions.physics.solver = solv;
      uOptions.physics[solv] = phyOptions[solv];
    }
    if (str === 'up') {
      if (uOptions.physics[solv].springLength > 0) {
        uOptions.physics[solv].springLength += step;
      } else if (midspringLength) {
        uOptions.physics[solv].springLength = midspringLength + step;
      } else {
        uOptions.physics[solv].springLength = step;
      }
    }
    if (str === 'down') {
      if (uOptions.physics[solv].springLength > 40) {
        uOptions.physics[solv].springLength -= step;
      } else if (midspringLength && !uOptions.physics[solv].springLength && midspringLength > 40) {
        uOptions.physics[solv].springLength = midspringLength - step;
      } else {
        flag = false;
      }
    }
    if (uOptions.physics[solv].theta) {
      delete uOptions.physics[solv].theta;
    }
    if (flag) {
      this.options = uOptions;
      this.network.setOptions(uOptions);
      this.network.moveTo({position, scale});
      if (this.timer) {
        clearTimeout(this.timer);
      };
      this.timer = setTimeout(() => {
        this.network.setOptions({physics: false});
        this.options.physics = false;
      }, config.timerInterval3)
    } else {
      message.warn('节点距离已缩小到最小');
    }
    if (this.state.isDrag && this.updateDragFlag) {
      this.updateDragFlag();
    }
  }

  changeNodeSize = (str) => {
    if (_.isEmpty(this.props.data)) return message.warn('暂无数据');
    if (this.options.physics) {
      this.network.setOptions({physics: false});
      this.options.physics = false;
    }
    const step = config.topoNodeSizeStep || 30;
    const { data } = this.props;
    const usedData = this.unionRelation(data);
    const scale = this.network.getScale();
    const position = this.network.getViewPosition();
    const pos = this.network.getPositions() || {};
    let flag = true;
    for (const it of usedData.nodes) {
      const p = pos[it.id]
      if(p) {
        it.x = p.x;
        it.y = p.y;
      }
      if (str === 'up') {
        it.size += step;
        it.defaultNodesize += step;
        it.cloneSize += step;
      }
      if (str === 'down') {
        if (it.size > 10) {
          it.size -= step;
          it.defaultNodesize -= step;
          it.cloneSize -= step;
        } else {
          flag = false;
        }
      }
    }
    if (flag) {
      this.network.setData(usedData);
      this.network.moveTo({position, scale});
    } else {
      message.warn('节点已缩小到最小');
    }
  }

  changePhysic = () => {
    const { otherOptions, defaultPhysics } = this.props;
    const uOptions = {...this.options, ...otherOptions};
    this.options = uOptions;
    this.options.physics = true;
    this.network.setOptions({physics: defaultPhysics});
    if (this.timer) {
      clearTimeout(this.timer);
    };
    this.timer = setTimeout(() => {
      this.network.setOptions({physics: false});
      this.options.physics = false;
    }, config.timerInterval_5)
  }

  changeDragFlag = (val) => {
    if (!val) {
      this.network.setOptions({physics: false});
      this.options.physics = false;
    }
    this.setState({
      isDrag: !val,
    })
  }

  renderVisOptions = () => {
    const { defaultMould={}, positionLeft, positionTop } = this.props;
    if (this.network && !_.isEmpty(this.props.data)) {
      const parm = parseJson(defaultMould.params, {});
      const physics = parm.physics || {};
      physics.enabled = false;
      return (
        <VisOptions
          parent={this}
          nodesNum={this.props.data.nodes.length || 0}
          positionTop={positionTop || "-10px"}
          positionLeft={positionLeft}
          network={this.network}
          handelUpdateAd={this.handelUpdateAd}
          changeZoom={this.changeZoom}
          changeFont={this.changeFont}
          changeNodeDistance={this.changeNodeDistance}
          changeNodeSize={this.changeNodeSize}
          changePhysic={this.changePhysic}
          physics={physics}
          changeDragFlag={this.changeDragFlag}
        />
      )
    }
  }

  renderLegend = () => {
    const { data = {}, customLegend } = this.props;
    const nodes = data.nodes || [];
    if (!_.isEmpty(nodes)) {
      if (customLegend) {
        return customLegend;
      } else {
        return (
          <div style={{ display: 'flex', position: 'absolute', top: 5 }}>
            <div style={{ display: 'flex', alinItems: 'center' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: "#8DD156" }}></div>
              <div style={{ marginLeft: 5, fontWeight: 'bold', lineHeight: '20px' }}>主校区</div>
            </div>
            <div style={{ display: 'flex', alinItems: 'center', marginLeft: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: "#ffd800" }}></div>
              <div style={{ marginLeft: 5, fontWeight: 'bold', lineHeight: '20px' }}>小区</div>
            </div>
            <div style={{ display: 'flex', alinItems: 'center', marginLeft: 10  }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: "#14ecfe" }}></span>
              <span style={{ marginLeft: 5, fontWeight: 'bold', lineHeight: '20px' }}>IP</span>
            </div>
          </div>
        )
      }
    } else {
      return '';
    }
  }

  render() {
    const { id, style, showEdgeTooltip, showNodeTooltip, createTooltipContent, toolTipStyle, toolTipOffsetX, toolTipOffsetY, hiddenDownButton, downloadStyle, isDownLoad, showContext, otherButtons, shrinkTopo, clickNodeShowTooltip, hiddenVisoptions, showLegend } = this.props;
    const { tooltipVisible, tooltipObj, ownTipStyle, contextVisible, conetxtStyle, isloading } = this.state;
    const download = {position:'absolute', right:38, top: -54, zIndex: 100, cursor:'pointer'};
    return (
      <Spin
        spinning={isloading}
        tip={"加载中..."}
      >
        <div style={{position: 'relative'}}>
          {!hiddenVisoptions && this.renderVisOptions()}
          {
            showLegend && this.renderLegend()
          }
          {isDownLoad && !shrinkTopo && (
            <div style={downloadStyle || download}>
              {otherButtons}
              {!hiddenDownButton && (
                <Tooltip title='下载图片' placement='top'>
                  <Dropdown trigger={['click']} overlay={this.createDownloadMenuList()}>
                    <Button
                      icon={<DownloadOutlined />}
                    />
                  </Dropdown>
                </Tooltip>
              )}
            </div>)}
          <div style={style || {width: 300, height: 200}} id={id || 'vis_relation'} />
          {(showEdgeTooltip || showNodeTooltip || clickNodeShowTooltip) && tooltipVisible && (
            <RelationTooltip offsetY={toolTipOffsetY || 200} offsetX={toolTipOffsetX || 120} style={toolTipStyle || ownTipStyle || {}} modelVisible={tooltipVisible}>
              {createTooltipContent && createTooltipContent(tooltipObj || {})}
            </RelationTooltip>
          )}
          {contextVisible && showContext && (
            <RelationTooltip disabledDrag offsetY={200} offsetX={120} style={conetxtStyle} modelVisible={contextVisible}>
              {createTooltipContent && createTooltipContent(tooltipObj || {})}
            </RelationTooltip>
          )}
        </div>
      </Spin>
    );
  }
}
