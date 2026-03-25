import { message } from 'antd';
import config from 'utils/config';
import * as rqHome from 'requests/home';
import * as rqOpLog from 'requests/opLog';

const namespace = 'global';


export default {
  namespace,
  state: {
    ntpValues: {},
    aboutData: {},
    webAboutData: [],
    updateFreqValues: true,
    updateSystemTime: false,
    dvbguardSignalInfoValues: true,
    saved:false,
  },
  effects: {
    *getAboutInfo({ payload }, { call, put }) {
      const response = yield call(rqOpLog.getAboutInfo, payload);
      if(response) {
        yield put({
          type: 'updateState',
          payload: {webAboutData: response.data || []}
        })
      }
    },

    *getNtpInfo({ payload }, { call, put }) {
      const res = yield call(rqHome.getNtpMessage, payload);
      if(res) {
        const values = res.message || {};
        yield put({
          type: 'updateState',
          payload: {ntpValues: values}
        })
      }
    },
  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
};
