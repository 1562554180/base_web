import React, { createElement, Suspense } from 'react';
import { Spin } from 'antd';
import config from 'utils/config';

let routerDataCache;

// Eager-loaded models for synchronous dynamic loading (exclude .min.js)
const modelsGlob = import.meta.glob('./models/**/!(*.min).js', { eager: true });

// Lazy-loaded app components (avoid circular dependency with config.js)
const appsGlob = import.meta.glob('./apps/**/*.js');

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

const registerModels = (app, models) => {
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
        app.model(modelsGlob[`./models/${p}${m}.js`].default);
    }
  });
};

const Loading = () => createElement(Spin, { size: 'large', style: { display: 'block', margin: '100px auto' } });

const dynamicWrapper = (app, models, componentLoader) => {
  registerModels(app, models);
  const LazyComponent = React.lazy(componentLoader);
  return props => createElement(Suspense, { fallback: createElement(Loading) },
    createElement(LazyComponent, { ...props, routerData: routerDataCache })
  );
};

export const getRouterData = app => {
  const routerConfig = {
    '/': { component: dynamicWrapper(app, [], appsGlob['./apps/layout.js']) },
    '/home': { component: dynamicWrapper(app, ['main'], appsGlob['./apps/home/index.js']) },
    '/form_demo': { component: dynamicWrapper(app, [], appsGlob['./apps/form_demo/index.js']) },
  };
  routerConfig.$ = Object.keys(routerConfig);
  routerConfig.$.sort();
  routerDataCache = routerConfig;
  return routerConfig;
};
