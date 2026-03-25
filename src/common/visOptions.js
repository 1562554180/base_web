import React, { Component } from 'react/index.js';
import { Form } from '@ant-design/compatible';
import { Button } from 'antd';
import Modal from 'utils/modal';
import { ZoomInOutlined, ZoomOutOutlined, SettingOutlined, DragOutlined, NodeIndexOutlined } from '@ant-design/icons';
import FromItemCreator from 'components/FromItemCreator';
import DetailBox from 'common/detailBox';
import classNames from 'classnames';
import styles from './visoptions.less';

const confirm = Modal.confirm;
const formItemLayout = {labelCol: {span: 10}, wrapperCol: {span: 14}};
const enableLayout = {labelCol: {span: 16}, wrapperCol: {span: 8}};
// const Etozh = {
//   gravitationalConstant: '引力常数',
//   centralGravity: '重心',
//   springLength: '弹簧长度',
//   springConstant: '弹簧常数',
//   damping: '阻尼',
//   avoidOverlap: '避免重叠',
//   maxVelocity: '最大速度',
//   minVelocity: '最小速度',
//   solver: '布局类型',
//   timestep: '时间步长',
//   nodeDistance: '节点间距',
//   roundness: '弯曲度',
// }
const smoothType = [
    {label: 'dynamic', value: 'dynamic'},
    {label: 'continuous', value: 'continuous'},
    {label: 'discrete', value: 'discrete'},
    {label: 'diagonalCross', value: 'diagonalCross'},
    {label: 'straightCross', value: 'straightCross'},
    {label: 'horizontal', value: 'horizontal'},
    {label: 'vertical', value: 'vertical'},
    {label: 'curvedCW', value: 'curvedCW'},
    {label: 'curvedCCW', value: 'curvedCCW'},
    {label: 'cubicBezier', value: 'cubicBezier'},
];
const smoothForceDirection = [
    {label: 'horizontal', value: 'horizontal'},
    {label: 'vertical', value: 'vertical'},
    {label: 'none', value: 'none'},
]
const solverList = [
    {label: 'barnesHut', value: 'barnesHut'},
    {label: 'forceAtlas2Based', value: 'forceAtlas2Based'},
    {label: 'repulsion', value: 'repulsion'},
    {label: 'hierarchicalRepulsion', value: 'hierarchicalRepulsion'},
]
const defaultSolverValue = {
  barnesHut: {
    gravitationalConstant: -20000,
    centralGravity: 0.3,
    springLength: 95,
    springConstant: 0.04,
    damping: 0.09,
    avoidOverlap: 0,
  },
  forceAtlas2Based: {
    gravitationalConstant: -20000,
    centralGravity: 0.01,
    springLength: 100,
    springConstant: 0.08,
    damping: 0.4,
    avoidOverlap: 0,
  },
  repulsion: {
    centralGravity: 0.01,
    springLength: 100,
    springConstant: 0.08,
    damping: 0.4,
    nodeDistance: 100,
  },
  hierarchicalRepulsion: {
    centralGravity: 0,
    springLength: 100,
    springConstant: 0.01,
    nodeDistance: 120,
    damping: 0.09,
  },
}

