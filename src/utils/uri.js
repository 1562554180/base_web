import qs from 'query-string';
import _ from 'lodash';
import config from './config';

let lastWindowHash = 0;
let lastPathName = 0;
let currentPath = '';
let params = {};

function join(...args) {
  let p = '';
  let sep = '';
  for (let i = 0, cnt = args.length; i < cnt; ++i) {
    if (args[i].length) {
      p += sep + args[i];
      sep = '&';
    }
  }
  return p
}
function queryChanged() {
  params = qs.parse(window.location.search)
}
function param(name, def) {
  if (!name) return params;
  if (typeof (window) === 'undefined') return def
  return _.isUndefined(params[name]) ? def : params[name]
}

function getParamFromUrl(name, def, options) {
  let customUrl = '';
  if (!_.isEmpty(options)) {
    customUrl = options.customUrl;
  }
  let hash = window.location.hash;
  if (!hash && customUrl === '') {
    return def;
  }
  if (!_.isEmpty(customUrl)) {
    hash = customUrl;
  }
  const pos = hash.indexOf('?');
  if (pos === -1) {
    return def;
  };
  const p = qs.parse(hash.substr(pos + 1));
  if (!name) {
    return p;
  };
  return _.isUndefined(p[name]) ? def : p[name];
}

function component(...args) {
  const uri = args.join('/');
  return uri[0] === config.routeUriPrefix ? uri : config.routeUriPrefix + uri;
}

function rootComponent(p) {
  if (!p) p = current();
  return component(p.split('/')[1]);
}

function uriToSelectedKeys(p) {
  const data = p || current();

  if (!data || data === '/') return [];

  const keys = [];
  let pos = data.indexOf('/', 1);

  while (pos !== -1) {
    keys.push(data.substr(0, pos));
    pos = data.indexOf('/', pos + 1);
  }
  keys.push(data);

  return keys;
}

function isRoot(p) {
  return (p || window.location.pathname) === '/' || window.location.pathname.endsWith('analysis.html');
}

function reload() {
  window.location.reload();
}

function getWindowHash() {
  return window.location.hash ? window.location.hash.substr(1) : '';
}

function getWindowSearch() {
  const h = window.location.hash;
  const s = h.split('?')[1];
  if (!s) return {};
  const searchArray = qs.parse(s, { ignoreQueryPrefix: true })
  return searchArray;
}

function current() {
  const pathName = typeof (window) === 'undefined' ? '' : window.location.pathname;

  if (window.location.hash === lastWindowHash && pathName === lastPathName) return currentPath;

  let found = false;

  if (window.location.hash) {
    const h = getWindowHash();
    if (h.length > 1) {
      const pos = h.indexOf('?');
      if (pos > 1) {
        currentPath = h.substr(0, pos);
        found = true;
      } else if (pos === -1) {
        currentPath = h;
        found = true;
      }
    }
  }
  if (!found) {
    currentPath = pathName;
  }
  lastWindowHash = window.location.hash;
  lastPathName = pathName;
  return currentPath;
}

function formatUrlParams(obj) {
  let urlSearch = '';
  let sep = '';
  for (const k in obj) {
    const kv = obj[k];
    if (_.isObject(kv)) {
      urlSearch += qs.stringify(kv);
    } else if (kv !== null && !_.isUndefined(kv)) {
      urlSearch += `${sep}${k}=${encodeURIComponent(kv)}`;
    }
    if (!sep) sep = '&';
  }
  return urlSearch;
}

function ops({ op, m, mock, restfulApi, servicePrefix, ...data }) {
  let s = '';
  const d = formatUrlParams(data);
  if (restfulApi !== true && !config.restfulApi) {
    if (m) s = join(s, 'm=' + m);
    if (op) s = join(s, 'op=' + op);
    if (d) s = join(s, d);
    // return (!mock && !config.useMockSerivce ? config.servicePrefix : config.mockServicePrefix) + '/?' + s
    return (mock || config.useMockSerivce ? config.mockServicePrefix : servicePrefix || config.servicePrefix) + '/?' + s
  }
  s = join(s, m || '');
  if (op || d) s += '/?';
  if (op) s = join(s, 'op=' + op);
  if (d) s = join(s, d);
  return (!mock && !config.useMockSerivce ? config.servicePrefix : config.mockServicePrefix) + s;
}

