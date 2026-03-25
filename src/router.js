import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import config from 'utils/config';

let routerDataCache;

config.productType = 'sat';
config.isThemeEnabled = true;
config.isMevilMode = false;
config.fileUploadSize = 10;
config.fileUploadCount = 100;
config.topoSetConfig = true;
config.popups = ['/sql_search', '/group_by', '/dataTraffic', '/rowDetail', '/etags', '/pro_exp', '/protoDetail'];
config.menuConf = {
  display: {
    default: {
      type: 'exclude',
      paths: config.popups,
    },
  },
  dataSource: [
    '/topo', '/quickView', '/target', '/assets', '/website', '/mail', '/video', '/expert', '/apps_more', '/dataMonitor', '/userCompany', '/beOnDuty', '/abnormalTraffic',
  ],
};
config.metaBasePath = '/expert';
config.dataPortalBasePath = '/quickView/overview';

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    let m = model || '';

    if (!model.substring) m = model[1] || '';
    return namespace === m.substring(m.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        let p;
        let m;

        if (model.substring) {
          p = 'sat/';
          m = model;
        } else if (model[0]) {
          p = model[0] + '/';
          m = model[1];
        } else {
          p = '';
          m = model[1];
        }
        // eslint-disable-next-line
        if (!_.isUndefined(p) && !_.isUndefined(m))
        app.model(require(`./models/${p}${m}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(model => {
        let p;
        let m;

        if (model.substring) {
          p = 'sat/';
          m = model;
        } else if (model[0]) {
          p = model[0] + '/';
          m = model[1];
        } else {
          p = '';
          m = model[1];
        }

        return import(`./models/${p}${m}.js`);
      }),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

export const getRouterData = app => {
  const routerConfig = {
    '/': { component: dynamicWrapper(app, [], () => import('./apps/layout')) },
    '/home': { component: dynamicWrapper(app, ['main'], () => import('./apps/home')) },
  };
  routerConfig.$ = Object.keys(routerConfig);
  routerConfig.$.sort();
  return routerConfig;
};
