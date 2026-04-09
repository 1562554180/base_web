import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react/index.js';
import { Form, Button } from 'antd';
import Modal from 'utils/modal';
import { ZoomInOutlined, ZoomOutOutlined, SettingOutlined, DragOutlined, NodeIndexOutlined } from '@ant-design/icons';
import FromItemCreator from 'components/FromItemCreator';
import DetailBox from 'common/detailBox';
import classNames from 'classnames';
import styles from './visoptions.less';

const confirm = Modal.confirm;
const formItemLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
const enableLayout = { labelCol: { span: 16 }, wrapperCol: { span: 8 } };

const smoothType = [
  { label: 'dynamic', value: 'dynamic' },
  { label: 'continuous', value: 'continuous' },
  { label: 'discrete', value: 'discrete' },
  { label: 'diagonalCross', value: 'diagonalCross' },
  { label: 'straightCross', value: 'straightCross' },
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' },
  { label: 'curvedCW', value: 'curvedCW' },
  { label: 'curvedCCW', value: 'curvedCCW' },
  { label: 'cubicBezier', value: 'cubicBezier' },
];
const smoothForceDirection = [
  { label: 'horizontal', value: 'horizontal' },
  { label: 'vertical', value: 'vertical' },
  { label: 'none', value: 'none' },
];
const solverList = [
  { label: 'barnesHut', value: 'barnesHut' },
  { label: 'forceAtlas2Based', value: 'forceAtlas2Based' },
  { label: 'repulsion', value: 'repulsion' },
  { label: 'hierarchicalRepulsion', value: 'hierarchicalRepulsion' },
];
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
};