function addProxyOps({ op, m, mock, restfulApi, ...data }) {
  let s = '';
  const d = formatUrlParams(data);
  if (restfulApi !== true && !config.restfulApi) {
    if (m) s = join(s, 'm=' + m);
    if (op) s = join(s, 'op=' + op);
    if (d) s = join(s, d);
    return (!mock && !config.useMockSerivce ? './serverstat' : config.mockServicePrefix) + '/?' + s
  }
  s = join(s, m || '');
  if (op || d) s += '/?';
  if (op) s = join(s, 'op=' + op);
  if (d) s = join(s, d);
  return (!mock && !config.useMockSerivce ? './serverstat' : config.mockServicePrefix) + s;
}

function isPassportComponent(c) {
  return (c || current()).indexOf(config.passportRoot) === 0;
}

function isLogout(c) {
  return (c || current()).indexOf(config.passportRoot + '/logout') === 0;
}

function isPortalComponent(c) {
  return (c || current()).indexOf(config.portalRoot) === 0;
}

function exception(type) {
  return type ? `/exception/${type}` : '/exception/404'
}

function isExceptionComponent(c) {
  return (c || current()).indexOf('/exception') === 0;
}

function defaultUri(isLogined, defaultComponent, acls) {
  let defaultSearch = false;
  let usedComponent = defaultComponent;
  if (defaultComponent && defaultComponent.indexOf('?id=') > -1 && !defaultComponent.startsWith(config.loginPath)) {
    const uriArray = defaultComponent.split('?id');
    usedComponent = uriArray[0];
    defaultSearch = uriArray[1];
  }
  let curPath = current();
  if (isLogout(curPath)) {
    if (isLogined) return false;
    return config.loginPath;
  }
  const isPassport = isPassportComponent(curPath);
  const s = getWindowHash();
  let curUri = false;
  let hasFrom = false;

  if ((isRoot() || isPassport) && s && s !== '/') {
    let pos = s.indexOf('?from=');
    if (pos !== -1) {
      hasFrom = true;
      curPath = decodeURIComponent(s.substr(pos + 6));
      curUri = curPath;
      pos = curPath.indexOf('?');
      if (pos !== -1) curPath = curPath.substr(0, pos);
    }
  }
  
  if (isPassport) {
    if (!isLogined) return false;
    if (!hasFrom || isPassportComponent(curPath)) {
      if (!usedComponent) {
        // miss configuration
        return exception(500);
      }
      curPath = component(usedComponent);
      curUri = curPath;
    }
  }
  if (curPath === '/') {
    if (!usedComponent) {
      // miss configuration
      return exception(500);
    }
    curPath = component(usedComponent);
  }
  if (acls) {
    for (const p in acls) {
      if (defaultSearch && curPath === p && curPath !== config.loginPath) return `#${p}?=id${defaultSearch}`;
      if (curPath === p) return curUri || p;
    }
  }
  if (isLogined) {
    // no acl, return default component
    return exception(403);
  }
  let from = encodeURIComponent(s);
  from = `?from=${from}`;
  return `${location.origin}/#${config.loginPath}${from}`;
}

function getHeaderNav(acls, additionalRouter) {
  const headerNav = [];
  if (acls) {
    for (const p in acls) {
      const paths = p.split('/');
      const acl = acls[p];
      if (additionalRouter && acl.iframe) {
        additionalRouter.push({ ...acl, path: p, key: p });
      }
      if (paths.length === 2) {
        const item = { ...acl };
        if (!item.icon && !item.image) item.icon = 'laptop';
        item.path = p;
        headerNav.push(item);
      }
    }
  }
  return headerNav;
}

function hasSiderBar(menus) {
  if (config.hasSiderBar === false) return false;
  if (!menus || menus.length === 0 || isPassportComponent()) return false;
  return true;
}

function isComponentInTarget(path, arr) {
  for (let i = 0, cnt = arr.length; i < cnt; ++i) {
    if (arr[i].indexOf(path) === 0) return true;
  }
  return false;
}

function getRedirect(items, data) {
  for (let i = 0, cnt = items.length; i < cnt; ++i) {
    const item = items[i];
    if (item.children) {
      if (item.children[0] && item.children[0].path) {
        data.push({
          from: item.path,
          to: item.children[0].path,
        });
      }
      getRedirect(item.children, data);
    }
  }
}

function isIgnorePath(iPath, ignoreAcls) {
  if (!ignoreAcls) return false;
  if (ignoreAcls.items && ignoreAcls.items[iPath]) return true;
  if (ignoreAcls.modules) {
    for (const m of ignoreAcls.modules) {
      if (iPath.startsWith(m)) {
        return true;
      }
    }
  }
  return false;
}

