import './polyfill';

// import 'antd/dist/antd.less';


import dva from 'dva';

// use BrowserHistory
import { createHashHistory } from 'history'
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import config from './utils/config';
import './index.less';

if (typeof window !== 'undefined' && window.ResizeObserver) {
  const originalResizeObserver = window.ResizeObserver;

  window.ResizeObserver = class DebouncedResizeObserver {
    constructor(callback) {
      let ticking = false;
      this.observer = new originalResizeObserver((entries) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            callback(entries);
            ticking = false;
          });
          ticking = true;
        }
      });
    }

    observe(target, options) {
      return this.observer.observe(target, options);
    }

    unobserve(target) {
      return this.observer.unobserve(target);
    }

    disconnect() {
      return this.observer.disconnect();
    }
  };

  window.OriginalResizeObserver = originalResizeObserver;
}

// 1. Initialize
const app = dva({
  history: createHashHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register main model
app.model(require('./models/main').default);
app.model(require('./models/passport').default);

// 4. Router
const routerConfig = require('./config').default;

app.router(routerConfig);

// 5. Start
app.start('#root');
config.store = app._store;
