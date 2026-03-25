import React, { Component } from 'react';
import { createWebSocket } from 'utils/websocket';
import { Empty } from "antd"
import { parseJson } from 'utils/utils';
import config from 'utils/config';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash'

const localTestUrl = config.isLocal ? config.localTestUrl : window.location.host;

class ScatterDiagram extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { scatterImg } = this.props
    return (
      <div style={{ width: 270, height: 270 }}>
        {scatterImg ? <img src={scatterImg} style={{ width: "100%", height: "100%" }} /> : <Empty style={{ width: "100%", height: "100%", paddingTop: 20 }} />}
      </div>
    );
  }
}

export default ScatterDiagram;
