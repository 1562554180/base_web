import './polyfill';


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
import mainModel from './models/main';
import passportModel from './models/passport';

app.model(mainModel);
app.model(passportModel);

// 4. Router
import routerConfig from './config';

app.router(routerConfig);

// 5. Start
app.start('#root');
config.store = app._store;