function getMenuData(acls, enableHeaderNav, headerNav, defaultComponent, ignoreAcls, ignoreModules) {
  let usedComponent = defaultComponent;
  let id;
  if (defaultComponent && defaultComponent.indexOf('?id=') && !defaultComponent.startsWith(config.loginPath)) {
    const uriArray = defaultComponent.split('?id');
    usedComponent = uriArray[0];
    id = uriArray[1];
  }
  const ret = [[], [{ from: '/', to: config.loginPath }], config.loginPath];

  if (!acls) return ret;
  if (usedComponent && isPassportComponent(usedComponent)) usedComponent = false;

  // select one default component
  let hasAcls = false;
  const headerTags = {};

  if (!enableHeaderNav && headerNav) {
    for (const nav of headerNav) {
      if (!nav.default) headerTags[nav.path.split('/')[1]] = 1;
    }
  }
  for (const iPath in acls) {
    if (isIgnorePath(iPath, ignoreAcls)) continue;
    const acl = acls[iPath];
    hasAcls = true;
    if (!acl.page && !usedComponent) {
      usedComponent = iPath;
    }
    if (hasAcls && usedComponent) {
      break;
    }
  }
  if (!hasAcls) return ret;

  if (usedComponent) {
    ret[2] = defaultComponent;
    ret[1][0].to = usedComponent;
  }

  const curPath = current();

  if ((isPassportComponent() || curPath === '/') && !id) return ret;

  const dstRootComponent = rootComponent(curPath).substr(1);
  const tag = {};

  for (const iPath in acls) {
    if (isIgnorePath(iPath, ignoreAcls)) continue;
    const acl = acls[iPath];
    if (acl.page === 'false') {
      acl.page = false;
    } else if (acl.page === 'true') {
      acl.page = true;
    }
    if (acl.page) continue;

    const p = iPath.split('/');

    if (p.length <= 1) continue;
    if (ignoreModules) {
      if (p.length >= 3) {
        if (ignoreModules['/' + p[1] + '/' + p[2]]) continue;
      }
      const rootPath = '/' + p[1];
      if (ignoreModules[rootPath] || ignoreModules[iPath]) continue;
    }
    if (enableHeaderNav) {
      if (p[1] !== dstRootComponent) continue;
      if (p.length < 3 || p.length > 5) continue;
    } else {
      if (p.length < 2 || p.length > 4) {
        continue;
      }
      if (headerTags[dstRootComponent] && p[1] !== dstRootComponent) {
        continue;
      }
      if (headerTags[p[1]]) {
        if (p.length > 2 && headerTags[p[1]] === 1) {
          ret[1].push({
            from: component(p[1]),
            to: iPath,
          });
          headerTags[p[1]] = 2;
        }
      }
    }
    p.pop();

    const parent = component(...p);
    const newItem = { ...acl };

    newItem.path = iPath;
    if (tag[parent]) {
      if (!tag[parent].children) tag[parent].children = [];
      tag[parent].children.push(newItem);
    } else {
      ret[0].push(newItem);
    }
    tag[iPath] = newItem;
  }
  if (enableHeaderNav && ret[0].length > 0) {
    ret[1].push({ from: component(dstRootComponent), to: ret[0][0].path });
  }
  getRedirect(ret[0], ret[1]);

  return ret;
}

function toUrl(url) {
  window.location = url;
}

function toRoot() {
  const s = window.location.hash;

  if (s) {
    const pos = s.indexOf('?from=');
    if (pos !== -1) {
      toUrl(`./${s.substr(pos)}`);
      return;
    }
  }
  toUrl('./');
}

function isSameComponent(u) {
  const pos = u.lastIndexOf('?');

  if (pos === 0) return false;
  if (pos > 0) {
    const p = u.substr(0, pos);
    return p === current();
  }
  return u === current();
}

function currentComponent() {
  const p = current().split('/');

  return p[p.length - 1];
}

export default {
  blank: 'about:blank',
  queryChanged,
  param,
  getParamFromUrl,
  component,
  rootComponent,
  isRoot,
  current,
  currentComponent,
  uriToSelectedKeys,
  exception,
  isSameComponent,
  toUrl,
  toRoot,
  reload,
  formatUrlParams,
  ops,
  addProxyOps,
  defaultUri,
  getWindowSearch,
  isPassportComponent,
  isPortalComponent,
  isExceptionComponent,
  getHeaderNav,
  hasSiderBar,
  getMenuData,
  isComponentInTarget,
  getWindowHash,
  getAclsByPath(acls, pathname) {
    if (!pathname) pathname = current().split('/').slice(0, 2).join('/')
    return acls.filter(t => t.path.indexOf(pathname) === 0)
  },
  addSourceToParams(p) {
    if (p && !p.source) {
      p.source = config.dataSource || '';
    }
  },
}
