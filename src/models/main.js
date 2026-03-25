import { routerRedux } from 'dva/router';
import * as rqPassport from 'requests/passport';
import * as rqSetConfig from 'requests/set_config';
import * as rqApp from 'requests/app';
import * as time from 'requests/time';
import config from 'utils/config';
import { message } from 'antd';
import { getStorageData, setStorageData } from 'utils/storage';
import * as localization from 'utils/localization';
import uri from 'utils/uri';
import qs from 'qs';
import { isArray, isEmpty, isUndefined } from 'lodash';
import { importFormRules, mergeFormRules, setValidators } from 'utils/form';
import { changeTheme } from 'utils/utils';
import { defaultUserMenu } from 'utils/default_config';

const { l } = localization;

function addExceptionRouter(acls) {
  acls['/passport/logout'] = { name: 'passport', page: 'true' };
  acls['/exception'] = { name: 'exception', page: 'true' };
  acls['/home'] = { name: 'home', page: 'true' };
  acls['/companyMode'] = { name: 'companyMode', page: 'true' };
  // acls['/version'] = { name: 'version', page: 'true' };
  acls['/exception/403'] = { name: 'exception', page: 'true' };
  acls['/exception/404'] = { name: 'exception', page: 'true' };
  acls['/exception/500'] = { name: 'exception', page: 'true' };
  acls['/external_service'] = { name: 'exception', page: 'true' };
  acls['/protoDetail'] = { name: '协议详情', page: 'true' };
  acls['/unique_portait'] = { name: '画像详情', page: 'true' };
}

function mergeConfig(c) {
  for (const i in c) {
    config[i] = c[i]
  }
}

function initSettings(st, put) {
  const settings = st || {};
  if (!settings.superApps) settings.superApps = [];
  if (settings.lang) localization.set(settings.lang, put);
  if (settings.validators) setValidators(settings.validators);
  mergeConfig(st.config || {})
  importFormRules(settings);
  if (!settings.productName) settings.productName = l('productName');
}

function applySettings(st, pst) {
  const settings = st || {};
  let passport = {};
  let defaultCompnent = false;
  if (settings.default) defaultCompnent = uri.component(settings.default);
  if (pst) {
    passport = pst;
    if (passport.lang) localization.set(passport.lang);
    importFormRules(passport);
    mergeFormRules(settings, passport);
  }

  if (passport.default) defaultCompnent = uri.component(passport.default);
  initMenu();

  if (config.loginDefaultPath) defaultCompnent = config.loginDefaultPath;
  const pagePath = config.loginDefaultPage || [];
  if (config.loginDefaultPage && config.loginDefaultPage.length > 0) {
    if (isArray(pagePath)) {
      if (pagePath[pagePath.length - 1] && pagePath[pagePath.length - 1] !== 'undefined') {
        defaultCompnent = pagePath[pagePath.length - 1];
      }
    } else {
      defaultCompnent = pagePath;
    }
  }
  if (passport.footer) settings.footer = { ...settings.footer, ...passport.footer };
  if (passport.superApps) settings.superApps = passport.superApps;
  addExceptionRouter(settings.acls);

  if (!isEmpty(settings.acls) && (!settings.acls[pagePath[0]] && !settings.acls[pagePath[1]]) && !defaultCompnent) {
    defaultCompnent = uri.component(passport.default);
  }
  if (!defaultCompnent) defaultCompnent = config.loginPath;
  const hasSiderBar = false;
  return {
    defaultCompnent,
    hasSiderBar,
    user: st.user,
    settings,
  };
}

function initMenu() {
  if (config.checkMenu) return;
  if (window.location.pathname.endsWith('analysis.html')) return;
  config.checkMenu = true;
}


