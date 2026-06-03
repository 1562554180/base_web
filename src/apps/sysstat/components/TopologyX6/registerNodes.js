import { register } from '@antv/x6-react-shape';
import RfNode from './nodes/RfNode';
import MatrixNode from './nodes/MatrixNode';
import ConverterNode from './nodes/ConverterNode';
import AdNode from './nodes/AdNode';
import DvbNode from './nodes/DvbNode';

const NODE_WIDTH = {
  rf: 80,
  matrix: 120,
  converter: 100,
  ad: 120,
  dvb: 120,
};

const NODE_HEIGHT = {
  rf: 50,
  matrix: 80,
  converter: 60,
  ad: 80,
  dvb: 80,
};

export function registerTopologyNodes() {
  register({
    shape: 'rf-node',
    width: NODE_WIDTH.rf,
    height: NODE_HEIGHT.rf,
    component: RfNode,
  });

  register({
    shape: 'matrix-node',
    width: NODE_WIDTH.matrix,
    height: NODE_HEIGHT.matrix,
    component: MatrixNode,
  });

  register({
    shape: 'converter-node',
    width: NODE_WIDTH.converter,
    height: NODE_HEIGHT.converter,
    component: ConverterNode,
  });

  register({
    shape: 'ad-node',
    width: NODE_WIDTH.ad,
    height: NODE_HEIGHT.ad,
    component: AdNode,
  });

  register({
    shape: 'dvb-node',
    width: NODE_WIDTH.dvb,
    height: NODE_HEIGHT.dvb,
    component: DvbNode,
  });
}

export { NODE_WIDTH, NODE_HEIGHT };
