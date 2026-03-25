import _ from 'lodash';
import config from './config';

let loginNotify = [];

export function registerLoginNotify(namespace) {
  loginNotify.push(_.isString(namespace) ? [namespace, 'init'] : namespace);
}

export function notifyLogin(main) {
  if (loginNotify.length > 0 && main.user && main.user.isLogined) {
    for (const item of loginNotify) {
      const p = {type: `${item[0]}/${item[1]}`};

      if (item[2]) p.payload = item[2];
      config.store.dispatch(p);
    }
    loginNotify = [];
  }
}