const VisOptions = forwardRef((props, ref) => {
  const { parent, network, physics, nodesNum, handelUpdateAd, changeZoom, changeFont, changeNodeDistance, changeNodeSize, changePhysic, changeDragFlag, positionLeft = '12px', positionTop = '0px' } = props;

  const [form] = Form.useForm();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  const [solver, setSolver] = useState('barnesHut');

  const edgesEnabledRef = useRef([]);
  const edgesItemsRef = useRef([]);
  const physicsEnabledRef = useRef([]);
  const barnesHutItemsRef = useRef([]);
  const forceAtlas2BasedItemsRef = useRef([]);
  const repulsionItemsRef = useRef([]);
  const hierarchicalRepulsionItemsRef = useRef([]);
  const physicsItemsRef = useRef([]);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    updateDragFlag: () => updateDragFlag(),
    getForm: () => form,
  }));

  useEffect(() => {
    if (parent) {
      parent.updateDragFlag = updateDragFlag;
    }
    initDefaultSolverValue();
  }, []);

  const initDefaultSolverValue = (nextProps) => {
    const currentNetwork = nextProps?.network || network;
    const currentPhysics = nextProps?.physics || physics;
    if (currentNetwork) {
      const edgesH = currentNetwork.edgesHandler.options.smooth;
      initEdgesItems(edgesH);
      const phyOptions = currentPhysics || currentNetwork.physics.options;
      initPhysics(phyOptions);
    }
  };

  const initEdgesItems = (edgesH = {}) => {
    edgesEnabledRef.current = [
      {
        label: '启用',
        field_name: 'edgesEnabled',
        linkFields: 'edgesEnabled',
        type: 'checkbox',
        value: edgesH.enabled,
        onChange: changeEdges,
      },
    ];
    edgesItemsRef.current = [
      {
        label: '类型',
        field_name: 'type',
        type: 'select',
        linkFields: 'type',
        options: smoothType,
        value: edgesH.type || 'dynamic',
        props: { size: 'small' },
        onChange: changeEdges,
      },
      {
        label: '力方向',
        field_name: 'forceDirection',
        linkFields: 'forceDirection',
        type: 'select',
        options: smoothForceDirection,
        value: edgesH.forceDirection || 'none',
        props: { size: 'small' },
        onChange: changeEdges,
      },
      {
        label: '弯曲度',
        field_name: 'roundness',
        linkFields: 'roundness',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1,
        step: 0.05,
        value: edgesH.roundness || 0.5,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changeEdges,
      },
    ];
  };

  const initPhysics = (phyOptions = {}) => {
    physicsEnabledRef.current = [
      {
        label: '启用',
        field_name: 'physicsEnabled',
        linkFields: 'physicsEnabled',
        type: 'checkbox',
        value: phyOptions.enabled,
        onChange: changePhysics,
      },
    ];
    const barnesHut = phyOptions.barnesHut ? phyOptions.barnesHut : defaultSolverValue.barnesHut;
    const forceAtlas2Based = phyOptions.forceAtlas2Based ? phyOptions.forceAtlas2Based : defaultSolverValue.forceAtlas2Based;
    const repulsion = phyOptions.repulsion ? phyOptions.repulsion : defaultSolverValue.repulsion;
    const hierarchicalRepulsion = phyOptions.hierarchicalRepulsion
      ? phyOptions.hierarchicalRepulsion
      : defaultSolverValue.hierarchicalRepulsion;

    barnesHutItemsRef.current = [
      {
        label: '引力常数',
        field_name: 'gravitationalConstant',
        linkFields: 'gravitationalConstant',
        type: 'slider',
        autoMax: true,
        min: -30000,
        max: 0,
        step: 50,
        value: barnesHut.gravitationalConstant,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '重心',
        field_name: 'centralGravity',
        linkFields: 'centralGravity',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 10,
        step: 0.05,
        value: barnesHut.centralGravity,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧长度',
        field_name: 'springLength',
        linkFields: 'springLength',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 500,
        step: 5,
        value: barnesHut.springLength,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧常数',
        field_name: 'springConstant',
        linkFields: 'springConstant',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: barnesHut.springConstant,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '阻尼',
        field_name: 'damping',
        linkFields: 'damping',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: barnesHut.damping,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '避免重叠',
        field_name: 'avoidOverlap',
        linkFields: 'avoidOverlap',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1,
        step: 0.1,
        value: barnesHut.avoidOverlap,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
    ];

    forceAtlas2BasedItemsRef.current = [
      {
        label: '引力常数',
        field_name: 'gravitationalConstant',
        linkFields: 'gravitationalConstant',
        type: 'slider',
        autoMax: true,
        min: -30000,
        max: 0,
        step: 50,
        value: forceAtlas2Based.gravitationalConstant,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '重心',
        field_name: 'centralGravity',
        linkFields: 'centralGravity',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 10,
        step: 0.05,
        value: forceAtlas2Based.centralGravity,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧长度',
        field_name: 'springLength',
        linkFields: 'springLength',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 500,
        step: 5,
        value: forceAtlas2Based.springLength,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧常数',
        field_name: 'springConstant',
        linkFields: 'springConstant',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: forceAtlas2Based.springConstant,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '阻尼',
        field_name: 'damping',
        linkFields: 'damping',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: forceAtlas2Based.damping,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '避免重叠',
        field_name: 'avoidOverlap',
        linkFields: 'avoidOverlap',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1,
        step: 0.1,
        value: forceAtlas2Based.avoidOverlap,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
    ];

    repulsionItemsRef.current = [
      {
        label: '重心',
        field_name: 'centralGravity',
        linkFields: 'centralGravity',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 10,
        step: 0.05,
        value: repulsion.centralGravity,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧长度',
        field_name: 'springLength',
        linkFields: 'springLength',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 500,
        step: 5,
        value: repulsion.springLength,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧常数',
        field_name: 'springConstant',
        linkFields: 'springConstant',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: repulsion.springConstant,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '节点间距',
        field_name: 'nodeDistance',
        linkFields: 'nodeDistance',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 500,
        step: 5,
        value: repulsion.nodeDistance,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '阻尼',
        field_name: 'damping',
        linkFields: 'damping',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: repulsion.damping,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
    ];

    hierarchicalRepulsionItemsRef.current = [
      {
        label: '重心',
        field_name: 'centralGravity',
        linkFields: 'centralGravity',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 10,
        step: 0.05,
        value: hierarchicalRepulsion.centralGravity,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧长度',
        field_name: 'springLength',
        linkFields: 'springLength',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 500,
        step: 5,
        value: hierarchicalRepulsion.springLength,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '弹簧常数',
        field_name: 'springConstant',
        linkFields: 'springConstant',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: hierarchicalRepulsion.springConstant,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '节点间距',
        field_name: 'nodeDistance',
        linkFields: 'nodeDistance',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 500,
        step: 5,
        value: hierarchicalRepulsion.nodeDistance,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '阻尼',
        field_name: 'damping',
        linkFields: 'damping',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 1.2,
        step: 0.005,
        value: hierarchicalRepulsion.damping,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
    ];

    physicsItemsRef.current = [
      {
        label: '最大速度',
        field_name: 'maxVelocity',
        linkFields: 'maxVelocity',
        type: 'slider',
        autoMax: true,
        min: 0,
        max: 150,
        step: 1,
        value: phyOptions.maxVelocity || 50,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '最小速度',
        field_name: 'minVelocity',
        linkFields: 'minVelocity',
        type: 'slider',
        autoMax: true,
        min: 0.01,
        max: 1,
        step: 0.01,
        value: phyOptions.minVelocity || 0.75,
        props: { size: 'small' },
        style: { pointerEvents: 'none', opacity: 1 },
        onChange: changePhysics,
      },
      {
        label: '布局类型',
        field_name: 'solver',
        linkFields: 'solver',
        type: 'select',
        options: solverList,
        value: phyOptions.solver || 'barnesHut',
        props: { size: 'small' },
        onChange: changePhysics,
      },
      {
        label: '时间步长',
        field_name: 'timestep',
        linkFields: 'timestep',
        type: 'slider',
        autoMax: true,
        min: 0.01,
        max: 1,
        step: 0.01,
        value: phyOptions.timestep || 0.5,
        props: { size: 'small' },
        onChange: changePhysics,
      },
    ];

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

    setSolver(phyOptions.solver || 'barnesHut');
  };

  const changeEdges = (e, filed) => {
    changeEdgesEnabled(e, filed, 'edge');
  };

  const changePhysics = (e, filed) => {
    changeEdgesEnabled(e, filed, 'physics');
  };

  const changeEdgesEnabled = (e, filed, str) => {
    if (filed === 'physicsEnabled' && e.target.checked && nodesNum && nodesNum > 1000) {
      confirm({
        title: '提示：当前节点数较多，如果开启物理布局，需要较长时间，确定是否要启用物理布局？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          changeEdgesEnabledFun(e, filed, str);
        },
        onCancel: () => {
          form.setFieldsValue({ physicsEnabled: false });
        },
      });
    } else {
      changeEdgesEnabledFun(e, filed, str);
    }
  };

  const changeEdgesEnabledFun = (e, filed, str) => {
    const formData = {};
    let value = form.getFieldsValue();
    value[filed] = e;
    if (filed === 'edgesEnabled' || filed === 'physicsEnabled') {
      value[filed] = e.target.checked;
    }
    if (filed === 'solver') {
      setSolver(e);
      const vl = defaultSolverValue[e];
      value = { ...value, ...vl };
    }
    formData.physics = {
      enabled: value.physicsEnabled,
      maxVelocity: value.maxVelocity,
      minVelocity: value.minVelocity,
      solver: value.solver,
    };
    if (value.edgesEnabled) {
      formData.edges = {
        smooth: {
          forceDirection: value.forceDirection,
          roundness: value.roundness,
          type: value.type,
        },
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
      formData.edges = {
        smooth: false,
      };
    }
    if (formData && formData.physics && formData.physics.enabled && isDrag) {
      updateDragFlag();
    }
    handelUpdateAd(formData, str);
  };

  const handleChangeSolver = (e) => {
    setSolver(e);
    changeEdgesEnabled();
  };

  const renderAdvanced = () => {
    const obj = {
      barnesHut: barnesHutItemsRef.current,
      forceAtlas2Based: forceAtlas2BasedItemsRef.current,
      repulsion: repulsionItemsRef.current,
      hierarchicalRepulsion: hierarchicalRepulsionItemsRef.current,
    };
    const columns = obj[solver];
    return (
      <DetailBox
        title="高级布局"
        positionStyle={{ width: '500px', overflow: 'auto', maxHeight: window.innerHeight - 280 }}
        visible={isAdvanced}
        handelVisible={toggleFun}
      >
        <div className="topuAdvanced">
          <div className="advanceTypeTitle" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ padding: '7px 12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900 }}>边</span> -
              <span style={{ fontSize: '14px' }}>smooth</span>
            </div>
            {(edgesEnabledRef.current || []).map((item) => {
              return (
                <div key={item.field_name}>
                  <FromItemCreator key={item.field_name} item={{ ...item, enableLayout }} marginBottom={0} />
                </div>
              );
            })}
          </div>
          <div style={{ padding: '10px 50px 8px 10px' }}>
            {(edgesItemsRef.current || []).map((item) => {
              return (
                <div key={item.field_name}>
                  <FromItemCreator key={item.field_name} item={{ ...item, formItemLayout }} marginBottom={0} />
                </div>
              );
            })}
          </div>
          <div className="advanceTypeTitle" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ padding: '7px 12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 900 }}>物理布局</span> -
              <span style={{ fontSize: '14px' }}>{solver}</span>
            </div>
            <div>
              {(physicsEnabledRef.current || []).map((item) => {
                return (
                  <FromItemCreator key={item.field_name} item={{ ...item, enableLayout }} marginBottom={0} />
                );
              })}
            </div>
          </div>
          <div style={{ padding: '8px 50px 8px 10px' }}>
            {(columns || []).map((item) => {
              return (
                <div style={{ padding: '0 10px' }} key={item.field_name}>
                  <FromItemCreator key={item.field_name} item={{ ...item, formItemLayout }} marginBottom={0} />
                </div>
              );
            })}
          </div>
          <hr className="topuBorder" style={{ width: '88%', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }} />
          <div style={{ padding: '10px 59px 8px 10px' }}>
            {(physicsItemsRef.current || []).map((item) => {
              return <FromItemCreator key={item.field_name} item={{ ...item, formItemLayout }} marginBottom={0} />;
            })}
          </div>
        </div>
      </DetailBox>
    );
  };

  const toggleFun = () => {
    setIsAdvanced(!isAdvanced);
  };

  const handleChangeZoom = (str) => {
    if (changeZoom) {
      changeZoom(str);
    }
  };

  const handleChangeFont = (str) => {
    if (changeFont) {
      changeFont(str);
    }
  };

  const handleChangeNodeDistance = (str) => {
    if (changeNodeDistance) {
      changeNodeDistance(str);
    }
  };

  const handleChangeNodeSize = (str) => {
    if (changeNodeSize) {
      changeNodeSize(str);
    }
  };

  const setphysic = () => {
    if (nodesNum && nodesNum > 1000 && changePhysic) {
      confirm({
        title: '提示：当前节点数较多，如果开启物理布局，需要较长时间，确定是否要启用物理布局？',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          changePhysic();
        },
      });
    } else if (changePhysic) {
      changePhysic();
    }
  };

  const updateDragFlag = () => {
    if (changeDragFlag) {
      changeDragFlag(isDrag);
    }
    if (!isDrag) {
      form.setFieldsValue({ physicsEnabled: false });
    }
    setIsDrag(!isDrag);
  };

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
      <Form form={form}>
        <div style={{ display: 'flex', marginBottom: 10 }}>
          <div style={btnBox}>
            <Button style={syTop} title="放大图层" onClick={() => handleChangeZoom('up')} icon={<ZoomInOutlined style={{ fontSize: '16px' }} />} />
            <Button style={syBottom} title="缩小图层" onClick={() => handleChangeZoom('down')} icon={<ZoomOutOutlined style={{ fontSize: '16px' }} />} />
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="放大字体" onClick={() => handleChangeFont('up')}>
              <span className={classNames(styles.elementAdd)}>A</span>
            </Button>
            <Button style={syBottom} title="缩小字体" onClick={() => handleChangeFont('down')}>
              <span className={classNames(styles.elementDel)}>A</span>
            </Button>
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="放大节点距离(自动开启物理布局)" onClick={() => handleChangeNodeDistance('up')}>
              <span className={classNames(styles.elementAdd)}>D</span>
            </Button>
            <Button style={syBottom} title="缩小节点距离(自动开启物理布局)" onClick={() => handleChangeNodeDistance('down')}>
              <span className={classNames(styles.elementDel)}>D</span>
            </Button>
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="放大节点" onClick={() => handleChangeNodeSize('up')}>
              <span className={classNames(styles.elementAdd)}>N</span>
            </Button>
            <Button style={syBottom} title="缩小节点" onClick={() => handleChangeNodeSize('down')}>
              <span className={classNames(styles.elementDel)}>N</span>
            </Button>
          </div>
          <div style={btnBox}>
            <Button style={syTop} title="非物理布局拖动相连节点" type={isDrag ? 'primary' : 'default'} icon={<DragOutlined />} onClick={updateDragFlag} />
            <Button style={syBottom} title="高级布局" type={isAdvanced ? 'primary' : 'default'} icon={<SettingOutlined />} onClick={toggleFun} />
          </div>
          <div style={btnBox}>
            <Button style={syOnlyTop} title="物理布局" icon={<NodeIndexOutlined />} onClick={setphysic} />
          </div>
        </div>
      </Form>
      {isAdvanced ? renderAdvanced() : ''}
    </div>
  );
});

VisOptions.displayName = 'VisOptions';

export default VisOptions;