const defaultState = {
  token: null,
  username: "",
  dataAcquisitionVisible: false,
  modeConfig: 0,
  loginFlag: false,
  columnSetting: false,
  couldChangeRfMod: false,
  haveSpectrumSweep: false,
  IPFraInfoDisplay: false,
  vsatInfo: false,
  higherConfig: false,
  averageDeep: false,
  netControlShow: false,
  frequencyShow: false,
  adCardShow: false,
  netControlDemodulationShow: false,
  spreadSpectrumShow: false,
  netControl: [],
  companyMenu: [],
  outputMenu: [],
  syncInfo: false,
  EssInfoDisplay: false,
  allConfigCompanyData: {},
  user: {
    isLogined: false,
    name: "admin",
  },
  collapsed: false,
  hideLogoText: true,
  onlyShowUserInfo: false,
  selectModule: '',
  notices: [],
  defaultCompnent: config.loginPath,
  menu: [],
  redirect: [],
  hasHeader: true,
  hasSiderBar: false,
  dateTime: "",
  settings: {
    acls: [],
    enableHeaderNav: true,
    superApps: [],
    headerSearcher: false,
    userMenu: [
      { name: 'userConfig', text: '偏好设置', icon: 'setting' },
      { name: 'systemStatus', text: '系统状态', icon: 'line-chart' },
      // { name: 'logList', text: '操作日志', icon: 'menu' },
      { name: 'programZip', text: '软件开发包', icon: 'download' },
      { name: 'userManaual', text: '用户使用手册', icon: 'file' },
      { name: 'authStatus', text: '授权状态', icon: 'user' },
      { name: 'version', text: '关于', icon: 'info-circle' },
    ],
    settingMenu: config.settingMenu || [],
    faq: false,
    footer: {
      links: [],
      copyright: '',
    },
    noticeTab: [],
    headerNav: [],
    productName: '',
  },
  inited: false,
  failed: false,
  selectedTheme: config.selectedTheme,
  systemCurrentCommPort: '',
  systemInited: true,
  systemNetCardError: false,
  isCloseSocket: '0',
  detailStatusLayoutType: "both",
  DVBFormConfig: [],
  TDMAFormConfig: {},
  specialDvbFormConfig: {},
  specialScpcFormConfig: {},
  skyLinx8000FormConfig: [],
  netStateConfig: {},
  sendNetstationConfig: {},
  txChannelMatchVsatName: '',
  frequencyConvertersConfig: {},
  remoteControlFormConfig: [],
  ntpMessageData: {},
  midSpectrumVisible: false,
  midSpectrumTableFilterCh: '',
  midSpectrumFilterCh: false,
  adConfig: [],
  dvbConfigList: [],
  allLoading: false,
  selectedNet: '',
  dvbDetailInfo: '',
  currentSendType: 1,
  commonStatusData: {},
  allWkArrayList: [],
  commonConfig: {},
  layoutSpin: false,
  netOneRfPortList: [],
  allRfPostList: [],
  netOneInputConfig: {},
  freshupDownlinkKey: 0,
  // 全局 特殊(离线AD和网络DDC)机器是否开启了对应模式 刷新后，如果开启了对应模式，需要跳转到对应机器 off代表当前关闭
  mainStorageDataMode: 'off',
  globalStoreAllstatusData: {},
  isExist: false, // 是否有 DVB板卡
};

