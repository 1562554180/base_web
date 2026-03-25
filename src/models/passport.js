import { showOpsNotification } from 'utils/utils';
import uri from 'utils/uri';
import * as rqPassport from 'requests/passport';
import config from 'utils/config';
import { message } from 'antd';

const namespace = 'passport';

export default {
  namespace,

  state: {
    list: [],
    status: undefined,
    regStatus: undefined,
    loginType: 'account',
    aboutData:[],
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(rqPassport.login, payload);
      if (response) showOpsNotification(response);
      if (response.success) {
        config.isLogined = true;
        if(callback) callback();
        yield put({
          type: 'main/init',
        });
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: response || {},
        });
      }
    },

    *logout(_, { call, put }) {
      yield call(rqPassport.logout);
      message.success('退出成功！')
      config.isLogined = false;
      yield put({
        type: 'main/init',
      });
    },

    *changePassword({ payload, callback }, { call }) {
      const response = yield call(rqPassport.changePassword, payload);
      if (response) {
        if (response.success) {
          callback();
        } else {
          message.error(response.message || '修改失败，请稍后重试')
        }
      }
    },

    *getAboutData({ payload }, { call, put}) {
      const response = yield call(config.isSatMode ? rqPassport.aboutSat : rqPassport.aboutMevil, payload);
      if (response && response.success) {
        yield put({
          type: 'updateState',
          payload: {
            aboutData: response.data,
          },
        });
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
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.message,
        loginType: payload.loginType,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
