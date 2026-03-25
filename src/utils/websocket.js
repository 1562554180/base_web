import _ from 'lodash';

let errorCount = 0;

const createWebSocket = (url, params, callback, alreadyInitCmdList, reconnectOper) => {
  let success = false;
  const reconnectTime = 5000;
  const sendParamsTime = 120000;
  let sendParamsInterval = null;
  let reconnectInterval = null
  const ws = new WebSocket(url);
  ws.binaryType = 'arraybuffer';

  if (ws.readyState === 3) {
    ws.close()
    clearSendInterval();
  }

  ws.onopen = () => {
    clearSendInterval();
    startSendInterval();
  }

  ws.error = () => {
    errorCount += 1;
    if (errorCount > 20) {
      ws.close();
      clearSendInterval();
      errorCount = 0
      callback(false, 0)
    } else {
      reconnect()
    }
  }

  ws.onclose = (event) => {
    // 主动关闭code 1005
    // 异常连接关闭code 1006
    if (event.code === 1006) {
      if (reconnectOper) {
        reconnectOper()
      }
    } else {
      clearSendInterval()
    }
  }

  ws.onmessage = (res) => {
    success = true;
    if (ws.readyState === 1) {
      if (callback) {
        try {
          const data = res.data
          callback(data)
        } catch {
          callback(false, 1)
        }
      }
    }
  }

  ws.onSendWsMessage = (payload) => {
    if (ws && ws.send) {
      if (typeof (payload) === 'object') {
        ws.send(JSON.stringify(payload))
      } else {
        ws.send(payload)
      }
    }
  }

  ws.onCloseWs = () => {
    if (ws && ws.close) {
      ws.close()
    }
  }

  const clearSendInterval = () => {
    if (sendParamsInterval) clearInterval(sendParamsInterval)
  }

  const startSendInterval = () => {
    if (params) {
      ws.send(params)
      if (alreadyInitCmdList && !_.isEmpty(alreadyInitCmdList)) {
        alreadyInitCmdList.forEach(item => {
          ws.send(item)
        });
      }
    }
  }

  const reconnect = () => {
    if (success) {
      errorCount = 0;
      return false;
    }
    setTimeout(() => {
      createWebSocket(url);
      success = false;
    }, reconnectTime)
  }
  return ws;
}

export { createWebSocket };

