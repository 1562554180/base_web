// Webpack mock middleware for dev server
const express = require('express');
const mockjs = require('mockjs');
const moment = require('moment');

// 直接定义 mock 数据，避免 ES 模块导入问题
function getFakeChartData() {
  const visitData = [];
  const beginDay = new Date().getTime();
  const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
  for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
      y: fakeY[i],
    });
  }

  const visitData2 = [];
  const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
  for (let i = 0; i < fakeY2.length; i += 1) {
    visitData2.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
      y: fakeY2[i],
    });
  }

  const salesData = [];
  for (let i = 0; i < 12; i += 1) {
    salesData.push({
      x: `${i + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200,
    });
  }

  const searchData = [];
  for (let i = 0; i < 50; i += 1) {
    searchData.push({
      index: i + 1,
      keyword: `搜索关键词-${i}`,
      count: Math.floor(Math.random() * 1000),
      range: Math.floor(Math.random() * 100),
      status: Math.floor((Math.random() * 10) % 2),
    });
  }

  const salesTypeData = [
    { x: '家用电器', y: 4544 },
    { x: '食用酒水', y: 3321 },
    { x: '个护健康', y: 3113 },
    { x: '服饰箱包', y: 2341 },
    { x: '母婴产品', y: 1231 },
    { x: '其他', y: 1231 },
  ];

  const salesTypeDataOnline = [
    { x: '家用电器', y: 244 },
    { x: '食用酒水', y: 321 },
    { x: '个护健康', y: 311 },
    { x: '服饰箱包', y: 41 },
    { x: '母婴产品', y: 121 },
    { x: '其他', y: 111 },
  ];

  const salesTypeDataOffline = [
    { x: '家用电器', y: 99 },
    { x: '个护健康', y: 188 },
    { x: '服饰箱包', y: 344 },
    { x: '母婴产品', y: 255 },
    { x: '其他', y: 65 },
  ];

  const offlineData = [];
  for (let i = 0; i < 10; i += 1) {
    offlineData.push({
      name: `门店${i}`,
      cvr: Math.ceil(Math.random() * 9) / 10,
    });
  }

  const offlineChartData = [];
  for (let i = 0; i < 20; i += 1) {
    offlineChartData.push({
      x: new Date().getTime() + 1000 * 60 * 30 * i,
      y1: Math.floor(Math.random() * 100) + 10,
      y2: Math.floor(Math.random() * 100) + 10,
    });
  }

  const radarOriginData = [
    { name: '个人', ref: 10, koubei: 8, output: 4, contribute: 5, hot: 7 },
    { name: '团队', ref: 3, koubei: 9, output: 6, contribute: 3, hot: 1 },
    { name: '部门', ref: 4, koubei: 1, output: 6, contribute: 5, hot: 7 },
  ];

  const radarData = [];
  const radarTitleMap = {
    ref: '引用',
    koubei: '口碑',
    output: '产量',
    contribute: '贡献',
    hot: '热度',
  };
  radarOriginData.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'name') {
        radarData.push({
          name: item.name,
          label: radarTitleMap[key],
          value: item[key],
        });
      }
    });
  });

  return {
    visitData,
    visitData2,
    salesData,
    searchData,
    offlineData,
    offlineChartData,
    salesTypeData,
    salesTypeDataOnline,
    salesTypeDataOffline,
    radarData,
  };
}

// 创建 Express 应用来处理 mock 请求
function createMockMiddleware() {
  const app = express();
  
  // 解析 JSON 和 URL 编码的请求体
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 处理 /_mock 端点（用于获取应用配置等）
  app.use('/_mock', (req, res, next) => {
    const { parse } = require('url');
    const qs = require('qs');
    const url = req.url;
    const params = parse(url, true).query;
    const op = params.op;
    const m = params.m;
    
    console.log(`[MOCK] /_mock request: op=${op}, m=${m}`);
    
    // 处理 m=passport&op=$ 的情况（获取登录相关配置）
    if (op === '$' && m === 'passport') {
      // 检查是否已登录（通过 cookie 中的 token）
      const cookie = req.headers.cookie || '';
      const cookies = qs.parse(cookie.replace(/\s/g, ''), {
        delimiter: ';',
      });
      
      // 完整的 acls 数据（登录后使用）
      const acls = {
        '/portal': { name: '首页', icon: 'home' },
        '/test': { name: 'test', icon: 'file' },
        // '/remote': { name: '远程页面', icon: 'cloud' },
        // '/remote/home': { name: '首页', icon: 'home', page: false },
        // '/remote/about': { name: '关于', icon: 'info-circle', page: false },
        '/sample': { name: '页面示例', icon: 'dashboard' },
        '/sample/dashboard': { name: '仪表盘', icon: 'dashboard' },
        '/sample/dashboard/analysis': { name: '分析页', page: false },
        '/sample/dashboard/workplace': { name: '工作台', page: false },
        '/sample/dashboard/monitor': { name: '监控页', page: false },
        '/sample/exception': { name: '异常页', icon: 'warning' },
        '/sample/exception/403': { name: '403', icon: 'exception', page: false },
        '/sample/exception/404': { name: '404', icon: 'question-circle-o', page: false },
        '/sample/exception/500': { name: '500', icon: 'close-circle-o', page: false },
        '/sample/form': { name: '表单页', icon: 'form' },
        '/sample/form/basic-form': { name: '基础表单', page: false },
        '/sample/form/step-form': { name: '分步表单', page: false },
        '/sample/form/step-form/info': { name: 'info', page: true },
        '/sample/form/step-form/confirm': { name: 'confirm', page: true },
        '/sample/form/step-form/result': { name: 'result', page: true },
        '/sample/form/advanced-form': { name: '高级表单', page: false },
        '/sample/list': { name: '列表页', icon: 'table' },
        '/sample/list/table': { name: '查询表格', page: false },
        '/sample/list/basic': { name: '标准列表', page: false },
        '/sample/list/card': { name: '卡片列表', page: false },
        '/sample/list/search': { name: '搜索列表' },
        '/sample/list/search/applications': { name: '搜索列表（应用）', page: false },
        '/sample/list/search/articles': { name: '搜索列表（文章）', page: false },
        '/sample/list/search/projects': { name: '搜索列表（项目）', page: false },
        '/sample/profile': { name: '详情页', icon: 'profile' },
        '/sample/profile/basic': { name: '基础详情页', page: false },
        '/sample/profile/advanced': { name: '高级详情页', page: false },
        '/sample/profile/books': { name: 'books', page: false },
        '/sample/result': { name: '结果页', icon: 'check-circle-o' },
        '/sample/result/fail': { name: '失败', page: false },
        '/sample/result/success': { name: '成功', page: false },
        '/system': { name: '系统管理' },
        '/system/settings': { name: '系统设置', icon: 'setting' },
        '/system/settings/basic': { name: '基础设置', page: false },
        '/system/settings/features': { name: '功能管理', page: false },
        '/system/user': { name: '账户管理', icon: 'user' },
        '/system/user/users': { name: '账户', icon: 'user', page: false },
        '/system/user/role': { name: '角色', page: false },
      };
      
      const defaultUserMenu = [
        {
          name: 'login',
          text: '登录',
        },
      ];
      
      const userMenuAfterLogin = [
        {
          name: 'user',
          text: '个人中心',
          icon: 'user',
        },
        {
          name: 'setting',
          text: '设置',
        },
        {
          name: 'password',
          text: '修改密码',
          icon: 'key',
        },
        '',
        {
          name: 'logout',
          text: '退出登录',
        },
      ];
      
      const response = {
        success: true,
        data: {
          lang: [
            ['/', {}],
          ],
          formRules: {
            login: {
              user: {
                "required": true,
                "alphanumeric": true,
                "rangelength": [3, 32],
              },
              pwd: {
                "required": true,
                "rangelength": [6, 32],
                "password": true,
              },
              option1: {
                "required": true,
                "rangelength": [2, 3],
              },
            },
            changePassword: {
              pwd1: {
                required: true,
                _msg: 'New password is required',
              },
              pwd2: {
                required: true,
                _msg: 'Password confirmation is required',
              },
            },
          },
        },
      };
      
      // 检查是否已登录（开发环境默认登录，或通过 cookie token 判断）
      let aUser = false;
      if (cookies.token) {
        try {
          const token = JSON.parse(cookies.token);
          if (token && token.id && token.deadline > new Date().getTime()) {
            // 这里可以扩展 token 验证逻辑
            aUser = {
              id: 0,
              account: 'admin',
              name: 'Admin',
              avatar: 'user.png',
              isLogined: true,
            };
          }
        } catch (e) {
          // token 解析失败
        }
      }
      
      // 开发环境默认登录（可选）
      // aUser = {
      //   id: 0,
      //   account: 'admin',
      //   name: 'Admin',
      //   avatar: 'user.png',
      //   isLogined: true,
      // };
      
      if (aUser) {
        response.data.user = aUser;
        response.data.userMenu = userMenuAfterLogin;
        response.data.acls = acls;
        response.data.default = 'portal';
        response.data.tables = {};
      } else {
        response.data.userMenu = defaultUserMenu;
        response.data.user = {
          name: 'Guest',
          avatar: 'avatar.png',
          isLogined: false,
        };
      }
      
      console.log(`[MOCK] Returning passport data for op=$, user logged in: ${!!aUser}`);
      res.json(response);
      return;
    }
    
    // 处理 op=$ 的情况（获取设置）
    if (op === '$' && (!m || m === '/')) {
      // 完整的 acls 数据，包含所有菜单项
      const acls = {
        '/portal': { name: '首页', icon: 'home' },
        '/test': { name: 'test', icon: 'file' },
        // '/remote': { name: '远程页面', icon: 'cloud' },
        // '/remote/home': { name: '首页', icon: 'home', page: false },
        // '/remote/about': { name: '关于', icon: 'info-circle', page: false },
        '/sample': { name: '页面示例', icon: 'dashboard' },
        '/sample/dashboard': { name: '仪表盘', icon: 'dashboard' },
        '/sample/dashboard/analysis': { name: '分析页', page: false },
        '/sample/dashboard/workplace': { name: '工作台', page: false },
        '/sample/dashboard/monitor': { name: '监控页', page: false },
        '/sample/exception': { name: '异常页', icon: 'warning' },
        '/sample/exception/403': { name: '403', icon: 'exception', page: false },
        '/sample/exception/404': { name: '404', icon: 'question-circle-o', page: false },
        '/sample/exception/500': { name: '500', icon: 'close-circle-o', page: false },
        '/sample/form': { name: '表单页', icon: 'form' },
        '/sample/form/basic-form': { name: '基础表单', page: false },
        '/sample/form/step-form': { name: '分步表单', page: false },
        '/sample/form/step-form/info': { name: 'info', page: true },
        '/sample/form/step-form/confirm': { name: 'confirm', page: true },
        '/sample/form/step-form/result': { name: 'result', page: true },
        '/sample/form/advanced-form': { name: '高级表单', page: false },
        '/sample/list': { name: '列表页', icon: 'table' },
        '/sample/list/table': { name: '查询表格', page: false },
        '/sample/list/basic': { name: '标准列表', page: false },
        '/sample/list/card': { name: '卡片列表', page: false },
        '/sample/list/search': { name: '搜索列表' },
        '/sample/list/search/applications': { name: '搜索列表（应用）', page: false },
        '/sample/list/search/articles': { name: '搜索列表（文章）', page: false },
        '/sample/list/search/projects': { name: '搜索列表（项目）', page: false },
        '/sample/profile': { name: '详情页', icon: 'profile' },
        '/sample/profile/basic': { name: '基础详情页', page: false },
        '/sample/profile/advanced': { name: '高级详情页', page: false },
        '/sample/profile/books': { name: 'books', page: false },
        '/sample/result': { name: '结果页', icon: 'check-circle-o' },
        '/sample/result/fail': { name: '失败', page: false },
        '/sample/result/success': { name: '成功', page: false },
        '/system': { name: '系统管理' },
        '/system/settings': { name: '系统设置', icon: 'setting' },
        '/system/settings/basic': { name: '基础设置', page: false },
        '/system/settings/features': { name: '功能管理', page: false },
        '/system/user': { name: '账户管理', icon: 'user' },
        '/system/user/users': { name: '账户', icon: 'user', page: false },
        '/system/user/role': { name: '角色', page: false },
      };
      
      const settings = {
        success: true,
        data: {
          default: 'portal',
          enableHeaderNav: true,
          lang: [
            ['/', {}],
          ],
          validators: {
            "digits": "^\\d+$",
            "letters": "^([a-z]|[A-Z])+$",
            "alphanumeric": "^[\\w|-]+$",
            "alphanumeric_ex": "^[\\w|-|\\.]+$",
            "url": ["^(https?|ftp):\\/\\/[^\\s\\/\\$.?#].[^\\s]*$", "i"],
            "password": [["^(\\w|\\d|@|!)+$", "\\d", "[a-z]", "[A-Z]"], ["", "", "i", "i"]],
            "email": "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
            "number": "^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$",
            "ipv4": "^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
            "ipv6": "^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$",
            "datehour": "^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d$",
            "datetime": "^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d$",
            "date": "^\\d\\d\\d\\d-\\d\\d-\\d\\d$",
            "joined_digits": "^\\d+[\\d|,]*$",
            "base64": "^[A-Za-z0-9\\+\\/=]+$",
            "hex": "^[A-E0-9]+$"
          },
          footer: {
            links: [
              {
                key: 'Pro 首页',
                title: 'Pro 首页',
                href: 'http://pro.ant.design',
              },
              {
                key: 'github',
                icon: 'github',
                href: 'https://github.com/ant-design/ant-design-pro',
              },
              {
                key: 'Ant Design',
                title: 'Ant Design',
                href: 'http://ant.design',
              },
            ],
          },
         
          faq: {
            title: '使用文档',
            link: 'http://pro.ant.design/docs/getting-started',
          },
          noticeTab: [{
            type: 'info',
            text: '通知',
            emptyText: '你已查看所有通知',
            emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
          }, {
            type: 'message',
            text: '消息',
            emptyText: '您已读完所有消息',
            emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
          }, {
            type: 'todo',
            text: '待办',
            emptyText: '你已完成所有待办',
            emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
          }],
          acls: acls,
        },
      };
      
      console.log(`[MOCK] Returning settings for op=$ with ${Object.keys(acls).length} acls`);
      res.json(settings);
      return;
    }
    
    // 处理登录请求 m=passport&op=login
    if (op === 'login' && m === 'passport') {
      // 尝试从 req.body 获取登录数据，支持多种格式
      let loginData = req.body && req.body.f;

      // 如果 body 是 URL 编码格式 (f[user], f[pwd] 等)
      if (!loginData && req.body) {
        loginData = {};
        for (const key in req.body) {
          if (key.startsWith('f[')) {
            const fieldName = key.match(/f\[(\w+)\]/)?.[1];
            if (fieldName) {
              loginData[fieldName] = req.body[key];
            }
          }
        }
        // 如果没有 f[] 格式的字段，直接从 body 获取
        if (Object.keys(loginData).length === 0 && req.body.user) {
          loginData = req.body;
        }
      }

      console.log(`[MOCK] Login request, body:`, req.body);
      console.log(`[MOCK] Login request, loginData:`, loginData);

      if (!loginData || !loginData.user) {
        res.json({
          success: false,
          message: 'Invalid parameters',
        });
        return;
      }

      const { user, pwd, type } = loginData;

      // 模拟用户验证 (admin/123Qwe)
      if ((user === 'admin' && pwd === '123Qwe') || (user === 'user' && pwd === '123Qwe')) {
        const now = new Date();
        now.setDate(now.getDate() + 1);

        res.cookie('token', JSON.stringify({
          id: 'mock_token_' + Date.now(),
          deadline: now.getTime(),
        }), {
          maxAge: 900000,
          httpOnly: true,
        });

        console.log(`[MOCK] Login successful for user: ${user}`);
        res.json({
          success: true,
          message: 'Login successfully',
          loginType: type,
        });
        return;
      }

      console.log(`[MOCK] Login failed for user: ${user}, pwd: ${pwd}`);
      res.json({
        success: false,
        message: 'Failed to login',
        loginType: type,
      });
      return;
    }

    // 处理登出请求 m=passport&op=logout
    if (op === 'logout' && m === 'passport') {
      res.clearCookie('token');
      res.json({
        success: true,
        message: 'Logout successfully',
      });
      return;
    }

    // 其他 _mock 请求返回空对象
    console.log(`[MOCK] Unhandled /_mock request, returning empty object`);
    res.json({});
  });

  // 处理所有 API 请求
  app.use('/api', (req, res, next) => {
    const method = req.method.toUpperCase();
    const path = req.path;
    
    console.log(`[MOCK] API request: ${method} ${path}`);

    // 处理不同的 API 端点
    if (method === 'GET') {
      if (path === '/fake_chart_data' || path === '/fake_chart_data/') {
        res.json(getFakeChartData());
        return;
      }
      
      if (path === '/project/notice' || path === '/project/notice/') {
        const titles = ['Alipay', 'Angular', 'Ant Design', 'Ant Design Pro', 'Bootstrap', 'React', 'Vue', 'Webpack'];
        const avatars = [
          'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
          'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
          'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
          'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
          'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
          'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
        ];
        res.json([
          { id: 'xxx1', title: titles[0], logo: avatars[0], description: '那是一种内在的东西，他们到达不了，也无法触及的', updatedAt: new Date(), member: '科学搬砖组', href: '', memberLink: '' },
          { id: 'xxx2', title: titles[1], logo: avatars[1], description: '希望是一个好东西，也许是最好的，好东西是不会消亡的', updatedAt: new Date('2017-07-24'), member: '全组都是吴彦祖', href: '', memberLink: '' },
          { id: 'xxx3', title: titles[2], logo: avatars[2], description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆', updatedAt: new Date(), member: '中二少女团', href: '', memberLink: '' },
          { id: 'xxx4', title: titles[3], logo: avatars[3], description: '那时候我只会想自己想要什么，从不想自己拥有什么', updatedAt: new Date('2017-07-23'), member: '程序员日常', href: '', memberLink: '' },
          { id: 'xxx5', title: titles[4], logo: avatars[4], description: '凛冬将至', updatedAt: new Date('2017-07-23'), member: '高逼格设计天团', href: '', memberLink: '' },
          { id: 'xxx6', title: titles[5], logo: avatars[5], description: '生命就像一盒巧克力，结果往往出人意料', updatedAt: new Date('2017-07-23'), member: '骗你来学计算机', href: '', memberLink: '' },
        ]);
        return;
      }
      
      if (path === '/activities' || path === '/activities/') {
        const avatars2 = [
          'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
          'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
          'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
          'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
          'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
        ];
        res.json([
          { id: 'trend-1', updatedAt: new Date(), user: { name: '曲丽丽', avatar: avatars2[0] }, group: { name: '高逼格设计天团', link: 'http://github.com/' }, project: { name: '六月迭代', link: 'http://github.com/' }, template: '在 @{group} 新建项目 @{project}' },
          { id: 'trend-2', updatedAt: new Date(), user: { name: '付小小', avatar: avatars2[1] }, group: { name: '高逼格设计天团', link: 'http://github.com/' }, project: { name: '六月迭代', link: 'http://github.com/' }, template: '在 @{group} 新建项目 @{project}' },
          { id: 'trend-3', updatedAt: new Date(), user: { name: '林东东', avatar: avatars2[2] }, group: { name: '中二少女团', link: 'http://github.com/' }, project: { name: '六月迭代', link: 'http://github.com/' }, template: '在 @{group} 新建项目 @{project}' },
        ]);
        return;
      }
      
      if (path === '/rule' || path.startsWith('/rule?')) {
        const { parse } = require('url');
        const url = req.url;
        const params = parse(url, true).query;
        const tableListDataSource = [];
        for (let i = 0; i < 46; i += 1) {
          tableListDataSource.push({
            key: i,
            disabled: i % 6 === 0,
            href: 'https://ant.design',
            avatar: ['https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png', 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'][i % 2],
            no: `TradeCode ${i}`,
            title: `一个任务名称 ${i}`,
            owner: '曲丽丽',
            description: '这是一段描述',
            callNo: Math.floor(Math.random() * 1000),
            status: Math.floor(Math.random() * 10) % 4,
            updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
            createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
            progress: Math.ceil(Math.random() * 100),
          });
        }
        let dataSource = [...tableListDataSource];
        if (params.sorter) {
          const s = params.sorter.split('_');
          dataSource = dataSource.sort((prev, next) => {
            if (s[1] === 'descend') {
              return next[s[0]] - prev[s[0]];
            }
            return prev[s[0]] - next[s[0]];
          });
        }
        let pageSize = 10;
        if (params.pageSize) {
          pageSize = params.pageSize * 1;
        }
        res.json({
          list: dataSource,
          pagination: {
            total: dataSource.length,
            pageSize,
            current: parseInt(params.currentPage, 10) || 1,
          },
        });
        return;
      }
      
      if (path === '/tags' || path === '/tags/') {
        res.json(mockjs.mock({
          'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
        }));
        return;
      }
      
      if (path === '/fake_list' || path.startsWith('/fake_list?')) {
        const { parse } = require('url');
        const url = req.url;
        const params = parse(url, true).query;
        const count = params.count * 1 || 20;
        const list = [];
        const titles = ['Alipay', 'Angular', 'Ant Design', 'Ant Design Pro', 'Bootstrap', 'React', 'Vue', 'Webpack'];
        const user = ['付小小', '曲丽丽', '林东东', '周星星', '吴加好', '朱偏右', '鱼酱', '乐哥', '谭小仪', '仲尼'];
        for (let i = 0; i < count; i += 1) {
          list.push({
            id: `fake-list-${i}`,
            owner: user[i % 10],
            title: titles[i % 8],
            avatar: ['https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'][i % 2],
            status: ['active', 'exception', 'normal'][i % 3],
            percent: Math.ceil(Math.random() * 50) + 50,
            logo: ['https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png'][i % 2],
            href: 'https://ant.design',
            updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
            createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
          });
        }
        res.json(list);
        return;
      }
      
      if (path === '/profile/basic' || path === '/profile/basic/') {
        res.json({
          basicGoods: [
            { id: '1234561', name: '矿泉水 550ml', barcode: '12421432143214321', price: '2.00', num: '1', amount: '2.00' },
            { id: '1234562', name: '凉茶 300ml', barcode: '12421432143214322', price: '3.00', num: '2', amount: '6.00' },
          ],
          basicProgress: [
            { key: '1', time: '2017-10-01 14:10', rate: '联系客户', status: 'processing', operator: '取货员 ID1234', cost: '5mins' },
            { key: '2', time: '2017-10-01 14:05', rate: '取货员出发', status: 'success', operator: '取货员 ID1234', cost: '1h' },
          ],
        });
        return;
      }
      
      if (path === '/profile/advanced' || path === '/profile/advanced/') {
        res.json({
          advancedOperation1: [
            { key: 'op1', type: '订购关系生效', name: '曲丽丽', status: 'agree', updatedAt: '2017-10-03  19:23:12', memo: '-' },
            { key: 'op2', type: '财务复审', name: '付小小', status: 'reject', updatedAt: '2017-10-03  19:23:12', memo: '不通过原因' },
          ],
          advancedOperation2: [
            { key: 'op1', type: '订购关系生效', name: '曲丽丽', status: 'agree', updatedAt: '2017-10-03  19:23:12', memo: '-' },
          ],
          advancedOperation3: [
            { key: 'op1', type: '创建订单', name: '汗牙牙', status: 'agree', updatedAt: '2017-10-03  19:23:12', memo: '-' },
          ],
        });
        return;
      }
      
      if (path === '/notices' || path === '/notices/') {
        res.json([
          { id: '000000001', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png', title: '你收到了 14 份新周报', datetime: '2017-08-09', type: 'info' },
          { id: '000000002', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png', title: '你推荐的 曲妮妮 已通过第三轮面试', datetime: '2017-08-08', type: 'info' },
        ]);
        return;
      }
      
      // 处理错误页面请求 /api/403, /api/404, /api/500
      if (path === '/403' || path === '/404' || path === '/500') {
        res.status(parseInt(path.substring(1))).json({
          timestamp: Date.now(),
          status: parseInt(path.substring(1)),
          error: path === '/403' ? 'Unauthorized' : path === '/404' ? 'Not Found' : 'Internal Server Error',
          message: path === '/403' ? 'Unauthorized' : path === '/404' ? 'No message available' : 'error',
          path: req.path,
        });
        return;
      }
    }
    
    if (method === 'POST') {
      if (path === '/rule' || path === '/rule/') {
        const { method: reqMethod, no, description } = req.body;
        res.json({ message: 'Ok', method: reqMethod, no, description });
        return;
      }
      
      if (path === '/forms' || path === '/forms/') {
        res.json({ message: 'Ok' });
        return;
      }
      
      if (path === '/register' || path === '/register/') {
        res.json({ status: 'ok', currentAuthority: 'user' });
        return;
      }
      
      if (path === '/login/account' || path === '/login/account/') {
        const { password, userName, type } = req.body;
        if (password === 'ant.design' && userName === 'admin') {
          res.json({ status: 'ok', type, currentAuthority: 'admin' });
          return;
        }
        if (password === 'ant.design' && userName === 'user') {
          res.json({ status: 'ok', type, currentAuthority: 'user' });
          return;
        }
        res.json({ status: 'error', type, currentAuthority: 'guest' });
        return;
      }
    }
    
    // 如果没有匹配的处理器，返回 404
    console.warn(`[MOCK] No handler found for ${method} ${path}`);
    res.status(404).json({
      error: 'Not Found',
      message: `No mock handler for ${method} ${path}`,
      path: req.path
    });
  });

  return app;
}

module.exports = createMockMiddleware;