export default {
  namespace: 'main',
  state: {
    token: null,
    loginFlag: false,
    user: {
      isLogined: false,
      name: "admin",
    },
    collapsed: false,
    hideLogoText: true,
    onlyShowUserInfo: false,
    selectModule: '',
    notices: [],
    defaultCompnent: config.loginPath,
    menu: [],
    redirect: [],
    hasHeader: true,
    hasSiderBar: false,
    dateTime: "",
    themeName: getStorageData('theme') || config.selectedTheme || 'dark',
    settings: {
      acls: [],
      enableHeaderNav: true,
      superApps: [],
      headerSearcher: false,
      userMenu: [],
      settingMenu: config.settingMenu || [],
      faq: false,
      footer: {
        links: [],
        copyright: '',
      },
      noticeTab: [],
      headerNav: [],
      productName: '',
    },
    inited: false,
    failed: false,
    selectedTheme: config.selectedTheme,
    systemCurrentCommPort: '',
    systemInited: true,
    systemNetCardError: false,
    isCloseSocket: '0',
    detailStatusLayoutType: "both",
    isMeshNet: false,
    allNetShow: true,
  },

  effects: {
    *login(__, { put, select }) {
      const oldState = yield select(_ => _.main);
      const settings = { ...oldState.settings };
      yield put({
        type: 'updateState',
        payload: { settings, user: { isLogined: true } },
      });
    },
    *logout(__, { call, put, select }) {
      const oldState = yield select(_ => _.main);
      const settings = { ...oldState.settings };
      const userRes = yield call(rqSetConfig.userLogout);
      if (userRes.success) {
        yield put({
          type: 'updateState',
          payload: { settings, user: { isLogined: false } },
        });
      }
    },
    *getLoginStatus(__, { put }) {
      const state = {}
      yield put({
        type: 'updateState',
        payload: state,
      });
    },
    *init(__, { put, select }) {
      let newState = false;
      yield put({
        type: 'updateState',
        payload: defaultState,
      });
      if (!uri.isRoot()) {
        uri.toRoot();
        return;
      }
      const appRes = {
        "default": "home",
        "moduleSep": "/",
        "enableHeaderNav": false,
        "lang": [
          [
            "/",
            {
              "compayName": "公司T, INC.",
              "productName": "ANTDPRO",
              "footerText": "Copyright © 2018-2023 北京公司T. All rights reserved.",
              "Ok": "确定",
              "ok": "确定",
              "Cancel": "取消",
              "cancel": "取消",
              "Edit": "编辑",
              "edit": "编辑",
              "Delete": "删除",
              "delete": "删除",
              "Clear": "清空",
              "clear": "清空",
              "Visitor": "游客",
              "Admin": "管理员",
              "Messgage:": "消息:",
              "File:": "文件:",
              "Detail:": "详情:",
              "Change password": "修改密码",
              "Are you sure to sign out?": "确定要退出吗？",
              "Sign out": "退出",
              "Yes": "是",
              "No": "否",
              "sample": "样例",
              "system": "系统管理",
              "dashboard": "首页",
              "portal": "首页",
              "Refresh": "刷新",
              "users": "用户列表",
              "clearNotice": "清空提示信息",
              "Duplicated tag": "重复的标签",
              "The max length is: {0}": "最大长度为: {0}",
              "The min length is: {0}": "最小长度为: {0}",
              "EmptyData": "数据为空",
              "Please login": "请登录",
              "Request failed, the reason is: {0}": "发送请求失败，原因是：{0}",
              "{0}-{1} of {2} items": "{0}-{1} 共 {2} 项",
              "The operation is succeeded": "操作成功",
              "Operation is failed. The error is known": "未知原因导致操作失败",
              "Operation notification": "操作提示",
              "Operation is in processing, please wait...": "操作正在进行中，请稍后...",
              "Invalid parameters": "参数错误",
              "Bad request": "错误请求",
              "Go to home page": "跳转至首页",
              "You do not have the privilege.": "无操作权限进行该项操作",
              "You are not login. Login page is loading, please wait...": "你没有登录或者登录超时，正在跳转至登录页面，请稍后...",
              "No data processor!": "该数据查询无法处理，未定义规则",
              "No ops processor!": "该操作无法处理，未定义规则",
              "Duplicated record, please check the parameters!": "数据中存在重名的记录，请填写不一样的名称",
              "Prepare to refresh page...": "正在刷新页面...",
              "Prepare to relocation...": "正在跳转页面...",
              "Loading page...": "正在加载页面...",
              "Must be digits": "必须是数字",
              "Must be letters and digits": "必须是字母及数字",
              "Must be Letters, digits, and minus sign": "必须是字母、数字及减号",
              "Must be Letters, digits, minus sign and dot mark": "必须是字母、数字、减号及点号",
              "Must be valid url": "URL不合法",
              "Password is too simple": "密码过于简单，必须包含数字、字母及大小写",
              "Password is not correct": "账号或密码不正确",
              "Must be valid email": "邮箱不合法",
              "Must be valid number": "数字不合法",
              "Must be valid ipv4 address": "IPV4地址不合法",
              "Must be valid ipv6 address": "IPV6地址不合法",
              "Must be date with hour, eg: 1998-01-01 19:01": "必须是包含分钟的时间，例如：1998-01-01 19:01",
              "Must be date with hour and minutes, eg: 1998-01-01 19:01:01": "必须是包含秒的时间，例如：1998-01-01 19:01:01",
              "Must be date, eg: 1998-01-01": "必须只含有日月的时间，例如：1998-01-01",
              "Must be digits joined by comma, eg: 1,2,3": "必须是用逗号连接的数字集合，例如：1,2,10,12",
              "Must be valid base64 encoded value": "必须是base64编码",
              "Must be hex string": "必须是16进制字符串",
              "The file type is invalid": "文件类型错误",
              "The field is invalid": "这项输入不合法",
              "File size must between {0} ~ {1}": "文件大小必须在 {0} ~ {1} 范围",
              "Input value range is [{0}, {1}]": "输入值大小必须在 [{0}, {1}] 范围",
              "Input value range is [{0}, {1})": "输入值大小必须在 [{0}, {1}) 范围",
              "Input value range is ({0}, {1}]": "输入值大小必须在 ({0}, {1}] 范围",
              "Input value range is ({0}, {1})": "输入值大小必须在 ({0}, {1}) 范围",
              "The minimum value is {0}": "输入值最小为 {0}",
              "The maximum value is {0}": "输入值最大为 {0}",
              "The two field {0} and {1} must be same.": "{0}和{1}的值必须是一样",
              "old_pwd": "原始密码",
              "pwd1": "新密码",
              "pwd2": "密码确认",
              "The length of this field must be {0}.": "该项的长度必须是：{0}",
              "The length of this field must between {0} and {1}.": "该项的长度范围是[{0}, {1}]",
              "The minimium length of this field must be {0}.": "该项的长度不能小于 {0}",
              "The maximum length of this field must be {0}.": "该项的长度不能大于 {0}",
              "Account": "账号",
              "Role": "角色",
              "Nick Name": "昵称",
              "Create Time": "创建时间",
              "{0} is required": "{0}必须填写",
              "This field": "该项",
              "Current value of {0} is: ": "当前{0}的值是: ",
              "File extension should be {0}": "文件后缀必须是{0}",
              "File size should between {0} and {1}": "文件大小必须在{0}和{1}之间",
              "File is empty": "文件不能为空",
              "File size should not bigger than {0}": "文件大小不能超过{0}",
              "Invalid form data": "表单部分内容不正确",
              "op_create": "[创建]",
              "op_edit": "[编辑]",
              "op_del": "[删除]",
              "op_login": "[登录]",
              "op_logout": "[登出]",
              "op_list": "[访问]",
              "response_status_1": "成功",
              "response_status_0": "失败",
            },
          ],
          [
            "/",
            {
              "New password": "新密码",
              "Change your password": "设置新密码",
              "Password confirmation": "密码确认",
              "Old password is required": "原始密码必须填写",
              "New password is required": "新密码必须填写",
              "Password confirmation is required": "密码确认必须填写",
              "Login successfully": "登录成功",
              "Failed to fetch user data, please contact system administrator": "获取用户信息失败，请联系管理员",
            },
          ],
        ],
        "headerNav": [],
        "validators": {
          "digits": "^\\d+$",
          "letters": "^([a-z]|[A-Z])+$",
          "alphanumeric": "^[\\w|-]+$",
          "alphanumeric_ex": "^[\\w|-|\\.]+$",
          "url": [
            "^(https?|ftp):\\/\\/[^\\s\\/\\$.?#].[^\\s]*$",
            "i",
          ],
          "password": [
            [
              "^(\\w|\\d|@|!)+$",
              "\\d",
              "[a-z]",
              "[A-Z]",
            ],
            [
              "",
              "",
              "i",
              "i",
            ],
          ],
          "email": "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
          "number": "^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$",
          "ipv4": "^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
          "ipv6": "^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$",
          "datehour": "^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d$",
          "datetime": "^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d$",
          "date": "^\\d\\d\\d\\d-\\d\\d-\\d\\d$",
          "joined_digits": "^\\d+[\\d|,]*$",
          "base64": "^[A-Za-z0-9\\+\\/=]+$",
          "hex": "^[A-E0-9]+$",
        },
        "config": {
          "isSuperAdministrator": true,
        },
        "formRules": [],
      };
      localization.set(appRes.lang);
      let oldState = yield select(_ => _.main);
      const settings = { ...oldState.settings, ...appRes.data };
      const selectedTheme = config.selectedTheme;
      initSettings(settings, put);
      oldState = yield select(_ => _.main);
      newState = applySettings(settings, null, put);
      if (config.isThemeEnabled && selectedTheme !== config.selectedTheme) {
        newState.selectedTheme = changeTheme(config.selectedTheme);
        config.selectedTheme = newState.selectedTheme;
      }
      if (settings.enableHeaderNav) newState.hasHeader = settings.enableHeaderNav;
      if (isUndefined(settings.hideHeader)) newState.hasHeader = !settings.hideHeader;
      newState.inited = true;
      let search = window.location.search;
      if (!search) {
        search = window.location.href.split('?')[1] || ''
      }
      const params = qs.parse(search, { ignoreQueryPrefix: true });
      let hasHeader = true;
      if (params.hiddenHeader && ![0, '0'].includes(params.hiddenHeader)) {
        hasHeader = false;
      }
      if (!newState.user) newState.user = oldState.user;
      newState.hasHeader = hasHeader
      yield put({
        type: 'updateState',
        payload: newState,
      });
    },

    *exception({ payload }, { put }) {
      // redirect on client when network broken
      yield put(routerRedux.push(uri.getComponentPath(`exception/${payload.code}`)));
    },

    *updateMainState({ payload, callback }, { put }) {
      yield put({
        type: 'updateState',
        payload,
      });
      if (callback) callback();
    },

    *updateCloseSocket({ payload, callback }, { put }) {
      yield put({
        type: 'updateState',
        payload: { isCloseSocket: payload },
      });
      if (callback) callback();
    },

    *getDate({ payload, callback }, { call }) {
      const res = yield call(time.list, payload);
      if (res && res.success && res.data) {
        callback(res.data);
      } else if (!res.success) {
        callback();
        return message.warning(res.message || '');
      }
    },

    *setTimeData({ payload, callback }, { call }) {
      const res = yield call(time.setTime, payload);
      if (res && res.success) {
        callback(res.data);
      } else {
        callback();
        return message.warning(res.message)
      }
    },

    *setOverallData({ payload }, { call }) {
      const res = yield call(time.setDateTime, payload);
      if (res && res.success) {
        return message.success(res.message || '设置成功')
      } else {
        return message.error(res.message)
      }
    },

    *setSoftReboot({ payload, callback }, { call }) {
      const res = yield call(rqApp.setSoftReboot, payload);
      const { type } = payload;
      if (callback) callback(type === 1 ? res : res.data)
    },

    *setDevice({ payload }, { call }) {
      const res = yield call(rqApp.deviceRestart, payload);
      if (res && res.success) {
        message.success(res.message || '设置成功')
      } else {
        message.error(res.message || '设置失败')
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      const newState = {
        ...state,
        ...payload,
      };
      return newState;
    },
    updateLogin(state, { payload }) {
      const newState = {
        ...state,
      }
      if (payload.userMenu) {
        const _userMenu = defaultUserMenu.reduce((acc, cur) => {
          const i = payload.userMenu.findIndex(c => c.key === cur.key);
          if (i > -1) {
            acc.push(payload.userMenu[i]);
          } else if (cur.hidden === '0') {
            acc.push(cur);
          }
          return acc;
        }, [])
        newState.settings.userMenu = _userMenu.filter(c => c.key !== 'userConfig')
      }
      newState.columnSetting = payload.columnSetting
      newState.netControl = payload.netControl
      newState.couldChangeRfMod = payload.couldChangeRfMod
      newState.haveSpectrumSweep = payload.haveSpectrumSweep
      newState.IPFraInfoDisplay = payload.IPFraInfoDisplay
      newState.vsatInfo = payload.vsatInfo
      newState.companyMenu = payload.companyMenu
      newState.outputMenu = payload.outputMenu
      newState.syncInfo = payload.syncInfo
      newState.EssInfoDisplay = payload.EssInfoDisplay
      newState.higherConfig = payload.higherConfig
      newState.averageDeep = payload.averageDeep
      newState.frequencyShow = payload.frequencyShow
      newState.adCardShow = payload.adCardShow
      newState.netControlDemodulationShow = payload.netControlDemodulationShow
      newState.spreadSpectrumShow = payload.spreadSpectrumShow
      newState.allConfigCompanyData = payload.allConfigCompanyData

      // newState.settings.userMenu = [
      //   { name: 'userConfig', text: '偏好设置', icon: 'setting' },
      //   { name: 'resetAll', text: '全网重置', icon: 'reload' },
      //   { name: 'systemStatus', text: '系统状态', icon: 'line-chart' },
      //   // { name: 'debuggerDetail', text: '调试详情', icon: 'info-circle' },
      //   { name: 'inverterConfig', text: '变频器设置', icon: 'setting' },
      //   { name: 'companyMode', text: '厂商模式', icon: 'appstore' },
      //   { name: 'keyMannage', text: '密钥管理', icon: 'key' },
      //   { name: 'systemSetting', text: '系统配置', icon: 'setting' },
      //   { name: 'changePassword', text: '修改密码', icon: 'key' },
      //   { name: 'programZip', text: '软件开发包', icon: 'download' },
      //   { name: 'userManaual', text: '用户使用手册', icon: 'file' },
      //   { name: 'version', text: '关于', icon: 'info-circle' },
      // ]
      return newState;
    },
    updateLogout(state, { payload }) {
      const newState = {
        ...state,
      };
      newState.settings.userMenu = [
        { name: 'systemStatus', text: '系统状态', icon: 'line-chart' },
        { name: 'programZip', text: '软件开发包', icon: 'download' },
        { name: 'userManaual', text: '用户使用手册', icon: 'file' },
        { name: 'authStatus', text: '授权状态', icon: 'user' },
        { name: 'version', text: '关于', icon: 'info-circle' },
      ]
      newState.columnSetting = false
      newState.netControl = []
      newState.allConfigCompanyData = {}
      // newState.couldChangeRfMod = false

      // newState.syncInfo = false
      // newState.EssInfoDisplay = false
      // newState.haveSpectrumSweep = false
      // newState.IPFraInfoDisplay = false
      newState.vsatInfo = false
      newState.higherConfig = false
      newState.averageDeep = false
      // newState.netControlDemodulationShow = false
      // newState.frequencyShow = false
      // newState.adCardShow = false
      newState.spreadSpectrumShow = false
      // newState.haveSpectrumSweep = false
      return newState;
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices?.filter(item => item.type !== payload),
      };
    },
    saveCurrentUser(state, action) {
      const user = { ...state.user, ...action.payload };
      return {
        ...state,
        user,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      if (window.yuantek) window.yuantek.init();
      dispatch({ type: 'init' });
      // dispatch({ type: 'global/getNtpInfo' });
    },
  },
};
