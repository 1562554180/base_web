import { NODE_WIDTH, NODE_HEIGHT } from './registerNodes';

function formatFreqKhz(khz) {
  if (khz == null) return '--';
  return (khz / 1e3).toFixed(0) + 'MHz';
}

function getNodeSize(htmlType) {
  const type = htmlType.replace('-node', '');
  return {
    width: NODE_WIDTH[type] || 100,
    height: NODE_HEIGHT[type] || 60,
  };
}

export function buildGraphData({ chains, rfPorts, matrixItems, converters, dvbCards, adCards }) {
  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  const chainsArr = chains || [];
  const rfPortsArr = rfPorts || [];
  const convertersArr = converters || [];
  const adCardsArr = adCards || [];
  const dvbCardsArr = dvbCards || [];
  const matrixItemsArr = matrixItems || [];

  // Add RF nodes
  rfPortsArr.forEach(rf => {
    const id = `RF-${rf.port}`;
    nodes.push({
      id,
      shape: 'html',
      html: 'rf-node',
      ...getNodeSize('rf-node'),
      data: {
        label: `RF-${rf.port}`,
        level: rf?.level != null ? rf.level + 'dBm' : '--',
        online: rf?.level != null,
      },
    });
    nodeMap.set(id, true);
  });

  // Add Matrix nodes
  const matrixConnections = {};
  chainsArr.forEach(c => {
    if (c.matrix) {
      const mxId = c.matrix.deviceId ?? c.matrix.id;
      if (!matrixConnections[mxId]) {
        matrixConnections[mxId] = { inPorts: 0, outPorts: 0, connections: [] };
      }
      matrixConnections[mxId].inPorts = Math.max(
        matrixConnections[mxId].inPorts,
        (c.matrixInPort ?? 0) + 1
      );
      matrixConnections[mxId].outPorts = Math.max(
        matrixConnections[mxId].outPorts,
        (c.matrixOutPort ?? 0) + 1
      );
      matrixConnections[mxId].connections.push({
        input: c.matrixInPort ?? 0,
        output: c.matrixOutPort ?? 0,
      });
    }
  });

  Object.entries(matrixConnections).forEach(([mxId, conn]) => {
    const id = `MATRIX-${mxId}`;
    const mx = matrixItemsArr.find(m => m.deviceId === Number(mxId));
    const inPorts = Math.max(mx?.inputPorts || 4, conn.inPorts);
    const outPorts = Math.max(mx?.outputPorts || 4, conn.outPorts);
    nodes.push({
      id,
      shape: 'html',
      html: 'matrix-node',
      ...getNodeSize('matrix-node'),
      data: {
        label: `矩阵-${mxId}`,
        inPorts,
        outPorts,
        connections: conn.connections,
      },
    });
    nodeMap.set(id, true);
  });

  // Add Converter nodes
  const converterSet = new Set();
  chainsArr.forEach(c => {
    if (c.converter != null) converterSet.add(c.converter);
  });
  convertersArr.forEach(cv => converterSet.add(cv.id));

  converterSet.forEach(cvId => {
    const id = `CV-${cvId}`;
    const cv = convertersArr.find(c => c.id === cvId);
    nodes.push({
      id,
      shape: 'html',
      html: 'converter-node',
      ...getNodeSize('converter-node'),
      data: {
        label: `变频器-${cvId}`,
        freq: formatFreqKhz(cv?.freq),
      },
    });
    nodeMap.set(id, true);
  });

  // Add AD/DVB nodes
  const addOutputNode = (card, isDvb) => {
    const id = `${isDvb ? 'DVB' : 'AD'}-${card.id}`;
    const htmlType = isDvb ? 'dvb-node' : 'ad-node';
    nodes.push({
      id,
      shape: 'html',
      html: htmlType,
      ...getNodeSize(htmlType),
      data: {
        label: `${isDvb ? 'DVB' : 'AD'}-${card.id}`,
        dna: card.dna || '--',
        channels: {
          used: card.channels?.used ?? '-',
          total: card.channels?.total ?? '-',
        },
      },
    });
    nodeMap.set(id, true);
  };

  adCardsArr.forEach(card => addOutputNode(card, false));
  dvbCardsArr.forEach(card => addOutputNode(card, true));

  // Build edges from active chains
  // Use anchor config instead of ports for reliable edge routing:
  //   sourceAnchor: 'right'  -> edge starts from right side of source node
  //   targetAnchor: 'left'   -> edge ends at left side of target node
  chainsArr.forEach(c => {
    if (!c.active) return;

    const rfId = `RF-${c.rf}`;
    const outputId = typeof c.output === 'string' ? c.output : null;

    if (c.matrix) {
      const mxId = `MATRIX-${c.matrix.deviceId ?? c.matrix.id}`;
      // RF -> Matrix (connect to specific input port)
      edges.push({
        source: { cell: rfId, anchor: { name: 'right' } },
        target: {
          cell: mxId,
          anchor: { name: 'matrix-in', args: { portIndex: c.matrixInPort ?? 0 } },
        },
      });

      if (c.converter != null) {
        const cvId = `CV-${c.converter}`;
        // Matrix -> Converter (connect from specific output port)
        edges.push({
          source: {
            cell: mxId,
            anchor: { name: 'matrix-out', args: { portIndex: c.matrixOutPort ?? 0 } },
          },
          target: { cell: cvId, anchor: { name: 'left' } },
        });
        // Converter -> Output
        if (outputId) {
          edges.push({
            source: { cell: cvId, anchor: { name: 'right' } },
            target: { cell: outputId, anchor: { name: 'left' } },
          });
        }
      } else if (outputId) {
        // Matrix -> Output (connect from specific output port)
        edges.push({
          source: {
            cell: mxId,
            anchor: { name: 'matrix-out', args: { portIndex: c.matrixOutPort ?? 0 } },
          },
          target: { cell: outputId, anchor: { name: 'left' } },
        });
      }
    } else if (c.converter != null) {
      const cvId = `CV-${c.converter}`;
      // RF -> Converter
      edges.push({
        source: { cell: rfId, anchor: { name: 'right' } },
        target: { cell: cvId, anchor: { name: 'left' } },
      });
      // Converter -> Output
      if (outputId) {
        edges.push({
          source: { cell: cvId, anchor: { name: 'right' } },
          target: { cell: outputId, anchor: { name: 'left' } },
        });
      }
    } else if (outputId) {
      // RF -> Output directly
      edges.push({
        source: { cell: rfId, anchor: { name: 'right' } },
        target: { cell: outputId, anchor: { name: 'left' } },
      });
    }
  });

  return { nodes, edges };
}