@Form.create()
export default class VisOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdvanced: false,
      isDrag: false,
    };
    if (props.parent) {
      props.parent.updateDragFlag = this.updateDragFlag
    }
  }

  componentDidMount() {
    this.initDefaultSolverValue();
  }

  initDefaultSolverValue = (nextProps) => {
    const { network, physics } = nextProps || this.props;
    if (network) {
      const edgesH = network.edgesHandler.options.smooth;
      this.initEdgesItems(edgesH);
      const phyOptions = physics || network.physics.options;
      this.initPhysics(phyOptions);
    }
  }

  initEdgesItems = (edgesH={}) => {
    this.edgesEnabled = [
      { label: '启用', field_name: 'edgesEnabled', linkFields: 'edgesEnabled', type: 'checkbox', value: edgesH.enabled, onChange: this.changeEdges},
    ]
    this.edgesItems = [
      { label: '类型', field_name: 'type', type: 'select', linkFields: 'type', options: smoothType, value: edgesH.type || 'dynamic', props: {size: 'small'}, onChange: this.changeEdges},
      { label: '力方向', field_name: 'forceDirection', linkFields: 'forceDirection', type: 'select', options: smoothForceDirection, value: edgesH.forceDirection || 'none', props: {size: 'small'}, onChange: this.changeEdges},
      { label: '弯曲度', field_name: 'roundness', linkFields: 'roundness', type: 'slider', autoMax: true, min: 0, max: 1, step: 0.05, value: edgesH.roundness || 0.5, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1}, onChange: this.changeEdges},
    ]
  }

  initPhysics = (phyOptions={}) => {
    this.physicsEnabled = [
      { label: '启用', field_name: 'physicsEnabled', linkFields: 'physicsEnabled', type: 'checkbox', value: phyOptions.enabled, onChange: this.changePhysics},
    ]
    const barnesHut = phyOptions.barnesHut ? phyOptions.barnesHut : defaultSolverValue.barnesHut;
    const forceAtlas2Based = phyOptions.forceAtlas2Based ? phyOptions.forceAtlas2Based :  defaultSolverValue.forceAtlas2Based;
    const repulsion = phyOptions.repulsion ? phyOptions.repulsion : defaultSolverValue.repulsion;
    const hierarchicalRepulsion = phyOptions.hierarchicalRepulsion ? phyOptions.hierarchicalRepulsion : defaultSolverValue.hierarchicalRepulsion;
    this.barnesHutItems = [
      { label: '引力常数', field_name: 'gravitationalConstant', linkFields: 'gravitationalConstant', type: 'slider', autoMax: true, min: -30000, max: 0, step: 50, value:  barnesHut.gravitationalConstant, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1}, onChange: this.changePhysics},
      { label: '重心', field_name: 'centralGravity', linkFields: 'centralGravity', type: 'slider', autoMax: true, min: 0, max: 10, step: 0.05, value: barnesHut.centralGravity, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧长度', field_name: 'springLength', linkFields: 'springLength', type: 'slider', autoMax: true, min: 0, max: 500, step: 5, value: barnesHut.springLength, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧常数', field_name: 'springConstant', linkFields: 'springConstant', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: barnesHut.springConstant, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '阻尼', field_name: 'damping', linkFields: 'damping', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: barnesHut.damping, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '避免重叠', field_name: 'avoidOverlap', linkFields: 'avoidOverlap', type: 'slider', autoMax: true, min: 0, max: 1, step: 0.1, value: barnesHut.avoidOverlap, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
    ]
    this.forceAtlas2BasedItems = [
      { label: '引力常数', field_name: 'gravitationalConstant', linkFields: 'gravitationalConstant', type: 'slider', autoMax: true, min: -30000, max: 0, step: 50, value: forceAtlas2Based.gravitationalConstant, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '重心', field_name: 'centralGravity', linkFields: 'centralGravity', type: 'slider', autoMax: true, min: 0, max: 10, step: 0.05, value: forceAtlas2Based.centralGravity, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧长度', field_name: 'springLength', linkFields: 'springLength', type: 'slider', autoMax: true, min: 0, max: 500, step: 5, value: forceAtlas2Based.springLength, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧常数', field_name: 'springConstant', linkFields: 'springConstant', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: forceAtlas2Based.springConstant, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '阻尼', field_name: 'damping', linkFields: 'damping', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: forceAtlas2Based.damping, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '避免重叠', field_name: 'avoidOverlap', linkFields: 'avoidOverlap', type: 'slider', autoMax: true, min: 0, max: 1, step: 0.1, value: forceAtlas2Based.avoidOverlap, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
    ]
    this.repulsionItems = [
      { label: '重心', field_name: 'centralGravity', linkFields: 'centralGravity', type: 'slider', autoMax: true, min: 0, max: 10, step: 0.05, value: repulsion.centralGravity, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧长度', field_name: 'springLength', linkFields: 'springLength', type: 'slider', autoMax: true, min: 0, max: 500, step: 5, value: repulsion.springLength, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧常数', field_name: 'springConstant', linkFields: 'springConstant', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: repulsion.springConstant, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '节点间距', field_name: 'nodeDistance', linkFields: 'nodeDistance', type: 'slider', autoMax: true, min: 0, max: 500, step: 5, value: repulsion.nodeDistance, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '阻尼', field_name: 'damping', linkFields: 'damping', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: repulsion.damping, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
    ]
    this.hierarchicalRepulsionItems = [
      { label: '重心', field_name: 'centralGravity', linkFields: 'centralGravity', type: 'slider', autoMax: true, min: 0, max: 10, step: 0.05, value: hierarchicalRepulsion.centralGravity, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧长度', field_name: 'springLength', linkFields: 'springLength', type: 'slider', autoMax: true, min: 0, max: 500, step: 5, value: hierarchicalRepulsion.springLength, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '弹簧常数', field_name: 'springConstant', linkFields: 'springConstant', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: hierarchicalRepulsion.springConstant, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '节点间距', field_name: 'nodeDistance', linkFields: 'nodeDistance', type: 'slider', autoMax: true, min: 0, max: 500, step: 5, value: hierarchicalRepulsion.nodeDistance, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '阻尼', field_name: 'damping', linkFields: 'damping', type: 'slider', autoMax: true, min: 0, max: 1.2, step: 0.005, value: hierarchicalRepulsion.damping, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
    ]
    this.physicsItems = [
      { label: '最大速度', field_name: 'maxVelocity', linkFields: 'maxVelocity', type: 'slider', autoMax: true, min: 0, max: 150, step: 1, value: phyOptions.maxVelocity || 50, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '最小速度', field_name: 'minVelocity', linkFields: 'minVelocity', type: 'slider', autoMax: true, min: 0.01, max: 1, step: 0.01, value: phyOptions.minVelocity || 0.75, props: {size: 'small'}, style: {pointerEvents: 'none', opacity: 1},onChange: this.changePhysics},
      { label: '布局类型', field_name: 'solver', linkFields: 'solver', type: 'select', options: solverList, value: phyOptions.solver || 'barnesHut', props: {size: 'small'}, onChange: this.changePhysics},
      { label: '时间步长', field_name: 'timestep', linkFields: 'timestep', type: 'slider', autoMax: true, min: 0.01, max: 1, step: 0.01, value: phyOptions.timestep || 0.5, props: {size: 'small'},onChange: this.changePhysics},
    ]
    if (phyOptions.barnesHut) {
      defaultSolverValue.barnesHut = phyOptions.barnesHut;
    }
    if (phyOptions.forceAtlas2Based) {
      defaultSolverValue.forceAtlas2Based = phyOptions.forceAtlas2Based;
    }
    if (phyOptions.repulsion) {
      defaultSolverValue.repulsion = phyOptions.repulsion;
    }
    if (phyOptions.hierarchicalRepulsion) {
      defaultSolverValue.hierarchicalRepulsion = phyOptions.hierarchicalRepulsion;
    }
    this.setState({
      solver: phyOptions.solver || 'barnesHut',
    })
  }

  changeEdges = (e, filed) => {
    this.changeEdgesEnabled(e, filed, 'edge')
  }

  changePhysics = (e, filed) => {
    this.changeEdgesEnabled(e, filed, 'physics')
  }

  changeEdgesEnabled = (e, filed, str) => {
    const {nodesNum}=this.props
    if (filed === 'physicsEnabled' && e.target.checked && nodesNum && nodesNum > 1000) {
      const that = this;
      confirm({
        title:'提示：当前节点数较多，如果开启物理布局，需要较长时间，确定是否要启用物理布局？',
        okText:'是',
        cancelText:'否',
        onOk: () => {
          that.changeEdgesEnabledFun(e, filed, str)
        },
        onCancel: () => {
          that.props.form.setFieldsValue({physicsEnabled: false});
        }
      });
    } else {
      this.changeEdgesEnabledFun(e, filed, str)
    }
  }

  changeEdgesEnabledFun = (e, filed, str) => {
    const {handelUpdateAd}=this.props
    const formData={};
    let value=this.props.form.getFieldsValue();
    value[filed] = e;
    if (filed === 'edgesEnabled' || filed === 'physicsEnabled') {
      value[filed] = e.target.checked;
    }
    if (filed === 'solver') {
      this.setState({
        solver: e,
      })
      const vl = defaultSolverValue[e];
      value = {...value, ...vl};
    }
    formData.physics = {
      "enabled": value.physicsEnabled,
      "maxVelocity": value.maxVelocity,
      "minVelocity": value.minVelocity,
      "solver": value.solver,
    }
    if (value.edgesEnabled) {
      formData.edges={
        smooth: {
          "forceDirection": value.forceDirection,
          "roundness": value.roundness,
          "type": value.type,
        }
      };

      if (value.solver === 'barnesHut') {
        formData.physics.barnesHut = {};
        if (value.gravitationalConstant) formData.physics.barnesHut.gravitationalConstant = value.gravitationalConstant;
        if (value.centralGravity) formData.physics.barnesHut.centralGravity = value.centralGravity;
        if (value.springLength) formData.physics.barnesHut.springLength = value.springLength;
        if (value.springConstant) formData.physics.barnesHut.springConstant = value.springConstant;
        if (value.damping) formData.physics.barnesHut.damping = value.damping;
        if (value.avoidOverlap) formData.physics.barnesHut.avoidOverlap = value.avoidOverlap;
      }
      if (value.solver === 'forceAtlas2Based') {
        formData.physics.forceAtlas2Based = {};
        if (value.gravitationalConstant) formData.physics.forceAtlas2Based.gravitationalConstant = value.gravitationalConstant;
        if (value.centralGravity) formData.physics.forceAtlas2Based.centralGravity = value.centralGravity;
        if (value.springLength) formData.physics.forceAtlas2Based.springLength = value.springLength;
        if (value.springConstant) formData.physics.forceAtlas2Based.springConstant = value.springConstant;
        if (value.damping) formData.physics.forceAtlas2Based.damping = value.damping;
        if (value.avoidOverlap) formData.physics.forceAtlas2Based.avoidOverlap = value.avoidOverlap;
      }
      if (value.solver === 'repulsion') {
        formData.physics.repulsion = {};
        if (value.centralGravity) formData.physics.repulsion.centralGravity = value.centralGravity;
        if (value.springLength) formData.physics.repulsion.springLength = value.springLength;
        if (value.springConstant) formData.physics.repulsion.springConstant = value.springConstant;
        if (value.damping) formData.physics.repulsion.damping = value.damping;
        if (value.nodeDistance) formData.physics.repulsion.nodeDistance = value.nodeDistance;
      }
      if (value.solver === 'hierarchicalRepulsion') {
        formData.physics.hierarchicalRepulsion = {};
        if (value.centralGravity) formData.physics.hierarchicalRepulsion.centralGravity = value.centralGravity;
        if (value.springLength) formData.physics.hierarchicalRepulsion.springLength = value.springLength;
        if (value.springConstant) formData.physics.hierarchicalRepulsion.springConstant = value.springConstant;
        if (value.damping) formData.physics.hierarchicalRepulsion.damping = value.damping;
        if (value.nodeDistance) formData.physics.hierarchicalRepulsion.nodeDistance = value.nodeDistance;
      }
    } else {
      formData.edges={
        smooth: false,
      };
    }
    if (formData && formData.physics && formData.physics.enabled  && this.state.isDrag) {
      this.updateDragFlag();
    }
    handelUpdateAd(formData, str)
  }

  handleChangeSolver = (e) => {
    this.setState({
      solver: e,
    })
    this.changeEdgesEnabled()
  };

  renderAdvanced = () => {
    const { form } = this.props;
    const { solver, isAdvanced } = this.state;
    const obj = {
      barnesHut: this.barnesHutItems,
      forceAtlas2Based: this.forceAtlas2BasedItems,
      repulsion: this.repulsionItems,
      hierarchicalRepulsion: this.hierarchicalRepulsionItems,
    };
    const columns = obj[solver];
    return (
      <DetailBox
        title='高级布局'
        positionStyle={{width: '500px', overflow: 'auto', maxHeight: window.innerHeight - 280}}
        visible={isAdvanced}
        handelVisible={this.toggelFun}
      >
        <div className='topuAdvanced'>
          <div className='advanceTypeTitle' style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{padding: '7px 12px'}}>
              <span style={{fontSize: '14px', fontWeight: 900}}>边</span> -
              <span style={{fontSize: '14px'}}>smooth</span>
            </div>
            {(this.edgesEnabled || []).map(item => {
              return (
                <div key={item.field_name}>
                  <FromItemCreator
                    key={item.field_name}
                    item={{ ...item, enableLayout }}
                    form={form}
                    marginBottom={0}
                  />
                </div>
              );
            })}
          </div>
          <div style={{padding: '10px 50px 8px 10px'}}>
            {(this.edgesItems || []).map(item => {
              return (
                <div key={item.field_name}>
                  <FromItemCreator
                    key={item.field_name}
                    item={{ ...item, formItemLayout }}
                    form={form}
                    marginBottom={0}
                  />
                </div>
              );
            })}
          </div>
          <div className='advanceTypeTitle' style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{padding: '7px 12px'}}>
              <span style={{fontSize: '14px', fontWeight: 900}}>物理布局</span> -
              <span style={{fontSize: '14px'}}>{solver}</span>
            </div>
            <div>
              {(this.physicsEnabled || []).map(item => {
                return (
                  <FromItemCreator
                    key={item.field_name}
                    item={{ ...item, enableLayout }}
                    form={form}
                    marginBottom={0}
                  />
                );
              })}
            </div>
          </div>
          <div style={{padding: '8px 50px 8px 10px'}}>
            {(columns || []).map(item => {
              return (
                <div style={{padding: '0 10px'}} key={item.field_name}>
                  <FromItemCreator
                    key={item.field_name}
                    item={{ ...item, formItemLayout }}
                    form={form}
                    marginBottom={0}
                  />
                </div>
              );
            })}
          </div>
          <hr className='topuBorder' style={{width: '88%', borderBottom: 'none', borderLeft: 'none', borderRight: 'none'}} />
          <div style={{padding: '10px 59px 8px 10px'}}>
            {(this.physicsItems || []).map(item => {
              return (
                <FromItemCreator
                  key={item.field_name}
                  item={{ ...item, formItemLayout }}
                  form={form}
                  marginBottom={0}
                />
              );
            })}
          </div>
        </div>
      </DetailBox>
    );
  };

  toggelFun = () => {
    const { isAdvanced } = this.state;
    this.setState({
      isAdvanced: !isAdvanced,
    });
  }

  changeZoom = (str) => {
    const { changeZoom } = this.props;
    if (changeZoom) {
      changeZoom(str);
    }
  }

  changeFont = (str) => {
    const { changeFont } = this.props;
    if (changeFont) {
      changeFont(str);
    }
  }

  changeNodeDistance = (str) => {
    const { changeNodeDistance } = this.props;
    if (changeNodeDistance) {
      changeNodeDistance(str);
    }
  }

  changeNodeSize = (str) => {
    const { changeNodeSize } = this.props;
    if (changeNodeSize) {
      changeNodeSize(str);
    }
  }

  setphysic = () => {
    const { changePhysic, nodesNum } = this.props;
    if (nodesNum && nodesNum > 1000 && changePhysic) {
      const that = this;
      confirm({
        title:'提示：当前节点数较多，如果开启物理布局，需要较长时间，确定是否要启用物理布局？',
        okText:'是',
        cancelText:'否',
        onOk: () => {
          changePhysic();
        },
      });
    } else if (changePhysic){
      changePhysic();
    }
  }

  updateDragFlag = () => {
    const { changeDragFlag } = this.props;
    const { isDrag } = this.state;
    if (changeDragFlag) {
      changeDragFlag(isDrag);
    }
    if (!isDrag) {
      this.props.form.setFieldsValue({physicsEnabled: false});
    }
    this.setState({
      isDrag: !isDrag,
    })
  }

  render() {
    const { positionLeft='12px', positionTop='0px' } = this.props;
    const {  isAdvanced, isDrag } = this.state;
    const syTop = {
      width: '25px',
      height: '25px',
      cursor: 'pointer',
      borderRadius: '3px 3px 0 0',
      borderBottom: 'none',
      padding: 0,
      fontSize: '16px',
    };
    const syOnlyTop = {
      width: '25px',
      height: '25px',
      cursor: 'pointer',
      borderRadius: '3px 3px 0 0',
      padding: 0,
      fontSize: '16px',
    };
    const syBottom = {
      width: '25px',
      height: '25px',
      cursor: 'pointer',
      borderRadius: '0 0 3px 3px',
      padding: 0,
      fontSize: '16px',
    };
    const btnBox = { marginRight: '3px', width: '25px' };
    return (
      <div style={{ position: 'absolute', left: positionLeft, zIndex: 5, top: positionTop }}>
        <div style={{ display: 'flex', marginBottom: 10 }}>
          <div style={btnBox}>
            <Button style={syTop} title="放大图层" onClick={()=>this.changeZoom('up')} icon={<ZoomInOutlined style={{fontSize: '16px'}} />} />
            <Button style={syBottom} title="缩小图层" onClick={()=>this.changeZoom('down')} icon={<ZoomOutOutlined style={{fontSize: '16px'}} />} />
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="放大字体" onClick={()=>this.changeFont('up')}><span className={classNames(styles.elementAdd)}>A</span></Button>
            <Button style={syBottom} title="缩小字体" onClick={()=>this.changeFont('down')}><span className={classNames(styles.elementDel)}>A</span></Button>
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="放大节点距离(自动开启物理布局)" onClick={()=>this.changeNodeDistance('up')}><span className={classNames(styles.elementAdd)}>D</span></Button>
            <Button style={syBottom} title="缩小节点距离(自动开启物理布局)" onClick={()=>this.changeNodeDistance('down')}><span className={classNames(styles.elementDel)}>D</span></Button>
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="放大节点" onClick={()=>this.changeNodeSize('up')}><span className={classNames(styles.elementAdd)}>N</span></Button>
            <Button style={syBottom} title="缩小节点" onClick={()=>this.changeNodeSize('down')}><span className={classNames(styles.elementDel)}>N</span></Button>
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="非物理布局拖动相连节点" type={isDrag ? 'primary' : 'default'} icon={<DragOutlined />} onClick={this.updateDragFlag} />
            <Button style={syBottom} title="高级布局" type={isAdvanced ? 'primary' : 'default'} icon={<SettingOutlined />} onClick={this.toggelFun} />
          </div>
          <div style={btnBox}>
            <Button style={syOnlyTop} title="物理布局" icon={<NodeIndexOutlined />} onClick={this.setphysic} />
          </div>
          {/* <div style={btnBox}>
            <div style={sy} title="Unlock any nodes that you have set into place">+</div>
            <div style={sy} title="Export this graph as a PNG">-</div>
          </div> */}
        </div>
        {/* <Button onClick={this.toggelFun} style={{marginTop: 10, marginBottom: 10, padding: '0px 22px'}}>高级布局</Button> */}
        {isAdvanced ? this.renderAdvanced() : ''}
      </div>
    )
  }
}
